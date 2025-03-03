import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api'; // Proxy path to backend

/**
 * Axios instance for API requests with default configuration.
 */
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enable cookie transmission
});

/**
 * Request interceptor to log outgoing requests.
 */
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

/**
 * Response interceptor to handle 401 errors and token refresh.
 */
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    console.log(`API Error Response: ${error.response?.status} ${originalRequest?.url}`);

    if (error.response?.status === 401 && !originalRequest._retry && !isRefreshing) {
      originalRequest._retry = true;
      isRefreshing = true;
      try {
        console.log('Attempting to refresh token...');
        await axios.post(`${API_URL}/auth/refresh`, {}, { withCredentials: true });
        console.log('Token refresh successful');
        isRefreshing = false;
        return api(originalRequest);
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        isRefreshing = false;
        if (!window.location.pathname.includes('/login')) {
          console.log('Not on login page, redirecting to login');
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;