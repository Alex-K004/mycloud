# My Cloud – дипломный проект "Fullstack-разработчик на Python"

Облачное хранилище с возможностью загрузки, скачивания, переименования файлов, управления пользователями (администратор), специальными ссылками.

## Технологии

- **Бэкенд**: Django 4.2, Django REST Framework, PostgreSQL, Gunicorn
- **Фронтенд**: React 18, Redux Toolkit, React Router, Axios
- **Сервер**: Nginx, systemd (рекомендовано для reg.ru)

## Документация

- [Бэкенд (установка, API, деплой)](backend/README.md)
- [Фронтенд (запуск, сборка)](frontend/README.md)

## Быстрый старт (локально)

```bash
# Бэкенд
cd backend
python -m venv venv
source venv/bin/activate   # или venv\Scripts\activate на Windows
pip install -r requirements.txt
cp .env.example .env       # отредактируйте .env
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver

# Фронтенд (в другом терминале)
cd frontend
npm install
npm start
