/**
 * Summaries for CM Service
 * API integration following API_INTEGRATION_GUIDE.md
 * 
 * Base URL: https://cmdms-backend-production.up.railway.app
 * API Base Path: /api
 * 
 * Endpoints:
 * - GET /api/summaries - List summaries
 * - GET /api/summaries/:id - Get summary details
 * - POST /api/summaries - Create summary
 * - PATCH /api/summaries/:id - Update summary
 * - DELETE /api/summaries/:id - Delete summary
 * - GET /api/summaries/:id/tasks - List summary tasks
 * - POST /api/summaries/:id/tasks - Create summary task
 * - PATCH /api/summaries/:id/tasks/:taskId - Update summary task
 * - DELETE /api/summaries/:id/tasks/:taskId - Delete summary task
 * - GET /api/summaries/:id/replies - Get summary replies
 * - POST /api/summaries/:id/replies - Create summary reply
 */

import { api } from '../api';
import type { ApiResponse, PaginatedResponse } from '../../types/api';

// ============================================================================
// Types
// ============================================================================

export interface Summary {
  id: number;
  referenceNumber: string;
  subject: string;
  description?: string;
  date: string;
  initiatorDepartmentId: number;
  initiatorDepartment?: {
    id: number;
    name: string;
  };
  status: number;
  priority?: string;
  createdAt?: string;
  updatedAt?: string;
  tasks?: SummaryTask[];
  attachments?: Array<{
    id: number;
    originalName: string;
    fileName: string;
    url: string;
  }>;
  replies?: SummaryReply[];
}

export interface SummaryTask {
  id: number;
  title: string;
  description?: string;
  departmentId: number;
  department?: {
    id: number;
    name: string;
  };
  status: number;
  progress?: number;
  timeline?: string;
  deadline?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SummaryReply {
  id: number;
  content: string;
  userId: number;
  user?: {
    id: number;
    name: string;
  };
  attachments?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ListSummariesParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: number | string;
  departmentId?: number;
  priority?: string;
  fromDate?: string;
  toDate?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateSummaryRequest {
  referenceNumber: string;
  subject: string;
  description?: string;
  date: string;
  initiatorDepartmentId: number;
  priority?: string;
  departmentIds?: number[];
  tasks?: Array<{
    title: string;
    description?: string;
    departmentId: number;
    timeline?: string;
    deadline?: string;
  }>;
}

export interface UpdateSummaryRequest {
  subject?: string;
  description?: string;
  status?: number;
  priority?: string;
  date?: string;
  departmentIds?: number[];
}

export interface CreateSummaryTaskRequest {
  title: string;
  description?: string;
  departmentId: number;
  timeline?: string;
  deadline?: string;
}

export interface UpdateSummaryTaskRequest {
  title?: string;
  description?: string;
  status?: number;
  progress?: number;
  timeline?: string;
  deadline?: string;
}

export interface CreateSummaryReplyRequest {
  content: string;
  attachments?: string[];
}

// ============================================================================
// Summary Operations
// ============================================================================

/**
 * List summaries
 * GET /api/summaries
 */
export const listSummaries = async (
  params?: ListSummariesParams
): Promise<PaginatedResponse<Summary>> => {
  const queryParams = new URLSearchParams();
  
  if (params?.page) {
    queryParams.append('page', params.page.toString());
  }
  if (params?.limit) {
    queryParams.append('limit', params.limit.toString());
  }
  if (params?.search) {
    queryParams.append('search', params.search);
  }
  if (params?.status !== undefined) {
    queryParams.append('status', params.status.toString());
  }
  if (params?.departmentId) {
    queryParams.append('departmentId', params.departmentId.toString());
  }
  if (params?.priority) {
    queryParams.append('priority', params.priority);
  }
  if (params?.fromDate) {
    queryParams.append('fromDate', params.fromDate);
  }
  if (params?.toDate) {
    queryParams.append('toDate', params.toDate);
  }
  if (params?.sortBy) {
    queryParams.append('sortBy', params.sortBy);
  }
  if (params?.sortOrder) {
    queryParams.append('sortOrder', params.sortOrder);
  }

  const url = `/summaries${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  const response = await api.get<PaginatedResponse<Summary>>(url);
  return response.data;
};

/**
 * Get summary by ID
 * GET /api/summaries/:id
 */
export const getSummary = async (id: number): Promise<ApiResponse<Summary>> => {
  const response = await api.get<ApiResponse<Summary>>(`/summaries/${id}`);
  return response.data;
};

/**
 * Create summary
 * POST /api/summaries
 */
export const createSummary = async (
  data: CreateSummaryRequest
): Promise<ApiResponse<Summary>> => {
  const response = await api.post<ApiResponse<Summary>>('/summaries', data);
  return response.data;
};

/**
 * Update summary
 * PATCH /api/summaries/:id
 */
export const updateSummary = async (
  id: number,
  data: UpdateSummaryRequest
): Promise<ApiResponse<Summary>> => {
  const response = await api.patch<ApiResponse<Summary>>(`/summaries/${id}`, data);
  return response.data;
};

/**
 * Delete summary
 * DELETE /api/summaries/:id
 */
export const deleteSummary = async (id: number): Promise<ApiResponse<void>> => {
  const response = await api.delete<ApiResponse<void>>(`/summaries/${id}`);
  return response.data;
};

// ============================================================================
// Summary Tasks Operations
// ============================================================================

/**
 * List summary tasks
 * GET /api/summaries/:id/tasks
 */
export const listSummaryTasks = async (
  summaryId: number
): Promise<ApiResponse<SummaryTask[]>> => {
  const response = await api.get<ApiResponse<SummaryTask[]>>(`/summaries/${summaryId}/tasks`);
  return response.data;
};

/**
 * Create summary task
 * POST /api/summaries/:id/tasks
 */
export const createSummaryTask = async (
  summaryId: number,
  data: CreateSummaryTaskRequest
): Promise<ApiResponse<SummaryTask>> => {
  const response = await api.post<ApiResponse<SummaryTask>>(
    `/summaries/${summaryId}/tasks`,
    data
  );
  return response.data;
};

/**
 * Update summary task
 * PATCH /api/summaries/:id/tasks/:taskId
 */
export const updateSummaryTask = async (
  summaryId: number,
  taskId: number,
  data: UpdateSummaryTaskRequest
): Promise<ApiResponse<SummaryTask>> => {
  const response = await api.patch<ApiResponse<SummaryTask>>(
    `/summaries/${summaryId}/tasks/${taskId}`,
    data
  );
  return response.data;
};

/**
 * Delete summary task
 * DELETE /api/summaries/:id/tasks/:taskId
 */
export const deleteSummaryTask = async (
  summaryId: number,
  taskId: number
): Promise<ApiResponse<void>> => {
  const response = await api.delete<ApiResponse<void>>(
    `/summaries/${summaryId}/tasks/${taskId}`
  );
  return response.data;
};

// ============================================================================
// Summary Replies Operations
// ============================================================================

/**
 * Get summary replies
 * GET /api/summaries/:id/replies
 */
export const getSummaryReplies = async (
  summaryId: number
): Promise<ApiResponse<SummaryReply[]>> => {
  const response = await api.get<ApiResponse<SummaryReply[]>>(`/summaries/${summaryId}/replies`);
  return response.data;
};

/**
 * Create summary reply
 * POST /api/summaries/:id/replies
 */
export const createSummaryReply = async (
  summaryId: number,
  data: CreateSummaryReplyRequest
): Promise<ApiResponse<SummaryReply>> => {
  const response = await api.post<ApiResponse<SummaryReply>>(
    `/summaries/${summaryId}/replies`,
    data
  );
  return response.data;
};

