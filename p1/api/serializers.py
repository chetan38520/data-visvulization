from rest_framework import serializers
from django.contrib.auth  import authenticate
from .models import UserProfile, Post, PostImage, Like
import re
# class UserRegistrationSerializer(serializers.ModelSerializer):
#     password = serializers.CharField(write_only = True, min_length=6)

#     class Meta:
#         model = UserProfile
#         fields = ['email', 'full_name', 'date_of_birth','password']
    
#     def cerate(self, validate_data):
#         password = validate_data.pop('password')
#         user = UserProfile.objects.create(**validate_data)
#         user.set_password(password)
#         user.save()
#         return user
    
# class UserProfileSerializer(serializers.ModelSerializer):
#     password = serializers.CharField(write_only=True)
#     class Meta:
#         model = UserProfile
#         fields = ['id', 'email', 'full_name', 'date_of_birth', 'profile_picture']
    
#     def validate_password(self, value):
#         # minimun length
#         if len(value) < 8:
#             raise serializers.ValidationError("Password must be at least 8 characters long")
        
#         # At least one uppercase latter
#         if not re.search(r'[A-Z]',value):
#             raise serializers.ValidationError("Password must contain at least one capital letter")

#         # At least one lowercase latter
#         if not re.search(r'[a-z]',value):
#             raise serializers.ValidationError("Password must contain at least one lower letter")

#         if not re.search(r'[@$!%*?&#]',value):
#             raise serializers.ValidationError("Password must contain at least one special letter")


#         return value
#     def create(self, validated_data):
#          password = validated_data.pop('password')
#          user = UserProfile.objects.create_user(
#             password=password,
#             **validated_data
#         )
#          return user




class UserProfileSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = UserProfile
        fields = ['id','email', 'full_name', 'date_of_birth','profile_picture', 'password']

    def validate_password(self, value):
        if len(value) < 8:
            raise serializers.ValidationError(
                "Password must be at least 8 characters long"
            )

        if not re.search(r'[A-Z]', value):
            raise serializers.ValidationError(
                "Password must contain at least one capital letter"
            )

        if not re.search(r'[a-z]', value):
            raise serializers.ValidationError(
                "Password must contain at least one lowercase letter"
            )

        if not re.search(r'[@$!%*?&#]', value):
            raise serializers.ValidationError(
                "Password must contain at least one special character"
            )

        return value

    def create(self, validated_data):
        password = validated_data.pop('password')

        user = UserProfile.objects.create_user(
            password=password,
            **validated_data
        )

        return user




class LoginSerializer(serializers.Serializer):   
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')

        user = authenticate(email=email, password=password)

        if not user:
            raise serializers.ValidationError("Invalid email or password")

        if not user.is_active:
            raise serializers.ValidationError("User is inactive")

        data['user'] = user
        return data
    
class PostImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostImage
        fields = ['id', 'image']

from rest_framework import serializers
from .models import Post, PostImage


class PostSerializer(serializers.ModelSerializer):
    likes_count = serializers.SerializerMethodField()
    dislikes_count = serializers.SerializerMethodField()
    images = PostImageSerializer(many=True, read_only=True) 
    user = UserProfileSerializer(read_only=True) 
    class Meta:
        model = Post
        fields = [
            'id',
            'user',
            'description',
            'images',
            'created_at',
            'likes_count',
            'dislikes_count'
        ]
        read_only_fields = ['user']

    def create(self, validated_data):
        request = self.context.get('request')
        user = request.user

        post = Post.objects.create(user=user, **validated_data)

        images = request.FILES.getlist('images')
        for img in images:
            PostImage.objects.create(post=post, image=img)

        return post
    
    
    def get_likes_count(self, obj):
        return obj.likes_count()   # model method

    def get_dislikes_count(self, obj):
        return obj.dislikes_count()

            
        
class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Like
        fields = ['id', 'post', 'user', 'created_at']
        read_only_fields = ['user']
    def create(self, validated_data):   
        user = self.context['request'].user
        validated_data['user'] = user
        return super.create(validated_data)
    



