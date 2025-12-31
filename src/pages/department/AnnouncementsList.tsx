/**
 * Department Announcements List Page
 * Based on department/announcements/index.blade.php from old CMDMS
 * EXACT replica - structure, classes, and behavior preserved
 */

import React, { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { mockAnnouncements, mockAnnouncementDetails, AnnouncementDetail } from '../../lib/mocks/data/announcements';

// Helper functions matching old CMDMS badgesWithIntegerStatus and badgesWithStringStatus
const badgesWithIntegerStatus = (status: number | string | undefined): string => {
  if (!status) return 'danger';
  const statusNum = typeof status === 'string' ? parseInt(status) : status;
  
  const statusMap: { [key: number]: string } = {
    1: 'success',   // Completed
    2: 'warning',   // On Target
    3: 'danger',    // Overdue
    4: 'info',      // Off Target
    7: 'ongoing',   // Ongoing
    6: 'indigo',    // Overdue Other Reason
    9: 'lightred'   // Off Target Other Reason
  };
  
  return statusMap[statusNum] || 'danger';
};

const badgesWithStringStatus = (status: number | string | undefined): string => {
  if (!status) return 'Overdue';
  const statusNum = typeof status === 'string' ? parseInt(status) : status;
  
  const statusMap: { [key: number]: string } = {
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

export default function AnnouncementsList() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const statusFilter = searchParams.get('status') || '';
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);

  const departmentId = user?.department_id;

  // Group announcement details by announcement_id and filter by department
  const departmentAnnouncements = useMemo(() => {
    if (!departmentId) return [];

    // Get all announcement details for this department
    const deptDetails = mockAnnouncementDetails.filter(detail => detail.department_id === departmentId);

    // Group by announcement_id
    const grouped = new Map<number, {
      announcement: typeof mockAnnouncements[0];
      details: AnnouncementDetail[];
      otherDepartments: Array<{ name: string; status: number | string }>;
    }>();

    deptDetails.forEach(detail => {
      const announcement = mockAnnouncements.find(a => a.id === detail.announcement_id);
      if (!announcement) return;

      if (!grouped.has(announcement.id)) {
        // Get other departments for this announcement
        const otherDepts = mockAnnouncementDetails
          .filter(d => d.announcement_id === announcement.id && d.department_id !== departmentId)
          .map(d => ({
            name: d.department_name,
            status: typeof d.status === 'string' ? parseInt(d.status) : d.status || 2
          }));

        grouped.set(announcement.id, {
          announcement,
          details: [],
          otherDepartments: otherDepts
        });
      }

      grouped.get(announcement.id)!.details.push(detail);
    });

    // Convert to array and filter by status if needed
    // Note: The 'id' in the result should be the announcement_detail id (not announcement id) for the route
    let result = Array.from(grouped.values()).map(item => {
      const detail = item.details[0];
      const statusValue = detail?.status || 2; // Default to On Target
      return {
        id: detail?.id || 0, // Use detail id for route (announcementDetail id)
        announcement_id: item.announcement.id, // Keep announcement id for reference
        title: detail?.subject || detail?.title || `Announcement ${item.announcement.id}`,
        district: item.announcement.district_name,
        other_departments: item.otherDepartments.map(dept => ({
          name: dept.name,
          status: typeof dept.status === 'string' ? parseInt(dept.status) : dept.status || 2
        })),
        date: item.announcement.date,
        timeline: detail?.timeline || item.announcement.date,
        status: typeof statusValue === 'string' ? parseInt(statusValue) : statusValue
      };
    });

    if (statusFilter) {
      const statusNum = parseInt(statusFilter);
      result = result.filter(item => item.status === statusNum);
    }

    return result;
  }, [departmentId, statusFilter]);

  // Calculate summary
  const summary = useMemo(() => {
    if (!departmentId) {
      return {
        total: 0,
        'Completed': { count: 0, percent: 0 },
        'On Target': { count: 0, percent: 0 },
        'Overdue': { count: 0, percent: 0 }
      };
    }

    const deptDetails = mockAnnouncementDetails.filter(detail => detail.department_id === departmentId);
    const grouped = new Set(deptDetails.map(d => d.announcement_id));
    const total = grouped.size;

    const completed = deptDetails.filter(d => {
      const status = typeof d.status === 'string' ? parseInt(d.status) : d.status;
      return status === 1;
    }).length;
    const onTarget = deptDetails.filter(d => {
      const status = typeof d.status === 'string' ? parseInt(d.status) : d.status;
      return status === 2;
    }).length;
    const overdue = deptDetails.filter(d => {
      const status = typeof d.status === 'string' ? parseInt(d.status) : d.status;
      return status === 3;
    }).length;

    return {
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
      }
    };
  }, [departmentId]);

  // Pagination
  const totalPages = Math.ceil(departmentAnnouncements.length / itemsPerPage);
  const paginatedAnnouncements = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return departmentAnnouncements.slice(startIndex, endIndex);
  }, [departmentAnnouncements, currentPage, itemsPerPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const statusCards = [
    { status: '', borderColor: '#3282FF', title: 'Total', count: summary.total, percent: 0, icon: 'ti-list' },
    { status: '1', borderColor: '#0E8160', title: 'Completed', count: summary['Completed'].count, percent: summary['Completed'].percent, icon: 'ti-check' },
    { status: '2', borderColor: '#1DC39F', title: 'On Target', count: summary['On Target'].count, percent: summary['On Target'].percent, icon: 'ti-target' },
    { status: '3', borderColor: '#FD7E01', title: 'Overdue', count: summary['Overdue'].count, percent: summary['Overdue'].percent, icon: 'ti-timer' },
  ];

  return (
    <div className="content-wrapper">
      <style>{`
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
        #dept-announcement-listing thead th {
          background: rgb(37, 136, 95) !important;
          color: white !important;
        }
        .table-bordered th, .table-bordered td {
          border: 1px solid #dee2e6;
        }
      `}</style>
      
      <div className="card">
        <div className="card-header text-center">
          <p className="block display-4">Announcements</p>
          <p className="block display-5">{user?.department?.name ?? ''} Department </p>
        </div>
        <div className="card-body">
          {/* Status Cards */}
          <div className="row my-5 d-flex justify-content-center">
            {statusCards.map(card => (
              <div key={card.status} className="col-md-2 p-2">
                <Link
                  to={`/department/announcements?status=${card.status}`}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <div
                    className="card record-notes-custom-card-analytics"
                    style={{
                      borderBottom: `8px solid ${card.borderColor}`,
                      border: statusFilter === card.status ? `8px solid ${card.borderColor}` : undefined
                    }}
                  >
                    <div className="card-body">
                      <div className="icon" style={{ background: card.borderColor }}>
                        <i className={card.icon}></i>
                      </div>
                      <h3 className="mb-2" style={{ color: card.borderColor }}>{card.count}</h3>
                      <p>{card.title}</p>
                      <p className="mb-0 mt-2">
                        {card.percent === 0 ? '\u00A0' : `${card.percent}%`}
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          <div className="row">
            <div className="col-12">
              <div className="table-responsive">
                <table id="dept-announcement-listing" className="table table-bordered table-condensed" role="grid">
                  <thead>
                    <tr>
                      <th>S.No</th>
                      <th>Title</th>
                      <th>District</th>
                      <th>Departments</th>
                      <th>Visit Date</th>
                      <th>Timeline</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedAnnouncements.length > 0 ? (
                      paginatedAnnouncements.map((announcement, index) => (
                        <tr key={announcement.id} id={`announcement${announcement.id}`}>
                          <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                          <td>{announcement.title}</td>
                          <td>{announcement.district}</td>
                          <td>
                            {announcement.other_departments.length > 0 ? (
                              <table className="table table-striped dataTable no-footer">
                                <thead>
                                  <tr style={{ backgroundColor: '#25885F', color: 'white' }}>
                                    <th>Department</th>
                                    <th>Status</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {announcement.other_departments.map((dept, idx) => {
                                    const statusValue = typeof dept.status === 'string' ? parseInt(dept.status) : dept.status;
                                    return (
                                      <tr key={idx}>
                                        <td>{dept.name}</td>
                                        <td>
                                          <span className={`badge badge-${badgesWithIntegerStatus(statusValue)}`}>
                                            {badgesWithStringStatus(statusValue)}
                                          </span>
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            ) : (
                              <span>N/A</span>
                            )}
                          </td>
                          <td>{new Date(announcement.date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '/')}</td>
                          <td>{new Date(announcement.timeline).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '/')}</td>
                          <td>
                            <Link
                              to={`/department/announcements/${announcement.id}?status=${statusFilter}&page=${currentPage}`}
                              className="btn btn-info"
                              role="button"
                              aria-pressed="true"
                              title="View Chat history"
                            >
                              <i className="ti-comments"></i>
                            </Link>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7}>There is no data</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div className="card-footer mt-3 border">
          <div className="row align-items-center">
            <div className="col">
              <div className="form-group mb-0 row align-items-center">
                <label htmlFor="perPage" className="col-sm-3 col-form-label mb-0">Show</label>
                <select
                  id="perPage"
                  className="form-control form-control-sm col-sm-3"
                  onChange={handleItemsPerPageChange}
                  value={itemsPerPage}
                >
                  {[15, 25, 50, 100].map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                <span className="inline-block col-sm-6"> per page</span>
              </div>
            </div>
            <div className="col text-center">
              <p>
                Showing <strong>{(currentPage - 1) * itemsPerPage + 1}</strong> to
                <strong> {Math.min(currentPage * itemsPerPage, departmentAnnouncements.length)}</strong> of total
                <strong> {departmentAnnouncements.length}</strong> records.
              </p>
            </div>
            <div className="col d-flex justify-content-end">
              <nav>
                <ul className="pagination">
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>Previous</button>
                  </li>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                      <button className="page-link" onClick={() => handlePageChange(page)}>{page}</button>
                    </li>
                  ))}
                  <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>Next</button>
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

