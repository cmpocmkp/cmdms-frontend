/**
 * Mock Directive Service
 * Template for other module services
 * 
 * This demonstrates the pattern:
 * 1. Simulate network delay
 * 2. Return realistic mock data
 * 3. Support CRUD operations
 * 4. Include pagination
 * 5. Support filters
 */

import { 
  Directive, 
  PaginatedResponse, 
  ApiResponse, 
  BaseFilters,
  Status,
  Priority 
} from '../../../types';
import { mockDirectives, getDirectiveById, filterDirectives } from '../data/directives';
import { simulateNetworkDelay, shouldSimulateError } from '../../api';

interface DirectiveFilters extends BaseFilters {
  priority?: Priority;
}

/**
 * Get all directives with pagination and filters
 */
export async function getAllDirectives(
  filters?: DirectiveFilters
): Promise<PaginatedResponse<Directive>> {
  // Simulate network delay
  await simulateNetworkDelay(300);
  
  // Simulate occasional errors (5% chance)
  if (shouldSimulateError()) {
    throw new Error('Failed to fetch directives');
  }
  
  // Apply filters
  let result = mockDirectives;
  
  if (filters) {
    result = filterDirectives({
      search: filters.search,
      department_id: filters.department_id,
      status: filters.status,
      priority: filters.priority,
    });
  }
  
  // Apply sorting
  if (filters?.sort_by) {
    result = [...result].sort((a, b) => {
      const aVal = a[filters.sort_by as keyof Directive] as any;
      const bVal = b[filters.sort_by as keyof Directive] as any;
      
      if (filters.sort_order === 'desc') {
        return bVal > aVal ? 1 : -1;
      }
      return aVal > bVal ? 1 : -1;
    });
  }
  
  // Apply pagination
  const page = filters?.page || 1;
  const per_page = filters?.per_page || 10;
  const start = (page - 1) * per_page;
  const end = start + per_page;
  const paginatedData = result.slice(start, end);
  
  return {
    data: paginatedData,
    pagination: {
      current_page: page,
      per_page,
      total: result.length,
      last_page: Math.ceil(result.length / per_page),
      from: start + 1,
      to: Math.min(end, result.length),
    },
    success: true,
    message: 'Directives fetched successfully',
  };
}

/**
 * Get single directive by ID
 */
export async function getDirective(id: number): Promise<ApiResponse<Directive>> {
  await simulateNetworkDelay(200);
  
  const directive = getDirectiveById(id);
  
  if (!directive) {
    throw new Error('Directive not found');
  }
  
  return {
    data: directive,
    success: true,
    message: 'Directive fetched successfully',
  };
}

/**
 * Create new directive
 */
export async function createDirective(
  data: Partial<Directive>
): Promise<ApiResponse<Directive>> {
  await simulateNetworkDelay(500);
  
  // Simulate validation error occasionally
  if (shouldSimulateError(0.1)) {
    throw new Error('Validation failed: Title is required');
  }
  
  const newDirective: Directive = {
    id: mockDirectives.length + 1,
    title: data.title || 'New Directive',
    description: data.description || '',
    directive_date: data.directive_date || new Date().toISOString(),
    reference_number: data.reference_number || `DIR/${new Date().getFullYear()}/${String(mockDirectives.length + 1).padStart(4, '0')}`,
    departments: data.departments || [],
    status: data.status || Status.PENDING,
    priority: data.priority || Priority.MEDIUM,
    deadline: data.deadline,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    replies: [],
    sub_tasks: [],
    attachments: [],
  };
  
  // Add to mock data
  mockDirectives.push(newDirective);
  
  return {
    data: newDirective,
    success: true,
    message: 'Directive created successfully',
  };
}

/**
 * Update existing directive
 */
export async function updateDirective(
  id: number,
  data: Partial<Directive>
): Promise<ApiResponse<Directive>> {
  await simulateNetworkDelay(400);
  
  const index = mockDirectives.findIndex(d => d.id === id);
  
  if (index === -1) {
    throw new Error('Directive not found');
  }
  
  // Update directive
  mockDirectives[index] = {
    ...mockDirectives[index],
    ...data,
    updated_at: new Date().toISOString(),
  };
  
  return {
    data: mockDirectives[index],
    success: true,
    message: 'Directive updated successfully',
  };
}

/**
 * Delete directive
 */
export async function deleteDirective(id: number): Promise<ApiResponse<void>> {
  await simulateNetworkDelay(300);
  
  const index = mockDirectives.findIndex(d => d.id === id);
  
  if (index === -1) {
    throw new Error('Directive not found');
  }
  
  // Remove from mock data
  mockDirectives.splice(index, 1);
  
  return {
    data: undefined as any,
    success: true,
    message: 'Directive deleted successfully',
  };
}

/**
 * Get directives for specific department
 */
export async function getDepartmentDirectives(
  departmentId: number,
  filters?: DirectiveFilters
): Promise<PaginatedResponse<Directive>> {
  const departmentFilters = {
    ...filters,
    department_id: departmentId,
  };
  
  return getAllDirectives(departmentFilters);
}

/**
 * Get directive statistics
 */
export async function getDirectiveStats(): Promise<ApiResponse<{
  total: number;
  pending: number;
  in_progress: number;
  completed: number;
  overdue: number;
}>> {
  await simulateNetworkDelay(200);
  
  const stats = {
    total: mockDirectives.length,
    pending: mockDirectives.filter(d => d.status === Status.PENDING).length,
    in_progress: mockDirectives.filter(d => d.status === Status.IN_PROGRESS).length,
    completed: mockDirectives.filter(d => d.status === Status.COMPLETED).length,
    overdue: mockDirectives.filter(d => d.status === Status.OVERDUE).length,
  };
  
  return {
    data: stats,
    success: true,
  };
}

