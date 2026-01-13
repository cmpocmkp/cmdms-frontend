/**
 * Activity Log Service
 * API integration following API_INTEGRATION_GUIDE.md
 * 
 * Base URL: https://cmdms-backend-production.up.railway.app
 * API Base Path: /api
 * 
 * Endpoints:
 * - GET /api/activity-logs (List activity logs with pagination/filters)
 */

import { api } from '../api';
import type { PaginatedResponse } from '../../types/api';

export interface ActivityLog {
  id: number;
  userId: number;
  userName?: string;
  userEmail?: string;
  departmentId?: number;
  departmentName?: string;
  action: string;
  description?: string;
  entityType?: string;
  entityId?: number;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

export interface ListActivityLogsParams {
  page?: number;
  limit?: number;
  userId?: number;
  departmentId?: number;
  action?: string;
  entityType?: string;
  entityId?: number;
  fromDate?: string;
  toDate?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * List activity logs with pagination and filters
 * GET /api/activity-logs
 * 
 * Query parameters:
 * - page: Page number (default: 1)
 * - limit: Items per page (default: 20)
 * - Additional filters as per ListActivityLogsParams
 */
export const listActivityLogs = async (
  params?: ListActivityLogsParams
): Promise<PaginatedResponse<ActivityLog>> => {
  const response = await api.get<PaginatedResponse<ActivityLog>>('/activity-logs', { params });
  return response.data;
};

