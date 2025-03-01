
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Required for cookies
});

// Add request interceptor to handle errors
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors and refresh tokens
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    console.log(`API Error Response: ${error.response?.status} ${originalRequest?.url}`);
    
    // If error is 401 (Unauthorized) and not a refresh token request
    if (error.response?.status === 401 && 
        !originalRequest._retry && 
        !originalRequest.url?.includes('/auth/refresh')) {
      
      originalRequest._retry = true;
      
      try {
        console.log('Attempting to refresh token...');
        // Try to refresh the token
        await axios.post(`${API_URL}/auth/refresh`, {}, { 
          withCredentials: true 
        });
        
        console.log('Token refresh successful, retrying original request');
        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, redirect to login
        console.error('Token refresh failed:', refreshError);
        authService.logout();
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth service functions
export const authService = {
  login: async (credentials: { email: string; password: string }) => {
    try {
      console.log('Attempting login with:', credentials.email);
      const response = await api.post('/auth/login', credentials);
      console.log('Login successful');
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.error || 'Login failed');
      }
      throw new Error('Login failed, please try again');
    }
  },
  
  register: async (data: { email: string; password: string; firstName: string; lastName: string }) => {
    try {
      const response = await api.post('/auth/register', data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.error || 'Registration failed');
      }
      throw new Error('Registration failed, please try again');
    }
  },
  
  logout: async () => {
    try {
      console.log('Logging out user...');
      await api.post('/auth/logout');
      console.log('Logout successful, redirecting to login');
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
      window.location.href = '/login';
    }
  },
  
  getCurrentUser: async () => {
    try {
      console.log('Fetching current user data...');
      const response = await api.get('/auth/me');
      console.log('Current user:', response.data);
      return response.data;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  },
  
  isAuthenticated: async () => {
    try {
      console.log('Checking authentication status...');
      const user = await authService.getCurrentUser();
      const authenticated = !!user;
      console.log('Authentication status:', authenticated);
      return authenticated;
    } catch (error) {
      console.error('Auth check error:', error);
      return false;
    }
  },
  
  // Social login methods - these now work with OAuth flow instead of token-based auth
  googleLogin: () => {
    window.location.href = `${API_URL}/auth/google/login`;
  },
  
  facebookLogin: () => {
    window.location.href = `${API_URL}/auth/facebook/login`;
  }
};

export default api;
