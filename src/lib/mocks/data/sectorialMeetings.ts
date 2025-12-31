/**
 * Mock Data for Sectorial Meetings Module
 */

import { faker } from '@faker-js/faker';

export interface SectorialMeeting {
  id: number;
  subject: string;
  sector?: string;
  date: string;
  time?: string;
  meeting_type_id?: number;
  meeting_number?: string;
  departments: number[];
  departments_names: string[];
  participants?: string;
  attendies?: string;
  attachments?: string[];
  agenda_points_count: number;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
}

export interface AgendaPointDepartment {
  id: number;
  name: string;
  status: string; // Status label like 'Completed', 'On Target', 'Overdue'
  status_badge: string; // Badge class like 'badge-success', 'badge-warning', 'badge-danger'
}

export interface AgendaPoint {
  id: number;
  meeting_id: number;
  item: string; // Agenda Item
  decision: string;
  comments: string; // Progress
  responsibility?: string;
  departments: AgendaPointDepartment[];
  timeline?: string;
  status?: number; // DecisionStatus enum value (1: Completed, 2: On Target, 3: Overdue, 4: Off Target, etc.)
  is_archived?: boolean;
  scheme_id?: number;
  attachments?: string[];
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
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

// Status mapping based on DecisionStatus enum
const statusMapping: Record<string, { label: string; badge: string }> = {
  'Completed': { label: 'Completed', badge: 'badge-success' },
  'On Target': { label: 'On Target', badge: 'badge-warning' },
  'Overdue': { label: 'Overdue', badge: 'badge-danger' },
  'Off Target': { label: 'Off Target', badge: 'badge-info' },
  'Ongoing': { label: 'Ongoing', badge: 'badge-ongoing' },
  'Pending': { label: 'Pending', badge: 'badge-secondary' }
};

// Generate mock agenda points
export const mockAgendaPoints: AgendaPoint[] = Array.from({ length: 200 }, (_, index) => {
  const deptCount = faker.number.int({ min: 1, max: 4 });
  const statusValues = [1, 2, 3, 4]; // Completed, On Target, Overdue, Off Target
  const statusLabels = ['Completed', 'On Target', 'Overdue', 'Off Target'];
  
  return {
    id: index + 1,
    meeting_id: faker.number.int({ min: 1, max: 40 }),
    item: faker.lorem.sentence(),
    decision: faker.lorem.paragraph(),
    comments: faker.lorem.paragraph(),
    responsibility: faker.helpers.maybe(() => faker.company.name() + ' Department', { probability: 0.7 }),
    status: faker.helpers.arrayElement(statusValues),
    departments: Array.from({ length: deptCount }, () => {
      const statusValue = faker.helpers.arrayElement(statusValues);
      const statusLabel = statusLabels[statusValues.indexOf(statusValue)];
      return {
        id: faker.number.int({ min: 1, max: 30 }),
        name: faker.company.name() + ' Department',
        status: statusLabel,
        status_badge: statusMapping[statusLabel]?.badge || 'badge-secondary'
      };
    }),
    timeline: faker.helpers.maybe(() => faker.date.future().toISOString().split('T')[0], { probability: 0.8 }),
    created_at: faker.date.past().toISOString(),
    updated_at: faker.date.recent().toISOString(),
    created_by: faker.person.fullName(),
    updated_by: faker.person.fullName()
  };
});

export interface SectorialAgendaPointReply {
  id: number;
  reply_detail: string;
  status?: number; // DecisionStatus enum value (1: Completed, 2: On Target, 3: Overdue, etc.)
  overdue_reason?: string;
  remarks?: string;
  other_remarks?: string;
  attachments?: string[];
  user: {
    id: number;
    name: string;
    phone?: string;
    role_id: number; // 1 = Admin/DataEntry, 2 = Department
  };
  department?: {
    id: number;
    name: string;
  };
  created_at: string;
}

// Generate mock replies for agenda points
export const mockSectorialAgendaPointReplies: SectorialAgendaPointReply[] = Array.from({ length: 50 }, (_, index) => {
  const isAdmin = faker.datatype.boolean();
  
  return {
    id: index + 1,
    reply_detail: faker.lorem.paragraphs(2),
    status: faker.helpers.maybe(() => faker.helpers.arrayElement([1, 2, 3]), { probability: 0.7 }),
    overdue_reason: faker.helpers.maybe(() => faker.lorem.sentence(), { probability: 0.3 }),
    attachments: faker.helpers.maybe(() => [faker.system.fileName()], { probability: 0.4 }),
    user: {
      id: index + 1,
      name: faker.person.fullName(),
      phone: faker.helpers.maybe(() => faker.phone.number(), { probability: 0.6 }),
      role_id: isAdmin ? 1 : 2
    },
    department: !isAdmin ? {
      id: faker.number.int({ min: 1, max: 30 }),
      name: faker.company.name() + ' Department'
    } : undefined,
    created_at: faker.date.past().toISOString()
  };
});
