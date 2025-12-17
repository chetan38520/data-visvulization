from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import UserProfile, Post, PostImage, Like


# -----------------------------
# Custom Admin for User Profile
# -----------------------------
class CustomUserAdmin(UserAdmin):
    model = UserProfile

    list_display = ('email', 'full_name', 'date_of_birth', 'is_active', 'is_staff', 'created_at')
    list_filter = ('is_active', 'is_staff')
    search_fields = ('email', 'full_name')
    ordering = ('email',)

    fieldsets = (
        ('User Info', {
            'fields': ('email', 'full_name', 'date_of_birth', 'profile_picture')
        }),
        ('Permissions', {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')
        }),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'full_name', 'date_of_birth', 'password1', 'password2', 'is_active', 'is_staff'),
        }),
    )


admin.site.register(UserProfile, CustomUserAdmin)


# -----------------------------
# Inline images for Post
# -----------------------------
class PostImageInline(admin.TabularInline):
    model = PostImage
    extra = 1


# -----------------------------
# Post Admin
# -----------------------------
class PostAdmin(admin.ModelAdmin):
    list_display = ('user', 'description', 'created_at')
    inlines = [PostImageInline]


admin.site.register(Post, PostAdmin)
admin.site.register(PostImage)
admin.site.register(Like)
