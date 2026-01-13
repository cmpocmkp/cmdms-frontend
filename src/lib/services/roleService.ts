/**
 * Role Service
 * API integration following API_INTEGRATION_GUIDE.md
 * 
 * Base URL: https://cmdms-backend-production.up.railway.app
 * API Base Path: /api
 * 
 * Endpoints:
 * - GET /api/roles (List roles)
 * - GET /api/roles/:id (Get role)
 * - POST /api/roles (Create role)
 * - PATCH /api/roles/:id (Update role)
 * - DELETE /api/roles/:id (Delete role)
 */

import { api } from '../api';
import type { ApiResponse } from '../../types/api';

export interface Role {
  id: number;
  name: string;
  description?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateRoleRequest {
  name: string;
  description?: string;
}

export interface UpdateRoleRequest {
  name?: string;
  description?: string;
  isActive?: boolean;
}

/**
 * List all roles
 * GET /api/roles
 */
export const listRoles = async (): Promise<ApiResponse<Role[]>> => {
  const response = await api.get<ApiResponse<Role[]>>('/roles');
  return response.data;
};

/**
 * Get role by ID
 * GET /api/roles/:id
 */
export const getRole = async (id: number): Promise<ApiResponse<Role>> => {
  const response = await api.get<ApiResponse<Role>>(`/roles/${id}`);
  return response.data;
};

/**
 * Create new role
 * POST /api/roles
 */
export const createRole = async (data: CreateRoleRequest): Promise<ApiResponse<Role>> => {
  const response = await api.post<ApiResponse<Role>>('/roles', data);
  return response.data;
};

/**
 * Update role
 * PATCH /api/roles/:id
 */
export const updateRole = async (id: number, data: UpdateRoleRequest): Promise<ApiResponse<Role>> => {
  const response = await api.patch<ApiResponse<Role>>(`/roles/${id}`, data);
  return response.data;
};

/**
 * Delete role
 * DELETE /api/roles/:id
 */
export const deleteRole = async (id: number): Promise<ApiResponse<void>> => {
  const response = await api.delete<ApiResponse<void>>(`/roles/${id}`);
  return response.data;
};


