
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

// Flag to prevent infinite refresh loops
let isRefreshing = false;
let refreshAttempted = false;

// Add response interceptor to handle errors and refresh tokens
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    console.log(`API Error Response: ${error.response?.status} ${originalRequest?.url}`);
    
    // If error is 401 (Unauthorized) and not a refresh token request and we haven't tried refreshing yet
    if (error.response?.status === 401 && 
        !originalRequest._retry && 
        !originalRequest.url?.includes('/auth/refresh') &&
        !isRefreshing && 
        !refreshAttempted) {
      
      originalRequest._retry = true;
      isRefreshing = true;
      refreshAttempted = true;
      
      try {
        console.log('Attempting to refresh token...');
        // Try to refresh the token
        await axios.post(`${API_URL}/auth/refresh`, {}, { 
          withCredentials: true 
        });
        
        console.log('Token refresh successful, retrying original request');
        isRefreshing = false;
        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, redirect to login but avoid loops
        console.error('Token refresh failed:', refreshError);
        isRefreshing = false;
        
        // Only redirect to login if not already on the login page
        if (!window.location.pathname.includes('/login')) {
          console.log('Not on login page, redirecting to login');
          window.location.href = '/login';
        } else {
          console.log('Already on login page, not redirecting');
        }
        
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
      
      // Reset refresh attempt flag after successful login
      refreshAttempted = false;
      
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
      
      // Reset refresh attempt flag after successful registration
      refreshAttempted = false;
      
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
      
      // Reset the refresh flags
      refreshAttempted = false;
      isRefreshing = false;
      
      // Use navigate to prevent page reload
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
      
      // Reset the refresh flags even on error
      refreshAttempted = false;
      isRefreshing = false;
      
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
      // Don't reset flags here, as this might be called from various places
      return null;
    }
  },
  
  isAuthenticated: async () => {
    // If already on login page, no need to check auth status to avoid loops
    if (window.location.pathname.includes('/login') || 
        window.location.pathname === '/' || 
        window.location.pathname.includes('/signup') ||
        window.location.pathname.includes('/reset-password')) {
      console.log('On public page, skipping auth check');
      return false;
    }
    
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
