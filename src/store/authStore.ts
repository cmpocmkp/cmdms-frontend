/**
 * Auth Store (Zustand)
 * Global authentication state management
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, UserRole, AuthState } from '../types';
import { clearAuthToken, setAuthToken, setRefreshToken, USE_MOCK_DATA } from '../lib/api';
import { authenticateUser, getUserPermissions } from '../lib/mocks/data/users';
import { getNotifications, getUnreadCount } from '../lib/mocks/data/notifications';
import { useUIStore } from './uiStore';
import * as authService from '../lib/services/authService';
import { mapLoginResponseToUser } from '../lib/utils/userMapper';

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
       * Login user (real API or mock based on USE_MOCK_DATA flag)
       */
      login: async (email: string, password: string): Promise<boolean> => {
        try {
          if (USE_MOCK_DATA) {
            // Mock authentication (fallback)
            const user = authenticateUser(email, password);
            
            if (!user) {
              return false;
            }
            
            // Get user permissions
            const permissions = getUserPermissions(Number(user.id));
            
            // Mock token
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
          } else {
            // Real API authentication
            const response = await authService.login({ email, password });
            
            if (!response.success || !response.data) {
              return false;
            }
            
            const { user: apiUser, accessToken, refreshToken: refreshTokenValue } = response.data;
            
            // Map backend response to frontend User type
            const user = mapLoginResponseToUser(apiUser);
            
            // Store tokens
            setAuthToken(accessToken);
            if (refreshTokenValue) {
              setRefreshToken(refreshTokenValue);
            }
            
            // Extract permissions (if provided by backend, otherwise use role-based defaults)
            // For now, we'll use role-based permissions - backend may provide permissions array in future
            const permissions: string[] = [];
            if (user.role?.role_name === UserRole.ADMIN || 
                user.role?.role_name === UserRole.CM || 
                user.role?.role_name === UserRole.CS) {
              permissions.push('*'); // Admin has all permissions
            }
            
            // TODO: Load notifications from API when notification service is integrated
            // For now, initialize empty
            useUIStore.getState().notifications = [];
            useUIStore.getState().unreadCount = 0;
            
            // Update state
            set({
              user,
              isAuthenticated: true,
              permissions,
              role: user.role?.role_name || null,
            });
            
            return true;
          }
        } catch (error) {
          console.error('Login error:', error);
          return false;
        }
      },
      
      /**
       * Logout user
       */
      logout: () => {
        // Call logout API if not in mock mode (fire and forget)
        if (!USE_MOCK_DATA) {
          authService.logout().catch((error) => {
            // Log error but continue with local cleanup
            console.error('Logout API error:', error);
          });
        }
        
        // Always clear local state immediately
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
