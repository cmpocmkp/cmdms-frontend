/**
 * Mock Data for Officers Module
 */

import { faker } from '@faker-js/faker';
import { mockOfficerDepartments } from './officerDepartments';

export interface Officer {
  id: number;
  name: string;
  designation: string;
  officer_department_id: number;
  scale: string;
  joining_date?: string;
  created_at: string;
  updated_at: string;
}

// Generate BPS scales - matching old CMDMS officerScales() function
// Old CMDMS returns [7,9,11,12,14,15,16,17,18,19,20,21,22]
const bpsScaleNumbers = [7, 9, 11, 12, 14, 15, 16, 17, 18, 19, 20, 21, 22];

// Generate mock officers
export const mockOfficers: Officer[] = Array.from({ length: 100 }, (_, index) => {
  const department = faker.helpers.arrayElement(mockOfficerDepartments);
  
  return {
    id: index + 1,
    name: faker.person.fullName(),
    designation: faker.person.jobTitle(),
    officer_department_id: department.id,
    scale: `BPS-${faker.helpers.arrayElement(bpsScaleNumbers)}`,
    joining_date: faker.date.past().toISOString().split('T')[0],
    created_at: faker.date.past().toISOString(),
    updated_at: faker.date.recent().toISOString()
  };
});
