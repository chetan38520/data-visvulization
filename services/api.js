import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api', // Remove trailing slash here
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to include token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refresh_token');

      if (refreshToken) {
        try {
          const response = await axios.post(
            'http://127.0.0.1:8000/api/token/refresh/',
            { refresh: refreshToken }
          );

          // Store new access token
          localStorage.setItem('access_token', response.data.access);
          api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
          return api(originalRequest);
        } catch (refreshError) {
          // Refresh token expired → logout
          clearUserData();
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      } else {
        clearUserData();
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

// Helper functions
export const storeUserData = (userData) => {
  localStorage.setItem('user', JSON.stringify(userData));
};

export const getUserData = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const clearUserData = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');
};

// API Endpoints
export const authAPI = {
  login: (credentials) => api.post('/login/', credentials),
  register: (userData) => {
    // Check if FormData is being sent (for file uploads)
    if (userData instanceof FormData) {
      return api.post('/signup/', userData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    }
    return api.post('/signup/', userData);
  },
  logout: () => api.post('/logout/'),
  getToken: (credentials) => api.post('/token/', credentials),
  refreshToken: (refresh) => api.post('/token/refresh/', { refresh }),
};

export const postAPI = {
  getPosts: async () => {
    try {
      const response = await api.get('/post/');
      console.log('API Response structure:', {
        data: response.data,
        type: typeof response.data,
        isArray: Array.isArray(response.data),
      });
      return response;
    } catch (error) {
      console.error('API Error:', error.response?.data || error.message);
      throw error;
    }
  },
  createPost: async (postData) => {
    try {
      // Don't set Content-Type header - let FormData set it automatically
      const response = await api.post('/post/', postData);
      return response;
    } catch (error) {
      console.error('Create Post Error:', error.response?.data || error.message);
      throw error;
    }
  }
};


export const profileAPI = {
  getProfile: () => {
    const token = localStorage.getItem("access_token");

if (token) {
  const payloadBase64 = token.split('.')[1]; // Get the payload part
  const payload = JSON.parse(atob(payloadBase64));
  const id = payload.user_id; // ✅ this is your user id
  console.log("User ID from token:", id);
    console.log("Fetching profile for user ID:", id);
    if (!id) throw new Error('User ID not found in localStorage');
    return api.get(`/profile/${id}/`); // Added trailing slash
}
  
  },
  updateProfile: (profileData) =>
    api.put('/profile/', profileData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
};

export default api;
