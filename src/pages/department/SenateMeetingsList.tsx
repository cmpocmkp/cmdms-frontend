/**
 * Department Senate Meetings List Page
 * Based on department/senate_meetings/index.blade.php from old CMDMS
 * Integrated with real API following API_INTEGRATION_GUIDE.md
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import * as senateMeetingService from '../../lib/services/senateMeetingService';
import { USE_MOCK_DATA } from '../../lib/api';

export default function SenateMeetingsList() {
  const { user } = useAuth();
  const [meetings, setMeetings] = useState<senateMeetingService.SenateMeeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  // Fetch meetings from API
  useEffect(() => {
    fetchMeetings();
  }, [currentPage, user?.department_id]);

  const fetchMeetings = async () => {
    try {
      setLoading(true);
      setError(null);

      if (USE_MOCK_DATA) {
        // Mock data fallback
        setMeetings([]);
        setTotalPages(1);
        setTotalRecords(0);
      } else {
        // Real API call - filter by department if user has department
        const params: senateMeetingService.ListSenateMeetingsParams = {
          page: currentPage,
          limit: 15,
        };

        if (user?.department_id) {
          const deptId = user.department_id;
          params.departmentId = typeof deptId === 'number' ? deptId : Number(deptId);
        }

        const response = await senateMeetingService.listSenateMeetings(params);

        if (response.success && response.data) {
          setMeetings(response.data);
          setTotalPages(response.meta?.totalPages || 1);
          setTotalRecords(response.meta?.total || 0);
        } else {
          setError(response.message || 'Failed to load senate meetings');
        }
      }
    } catch (err: any) {
      console.error('Error fetching senate meetings:', err);
      setError(err.response?.data?.error?.message || 'Failed to load senate meetings');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to format date
  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    } catch {
      return 'N/A';
    }
  };

  return (
    <div className="content-wrapper">
      <div className="card">
        <div className="card-header text-center">
          <div className="d-flex gap-3 justify-content-between align-items-center">
            <div className="flex-grow-1 text-center">
              <p className="block display-4">Senate Meetings</p>
              {user?.department?.name && (
                <p className="block display-5">{user.department.name} Department</p>
              )}
            </div>
          </div>
        </div>
        <div className="card-body">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border" role="status">
                <span className="sr-only">Loading...</span>
              </div>
              <p className="mt-2">Loading senate meetings...</p>
            </div>
          ) : error ? (
            <div className="alert alert-danger" role="alert">
              <strong>Error:</strong> {error}
              <button 
                className="btn btn-sm btn-outline-danger ml-2" 
                onClick={fetchMeetings}
              >
                Retry
              </button>
            </div>
          ) : meetings.length === 0 ? (
            <div className="text-center py-5">
              <p className="text-muted">No senate meetings found for your department.</p>
            </div>
          ) : (
            <>
              <div className="table-responsive">
                <table className="table table-bordered table-striped">
                  <thead style={{ background: 'rgb(37, 136, 95)', color: 'white' }}>
                    <tr>
                      <th>S.NO</th>
                      <th>Title</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {meetings.map((meeting, index) => {
                      const serialNumber = (currentPage - 1) * 15 + index + 1;
                      return (
                        <tr key={meeting.id}>
                          <td>{serialNumber}</td>
                          <td>{meeting.title}</td>
                          <td>{formatDate(meeting.date)}</td>
                          <td className="text-center">
                            <Link
                              to={`/department/senate-meetings/${meeting.id}`}
                              className="btn btn-info btn-sm"
                              title="View Details"
                            >
                              <i className="ti-eye"></i> View
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="card-footer mt-3 border">
                  <div className="row align-items-center">
                    <div className="col text-center">
                      <p>
                        Showing page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
                        {totalRecords > 0 && (
                          <> (Total: <strong>{totalRecords}</strong> records)</>
                        )}
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
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}



