from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import SchoolConfig, User


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        ("Role", {"fields": ("role",)}),
    )
    list_display = ("username", "email", "first_name", "last_name", "role", "is_staff")
    list_filter = ("role", "is_staff", "is_active")


@admin.register(SchoolConfig)
class SchoolConfigAdmin(admin.ModelAdmin):
    list_display = ("name", "short_name", "phone", "email", "updated_at")

    def has_add_permission(self, request):
        return not SchoolConfig.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False
