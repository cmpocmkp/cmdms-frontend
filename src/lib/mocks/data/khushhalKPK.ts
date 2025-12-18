/**
 * Mock Data for Khushhal Khyber Pakhtunkhwa Module
 */

import { faker } from '@faker-js/faker';
import { mockAdminDepartments } from './adminDepartments';

export interface KhushhalKPKTask {
  id: number;
  subject_tasks: string;
  action_by_note?: string;
  progress_so_far?: string;
  timeline_date: string;
  timeline_note?: string;
  expected_outcomes?: string;
  departments: number[];
  attachments?: string[];
  status?: string;
  created_at: string;
  updated_at: string;
}

// Task statuses
export const khushhalStatuses: Record<string, string> = {
  '1': 'Pending',
  '2': 'In Progress',
  '3': 'Completed',
  '4': 'On Hold'
};

// Generate mock Khushhal KPK tasks
export const mockKhushhalKPKTasks: KhushhalKPKTask[] = Array.from({ length: 50 }, (_, index) => {
  const departmentIds = faker.helpers.arrayElements(
    mockAdminDepartments.map(d => d.id),
    { min: 1, max: 3 }
  );

  return {
    id: index + 1,
    subject_tasks: faker.lorem.sentences(2),
    action_by_note: faker.lorem.paragraph(),
    progress_so_far: faker.lorem.paragraphs(2),
    timeline_date: faker.date.future().toISOString().split('T')[0],
    timeline_note: faker.lorem.sentence(),
    expected_outcomes: faker.lorem.paragraph(),
    departments: departmentIds,
    attachments: faker.helpers.maybe(() => Array.from({ length: faker.number.int({ min: 0, max: 2 }) }, () => 
      faker.system.fileName({ extensionCount: 1 })
    ), { probability: 0.4 }),
    status: faker.helpers.arrayElement(Object.keys(khushhalStatuses)),
    created_at: faker.date.past().toISOString(),
    updated_at: faker.date.recent().toISOString()
  };
});
