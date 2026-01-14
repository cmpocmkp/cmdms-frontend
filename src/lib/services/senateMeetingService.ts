/**
 * Senate Meetings Service
 * API integration following API_INTEGRATION_GUIDE.md
 * 
 * Base URL: https://cmdms-backend-production.up.railway.app
 * API Base Path: /api
 * 
 * Endpoints:
 * - GET /api/senate-meetings - List senate meetings
 * - GET /api/senate-meetings/:id - Get senate meeting
 * - POST /api/senate-meetings - Create senate meeting
 * - PATCH /api/senate-meetings/:id - Update senate meeting
 * - DELETE /api/senate-meetings/:id - Delete senate meeting
 */

import { api } from '../api';
import type { ApiResponse, PaginatedResponse } from '../../types/api';

// ============================================================================
// Types
// ============================================================================

export interface SenateMeeting {
  id: number;
  title: string;
  date?: string;
  createdAt?: string;
  updatedAt?: string;
  departments?: Array<{
    id: number;
    name: string;
  }>;
}

export interface ListSenateMeetingsParams {
  page?: number;
  limit?: number;
  search?: string;
  departmentId?: number;
}

export interface CreateSenateMeetingRequest {
  title: string;
  date?: string;
}

export interface UpdateSenateMeetingRequest {
  title?: string;
  date?: string;
}

// ============================================================================
// Senate Meeting Operations
// ============================================================================

/**
 * List senate meetings
 * GET /api/senate-meetings
 */
export const listSenateMeetings = async (
  params?: ListSenateMeetingsParams
): Promise<PaginatedResponse<SenateMeeting>> => {
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
  if (params?.departmentId) {
    queryParams.append('departmentId', params.departmentId.toString());
  }

  const url = `/senate-meetings${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  const response = await api.get<PaginatedResponse<SenateMeeting>>(url);
  return response.data;
};

/**
 * Get senate meeting by ID
 * GET /api/senate-meetings/:id
 */
export const getSenateMeeting = async (id: number): Promise<ApiResponse<SenateMeeting>> => {
  const response = await api.get<ApiResponse<SenateMeeting>>(`/senate-meetings/${id}`);
  return response.data;
};

/**
 * Create senate meeting
 * POST /api/senate-meetings
 */
export const createSenateMeeting = async (
  data: CreateSenateMeetingRequest
): Promise<ApiResponse<SenateMeeting>> => {
  const response = await api.post<ApiResponse<SenateMeeting>>('/senate-meetings', data);
  return response.data;
};

/**
 * Update senate meeting
 * PATCH /api/senate-meetings/:id
 */
export const updateSenateMeeting = async (
  id: number,
  data: UpdateSenateMeetingRequest
): Promise<ApiResponse<SenateMeeting>> => {
  const response = await api.patch<ApiResponse<SenateMeeting>>(`/senate-meetings/${id}`, data);
  return response.data;
};

/**
 * Delete senate meeting
 * DELETE /api/senate-meetings/:id
 */
export const deleteSenateMeeting = async (id: number): Promise<ApiResponse<void>> => {
  const response = await api.delete<ApiResponse<void>>(`/senate-meetings/${id}`);
  return response.data;
};

