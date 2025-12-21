/**
 * Mock Data for PTF (Provincial Task Force) Module
 */

import { faker } from '@faker-js/faker';
import { mockDepartments } from './departments';

export interface PTFDepartment {
  id: number;
  name: string;
  total: number;
  completed: number;
  on_target: number;
  on_going: number;
  off_target: number;
  overdue: number;
  overdue_other: number;
  off_target_other: number;
}

// Generate mock PTF departments with meeting minutes counts
export function generateMockPTFDepartments(): PTFDepartment[] {
  // Filter main departments (exclude Admin, Data Entry, Department, and ID 177)
  const mainDepartments = mockDepartments.filter(
    dept => dept.department_type_id === 1 && 
    dept.id !== 177 &&
    !['Admin', 'Data Entry', 'Department'].includes(dept.name)
  );

  return mainDepartments.map(dept => {
    const total = faker.number.int({ min: 0, max: 60 });
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
      total,
      completed,
      on_target,
      on_going,
      off_target,
      overdue,
      overdue_other,
      off_target_other
    };
  });
}
