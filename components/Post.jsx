import React, { useState,useEffect } from 'react';
import { postAPI,profileAPI } from '../services/api';
const PostDisplay = ({post, currentUser}) => {
  const [likes, setLikes] = useState(post?.likes_count || 25);
  const [dislikes, setDislikes] = useState(post?.dislikes_count || 10);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Debug: Log post structure to understand image data
  useEffect(() => {
    console.log('Post data received:', post);
    if (post?.images) {
      console.log('Images in post:', post.images);
    }
  }, [post]);

//   const getPostsdata = async () => {
//     try {
//       const response = await postAPI.getPosts();
//       console.log("Fetched posts:", response.data);
//       setPostData(response.data);
//     } catch (error) {
//       console.error("Error fetching posts:", error);
//     }
//   };


    const getPostsdata = async () => {
    try {
        const response = await postAPI.getPosts();
        console.log("Fetched posts:", response.data);
        setPostData(response.data);
    }
    catch (error) {
        console.error("Error fetching posts:", error);
    }
  };
  
  const getProfiledata = async () => {
    try {
      const response = await profileAPI.getProfile();
      console.log("Fetched profile:", response.data);
      setProfile(response.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

//   useEffect(() => {
//     console.log("🔥 useEffect triggered");
//     getPostsdata();
//     getProfiledata();
//   }, []);


  const handleLike = () => {
    if (liked) {
      setLikes(likes - 1);
      setLiked(false);
    } else {
      setLikes(likes + 1);
      setLiked(true);
      if (disliked) {
        setDislikes(dislikes - 1);
        setDisliked(false);
      }
    }
  };

  const handleDislike = () => {
    if (disliked) {
      setDislikes(dislikes - 1);
      setDisliked(false);
    } else {
      setDislikes(dislikes + 1);
      setDisliked(true);
      if (liked) {
        setLikes(likes - 1);
        setLiked(false);
      }
    }
  };
const profileImageUrl = currentUser?.profile_picture
  ? `http://localhost:8000${currentUser.profile_picture}`
  : null;
  return (
   
    <div className=" bg-white p-6 rounded-xl shadow-md">
      
      {/* User Profile Header - Top Left Corner */}
      <div className="flex items-start mb-6">
        {/* Profile Image */}
        <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center mr-4 border-2 border-white shadow-sm">
           {profileImageUrl ? (
  <img
    src={profileImageUrl}
    alt="Profile"
    className="w-full h-full rounded-full object-cover"
  />
) : (
  <div className="w-full h-full flex items-center justify-center text-3xl text-gray-400">
    👤
  </div>
)}

          
        </div>
        
        {/* User Info */}
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-gray-800 text-lg">{currentUser?.full_name || 'User'}</h3>
              <p className="text-gray-500 text-sm">{currentUser?.email || 'email@example.com'}</p>
            </div>
            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
              {post?.created_at
                ? new Date(post.created_at).toLocaleDateString("en-GB").replace(/\//g, "-")
                : "Just now"}
            </span>
          </div>
        </div>
      </div>
      
      {/* Post Content */}
      <div className="mb-6 pl-0 lg:pl-18">
        <p className="text-gray-800 text-lg leading-relaxed">
          {post?.description}
        </p>
      </div>
      
      {/* Post Images Gallery */}
      {post?.images && Array.isArray(post.images) && post.images.length > 0 ? (
        <div className="mb-6 rounded-lg overflow-hidden bg-gray-100">
          {/* Main Image Display */}
          <div className="relative w-full bg-black flex items-center justify-center" style={{ aspectRatio: '16 / 9' }}>
            {post.images[selectedImageIndex]?.image ? (
              <img 
                src={`http://localhost:8000${post.images[selectedImageIndex].image}`}
                alt={`Post image ${selectedImageIndex + 1}`}
                className="w-full h-full object-contain"
                onError={(e) => {
                  console.error('Image failed to load:', post.images[selectedImageIndex].image);
                  e.target.src = '';
                }}
              />
            ) : typeof post.images[selectedImageIndex] === 'string' ? (
              <img 
                src={`http://localhost:8000${post.images[selectedImageIndex]}`}
                alt={`Post image ${selectedImageIndex + 1}`}
                className="w-full h-full object-contain"
                onError={(e) => {
                  console.error('Image failed to load:', post.images[selectedImageIndex]);
                  e.target.src = '';
                }}
              />
            ) : (
              <div className="text-white text-center">
                <p>Image not available</p>
              </div>
            )}
            
            {/* Image Counter Badge */}
            {post.images.length > 1 && (
              <div className="absolute top-3 right-3 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm font-medium">
                {selectedImageIndex + 1} / {post.images.length}
              </div>
            )}
            
            {/* Navigation Arrows - Only show if multiple images */}
            {post.images.length > 1 && (
              <>
                <button
                  onClick={() => setSelectedImageIndex(prev => prev === 0 ? post.images.length - 1 : prev - 1)}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-800 rounded-full p-2 transition"
                  title="Previous image"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <button
                  onClick={() => setSelectedImageIndex(prev => prev === post.images.length - 1 ? 0 : prev + 1)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-800 rounded-full p-2 transition"
                  title="Next image"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
          </div>

          {/* Thumbnail Strip - Only show if multiple images */}
          {post.images.length > 1 && (
            <div className="flex gap-2 p-3 bg-gray-200 overflow-x-auto">
              {post.images.map((image, index) => {
                const imageSrc = image?.image || image;
                return (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded border-2 overflow-hidden transition ${
                      selectedImageIndex === index 
                        ? 'border-blue-500 ring-2 ring-blue-300' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <img 
                      src={`http://localhost:8000${imageSrc}`}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.error('Thumbnail failed to load:', imageSrc);
                      }}
                    />
                  </button>
                );
              })}
            </div>
          )}
        </div>
      ) : null}
     
      {/* Like/Dislike Buttons */}
      <div className="flex items-center justify-between border-t pt-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleLike}
            className={`flex items-center px-4 py-2 rounded-lg transition duration-300 ${
              liked 
                ? 'bg-green-100 text-green-700 border border-green-200' 
                : 'text-gray-600 hover:text-green-700 hover:bg-green-50'
            }`}
          >
            <span className="text-xl mr-2">👍</span>
            <span>Like likes</span>
          </button>
          
          <button
            onClick={handleDislike}
            className={`flex items-center px-4 py-2 rounded-lg transition duration-300 ${
              disliked 
                ? 'bg-red-100 text-red-700 border border-red-200' 
                : 'text-gray-600 hover:text-red-700 hover:bg-red-50'
            }`}
          >
            <span className="text-xl mr-2">👎</span>
            <span>Dislike dislike</span>
          </button>
        </div>
        
        {/* Optional: More actions button */}
        <button className="text-gray-500 hover:text-gray-700">
          <span className="text-xl">⋯</span>
        </button>
      </div>
    </div>
  );
};

export default PostDisplay;