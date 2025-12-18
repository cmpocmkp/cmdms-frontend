/**
 * Mock Data for Candidates Module
 */

import { faker } from '@faker-js/faker';
import { schemeMockDistricts } from './schemes';

export interface Candidate {
  id: number;
  name: string;
  district_id: number;
  district_name: string;
  party_id?: number;
  party_name?: string;
  constituency_id?: number;
  constituency_name?: string;
  position: string;
  area?: string;
  division?: string;
  phone?: string;
  mobile?: string;
  email?: string;
  nic?: string;
  address?: string;
  created_at: string;
  updated_at: string;
}

// Generate mock candidates (extending the ones from annualSchemes but with more details)
export const mockCandidatesDetailed: Candidate[] = Array.from({ length: 100 }, (_, index) => {
  const district = faker.helpers.arrayElement(schemeMockDistricts);
  
  return {
    id: index + 1,
    name: faker.person.fullName(),
    district_id: district.id,
    district_name: district.name,
    party_id: faker.number.int({ min: 1, max: 10 }),
    party_name: faker.company.name() + ' Party',
    constituency_id: faker.number.int({ min: 1, max: 50 }),
    constituency_name: `NA-${faker.number.int({ min: 1, max: 50 })}`,
    position: faker.helpers.arrayElement(['MNA', 'MPA', 'MNA/MPA']),
    area: faker.location.city(),
    division: faker.location.county(),
    phone: faker.phone.number(),
    mobile: faker.phone.number(),
    email: faker.internet.email(),
    nic: faker.string.numeric(13),
    address: faker.location.streetAddress(),
    created_at: faker.date.past().toISOString(),
    updated_at: faker.date.recent().toISOString()
  };
});
