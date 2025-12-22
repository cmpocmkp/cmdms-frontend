/**
 * Recordnotes Updates Detail Report
 * EXACT replica of admin/report/recordnotes/updates-detail.blade.php from old CMDMS
 */

import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Printer, ArrowLeft } from 'lucide-react';
import { generateMockRecordNotesUpdatesDetail, RecordNoteUpdateMeeting } from '../../../lib/mocks/data/recordnotesUpdates';
import { mockDepartments } from '../../../lib/mocks/data/departments';

export default function RecordnotesUpdatesDetailReport() {
  const { deptId, status } = useParams<{ deptId: string; status: string }>();
  const [loading, setLoading] = useState(true);
  const [meetings, setMeetings] = useState<RecordNoteUpdateMeeting[]>([]);
  const [departmentName, setDepartmentName] = useState<string>('Department');

  useEffect(() => {
    // TODO: Replace with actual API call
    if (deptId && status) {
      const deptIdNum = parseInt(deptId);
      const statusNum = parseInt(status);
      const mockMeetings = generateMockRecordNotesUpdatesDetail(deptIdNum, statusNum);
      setMeetings(mockMeetings);
      
      // Find department name
      const dept = mockDepartments.find(d => Number(d.id) === deptIdNum);
      if (dept) {
        setDepartmentName(dept.name);
      }
      setLoading(false);
    }
  }, [deptId, status]);

  // Format date to d/m/Y
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Format date to "g:ia \o\n l jS F Y" format
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    const hour12 = hours % 12 || 12;
    const minStr = String(minutes).padStart(2, '0');
    
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    const dayName = days[date.getDay()];
    const dayNum = date.getDate();
    const monthName = months[date.getMonth()];
    const year = date.getFullYear();
    
    // Get day suffix (st, nd, rd, th)
    const getDaySuffix = (day: number) => {
      if (day > 3 && day < 21) return 'th';
      switch (day % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
      }
    };
    
    return `${hour12}:${minStr}${ampm} on ${dayName} ${dayNum}${getDaySuffix(dayNum)} ${monthName} ${year}`;
  };

  // Get badge class based on status
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'badge-success';
      case 'On Target':
        return 'badge-warning';
      case 'Overdue':
        return 'badge-danger';
      default:
        return 'badge-secondary';
    }
  };

  if (loading) {
    return <div className="text-center p-5">Loading...</div>;
  }

  return (
    <div className="content-wrapper">
      <style>{`
        table#department_decision_detial_repsort {
          width: 100% !important;
        }
        #department_decision_detial_repsort td {
          border: 1px solid silver;
          vertical-align: top !important;
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
      `}</style>

      <div className="card">
        <div className="card-body">
          <Link 
            to="/admin/report/recordnotes-updates" 
            style={{ float: 'right' }}
            className="d-flex align-items-center gap-2"
          >
            <ArrowLeft size={16} />
            Back
          </Link>
          <h4 className="card-title text-primary">
            "{departmentName}" Department Record Notes Updates Details
          </h4>

          <div className="row">
            <div className="col-12">
              <div className="table-responsive">
                <table id="department_decision_detial_repsort" className="table-striped">
                  <thead style={{ background: 'green', color: 'white' }}>
                    {meetings.length > 0 && meetings[0] && (
                      <>
                        <tr style={{ background: '#0f1531', color: 'white' }}>
                          <th colSpan={8} style={{ padding: '10px', textAlign: 'center' }}>
                            <h6 style={{ margin: 0 }}>
                              <a
                                href={`#`}
                                className="pull-right text-light"
                                style={{ float: 'right' }}
                                title="print"
                                onClick={(e) => {
                                  e.preventDefault();
                                  // TODO: Implement print functionality
                                  window.print();
                                }}
                              >
                                <Printer size={16} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                                Print
                              </a>
                            </h6>
                          </th>
                        </tr>
                        <tr style={{ background: 'green', color: 'white' }}>
                          <th colSpan={8} style={{ padding: '8px', whiteSpace: 'unset' }}>
                            <center>
                              <h5 style={{ margin: 0 }}>
                                {meetings[0].subject} - Meeting Last Updated: {formatDate(meetings[0].updated_at)}
                              </h5>
                            </center>
                          </th>
                        </tr>
                      </>
                    )}

                    <tr>
                      <th style={{ width: '5px' }}>S.NO</th>
                      <th style={{ width: '100px' }}>Decision</th>
                      <th style={{ width: '100px' }}>Progress So Far</th>
                      <th style={{ width: '70px' }}>Responsibility</th>
                      <th style={{ width: '30px' }}>Timeline</th>
                      <th style={{ width: '15px' }}>Status</th>
                      <th style={{ width: '15px' }}>Last Updated</th>
                      <th style={{ width: '15px' }}>Last Updated by<br /> Department</th>
                    </tr>
                  </thead>
                  <tbody>
                    {meetings.length > 0 ? (
                      <>
                        {meetings.flatMap((meeting, meetingIndex) => {
                          const rows: JSX.Element[] = [];
                          
                          // Add meeting header for meetings after the first one
                          if (meetingIndex > 0) {
                            rows.push(
                              <tr key={`header-print-${meeting.id}`} style={{ background: '#0f1531', color: 'white' }}>
                                <td colSpan={8} style={{ padding: '10px', textAlign: 'center' }}>
                                  <h6 style={{ margin: 0 }}>
                                    <a
                                      href={`#`}
                                      className="pull-right text-light"
                                      style={{ float: 'right' }}
                                      title="print"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        // TODO: Implement print functionality
                                        window.print();
                                      }}
                                    >
                                      <Printer size={16} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                                      Print
                                    </a>
                                  </h6>
                                </td>
                              </tr>
                            );
                            
                            rows.push(
                              <tr key={`header-subject-${meeting.id}`} style={{ background: 'green', color: 'white' }}>
                                <th colSpan={8} style={{ padding: '8px' }}>
                                  <center>
                                    <h5 style={{ margin: 0 }}>
                                      {meeting.subject} - Meeting Last Updated: {formatDate(meeting.updated_at)}
                                    </h5>
                                  </center>
                                </th>
                              </tr>
                            );
                            
                            rows.push(
                              <tr key={`header-columns-${meeting.id}`} style={{ background: '#71c016', color: 'white' }}>
                                <th style={{ width: '5px' }}>S.NO</th>
                                <th style={{ width: '100px' }}>Decision</th>
                                <th style={{ width: '100px' }}>Progress So Far</th>
                                <th style={{ width: '70px' }}>Responsibility</th>
                                <th style={{ width: '30px' }}>Timeline</th>
                                <th style={{ width: '15px' }}>Status</th>
                                <th style={{ width: '15px' }}>Last Updated<br />by SO</th>
                                <th style={{ width: '15px' }}>Last Updated<br />by Department</th>
                              </tr>
                            );
                          }
                          
                          // Add minute rows
                          meeting.minutes.forEach((minute, minuteIndex) => {
                            rows.push(
                              <tr key={`minute-${meeting.id}-${minute.id}`}>
                                <td style={{ width: '5px' }}>{minuteIndex + 1}</td>
                                <td style={{ width: '200px' }} dangerouslySetInnerHTML={{ __html: minute.decisions }} />
                                <td style={{ width: '200px' }}>
                                  {minute.progress_so_far ? (
                                    <div dangerouslySetInnerHTML={{ __html: minute.progress_so_far }} />
                                  ) : (
                                    ''
                                  )}
                                </td>
                                <td style={{ width: '70px' }} dangerouslySetInnerHTML={{ __html: minute.responsibility }} />
                                <td style={{ width: '30px' }}>
                                  {formatDate(minute.timeline)}
                                </td>
                                <td style={{ width: '15px' }}>
                                  <label
                                    style={{ width: '100px' }}
                                    className={`badge ${getStatusBadgeClass(minute.status)} badge-pill`}
                                  >
                                    {minute.status}
                                  </label>
                                </td>
                                <td style={{ width: '15px' }}>
                                  {formatDateTime(minute.updated_at)}
                                </td>
                                <td style={{ width: '15px' }}>
                                  {minute.last_updated_by_department ? (
                                    formatDateTime(minute.last_updated_by_department)
                                  ) : (
                                    'No reply by department.'
                                  )}
                                </td>
                              </tr>
                            );
                          });
                          
                          return rows;
                        })}
                      </>
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
