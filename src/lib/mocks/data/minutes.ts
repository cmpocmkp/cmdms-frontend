/**
 * Mock Data for Minutes (Record Notes) Module
 */

import { faker } from '@faker-js/faker';

export interface Minute {
  id: number;
  subject: string;
  meeting_date: string;
  departments: number[];
  departments_names: string[];
  participants?: string;
  attachments?: string[];
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
  meeting_type?: string;
  decisions_count: number;
}

export interface MinuteDecision {
  id: number;
  minute_id: number;
  subject: string;
  decision_text: string;
  responsibility?: string;
  progress?: string;
  comments?: string;
  progress_detail?: string;
  timeline?: string;
  status: string;
  departments: number[];
  responsible_departments?: Array<{
    id: number;
    name: string;
    status: string;
  }>;
  created_at: string;
  updated_at: string;
  creator_name?: string;
  editor_name?: string;
  delay_remaining?: string;
  attachments?: string[];
}

// Generate mock minutes
export const mockMinutes: Minute[] = Array.from({ length: 50 }, (_, index) => {
  const deptCount = faker.number.int({ min: 1, max: 5 });
  const departments = Array.from({ length: deptCount }, () => faker.number.int({ min: 1, max: 30 }));
  
  return {
    id: index + 1,
    subject: faker.lorem.sentences(2),
    meeting_date: faker.date.between({ from: '2024-01-01', to: '2025-01-01' }).toISOString().split('T')[0],
    departments,
    departments_names: departments.map(() => faker.company.name() + ' Department'),
    participants: faker.helpers.maybe(() => faker.lorem.paragraph(), { probability: 0.7 }),
    attachments: faker.helpers.maybe(() => [faker.system.fileName()], { probability: 0.5 }),
    created_at: faker.date.past().toISOString(),
    updated_at: faker.date.recent().toISOString(),
    created_by: faker.person.fullName(),
    updated_by: faker.person.fullName(),
    meeting_type: faker.helpers.arrayElement(['Normal', 'Cabinet', 'Board', 'Sectorial']),
    decisions_count: faker.number.int({ min: 0, max: 15 })
  };
});

// Mock department names for decisions
const mockDepartmentNames = [
  'Health Department', 'Education Department', 'Finance Department',
  'Infrastructure Department', 'Agriculture Department', 'Transport Department',
  'Energy Department', 'Local Government', 'Tourism Department'
];

// Generate mock decisions
export const mockMinuteDecisions: MinuteDecision[] = Array.from({ length: 150 }, (_, index) => {
  const statusOptions = ['Completed', 'On Target', 'Overdue', 'Off Target', 'Ongoing'];
  const status = faker.helpers.arrayElement(statusOptions);
  const timeline = faker.helpers.maybe(() => faker.date.future().toISOString().split('T')[0], { probability: 0.8 });
  
  // Calculate delay/remaining based on timeline and status
  let delayRemaining = '';
  if (timeline && status !== 'Completed') {
    const today = new Date();
    const timelineDate = new Date(timeline);
    const diffTime = timelineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      delayRemaining = `Delayed by ${Math.abs(diffDays)} days`;
    } else {
      delayRemaining = `${diffDays} days remaining`;
    }
  }
  
  // Generate responsible departments
  const deptCount = faker.number.int({ min: 1, max: 4 });
  const responsibleDepartments = Array.from({ length: deptCount }, (_, dIdx) => ({
    id: dIdx + 1,
    name: faker.helpers.arrayElement(mockDepartmentNames),
    status: faker.helpers.arrayElement(statusOptions)
  }));
  
  return {
    id: index + 1,
    minute_id: faker.number.int({ min: 1, max: 50 }),
    subject: faker.lorem.sentence(),
    decision_text: faker.lorem.paragraphs(2),
    responsibility: faker.lorem.sentence(),
    progress: faker.lorem.paragraph(),
    comments: faker.lorem.paragraph(),
    progress_detail: faker.helpers.maybe(() => faker.lorem.paragraphs(3), { probability: 0.6 }),
    timeline,
    status,
    departments: Array.from({ length: deptCount }, () => faker.number.int({ min: 1, max: 30 })),
    responsible_departments: responsibleDepartments,
    created_at: faker.date.past().toISOString(),
    updated_at: faker.date.recent().toISOString(),
    creator_name: faker.person.fullName(),
    editor_name: faker.person.fullName(),
    delay_remaining: delayRemaining,
    attachments: faker.helpers.maybe(() => [faker.system.fileName(), faker.system.fileName()], { probability: 0.4 })
  };
});
