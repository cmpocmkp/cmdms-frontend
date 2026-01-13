/**
 * Schemes Service
 * API integration following API_INTEGRATION_GUIDE.md
 * 
 * Base URL: https://cmdms-backend-production.up.railway.app
 * API Base Path: /api
 * 
 * Endpoints:
 * - GET /api/schemes - List schemes
 * - GET /api/schemes/:id - Get scheme
 * - POST /api/schemes - Create scheme
 * - PATCH /api/schemes/:id - Update scheme
 * - DELETE /api/schemes/:id - Delete scheme
 * - POST /api/schemes/:id/costing - Add scheme costing
 * - POST /api/schemes/:id/budget - Add scheme budget
 * - POST /api/schemes/:id/expenditure - Add scheme expenditure
 * - POST /api/schemes/:id/revision - Add scheme revision
 */

import { api } from '../api';
import type { ApiResponse, PaginatedResponse } from '../../types/api';

// ============================================================================
// Types
// ============================================================================

export interface Scheme {
  id: number;
  name: string;
  code?: string;
  sector?: string;
  estimatedCost?: number;
  status?: string;
  departmentId?: number;
  department?: {
    id: number;
    name: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface ListSchemesParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  year?: number;
  departmentId?: number;
  sector?: string;
}

export interface CreateSchemeRequest {
  name: string;
  code?: string;
  sector?: string;
  estimatedCost?: number;
  departmentId?: number;
}

export interface UpdateSchemeRequest {
  name?: string;
  code?: string;
  sector?: string;
  estimatedCost?: number;
  status?: string;
  departmentId?: number;
}

export interface AddSchemeCostingRequest {
  costBreakdown: {
    labor?: number;
    materials?: number;
    overhead?: number;
    [key: string]: number | undefined;
  };
}

export interface AddSchemeBudgetRequest {
  allocatedAmount: number;
  financialYear: string;
}

export interface AddSchemeExpenditureRequest {
  amount: number;
  description?: string;
  date?: string;
}

export interface AddSchemeRevisionRequest {
  revisedCost: number;
  reason?: string;
}

// ============================================================================
// Scheme Operations
// ============================================================================

/**
 * List schemes
 * GET /api/schemes
 */
export const listSchemes = async (
  params?: ListSchemesParams
): Promise<PaginatedResponse<Scheme>> => {
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
  if (params?.year) {
    queryParams.append('year', params.year.toString());
  }
  if (params?.departmentId) {
    queryParams.append('departmentId', params.departmentId.toString());
  }
  if (params?.sector) {
    queryParams.append('sector', params.sector);
  }

  const url = `/schemes${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  const response = await api.get<PaginatedResponse<Scheme>>(url);
  return response.data;
};

/**
 * Get scheme by ID
 * GET /api/schemes/:id
 */
export const getScheme = async (id: number): Promise<ApiResponse<Scheme>> => {
  const response = await api.get<ApiResponse<Scheme>>(`/schemes/${id}`);
  return response.data;
};

/**
 * Create scheme
 * POST /api/schemes
 */
export const createScheme = async (
  data: CreateSchemeRequest
): Promise<ApiResponse<Scheme>> => {
  const response = await api.post<ApiResponse<Scheme>>('/schemes', data);
  return response.data;
};

/**
 * Update scheme
 * PATCH /api/schemes/:id
 */
export const updateScheme = async (
  id: number,
  data: UpdateSchemeRequest
): Promise<ApiResponse<Scheme>> => {
  const response = await api.patch<ApiResponse<Scheme>>(`/schemes/${id}`, data);
  return response.data;
};

/**
 * Delete scheme
 * DELETE /api/schemes/:id
 */
export const deleteScheme = async (id: number): Promise<ApiResponse<void>> => {
  const response = await api.delete<ApiResponse<void>>(`/schemes/${id}`);
  return response.data;
};

/**
 * Add scheme costing
 * POST /api/schemes/:id/costing
 */
export const addSchemeCosting = async (
  schemeId: number,
  data: AddSchemeCostingRequest
): Promise<ApiResponse<any>> => {
  const response = await api.post<ApiResponse<any>>(`/schemes/${schemeId}/costing`, data);
  return response.data;
};

/**
 * Add scheme budget
 * POST /api/schemes/:id/budget
 */
export const addSchemeBudget = async (
  schemeId: number,
  data: AddSchemeBudgetRequest
): Promise<ApiResponse<any>> => {
  const response = await api.post<ApiResponse<any>>(`/schemes/${schemeId}/budget`, data);
  return response.data;
};

/**
 * Add scheme expenditure
 * POST /api/schemes/:id/expenditure
 */
export const addSchemeExpenditure = async (
  schemeId: number,
  data: AddSchemeExpenditureRequest
): Promise<ApiResponse<any>> => {
  const response = await api.post<ApiResponse<any>>(`/schemes/${schemeId}/expenditure`, data);
  return response.data;
};

/**
 * Add scheme revision
 * POST /api/schemes/:id/revision
 */
export const addSchemeRevision = async (
  schemeId: number,
  data: AddSchemeRevisionRequest
): Promise<ApiResponse<any>> => {
  const response = await api.post<ApiResponse<any>>(`/schemes/${schemeId}/revision`, data);
  return response.data;
};

