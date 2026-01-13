/**
 * CM Remark Mapper
 * Maps backend API response (camelCase) to frontend format (snake_case)
 * Following API_INTEGRATION_GUIDE.md structure
 */

import * as cmRemarkService from '../services/cmRemarkService';

/**
 * Map API CM Remark to Frontend Display Format
 */
export interface DisplayCMRemark {
  id: number;
  subject: string;
  remark?: string;
  priority?: string;
  deadline?: string;
  status?: string;
  departmentIds?: number[];
  departments?: Array<{
    id: number;
    name: string;
    status?: string;
    remarks?: string;
  }>;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Map status number to label
 */
const mapStatusToLabel = (status: number | string | undefined): string => {
  if (typeof status === 'string') {
    return status;
  }
  if (typeof status === 'number') {
    // Map common status numbers (adjust based on actual API)
    const statusMap: { [key: number]: string } = {
      1: 'Completed',
      2: 'On Target',
      3: 'Overdue',
      4: 'Off Target',
      6: 'Overdue Other Reason',
      7: 'Ongoing',
      9: 'Off Target Reason',
    };
    return statusMap[status] || 'Pending';
  }
  return 'Pending';
};

/**
 * Map status label to number
 */
export const mapStatusToNumber = (status: string): number | undefined => {
  const statusMap: { [key: string]: number } = {
    'Completed': 1,
    'On Target': 2,
    'Overdue': 3,
    'Off Target': 4,
    'Overdue Other Reason': 6,
    'Ongoing': 7,
    'Off Target Reason': 9,
  };
  return statusMap[status];
};

/**
 * Map API CM Remark to Display Format
 */
export const mapCMRemarkToDisplay = (apiRemark: cmRemarkService.CMRemark): DisplayCMRemark => {
  return {
    id: apiRemark.id,
    subject: apiRemark.subject || '',
    remark: apiRemark.remark,
    priority: apiRemark.priority,
    deadline: apiRemark.deadline,
    status: mapStatusToLabel(apiRemark.status),
    departmentIds: apiRemark.departmentIds || apiRemark.departments?.map(d => d.id) || [],
    departments: apiRemark.departments?.map(dept => ({
      id: dept.id,
      name: dept.name,
      status: dept.pivot?.status ? mapStatusToLabel(dept.pivot.status) : undefined,
      remarks: dept.pivot?.remarks,
    })) || [],
    createdAt: apiRemark.createdAt,
    updatedAt: apiRemark.updatedAt,
  };
};

/**
 * Map Display CM Remark to API Create Format
 */
export const mapDisplayToCreateRequest = (
  displayRemark: Partial<DisplayCMRemark>
): cmRemarkService.CreateCMRemarkRequest => {
  return {
    subject: displayRemark.subject || '',
    remark: displayRemark.remark,
    priority: displayRemark.priority,
    deadline: displayRemark.deadline,
    departmentIds: displayRemark.departmentIds,
  };
};

/**
 * Map Display CM Remark to API Update Format
 */
export const mapDisplayToUpdateRequest = (
  displayRemark: Partial<DisplayCMRemark>
): cmRemarkService.UpdateCMRemarkRequest => {
  return {
    subject: displayRemark.subject,
    remark: displayRemark.remark,
    priority: displayRemark.priority,
    deadline: displayRemark.deadline,
    status: displayRemark.status ? mapStatusToNumber(displayRemark.status) : undefined,
    departmentIds: displayRemark.departmentIds,
  };
};


