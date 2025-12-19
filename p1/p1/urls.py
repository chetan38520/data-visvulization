"""
URL configuration for p1 project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from api import views
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/signup/', views.SignupAPIView.as_view(), name='userProfile'),
    path('api/profile/', views.UserProfileView.as_view(), name='userProfile'),
    path('api/profile/<int:pk>/', views.UserProfileView.as_view(), name='userProfile'),
    path('api/login/', views.LoginAPIView.as_view(), name='login'),
    path('api/post/', views.PostView.as_view(), name='post'),
    path('api/post/edit/', views.PostUpdateView.as_view(), name='post'),
    path('api/post/delete/', views.DeletePostAPIView.as_view(), name='post'),
]
# serve media files
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)