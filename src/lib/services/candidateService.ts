/**
 * Candidates Service
 * API integration following API_INTEGRATION_GUIDE.md
 * 
 * Base URL: https://cmdms-backend-production.up.railway.app
 * API Base Path: /api
 * 
 * Endpoints:
 * - GET /api/candidates - List candidates
 * - GET /api/candidates/:id - Get candidate
 * - POST /api/candidates - Create candidate
 * - PATCH /api/candidates/:id - Update candidate
 * - DELETE /api/candidates/:id - Delete candidate
 * - GET /api/candidates/constituencies - List constituencies
 */

import { api } from '../api';
import type { ApiResponse, PaginatedResponse } from '../../types/api';

// ============================================================================
// Types
// ============================================================================

export interface Candidate {
  id: number;
  name: string;
  party?: string;
  constituencyId?: number;
  createdAt?: string;
  updatedAt?: string;
  constituency?: {
    id: number;
    name: string;
  };
}

export interface Constituency {
  id: number;
  name: string;
}

export interface ListCandidatesParams {
  page?: number;
  limit?: number;
  search?: string;
  party?: string;
  constituencyId?: number;
}

export interface CreateCandidateRequest {
  name: string;
  party?: string;
  constituencyId?: number;
}

export interface UpdateCandidateRequest {
  name?: string;
  party?: string;
  constituencyId?: number;
}

// ============================================================================
// API Functions
// ============================================================================

/**
 * List candidates with pagination and filters
 */
export const listCandidates = async (
  params?: ListCandidatesParams
): Promise<PaginatedResponse<Candidate>> => {
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
  if (params?.party) {
    queryParams.append('party', params.party);
  }
  if (params?.constituencyId) {
    queryParams.append('constituencyId', params.constituencyId.toString());
  }

  const url = `/candidates${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  const response = await api.get<PaginatedResponse<Candidate>>(url);
  return response.data;
};

/**
 * Get a single candidate by ID
 */
export const getCandidate = async (id: number): Promise<ApiResponse<Candidate>> => {
  const response = await api.get<ApiResponse<Candidate>>(`/candidates/${id}`);
  return response.data;
};

/**
 * Create a new candidate
 */
export const createCandidate = async (
  data: CreateCandidateRequest
): Promise<ApiResponse<Candidate>> => {
  const response = await api.post<ApiResponse<Candidate>>('/candidates', data);
  return response.data;
};

/**
 * Update a candidate
 */
export const updateCandidate = async (
  id: number,
  data: UpdateCandidateRequest
): Promise<ApiResponse<Candidate>> => {
  const response = await api.patch<ApiResponse<Candidate>>(`/candidates/${id}`, data);
  return response.data;
};

/**
 * Delete a candidate
 */
export const deleteCandidate = async (id: number): Promise<void> => {
  await api.delete(`/candidates/${id}`);
};

/**
 * List constituencies
 */
export const listConstituencies = async (): Promise<ApiResponse<Constituency[]>> => {
  const response = await api.get<ApiResponse<Constituency[]>>('/candidates/constituencies');
  return response.data;
};
