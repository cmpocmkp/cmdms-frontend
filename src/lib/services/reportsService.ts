/**
 * Reports Service
 * API integration following API_INTEGRATION_GUIDE.md
 * 
 * Base URL: https://cmdms-backend-production.up.railway.app
 * API Base Path: /api
 * 
 * Note: Dashboard and Department Performance reports are in dashboardService.ts
 * This service covers all other report endpoints.
 * 
 * Endpoints:
 * - GET /api/reports/meetings/summary - Meetings summary report
 * - GET /api/reports/minutes/status-summary - Minutes status summary report
 * - GET /api/reports/tasks/overview - Tasks overview report
 * - GET /api/reports/compliance/directives - Compliance directives report
 * - GET /api/reports/compliance/timelines - Compliance timelines report
 * - GET /api/reports/complaints/stats - Complaints statistics report
 * - GET /api/reports/kpi/summary - KPI summary report
 * - GET /api/reports/analytics/trends - Analytics trends report
 * - GET /api/reports/schemes/financial-summary - Schemes financial summary report
 * - GET /api/reports/schemes/progress - Schemes progress report
 * - GET /api/reports/ptf/issues-summary - PTF issues summary report
 * - GET /api/reports/export/meetings - Export meetings report
 * - GET /api/reports/export/minutes - Export minutes report
 */

import { api } from '../api';
import type { ApiResponse } from '../../types/api';

// ============================================================================
// Types
// ============================================================================

export interface MeetingsSummaryReport {
  // Response structure depends on API - using generic type for now
  [key: string]: any;
}

export interface MinutesStatusSummaryReport {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  overdue: number;
}

export interface TasksOverviewReport {
  // Response structure depends on API - using generic type for now
  [key: string]: any;
}

export interface ComplianceDirectivesReport {
  // Response structure depends on API - using generic type for now
  [key: string]: any;
}

export interface ComplianceTimelinesReport {
  // Response structure depends on API - using generic type for now
  [key: string]: any;
}

export interface ComplaintsStatisticsReport {
  // Response structure depends on API - using generic type for now
  [key: string]: any;
}

export interface KPISummaryReport {
  // Response structure depends on API - using generic type for now
  [key: string]: any;
}

export interface AnalyticsTrendsReport {
  // Response structure depends on API - using generic type for now
  [key: string]: any;
}

export interface SchemesFinancialSummaryReport {
  // Response structure depends on API - using generic type for now
  [key: string]: any;
}

export interface SchemesProgressReport {
  // Response structure depends on API - using generic type for now
  [key: string]: any;
}

export interface PTFIssuesSummaryReport {
  // Response structure depends on API - using generic type for now
  [key: string]: any;
}

// ============================================================================
// Query Parameters
// ============================================================================

export interface MeetingsSummaryParams {
  fromDate?: string; // YYYY-MM-DD
  toDate?: string; // YYYY-MM-DD
  meetingType?: string;
}

export interface MinutesStatusSummaryParams {
  departmentId?: number;
}

export interface ComplaintsStatsParams {
  fromDate?: string; // YYYY-MM-DD
  toDate?: string; // YYYY-MM-DD
}

export interface KPISummaryParams {
  departmentId?: number;
}

export interface AnalyticsTrendsParams {
  metric?: string; // e.g., "task_completion"
  interval?: string; // e.g., "monthly"
}

export interface SchemesFinancialSummaryParams {
  year?: number;
}

export interface SchemesProgressParams {
  departmentId?: number;
}

export interface PTFIssuesSummaryParams {
  districtId?: number;
  year?: number;
}

export interface ExportMeetingsParams {
  format?: string; // "csv" | "xlsx" | "pdf"
  fromDate?: string; // YYYY-MM-DD
  toDate?: string; // YYYY-MM-DD
}

export interface ExportMinutesParams {
  format?: string; // "csv" | "xlsx" | "pdf"
  meetingId?: number;
}

// ============================================================================
// Report Operations
// ============================================================================

/**
 * Get meetings summary report
 * GET /api/reports/meetings/summary
 */
export const getMeetingsSummaryReport = async (
  params?: MeetingsSummaryParams
): Promise<ApiResponse<MeetingsSummaryReport>> => {
  const queryParams = new URLSearchParams();
  
  if (params?.fromDate) {
    queryParams.append('fromDate', params.fromDate);
  }
  if (params?.toDate) {
    queryParams.append('toDate', params.toDate);
  }
  if (params?.meetingType) {
    queryParams.append('meetingType', params.meetingType);
  }

  const url = `/reports/meetings/summary${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  const response = await api.get<ApiResponse<MeetingsSummaryReport>>(url);
  return response.data;
};

/**
 * Get minutes status summary report
 * GET /api/reports/minutes/status-summary
 */
export const getMinutesStatusSummaryReport = async (
  params?: MinutesStatusSummaryParams
): Promise<ApiResponse<MinutesStatusSummaryReport>> => {
  const queryParams = new URLSearchParams();
  
  if (params?.departmentId) {
    queryParams.append('departmentId', params.departmentId.toString());
  }

  const url = `/reports/minutes/status-summary${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  const response = await api.get<ApiResponse<MinutesStatusSummaryReport>>(url);
  return response.data;
};

/**
 * Get tasks overview report
 * GET /api/reports/tasks/overview
 */
export const getTasksOverviewReport = async (): Promise<ApiResponse<TasksOverviewReport>> => {
  const response = await api.get<ApiResponse<TasksOverviewReport>>('/reports/tasks/overview');
  return response.data;
};

/**
 * Get compliance directives report
 * GET /api/reports/compliance/directives
 */
export const getComplianceDirectivesReport = async (): Promise<ApiResponse<ComplianceDirectivesReport>> => {
  const response = await api.get<ApiResponse<ComplianceDirectivesReport>>('/reports/compliance/directives');
  return response.data;
};

/**
 * Get compliance timelines report
 * GET /api/reports/compliance/timelines
 */
export const getComplianceTimelinesReport = async (): Promise<ApiResponse<ComplianceTimelinesReport>> => {
  const response = await api.get<ApiResponse<ComplianceTimelinesReport>>('/reports/compliance/timelines');
  return response.data;
};

/**
 * Get complaints statistics report
 * GET /api/reports/complaints/stats
 */
export const getComplaintsStatisticsReport = async (
  params?: ComplaintsStatsParams
): Promise<ApiResponse<ComplaintsStatisticsReport>> => {
  const queryParams = new URLSearchParams();
  
  if (params?.fromDate) {
    queryParams.append('fromDate', params.fromDate);
  }
  if (params?.toDate) {
    queryParams.append('toDate', params.toDate);
  }

  const url = `/reports/complaints/stats${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  const response = await api.get<ApiResponse<ComplaintsStatisticsReport>>(url);
  return response.data;
};

/**
 * Get KPI summary report
 * GET /api/reports/kpi/summary
 */
export const getKPISummaryReport = async (
  params?: KPISummaryParams
): Promise<ApiResponse<KPISummaryReport>> => {
  const queryParams = new URLSearchParams();
  
  if (params?.departmentId) {
    queryParams.append('departmentId', params.departmentId.toString());
  }

  const url = `/reports/kpi/summary${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  const response = await api.get<ApiResponse<KPISummaryReport>>(url);
  return response.data;
};

/**
 * Get analytics trends report
 * GET /api/reports/analytics/trends
 */
export const getAnalyticsTrendsReport = async (
  params?: AnalyticsTrendsParams
): Promise<ApiResponse<AnalyticsTrendsReport>> => {
  const queryParams = new URLSearchParams();
  
  if (params?.metric) {
    queryParams.append('metric', params.metric);
  }
  if (params?.interval) {
    queryParams.append('interval', params.interval);
  }

  const url = `/reports/analytics/trends${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  const response = await api.get<ApiResponse<AnalyticsTrendsReport>>(url);
  return response.data;
};

/**
 * Get schemes financial summary report
 * GET /api/reports/schemes/financial-summary
 */
export const getSchemesFinancialSummaryReport = async (
  params?: SchemesFinancialSummaryParams
): Promise<ApiResponse<SchemesFinancialSummaryReport>> => {
  const queryParams = new URLSearchParams();
  
  if (params?.year) {
    queryParams.append('year', params.year.toString());
  }

  const url = `/reports/schemes/financial-summary${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  const response = await api.get<ApiResponse<SchemesFinancialSummaryReport>>(url);
  return response.data;
};

/**
 * Get schemes progress report
 * GET /api/reports/schemes/progress
 */
export const getSchemesProgressReport = async (
  params?: SchemesProgressParams
): Promise<ApiResponse<SchemesProgressReport>> => {
  const queryParams = new URLSearchParams();
  
  if (params?.departmentId) {
    queryParams.append('departmentId', params.departmentId.toString());
  }

  const url = `/reports/schemes/progress${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  const response = await api.get<ApiResponse<SchemesProgressReport>>(url);
  return response.data;
};

/**
 * Get PTF issues summary report
 * GET /api/reports/ptf/issues-summary
 */
export const getPTFIssuesSummaryReport = async (
  params?: PTFIssuesSummaryParams
): Promise<ApiResponse<PTFIssuesSummaryReport>> => {
  const queryParams = new URLSearchParams();
  
  if (params?.districtId) {
    queryParams.append('districtId', params.districtId.toString());
  }
  if (params?.year) {
    queryParams.append('year', params.year.toString());
  }

  const url = `/reports/ptf/issues-summary${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  const response = await api.get<ApiResponse<PTFIssuesSummaryReport>>(url);
  return response.data;
};

/**
 * Export meetings report
 * GET /api/reports/export/meetings
 * Note: This endpoint returns a file (blob), not JSON
 */
export const exportMeetingsReport = async (
  params?: ExportMeetingsParams
): Promise<Blob> => {
  const queryParams = new URLSearchParams();
  
  if (params?.format) {
    queryParams.append('format', params.format);
  }
  if (params?.fromDate) {
    queryParams.append('fromDate', params.fromDate);
  }
  if (params?.toDate) {
    queryParams.append('toDate', params.toDate);
  }

  const url = `/reports/export/meetings${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  const response = await api.get(url, {
    responseType: 'blob',
  });
  return response.data;
};

/**
 * Export minutes report
 * GET /api/reports/export/minutes
 * Note: This endpoint returns a file (blob), not JSON
 */
export const exportMinutesReport = async (
  params?: ExportMinutesParams
): Promise<Blob> => {
  const queryParams = new URLSearchParams();
  
  if (params?.format) {
    queryParams.append('format', params.format);
  }
  if (params?.meetingId) {
    queryParams.append('meetingId', params.meetingId.toString());
  }

  const url = `/reports/export/minutes${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  const response = await api.get(url, {
    responseType: 'blob',
  });
  return response.data;
};


