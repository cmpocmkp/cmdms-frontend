/**
 * Mock Data for PTIs KP Module
 * Based on old CMDMS structure
 */

import { faker } from '@faker-js/faker';

export interface Task {
  id: number;
  title: string;
  description: string;
  progress: string;
  timeline: string;
  departments: Array<{
    id: number;
    name: string;
    pivot: {
      status: string;
      progress?: string;
    };
  }>;
}

export interface PTI {
  id: number;
  code: string; // e.g., "PTI-001"
  title: string;
  description: string; // HTML content
  creator?: {
    name: string;
    phone: string;
  };
  created_at: string;
  updated_at: string;
  tasks?: Task[];
}

// Generate mock PTIs matching old CMDMS structure
export const mockPTIs: PTI[] = Array.from({ length: 25 }, (_, index) => {
  const ptiNumber = String(index + 1).padStart(3, '0');
  return {
    id: index + 1,
    code: `PTI-${ptiNumber}`,
    title: faker.lorem.sentence({ min: 5, max: 10 }),
    description: `<p>${faker.lorem.paragraphs(2, '</p><p>')}</p>`,
    creator: faker.helpers.maybe(() => ({
      name: faker.person.fullName(),
      phone: faker.phone.number('+92-###-#######')
    }), { probability: 0.8 }),
    created_at: faker.date.past().toISOString(),
    updated_at: faker.date.recent().toISOString(),
    tasks: []
  };
});

// Add some tasks to a few PTIs
[0, 1, 2, 5, 8].forEach(index => {
  if (mockPTIs[index]) {
    mockPTIs[index].tasks = Array.from({ length: faker.number.int({ min: 2, max: 5 }) }, (_, taskIndex) => ({
      id: taskIndex + 1,
      title: faker.lorem.sentence({ min: 3, max: 6 }),
      description: `<p>${faker.lorem.paragraph()}</p>`,
      progress: `<p>${faker.lorem.sentences(2)}</p>`,
      timeline: faker.date.future().toISOString(),
      departments: Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, (_, deptIndex) => ({
        id: deptIndex + 1,
        name: faker.company.name() + ' Department',
        pivot: {
          status: faker.helpers.arrayElement([
            'Completed',
            'In Progress',
            'On Target',
            'Overdue',
            'Pending'
          ]),
          progress: faker.helpers.maybe(() => faker.lorem.sentence(), { probability: 0.7 })
        }
      }))
    }));
  }
});
