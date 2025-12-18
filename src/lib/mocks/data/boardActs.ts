/**
 * Mock Data for Board Acts Module
 */

import { faker } from '@faker-js/faker';

export interface BoardAct {
  id: number;
  title: string;
  act_date: string;
  department_id: number;
  department_name: string;
  is_amend: boolean;
  attachment?: string;
  power_functions?: string;
  matters?: string;
  last_meeting_attachment?: string;
  last_meeting_date?: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
}

// Generate mock board acts
export const mockBoardActs: BoardAct[] = Array.from({ length: 50 }, (_, index) => {
  return {
    id: index + 1,
    title: faker.lorem.sentences(2),
    act_date: faker.date.between({ from: '2020-01-01', to: '2025-01-01' }).toISOString().split('T')[0],
    department_id: faker.number.int({ min: 1, max: 30 }),
    department_name: faker.company.name() + ' Board',
    is_amend: faker.datatype.boolean(),
    attachment: faker.helpers.maybe(() => faker.system.fileName(), { probability: 0.9 }),
    power_functions: faker.helpers.maybe(() => faker.system.fileName(), { probability: 0.7 }),
    matters: faker.helpers.maybe(() => faker.system.fileName(), { probability: 0.7 }),
    last_meeting_attachment: faker.helpers.maybe(() => faker.system.fileName(), { probability: 0.5 }),
    last_meeting_date: faker.helpers.maybe(() => faker.date.past().toISOString().split('T')[0], { probability: 0.6 }),
    created_at: faker.date.past().toISOString(),
    updated_at: faker.date.recent().toISOString(),
    created_by: faker.person.fullName(),
    updated_by: faker.person.fullName()
  };
});

