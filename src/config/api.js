// API Configuration
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Debug: Log the API URL (remove this after testing)
console.log('🔗 API_URL:', API_URL);
console.log('🔧 VITE_API_URL:', import.meta.env.VITE_API_URL);

// API endpoint helper
export const api = {
  // Auth endpoints
  auth: {
    register: `${API_URL}/api/auth/register`,
    login: `${API_URL}/api/auth/login`,
    forgotPassword: `${API_URL}/api/auth/forgot-password`,
    verifyResetCode: `${API_URL}/api/auth/verify-reset-code`,
    resetPassword: `${API_URL}/api/auth/reset-password`,
    updateProfile: `${API_URL}/api/auth/update-profile`,
    uploadProfileImage: `${API_URL}/api/auth/upload-profile-image`,
  },
  
  // University endpoints
  universities: {
    getAll: `${API_URL}/api/universities`,
    getById: (id) => `${API_URL}/api/universities/${id}`,
    create: `${API_URL}/api/universities`,
    bulk: `${API_URL}/api/universities/bulk`,
    recordView: (id) => `${API_URL}/api/universities/${id}/view`,
    toggleFeatured: (id) => `${API_URL}/api/admin/universities/${id}/toggle-featured`,
  },
  
  // Admin endpoints
  admin: {
    stats: `${API_URL}/api/admin/stats`,
    users: (params = '') => `${API_URL}/api/admin/users${params ? `?${params}` : ''}`,
    featuredUniversities: `${API_URL}/api/admin/featured-universities`,
    recentUniversities: (limit = 5) => `${API_URL}/api/admin/recent-universities?limit=${limit}`,
    reviewsOverTime: `${API_URL}/api/admin/reviews-over-time`,
    userGrowth: `${API_URL}/api/admin/user-growth`,
    recentReviews: `${API_URL}/api/admin/recent-reviews`,
    popularReviews: `${API_URL}/api/admin/popular-reviews`,
  },
  
  // User endpoints
  users: {
    getById: (id) => `${API_URL}/api/users/${id}`,
    saved: `${API_URL}/api/users/saved`,
    removeSaved: (id) => `${API_URL}/api/users/saved/${id}`,
    checkSaved: (id) => `${API_URL}/api/users/saved/${id}`,
  },
  
  // Review endpoints
  reviews: {
    getAll: `${API_URL}/api/reviews`,
    myReviews: `${API_URL}/api/reviews/my-reviews`,
    create: `${API_URL}/api/reviews`,
    getByUser: (userId) => `${API_URL}/api/reviews?user=${userId}&sortBy=createdAt&order=desc&limit=20`,
    markHelpful: (id) => `${API_URL}/api/reviews/${id}/helpful`,
  },

  // Verification endpoints
  verification: {
    sendCode: `${API_URL}/api/verification/send-code`,
    verifyCode: `${API_URL}/api/verification/verify-code`,
  }
};
