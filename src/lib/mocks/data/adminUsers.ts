/**
 * Mock Admin Users Data
 * Used in Users List page
 */

import { faker } from '@faker-js/faker';

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role_id: number;
  role_name: string;
  department_id: number;
  department_name: string;
  group_id?: number;
  group_name?: string;
  group_description?: string;
  is_active: boolean;
  permissions: string[];
}

export interface UserRole {
  id: number;
  role_name: string;
}

// User roles
export const mockUserRoles: UserRole[] = [
  { id: 1, role_name: 'Admin' },
  { id: 2, role_name: 'Chief Minister' },
  { id: 3, role_name: 'Chief Secretary' },
  { id: 4, role_name: 'Department' },
  { id: 5, role_name: 'Data Entry' },
  { id: 6, role_name: 'District Administration' },
];

// Department names for users
const departmentNames = [
  'Agriculture Department',
  'Education Department',
  'Health Department',
  'Finance Department',
  'Home Department',
  'Planning & Development',
  'Revenue Department',
  'Transport Department',
  'IT & Telecom',
  'Local Government',
  'Forestry Department',
  'Labour Department',
  'Industries Department',
  'Energy & Power',
  'Communication & Works',
];

// User group names
const userGroupNames = [
  { name: 'Core Team', description: 'Core management' },
  { name: 'Technical', description: 'Technical staff' },
  { name: 'Administrative', description: 'Admin staff' },
  { name: 'Field Officers', description: 'Field workers' },
];

// Permission names
const permissionsList = [
  'department.recordnotes.list',
  'department.sectorial-meetings.list',
  'department.directives.list',
  'admin.users.create',
  'admin.users.edit',
  'admin.users.delete',
  'admin.departments.create',
  'admin.departments.edit',
];

// Generate mock users
const generateMockUsers = (count: number): AdminUser[] => {
  const users: AdminUser[] = [];
  
  // Add super admin
  users.push({
    id: 1,
    name: 'Super Admin',
    email: 'admin@cmdms.gov.pk',
    role_id: 1,
    role_name: 'Admin',
    department_id: 1,
    department_name: 'Chief Minister Office',
    group_id: 1,
    group_name: 'Core Team',
    group_description: 'Core management',
    is_active: true,
    permissions: [
      'department.recordnotes.list',
      'department.sectorial-meetings.list',
      'department.directives.list',
      'admin.users.create',
      'admin.users.edit',
      'admin.users.delete',
    ],
  });
  
  // Generate regular users
  for (let i = 2; i <= count; i++) {
    const roleIndex = faker.number.int({ min: 1, max: 5 });
    const deptIndex = faker.number.int({ min: 0, max: departmentNames.length - 1 });
    const hasGroup = faker.datatype.boolean();
    const groupIndex = hasGroup ? faker.number.int({ min: 0, max: userGroupNames.length - 1 }) : -1;
    
    // Random permissions
    const numPermissions = faker.number.int({ min: 0, max: 3 });
    const userPermissions = faker.helpers.arrayElements(permissionsList, numPermissions);
    
    users.push({
      id: i,
      name: faker.person.fullName(),
      email: faker.internet.email().toLowerCase(),
      role_id: roleIndex,
      role_name: mockUserRoles[roleIndex - 1].role_name,
      department_id: deptIndex + 1,
      department_name: departmentNames[deptIndex],
      group_id: hasGroup ? groupIndex + 1 : undefined,
      group_name: hasGroup ? userGroupNames[groupIndex].name : undefined,
      group_description: hasGroup ? userGroupNames[groupIndex].description : undefined,
      is_active: faker.datatype.boolean({ probability: 0.9 }),
      permissions: userPermissions,
    });
  }
  
  return users;
};

export const mockAdminUsers = generateMockUsers(50);
