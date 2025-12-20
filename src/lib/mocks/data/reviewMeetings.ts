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

// Realistic review meeting subjects
const reviewMeetingSubjects = [
  'Quarterly Progress Review Meeting',
  'Department Performance Review',
  'Project Status Review Meeting',
  'Budget Review and Planning Meeting',
  'Implementation Review Session',
  'Progress Assessment Meeting',
  'Strategic Review Meeting',
  'Monthly Review and Planning',
  'Annual Performance Review',
  'Decision Implementation Review'
];

// Realistic discussions
const discussions = [
  'Discussed progress on ongoing projects and reviewed implementation status of key decisions.',
  'Reviewed departmental performance metrics and identified areas for improvement.',
  'Assessed project timelines and resource allocation for upcoming quarter.',
  'Evaluated budget utilization and discussed financial planning for next phase.',
  'Reviewed implementation status of cabinet decisions and identified bottlenecks.',
  'Discussed strategic initiatives and their progress across various departments.',
  'Assessed compliance with directives and reviewed action items from previous meetings.',
  'Evaluated project deliverables and discussed resource requirements.',
  'Reviewed performance indicators and discussed strategies for improvement.',
  'Assessed progress on key initiatives and planned next steps.'
];

// Realistic participants
const participants = [
  'Chief Minister, Secretaries, Department Heads',
  'CM, Additional Chief Secretary, All Department Secretaries',
  'Chief Minister, Planning & Development Secretary, Finance Secretary',
  'CM, ACS, Secretaries of Health, Education, and Finance',
  'Chief Minister, All Administrative Secretaries',
  'CM, Development Secretary, All Department Heads',
  'Chief Minister, Chief Secretary, Principal Secretaries',
  'CM, Finance Secretary, Planning Secretary, Department Representatives',
  'Chief Minister, All Secretaries, District Coordination Officers',
  'CM, ACS, Secretaries, and Department Directors'
];

// Generate mock review meetings with realistic data
export const mockReviewMeetings: ReviewMeeting[] = Array.from({ length: 40 }, (_, index) => {
  const departmentIds = faker.helpers.arrayElements(
    mockAdminDepartments.map(d => d.id),
    { min: 1, max: 5 }
  );

  return {
    id: index + 1,
    subject: faker.helpers.arrayElement(reviewMeetingSubjects),
    discussion: faker.helpers.arrayElement(discussions),
    date: faker.date.between({ from: '2024-01-01', to: '2025-12-31' }).toISOString().split('T')[0],
    number_of_discussed_decisions: faker.number.int({ min: 5, max: 50 }),
    number_of_updated_decisions: faker.number.int({ min: 0, max: 30 }),
    participants: faker.helpers.arrayElement(participants),
    departments: departmentIds,
    images: faker.helpers.maybe(() => Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, () => 
      faker.image.url({ width: 150, height: 150 })
    ), { probability: 0.6 }),
    created_at: faker.date.past().toISOString(),
    updated_at: faker.date.recent().toISOString(),
    creator_name: faker.person.fullName(),
    editor_name: faker.person.fullName()
  };
});
