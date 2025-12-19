/**
 * Cabinet Meetings Report - Detail (Department-wise)
 * EXACT replica of admin/report/cabinet/detail.blade.php
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
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
      role_id: number;
      department: {
        name: string;
      };
    };
    status?: number;
    status_label?: string;
    status_class?: string;
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

export default function CabinetDetailReport() {
  const { deptid, stat } = useParams<{ deptid: string; stat: string }>();
  const navigate = useNavigate();
  const decision_status = stat || '5';
  const [loading, setLoading] = useState(true);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [departmentName, setDepartmentName] = useState<string>('');

  // Dummy data for testing
  useEffect(() => {
    // TODO: Replace with actual API call
    // const fetchData = async () => {
    //   try {
    //     const response = await api.get(`/admin/report/cabinet-meetings/detail/${deptid}/${decision_status}`);
    //     setMeetings(response.data.meetings);
    //     setDepartmentName(response.data.department_name);
    //   } catch (error) {
    //     console.error('Error fetching cabinet detail:', error);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchData();

    // Mock data for testing
    setDepartmentName('Health Department');
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
            issues: '<p>Implementation of Health Insurance Scheme</p>',
            comments: '<p>Progress is on track. Initial phase completed successfully.</p>',
            timeline: '2024-03-15',
            status: parseInt(decision_status),
            status_label: decision_status === '1' ? 'Completed' : decision_status === '2' ? 'On Target' : decision_status === '3' ? 'Overdue' : 'Pending',
            status_class: decision_status === '1' ? 'badge-success' : decision_status === '2' ? 'badge-info' : decision_status === '3' ? 'badge-danger' : 'badge-warning',
            departments: [
              { id: 1, name: 'Health Department', pivot: { status: parseInt(decision_status), remarks: 'Working on implementation' } },
              { id: 2, name: 'Finance Department', pivot: { status: parseInt(decision_status), remarks: 'Budget allocated' } },
            ],
            replies: [
              {
                id: 1,
                reply_detail: 'Initial progress update',
                created_at: '2024-01-20',
                user: { name: 'Department User', role_id: 2, department: { name: 'Health Department' } },
                status: parseInt(decision_status),
                status_label: 'On Target',
                status_class: 'badge-info',
              },
            ],
          },
          {
            id: 2,
            issues: '<p>Upgradation of District Hospitals</p>',
            comments: '<p>Tender process initiated. Expected completion in 6 months.</p>',
            timeline: '2024-04-30',
            status: parseInt(decision_status),
            status_label: decision_status === '1' ? 'Completed' : decision_status === '2' ? 'On Target' : 'Pending',
            status_class: decision_status === '1' ? 'badge-success' : decision_status === '2' ? 'badge-info' : 'badge-warning',
            departments: [
              { id: 1, name: 'Health Department', pivot: { status: parseInt(decision_status), remarks: 'Tender floated' } },
              { id: 3, name: 'Public Works Department', pivot: { status: parseInt(decision_status), remarks: 'Design approved' } },
            ],
            replies: [],
          },
        ],
      },
    ]);

    setLoading(false);
  }, [deptid, decision_status]);

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
    const printElement = document.getElementById('printmymodal');
    if (printElement) {
      let printSection = document.getElementById('printSection');
      if (!printSection) {
        const newPrintSection = document.createElement('div');
        newPrintSection.id = 'printSection';
        document.body.appendChild(newPrintSection);
        printSection = document.getElementById('printSection');
      }
      if (printSection) {
        const clonedElement = printElement.cloneNode(true);
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
        @media screen {
          #printSection {
            display: none;
          }
        }
        @media print {
          body * {
            visibility: hidden;
          }
          thead {
            display: table-row-group !important;
          }
          .record-note-print-btn,
          .update_related_department_minute_btn {
            display: none !important;
          }
          #printSection,
          #printSection * {
            visibility: visible;
          }
          #printSection {
            position: absolute;
            top: 0;
            width: 90%;
          }
          .hide_in_print {
            display: none !important;
          }
          .show_in_print {
            display: block !important;
          }
          table#department_decision_detial_repsort {
            width: 100% !important;
          }
          #department_decision_detial_repsort td {
            border: 1px solid silver !important;
            vertical-align: top !important;
            font-size: 16px !important;
          }
          #department_decision_detial_repsort td ul li {
            font-size: 16px !important;
          }
          #department_decision_detial_repsort th {
            border: 1px solid silver !important;
            text-align: center !important;
            height: 35px;
          }
          .card-body p {
            font-size: 16px !important;
          }
          table.related_department_table {
            width: 100% !important;
          }
          .related_department_table td {
            vertical-align: top !important;
            font-size: 16px !important;
            margin: 5px !important;
          }
          .related_department_table td div {
            width: 200px !important;
          }
          .related_department_table td ul li {
            font-size: 16px !important;
            width: 200px !important;
          }
          .d-decision {
            text-wrap: wrap !important;
          }
          table.dataTable tbody td p,
          table.dataTable tbody td {
            font-size: 0.8rem !important;
          }
          body {
            -webkit-print-color-adjust: exact !important;
          }
          #department_decision_detial_repsort td.pres {
            width: 230px !important;
          }
          #department_decision_detial_repsort th.pres {
            width: 230px !important;
          }
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
        table#department_decision_detial_repsort th,
        td {
          white-space: normal !important;
        }
        .table th,
        td {
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
        .table th,
        .jsgrid .jsgrid-table th,
        .table td,
        .jsgrid .jsgrid-table td {
          padding: 0.5rem 1rem !important;
        }
        .record-notes-custom-card-analytics {
          transition: transform 0.2s, box-shadow 0.2s;
          cursor: pointer;
        }
        .record-notes-custom-card-analytics:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
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
        .dd-meeting-title-heading {
          background: #f6f8f7 !important;
        }
        .bg-lightgray-color-white {
          background: #56c77d !important;
          color: white !important;
        }
        .table-head-bg-color {
          background: rgb(37, 136, 95) !important;
          color: white !important;
        }
        table thead tr {
          background: rgb(37, 136, 95) !important;
          color: white !important;
        }
      `}</style>
      <div className="card">
        <div className="card-body">
          <Link to="/admin/report/cabinet-meetings" style={{ float: 'right' }}>Back</Link>
          <h4 className="text-center text-primary">
            Record Notes of the meetings - {departmentName || 'Department'}
          </h4>
          
          <div className="row my-5 d-flex justify-content-end">
            {statusCards.map((card, index) => {
              const count = getCardCount(card);
              const percent = getCardPercent(card);
              return (
                <div key={index} className="col-md-2 p-2">
                  <Link to={`/admin/report/cabinet-meetings/detail/${deptid}/${card.status}`}>
                    <div 
                      className="card record-notes-custom-card-analytics"
                      style={{ borderBottom: `8px solid ${card.borderColor}` }}
                    >
                      <div className="card-body">
                        <div className="icon" style={{ background: card.borderColor }}>
                          <i className={card.icon}></i>
                        </div>
                        <h3 
                          className={`mb-2 ${card.minutesClass}`}
                          style={{ color: card.borderColor }}
                        >
                          {count}
                        </h3>
                        <p>{card.title}</p>
                        <p className={`mb-0 mt-2 ${card.percentClass}`}>
                          {percent === 0 ? '\u00A0' : `${percent.toFixed(2)}%`}
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>

          <div className="row">
            <div className="col-12">
              <button 
                type="button" 
                className="btn btn-info btn-icon-text pull-right" 
                id="btnPrint"
                onClick={handlePrint}
              >
                <i className="ti-printer mr-1"></i> Print all Record Notes
              </button>
            </div>
          </div>

          <div id="printmymodal">
            <div className="row">
              <div className="col-12">
                <div className="table-responsive">
                  <table id="department_decision_detial_repsort" className="table table-striped">
                    <thead>
                      {meetings.length > 0 && (() => {
                        const firstMeeting = meetings[0];
                        const headerRowMeetingOwnershipData = `Created by: ${firstMeeting.creator.name}\nCreated at: ${new Date(firstMeeting.created_at).toLocaleDateString('en-GB')}\nLast Updated by: ${firstMeeting.editor.name}\nUpdated at: ${new Date(firstMeeting.updated_at).toLocaleDateString('en-GB')}`;
                        
                        return (
                          <>
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
                                  <td style={{ display: 'none' }}>&nbsp;</td>
                                  <td style={{ display: 'none' }}>&nbsp;</td>
                                  <td style={{ display: 'none' }}>&nbsp;</td>
                                  <td style={{ display: 'none' }}>&nbsp;</td>
                                  <td style={{ display: 'none' }}>&nbsp;</td>
                                  <td style={{ display: 'none' }}>&nbsp;</td>
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
                                  <th style={{ display: 'none' }}>&nbsp;</th>
                                  <th style={{ display: 'none' }}>&nbsp;</th>
                                  <th style={{ display: 'none' }}>&nbsp;</th>
                                  <th style={{ display: 'none' }}>&nbsp;</th>
                                  <th style={{ display: 'none' }}>&nbsp;</th>
                                  <th style={{ display: 'none' }}>&nbsp;</th>
                                </tr>
                                <tr className="table-head-bg-color">
                                  <th style={{ width: '5px' }}>S.NO</th>
                                  <th style={{ width: '5px' }}>Decision</th>
                                  <th className="pres">Responsibility</th>
                                  <th style={{ width: '30px' }}>Timeline</th>
                                  <th style={{ width: '15px' }}>Status</th>
                                </tr>
                              </>
                            )}
                            {meeting.minutes.map((minute, minuteIndex) => {
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
                                  <td className="d-decision">
                                    <div dangerouslySetInnerHTML={{ __html: minute.issues || '' }} />
                                    <div dangerouslySetInnerHTML={{ __html: minute.comments || '' }} />
                                  </td>
                                  <td>
                                    <table style={{ width: '100%' }}>
                                      <thead>
                                        <tr style={{ background: '#25885F', color: 'white' }}>
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
                                              return reply.user?.department?.name === dept.name || 
                                                     (reply as any).department_id === dept.id;
                                            })
                                            ?.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
                                          
                                          // CM Office Status from pivot
                                          const cmStatus = dept.pivot.status;
                                          
                                          return (
                                            <tr key={dept.id}>
                                              <td>
                                                <Link to={`/admin/report/subtasks/of-department/cabinet-meeting/${dept.id}`}>
                                                  {dept.name}
                                                </Link>
                                              </td>
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
    </div>
  );
}
