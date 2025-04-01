// API base URL configuration
const API_URL = process.env.REACT_APP_API_URL || 'https://likhub-backend.onrender.com';
const CLOUD_NAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || "dwhrwkgyp";
const UPLOAD_PRESET = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET || "Likhub123";

// Helper function for API requests
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_URL}${endpoint}`;
  
  // Set default headers
  if (!options.headers) {
    options.headers = {};
  }
  
  if (!options.headers['Content-Type'] && (!options.body || !(options.body instanceof FormData))) {
    options.headers['Content-Type'] = 'application/json';
  }
  
  // Add auth token if available
  const token = localStorage.getItem('token');
  if (token) {
    options.headers['Authorization'] = `Bearer ${token}`;
  }
  
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }
    
    return data;
  } catch (error) {
    console.error(`❌ API Error: ${error.message}`);
    throw error;
  }
};

// Cloudinary service
export const cloudinaryService = {
  uploadImage: async (file) => {
    if (!file) throw new Error("No file provided");
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      throw new Error("Please upload an image file");
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error("Image size should be less than 5MB");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error?.message || "Failed to upload image");
      }

      return data.secure_url;
    } catch (error) {
      console.error("❌ Error uploading image:", error.message);
      throw error;
    }
  }
};

// Auth service
export const authService = {
  login: (credentials) => apiRequest('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  }),
  
  signup: (userData) => apiRequest('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify(userData)
  }),
  
  updateProfile: (userData) => apiRequest('/api/auth/update', {
    method: 'POST',
    body: JSON.stringify(userData)
  }),
  
  getUser: (userId) => apiRequest(`/api/auth/user/${userId}`)
};

// Forum service
export const forumService = {
  getPosts: () => apiRequest('/api/forum'),
  
  likePost: (postId) => apiRequest(`/api/forum/${postId}/like`, {
    method: 'PATCH'
  }),
  
  getComments: (postId) => apiRequest(`/api/forum/${postId}/comments`),
  
  deletePost: (postId) => apiRequest(`/api/forum/${postId}`, {
    method: 'DELETE'
  }),
  
  deleteComment: (postId, commentId) => apiRequest(`/api/forum/${postId}/comments/${commentId}`, {
    method: 'DELETE'
  }),
  
  createPost: (postData) => apiRequest('/api/forum', {
    method: 'POST',
    body: JSON.stringify(postData)
  }),
  
  addComment: (postId, commentData) => apiRequest(`/api/forum/${postId}/comments`, {
    method: 'POST',
    body: JSON.stringify(commentData)
  })
};

// Inventions service
export const inventionsService = {
  getInventions: () => apiRequest('/api/inventions'),
  
  likeInvention: (postId) => apiRequest(`/api/inventions/${postId}/like`, {
    method: 'PATCH'
  }),
  
  deleteInvention: (postId) => apiRequest(`/api/inventions/${postId}`, {
    method: 'DELETE'
  }),
  
  createInvention: (inventionData) => apiRequest('/api/inventions', {
    method: 'POST',
    body: JSON.stringify(inventionData)
  })
};

// Create a named export for the API services
const apiServices = {
  authService,
  forumService,
  inventionsService,
  cloudinaryService
};

// Export the named object as default
export default apiServices; 