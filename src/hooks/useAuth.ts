
// src/hooks/useAuth.ts
import { useState, useEffect } from 'react';

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
    const checkAuth = () => {
      try {
        // Check if user data exists in localStorage
        const userData = localStorage.getItem('user');
        if (userData) {
          setUser(JSON.parse(userData));
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

    // Listen for storage events (if user logs in from another tab)
    const handleStorageChange = (event) => {
      if (event.key === 'user' || event.key === 'token') {
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  /**
   * Logs in a user with the provided credentials.
   * @param credentials - The user's login credentials.
   */
  const login = async (credentials) => {
    try {
      console.log('Attempting login with:', credentials.email);
      
      // Mock login - in a real app, this would call an API
      // For demo purposes, accept any credentials with valid format
      if (!credentials.email || !credentials.password) {
        throw new Error('Email and password are required');
      }
      
      // Create a mock user response
      const user = {
        id: 1,
        email: credentials.email,
        firstName: credentials.email.split('@')[0],
        lastName: '',
        role: 'user',
        subscriptionStatus: 'free',
      };
      
      // Store user data in localStorage
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', 'mock-token-' + Date.now());
      
      setIsAuthenticated(true);
      setUser(user);
      
      return user;
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Login failed, please try again');
    }
  };

  /**
   * Logs out the current user.
   */
  const logout = async () => {
    try {
      // Clear localStorage
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return { isAuthenticated, user, login, logout, isLoading };
};

export default useAuth;
