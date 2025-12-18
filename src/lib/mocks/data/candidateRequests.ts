/**
 * Mock Data for Candidate Requests (MNA/MPA Requests) Module
 */

import { faker } from '@faker-js/faker';
import { mockOfficers } from './officers';
import { mockCandidates } from './annualSchemes';
import { mockOfficerDepartments } from './officerDepartments';

export interface CandidateRequest {
  id: number;
  officer_id: number;
  current_designation: string;
  proposed_designation: string;
  current_department: number;
  proposed_department: number;
  current_scale: string;
  proposed_scale: string;
  candidate_id: number;
  date: string;
  remarks: string;
  status: string;
  approved_date?: string;
  created_at: string;
  updated_at: string;
}

// Request statuses
export const candidateRequestStatuses: Record<string, string> = {
  '1': 'Pending',
  '2': 'Approved',
  '3': 'Rejected',
  '4': 'Under Review'
};

// Generate BPS scales - matching old CMDMS officerScales() function
// Old CMDMS returns [7,9,11,12,14,15,16,17,18,19,20,21,22]
const bpsScaleNumbers = [7, 9, 11, 12, 14, 15, 16, 17, 18, 19, 20, 21, 22];

// Generate mock candidate requests
export const mockCandidateRequests: CandidateRequest[] = Array.from({ length: 60 }, (_, index) => {
  const officer = faker.helpers.arrayElement(mockOfficers);
  const candidate = faker.helpers.arrayElement(mockCandidates);
  const currentDept = faker.helpers.arrayElement(mockOfficerDepartments);
  const proposedDept = faker.helpers.arrayElement(mockOfficerDepartments.filter(d => d.id !== currentDept.id));

  return {
    id: index + 1,
    officer_id: officer.id,
    current_designation: officer.designation,
    proposed_designation: faker.person.jobTitle(),
    current_department: currentDept.id,
    proposed_department: proposedDept.id,
    current_scale: officer.scale,
    proposed_scale: `BPS-${faker.helpers.arrayElement(bpsScaleNumbers)}`,
    candidate_id: candidate.id,
    date: faker.date.past().toISOString().split('T')[0],
    remarks: faker.lorem.paragraph(),
    status: faker.helpers.arrayElement(Object.keys(candidateRequestStatuses)),
    approved_date: faker.helpers.maybe(() => faker.date.past().toISOString().split('T')[0], { probability: 0.3 }),
    created_at: faker.date.past().toISOString(),
    updated_at: faker.date.recent().toISOString()
  };
});
