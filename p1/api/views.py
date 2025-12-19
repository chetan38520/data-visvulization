from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView  
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from .models import UserProfile, Post, PostImage, Like
from .serializers import UserProfileSerializer, PostImageSerializer, PostSerializer, LikeSerializer, LoginSerializer
    
class SignupAPIView(APIView):
    def post(self, request):
        serializer = UserProfileSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "User created successfully"}, 
                status=status.HTTP_201_CREATED
            )
        else:
            # ✅ Return the validation errors
            return Response(
                serializer.errors, 
                status=status.HTTP_400_BAD_REQUEST
            )
class UserProfileView(APIView):  # user profile view
    authentication_classes = [JWTAuthentication]   # jwt authentication
    permission_classes = [IsAuthenticated]     #  if user is login then user perform crud operations

#------------------get all the user profile if the user is authenticated-----------------------------------    
    def get(self, request, pk):  
        # Get all user profiles
        users = UserProfile.objects.get(pk=pk)
        
        # Serialize the queryset (many=True because it's multiple objects)
        serializer = UserProfileSerializer(users)
        
        # Return serialized data in the response
        return Response({
            "message": "User profiles fetched successfully",
            "data": serializer.data
        }, status=status.HTTP_200_OK)
    


    
    
#-----------------user can update our profile----------------------------------------------------------------    
    def put(self, request):
        user = request.user  #  provide user profile 
        serializer = UserProfileSerializer(
            user, data=request.data, partial=True  # in this serializer user is a old data and request.data is a updated data that comes from client side
        )

        if serializer.is_valid(): #  it check the data is valid or not
            serializer.save()
            return Response(
                {"message": "Profile updated successfully"},
                status=status.HTTP_200_OK
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

 #----------------- user can login and get jwt token----------------------------------------------------------   
class LoginAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.validated_data['user']

        # JWT Token generate
        refresh = RefreshToken.for_user(user)

        return Response({
            "message": "Login successful",
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": {
                "id": user.id,
                "email": user.email,
                "full_name": user.full_name
            }
        }, status=status.HTTP_200_OK)


class PostView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    # ---------- GET POSTS ----------
    def get(self, request):
        posts = Post.objects.all().order_by('-created_at')
        serializer = PostSerializer(posts, many=True)

        return Response({
            "message": "Post fetched successfully",
            "data": serializer.data
        }, status=status.HTTP_200_OK)

    # ---------- CREATE POST ----------
    def post(self, request):
        serializer = PostSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    

def patch(self, request):
    if not request.user.is_authenticated:
        return Response(
            {"error": "Authentication required"},
            status=status.HTTP_401_UNAUTHORIZED
        )

    user = request.user
    post_id = request.data.get("post_id")
    action = request.data.get("action")

    if not post_id or action not in ["like", "dislike", "remove"]:
        return Response(
            {"error": "post_id and valid action required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    post = get_object_or_404(Post, id=post_id)

    reaction, created = Like.objects.get_or_create(
        user=user,
        post=post,
        defaults={"is_like": action == "like"}
    )

    if action == "remove":
        reaction.delete()
    else:
        reaction.is_like = (action == "like")
        reaction.save()

    return Response({
        "likes_count": post.likes.filter(is_like=True).count()
    })



class PostUpdateView(APIView):
    def patch(self, request):
        user = request.user  #  provide user post
        serializer = PostSerializer(
            user, data=request.data, partial=True  # in this serializer user is a old data and request.data is a updated data that comes from client side
        )

        if serializer.is_valid(): #  it check the data is valid or not
            serializer.save()
            return Response(
                {"message": "Profile updated successfully"},
                status=status.HTTP_200_OK
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class DeletePostAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, post_id):
        try:
            post = Post.objects.get(id=post_id)
        except Post.DoesNotExist:
            return Response({"error": "Post not found"}, status=status.HTTP_404_NOT_FOUND)

        if post.author != request.user:
            # User tries to delete someone else's post
            return Response({"error": "You can only delete your own posts"}, status=status.HTTP_403_FORBIDDEN)

        post.delete()
        return Response({"message": "Post deleted successfully"}, status=status.HTTP_200_OK)

