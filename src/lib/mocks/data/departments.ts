// Mock Departments Data (Extracted from Legacy CMDMS Seeder)

import { Department, DepartmentType } from '../../../types';

export const mockDepartments: Department[] = [
  // Main Departments (Type 1)
  { id: 1, name: 'Administration', department_type_id: DepartmentType.MAIN, created_at: '2023-01-01T00:00:00.000Z', updated_at: '2023-01-01T00:00:00.000Z' },
  { id: 2, name: 'Agriculture', department_type_id: DepartmentType.MAIN, created_at: '2023-01-01T00:00:00.000Z', updated_at: '2023-01-01T00:00:00.000Z' },
  { id: 3, name: 'C & W', department_type_id: DepartmentType.MAIN, created_at: '2023-01-01T00:00:00.000Z', updated_at: '2023-01-01T00:00:00.000Z' },
  { id: 4, name: 'Auqaf', department_type_id: DepartmentType.MAIN, created_at: '2023-01-01T00:00:00.000Z', updated_at: '2023-01-01T00:00:00.000Z' },
  { id: 5, name: 'Energy & Power', department_type_id: DepartmentType.MAIN, created_at: '2023-01-01T00:00:00.000Z', updated_at: '2023-01-01T00:00:00.000Z' },
  { id: 6, name: 'Law', department_type_id: DepartmentType.MAIN, created_at: '2023-01-01T00:00:00.000Z', updated_at: '2023-01-01T00:00:00.000Z' },
  { id: 7, name: 'E & SE', department_type_id: DepartmentType.MAIN, created_at: '2023-01-01T00:00:00.000Z', updated_at: '2023-01-01T00:00:00.000Z' },
  { id: 8, name: 'Information & Public Relations', department_type_id: DepartmentType.MAIN, created_at: '2023-01-01T00:00:00.000Z', updated_at: '2023-01-01T00:00:00.000Z' },
  { id: 9, name: 'ST & IT', department_type_id: DepartmentType.MAIN, created_at: '2023-01-01T00:00:00.000Z', updated_at: '2023-01-01T00:00:00.000Z' },
  { id: 10, name: 'Forest, Environment and Wildlife', department_type_id: DepartmentType.MAIN, created_at: '2023-01-01T00:00:00.000Z', updated_at: '2023-01-01T00:00:00.000Z' },
  { id: 11, name: 'Relief Rehabilitation & Settlement', department_type_id: DepartmentType.MAIN, created_at: '2023-01-01T00:00:00.000Z', updated_at: '2023-01-01T00:00:00.000Z' },
  { id: 12, name: 'Establishment', department_type_id: DepartmentType.MAIN, created_at: '2023-01-01T00:00:00.000Z', updated_at: '2023-01-01T00:00:00.000Z' },
  { id: 13, name: 'Excise & Taxation', department_type_id: DepartmentType.MAIN, created_at: '2023-01-01T00:00:00.000Z', updated_at: '2023-01-01T00:00:00.000Z' },
  { id: 14, name: 'Finance', department_type_id: DepartmentType.MAIN, created_at: '2023-01-01T00:00:00.000Z', updated_at: '2023-01-01T00:00:00.000Z' },
  { id: 15, name: 'Food', department_type_id: DepartmentType.MAIN, created_at: '2023-01-01T00:00:00.000Z', updated_at: '2023-01-01T00:00:00.000Z' },
  { id: 16, name: 'Health', department_type_id: DepartmentType.MAIN, created_at: '2023-01-01T00:00:00.000Z', updated_at: '2023-01-01T00:00:00.000Z' },
  { id: 17, name: 'Industries', department_type_id: DepartmentType.MAIN, created_at: '2023-01-01T00:00:00.000Z', updated_at: '2023-01-01T00:00:00.000Z' },
  { id: 18, name: 'Irrigation', department_type_id: DepartmentType.MAIN, created_at: '2023-01-01T00:00:00.000Z', updated_at: '2023-01-01T00:00:00.000Z' },
  { id: 19, name: 'Labour', department_type_id: DepartmentType.MAIN, created_at: '2023-01-01T00:00:00.000Z', updated_at: '2023-01-01T00:00:00.000Z' },
  { id: 20, name: 'Higher Education', department_type_id: DepartmentType.MAIN, created_at: '2023-01-01T00:00:00.000Z', updated_at: '2023-01-01T00:00:00.000Z' },
  { id: 21, name: 'Home & Tribal Affairs', department_type_id: DepartmentType.MAIN, created_at: '2023-01-01T00:00:00.000Z', updated_at: '2023-01-01T00:00:00.000Z' },
  { id: 22, name: 'Housing', department_type_id: DepartmentType.MAIN, created_at: '2023-01-01T00:00:00.000Z', updated_at: '2023-01-01T00:00:00.000Z' },
  { id: 23, name: 'IPC', department_type_id: DepartmentType.MAIN, created_at: '2023-01-01T00:00:00.000Z', updated_at: '2023-01-01T00:00:00.000Z' },
  { id: 24, name: 'Zakat & Ushr', department_type_id: DepartmentType.MAIN, created_at: '2023-01-01T00:00:00.000Z', updated_at: '2023-01-01T00:00:00.000Z' },
  { id: 25, name: 'LG & RDD', department_type_id: DepartmentType.MAIN, created_at: '2023-01-01T00:00:00.000Z', updated_at: '2023-01-01T00:00:00.000Z' },
  { id: 26, name: 'Minerals Development', department_type_id: DepartmentType.MAIN, created_at: '2023-01-01T00:00:00.000Z', updated_at: '2023-01-01T00:00:00.000Z' },
  { id: 27, name: 'Planning & Development', department_type_id: DepartmentType.MAIN, created_at: '2023-01-01T00:00:00.000Z', updated_at: '2023-01-01T00:00:00.000Z' },
  { id: 28, name: 'Population Welfare', department_type_id: DepartmentType.MAIN, created_at: '2023-01-01T00:00:00.000Z', updated_at: '2023-01-01T00:00:00.000Z' },
  { id: 29, name: 'PHE', department_type_id: DepartmentType.MAIN, created_at: '2023-01-01T00:00:00.000Z', updated_at: '2023-01-01T00:00:00.000Z' },
  { id: 30, name: 'Revenue', department_type_id: DepartmentType.MAIN, created_at: '2023-01-01T00:00:00.000Z', updated_at: '2023-01-01T00:00:00.000Z' },
  { id: 31, name: 'Social Welfare', department_type_id: DepartmentType.MAIN, created_at: '2023-01-01T00:00:00.000Z', updated_at: '2023-01-01T00:00:00.000Z' },
  { id: 32, name: 'Transport', department_type_id: DepartmentType.MAIN, created_at: '2023-01-01T00:00:00.000Z', updated_at: '2023-01-01T00:00:00.000Z' },
  { id: 33, name: 'Culture, Sports, Tourism, Archaeology & Youth Affairs', department_type_id: DepartmentType.MAIN, created_at: '2023-01-01T00:00:00.000Z', updated_at: '2023-01-01T00:00:00.000Z' },
  { id: 34, name: 'Other', department_type_id: DepartmentType.MAIN, created_at: '2023-01-01T00:00:00.000Z', updated_at: '2023-01-01T00:00:00.000Z' },
  
  // Divisional Commissioners (Type 3)
  { id: 35, name: 'Commissioner Bannu Division', department_type_id: DepartmentType.DIVISION, created_at: '2023-01-01T00:00:00.000Z', updated_at: '2023-01-01T00:00:00.000Z' },
  { id: 36, name: 'Commissioner DI.Khan Division', department_type_id: DepartmentType.DIVISION, created_at: '2023-01-01T00:00:00.000Z', updated_at: '2023-01-01T00:00:00.000Z' },
  { id: 37, name: 'Commissioner Kohat Division', department_type_id: DepartmentType.DIVISION, created_at: '2023-01-01T00:00:00.000Z', updated_at: '2023-01-01T00:00:00.000Z' },
  { id: 38, name: 'Commissioner Hazara Division', department_type_id: DepartmentType.DIVISION, created_at: '2023-01-01T00:00:00.000Z', updated_at: '2023-01-01T00:00:00.000Z' },
  { id: 39, name: 'Commissioner Malakand Division', department_type_id: DepartmentType.DIVISION, created_at: '2023-01-01T00:00:00.000Z', updated_at: '2023-01-01T00:00:00.000Z' },
  { id: 40, name: 'Commissioner Mardan Division', department_type_id: DepartmentType.DIVISION, created_at: '2023-01-01T00:00:00.000Z', updated_at: '2023-01-01T00:00:00.000Z' },
  { id: 41, name: 'Commissioner Peshawar Division', department_type_id: DepartmentType.DIVISION, created_at: '2023-01-01T00:00:00.000Z', updated_at: '2023-01-01T00:00:00.000Z' },
  
  // Police & Other Departments (Type 4)
  { id: 42, name: 'Police Department', department_type_id: DepartmentType.OTHER, created_at: '2023-01-01T00:00:00.000Z', updated_at: '2023-01-01T00:00:00.000Z' },
  { id: 43, name: 'DG PDA', department_type_id: DepartmentType.OTHER, created_at: '2023-01-01T00:00:00.000Z', updated_at: '2023-01-01T00:00:00.000Z' },
  { id: 44, name: 'Admin', department_type_id: DepartmentType.OTHER, created_at: '2023-01-01T00:00:00.000Z', updated_at: '2023-01-01T00:00:00.000Z' },
  { id: 45, name: 'Data Entry', department_type_id: DepartmentType.OTHER, created_at: '2023-01-01T00:00:00.000Z', updated_at: '2023-01-01T00:00:00.000Z' },
  { id: 46, name: 'Department', department_type_id: DepartmentType.OTHER, created_at: '2023-01-01T00:00:00.000Z', updated_at: '2023-01-01T00:00:00.000Z' },
  { id: 47, name: 'NHA', department_type_id: DepartmentType.OTHER, created_at: '2023-01-01T00:00:00.000Z', updated_at: '2023-01-01T00:00:00.000Z' },
  { id: 48, name: 'PESCO', department_type_id: DepartmentType.OTHER, created_at: '2023-01-01T00:00:00.000Z', updated_at: '2023-01-01T00:00:00.000Z' },
  { id: 49, name: 'WAPDA', department_type_id: DepartmentType.OTHER, created_at: '2023-01-01T00:00:00.000Z', updated_at: '2023-01-01T00:00:00.000Z' },
];

/**
 * Get department by ID
 */
export function getDepartmentById(id: number): Department | undefined {
  return mockDepartments.find(d => d.id === id);
}

/**
 * Get departments by type
 */
export function getDepartmentsByType(type: DepartmentType): Department[] {
  return mockDepartments.filter(d => d.department_type_id === type);
}

/**
 * Get main departments only
 */
export function getMainDepartments(): Department[] {
  return getDepartmentsByType(DepartmentType.MAIN);
}

/**
 * Search departments by name
 */
export function searchDepartments(query: string): Department[] {
  const lowerQuery = query.toLowerCase();
  return mockDepartments.filter(d => 
    d.name.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Get random department
 */
export function getRandomDepartment(): Department {
  return mockDepartments[Math.floor(Math.random() * mockDepartments.length)];
}

/**
 * Get multiple random departments
 */
export function getRandomDepartments(count: number): Department[] {
  const shuffled = [...mockDepartments].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, mockDepartments.length));
}

