/**
 * Mock Data for Annual Schemes Module
 */

import { faker } from '@faker-js/faker';
import { schemeCategories, schemeTypes, schemeMockDistricts } from './schemes';

// Approval Status enum
export const approvalStatuses: Record<string, string> = {
  '1': 'Approved',
  '2': 'Pending',
  '3': 'Rejected'
};

// Approval Forum enum
export const approvalForums: Record<string, string> = {
  '1': 'Cabinet',
  '2': 'ECNEC',
  '3': 'PDWP',
  '4': 'DDWP',
  '5': 'Other'
};

// Scheme Status enum
export const schemeStatuses: Record<string, string> = {
  '1': 'Active',
  '2': 'Completed',
  '3': 'Suspended',
  '4': 'Under Review'
};

export interface AnnualScheme {
  id: number;
  serial_no: number;
  code: string;
  name: string;
  sub_sector_id: number;
  sub_sector_name: string;
  sector_name: string;
  category: string;
  type: string;
  approval_forum: string;
  approval_date: string;
  is_approved: string;
  start_year?: number;
  end_year?: number;
  status: string;
  is_quantifiable: boolean;
  financial_progress?: string;
  physical_progress?: string;
  districts: number[];
  costs?: Cost[];
  expenditures?: Expenditure[];
  allocations?: Allocation[];
  throughForwards?: ThroughForward[];
  schemeRevisions?: SchemeRevision[];
  fundDistributions?: FundDistribution[];
  created_at: string;
  updated_at: string;
}

export interface Cost {
  id: number;
  annual_scheme_id: number;
  local: number;
  foreign: number;
  year: number;
  created_at: string;
  updated_at: string;
}

export interface Expenditure {
  id: number;
  annual_scheme_id: number;
  expenditure_upto_june: number;
  year: number;
  created_at: string;
  updated_at: string;
}

export interface Allocation {
  id: number;
  annual_scheme_id: number;
  capital: number;
  revenue: number;
  total: number;
  foreign: number;
  year: number;
  created_at: string;
  updated_at: string;
}

export interface ThroughForward {
  id: number;
  annual_scheme_id: number;
  amount: number;
  year: number;
  created_at: string;
  updated_at: string;
}

export interface SchemeRevision {
  id: number;
  annual_scheme_id: number;
  revision_number: number;
  revised_date: string;
  notes?: string;
  new_end_year?: number;
  created_at: string;
  updated_at: string;
}

export interface Candidate {
  id: number;
  name: string;
  constituency: string;
  district: string;
  created_at: string;
  updated_at: string;
}

export interface FundDistribution {
  id: number;
  annual_scheme_id: number;
  candidate_id: number;
  candidate_name: string;
  candidate_constituency: string;
  candidate_district: string;
  allocated_fund: number;
  quantity?: number;
  remarks?: string;
  is_approved: boolean;
  status: string;
  status_remarks?: string;
  created_at: string;
  updated_at: string;
}

// Mock subsectors
const mockSubSectors = [
  { id: 1, name: 'Education', sector_id: 1, sector_name: 'Social Sector' },
  { id: 2, name: 'Health', sector_id: 1, sector_name: 'Social Sector' },
  { id: 3, name: 'Infrastructure', sector_id: 2, sector_name: 'Infrastructure' },
  { id: 4, name: 'Agriculture', sector_id: 3, sector_name: 'Economic Sector' },
  { id: 5, name: 'Energy', sector_id: 2, sector_name: 'Infrastructure' }
];

// Mock candidates
export const mockCandidates: Candidate[] = Array.from({ length: 50 }, (_, index) => {
  const district = faker.helpers.arrayElement(schemeMockDistricts);
  return {
    id: index + 1,
    name: faker.person.fullName(),
    constituency: `NA-${faker.number.int({ min: 1, max: 50 })}`,
    district: district.name,
    created_at: faker.date.past().toISOString(),
    updated_at: faker.date.recent().toISOString()
  };
});

// Generate mock annual schemes
export const mockAnnualSchemes: AnnualScheme[] = Array.from({ length: 50 }, (_, index) => {
  const subSector = faker.helpers.arrayElement(mockSubSectors);
  // Ensure schemeMockDistricts is available and has items
  const availableDistricts = schemeMockDistricts && schemeMockDistricts.length > 0 
    ? schemeMockDistricts 
    : [{ id: 1, name: 'Peshawar' }]; // Fallback
  const districts = faker.helpers.arrayElements(availableDistricts, { min: 1, max: Math.min(5, availableDistricts.length) }).map(d => d.id);
  
  return {
    id: index + 1,
    serial_no: index + 1,
    code: `AS-${faker.string.alphanumeric(6).toUpperCase()}`,
    name: faker.lorem.sentences(2),
    sub_sector_id: subSector.id,
    sub_sector_name: subSector.name,
    sector_name: subSector.sector_name,
    category: faker.helpers.arrayElement(Object.keys(schemeCategories)) as string,
    type: faker.helpers.arrayElement(Object.keys(schemeTypes)) as string,
    approval_forum: faker.helpers.arrayElement(Object.keys(approvalForums)) as string,
    approval_date: faker.date.past().toISOString().split('T')[0],
    is_approved: faker.helpers.arrayElement(Object.keys(approvalStatuses)) as string,
    start_year: faker.number.int({ min: 2020, max: 2025 }),
    end_year: faker.number.int({ min: 2025, max: 2030 }),
    status: faker.helpers.arrayElement(Object.keys(schemeStatuses)) as string,
    is_quantifiable: faker.datatype.boolean(),
    financial_progress: faker.lorem.paragraph(),
    physical_progress: faker.lorem.paragraph(),
    districts,
    created_at: faker.date.past().toISOString(),
    updated_at: faker.date.recent().toISOString()
  };
});

// Generate mock costs, expenditures, allocations, etc. for schemes
mockAnnualSchemes.forEach((scheme) => {
  scheme.costs = Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, (_, idx) => ({
    id: scheme.id * 100 + idx + 1,
    annual_scheme_id: scheme.id,
    local: faker.number.float({ min: 10, max: 1000, fractionDigits: 3 }),
    foreign: faker.number.float({ min: 0, max: 500, fractionDigits: 3 }),
    year: faker.number.int({ min: 2020, max: 2025 }),
    created_at: faker.date.past().toISOString(),
    updated_at: faker.date.recent().toISOString()
  }));

  scheme.expenditures = Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, (_, idx) => ({
    id: scheme.id * 100 + idx + 1,
    annual_scheme_id: scheme.id,
    expenditure_upto_june: faker.number.float({ min: 0, max: 500, fractionDigits: 3 }),
    year: faker.number.int({ min: 2020, max: 2025 }),
    created_at: faker.date.past().toISOString(),
    updated_at: faker.date.recent().toISOString()
  }));

  scheme.allocations = Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, (_, idx) => ({
    id: scheme.id * 100 + idx + 1,
    annual_scheme_id: scheme.id,
    capital: faker.number.float({ min: 10, max: 500, fractionDigits: 3 }),
    revenue: faker.number.float({ min: 10, max: 500, fractionDigits: 3 }),
    total: faker.number.float({ min: 20, max: 1000, fractionDigits: 3 }),
    foreign: faker.number.float({ min: 0, max: 300, fractionDigits: 3 }),
    year: faker.number.int({ min: 2020, max: 2025 }),
    created_at: faker.date.past().toISOString(),
    updated_at: faker.date.recent().toISOString()
  }));

  scheme.throughForwards = Array.from({ length: faker.number.int({ min: 0, max: 2 }) }, (_, idx) => ({
    id: scheme.id * 100 + idx + 1,
    annual_scheme_id: scheme.id,
    amount: faker.number.float({ min: 0, max: 200, fractionDigits: 3 }),
    year: faker.number.int({ min: 2020, max: 2025 }),
    created_at: faker.date.past().toISOString(),
    updated_at: faker.date.recent().toISOString()
  }));

  scheme.schemeRevisions = Array.from({ length: faker.number.int({ min: 0, max: 2 }) }, (_, idx) => ({
    id: scheme.id * 100 + idx + 1,
    annual_scheme_id: scheme.id,
    revision_number: idx + 1,
    revised_date: faker.date.past().toISOString().split('T')[0],
    notes: faker.lorem.sentence(),
    new_end_year: faker.number.int({ min: 2025, max: 2030 }),
    created_at: faker.date.past().toISOString(),
    updated_at: faker.date.recent().toISOString()
  }));

  // Generate fund distributions for some schemes
  if (Math.random() > 0.5) {
    scheme.fundDistributions = Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, (_, idx) => {
      const candidate = faker.helpers.arrayElement(mockCandidates);
      return {
        id: scheme.id * 100 + idx + 1,
        annual_scheme_id: scheme.id,
        candidate_id: candidate.id,
        candidate_name: candidate.name,
        candidate_constituency: candidate.constituency,
        candidate_district: candidate.district,
        allocated_fund: faker.number.float({ min: 1, max: 100, fractionDigits: 3 }),
        quantity: scheme.is_quantifiable ? faker.number.int({ min: 1, max: 1000 }) : undefined,
        remarks: faker.lorem.sentence(),
        is_approved: faker.datatype.boolean(),
        status: faker.helpers.arrayElement(['1', '2', '3']), // Distributed, Reverted, Other
        status_remarks: faker.lorem.sentence(),
        created_at: faker.date.past().toISOString(),
        updated_at: faker.date.recent().toISOString()
      };
    });
  }
});

export { mockSubSectors };
