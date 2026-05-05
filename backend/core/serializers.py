from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User, File
from .validators import validate_login, validate_password
from django.db import models

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])
    login = serializers.CharField(source='username', validators=[validate_login])
    
    class Meta:
        model = User
        fields = ('id', 'login', 'full_name', 'email', 'password')
    
    def validate_email(self, value):
        # базовая проверка email (можно усилить)
        if '@' not in value or '.' not in value.split('@')[-1]:
            raise serializers.ValidationError('Неверный формат email.')
        return value
    
    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            full_name=validated_data['full_name'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user

class UserListSerializer(serializers.ModelSerializer):
    file_count = serializers.IntegerField(source='files.count', read_only=True)
    total_size = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ('id', 'username', 'full_name', 'email', 'is_admin', 'file_count', 'total_size')
    
    def get_total_size(self, obj):
        return obj.files.aggregate(total=models.Sum('size'))['total'] or 0

class FileSerializer(serializers.ModelSerializer):
    class Meta:
        model = File
        fields = ('id', 'original_name', 'size', 'uploaded_at', 'last_downloaded_at', 'comment', 'share_link')
        read_only_fields = ('id', 'size', 'uploaded_at', 'last_downloaded_at', 'share_link')
        # ИСПРАВЛЕНО: original_name теперь можно обновлять через PATCH