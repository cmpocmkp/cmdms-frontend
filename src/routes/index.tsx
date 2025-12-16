/**
 * Route Configuration
 * All application routes defined here
 */

import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { LoadingSpinner } from '../components/shared/LoadingSpinner';
import { UserRole } from '../types';

// Lazy load pages for better performance
const LoginPage = lazy(() => import('../pages/auth/LoginPage'));
const AdminDashboard = lazy(() => import('../pages/admin/Dashboard'));
const DepartmentDashboard = lazy(() => import('../pages/department/Dashboard'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));

// Admin layout
const AdminLayout = lazy(() => import('../components/shared/layout/AdminLayout'));
const DepartmentLayout = lazy(() => import('../components/shared/layout/DepartmentLayout'));

// Loading fallback component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <LoadingSpinner size="lg" />
  </div>
);

/**
 * Wrap lazy-loaded components with Suspense
 */
const withSuspense = (Component: React.LazyExoticComponent<any>) => (
  <Suspense fallback={<PageLoader />}>
    <Component />
  </Suspense>
);

/**
 * Application Router
 */
export const router = createBrowserRouter([
  // Public routes
  {
    path: '/login',
    element: withSuspense(LoginPage),
  },
  
  // Root redirect
  {
    path: '/',
    element: <Navigate to="/admin/dashboard" replace />,
  },
  
  // Admin routes
  {
    path: '/admin',
    element: (
      <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.CM, UserRole.CS]}>
        {withSuspense(AdminLayout)}
      </ProtectedRoute>
    ),
    children: [
      {
        path: 'dashboard',
        element: withSuspense(AdminDashboard),
      },
      // TODO: Add more admin routes here as modules are built
      // {
      //   path: 'directives',
      //   element: withSuspense(DirectivesPage),
      // },
      // {
      //   path: 'directives/:id',
      //   element: withSuspense(DirectiveDetailPage),
      // },
    ],
  },
  
  // Department routes
  {
    path: '/department',
    element: (
      <ProtectedRoute allowedRoles={[UserRole.DEPARTMENT]}>
        {withSuspense(DepartmentLayout)}
      </ProtectedRoute>
    ),
    children: [
      {
        path: 'dashboard',
        element: withSuspense(DepartmentDashboard),
      },
      // TODO: Add more department routes here
    ],
  },
  
  // 404 Not Found
  {
    path: '*',
    element: withSuspense(NotFoundPage),
  },
]);

