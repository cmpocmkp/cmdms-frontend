/**
 * Filter Record Notes Report
 * EXACT replica of admin/report/recordnotes/filter-record-notes.blade.php from old CMDMS
 */

import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { faker } from '@faker-js/faker';
import { mockDepartments } from '../../../lib/mocks/data/departments';

// Helper to convert status string to badge class
const badgesWithStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    'Completed': 'success',
    'On Target': 'warning',
    'Overdue': 'danger',
    'Off Target': 'info',
    'Ongoing': 'primary'
  };
  return statusMap[status.trim()] || 'secondary';
};

// Format date as d-m-Y
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

// Format date as d/m/Y
const formatDateSlash = (dateString: string): string => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

// Helper to format subject heading (simplified version)
const subjectHeading = (text: string, format?: string): string => {
  if (!text) return '';
  if (format === 'ucw') {
    return text.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
  }
  return text.charAt(0).toUpperCase() + text.slice(1);
};

interface Minute {
  id: number;
  status: string;
  responsibility: string;
  timeline: string;
}

interface Meeting {
  id: number;
  meeting_date: string;
  subject: string;
  department: {
    id: number;
    name: string;
  };
  minutes: Minute[];
}

// Generate mock meetings data
const generateMockMeetings = (departmentId: string | null, fromDate: string, toDate: string): Meeting[] => {
  const meetings: Meeting[] = [];
  const meetingCount = faker.number.int({ min: 5, max: 15 });
  
  const filteredDepartments = departmentId && departmentId !== 'all'
    ? mockDepartments.filter(d => d.id === parseInt(departmentId))
    : mockDepartments.filter(d => d.department_type_id === 1);

  for (let i = 0; i < meetingCount; i++) {
    const dept = faker.helpers.arrayElement(filteredDepartments);
    const meetingDate = faker.date.between({ from: fromDate || '2024-01-01', to: toDate || new Date().toISOString() });
    
    const minuteCount = faker.number.int({ min: 3, max: 10 });
    const minutes: Minute[] = [];
    
    for (let j = 0; j < minuteCount; j++) {
      const status = faker.helpers.arrayElement(['Completed', 'On Target', 'Overdue', 'Off Target', 'Ongoing']);
      minutes.push({
        id: j + 1,
        status,
        responsibility: faker.lorem.sentence(),
        timeline: faker.date.future().toISOString()
      });
    }

    meetings.push({
      id: i + 1,
      meeting_date: meetingDate.toISOString(),
      subject: faker.lorem.sentence(),
      department: {
        id: Number(dept.id),
        name: dept.name
      },
      minutes
    });
  }

  return meetings.sort((a, b) => new Date(b.meeting_date).getTime() - new Date(a.meeting_date).getTime());
};

export default function FilterRecordNotesReport() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [departmentId, setDepartmentId] = useState<string>(() => {
    return searchParams.get('department_id') || 'all';
  });
  const [fromDate, setFromDate] = useState<string>(() => {
    return searchParams.get('date') || new Date().toISOString().split('T')[0];
  });
  const [toDate, setToDate] = useState<string>(() => {
    return searchParams.get('to_date') || new Date().toISOString().split('T')[0];
  });
  const [hasSearched, setHasSearched] = useState<boolean>(() => {
    return searchParams.has('_token') || (searchParams.has('department_id') && searchParams.has('date'));
  });

  // Generate mock meetings based on filters
  const meetings = useMemo(() => {
    if (!hasSearched) return [];
    return generateMockMeetings(departmentId, fromDate, toDate);
  }, [departmentId, fromDate, toDate, hasSearched]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
    const params: Record<string, string> = {
      _token: '1',
      department_id: departmentId,
      date: fromDate,
      to_date: toDate
    };
    setSearchParams(params);
  };

  const handleReset = () => {
    setDepartmentId('all');
    const today = new Date().toISOString().split('T')[0];
    setFromDate(today);
    setToDate(today);
    setHasSearched(false);
    setSearchParams({});
  };

  // Toggle expandable sections
  useEffect(() => {
    const handleToggle = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains('toggle') || target.closest('.toggle')) {
        const toggleElement = target.classList.contains('toggle') ? target : target.closest('.toggle');
        if (toggleElement) {
          const nextPrivate = toggleElement.nextElementSibling as HTMLElement;
          if (nextPrivate && nextPrivate.classList.contains('private')) {
            nextPrivate.style.display = nextPrivate.style.display === 'none' ? 'block' : 'none';
          }
        }
      }
    };

    document.addEventListener('click', handleToggle);
    return () => {
      document.removeEventListener('click', handleToggle);
    };
  }, [meetings]);

  return (
    <div className="content-wrapper">
      <style>{`
        .private {
          display: none;
          height: 200px;
          overflow: scroll;
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
          border: 0.5px solid #dfdddd !important;
          font-size: 16px !important;
          min-height: 35px !important;
          color: #49525a !important;
        }
        #department_decision_detial_repsort td ul li {
          font-size: 16px !important;
        }
        #department_decision_detial_repsort th {
          border: 0.5px solid #dfdddd !important;
          text-align: center;
          height: 35px;
        }
        #department_decision_detial_repsort td div,
        u, b, p {
          width: 100% !important;
        }
        .card-body p {
          font-size: 16px;
        }
        .badge.badge-pill {
          font-size: 16px !important;
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
        .toggle {
          cursor: pointer;
          margin-right: 5px;
          margin-bottom: 5px;
          display: inline-block;
        }
        #department_meeting_decision_detial_report {
          width: 100% !important;
        }
        #department_meeting_decision_detial_report td {
          border: 1px solid silver;
          font-size: 14px;
          padding: 5px;
        }
        #department_meeting_decision_detial_report th {
          border: 1px solid silver;
          text-align: center;
          background: #f0f0f0;
        }
      `}</style>
      <div className="card">
        <div className="card-body">
          <h4 className="card-title text-primary">Filter Record Notes</h4>
          <form className="form-sample" onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-3">
                <div className="form-group">
                  <label>Department Name</label>
                  <select
                    name="department_id"
                    id="department_id"
                    className="form-control w-100"
                    required
                    value={departmentId}
                    onChange={(e) => setDepartmentId(e.target.value)}
                  >
                    <option value="all">All departments</option>
                    {mockDepartments.filter(d => d.department_type_id === 1).map((department) => (
                      <option key={department.id} value={department.id}>
                        {subjectHeading(department.name)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="col-md-3">
                <label>From Date</label>
                <div className="form-group">
                  <input
                    type="date"
                    name="date"
                    id="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="form-control"
                  />
                </div>
              </div>
              <div className="col-md-3">
                <label>To Date</label>
                <div className="form-group">
                  <input
                    type="date"
                    name="to_date"
                    id="to_date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className="form-control"
                  />
                </div>
              </div>
              <div className="col-md-3">
                <div className="form-group mt-1">
                  <button type="submit" className="btn btn-success btn-sm mt-4">Search</button>
                  <Link to="/admin/report/filter-recordnotes" onClick={handleReset} className="btn btn-warning btn-sm mt-4">
                    Reset
                  </Link>
                </div>
              </div>
            </div>
          </form>

          {meetings.length > 0 && hasSearched && (
            <p>Number Of meetings found ({meetings.length})</p>
          )}

          <div className="row">
            <div className="col-12">
              <div className="table-responsive">
                <table id="department_decision_detial_repsort" className="table-striped">
                  <thead>
                    <tr>
                      <th style={{ width: '5px' }}>S.NO</th>
                      <th style={{ width: '20px' }}>Meeting Date</th>
                      <th style={{ width: '170px' }}>Subject</th>
                      <th style={{ width: '150px' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {meetings.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="text-center">Nothing found.</td>
                      </tr>
                    ) : (
                      meetings.map((meeting, index) => {
                        // Group minutes by status
                        const minutesByStatus = meeting.minutes.reduce((acc, minute) => {
                          if (!acc[minute.status]) {
                            acc[minute.status] = [];
                          }
                          acc[minute.status].push(minute);
                          return acc;
                        }, {} as Record<string, Minute[]>);

                        return (
                          <tr key={meeting.id}>
                            <td className="text-center">{index + 1}</td>
                            <td className="text-center">{formatDate(meeting.meeting_date)}</td>
                            <td style={{ width: '170px', paddingLeft: '5px', paddingRight: '5px', height: '35px !important' }}>
                              {subjectHeading(meeting.subject)} -{' '}
                              <span
                                style={{ marginTop: '5px' }}
                                className="text-success"
                                title={`Department ${subjectHeading(meeting.department.name, 'ucw')}`}
                              >
                                ({subjectHeading(meeting.department.name, 'ucw')})
                              </span>
                            </td>
                            <td style={{ width: '150px', paddingLeft: '5px', paddingRight: '5px', height: '35px !important' }}>
                              <Link
                                to={`/admin/report/meeting/${meeting.id}/minutes`}
                                className="text-primary mr-2"
                                style={{ textDecoration: 'none' }}
                              >
                                view all decisions
                                <span
                                  className="text-success"
                                  title="Total Number of Decision's in this meeting"
                                >
                                  <button
                                    style={{ width: '23px', height: '23px', padding: '0.1rem 0rem' }}
                                    type="button"
                                    className="btn btn-outline-dark btn-fw"
                                  >
                                    {meeting.minutes.length}
                                  </button>
                                </span>
                              </Link>
                              <br />
                              {Object.entries(minutesByStatus).map(([status, minutes]) => (
                                <React.Fragment key={status}>
                                  <span
                                    style={{ width: '135px', cursor: 'pointer' }}
                                    className={`toggle badge badge-${badgesWithStatus(status)} badge-pill`}
                                    title="Click to view progress"
                                  >
                                    {status}
                                    <button
                                      style={{
                                        width: '23px',
                                        height: '23px',
                                        padding: '0.1rem 0rem',
                                        color: 'white !important',
                                        borderColor: 'white !important'
                                      }}
                                      type="button"
                                      className="btn btn-inverse-dark btn-rounded btn-icon text-dark"
                                    >
                                      {minutes.length}
                                    </button>
                                  </span>
                                  <div className="private">
                                    <table
                                      id="department_meeting_decision_detial_report"
                                      className="table-striped"
                                      style={{ width: '100% !important' }}
                                    >
                                      <thead>
                                        <tr>
                                          <th style={{ width: '5px' }}>Responsibility</th>
                                          <th style={{ width: '5px' }}>Timeline</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {minutes.map((minute) => {
                                          const timelineDate = new Date(minute.timeline);
                                          const now = new Date();
                                          const diffDays = Math.ceil((timelineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                                          let timelineExtra = '';

                                          if (minute.status === 'On Target' && diffDays > 0) {
                                            timelineExtra = `<br/><span style="color:#17c653;font-size:14px;">Remaining ${diffDays} ${diffDays === 1 ? 'day' : 'days'}</span>`;
                                          } else if (minute.status === 'Overdue' && diffDays < 0) {
                                            const delayDays = Math.abs(diffDays);
                                            timelineExtra = `<br/><span style="color:red;font-size:12px;">Delay ${delayDays} ${delayDays === 1 ? 'day' : 'days'}</span>`;
                                          }

                                          return (
                                            <tr key={minute.id}>
                                              <td>{minute.responsibility.replace(/&nbsp;/g, '')}</td>
                                              <td className="text-center">
                                                {formatDateSlash(minute.timeline)}
                                                <div dangerouslySetInnerHTML={{ __html: timelineExtra }} />
                                              </td>
                                            </tr>
                                          );
                                        })}
                                      </tbody>
                                    </table>
                                  </div>
                                </React.Fragment>
                              ))}
                            </td>
                          </tr>
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
  );
}
