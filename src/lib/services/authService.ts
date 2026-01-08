/**
 * Authentication Service
 * API integration following API_INTEGRATION_GUIDE.md
 * 
 * Base URL: https://cmdms-backend-production.up.railway.app
 * API Base Path: /api
 * 
 * Endpoints:
 * - POST /api/auth/login
 * - POST /api/auth/change-password
 * - POST /api/auth/forgot-password
 * - POST /api/auth/reset-password
 * - POST /api/auth/logout
 */

import { api } from '../api';
import type {
  ApiResponse,
  LoginRequest,
  LoginResponseData,
  ChangePasswordRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
} from '../../types/api';

/**
 * Login user
 * POST /api/auth/login
 */
export const login = async (credentials: LoginRequest): Promise<ApiResponse<LoginResponseData>> => {
  const response = await api.post<ApiResponse<LoginResponseData>>('/auth/login', credentials);
  return response.data;
};

/**
 * Change password
 * POST /api/auth/change-password
 */
export const changePassword = async (
  oldPassword: string,
  newPassword: string
): Promise<ApiResponse<void>> => {
  const response = await api.post<ApiResponse<void>>('/auth/change-password', {
    oldPassword,
    newPassword,
  });
  return response.data;
};

/**
 * Logout user
 * POST /api/auth/logout
 */
export const logout = async (): Promise<ApiResponse<void>> => {
  const response = await api.post<ApiResponse<void>>('/auth/logout');
  return response.data;
};

/**
 * Request password reset (forgot password)
 * POST /api/auth/forgot-password
 */
export const forgotPassword = async (
  email: string
): Promise<ApiResponse<void>> => {
  const request: ForgotPasswordRequest = { email };
  const response = await api.post<ApiResponse<void>>('/auth/forgot-password', request);
  return response.data;
};

/**
 * Reset password with token
 * POST /api/auth/reset-password
 */
export const resetPassword = async (
  token: string,
  newPassword: string
): Promise<ApiResponse<void>> => {
  const request: ResetPasswordRequest = { token, newPassword };
  const response = await api.post<ApiResponse<void>>('/auth/reset-password', request);
  return response.data;
};

