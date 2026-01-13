/**
 * Tag Service
 * API integration following API_INTEGRATION_GUIDE.md
 * 
 * Base URL: https://cmdms-backend-production.up.railway.app
 * API Base Path: /api
 * 
 * Endpoints:
 * - POST /api/tags (Create tag)
 * - GET /api/tags (List tags)
 * - POST /api/tags/attach (Attach tag to entity)
 * - POST /api/tags/detach (Detach tag from entity)
 * - GET /api/tags/entity/:type/:id (Get tags for entity)
 */

import { api } from '../api';
import type { ApiResponse } from '../../types/api';

export interface Tag {
  id: number;
  name: string;
  color?: string;
  parentId?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTagRequest {
  name: string;
  color?: string;
}

export interface AttachTagRequest {
  tagId: number;
  entityType: string;
  entityId: number;
}

export interface DetachTagRequest {
  tagId: number;
  entityType: string;
  entityId: number;
}

/**
 * Create tag
 * POST /api/tags
 */
export const createTag = async (data: CreateTagRequest): Promise<ApiResponse<Tag>> => {
  const response = await api.post<ApiResponse<Tag>>('/tags', data);
  return response.data;
};

/**
 * List all tags
 * GET /api/tags
 */
export const listTags = async (): Promise<ApiResponse<Tag[]>> => {
  const response = await api.get<ApiResponse<Tag[]>>('/tags');
  return response.data;
};

/**
 * Attach tag to entity
 * POST /api/tags/attach
 */
export const attachTag = async (data: AttachTagRequest): Promise<ApiResponse<void>> => {
  const response = await api.post<ApiResponse<void>>('/tags/attach', data);
  return response.data;
};

/**
 * Detach tag from entity
 * POST /api/tags/detach
 */
export const detachTag = async (data: DetachTagRequest): Promise<ApiResponse<void>> => {
  const response = await api.post<ApiResponse<void>>('/tags/detach', data);
  return response.data;
};

/**
 * Get tags for entity
 * GET /api/tags/entity/:type/:id
 */
export const getEntityTags = async (entityType: string, entityId: number): Promise<ApiResponse<Tag[]>> => {
  const response = await api.get<ApiResponse<Tag[]>>(`/tags/entity/${entityType}/${entityId}`);
  return response.data;
};

