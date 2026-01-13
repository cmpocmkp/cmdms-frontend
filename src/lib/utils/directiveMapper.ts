/**
 * Directive Mapper
 * Maps backend API response (camelCase) to frontend format (snake_case)
 * Following API_INTEGRATION_GUIDE.md structure
 */

import * as directiveService from '../services/directiveService';

/**
 * Map API Directive to Frontend Display Format
 */
export interface DisplayDirective {
  id: number;
  subject: string; // Maps from title
  comments?: string; // From description or responses
  progress?: string;
  letter_no: string; // Maps from referenceNumber
  date: string; // Maps from deadline or createdAt
  timeline?: string;
  status: string; // Maps from status (1=Completed, 2=On Target, 3=Overdue)
  department_ids?: number[];
  departments: Array<{
    id: number;
    name: string;
    status?: string | number;
    remarks?: string;
  }>;
  attachments?: string[];
  is_archived: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Map status number to label
 */
const mapStatusToLabel = (status: number | string | undefined): string => {
  if (typeof status === 'string') {
    // If already a string, check if it's a valid status
    if (['Completed', 'On Target', 'Overdue'].includes(status)) {
      return status;
    }
    // Try to parse as number
    const num = parseInt(status, 10);
    if (!isNaN(num)) {
      return mapStatusNumberToLabel(num);
    }
    return status;
  }
  if (typeof status === 'number') {
    return mapStatusNumberToLabel(status);
  }
  return 'Pending';
};

const mapStatusNumberToLabel = (status: number): string => {
  switch (status) {
    case 1:
      return 'Completed';
    case 2:
      return 'On Target';
    case 3:
      return 'Overdue';
    default:
      return 'Pending';
  }
};

/**
 * Map API Directive to Display Format
 */
export const mapDirectiveToDisplay = (apiDirective: directiveService.Directive): DisplayDirective => {
  return {
    id: apiDirective.id,
    subject: apiDirective.title || '',
    comments: apiDirective.description || '',
    letter_no: apiDirective.referenceNumber || '',
    date: apiDirective.deadline || apiDirective.createdAt || new Date().toISOString(),
    status: mapStatusToLabel(apiDirective.status),
    department_ids: apiDirective.departments?.map(d => d.id) || [],
    departments: (apiDirective.departments || []).map(dept => ({
      id: dept.id,
      name: dept.name,
      status: mapStatusToLabel(apiDirective.status), // Use directive status for now
    })),
    attachments: [],
    is_archived: false,
    created_at: apiDirective.createdAt || new Date().toISOString(),
    updated_at: apiDirective.updatedAt || new Date().toISOString(),
  };
};

/**
 * Map Display Directive to API Create Format
 */
export const mapDisplayToCreateRequest = (
  displayDirective: Partial<DisplayDirective>
): directiveService.CreateDirectiveRequest => {
  return {
    title: displayDirective.subject || '',
    description: displayDirective.comments,
    referenceNumber: displayDirective.letter_no,
    deadline: displayDirective.date,
    departmentIds: displayDirective.department_ids,
    priority: 'medium', // Default if not provided
  };
};

/**
 * Map Display Directive to API Update Format
 */
export const mapDisplayToUpdateRequest = (
  displayDirective: Partial<DisplayDirective>
): directiveService.UpdateDirectiveRequest => {
  // Map status label back to number
  const mapStatusLabelToNumber = (status: string | undefined): number | undefined => {
    if (!status) return undefined;
    switch (status) {
      case 'Completed':
        return 1;
      case 'On Target':
        return 2;
      case 'Overdue':
        return 3;
      default:
        return undefined;
    }
  };

  return {
    title: displayDirective.subject,
    description: displayDirective.comments,
    referenceNumber: displayDirective.letter_no,
    deadline: displayDirective.date,
    status: mapStatusLabelToNumber(displayDirective.status),
    departmentIds: displayDirective.department_ids,
  };
};

