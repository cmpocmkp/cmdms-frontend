/**
 * PTF Meetings Detail Report
 * EXACT replica of admin/report/ptf/detail.blade.php from old CMDMS
 */

import { useState, useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Printer, List, Check, Target, RefreshCw, AlertTriangle, Clock, Eye, MessageSquare } from 'lucide-react';
import { generateMockPTFMeetingsDetail, PTFMeetingDetailMeeting } from '../../../lib/mocks/data/ptfMeetingsDetail';
import { mockDepartments } from '../../../lib/mocks/data/departments';

// Helper functions for badge status (matching old CMDMS)
const badgesWithIntegerStatus = (status: number | string | null | undefined): string => {
  if (status === null || status === undefined) return 'secondary';
  const statusNum = typeof status === 'string' ? parseInt(status) : status;
  const statusMap: Record<number, string> = {
    1: 'success',
    2: 'warning',
    3: 'danger',
    4: 'info',
    7: 'primary',
    6: 'info',
    9: 'warning'
  };
  return statusMap[statusNum] || 'secondary';
};

const badgesWithStringStatus = (status: number | string | null | undefined): string => {
  if (status === null || status === undefined) return 'No record found';
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
  return statusMap[statusNum] || 'No record found';
};

const badgesWithStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    'Completed': 'success',
    'On Target': 'warning',
    'Overdue': 'danger',
    'Off Target': 'info',
    'Ongoing': 'primary',
    'Overdue Other Reason': 'info',
    'Off Target Other Reason': 'warning'
  };
  return statusMap[status] || 'danger';
};

// Helper function to map old icon classes to Lucide React icons
const getIcon = (iconClass: string) => {
  const iconMap: Record<string, React.ComponentType<any>> = {
    'ti-list': List,
    'ti-check': Check,
    'ti-target': Target,
    'ti-reload': RefreshCw,
    'ti-alert': AlertTriangle,
    'ti-timer': Clock
  };
  return iconMap[iconClass] || List;
};

// Format date as d/m/Y
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

interface StatusCard {
  status: string;
  borderColor: string;
  title: string;
  minutesClass: string;
  percentClass: string;
  percent: number;
  icon: string;
}

export default function PTFMeetingsDetailReport() {
  const { deptId, status } = useParams<{ deptId: string; status: string }>();
  const [loading, setLoading] = useState(true);
  const [meetings, setMeetings] = useState<PTFMeetingDetailMeeting[]>([]);
  const [departmentName, setDepartmentName] = useState<string>('Department');

  useEffect(() => {
    // TODO: Replace with actual API call
    // Use default values if params are not available
    const deptIdNum = deptId ? parseInt(deptId) : 1;
    const statusNum = status ? parseInt(status) : 5; // Default to 5 (all decisions)
    
    const mockMeetings = generateMockPTFMeetingsDetail(deptIdNum, statusNum);
    setMeetings(mockMeetings);
    
    // Find department name
    const dept = mockDepartments.find(d => Number(d.id) === deptIdNum);
    if (dept) {
      setDepartmentName(dept.name);
    } else {
      setDepartmentName('Department');
    }
    
    setLoading(false);
  }, [deptId, status]);

  // Calculate statistics
  const statistics = useMemo(() => {
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
          case 'Completed':
            completed_count++;
            break;
          case 'On Target':
            on_target_count++;
            break;
          case 'Off Target':
            off_target_count++;
            break;
          case 'Overdue Other Reason':
            overdue_other_count++;
            break;
          case 'Ongoing':
            on_going_count++;
            break;
          default:
            overdue_count++;
            break;
        }
      });
    });

    const total = total_count || 1; // Avoid division by zero
    return {
      total: total_count,
      completed: completed_count,
      on_target: on_target_count,
      off_target: off_target_count,
      overdue: overdue_count,
      overdue_other: overdue_other_count,
      off_target_other: off_target_other_count,
      on_going: on_going_count,
      percentages: {
        completed: (completed_count / total) * 100,
        on_target: (on_target_count / total) * 100,
        off_target: (off_target_count / total) * 100,
        overdue: (overdue_count / total) * 100,
        overdue_other: (overdue_other_count / total) * 100,
        off_target_other: (off_target_other_count / total) * 100,
        on_going: (on_going_count / total) * 100
      }
    };
  }, [meetings]);

  // Status cards configuration (8 cards matching old CMDMS)
  const statusCards: StatusCard[] = useMemo(() => [
    {
      status: '5',
      borderColor: '#3282FF',
      title: 'Decisions',
      minutesClass: 'total_minutes',
      percentClass: '',
      percent: 0,
      icon: 'ti-list'
    },
    {
      status: '1',
      borderColor: '#0E8160',
      title: 'Completed',
      minutesClass: 'completed_minutes',
      percentClass: 'compl_percent',
      percent: statistics.percentages.completed,
      icon: 'ti-check'
    },
    {
      status: '2',
      borderColor: '#1DC39F',
      title: 'On Target',
      minutesClass: 'on_target_minutes',
      percentClass: 'on_percent',
      percent: statistics.percentages.on_target,
      icon: 'ti-target'
    },
    {
      status: '7',
      borderColor: '#F8C146',
      title: 'On Going',
      minutesClass: 'on_going_minutes',
      percentClass: 'on_going_percent',
      percent: statistics.percentages.on_going,
      icon: 'ti-reload'
    },
    {
      status: '4',
      borderColor: '#E74039',
      title: 'Off Target',
      minutesClass: 'off_target_minutes',
      percentClass: 'off_percent',
      percent: statistics.percentages.off_target,
      icon: 'ti-alert'
    },
    {
      status: '3',
      borderColor: '#FD7E01',
      title: 'Overdue',
      minutesClass: 'overdue_minutes',
      percentClass: 'over_percent',
      percent: statistics.percentages.overdue,
      icon: 'ti-timer'
    },
    {
      status: '9',
      borderColor: '#f3726d',
      title: 'Off Target Reason',
      minutesClass: 'off_target_other',
      percentClass: 'off_target_other_percent',
      percent: statistics.percentages.off_target_other,
      icon: 'ti-alert'
    },
    {
      status: '6',
      borderColor: '#874EFF',
      title: 'Overdue Reason',
      minutesClass: 'overdue_minutes_other',
      percentClass: 'over_other_percent',
      percent: statistics.percentages.overdue_other,
      icon: 'ti-timer'
    }
  ], [statistics.percentages]);

  // Calculate remaining/delay days for timeline
  const getTimelineInfo = (timeline: string, status: string) => {
    const timelineDate = new Date(timeline);
    const today = new Date();
    const diffTime = timelineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (status === 'On Target') {
      const totalDays = diffDays;
      const dayText = totalDays === 1 ? ' day' : ' days';
      return (
        <>
          <br />
          <span style={{ color: 'red', fontSize: '14px' }}>Remaining {totalDays}{dayText}</span>
        </>
      );
    } else if (status === 'Overdue') {
      const difrence = Math.abs(diffDays);
      const dayText = difrence === 1 ? ' day' : ' days';
      return (
        <>
          <br />
          <span style={{ color: 'red', fontSize: '12px' }}>Delay {difrence}{dayText}</span>
        </>
      );
    }
    return null;
  };

  // Get meeting ownership data for popover
  const getMeetingOwnershipData = (meeting: PTFMeetingDetailMeeting): string => {
    let data = '';
    if (meeting.creator?.name) {
      data += `Created by: ${meeting.creator.name}`;
      data += `<br/>Created at: ${formatDate(meeting.created_at)}`;
    }
    if (meeting.editor?.name) {
      data += `<br/>Last Updated by: ${meeting.editor.name}`;
      data += `<br/>Updated at: ${formatDate(meeting.updated_at)}`;
    }
    return data;
  };

  // Print function
  const handlePrint = () => {
    const printContent = document.getElementById('printmymodal');
    if (printContent) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Print</title>
              <style>
                body { font-family: Arial, sans-serif; }
                table { width: 100%; border-collapse: collapse; }
                th, td { border: 1px solid silver; padding: 8px; text-align: center; }
                th { background-color: rgb(37, 136, 95); color: white; }
                .d-decision { text-align: left; }
              </style>
            </head>
            <body>
              ${printContent.innerHTML}
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
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
        .table th,
        .jsgrid .jsgrid-table th,
        .table td,
        .jsgrid .jsgrid-table td {
          padding: 0.5rem 1rem !important;
        }
        .d-decision {
          text-wrap: wrap !important;
        }
        .record-notes-custom-card-analytics {
          border-radius: 15px;
          margin-bottom: 10px !important;
          background: #fff !important;
          transition: all 0.2s linear;
          height: auto !important;
          padding: 0px !important;
          border: 2px solid #e3e3e3;
          cursor: pointer;
        }
        .record-notes-custom-card-analytics:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        .record-notes-custom-card-analytics .card-body {
          display: flex;
          justify-content: flex-start !important;
          flex-direction: column;
          padding: 15px !important;
        }
        .record-notes-custom-card-analytics .icon {
          width: 60px;
          height: 60px;
          border-radius: 100%;
          margin-bottom: 10px;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #fff;
        }
        .record-notes-custom-card-analytics .icon svg {
          color: white !important;
        }
        .record-notes-custom-card-analytics h3 {
          text-align: left !important;
          font-size: 2rem !important;
          margin-bottom: 0.5rem !important;
        }
        .record-notes-custom-card-analytics p {
          color: #000 !important;
          text-align: left !important;
          margin: 5px 0 !important;
        }
        .record-notes-custom-card-analytics .card-body p.mb-0 {
          font-size: 1rem !important;
          font-weight: 400 !important;
        }
        .record-notes-custom-card-analytics .card-body p {
          font-weight: bold;
        }
      `}</style>

      <div className="card">
        <div className="card-body">
          <Link 
            to="/admin/report/ptf/meetings" 
            style={{ float: 'right' }}
          >
            Back
          </Link>
          <h4 className="text-center text-primary">
            Minutes of the meetings - {departmentName}
          </h4>

          {/* Status Cards */}
          <div className="row my-5 d-flex justify-content-end">
            {statusCards.map((card, index) => {
              const IconComponent = getIcon(card.icon);
              let count = 0;
              let percentClass = card.percentClass;
              
              switch (card.status) {
                case '5':
                  count = statistics.total;
                  break;
                case '1':
                  count = statistics.completed;
                  break;
                case '2':
                  count = statistics.on_target;
                  break;
                case '7':
                  count = statistics.on_going;
                  break;
                case '4':
                  count = statistics.off_target;
                  break;
                case '3':
                  count = statistics.overdue;
                  break;
                case '9':
                  count = statistics.off_target_other;
                  break;
                case '6':
                  count = statistics.overdue_other;
                  break;
              }

              return (
                <div key={index} className="col-md-2 p-2">
                  <Link to={`/admin/report/ptf/detail/meetings/${deptId}/${card.status}`}>
                    <div 
                      className="card record-notes-custom-card-analytics"
                      style={{ borderBottom: `8px solid ${card.borderColor}` }}
                    >
                      <div className="card-body">
                        <div className="icon" style={{ background: card.borderColor }}>
                          <IconComponent size={24} color="white" />
                        </div>
                        <h3 
                          className={`mb-2 ${card.minutesClass}`}
                          style={{ color: card.borderColor }}
                        >
                          {count}
                        </h3>
                        <p>{card.title}</p>
                        <p className={`mb-0 mt-2 ${percentClass}`}>
                          {card.percent === 0 ? '\u00A0' : `${card.percent.toFixed(2)}%`}
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>

          {/* Print Button */}
          <div className="row">
            <div className="col-12">
              <button 
                type="button" 
                className="btn btn-info btn-icon-text pull-right" 
                id="btnPrint"
                onClick={handlePrint}
              >
                <Printer size={16} style={{ marginRight: '4px' }} />
                Print all Minutes
              </button>
            </div>
          </div>

          {/* Table Section */}
          <div id="printmymodal">
            <div className="row">
              <div className="col-12">
                <div className="table-responsive">
                  <table id="department_decision_detial_repsort" className="table table-striped">
                    <thead style={{ background: 'rgb(37, 136, 95)', color: 'white' }}>
                      {meetings.length > 0 && meetings[0] && (
                        <>
                          <tr className="bg-lightgray-color-white">
                            <th colSpan={5} style={{ background: '#56c77d', color: 'white' }}>
                              <h6 style={{ margin: 0, textAlign: 'right' }}>
                                {/* PDF and WORD buttons would go here for admin users */}
                              </h6>
                            </th>
                          </tr>
                          <tr className="dd-meeting-title-heading">
                            <th colSpan={5} style={{ padding: '8px', whiteSpace: 'unset' }}>
                              <h4 className="text-center">
                                {meetings[0].subject}
                              </h4>
                            </th>
                          </tr>
                        </>
                      )}

                      {meetings.length > 0 && (
                        <tr style={{ background: 'rgb(37, 136, 95)', color: 'white' }}>
                          <th style={{ width: '5px' }}>S.NO</th>
                          <th style={{ width: '5px' }}>Decision</th>
                          <th className="pres">Responsibility</th>
                          <th style={{ width: '30px' }}>Timeline</th>
                          <th style={{ width: '15px' }}>Status</th>
                        </tr>
                      )}
                    </thead>
                    <tbody>
                      {meetings.length > 0 ? (
                        meetings.flatMap((meeting, meetingIndex) => {
                          const meetingOwnershipData = getMeetingOwnershipData(meeting);
                          const rows: JSX.Element[] = [];

                          // Add meeting header for meetings after the first one
                          if (meetingIndex > 0) {
                            rows.push(
                              <tr key={`header-print-${meeting.id}`} className="bg-lightgray-color-white">
                                <td colSpan={5} style={{ background: '#56c77d', color: 'white' }}>
                                  <h6 style={{ margin: 0, textAlign: 'right' }}>
                                    {/* PDF and WORD buttons would go here */}
                                  </h6>
                                </td>
                              </tr>
                            );
                            
                            rows.push(
                              <tr key={`header-subject-${meeting.id}`} className="dd-meeting-title-heading">
                                <th colSpan={5} style={{ padding: '8px' }}>
                                  <center>
                                    <h4>
                                      {meeting.subject}
                                    </h4>
                                  </center>
                                </th>
                              </tr>
                            );
                            
                            rows.push(
                              <tr key={`header-columns-${meeting.id}`} className="table-head-bg-color" style={{ background: 'rgb(37, 136, 95)', color: 'white' }}>
                                <th style={{ width: '5px' }}>S.NO</th>
                                <th style={{ width: '5px' }}>Decision</th>
                                <th className="pres">Responsibility</th>
                                <th style={{ width: '30px' }}>Timeline</th>
                                <th style={{ width: '15px' }}>Status</th>
                              </tr>
                            );
                          }

                          // Add minute rows
                          meeting.minutes.forEach((minute, minuteIndex) => {
                            // Get last comment/reply for each department to determine department status
                            const getDepartmentStatus = (dept: typeof minute.departments[0]): number | null => {
                              const lastReply = minute.replies?.find(r => r.department_id === dept.id);
                              return lastReply?.status || null;
                            };

                            rows.push(
                              <tr key={`minute-${meeting.id}-${minute.id}`} id={`decision${minute.id}`}>
                                <td>
                                  <button
                                    style={{ width: '25px', height: '25px', padding: '0.1rem 0rem' }}
                                    type="button"
                                    className="btn btn-outline-secondary btn-rounded btn-icon text-dark"
                                    title={meetingOwnershipData.replace(/<br\/>/g, '\n')}
                                  >
                                    {minuteIndex + 1}
                                  </button>
                                </td>
                                <td className="d-decision" dangerouslySetInnerHTML={{ __html: `${minute.issues || ''} ${minute.comments || ''}` }} />
                                <td>
                                  <table style={{ width: '100%' }}>
                                    <thead>
                                      <tr style={{ backgroundColor: '#25885F', color: 'white' }}>
                                        <th>Department's</th>
                                        <th>Dept. Status</th>
                                        <th>CM Office Status</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {minute.departments.map((dept) => {
                                        const deptStatus = getDepartmentStatus(dept);
                                        const cmStatus = dept.pivot?.status;

                                        return (
                                          <tr key={dept.id}>
                                            <td>{dept.name}</td>
                                            <td>
                                              <span
                                                className={`badge badge-${badgesWithIntegerStatus(deptStatus)} badge-pill`}
                                              >
                                                {badgesWithStringStatus(deptStatus)}
                                              </span>
                                            </td>
                                            <td>
                                              <span
                                                className={`badge badge-${badgesWithIntegerStatus(cmStatus)} badge-pill`}
                                              >
                                                {badgesWithStringStatus(cmStatus)}
                                              </span>
                                            </td>
                                          </tr>
                                        );
                                      })}
                                    </tbody>
                                  </table>
                                </td>
                                <td style={{ width: '30px', fontWeight: 'bold', textAlign: 'center' }}>
                                  {formatDate(minute.timeline)}
                                  {getTimelineInfo(minute.timeline, minute.status)}
                                </td>
                                <td style={{ width: '15px', textAlign: 'center' }}>
                                  <Link
                                    to={`#`}
                                    style={{ cursor: 'pointer', display: 'block', marginBottom: '5px' }}
                                  >
                                    <label
                                      className={`badge badge-${badgesWithStatus(minute.status)} badge-pill`}
                                    >
                                      {minute.status}
                                    </label>
                                  </Link>

                                  {minute.departments.length > 0 && (
                                    <button
                                      type="button"
                                      className="btn btn-warning hide_in_print"
                                      title="More Details"
                                      style={{ marginBottom: '5px' }}
                                    >
                                      <Eye size={16} />
                                    </button>
                                  )}

                                  <Link
                                    to={`#`}
                                    className="btn btn-success"
                                    title="View Report"
                                    style={{ marginBottom: '5px' }}
                                  >
                                    <Printer size={16} />
                                  </Link>

                                  <Link
                                    to={`#`}
                                    className="btn btn-info"
                                    title="CM office and departments responses"
                                  >
                                    <MessageSquare size={16} />
                                  </Link>
                                </td>
                              </tr>
                            );
                          });

                          return rows;
                        })
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
    </div>
  );
}
