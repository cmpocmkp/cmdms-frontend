/**
 * Mock Notifications Data
 * For testing notification panel
 */

import { Notification } from '../../../types';
import { faker } from '@faker-js/faker';

export const mockNotifications: Notification[] = [
  {
    id: '1',
    user_id: 1,
    type: 'directive_reply' as any,
    title: 'Directive Reply',
    message: 'Response to directive regarding digital infrastructure development',
    data: {
      url: '/admin/directives/1',
      title: 'Response to directive regarding digital infrastructure development',
      subject: 'Digital Infrastructure Development',
      departmentName: 'Information Technology',
      userName: 'Ahmad Khan',
    },
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    updated_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: '2',
    user_id: 1,
    type: 'minute_reply' as any,
    title: 'Minute Reply',
    message: 'Reply on budget allocation for education sector',
    data: {
      url: '/admin/minutes/5/decisions/3',
      title: 'Reply on budget allocation for education sector',
      decision: 'Budget allocation approved for primary education reforms',
      departmentName: 'Education',
      meetingTitle: 'Cabinet Meeting - Education Reforms',
    },
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: '3',
    user_id: 1,
    type: 'announcement_reply' as any,
    title: 'Announcement Reply',
    message: 'Response to CM announcement regarding health facilities',
    data: {
      url: '/admin/announcements/7',
      title: 'Response to CM announcement regarding health facilities',
      departmentName: 'Health',
    },
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
  {
    id: '4',
    user_id: 1,
    type: 'minute_notification' as any,
    title: 'Minute Notification',
    message: 'Monthly progress review meeting scheduled',
    data: {
      url: '/admin/minutes/12',
      subject: 'Monthly progress review meeting scheduled',
      meetingUrl: '/admin/minutes/12',
    },
    read_at: new Date().toISOString(), // Already read
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: '5',
    user_id: 1,
    type: 'task_comment' as any,
    title: 'Task Comment',
    message: 'New comment on task: Infrastructure inspection report',
    data: {
      url: '/admin/tasks/15',
      title: 'New comment on task: Infrastructure inspection report',
    },
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
  },
];

/**
 * Get notifications for specific user
 */
export function getNotifications(_userId?: number): Notification[] {
  // For now, return mock notifications for all users
  return mockNotifications;
}

/**
 * Get unread count
 */
export function getUnreadCount(userId?: number): number {
  const notifications = getNotifications(userId);
  return notifications.filter(n => !n.read_at).length;
}

/**
 * Generate random notification (for testing)
 */
export function generateRandomNotification(): Notification {
  const types = [
    'minute_reply',
    'sectorial_agenda_reply',
    'minute_notification',
    'reply_notification',
    'announcement_reply',
    'task_comment',
    'directive_reply',
  ];

  const type = faker.helpers.arrayElement(types);
  const title = faker.lorem.sentence();
  
  return {
    id: faker.string.uuid(),
    user_id: 1,
    type: type as any,
    title: title,
    message: title,
    data: {
      url: '#',
      title: title,
      subject: faker.lorem.sentence(),
      departmentName: faker.helpers.arrayElement([
        'Information Technology',
        'Education',
        'Health',
        'Agriculture',
        'Finance',
      ]),
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

