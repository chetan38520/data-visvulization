import React, { useState, useRef } from 'react';
import {postAPI} from '../services/api';
const CreatePost = ({onCreatePost}) => {
  const [postText, setPostText] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    if (!files.length) return;
    
    // Filter only image files
    const imageFiles = files.filter(file => file.type.match('image.*'));
    
    if (imageFiles.length === 0) {
      alert('Please select only image files (JPEG, PNG, GIF, etc.)');
      return;
    }
    
    // Check total size (max 20MB for all images)
    const totalSize = imageFiles.reduce((acc, file) => acc + file.size, 0);
    if (totalSize > 20 * 1024 * 1024) {
      alert('Total image size should be less than 20MB');
      return;
    }
    
    // Check max 5 images
    if (selectedImages.length + imageFiles.length > 5) {
      alert(`You can upload maximum 5 images. You already have ${selectedImages.length} images selected.`);
      return;
    }
    
    // Create preview URLs for new images
    const newImages = imageFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      id: Date.now() + Math.random() // Generate unique ID
    }));
    
    setSelectedImages(prev => [...prev, ...newImages]);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (id) => {
    setSelectedImages(prev => prev.filter(img => img.id !== id));
  };

  const simulateUpload = () => {
    return new Promise(resolve => {
      setTimeout(() => {
        const uploadedUrls = selectedImages.map(img => ({
          url: URL.createObjectURL(img.file),
          name: img.file.name
        }));
        resolve({ success: true, images: uploadedUrls });
      }, 2000);
    });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');

  if (!postText.trim() && selectedImages.length === 0) {
    setError("Please write something or select images");
    return;
  }

  setIsUploading(true);

  try {
    const formData = new FormData();
    formData.append("description", postText || "");

    // Only append images if there are any
    if (selectedImages.length > 0) {
      selectedImages.forEach((img, index) => {
        formData.append(`images`, img.file);
      });
    }

    // Debug: Log FormData contents
    console.log("FormData contents:");
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    const response = await postAPI.createPost(formData);
    console.log("Post created:", response.data);

    // Call callback if provided
    if (onCreatePost) {
      onCreatePost(response.data);
    }

    // Reset form
    setPostText("");
    setSelectedImages([]);
    alert("Post created successfully!");
  } catch (error) {
    console.error("Error creating post:", error);
    console.error("Error response data:", error.response?.data);
    const errorMsg = error.response?.data?.error || error.response?.data?.detail || error.response?.data?.message || "Failed to create post";
    setError(errorMsg);
    alert("Failed to create post: " + errorMsg);
  } finally {
    setIsUploading(false);
  }
};





  const openFileSelector = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-md">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Add Post</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
            {error}
          </div>
        )}
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Post</label>
          <textarea
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
            placeholder="Write your post here..."
            rows="3"
          />
        </div>
        
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          multiple
          className="hidden"
        />
        
        {/* Image Preview Grid - Smaller */}
        {selectedImages.length > 0 && (
          <div className="border border-gray-200 rounded-lg p-3">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-sm font-medium text-gray-700">
                Images ({selectedImages.length}/5)
              </h4>
              <button
                type="button"
                onClick={() => setSelectedImages([])}
                className="text-xs text-red-500 hover:text-red-700"
              >
                Clear All
              </button>
            </div>
            
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
              {selectedImages.map((image, index) => (
                <div key={image.id} className="relative">
                  <div className="aspect-square overflow-hidden rounded border border-gray-300">
                    <img 
                      src={image.preview} 
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeImage(image.id)}
                    className="absolute -top-1.5 -right-1.5 bg-blue-500 text-white rounded-full w-4 h-4 flex items-center justify-center hover:bg-red-600 transition text-[10px]"
                  >
                    ×
                  </button>
                </div>
              ))}
              
              {/* Add more button - smaller */}
              {selectedImages.length < 5 && (
                <button
                  type="button"
                  onClick={openFileSelector}
                  className="aspect-square border border-dashed border-gray-300 rounded flex items-center justify-center hover:border-blue-400 hover:bg-blue-50 transition text-gray-400"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
              )}
            </div>
            
            {/* Total size info - smaller */}
            <div className="mt-2 text-[10px] text-gray-500 text-center">
              Total: {(selectedImages.reduce((acc, img) => acc + img.file.size, 0) / 1024 / 1024).toFixed(2)} MB
            </div>
          </div>
        )}
        
        {/* Upload Button - Show when no images selected */}
        {selectedImages.length === 0 && (
          <div
            onClick={openFileSelector}
            className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition duration-300 cursor-pointer"
          >
            <svg 
              className="w-6 h-6" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="text-sm">Add Images</span>
          </div>
        )}
        
        {/* Submit Button */}
        <button
          type="submit"
          disabled={isUploading}
          className={`w-full text-white py-3 px-4 rounded-lg font-medium transition duration-300 ${
            isUploading
              ? 'bg-green-400 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {isUploading ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              {selectedImages.length > 0 ? 'Uploading...' : 'Posting...'}
            </div>
          ) : (
            `Post ${selectedImages.length > 0 ? `(${selectedImages.length} images)` : ''}`
          )}
        </button>
      </form>
    </div>
  );
};

export default CreatePost;