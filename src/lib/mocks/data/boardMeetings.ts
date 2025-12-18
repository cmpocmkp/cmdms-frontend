/**
 * Mock Data for Board Meetings Module
 */

import { faker } from '@faker-js/faker';

export interface BoardMeeting {
  id: number;
  subject: string;
  date: string;
  department_id: number;
  department_name: string;
  is_upcoming: boolean;
  attachments?: string[];
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
}

export interface BoardAgendaPoint {
  id: number;
  board_meeting_id: number;
  item: string;
  decision: string;
  comments: string; // Progress
  responsibility: string;
  timeline?: string;
  status: string; // 'Implemented' or 'Pending'
  attachments?: string[];
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
}

// Generate mock board meetings
export const mockBoardMeetings: BoardMeeting[] = Array.from({ length: 50 }, (_, index) => {
  return {
    id: index + 1,
    subject: faker.lorem.sentences(2),
    date: faker.date.between({ from: '2024-01-01', to: '2025-01-01' }).toISOString().split('T')[0],
    department_id: faker.number.int({ min: 1, max: 30 }),
    department_name: faker.company.name() + ' Board',
    is_upcoming: faker.datatype.boolean(),
    attachments: faker.helpers.maybe(() => [faker.system.fileName()], { probability: 0.5 }),
    created_at: faker.date.past().toISOString(),
    updated_at: faker.date.recent().toISOString(),
    created_by: faker.person.fullName(),
    updated_by: faker.person.fullName()
  };
});

// Generate mock board agenda points
export const mockBoardAgendaPoints: BoardAgendaPoint[] = Array.from({ length: 150 }, (_, index) => {
  return {
    id: index + 1,
    board_meeting_id: faker.number.int({ min: 1, max: 50 }),
    item: faker.lorem.sentence(),
    decision: faker.lorem.paragraph(),
    comments: faker.lorem.paragraph(),
    responsibility: faker.lorem.sentence(),
    timeline: faker.helpers.maybe(() => faker.date.future().toISOString().split('T')[0], { probability: 0.8 }),
    status: faker.helpers.arrayElement(['Implemented', 'Pending']),
    attachments: faker.helpers.maybe(() => [faker.system.fileName()], { probability: 0.4 }),
    created_at: faker.date.past().toISOString(),
    updated_at: faker.date.recent().toISOString(),
    created_by: faker.person.fullName(),
    updated_by: faker.person.fullName()
  };
});

