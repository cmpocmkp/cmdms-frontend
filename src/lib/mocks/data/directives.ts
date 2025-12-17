/**
 * Mock Data for Directives Module
 */

import { faker } from '@faker-js/faker';

export interface MockDirective {
  id: number;
  subject: string;
  comments?: string;
  progress?: string;
  letter_no: string;
  date: string;
  timeline: string;
  status: string;
  department_ids?: number[];
  departments: {
    id: number;
    name: string;
    status?: string;
    remarks?: string;
    replies?: Array<{
      id: number;
      reply_detail: string;
      attachments?: string[];
      status?: string;
      remarks?: string;
      overdue_reason?: string;
      created_at: string;
    }>;
  }[];
  attachments?: string[];
  is_archived: boolean;
  created_at: string;
  updated_at: string;
  creator_name?: string;
  meeting_type_id?: number;
}

// Mock status summary
export const mockDirectivesSummary = {
  total: 320,
  'Completed': { count: 120, percent: 37.5 },
  'On Target': { count: 80, percent: 25 },
  'Overdue': { count: 120, percent: 37.5 }
};

// Generate mock directives
export const mockDirectives: MockDirective[] = Array.from({ length: 80 }, (_, index) => {
  const deptCount = faker.number.int({ min: 1, max: 4 });
  const departments = Array.from({ length: deptCount }, (_, dIdx) => {
    // Generate replies for each department
    const replyCount = faker.number.int({ min: 0, max: 5 });
    const replies = Array.from({ length: replyCount }, (_, rIdx) => ({
      id: rIdx + 1,
      reply_detail: faker.lorem.paragraphs(2),
      attachments: faker.helpers.maybe(() => [faker.system.fileName()], { probability: 0.3 }),
      status: faker.helpers.arrayElement(['Completed', 'On Target', 'Overdue']),
      remarks: faker.lorem.sentence(),
      overdue_reason: faker.helpers.maybe(() => faker.lorem.sentence(), { probability: 0.2 }),
      created_at: faker.date.recent().toISOString()
    }));

    return {
      id: dIdx + 1,
      name: faker.company.name() + ' Department',
      status: faker.helpers.arrayElement(['Completed', 'On Target', 'Overdue', 'Pending']),
      remarks: faker.helpers.maybe(() => faker.lorem.sentence(), { probability: 0.6 }),
      replies
    };
  });

  const progress = faker.helpers.maybe(() => faker.lorem.paragraph(), { probability: 0.6 });

  return {
    id: index + 1,
    subject: faker.lorem.sentences(3),
    comments: progress,
    progress: progress,
    letter_no: `DIR-${faker.string.alphanumeric(6).toUpperCase()}`,
    date: faker.date.between({ from: '2024-01-01', to: '2025-01-01' }).toISOString().split('T')[0],
    timeline: faker.date.future().toISOString().split('T')[0],
    status: faker.helpers.arrayElement(['Completed', 'On Target', 'Overdue', 'Pending']),
    department_ids: departments.map(d => d.id),
    departments,
    attachments: faker.helpers.maybe(() => Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, () => faker.system.fileName()), { probability: 0.4 }),
    is_archived: faker.datatype.boolean({ probability: 0.1 }),
    created_at: faker.date.past().toISOString(),
    updated_at: faker.date.recent().toISOString(),
    creator_name: faker.person.fullName(),
    meeting_type_id: faker.number.int({ min: 1, max: 3 })
  };
});
