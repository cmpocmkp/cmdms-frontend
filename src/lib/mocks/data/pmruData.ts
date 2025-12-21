/**
 * Mock Data for PMRU Meetings Report
 */

import { faker } from '@faker-js/faker';
import { mockDepartments } from './departments';

export interface PMRUDepartment {
  id: number;
  name: string;
  decisions_count: number;
  completed: number;
  on_target: number;
  on_going: number;
  off_target: number;
  overdue: number;
  off_target_other: number;
  overdue_other: number;
}

export interface PMRURelatedDepartment {
  name: string;
  id: number;
  count: number;
}

// Generate mock PMRU departments with decision counts
export function generateMockPMRUDepartments(): PMRUDepartment[] {
  // Filter main departments (exclude Admin, Data Entry, Department, etc.)
  const mainDepartments = mockDepartments.filter(
    dept => dept.department_type_id === 1 && 
    !['Admin', 'Data Entry', 'Department'].includes(dept.name)
  );

  return mainDepartments.map(dept => {
    const total = faker.number.int({ min: 0, max: 50 });
    const completed = faker.number.int({ min: 0, max: Math.floor(total * 0.4) });
    const on_target = faker.number.int({ min: 0, max: Math.floor(total * 0.3) });
    const on_going = faker.number.int({ min: 0, max: Math.floor(total * 0.2) });
    const off_target = faker.number.int({ min: 0, max: Math.floor(total * 0.1) });
    const overdue = faker.number.int({ min: 0, max: Math.floor(total * 0.1) });
    const off_target_other = faker.number.int({ min: 0, max: Math.floor(total * 0.05) });
    const overdue_other = faker.number.int({ min: 0, max: Math.floor(total * 0.05) });

    return {
      id: dept.id,
      name: dept.name,
      decisions_count: total,
      completed,
      on_target,
      on_going,
      off_target,
      overdue,
      off_target_other,
      overdue_other
    };
  });
}

// Generate mock related departments (departments that have decisions but are not PMRU department itself)
export function generateMockPMRURelatedDepartments(): PMRURelatedDepartment[] {
  const relatedDeptNames = [
    'Health Department',
    'Education Department',
    'Agriculture Department',
    'Transport Department',
    'Finance Department',
    'Planning & Development',
    'Public Works Department',
    'Irrigation Department',
    'Energy & Power',
    'Information & Public Relations',
    'Social Welfare',
    'Revenue',
    'Food',
    'Excise & Taxation',
    'LG & RDD'
  ];

  return relatedDeptNames.map((name, index) => ({
    name,
    id: 100 + index, // Use IDs starting from 100 to avoid conflicts
    count: faker.number.int({ min: 1, max: 30 })
  }));
}
