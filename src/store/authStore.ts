/**
 * Auth Store (Zustand)
 * Global authentication state management
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, UserRole, AuthState } from '../types';
import { authenticateUser, getUserPermissions } from '../lib/mocks/data/users';
import { clearAuthToken, setAuthToken } from '../lib/api';
import { getNotifications, getUnreadCount } from '../lib/mocks/data/notifications';
import { useUIStore } from './uiStore';

interface AuthStore extends AuthState {
  // Actions
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  setUser: (user: User | null) => void;
  updateUser: (updates: Partial<User>) => void;
  hasPermission: (permission: string) => boolean;
  isAdmin: () => boolean;
  isDepartment: () => boolean;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      permissions: [],
      role: null,
      
      // Actions
      /**
       * Mock login function
       * TODO: Replace with real API call when backend is ready
       */
      login: async (email: string, password: string): Promise<boolean> => {
        try {
          // Mock authentication
          const user = authenticateUser(email, password);
          
          if (!user) {
            return false;
          }
          
          // Get user permissions
          const permissions = getUserPermissions(Number(user.id));
          
          // Mock token (replace with real token from backend)
          const mockToken = `mock_token_${user.id}_${Date.now()}`;
          setAuthToken(mockToken);
          
          // Load user notifications
          const notifications = getNotifications(Number(user.id));
          const unreadCount = getUnreadCount(Number(user.id));
          
          // Update UI store with notifications
          useUIStore.getState().notifications = notifications;
          useUIStore.getState().unreadCount = unreadCount;
          
          // Update state
          set({
            user,
            isAuthenticated: true,
            permissions,
            role: user.role?.role_name || null,
          });
          
          return true;
        } catch (error) {
          console.error('Login error:', error);
          return false;
        }
      },
      
      /**
       * Logout user
       */
      logout: () => {
        clearAuthToken();
        
        // Clear notifications from UI store
        useUIStore.getState().clearNotifications();
        
        set({
          user: null,
          isAuthenticated: false,
          permissions: [],
          role: null,
        });
      },
      
      /**
       * Set user (for manual updates)
       */
      setUser: (user: User | null) => {
        if (user) {
          const permissions = getUserPermissions(Number(user.id));
          set({
            user,
            isAuthenticated: true,
            permissions,
            role: user.role?.role_name || null,
          });
        } else {
          set({
            user: null,
            isAuthenticated: false,
            permissions: [],
            role: null,
          });
        }
      },
      
      /**
       * Update user fields
       */
      updateUser: (updates: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: { ...currentUser, ...updates },
          });
        }
      },
      
      /**
       * Check if user has specific permission
       */
      hasPermission: (permission: string): boolean => {
        const { permissions } = get();
        
        // Admin has all permissions
        if (permissions.includes('*')) {
          return true;
        }
        
        return permissions.includes(permission);
      },
      
      /**
       * Check if user is admin
       */
      isAdmin: (): boolean => {
        const { role } = get();
        return role === UserRole.ADMIN || role === UserRole.CM || role === UserRole.CS;
      },
      
      /**
       * Check if user is department user
       */
      isDepartment: (): boolean => {
        const { role } = get();
        return role === UserRole.DEPARTMENT;
      },
    }),
    {
      name: 'cmdms-auth-storage', // localStorage key
      partialize: (state) => ({
        // Only persist these fields
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        permissions: state.permissions,
        role: state.role,
      }),
    }
  )
);
