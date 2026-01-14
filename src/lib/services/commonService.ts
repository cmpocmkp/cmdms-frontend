/**
 * Common Service
 * API integration following API_INTEGRATION_GUIDE.md
 * 
 * Base URL: https://cmdms-backend-production.up.railway.app
 * API Base Path: /api
 * 
 * Endpoints:
 * - GET /api/common/departments/dropdown - Departments dropdown
 * - GET /api/common/users/dropdown - Users dropdown
 * - GET /api/common/roles/dropdown - Roles dropdown
 * - GET /api/common/departments/types/dropdown - Department types dropdown
 * - GET /api/search - Global search across all modules
 * - GET /api/export/excel - Generic Excel export
 */

import { api } from '../api';
import type { ApiResponse } from '../../types/api';

// ============================================================================
// Dropdown Types
// ============================================================================

export interface DropdownOption {
  id: number;
  name: string;
  code?: string;
}

// ============================================================================
// Dropdowns
// ============================================================================

/**
 * Get departments dropdown options
 * GET /api/common/departments/dropdown
 */
export const getDepartmentsDropdown = async (): Promise<ApiResponse<DropdownOption[]>> => {
  const response = await api.get<ApiResponse<DropdownOption[]>>('/common/departments/dropdown');
  return response.data;
};

/**
 * Get users dropdown options
 * GET /api/common/users/dropdown
 */
export const getUsersDropdown = async (): Promise<ApiResponse<DropdownOption[]>> => {
  const response = await api.get<ApiResponse<DropdownOption[]>>('/common/users/dropdown');
  return response.data;
};

/**
 * Get roles dropdown options
 * GET /api/common/roles/dropdown
 */
export const getRolesDropdown = async (): Promise<ApiResponse<DropdownOption[]>> => {
  const response = await api.get<ApiResponse<DropdownOption[]>>('/common/roles/dropdown');
  return response.data;
};

/**
 * Get department types dropdown options
 * GET /api/common/departments/types/dropdown
 */
export const getDepartmentTypesDropdown = async (): Promise<ApiResponse<DropdownOption[]>> => {
  const response = await api.get<ApiResponse<DropdownOption[]>>('/common/departments/types/dropdown');
  return response.data;
};

// ============================================================================
// Global Search
// ============================================================================

export interface SearchResult {
  type: string; // e.g., 'user', 'meeting', 'directive'
  id: number;
  title: string;
  description?: string;
  url?: string;
}

export interface GlobalSearchParams {
  q: string; // Query string (required)
  types?: string[]; // Filter by entity types
  limit?: number; // Max results per type
}

/**
 * Global search across all modules
 * GET /api/search
 * 
 * Query parameters:
 * - q: Query string (required)
 * - types: Optional array of entity types to filter
 * - limit: Optional limit of results per type
 */
export const globalSearch = async (
  params: GlobalSearchParams
): Promise<ApiResponse<SearchResult[]>> => {
  // Convert types array to query string if provided
  const queryParams: Record<string, string> = {
    q: params.q,
  };
  
  if (params.limit) {
    queryParams.limit = params.limit.toString();
  }
  
  if (params.types && params.types.length > 0) {
    queryParams.types = params.types.join(',');
  }
  
  const response = await api.get<ApiResponse<SearchResult[]>>('/search', { params: queryParams });
  return response.data;
};

// ============================================================================
// Excel Export
// ============================================================================

export interface ExcelExportParams {
  type: string; // Entity type to export (e.g., 'meetings', 'directives', 'users')
  filters?: Record<string, string | number>; // Additional filters
  format?: 'xlsx' | 'xls' | 'csv'; // Export format (default: xlsx)
}

/**
 * Generic Excel export
 * GET /api/export/excel
 * 
 * Query parameters:
 * - type: Entity type to export (required)
 * - format: Export format - 'xlsx', 'xls', or 'csv' (optional, default: xlsx)
 * - Additional filters as key-value pairs
 * 
 * Note: This returns a file blob/stream. Use responseType: 'blob' in axios config.
 */
export const exportExcel = async (
  params: ExcelExportParams
): Promise<Blob> => {
  const queryParams: Record<string, string> = {
    type: params.type,
  };
  
  if (params.format) {
    queryParams.format = params.format;
  }
  
  // Add any additional filters
  if (params.filters) {
    Object.entries(params.filters).forEach(([key, value]) => {
      queryParams[key] = String(value);
    });
  }
  
  const response = await api.get<Blob>('/export/excel', {
    params: queryParams,
    responseType: 'blob', // Important: Set response type to blob for file download
  });
  
  return response.data;
};



