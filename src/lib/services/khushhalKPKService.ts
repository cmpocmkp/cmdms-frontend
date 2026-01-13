/**
 * Khushhal KPK Service
 * API integration following API_INTEGRATION_GUIDE.md
 * 
 * Base URL: https://cmdms-backend-production.up.railway.app
 * API Base Path: /api
 * 
 * Endpoints:
 * - GET /api/khushhal-kpk/tasks - List Khushhal KPK tasks
 * - GET /api/khushhal-kpk/tasks/:id - Get Khushhal KPK task
 * - POST /api/khushhal-kpk/tasks - Create Khushhal KPK task
 * - PATCH /api/khushhal-kpk/tasks/:id - Update Khushhal KPK task
 * - DELETE /api/khushhal-kpk/tasks/:id - Delete Khushhal KPK task
 * - POST /api/khushhal-kpk/tasks/:id/progress - Add task progress
 */

import { api } from '../api';
import type { ApiResponse, PaginatedResponse } from '../../types/api';

// ============================================================================
// Types
// ============================================================================

export interface KhushhalKPKTask {
  id: number;
  title: string;
  description?: string;
  districtId?: number;
  budget?: number;
  status?: string; // e.g., "pending", "in-progress", "completed"
  createdAt?: string;
  updatedAt?: string;
  district?: {
    id: number;
    name: string;
  };
  progress?: KhushhalKPKProgress[];
}

export interface KhushhalKPKProgress {
  id: number;
  taskId: number;
  progress?: number; // percentage
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
  user?: {
    id: number;
    name: string;
  };
}

export interface ListKhushhalKPKTasksParams {
  page?: number;
  perPage?: number;
  status?: string;
  districtId?: number;
}

export interface CreateKhushhalKPKTaskRequest {
  title: string;
  description?: string;
  districtId?: number;
  budget?: number;
}

export interface UpdateKhushhalKPKTaskRequest {
  title?: string;
  description?: string;
  districtId?: number;
  budget?: number;
  status?: string;
}

export interface AddTaskProgressRequest {
  progress?: number; // percentage
  notes?: string;
}

// ============================================================================
// API Functions
// ============================================================================

/**
 * List Khushhal KPK tasks with pagination and filters
 */
export const listKhushhalKPKTasks = async (
  params?: ListKhushhalKPKTasksParams
): Promise<PaginatedResponse<KhushhalKPKTask>> => {
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

  const url = `/khushhal-kpk/tasks${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  const response = await api.get<ApiResponse<PaginatedResponse<KhushhalKPKTask>>>(url);
  return response.data.data;
};

/**
 * Get a single Khushhal KPK task by ID
 */
export const getKhushhalKPKTask = async (id: number): Promise<KhushhalKPKTask> => {
  const response = await api.get<ApiResponse<KhushhalKPKTask>>(`/khushhal-kpk/tasks/${id}`);
  return response.data.data;
};

/**
 * Create a new Khushhal KPK task
 */
export const createKhushhalKPKTask = async (
  data: CreateKhushhalKPKTaskRequest
): Promise<KhushhalKPKTask> => {
  const response = await api.post<ApiResponse<KhushhalKPKTask>>('/khushhal-kpk/tasks', data);
  return response.data.data;
};

/**
 * Update a Khushhal KPK task
 */
export const updateKhushhalKPKTask = async (
  id: number,
  data: UpdateKhushhalKPKTaskRequest
): Promise<KhushhalKPKTask> => {
  const response = await api.patch<ApiResponse<KhushhalKPKTask>>(`/khushhal-kpk/tasks/${id}`, data);
  return response.data.data;
};

/**
 * Delete a Khushhal KPK task
 */
export const deleteKhushhalKPKTask = async (id: number): Promise<void> => {
  await api.delete(`/khushhal-kpk/tasks/${id}`);
};

/**
 * Add progress to a Khushhal KPK task
 */
export const addTaskProgress = async (
  id: number,
  data: AddTaskProgressRequest
): Promise<KhushhalKPKProgress> => {
  const response = await api.post<ApiResponse<KhushhalKPKProgress>>(`/khushhal-kpk/tasks/${id}/progress`, data);
  return response.data.data;
};


