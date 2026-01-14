/**
 * Issues Service
 * API integration following API_INTEGRATION_GUIDE.md
 * 
 * Base URL: https://cmdms-backend-production.up.railway.app
 * API Base Path: /api
 * 
 * Endpoints:
 * - GET /api/issues - List issues
 * - GET /api/issues/:id - Get issue
 * - POST /api/issues - Create issue
 * - PATCH /api/issues/:id/status - Update issue status
 * - POST /api/issues/:id/assign - Assign issue
 */

import { api } from '../api';
import type { ApiResponse, PaginatedResponse } from '../../types/api';

// ============================================================================
// Types
// ============================================================================

export interface Issue {
  id: number;
  title: string;
  description?: string;
  priority?: string; // "low", "medium", "high"
  districtId?: number;
  status?: string; // "open", "in-progress", "closed", "resolved"
  userId?: number;
  departmentId?: number;
  createdAt?: string;
  updatedAt?: string;
  district?: {
    id: number;
    name: string;
  };
  user?: {
    id: number;
    name: string;
  };
  department?: {
    id: number;
    name: string;
  };
}

export interface ListIssuesParams {
  page?: number;
  perPage?: number;
  status?: string; // "open", "in-progress", "closed", "resolved"
  priority?: string; // "low", "medium", "high"
  districtId?: number;
}

export interface CreateIssueRequest {
  title: string;
  description?: string;
  priority?: string; // "low", "medium", "high"
  districtId?: number;
}

export interface UpdateIssueStatusRequest {
  status: string; // "open", "in-progress", "closed", "resolved"
}

export interface AssignIssueRequest {
  userId?: number;
  departmentId?: number;
}

// ============================================================================
// API Functions
// ============================================================================

/**
 * List issues with pagination and filters
 */
export const listIssues = async (
  params?: ListIssuesParams
): Promise<PaginatedResponse<Issue>> => {
  const queryParams = new URLSearchParams();
  
  if (params?.page) {
    queryParams.append('page', params.page.toString());
  }
  if (params?.perPage) {
    queryParams.append('perPage', params.perPage.toString());
  }
  if (params?.status) {
    queryParams.append('status', params.status);
  }
  if (params?.priority) {
    queryParams.append('priority', params.priority);
  }
  if (params?.districtId) {
    queryParams.append('districtId', params.districtId.toString());
  }

  const url = `/issues${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  const response = await api.get<ApiResponse<PaginatedResponse<Issue>>>(url);
  return response.data.data;
};

/**
 * Get a single issue by ID
 */
export const getIssue = async (id: number): Promise<Issue> => {
  const response = await api.get<ApiResponse<Issue>>(`/issues/${id}`);
  return response.data.data;
};

/**
 * Create a new issue
 */
export const createIssue = async (
  data: CreateIssueRequest
): Promise<Issue> => {
  const response = await api.post<ApiResponse<Issue>>('/issues', data);
  return response.data.data;
};

/**
 * Update issue status
 */
export const updateIssueStatus = async (
  id: number,
  data: UpdateIssueStatusRequest
): Promise<Issue> => {
  const response = await api.patch<ApiResponse<Issue>>(`/issues/${id}/status`, data);
  return response.data.data;
};

/**
 * Assign issue to user/department
 */
export const assignIssue = async (
  id: number,
  data: AssignIssueRequest
): Promise<Issue> => {
  const response = await api.post<ApiResponse<Issue>>(`/issues/${id}/assign`, data);
  return response.data.data;
};



