import axios from 'axios';
import { io } from "socket.io-client";

// Set base URL from .env or fallback
const BACKEND_URL = process.env.REACT_APP_API_BASE_URL || "https://smalob.onrender.com";

// Setup socket connection
const socket = io(BACKEND_URL, {
  transports: ['websocket'], // helps avoid polling issues
  withCredentials: true
});
export { socket };

// Setup axios instance
const api = axios.create({
  baseURL: `${BACKEND_URL}/api`,
  withCredentials: true,
  timeout: 10000,
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
