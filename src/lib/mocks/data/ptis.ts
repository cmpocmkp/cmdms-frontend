/**
 * Mock Data for PTIs KP Module
 * Based on old CMDMS structure
 */

import { faker } from '@faker-js/faker';
import { mockAdminDepartments } from './adminDepartments';

export interface TaskComment {
  id: number;
  content: string;
  status: string | null;
  remarks: string | null;
  other_remarks: string | null;
  reason: string | null;
  created_at: string;
  user: {
    id: number;
    name: string;
    phone: string | null;
    role_id: number;
    department: {
      id: number;
      name: string;
    };
  };
  attachments?: Array<{
    id: number;
    file_path: string;
    file_title: string;
  }>;
  taggedDepartments?: Array<{
    id: number;
    name: string;
  }>;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  progress: string;
  timeline: string;
  attachments?: string[];
  departments: Array<{
    id: number;
    name: string;
    pivot: {
      status: string;
      progress?: string;
    };
  }>;
  pti?: {
    id: number;
    code: string;
    title: string;
  };
  creator?: {
    name: string;
    phone: string;
  };
  updated_at?: string;
  comments?: TaskComment[];
}

export interface PTI {
  id: number;
  code: string; // e.g., "PTI-001"
  title: string;
  description: string; // HTML content
  creator?: {
    name: string;
    phone: string;
  };
  created_at: string;
  updated_at: string;
  tasks?: Task[];
}

// Generate mock PTIs matching old CMDMS structure
export const mockPTIs: PTI[] = Array.from({ length: 25 }, (_, index) => {
  const ptiNumber = String(index + 1).padStart(3, '0');
  return {
    id: index + 1,
    code: `PTI-${ptiNumber}`,
    title: faker.lorem.sentence({ min: 5, max: 10 }),
    description: `<p>${faker.lorem.paragraphs(2, '</p><p>')}</p>`,
    creator: faker.helpers.maybe(() => ({
      name: faker.person.fullName(),
      phone: faker.phone.number('+92-###-#######')
    }), { probability: 0.8 }),
    created_at: faker.date.past().toISOString(),
    updated_at: faker.date.recent().toISOString(),
    tasks: []
  };
});

// Add tasks to most PTIs with real department assignments
// Generate tasks for 20 out of 25 PTIs to ensure good data coverage
const ptiIndicesWithTasks = Array.from({ length: 20 }, (_, i) => i);
let globalTaskId = 1;

ptiIndicesWithTasks.forEach(index => {
  if (mockPTIs[index]) {
    const pti = mockPTIs[index];
    const taskCount = faker.number.int({ min: 3, max: 8 }); // More tasks per PTI
    pti.tasks = Array.from({ length: taskCount }, () => {
      // Assign to 1-4 random departments from mockAdminDepartments
      // Use more departments to ensure better distribution
      const assignedDepts = faker.helpers.arrayElements(mockAdminDepartments, { 
        min: 1, 
        max: 4 
      });
      
      // Helper function to get weighted random status
      const getWeightedStatus = (): string => {
        const statusWeights = [
          { status: 'Completed', weight: 0.3 },
          { status: 'On Target', weight: 0.3 },
          { status: 'Off Target', weight: 0.15 },
          { status: 'Overdue', weight: 0.15 },
          { status: 'Pending', weight: 0.1 }
        ];
        
        const random = Math.random();
        let cumulativeWeight = 0;
        for (const { status, weight } of statusWeights) {
          cumulativeWeight += weight;
          if (random <= cumulativeWeight) {
            return status;
          }
        }
        return 'Pending';
      };
      
      return {
        id: globalTaskId++,
        title: faker.lorem.sentence({ min: 4, max: 8 }),
        description: `<p>${faker.lorem.paragraphs(1, '</p><p>')}</p>`,
        progress: `<p>${faker.lorem.sentences(faker.number.int({ min: 1, max: 3 }))}</p>`,
        timeline: faker.date.future({ years: 1 }).toISOString(),
        attachments: faker.helpers.maybe(() => {
          const numAttachments = faker.number.int({ min: 1, max: 3 });
          const extensions = ['pdf', 'docx', 'xlsx', 'jpg'];
          return Array.from({ length: numAttachments }, () => 
            `${faker.system.fileName()}.${faker.helpers.arrayElement(extensions)}`
          );
        }, { probability: 0.5 }) || undefined,
        departments: assignedDepts.map(dept => ({
          id: dept.id,
          name: dept.name,
          pivot: {
            status: getWeightedStatus(), // Each department gets independent status
            progress: faker.helpers.maybe(() => faker.lorem.sentence(), { probability: 0.6 })
          }
        })),
        pti: {
          id: pti.id,
          code: pti.code,
          title: pti.title
        }
      };
    });
  }
});

// Helper function to get all tasks flattened from all PTIs
export const getAllTasks = (): Task[] => {
  return mockPTIs.flatMap(pti => 
    (pti.tasks || []).map(task => ({
      ...task,
      pti: task.pti || {
        id: pti.id,
        code: pti.code,
        title: pti.title
      }
    }))
  );
};

// Helper function to get task by ID
export const getTaskById = (taskId: number): Task | null => {
  for (const pti of mockPTIs) {
    const task = pti.tasks?.find(t => t.id === taskId);
    if (task) {
      return {
        ...task,
        pti: task.pti || {
          id: pti.id,
          code: pti.code,
          title: pti.title
        },
        creator: pti.creator,
        updated_at: pti.updated_at
      };
    }
  }
  return null;
};

// Generate mock comments for tasks
export const generateMockTaskComments = (taskId: number, departmentId: number): TaskComment[] => {
  const commentCount = faker.number.int({ min: 0, max: 5 });
  const comments: TaskComment[] = [];
  
  for (let i = 0; i < commentCount; i++) {
    const isAdmin = faker.helpers.maybe(() => true, { probability: 0.3 });
    const dept = mockAdminDepartments.find(d => d.id === departmentId) || mockAdminDepartments[0];
    
    comments.push({
      id: taskId * 1000 + i + 1,
      content: `<p>${faker.lorem.paragraphs(faker.number.int({ min: 1, max: 3 }), '</p><p>')}</p>`,
      status: faker.helpers.maybe(() => faker.helpers.arrayElement(['1', '2', '3', '4', '8']), { probability: 0.7 }) || null,
      remarks: faker.helpers.maybe(() => faker.helpers.arrayElement(['Adminstration', 'Legal', 'Financial']), { probability: 0.2 }) || null,
      other_remarks: faker.helpers.maybe(() => faker.lorem.paragraph(), { probability: 0.3 }) || null,
      reason: faker.helpers.maybe(() => faker.lorem.paragraph(), { probability: 0.2 }) || null,
      created_at: faker.date.past().toISOString(),
      user: {
        id: i + 1,
        name: faker.person.fullName(),
        phone: faker.helpers.maybe(() => faker.phone.number('+92-###-#######'), { probability: 0.7 }) || null,
        role_id: isAdmin ? faker.helpers.arrayElement([1, 3]) : 2, // 1=Admin, 2=Department, 3=DataEntry
        department: {
          id: isAdmin ? 1 : dept.id,
          name: isAdmin ? 'Administration' : dept.name
        }
      },
      attachments: faker.helpers.maybe(() => {
        const numAttachments = faker.number.int({ min: 1, max: 2 });
        return Array.from({ length: numAttachments }, (_, idx) => ({
          id: (taskId * 1000 + i + 1) * 10 + idx + 1,
          file_path: `attachments/${faker.system.fileName()}.${faker.helpers.arrayElement(['pdf', 'docx', 'xlsx'])}`,
          file_title: faker.system.fileName()
        }));
      }, { probability: 0.4 }),
      taggedDepartments: faker.helpers.maybe(() => {
        const numTagged = faker.number.int({ min: 1, max: 2 });
        return faker.helpers.arrayElements(mockAdminDepartments.slice(0, 10), { min: 1, max: numTagged }).map(d => ({
          id: d.id,
          name: d.name
        }));
      }, { probability: 0.3 })
    });
  }
  
  return comments.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
};
