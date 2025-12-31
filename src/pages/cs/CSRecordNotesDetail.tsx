/**
 * CS (Chief Secretary) Record Notes Detail Report
 * EXACT replica of admin/cs/reports/detail.blade.php from old CMDMS
 * Shows minutes grouped by meetings for a specific department and status
 */

import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { generateMockCSRecordNotesDetail } from '../../lib/mocks/data/csRecordNotes';
import type { CSRecordNoteMeeting } from '../../lib/mocks/data/csRecordNotes';

export default function CSRecordNotesDetail() {
  const { deptid, stat } = useParams<{ deptid: string; stat: string }>();
  const [meetings, setMeetings] = useState<CSRecordNoteMeeting[]>([]);
  const [departmentName, setDepartmentName] = useState<string>('Department');

  useEffect(() => {
    if (deptid && stat) {
      const data = generateMockCSRecordNotesDetail(Number(deptid), stat);
      setMeetings(data);
      if (data.length > 0 && data[0].department) {
        setDepartmentName(data[0].department.name);
      }
    }
  }, [deptid, stat]);

  const getStatusBadgeClass = (status: string): string => {
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

  const formatDate = (dateString: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Calculate totals
  let totalCount = 0;
  let completedCount = 0;
  let onTargetCount = 0;
  let overdueCount = 0;

  meetings.forEach(meeting => {
    meeting.minutes.forEach(minute => {
      totalCount++;
      switch (minute.status) {
        case 'Completed':
          completedCount++;
          break;
        case 'On Target':
          onTargetCount++;
          break;
        case 'Overdue':
          overdueCount++;
          break;
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
          <Link to="/cs/report/all-record-notes" style={{ float: 'right' }}>
            Back
          </Link>
          <h4 className="card-title text-primary">
            {departmentName} Department Record Notes Details
          </h4>

          <div className="row">
            <div className="col-12">
              <div className="table-responsive">
                <table
                  id="department_decision_detial_repsort"
                  className="table-striped"
                >
                  <thead style={{ background: 'green', color: 'white' }}>
                    {meetings.length > 0 && (
                      <>
                        <tr style={{ background: '#0f1531', color: 'white' }}>
                          <th colSpan={6} style={{ padding: '10px', textAlign: 'center' }}>
                            <h6>
                              <a
                                title="Print"
                                className="pull-right text-light btn btn-primary float-right mt-4 ml-2"
                                href={`/cs/print/${meetings[0].id}/${deptid}/${stat}/reocrdnote/`}
                                onClick={(e) => {
                                  e.preventDefault();
                                  // TODO: Implement print functionality
                                  window.print();
                                }}
                              >
                                <i className="ti-printer mr-1"></i>
                                Print
                              </a>
                            </h6>
                          </th>
                        </tr>
                        <tr style={{ background: 'green', color: 'white' }}>
                          <th colSpan={6} style={{ padding: '8px', whiteSpace: 'unset' }}>
                            <center>
                              <h5>{meetings[0].subject || ''}</h5>
                            </center>
                          </th>
                        </tr>
                      </>
                    )}

                    <tr>
                      <th style={{ width: '5px' }}>S.NO</th>
                      <th style={{ width: '200px' }}>Decision</th>
                      <th style={{ width: '200px' }}>Progress So Far</th>
                      <th style={{ width: '70px' }}>Responsibility</th>
                      <th style={{ width: '30px' }}>Timeline</th>
                      <th style={{ width: '15px' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {meetings.length > 0 ? (
                      (() => {
                        let globalIndex = 0;
                        return meetings.map((meeting, meetingIndex) => {
                          return (
                            <React.Fragment key={meeting.id}>
                              {meetingIndex > 0 && (
                                <>
                                  <tr style={{ background: '#0f1531', color: 'white' }}>
                                    <td colSpan={6} style={{ padding: '10px', textAlign: 'center' }}>
                                      <h6>
                                        <a
                                          title="print"
                                          className="pull-right text-light btn btn-primary float-right mt-4 ml-2"
                                          href={`/cs/print/${meeting.id}/${deptid}/${stat}/reocrdnote/`}
                                          onClick={(e) => {
                                            e.preventDefault();
                                            // TODO: Implement print functionality
                                            window.print();
                                          }}
                                        >
                                          <i className="ti-printer mr-1"></i>
                                          Print
                                        </a>
                                      </h6>
                                    </td>
                                  </tr>
                                  <tr style={{ background: 'green', color: 'white' }}>
                                    <th colSpan={6} style={{ padding: '8px' }}>
                                      <center>
                                        <h5>{meeting.subject}</h5>
                                      </center>
                                    </th>
                                  </tr>
                                  <tr style={{ background: '#71c016', color: 'white' }}>
                                    <th style={{ width: '5px' }}>S.NO</th>
                                    <th style={{ width: '200px' }}>Decision</th>
                                    <th style={{ width: '200px' }}>Progress So Far</th>
                                    <th style={{ width: '70px' }}>Responsibility</th>
                                    <th style={{ width: '30px' }}>Timeline</th>
                                    <th style={{ width: '15px' }}>Status</th>
                                  </tr>
                                </>
                              )}
                              {meeting.minutes.map((minute) => {
                                globalIndex++;
                                return (
                                  <tr key={minute.id}>
                                    <td style={{ width: '5px' }}>
                                      {globalIndex}
                                    </td>
                                <td
                                  style={{ width: '200px' }}
                                  dangerouslySetInnerHTML={{ __html: minute.decisions }}
                                />
                                <td style={{ width: '200px' }}>
                                  {minute.comments || ''}
                                </td>
                                <td
                                  style={{ width: '70px' }}
                                  dangerouslySetInnerHTML={{ __html: minute.responsibility }}
                                />
                                <td style={{ width: '30px' }}>
                                  {formatDate(minute.timeline)}
                                </td>
                                <td style={{ width: '15px' }}>
                                  <label
                                    style={{ width: '100px' }}
                                    className={`badge ${getStatusBadgeClass(minute.status)} badge-pill`}
                                  >
                                    {minute.status || ''}
                                  </label>
                                </td>
                                  </tr>
                                );
                              })}
                            </React.Fragment>
                          );
                        });
                      })()
                    ) : (
                      <tr>
                        <td colSpan={6}>There is no data.</td>
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

