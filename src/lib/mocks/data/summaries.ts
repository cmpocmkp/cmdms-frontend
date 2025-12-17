/**
 * Mock Data for Summaries for CM Module
 */

import { faker } from '@faker-js/faker';

export interface Summary {
  id: number;
  reference_number: string;
  subject: string;
  initiator_department_id: number;
  initiator_department_name: string;
  description: string;
  priority: string;
  status: string;
  attachments?: string[];
  created_date: string;
  updated_at: string;
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
  attachments: faker.helpers.maybe(() => Array.from({ length: faker.number.int({ min: 1, max: 4 }) }, () => faker.system.fileName()), { probability: 0.6 }),
  created_date: faker.date.between({ from: '2024-01-01', to: '2025-01-01' }).toISOString(),
  updated_at: faker.date.recent().toISOString()
}));

export { summaryPriorities };
