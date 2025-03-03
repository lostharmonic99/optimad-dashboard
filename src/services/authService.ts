import axios from 'axios';
import api from './api';

/**
 * Interface for login credentials.
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Interface for registration data.
 */
export interface RegistrationData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

/**
 * Interface for authentication response from the backend.
 */
export interface AuthResponse {
  user: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    subscriptionStatus: string;
    subscriptionEndDate?: string;
    createdAt: string;
  };
  message: string;
}

/**
 * Authentication service to handle login, registration, logout, and user state.
 */
const authService = {
  /**
   * Logs in a user with the provided credentials.
   * @param {LoginCredentials} credentials - User's email and password.
   * @returns {Promise<AuthResponse>} User data and success message.
   * @throws {Error} If login fails with a specific message.
   */
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      console.log('Attempting login with:', credentials.email);
      const response = await api.post('/auth/login', credentials);
      console.log('Login successful:', response.data);
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.error || 'Login failed');
      }
      throw new Error('Login failed, please try again');
    }
  },

  /**
   * Registers a new user with the provided data.
   * @param {RegistrationData} data - User's registration details.
   * @returns {Promise<AuthResponse>} User data and success message.
   * @throws {Error} If registration fails with a specific message.
   */
  register: async (data: RegistrationData): Promise<AuthResponse> => {
    try {
      const response = await api.post('/auth/register', data);
      console.log('Registration successful:', response.data);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.error || 'Registration failed');
      }
      throw new Error('Registration failed, please try again');
    }
  },

  /**
   * Logs out the current user by calling the backend logout endpoint.
   * @returns {Promise<void>}
   */
  logout: async (): Promise<void> => {
    try {
      console.log('Logging out user...');
      await api.post('/auth/logout', {});
      console.log('Logout successful');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },

  /**
   * Fetches the current authenticated user's data.
   * @returns {Promise<any>} User data or null if not authenticated.
   */
  getCurrentUser: async (): Promise<any> => {
    try {
      console.log('Fetching current user data...');
      const response = await api.get('/auth/me');
      console.log('Current user:', response.data);
      return response.data;
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  },

  /**
   * Checks if the user is authenticated by querying /auth/me.
   * @returns {Promise<boolean>} True if authenticated, false otherwise.
   */
  isAuthenticated: async (): Promise<boolean> => {
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

  /**
   * Initiates Google OAuth login by redirecting to the backend endpoint.
   */
  googleLogin: (): void => {
    console.log('Redirecting to Google OAuth login');
    window.location.href = `${api.defaults.baseURL}/auth/google`;
  },

  /**
   * Initiates Facebook OAuth login by redirecting to the backend endpoint.
   */
  facebookLogin: (): void => {
    console.log('Redirecting to Facebook OAuth login');
    window.location.href = `${api.defaults.baseURL}/auth/facebook`;
  },
};

export default authService;