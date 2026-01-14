/**
 * Complaints Service
 * API integration following API_INTEGRATION_GUIDE.md
 * 
 * Base URL: https://cmdms-backend-production.up.railway.app
 * API Base Path: /api
 * 
 * Endpoints:
 * - GET /api/complaints - List complaints
 * - GET /api/complaints/:id - Get complaint
 * - POST /api/complaints - Create complaint
 * - PATCH /api/complaints/:id/status - Update complaint status
 * - POST /api/complaints/:id/responses - Add complaint response
 * - POST /api/complaints/:id/feedback - Add complaint feedback
 */

import { api } from '../api';
import type { ApiResponse, PaginatedResponse } from '../../types/api';

// ============================================================================
// Types
// ============================================================================

export interface Complaint {
  id: number;
  subject: string;
  description?: string;
  complainantName?: string;
  contactNumber?: string;
  departmentId?: number;
  status?: string; // "pending", "in-progress", "resolved", "closed"
  createdAt?: string;
  updatedAt?: string;
  department?: {
    id: number;
    name: string;
  };
  responses?: ComplaintResponse[];
  feedback?: ComplaintFeedback;
}

export interface ComplaintResponse {
  id: number;
  complaintId: number;
  content: string;
  createdAt?: string;
  updatedAt?: string;
  user?: {
    id: number;
    name: string;
  };
}

export interface ComplaintFeedback {
  id: number;
  complaintId: number;
  rating?: number; // 1-5
  comment?: string;
  createdAt?: string;
}

export interface ListComplaintsParams {
  page?: number;
  perPage?: number;
  status?: string; // "pending", "in-progress", "resolved", "closed"
  departmentId?: number;
}

export interface CreateComplaintRequest {
  subject: string;
  description?: string;
  complainantName?: string;
  contactNumber?: string;
  departmentId?: number;
}

export interface UpdateComplaintStatusRequest {
  status: string; // "pending", "in-progress", "resolved", "closed"
}

export interface AddComplaintResponseRequest {
  content: string;
}

export interface AddComplaintFeedbackRequest {
  rating?: number; // 1-5
  comment?: string;
}

// ============================================================================
// API Functions
// ============================================================================

/**
 * List complaints with pagination and filters
 */
export const listComplaints = async (
  params?: ListComplaintsParams
): Promise<PaginatedResponse<Complaint>> => {
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
  if (params?.departmentId) {
    queryParams.append('departmentId', params.departmentId.toString());
  }

  const url = `/complaints${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  const response = await api.get<ApiResponse<PaginatedResponse<Complaint>>>(url);
  return response.data.data;
};

/**
 * Get a single complaint by ID
 */
export const getComplaint = async (id: number): Promise<Complaint> => {
  const response = await api.get<ApiResponse<Complaint>>(`/complaints/${id}`);
  return response.data.data;
};

/**
 * Create a new complaint
 */
export const createComplaint = async (
  data: CreateComplaintRequest
): Promise<Complaint> => {
  const response = await api.post<ApiResponse<Complaint>>('/complaints', data);
  return response.data.data;
};

/**
 * Update complaint status
 */
export const updateComplaintStatus = async (
  id: number,
  data: UpdateComplaintStatusRequest
): Promise<Complaint> => {
  const response = await api.patch<ApiResponse<Complaint>>(`/complaints/${id}/status`, data);
  return response.data.data;
};

/**
 * Add a response to a complaint
 */
export const addComplaintResponse = async (
  id: number,
  data: AddComplaintResponseRequest
): Promise<ComplaintResponse> => {
  const response = await api.post<ApiResponse<ComplaintResponse>>(`/complaints/${id}/responses`, data);
  return response.data.data;
};

/**
 * Add feedback to a complaint
 */
export const addComplaintFeedback = async (
  id: number,
  data: AddComplaintFeedbackRequest
): Promise<ComplaintFeedback> => {
  const response = await api.post<ApiResponse<ComplaintFeedback>>(`/complaints/${id}/feedback`, data);
  return response.data.data;
};



