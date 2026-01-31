import React, { useState, useRef } from 'react';
import { IoMdClose } from 'react-icons/io';
import { FaCamera } from 'react-icons/fa';

export default function EditProfileModal({ isOpen, onClose, user, onSuccess }) {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    userImageUrl: user?.userImageUrl || ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(user?.userImageUrl || '');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setError('');

    // Upload to Cloudinary immediately
    await uploadImageToCloudinary(file);
  };

  const uploadImageToCloudinary = async (file) => {
    try {
      setUploading(true);
      const formDataToUpload = new FormData();
      formDataToUpload.append('image', file);

      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/auth/upload-profile-image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToUpload
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to upload image');
      }

      const data = await response.json();
      setFormData(prev => ({ ...prev, userImageUrl: data.imageUrl }));
    } catch (err) {
      setError(err.message);
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/auth/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }

      // Update local storage
      const updatedUser = { ...user, ...formData };
      localStorage.setItem('user', JSON.stringify(updatedUser));

      // Call success callback
      onSuccess(updatedUser);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#121212] border border-[#004F4F] rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#004F4F]">
          <h2 className="text-2xl font-bold text-[#00FF00]">Edit Profile</h2>
          <button
            onClick={onClose}
            className="text-[#888888] hover:text-[#FFFFFF] transition-colors p-2"
          >
            <IoMdClose className="text-2xl" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-[#ff4444]/10 border border-[#ff4444] rounded-lg text-[#ff4444] text-sm">
              {error}
            </div>
          )}

          {/* Profile Image Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-[#FFFFFF] mb-3">
              Profile Picture
            </label>
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#00FF00] to-[#004F4F] flex items-center justify-center overflow-hidden">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Profile preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-[#0B0C10] text-3xl font-bold">
                      {formData.name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="absolute bottom-0 right-0 p-2 bg-[#00FF00] hover:bg-[#00dd00] text-[#0B0C10] rounded-full transition-colors disabled:opacity-50"
                >
                  <FaCamera />
                </button>
              </div>
              <div className="flex-1">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="px-4 py-2 bg-[#121212] hover:bg-[#1a1a1a] text-[#00FF00] border border-[#004F4F] rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                >
                  {uploading ? 'Uploading...' : 'Change Photo'}
                </button>
                <p className="text-xs text-[#888888] mt-2">
                  JPG, PNG or GIF. Max size 5MB
                </p>
              </div>
            </div>
          </div>

          {/* Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#FFFFFF] mb-2">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-[#0B0C10] border border-[#004F4F] rounded-lg text-[#FFFFFF] placeholder-[#888888] focus:outline-none focus:ring-2 focus:ring-[#00FF00] focus:border-transparent"
              placeholder="Enter your full name"
            />
          </div>

          {/* Email (Read-only) */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-[#FFFFFF] mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#004F4F] rounded-lg text-[#888888] cursor-not-allowed"
            />
            <p className="text-xs text-[#888888] mt-1">Email cannot be changed</p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-[#121212] hover:bg-[#1a1a1a] text-[#888888] border border-[#004F4F] rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || uploading}
              className="flex-1 px-6 py-3 bg-[#00FF00] hover:bg-[#00dd00] text-[#0B0C10] rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
