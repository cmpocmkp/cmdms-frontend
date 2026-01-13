/**
 * Inaugurations Service
 * API integration following API_INTEGRATION_GUIDE.md
 * 
 * Base URL: https://cmdms-backend-production.up.railway.app
 * API Base Path: /api
 * 
 * Endpoints:
 * - GET /api/inaugurations - List inaugurations
 * - GET /api/inaugurations/:id - Get inauguration
 * - POST /api/inaugurations - Create inauguration
 * - PATCH /api/inaugurations/:id - Update inauguration
 * - DELETE /api/inaugurations/:id - Delete inauguration
 */

import { api } from '../api';
import type { ApiResponse, PaginatedResponse } from '../../types/api';

// ============================================================================
// Types
// ============================================================================

export interface Inauguration {
  id: number;
  title: string;
  description?: string;
  date?: string;
  type?: string;
  departmentId?: number;
  districtId?: number;
  projectCost?: number;
  department?: {
    id: number;
    name: string;
  };
  district?: {
    id: number;
    name: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface ListInaugurationsParams {
  page?: number;
  limit?: number;
  search?: string;
  year?: number;
  type?: string;
  departmentId?: number;
  districtId?: number;
}

export interface CreateInaugurationRequest {
  title: string;
  description?: string;
  date?: string;
  type?: string;
  departmentId?: number;
  districtId?: number;
  projectCost?: number;
}

export interface UpdateInaugurationRequest {
  title?: string;
  description?: string;
  date?: string;
  type?: string;
  departmentId?: number;
  districtId?: number;
  projectCost?: number;
}

// ============================================================================
// Inauguration Operations
// ============================================================================

/**
 * List inaugurations
 * GET /api/inaugurations
 */
export const listInaugurations = async (
  params?: ListInaugurationsParams
): Promise<PaginatedResponse<Inauguration>> => {
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
  if (params?.year) {
    queryParams.append('year', params.year.toString());
  }
  if (params?.type) {
    queryParams.append('type', params.type);
  }
  if (params?.departmentId) {
    queryParams.append('departmentId', params.departmentId.toString());
  }
  if (params?.districtId) {
    queryParams.append('districtId', params.districtId.toString());
  }

  const url = `/inaugurations${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  const response = await api.get<PaginatedResponse<Inauguration>>(url);
  return response.data;
};

/**
 * Get inauguration by ID
 * GET /api/inaugurations/:id
 */
export const getInauguration = async (id: number): Promise<ApiResponse<Inauguration>> => {
  const response = await api.get<ApiResponse<Inauguration>>(`/inaugurations/${id}`);
  return response.data;
};

/**
 * Create inauguration
 * POST /api/inaugurations
 */
export const createInauguration = async (
  data: CreateInaugurationRequest
): Promise<ApiResponse<Inauguration>> => {
  const response = await api.post<ApiResponse<Inauguration>>('/inaugurations', data);
  return response.data;
};

/**
 * Update inauguration
 * PATCH /api/inaugurations/:id
 */
export const updateInauguration = async (
  id: number,
  data: UpdateInaugurationRequest
): Promise<ApiResponse<Inauguration>> => {
  const response = await api.patch<ApiResponse<Inauguration>>(`/inaugurations/${id}`, data);
  return response.data;
};

/**
 * Delete inauguration
 * DELETE /api/inaugurations/:id
 */
export const deleteInauguration = async (id: number): Promise<ApiResponse<void>> => {
  const response = await api.delete<ApiResponse<void>>(`/inaugurations/${id}`);
  return response.data;
};

