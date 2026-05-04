from rest_framework import permissions

class IsAdminOrOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        # obj - это экземпляр File
        return request.user.is_admin or obj.owner == request.user

class IsAdminOrSelf(permissions.BasePermission):
    def has_permission(self, request, view):
        # для списка пользователей и удаления
        if view.action == 'destroy':
            return request.user.is_admin
        return True
    
    def has_object_permission(self, request, view, obj):
        # obj - пользователь
        return request.user.is_admin or obj == request.user