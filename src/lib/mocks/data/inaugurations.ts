/**
 * Mock Data for Inaugurations Module
 */

import { faker } from '@faker-js/faker';
import { mockDepartments } from './departments';

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
  division_id: string; // String key matching divisionsMap keys ('1', '2', '3', etc.)
  division_name: string;
  date: string;
  type?: string; // 'ing' for Inauguration, 'grb' for Ground Breaking
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

// Divisions mapping (key-value pairs matching old CMDMS model)
const divisionsMap: Record<string, string> = {
  '7': 'Peshawar',
  '4': 'Kohat',
  '3': 'Hazara',
  '5': 'Malakand',
  '1': 'Banu',
  '2': 'D.I Khan',
  '6': 'Mardan'
};

// Mock divisions (for backward compatibility)
const mockDivisions = [
  { id: '1', name: 'Banu' },
  { id: '2', name: 'D.I Khan' },
  { id: '3', name: 'Hazara' },
  { id: '4', name: 'Kohat' },
  { id: '5', name: 'Malakand' },
  { id: '6', name: 'Mardan' },
  { id: '7', name: 'Peshawar' }
];

// Realistic project names for inaugurations
const projectNames = [
  'New Hospital Building',
  'Road Infrastructure Project',
  'Water Supply Scheme',
  'School Building Construction',
  'Bridge Construction',
  'Irrigation Canal Project',
  'Power Plant Installation',
  'Housing Scheme',
  'Market Complex',
  'Sports Complex',
  'Community Center',
  'Public Park Development',
  'Sewerage System',
  'Street Lighting Project',
  'Government Office Building',
  'Library Building',
  'Health Center',
  'Drainage System',
  'Flood Protection Wall',
  'Solar Power Project'
];

// Realistic scheme names
const schemeNames = [
  'Prime Minister Development Package',
  'Chief Minister Development Initiative',
  'Provincial Development Scheme',
  'District Development Program',
  'Rural Development Scheme',
  'Urban Development Project',
  'Infrastructure Development Scheme',
  'Public Welfare Scheme',
  'Social Development Program',
  'Economic Development Initiative'
];

// Realistic descriptions - matching old CMDMS format (simple text like "Inauguration" or "Ground Breaking")
const descriptions = [
  'Inauguration',
  'Ground Breaking',
  'Inauguration',
  'Ground Breaking',
  'Inauguration',
  'Ground Breaking',
  'Inauguration',
  'Ground Breaking',
  'Inauguration',
  'Ground Breaking'
];

// Generate mock inaugurations with realistic data
export const mockInaugurations: Inauguration[] = Array.from({ length: 50 }, (_, index) => {
  const district = faker.helpers.arrayElement(mockDistricts);
  const divisionKey = faker.helpers.arrayElement(Object.keys(divisionsMap));
  const divisionName = divisionsMap[divisionKey];
  
  // Get a real department (excluding 44, 45, 46 as per old CMDMS controller)
  const availableDepartments = mockDepartments.filter(dept => ![44, 45, 46].includes(Number(dept.id)));
  const department = faker.helpers.arrayElement(availableDepartments);
  
  const projectName = faker.helpers.arrayElement(projectNames);
  const schemeName = faker.helpers.maybe(() => faker.helpers.arrayElement(schemeNames), { probability: 0.7 });
  const description = faker.helpers.arrayElement(descriptions);
  const type = faker.helpers.arrayElement(['ing', 'grb']);

  return {
    id: index + 1,
    department_id: Number(department.id),
    department_name: department.name,
    project_name: projectName,
    scheme: schemeName,
    cost: faker.number.float({ min: 50, max: 5000, fractionDigits: 2 }),
    description: description,
    district_id: district.id,
    district_name: district.name,
    division_id: divisionKey,
    division_name: divisionName,
    date: faker.date.between({ from: '2024-01-01', to: '2025-12-31' }).toISOString().split('T')[0],
    type: type,
    remarks: faker.helpers.maybe(() => `Project is progressing well. Expected completion by ${faker.date.future().toLocaleDateString()}.`, { probability: 0.6 }),
    attachments: faker.helpers.maybe(() => [`inauguration_${index + 1}_doc.pdf`, `project_${index + 1}_plan.pdf`], { probability: 0.4 }),
    created_at: faker.date.past().toISOString(),
    updated_at: faker.date.recent().toISOString()
  };
});

export { mockDistricts as inaugurationMockDistricts, mockDivisions };
