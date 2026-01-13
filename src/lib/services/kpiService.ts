/**
 * KPI Service
 * API integration following API_INTEGRATION_GUIDE.md
 * 
 * Base URL: https://cmdms-backend-production.up.railway.app
 * API Base Path: /api
 * 
 * Endpoints:
 * - GET /api/kpi - List KPIs
 * - GET /api/kpi/:id - Get KPI
 * - POST /api/kpi - Create KPI
 * - PATCH /api/kpi/:id - Update KPI
 * - DELETE /api/kpi/:id - Delete KPI
 * - POST /api/kpi/:id/data - Add KPI data
 * - GET /api/kpi/:id/data - Get KPI data
 */

import { api } from '../api';
import type { ApiResponse, PaginatedResponse } from '../../types/api';

// ============================================================================
// Types
// ============================================================================

export interface KPI {
  id: number;
  name?: string;
  description?: string;
  target?: number;
  unit?: string;
  departmentId?: number;
  createdAt?: string;
  updatedAt?: string;
  department?: {
    id: number;
    name: string;
  };
}

export interface KPIData {
  id?: number;
  kpiId: number;
  value?: number;
  date?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ListKPIsParams {
  page?: number;
  perPage?: number;
  departmentId?: number;
}

export interface GetKPIDataParams {
  fromDate?: string;
  toDate?: string;
}

export interface CreateKPIRequest {
  name?: string;
  description?: string;
  target?: number;
  unit?: string;
  departmentId?: number;
}

export interface UpdateKPIRequest {
  name?: string;
  description?: string;
  target?: number;
  unit?: string;
  departmentId?: number;
}

export interface AddKPIDataRequest {
  value?: number;
  date?: string;
  notes?: string;
}

// ============================================================================
// API Functions
// ============================================================================

/**
 * List KPIs with pagination and filters
 */
export const listKPIs = async (
  params?: ListKPIsParams
): Promise<PaginatedResponse<KPI>> => {
  const queryParams = new URLSearchParams();
  
  if (params?.page) {
    queryParams.append('page', params.page.toString());
  }
  if (params?.perPage) {
    queryParams.append('perPage', params.perPage.toString());
  }
  if (params?.departmentId) {
    queryParams.append('departmentId', params.departmentId.toString());
  }

  const url = `/kpi${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  const response = await api.get<ApiResponse<PaginatedResponse<KPI>>>(url);
  return response.data.data;
};

/**
 * Get a single KPI by ID
 */
export const getKPI = async (id: number): Promise<KPI> => {
  const response = await api.get<ApiResponse<KPI>>(`/kpi/${id}`);
  return response.data.data;
};

/**
 * Create a new KPI
 */
export const createKPI = async (
  data: CreateKPIRequest
): Promise<KPI> => {
  const response = await api.post<ApiResponse<KPI>>('/kpi', data);
  return response.data.data;
};

/**
 * Update a KPI
 */
export const updateKPI = async (
  id: number,
  data: UpdateKPIRequest
): Promise<KPI> => {
  const response = await api.patch<ApiResponse<KPI>>(`/kpi/${id}`, data);
  return response.data.data;
};

/**
 * Delete a KPI
 */
export const deleteKPI = async (id: number): Promise<void> => {
  await api.delete(`/kpi/${id}`);
};

/**
 * Add KPI data
 */
export const addKPIData = async (
  id: number,
  data: AddKPIDataRequest
): Promise<KPIData> => {
  const response = await api.post<ApiResponse<KPIData>>(`/kpi/${id}/data`, data);
  return response.data.data;
};

/**
 * Get KPI data
 */
export const getKPIData = async (
  id: number,
  params?: GetKPIDataParams
): Promise<KPIData[]> => {
  const queryParams = new URLSearchParams();
  
  if (params?.fromDate) {
    queryParams.append('fromDate', params.fromDate);
  }
  if (params?.toDate) {
    queryParams.append('toDate', params.toDate);
  }

  const url = `/kpi/${id}/data${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  const response = await api.get<ApiResponse<KPIData[]>>(url);
  return response.data.data;
};

