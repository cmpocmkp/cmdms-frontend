/**
 * Cabinet Meetings Report - By Status
 * EXACT replica of admin/report/cabinet/cabinet-by-status.blade.php
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { api } from '../../../lib/api';

interface StatusCard {
  status: string;
  borderColor: string;
  title: string;
  minutesClass: string;
  percentClass: string;
  icon: string;
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
  departments: Array<{
    id: number;
    name: string;
    pivot: {
      status: number;
      remarks: string;
    };
  }>;
  replies: Array<{
    id: number;
    reply_detail: string;
    created_at: string;
    user: {
      name: string;
      department: {
        name: string;
      };
    };
  }>;
}

interface Meeting {
  id: number;
  subject: string;
  meeting_date: string;
  created_at: string;
  updated_at: string;
  creator: {
    name: string;
  };
  editor: {
    name: string;
  };
  minutes: Minute[];
}

export default function CabinetByStatusReport() {
  const [searchParams] = useSearchParams();
  const status = searchParams.get('status') || '5';
  const [loading, setLoading] = useState(true);
  const [meetings, setMeetings] = useState<Meeting[]>([]);

  // Dummy data for testing
  useEffect(() => {
    // TODO: Replace with actual API call
    // const fetchData = async () => {
    //   try {
    //     const response = await api.get(`/admin/report/cabinet-meetings/by-status?status=${status}`);
    //     setMeetings(response.data.meetings);
    //   } catch (error) {
    //     console.error('Error fetching cabinet meetings by status:', error);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchData();

    // Mock data for testing
    setMeetings([
      {
        id: 1,
        subject: 'Cabinet Meeting on Health Sector Reforms',
        meeting_date: '2024-01-15',
        created_at: '2024-01-10',
        updated_at: '2024-01-20',
        creator: { name: 'Admin User' },
        editor: { name: 'Admin User' },
        minutes: [
          {
            id: 1,
            issues: 'Implementation of Health Insurance Scheme',
            decisions: 'Approved the health insurance scheme for all citizens',
            comments: 'Progress is on track. Initial phase completed successfully.',
            timeline: '2024-03-15',
            status: parseInt(status),
            status_label: status === '1' ? 'Completed' : status === '2' ? 'On Target' : 'Overdue',
            status_class: status === '1' ? 'badge-success' : status === '2' ? 'badge-info' : 'badge-danger',
            departments: [
              { id: 1, name: 'Health Department', pivot: { status: parseInt(status), remarks: 'Working on implementation' } },
              { id: 2, name: 'Finance Department', pivot: { status: parseInt(status), remarks: 'Budget allocated' } },
            ],
            replies: [],
          },
          {
            id: 2,
            issues: 'Upgradation of District Hospitals',
            decisions: 'Allocate funds for hospital upgradation',
            comments: 'Tender process initiated. Expected completion in 6 months.',
            timeline: '2024-04-30',
            status: parseInt(status),
            status_label: status === '1' ? 'Completed' : status === '2' ? 'On Target' : 'Overdue',
            status_class: status === '1' ? 'badge-success' : status === '2' ? 'badge-info' : 'badge-danger',
            departments: [
              { id: 1, name: 'Health Department', pivot: { status: parseInt(status), remarks: 'Tender floated' } },
              { id: 3, name: 'Public Works Department', pivot: { status: parseInt(status), remarks: 'Design approved' } },
            ],
            replies: [],
          },
        ],
      },
      {
        id: 2,
        subject: 'Cabinet Meeting on Education Sector Development',
        meeting_date: '2024-02-10',
        created_at: '2024-02-05',
        updated_at: '2024-02-15',
        creator: { name: 'Admin User' },
        editor: { name: 'Admin User' },
        minutes: [
          {
            id: 3,
            issues: 'Construction of New Schools',
            decisions: 'Approve construction of 50 new schools',
            comments: 'Land acquisition in progress. 30 sites identified.',
            timeline: '2024-05-15',
            status: parseInt(status),
            status_label: status === '1' ? 'Completed' : status === '2' ? 'On Target' : 'Overdue',
            status_class: status === '1' ? 'badge-success' : status === '2' ? 'badge-info' : 'badge-danger',
            departments: [
              { id: 2, name: 'Education Department', pivot: { status: parseInt(status), remarks: 'Land acquisition ongoing' } },
              { id: 3, name: 'Public Works Department', pivot: { status: parseInt(status), remarks: 'Designs prepared' } },
            ],
            replies: [],
          },
        ],
      },
    ]);

    setLoading(false);
  }, [status]);

  const totals = useMemo(() => {
    let total_count = 0;
    let completed_count = 0;
    let on_target_count = 0;
    let off_target_count = 0;
    let overdue_count = 0;
    let overdue_other_count = 0;
    let off_target_other_count = 0;
    let on_going_count = 0;

    meetings.forEach(meeting => {
      meeting.minutes.forEach(minute => {
        total_count++;
        switch (minute.status) {
          case 1: completed_count++; break;
          case 2: on_target_count++; break;
          case 4: off_target_count++; break;
          case 3: overdue_count++; break;
          case 6: overdue_other_count++; break;
          case 9: off_target_other_count++; break;
          case 7: on_going_count++; break;
        }
      });
    });

    return {
      total_count,
      completed_count,
      on_target_count,
      off_target_count,
      overdue_count,
      overdue_other_count,
      off_target_other_count,
      on_going_count,
    };
  }, [meetings]);

  const percentages = useMemo(() => {
    const total = totals.total_count || 1;
    return {
      completed: totals.completed_count / total * 100,
      on_target: totals.on_target_count / total * 100,
      on_going: totals.on_going_count / total * 100,
      off_target: totals.off_target_count / total * 100,
      overdue: totals.overdue_count / total * 100,
      off_target_other: totals.off_target_other_count / total * 100,
      overdue_other: totals.overdue_other_count / total * 100,
    };
  }, [totals]);

  const statusCards: StatusCard[] = [
    { status: '5', borderColor: '#3282FF', title: 'Decisions', minutesClass: 'total_minutes', percentClass: '', icon: 'ti-list' },
    { status: '1', borderColor: '#0E8160', title: 'Completed', minutesClass: 'completed_minutes', percentClass: 'compl_percent', icon: 'ti-check' },
    { status: '2', borderColor: '#1DC39F', title: 'On Target', minutesClass: 'on_target_minutes', percentClass: 'on_percent', icon: 'ti-target' },
    { status: '7', borderColor: '#F8C146', title: 'On Going', minutesClass: 'on_going_minutes', percentClass: 'on_going_percent', icon: 'ti-reload' },
    { status: '4', borderColor: '#E74039', title: 'Off Target', minutesClass: 'off_target_minutes', percentClass: 'off_percent', icon: 'ti-alert' },
    { status: '3', borderColor: '#FD7E01', title: 'Overdue', minutesClass: 'overdue_minutes', percentClass: 'over_percent', icon: 'ti-timer' },
    { status: '9', borderColor: '#f3726d', title: 'Off Target Reason', minutesClass: 'off_target_other', percentClass: 'off_target_other_percent', icon: 'ti-alert' },
    { status: '6', borderColor: '#874EFF', title: 'Overdue Reason', minutesClass: 'overdue_minutes_other', percentClass: 'over_other_percent', icon: 'ti-timer' },
  ];

  const currentCard = statusCards.find(card => card.status === status) || statusCards[0];

  const getCardCount = (card: StatusCard): number => {
    switch (card.status) {
      case '5': return totals.total_count;
      case '1': return totals.completed_count;
      case '2': return totals.on_target_count;
      case '7': return totals.on_going_count;
      case '4': return totals.off_target_count;
      case '3': return totals.overdue_count;
      case '9': return totals.off_target_other_count;
      case '6': return totals.overdue_other_count;
      default: return 0;
    }
  };

  const getCardPercent = (card: StatusCard): number => {
    switch (card.status) {
      case '1': return percentages.completed;
      case '2': return percentages.on_target;
      case '7': return percentages.on_going;
      case '4': return percentages.off_target;
      case '3': return percentages.overdue;
      case '9': return percentages.off_target_other;
      case '6': return percentages.overdue_other;
      default: return 0;
    }
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

  const calculateTimelineInfo = (minute: Minute) => {
    const timelineDate = new Date(minute.timeline);
    const now = new Date();
    // Carbon's diffInDays() returns absolute (always positive) difference in days
    // It doesn't matter if timeline is future or past - just calculate the difference
    const diffTime = Math.abs(timelineDate.getTime() - now.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    // Format date as d/m/Y to match old CMDMS
    const formattedDate = timelineDate.toLocaleDateString('en-GB');
    let timelineHtml = formattedDate;

    if (minute.status === 2) { // ON_TARGET
      // Always show remaining days for ON_TARGET status (old CMDMS doesn't check future/past)
      const remainDays = diffDays === 1 ? ' day' : ' days';
      // Match old CMDMS exactly: two spaces between number and word, font-size 14px, color red
      timelineHtml += `<br/><span style="color:red;font-size:14px;">Remaining ${diffDays}  ${remainDays}</span>`;
    } else if (minute.status === 3) { // OVERDUE
      // Always show delay days for OVERDUE status (old CMDMS doesn't check future/past)
      const delayDays = diffDays === 1 ? ' day' : ' days';
      // Match old CMDMS exactly: no space between number and word, font-size 12px, color red
      timelineHtml += `<br/><span style="color:red;font-size:12px;">Delay ${diffDays}${delayDays}</span>`;
    }
    
    return timelineHtml;
  };

  const handlePrint = () => {
    const printElement = document.getElementById('print-area');
    if (printElement) {
      const printSection = document.getElementById('printSection');
      if (!printSection) {
        const newPrintSection = document.createElement('div');
        newPrintSection.id = 'printSection';
        document.body.appendChild(newPrintSection);
      }
      const clonedElement = printElement.cloneNode(true);
      const printSection = document.getElementById('printSection');
      if (printSection) {
        printSection.innerHTML = '';
        printSection.appendChild(clonedElement);
        window.print();
      }
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
          vertical-align: top !important;
        }
        table thead tr {
          background: rgb(37, 136, 95) !important;
          color: white !important;
        }
        .dd-meeting-title-heading {
          background: #f6f8f7 !important;
        }
        .record-notes-custom-card-analytics {
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .record-notes-custom-card-analytics .card-body {
          padding: 1.5rem;
          text-align: center;
        }
        .record-notes-custom-card-analytics .icon {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem;
        }
        .record-notes-custom-card-analytics .icon i {
          color: white;
          font-size: 24px;
        }
        .record-notes-custom-card-analytics h3 {
          font-size: 2rem;
          font-weight: bold;
          margin-bottom: 0.5rem;
        }
        .record-notes-custom-card-analytics p {
          margin: 0;
          font-size: 14px;
        }
        .bg-lightgray-color-white {
          background: #56c77d !important;
          color: white !important;
        }
        .table-head-bg-color {
          background: rgb(37, 136, 95) !important;
          color: white !important;
        }
        .d-decision {
          text-wrap: wrap !important;
        }
        @media print {
          body * {
            visibility: hidden;
          }
          table thead {
            display: table-row-group !important;
            background: #fff !important;
            color: #000 !important;
          }
          #printSection,
          #printSection * {
            visibility: visible;
          }
          #printSection {
            position: absolute;
            top: 0;
            width: 100%;
          }
          .hide_in_print {
            display: none !important;
          }
          .show_in_print {
            display: block !important;
          }
        }
      `}</style>
      <div className="card">
        <div className="card-body">
          <div className="row">
            <div className="col-md-2 p-2">
              <div 
                className="card record-notes-custom-card-analytics"
                style={{ borderBottom: `8px solid ${currentCard.borderColor}` }}
              >
                <div className="card-body">
                  <div className="icon" style={{ background: currentCard.borderColor }}>
                    <i className={currentCard.icon}></i>
                  </div>
                  <h3 
                    className={`mb-2 ${currentCard.minutesClass}`}
                    style={{ color: currentCard.borderColor }}
                  >
                    {getCardCount(currentCard)}
                  </h3>
                  <p>{currentCard.title}</p>
                  <p className={`mb-0 mt-2 ${currentCard.percentClass}`}>
                    {getCardPercent(currentCard) === 0 ? '\u00A0' : `${getCardPercent(currentCard).toFixed(2)}%`}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="row mb-2">
            <div className="col-12">
              <button 
                type="button" 
                className="btn btn-info btn-icon-text pull-right hide_in_print" 
                id="btnPrint"
                onClick={handlePrint}
              >
                <i className="ti-printer mr-1"></i> Print all
              </button>
            </div>
          </div>
          <div className="row" id="print-area">
            <div className="col-12">
              <div className="table-responsive">
                <table id="department_decision_detial_repsort" className="table table-bordered table-condensed">
                  <thead>
                    {meetings.length > 0 && (() => {
                      const firstMeeting = meetings[0];
                      const headerRowMeetingOwnershipData = `Created by: ${firstMeeting.creator.name}\nCreated at: ${new Date(firstMeeting.created_at).toLocaleDateString('en-GB')}\nLast Updated by: ${firstMeeting.editor.name}\nUpdated at: ${new Date(firstMeeting.updated_at).toLocaleDateString('en-GB')}`;
                      
                      return (
                        <>
                          <tr className="bg-lightgray-color-white">
                            <th colSpan={7}>
                              <h6 className="text-right hide_in_print">
                                {/* PDF and WORD export buttons for user_id 1 or 8 */}
                              </h6>
                            </th>
                          </tr>
                          <tr className="dd-meeting-title-heading">
                            <th colSpan={7} style={{ padding: '8px', whiteSpace: 'unset' }}>
                              <h4 
                                className="text-center"
                                title={headerRowMeetingOwnershipData}
                              >
                                {firstMeeting.subject}
                              </h4>
                            </th>
                          </tr>
                          <tr className="table-head-bg-color">
                            <th style={{ width: '5px' }}>S.NO</th>
                            <th style={{ width: '5px' }}>Decision</th>
                            <th style={{ width: '200px' }}>Progress So Far</th>
                            <th className="pres">Responsibility</th>
                            <th style={{ width: '30px' }}>Timeline</th>
                            <th style={{ width: '15px' }}>Status</th>
                          </tr>
                        </>
                      );
                    })()}
                  </thead>
                  <tbody>
                    {meetings.map((meeting, meetingIndex) => {
                      const meetingOwnershipData = `Created by: ${meeting.creator.name}\nCreated at: ${new Date(meeting.created_at).toLocaleDateString('en-GB')}\nLast Updated by: ${meeting.editor.name}\nUpdated at: ${new Date(meeting.updated_at).toLocaleDateString('en-GB')}`;
                      
                      return (
                        <React.Fragment key={meeting.id}>
                          {meetingIndex > 0 && (
                            <>
                              <tr className="bg-lightgray-color-white">
                                <td colSpan={7} style={{ background: '#56c77d', color: 'white' }}>
                                  <h6 className="text-right hide_in_print">
                                    {/* PDF and WORD export buttons for user_id 1 or 8 */}
                                  </h6>
                                </td>
                              </tr>
                              <tr className="dd-meeting-title-heading">
                                <th colSpan={7} style={{ padding: '8px' }}>
                                  <center>
                                    <h4 
                                      title={`Meeting date: ${new Date(meeting.meeting_date).toLocaleDateString('en-GB')}`}
                                    >
                                      {meeting.subject}
                                    </h4>
                                  </center>
                                </th>
                              </tr>
                              <tr className="table-head-bg-color">
                                <th style={{ width: '5px' }}>S.NO</th>
                                <th style={{ width: '5px' }}>Decision</th>
                                <th style={{ width: '200px' }}>Progress So Far</th>
                                <th className="pres">Responsibility</th>
                                <th style={{ width: '30px' }}>Timeline</th>
                                <th style={{ width: '15px' }}>Status</th>
                              </tr>
                            </>
                          )}
                          {meeting.minutes.map((minute, minuteIndex) => {
                            // Get last comment from department replies (role_id === 2)
                            const lastComment = minute.replies
                              ?.filter(reply => reply.user?.role_id === 2)
                              ?.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
                            
                            const departmentComments = lastComment?.reply_detail || minute.comments || '';
                            
                            return (
                              <tr key={minute.id} id={`decision${minute.id}`}>
                                <td>
                                  <button
                                    style={{ width: '25px', height: '25px', padding: '0.1rem 0rem' }}
                                    type="button"
                                    className="btn btn-outline-secondary btn-rounded btn-icon text-dark"
                                    title={meetingOwnershipData}
                                  >
                                    {minuteIndex + 1}
                                  </button>
                                </td>
                                <td className="d-decision" dangerouslySetInnerHTML={{ __html: minute.issues || '' }} />
                                <td className="d-decision" dangerouslySetInnerHTML={{ __html: departmentComments }} />
                                <td>
                                  <table style={{ width: '100%' }}>
                                    <thead>
                                      <tr>
                                        <th>Department's</th>
                                        <th>Dept. Status</th>
                                        <th>CM Office Status</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {minute.departments.map((dept) => {
                                        // Get last comment for this department (where department_id matches)
                                        const deptLastComment = minute.replies
                                          ?.filter(reply => {
                                            // Match by department ID or name
                                            return reply.user?.department?.name === dept.name || 
                                                   (reply as any).department_id === dept.id;
                                          })
                                          ?.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
                                        
                                        // CM Office Status from pivot
                                        const cmStatus = dept.pivot.status;
                                        
                                        return (
                                          <tr key={dept.id}>
                                            <td>{dept.name}</td>
                                            <td>
                                              {deptLastComment?.status ? (
                                                <span className={`badge ${getBadgeClass(deptLastComment.status)} badge-pill`}>
                                                  {getStatusLabel(deptLastComment.status)}
                                                </span>
                                              ) : null}
                                            </td>
                                            <td>
                                              {cmStatus ? (
                                                <span className={`badge ${getBadgeClass(cmStatus)} badge-pill`}>
                                                  {getStatusLabel(cmStatus)}
                                                </span>
                                              ) : null}
                                            </td>
                                          </tr>
                                        );
                                      })}
                                    </tbody>
                                  </table>
                                </td>
                                <td style={{ width: '30px', fontWeight: 'bold', textAlign: 'center' }} dangerouslySetInnerHTML={{ __html: calculateTimelineInfo(minute) }} />
                                <td style={{ width: '15px', textAlign: 'center' }}>
                                  {/* Status badge - clickable if not cabinet user */}
                                  {minute.status ? (
                                    <Link to={`/admin/recordnotes/edit/${meeting.id}#decision${minute.id}`}>
                                      <label 
                                        style={{ cursor: 'pointer', display: 'block', marginBottom: '5px' }}
                                        className={`badge ${getBadgeClass(minute.status)} badge-pill`}
                                      >
                                        {getStatusLabel(minute.status)}
                                      </label>
                                    </Link>
                                  ) : null}
                                  <Link 
                                    to={`/admin/report/recordnotes/detail_list/${meeting.id}/${minute.id}`}
                                    className="btn btn-success"
                                    title="View Report"
                                    style={{ display: 'inline-block', marginTop: '5px', marginRight: '5px' }}
                                  >
                                    <i className="ti-printer"></i>
                                  </Link>
                                  <Link 
                                    to={`/admin/replies/minutes/${minute.id}`}
                                    className="btn btn-info"
                                    title="CM office and departments responses"
                                    style={{ display: 'inline-block', marginTop: '5px' }}
                                  >
                                    <i className="ti-comments"></i>
                                  </Link>
                                </td>
                              </tr>
                            );
                          })}
                        </React.Fragment>
                      );
                    })}
                    {meetings.length === 0 && (
                      <tr>
                        <td colSpan={6} className="text-center">No data available</td>
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
