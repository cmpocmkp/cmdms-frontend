/**
 * Protected Route Component
 * Handles authentication and role-based access control
 */

import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { UserRole } from '../types';

interface ProtectedRouteProps {
  children: React.ReactElement;
  allowedRoles?: UserRole[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, user, role } = useAuth();
  
  // Not authenticated - redirect to login
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }
  
  // Check if user has required role
  if (allowedRoles && allowedRoles.length > 0) {
    if (!role || !allowedRoles.includes(role)) {
      // User doesn't have permission - redirect to appropriate dashboard
      if (role === UserRole.DEPARTMENT) {
        return <Navigate to="/department/dashboard" replace />;
      }
      
      // Default to admin dashboard for other roles
      return <Navigate to="/admin/dashboard" replace />;
    }
  }
  
  // Authenticated and authorized - render children
  return children;
}

