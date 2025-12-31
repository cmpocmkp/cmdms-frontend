/**
 * Department Board Meetings List Page
 * EXACT replica of department/boardmeetings/index.blade.php from old CMDMS
 * Structure, classes, and behavior preserved exactly
 */

import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { generateMockBoardMeetings } from '../../lib/mocks/data/boardMeetings';
import { useMemo } from 'react';

export default function BoardMeetingsList() {
  const { user } = useAuth();
  
  // Get board meetings for the current department
  const boards = useMemo(() => {
    if (!user?.department?.id) return [];
    const departmentId = typeof user.department.id === 'number' 
      ? user.department.id 
      : Number(user.department.id);
    return generateMockBoardMeetings(departmentId);
  }, [user?.department?.id]);
  
  // Helper function to format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };
  
  return (
    <div className="content-wrapper">
      <style>{`
        .select2-container--default .select2-selection--single .select2-selection__arrow {
          height: 26px !important;
          position: absolute !important;
          top: 10px !important;
          right: 10px !important;
          width: unset !important;
        }
        table.record-note-listing {
          width: 100% !important;
        }
        .record-note-listing td {
          vertical-align: top !important;
          font-size: 16px !important;
          min-height: 35px !important;
          border: 0.5px solid #dfdddd !important;
          color: #49525a !important;
          text-align: center !important;
        }
        .record-note-listing td ul li {
          font-size: 16px !important;
        }
        .record-note-listing th {
          border: 0.5px solid #dfdddd !important;
          text-align: center;
          padding: 15px;
        }
        .record-note-listing td div, u, b, p {
          width: 100% !important;
        }
        .card-body p {
          font-size: 16px;
        }
        .badge.badge-pill {
          font-size: 12px !important;
        }
        table.related_department_table {
          width: 100% !important;
        }
        .related_department_table td {
          border: 1px solid silver;
          font-size: 16px !important;
          margin: 5px !important;
        }
        .related_department_table td p {
          width: 200px !important;
        }
        .related_department_table td div {
          width: 200px !important;
        }
        .related_department_table td ul li {
          font-size: 16px !important;
        }
        .related_department_table th {
          border: 1px solid silver;
          text-align: center;
          height: 35px;
        }
        table.dataTable tbody td.d-decision {
          word-break: break-word !important;
          width: 200px !important;
        }
        .table th, .jsgrid .jsgrid-table th, .table td, .jsgrid .jsgrid-table td {
          padding: 10px !important;
        }
        .record-note-listing td ul li {
          font-size: 16px !important;
        }
        .record-note-listing tr {
          height: 20px !important;
        }
        h5 {
          font-size: 16px !important;
        }
      `}</style>
      
      <div className="card">
        <div className="card-body">
          <h4>{user?.department?.name ?? ''} - Boards Meetings</h4>
          
          {boards.map((board) => (
            <div key={board.id}>
              <h5>{board.name}</h5>
              
              <table className="record-note-listing table table-bordered">
                <thead style={{ background: 'rgb(37, 136, 95)', color: 'white' }}>
                  <tr>
                    <th>S.NO</th>
                    <th>Date</th>
                    <th>Subject</th>
                    <th>Uploaded Board Minutes</th>
                    <th>Total Board Agenda Points</th>
                    <th>Implemented</th>
                    <th>Pending</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {board.boardMeetings.map((meeting, index) => (
                    <tr key={meeting.id}>
                      <td>{index + 1}</td>
                      <td>{formatDate(meeting.date)}</td>
                      <td>
                        <span dangerouslySetInnerHTML={{ __html: meeting.subject }}></span>
                      </td>
                      <td>
                        {meeting.attachments && meeting.attachments.length > 0 ? (
                          <a 
                            href={`/storage/board_meeting_uploads/${meeting.attachments[0]}`} 
                            download
                          >
                            Download
                          </a>
                        ) : (
                          'N/A'
                        )}
                      </td>
                      <td>{meeting.total_agenda_points}</td>
                      <td>{meeting.implemented_agenda}</td>
                      <td>{meeting.pending_agenda}</td>
                      <td>
                        <Link 
                          to={`/department/board-meetings/${meeting.id}/agenda-points`}
                        >
                          All Agenda Points
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

