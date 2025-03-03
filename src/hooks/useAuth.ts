// src/hooks/useAuth.ts
import { useState, useEffect } from 'react';
import  authService from '@/services/authService';

/**
 * useAuth hook provides authentication state and methods for login, logout, and token management.
 * @returns An object containing authentication state and methods.
 */
const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  /**
   * Checks the authentication status on mount and listens for token changes.
   */
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await authService.getCurrentUser();
        if (user) {
          setIsAuthenticated(true);
          setUser(user);
        }
      } catch (error) {
        setIsAuthenticated(false);
        setUser(null);
      }
    };

    checkAuth();

    // Listen for token changes (e.g., after refresh)
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'token') {
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
    const user = await authService.login(credentials);
    setIsAuthenticated(true);
    setUser(user);
  };

  /**
   * Logs out the current user.
   */
  const logout = async () => {
    await authService.logout();
    setIsAuthenticated(false);
    setUser(null);
  };

  return { isAuthenticated, user, login, logout };
};

export default useAuth;