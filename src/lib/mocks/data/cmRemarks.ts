/**
 * Mock Data for CM Remarks Module
 */

import { faker } from '@faker-js/faker';

export interface CMRemark {
  id: number;
  section_id: number;
  section_name: string;
  subject: string;
  letter_number: string;
  issue_date: string;
  timeline: string;
  attachments?: string[];
  departments: {
    id: number;
    name: string;
    status?: string;
  }[];
  comments?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

// Mock sections
const mockSections = [
  { id: 1, name: 'Section A - Development' },
  { id: 2, name: 'Section B - Finance' },
  { id: 3, name: 'Section C - Administration' },
  { id: 4, name: 'Section D - Social Welfare' },
  { id: 5, name: 'Section E - Infrastructure' }
];

// Generate mock CM remarks
export const mockCMRemarks: CMRemark[] = Array.from({ length: 60 }, (_, index) => {
  const section = faker.helpers.arrayElement(mockSections);
  const deptCount = faker.number.int({ min: 1, max: 4 });
  const departments = Array.from({ length: deptCount }, () => ({
    id: faker.number.int({ min: 1, max: 30 }),
    name: faker.company.name() + ' Department',
    status: faker.helpers.arrayElement(['Completed', 'Pending', 'In Progress', 'Overdue'])
  }));

  return {
    id: index + 1,
    section_id: section.id,
    section_name: section.name,
    subject: faker.lorem.sentences(2),
    letter_number: `CM-${faker.string.alphanumeric(8).toUpperCase()}`,
    issue_date: faker.date.between({ from: '2024-01-01', to: '2025-01-01' }).toISOString().split('T')[0],
    timeline: faker.date.future().toISOString().split('T')[0],
    attachments: faker.helpers.maybe(() => Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, () => faker.system.fileName()), { probability: 0.5 }),
    departments,
    comments: faker.helpers.maybe(() => faker.lorem.paragraph(), { probability: 0.7 }),
    status: faker.helpers.arrayElement(['Completed', 'Pending', 'In Progress', 'Overdue']),
    created_at: faker.date.past().toISOString(),
    updated_at: faker.date.recent().toISOString()
  };
});

export { mockSections };
