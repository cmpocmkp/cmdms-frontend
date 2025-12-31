/**
 * Mock Data for Directives Module
 * Realistic dummy data for testing
 */

import { mockDepartments } from './departments';

export interface MockDirective {
  id: number;
  subject: string;
  comments?: string;
  progress?: string;
  letter_no: string;
  date: string;
  timeline: string;
  status: number | string; // Support both for compatibility
  department_ids?: number[];
  departments: {
    id: number;
    name: string;
    status?: number | string; // Support both for compatibility
    remarks?: string;
    replies?: Array<{
      id: number;
      reply_detail: string;
      attachments?: string[];
      status?: number | string;
      remarks?: string;
      overdue_reason?: string;
      created_at: string;
    }>;
  }[];
  attachments?: string[];
  is_archived: boolean;
  created_at: string;
  updated_at: string;
  creator_name?: string;
  meeting_type_id?: number;
}

// Realistic directive subjects
const directiveSubjects = [
  'Implementation of Digital Payment System in Government Departments',
  'Establishment of Complaint Redressal Mechanism at District Level',
  'Modernization of Land Record Management System',
  'Strengthening of Primary Healthcare Facilities in Rural Areas',
  'Implementation of E-Governance Initiatives',
  'Improvement of Water Supply Infrastructure',
  'Enhancement of Educational Facilities in Remote Areas',
  'Development of Tourism Infrastructure',
  'Strengthening of Disaster Management System',
  'Implementation of Green Energy Projects',
  'Modernization of Agriculture Sector',
  'Improvement of Road Infrastructure',
  'Enhancement of Public Transport System',
  'Development of IT Parks and Technology Hubs',
  'Strengthening of Law and Order Situation',
  'Implementation of Social Welfare Programs',
  'Improvement of Sanitation and Waste Management',
  'Development of Sports Facilities',
  'Enhancement of Women Empowerment Programs',
  'Strengthening of Financial Management System',
  'Implementation of Climate Change Adaptation Measures',
  'Improvement of Irrigation System',
  'Development of Industrial Zones',
  'Enhancement of Food Security Programs',
  'Strengthening of Revenue Collection System'
];

// Realistic progress comments
const progressComments = [
  'Initial planning phase completed. Budget allocation approved. Tender documents prepared.',
  'Project implementation in progress. 60% of work completed. Expected to meet timeline.',
  'Facing delays due to administrative issues. Requesting extension of timeline.',
  'All milestones achieved on time. Final documentation in progress.',
  'Procurement process completed. Implementation started. Regular monitoring in place.',
  'Technical team deployed. Site survey completed. Awaiting approval for next phase.',
  'Budget constraints causing delays. Alternative funding sources being explored.',
  'Project progressing smoothly. All stakeholders on board. Regular reviews conducted.',
  'Some challenges encountered but being addressed. Revised timeline shared with stakeholders.',
  'Excellent progress. Ahead of schedule. Quality checks ongoing.',
  'Coordination issues with multiple departments. Working on resolution.',
  'Resource mobilization completed. Field work initiated. Regular updates being provided.',
  'Legal clearances obtained. Implementation phase started. Monitoring mechanism established.',
  'Delays due to weather conditions. Revised schedule prepared.',
  'All targets met. Final phase in progress. Completion expected soon.'
];

// Helper to get random item from array
const getRandomItem = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

// Helper to get random items from array
const getRandomItems = <T>(arr: T[], count: number): T[] => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, arr.length));
};

// Helper to generate date string
const getDateString = (daysOffset: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  return date.toISOString().split('T')[0];
};

// Generate realistic directives
export const mockDirectives: MockDirective[] = [];

// Create 50 directives with realistic data
for (let i = 1; i <= 50; i++) {
  // Select 1-3 random departments
  const selectedDepts = getRandomItems(mockDepartments.filter(d => d.department_type_id === 1), Math.floor(Math.random() * 3) + 1);
  
  // Determine status distribution: 40% Completed, 35% On Target, 25% Overdue
  const statusRand = Math.random();
  const status = statusRand < 0.4 ? 1 : statusRand < 0.75 ? 2 : 3;
  
  // Generate departments with their own statuses
  const departments = selectedDepts.map((dept) => {
    // Each department can have a different status
    const deptStatusRand = Math.random();
    const deptStatus = deptStatusRand < 0.4 ? 1 : deptStatusRand < 0.75 ? 2 : 3;
    
    // Generate 0-3 replies for each department
    const replyCount = Math.floor(Math.random() * 4);
    const replies = Array.from({ length: replyCount }, (_, rIdx) => {
      const replyStatusRand = Math.random();
      const replyStatus = replyStatusRand < 0.4 ? 1 : replyStatusRand < 0.75 ? 2 : 3;
      
      return {
        id: rIdx + 1,
        reply_detail: `<p>${getRandomItem(progressComments)}</p>`,
        attachments: Math.random() > 0.7 ? [`document-${rIdx + 1}.pdf`, `report-${rIdx + 1}.xlsx`] : undefined,
        status: replyStatus,
        remarks: undefined, // Can not be completed status (8) would have remarks, but we're using 1,2,3 only
        overdue_reason: [3, 6, 9].includes(replyStatus) ? 'Facing resource constraints and coordination issues with other departments.' : undefined,
        created_at: getDateString(-(replyCount - rIdx) * 7).split('T')[0] + 'T10:00:00.000Z'
      };
    });
    
    return {
      id: dept.id,
      name: dept.name,
      status: deptStatus,
      remarks: Math.random() > 0.4 ? 'Regular monitoring and follow-up in place.' : undefined,
      replies
    };
  });
  
  // Generate dates
  const dateDaysAgo = Math.floor(Math.random() * 180); // Within last 6 months
  const timelineDays = Math.floor(Math.random() * 90) + 30; // 30-120 days from now
  
  // Determine if directive has progress comments
  const hasProgress = Math.random() > 0.3;
  const comments = hasProgress ? getRandomItem(progressComments) : undefined;
  
  // Determine if directive has attachments
  const hasAttachments = Math.random() > 0.5;
  const attachments = hasAttachments 
    ? Array.from({ length: Math.floor(Math.random() * 3) + 1 }, (_, _idx) => `directive-${i}-attachment-${_idx + 1}.pdf`)
    : undefined;
  
  // Generate letter number
  const year = new Date().getFullYear();
  const letterNo = `DIR/${year}/${String(i).padStart(4, '0')}`;
  
  mockDirectives.push({
    id: i,
    subject: getRandomItem(directiveSubjects),
    comments: comments,
    progress: comments,
    letter_no: letterNo,
    date: getDateString(-dateDaysAgo),
    timeline: getDateString(timelineDays),
    status: status,
    department_ids: departments.map(d => Number(d.id)),
    departments: departments.map(d => ({
      id: Number(d.id),
      name: d.name,
      status: d.status,
      remarks: d.remarks,
      replies: d.replies
    })),
    attachments: attachments,
    is_archived: Math.random() > 0.9,
    created_at: getDateString(-dateDaysAgo) + 'T09:00:00.000Z',
    updated_at: getDateString(-Math.floor(dateDaysAgo / 2)) + 'T14:30:00.000Z',
    creator_name: Math.random() > 0.3 ? 'Chief Minister Office' : 'Secretary General Administration',
    meeting_type_id: Math.floor(Math.random() * 3) + 1
  });
}

// Calculate summary statistics
const calculateSummary = () => {
  let total = 0;
  let completed = 0;
  let onTarget = 0;
  let overdue = 0;
  
  mockDirectives.forEach(directive => {
    directive.departments.forEach(dept => {
      total++;
      const deptStatus = dept.status || directive.status;
      if (deptStatus === 1 || deptStatus === 'Completed' || String(deptStatus) === '1') {
        completed++;
      } else if (deptStatus === 2 || deptStatus === 'On Target' || String(deptStatus) === '2') {
        onTarget++;
      } else if (deptStatus === 3 || deptStatus === 'Overdue' || String(deptStatus) === '3') {
        overdue++;
      }
    });
  });
  
  return {
    total,
    'Completed': {
      count: completed,
      percent: total > 0 ? Math.round((completed / total) * 100 * 100) / 100 : 0
    },
    'On Target': {
      count: onTarget,
      percent: total > 0 ? Math.round((onTarget / total) * 100 * 100) / 100 : 0
    },
    'Overdue': {
      count: overdue,
      percent: total > 0 ? Math.round((overdue / total) * 100 * 100) / 100 : 0
    }
  };
};

// Mock status summary
export const mockDirectivesSummary = calculateSummary();
