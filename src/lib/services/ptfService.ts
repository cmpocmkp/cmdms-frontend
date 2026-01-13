/**
 * PTF Service
 * API integration following API_INTEGRATION_GUIDE.md
 * 
 * Base URL: https://cmdms-backend-production.up.railway.app
 * API Base Path: /api
 * 
 * Endpoints:
 * - GET /api/ptf/issues - List PTF issues
 * - GET /api/ptf/issues/:id - Get PTF issue
 * - POST /api/ptf/issues - Create PTF issue
 * - GET /api/ptf/meetings - List PTF meetings
 * - POST /api/ptf/meetings - Create PTF meeting
 * 
 * Note: Update and Delete endpoints are NOT documented in API_INTEGRATION_GUIDE.md
 */

import { api } from '../api';
import type { ApiResponse, PaginatedResponse } from '../../types/api';

// ============================================================================
// Types
// ============================================================================

export interface PTFIssue {
  id: number;
  title: string;
  description?: string;
  priority?: string;
  districtId?: number;
  district?: {
    id: number;
    name: string;
  };
  status?: string;
  deadline?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PTFMeeting {
  id: number;
  title: string;
  date?: string;
  venue?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ListPTFIssuesParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  priority?: string;
  districtId?: number;
}

export interface CreatePTFIssueRequest {
  title: string;
  description?: string;
  priority?: string;
  districtId?: number;
  deadline?: string;
}

export interface CreatePTFMeetingRequest {
  title: string;
  date?: string;
  venue?: string;
}

// ============================================================================
// PTF Issue Operations
// ============================================================================

/**
 * List PTF issues
 * GET /api/ptf/issues
 */
export const listPTFIssues = async (
  params?: ListPTFIssuesParams
): Promise<PaginatedResponse<PTFIssue>> => {
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
  if (params?.priority) {
    queryParams.append('priority', params.priority);
  }
  if (params?.districtId) {
    queryParams.append('districtId', params.districtId.toString());
  }

  const url = `/ptf/issues${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  const response = await api.get<PaginatedResponse<PTFIssue>>(url);
  return response.data;
};

/**
 * Get PTF issue by ID
 * GET /api/ptf/issues/:id
 */
export const getPTFIssue = async (id: number): Promise<ApiResponse<PTFIssue>> => {
  const response = await api.get<ApiResponse<PTFIssue>>(`/ptf/issues/${id}`);
  return response.data;
};

/**
 * Create PTF issue
 * POST /api/ptf/issues
 */
export const createPTFIssue = async (
  data: CreatePTFIssueRequest
): Promise<ApiResponse<PTFIssue>> => {
  const response = await api.post<ApiResponse<PTFIssue>>('/ptf/issues', data);
  return response.data;
};

// ============================================================================
// PTF Meeting Operations
// ============================================================================

/**
 * List PTF meetings
 * GET /api/ptf/meetings
 */
export const listPTFMeetings = async (): Promise<ApiResponse<PTFMeeting[]>> => {
  const response = await api.get<ApiResponse<PTFMeeting[]>>('/ptf/meetings');
  return response.data;
};

/**
 * Create PTF meeting
 * POST /api/ptf/meetings
 */
export const createPTFMeeting = async (
  data: CreatePTFMeetingRequest
): Promise<ApiResponse<PTFMeeting>> => {
  const response = await api.post<ApiResponse<PTFMeeting>>('/ptf/meetings', data);
  return response.data;
};

