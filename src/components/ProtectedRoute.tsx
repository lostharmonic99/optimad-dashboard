
import { ReactNode, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { authService } from "@/services/api";
import { Spinner } from "@/components/ui/spinner";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    const checkAuth = async () => {
      try {
        setIsCheckingAuth(true);
        console.log("Protected route - checking auth for:", location.pathname);
        
        // Skip auth check if we're already on a public route
        if (location.pathname.includes('/login') || 
            location.pathname === '/' || 
            location.pathname.includes('/signup') ||
            location.pathname.includes('/reset-password')) {
          console.log('On public page, auth check not needed');
          if (isMounted) {
            setIsAuthenticated(false);
            setIsCheckingAuth(false);
          }
          return;
        }
        
        const authenticated = await authService.isAuthenticated();
        
        if (isMounted) {
          console.log("Auth check result:", authenticated);
          setIsAuthenticated(authenticated);
          setIsCheckingAuth(false);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        if (isMounted) {
          setIsAuthenticated(false);
          setIsCheckingAuth(false);
        }
      }
    };
    
    checkAuth();
    
    // Cleanup function to handle component unmounting
    return () => {
      isMounted = false;
    };
  }, [location.pathname]);

  // Show loading spinner while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    console.log("Not authenticated, redirecting to login from:", location.pathname);
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  console.log("Authenticated, rendering protected content for:", location.pathname);
  return <>{children}</>;
};

export default ProtectedRoute;
