// Mock Directives Data

import { Directive, Status, Priority } from '../../../types';
import { getRandomDepartments } from './departments';
import { generateTitle, generateDescription, generateReferenceNumber } from '../generators/textGenerator';
import { generateTimeline } from '../generators/dateGenerator';
import { randomPriority } from '../generators/statusGenerator';

// Generate 30 mock directives
export const mockDirectives: Directive[] = Array.from({ length: 30 }, (_, index) => {
  const timeline = generateTimeline();
  const numDepartments = Math.floor(Math.random() * 3) + 1; // 1-3 departments
  
  return {
    id: index + 1,
    title: generateTitle('directive'),
    description: generateDescription('directive'),
    directive_date: timeline.created_at,
    reference_number: generateReferenceNumber('DIR'),
    departments: getRandomDepartments(numDepartments),
    status: timeline.status as Status,
    priority: randomPriority(),
    deadline: timeline.deadline,
    created_at: timeline.created_at,
    updated_at: new Date().toISOString(),
    replies: [], // Will be populated by separate service
    sub_tasks: [],
    attachments: [],
  };
});

/**
 * Get directive by ID
 */
export function getDirectiveById(id: number): Directive | undefined {
  return mockDirectives.find(d => d.id === id);
}

/**
 * Filter directives
 */
export function filterDirectives(filters: {
  search?: string;
  department_id?: number;
  status?: Status;
  priority?: Priority;
}): Directive[] {
  let result = [...mockDirectives];
  
  if (filters.search) {
    const query = filters.search.toLowerCase();
    result = result.filter(d =>
      d.title.toLowerCase().includes(query) ||
      d.description?.toLowerCase().includes(query) ||
      d.reference_number?.toLowerCase().includes(query)
    );
  }
  
  if (filters.department_id) {
    result = result.filter(d =>
      d.departments.some(dept => dept.id === filters.department_id)
    );
  }
  
  if (filters.status) {
    result = result.filter(d => d.status === filters.status);
  }
  
  if (filters.priority) {
    result = result.filter(d => d.priority === filters.priority);
  }
  
  return result;
}

