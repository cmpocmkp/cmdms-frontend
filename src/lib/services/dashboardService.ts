/**
 * Dashboard Service
 * API integration following API_INTEGRATION_GUIDE.md
 * 
 * Base URL: https://cmdms-backend-production.up.railway.app
 * API Base Path: /api
 * 
 * Endpoints:
 * - GET /api/reports/dashboard - Dashboard statistics
 * - GET /api/reports/departments/performance - Department performance data
 */

import { api } from '../api';
import type { ApiResponse } from '../../types/api';

// ============================================================================
// Types
// ============================================================================

export interface DashboardStatistics {
  totalMeetings: number;
  totalMinutes: number;
  pendingTasks: number;
  completedTasks: number;
  overdueItems: number;
}

export interface DepartmentPerformance {
  departmentId: number;
  departmentName: string;
  totalTasks: number;
  completed: number;
  pending: number;
  overdue: number;
  completionRate: number;
}

export interface DepartmentPerformanceParams {
  fromDate?: string; // YYYY-MM-DD
  toDate?: string; // YYYY-MM-DD
  departmentId?: number;
}

// ============================================================================
// Dashboard Operations
// ============================================================================

/**
 * Get dashboard statistics
 * GET /api/reports/dashboard
 */
export const getDashboardStatistics = async (): Promise<ApiResponse<DashboardStatistics>> => {
  const response = await api.get<ApiResponse<DashboardStatistics>>('/reports/dashboard');
  return response.data;
};

/**
 * Get department performance data
 * GET /api/reports/departments/performance
 * 
 * @param params - Optional query parameters (fromDate, toDate, departmentId)
 */
export const getDepartmentPerformance = async (
  params?: DepartmentPerformanceParams
): Promise<ApiResponse<DepartmentPerformance[]>> => {
  const queryParams = new URLSearchParams();
  
  if (params?.fromDate) {
    queryParams.append('fromDate', params.fromDate);
  }
  if (params?.toDate) {
    queryParams.append('toDate', params.toDate);
  }
  if (params?.departmentId) {
    queryParams.append('departmentId', params.departmentId.toString());
  }

  const url = `/reports/departments/performance${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  const response = await api.get<ApiResponse<DepartmentPerformance[]>>(url);
  return response.data;
};



