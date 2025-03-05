import axios from 'axios';
import { io } from "socket.io-client";


const socket = io("http://localhost:3001");

export { socket };

const api = axios.create({
  baseURL: process.env.NODE_ENV === 'production' 
    ? '/api' 
    : 'http://localhost:3001/api', // Match backend port
  withCredentials: true,
  timeout: 10000 // 10-second timeout
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
      config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

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