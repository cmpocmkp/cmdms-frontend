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

// KPI Column interface for filter pages
export interface KPIColumn {
  id: number;
  name: string;
  kpi?: {
    id: number;
    name: string;
  };
}

// KPI Data Entry interface for filter pages
export interface KPIDataEntry {
  id: number;
  user_id: number;
  district_id?: number;
  district?: {
    id: number;
    name: string;
  };
  kpi_column_id: number;
  value: string | number;
  created_at: string;
}

// Generate mock KPI columns for DC/DPO
export function generateMockKPIColumns(count: number = 5): KPIColumn[] {
  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    name: faker.helpers.arrayElement([
      'Total Cases',
      'Resolved Cases',
      'Pending Cases',
      'Response Time',
      'Public Satisfaction',
      'Crime Rate',
      'Arrest Rate',
      'Clearance Rate'
    ]),
    kpi: {
      id: index + 1,
      name: faker.helpers.arrayElement([
        'DC Performance',
        'DPO Operations',
        'Crime Prevention',
        'Public Relations',
        'Emergency Response'
      ])
    }
  }));
}

// Generate specific DPOs KPI columns matching old CMDMS
export function generateDPOsKPIColumns(): KPIColumn[] {
  return [
    // Offences KPI columns
    { id: 1, name: 'Abduction', kpi: { id: 1, name: 'Offences' } },
    { id: 2, name: 'Child lifting', kpi: { id: 1, name: 'Offences' } },
    { id: 3, name: 'Asslt: on police', kpi: { id: 1, name: 'Offences' } },
    { id: 4, name: 'Docaity', kpi: { id: 1, name: 'Offences' } },
    { id: 5, name: 'Robbery', kpi: { id: 1, name: 'Offences' } },
    { id: 6, name: 'Burglary', kpi: { id: 1, name: 'Offences' } },
    { id: 7, name: 'Theft', kpi: { id: 1, name: 'Offences' } },
    { id: 8, name: 'Car lifting', kpi: { id: 1, name: 'Offences' } },
    { id: 9, name: 'M cycle theft', kpi: { id: 1, name: 'Offences' } },
    { id: 10, name: 'M cycle snatching', kpi: { id: 1, name: 'Offences' } },
    { id: 11, name: 'Others/misc', kpi: { id: 1, name: 'Offences' } },
    // Campaign against drug KPI columns
    { id: 12, name: 'Drug Campaign No. of Registered Cases', kpi: { id: 2, name: 'Campaign against drug' } },
    { id: 13, name: 'Drug Campaign Accused Arrested', kpi: { id: 2, name: 'Campaign against drug' } },
    { id: 14, name: 'Drug Campaign Charas (KGS)', kpi: { id: 2, name: 'Campaign against drug' } },
    { id: 15, name: 'Heroin (KGS)', kpi: { id: 2, name: 'Campaign against drug' } },
    { id: 16, name: 'ICE (KGS)', kpi: { id: 2, name: 'Campaign against drug' } },
    { id: 17, name: 'Liquor (KGS)', kpi: { id: 2, name: 'Campaign against drug' } },
    { id: 18, name: 'Drug Campaign Trafficking drugs No. of Cases Registered', kpi: { id: 2, name: 'Campaign against drug' } },
    // Illegal arm/ammunition KPI columns
    { id: 19, name: 'No. of Registe Case Illegal Arr', kpi: { id: 3, name: 'Illegle arm/ammunitic' } },
    { id: 20, name: 'Illegal Arms Recovered', kpi: { id: 3, name: 'Illegle arm/ammunitic' } },
    { id: 21, name: 'Ammunition Recovered', kpi: { id: 3, name: 'Illegle arm/ammunitic' } }
  ];
}

// Generate mock KPI data entries grouped by user
export function generateMockKPIDataEntries(
  userIds: number[],
  columns: KPIColumn[],
  date: string
): Map<number, KPIDataEntry[]> {
  const dataMap = new Map<number, KPIDataEntry[]>();
  
  userIds.forEach((userId, userIndex) => {
    const entries: KPIDataEntry[] = [];
    const districtId = userIndex + 1;
    
    columns.forEach((column, colIndex) => {
      // Not all columns have data for all users
      if (faker.datatype.boolean({ probability: 0.7 })) {
        entries.push({
          id: userIndex * columns.length + colIndex + 1,
          user_id: userId,
          district_id: districtId,
          district: {
            id: districtId,
            name: faker.helpers.arrayElement(districtNames)
          },
          kpi_column_id: column.id,
          value: faker.number.int({ min: 0, max: 1000 }),
          created_at: date
        });
      }
    });
    
    if (entries.length > 0) {
      dataMap.set(userId, entries);
    }
  });
  
  return dataMap;
}

// Mock user groups for departments filter
export interface UserGroup {
  id: number;
  name: string;
}

export const mockUserGroups: UserGroup[] = [
  { id: 1, name: 'Health Department' },
  { id: 2, name: 'Education Department' },
  { id: 3, name: 'Agriculture Department' },
  { id: 4, name: 'Transport Department' },
  { id: 5, name: 'Finance Department' },
  { id: 6, name: 'Planning & Development' },
  { id: 7, name: 'Public Works Department' },
  { id: 8, name: 'Irrigation Department' }
];

// DC Inspection Report Data
export interface DistrictInspectionData {
  id: number;
  name: string;
  kpiData: Array<{
    id: number;
    kpi_id: number;
    value: string | number;
    kpi?: { id: number; name: string };
    kpiColumn?: { id: number; name: string };
  }>;
}

// Generate mock district inspection data
export function generateMockDistrictInspectionData(): DistrictInspectionData[] {
  const districts = districtNames.slice(0, 15); // Use first 15 districts
  
  return districts.map((districtName, index) => {
    const kpiData: DistrictInspectionData['kpiData'] = [];
    
    // KPI IDs: 18 (Adultration), 19 (Spurious), 20 (Price Checking), 21 (Hoarding)
    const kpiIds = [18, 19, 20, 21];
    const columnNames = [
      'Units Inspected',
      'Fine Collected',
      'Warnings Issued',
      'FIR\'s Registered',
      'Units Sealed',
      'No of offences'
    ];
    
    kpiIds.forEach((kpiId, kpiIndex) => {
      // Each KPI has 6 columns - always generate all 6 for consistency
      for (let colIndex = 0; colIndex < 6; colIndex++) {
        kpiData.push({
          id: index * 24 + kpiIndex * 6 + colIndex + 1,
          kpi_id: kpiId,
          value: faker.datatype.boolean({ probability: 0.8 }) 
            ? faker.number.int({ min: 0, max: 500 }) 
            : 0,
          kpi: {
            id: kpiId,
            name: ['Adultration', 'Spurious', 'Price Checking', 'Hoarding'][kpiIndex]
          },
          kpiColumn: {
            id: colIndex + 1,
            name: columnNames[colIndex]
          }
        });
      }
    });
    
    return {
      id: index + 1,
      name: districtName,
      kpiData
    };
  });
}
