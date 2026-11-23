from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers

from .models import SchoolConfig, User


class SchoolConfigSerializer(serializers.ModelSerializer):
    logo = serializers.SerializerMethodField()

    class Meta:
        model = SchoolConfig
        fields = [
            "name",
            "short_name",
            "tagline",
            "logo",
            "logo_url",
            "address",
            "phone",
            "email",
            "office_hours",
            "primary_color",
            "secondary_color",
            "currency_code",
            "currency_symbol",
            "updated_at",
        ]

    def get_logo(self, obj):
        if obj.logo:
            request = self.context.get("request")
            if request:
                return request.build_absolute_uri(obj.logo.url)
            return obj.logo.url
        return obj.logo_url or None


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])

    class Meta:
        model = User
        fields = ["id", "username", "email", "first_name", "last_name", "password", "role"]

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "first_name", "last_name", "role", "is_active"]
        read_only_fields = ["id"]

class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "first_name", "last_name", "role", "is_active"]
        read_only_fields = ["id"]

    def validate(self, attrs):
        request = self.context["request"]
        # Stop an admin from locking themselves out
        if self.instance == request.user:
            if attrs.get("role", self.instance.role) != "admin":
                raise serializers.ValidationError("You cannot remove your own admin role.")
            if attrs.get("is_active") is False:
                raise serializers.ValidationError("You cannot deactivate your own account.")
        return attrs


class AdminSetPasswordSerializer(serializers.Serializer):
    new_password = serializers.CharField(write_only=True, validators=[validate_password])


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True, validators=[validate_password])

    def validate_old_password(self, value):
        if not self.context["request"].user.check_password(value):
            raise serializers.ValidationError("Old password is incorrect.")
        return value