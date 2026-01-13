/**
 * Letters Service
 * API integration following API_INTEGRATION_GUIDE.md
 * 
 * Base URL: https://cmdms-backend-production.up.railway.app
 * API Base Path: /api
 * 
 * Endpoints:
 * - GET /api/letters - List letters
 * - GET /api/letters/:id - Get letter
 * - POST /api/letters - Create letter
 * - PATCH /api/letters/:id - Update letter
 * - DELETE /api/letters/:id - Delete letter
 * - GET /api/letters/:id/generate-pdf - Generate letter PDF
 * - POST /api/letters/:id/send - Send letter
 */

import { api } from '../api';
import type { ApiResponse, PaginatedResponse } from '../../types/api';

// ============================================================================
// Types
// ============================================================================

export interface Letter {
  id: number;
  subject: string;
  content?: string;
  recipientName?: string;
  recipientDepartmentId?: number;
  status?: string; // e.g., "draft", "sent", "delivered"
  createdAt?: string;
  updatedAt?: string;
  recipientDepartment?: {
    id: number;
    name: string;
  };
}

export interface ListLettersParams {
  page?: number;
  perPage?: number;
  status?: string;
  recipientDepartmentId?: number;
}

export interface CreateLetterRequest {
  subject: string;
  content?: string;
  recipientName?: string;
  recipientDepartmentId?: number;
}

export interface UpdateLetterRequest {
  subject?: string;
  content?: string;
  recipientName?: string;
  recipientDepartmentId?: number;
  status?: string;
}

export interface SendLetterRequest {
  [key: string]: any; // Send letter request structure depends on API
}

// ============================================================================
// API Functions
// ============================================================================

/**
 * List letters with pagination and filters
 */
export const listLetters = async (
  params?: ListLettersParams
): Promise<PaginatedResponse<Letter>> => {
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
  if (params?.recipientDepartmentId) {
    queryParams.append('recipientDepartmentId', params.recipientDepartmentId.toString());
  }

  const url = `/letters${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  const response = await api.get<ApiResponse<PaginatedResponse<Letter>>>(url);
  return response.data.data;
};

/**
 * Get a single letter by ID
 */
export const getLetter = async (id: number): Promise<Letter> => {
  const response = await api.get<ApiResponse<Letter>>(`/letters/${id}`);
  return response.data.data;
};

/**
 * Create a new letter
 */
export const createLetter = async (
  data: CreateLetterRequest
): Promise<Letter> => {
  const response = await api.post<ApiResponse<Letter>>('/letters', data);
  return response.data.data;
};

/**
 * Update a letter
 */
export const updateLetter = async (
  id: number,
  data: UpdateLetterRequest
): Promise<Letter> => {
  const response = await api.patch<ApiResponse<Letter>>(`/letters/${id}`, data);
  return response.data.data;
};

/**
 * Delete a letter
 */
export const deleteLetter = async (id: number): Promise<void> => {
  await api.delete(`/letters/${id}`);
};

/**
 * Generate PDF for a letter
 */
export const generateLetterPDF = async (id: number): Promise<Blob> => {
  const response = await api.get(`/letters/${id}/generate-pdf`, {
    responseType: 'blob',
  });
  return response.data;
};

/**
 * Send a letter
 */
export const sendLetter = async (
  id: number,
  data?: SendLetterRequest
): Promise<Letter> => {
  const response = await api.post<ApiResponse<Letter>>(`/letters/${id}/send`, data || {});
  return response.data.data;
};


