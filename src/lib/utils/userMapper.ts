/**
 * User Data Mapper
 * Maps backend API response (camelCase) to frontend User type (snake_case)
 */

import { User, UserRole, Role, Department } from '../../types';
import type { LoginResponseData } from '../../types/api';

/**
 * Map roleId to UserRole enum
 * Based on role IDs from API_INTEGRATION_GUIDE.md and business rules:
 * 1 = Admin, 2 = Department, 3 = Data Entry, 4 = CM, 5 = CS, 6 = Board
 */
const mapRoleIdToEnum = (roleId: number): UserRole => {
  const roleIdMap: Record<number, UserRole> = {
    1: UserRole.ADMIN,
    2: UserRole.DEPARTMENT,
    3: UserRole.DATA_ENTRY,
    4: UserRole.CM,
    5: UserRole.CS,
    6: UserRole.BOARD,
  };
  
  return roleIdMap[roleId] || UserRole.DEPARTMENT; // Default fallback
};

/**
 * Map backend role name to UserRole enum (fallback if role object is provided)
 */
const mapRoleNameToEnum = (roleName: string): UserRole => {
  const roleMap: Record<string, UserRole> = {
    'Admin': UserRole.ADMIN,
    'admin': UserRole.ADMIN,
    'Department User': UserRole.DEPARTMENT,
    'department': UserRole.DEPARTMENT,
    'Department': UserRole.DEPARTMENT,
    'Data Entry': UserRole.DATA_ENTRY,
    'data-entry': UserRole.DATA_ENTRY,
    'DataEntry': UserRole.DATA_ENTRY,
    'CM': UserRole.CM,
    'cm': UserRole.CM,
    'CS': UserRole.CS,
    'cs': UserRole.CS,
    'Chief Secretary': UserRole.CS,
    'Board': UserRole.BOARD,
    'board': UserRole.BOARD,
  };
  
  return roleMap[roleName] || UserRole.DEPARTMENT; // Default fallback
};

/**
 * Map backend login response to frontend User type
 * Note: API response may only include roleId, not full role object
 * We prioritize roleId mapping as it's always present and reliable
 */
export const mapLoginResponseToUser = (data: LoginResponseData['user']): User => {
  // Always use roleId as primary source (it's always present in API response)
  // Only use role.name if role object exists AND has a valid name
  const roleNameEnum = (data.role?.name) 
    ? mapRoleNameToEnum(data.role.name) 
    : mapRoleIdToEnum(data.roleId);
  
  const role: Role = {
    id: data.roleId,
    role_name: roleNameEnum,
    description: data.role?.name || `Role ${data.roleId}`,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const department: Department | undefined = data.departmentId && data.department
    ? {
        id: data.departmentId,
        name: data.department.name,
        department_type_id: 1, // Default to MAIN
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    : undefined;

  return {
    id: data.id,
    name: data.name,
    email: data.email,
    phone: data.phone,
    role_id: data.roleId,
    role,
    department_id: data.departmentId,
    department,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
};

