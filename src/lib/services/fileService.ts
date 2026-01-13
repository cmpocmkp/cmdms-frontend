/**
 * File Service
 * API integration following API_INTEGRATION_GUIDE.md
 * 
 * Base URL: https://cmdms-backend-production.up.railway.app
 * API Base Path: /api
 * 
 * Endpoints:
 * - POST /api/files/upload - Upload file
 * - GET /api/files/:id - Get file
 * - DELETE /api/files/:id - Delete file
 */

import { api } from '../api';
import type { ApiResponse } from '../../types/api';

// ============================================================================
// Types
// ============================================================================

export interface FileData {
  id: number;
  originalName: string;
  fileName: string;
  filePath: string;
  mimeType: string;
  size: number;
  url: string;
  attachableType?: string;
  attachableId?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface UploadFileRequest {
  file: File | Blob;
  attachableType: string; // e.g., 'minute', 'directive', 'announcement'
  attachableId: number; // ID of the entity this file is attached to
}

export interface UploadFileResponse {
  success: boolean;
  data: FileData;
  error?: {
    message: string;
    details?: Array<{ field: string; message: string }>;
  };
}

// ============================================================================
// File Operations
// ============================================================================

/**
 * Upload file
 * POST /api/files/upload
 * 
 * @param data - File upload data (file, attachableType, attachableId)
 * @param onProgress - Optional progress callback (0-100)
 */
export const uploadFile = async (
  data: UploadFileRequest,
  onProgress?: (progress: number) => void
): Promise<ApiResponse<FileData>> => {
  const formData = new FormData();
  formData.append('file', data.file);
  formData.append('attachableType', data.attachableType);
  formData.append('attachableId', data.attachableId.toString());

  const response = await api.post<ApiResponse<FileData>>('/files/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(progress);
      }
    },
  });

  return response.data;
};

/**
 * Get file by ID
 * GET /api/files/:id
 */
export const getFile = async (id: number): Promise<ApiResponse<FileData>> => {
  const response = await api.get<ApiResponse<FileData>>(`/files/${id}`);
  return response.data;
};

/**
 * Delete file
 * DELETE /api/files/:id
 */
export const deleteFile = async (id: number): Promise<ApiResponse<void>> => {
  const response = await api.delete<ApiResponse<void>>(`/files/${id}`);
  return response.data;
};

/**
 * Download file
 * Helper function to download file from URL
 * 
 * @param file - File object with URL
 * @param filename - Optional custom filename
 */
export const downloadFile = async (file: FileData, filename?: string): Promise<void> => {
  try {
    // Fetch the file as blob
    const response = await api.get(file.url, {
      responseType: 'blob',
    });

    // Create blob URL and trigger download
    const blob = new Blob([response.data]);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || file.originalName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading file:', error);
    throw error;
  }
};

/**
 * Get file preview URL
 * Returns the URL for file preview/display
 */
export const getFilePreviewUrl = (file: FileData): string => {
  return file.url || '';
};

/**
 * Format file size
 * Helper to format bytes to human-readable size
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Get file icon based on MIME type
 * Helper to get icon class for file type
 */
export const getFileIcon = (mimeType: string): string => {
  if (mimeType.startsWith('image/')) return 'ti-image';
  if (mimeType === 'application/pdf') return 'ti-file-pdf';
  if (mimeType.includes('word') || mimeType.includes('document')) return 'ti-file-word';
  if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return 'ti-file-excel';
  if (mimeType.includes('powerpoint') || mimeType.includes('presentation')) return 'ti-file-slides';
  return 'ti-file';
};

