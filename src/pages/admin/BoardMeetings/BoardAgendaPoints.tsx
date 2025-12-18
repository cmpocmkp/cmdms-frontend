/**
 * Board Agenda Points - Admin Module
 * EXACT replica of admin/boardmeetings/agenda-points.blade.php from old CMDMS
 */

import { Link, useParams } from 'react-router-dom';
import { mockBoardMeetings, mockBoardAgendaPoints } from '../../../lib/mocks/data/boardMeetings';

// Badge mapping for status
const getBadgeClass = (status: string) => {
  const badgesWithStatus: Record<string, string> = {
    'Implemented': 'success',
    'Pending': 'danger',
    'Other': 'warning'
  };
  return badgesWithStatus[status] || 'secondary';
};

export default function BoardAgendaPoints() {
  const { meetingId } = useParams<{ boardId: string; meetingId: string }>();
  const meeting = mockBoardMeetings.find(m => m.id === Number(meetingId));
  
  // Filter agenda points for this meeting
  const agendaPoints = mockBoardAgendaPoints.filter(ap => ap.board_meeting_id === Number(meetingId));

  if (!meeting) {
    return (
      <div className="content-wrapper">
        <div className="alert alert-danger">Meeting not found</div>
      </div>
    );
  }

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
          table#directive-listing td p {
            width: 200px !important;
          }
          table#directive-listing {
            width: 100% !important;
          }
          table#directive-listing td div p {
            width: 200px !important;
          }
          table#directive-listing th {
            padding: 10px !important;
          }
        `}
      </style>
      <div className="card">
        <div className="card-body">
          <div className="row">
            <div className="col-md-12">
              <h4 style={{ float: 'left' }} className="card-title">
                All agenda points of meeting
              </h4>
              <div style={{ marginBottom: '10px' }} className="btn-toolbar pull-right">
                <div className="btn-group">
                  {agendaPoints.length > 0 && (
                    <>
                      <Link
                        to={`/admin/boardmeetings/show/${meeting.department_id}`}
                        className="btn btn-md btn-inverse-dark btn-fw"
                        style={{ float: 'right' }}
                        title="Show all boards"
                      >
                        <i className="ti-layers-alt text-primary mr-1"></i>Show all meetings
                      </Link>
                      <Link
                        to={`/admin/agendapoints/add?meeting=${meeting.id}`}
                        style={{ padding: '0.3rem 1rem' }}
                        className="btn btn-md btn-inverse-dark btn-fw"
                        role="button"
                        title="Add new agenda"
                      >
                        <i className="ti-plus text-primary mr-1"></i>Add agenda points
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              {agendaPoints.length > 0 && (
                <>
                  <p>
                    <strong className="text-success">Subject: </strong>
                    <strong>{meeting.subject}</strong>
                  </p>
                  <p>
                    <strong className="text-success">Date: </strong>
                    {formatDate(meeting.date)}
                  </p>
                  <p>
                    <Link
                      to={`/admin/boardmeetings/edit/${meeting.id}`}
                      className="btn btn-md btn-inverse-dark btn-fw"
                      title="Edit Meeting"
                    >
                      <i className="ti-pencil-alt text-primary mr-1"></i>edit meeting
                    </Link>
                  </p>
                </>
              )}
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <div className="table-responsive">
                <table id="directive-listing" className="table-striped" role="grid">
                  <thead>
                    <tr>
                      <th style={{ width: '10px' }}>S.NO</th>
                      <th style={{ width: '200px' }}>Agenda Item</th>
                      <th style={{ width: '200px' }}>Decision</th>
                      <th style={{ width: '200px' }}>Progress</th>
                      <th style={{ width: '200px' }}>Responsibility</th>
                      <th style={{ width: '200px' }}>Timeline</th>
                      <th style={{ width: '105px' }}>Status</th>
                      <th style={{ width: '100px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {agendaPoints.length > 0 ? (
                      agendaPoints.map((agendapoint, index) => (
                        <tr key={agendapoint.id}>
                          <td style={{ width: '10px', textAlign: 'center' }}>{index + 1}</td>
                          <td style={{ width: '200px' }}>
                            <div dangerouslySetInnerHTML={{ __html: agendapoint.item }} />
                          </td>
                          <td style={{ width: '200px' }}>
                            <div dangerouslySetInnerHTML={{ __html: agendapoint.decision }} />
                          </td>
                          <td style={{ width: '200px' }}>
                            <div dangerouslySetInnerHTML={{ __html: agendapoint.comments }} />
                          </td>
                          <td style={{ width: '200px' }}>
                            <div dangerouslySetInnerHTML={{ __html: agendapoint.responsibility }} />
                          </td>
                          <td style={{ width: '200px' }}>
                            {agendapoint.timeline ? formatDate(agendapoint.timeline) : ''}
                          </td>
                          <td style={{ width: '105px' }}>
                            <label
                              style={{ width: '105px' }}
                              className={`badge badge-${getBadgeClass(agendapoint.status)} badge-pill`}
                            >
                              {agendapoint.status ?? ''}
                            </label>
                          </td>
                          <td>
                            <Link
                              style={{ float: 'left', marginLeft: '20px' }}
                              className="agendapoint_id text-primary mr-2"
                              to={`/admin/agendapoints/edit/${agendapoint.id}`}
                              title="edit"
                            >
                              <i className="ti-pencil-alt icon-sm"></i>
                            </Link>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <Link
                              to={`/admin/replies/board/agenda-point/${agendapoint.id}`}
                              title="Progress replies"
                              style={{ padding: '0.3rem 1rem', marginBottom: '8px' }}
                              className="btn btn-primary btn-lg active"
                              role="button"
                              aria-pressed="true"
                            >
                              Progress so far
                            </Link>
                            <form
                              action="#"
                              method="POST"
                              style={{ float: 'left', marginLeft: '20px' }}
                              onSubmit={(e) => {
                                e.preventDefault();
                                if (confirm('Are you sure to delete?')) {
                                  console.log('Delete agenda point:', agendapoint.id);
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
                      ))
                    ) : (
                      <tr>
                        <td colSpan={10}>There are no data.</td>
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

