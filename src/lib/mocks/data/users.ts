// Mock Users Data (Based on Extracted Roles from Legacy CMDMS)

import { User, UserRole, Role } from '../../../types';
import { getDepartmentById } from './departments';
import { generatePhone } from '../generators/textGenerator';

// Roles from legacy system
export const mockRoles: Role[] = [
  {
    id: 1,
    role_name: UserRole.ADMIN,
    description: 'Full system access',
    is_active: true,
    created_at: '2023-01-01T00:00:00.000Z',
    updated_at: '2023-01-01T00:00:00.000Z',
  },
  {
    id: 2,
    role_name: UserRole.DEPARTMENT,
    description: 'Department user access',
    is_active: true,
    created_at: '2023-01-01T00:00:00.000Z',
    updated_at: '2023-01-01T00:00:00.000Z',
  },
  {
    id: 3,
    role_name: UserRole.DATA_ENTRY,
    description: 'Data entry operations',
    is_active: true,
    created_at: '2023-01-01T00:00:00.000Z',
    updated_at: '2023-01-01T00:00:00.000Z',
  },
  {
    id: 4,
    role_name: UserRole.CM,
    description: 'CM Secretariat',
    is_active: true,
    created_at: '2023-01-01T00:00:00.000Z',
    updated_at: '2023-01-01T00:00:00.000Z',
  },
  {
    id: 5,
    role_name: UserRole.CS,
    description: 'Chief Secretary',
    is_active: true,
    created_at: '2023-01-01T00:00:00.000Z',
    updated_at: '2023-01-01T00:00:00.000Z',
  },
  {
    id: 6,
    role_name: UserRole.BOARD,
    description: 'Board member',
    is_active: true,
    created_at: '2023-01-01T00:00:00.000Z',
    updated_at: '2023-01-01T00:00:00.000Z',
  },
];

// Mock users with various roles
export const mockUsers: User[] = [
  // ============= ADMIN USERS =============
  {
    id: 1,
    name: 'Admin User',
    email: 'admin@cmdms.gov.pk',
    phone: generatePhone(),
    role_id: 1,
    role: mockRoles[0],
    department_id: 44, // Admin department
    department: getDepartmentById(44),
    is_active: true,
    created_at: '2023-01-01T00:00:00.000Z',
    updated_at: '2023-01-01T00:00:00.000Z',
  },
  {
    id: 2,
    name: 'Muhammad Ali Khan',
    email: 'ali.khan@cmdms.gov.pk',
    phone: generatePhone(),
    role_id: 1,
    role: mockRoles[0],
    department_id: 44,
    department: getDepartmentById(44),
    is_active: true,
    created_at: '2023-01-01T00:00:00.000Z',
    updated_at: '2023-01-01T00:00:00.000Z',
  },
  {
    id: 3,
    name: 'Ayesha Begum',
    email: 'ayesha.begum@cmdms.gov.pk',
    phone: generatePhone(),
    role_id: 1,
    role: mockRoles[0],
    department_id: 44,
    department: getDepartmentById(44),
    is_active: true,
    created_at: '2023-01-01T00:00:00.000Z',
    updated_at: '2023-01-01T00:00:00.000Z',
  },
  
  // ============= CM & CS USERS =============
  {
    id: 4,
    name: 'Ali Amin Khan Gandapur',
    email: 'cm@gov.kp.pk',
    phone: generatePhone(),
    role_id: 4,
    role: mockRoles[3],
    department_id: 44,
    department: getDepartmentById(44),
    is_active: true,
    created_at: '2023-01-01T00:00:00.000Z',
    updated_at: '2023-01-01T00:00:00.000Z',
  },
  {
    id: 100,
    name: 'CM User',
    email: 'cm@cmdms.test',
    phone: generatePhone(),
    role_id: 4,
    role: mockRoles[3],
    department_id: 44,
    department: getDepartmentById(44),
    is_active: true,
    created_at: '2023-01-01T00:00:00.000Z',
    updated_at: '2023-01-01T00:00:00.000Z',
  },
  {
    id: 5,
    name: 'Nadeem Aslam Chaudhry',
    email: 'cs@gov.kp.pk',
    phone: generatePhone(),
    role_id: 5,
    role: mockRoles[4],
    department_id: 44,
    department: getDepartmentById(44),
    is_active: true,
    created_at: '2023-01-01T00:00:00.000Z',
    updated_at: '2023-01-01T00:00:00.000Z',
  },
  {
    id: 101,
    name: 'CS User',
    email: 'cs@cmdms.test',
    phone: generatePhone(),
    role_id: 5,
    role: mockRoles[4],
    department_id: 44,
    department: getDepartmentById(44),
    is_active: true,
    created_at: '2023-01-01T00:00:00.000Z',
    updated_at: '2023-01-01T00:00:00.000Z',
  },
  
  // ============= DEPARTMENT USERS (One per department) =============
  // Finance Department
  {
    id: 10,
    name: 'Saqib Zaman',
    email: 'saqib.zaman@finance.gov.pk',
    phone: generatePhone(),
    role_id: 2,
    role: mockRoles[1],
    department_id: 14,
    department: getDepartmentById(14),
    is_active: true,
    created_at: '2023-01-01T00:00:00.000Z',
    updated_at: '2023-01-01T00:00:00.000Z',
  },
  {
    id: 11,
    name: 'Uzma Khalid',
    email: 'uzma.khalid@finance.gov.pk',
    phone: generatePhone(),
    role_id: 2,
    role: mockRoles[1],
    department_id: 14,
    department: getDepartmentById(14),
    is_active: true,
    created_at: '2023-01-01T00:00:00.000Z',
    updated_at: '2023-01-01T00:00:00.000Z',
  },
  
  // Health Department
  {
    id: 12,
    name: 'Dr. Ahmed Hassan',
    email: 'ahmed.hassan@health.gov.pk',
    phone: generatePhone(),
    role_id: 2,
    role: mockRoles[1],
    department_id: 16,
    department: getDepartmentById(16),
    is_active: true,
    created_at: '2023-01-01T00:00:00.000Z',
    updated_at: '2023-01-01T00:00:00.000Z',
  },
  {
    id: 13,
    name: 'Dr. Fatima Noor',
    email: 'fatima.noor@health.gov.pk',
    phone: generatePhone(),
    role_id: 2,
    role: mockRoles[1],
    department_id: 16,
    department: getDepartmentById(16),
    is_active: true,
    created_at: '2023-01-01T00:00:00.000Z',
    updated_at: '2023-01-01T00:00:00.000Z',
  },
  
  // Education Department
  {
    id: 14,
    name: 'Rashid Mahmood',
    email: 'rashid.mahmood@education.gov.pk',
    phone: generatePhone(),
    role_id: 2,
    role: mockRoles[1],
    department_id: 7,
    department: getDepartmentById(7),
    is_active: true,
    created_at: '2023-01-01T00:00:00.000Z',
    updated_at: '2023-01-01T00:00:00.000Z',
  },
  {
    id: 15,
    name: 'Sadia Iqbal',
    email: 'sadia.iqbal@education.gov.pk',
    phone: generatePhone(),
    role_id: 2,
    role: mockRoles[1],
    department_id: 7,
    department: getDepartmentById(7),
    is_active: true,
    created_at: '2023-01-01T00:00:00.000Z',
    updated_at: '2023-01-01T00:00:00.000Z',
  },
  
  // Higher Education
  {
    id: 16,
    name: 'Prof. Imran Shah',
    email: 'imran.shah@higher-edu.gov.pk',
    phone: generatePhone(),
    role_id: 2,
    role: mockRoles[1],
    department_id: 20,
    department: getDepartmentById(20),
    is_active: true,
    created_at: '2023-01-01T00:00:00.000Z',
    updated_at: '2023-01-01T00:00:00.000Z',
  },
  
  // Agriculture Department
  {
    id: 17,
    name: 'Mushtaq Ahmad',
    email: 'mushtaq.ahmad@agriculture.gov.pk',
    phone: generatePhone(),
    role_id: 2,
    role: mockRoles[1],
    department_id: 2,
    department: getDepartmentById(2),
    is_active: true,
    created_at: '2023-01-01T00:00:00.000Z',
    updated_at: '2023-01-01T00:00:00.000Z',
  },
  {
    id: 18,
    name: 'Nadia Kamal',
    email: 'nadia.kamal@agriculture.gov.pk',
    phone: generatePhone(),
    role_id: 2,
    role: mockRoles[1],
    department_id: 2,
    department: getDepartmentById(2),
    is_active: true,
    created_at: '2023-01-01T00:00:00.000Z',
    updated_at: '2023-01-01T00:00:00.000Z',
  },
  
  // C & W Department
  {
    id: 19,
    name: 'Engr. Tariq Aziz',
    email: 'tariq.aziz@cw.gov.pk',
    phone: generatePhone(),
    role_id: 2,
    role: mockRoles[1],
    department_id: 3,
    department: getDepartmentById(3),
    is_active: true,
    created_at: '2023-01-01T00:00:00.000Z',
    updated_at: '2023-01-01T00:00:00.000Z',
  },
  
  // Police Department
  {
    id: 20,
    name: 'SSP Shahid Afridi',
    email: 'shahid.afridi@police.gov.pk',
    phone: generatePhone(),
    role_id: 2,
    role: mockRoles[1],
    department_id: 42,
    department: getDepartmentById(42),
    is_active: true,
    created_at: '2023-01-01T00:00:00.000Z',
    updated_at: '2023-01-01T00:00:00.000Z',
  },
  
  // Planning & Development
  {
    id: 21,
    name: 'Khalid Pervaiz',
    email: 'khalid.pervaiz@planning.gov.pk',
    phone: generatePhone(),
    role_id: 2,
    role: mockRoles[1],
    department_id: 27,
    department: getDepartmentById(27),
    is_active: true,
    created_at: '2023-01-01T00:00:00.000Z',
    updated_at: '2023-01-01T00:00:00.000Z',
  },
  
  // Revenue Department
  {
    id: 22,
    name: 'Asad Ullah',
    email: 'asad.ullah@revenue.gov.pk',
    phone: generatePhone(),
    role_id: 2,
    role: mockRoles[1],
    department_id: 30,
    department: getDepartmentById(30),
    is_active: true,
    created_at: '2023-01-01T00:00:00.000Z',
    updated_at: '2023-01-01T00:00:00.000Z',
  },
  
  // Home & Tribal Affairs
  {
    id: 23,
    name: 'Zahid Hussain',
    email: 'zahid.hussain@home.gov.pk',
    phone: generatePhone(),
    role_id: 2,
    role: mockRoles[1],
    department_id: 21,
    department: getDepartmentById(21),
    is_active: true,
    created_at: '2023-01-01T00:00:00.000Z',
    updated_at: '2023-01-01T00:00:00.000Z',
  },
  
  // Transport Department
  {
    id: 24,
    name: 'Faisal Karim',
    email: 'faisal.karim@transport.gov.pk',
    phone: generatePhone(),
    role_id: 2,
    role: mockRoles[1],
    department_id: 32,
    department: getDepartmentById(32),
    is_active: true,
    created_at: '2023-01-01T00:00:00.000Z',
    updated_at: '2023-01-01T00:00:00.000Z',
  },
  
  // Local Government & RDD
  {
    id: 25,
    name: 'Naeem Khan',
    email: 'naeem.khan@lgrdd.gov.pk',
    phone: generatePhone(),
    role_id: 2,
    role: mockRoles[1],
    department_id: 25,
    department: getDepartmentById(25),
    is_active: true,
    created_at: '2023-01-01T00:00:00.000Z',
    updated_at: '2023-01-01T00:00:00.000Z',
  },
  
  // Social Welfare
  {
    id: 26,
    name: 'Rukhsana Bibi',
    email: 'rukhsana.bibi@socialwelfare.gov.pk',
    phone: generatePhone(),
    role_id: 2,
    role: mockRoles[1],
    department_id: 31,
    department: getDepartmentById(31),
    is_active: true,
    created_at: '2023-01-01T00:00:00.000Z',
    updated_at: '2023-01-01T00:00:00.000Z',
  },
  
  // Energy & Power
  {
    id: 27,
    name: 'Engr. Bilal Ahmed',
    email: 'bilal.ahmed@energy.gov.pk',
    phone: generatePhone(),
    role_id: 2,
    role: mockRoles[1],
    department_id: 5,
    department: getDepartmentById(5),
    is_active: true,
    created_at: '2023-01-01T00:00:00.000Z',
    updated_at: '2023-01-01T00:00:00.000Z',
  },
  
  // Information & PR
  {
    id: 28,
    name: 'Junaid Malik',
    email: 'junaid.malik@info.gov.pk',
    phone: generatePhone(),
    role_id: 2,
    role: mockRoles[1],
    department_id: 8,
    department: getDepartmentById(8),
    is_active: true,
    created_at: '2023-01-01T00:00:00.000Z',
    updated_at: '2023-01-01T00:00:00.000Z',
  },
  
  // Forest & Wildlife
  {
    id: 29,
    name: 'Ghulam Abbas',
    email: 'ghulam.abbas@forest.gov.pk',
    phone: generatePhone(),
    role_id: 2,
    role: mockRoles[1],
    department_id: 10,
    department: getDepartmentById(10),
    is_active: true,
    created_at: '2023-01-01T00:00:00.000Z',
    updated_at: '2023-01-01T00:00:00.000Z',
  },
  
  // Irrigation
  {
    id: 30,
    name: 'Hamza Yousaf',
    email: 'hamza.yousaf@irrigation.gov.pk',
    phone: generatePhone(),
    role_id: 2,
    role: mockRoles[1],
    department_id: 18,
    department: getDepartmentById(18),
    is_active: true,
    created_at: '2023-01-01T00:00:00.000Z',
    updated_at: '2023-01-01T00:00:00.000Z',
  },
  
  // Housing Department
  {
    id: 31,
    name: 'Muhammad Asif',
    email: 'muhammad.asif@housing.gov.pk',
    phone: generatePhone(),
    role_id: 2,
    role: mockRoles[1],
    department_id: 22,
    department: getDepartmentById(22),
    is_active: true,
    created_at: '2023-01-01T00:00:00.000Z',
    updated_at: '2023-01-01T00:00:00.000Z',
  },
  
  // Finance Department - FULL ACCESS USER (For Testing All Modules)
  {
    id: 32,
    name: 'Test User - Full Access',
    email: 'test.fullaccess@finance.gov.pk',
    phone: generatePhone(),
    role_id: 2,
    role: mockRoles[1],
    department_id: 14,
    department: getDepartmentById(14),
    is_active: true,
    created_at: '2023-01-01T00:00:00.000Z',
    updated_at: '2023-01-01T00:00:00.000Z',
  },
  
  // ============= DATA ENTRY USERS =============
  {
    id: 50,
    name: 'Data Entry User 1',
    email: 'data.entry1@cmdms.gov.pk',
    phone: generatePhone(),
    role_id: 3,
    role: mockRoles[2],
    department_id: 45,
    department: getDepartmentById(45),
    is_active: true,
    created_at: '2023-01-01T00:00:00.000Z',
    updated_at: '2023-01-01T00:00:00.000Z',
  },
  {
    id: 51,
    name: 'Data Entry User 2',
    email: 'data.entry2@cmdms.gov.pk',
    phone: generatePhone(),
    role_id: 3,
    role: mockRoles[2],
    department_id: 45,
    department: getDepartmentById(45),
    is_active: true,
    created_at: '2023-01-01T00:00:00.000Z',
    updated_at: '2023-01-01T00:00:00.000Z',
  },
];

/**
 * Get user by ID
 */
export function getUserById(id: number): User | undefined {
  return mockUsers.find(u => u.id === id);
}

/**
 * Get users by role
 */
export function getUsersByRole(roleId: number): User[] {
  return mockUsers.filter(u => u.role_id === roleId);
}

/**
 * Get users by department
 */
export function getUsersByDepartment(departmentId: number): User[] {
  return mockUsers.filter(u => u.department_id === departmentId);
}

/**
 * Get admin users
 */
export function getAdminUsers(): User[] {
  return getUsersByRole(1);
}

/**
 * Get department users
 */
export function getDepartmentUsers(): User[] {
  return getUsersByRole(2);
}

/**
 * Authenticate user (mock login)
 * Test credentials:
 * - Admin: SuperAdmin@123
 * - Department: DeptUser@123
 * - Data Entry: DataEntry@123
 * - CM: CM@123
 * - CS: CS@123
 */
export function authenticateUser(email: string, password: string): User | null {
  const user = mockUsers.find(u => u.email === email && u.is_active);
  if (!user) {
    return null;
  }
  
  // Check password based on role
  let isValidPassword = false;
  
  if (user.role_id === 1) {
    // Admin
    isValidPassword = password === 'SuperAdmin@123' || password === 'password' || password === 'password123';
  } else if (user.role_id === 2) {
    // Department user
    isValidPassword = password === 'DeptUser@123' || password === 'password' || password === 'password123';
  } else if (user.role_id === 3) {
    // Data Entry
    isValidPassword = password === 'DataEntry@123' || password === 'password' || password === 'password123';
  } else if (user.role_id === 4) {
    // CM
    isValidPassword = password === 'CM@123' || password === 'password' || password === 'password123';
  } else if (user.role_id === 5) {
    // CS
    isValidPassword = password === 'CS@123' || password === 'password' || password === 'password123';
  } else {
    // Default fallback
    isValidPassword = password === 'password' || password === 'password123';
  }
  
  if (!isValidPassword) {
    return null;
  }
  
  return user;
}

/**
 * Get user permissions (mock)
 * In old CMDMS, permissions are assigned per user, not per role
 * Different department users have different permission sets
 */
export function getUserPermissions(userId: number): string[] {
  const user = getUserById(userId);
  if (!user) return [];
  
  // Admin has all permissions
  if (user.role_id === 1 || user.role_id === 4 || user.role_id === 5) {
    return ['*']; // All permissions
  }
  
  // Department users have LIMITED permissions (varies by user)
  // This matches old CMDMS where not all department users see all modules
  if (user.role_id === 2) {
    // Base permissions - all department users have dashboard
    const basePermissions = ['department.dashboard'];
    
    // Assign different permission sets to different users
    // This simulates real-world where users have different access levels
    
    // User ID 10 (Saqib Zaman - Finance) - Common modules only
    if (userId === 10) {
      return [
        ...basePermissions,
        'department.recordnotes.list',
        'department.cmremarks.index',
        'department.directives.list',
        'department.announcements.list',
      ];
    }
    
    // User ID 11 (Uzma Khalid - Finance) - More modules
    if (userId === 11) {
      return [
        ...basePermissions,
        'department.recordnotes.list',
        'department.cmremarks.index',
        'department.directives.list',
        'department.announcements.list',
        'department.sectorial-meetings.list',
        'department.board-meetings.list',
      ];
    }
    
    // User ID 12 (Dr. Ahmed Hassan - Health) - Limited access
    if (userId === 12) {
      return [
        ...basePermissions,
        'department.recordnotes.list',
        'department.cmremarks.index',
        'department.directives.list',
      ];
    }
    
    // User ID 13 (Dr. Fatima Noor - Health) - Moderate access
    if (userId === 13) {
      return [
        ...basePermissions,
        'department.recordnotes.list',
        'department.cmremarks.index',
        'department.directives.list',
        'department.announcements.list',
        'department.sectorial-meetings.list',
        'department.ptf.index',
      ];
    }
    
    // User ID 14 (Rashid Mahmood - Education) - Moderate access
    if (userId === 14) {
      return [
        ...basePermissions,
        'department.recordnotes.list',
        'department.cmremarks.index',
        'department.directives.list',
        'department.announcements.list',
        'department.board-meetings.list',
        'department.ptis.index',
      ];
    }
    
    // User ID 15 (Sadia Iqbal - Education) - More access
    if (userId === 15) {
      return [
        ...basePermissions,
        'department.recordnotes.list',
        'department.cmremarks.index',
        'department.directives.list',
        'department.announcements.list',
        'department.sectorial-meetings.list',
        'department.board-meetings.list',
        'department.ptis.index',
        'department.summaries.index',
      ];
    }
    
    // User ID 31 (Muhammad Asif - Housing) - Moderate access
    // Based on old CMDMS image, Housing has: Record Notes, Cabinet, CM Remarks, Directives, 
    // Sectoral Meetings, Announcements, PTF, Boards Meetings, PTIs KP
    if (userId === 31) {
      return [
        ...basePermissions,
        'department.recordnotes.list',
        'department.cmremarks.index',
        'department.directives.list',
        'department.announcements.list',
        'department.sectorial-meetings.list',
        'department.board-meetings.list',
        'department.ptf.index',
        'department.ptis.index',
      ];
    }
    
    // User ID 32 (Test User - Full Access) - ALL DEPARTMENT MODULES
    // This user has access to ALL department modules for testing purposes
    if (userId === 32) {
      return [
        ...basePermissions,
        // Record Notes & Cabinet Minutes
        'department.recordnotes.list',
        // CM Remarks
        'department.cmremarks.index',
        // Khushhal Programme
        'department.khushhal.task.list',
        'department.khushhal-programme.create',
        'department.khushhal-programme.show',
        // Directives
        'department.directives.list',
        // Sectoral Meetings
        'department.sectorial-meetings.list',
        // Announcements
        'department.announcements.list',
        // PTF
        'department.ptf.index',
        'department.ptf.create-issue',
        'department.ptf.departments.dashboard',
        // Board Meetings
        'department.board-meetings.list',
        // Senate Meetings
        'department.senate_meetings.index',
        // PTIs KP
        'department.ptis.index',
        // Summaries
        'department.summaries.index',
      ];
    }
    
    // Default for other department users - Basic access only
    return [
      ...basePermissions,
      'department.recordnotes.list',
      'department.cmremarks.index',
      'department.directives.list',
    ];
  }
  
  // Data entry users have limited admin permissions
  if (user.role_id === 3) {
    return [
      // Dashboard
      'admin.dashboard',
      // Minutes/Record Notes
      'admin.recordnotes.departments',
      // Directives
      'admin.directives.list',
      // Announcements
      'admin.announcements.list',
      // PTIs
      'admin.ptis.index',
      // Summaries
      'admin.summaries.index',
      // Trackers/Interventions
      'admin.interventions.index',
      // CM Remarks
      'admin.cmremarks.index',
      // Inaugurations
      'admin.inaugurations.index',
      // Sectoral Meetings
      'admin.sectorialmeetings.index',
      // Boards
      'admin.boardmeetings.index',
      'admin.boardacts.index',
      'admin.boardmembers.index',
      // Reports (limited)
      'admin.report.recordnotes',
      'admin.report.directives',
      'admin.report.boardmeetings',
      'admin.report.inaugurations',
    ];
  }
  
  return [];
}

