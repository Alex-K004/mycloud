from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import TemplateView, RedirectView

urlpatterns = [
    # Корневой URL: в режиме разработки редирект на Browsable API,
    # в продакшене будет отдаваться React-сборка (см. ниже)
    path('', RedirectView.as_view(url='/api/') if settings.DEBUG else TemplateView.as_view(template_name='index.html')),
    
    # Стандартная админка Django
    path('admin/', admin.site.urls),
    
    # Все API-эндпоинты (без csrf_exempt, защита включена)
    path('api/', include('core.urls')),
]

# Для продакшена: отдаём React-приложение по любому необработанному маршруту
if not settings.DEBUG:
    urlpatterns += [re_path(r'^.*$', TemplateView.as_view(template_name='index.html'))]

# Для разработки: обслуживание медиа-файлов
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)