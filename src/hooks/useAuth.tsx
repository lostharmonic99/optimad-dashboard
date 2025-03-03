
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import api from '../services/api';

// Define the User type for better type safety
interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  [key: string]: any; // For other possible user properties
}

// Define the auth context shape
interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<User>;
  logout: () => Promise<void>;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType | null>(null);

// Auth provider props
interface AuthProviderProps {
  children: ReactNode;
}

/**
 * AuthProvider component that wraps the application and provides authentication state
 */
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Checks the authentication status on mount
   */
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        // Check auth with the backend using cookies
        const response = await api.get('/auth/me');
        console.log('Auth check response:', response.data);
        
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
  const login = async (credentials: { email: string; password: string }) => {
    try {
      console.log('Attempting login with:', credentials.email);
      
      // Sends credentials and receives cookies (set by the backend)
      const response = await api.post('/auth/login', credentials);
      console.log('Login response:', response.data);
      
      // Get user data from the response
      const userData = response.data.user;
      setIsAuthenticated(true);
      setUser(userData);
      
      return userData;
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.response?.data?.error || 'Login failed, please try again');
    }
  };

  /**
   * Logs out the current user.
   */
  const logout = async () => {
    try {
      // Call the logout endpoint - the backend will clear cookies
      await api.post('/auth/logout');
      
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw new Error('Logout failed');
    }
  };

  const value = {
    isAuthenticated,
    user,
    isLoading,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * useAuth hook provides authentication state and methods for login, logout, and token management.
 * @returns An object containing authentication state and methods.
 */
const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default useAuth;
