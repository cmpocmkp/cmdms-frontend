/**
 * Department Board Meeting Agenda Points Page
 * EXACT replica of department/boardmeetings/agendapoints/index.blade.php from old CMDMS
 * Structure, classes, and behavior preserved exactly
 */

import { useParams, Link } from 'react-router-dom';
import { getMockBoardMeetingById } from '../../lib/mocks/data/boardMeetings';
import { useMemo } from 'react';

export default function BoardMeetingAgendaPoints() {
  const { id } = useParams<{ id: string }>();
  
  // Get board meeting by ID
  const boardMeeting = useMemo(() => {
    if (!id) return null;
    return getMockBoardMeetingById(parseInt(id, 10));
  }, [id]);
  
  if (!boardMeeting) {
    return (
      <div className="content-wrapper">
        <div className="card">
          <div className="card-body">
            <p>Board meeting not found.</p>
            <Link to="/department/board-meetings" className="btn btn-primary">Back to Board Meetings</Link>
          </div>
        </div>
      </div>
    );
  }
  
  // Helper function to format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };
  
  // Calculate days remaining or delay
  const getTimelineInfo = (timeline: string, status: string): { text: string; color: string } => {
    const today = new Date();
    const timelineDate = new Date(timeline);
    const diffTime = timelineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (status === 'Implemented') {
      return { text: '', color: '' };
    } else if (status === 'Pending') {
      const delayDays = Math.abs(diffDays);
      const dayText = delayDays === 1 ? 'day' : 'days';
      return {
        text: `Delay ${delayDays} ${dayText}`,
        color: 'red'
      };
    } else {
      // On Target
      const remainDays = diffDays;
      const dayText = remainDays === 1 ? 'day' : 'days';
      return {
        text: `Remaining ${remainDays} ${dayText}`,
        color: 'green'
      };
    }
  };
  
  // Get badge class based on status
  const getBadgeClass = (status: string): string => {
    if (status === 'Implemented') return 'badge-success';
    if (status === 'Pending') return 'badge-danger';
    return 'badge-warning';
  };
  
  return (
    <div className="content-wrapper">
      <style>{`
        .record-notes-custom-card-analytics .card-body {
          height: 235px !important;
        }
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
        .table th,
        .jsgrid .jsgrid-table th,
        .table td,
        .jsgrid .jsgrid-table td {
          padding: 0.5rem 1rem !important;
        }
      `}</style>
      
      <div className="card">
        <div className="card-body">
          <Link to="/department/board-meetings" style={{ float: 'right' }}>
            Show Boards Meetings
          </Link>
          <p className="card-title">
            <strong>Board Meeting with detail</strong>
          </p>
          
          <div className="col-md-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <div className="d-sm-flex flex-row flex-wrap text-center text-sm-left align-items-center">
                  <div className="ml-sm-3 ml-md-0 ml-xl-3 mt-2 mt-sm-0 mt-md-2 mt-xl-0">
                    <h1 className="mb-3 display-6">
                      <span dangerouslySetInnerHTML={{ __html: boardMeeting.subject ?? '' }}></span>
                    </h1>
                    <p className="text-primary mb-2">
                      <i className="ti-calendar menu-icon"></i>
                      {formatDate(boardMeeting.date)}
                      {boardMeeting.attachments && boardMeeting.attachments.length > 0 && (
                        <>
                          <i className="ti-import"></i>
                          <a
                            href={`/storage/board_meeting_uploads/${boardMeeting.attachments[0]}`}
                            title="download the attached minutes"
                            className="mb-3"
                          >
                            Download minutes
                          </a>
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Status Cards */}
          <div className="row d-flex justify-content-center mb-5">
            {[
              {
                status: '1',
                borderColor: '#3282FF',
                title: 'Agenda Points',
                minutesClass: 'completed_minutes',
                percentClass: 'compl_percent',
                percent: '0',
                count: boardMeeting.total_agenda_points,
                icon: 'ti-list'
              },
              {
                status: '1',
                borderColor: '#0E8160',
                title: 'Implemented',
                minutesClass: 'completed_minutes',
                percentClass: 'compl_percent',
                percent: '0',
                count: boardMeeting.implemented_agenda,
                icon: 'ti-check'
              },
              {
                status: '9',
                borderColor: '#E74039',
                title: 'Pending',
                minutesClass: 'off_target_other',
                percentClass: 'off_target_other',
                percent: '0',
                count: boardMeeting.pending_agenda,
                icon: 'ti-alert'
              }
            ].map((card) => (
              <div key={card.title} className="col-md-2 p-2">
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
                      {card.count}
                    </h3>
                    <p>{card.title}</p>
                    <p className={`mb-0 mt-2 ${card.percentClass}`}>
                      {card.percent === '0' ? '\u00A0' : card.percent}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Agenda Points Table */}
          <div className="container">
            <table
              id="department_decision_detial_repsort"
              className="record-note-listing table table-bordered"
            >
              <thead style={{ background: 'rgb(37, 136, 95)', color: 'white' }}>
                <tr>
                  <th>S.NO</th>
                  <th>Agenda Point</th>
                  <th>Decision</th>
                  <th>Responsibility</th>
                  <th style={{ width: '150px' }}>Timeline</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {boardMeeting.agendaPoints.map((agenda, index) => {
                  const timelineInfo = getTimelineInfo(agenda.timeline, agenda.status);
                  return (
                    <tr key={agenda.id}>
                      <td>{index + 1}</td>
                      <td>
                        <span dangerouslySetInnerHTML={{ __html: agenda.item }}></span>
                      </td>
                      <td>
                        <span dangerouslySetInnerHTML={{ __html: agenda.decision }}></span>
                      </td>
                      <td>
                        <span dangerouslySetInnerHTML={{ __html: agenda.responsibility }}></span>
                      </td>
                      <td>
                        {formatDate(agenda.timeline)}
                        <br />
                        {timelineInfo.text && (
                          <span style={{ color: timelineInfo.color, fontSize: '16px' }}>
                            {timelineInfo.text}
                          </span>
                        )}
                      </td>
                      <td>
                        {agenda.status === 'Pending' ? (
                          <label
                            style={{ width: '85px', background: '#E74039 !important' }}
                            className={`badge ${getBadgeClass(agenda.status)} badge-pill`}
                          >
                            {agenda.status ?? ''}
                          </label>
                        ) : (
                          <label
                            style={{ width: '115px' }}
                            className={`badge ${getBadgeClass(agenda.status)} badge-pill`}
                          >
                            {agenda.status ?? ''}
                          </label>
                        )}
                      </td>
                      <td>
                        <Link
                          to={`/department/board-meetings/agenda-point/${agenda.id}/replies`}
                          style={{ padding: '0.3rem 1rem' }}
                          className="btn btn-primary btn-sm active"
                          role="button"
                        >
                          Progress so far
                        </Link>
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

