/**
 * Mock Activity Logs Data
 * Used in Activity Logs page
 */

import { faker } from '@faker-js/faker';
import { mockAdminUsers } from './adminUsers';

export interface ActivityLog {
  id: number;
  user_id: number;
  user_name: string;
  user_email: string;
  department_id: number;
  department_name: string;
  action: 'login' | 'logout';
  created_at: Date;
}

// Generate mock activity logs
const generateMockActivityLogs = (count: number): ActivityLog[] => {
  const logs: ActivityLog[] = [];
  
  for (let i = 1; i <= count; i++) {
    // Random user from mockAdminUsers
    const user = faker.helpers.arrayElement(mockAdminUsers);
    
    // Random action
    const action = faker.helpers.arrayElement(['login', 'logout'] as const);
    
    // Random recent date
    const created_at = faker.date.recent({ days: 30 });
    
    logs.push({
      id: i,
      user_id: user.id,
      user_name: user.name,
      user_email: user.email,
      department_id: user.department_id,
      department_name: user.department_name,
      action,
      created_at,
    });
  }
  
  // Sort by date descending (newest first)
  logs.sort((a, b) => b.created_at.getTime() - a.created_at.getTime());
  
  return logs;
};

export const mockActivityLogs = generateMockActivityLogs(200);

// Filter options
export const activityActionOptions = [
  { value: '', label: 'All' },
  { value: 'login', label: 'Login' },
  { value: 'logout', label: 'Logout' },
];
