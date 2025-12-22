/**
 * Mock Data for Recordnotes Updates Report
 */

import { faker } from '@faker-js/faker';
import { mockDepartments } from './departments';

export interface RecordNoteUpdateMeeting {
  id: number;
  subject: string;
  meeting_date: string;
  updated_at: string;
  minutes: RecordNoteUpdateMinute[];
  department?: { id: number; name: string };
}

export interface RecordNoteUpdateMinute {
  id: number;
  decisions: string;
  progress_so_far?: string;
  responsibility: string;
  timeline: string;
  status: 'Completed' | 'On Target' | 'Overdue';
  updated_at: string;
  last_updated_by_department?: string;
  departments?: Array<{ id: number; name: string }>;
}

export interface RecordNoteUpdateDepartment {
  id: number;
  name: string;
  allmeetings: RecordNoteUpdateMeeting[];
  total: number;
  completed: number;
  on_target: number;
  overdue: number;
}

// Generate mock recordnotes updates data
export function generateMockRecordNotesUpdates(): RecordNoteUpdateDepartment[] {
  // Filter departments by type 1 and 3, exclude 44, 45, 46
  const filteredDepartments = mockDepartments.filter(
    dept => [1, 3].includes(dept.department_type_id) && ![44, 45, 46].includes(Number(dept.id))
  );

  // Generate data for each department
  return filteredDepartments.map(dept => {
    // Each department gets 2-6 meetings
    const numMeetings = faker.number.int({ min: 2, max: 6 });

    // Generate statistics for this department
    const total = faker.number.int({ min: 5, max: 50 });
    const completed = faker.number.int({ min: 0, max: Math.floor(total * 0.5) });
    const on_target = faker.number.int({ min: 0, max: Math.floor((total - completed) * 0.6) });
    const overdue = total - completed - on_target;

    // Generate meetings with minutes for this department
    // Track remaining counts to distribute
    let remainingCompleted = completed;
    let remainingOnTarget = on_target;
    let remainingOverdue = overdue;
    let minuteIdCounter = 10000 + Number(dept.id) * 10000;

    const generatedMeetings: RecordNoteUpdateMeeting[] = Array.from({ length: numMeetings }, (_, idx) => {
      // Distribute minutes across meetings (roughly equal, with remainder in last meeting)
      const isLastMeeting = idx === numMeetings - 1;
      
      const completedCount = isLastMeeting 
        ? remainingCompleted 
        : Math.floor(completed / numMeetings);
      const onTargetCount = isLastMeeting
        ? remainingOnTarget
        : Math.floor(on_target / numMeetings);
      const overdueCount = isLastMeeting
        ? remainingOverdue
        : Math.floor(overdue / numMeetings);

      remainingCompleted -= completedCount;
      remainingOnTarget -= onTargetCount;
      remainingOverdue -= overdueCount;

      const minutes: RecordNoteUpdateMinute[] = [];
      
      // Add completed minutes
      for (let i = 0; i < completedCount; i++) {
        minutes.push({
          id: minuteIdCounter++,
          decisions: faker.lorem.sentences(2),
          progress_so_far: faker.lorem.paragraph(),
          responsibility: faker.company.name(),
          timeline: faker.date.future().toISOString().split('T')[0],
          status: 'Completed',
          updated_at: faker.date.recent().toISOString(),
          last_updated_by_department: faker.date.recent().toISOString(),
          departments: [{ id: Number(dept.id), name: dept.name }]
        });
      }
      
      // Add on target minutes
      for (let i = 0; i < onTargetCount; i++) {
        minutes.push({
          id: minuteIdCounter++,
          decisions: faker.lorem.sentences(2),
          progress_so_far: faker.lorem.paragraph(),
          responsibility: faker.company.name(),
          timeline: faker.date.future().toISOString().split('T')[0],
          status: 'On Target',
          updated_at: faker.date.recent().toISOString(),
          last_updated_by_department: faker.date.recent().toISOString(),
          departments: [{ id: Number(dept.id), name: dept.name }]
        });
      }
      
      // Add overdue minutes
      for (let i = 0; i < overdueCount; i++) {
        minutes.push({
          id: minuteIdCounter++,
          decisions: faker.lorem.sentences(2),
          progress_so_far: faker.lorem.paragraph(),
          responsibility: faker.company.name(),
          timeline: faker.date.past().toISOString().split('T')[0],
          status: 'Overdue',
          updated_at: faker.date.recent().toISOString(),
          last_updated_by_department: faker.helpers.maybe(() => faker.date.recent().toISOString(), { probability: 0.7 }),
          departments: [{ id: Number(dept.id), name: dept.name }]
        });
      }

      return {
        id: 1000 + Number(dept.id) * 100 + idx,
        subject: faker.lorem.sentences(2),
        meeting_date: faker.date.between({ from: '2024-01-01', to: '2025-01-01' }).toISOString().split('T')[0],
        updated_at: faker.date.recent().toISOString(),
        minutes,
        department: { id: Number(dept.id), name: dept.name }
      };
    });

    return {
      id: Number(dept.id),
      name: dept.name,
      allmeetings: generatedMeetings,
      total,
      completed,
      on_target,
      overdue
    };
  });
}

// Generate mock data for detail view (filtered by department and status)
export function generateMockRecordNotesUpdatesDetail(deptId: number, status: number): RecordNoteUpdateMeeting[] {
  const departments = generateMockRecordNotesUpdates();
  const department = departments.find(d => d.id === deptId);
  
  if (!department) {
    return [];
  }

  let filteredMeetings = department.allmeetings.map(meeting => {
    let filteredMinutes: RecordNoteUpdateMinute[];
    
    if (status === 4) {
      // All minutes (total)
      filteredMinutes = meeting.minutes;
    } else if (status === 3) {
      // Overdue only
      filteredMinutes = meeting.minutes.filter(m => m.status === 'Overdue');
    } else if (status === 1) {
      // Completed only
      filteredMinutes = meeting.minutes.filter(m => m.status === 'Completed');
    } else if (status === 2) {
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
