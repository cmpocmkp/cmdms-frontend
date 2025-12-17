/**
 * Mock Data for Trackers Module
 * Matching old CMDMS interventions structure
 */

import { faker } from '@faker-js/faker';

export interface Activity {
  id: number;
  title: string;
  remarks?: string; // HTML content
  way_forward?: string; // HTML content
  timeline?: string; // ISO date string
  departments: Array<{
    id: number;
    name: string;
    pivot: {
      status?: '1' | '2' | '3' | '4'; // DecisionStatus enum values
    };
  }>;
  attachments?: string[]; // File names
}

export interface Tracker {
  id: number;
  title: string;
  description: string; // HTML content
  department_id: number;
  department_name: string;
  activities_count: number;
  status: '1' | '2' | '3' | '4'; // 1: Completed, 2: On Target, 3: Overdue, 4: Off Target
  attachments?: string[]; // File names
  creator?: {
    name: string;
  };
  activities?: Activity[];
  created_at: string;
  updated_at: string;
}

// Status values matching old CMDMS (DecisionStatus enum)
const trackerStatuses = ['1', '2', '3', '4']; // 1: Completed, 2: On Target, 3: Overdue, 4: Off Target

// Generate mock trackers matching interventions structure
export const mockTrackers: Tracker[] = Array.from({ length: 50 }, (_, index) => {
  const activitiesCount = faker.number.int({ min: 0, max: 8 });
  const activities: Activity[] = Array.from({ length: activitiesCount }, (_, actIndex) => ({
    id: actIndex + 1,
    title: faker.lorem.sentence({ min: 3, max: 6 }),
    remarks: faker.helpers.maybe(() => `<p>${faker.lorem.paragraph()}</p>`, { probability: 0.7 }),
    way_forward: faker.helpers.maybe(() => `<p>${faker.lorem.paragraph()}</p>`, { probability: 0.6 }),
    timeline: faker.helpers.maybe(() => faker.date.future().toISOString().split('T')[0], { probability: 0.8 }),
    departments: Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, (_, deptIndex) => ({
      id: deptIndex + 1,
      name: faker.company.name() + ' Department',
      pivot: {
        status: faker.helpers.maybe(() => faker.helpers.arrayElement(['1', '2', '3', '4'] as const), { probability: 0.7 })
      }
    })),
    attachments: faker.helpers.maybe(() => Array.from({ length: faker.number.int({ min: 0, max: 2 }) }, () => 
      faker.system.fileName({ extensionCount: 1 })
    ), { probability: 0.3 })
  }));

  return {
    id: index + 1,
    title: faker.lorem.sentence({ min: 3, max: 8 }),
    description: `<p>${faker.lorem.paragraphs(1)}</p>`,
    department_id: faker.number.int({ min: 1, max: 30 }),
    department_name: faker.company.name() + ' Department',
    activities_count: activitiesCount,
    status: faker.helpers.arrayElement(['1', '2', '3', '4'] as const),
    attachments: faker.helpers.maybe(() => Array.from({ length: faker.number.int({ min: 0, max: 3 }) }, () => 
      faker.system.fileName({ extensionCount: 1 })
    ), { probability: 0.4 }),
    creator: faker.helpers.maybe(() => ({
      name: faker.person.fullName()
    }), { probability: 0.8 }),
    activities,
    created_at: faker.date.past().toISOString(),
    updated_at: faker.date.recent().toISOString()
  };
});

export { trackerStatuses };
