/**
 * Announcements Service
 * API integration following API_INTEGRATION_GUIDE.md
 * 
 * Base URL: https://cmdms-backend-production.up.railway.app
 * API Base Path: /api
 * 
 * Endpoints:
 * - GET /api/announcements - List announcements
 * - GET /api/announcements/:id - Get announcement
 * - POST /api/announcements - Create announcement
 * - PATCH /api/announcements/:id - Update announcement
 * - DELETE /api/announcements/:id - Delete announcement
 * - POST /api/announcements/:id/responses - Create announcement detail response
 */

import { api } from '../api';
import type { ApiResponse, PaginatedResponse } from '../../types/api';

// ============================================================================
// Types
// ============================================================================

export interface Announcement {
  id: number;
  title: string;
  description?: string;
  content?: string;
  type?: string;
  priority?: string;
  status?: number | string;
  startDate?: string;
  endDate?: string;
  targetAudience?: string;
  departmentIds?: number[];
  createdAt?: string;
  updatedAt?: string;
  departments?: Array<{
    id: number;
    name: string;
  }>;
  responses?: AnnouncementResponse[];
}

export interface AnnouncementResponse {
  id: number;
  announcementId: number;
  departmentId: number;
  response: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
  department?: {
    id: number;
    name: string;
  };
}

export interface ListAnnouncementsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  type?: string;
  departmentId?: number;
}

export interface CreateAnnouncementRequest {
  title: string;
  description?: string;
  content?: string;
  type?: string;
  priority?: string;
  startDate?: string;
  endDate?: string;
  targetAudience?: string;
  departmentIds?: number[];
}

export interface UpdateAnnouncementRequest {
  title?: string;
  description?: string;
  content?: string;
  type?: string;
  priority?: string;
  status?: number | string;
  startDate?: string;
  endDate?: string;
  targetAudience?: string;
  departmentIds?: number[];
}

export interface CreateAnnouncementResponseRequest {
  announcementId: number;
  departmentId: number;
  response: string;
  status?: string;
}

// ============================================================================
// Announcement Operations
// ============================================================================

/**
 * List announcements
 * GET /api/announcements
 */
export const listAnnouncements = async (
  params?: ListAnnouncementsParams
): Promise<PaginatedResponse<Announcement>> => {
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
  if (params?.type) {
    queryParams.append('type', params.type);
  }
  if (params?.departmentId) {
    queryParams.append('departmentId', params.departmentId.toString());
  }

  const url = `/announcements${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  const response = await api.get<PaginatedResponse<Announcement>>(url);
  return response.data;
};

/**
 * Get announcement by ID
 * GET /api/announcements/:id
 */
export const getAnnouncement = async (id: number): Promise<ApiResponse<Announcement>> => {
  const response = await api.get<ApiResponse<Announcement>>(`/announcements/${id}`);
  return response.data;
};

/**
 * Create announcement
 * POST /api/announcements
 */
export const createAnnouncement = async (
  data: CreateAnnouncementRequest
): Promise<ApiResponse<Announcement>> => {
  const response = await api.post<ApiResponse<Announcement>>('/announcements', data);
  return response.data;
};

/**
 * Update announcement
 * PATCH /api/announcements/:id
 */
export const updateAnnouncement = async (
  id: number,
  data: UpdateAnnouncementRequest
): Promise<ApiResponse<Announcement>> => {
  const response = await api.patch<ApiResponse<Announcement>>(`/announcements/${id}`, data);
  return response.data;
};

/**
 * Delete announcement
 * DELETE /api/announcements/:id
 */
export const deleteAnnouncement = async (id: number): Promise<ApiResponse<void>> => {
  const response = await api.delete<ApiResponse<void>>(`/announcements/${id}`);
  return response.data;
};

/**
 * Create announcement detail response
 * POST /api/announcements/details/:id/responses
 */
export const createAnnouncementResponse = async (
  announcementDetailId: number,
  data: Omit<CreateAnnouncementResponseRequest, 'announcementId'>
): Promise<ApiResponse<AnnouncementResponse>> => {
  const response = await api.post<ApiResponse<AnnouncementResponse>>(
    `/announcements/details/${announcementDetailId}/responses`,
    data
  );
  return response.data;
};

