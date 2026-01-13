/**
 * Sectoral Meetings Service
 * API integration following API_INTEGRATION_GUIDE.md
 * 
 * Base URL: https://cmdms-backend-production.up.railway.app
 * API Base Path: /api
 * 
 * Endpoints:
 * - GET /api/sectorial-meetings - List sectoral meetings
 * - GET /api/sectorial-meetings/:id - Get sectoral meeting
 * - POST /api/sectorial-meetings - Create sectoral meeting
 * - PATCH /api/sectorial-meetings/:id - Update sectoral meeting
 * - DELETE /api/sectorial-meetings/:id - Delete sectoral meeting
 */

import { api } from '../api';
import type { ApiResponse, PaginatedResponse } from '../../types/api';

// ============================================================================
// Types
// ============================================================================

export interface SectoralMeeting {
  id: number;
  title: string;
  date?: string;
  sector?: string;
  createdAt?: string;
  updatedAt?: string;
  departments?: Array<{
    id: number;
    name: string;
  }>;
}

export interface ListSectoralMeetingsParams {
  page?: number;
  limit?: number;
  search?: string;
  sector?: string;
  departmentId?: number;
}

export interface CreateSectoralMeetingRequest {
  title: string;
  date?: string;
  sector?: string;
}

export interface UpdateSectoralMeetingRequest {
  title?: string;
  date?: string;
  sector?: string;
}

// ============================================================================
// Sectoral Meeting Operations
// ============================================================================

/**
 * List sectoral meetings
 * GET /api/sectorial-meetings
 */
export const listSectoralMeetings = async (
  params?: ListSectoralMeetingsParams
): Promise<PaginatedResponse<SectoralMeeting>> => {
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
  if (params?.sector) {
    queryParams.append('sector', params.sector);
  }
  if (params?.departmentId) {
    queryParams.append('departmentId', params.departmentId.toString());
  }

  const url = `/sectorial-meetings${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  const response = await api.get<PaginatedResponse<SectoralMeeting>>(url);
  return response.data;
};

/**
 * Get sectoral meeting by ID
 * GET /api/sectorial-meetings/:id
 */
export const getSectoralMeeting = async (id: number): Promise<ApiResponse<SectoralMeeting>> => {
  const response = await api.get<ApiResponse<SectoralMeeting>>(`/sectorial-meetings/${id}`);
  return response.data;
};

/**
 * Create sectoral meeting
 * POST /api/sectorial-meetings
 */
export const createSectoralMeeting = async (
  data: CreateSectoralMeetingRequest
): Promise<ApiResponse<SectoralMeeting>> => {
  const response = await api.post<ApiResponse<SectoralMeeting>>('/sectorial-meetings', data);
  return response.data;
};

/**
 * Update sectoral meeting
 * PATCH /api/sectorial-meetings/:id
 */
export const updateSectoralMeeting = async (
  id: number,
  data: UpdateSectoralMeetingRequest
): Promise<ApiResponse<SectoralMeeting>> => {
  const response = await api.patch<ApiResponse<SectoralMeeting>>(`/sectorial-meetings/${id}`, data);
  return response.data;
};

/**
 * Delete sectoral meeting
 * DELETE /api/sectorial-meetings/:id
 */
export const deleteSectoralMeeting = async (id: number): Promise<ApiResponse<void>> => {
  const response = await api.delete<ApiResponse<void>>(`/sectorial-meetings/${id}`);
  return response.data;
};

