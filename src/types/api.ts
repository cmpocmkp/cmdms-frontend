/**
 * API Response Types
 * Based on backend API contract from API_INTEGRATION_GUIDE.md
 * 
 * Backend Response Format:
 * - Success: { success: true, data: T, message?: string, meta?: PaginationMeta }
 * - Error: { success: false, error: ApiError }
 */

/**
 * Standard API Success Response
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  meta?: PaginationMeta;
}

/**
 * Standard API Error Response
 */
export interface ApiError {
  code?: string;
  message: string;
  details?: Array<{
    field?: string;
    message: string;
  }>;
}

/**
 * Pagination Metadata
 */
export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Paginated API Response
 */
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: PaginationMeta;
}

/**
 * Login Request
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Login Response Data (from backend)
 * Note: Backend uses camelCase (roleId, departmentId, accessToken, refreshToken)
 */
export interface LoginResponseData {
  user: {
    id: number;
    name: string;
    email: string;
    phone?: string;
    roleId: number;
    role?: {
      id: number;
      name: string;
    };
    departmentId?: number;
    department?: {
      id: number;
      name: string;
    };
  };
  accessToken: string;
  refreshToken: string;
}

/**
 * Change Password Request
 */
export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

/**
 * Forgot Password Request
 */
export interface ForgotPasswordRequest {
  email: string;
}

/**
 * Reset Password Request
 */
export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

