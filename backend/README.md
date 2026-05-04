# Бэкенд My Cloud

## Установка
1. Создать виртуальное окружение: `python -m venv venv`
2. Активировать: `venv\Scripts\activate` (Windows) или `source venv/bin/activate` (Linux)
3. Установить зависимости: `pip install -r requirements.txt`
4. Скопировать `.env.example` в `.env` и отредактировать
5. Выполнить миграции: `python manage.py migrate`
6. Создать суперпользователя: `python manage.py createsuperuser`
7. Запустить сервер: `python manage.py runserver`

## API эндпоинты
- `/api/register/` – регистрация
- `/api/login/` – вход (сессия)
- `/api/logout/` – выход
- `/api/users/` – список пользователей (админ)
- `/api/files/` – работа с файлами
- `/api/files/share/<uuid>/` – скачивание по ссылке