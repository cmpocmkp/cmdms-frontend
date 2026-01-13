/**
 * Permission Service
 * API integration following API_INTEGRATION_GUIDE.md
 * 
 * Base URL: https://cmdms-backend-production.up.railway.app
 * API Base Path: /api
 * 
 * Endpoints:
 * - GET /api/permissions (List permissions)
 * - GET /api/permissions/:id (Get permission)
 * - POST /api/permissions (Create permission)
 * - PATCH /api/permissions/:id (Update permission)
 * - DELETE /api/permissions/:id (Delete permission)
 */

import { api } from '../api';
import type { ApiResponse } from '../../types/api';

export interface Permission {
  id: number;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreatePermissionRequest {
  name: string;
  description?: string;
}

export interface UpdatePermissionRequest {
  name?: string;
  description?: string;
}

/**
 * List all permissions
 * GET /api/permissions
 */
export const listPermissions = async (): Promise<ApiResponse<Permission[]>> => {
  const response = await api.get<ApiResponse<Permission[]>>('/permissions');
  return response.data;
};

/**
 * Get permission by ID
 * GET /api/permissions/:id
 */
export const getPermission = async (id: number): Promise<ApiResponse<Permission>> => {
  const response = await api.get<ApiResponse<Permission>>(`/permissions/${id}`);
  return response.data;
};

/**
 * Create new permission
 * POST /api/permissions
 */
export const createPermission = async (data: CreatePermissionRequest): Promise<ApiResponse<Permission>> => {
  const response = await api.post<ApiResponse<Permission>>('/permissions', data);
  return response.data;
};

/**
 * Update permission
 * PATCH /api/permissions/:id
 */
export const updatePermission = async (id: number, data: UpdatePermissionRequest): Promise<ApiResponse<Permission>> => {
  const response = await api.patch<ApiResponse<Permission>>(`/permissions/${id}`, data);
  return response.data;
};

/**
 * Delete permission
 * DELETE /api/permissions/:id
 */
export const deletePermission = async (id: number): Promise<ApiResponse<void>> => {
  const response = await api.delete<ApiResponse<void>>(`/permissions/${id}`);
  return response.data;
};


