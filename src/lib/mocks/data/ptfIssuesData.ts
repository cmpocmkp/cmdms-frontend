/**
 * Mock Data for PTF Issues
 */

import { faker } from '@faker-js/faker';
import { mockDepartments } from './departments';

export interface PTFPriority {
  id: number;
  title: string;
  color: string;
}

export interface PTFSource {
  id: number;
  title: string;
}

export interface PTFAssignment {
  id: number;
  department_id: number;
  department: {
    id: number;
    name: string;
  };
  latestResponse?: {
    remarks: string;
    type_text: string;
    created_at: string;
    attachments: string[] | null;
  };
  histories?: PTFHistory[];
}

export interface PTFHistory {
  id: number;
  department: {
    id: number;
    name: string;
  };
  userCreatedBy: {
    id: number;
    name: string;
  };
  type?: number; // 0: Initial Response, 1: Final Response, 2: Comment
  type_text: string;
  remarks: string;
  attachments: string[] | null;
  created_at: string;
}

export interface PTFIssue {
  id: number;
  id_text: string;
  issue: string;
  way_forward: string;
  status: number; // 0: Pending, 1: Open/Approved, 2: Not Approved, 3: Completed
  status_text: string;
  decision: string | null;
  timeline: string | null;
  sector: string | null;
  attachment: string | null;
  department_id: number;
  department: {
    id: number;
    name: string;
  };
  priority: PTFPriority;
  source: PTFSource;
  suggestedDepartments: Array<{ id: number; name: string }>;
  assignedTo: PTFAssignment[];
  created_by: number;
  userCreatedBy: {
    id: number;
    name: string;
  };
  created_at: string;
  histories: PTFHistory[];
  responses: PTFHistory[];
  meetings: Array<{
    id: number;
    meeting: {
      id: number;
      meeting_code_text: string;
    };
  }>;
}

const mockPriorities: PTFPriority[] = [
  { id: 1, title: 'High', color: '#E74039' },
  { id: 2, title: 'Medium', color: '#F8C146' },
  { id: 3, title: 'Low', color: '#0E8160' }
];

const mockSources: PTFSource[] = [
  { id: 1, title: 'CM Office' },
  { id: 2, title: 'Department' },
  { id: 3, title: 'Public Complaint' },
  { id: 4, title: 'Meeting' }
];

// Cache for consistent data across calls
let cachedIssues: PTFIssue[] | null = null;

// Generate mock PTF issues with full details
export function generateMockPTFIssues(status?: number | null, type?: string | null, district?: number | null): PTFIssue[] {
  // Generate base issues if not cached
  if (!cachedIssues) {
    cachedIssues = [];
    const issueCount = 50; // Fixed count for consistent data
    
    const filteredDepartments = mockDepartments.filter(d => d.department_type_id === 1);
    
    for (let i = 0; i < issueCount; i++) {
      // Use seeded random for consistent data
      faker.seed(i + 1);
      
      const issueStatus = faker.helpers.arrayElement([0, 1, 2, 3]);
      const hasDecision = issueStatus === 1 ? faker.datatype.boolean({ probability: 0.6 }) : false;
      const hasTimeline = issueStatus === 1 ? faker.datatype.boolean({ probability: 0.8 }) : false;
      
      let timeline: string | null = null;
      if (hasTimeline) {
        timeline = faker.datatype.boolean() 
          ? faker.date.future().toISOString().split('T')[0]
          : faker.date.past().toISOString().split('T')[0];
      }
      
      const dept = filteredDepartments[i % filteredDepartments.length] || filteredDepartments[0];
      const suggestedDeptIds = faker.helpers.arrayElements(
        mockDepartments.filter(d => d.id !== dept.id),
        { min: 1, max: 3 }
      ).map(d => d.id);
      
      const suggestedDepts = mockDepartments
        .filter(d => suggestedDeptIds.includes(d.id))
        .map(d => ({ id: Number(d.id), name: d.name }));
      
      const assignedDepts = faker.helpers.arrayElements(suggestedDepts, { min: 0, max: suggestedDepts.length });
      
      const statusTexts: Record<number, string> = {
        0: 'Pending',
        1: 'Open',
        2: 'Rejected',
        3: 'Completed'
      };
      
      cachedIssues.push({
        id: i + 1,
        id_text: `Issue-${i + 1}`,
        issue: faker.lorem.paragraph({ min: 2, max: 5 }),
        way_forward: faker.lorem.paragraph({ min: 1, max: 3 }),
        status: issueStatus,
        status_text: statusTexts[issueStatus],
        decision: hasDecision ? faker.lorem.sentence({ min: 5, max: 10 }) : null,
        timeline,
        sector: faker.helpers.arrayElement(['Education', 'Health', 'Infrastructure', 'Agriculture', 'Finance', null]),
        attachment: faker.datatype.boolean({ probability: 0.3 }) ? `attachment_${i + 1}.pdf` : null,
        department_id: Number(dept.id),
        department: {
          id: Number(dept.id),
          name: dept.name
        },
        priority: faker.helpers.arrayElement(mockPriorities),
        source: faker.helpers.arrayElement(mockSources),
        suggestedDepartments: suggestedDepts,
        assignedTo: assignedDepts.map((dept, idx) => {
          const historyCount = faker.number.int({ min: 0, max: 3 });
          const histories = Array.from({ length: historyCount }, (_, histIdx) => {
            const type = histIdx === 0 ? 0 : 1; // 0: Initial, 1: Final
            return {
              id: histIdx + 1,
              department: {
                id: dept.id,
                name: dept.name
              },
              userCreatedBy: {
                id: faker.number.int({ min: 1, max: 10 }),
                name: faker.person.fullName()
              },
              type: type,
              type_text: type === 0 ? 'Initial Response' : 'Final Response',
              remarks: faker.lorem.paragraph({ min: 1, max: 2 }),
              attachments: faker.datatype.boolean({ probability: 0.2 })
                ? [faker.system.fileName({ extensionCount: 1 })]
                : null,
              created_at: faker.date.past().toISOString()
            };
          }).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

          return {
            id: idx + 1,
            department_id: dept.id,
            department: dept,
            latestResponse: histories.length > 0 ? {
              remarks: histories[0].remarks,
              type_text: histories[0].type_text,
              created_at: histories[0].created_at,
              attachments: histories[0].attachments
            } : undefined,
            histories: histories
          };
        }),
        created_by: faker.number.int({ min: 1, max: 10 }),
        userCreatedBy: {
          id: faker.number.int({ min: 1, max: 10 }),
          name: faker.person.fullName()
        },
        created_at: faker.date.past().toISOString(),
        histories: Array.from({ length: faker.number.int({ min: 0, max: 5 }) }, (_, idx) => ({
          id: idx + 1,
          department: {
            id: assignedDepts.length > 0 ? faker.helpers.arrayElement(assignedDepts).id : Number(dept.id),
            name: assignedDepts.length > 0 ? faker.helpers.arrayElement(assignedDepts).name : dept.name
          },
          userCreatedBy: {
            id: faker.number.int({ min: 1, max: 10 }),
            name: faker.person.fullName()
          },
          type_text: faker.helpers.arrayElement(['Initial Response', 'Final Response']),
          remarks: faker.lorem.paragraph(),
          attachments: faker.datatype.boolean({ probability: 0.3 })
            ? [faker.system.fileName({ extensionCount: 1 })]
            : null,
          created_at: faker.date.past().toISOString()
        })),
        responses: Array.from({ length: faker.number.int({ min: 0, max: 3 }) }, (_, idx) => ({
          id: idx + 1,
          department: {
            id: Number(dept.id),
            name: dept.name
          },
          userCreatedBy: {
            id: faker.number.int({ min: 1, max: 10 }),
            name: faker.person.fullName()
          },
          type_text: 'CM Office Response',
          remarks: faker.lorem.paragraph(),
          attachments: faker.datatype.boolean({ probability: 0.3 })
            ? [faker.system.fileName({ extensionCount: 1 })]
            : null,
          created_at: faker.date.past().toISOString()
        })),
        meetings: Array.from({ length: faker.number.int({ min: 0, max: 2 }) }, (_, idx) => ({
          id: idx + 1,
          meeting: {
            id: idx + 1,
            meeting_code_text: `MEET-${faker.string.alphanumeric(6).toUpperCase()}`
          }
        }))
      });
    }
  }
  
  // Start with all cached issues
  let issues = [...cachedIssues];
  
  // Filter by district
  if (district && district !== 0) {
    issues = issues.filter(i => i.department_id === district);
  }
  
  // Filter by status
  if (status !== undefined && status !== null) {
    if (typeof status === 'string' && status === 'no-decision') {
      issues = issues.filter(i => i.decision === null);
    } else {
      const statusNum = typeof status === 'string' ? parseInt(status) : status;
      if (typeof statusNum === 'number') {
        issues = issues.filter(i => i.status === statusNum);
      }
    }
  }
  
  // Filter by type (on target / critically delayed)
  if (type === 'on') {
    const today = new Date().toISOString().split('T')[0];
    issues = issues.filter(i => 
      i.status === 1 && 
      i.timeline !== null && 
      i.timeline > today
    );
  } else if (type === 'off') {
    const today = new Date().toISOString().split('T')[0];
    issues = issues.filter(i => 
      i.status === 1 && 
      i.timeline !== null && 
      i.timeline < today
    );
  }
  
  return issues;
}

// Get single issue by ID
export function getMockPTFIssueById(id: number): PTFIssue | undefined {
  // Ensure cache is populated
  if (!cachedIssues) {
    generateMockPTFIssues();
  }
  return cachedIssues?.find(i => i.id === id);
}
