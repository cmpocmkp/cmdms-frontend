/**
 * Record Notes Detail List - Admin Module
 * EXACT replica of admin/report/recordnotes/all_detail.blade.php
 */

import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

interface Reply {
  id: number;
  reply_detail: string;
  overdue_reason?: string;
  attachments?: string[];
  status?: number;
  status_label?: string;
  status_class?: string;
  created_at: string;
  department_id: number;
}

interface Department {
  id: number;
  name: string;
  pivot: {
    status: number;
    remarks: string;
  };
}

interface Minute {
  id: number;
  issues: string;
  decisions: string;
  comments: string;
  timeline: string;
  status: number;
  status_label: string;
  status_class: string;
  attachments?: string[];
  departments: Department[];
  replies: Reply[];
}

interface Meeting {
  id: number;
  subject: string;
  meeting_date: string;
  department: {
    id: number;
    name: string;
  };
}

export default function RecordNotesDetailList() {
  const { meeting, minute } = useParams<{ meeting: string; minute: string }>();
  const [loading, setLoading] = useState(true);
  const [minuteDetail, setMinuteDetail] = useState<Minute | null>(null);
  const [meetingData, setMeetingData] = useState<Meeting | null>(null);

  useEffect(() => {
    // TODO: Replace with actual API call
    // const fetchData = async () => {
    //   try {
    //     const response = await api.get(`/admin/report/recordnotes/detail_list/${meeting}/${minute}`);
    //     setMinuteDetail(response.data.minuteDetail[0]);
    //     setMeetingData(response.data.meeting);
    //   } catch (error) {
    //     console.error('Error fetching record notes detail:', error);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchData();

    // Mock data for testing
    setMeetingData({
      id: parseInt(meeting || '1'),
      subject: 'Cabinet Meeting on Health Sector Reforms',
      meeting_date: '2024-01-15',
      department: {
        id: 1,
        name: 'Health Department',
      },
    });

    setMinuteDetail({
      id: parseInt(minute || '1'),
      issues: '<p>Implementation of Health Insurance Scheme for all citizens</p>',
      decisions: '<p>Approved the health insurance scheme with comprehensive coverage including primary healthcare, emergency services, and specialized treatments.</p>',
      comments: '<p>CM Office Response: The implementation is progressing well. All stakeholders have been consulted and the scheme is on track for launch in Q2 2024.</p>',
      timeline: '2024-03-15',
      status: 2,
      status_label: 'On Target',
      status_class: 'badge-warning',
      attachments: ['health_scheme_draft.pdf'],
      departments: [
        {
          id: 1,
          name: 'Health Department',
          pivot: {
            status: 2,
            remarks: 'Working on implementation. Initial phase completed successfully.',
          },
        },
        {
          id: 2,
          name: 'Finance Department',
          pivot: {
            status: 2,
            remarks: 'Budget allocated and approved. Funds are ready for disbursement.',
          },
        },
        {
          id: 3,
          name: 'Public Works Department',
          pivot: {
            status: 1,
            remarks: 'Infrastructure requirements identified and planning in progress.',
          },
        },
      ],
      replies: [
        {
          id: 1,
          reply_detail: '<p>Health Department Response: We have completed the initial assessment and identified key implementation areas. The scheme will cover all districts.</p>',
          attachments: ['assessment_report.pdf'],
          status: 2,
          status_label: 'On Target',
          status_class: 'badge-warning',
          created_at: '2024-01-20',
          department_id: 1,
        },
        {
          id: 2,
          reply_detail: '<p>Finance Department Response: Budget has been allocated. We are coordinating with Health Department for fund disbursement schedule.</p>',
          status: 2,
          status_label: 'On Target',
          status_class: 'badge-warning',
          created_at: '2024-01-22',
          department_id: 2,
        },
        {
          id: 3,
          reply_detail: '<p>Public Works Department Response: Infrastructure planning completed. Site surveys are underway.</p>',
          status: 1,
          status_label: 'Completed',
          status_class: 'badge-success',
          created_at: '2024-01-25',
          department_id: 3,
        },
      ],
    });

    setLoading(false);
  }, [meeting, minute]);

  const handlePrint = () => {
    const printContent = document.getElementById('print_id');
    if (printContent) {
      const headerStr = '<html><head><title>' + document.title + '</title></head><body>';
      const footerStr = '</body></html>';
      const newStr = printContent.innerHTML;
      const oldStr = document.body.innerHTML;
      document.body.innerHTML = headerStr + newStr + footerStr;
      window.print();
      document.body.innerHTML = oldStr;
      window.location.reload();
    }
  };

  const calculateTimelineInfo = (minute: Minute) => {
    const timelineDate = new Date(minute.timeline);
    const now = new Date();
    // Carbon's diffInDays() returns absolute (always positive) difference in days
    // It doesn't matter if timeline is future or past - just calculate the difference
    const diffTime = Math.abs(timelineDate.getTime() - now.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    // In all_detail.blade.php, it checks status as string 'On Target' or 'Overdue'
    const statusLabel = getStatusLabel(minute.status);
    
    if (statusLabel === 'On Target') {
      // Always show remaining days for 'On Target' status (old CMDMS doesn't check future/past)
      return { type: 'remaining', days: diffDays };
    } else if (statusLabel === 'Overdue') {
      // Always show delay days for 'Overdue' status (old CMDMS doesn't check future/past)
      return { type: 'delay', days: diffDays };
    }
    return null;
  };

  const getBadgeClass = (status: number): string => {
    // Match DecisionStatus enum badgeClass() method exactly
    switch (status) {
      case 1: return 'badge-success'; // COMPLETED
      case 2: return 'badge-warning'; // ON_TARGET
      case 3: return 'badge-danger'; // OVERDUE
      case 4: return 'badge-info'; // OFF_TARGET
      case 6: return 'badge-indigo'; // OVERDUE_OTHER_REASON
      case 7: return 'badge-ongoing'; // ONGOING
      case 8: return 'badge-dark'; // CAN_NOT_COMPLETED
      case 9: return 'badge-lightred'; // OFF_TARGET_OTHER_REASON
      default: return 'badge-secondary';
    }
  };

  const getStatusLabel = (status: number): string => {
    // Match DecisionStatus enum label() method exactly
    switch (status) {
      case 1: return 'Completed';
      case 2: return 'On Target';
      case 3: return 'Overdue';
      case 4: return 'Off Target';
      case 6: return 'Overdue other reason';
      case 7: return 'Ongoing';
      case 8: return 'Can not be completed';
      case 9: return 'Off Target reason';
      default: return 'Pending';
    }
  };

  if (loading) {
    return <div className="text-center p-5">Loading...</div>;
  }

  if (!minuteDetail || !meetingData) {
    return <div className="text-center p-5">No data found</div>;
  }

  const timelineInfo = calculateTimelineInfo(minuteDetail);
  const parentDepartmentReplies = minuteDetail.replies.filter(r => r.department_id === meetingData.department.id);
  const parentDepartmentLastReply = parentDepartmentReplies[parentDepartmentReplies.length - 1];

  return (
    <div className="content-wrapper">
      <style>{`
        @media print {
          html {
            margin: 0;
            padding: 0;
          }
          .report_head .qr {
            margin: 0 20px;
            padding: 10px 20px !important;
          }
          #right-sidebar {
            display: none !important;
          }
          .badge {
            border: none !important;
          }
        }
        .top_head {
          text-align: center;
          font-weight: bold;
          margin-bottom: 20px;
        }
        .report_detail {
          width: 100%;
        }
        .report_detail table {
          width: 100%;
          border-collapse: collapse;
        }
        .report_detail th,
        .report_detail td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: left;
          vertical-align: top;
        }
        .report_detail th {
          background-color: #f2f2f2;
          font-weight: bold;
        }
        .report_head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border: 1px solid #ddd;
          margin-bottom: 20px;
        }
        .report_head .qr {
          width: 140px;
          height: 140px;
        }
        .report_head .meeting_detail {
          flex: 1;
          padding: 0 20px;
        }
        .report_head .meeting_detail h4 {
          margin-bottom: 15px;
        }
        .report_head .meeting_detail .text p {
          margin: 5px 0;
        }
        .report_head .logo {
          display: flex;
          align-items: center;
        }
        .printbtn {
          background: #007bff;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 4px;
          cursor: pointer;
        }
        .decisionDiv {
          padding: 20px;
          border: 1px solid #ddd;
          margin-bottom: 20px;
        }
        .decisionTitle {
          margin: 10px 0;
        }
        .table-info {
          background-color: #d1ecf1;
        }
        .report_detail ul {
          margin: 0;
          padding-left: 20px;
        }
        .report_detail ul li {
          margin: 5px 0;
        }
      `}</style>
      <div className="card">
        <div className="card-body" id="print_id">
          <h3 className="top_head">{meetingData.department?.name || 'Department'}</h3>
          <div className="report_detail">
            <table>
              <tr>
                <td colSpan={10}>
                  <div className="report_head">
                    <div className="qr">
                      <div className="bar">
                        {/* QR Code placeholder - would be generated in real implementation */}
                        <div style={{ width: '140px', height: '140px', border: '1px solid #ddd', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          QR Code
                        </div>
                      </div>
                    </div>
                    <div className="meeting_detail">
                      <h4>{meetingData.subject}</h4>
                      <div className="text">
                        <p><strong>Date:</strong> {new Date(meetingData.meeting_date).toLocaleDateString('en-GB')}</p>
                        <p><strong>Timeline:</strong> {new Date(minuteDetail.timeline).toLocaleDateString('en-GB')}</p>
                        {timelineInfo && (
                          <p>
                            <strong>No of days:</strong>{' '}
                            {timelineInfo.type === 'remaining' ? (
                              <span className="text-success font-weight-bold">
                                Remaining {timelineInfo.days}{timelineInfo.days === 1 ? ' day' : ' days'}
                              </span>
                            ) : (
                              <span className="text-danger font-weight-bold">
                                Delay {timelineInfo.days}{timelineInfo.days === 1 ? ' day' : ' days'}
                              </span>
                            )}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="qr logo">
                      <button className="printbtn" onClick={handlePrint} type="button">
                        <i className="ti-printer"></i>
                      </button>
                    </div>
                  </div>
                  <div className="decisionDiv">
                    <h4 className="decisionTitle" dangerouslySetInnerHTML={{ __html: minuteDetail.issues || '' }} />
                    <h5 className="decisionTitle" dangerouslySetInnerHTML={{ __html: minuteDetail.decisions || '' }} />
                  </div>
                </td>
              </tr>
              <tr>
                <th style={{ width: '140px' }}>Department</th>
                <th style={{ width: '490px' }}>Response</th>
                <th style={{ width: '60px' }}>Status</th>
                <th style={{ width: '490px' }}>CM Response</th>
                <th style={{ width: '60px' }}>Status</th>
                <th style={{ width: '60px' }}>Status</th>
              </tr>
              <tbody>
                {/* Parent Department Row */}
                <tr className="table-info">
                  <td>{meetingData.department?.name || ''}</td>
                  <td>
                    <ul>
                      {parentDepartmentReplies.length > 0 ? (
                        parentDepartmentReplies.map((reply) => (
                          <li key={reply.id}>
                            <div dangerouslySetInnerHTML={{ __html: reply.reply_detail }} />
                            {reply.overdue_reason && (
                              <>
                                <span className="text-warning">Reason</span>
                                <div dangerouslySetInnerHTML={{ __html: reply.overdue_reason }} />
                              </>
                            )}
                          </li>
                        ))
                      ) : (
                        <li>&nbsp;</li>
                      )}
                    </ul>
                  </td>
                  <td style={{ width: '60px' }}>
                    {parentDepartmentLastReply?.status ? (
                      <label
                        style={{ width: '100px' }}
                        className={`badge ${getBadgeClass(parentDepartmentLastReply.status)} badge-pill`}
                      >
                        {getStatusLabel(parentDepartmentLastReply.status)}
                      </label>
                    ) : null}
                    {parentDepartmentReplies.some(r => r.attachments && r.attachments.length > 0) && (
                      <div>
                        {parentDepartmentReplies.map((reply) =>
                          reply.attachments?.map((_file, idx) => (
                            <a
                              key={idx}
                              href="#"
                              className="badge badge-success text-white mt-3"
                              style={{ display: 'block' }}
                            >
                              <i className="ti-download"></i> Attachment
                            </a>
                          ))
                        )}
                      </div>
                    )}
                  </td>
                  <td>
                    {minuteDetail.comments && (
                      <ul>
                        <li dangerouslySetInnerHTML={{ __html: minuteDetail.comments }} />
                      </ul>
                    )}
                  </td>
                  <td style={{ width: '60px' }}>
                    {minuteDetail.status ? (
                      <Link to={`/admin/recordnotes/edit/${meetingData.id}#decision${minuteDetail.id}`}>
                        <label
                          style={{ cursor: 'pointer' }}
                          className={`badge ${getBadgeClass(minuteDetail.status)} badge-pill`}
                        >
                          {getStatusLabel(minuteDetail.status)}
                        </label>
                      </Link>
                    ) : null}
                    {minuteDetail.attachments && minuteDetail.attachments.length > 0 && (
                      <div>
                        {minuteDetail.attachments.map((_file, idx) => (
                          <a
                            key={idx}
                            href="#"
                            className="badge badge-success text-white mt-3"
                            style={{ display: 'block' }}
                          >
                            <i className="ti-download"></i> Attachment
                          </a>
                        ))}
                      </div>
                    )}
                  </td>
                  <td style={{ width: '60px' }}>
                    {minuteDetail.status ? (
                      <label className={`badge ${getBadgeClass(minuteDetail.status)} badge-pill`}>
                        {getStatusLabel(minuteDetail.status)}
                      </label>
                    ) : null}
                  </td>
                </tr>
                {/* Related Departments Rows */}
                {minuteDetail.departments
                  .filter(dept => dept.id !== meetingData.department.id)
                  .map((responsibleDepartment) => {
                    const relatedDepartmentReplies = minuteDetail.replies.filter(
                      r => r.department_id === responsibleDepartment.id
                    );
                    const relatedDepartmentLastReply = relatedDepartmentReplies[relatedDepartmentReplies.length - 1];
                    const cmStatus = responsibleDepartment.pivot.status;
                    const cmRemarks = responsibleDepartment.pivot.remarks;

                    return (
                      <tr key={responsibleDepartment.id}>
                        <td style={{ width: '60px' }}>{responsibleDepartment.name}</td>
                        <td>
                          <ul>
                            {relatedDepartmentReplies.length > 0 ? (
                              relatedDepartmentReplies.map((reply) => (
                                <li key={reply.id}>
                                  <div dangerouslySetInnerHTML={{ __html: reply.reply_detail || '' }} />
                                  {reply.overdue_reason && (
                                    <>
                                      <span className="text-warning">Reason</span>
                                      <div dangerouslySetInnerHTML={{ __html: reply.overdue_reason || '' }} />
                                    </>
                                  )}
                                </li>
                              ))
                            ) : (
                              <li>&nbsp;</li>
                            )}
                          </ul>
                        </td>
                        <td style={{ width: '60px' }}>
                          {relatedDepartmentLastReply?.status ? (
                            <label
                              style={{ width: '100px' }}
                              className={`badge ${getBadgeClass(relatedDepartmentLastReply.status)} badge-pill`}
                            >
                              {getStatusLabel(relatedDepartmentLastReply.status)}
                            </label>
                          ) : null}
                          {relatedDepartmentReplies.some(r => r.attachments && r.attachments.length > 0) && (
                            <div>
                              {relatedDepartmentReplies.map((reply) =>
                                reply.attachments?.map((_file, idx) => (
                                  <a
                                    key={idx}
                                    href="#"
                                    className="badge badge-success text-white mt-3"
                                    style={{ display: 'block' }}
                                  >
                                    <i className="ti-download"></i> Attachment
                                  </a>
                                ))
                              )}
                            </div>
                          )}
                        </td>
                        <td>
                          {cmRemarks && (
                            <ul>
                              <li dangerouslySetInnerHTML={{ __html: cmRemarks }} />
                            </ul>
                          )}
                        </td>
                        <td style={{ width: '60px' }}>
                          {cmStatus ? (
                            <label
                              style={{ width: '100px' }}
                              className={`badge ${getBadgeClass(cmStatus)} badge-pill`}
                            >
                              {getStatusLabel(cmStatus)}
                            </label>
                          ) : null}
                        </td>
                        <td style={{ width: '60px' }}>
                          {minuteDetail.status ? (
                            <label className={`badge ${getBadgeClass(minuteDetail.status)} badge-pill`}>
                              {getStatusLabel(minuteDetail.status)}
                            </label>
                          ) : null}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
