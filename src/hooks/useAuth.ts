
// src/hooks/useAuth.ts
import { useState, useEffect } from 'react';
import api from '../services/api';

/**
 * useAuth hook provides authentication state and methods for login, logout, and token management.
 * @returns An object containing authentication state and methods.
 */
const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Checks the authentication status on mount
   */
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        // Check auth with the backend
        const response = await api.get('/auth/me');
        if (response.data) {
          setUser(response.data);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Authentication check error:', error);
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  /**
   * Logs in a user with the provided credentials.
   * @param credentials - The user's login credentials.
   */
  const login = async (credentials) => {
    try {
      console.log('Attempting login with:', credentials.email);
      
      const response = await api.post('/auth/login', credentials);
      
      // Get user data from the response
      const userData = response.data.user;
      setIsAuthenticated(true);
      setUser(userData);
      
      return userData;
    } catch (error) {
      console.error('Login error:', error);
      throw new Error(error.response?.data?.error || 'Login failed, please try again');
    }
  };

  /**
   * Logs out the current user.
   */
  const logout = async () => {
    try {
      // Call the logout endpoint
      await api.post('/auth/logout');
      
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw new Error('Logout failed');
    }
  };

  return { isAuthenticated, user, login, logout, isLoading };
};

export default useAuth;
