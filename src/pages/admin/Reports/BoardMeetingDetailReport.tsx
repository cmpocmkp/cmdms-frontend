/**
 * Board Meeting Detail Report
 * EXACT replica of admin/report/boardmeetings/detail
 */

import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { api } from '../../../lib/api';

interface Meeting {
  id: number;
  subject: string;
  date: string;
  agendaPoints: AgendaPoint[];
}

interface AgendaPoint {
  id: number;
  item: string;
  decision: string;
  status: string;
  is_hilight: number;
  attachments?: string | string[];
}

export default function BoardMeetingDetailReport() {
  const { department_id, decision_status } = useParams<{
    department_id: string;
    decision_status: string;
  }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [departmentName, setDepartmentName] = useState('');

  useEffect(() => {
    // TODO: Replace with actual API call
    // const fetchData = async () => {
    //   try {
    //     const response = await api.get(`/admin/report/boardmeetings/detail/${department_id}/${decision_status}`);
    //     setMeetings(response.data.meetings);
    //     setDepartmentName(response.data.department_name);
    //   } catch (error) {
    //     console.error('Error fetching board meeting details:', error);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchData();

    // Dummy data
    setDepartmentName('Health Department');
    const dummyMeetings: Meeting[] = [
      {
        id: 1,
        subject: 'Health Board Meeting - Q1 2024',
        date: '2024-01-15',
        agendaPoints: [
          {
            id: 1,
            item: '<p>Review of Health Insurance Scheme Implementation</p>',
            decision: '<p>Approved for continuation with budget allocation</p>',
            status: 'Implemented',
            is_hilight: 0,
            attachments: ['file1.pdf'],
          },
          {
            id: 2,
            item: '<p>Hospital Upgradation Project Status</p>',
            decision: '<p>Tender process to be initiated within 30 days</p>',
            status: 'Pending',
            is_hilight: 1,
          },
          {
            id: 3,
            item: '<p>Medical Equipment Procurement</p>',
            decision: '<p>Approved procurement of essential equipment</p>',
            status: 'Implemented',
            is_hilight: 0,
          },
        ],
      },
      {
        id: 2,
        subject: 'Health Board Meeting - Q2 2024',
        date: '2024-04-20',
        agendaPoints: [
          {
            id: 4,
            item: '<p>Staff Recruitment Plan</p>',
            decision: '<p>Approved recruitment of 50 new staff members</p>',
            status: 'Implemented',
            is_hilight: 0,
          },
        ],
      },
    ];

    setMeetings(dummyMeetings);
    setLoading(false);
  }, [department_id, decision_status]);

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

  let total_count = 0;
  let completed_count = 0;
  let overdue_count = 0;

  meetings.forEach((meeting) => {
    meeting.agendaPoints.forEach((point) => {
      total_count++;
      if (point.status === 'Implemented') {
        completed_count++;
      } else {
        overdue_count++;
      }
    });
  });

  return (
    <div className="content-wrapper">
      <style>{`
        table#department_decision_detial_repsort {
          width: 100% !important;
        }
        #department_decision_detial_repsort td {
          border: 1px solid silver;
          font-size: 16px !important;
        }
        #department_decision_detial_repsort td ul li {
          font-size: 16px !important;
        }
        #department_decision_detial_repsort th {
          border: 1px solid silver;
          text-align: center;
          height: 35px;
        }
        .card-body p {
          font-size: 16px;
        }
        .badge.badge-pill {
          font-size: 16px !important;
        }
        a#board_meeting_detail_pending {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 40px;
          border: 2px solid orange;
          border-radius: 999px;
          color: white !important;
          background: red;
          text-decoration: none;
          font-family: sans-serif;
          font-size: 16px;
          letter-spacing: 1px;
        }
        a#board_meeting_detail_pending {
          animation: burn 1500ms ease-out forwards infinite;
        }
        a#board_meeting_detail_pending::before {
          content: '';
          position: absolute;
          left: 40px;
          height: 40px;
          background: rgba(255, 230, 110, 1);
          border-radius: 100%;
          animation: flare 1000ms ease-out forwards;
        }
        a#board_meeting_detail_pending::after {
          content: '';
          position: absolute;
          right: 40px;
          height: 40px;
          background: rgba(255, 230, 110, 1);
          border-radius: 100%;
          animation: flare 1000ms ease-out forwards;
        }
        @keyframes flare {
          100% {
            transform: translateY(-20px) scale(1.5);
            filter: blur(10px);
            opacity: 0;
          }
        }
        @keyframes burn {
          0% {
            color: rgba(255, 130, 110, 1);
            background: red;
            box-shadow: 0 0 5px 0 rgb(200 157 0), 0 0 5px 0 rgb(230 30 10 / 80%), 0 0 5px 0 rgb(230 230 10 / 60%);
          }
          100% {
            color: rgba(0, 0, 0, 1);
            background: red;
            box-shadow: 0 -35px 40px 30px rgba(255, 130, 10, 0), 0 -30px 30px 10px rgba(230, 30, 10, 0), 0 -20px 10px 0 rgba(255, 255, 10, 0);
          }
        }
      `}</style>

      <div className="card">
        <div className="card-body">
          <Link to="/admin/report/board/meetings" style={{ float: 'right' }}>
            Back
          </Link>
          <h4 className="card-title text-primary">
            {departmentName} Board Meeting Agenda Points Details
          </h4>

          <div className="row">
            <div className="col-12">
              <div className="table-responsive">
                <table id="department_decision_detial_repsort" className="table-striped">
                  <thead style={{ background: 'rgb(37, 136, 95) !important', color: 'white !important' }}>
                    {meetings[0] && (
                      <>
                        <tr style={{ background: '#0f1531', color: 'white' }}>
                          <th colSpan={4} style={{ padding: '10px', textAlign: 'center' }}>
                            <h6>Agenda Points of the Meeting</h6>
                          </th>
                        </tr>
                        <tr style={{ background: 'green', color: 'white' }}>
                          <th colSpan={6} style={{ padding: '8px', whiteSpace: 'unset' }}>
                            <center>
                              <h5>
                                {meetings[0].subject} ({new Date(meetings[0].date).toLocaleDateString('en-GB')})
                              </h5>
                            </center>
                          </th>
                        </tr>
                      </>
                    )}

                    <tr>
                      <th style={{ width: '5px' }}>S.NO</th>
                      <th style={{ width: '200px' }}>Agenda Item</th>
                      <th style={{ width: '200px' }}>Decision</th>
                    </tr>
                  </thead>
                  <tbody>
                    {meetings.length > 0 ? (
                      meetings.map((meeting, meetingIndex) => (
                        <React.Fragment key={meeting.id}>
                          {meetingIndex > 0 && (
                            <>
                              <tr style={{ background: '#0f1531', color: 'white' }}>
                                <td colSpan={4} style={{ padding: '10px', textAlign: 'center' }}>
                                  <h6>Agenda Points of the Meeting</h6>
                                </td>
                              </tr>
                              <tr style={{ background: 'green', color: 'white' }}>
                                <th colSpan={4} style={{ padding: '8px' }}>
                                  <center>
                                    <h5>
                                      {meeting.subject} ({new Date(meeting.date).toLocaleDateString('en-GB')})
                                    </h5>
                                  </center>
                                </th>
                              </tr>
                              <tr style={{ background: '#71c016', color: 'white' }}>
                                <th style={{ width: '5px' }}>S.NO</th>
                                <th style={{ width: '200px' }}>Agenda Items</th>
                                <th style={{ width: '200px' }}>Decision</th>
                              </tr>
                            </>
                          )}
                          {meeting.agendaPoints.map((point, pointIndex) => {
                            const isHighlighted = point.is_hilight === 1;
                            return (
                              <tr
                                key={point.id}
                                style={isHighlighted ? { color: 'var(--blue)' } : {}}
                              >
                                <td style={{ width: '5px' }}>{pointIndex + 1}</td>
                                <td style={{ width: '200px' }}>
                                  <div dangerouslySetInnerHTML={{ __html: point.item || '' }} />
                                  {point.attachments && (
                                    <div>
                                      {Array.isArray(point.attachments) ? (
                                        point.attachments.map((file, fileIndex) => (
                                          <span key={fileIndex}>
                                            <a href="#" title="click to download attach file">
                                              Attachment: <i className="ti-file"></i>
                                            </a>
                                          </span>
                                        ))
                                      ) : (
                                        <span>
                                          <a href="#" title="click to download attach file">
                                            Attachment: <i className="ti-file"></i>
                                          </a>
                                        </span>
                                      )}
                                    </div>
                                  )}
                                </td>
                                <td style={{ width: '200px' }}>
                                  <div dangerouslySetInnerHTML={{ __html: point.decision || '' }} />
                                </td>
                              </tr>
                            );
                          })}
                        </React.Fragment>
                      ))
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
