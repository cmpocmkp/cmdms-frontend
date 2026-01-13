/**
 * Boards Service
 * API integration following API_INTEGRATION_GUIDE.md
 * 
 * Base URL: https://cmdms-backend-production.up.railway.app
 * API Base Path: /api
 * 
 * Endpoints:
 * - GET /api/boards - List boards
 * - GET /api/boards/:id - Get board
 * - POST /api/boards - Create board
 * - PATCH /api/boards/:id - Update board
 * - DELETE /api/boards/:id - Delete board
 * - POST /api/boards/:id/members - Add board members
 * - POST /api/boards/:id/meetings - Create board meeting
 * - GET /api/boards/:id/meetings - List board meetings
 */

import { api } from '../api';
import type { ApiResponse, PaginatedResponse } from '../../types/api';

// ============================================================================
// Types
// ============================================================================

export interface Board {
  id: number;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  members?: BoardMember[];
  meetings?: BoardMeeting[];
}

export interface BoardMember {
  id: number;
  userId: number;
  boardId: number;
  user?: {
    id: number;
    name: string;
    email: string;
  };
  createdAt?: string;
}

export interface BoardMeeting {
  id: number;
  boardId: number;
  title: string;
  date?: string;
  venue?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ListBoardsParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface CreateBoardRequest {
  name: string;
  description?: string;
}

export interface UpdateBoardRequest {
  name?: string;
  description?: string;
}

export interface AddBoardMembersRequest {
  userIds: number[];
}

export interface CreateBoardMeetingRequest {
  title: string;
  date?: string;
  venue?: string;
}

// ============================================================================
// Board Operations
// ============================================================================

/**
 * List boards
 * GET /api/boards
 */
export const listBoards = async (
  params?: ListBoardsParams
): Promise<PaginatedResponse<Board>> => {
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

  const url = `/boards${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  const response = await api.get<PaginatedResponse<Board>>(url);
  return response.data;
};

/**
 * Get board by ID
 * GET /api/boards/:id
 */
export const getBoard = async (id: number): Promise<ApiResponse<Board>> => {
  const response = await api.get<ApiResponse<Board>>(`/boards/${id}`);
  return response.data;
};

/**
 * Create board
 * POST /api/boards
 */
export const createBoard = async (
  data: CreateBoardRequest
): Promise<ApiResponse<Board>> => {
  const response = await api.post<ApiResponse<Board>>('/boards', data);
  return response.data;
};

/**
 * Update board
 * PATCH /api/boards/:id
 */
export const updateBoard = async (
  id: number,
  data: UpdateBoardRequest
): Promise<ApiResponse<Board>> => {
  const response = await api.patch<ApiResponse<Board>>(`/boards/${id}`, data);
  return response.data;
};

/**
 * Delete board
 * DELETE /api/boards/:id
 */
export const deleteBoard = async (id: number): Promise<ApiResponse<void>> => {
  const response = await api.delete<ApiResponse<void>>(`/boards/${id}`);
  return response.data;
};

/**
 * Add board members
 * POST /api/boards/:id/members
 */
export const addBoardMembers = async (
  boardId: number,
  data: AddBoardMembersRequest
): Promise<ApiResponse<BoardMember[]>> => {
  const response = await api.post<ApiResponse<BoardMember[]>>(`/boards/${boardId}/members`, data);
  return response.data;
};

/**
 * Create board meeting
 * POST /api/boards/:id/meetings
 */
export const createBoardMeeting = async (
  boardId: number,
  data: CreateBoardMeetingRequest
): Promise<ApiResponse<BoardMeeting>> => {
  const response = await api.post<ApiResponse<BoardMeeting>>(`/boards/${boardId}/meetings`, data);
  return response.data;
};

/**
 * List board meetings
 * GET /api/boards/:id/meetings
 */
export const listBoardMeetings = async (boardId: number): Promise<ApiResponse<BoardMeeting[]>> => {
  const response = await api.get<ApiResponse<BoardMeeting[]>>(`/boards/${boardId}/meetings`);
  return response.data;
};

