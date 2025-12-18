/**
 * Mock Data for Officer Departments Module
 */

import { faker } from '@faker-js/faker';

export interface OfficerDepartment {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

// Generate mock officer departments
export const mockOfficerDepartments: OfficerDepartment[] = Array.from({ length: 30 }, (_, index) => ({
  id: index + 1,
  name: faker.company.name() + ' Department',
  created_at: faker.date.past().toISOString(),
  updated_at: faker.date.recent().toISOString()
}));
