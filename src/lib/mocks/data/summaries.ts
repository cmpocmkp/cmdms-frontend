/**
 * Mock Data for Summaries for CM Module
 */

import { faker } from '@faker-js/faker';

export interface Task {
  id: number;
  title: string;
  description: string;
  progress: string;
  timeline: string;
  status: string;
  departments: Array<{
    id: number;
    name: string;
  }>;
}

export interface SummaryAttachment {
  id: number;
  file_path: string;
  file_title: string;
}

export interface Summary {
  id: number;
  reference_number: string;
  subject: string;
  initiator_department_id: number;
  initiator_department_name: string;
  description: string;
  priority: string;
  status: string;
  attachments?: SummaryAttachment[];
  created_date: string;
  updated_at: string;
  tasks?: Task[];
}

const summaryPriorities = ['High', 'Medium', 'Low'];

// Generate mock summaries
export const mockSummaries: Summary[] = Array.from({ length: 70 }, (_, index) => ({
  id: index + 1,
  reference_number: `SUM-${faker.string.alphanumeric(8).toUpperCase()}`,
  subject: faker.lorem.sentences(2),
  initiator_department_id: faker.number.int({ min: 1, max: 30 }),
  initiator_department_name: faker.company.name() + ' Department',
  description: faker.lorem.paragraphs(3),
  priority: faker.helpers.arrayElement(summaryPriorities),
  status: faker.helpers.arrayElement(['Draft', 'Submitted', 'Under Review', 'Approved', 'Rejected']),
  attachments: faker.helpers.maybe(() => Array.from({ length: faker.number.int({ min: 1, max: 4 }) }, (_, i) => ({
    id: i + 1,
    file_path: `storage/${faker.system.fileName()}`,
    file_title: faker.system.fileName()
  })), { probability: 0.6 }),
  created_date: faker.date.between({ from: '2024-01-01', to: '2025-01-01' }).toISOString(),
  updated_at: faker.date.recent().toISOString(),
  tasks: []
}));

// Add some tasks to a few summaries (similar to PTIs)
[0, 1, 2, 5, 8, 10, 15, 20].forEach(index => {
  if (mockSummaries[index]) {
    mockSummaries[index].tasks = Array.from({ length: faker.number.int({ min: 2, max: 5 }) }, (_, taskIndex) => ({
      id: taskIndex + 1,
      title: faker.lorem.sentence({ min: 3, max: 6 }),
      description: `<p>${faker.lorem.paragraph()}</p>`,
      progress: `<p>${faker.lorem.sentences(2)}</p>`,
      timeline: faker.date.future().toISOString(),
      status: faker.helpers.arrayElement([
        'Completed',
        'In Progress',
        'On Target',
        'Overdue',
        'Pending'
      ]),
      departments: Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, (_, deptIndex) => ({
        id: deptIndex + 1,
        name: faker.company.name() + ' Department'
      }))
    }));
  }
});

export { summaryPriorities };
