import os
import uuid
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone

class User(AbstractUser):
    # username используется как логин (латиница, цифры, первый символ буква)
    full_name = models.CharField(max_length=150, verbose_name="Полное имя")
    email = models.EmailField(unique=True)
    is_admin = models.BooleanField(default=False, verbose_name="Администратор")
    
    # Путь к папке пользователя (относительно MEDIA_ROOT)
    storage_path = models.CharField(max_length=255, unique=True, blank=True)
    
    def save(self, *args, **kwargs):
        if not self.storage_path:
            self.storage_path = f"user_{self.id if self.id else uuid.uuid4().hex}"
        super().save(*args, **kwargs)
    
    def get_storage_absolute_path(self):
        from django.conf import settings
        return os.path.join(settings.MEDIA_ROOT, self.storage_path)

class File(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='files')
    original_name = models.CharField(max_length=255)
    size = models.BigIntegerField()
    uploaded_at = models.DateTimeField(auto_now_add=True)
    last_downloaded_at = models.DateTimeField(null=True, blank=True)
    comment = models.TextField(blank=True, default='')
    file_path = models.CharField(max_length=500)  # относительный путь внутри MEDIA_ROOT
    share_link = models.UUIDField(default=uuid.uuid4, unique=True, db_index=True)
    
    def __str__(self):
        return self.original_name