/**
 * Notifications Service
 * API integration following API_INTEGRATION_GUIDE.md
 * 
 * Base URL: https://cmdms-backend-production.up.railway.app
 * API Base Path: /api
 * 
 * Endpoints:
 * - GET /api/notifications - List notifications
 * - PATCH /api/notifications/:id/read - Mark notification as read
 * - GET /api/notifications/unread/count - Get unread count
 * - PATCH /api/notifications/read-all - Mark all as read
 * - POST /api/notifications/test - Test notification
 * - POST /api/notifications/token - Register notification token
 */

import { api } from '../api';
import type { ApiResponse } from '../../types/api';

// ============================================================================
// Types
// ============================================================================

export interface Notification {
  id: number;
  title: string;
  message?: string;
  type?: string;
  isRead?: boolean;
  read_at?: string; // Frontend format (from UI store)
  actionUrl?: string;
  createdAt?: string;
  created_at?: string; // Frontend format (from UI store)
}

export interface ListNotificationsParams {
  page?: number;
  perPage?: number;
}

export interface ListNotificationsResponse {
  data: Notification[];
  meta: {
    total: number;
    unreadCount: number;
  };
}

export interface MarkNotificationReadResponse {
  success: boolean;
  message?: string;
}

export interface UnreadCountResponse {
  success: boolean;
  data: number;
}

export interface TestNotificationRequest {
  userId: number;
  title: string;
  message?: string;
}

export interface RegisterTokenRequest {
  token: string;
  platform?: string; // "android", "ios", "web"
}

// ============================================================================
// API Functions
// ============================================================================

/**
 * List notifications with pagination
 */
export const listNotifications = async (
  params?: ListNotificationsParams
): Promise<ListNotificationsResponse> => {
  const queryParams = new URLSearchParams();
  
  if (params?.page) {
    queryParams.append('page', params.page.toString());
  }
  if (params?.perPage) {
    queryParams.append('perPage', params.perPage.toString());
  }

  const url = `/notifications${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  const response = await api.get<ApiResponse<ListNotificationsResponse>>(url);
  return response.data.data;
};

/**
 * Mark a notification as read
 */
export const markNotificationAsRead = async (
  id: number
): Promise<MarkNotificationReadResponse> => {
  const response = await api.patch<ApiResponse<MarkNotificationReadResponse>>(`/notifications/${id}/read`);
  return response.data.data;
};

/**
 * Get unread notifications count
 */
export const getUnreadCount = async (): Promise<number> => {
  const response = await api.get<ApiResponse<number>>('/notifications/unread/count');
  return response.data.data;
};

/**
 * Mark all notifications as read
 */
export const markAllNotificationsAsRead = async (): Promise<MarkNotificationReadResponse> => {
  const response = await api.patch<ApiResponse<MarkNotificationReadResponse>>('/notifications/read-all');
  return response.data.data;
};

/**
 * Send test notification (admin/testing)
 */
export const sendTestNotification = async (
  data: TestNotificationRequest
): Promise<Notification> => {
  const response = await api.post<ApiResponse<Notification>>('/notifications/test', data);
  return response.data.data;
};

/**
 * Register notification token (for push notifications)
 */
export const registerNotificationToken = async (
  data: RegisterTokenRequest
): Promise<{ success: boolean }> => {
  const response = await api.post<ApiResponse<{ success: boolean }>>('/notifications/token', data);
  return response.data.data;
};

