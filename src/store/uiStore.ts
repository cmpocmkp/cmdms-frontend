/**
 * UI Store (Zustand)
 * Global UI state management
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Notification } from '../types';

interface UIStore {
  // Sidebar state
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  
  // Theme (for future dark mode)
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  
  // Notifications
  notifications: Notification[];
  unreadCount: number;
  notificationPanelOpen: boolean;
  addNotification: (notification: Notification) => void;
  markAsRead: (id: string | number) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
  toggleNotificationPanel: () => void;
  setNotificationPanelOpen: (open: boolean) => void;
  
  // Loading states
  isLoading: boolean;
  loadingMessage: string | null;
  setLoading: (loading: boolean, message?: string) => void;
  
  // Modal/Dialog state
  activeModal: string | null;
  modalData: any;
  openModal: (modalId: string, data?: any) => void;
  closeModal: () => void;
}

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      // Sidebar state
      sidebarCollapsed: false,
      
      toggleSidebar: () => {
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed }));
      },
      
      setSidebarCollapsed: (collapsed: boolean) => {
        set({ sidebarCollapsed: collapsed });
      },
      
      // Theme
      theme: 'light',
      
      toggleTheme: () => {
        set((state) => ({
          theme: state.theme === 'light' ? 'dark' : 'light',
        }));
      },
      
      setTheme: (theme: 'light' | 'dark') => {
        set({ theme });
      },
      
      // Notifications
      notifications: [],
      unreadCount: 0,
      notificationPanelOpen: false,
      
      addNotification: (notification: Notification) => {
        set((state) => ({
          notifications: [notification, ...state.notifications],
          unreadCount: state.unreadCount + 1,
        }));
      },
      
      markAsRead: (id: string | number) => {
        set((state) => {
          const updatedNotifications = state.notifications.map((n) =>
            n.id === id ? { ...n, read_at: new Date().toISOString() } : n
          );
          
          const unreadCount = updatedNotifications.filter((n) => !n.read_at).length;
          
          return {
            notifications: updatedNotifications,
            unreadCount,
          };
        });
      },
      
      markAllAsRead: () => {
        set((state) => ({
          notifications: state.notifications.map((n) => ({
            ...n,
            read_at: n.read_at || new Date().toISOString(),
          })),
          unreadCount: 0,
        }));
      },
      
      clearNotifications: () => {
        set({ notifications: [], unreadCount: 0 });
      },
      
      toggleNotificationPanel: () => {
        set((state) => ({ notificationPanelOpen: !state.notificationPanelOpen }));
      },
      
      setNotificationPanelOpen: (open: boolean) => {
        set({ notificationPanelOpen: open });
      },
      
      // Loading states
      isLoading: false,
      loadingMessage: null,
      
      setLoading: (loading: boolean, message?: string) => {
        set({ isLoading: loading, loadingMessage: message || null });
      },
      
      // Modal/Dialog state
      activeModal: null,
      modalData: null,
      
      openModal: (modalId: string, data?: any) => {
        set({ activeModal: modalId, modalData: data || null });
      },
      
      closeModal: () => {
        set({ activeModal: null, modalData: null });
      },
    }),
    {
      name: 'cmdms-ui-storage',
      partialize: (state) => ({
        // Only persist these fields
        sidebarCollapsed: state.sidebarCollapsed,
        theme: state.theme,
        // Don't persist notifications, loading, or modal state
      }),
    }
  )
);

