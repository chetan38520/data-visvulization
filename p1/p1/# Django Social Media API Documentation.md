# Django Social Media API Documentation

## Base URL
```
http://localhost:8000
```

## Authentication
All protected endpoints require JWT token in the Authorization header:
```
Authorization: Bearer <access_token>
```

---

## 1. Authentication Endpoints

### Signup - Create New User
**POST** `/api/sigup/`

**Permission:** AllowAny

**Request Body:**
```json
{
  "email": "user@example.com",
  "full_name": "John Doe",
  "date_of_birth": "1990-01-15",
  "password": "SecurePass@123",
  "profile_picture": null
}
```

**Response:** 201 Created
```json
{
  "id": 1,
  "email": "user@example.com",
  "full_name": "John Doe",
  "date_of_birth": "1990-01-15",
  "profile_picture": null
}
```

**Error Response:** 400 Bad Request
```json
{
  "email": ["This field may not be blank."],
  "password": ["Password must be at least 8 characters long"]
}
```

**Password Requirements:**
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one special character (@$!%*?&#)

---

### Login - Get JWT Tokens
**POST** `/api/login/`

**Permission:** AllowAny

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass@123"
}
```

**Response:** 200 OK
```json
{
  "message": "Login successful",
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "full_name": "John Doe"
  }
}
```

**Error Response:** 400 Bad Request
```json
{
  "error": "Invalid email or password"
}
```

---

### Refresh Token
**POST** `/api/token/refresh/`

**Permission:** AllowAny

**Request Body:**
```json
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

**Response:** 200 OK
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

**Token Lifetime:**
- Access Token: 5 minutes
- Refresh Token: 1 day

---

## 2. User Profile Endpoints

### Get All User Profiles
**GET** `/api/profile/`

**Permission:** IsAuthenticated

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:** 200 OK
```json
{
  "message": "User profiles fetched successfully",
  "data": [
    {
      "id": 1,
      "email": "user1@example.com",
      "full_name": "John Doe",
      "date_of_birth": "1990-01-15",
      "profile_picture": "/media/profiles/images/john_pic.jpg"
    },
    {
      "id": 2,
      "email": "user2@example.com",
      "full_name": "Jane Smith",
      "date_of_birth": "1992-05-20",
      "profile_picture": "/media/profiles/images/jane_pic.jpg"
    }
  ]
}
```

---

### Update User Profile
**PATCH** `/api/profile/`

**Permission:** IsAuthenticated

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

**Request Body:** (all fields optional)
```
full_name: "Jane Doe"
date_of_birth: "1990-01-15"
profile_picture: <image_file>
```

**Response:** 200 OK
```json
{
  "id": 1,
  "email": "user@example.com",
  "full_name": "Jane Doe",
  "date_of_birth": "1990-01-15",
  "profile_picture": "/media/profiles/images/updated_pic.jpg"
}
```

**Allowed Image Formats:** jpg, jpeg, png

---

## 3. Post Endpoints

### Get All Posts
**GET** `/api/post/`

**Permission:** IsAuthenticated

**Headers:**
```
Authorization: Bearer <access_token>
```

**Query Parameters:** None

**Response:** 200 OK
```json
{
  "message": "Post fetched successfully",
  "data": [
    {
      "id": 1,
      "user": 1,
      "description": "This is my first post!",
      "images": [
        {
          "id": 1,
          "image": "/media/post/images/post1_img1.jpg"
        },
        {
          "id": 2,
          "image": "/media/post/images/post1_img2.png"
        }
      ],
      "created_at": "2025-12-16T10:30:00Z",
      "likes_count": 5,
      "dislikes_count": 1
    },
    {
      "id": 2,
      "user": 2,
      "description": "Another amazing post",
      "images": [],
      "created_at": "2025-12-15T14:20:00Z",
      "likes_count": 12,
      "dislikes_count": 0
    }
  ]
}
```

---

### Create Post
**POST** `/api/post/`

**Permission:** IsAuthenticated

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

**Request Body:**
```
description: "My amazing post content"
images: [file1.jpg, file2.png, file3.gif]
```

**Response:** 201 Created
```json
{
  "id": 3,
  "user": 1,
  "description": "My amazing post content",
  "images": [
    {
      "id": 10,
      "image": "/media/post/images/file1.jpg"
    },
    {
      "id": 11,
      "image": "/media/post/images/file2.png"
    }
  ],
  "created_at": "2025-12-16T15:45:00Z",
  "likes_count": 0,
  "dislikes_count": 0
}
```

**Allowed Image Formats:** jpg, jpeg, png, gif, webp

**Error Response:** 400 Bad Request
```json
{
  "description": ["This field may not be blank."]
}
```

---

### Like/Dislike Post
**PATCH** `/api/post/`

**Permission:** IsAuthenticated

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "post_id": 1,
  "action": "like"
}
```

**Actions:**
- `"like"` - Mark as like
- `"dislike"` - Mark as dislike
- `"remove"` - Remove reaction

**Response:** 200 OK
```json
{
  "likes_count": 6
}
```

**Error Response:** 400 Bad Request
```json
{
  "error": "post_id and valid action required"
}
```

---

### Update Post
**PATCH** `/api/post/edit/`

**Permission:** IsAuthenticated

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "description": "Updated post content"
}
```

**Response:** 200 OK
```json
{
  "id": 1,
  "user": 1,
  "description": "Updated post content",
  "images": [],
  "created_at": "2025-12-16T10:30:00Z",
  "likes_count": 5,
  "dislikes_count": 1
}
```

---

### Delete Post
**DELETE** `/api/post/delete/<post_id>/`

**Permission:** IsAuthenticated

**Headers:**
```
Authorization: Bearer <access_token>
```

**URL Parameters:**
```
post_id: integer (required) - ID of the post to delete
```

**Example:** `/api/post/delete/1/`

**Response:** 200 OK
```json
{
  "message": "Post deleted successfully"
}
```

**Error Response:** 404 Not Found
```json
{
  "detail": "Not found."
}
```

---

## Error Handling

### Common HTTP Status Codes

| Status | Meaning |
|--------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid input data |
| 401 | Unauthorized - Missing or invalid token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 500 | Server Error - Internal server error |

### Typical Error Response
```json
{
  "error": "Error message description",
  "field_name": ["Field-specific error message"]
}
```

---

## CORS Configuration

**Allowed Origins:**
- `http://localhost:3000`

**Credentials:** Allowed

---

## Frontend Integration Example (JavaScript/React)

### Setup Axios Instance
```javascript
const api = axios.create({
  baseURL: 'http://localhost:8000'
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response.status === 401) {
      const refresh = localStorage.getItem('refresh_token');
      const response = await api.post('/api/token/refresh/', { refresh });
      localStorage.setItem('access_token', response.data.access);
      return api(error.config);
    }
    return Promise.reject(error);
  }
);
```

### Login Example
```javascript
const login = async (email, password) => {
  const response = await api.post('/api/login/', { email, password });
  localStorage.setItem('access_token', response.data.access);
  localStorage.setItem('refresh_token', response.data.refresh);
  return response.data.user;
};
```

### Get Posts Example
```javascript
const getPosts = async () => {
  const response = await api.get('/api/post/');
  return response.data.data;
};
```

### Create Post Example
```javascript
const createPost = async (description, images) => {
  const formData = new FormData();
  formData.append('description', description);
  images.forEach((img) => formData.append('images', img));
  
  const response = await api.post('/api/post/', formData);
  return response.data;
};
```

---

## Important Notes

⚠️ **URL Typo:** Signup endpoint is `/api/sigup/` (missing 'n')

⚠️ **Method Conflict:** Both like/dislike and update use PATCH on `/api/post/` - Recommend fixing URLs

⚠️ **Missing Implementation:** Some view methods are incomplete (need to add response logic)

⚠️ **Image Storage:** Media files are stored in `/media/` directory

---

## Support

For issues or questions about the API, contact the development team.