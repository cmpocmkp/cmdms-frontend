/**
 * CM Remarks Service
 * API integration following API_INTEGRATION_GUIDE.md
 * 
 * Base URL: https://cmdms-backend-production.up.railway.app
 * API Base Path: /api
 * 
 * Endpoints:
 * - GET /api/cm-remarks - List CM remarks
 * - GET /api/cm-remarks/:id - Get CM remark
 * - POST /api/cm-remarks - Create CM remark
 * - PATCH /api/cm-remarks/:id - Update CM remark
 * - DELETE /api/cm-remarks/:id - Delete CM remark
 */

import { api } from '../api';
import type { ApiResponse, PaginatedResponse } from '../../types/api';

// ============================================================================
// Types
// ============================================================================

export interface CMRemark {
  id: number;
  subject: string;
  remark?: string;
  priority?: string;
  deadline?: string;
  status?: number | string;
  departmentIds?: number[];
  createdAt?: string;
  updatedAt?: string;
  departments?: Array<{
    id: number;
    name: string;
    pivot?: {
      status?: number | string;
      remarks?: string;
    };
  }>;
}

export interface ListCMRemarksParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  priority?: string;
  departmentId?: number;
}

export interface CreateCMRemarkRequest {
  subject: string;
  remark?: string;
  priority?: string;
  deadline?: string;
  departmentIds?: number[];
}

export interface UpdateCMRemarkRequest {
  subject?: string;
  remark?: string;
  priority?: string;
  deadline?: string;
  status?: number | string;
  departmentIds?: number[];
}

// ============================================================================
// CM Remark Operations
// ============================================================================

/**
 * List CM remarks
 * GET /api/cm-remarks
 */
export const listCMRemarks = async (
  params?: ListCMRemarksParams
): Promise<PaginatedResponse<CMRemark>> => {
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
  if (params?.priority) {
    queryParams.append('priority', params.priority);
  }
  if (params?.departmentId) {
    queryParams.append('departmentId', params.departmentId.toString());
  }

  const url = `/cm-remarks${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  const response = await api.get<PaginatedResponse<CMRemark>>(url);
  return response.data;
};

/**
 * Get CM remark by ID
 * GET /api/cm-remarks/:id
 */
export const getCMRemark = async (id: number): Promise<ApiResponse<CMRemark>> => {
  const response = await api.get<ApiResponse<CMRemark>>(`/cm-remarks/${id}`);
  return response.data;
};

/**
 * Create CM remark
 * POST /api/cm-remarks
 */
export const createCMRemark = async (
  data: CreateCMRemarkRequest
): Promise<ApiResponse<CMRemark>> => {
  const response = await api.post<ApiResponse<CMRemark>>('/cm-remarks', data);
  return response.data;
};

/**
 * Update CM remark
 * PATCH /api/cm-remarks/:id
 */
export const updateCMRemark = async (
  id: number,
  data: UpdateCMRemarkRequest
): Promise<ApiResponse<CMRemark>> => {
  const response = await api.patch<ApiResponse<CMRemark>>(`/cm-remarks/${id}`, data);
  return response.data;
};

/**
 * Delete CM remark
 * DELETE /api/cm-remarks/:id
 */
export const deleteCMRemark = async (id: number): Promise<ApiResponse<void>> => {
  const response = await api.delete<ApiResponse<void>>(`/cm-remarks/${id}`);
  return response.data;
};

