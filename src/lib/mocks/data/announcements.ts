/**
 * Mock Data for Announcements Module
 */

import { faker } from '@faker-js/faker';

export interface Announcement {
  id: number;
  district_id: number;
  district_name: string;
  venue: string;
  date: string;
  announcements_count: number;
  completed_count: number;
  pending_count: number;
  created_at: string;
  updated_at: string;
}

export interface AnnouncementDetail {
  id: number;
  announcement_id: number;
  subject: string;
  description: string;
  department_id: number;
  department_name: string;
  status: string;
  timeline?: string;
  created_at: string;
}

// Mock districts for announcements
const mockDistricts = [
  { id: 1, name: 'Peshawar' },
  { id: 2, name: 'Mardan' },
  { id: 3, name: 'Swat' },
  { id: 4, name: 'Abbottabad' },
  { id: 5, name: 'Mansehra' },
  { id: 6, name: 'Kohat' },
  { id: 7, name: 'Bannu' },
  { id: 8, name: 'D.I.Khan' },
  { id: 9, name: 'Malakand' },
  { id: 10, name: 'Haripur' }
];

// Generate mock announcements
export const mockAnnouncements: Announcement[] = Array.from({ length: 40 }, (_, index) => {
  const district = faker.helpers.arrayElement(mockDistricts);
  const announcementsCount = faker.number.int({ min: 5, max: 25 });
  const completedCount = faker.number.int({ min: 0, max: announcementsCount });

  return {
    id: index + 1,
    district_id: district.id,
    district_name: district.name,
    venue: faker.location.streetAddress() + ', ' + district.name,
    date: faker.date.between({ from: '2024-01-01', to: '2025-01-01' }).toISOString().split('T')[0],
    announcements_count: announcementsCount,
    completed_count: completedCount,
    pending_count: announcementsCount - completedCount,
    created_at: faker.date.past().toISOString(),
    updated_at: faker.date.recent().toISOString()
  };
});

// Generate mock announcement details
export const mockAnnouncementDetails: AnnouncementDetail[] = Array.from({ length: 200 }, (_, index) => ({
  id: index + 1,
  announcement_id: faker.number.int({ min: 1, max: 40 }),
  subject: faker.lorem.sentence(),
  description: faker.lorem.paragraphs(2),
  department_id: faker.number.int({ min: 1, max: 30 }),
  department_name: faker.company.name() + ' Department',
  status: faker.helpers.arrayElement(['Completed', 'Pending', 'In Progress']),
  timeline: faker.helpers.maybe(() => faker.date.future().toISOString().split('T')[0], { probability: 0.8 }),
  created_at: faker.date.past().toISOString()
}));
