/**
 * Mock Department Data for Dashboard
 * Used in the Department-Wise Dashboard
 */

import { faker } from '@faker-js/faker';

export interface DashboardDepartment {
  id: number;
  name: string;
  total_tasks_count: number;
  total_completed_count: number;
  total_on_target_count: number;
  total_overdue_count: number;
}

export interface DashboardTotals {
  total_tasks: number;
  total_completed: number;
  total_on_target: number;
  total_overdue: number;
  completed_percentage: number;
  on_target_percentage: number;
  overdue_percentage: number;
}

// Generate mock departments
const generateMockDepartments = (count: number): DashboardDepartment[] => {
  const departments: DashboardDepartment[] = [];
  
  for (let i = 1; i <= count; i++) {
    const totalTasks = faker.number.int({ min: 50, max: 500 });
    const completed = faker.number.int({ min: 10, max: Math.floor(totalTasks * 0.4) });
    const onTarget = faker.number.int({ min: 10, max: Math.floor(totalTasks * 0.5) });
    const overdue = totalTasks - completed - onTarget;
    
    departments.push({
      id: i,
      name: `Department of ${faker.company.buzzNoun().charAt(0).toUpperCase() + faker.company.buzzNoun().slice(1)}`,
      total_tasks_count: totalTasks,
      total_completed_count: completed,
      total_on_target_count: onTarget,
      total_overdue_count: Math.max(0, overdue),
    });
  }
  
  return departments;
};

export const mockDashboardDepartments = generateMockDepartments(40);

// Calculate overall totals
export const calculateTotals = (departments: DashboardDepartment[]): DashboardTotals => {
  const totals = departments.reduce(
    (acc, dept) => ({
      total_tasks: acc.total_tasks + dept.total_tasks_count,
      total_completed: acc.total_completed + dept.total_completed_count,
      total_on_target: acc.total_on_target + dept.total_on_target_count,
      total_overdue: acc.total_overdue + dept.total_overdue_count,
    }),
    {
      total_tasks: 0,
      total_completed: 0,
      total_on_target: 0,
      total_overdue: 0,
    }
  );
  
  return {
    ...totals,
    completed_percentage: totals.total_tasks
      ? Math.round((totals.total_completed / totals.total_tasks) * 100 * 100) / 100
      : 0,
    on_target_percentage: totals.total_tasks
      ? Math.round((totals.total_on_target / totals.total_tasks) * 100 * 100) / 100
      : 0,
    overdue_percentage: totals.total_tasks
      ? Math.round((totals.total_overdue / totals.total_tasks) * 100 * 100) / 100
      : 0,
  };
};

export const mockOverallTotals = calculateTotals(mockDashboardDepartments);

// Module relations
export const moduleRelations = [
  'minutes',
  'sectoral',
  'directives',
  'interventions',
  'ptis',
  'announcements',
];

// Module display names
export const moduleDisplayNames: Record<string, string> = {
  minutes: 'Minutes',
  sectoral: 'Sectoral',
  directives: 'Directives',
  interventions: 'Trackers',
  ptis: 'PTIs',
  announcements: 'Announcements',
};

// Mock module totals
export const mockModuleTotals: Record<string, number> = {
  minutes: 3200,
  sectoral: 2100,
  directives: 1800,
  interventions: 1200,
  ptis: 950,
  announcements: 850,
};
