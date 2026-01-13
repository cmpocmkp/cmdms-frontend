/**
 * Welfare Service
 * API integration following API_INTEGRATION_GUIDE.md
 * 
 * Base URL: https://cmdms-backend-production.up.railway.app
 * API Base Path: /api
 * 
 * Endpoints:
 * - GET /api/welfare - List welfare cases
 * - GET /api/welfare/:id - Get welfare case
 * - POST /api/welfare - Create welfare case
 * - PATCH /api/welfare/:id - Update welfare case
 * - DELETE /api/welfare/:id - Delete welfare case
 */

import { api } from '../api';
import type { ApiResponse, PaginatedResponse } from '../../types/api';

// ============================================================================
// Types
// ============================================================================

export interface WelfareCase {
  id: number;
  applicantName: string;
  cnic?: string;
  caseType?: string; // e.g., "medical"
  description?: string;
  districtId?: number;
  status?: string; // e.g., "approved", "pending", "rejected"
  createdAt?: string;
  updatedAt?: string;
  district?: {
    id: number;
    name: string;
  };
}

export interface ListWelfareCasesParams {
  page?: number;
  perPage?: number;
  status?: string;
  caseType?: string;
  districtId?: number;
}

export interface CreateWelfareCaseRequest {
  applicantName: string;
  cnic?: string;
  caseType?: string; // e.g., "medical"
  description?: string;
  districtId?: number;
}

export interface UpdateWelfareCaseRequest {
  status?: string; // e.g., "approved", "pending", "rejected"
  applicantName?: string;
  cnic?: string;
  caseType?: string;
  description?: string;
  districtId?: number;
}

// ============================================================================
// API Functions
// ============================================================================

/**
 * List welfare cases with pagination and filters
 */
export const listWelfareCases = async (
  params?: ListWelfareCasesParams
): Promise<PaginatedResponse<WelfareCase>> => {
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
  if (params?.caseType) {
    queryParams.append('caseType', params.caseType);
  }
  if (params?.districtId) {
    queryParams.append('districtId', params.districtId.toString());
  }

  const url = `/welfare${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  const response = await api.get<ApiResponse<PaginatedResponse<WelfareCase>>>(url);
  return response.data.data;
};

/**
 * Get a single welfare case by ID
 */
export const getWelfareCase = async (id: number): Promise<WelfareCase> => {
  const response = await api.get<ApiResponse<WelfareCase>>(`/welfare/${id}`);
  return response.data.data;
};

/**
 * Create a new welfare case
 */
export const createWelfareCase = async (
  data: CreateWelfareCaseRequest
): Promise<WelfareCase> => {
  const response = await api.post<ApiResponse<WelfareCase>>('/welfare', data);
  return response.data.data;
};

/**
 * Update a welfare case
 */
export const updateWelfareCase = async (
  id: number,
  data: UpdateWelfareCaseRequest
): Promise<WelfareCase> => {
  const response = await api.patch<ApiResponse<WelfareCase>>(`/welfare/${id}`, data);
  return response.data.data;
};

/**
 * Delete a welfare case
 */
export const deleteWelfareCase = async (id: number): Promise<void> => {
  await api.delete(`/welfare/${id}`);
};


