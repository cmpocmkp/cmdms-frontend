/**
 * Board Meeting Filter/Search Report
 * EXACT replica of admin/report/boardmeetings/filter_boards
 */

import React, { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { api } from '../../../lib/api';

interface Department {
  id: number;
  name: string;
  boards: Board[];
}

interface Board {
  id: number;
  name: string;
  boardMeetings: BoardMeeting[];
}

interface BoardMeeting {
  id: number;
  subject: string;
  date: string;
  agendaPoints: AgendaPoint[];
}

interface AgendaPoint {
  id: number;
  item: string;
  decision: string;
  progress: string;
  responsibility: string;
  timeline: string;
  status: string;
}

export default function BoardMeetingFilterReport() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [selectedMemberData, setSelectedMemberData] = useState<string>('');

  useEffect(() => {
    // TODO: Replace with actual API call
    // const fetchData = async () => {
    //   try {
    //     const response = await api.get('/admin/report/search/board/meetings', { params: searchParams });
    //     setDepartments(response.data.departments);
    //   } catch (error) {
    //     console.error('Error fetching board meetings:', error);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchData();

    // Dummy data
    const dummyDepartments: Department[] = [
      {
        id: 1,
        name: 'Health Department',
        boards: [
          {
            id: 1,
            name: 'Health Board',
            boardMeetings: [
              {
                id: 1,
                subject: 'Health Board Meeting - Q1 2024',
                date: '2024-01-15',
                agendaPoints: [
                  {
                    id: 1,
                    item: '<p>Review of Health Insurance Scheme</p>',
                    decision: '<p>Approved for continuation</p>',
                    progress: '<p>Implementation in progress</p>',
                    responsibility: '<p>Health Department</p>',
                    timeline: '2024-03-15',
                    status: 'Implemented',
                  },
                  {
                    id: 2,
                    item: '<p>Hospital Upgradation Project</p>',
                    decision: '<p>Tender to be floated</p>',
                    progress: '<p>Pending tender process</p>',
                    responsibility: '<p>Public Works Department</p>',
                    timeline: '2024-04-30',
                    status: 'Pending',
                  },
                ],
              },
              {
                id: 2,
                subject: 'Health Board Meeting - Q2 2024',
                date: '2024-04-20',
                agendaPoints: [
                  {
                    id: 3,
                    item: '<p>Staff Recruitment Plan</p>',
                    decision: '<p>Approved recruitment</p>',
                    progress: '<p>Recruitment process started</p>',
                    responsibility: '<p>Health Department</p>',
                    timeline: '2024-06-30',
                    status: 'Implemented',
                  },
                ],
              },
            ],
          },
        ],
      },
    ];

    setDepartments(dummyDepartments);
    setLoading(false);
  }, [searchParams]);

  const badgesWithStatus: Record<string, string> = {
    success: 'Implemented',
    danger: 'Pending',
    warning: 'Other',
  };

  const getStatusBadgeClass = (status: string): string => {
    if (status === 'Implemented') return 'badge-success';
    if (status === 'Pending') return 'badge-danger';
    return 'badge-warning';
  };

  if (loading) {
    return <div className="text-center p-5">Loading...</div>;
  }

  return (
    <div className="content-wrapper">
      <style>{`
        .related_department_table td {
          border: 1px solid silver !important;
          vertical-align: top !important;
          font-size: 16px !important;
          margin: 5px !important;
        }
        .related_department_table th {
          border: 1px solid silver !important;
          vertical-align: top !important;
          font-size: 16px !important;
          margin: 5px !important;
        }
        table#department_decision_detial_repsort {
          width: 100% !important;
        }
        #department_decision_detial_repsort td {
          border: 1px solid silver;
          vertical-align: top !important;
        }
        #department_decision_detial_repsort td ul li {
          font-size: 16px !important;
        }
        table#department_decision_detial_repsort th, td {
          white-space: normal !important;
        }
        .table th, td {
          white-space: normal !important;
        }
        table.related_department_table {
          width: 100% !important;
        }
        .related_department_table td {
          border: 1px solid silver;
          vertical-align: top !important;
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
        .table th, .jsgrid .jsgrid-table th, .table td, .jsgrid .jsgrid-table td {
          padding: 0.5rem 1rem !important;
        }
      `}</style>

      <div className="row">
        <div className="col-md-12">
          <Link to="/admin/report/board/meetings" style={{ float: 'right' }}>
            Back
          </Link>
        </div>
      </div>

      {departments.map((department) =>
        department.boards.map((board) => (
          <div key={board.id} className="template-demo mb-4 mt-3">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb breadcrumb-custom">
                <li className="breadcrumb-item">
                  <a href="#">
                    <h5>{department.name}</h5>
                  </a>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  <span>
                    <h6>{board.name}</h6>
                  </span>
                </li>
              </ol>
            </nav>

            <table id="department_decision_detial_repsort" className="table table-striped">
              <thead style={{ background: '#56c77d !important', color: 'white !important' }}>
                <tr>
                  <th>S.NO.</th>
                  <th>Meeting Subject</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {board.boardMeetings.map((meeting) => (
                  <React.Fragment key={meeting.id}>
                    <tr style={{ background: '#56c77d !important', color: 'white !important' }}>
                      <td>
                        <button
                          style={{ width: '35px', height: '35px', padding: '0.1rem 0rem' }}
                          type="button"
                          className="btn btn-dark btn-rounded btn-icon"
                        >
                          {meeting.id}
                        </button>
                      </td>
                      <td>
                        <h4 className="text-center">{meeting.subject}</h4>
                      </td>
                      <td>{new Date(meeting.date).toLocaleDateString('en-GB')}</td>
                    </tr>
                    <tr>
                      <td colSpan={3}>
                        <table id="department_decision_detial_repsort" className="table-striped">
                          <thead style={{ background: 'rgb(37, 136, 95) !important', color: 'white !important' }}>
                            <tr>
                              <th style={{ width: '5px' }}>S.NO</th>
                              <th style={{ width: '250px' }}>Agenda Point</th>
                              <th style={{ width: '250px' }}>Decision</th>
                              <th style={{ width: '100px' }}>Progress</th>
                              <th style={{ width: '100px' }}>Responsibility</th>
                              <th style={{ width: '30px' }}>Timeline</th>
                              <th style={{ width: '5px' }}>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {meeting.agendaPoints.length > 0 ? (
                              meeting.agendaPoints.map((agenda, index) => (
                                <tr key={agenda.id}>
                                  <td>
                                    <button
                                      style={{ width: '25px', height: '25px', padding: '0.1rem 0rem' }}
                                      type="button"
                                      className="btn btn-outline-secondary btn-rounded btn-icon text-dark"
                                    >
                                      {index + 1}
                                    </button>
                                  </td>
                                  <td>
                                    <div dangerouslySetInnerHTML={{ __html: agenda.item || '' }} />
                                  </td>
                                  <td>
                                    <div dangerouslySetInnerHTML={{ __html: agenda.decision || '' }} />
                                  </td>
                                  <td>
                                    <div dangerouslySetInnerHTML={{ __html: agenda.progress || '' }} />
                                  </td>
                                  <td>
                                    <div dangerouslySetInnerHTML={{ __html: agenda.responsibility || '' }} />
                                  </td>
                                  <td>{new Date(agenda.timeline).toLocaleDateString('en-GB')}</td>
                                  <td style={{ width: '5px' }}>
                                    {agenda.status === 'Pending' ? (
                                      <label
                                        style={{ width: '85px', background: '#E74039 !important' }}
                                        className={`badge ${getStatusBadgeClass(agenda.status)} badge-pill`}
                                      >
                                        {agenda.status}
                                      </label>
                                    ) : (
                                      <label
                                        style={{ width: '115px' }}
                                        className={`badge ${getStatusBadgeClass(agenda.status)} badge-pill`}
                                      >
                                        {agenda.status}
                                      </label>
                                    )}
                                    <Link
                                      to={`/admin/replies/board/agenda-point/${agenda.id}`}
                                      className="btn btn-info mt-2"
                                      title="CM office and departments responses"
                                    >
                                      <i className="ti-comments"></i>
                                    </Link>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan={8}>
                                  <p className="text-center">No agenda points found</p>
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        ))
      )}

      {/* Modal for Member Details */}
      {showMemberModal && (
        <div
          className="modal fade show"
          style={{ display: 'block' }}
          tabIndex={-1}
          role="dialog"
          aria-labelledby="ModalLabel"
          aria-hidden="false"
        >
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header" style={{ padding: '15px 27px' }}>
                <h5 className="modal-title" id="ModalLabel">
                  Member Detail
                </h5>
                <button
                  type="button"
                  className="close"
                  onClick={() => setShowMemberModal(false)}
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body" style={{ padding: '10px 26px' }}>
                <div className="row">
                  <div
                    id="related_departments_data_show"
                    dangerouslySetInnerHTML={{ __html: selectedMemberData }}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowMemberModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showMemberModal && (
        <div className="modal-backdrop fade show" onClick={() => setShowMemberModal(false)}></div>
      )}
    </div>
  );
}
