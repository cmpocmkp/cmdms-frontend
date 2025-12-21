/**
 * PMRU Subtasks of Department
 * EXACT replica of admin/report/pmru/subtasks-of-department.blade.php from old CMDMS
 */

import React, { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { faker } from '@faker-js/faker';
import { mockAdminDepartments } from '../../../lib/mocks/data/adminDepartments';
import { Printer, MessageSquare } from 'lucide-react';

// Helper functions for badge status
const badgesWithIntegerStatus = (status: number | string): string => {
  const statusNum = typeof status === 'string' ? parseInt(status) : status;
  const statusMap: Record<number, string> = {
    1: 'success',
    2: 'warning',
    3: 'danger',
    4: 'info',
    7: 'ongoing',
    6: 'indigo',
    9: 'lightred'
  };
  return statusMap[statusNum] || 'danger';
};

const badgesWithStringStatus = (status: number | string): string => {
  const statusNum = typeof status === 'string' ? parseInt(status) : status;
  const statusMap: Record<number, string> = {
    1: 'Completed',
    2: 'On Target',
    3: 'Overdue',
    4: 'Off Target',
    7: 'Ongoing',
    6: 'Overdue Other Reason',
    9: 'Off Target Other Reason'
  };
  return statusMap[statusNum] || 'Overdue';
};

// Helper to convert status string to badge class (matching old CMDMS badgesWithStatus)
const badgesWithStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    'Completed': 'success',
    'On Target': 'warning',
    'Overdue': 'danger',
    'Off Target': 'info',
    'Ongoing': 'primary',
    'Overdue Other Reason': 'indigo',
    'Off Target Other Reason': 'lightred'
  };
  return statusMap[status] || 'danger';
};

// Format date as d/m/Y
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

// Format date as d-m-Y
const formatDateDash = (dateString: string): string => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

interface MinuteReply {
  id: number;
  reply_detail: string;
  created_at: string;
  status?: number;
  type?: string;
  attachments?: string[];
  user?: {
    name: string;
    department?: {
      name: string;
    };
    role_id?: number;
  };
}

interface MinuteDepartment {
  id: number;
  name: string;
  pivot: {
    status: number;
  };
}

interface Minute {
  id: number;
  issues?: string;
  decisions?: string;
  comments?: string;
  timeline: string;
  status: string;
  departments: MinuteDepartment[];
  replies: MinuteReply[];
}

interface Meeting {
  id: number;
  subject: string;
  meeting_date: string;
  created_at: string;
  updated_at: string;
  creator?: {
    name: string;
  };
  editor?: {
    name: string;
  };
}

interface MeetingMinute {
  meeting: Meeting;
  minutes: Minute[];
}

// Generate mock PMRU minutes data
const generateMockPMRUMinutes = (departmentId: string): MeetingMinute[] => {
  const meetings: MeetingMinute[] = [];
  
  // Generate 2-4 meetings
  const meetingCount = faker.number.int({ min: 2, max: 4 });
  
  for (let m = 0; m < meetingCount; m++) {
    const meeting: Meeting = {
      id: m + 1,
      subject: faker.lorem.sentence(),
      meeting_date: faker.date.past().toISOString(),
      created_at: faker.date.past().toISOString(),
      updated_at: faker.date.recent().toISOString(),
      creator: {
        name: faker.person.fullName()
      },
      editor: {
        name: faker.person.fullName()
      }
    };

    // Generate 3-8 minutes per meeting
    const minuteCount = faker.number.int({ min: 3, max: 8 });
    const minutes: Minute[] = [];

    for (let i = 0; i < minuteCount; i++) {
      const deptStatus = faker.helpers.arrayElement([1, 2, 3, 4, 7]);
      const cmStatus = faker.helpers.arrayElement([1, 2, 3, 4, 7]);
      
      const replyCount = faker.number.int({ min: 0, max: 3 });
      const replies: MinuteReply[] = [];
      
      for (let r = 0; r < replyCount; r++) {
        replies.push({
          id: r + 1,
          reply_detail: faker.lorem.paragraph(),
          created_at: faker.date.past().toISOString(),
          status: deptStatus,
          type: faker.helpers.arrayElement(['cmr', 'department']),
          attachments: faker.datatype.boolean({ probability: 0.3 })
            ? Array.from({ length: faker.number.int({ min: 1, max: 2 }) }, () => faker.system.fileName())
            : undefined,
          user: {
            name: faker.person.fullName(),
            department: {
              name: faker.helpers.arrayElement(mockAdminDepartments).name
            },
            role_id: faker.helpers.arrayElement([2, 3])
          }
        });
      }

      minutes.push({
        id: i + 1,
        issues: faker.lorem.paragraph(),
        decisions: faker.lorem.paragraph(),
        comments: faker.lorem.paragraph(),
        timeline: faker.date.future().toISOString(),
        status: badgesWithStringStatus(cmStatus),
        departments: [{
          id: parseInt(departmentId),
          name: mockAdminDepartments.find(d => d.id === parseInt(departmentId))?.name || 'Department',
          pivot: {
            status: cmStatus
          }
        }],
        replies
      });
    }

    meetings.push({ meeting, minutes });
  }

  return meetings;
};

export default function PMRUSubtasksDetail() {
  const { department } = useParams<{ department: string }>();
  const navigate = useNavigate();
  const [selectedMinute, setSelectedMinute] = useState<Minute | null>(null);
  const [modalContent, setModalContent] = useState<string>('');

  const departmentName = useMemo(() => {
    const dept = mockAdminDepartments.find(d => d.id === parseInt(department || '0'));
    return dept?.name || 'Department';
  }, [department]);

  const meetingsData = useMemo(() => {
    if (!department) return [];
    return generateMockPMRUMinutes(department);
  }, [department]);

  const handlePrint = () => {
    const printArea = document.getElementById('print-area');
    if (printArea) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write('<html><head><title>PMRU Meeting Report</title>');
        printWindow.document.write('<style>');
        printWindow.document.write('body { font-family: Arial, sans-serif; margin: 20px; }');
        printWindow.document.write('table { border-collapse: collapse; width: 100%; }');
        printWindow.document.write('th, td { border: 1px solid #ddd; padding: 8px; }');
        printWindow.document.write('th { background-color: #25885F; color: white; }');
        printWindow.document.write('@media print { body { margin: 0; } }');
        printWindow.document.write('</style></head><body>');
        printWindow.document.write(printArea.innerHTML);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  return (
    <div className="content-wrapper">
      <style>{`
        .private {
          display: none;
        }
        .btn-default:hover {
          color: #000 !important;
          border-color: unset !important;
          background: unset !important;
        }
        .hide_in_form {
          display: none !important;
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
        .bullet-line-list ul li:before {
          content: none;
          position: absolute;
          border-radius: 100%;
        }
        .bullet-line-list ul li:before {
          width: 15px;
          height: 15px;
          left: -30px;
          top: 0;
          border: 0;
          margin-right: 15px;
          z-index: 2;
          background: #ffffff;
        }
        table td {
          padding: 0.5rem 1rem !important;
        }
        table th {
          font-size: 13px;
          padding: 0.5rem 1rem !important;
        }
        .table td {
          font-size: 0.875rem;
          vertical-align: middle;
          line-height: 1;
          white-space: nowrap;
        }
        .dd-meeting-title-heading {
          background: #f6f8f7 !important;
          color: #000000 !important;
        }
        .d-decision {
          width: 200px;
        }
        .pres {
          width: 200px;
        }
      `}</style>
      <div className="card">
        <div className="card-body">
          <Link to="/admin/report/pmru-meetings" style={{ float: 'right' }}>Back</Link>
          <h4 className="text-center text-primary">
            PMRU meeting's - {departmentName}
          </h4>
          <div className="row">
            <div className="col-12">
              <button 
                type="button" 
                className="btn btn-info btn-icon-text pull-right" 
                id="btnPrint"
                onClick={handlePrint}
              >
                <Printer size={16} className="mr-1" /> Print all Record Notes
              </button>
            </div>
          </div>

          <div id="print-area">
            <div className="row">
              <div className="col-12">
                <div className="table-responsive">
                  <table id="department_decision_detial_repsort" className="table table-striped">
                    <thead style={{ background: 'rgb(37, 136, 95)', color: 'white' }}>
                      {meetingsData.length > 0 && meetingsData[0].meeting && (
                        <>
                          <tr className="dd-meeting-title-heading">
                            <th colSpan={7} style={{ padding: '8px', whiteSpace: 'unset' }}>
                              <h4 className="text-center">
                                {meetingsData[0].meeting.subject}
                              </h4>
                            </th>
                          </tr>
                          <tr style={{ background: 'rgb(37, 136, 95)', color: 'white' }}>
                            <th style={{ width: '5px' }}>S.NO</th>
                            <th style={{ width: '5px' }}>Decision</th>
                            <th style={{ width: '200px' }}>Progress So Far</th>
                            <th style={{ width: '200px' }}>Department Responses</th>
                            <th className="pres">Responsibility</th>
                            <th style={{ width: '30px' }}>Timeline</th>
                            <th style={{ width: '15px' }}>Status</th>
                          </tr>
                        </>
                      )}
                    </thead>
                    <tbody>
                      {meetingsData.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="text-center">No data found in table</td>
                        </tr>
                      ) : (
                        meetingsData.map((meetingData, meetingIdx) => {
                          let minuteCounter = 0;
                          
                          return (
                            <React.Fragment key={meetingData.meeting.id}>
                              {meetingIdx > 0 && (
                                <>
                                  <tr className="dd-meeting-title-heading">
                                    <th colSpan={7} style={{ padding: '8px' }}>
                                      <center>
                                        <h4>{meetingData.meeting.subject}</h4>
                                      </center>
                                    </th>
                                  </tr>
                                  <tr style={{ background: 'rgb(37, 136, 95)', color: 'white' }}>
                                    <th style={{ width: '5px' }}>S.NO</th>
                                    <th style={{ width: '5px' }}>Decision</th>
                                    <th style={{ width: '200px' }}>Progress So Far</th>
                                    <th style={{ width: '200px' }}>Department Responses</th>
                                    <th className="pres">Responsibility</th>
                                    <th style={{ width: '30px' }}>Timeline</th>
                                    <th style={{ width: '15px' }}>Status</th>
                                  </tr>
                                </>
                              )}
                              {meetingData.minutes.map((minute) => {
                                minuteCounter++;
                                
                                // Build department responses HTML
                                let departmentSoCorrespondence = '';
                                minute.replies.forEach((reply) => {
                                  if (reply.type !== 'cmr' && reply.user) {
                                    const fileLinks = reply.attachments && reply.attachments.length > 0
                                      ? `<p>Attachments: ${reply.attachments.map(f => `<span><a href="#" title="click to download attach file"><i class="ti-file"></i></a></span>`).join(' ')}</p>`
                                      : '';
                                    
                                    departmentSoCorrespondence += `
                                      <li>
                                        <h6>${reply.user.department?.name || ''} ( ${reply.user.name} ) - <span class="font-weight-bold small-text mb-0 text-success"><i class="ti-calendar menu-icon"></i>${formatDateDash(reply.created_at)}</span></h6>
                                        <p>${reply.reply_detail}</p>
                                        ${fileLinks}
                                      </li>
                                    `;
                                  }
                                });

                                const departmentSoCorrespondenceData = departmentSoCorrespondence
                                  ? `<ul class="bullet-line-list" style="overflow: auto;height: 90%">${departmentSoCorrespondence}</ul>`
                                  : '<span class="text-danger">No correspondence from both sides</span>';

                                const lastReply = minute.replies.filter(r => r.user?.role_id === 2).pop();
                                const departmentComments = lastReply?.reply_detail || minute.comments || '';

                                // Calculate remaining/delay days
                                const timelineDate = new Date(minute.timeline);
                                const now = new Date();
                                const diffDays = Math.ceil((timelineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                                let timelineExtra = '';
                                
                                if (minute.departments[0]?.pivot.status === 2 && diffDays > 0) {
                                  timelineExtra = `<br /><span style="color:red;font-size:14px;">Remaining ${diffDays} ${diffDays === 1 ? 'day' : 'days'}</span>`;
                                } else if (minute.departments[0]?.pivot.status === 3 && diffDays < 0) {
                                  const delayDays = Math.abs(diffDays);
                                  timelineExtra = `<br /><span style="color:red;font-size:12px;">Delay ${delayDays} ${delayDays === 1 ? 'day' : 'days'}</span>`;
                                }

                                const lastComment = minute.replies.filter(r => r.user?.department?.name === departmentName).pop();
                                const deptBadgeClass = lastComment?.status 
                                  ? badgesWithIntegerStatus(lastComment.status)
                                  : 'secondary';
                                const cmStatus = minute.departments[0]?.pivot.status || 3;
                                const cmBadgeClass = badgesWithIntegerStatus(cmStatus);

                                return (
                                  <tr key={`${meetingData.meeting.id}-${minute.id}`} id={`decision${minute.id}`}>
                                    <td>
                                      <button
                                        style={{ width: '25px', height: '25px', padding: '0.1rem 0rem' }}
                                        type="button"
                                        className="btn btn-outline-secondary btn-rounded btn-icon text-dark"
                                        title={`Meeting: ${meetingData.meeting.subject}`}
                                      >
                                        {minuteCounter}
                                      </button>
                                    </td>
                                    <td className="d-decision">
                                      <div dangerouslySetInnerHTML={{ __html: (minute.issues || '') + (minute.decisions || '') }} />
                                    </td>
                                    <td style={{ width: '260px', paddingLeft: '5px', paddingRight: '10px' }}>
                                      {departmentComments}
                                    </td>
                                    <td className="d-resp" style={{ width: '50px' }}>
                                      <div dangerouslySetInnerHTML={{ __html: departmentSoCorrespondenceData }} />
                                    </td>
                                    <td>
                                      <table style={{ width: '100%' }}>
                                        <thead>
                                          <tr style={{ backgroundColor: '#25885F', color: 'white' }}>
                                            <th>Dept. Status</th>
                                            <th>CM Office Status</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {minute.departments.map((dept) => (
                                            <tr key={dept.id}>
                                              <td>
                                                {lastComment?.status && (
                                                  <span className={`badge badge-${deptBadgeClass} badge-pill`}>
                                                    {badgesWithStringStatus(lastComment.status)}
                                                  </span>
                                                )}
                                              </td>
                                              <td>
                                                <span className={`badge badge-${cmBadgeClass} badge-pill`}>
                                                  {badgesWithStringStatus(cmStatus)}
                                                </span>
                                              </td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </td>
                                    <td style={{ width: '30px', fontWeight: 'bold', textAlign: 'center' }}>
                                      {formatDate(minute.timeline)}
                                      <div dangerouslySetInnerHTML={{ __html: timelineExtra }} />
                                    </td>
                                    <td style={{ width: '15px', textAlign: 'center' }}>
                                      <label
                                        style={{ cursor: 'pointer', display: 'block', marginBottom: '5px' }}
                                        className={`badge badge-${badgesWithStatus(minute.status)} badge-pill`}
                                      >
                                        {minute.status}
                                      </label>
                                      <Link
                                        to={`/admin/report/recordnotes/detail_list/${meetingData.meeting.id}/${minute.id}`}
                                        className="btn btn-success"
                                        title="View Report"
                                      >
                                        <Printer size={14} />
                                      </Link>
                                      <Link
                                        to={`/admin/replies/minutes/${minute.id}`}
                                        className="btn btn-info"
                                        title="CM office and departments responses"
                                      >
                                        <MessageSquare size={14} />
                                      </Link>
                                    </td>
                                  </tr>
                                );
                              })}
                            </React.Fragment>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
