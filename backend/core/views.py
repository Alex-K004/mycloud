import os
import logging
from django.db import transaction
from django.http import FileResponse, Http404
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import viewsets, status, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import login,logout
from django.conf import settings
from .models import User, File
from .serializers import (UserRegistrationSerializer, UserListSerializer,
                          FileSerializer)
from .permissions import IsAdminOrOwner, IsAdminOrSelf
from .utils import create_user_storage, delete_user_storage
from rest_framework import serializers

logger = logging.getLogger(__name__)

# Регистрация
class RegisterView(generics.CreateAPIView):
    serializer_class = UserRegistrationSerializer
    permission_classes = [AllowAny]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        create_user_storage(user)
        logger.info(f"New user registered: {user.username}")
        return Response({"message": "User created"}, status=status.HTTP_201_CREATED)

# Логин (через стандартную Django-сессию)
class LoginView(generics.GenericAPIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        from django.contrib.auth import authenticate
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            logger.info(f"User logged in: {username}")
            return Response({"message": "Logged in", "is_admin": user.is_admin})
        return Response({"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)

# Логаут
class LogoutView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        logout(request)
        return Response({"message": "Logged out"})

# ViewSet для пользователей (админ)
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserListSerializer
    permission_classes = [IsAuthenticated, IsAdminOrSelf]
    
    def get_queryset(self):
        # Админ видит всех, обычный пользователь только себя
        if self.request.user.is_admin:
            return User.objects.all()
        return User.objects.filter(id=self.request.user.id)
    
    def destroy(self, request, *args, **kwargs):
        user = self.get_object()
        # Удаляем файлы с диска
        for f in user.files.all():
            os.remove(f.file_path)  # полный путь
        delete_user_storage(user)
        user.delete()
        logger.info(f"Admin {request.user.username} deleted user {user.username}")
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    @action(detail=True, methods=['patch'])
    def toggle_admin(self, request, pk=None):
        if not request.user.is_admin:
            return Response({"error": "Forbidden"}, status=status.HTTP_403_FORBIDDEN)
        user = self.get_object()
        user.is_admin = not user.is_admin
        user.save()
        return Response({"is_admin": user.is_admin})

# ViewSet для файлов
class FileViewSet(viewsets.ModelViewSet):
    queryset = File.objects.none()
    serializer_class = FileSerializer
    permission_classes = [IsAuthenticated, IsAdminOrOwner]
    
    def get_queryset(self):
        user = self.request.user
        # Параметр ?user_id= для администратора
        if user.is_admin and self.request.query_params.get('user_id'):
            target_user = get_object_or_404(User, id=self.request.query_params['user_id'])
            return File.objects.filter(owner=target_user)
        return File.objects.filter(owner=user)
    
    def perform_create(self, serializer):
        # Загрузка файла
        uploaded_file = self.request.FILES.get('file')
        if not uploaded_file:
            raise serializers.ValidationError("No file provided")
        owner = self.request.user
        # Если админ и передан user_id, загружаем для другого пользователя
        if self.request.user.is_admin and self.request.data.get('user_id'):
            owner = get_object_or_404(User, id=self.request.data['user_id'])
        
        # Генерируем уникальное имя файла на диске
        import uuid
        ext = os.path.splitext(uploaded_file.name)[1]
        unique_name = f"{uuid.uuid4().hex}{ext}"
        relative_dir = os.path.join(owner.storage_path)
        absolute_dir = os.path.join(settings.MEDIA_ROOT, relative_dir)
        os.makedirs(absolute_dir, exist_ok=True)
        dest_path = os.path.join(absolute_dir, unique_name)
        
        with open(dest_path, 'wb+') as f:
            for chunk in uploaded_file.chunks():
                f.write(chunk)
        
        relative_file_path = os.path.join(relative_dir, unique_name)
        instance = serializer.save(
            owner=owner,
            original_name=uploaded_file.name,
            size=uploaded_file.size,
            file_path=relative_file_path
        )
        logger.info(f"File uploaded: {instance.original_name} by {owner.username}")
    
    @action(detail=True, methods=['put'])
    def rename(self, request, pk=None):
        file = self.get_object()
        new_name = request.data.get('new_name')
        if not new_name:
            return Response({"error": "new_name required"}, status=status.HTTP_400_BAD_REQUEST)
        file.original_name = new_name
        file.save()
        return Response(FileSerializer(file).data)
    
    @action(detail=True, methods=['patch'])
    def update_comment(self, request, pk=None):
        file = self.get_object()
        comment = request.data.get('comment', '')
        file.comment = comment
        file.save()
        return Response(FileSerializer(file).data)
    
    @action(detail=True, methods=['get'])
    def download(self, request, pk=None):
        file = self.get_object()
        full_path = os.path.join(settings.MEDIA_ROOT, file.file_path)
        if not os.path.exists(full_path):
            raise Http404()
        file.last_downloaded_at = timezone.now()
        file.save(update_fields=['last_downloaded_at'])
        response = FileResponse(open(full_path, 'rb'), content_type='application/octet-stream')
        response['Content-Disposition'] = f'attachment; filename="{file.original_name}"'
        logger.info(f"File downloaded: {file.original_name} by {request.user.username}")
        return response
    
    @action(detail=False, methods=['get'], url_path='share/(?P<link>[^/.]+)')
    def download_by_share_link(self, request, link=None):
        file = get_object_or_404(File, share_link=link)
        full_path = os.path.join(settings.MEDIA_ROOT, file.file_path)
        if not os.path.exists(full_path):
            raise Http404()
        file.last_downloaded_at = timezone.now()
        file.save(update_fields=['last_downloaded_at'])
        response = FileResponse(open(full_path, 'rb'), content_type='application/octet-stream')
        response['Content-Disposition'] = f'attachment; filename="{file.original_name}"'
        logger.info(f"File downloaded via share link: {file.original_name}")
        return response

    @action(detail=True, methods=['delete'])
    def delete_file(self, request, pk=None):
        file = self.get_object()
        full_path = os.path.join(settings.MEDIA_ROOT, file.file_path)
        if os.path.exists(full_path):
            os.remove(full_path)
        file.delete()
        logger.info(f"File deleted: {file.original_name}")
        return Response(status=status.HTTP_204_NO_CONTENT)