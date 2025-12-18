/**
 * Mock Data for Review Meetings Module
 */

import { faker } from '@faker-js/faker';
import { mockAdminDepartments } from './adminDepartments';

export interface ReviewMeeting {
  id: number;
  subject: string;
  discussion: string;
  date: string;
  number_of_discussed_decisions: number;
  number_of_updated_decisions: number;
  participants: string;
  departments: number[];
  images?: string[];
  created_at: string;
  updated_at: string;
  creator_name?: string;
  editor_name?: string;
}

// Generate mock review meetings
export const mockReviewMeetings: ReviewMeeting[] = Array.from({ length: 40 }, (_, index) => {
  const departmentIds = faker.helpers.arrayElements(
    mockAdminDepartments.map(d => d.id),
    { min: 1, max: 5 }
  );

  return {
    id: index + 1,
    subject: faker.lorem.sentences(2),
    discussion: faker.lorem.paragraphs(2),
    date: faker.date.past().toISOString().split('T')[0],
    number_of_discussed_decisions: faker.number.int({ min: 5, max: 50 }),
    number_of_updated_decisions: faker.number.int({ min: 0, max: 30 }),
    participants: faker.lorem.sentence(),
    departments: departmentIds,
    images: faker.helpers.maybe(() => Array.from({ length: faker.number.int({ min: 0, max: 3 }) }, () => 
      faker.image.url()
    ), { probability: 0.5 }),
    created_at: faker.date.past().toISOString(),
    updated_at: faker.date.recent().toISOString(),
    creator_name: faker.person.fullName(),
    editor_name: faker.person.fullName()
  };
});
