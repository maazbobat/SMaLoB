import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NODE_ENV === 'production' 
    ? '/api' 
    : 'http://localhost:3001/api', // Match backend port
  withCredentials: true,
  timeout: 10000 // 10-second timeout
});

api.interceptors.request.use(config => {
  console.log('Making request to:', config.url);
  return config;
}, error => {
  return Promise.reject(error);
});

// In your api.js file
// api.js
api.interceptors.response.use(
  response => response,
  error => {
    const originalRequest = error.config;
    
    // Skip interception for login endpoint
    if (originalRequest.url.includes('/auth/login')) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login?session_expired=true';
    }
    return Promise.reject(error);
  }
);

export default api;