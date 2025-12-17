/**
 * Mock Data for Schemes Module
 */

import { faker } from '@faker-js/faker';

export interface Scheme {
  id: number;
  name: string;
  code: string;
  district_id: number;
  district_name: string;
  category: string;
  type: string;
  department_id: number;
  department_name: string;
  budget?: number;
  status?: string;
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
  { id: 8, name: 'D.I.Khan' },
  { id: 9, name: 'Malakand' },
  { id: 10, name: 'Haripur' }
];

// Scheme categories matching old CMDMS helpers.php
export const schemeCategories: Record<string, string> = {
  'mega': 'Mega Schemes',
  'mega-high': 'Mega & High Priority Schemes',
  'high-priority': 'High Priority Schemes',
  'dfc-two-years': 'DFC (Two Years) Schemes',
  'dfc-current-years': 'DFC (Current Year) Schemes',
  'after-assembly': 'After Assembly Schemes',
  'normal': 'Normal Schemes'
};

// Scheme types matching old CMDMS helpers.php
export const schemeTypes: Record<string, string> = {
  'adp': 'ADP',
  'aip': 'AIP',
  'ma-adp': 'MA-ADP',
  'psdp': 'PSDP',
  'own_source': 'Own Source',
  'cpec': 'CPEC',
  'other': 'Other'
};

// Generate mock schemes
export const mockSchemes: Scheme[] = Array.from({ length: 100 }, (_, index) => {
  const district = faker.helpers.arrayElement(mockDistricts);
  
  return {
    id: index + 1,
    name: faker.lorem.sentences(2),
    code: `SCH-${faker.string.alphanumeric(6).toUpperCase()}`,
    district_id: district.id,
    district_name: district.name,
    category: faker.helpers.arrayElement(Object.keys(schemeCategories)) as string,
    type: faker.helpers.arrayElement(Object.keys(schemeTypes)) as string,
    department_id: faker.number.int({ min: 1, max: 30 }),
    department_name: faker.company.name() + ' Department',
    budget: faker.number.int({ min: 1000000, max: 100000000 }),
    status: faker.helpers.arrayElement(['Active', 'Completed', 'Pending', 'Suspended']),
    created_at: faker.date.past().toISOString(),
    updated_at: faker.date.recent().toISOString()
  };
});

export { mockDistricts as schemeMockDistricts };
