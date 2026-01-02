import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../auth/localAuth';

interface ProtectedRouteProps {
  children: ReactNode;
}

/**
 * Route guard component that redirects to home if user is not authenticated
 */
export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  if (!isAuthenticated()) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

