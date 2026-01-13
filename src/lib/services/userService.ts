/**
 * User Service
 * API integration following API_INTEGRATION_GUIDE.md
 * 
 * Base URL: https://cmdms-backend-production.up.railway.app
 * API Base Path: /api
 * 
 * Endpoints:
 * - GET /api/users (List users with pagination/filters)
 * - GET /api/users/:id (Get user details)
 * - POST /api/users (Create user)
 * - PATCH /api/users/:id (Update user)
 * - DELETE /api/users/:id (Delete user)
 */

import { api } from '../api';
import type { ApiResponse, PaginatedResponse } from '../../types/api';

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  roleId: number;
  role?: {
    name: string;
  };
  departmentId?: number;
  department?: {
    name: string;
  };
  isActive?: boolean;
  createdAt?: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  roleId: number;
  departmentId?: number;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  password?: string;
  roleId?: number;
  departmentId?: number;
  isActive?: boolean;
}

export interface ListUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  roleId?: number;
  departmentId?: number;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * List users with pagination and filters
 * GET /api/users
 */
export const listUsers = async (params?: ListUsersParams): Promise<PaginatedResponse<User>> => {
  const response = await api.get<PaginatedResponse<User>>('/users', { params });
  return response.data;
};

/**
 * Get user by ID
 * GET /api/users/:id
 */
export const getUser = async (id: number): Promise<ApiResponse<User>> => {
  const response = await api.get<ApiResponse<User>>(`/users/${id}`);
  return response.data;
};

/**
 * Create new user
 * POST /api/users
 */
export const createUser = async (data: CreateUserRequest): Promise<ApiResponse<User>> => {
  const response = await api.post<ApiResponse<User>>('/users', data);
  return response.data;
};

/**
 * Update user
 * PATCH /api/users/:id
 */
export const updateUser = async (id: number, data: UpdateUserRequest): Promise<ApiResponse<User>> => {
  const response = await api.patch<ApiResponse<User>>(`/users/${id}`, data);
  return response.data;
};

/**
 * Delete user
 * DELETE /api/users/:id
 */
export const deleteUser = async (id: number): Promise<ApiResponse<void>> => {
  const response = await api.delete<ApiResponse<void>>(`/users/${id}`);
  return response.data;
};


