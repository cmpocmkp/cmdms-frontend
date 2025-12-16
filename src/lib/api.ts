/**
 * Central API Client for CMDMS Frontend
 * 
 * ALL backend communication MUST go through this file.
 * Components should NEVER call axios/fetch directly.
 * 
 * Features:
 * - Mock/Real API toggle
 * - Request/Response interceptors
 * - Error handling
 * - Auth token management (when backend is ready)
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

// Toggle between mock and real backend
// Set to false when real backend is ready
export const USE_MOCK_DATA = true;

/**
 * API Client Configuration
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

/**
 * Request Interceptor
 * - Adds auth token (when backend is ready)
 * - Routes to mock data if USE_MOCK_DATA is true
 */
apiClient.interceptors.request.use(
  async (config) => {
    // If using mock data, prevent actual network requests
    if (USE_MOCK_DATA) {
      // We'll handle this in individual service files
      // This is just a marker that we're in mock mode
      if (!config.headers) {
        config.headers = {} as any;
      }
      config.headers['X-Mock-Mode'] = 'true';
    }
    
    // TODO: Add auth token when backend is ready
    // const token = getAuthToken();
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * - Handles common errors
 * - Refreshes token if needed (future)
 * - Logs responses in dev mode
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log in development
    if (import.meta.env.DEV) {
      console.log('API Response:', response);
    }
    
    return response;
  },
  async (error: AxiosError) => {
    // Handle specific error codes
    if (error.response) {
      const { status } = error.response;
      
      switch (status) {
        case 401:
          // Unauthorized - redirect to login
          console.error('Unauthorized access - redirecting to login');
          // TODO: Clear auth state and redirect
          // window.location.href = '/login';
          break;
          
        case 403:
          // Forbidden
          console.error('Access forbidden');
          break;
          
        case 404:
          // Not found
          console.error('Resource not found');
          break;
          
        case 422:
          // Validation error
          console.error('Validation error:', error.response.data);
          break;
          
        case 500:
          // Server error
          console.error('Server error');
          break;
          
        default:
          console.error('API Error:', error.message);
      }
    } else if (error.request) {
      // Network error
      console.error('Network error - no response received');
    } else {
      console.error('Request setup error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

/**
 * Helper function to simulate network delay for mock data
 */
export const simulateNetworkDelay = (ms: number = 300): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Helper to randomly simulate errors (for testing error handling)
 */
export const shouldSimulateError = (probability: number = 0.05): boolean => {
  return Math.random() < probability;
};

/**
 * Get auth token from storage (placeholder)
 */
export const getAuthToken = (): string | null => {
  // TODO: Implement when backend is ready
  return localStorage.getItem('auth_token');
};

/**
 * Set auth token in storage (placeholder)
 */
export const setAuthToken = (token: string): void => {
  localStorage.setItem('auth_token', token);
};

/**
 * Clear auth token from storage
 */
export const clearAuthToken = (): void => {
  localStorage.removeItem('auth_token');
};

/**
 * Export the configured axios instance
 */
export default apiClient;

/**
 * Export commonly used HTTP methods with better TypeScript support
 */
export const api = {
  get: <T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return apiClient.get<T>(url, config);
  },
  
  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return apiClient.post<T>(url, data, config);
  },
  
  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return apiClient.put<T>(url, data, config);
  },
  
  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return apiClient.patch<T>(url, data, config);
  },
  
  delete: <T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return apiClient.delete<T>(url, config);
  },
};

/**
 * File upload helper
 */
export const uploadFile = async (
  url: string,
  file: File,
  onProgress?: (progress: number) => void
): Promise<AxiosResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  
  return apiClient.post(url, formData, {
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
};

/**
 * Multiple files upload helper
 */
export const uploadFiles = async (
  url: string,
  files: File[],
  onProgress?: (progress: number) => void
): Promise<AxiosResponse> => {
  const formData = new FormData();
  files.forEach((file, index) => {
    formData.append(`files[${index}]`, file);
  });
  
  return apiClient.post(url, formData, {
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
};

/**
 * Download file helper
 */
export const downloadFile = async (url: string, filename: string): Promise<void> => {
  const response = await apiClient.get(url, {
    responseType: 'blob',
  });
  
  // Create blob link to download
  const href = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = href;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(href);
};
