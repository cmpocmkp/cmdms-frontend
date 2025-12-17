/**
 * Mock Tags Data
 * Used in Tags page
 */

import { faker } from '@faker-js/faker';

export interface Tag {
  id: number;
  name: string;
  module?: 'minutes' | 'sectoral' | 'directives' | 'interventions' | 'announcements' | 'complaints';
  module_label?: string;
  parent_id?: number;
  parent_name?: string;
  status: 'active' | 'inactive';
  status_label: string;
}

// Module labels
const moduleLabels: Record<string, string> = {
  minutes: 'Minutes',
  sectoral: 'Sectoral Meetings',
  directives: 'Directives',
  interventions: 'Trackers',
  announcements: 'Announcements',
  complaints: 'Complaints',
};

// Tag name examples
const tagNames = [
  'Urgent',
  'High Priority',
  'Low Priority',
  'Review Pending',
  'Approved',
  'Rejected',
  'In Progress',
  'Completed',
  'Deferred',
  'Cancelled',
  'Follow Up',
  'Action Required',
  'Important',
  'Confidential',
  'Public',
  'Internal',
  'External',
  'Development',
  'Infrastructure',
  'Healthcare',
  'Education',
  'Agriculture',
  'Finance',
  'Security',
  'Environment',
];

// Generate mock tags
const generateMockTags = (count: number): Tag[] => {
  const tags: Tag[] = [];
  
  // Create parent tags first
  const parentTags: Tag[] = [];
  const numParents = Math.floor(count / 3);
  
  for (let i = 1; i <= numParents; i++) {
    const module = faker.helpers.arrayElement([
      'minutes',
      'sectoral',
      'directives',
      'interventions',
      'announcements',
      'complaints',
    ] as const);
    
    const tag: Tag = {
      id: i,
      name: faker.helpers.arrayElement(tagNames),
      module,
      module_label: moduleLabels[module],
      parent_id: undefined,
      parent_name: undefined,
      status: faker.helpers.arrayElement(['active', 'inactive'] as const),
      status_label: faker.helpers.arrayElement(['Active', 'Inactive']),
    };
    
    parentTags.push(tag);
    tags.push(tag);
  }
  
  // Create child tags
  for (let i = numParents + 1; i <= count; i++) {
    const hasParent = faker.datatype.boolean({ probability: 0.6 });
    const parent = hasParent ? faker.helpers.arrayElement(parentTags) : null;
    
    const module = parent ? parent.module : faker.helpers.arrayElement([
      'minutes',
      'sectoral',
      'directives',
      'interventions',
      'announcements',
      'complaints',
    ] as const);
    
    const tag: Tag = {
      id: i,
      name: faker.helpers.arrayElement(tagNames),
      module,
      module_label: module ? moduleLabels[module] : undefined,
      parent_id: parent?.id,
      parent_name: parent?.name,
      status: faker.helpers.arrayElement(['active', 'inactive'] as const),
      status_label: faker.helpers.arrayElement(['Active', 'Inactive']),
    };
    
    tags.push(tag);
  }
  
  return tags;
};

export const mockAdminTags = generateMockTags(35);
