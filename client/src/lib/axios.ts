import axios from "axios";
import { supabase } from "../supabase";

// Create axios instance with base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - attach JWT token to every request
api.interceptors.request.use(
  async (config) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.access_token) {
        config.headers.Authorization = `Bearer ${session.access_token}`;
      }
    } catch (error) {
      console.error("Error getting session for API request:", error);
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors globally
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized - token expired or invalid
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh the session
        const { data: { session }, error: refreshError } = await supabase.auth.refreshSession();
        
        if (refreshError || !session) {
          // Refresh failed, redirect to login
          window.location.href = "/login";
          return Promise.reject(error);
        }

        // Retry the original request with new token
        originalRequest.headers.Authorization = `Bearer ${session.access_token}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, redirect to login
        window.location.href = "/login";
        console.error("Refresh failed, redirecting to login:", refreshError);
        return Promise.reject(error);
      }
    }

    // Handle other errors
    if (error.response?.status === 403) {
      console.error("Forbidden: You don't have permission to access this resource");
    }

    if (error.response?.status === 500) {
      console.error("Server error: Something went wrong on our end");
    }

    return Promise.reject(error);
  }
);

export default api;
