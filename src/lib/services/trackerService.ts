/**
 * Trackers/Interventions Service
 * API integration following API_INTEGRATION_GUIDE.md
 * 
 * Base URL: https://cmdms-backend-production.up.railway.app
 * API Base Path: /api
 * 
 * Endpoints:
 * - GET /api/trackers - List trackers
 * - GET /api/trackers/:id - Get tracker details
 * - POST /api/trackers - Create tracker
 * - PATCH /api/trackers/:id - Update tracker
 * - DELETE /api/trackers/:id - Delete tracker
 * - GET /api/trackers/:id/activities - List tracker activities
 * - POST /api/trackers/:id/activities - Create tracker activity
 * - PATCH /api/trackers/:id/activities/:activityId - Update tracker activity
 * - DELETE /api/trackers/:id/activities/:activityId - Delete tracker activity
 * - GET /api/trackers/:id/activities/:activityId/replies - Get activity replies
 * - POST /api/trackers/:id/activities/:activityId/replies - Create activity reply
 * - POST /api/trackers/:id/assign - Assign tracker to departments
 */

import { api } from '../api';
import type { ApiResponse, PaginatedResponse } from '../../types/api';

// ============================================================================
// Types
// ============================================================================

export interface Tracker {
  id: number;
  title: string;
  description?: string;
  type?: string; // "intervention", "tracker", etc.
  status: number;
  progress?: number;
  budget?: number;
  startDate?: string;
  endDate?: string;
  createdAt?: string;
  updatedAt?: string;
  departments?: Array<{
    id: number;
    name: string;
  }>;
  activities?: TrackerActivity[];
  attachments?: Array<{
    id: number;
    originalName: string;
    fileName: string;
    url: string;
  }>;
  replies?: TrackerReply[];
}

export interface TrackerActivity {
  id: number;
  title: string;
  description?: string;
  departmentId: number;
  department?: {
    id: number;
    name: string;
  };
  status: number;
  progress?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface TrackerReply {
  id: number;
  content: string;
  userId: number;
  user?: {
    id: number;
    name: string;
  };
  attachments?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ListTrackersParams {
  page?: number;
  limit?: number;
  search?: string;
  type?: string;
  status?: number | string;
  departmentId?: number;
  fromDate?: string;
  toDate?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateTrackerRequest {
  title: string;
  description?: string;
  type?: string;
  status?: number;
  budget?: number;
  startDate?: string;
  endDate?: string;
  departmentIds?: number[];
  activities?: Array<{
    title: string;
    description?: string;
    departmentId: number;
  }>;
}

export interface UpdateTrackerRequest {
  title?: string;
  description?: string;
  type?: string;
  status?: number;
  progress?: number;
  budget?: number;
  startDate?: string;
  endDate?: string;
  departmentIds?: number[];
}

export interface CreateTrackerActivityRequest {
  title: string;
  description?: string;
  departmentId: number;
  status?: number;
}

export interface UpdateTrackerActivityRequest {
  title?: string;
  description?: string;
  status?: number;
  progress?: number;
}

export interface CreateTrackerReplyRequest {
  content: string;
  attachments?: string[];
}

export interface AssignTrackerRequest {
  departmentIds: number[];
}

// ============================================================================
// Tracker Operations
// ============================================================================

/**
 * List trackers
 * GET /api/trackers
 */
export const listTrackers = async (
  params?: ListTrackersParams
): Promise<PaginatedResponse<Tracker>> => {
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
  if (params?.status !== undefined) {
    queryParams.append('status', params.status.toString());
  }
  if (params?.departmentId) {
    queryParams.append('departmentId', params.departmentId.toString());
  }
  if (params?.fromDate) {
    queryParams.append('fromDate', params.fromDate);
  }
  if (params?.toDate) {
    queryParams.append('toDate', params.toDate);
  }
  if (params?.sortBy) {
    queryParams.append('sortBy', params.sortBy);
  }
  if (params?.sortOrder) {
    queryParams.append('sortOrder', params.sortOrder);
  }

  const url = `/trackers${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  const response = await api.get<PaginatedResponse<Tracker>>(url);
  return response.data;
};

/**
 * Get tracker by ID
 * GET /api/trackers/:id
 */
export const getTracker = async (id: number): Promise<ApiResponse<Tracker>> => {
  const response = await api.get<ApiResponse<Tracker>>(`/trackers/${id}`);
  return response.data;
};

/**
 * Create tracker
 * POST /api/trackers
 */
export const createTracker = async (
  data: CreateTrackerRequest
): Promise<ApiResponse<Tracker>> => {
  const response = await api.post<ApiResponse<Tracker>>('/trackers', data);
  return response.data;
};

/**
 * Update tracker
 * PATCH /api/trackers/:id
 */
export const updateTracker = async (
  id: number,
  data: UpdateTrackerRequest
): Promise<ApiResponse<Tracker>> => {
  const response = await api.patch<ApiResponse<Tracker>>(`/trackers/${id}`, data);
  return response.data;
};

/**
 * Delete tracker
 * DELETE /api/trackers/:id
 */
export const deleteTracker = async (id: number): Promise<ApiResponse<void>> => {
  const response = await api.delete<ApiResponse<void>>(`/trackers/${id}`);
  return response.data;
};

/**
 * Assign tracker to departments
 * POST /api/trackers/:id/assign
 */
export const assignTracker = async (
  trackerId: number,
  data: AssignTrackerRequest
): Promise<ApiResponse<Tracker>> => {
  const response = await api.post<ApiResponse<Tracker>>(
    `/trackers/${trackerId}/assign`,
    data
  );
  return response.data;
};

// ============================================================================
// Tracker Activities Operations
// ============================================================================

/**
 * List tracker activities
 * GET /api/trackers/:id/activities
 */
export const listTrackerActivities = async (
  trackerId: number
): Promise<ApiResponse<TrackerActivity[]>> => {
  const response = await api.get<ApiResponse<TrackerActivity[]>>(
    `/trackers/${trackerId}/activities`
  );
  return response.data;
};

/**
 * Create tracker activity
 * POST /api/trackers/:id/activities
 */
export const createTrackerActivity = async (
  trackerId: number,
  data: CreateTrackerActivityRequest
): Promise<ApiResponse<TrackerActivity>> => {
  const response = await api.post<ApiResponse<TrackerActivity>>(
    `/trackers/${trackerId}/activities`,
    data
  );
  return response.data;
};

/**
 * Update tracker activity
 * PATCH /api/trackers/:id/activities/:activityId
 */
export const updateTrackerActivity = async (
  trackerId: number,
  activityId: number,
  data: UpdateTrackerActivityRequest
): Promise<ApiResponse<TrackerActivity>> => {
  const response = await api.patch<ApiResponse<TrackerActivity>>(
    `/trackers/${trackerId}/activities/${activityId}`,
    data
  );
  return response.data;
};

/**
 * Delete tracker activity
 * DELETE /api/trackers/:id/activities/:activityId
 */
export const deleteTrackerActivity = async (
  trackerId: number,
  activityId: number
): Promise<ApiResponse<void>> => {
  const response = await api.delete<ApiResponse<void>>(
    `/trackers/${trackerId}/activities/${activityId}`
  );
  return response.data;
};

// ============================================================================
// Tracker Activity Replies Operations
// ============================================================================

/**
 * Get activity replies
 * GET /api/trackers/:id/activities/:activityId/replies
 */
export const getActivityReplies = async (
  trackerId: number,
  activityId: number
): Promise<ApiResponse<TrackerReply[]>> => {
  const response = await api.get<ApiResponse<TrackerReply[]>>(
    `/trackers/${trackerId}/activities/${activityId}/replies`
  );
  return response.data;
};

/**
 * Create activity reply
 * POST /api/trackers/:id/activities/:activityId/replies
 */
export const createActivityReply = async (
  trackerId: number,
  activityId: number,
  data: CreateTrackerReplyRequest
): Promise<ApiResponse<TrackerReply>> => {
  const response = await api.post<ApiResponse<TrackerReply>>(
    `/trackers/${trackerId}/activities/${activityId}/replies`,
    data
  );
  return response.data;
};

