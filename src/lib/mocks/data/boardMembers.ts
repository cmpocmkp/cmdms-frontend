/**
 * Mock Data for Board Members Module
 */

import { faker } from '@faker-js/faker';

export interface BoardMember {
  id: number;
  name: string;
  department_id: number;
  department_name: string;
  qualification?: string;
  designation?: string;
  resume?: string;
  notification?: string;
  photo?: string;
  domicile?: string;
  joining_date?: string;
  expiration_date?: string;
  phone?: string;
  mobile?: string;
  email?: string;
  nic?: string;
  address?: string;
  type?: string; // BoardMemberType enum value
  status?: string; // BoardMemberStatus enum value
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
}

// Board member types (from enum)
export const boardMemberTypes: Record<string, string> = {
  '1': 'Chairman',
  '2': 'Member',
  '3': 'Secretary',
  '4': 'Other'
};

// Board member statuses (from enum)
export const boardMemberStatuses: Record<string, string> = {
  '1': 'Active',
  '2': 'Inactive',
  '3': 'Resigned',
  '4': 'Terminated'
};

// Generate mock board members
export const mockBoardMembers: BoardMember[] = Array.from({ length: 100 }, (_, index) => {
  const joiningDate = faker.date.past();
  const expirationDate = faker.date.future();
  
  return {
    id: index + 1,
    name: faker.person.fullName(),
    department_id: faker.number.int({ min: 1, max: 30 }),
    department_name: faker.company.name() + ' Board',
    qualification: faker.helpers.maybe(() => faker.lorem.words(3), { probability: 0.8 }),
    designation: faker.helpers.maybe(() => faker.person.jobTitle(), { probability: 0.8 }),
    resume: faker.helpers.maybe(() => faker.system.fileName(), { probability: 0.7 }),
    notification: faker.helpers.maybe(() => faker.system.fileName(), { probability: 0.6 }),
    photo: faker.helpers.maybe(() => faker.system.fileName(), { probability: 0.5 }),
    domicile: faker.helpers.maybe(() => faker.location.city(), { probability: 0.7 }),
    joining_date: joiningDate.toISOString().split('T')[0],
    expiration_date: expirationDate.toISOString().split('T')[0],
    phone: faker.helpers.maybe(() => faker.phone.number(), { probability: 0.6 }),
    mobile: faker.helpers.maybe(() => faker.phone.number(), { probability: 0.8 }),
    email: faker.helpers.maybe(() => faker.internet.email(), { probability: 0.7 }),
    nic: faker.helpers.maybe(() => faker.string.alphanumeric(13), { probability: 0.7 }),
    address: faker.helpers.maybe(() => faker.location.streetAddress(), { probability: 0.6 }),
    type: faker.helpers.arrayElement(Object.keys(boardMemberTypes)),
    status: faker.helpers.arrayElement(Object.keys(boardMemberStatuses)),
    created_at: faker.date.past().toISOString(),
    updated_at: faker.date.recent().toISOString(),
    created_by: faker.person.fullName(),
    updated_by: faker.person.fullName()
  };
});

