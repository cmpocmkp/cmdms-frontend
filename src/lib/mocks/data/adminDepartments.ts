/**
 * Mock Departments Data
 * Used in Departments page
 */

import { faker } from '@faker-js/faker';

export interface Department {
  id: number;
  name: string;
  district_id?: number;
  district_name?: string;
  type: 'department' | 'board' | 'district_administration';
  type_label: string;
  parent_id?: number;
  parent_name?: string;
}

// District names in KP
const districtNames = [
  'Peshawar',
  'Mardan',
  'Abbottabad',
  'Swat',
  'Kohat',
  'Bannu',
  'Dera Ismail Khan',
  'Mansehra',
  'Charsadda',
  'Swabi',
  'Nowshera',
  'Haripur',
  'Karak',
  'Hangu',
  'Lakki Marwat',
  'Tank',
  'Malakand',
  'Buner',
  'Chitral',
  'Upper Dir',
  'Lower Dir',
  'Shangla',
  'Batagram',
  'Kohistan',
  'Tor Ghar',
];

// Department names
const departmentNamesList = [
  'Agriculture Department',
  'Livestock & Dairy Development',
  'Fisheries Department',
  'Forestry Department',
  'Environment Department',
  'Education Department',
  'Elementary & Secondary Education',
  'Higher Education Department',
  'Technical Education',
  'Health Department',
  'Public Health Engineering',
  'Finance Department',
  'Excise & Taxation',
  'Home Department',
  'Police Department',
  'Prisons Department',
  'Planning & Development',
  'Revenue Department',
  'Board of Revenue',
  'Local Government',
  'Transport Department',
  'Communication & Works',
  'IT & Telecom Department',
  'Industries Department',
  'Labour Department',
  'Social Welfare Department',
  'Women Development',
  'Sports & Youth Affairs',
  'Tourism Department',
  'Energy & Power Department',
  'Mines & Minerals',
];

// Board names
const boardNames = [
  'Board of Revenue',
  'WAPDA',
  'PESCO',
  'Water & Sanitation Board',
  'Education Board Peshawar',
  'Education Board Mardan',
  'Education Board Abbottabad',
  'Technical Education Board',
  'Higher Education Commission',
];

// Generate mock departments
const generateMockDepartments = (): Department[] => {
  const departments: Department[] = [];
  let id = 1;
  
  // Add parent departments
  const parentDepartments: Department[] = [];
  
  // Add main departments
  departmentNamesList.forEach((name) => {
    const dept: Department = {
      id: id++,
      name,
      district_id: undefined,
      district_name: undefined,
      type: 'department',
      type_label: 'Department',
      parent_id: undefined,
      parent_name: undefined,
    };
    
    parentDepartments.push(dept);
    departments.push(dept);
  });
  
  // Add boards
  boardNames.forEach(name => {
    const dept: Department = {
      id: id++,
      name,
      district_id: undefined,
      district_name: undefined,
      type: 'board',
      type_label: 'Board',
      parent_id: undefined,
      parent_name: undefined,
    };
    
    departments.push(dept);
  });
  
  // Add district administrations
  districtNames.forEach((districtName, index) => {
    const dept: Department = {
      id: id++,
      name: `DC Office ${districtName}`,
      district_id: index + 1,
      district_name: districtName,
      type: 'district_administration',
      type_label: 'District Administration',
      parent_id: undefined,
      parent_name: undefined,
    };
    
    departments.push(dept);
  });
  
  // Add some child departments (sub-departments)
  const numChildren = 10;
  for (let i = 0; i < numChildren; i++) {
    const parent = faker.helpers.arrayElement(parentDepartments);
    const dept: Department = {
      id: id++,
      name: `${faker.commerce.department()} Division`,
      district_id: undefined,
      district_name: undefined,
      type: 'department',
      type_label: 'Department',
      parent_id: parent.id,
      parent_name: parent.name,
    };
    
    departments.push(dept);
  }
  
  return departments;
};

export const mockAdminDepartments = generateMockDepartments();
