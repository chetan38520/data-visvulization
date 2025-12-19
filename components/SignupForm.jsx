// components/SignUpForm.jsx
import React, { useState } from 'react';
import { authAPI, storeUserData } from '../services/api';

const SignUpForm = ({ toggleToLogin}) => {
  const [formData, setFormData] = useState({
    fullname: '',
    dob: '',
    email: '',
    password: '',
    rePassword: ''
  });

  const [profileImage, setProfileImage] = useState(null);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setSuccess('');

  // validation same rahegi
  if (!formData.fullname.trim()) return setError("Full name required");
  if (!formData.email.trim()) return setError("Email required");
  if (!formData.password) return setError("Password required");
  if (formData.password !== formData.rePassword)
    return setError("Passwords do not match");

  try {
    setLoading(true);

    // ✅ IMPORTANT
    const formDataObj = new FormData();
    formDataObj.append("full_name", formData.fullname);
    formDataObj.append("email", formData.email);
    formDataObj.append("password", formData.password);

    if (formData.dob) {
      formDataObj.append("date_of_birth", formData.dob);
    }

    if (profileImageFile) {
      formDataObj.append("profile_image", profileImageFile);
    }

    const response = await authAPI.register(formDataObj);

    setSuccess("Signup successful");
    console.log(response.data);

  } catch (err) {
    console.log("Signup error:", err.response?.data);
    setError("Signup failed");
  } finally {
    setLoading(false);
  }
};


  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError('Profile image size should be less than 2MB');
        return;
      }

      setProfileImageFile(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="font-sans w-[90%] max-w-md mx-auto p-4">
      <div className="border border-gray-200 rounded-lg shadow-sm">
        
        {/* Profile Section */}
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="text-center">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Upload Profile Picture</h3>
            <label className="cursor-pointer inline-block">
              <div className="w-20 h-20 rounded-full border border-dashed border-gray-300 overflow-hidden bg-white hover:border-blue-400">
                {profileImage ? (
                  <img 
                    src={profileImage} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                    <div className="text-2xl">📁</div>
                    <div className="text-xs mt-1">Upload</div>
                  </div>
                )}
              </div>
              <input
                type="file"
                className="hidden"
                onChange={handleFileUpload}
                accept="image/*"
                disabled={loading}
              />
            </label>
            <p className="text-xs text-gray-500 mt-1">Click to upload</p>
          </div>
        </div>

        {/* Form Section */}
        <div className="p-4">
          <h2 className="text-base font-medium text-gray-800 mb-3">Sign Up</h2>
          
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-2 mb-3 text-red-700 text-xs">
              {error}
            </div>
          )}
          
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-2 mb-3 text-green-700 text-xs">
              {success}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                name="fullname"
                value={formData.fullname}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
                placeholder="Enter your name"
              />
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Date of Birth</label>
              <div className="flex items-center space-x-1">
                <input 
                  type="date"
                  name="dob"
                  value={formData.dob}
                  className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
                placeholder="email@example.com"
              />
            </div>

            {/* Passwords */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Re - Password</label>
                <input
                  type="password"
                  name="rePassword"
                  value={formData.rePassword}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
                />
              </div>
            </div>

            {/* Password Note */}
            <div className="bg-blue-50 p-2 rounded border border-blue-100">
              <p className="text-xs text-blue-700">
                Use A-Z, a-z, 0-9, and special characters (@#$%^&*)
              </p>
            </div>

            {/* Sign Up Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 text-xs font-medium rounded hover:bg-blue-700 mt-1 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          {/* Toggle to Login Button */}
          <div className="mt-4 text-center">
            <p className="text-gray-600 text-xs">
              Already have an account?{' '}
              <button
                onClick={toggleToLogin}
                disabled={loading}
                className="text-blue-600 hover:text-blue-800 font-medium hover:underline disabled:opacity-50"
              >
                Login
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;