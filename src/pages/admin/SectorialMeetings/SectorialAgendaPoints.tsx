/**
 * Sectorial Agenda Points - Admin Module
 * EXACT replica of admin/sectorialmeetings/agenda-points.blade.php from old CMDMS
 */

import { Link, useParams } from 'react-router-dom';
import { mockSectorialMeetings } from '../../../lib/mocks/data/sectorialMeetings';
import { mockAgendaPoints } from '../../../lib/mocks/data/sectorialMeetings';

export default function SectorialAgendaPoints() {
  const { id } = useParams<{ id: string }>();
  const meeting = mockSectorialMeetings.find(m => m.id === Number(id));
  
  // Filter agenda points for this meeting
  const agendaPoints = mockAgendaPoints.filter(ap => ap.meeting_id === Number(id));

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
            width: 100px !important;
          }
          table#directive-listing {
            width: 100% !important;
          }
          table#directive-listing td div p {
            width: 100px !important;
          }
          table#directive-listing th {
            padding: 10px !important;
            border: 0.4px solid silver !important;
          }
          table#directive-listing td {
            vertical-align: top !important;
            padding: 5px !important;
            border: 0.4px solid silver !important;
          }
          table#directive-listing {
            border: 0.5px solid silver !important;
          }
        `}
      </style>
      <div className="card">
        <div className="card-header text-center">
          <div className="d-flex gap-3 justify-content-between align-items-center">
            <div className="flex-grow-1 text-center">
              <p className="block display-4">Agenda points of the meeting</p>
            </div>
            <div>
              <div className="btn-toolbar pull-right">
                <div className="btn-group">
                  <Link
                    to="/admin/sectorialmeetings"
                    className="btn btn-outline-primary btn-fw"
                    style={{ float: 'right' }}
                  >
                    <i className="ti-arrow-left mr-1"></i>Back
                  </Link>
                  <Link
                    to={`/admin/sectorialagendapoints/add?meeting=${id}`}
                    className="btn btn-outline-primary btn-fw"
                    role="button"
                  >
                    <i className="ti-plus mr-1"></i>Add Agenda point
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="card-body">
          {/* Meeting Details Table */}
          <div className="row">
            <div className="col-md-12">
              {agendaPoints.length > 0 && (
                <div className="table-responsive mt-3 mb-2">
                  <table className="table table-bordered table-striped w-100">
                    <tbody>
                      <tr>
                        <th>Meeting Subject</th>
                        <td><strong>{meeting.subject}</strong></td>
                      </tr>
                      <tr>
                        <th>Meeting Date</th>
                        <td>{formatDate(meeting.date)}</td>
                      </tr>
                      <tr>
                        <th>Created At</th>
                        <td>{formatDate(meeting.created_at)}</td>
                      </tr>
                      <tr>
                        <th>Created By</th>
                        <td>{meeting.created_by}</td>
                      </tr>
                      <tr>
                        <th>Updated At</th>
                        <td>{formatDate(meeting.updated_at)}</td>
                      </tr>
                      <tr>
                        <th>Last Updated By</th>
                        <td>{meeting.updated_by}</td>
                      </tr>
                      <tr>
                        <th>Actions</th>
                        <td>
                          <Link
                            to={`/admin/sectorialmeetings/edit/${meeting.id}`}
                            className="btn btn-primary"
                            title="Edit Meeting"
                          >
                            <i className="ti-pencil-alt"></i>
                          </Link>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Agenda Points Table */}
          <div className="row">
            <div className="col-md-12">
              <div className="table-responsive">
                <table
                  id="directive-listing"
                  className="table table-bordered table-condensed dataTable no-footer"
                  role="grid"
                >
                  <thead>
                    <tr>
                      <th style={{ width: '10px' }}>S.NO</th>
                      <th>Timestamp/Identifier</th>
                      <th style={{ width: '150px' }}>Agenda Item</th>
                      <th style={{ width: '150px' }}>Decision</th>
                      <th style={{ width: '150px' }}>Progress</th>
                      <th style={{ width: '200px' }}>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {agendaPoints.length > 0 ? (
                      agendaPoints.map((agendapoint, index) => (
                        <tr key={agendapoint.id}>
                          <td style={{ width: '10px', textAlign: 'center' }}>{index + 1}</td>
                          <td>
                            Created at:{' '}
                            <span className="text-muted">{formatDate(agendapoint.created_at)}</span>
                            <br />
                            <br />
                            Created by: <span className="text-muted">{agendapoint.created_by}</span>
                            <br />
                            <br />
                            Updated at:{' '}
                            <span className="text-muted">{formatDate(agendapoint.updated_at)}</span>
                            <br />
                            <br />
                            Last Updated by: <span className="text-muted">{agendapoint.updated_by}</span>
                          </td>
                          <td style={{ width: '150px' }}>
                            <div dangerouslySetInnerHTML={{ __html: agendapoint.item }} />
                          </td>
                          <td style={{ width: '150px' }}>
                            <div dangerouslySetInnerHTML={{ __html: agendapoint.decision }} />
                          </td>
                          <td style={{ width: '150px' }}>
                            <div dangerouslySetInnerHTML={{ __html: agendapoint.comments }} />
                          </td>
                          <td style={{ width: '200px' }}>
                            {agendapoint.departments && agendapoint.departments.length > 0 ? (
                              <div className="table-responsive mt-2">
                                <table className="table table-striped table-bordered">
                                  <thead style={{ backgroundColor: '#25885F', color: 'white' }}>
                                    <tr>
                                      <th>Department</th>
                                      <th>Status</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {agendapoint.departments.map((department) => (
                                      <tr key={department.id}>
                                        <td
                                          style={{
                                            width: '60%',
                                            backgroundColor: '#e9ecef',
                                            color: '#495057'
                                          }}
                                        >
                                          {department.name}
                                        </td>
                                        <td style={{ width: '100px' }}>
                                          <span className={`badge ${department.status_badge} badge-pill`}>
                                            {department.status}
                                          </span>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            ) : (
                              <span className="text-muted">No related departments</span>
                            )}
                          </td>
                          <td className="text-center">
                            <Link
                              className="agendapoint_id btn btn-primary mb-2 mx-2"
                              to={`/admin/sectorialagendapoints/edit/${agendapoint.id}`}
                              title="Edit Agenda Point"
                            >
                              <i className="ti-pencil-alt icon-sm"></i>
                            </Link>
                            {agendapoint.departments && agendapoint.departments.length > 0 && (
                              <Link
                                to={`/admin/sectorialagendapoints/${agendapoint.id}/related-departments`}
                                title="Related Departments Status"
                                className="btn btn-success mb-2 mx-2"
                                role="button"
                                aria-pressed="true"
                              >
                                <i className="ti-link"></i>
                              </Link>
                            )}
                            <Link
                              to={`/admin/replies/sectorial/agenda-point/${agendapoint.id}`}
                              title="Progress replies"
                              className="btn btn-info mb-2 mx-2"
                              role="button"
                              aria-pressed="true"
                            >
                              <i className="ti-comments"></i>
                            </Link>
                            <form
                              action="#"
                              method="POST"
                              style={{ display: 'inline' }}
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
                                className="btn btn-danger btn-icon-text mx-2"
                                title="Delete Agenda Point"
                              >
                                <i className="ti-trash icon-sm"></i>
                              </button>
                            </form>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="text-center">
                          No agenda points found for this meeting.
                        </td>
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
