import re
from django.core.exceptions import ValidationError

def validate_login(value):
    if not re.match(r'^[A-Za-z][A-Za-z0-9]{3,19}$', value):
        raise ValidationError('Логин: от 4 до 20 символов, латиница, первый символ буква.')
    return value

def validate_password(value):
    if (len(value) < 6 or 
        not re.search(r'[A-Z]', value) or 
        not re.search(r'[0-9]', value) or 
        not re.search(r'[!@#$%^&*(),.?":{}|<>]', value)):
        raise ValidationError('Пароль: минимум 6 символов, заглавная буква, цифра, спецсимвол.')
    return value