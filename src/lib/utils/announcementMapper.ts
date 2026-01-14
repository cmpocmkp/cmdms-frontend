/**
 * Announcement Mapper
 * Maps backend API response (camelCase) to frontend format (snake_case)
 * Following API_INTEGRATION_GUIDE.md structure
 */

import * as announcementService from '../services/announcementService';

/**
 * Map API Announcement to Frontend Display Format
 * Note: The frontend mock structure uses district/venue format,
 * but API uses title/description/departmentIds format
 */
export interface DisplayAnnouncement {
  id: number;
  title: string;
  description?: string;
  content?: string;
  type?: string;
  priority?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  targetAudience?: string;
  departmentIds?: number[];
  departments?: Array<{
    id: number;
    name: string;
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
    switch (status) {
      case 1:
        return 'Active';
      case 0:
        return 'Inactive';
      default:
        return 'Pending';
    }
  }
  return 'Pending';
};

/**
 * Map API Announcement to Display Format
 */
export const mapAnnouncementToDisplay = (apiAnnouncement: announcementService.Announcement): DisplayAnnouncement => {
  return {
    id: apiAnnouncement.id,
    title: apiAnnouncement.title || '',
    description: apiAnnouncement.description,
    content: apiAnnouncement.content,
    type: apiAnnouncement.type,
    priority: apiAnnouncement.priority,
    status: mapStatusToLabel(apiAnnouncement.status),
    startDate: apiAnnouncement.startDate,
    endDate: apiAnnouncement.endDate,
    targetAudience: apiAnnouncement.targetAudience,
    departmentIds: apiAnnouncement.departmentIds || apiAnnouncement.departments?.map(d => d.id) || [],
    departments: apiAnnouncement.departments || [],
    createdAt: apiAnnouncement.createdAt,
    updatedAt: apiAnnouncement.updatedAt,
  };
};

/**
 * Map Display Announcement to API Create Format
 */
export const mapDisplayToCreateRequest = (
  displayAnnouncement: Partial<DisplayAnnouncement>
): announcementService.CreateAnnouncementRequest => {
  return {
    title: displayAnnouncement.title || '',
    description: displayAnnouncement.description,
    content: displayAnnouncement.content,
    type: displayAnnouncement.type,
    priority: displayAnnouncement.priority,
    startDate: displayAnnouncement.startDate,
    endDate: displayAnnouncement.endDate,
    targetAudience: displayAnnouncement.targetAudience,
    departmentIds: displayAnnouncement.departmentIds,
  };
};

/**
 * Map Display Announcement to API Update Format
 */
export const mapDisplayToUpdateRequest = (
  displayAnnouncement: Partial<DisplayAnnouncement>
): announcementService.UpdateAnnouncementRequest => {
  return {
    title: displayAnnouncement.title,
    description: displayAnnouncement.description,
    content: displayAnnouncement.content,
    type: displayAnnouncement.type,
    priority: displayAnnouncement.priority,
    status: displayAnnouncement.status,
    startDate: displayAnnouncement.startDate,
    endDate: displayAnnouncement.endDate,
    targetAudience: displayAnnouncement.targetAudience,
    departmentIds: displayAnnouncement.departmentIds,
  };
};



