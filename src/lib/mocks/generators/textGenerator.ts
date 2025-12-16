// Text Generation Utilities for Mock Data

import { faker } from '@faker-js/faker';

/**
 * Generate government-appropriate title
 */
export function generateTitle(type: string): string {
  const prefixes = {
    meeting: ['Discussion on', 'Review of', 'Meeting regarding', 'Session on', 'Conference on'],
    directive: ['Implementation of', 'Execution of', 'Directive regarding', 'Instructions for'],
    announcement: ['Announcement regarding', 'Notice on', 'Circular on', 'Information about'],
    remark: ['CM Remarks on', 'Observation regarding', 'Comments on', 'Feedback on'],
    initiative: ['Initiative for', 'Programme for', 'Project on', 'Scheme for'],
  };
  
  const topics = [
    'Infrastructure Development',
    'Healthcare Services',
    'Education Sector Improvements',
    'Agricultural Development',
    'Public Transportation',
    'Environmental Protection',
    'Revenue Collection',
    'Digital Transformation',
    'Law and Order',
    'Social Welfare Programmes',
    'Youth Empowerment',
    'Women Development',
    'District Administration',
    'Budget Allocation',
    'Development Schemes',
    'Public Service Delivery',
    'Capacity Building',
    'Good Governance',
    'Anti-Corruption Measures',
    'Emergency Response',
  ];
  
  const prefix = prefixes[type as keyof typeof prefixes] || ['Matter regarding'];
  const topic = topics[Math.floor(Math.random() * topics.length)];
  const selectedPrefix = prefix[Math.floor(Math.random() * prefix.length)];
  
  return `${selectedPrefix} ${topic}`;
}

/**
 * Generate reference number
 */
export function generateReferenceNumber(prefix: string): string {
  const year = new Date().getFullYear();
  const number = String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0');
  return `${prefix}/${year}/${number}`;
}

/**
 * Generate realistic government description
 */
export function generateDescription(type: string): string {
  const templates = {
    meeting: [
      'This meeting was convened to discuss the progress of ongoing development projects and to address challenges faced by the implementing departments.',
      'The session focused on reviewing the implementation status of previous decisions and formulating strategies for effective service delivery.',
      'Discussion held regarding the allocation of resources and timelines for completion of pending tasks across various departments.',
    ],
    directive: [
      'All concerned departments are directed to ensure timely implementation of the mentioned activities and submit progress reports on a monthly basis.',
      'It is instructed that the assigned departments shall coordinate with relevant stakeholders and complete the designated tasks within the stipulated timeframe.',
      'Departments are required to take immediate action on the subject matter and report back with detailed progress updates.',
    ],
    announcement: [
      'This circular is issued to inform all departments about the new policy guidelines and to ensure compliance across all levels.',
      'It is hereby announced that the following procedures have been updated and shall be implemented with immediate effect.',
      'All departments are requested to take note of the attached instructions and ensure their implementation in letter and spirit.',
    ],
  };
  
  const template = templates[type as keyof typeof templates];
  if (template) {
    return template[Math.floor(Math.random() * template.length)];
  }
  
  return faker.lorem.paragraph(3);
}

/**
 * Generate CM Remark text
 */
export function generateCmRemark(): string {
  const remarks = [
    'The Chief Minister has taken serious note of the delays in project implementation and directed immediate action to expedite the work.',
    'CM directed that all stakeholders should be taken on board and a comprehensive plan should be submitted within one week.',
    'The Chief Minister emphasized the need for improved coordination among departments and timely completion of all pending tasks.',
    'CM instructed that quality assurance measures should be strictly followed and regular monitoring should be ensured.',
    'The Chief Minister expressed concern over the slow progress and directed the concerned department to submit a detailed action plan.',
  ];
  
  return remarks[Math.floor(Math.random() * remarks.length)];
}

/**
 * Generate reply text
 */
export function generateReply(status: string): string {
  const replies = {
    pending: [
      'The matter is under review by the department. Detailed response will be submitted shortly.',
      'We have received the directive and are in the process of gathering relevant information.',
      'The department is examining the matter and will submit a comprehensive reply soon.',
    ],
    in_progress: [
      'Work is in progress as per the given instructions. Progress report is attached for review.',
      'The department has initiated action on the subject. Current status and challenges are being documented.',
      'Implementation is underway. Regular updates will be provided as work progresses.',
    ],
    completed: [
      'The task has been completed as per the directive. Final report is attached for your perusal.',
      'All required actions have been taken and the work has been successfully completed.',
      'The department has completed the assigned work. Completion certificate is attached.',
    ],
  };
  
  const categoryReplies = replies[status as keyof typeof replies] || replies.in_progress;
  return categoryReplies[Math.floor(Math.random() * categoryReplies.length)];
}

/**
 * Generate department-appropriate name
 */
export function generateDepartmentUser(departmentName: string): string {
  const positions = [
    'Secretary',
    'Additional Secretary',
    'Deputy Secretary',
    'Section Officer',
    'Assistant Director',
    'Director',
  ];
  
  const position = positions[Math.floor(Math.random() * positions.length)];
  return `${position}, ${departmentName}`;
}

/**
 * Generate file name
 */
export function generateFileName(type: string): string {
  const types = {
    pdf: ['Report', 'Document', 'Brief', 'Summary', 'Analysis', 'Proposal'],
    doc: ['Letter', 'Notice', 'Memo', 'Minutes', 'Directive'],
    xlsx: ['Data', 'Statistics', 'Report', 'Analysis', 'Summary'],
  };
  
  const names = types[type as keyof typeof types] || types.pdf;
  const name = names[Math.floor(Math.random() * names.length)];
  const date = faker.date.recent({ days: 30 }).toISOString().split('T')[0];
  
  return `${name}_${date}.${type}`;
}

/**
 * Generate email from name and department
 */
export function generateEmail(name: string, department: string): string {
  const cleanName = name.toLowerCase().replace(/\s+/g, '.');
  const cleanDept = department.toLowerCase().replace(/\s+/g, '').substring(0, 10);
  return `${cleanName}@${cleanDept}.gov.pk`;
}

/**
 * Generate phone number (Pakistan format)
 */
export function generatePhone(): string {
  const prefixes = ['0300', '0301', '0302', '0303', '0321', '0331', '0333', '0334', '0345'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const number = String(Math.floor(Math.random() * 10000000)).padStart(7, '0');
  return `${prefix}${number}`;
}

/**
 * Generate Urdu text (placeholder - actual Urdu can be added)
 */
export function generateUrduText(type: 'title' | 'description' = 'description'): string {
  // Placeholder - in real implementation, add actual Urdu text
  if (type === 'title') {
    return 'عنوان کی مثال';
  }
  return 'یہ ایک نمونہ متن ہے جو اردو میں ہے۔ اصل نظام میں مناسب اردو متن استعمال کیا جائے گا۔';
}

