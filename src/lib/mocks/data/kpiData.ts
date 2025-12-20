/**
 * Mock Data for KPI Data Reports Module
 */

import { faker } from '@faker-js/faker';

export interface KPIUser {
  id: number;
  name: string;
  district_name?: string;
  has_kpi_data: boolean;
}

export interface KPIData {
  id: number;
  description: string;
  name: string;
  users: KPIUser[];
}

// District names
const districtNames = [
  'Peshawar',
  'Mardan',
  'Abbottabad',
  'Swat',
  'Kohat',
  'Bannu',
  'Dera Ismail Khan',
  'Mansehra',
  'Charsadda',
  'Swabi',
  'Nowshera',
  'Haripur',
  'Mingora',
  'Battagram',
  'Upper Dir',
  'Lower Dir',
  'Malakand',
  'Buner',
  'Shangla',
  'Kohistan'
];

// KPI descriptions and names
const kpiDescriptions = [
  'District Coordination',
  'Police Operations',
  'Public Safety',
  'Law Enforcement',
  'Community Policing'
];

const kpiNames = [
  'DC Performance',
  'DPO Operations',
  'Crime Prevention',
  'Public Relations',
  'Emergency Response'
];

// Generate mock KPI data
function generateKPIData(count: number): KPIData[] {
  return Array.from({ length: count }, (_, index) => {
    const userCount = faker.number.int({ min: 5, max: 15 });
    const users: KPIUser[] = Array.from({ length: userCount }, (_, userIdx) => ({
      id: userIdx + 1,
      name: faker.person.fullName(),
      district_name: faker.helpers.arrayElement(districtNames),
      has_kpi_data: faker.datatype.boolean({ probability: 0.7 })
    }));

    return {
      id: index + 1,
      description: faker.helpers.arrayElement(kpiDescriptions),
      name: faker.helpers.arrayElement(kpiNames),
      users
    };
  });
}

// Generate different sets for different time periods
export const mockKPIsData: KPIData[] = generateKPIData(3);
export const mockTodayKPIsData: KPIData[] = generateKPIData(2);
export const mockYesterdayKPIsData: KPIData[] = generateKPIData(2);

// KPI Dashboard Cards Data
export interface KPICard {
  title: string;
  borderColor: string;
  icon: string;
  value: number;
  percent?: number;
  showPercent: boolean;
}

export const mockKPICards: KPICard[] = [
  {
    title: 'Decisions',
    borderColor: '#3282FF',
    icon: 'ti-list',
    value: 0,
    showPercent: false
  },
  {
    title: 'Completed',
    borderColor: '#0E8160',
    icon: 'ti-check',
    value: 0,
    percent: 0,
    showPercent: true
  },
  {
    title: 'On Target',
    borderColor: '#1DC39F',
    icon: 'ti-target',
    value: 0,
    percent: 0,
    showPercent: true
  },
  {
    title: 'On Going',
    borderColor: '#F8C146',
    icon: 'ti-reload',
    value: 0,
    showPercent: false
  },
  {
    title: 'Off Target',
    borderColor: '#E74039',
    icon: 'ti-alert',
    value: 0,
    percent: 0,
    showPercent: true
  },
  {
    title: 'Overdue',
    borderColor: '#FD7E01',
    icon: 'ti-timer',
    value: 0,
    percent: 0,
    showPercent: true
  },
  {
    title: 'Off Target Reason',
    borderColor: '#f3726d',
    icon: 'ti-alert',
    value: 0,
    showPercent: false
  },
  {
    title: 'Overdue Reason',
    borderColor: '#874EFF',
    icon: 'ti-timer',
    value: 0,
    showPercent: false
  }
];
