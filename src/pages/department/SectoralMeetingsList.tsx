/**
 * Department Sectorial Meetings List Page
 * Based on department/sectorialmeetings/index.blade.php from old CMDMS
 * EXACT replica - structure, classes, and behavior preserved
 */

import React, { useMemo, useState, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { mockSectorialMeetings, mockAgendaPoints, AgendaPoint } from '../../lib/mocks/data/sectorialMeetings';

interface MeetingWithAgendaPoints {
  meeting: {
    id: number;
    subject: string;
    date: string;
    attachment?: string;
  };
  agendaPoints: AgendaPoint[];
}

interface StatusSummary {
  total: number;
  'Completed': { count: number; percent: number };
  'On Target': { count: number; percent: number };
  'Overdue': { count: number; percent: number };
  'Off Target'?: { count: number; percent: number };
}

// Helper function to generate department sectorial meetings data
function generateDepartmentSectorialMeetings(departmentId: number) {
  // Filter agenda points assigned to this department
  const departmentAgendaPoints = mockAgendaPoints.filter(point =>
    point.departments.some(dept => dept.id === departmentId)
  );

  // Group agenda points by meeting
  const meetingsMap = new Map<number, MeetingWithAgendaPoints>();
  
  departmentAgendaPoints.forEach(point => {
    const meeting = mockSectorialMeetings.find(m => m.id === point.meeting_id);
    if (meeting) {
      if (!meetingsMap.has(meeting.id)) {
        meetingsMap.set(meeting.id, {
          meeting: {
            id: meeting.id,
            subject: meeting.subject,
            date: meeting.date,
            attachment: meeting.attachments?.[0]
          },
          agendaPoints: []
        });
      }
      meetingsMap.get(meeting.id)!.agendaPoints.push(point);
    }
  });

  const meetings = Array.from(meetingsMap.values());

  // Calculate summary - get status from department pivot or agenda point status
  const total = departmentAgendaPoints.length;
  const completed = departmentAgendaPoints.filter(p => {
    const deptStatus = p.departments.find(d => d.id === departmentId)?.status;
    return deptStatus === 'Completed' || (!deptStatus && p.status === 1);
  }).length;
  const onTarget = departmentAgendaPoints.filter(p => {
    const deptStatus = p.departments.find(d => d.id === departmentId)?.status;
    return deptStatus === 'On Target' || (!deptStatus && p.status === 2);
  }).length;
  const overdue = departmentAgendaPoints.filter(p => {
    const deptStatus = p.departments.find(d => d.id === departmentId)?.status;
    return deptStatus === 'Overdue' || (!deptStatus && p.status === 3);
  }).length;
  const offTarget = departmentAgendaPoints.filter(p => {
    const deptStatus = p.departments.find(d => d.id === departmentId)?.status;
    return deptStatus === 'Off Target' || (!deptStatus && p.status === 4);
  }).length;

  const summary: StatusSummary = {
    total,
    'Completed': {
      count: completed,
      percent: total > 0 ? Math.round((completed / total) * 100) : 0
    },
    'On Target': {
      count: onTarget,
      percent: total > 0 ? Math.round((onTarget / total) * 100) : 0
    },
    'Overdue': {
      count: overdue,
      percent: total > 0 ? Math.round((overdue / total) * 100) : 0
    },
    'Off Target': {
      count: offTarget,
      percent: total > 0 ? Math.round((offTarget / total) * 100) : 0
    }
  };

  return { meetings, summary };
}

// Status Badge Component
function StatusBadge({ status }: { status: number | string | undefined }) {
  if (!status) return <span className="badge badge-pill badge-secondary">Unknown</span>;
  
  const statusNum = typeof status === 'string' ? parseInt(status) : status;
  
  const statusMap: { [key: number]: { label: string; badgeClass: string } } = {
    1: { label: 'Completed', badgeClass: 'badge-success' },
    2: { label: 'On Target', badgeClass: 'badge-warning' },
    3: { label: 'Overdue', badgeClass: 'badge-danger' },
    4: { label: 'Off Target', badgeClass: 'badge-info' },
    6: { label: 'Overdue Other Reason', badgeClass: 'badge-indigo' },
    7: { label: 'Ongoing', badgeClass: 'badge-ongoing' },
    9: { label: 'Off Target Other Reason', badgeClass: 'badge-lightred' }
  };

  const statusInfo = statusMap[statusNum] || { label: 'Unknown', badgeClass: 'badge-secondary' };

  return (
    <span className={`badge badge-pill ${statusInfo.badgeClass}`}>
      {statusInfo.label}
    </span>
  );
}

export default function SectoralMeetingsList() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const statusFilter = searchParams.get('status') || '';
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [currentPage, setCurrentPage] = useState(1);
  const tableRef = useRef<HTMLTableElement>(null);

  const departmentId = user?.department_id || 14;

  const { meetings, summary } = useMemo(() => 
    generateDepartmentSectorialMeetings(departmentId),
    [departmentId]
  );

  // Filter by status
  const filteredMeetings = useMemo(() => {
    if (!statusFilter) return meetings;

    const statusMap: { [key: string]: string } = {
      '1': 'Completed',
      '2': 'On Target',
      '3': 'Overdue',
      '4': 'Off Target'
    };

    const targetStatus = statusMap[statusFilter];
    if (!targetStatus) return meetings;

    return meetings.map(meeting => ({
      ...meeting,
      agendaPoints: meeting.agendaPoints.filter(point => {
        const deptStatus = point.departments.find(d => d.id === departmentId)?.status;
        return deptStatus === targetStatus || (!deptStatus && getStatusFromNumber(point.status) === targetStatus);
      })
    })).filter(meeting => meeting.agendaPoints.length > 0);
  }, [meetings, statusFilter, departmentId]);

  // Helper to get status string from number
  const getStatusFromNumber = (status: number | undefined): string => {
    if (!status) return '';
    const statusMap: { [key: number]: string } = {
      1: 'Completed',
      2: 'On Target',
      3: 'Overdue',
      4: 'Off Target',
      6: 'Overdue Other Reason',
      7: 'Ongoing',
      9: 'Off Target Other Reason'
    };
    return statusMap[status] || '';
  };

  // Flatten agenda points for pagination
  const allAgendaPoints: Array<{ meeting: MeetingWithAgendaPoints['meeting']; point: AgendaPoint; index: number }> = [];
  let globalIndex = 1;
  filteredMeetings.forEach(meeting => {
    meeting.agendaPoints.forEach(point => {
      allAgendaPoints.push({ meeting: meeting.meeting, point, index: globalIndex++ });
    });
  });

  // Pagination
  const totalPoints = allAgendaPoints.length;
  const totalPages = Math.ceil(totalPoints / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedPoints = allAgendaPoints.slice(startIndex, endIndex);
  const firstItem = startIndex + 1;
  const lastItem = Math.min(endIndex, totalPoints);

  // Group paginated points by meeting for display
  const groupedPoints = useMemo(() => {
    const groups: { [key: number]: { meeting: MeetingWithAgendaPoints['meeting']; points: Array<{ point: AgendaPoint; index: number }> } } = {};
    
    paginatedPoints.forEach(({ meeting, point, index }) => {
      if (!groups[meeting.id]) {
        groups[meeting.id] = { meeting, points: [] };
      }
      groups[meeting.id].points.push({ point, index });
    });

    return Object.values(groups);
  }, [paginatedPoints]);

  // Status cards configuration - matching old CMDMS progressStatuses()
  // progressStatuses() returns: COMPLETED, ON_TARGET, OVERDUE (and OFF_TARGET is commented out but shown in UI)
  const allowedStatuses = [
    { value: '', label: 'Total', color: '#3282FF', icon: 'ti-list' },
    { value: '1', label: 'Completed', color: '#0E8160', icon: 'ti-check' },
    { value: '2', label: 'On Target', color: '#1DC39F', icon: 'ti-target' },
    { value: '4', label: 'Off Target', color: '#E74039', icon: 'ti-alert' },
    { value: '3', label: 'Overdue', color: '#FD7E01', icon: 'ti-timer' }
  ];

  const getCardData = (statusValue: string) => {
    if (statusValue === '') {
      return {
        count: summary.total,
        percent: 0,
        title: 'Total'
      };
    }

    const statusMap: { [key: string]: keyof StatusSummary } = {
      '1': 'Completed',
      '2': 'On Target',
      '3': 'Overdue',
      '4': 'Off Target'
    };

    const statusKey = statusMap[statusValue];
    if (!statusKey || !summary[statusKey]) {
      return { count: 0, percent: 0, title: '' };
    }

    const statusData = summary[statusKey];
    // Type guard to ensure statusData is an object with count and percent
    if (typeof statusData === 'number') {
      return { count: 0, percent: 0, title: '' };
    }
    
    return {
      count: statusData.count,
      percent: statusData.percent,
      title: statusKey
    };
  };

  const handlePerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  return (
    <div className="content-wrapper">
      <style>{`
        .select2-container--default .select2-selection--single .select2-selection__arrow {
          height: 26px !important;
          position: absolute !important;
          top: 10px !important;
          right: 10px !important;
          width: unset !important;
        }
        table#record-note-listing {
          width: 100% !important;
        }
        #record-note-listing td {
          vertical-align: top !important;
          font-size: 16px !important;
          min-height: 35px !important;
          border: 0.5px solid #dfdddd !important;
          color: #49525a !important;
          text-align: center !important;
        }
        #record-note-listing td ul li {
          font-size: 16px !important;
        }
        #record-note-listing th {
          border: 0.5px solid #dfdddd !important;
          text-align: center;
          padding: 15px;
        }
        #record-note-listing td div, u, b, p {
          width: 100% !important;
        }
        .card-body p {
          font-size: 16px;
        }
        .badge.badge-pill {
          font-size: 12px !important;
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
        .table th, .jsgrid .jsgrid-table th, .table td, .jsgrid .jsgrid-table td {
          padding: 10px !important;
        }
        #record-note-listing td ul li {
          font-size: 16px !important;
        }
        #record-note-listing tr {
          height: 20px !important;
        }
        h5 {
          font-size: 16px !important;
        }
        table#record-note-listing-new {
          width: 100% !important;
        }
        #record-note-listing-new thead th {
          background: rgb(37, 136, 95) !important;
          color: white !important;
        }
        .record-notes-custom-card-analytics {
          border-radius: 15px;
          margin-bottom: 10px !important;
          background: #fff !important;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;
          transition: transform 0.2s, box-shadow 0.2s !important;
        }
        .record-notes-custom-card-analytics:hover {
          transform: translateY(-2px) !important;
          box-shadow: 0 4px 8px rgba(0,0,0,0.15) !important;
        }
        .record-notes-custom-card-analytics .icon {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 15px;
        }
        .record-notes-custom-card-analytics .icon i {
          font-size: 24px;
          color: white;
        }
        .record-notes-custom-card-analytics h3 {
          font-size: 32px;
          font-weight: bold;
          margin-bottom: 10px;
        }
        .record-notes-custom-card-analytics p {
          font-size: 14px;
          margin-bottom: 5px;
        }
        .dd-meeting-title-heading td {
          padding: 15px !important;
        }
      `}</style>

      <div className="card">
        <div className="card-header text-center">
          <p className="block display-4">Sectoral Agenda Points</p>
          <p className="block display-5">{user?.department?.name || 'Department'} Department</p>
        </div>
        <div className="card-body">
          {/* Status Cards */}
          <div className="row my-5 d-flex justify-content-center">
            {allowedStatuses.map((status) => {
              const cardData = getCardData(status.value);
              
              return (
                <div key={status.value} className="col-md-2 p-2">
                  <Link
                    to={`/department/sectorial-meetings?status=${status.value}`}
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    <div
                      className="card record-notes-custom-card-analytics"
                      style={{
                        borderBottom: statusFilter === status.value ? `8px solid ${status.color}` : `8px solid ${status.color}`,
                        border: statusFilter === status.value ? `8px solid ${status.color}` : undefined
                      }}
                    >
                      <div className="card-body">
                        <div className="icon" style={{ background: status.color }}>
                          <i className={status.icon}></i>
                        </div>
                        <h3 className="mb-2" style={{ color: status.color }}>
                          {cardData.count}
                        </h3>
                        <p>{cardData.title}</p>
                        <p className="mb-0 mt-2">
                          {cardData.percent === 0 ? '\u00A0' : `${cardData.percent}%`}
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>

          {/* Table */}
          <div className="row">
            <div className="col-12">
              <div className="table-responsive">
                <table ref={tableRef} id="record-note-listing-new" className="table table-bordered table-condensed" role="grid" style={{ width: '100%' }}>
                  <thead>
                    <tr>
                      <th>S.NO</th>
                      <th>Agenda item</th>
                      <th>Decision</th>
                      <th>Progress</th>
                      <th>Responsibility</th>
                      <th>Timeline</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupedPoints.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="text-center">
                          There is no data.
                        </td>
                      </tr>
                    ) : (
                      groupedPoints.map(({ meeting, points }) => (
                        <React.Fragment key={meeting.id}>
                          {/* Meeting Header Row */}
                          <tr className="dd-meeting-title-heading even">
                            <td colSpan={8} className="text-center" style={{ width: '100%' }}>
                              <h4>
                                {meeting.subject} - {new Date(meeting.date).toLocaleDateString('en-GB')}
                              </h4>
                              {meeting.attachment && (
                                <a
                                  href={`/storage/meetings_uploads/${meeting.attachment}`}
                                  title="download the attached minutes"
                                  className="mb-3 btn btn-primary btn-icon-text"
                                >
                                  <i className="ti-download btn-icon-prepend"></i> Download attachment
                                </a>
                              )}
                            </td>
                            <td data-print="false" style={{ display: 'none' }}>&nbsp;</td>
                            <td data-print="false" style={{ display: 'none' }}>&nbsp;</td>
                            <td data-print="false" style={{ display: 'none' }}>&nbsp;</td>
                            <td data-print="false" style={{ display: 'none' }}>&nbsp;</td>
                            <td data-print="false" style={{ display: 'none' }}>&nbsp;</td>
                            <td data-print="false" style={{ display: 'none' }}>&nbsp;</td>
                            <td data-print="false" style={{ display: 'none' }}>&nbsp;</td>
                          </tr>
                          {/* Agenda Points Rows */}
                          {points.map(({ point, index }) => {
                            const deptStatus = point.departments.find(d => d.id === departmentId);
                            const statusValue = deptStatus?.status 
                              ? (typeof deptStatus.status === 'string' ? parseInt(deptStatus.status) : deptStatus.status)
                              : point.status;
                            
                            return (
                              <tr key={point.id} id={`minute${point.id}`}>
                                <td>{index}</td>
                                <td dangerouslySetInnerHTML={{ __html: point.item || '' }}></td>
                                <td dangerouslySetInnerHTML={{ __html: point.decision || '' }}></td>
                                <td dangerouslySetInnerHTML={{ __html: point.comments || '' }}></td>
                                <td dangerouslySetInnerHTML={{ __html: point.responsibility || '' }}></td>
                                <td>{point.timeline ? new Date(point.timeline).toLocaleDateString('en-GB') : 'N/A'}</td>
                                <td>
                                  <StatusBadge status={statusValue} />
                                </td>
                                <td className="text-center">
                                  <Link
                                    to={`/department/sectorial-meetings/${point.id}/reply?status=${statusFilter}&page=${currentPage}`}
                                    style={{ padding: '0.3rem 1rem' }}
                                    className="btn btn-info"
                                    role="button"
                                    aria-pressed="true"
                                    title="View Chat history"
                                  >
                                    <i className="ti-comments"></i>
                                  </Link>
                                </td>
                              </tr>
                            );
                          })}
                        </React.Fragment>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Pagination Footer */}
        <div className="card-footer mt-3 border">
          <div className="row align-items-center">
            <div className="col">
              <div className="form-group mb-0 row align-items-center">
                <label htmlFor="perPage" className="col-sm-3 col-form-label mb-0">
                  Show
                </label>
                <select
                  id="perPage"
                  className="form-control form-control-sm col-sm-3"
                  value={itemsPerPage}
                  onChange={handlePerPageChange}
                >
                  {[10, 15, 25, 50, 100].map(option => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <span className="inline-block col-sm-6"> per page</span>
              </div>
            </div>
            <div className="col text-center">
              <p>
                Showing <strong>{firstItem}</strong> to <strong>{lastItem}</strong> of total{' '}
                <strong>{totalPoints}</strong> records.
              </p>
            </div>
            <div className="col d-flex justify-content-end">
              <nav>
                <ul className="pagination mb-0">
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </button>
                  </li>
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(page => {
                      return (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      );
                    })
                    .map((page, idx, arr) => {
                      const prevPage = arr[idx - 1];
                      const showEllipsis = prevPage && page - prevPage > 1;
                      
                      return (
                        <React.Fragment key={page}>
                          {showEllipsis && (
                            <li className="page-item disabled">
                              <span className="page-link">...</span>
                            </li>
                          )}
                          <li className={`page-item ${currentPage === page ? 'active' : ''}`}>
                            <button
                              className="page-link"
                              onClick={() => setCurrentPage(page)}
                            >
                              {page}
                            </button>
                          </li>
                        </React.Fragment>
                      );
                    })}
                  <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

