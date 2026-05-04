from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import TemplateView

urlpatterns = [
    path('api/', csrf_exempt(include('core.urls'))),   # <-- вся /api/ без CSRF
    path('admin/', admin.site.urls),
]

if not settings.DEBUG:
    # Для продакшена – отдаём React-приложение
    urlpatterns += [re_path(r'^.*$', TemplateView.as_view(template_name='index.html'))]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)