/**
 * Show Board Meeting - Admin Module
 * EXACT replica of admin/boardmeetings/show.blade.php from old CMDMS
 */

import { Link, useParams } from 'react-router-dom';
import { mockBoardMeetings, mockBoardAgendaPoints } from '../../../lib/mocks/data/boardMeetings';
import { mockAdminDepartments } from '../../../lib/mocks/data/adminDepartments';

export default function ShowBoardMeeting() {
  const { id } = useParams<{ id: string }>();
  const boardId = Number(id);
  
  // Filter meetings for this board
  const boardMeetings = mockBoardMeetings.filter(m => m.department_id === boardId);
  const board = mockAdminDepartments.find(d => d.id === boardId);

  // Format date as 'd/m/Y'
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="content-wrapper">
      <style>
        {`
          table#directive-listing {
            width: 100% !important;
          }
          table#directive-listing td p {
            width: 300px !important;
          }
          table#directive-listing th {
            padding: 10px !important;
          }
          table#directive-listing td {
            padding: 10px !important;
          }
        `}
      </style>
      <div className="card">
        <div className="card-body">
          <div className="row">
            <div className="col-md-12">
              <h4 style={{ float: 'left' }} className="card-title">
                All Board Meetings of <strong className="text-success">{board?.name || ''}</strong>
              </h4>
              <div style={{ marginBottom: '10px' }} className="btn-toolbar pull-right">
                <div className="btn-group">
                  <Link
                    to="/admin/boardmeetings"
                    className="btn btn-md btn-inverse-dark btn-fw"
                    style={{ float: 'right' }}
                  >
                    <i className="ti-layers-alt text-primary mr-1"></i>Show all boards
                  </Link>
                  <Link
                    to="/admin/boardmeetings/add"
                    style={{ padding: '0.3rem 1rem' }}
                    className="btn btn-md btn-inverse-dark btn-fw"
                    role="button"
                  >
                    <i className="ti-plus text-primary mr-1"></i>Add new board meeting
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-12">
              <div className="table-responsive">
                <table id="directive-listing" className="table-striped" role="grid">
                  <thead>
                    <tr>
                      <th>S.NO</th>
                      <th>Meeting Date</th>
                      <th>Meeting Subject</th>
                      <th>Atttached Document<small>(s)</small></th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {boardMeetings.length > 0 ? (
                      boardMeetings.map((meeting, index) => {
                        // Check if meeting has agenda points
                        const hasAgendaPoints = mockBoardAgendaPoints.some(ap => ap.board_meeting_id === meeting.id);

                        return (
                          <tr key={meeting.id}>
                            <td>{index + 1}</td>
                            <td>{formatDate(meeting.date)}</td>
                            <td>
                              <div dangerouslySetInnerHTML={{ __html: meeting.subject }} />
                            </td>
                            <td>
                              {meeting.attachments && meeting.attachments.length > 0 ? (
                                meeting.attachments.map((file, idx) => (
                                  <span key={idx} style={{ display: 'block', marginBottom: '5px' }}>
                                    <a
                                      href="#"
                                      title="click to download attach file"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        console.log('Download attachment:', file);
                                      }}
                                    >
                                      Attachment:<i className="ti-file"></i>
                                    </a>
                                  </span>
                                ))
                              ) : (
                                <>&nbsp;</>
                              )}
                            </td>
                            <td>
                              {!hasAgendaPoints ? (
                                <>
                                  <Link
                                    style={{ float: 'left', marginLeft: '10px' }}
                                    className="boardmeeting_agenda_points_id text-primary mr-2"
                                    to={`/admin/agendapoints/add?meeting=${meeting.id}`}
                                    title="All Agenda Points"
                                  >
                                    Add Agenda Point
                                  </Link>
                                  &nbsp;&nbsp;&nbsp;&nbsp;
                                </>
                              ) : (
                                <>
                                  <Link
                                    style={{ float: 'left', marginLeft: '10px' }}
                                    className="boardmeeting_agenda_points_id text-primary mr-2"
                                    to={`/admin/boardmeetings/${boardId}/agenda-points/${meeting.id}`}
                                    title="All Agenda Points"
                                  >
                                    View Agenda Points
                                  </Link>
                                  &nbsp;&nbsp;&nbsp;&nbsp;
                                </>
                              )}
                              <Link
                                style={{ float: 'left', marginLeft: '20px' }}
                                className="boardmeeting_id text-primary mr-2"
                                to={`/admin/boardmeetings/edit/${meeting.id}`}
                                title="edit"
                              >
                                <i className="ti-pencil-alt icon-sm"></i>
                              </Link>
                              <form
                                action="#"
                                method="POST"
                                style={{ float: 'left', marginLeft: '20px' }}
                                onSubmit={(e) => {
                                  e.preventDefault();
                                  if (confirm('Are you sure to delete?')) {
                                    console.log('Delete board meeting:', meeting.id);
                                    alert('Delete functionality will be implemented with backend API');
                                  }
                                }}
                              >
                                <button
                                  type="submit"
                                  className="btn btn-danger btn-icon-text"
                                  title="delete"
                                >
                                  <i className="ti-trash icon-sm"></i>
                                </button>
                              </form>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={10}>There is no data.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

