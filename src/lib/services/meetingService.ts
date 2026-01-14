/**
 * Meetings Service
 * API integration following API_INTEGRATION_GUIDE.md
 * 
 * Base URL: https://cmdms-backend-production.up.railway.app
 * API Base Path: /api
 * 
 * Endpoints:
 * - GET /api/meetings - List meetings
 * - GET /api/meetings/:id - Get meeting
 * - POST /api/meetings - Create meeting
 * - PATCH /api/meetings/:id - Update meeting
 * - DELETE /api/meetings/:id - Delete meeting
 */

import { api } from '../api';
import type { ApiResponse, PaginatedResponse } from '../../types/api';

// ============================================================================
// Types
// ============================================================================

export interface Meeting {
  id: number;
  title: string;
  date: string; // API format: "2024-01-15"
  type?: string; // e.g., "cabinet"
  venue?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ListMeetingsParams {
  page?: number;
  limit?: number;
  search?: string;
  type?: string;
}

export interface CreateMeetingRequest {
  title: string;
  date: string; // Format: "2024-02-15"
  type?: string; // e.g., "cabinet"
  venue?: string;
}

export interface UpdateMeetingRequest {
  title?: string;
  date?: string;
  type?: string;
  venue?: string;
}

// ============================================================================
// Meeting Operations
// ============================================================================

/**
 * List meetings
 * GET /api/meetings
 */
export const listMeetings = async (
  params?: ListMeetingsParams
): Promise<PaginatedResponse<Meeting>> => {
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
  if (params?.type) {
    queryParams.append('type', params.type);
  }

  const url = `/meetings${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  const response = await api.get<PaginatedResponse<Meeting>>(url);
  return response.data;
};

/**
 * Get meeting by ID
 * GET /api/meetings/:id
 */
export const getMeeting = async (id: number): Promise<ApiResponse<Meeting>> => {
  const response = await api.get<ApiResponse<Meeting>>(`/meetings/${id}`);
  return response.data;
};

/**
 * Create meeting
 * POST /api/meetings
 */
export const createMeeting = async (
  data: CreateMeetingRequest
): Promise<ApiResponse<Meeting>> => {
  const response = await api.post<ApiResponse<Meeting>>('/meetings', data);
  return response.data;
};

/**
 * Update meeting
 * PATCH /api/meetings/:id
 */
export const updateMeeting = async (
  id: number,
  data: UpdateMeetingRequest
): Promise<ApiResponse<Meeting>> => {
  const response = await api.patch<ApiResponse<Meeting>>(`/meetings/${id}`, data);
  return response.data;
};

/**
 * Delete meeting
 * DELETE /api/meetings/:id
 */
export const deleteMeeting = async (id: number): Promise<ApiResponse<void>> => {
  const response = await api.delete<ApiResponse<void>>(`/meetings/${id}`);
  return response.data;
};



