/**
 * Minutes Service
 * API integration following API_INTEGRATION_GUIDE.md
 * 
 * Base URL: https://cmdms-backend-production.up.railway.app
 * API Base Path: /api
 * 
 * Endpoints:
 * - GET /api/minutes/meeting/:meetingId - List minutes by meeting
 * - GET /api/minutes/:id - Get minute
 * - POST /api/minutes - Create minute
 * - PATCH /api/minutes/:id - Update minute
 * - DELETE /api/minutes/:id - Delete minute
 * - POST /api/minutes/:id/archive - Archive minute
 * - GET /api/minutes/:id/replies - Get minute replies
 * - POST /api/minutes/:id/replies - Create minute reply
 */

import { api } from '../api';
import type { ApiResponse } from '../../types/api';

// ============================================================================
// Types
// ============================================================================

export interface Minute {
  id: number;
  meetingId: number;
  heading?: string;
  issues?: string;
  decisions?: string;
  responsibility?: string;
  timeline?: string; // Format: "2024-06-30"
  status?: number; // 1, 2, 3 (number in API)
  progressHistory?: string;
  departments?: Array<{
    id: number;
    name: string;
  }>;
  replyCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface MinuteReply {
  id: number;
  minuteId: number;
  content: string;
  status?: number; // 1, 2, 3
  progress?: number; // Percentage
  attachments?: string[];
  createdAt?: string;
  updatedAt?: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
}

export interface ListMinutesByMeetingParams {
  page?: number;
  limit?: number;
}

export interface CreateMinuteRequest {
  meetingId: number;
  heading?: string;
  issues?: string;
  decisions?: string;
  responsibility?: string;
  timeline?: string; // Format: "2024-08-31"
  status?: number; // 1, 2, 3
  departmentIds?: number[];
  progressHistory?: string;
}

export interface UpdateMinuteRequest {
  heading?: string;
  issues?: string;
  decisions?: string;
  responsibility?: string;
  timeline?: string;
  status?: number; // 1, 2, 3
  departmentIds?: number[];
  progressHistory?: string;
}

export interface CreateMinuteReplyRequest {
  content: string;
  status?: number; // 1, 2, 3
  progress?: number; // Percentage
  attachments?: string[];
}

// ============================================================================
// Minute Operations
// ============================================================================

/**
 * List minutes by meeting
 * GET /api/minutes/meeting/:meetingId
 */
export const listMinutesByMeeting = async (
  meetingId: number,
  params?: ListMinutesByMeetingParams
): Promise<ApiResponse<Minute[]>> => {
  const queryParams = new URLSearchParams();
  
  if (params?.page) {
    queryParams.append('page', params.page.toString());
  }
  if (params?.limit) {
    queryParams.append('limit', params.limit.toString());
  }

  const url = `/minutes/meeting/${meetingId}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  const response = await api.get<ApiResponse<Minute[]>>(url);
  return response.data;
};

/**
 * Get minute by ID
 * GET /api/minutes/:id
 */
export const getMinute = async (id: number): Promise<ApiResponse<Minute>> => {
  const response = await api.get<ApiResponse<Minute>>(`/minutes/${id}`);
  return response.data;
};

/**
 * Create minute
 * POST /api/minutes
 */
export const createMinute = async (
  data: CreateMinuteRequest
): Promise<ApiResponse<Minute>> => {
  const response = await api.post<ApiResponse<Minute>>('/minutes', data);
  return response.data;
};

/**
 * Update minute
 * PATCH /api/minutes/:id
 */
export const updateMinute = async (
  id: number,
  data: UpdateMinuteRequest
): Promise<ApiResponse<Minute>> => {
  const response = await api.patch<ApiResponse<Minute>>(`/minutes/${id}`, data);
  return response.data;
};

/**
 * Delete minute
 * DELETE /api/minutes/:id
 */
export const deleteMinute = async (id: number): Promise<ApiResponse<void>> => {
  const response = await api.delete<ApiResponse<void>>(`/minutes/${id}`);
  return response.data;
};

/**
 * Archive minute
 * POST /api/minutes/:id/archive
 */
export const archiveMinute = async (id: number): Promise<ApiResponse<Minute>> => {
  const response = await api.post<ApiResponse<Minute>>(`/minutes/${id}/archive`);
  return response.data;
};

/**
 * Get minute replies
 * GET /api/minutes/:id/replies
 */
export const getMinuteReplies = async (
  minuteId: number
): Promise<ApiResponse<MinuteReply[]>> => {
  const response = await api.get<ApiResponse<MinuteReply[]>>(`/minutes/${minuteId}/replies`);
  return response.data;
};

/**
 * Create minute reply
 * POST /api/minutes/:id/replies
 */
export const createMinuteReply = async (
  minuteId: number,
  data: CreateMinuteReplyRequest
): Promise<ApiResponse<MinuteReply>> => {
  const response = await api.post<ApiResponse<MinuteReply>>(
    `/minutes/${minuteId}/replies`,
    data
  );
  return response.data;
};

