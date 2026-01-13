/**
 * Directives Service
 * API integration following API_INTEGRATION_GUIDE.md
 * 
 * Base URL: https://cmdms-backend-production.up.railway.app
 * API Base Path: /api
 * 
 * Endpoints:
 * - GET /api/directives - List directives
 * - GET /api/directives/:id - Get directive
 * - POST /api/directives - Create directive
 * - PATCH /api/directives/:id - Update directive
 * - DELETE /api/directives/:id - Delete directive
 * - POST /api/directives/:id/responses - Create directive response
 */

import { api } from '../api';
import type { ApiResponse, PaginatedResponse } from '../../types/api';

// ============================================================================
// Types
// ============================================================================

export interface Directive {
  id: number;
  title: string;
  description?: string;
  referenceNumber?: string;
  priority?: string;
  deadline?: string; // API uses "deadline" not "dueDate"
  status?: number | string; // API returns number (1, 2, 3) or string
  assignedTo?: number;
  departmentId?: number;
  departmentIds?: number[]; // For create/update
  createdAt?: string;
  updatedAt?: string;
  departments?: Array<{
    id: number;
    name: string;
  }>;
  responses?: DirectiveResponse[];
}

export interface DirectiveResponse {
  id: number;
  directiveId: number;
  departmentId: number;
  response: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
  department?: {
    id: number;
    name: string;
  };
}

export interface ListDirectivesParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  departmentId?: number;
  priority?: string;
}

export interface CreateDirectiveRequest {
  title: string;
  description?: string;
  referenceNumber?: string;
  priority?: string;
  deadline?: string; // API uses "deadline"
  assignedTo?: number;
  departmentId?: number;
  departmentIds?: number[]; // API accepts array of department IDs
}

export interface UpdateDirectiveRequest {
  title?: string;
  description?: string;
  referenceNumber?: string;
  priority?: string;
  status?: number | string; // API accepts number (1, 2, 3) or string
  deadline?: string; // API uses "deadline"
  assignedTo?: number;
  departmentId?: number;
  departmentIds?: number[]; // API accepts array of department IDs
}

export interface CreateDirectiveResponseRequest {
  content: string; // API uses "content" not "response"
  status?: number | string; // API accepts number (1, 2, 3) or string
  progress?: number; // Optional progress percentage
}

// ============================================================================
// Directive Operations
// ============================================================================

/**
 * List directives
 * GET /api/directives
 */
export const listDirectives = async (
  params?: ListDirectivesParams
): Promise<PaginatedResponse<Directive>> => {
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
  if (params?.status) {
    queryParams.append('status', params.status);
  }
  if (params?.departmentId) {
    queryParams.append('departmentId', params.departmentId.toString());
  }
  if (params?.priority) {
    queryParams.append('priority', params.priority);
  }

  const url = `/directives${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  const response = await api.get<PaginatedResponse<Directive>>(url);
  return response.data;
};

/**
 * Get directive by ID
 * GET /api/directives/:id
 */
export const getDirective = async (id: number): Promise<ApiResponse<Directive>> => {
  const response = await api.get<ApiResponse<Directive>>(`/directives/${id}`);
  return response.data;
};

/**
 * Create directive
 * POST /api/directives
 */
export const createDirective = async (
  data: CreateDirectiveRequest
): Promise<ApiResponse<Directive>> => {
  const response = await api.post<ApiResponse<Directive>>('/directives', data);
  return response.data;
};

/**
 * Update directive
 * PATCH /api/directives/:id
 */
export const updateDirective = async (
  id: number,
  data: UpdateDirectiveRequest
): Promise<ApiResponse<Directive>> => {
  const response = await api.patch<ApiResponse<Directive>>(`/directives/${id}`, data);
  return response.data;
};

/**
 * Delete directive
 * DELETE /api/directives/:id
 */
export const deleteDirective = async (id: number): Promise<ApiResponse<void>> => {
  const response = await api.delete<ApiResponse<void>>(`/directives/${id}`);
  return response.data;
};

/**
 * Create directive response
 * POST /api/directives/:id/responses
 */
export const createDirectiveResponse = async (
  directiveId: number,
  data: CreateDirectiveResponseRequest
): Promise<ApiResponse<DirectiveResponse>> => {
  const response = await api.post<ApiResponse<DirectiveResponse>>(
    `/directives/${directiveId}/responses`,
    data
  );
  return response.data;
};

