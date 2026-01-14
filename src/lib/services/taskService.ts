/**
 * Tasks Service
 * API integration following API_INTEGRATION_GUIDE.md
 * 
 * Base URL: https://cmdms-backend-production.up.railway.app
 * API Base Path: /api
 * 
 * Endpoints:
 * - GET /api/tasks - List tasks
 * - GET /api/tasks/:id - Get task
 * - POST /api/tasks - Create task
 * - PATCH /api/tasks/:id/status - Update task status
 * - POST /api/tasks/:id/comments - Add task comment
 */

import { api } from '../api';
import type { ApiResponse, PaginatedResponse } from '../../types/api';

// ============================================================================
// Types
// ============================================================================

export interface Task {
  id: number;
  title: string;
  description?: string;
  departmentId?: number;
  deadline?: string; // Format: "2024-03-31"
  priority?: string; // "low", "medium", "high"
  status?: string; // "pending", "in-progress", "completed", "cancelled"
  createdAt?: string;
  updatedAt?: string;
  department?: {
    id: number;
    name: string;
  };
  comments?: TaskComment[];
}

export interface TaskComment {
  id: number;
  taskId: number;
  content: string;
  createdAt?: string;
  updatedAt?: string;
  user?: {
    id: number;
    name: string;
    department?: {
      name: string;
    };
  };
}

export interface ListTasksParams {
  page?: number;
  perPage?: number;
  status?: string; // "pending", "in-progress", "completed", "cancelled"
  departmentId?: number;
  priority?: string; // "low", "medium", "high"
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  departmentId?: number;
  deadline?: string; // Format: "2024-03-31"
  priority?: string; // "low", "medium", "high"
}

export interface UpdateTaskStatusRequest {
  status: string; // "pending", "in-progress", "completed", "cancelled"
}

export interface CreateTaskCommentRequest {
  content: string;
}

// ============================================================================
// API Functions
// ============================================================================

/**
 * List tasks with pagination and filters
 */
export const listTasks = async (
  params?: ListTasksParams
): Promise<PaginatedResponse<Task>> => {
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
  if (params?.priority) {
    queryParams.append('priority', params.priority);
  }

  const url = `/tasks${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  const response = await api.get<ApiResponse<PaginatedResponse<Task>>>(url);
  return response.data.data;
};

/**
 * Get a single task by ID
 */
export const getTask = async (id: number): Promise<Task> => {
  const response = await api.get<ApiResponse<Task>>(`/tasks/${id}`);
  return response.data.data;
};

/**
 * Create a new task
 */
export const createTask = async (
  data: CreateTaskRequest
): Promise<Task> => {
  const response = await api.post<ApiResponse<Task>>('/tasks', data);
  return response.data.data;
};

/**
 * Update task status
 */
export const updateTaskStatus = async (
  id: number,
  data: UpdateTaskStatusRequest
): Promise<Task> => {
  const response = await api.patch<ApiResponse<Task>>(`/tasks/${id}/status`, data);
  return response.data.data;
};

/**
 * Add a comment to a task
 */
export const addTaskComment = async (
  id: number,
  data: CreateTaskCommentRequest
): Promise<TaskComment> => {
  const response = await api.post<ApiResponse<TaskComment>>(`/tasks/${id}/comments`, data);
  return response.data.data;
};



