/**
 * Mock Data for Board Meetings Module
 */

import { faker } from '@faker-js/faker';
import { mockDepartments } from './departments';

export interface Board {
  id: number;
  name: string;
  boardMeetings: BoardMeeting[];
}

export interface BoardMeeting {
  id: number;
  subject: string;
  date: string;
  department_id: number;
  is_upcoming: boolean;
  attachments: string[] | null;
  total_agenda_points: number;
  implemented_agenda: number;
  pending_agenda: number;
  agendaPoints: AgendaPoint[];
}

export interface AgendaPoint {
  id: number;
  board_meeting_id: number;
  item: string;
  decision: string;
  comments: string;
  responsibility: string;
  timeline: string;
  status: string; // 'Implemented' or 'Pending'
  replies: BoardReply[];
  attachments?: string[];
  creator?: {
    name: string;
    phone: string;
  };
  boardMeeting: {
    id: number;
    subject: string;
  };
}

export interface BoardReply {
  id: number;
  reply_detail: string;
  status: string | null;
  attachments: string[] | null;
  tag_departments: number[] | null;
  created_at: string;
  user: {
    id: number;
    name: string;
    phone: string | null;
    role_id: number;
  };
  department: {
    id: number;
    name: string;
  };
}

// Generate mock board meetings data
let cachedBoards: Board[] | null = null;

export function generateMockBoardMeetings(departmentId: number): Board[] {
  if (cachedBoards) {
    return cachedBoards.filter(board => 
      board.boardMeetings.some(meeting => 
        meeting.agendaPoints.some(point => 
          point.replies.some(reply => 
            reply.department.id === departmentId
          )
        )
      )
    );
  }
  
  cachedBoards = [];
  const boardNames = [
    'Board of Directors',
    'Executive Board',
    'Advisory Board',
    'Management Board',
    'Supervisory Board'
  ];
  
  for (let boardIndex = 0; boardIndex < 3; boardIndex++) {
    const board: Board = {
      id: boardIndex + 1,
      name: boardNames[boardIndex],
      boardMeetings: []
    };
    
    // Generate 3-5 meetings per board
    const meetingCount = faker.number.int({ min: 3, max: 5 });
    for (let meetingIndex = 0; meetingIndex < meetingCount; meetingIndex++) {
      faker.seed(boardIndex * 10 + meetingIndex);
      
      const agendaPointsCount = faker.number.int({ min: 5, max: 15 });
      const implementedCount = faker.number.int({ min: 0, max: agendaPointsCount });
      const pendingCount = agendaPointsCount - implementedCount;
      
      const dept = faker.helpers.arrayElement(mockDepartments);
      const meeting: BoardMeeting = {
        id: boardIndex * 10 + meetingIndex + 1,
        subject: faker.lorem.sentence({ min: 5, max: 10 }),
        date: faker.date.between({ from: '2024-01-01', to: '2025-12-31' }).toISOString().split('T')[0],
        department_id: typeof dept.id === 'number' ? dept.id : Number(dept.id),
        is_upcoming: faker.datatype.boolean({ probability: 0.3 }),
        attachments: faker.datatype.boolean({ probability: 0.6 }) 
          ? [`${faker.system.fileName()}.pdf`] 
          : null,
        total_agenda_points: agendaPointsCount,
        implemented_agenda: implementedCount,
        pending_agenda: pendingCount,
        agendaPoints: []
      };
      
      // Generate agenda points
      for (let pointIndex = 0; pointIndex < agendaPointsCount; pointIndex++) {
        const isImplemented = pointIndex < implementedCount;
        const status = isImplemented ? 'Implemented' : 'Pending';
        
        const agendaPoint: AgendaPoint = {
          id: meeting.id * 100 + pointIndex + 1,
          board_meeting_id: meeting.id,
          item: faker.lorem.sentence({ min: 8, max: 15 }),
          decision: faker.lorem.paragraph({ min: 2, max: 4 }),
          comments: faker.lorem.paragraph({ min: 1, max: 3 }),
          responsibility: faker.helpers.arrayElement(mockDepartments).name,
          timeline: faker.date.future({ years: 1 }).toISOString().split('T')[0],
          status,
          replies: [],
          creator: {
            name: faker.person.fullName(),
            phone: faker.phone.number()
          },
          boardMeeting: {
            id: meeting.id,
            subject: meeting.subject
          }
        };
        
        // Generate replies for some agenda points
        if (faker.datatype.boolean({ probability: 0.7 })) {
          const replyCount = faker.number.int({ min: 1, max: 4 });
          for (let replyIndex = 0; replyIndex < replyCount; replyIndex++) {
            const dept = faker.helpers.arrayElement(mockDepartments);
            const reply: BoardReply = {
              id: agendaPoint.id * 10 + replyIndex + 1,
              reply_detail: faker.lorem.paragraph({ min: 2, max: 5 }),
              status: replyIndex === replyCount - 1 ? status : null,
              attachments: faker.datatype.boolean({ probability: 0.4 })
                ? [`${faker.system.fileName()}.pdf`]
                : null,
              tag_departments: faker.datatype.boolean({ probability: 0.5 })
                ? faker.helpers.arrayElements(mockDepartments, { min: 1, max: 3 }).map(d => typeof d.id === 'number' ? d.id : Number(d.id))
                : null,
              created_at: faker.date.recent({ days: 30 }).toISOString(),
              user: {
                id: faker.number.int({ min: 1, max: 100 }),
                name: faker.person.fullName(),
                phone: faker.phone.number(),
                role_id: faker.helpers.arrayElement([2, 7]) // Department role
              },
              department: {
                id: typeof dept.id === 'number' ? dept.id : Number(dept.id),
                name: dept.name
              }
            };
            agendaPoint.replies.push(reply);
          }
        }
        
        meeting.agendaPoints.push(agendaPoint);
      }
      
      board.boardMeetings.push(meeting);
    }
    
    cachedBoards.push(board);
  }
  
  return cachedBoards;
}

// Get board meeting by ID
export function getMockBoardMeetingById(meetingId: number): BoardMeeting | undefined {
  if (!cachedBoards) {
    generateMockBoardMeetings(1);
  }
  
  for (const board of cachedBoards || []) {
    const meeting = board.boardMeetings.find(m => m.id === meetingId);
    if (meeting) return meeting;
  }
  
  return undefined;
}

// Get agenda point by ID
export function getMockAgendaPointById(agendaPointId: number): AgendaPoint | undefined {
  if (!cachedBoards) {
    generateMockBoardMeetings(1);
  }
  
  for (const board of cachedBoards || []) {
    for (const meeting of board.boardMeetings) {
      const point = meeting.agendaPoints.find(p => p.id === agendaPointId);
      if (point) return point;
    }
  }
  
  return undefined;
}

// Initialize cached boards if not already done
if (!cachedBoards) {
  generateMockBoardMeetings(1);
}

// Export flat arrays for easier use in components
export const mockBoardMeetings: BoardMeeting[] = (() => {
  const meetings: BoardMeeting[] = [];
  const boards: Board[] = cachedBoards || [];
  for (const board of boards) {
    if (board && board.boardMeetings) {
      meetings.push(...board.boardMeetings);
    }
  }
  return meetings;
})();

export const mockBoardAgendaPoints: AgendaPoint[] = (() => {
  const points: AgendaPoint[] = [];
  const boards: Board[] = cachedBoards || [];
  for (const board of boards) {
    if (board && board.boardMeetings) {
      for (const meeting of board.boardMeetings) {
        points.push(...meeting.agendaPoints);
      }
    }
  }
  return points;
})();
