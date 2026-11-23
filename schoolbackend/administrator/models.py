from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    class Role(models.TextChoices):
        ADMIN = "admin", "Administrator"
        TEACHER = "teacher", "Teacher"
        STUDENT = "student", "Student"

    email = models.EmailField(unique=True)
    role = models.CharField(max_length=20, choices=Role.choices, default=Role.STUDENT)

    def __str__(self):
        return f"{self.username} ({self.role})"


class SchoolConfig(models.Model):
    name = models.CharField(max_length=200, default="School Management Portal")
    short_name = models.CharField(max_length=50, blank=True, default="")
    tagline = models.CharField(max_length=255, blank=True, default="Excellence in Education")
    logo = models.ImageField(upload_to="school/", null=True, blank=True)
    logo_url = models.URLField(max_length=500, blank=True, default="")
    address = models.TextField(blank=True, default="")
    phone = models.CharField(max_length=50, blank=True, default="")
    email = models.EmailField(blank=True, default="")
    office_hours = models.CharField(max_length=100, blank=True, default="Mon–Fri: 8:00 AM – 4:00 PM")
    primary_color = models.CharField(max_length=30, blank=True, default="#1e3a8a")
    secondary_color = models.CharField(max_length=30, blank=True, default="#fbbf24")
    currency_code = models.CharField(max_length=10, default="NGN")
    currency_symbol = models.CharField(max_length=10, default="₦")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)

    @classmethod
    def get_solo(cls):
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj

    def __str__(self):
        return self.name