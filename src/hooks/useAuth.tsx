
import { useEffect, useState } from 'react';
import { authService } from '@/services/api';

type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  subscriptionStatus: string;
} | null;

export const useAuth = () => {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        setLoading(true);
        const userData = await authService.getCurrentUser();
        setUser(userData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch user data');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  return { user, loading, error };
};

export default useAuth;
