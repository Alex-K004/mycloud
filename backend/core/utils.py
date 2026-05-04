import os
import shutil
from django.conf import settings
from .models import User

def create_user_storage(user: User):
    path = user.get_storage_absolute_path()
    if not os.path.exists(path):
        os.makedirs(path, exist_ok=True)

def delete_user_storage(user: User):
    path = user.get_storage_absolute_path()
    if os.path.exists(path):
        shutil.rmtree(path)