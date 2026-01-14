/**
 * Public Days Service
 * API integration following API_INTEGRATION_GUIDE.md
 * 
 * Base URL: https://cmdms-backend-production.up.railway.app
 * API Base Path: /api
 * 
 * Endpoints:
 * - GET /api/public-days - List public days
 * - GET /api/public-days/stats - Get public day stats
 * - GET /api/public-days/:id - Get public day
 * - POST /api/public-days - Create public day
 * - PATCH /api/public-days/:id - Update public day
 * - DELETE /api/public-days/:id - Delete public day
 */

import { api } from '../api';
import type { ApiResponse, PaginatedResponse } from '../../types/api';

// ============================================================================
// Types
// ============================================================================

export interface PublicDay {
  id: number;
  date: string;
  venue?: string;
  districtId?: number;
  status?: string; // e.g., "pending", "scheduled", "completed", "cancelled"
  createdAt?: string;
  updatedAt?: string;
  district?: {
    id: number;
    name: string;
  };
}

export interface PublicDayStats {
  total?: number;
  scheduled?: number;
  completed?: number;
  cancelled?: number;
  pending?: number;
  [key: string]: any;
}

export interface ListPublicDaysParams {
  page?: number;
  perPage?: number;
  status?: string;
  districtId?: number;
  fromDate?: string;
  toDate?: string;
}

export interface CreatePublicDayRequest {
  date: string;
  venue?: string;
  districtId?: number;
}

export interface UpdatePublicDayRequest {
  date?: string;
  venue?: string;
  districtId?: number;
  status?: string;
}

// ============================================================================
// API Functions
// ============================================================================

/**
 * List public days with pagination and filters
 */
export const listPublicDays = async (
  params?: ListPublicDaysParams
): Promise<PaginatedResponse<PublicDay>> => {
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
  if (params?.districtId) {
    queryParams.append('districtId', params.districtId.toString());
  }
  if (params?.fromDate) {
    queryParams.append('fromDate', params.fromDate);
  }
  if (params?.toDate) {
    queryParams.append('toDate', params.toDate);
  }

  const url = `/public-days${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  const response = await api.get<ApiResponse<PaginatedResponse<PublicDay>>>(url);
  return response.data.data;
};

/**
 * Get public day statistics
 */
export const getPublicDayStats = async (): Promise<PublicDayStats> => {
  const response = await api.get<ApiResponse<PublicDayStats>>('/public-days/stats');
  return response.data.data;
};

/**
 * Get a single public day by ID
 */
export const getPublicDay = async (id: number): Promise<PublicDay> => {
  const response = await api.get<ApiResponse<PublicDay>>(`/public-days/${id}`);
  return response.data.data;
};

/**
 * Create a new public day
 */
export const createPublicDay = async (
  data: CreatePublicDayRequest
): Promise<PublicDay> => {
  const response = await api.post<ApiResponse<PublicDay>>('/public-days', data);
  return response.data.data;
};

/**
 * Update a public day
 */
export const updatePublicDay = async (
  id: number,
  data: UpdatePublicDayRequest
): Promise<PublicDay> => {
  const response = await api.patch<ApiResponse<PublicDay>>(`/public-days/${id}`, data);
  return response.data.data;
};

/**
 * Delete a public day
 */
export const deletePublicDay = async (id: number): Promise<void> => {
  await api.delete(`/public-days/${id}`);
};



