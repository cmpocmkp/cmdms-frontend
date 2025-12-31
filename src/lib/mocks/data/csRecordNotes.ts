/**
 * Mock Data for CS (Chief Secretary) Record Notes Reports
 */

import { faker } from '@faker-js/faker';
import { mockDepartments } from './departments';

export interface CSRecordNoteMinute {
  id: number;
  decisions: string;
  comments: string; // Progress So Far
  responsibility: string;
  timeline: string;
  status: 'Completed' | 'On Target' | 'Overdue';
  replies?: Array<{
    id: number;
    reply_detail: string;
    user: {
      id: number;
      role_id: number;
    };
    attachments?: string[];
  }>;
}

export interface CSRecordNoteMeeting {
  id: number;
  subject: string;
  meeting_date?: string;
  department_id: number;
  department?: {
    id: number;
    name: string;
  };
  minutes: CSRecordNoteMinute[];
}

export interface CSRecordNoteDepartment {
  id: number;
  name: string;
  allmeetings: CSRecordNoteMeeting[];
}

// Generate mock CS Record Notes data
let cachedCSRecordNotes: CSRecordNoteDepartment[] | null = null;

export function generateMockCSRecordNotes(): CSRecordNoteDepartment[] {
  if (cachedCSRecordNotes) {
    return cachedCSRecordNotes;
  }

  // Filter departments: type 1 (main departments), exclude 44, 45, 46
  const filteredDepartments = mockDepartments.filter(
    dept => dept.department_type_id === 1 && ![44, 45, 46].includes(Number(dept.id))
  );

  cachedCSRecordNotes = filteredDepartments.map(dept => {
    // Each department gets 2-5 meetings
    const numMeetings = faker.number.int({ min: 2, max: 5 });
    const meetings: CSRecordNoteMeeting[] = [];

    for (let i = 0; i < numMeetings; i++) {
      // Each meeting gets 3-10 minutes
      const numMinutes = faker.number.int({ min: 3, max: 10 });
      const minutes: CSRecordNoteMinute[] = [];

      for (let j = 0; j < numMinutes; j++) {
        // Distribute statuses: 30% Completed, 30% On Target, 40% Overdue
        const statusRand = faker.number.float({ min: 0, max: 1 });
        let status: 'Completed' | 'On Target' | 'Overdue';
        let timeline: string;

        if (statusRand < 0.3) {
          status = 'Completed';
          timeline = faker.date.past({ years: 1 }).toISOString().split('T')[0];
        } else if (statusRand < 0.6) {
          status = 'On Target';
          timeline = faker.date.future({ years: 1 }).toISOString().split('T')[0];
        } else {
          status = 'Overdue';
          timeline = faker.date.past({ years: 1 }).toISOString().split('T')[0];
        }

        minutes.push({
          id: Number(dept.id) * 10000 + i * 100 + j,
          decisions: faker.lorem.sentences(2),
          comments: faker.lorem.paragraph(),
          responsibility: faker.company.name(),
          timeline,
          status,
          replies: faker.helpers.maybe(() => [
            {
              id: faker.number.int({ min: 1, max: 1000 }),
              reply_detail: faker.lorem.paragraph(),
              user: {
                id: faker.number.int({ min: 1, max: 100 }),
                role_id: faker.helpers.arrayElement([1, 2, 5])
              },
              attachments: faker.helpers.maybe(() => [faker.system.fileName()], { probability: 0.3 }) || undefined
            }
          ], { probability: 0.5 }) || undefined
        });
      }

      meetings.push({
        id: Number(dept.id) * 100 + i,
        subject: faker.lorem.sentences(2),
        meeting_date: faker.date.between({ from: '2024-01-01', to: '2025-01-01' }).toISOString().split('T')[0],
        department_id: Number(dept.id),
        department: {
          id: Number(dept.id),
          name: dept.name
        },
        minutes
      });
    }

    return {
      id: Number(dept.id),
      name: dept.name,
      allmeetings: meetings
    };
  });

  return cachedCSRecordNotes;
}

// Generate mock data for detail view (filtered by department and status)
export function generateMockCSRecordNotesDetail(
  deptId: number,
  stat: string
): CSRecordNoteMeeting[] {
  const allData = generateMockCSRecordNotes();
  const department = allData.find(d => d.id === deptId);

  if (!department) {
    return [];
  }

  let filteredMeetings = department.allmeetings.map(meeting => {
    let filteredMinutes: CSRecordNoteMinute[];

    if (stat === '4') {
      // All minutes (total)
      filteredMinutes = meeting.minutes;
    } else if (stat === '3') {
      // Overdue only
      filteredMinutes = meeting.minutes.filter(m => m.status === 'Overdue');
    } else if (stat === '1') {
      // Completed only
      filteredMinutes = meeting.minutes.filter(m => m.status === 'Completed');
    } else if (stat === '2') {
      // On Target only
      filteredMinutes = meeting.minutes.filter(m => m.status === 'On Target');
    } else {
      filteredMinutes = [];
    }

    return {
      ...meeting,
      minutes: filteredMinutes
    };
  }).filter(meeting => meeting.minutes.length > 0);

  return filteredMeetings;
}

