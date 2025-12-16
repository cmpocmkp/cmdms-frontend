/**
 * Auth Context (React Context)
 * Provides authentication state and methods to components
 * Uses Zustand store under the hood
 */

import { createContext, useContext, ReactNode } from 'react';
import { useAuthStore } from '../store/authStore';
import { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  permissions: string[];
  role: UserRole | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
  isAdmin: () => boolean;
  isDepartment: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Auth Provider Component
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const authStore = useAuthStore();
  
  const value: AuthContextType = {
    user: authStore.user,
    isAuthenticated: authStore.isAuthenticated,
    permissions: authStore.permissions,
    role: authStore.role,
    login: authStore.login,
    logout: authStore.logout,
    hasPermission: authStore.hasPermission,
    isAdmin: authStore.isAdmin,
    isDepartment: authStore.isDepartment,
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook to use auth context
 */
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}

/**
 * Hook for role-based access
 */
export function useRole() {
  const { role, isAdmin, isDepartment } = useAuth();
  
  return {
    role,
    isAdmin: isAdmin(),
    isDepartment: isDepartment(),
    isCS: role === UserRole.CS,
    isCM: role === UserRole.CM,
    isDataEntry: role === UserRole.DATA_ENTRY,
    isBoard: role === UserRole.BOARD,
  };
}

/**
 * Hook for permission-based access
 */
export function usePermissions() {
  const { permissions, hasPermission } = useAuth();
  
  return {
    permissions,
    hasPermission,
    canView: (resource: string) => hasPermission(`view_${resource}`),
    canCreate: (resource: string) => hasPermission(`create_${resource}`),
    canEdit: (resource: string) => hasPermission(`edit_${resource}`),
    canDelete: (resource: string) => hasPermission(`delete_${resource}`),
  };
}

