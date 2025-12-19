import React, { useState, useRef } from 'react';
import { profileAPI } from '../services/api';
import { useEffect } from 'react';
const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  //for store profile data
  
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const [profile, setProfile] = useState(null);
const [formData, setFormData] = useState({
  name: "",
  email: "",
  dob: "",
  profile_picture: null
});

  const handleEdit = () => {
    setImagePreview(null); // Clear stale preview when entering edit mode
    setIsEditing(true);
  };
//-------------------------------------
const handleSave = async () => {
  try {
    console.log("Saving profile with data:", formData);
    
    const data = new FormData();
    data.append("full_name", formData.name);
    data.append("email", formData.email);
    data.append("date_of_birth", formData.dob);

    if (formData.profile_picture) {
      data.append("profile_picture", formData.profile_picture);
    }
    
    console.log("Sending FormData to API..." );
    
    const response = await profileAPI.updateProfile(data);
    console.log("Update response:", response);
    console.log("Response data:", response.data);

    // Handle different response structures
    let updatedProfile;
    if (response.data.data) {
      updatedProfile = response.data.data;
    } else if (response.data) {
      updatedProfile = response.data;
    } else {
      updatedProfile = formData; // Fallback to form data
    }

    console.log("Updated profile:", updatedProfile);

    // Update profile state with the new data
    setProfile(prevProfile => ({
      ...prevProfile,
      ...updatedProfile,
      full_name: updatedProfile.full_name || updatedProfile.name || formData.name,
      email: updatedProfile.email || formData.email,
      date_of_birth: updatedProfile.date_of_birth || updatedProfile.dob || formData.dob,
      // IMPORTANT: Preserve existing profile_picture if API didn't return a new one
      // Only use the response profile_picture if it exists, otherwise keep the previous one
      profile_picture: updatedProfile.profile_picture || prevProfile?.profile_picture
    }));

    // Also update formData for consistency
    setFormData({
      name: updatedProfile.full_name || updatedProfile.name || formData.name,
      email: updatedProfile.email || formData.email,
      dob: updatedProfile.date_of_birth || updatedProfile.dob || formData.dob,
      profile_picture: null // Clear the file from form after save
    });

    setIsEditing(false);
    // Keep imagePreview visible until the new image is confirmed
    // It will be cleared when user edits again or closes the profile
    
    // Show success message
    alert("Profile updated successfully!");
    
  } catch (error) {
    console.error("Profile update failed", error);
    console.error("Error response:", error.response?.data);
    
    let errorMessage = "Failed to update profile";
    if (error.response?.data) {
      // Handle validation errors
      if (typeof error.response.data === 'object') {
        const errors = Object.values(error.response.data).flat().join(', ');
        errorMessage = errors;
      } else {
        errorMessage = error.response.data;
      }
    }
    
    alert(errorMessage);
  }
};

//-------------------------------------
  const handleCancel = () => {
    setFormData({
      name: profile.full_name,
      email: profile.email,
      dob: profile.date_of_birth,
      profile_picture: null
    });
    setImagePreview(null);
    setIsEditing(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

 const handleImageUpload = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  // image validation
  if (!file.type.startsWith("image/")) {
    alert("Only image files allowed");
    return;
  }

  if (file.size > 2 * 1024 * 1024) {
    alert("Image must be under 2MB");
    return;
  }

  // ✅ STORE FILE FOR API
  setFormData((prev) => ({
    ...prev,
    profile_picture: file, // ⭐ VERY IMPORTANT
  }));

  // preview
  const reader = new FileReader();
  reader.onloadend = () => {
    setImagePreview(reader.result);
  };
  reader.readAsDataURL(file);
};


  const removeImage = () => {
    setImagePreview(null);
    // If there was a previously saved image, remove it
    if (profile.profileImage) {
      setProfile({
        ...profile,
        profileImage: null,
      });
    }
  };
const fatchprofile = async () => {
    try {
      const response = await profileAPI.getProfile();
        console.log("Fetched profile:", response.data.data.full_name);
        setProfile(response.data.data);
        setFormData({
          name: response.data.data.full_name,
          email: response.data.data.email,
          dob: response.data.data.date_of_birth,
        });
        console.log("profile data:", profile?.full_name);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
    };
  const openFileSelector = () => {
    fileInputRef.current?.click();
  };

  const handleShare = () => {
    const profileText = `Name: ${profile.name}\nEmail: ${profile.email}\nDOB: ${profile.dob}`;
    navigator.clipboard.writeText(profileText)
      .then(() => {
        alert('Profile copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
        alert('Failed to copy profile');
      });
  };
  
useEffect(() => {
    fatchprofile();
}, []);
  // Determine what to show as profile image
  const displayImage = imagePreview || `http://localhost:8000${profile?.profile_picture}`

  return (
    <div className="w-full max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-md">
      {/* Profile Header with Image */}
      <div className="flex items-center mb-6">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mr-4 overflow-hidden border-2 border-blue-100">
            {displayImage ? (
              <img 
                src={displayImage} 
                alt={"Profile"} 
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-3xl text-blue-600">👤</span>
            )}
            
            {/* Edit Image Button (only in edit mode) */}
            {isEditing && (
              <>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <div className="absolute bottom-0 right-2 flex space-x-1">
                  <button
                    type="button"
                    onClick={openFileSelector}
                    className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition"
                    title="Change image"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>
                  
                  {displayImage && (
                    <button
                      type="button"
                      onClick={removeImage}
                      className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition"
                      title="Remove image"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
          
          {/* Image upload indicator in edit mode */}
          
        </div>
        
        <div className="flex-1">
          {isEditing ? (
            <div className="space-y-3">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder="Enter name"
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder="Enter email"
              />
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{profile?.full_name}</h2>
              <p className="text-gray-600">{profile?.email}</p>
              
            </div>
          )}
        </div>
      </div>

      {/* DOB Section */}
      <div className="mb-6">
        {isEditing ? (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
            <input
              type="text"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              placeholder="e.g., 25 Nov 1990"
            />
          </div>
        ) : (
          <div className="flex justify-between items-center">
            <p className="text-gray-700">
              <span className="font-semibold">DOB -</span> {profile?.date_of_birth || "—"}
            </p>
            <button
              onClick={handleEdit}
              className="font-semibold text-blue-500 hover:text-blue-600 cursor-pointer"
            >
              Edit Profile
            </button>
          </div>
        )}
      </div>

      
      

      {/* Edit Mode Buttons */}
      {isEditing ? (
        <div className="flex space-x-3">
          <button
            onClick={handleSave}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium transition duration-300"
          >
            Save Changes
          </button>
          <button
            onClick={handleCancel}
            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-3 px-4 rounded-lg font-medium transition duration-300"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          onClick={handleShare}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition duration-300"
        >
          Share Profile
        </button>
      )}
    </div>
  );
};

export default Profile;