// Home.jsx - State management here
import React, { useState,useEffect } from 'react';
import LoginForm from './LoginForm';
import SignUpForm from './SignupForm';
import CreatePost from './CreatePost';
import PostDisplay from './Post';
import Profile from './ProfilePage';
import { authAPI, postAPI, profileAPI,  clearUserData, getUserData } from '../services/api';
  
const Home = () => {
  // ✅ State define karo Home.jsx mein
  const [isLogin, setIsLogin] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Fixed variable name
  const [posts, setPosts] = useState([]);
  const [profile, setProfile] = useState(null);
  

  // Logout function
  

  // Optional: auto logout if refresh token expired
  
 useEffect(() => {
  const initAuth = async () => {
    const token = localStorage.getItem('access_token');
    const refresh = localStorage.getItem('refresh_token');

    if (!token) return; // no token → show login

    try {
      // Try fetching profile to validate token
      const profileRes = await profileAPI.getProfile();
      console.log('Profile fetched on init:', profileRes.data.data);
      setProfile(profileRes.data.data); // update state
      setIsAuthenticated(true);
      
      fetchPosts();
     
    } catch (err) {
      console.log('Access token expired, trying refresh...', err);
       
      if (refresh) {
        try {
          // Call backend refresh endpoint
          const refreshRes = await authAPI.refreshToken({ refresh });
          localStorage.setItem('access_token', refreshRes.data.access);
          
          // Retry fetching profile
          const profileRes2 = await profileAPI.getProfile();
          setProfile(profileRes2.data.data);
          setIsAuthenticated(true);
          fetchPosts();
        } catch (err2) {
          console.log('Refresh token expired', err2);
          handleLogout(); // clear storage and show login
        }
      } else {
        handleLogout(); // no refresh token → show login
      }
    }
  };

  initAuth();
}, []);


const fetchPosts = async () => {
  try {
    const response = await postAPI.getPosts();
    setPosts(response.data.data);
    console.log("Fetched posts:", response.data.data);
  } catch (error) {
    console.error('Error fetching posts:', error);
    setPosts([]);
  }
};

const handleLogin = async ({ email, password }) => {
  try {
    const res = await authAPI.login({ email, password });
    
    if (res.data.access) {
      localStorage.setItem('access_token', res.data.access);
      if (res.data.refresh) localStorage.setItem('refresh_token', res.data.refresh);
      fetchPosts();
      // Update authenticated state
      setIsAuthenticated(true);

      return { success: true };
    }

    return { success: false, error: 'Invalid response from server' };
  } catch (err) {
    return { 
      success: false, 
      error: err.response?.data?.detail || 'Login failed'
    };
  }
};




// const handleSignup = async (signupData) => {
//     try {
//       const response = await authAPI.register(signupData);

//       if (response.data.access) {
//         localStorage.setItem("access_token", response.data.access);
//         if (response.data.refresh) {
//           localStorage.setItem("refresh_token", response.data.refresh);
//         }

//         setIsAuthenticated(true);
//         return { success: true };
//       }
//     } catch (error) {
//       return {
//         success: false,
//         error: error.response?.data || "Signup failed",
//       };
//     }
//   };

const handleCreatePost = async (postData) => {
  try {
    const response = await postAPI.createPost(postData);
    const newPost = response.data;
    
    setPosts(prevPosts => [newPost, ...prevPosts]);
    return { success: true };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.error || 'Failed to create post' 
    };
  }
};

// const handleDeletePost = async (postId) => {
//   try {
//     await postAPI.deletePost(postId);
//     setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
//     return { success: true };
//   } catch (error) {
//     return { 
//       success: false, 
//       error: 'Failed to delete post' 
//     };
//   }
// };

const handleUpdateProfile = async (data) => {
  try {
    const response = await profileAPI.updateProfile(data);
    // Make sure response.data has all fields, or merge with existing state
    setProfile(prev => ({ ...prev, ...response.data }));
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to update profile' };
  }
};


  return(
    <div>
      {!isAuthenticated ? (
        <div className="container mx-auto p-4">
          
          <h1 className="text-2xl font-bold text-center mb-8">
            {isLogin ? 'Login to Your Account' : 'Create New Account'}
          </h1>
          
          {/* ✅ Pass toggle function to forms */}
          {isLogin ? 
            <LoginForm
  toggleToSignup={() => setIsLogin(false)}
  onLogin={handleLogin}
/> : 
            <SignUpForm 
              toggleToLogin={() => setIsLogin(true)} 
              // onSignup={handleSignup}
            />
          }
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between space-x-4 p-4 bg-white shadow-md">
                <span className="text-gray-700">
                  Welcome, {profile?.fullname || profile?.name || 'User'}!
                </span>
                <button
                  onClick={() => {
                    clearUserData();
                    setIsAuthenticated(false);
                    setProfile(null);
                    setPosts([]);
                    setIsLogin(true);
                  }}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200">                
                  Logout
              </button>
            </div> 
        <div className="min-h-screen md:p-6 flex items-center justify-center bg-gray-100">
          <div className="w-full max-w-6xl mx-auto">
            
            {/* Main Container - Flex Row for Desktop */}
            <div className="flex flex-col lg:flex-row items-stretch gap-6 justify-center">
              
              {/* Left Column - Profile Card */}
              <div className="lg:w-1/3 min-h-[600px]">
                <div className="bg-white rounded-2xl shadow-xl p-6 flex-1 flex flex-col sticky top-6">
                  <Profile 
                    profile={profile}
                    onUpdateProfile={handleUpdateProfile}
                  />
                </div>
              </div>
              
              {/* Right Column - Posts */}
              <div className="lg:w-2/3 min-h-[600px] flex flex-col">
                
                {/* Create Post - Fixed Height */}
                <div className="mb-6 flex-shrink-0">
                  <div className="bg-white rounded-2xl shadow-xl p-6 h-full">
                    <CreatePost onCreatePost={handleCreatePost} />
                  </div>
                </div>
                
                {/* Posts Feed - Scrollable */}
                <div className="space-y-6 flex-1 overflow-y-auto">
                  {posts && posts.length > 0 ? (
                    posts.map((post) => (
                      <div key={post.id || post._id} className="bg-white rounded-2xl shadow-xl p-6">
                        <PostDisplay 
                          post={post}
                          currentUser={profile}
                          // onDelete={handleDeletePost}
                        />
                      </div>
                    ))
                  ) : (
                    <div className="bg-white rounded-2xl shadow-xl p-6 text-center">
                      <p className="text-gray-500">No posts yet</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      )}
    </div>
  );
};

export default Home;

