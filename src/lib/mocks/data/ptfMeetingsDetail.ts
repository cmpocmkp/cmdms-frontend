/**
 * Mock Data for PTF Meetings Detail Report
 */

import { faker } from '@faker-js/faker';
import { mockDepartments } from './departments';

export interface PTFMeetingDetailDepartment {
  id: number;
  name: string;
  pivot?: {
    status: number;
    remarks?: string;
  };
}

export interface PTFMeetingDetailMinute {
  id: number;
  issues: string;
  comments: string;
  timeline: string;
  status: string; // 'Completed' | 'On Target' | 'Overdue' | 'Off Target' | 'Ongoing' | 'Overdue Other Reason' | 'Off Target Other Reason'
  departments: PTFMeetingDetailDepartment[];
  replies?: Array<{
    id: number;
    department_id: number;
    status: number;
    created_at: string;
  }>;
}

export interface PTFMeetingDetailMeeting {
  id: number;
  subject: string;
  meeting_date: string;
  created_at: string;
  updated_at: string;
  department: {
    id: number;
    name: string;
  };
  creator?: {
    name: string;
  };
  editor?: {
    name: string;
  };
  minutes: PTFMeetingDetailMinute[];
}

// Helper function to get status string from number
const getStatusFromNumber = (statusNum: number): string => {
  const statusMap: Record<number, string> = {
    1: 'Completed',
    2: 'On Target',
    3: 'Overdue',
    4: 'Off Target',
    7: 'Ongoing',
    6: 'Overdue Other Reason',
    9: 'Off Target Other Reason'
  };
  return statusMap[statusNum] || 'Overdue';
};

// Generate mock PTF meetings detail data
export function generateMockPTFMeetingsDetail(deptId: number, status: number): PTFMeetingDetailMeeting[] {
  const department = mockDepartments.find(d => Number(d.id) === deptId);
  
  if (!department) {
    return [];
  }

  // Filter departments for responsible departments (can be multiple)
  const availableDepts = mockDepartments.filter(d => d.department_type_id === 1).slice(0, 10);

  // Generate 2-4 meetings for this department
  const numMeetings = faker.number.int({ min: 2, max: 4 });
  const meetings: PTFMeetingDetailMeeting[] = [];

  for (let i = 0; i < numMeetings; i++) {
    // Generate minutes for this meeting
    const numMinutes = faker.number.int({ min: 3, max: 8 });
    const minutes: PTFMeetingDetailMinute[] = [];

    for (let j = 0; j < numMinutes; j++) {
      // Determine minute status
      let minuteStatus: string;
      if (status === 5) {
        // All statuses
        minuteStatus = faker.helpers.arrayElement([
          'Completed', 'On Target', 'Overdue', 'Off Target', 'Ongoing',
          'Overdue Other Reason', 'Off Target Other Reason'
        ]);
      } else {
        minuteStatus = getStatusFromNumber(status);
      }

      // Generate 1-3 responsible departments for this minute
      const numResponsibleDepts = faker.number.int({ min: 1, max: 3 });
      const responsibleDepts: PTFMeetingDetailDepartment[] = faker.helpers
        .arrayElements(availableDepts, numResponsibleDepts)
        .map(dept => ({
          id: Number(dept.id),
          name: dept.name,
          pivot: {
            status: faker.helpers.arrayElement([1, 2, 3, 4, 7, 6, 9]),
            remarks: faker.lorem.sentence()
          }
        }));

      // Generate timeline (past for overdue, future for on target, recent for completed)
      let timeline: string;
      if (minuteStatus === 'Overdue' || minuteStatus === 'Overdue Other Reason') {
        timeline = faker.date.past({ years: 1 }).toISOString().split('T')[0];
      } else if (minuteStatus === 'On Target' || minuteStatus === 'Ongoing') {
        timeline = faker.date.future({ years: 1 }).toISOString().split('T')[0];
      } else {
        timeline = faker.date.recent({ days: 30 }).toISOString().split('T')[0];
      }

      minutes.push({
        id: 10000 + i * 1000 + j,
        issues: faker.lorem.sentences(2),
        comments: faker.lorem.paragraph(),
        timeline,
        status: minuteStatus,
        departments: responsibleDepts,
        replies: Array.from({ length: faker.number.int({ min: 0, max: 2 }) }, (_, idx) => ({
          id: idx + 1,
          department_id: faker.helpers.arrayElement(responsibleDepts).id,
          status: faker.helpers.arrayElement([1, 2, 3, 4, 7]),
          created_at: faker.date.recent().toISOString()
        }))
      });
    }

    // Filter minutes by status if not showing all
    let filteredMinutes = minutes;
    if (status !== 5) {
      filteredMinutes = minutes.filter(m => m.status === getStatusFromNumber(status));
    }

    if (filteredMinutes.length === 0) {
      continue; // Skip meetings with no minutes matching the status
    }

    meetings.push({
      id: 1000 + Number(deptId) * 100 + i,
      subject: faker.lorem.sentences(2),
      meeting_date: faker.date.between({ from: '2024-01-01', to: '2025-01-01' }).toISOString().split('T')[0],
      created_at: faker.date.past().toISOString(),
      updated_at: faker.date.recent().toISOString(),
      department: {
        id: Number(department.id),
        name: department.name
      },
      creator: {
        name: faker.person.fullName()
      },
      editor: {
        name: faker.person.fullName()
      },
      minutes: filteredMinutes
    });
  }

  return meetings;
}
