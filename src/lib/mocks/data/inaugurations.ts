/**
 * Mock Data for Inaugurations Module
 */

import { faker } from '@faker-js/faker';

export interface Inauguration {
  id: number;
  department_id: number;
  department_name: string;
  project_name: string;
  scheme?: string;
  cost: number; // in millions
  description: string;
  district_id: number;
  district_name: string;
  division_id: number;
  division_name: string;
  date: string;
  remarks?: string;
  attachments?: string[];
  created_at: string;
  updated_at: string;
}

// Mock districts
const mockDistricts = [
  { id: 1, name: 'Peshawar' },
  { id: 2, name: 'Mardan' },
  { id: 3, name: 'Swat' },
  { id: 4, name: 'Abbottabad' },
  { id: 5, name: 'Mansehra' },
  { id: 6, name: 'Kohat' },
  { id: 7, name: 'Bannu' },
  { id: 8, name: 'D.I.Khan' }
];

// Mock divisions
const mockDivisions = [
  { id: 1, name: 'Peshawar Division' },
  { id: 2, name: 'Mardan Division' },
  { id: 3, name: 'Malakand Division' },
  { id: 4, name: 'Hazara Division' },
  { id: 5, name: 'Kohat Division' },
  { id: 6, name: 'Bannu Division' },
  { id: 7, name: 'D.I.Khan Division' }
];

// Generate mock inaugurations
export const mockInaugurations: Inauguration[] = Array.from({ length: 50 }, (_, index) => {
  const district = faker.helpers.arrayElement(mockDistricts);
  const division = faker.helpers.arrayElement(mockDivisions);

  return {
    id: index + 1,
    department_id: faker.number.int({ min: 1, max: 30 }),
    department_name: faker.company.name() + ' Department',
    project_name: faker.commerce.productName() + ' Project',
    scheme: faker.helpers.maybe(() => `Scheme ${faker.string.alphanumeric(6).toUpperCase()}`, { probability: 0.7 }),
    cost: faker.number.float({ min: 10, max: 5000, fractionDigits: 2 }),
    description: faker.lorem.sentences(2),
    district_id: district.id,
    district_name: district.name,
    division_id: division.id,
    division_name: division.name,
    date: faker.date.between({ from: '2024-01-01', to: '2025-12-31' }).toISOString().split('T')[0],
    remarks: faker.helpers.maybe(() => faker.lorem.paragraph(), { probability: 0.5 }),
    attachments: faker.helpers.maybe(() => Array.from({ length: faker.number.int({ min: 1, max: 2 }) }, () => faker.system.fileName()), { probability: 0.3 }),
    created_at: faker.date.past().toISOString(),
    updated_at: faker.date.recent().toISOString()
  };
});

export { mockDistricts as inaugurationMockDistricts, mockDivisions };
