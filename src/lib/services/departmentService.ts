/**
 * Department Service
 * API integration following API_INTEGRATION_GUIDE.md
 * 
 * Base URL: https://cmdms-backend-production.up.railway.app
 * API Base Path: /api
 * 
 * Endpoints:
 * - GET /api/departments (List departments)
 * - GET /api/departments/:id (Get department)
 * - POST /api/departments (Create department)
 * - PATCH /api/departments/:id (Update department)
 * - DELETE /api/departments/:id (Delete department)
 * - Provinces: /api/departments/provinces/*
 * - Districts: /api/departments/districts/*
 * - Department Types: /api/departments/types/*
 */

import { api } from '../api';
import type { ApiResponse } from '../../types/api';

export interface Department {
  id: number;
  name: string;
  code?: string;
  description?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Province {
  id: number;
  name: string;
  code?: string;
}

export interface District {
  id: number;
  name: string;
  provinceId: number;
  province?: Province;
}

export interface DepartmentType {
  id: number;
  name: string;
}

export interface CreateDepartmentRequest {
  name: string;
  code?: string;
  description?: string;
}

export interface UpdateDepartmentRequest {
  name?: string;
  code?: string;
  description?: string;
  isActive?: boolean;
}

export interface CreateProvinceRequest {
  name: string;
  code?: string;
}

export interface CreateDistrictRequest {
  name: string;
  provinceId: number;
}

export interface CreateDepartmentTypeRequest {
  name: string;
}

// ============================================================================
// Departments
// ============================================================================

/**
 * List departments
 * GET /api/departments
 */
export const listDepartments = async (params?: { search?: string }): Promise<ApiResponse<Department[]>> => {
  const response = await api.get<ApiResponse<Department[]>>('/departments', { params });
  return response.data;
};

/**
 * Get department by ID
 * GET /api/departments/:id
 */
export const getDepartment = async (id: number): Promise<ApiResponse<Department>> => {
  const response = await api.get<ApiResponse<Department>>(`/departments/${id}`);
  return response.data;
};

/**
 * Create department
 * POST /api/departments
 */
export const createDepartment = async (data: CreateDepartmentRequest): Promise<ApiResponse<Department>> => {
  const response = await api.post<ApiResponse<Department>>('/departments', data);
  return response.data;
};

/**
 * Update department
 * PATCH /api/departments/:id
 */
export const updateDepartment = async (id: number, data: UpdateDepartmentRequest): Promise<ApiResponse<Department>> => {
  const response = await api.patch<ApiResponse<Department>>(`/departments/${id}`, data);
  return response.data;
};

/**
 * Delete department
 * DELETE /api/departments/:id
 */
export const deleteDepartment = async (id: number): Promise<ApiResponse<void>> => {
  const response = await api.delete<ApiResponse<void>>(`/departments/${id}`);
  return response.data;
};

// ============================================================================
// Provinces
// ============================================================================

/**
 * List provinces
 * GET /api/departments/provinces/list
 */
export const listProvinces = async (): Promise<ApiResponse<Province[]>> => {
  const response = await api.get<ApiResponse<Province[]>>('/departments/provinces/list');
  return response.data;
};

/**
 * Get province by ID
 * GET /api/departments/provinces/:id
 */
export const getProvince = async (id: number): Promise<ApiResponse<Province>> => {
  const response = await api.get<ApiResponse<Province>>(`/departments/provinces/${id}`);
  return response.data;
};

/**
 * Create province
 * POST /api/departments/provinces
 */
export const createProvince = async (data: CreateProvinceRequest): Promise<ApiResponse<Province>> => {
  const response = await api.post<ApiResponse<Province>>('/departments/provinces', data);
  return response.data;
};

/**
 * Update province
 * PATCH /api/departments/provinces/:id
 */
export const updateProvince = async (id: number, data: Partial<CreateProvinceRequest>): Promise<ApiResponse<Province>> => {
  const response = await api.patch<ApiResponse<Province>>(`/departments/provinces/${id}`, data);
  return response.data;
};

/**
 * Delete province
 * DELETE /api/departments/provinces/:id
 */
export const deleteProvince = async (id: number): Promise<ApiResponse<void>> => {
  const response = await api.delete<ApiResponse<void>>(`/departments/provinces/${id}`);
  return response.data;
};

// ============================================================================
// Districts
// ============================================================================

/**
 * List districts
 * GET /api/departments/districts/list
 */
export const listDistricts = async (): Promise<ApiResponse<District[]>> => {
  const response = await api.get<ApiResponse<District[]>>('/departments/districts/list');
  return response.data;
};

/**
 * Get district by ID
 * GET /api/departments/districts/:id
 */
export const getDistrict = async (id: number): Promise<ApiResponse<District>> => {
  const response = await api.get<ApiResponse<District>>(`/departments/districts/${id}`);
  return response.data;
};

/**
 * Create district
 * POST /api/departments/districts
 */
export const createDistrict = async (data: CreateDistrictRequest): Promise<ApiResponse<District>> => {
  const response = await api.post<ApiResponse<District>>('/departments/districts', data);
  return response.data;
};

/**
 * Update district
 * PATCH /api/departments/districts/:id
 */
export const updateDistrict = async (id: number, data: Partial<CreateDistrictRequest>): Promise<ApiResponse<District>> => {
  const response = await api.patch<ApiResponse<District>>(`/departments/districts/${id}`, data);
  return response.data;
};

/**
 * Delete district
 * DELETE /api/departments/districts/:id
 */
export const deleteDistrict = async (id: number): Promise<ApiResponse<void>> => {
  const response = await api.delete<ApiResponse<void>>(`/departments/districts/${id}`);
  return response.data;
};

// ============================================================================
// Department Types
// ============================================================================

/**
 * List department types
 * GET /api/departments/types/list
 */
export const listDepartmentTypes = async (): Promise<ApiResponse<DepartmentType[]>> => {
  const response = await api.get<ApiResponse<DepartmentType[]>>('/departments/types/list');
  return response.data;
};

/**
 * Get department type by ID
 * GET /api/departments/types/:id
 */
export const getDepartmentType = async (id: number): Promise<ApiResponse<DepartmentType>> => {
  const response = await api.get<ApiResponse<DepartmentType>>(`/departments/types/${id}`);
  return response.data;
};

/**
 * Create department type
 * POST /api/departments/types
 */
export const createDepartmentType = async (data: CreateDepartmentTypeRequest): Promise<ApiResponse<DepartmentType>> => {
  const response = await api.post<ApiResponse<DepartmentType>>('/departments/types', data);
  return response.data;
};

/**
 * Update department type
 * PATCH /api/departments/types/:id
 */
export const updateDepartmentType = async (id: number, data: Partial<CreateDepartmentTypeRequest>): Promise<ApiResponse<DepartmentType>> => {
  const response = await api.patch<ApiResponse<DepartmentType>>(`/departments/types/${id}`, data);
  return response.data;
};

/**
 * Delete department type
 * DELETE /api/departments/types/:id
 */
export const deleteDepartmentType = async (id: number): Promise<ApiResponse<void>> => {
  const response = await api.delete<ApiResponse<void>>(`/departments/types/${id}`);
  return response.data;
};


