
import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '@/hooks/useAuth';
import { Spinner } from '@/components/ui/spinner';

/**
 * Props for the ProtectedRoute component.
 */
interface ProtectedRouteProps {
  children: ReactNode;
}

/**
 * Protects routes by checking authentication status using useAuth hook.
 * Redirects to /login if not authenticated, shows spinner while checking.
 * @param {ProtectedRouteProps} props - Component props including children to render.
 * @returns {JSX.Element} Protected content, spinner, or redirect.
 */
const ProtectedRoute = ({ children }: ProtectedRouteProps): JSX.Element => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  console.log('ProtectedRoute: isLoading:', isLoading, 'isAuthenticated:', isAuthenticated, 'path:', location.pathname);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  // Define public routes that don't require authentication
  const isPublicRoute = Boolean(location.pathname.match(/\/(login|signup|reset-password|$)/));
  
  if (!isAuthenticated && !isPublicRoute) {
    console.log('Not authenticated, redirecting to login from:', location.pathname);
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  console.log('Authenticated or public route, rendering content for:', location.pathname);
  return <>{children}</>;
};

export default ProtectedRoute;
