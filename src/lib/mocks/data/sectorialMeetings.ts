/**
 * Mock Data for Sectorial Meetings Module
 */

import { faker } from '@faker-js/faker';

export interface SectorialMeeting {
  id: number;
  subject: string;
  date: string;
  departments: number[];
  departments_names: string[];
  participants?: string;
  attachments?: string[];
  agenda_points_count: number;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
}

export interface AgendaPoint {
  id: number;
  meeting_id: number;
  subject: string;
  description: string;
  department_id: number;
  department_name: string;
  status: string;
  timeline?: string;
  created_at: string;
}

// Generate mock sectorial meetings
export const mockSectorialMeetings: SectorialMeeting[] = Array.from({ length: 40 }, (_, index) => {
  const deptCount = faker.number.int({ min: 2, max: 6 });
  const departments = Array.from({ length: deptCount }, () => faker.number.int({ min: 1, max: 30 }));

  return {
    id: index + 1,
    subject: faker.lorem.sentences(2),
    date: faker.date.between({ from: '2024-01-01', to: '2025-01-01' }).toISOString().split('T')[0],
    departments,
    departments_names: departments.map(() => faker.company.name() + ' Department'),
    participants: faker.helpers.maybe(() => faker.lorem.paragraph(), { probability: 0.6 }),
    attachments: faker.helpers.maybe(() => [faker.system.fileName()], { probability: 0.5 }),
    agenda_points_count: faker.number.int({ min: 3, max: 20 }),
    created_at: faker.date.past().toISOString(),
    updated_at: faker.date.recent().toISOString(),
    created_by: faker.person.fullName(),
    updated_by: faker.person.fullName()
  };
});

// Generate mock agenda points
export const mockAgendaPoints: AgendaPoint[] = Array.from({ length: 200 }, (_, index) => ({
  id: index + 1,
  meeting_id: faker.number.int({ min: 1, max: 40 }),
  subject: faker.lorem.sentence(),
  description: faker.lorem.paragraphs(2),
  department_id: faker.number.int({ min: 1, max: 30 }),
  department_name: faker.company.name() + ' Department',
  status: faker.helpers.arrayElement(['Completed', 'On Target', 'Overdue', 'Pending']),
  timeline: faker.helpers.maybe(() => faker.date.future().toISOString().split('T')[0], { probability: 0.8 }),
  created_at: faker.date.past().toISOString()
}));
