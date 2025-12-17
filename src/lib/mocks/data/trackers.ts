/**
 * Mock Data for Trackers Module
 */

import { faker } from '@faker-js/faker';

export interface Tracker {
  id: number;
  subject: string;
  description: string;
  department_id: number;
  department_name: string;
  assigned_to?: string;
  priority: string;
  status: string;
  deadline?: string;
  progress_percent?: number;
  created_at: string;
  updated_at: string;
}

const trackerPriorities = ['Critical', 'High', 'Medium', 'Low'];
const trackerStatuses = ['Not Started', 'In Progress', 'On Hold', 'Completed', 'Cancelled'];

// Generate mock trackers
export const mockTrackers: Tracker[] = Array.from({ length: 80 }, (_, index) => ({
  id: index + 1,
  subject: faker.lorem.sentence(),
  description: faker.lorem.paragraphs(2),
  department_id: faker.number.int({ min: 1, max: 30 }),
  department_name: faker.company.name() + ' Department',
  assigned_to: faker.helpers.maybe(() => faker.person.fullName(), { probability: 0.8 }),
  priority: faker.helpers.arrayElement(trackerPriorities),
  status: faker.helpers.arrayElement(trackerStatuses),
  deadline: faker.helpers.maybe(() => faker.date.future().toISOString().split('T')[0], { probability: 0.85 }),
  progress_percent: faker.number.int({ min: 0, max: 100 }),
  created_at: faker.date.past().toISOString(),
  updated_at: faker.date.recent().toISOString()
}));

export { trackerPriorities, trackerStatuses };
