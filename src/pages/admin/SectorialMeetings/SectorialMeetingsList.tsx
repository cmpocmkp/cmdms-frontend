/**
 * Sectorial Meetings List - Admin Module
 * EXACT replica of admin/sectorialmeetings/index.blade.php from old CMDMS
 * Integrated with real API following API_INTEGRATION_GUIDE.md
 * 
 * Note: API structure (title, date, sector) differs from frontend mock structure.
 * Frontend fields like subject, departments_names, created_by, updated_by are not in API.
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as sectoralMeetingService from '../../../lib/services/sectoralMeetingService';
import * as commonService from '../../../lib/services/commonService';
import { USE_MOCK_DATA } from '../../../lib/api';
import { mockSectorialMeetings } from '../../../lib/mocks/data/sectorialMeetings';
import { mockAdminDepartments } from '../../../lib/mocks/data/adminDepartments';

export default function SectorialMeetingsList() {
  const [meetings, setMeetings] = useState<sectoralMeetingService.SectoralMeeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [departmentFilter, setDepartmentFilter] = useState<string>('');
  const [departments, setDepartments] = useState<Array<{ id: number; name: string }>>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleting, setDeleting] = useState<number | null>(null);

  // Fetch meetings and departments from API
  useEffect(() => {
    fetchMeetings();
    fetchDepartments();
  }, [currentPage, departmentFilter]);

  const fetchMeetings = async () => {
    try {
      setLoading(true);
      setError(null);

      if (USE_MOCK_DATA) {
        // Use mock data - convert to API format
        const apiMeetings: sectoralMeetingService.SectoralMeeting[] = mockSectorialMeetings.map((meeting: any) => ({
          id: meeting.id,
          title: meeting.subject,
          date: meeting.date,
          sector: meeting.sector || 'General',
        }));
        setMeetings(apiMeetings);
        setTotalPages(1);
      } else {
        // Real API call
        const params: sectoralMeetingService.ListSectoralMeetingsParams = {
          page: currentPage,
          limit: 15,
        };

        if (departmentFilter) {
          params.departmentId = parseInt(departmentFilter, 10);
        }

        const response = await sectoralMeetingService.listSectoralMeetings(params);

        if (response.success && response.data) {
          setMeetings(response.data);
          setTotalPages(response.meta?.totalPages || 1);
        } else {
          setError(response.message || 'Failed to load sectoral meetings');
        }
      }
    } catch (err: any) {
      console.error('Error fetching sectoral meetings:', err);
      setError(err.response?.data?.error?.message || 'Failed to load sectoral meetings');
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      if (USE_MOCK_DATA) {
        setDepartments(mockAdminDepartments);
      } else {
        const response = await commonService.getDepartmentsDropdown();
        if (response.success && response.data) {
          setDepartments(response.data);
        } else {
          setDepartments([]);
        }
      }
    } catch (err: any) {
      console.error('Error fetching departments:', err);
      setDepartments(mockAdminDepartments); // Fallback
    }
  };

  const handleDelete = async (meetingId: number) => {
    if (!confirm('Are you sure you want to delete this sectoral meeting? This action cannot be undone.')) {
      return;
    }

    try {
      setDeleting(meetingId);
      
      if (USE_MOCK_DATA) {
        // Mock delete
        setMeetings(meetings.filter(m => m.id !== meetingId));
        alert('Sectoral meeting deleted successfully!');
      } else {
        // Real API delete
        const response = await sectoralMeetingService.deleteSectoralMeeting(meetingId);
        
        if (response.success) {
          // Refresh the list
          await fetchMeetings();
          alert('Sectoral meeting deleted successfully!');
        } else {
          alert(response.message || 'Failed to delete sectoral meeting');
        }
      }
    } catch (err: any) {
      console.error('Error deleting sectoral meeting:', err);
      alert(err.response?.data?.error?.message || 'Failed to delete sectoral meeting');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="content-wrapper">
      <div className="card">
        <div className="card-header text-center">
          <div className="d-flex gap-3 justify-content-between align-items-center">
            <div className="flex-grow-1 text-center">
              <p className="block display-4">Sectorial Meetings</p>
            </div>
            <div>
              <div className="btn-toolbar pull-right">
                <div className="btn-group">
                  <Link 
                    to="/admin/sectorialmeetings/add" 
                    className="btn btn-outline-primary btn-fw" 
                    role="button"
                  >
                    <i className="ti-plus mr-1"></i>Add Sectorial Meeting
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="card-body">
          {/* Loading State */}
          {loading && (
            <div className="text-center p-5">
              <div className="spinner-border text-primary" role="status">
                <span className="sr-only">Loading...</span>
              </div>
              <p className="mt-2 text-muted">Loading sectoral meetings...</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="alert alert-danger" role="alert">
              <i className="ti-alert-circle mr-2"></i>
              <strong>Error:</strong> {error}
              <button 
                className="btn btn-sm btn-outline-danger ml-3" 
                onClick={fetchMeetings}
              >
                Retry
              </button>
            </div>
          )}

          {/* Content */}
          {!loading && !error && (
            <>
              {/* Department Filter */}
              <div className="row mb-3">
                <div className="col-md-4">
                  <div className="form-group">
                    <label htmlFor="department_filter">Filter by Department:</label>
                    <select 
                      name="department_filter" 
                      id="department_filter" 
                      className="form-control"
                      value={departmentFilter}
                      onChange={(e) => {
                        setDepartmentFilter(e.target.value);
                        setCurrentPage(1);
                      }}
                    >
                      <option value="">All Departments</option>
                      {departments.map(dept => (
                        <option key={dept.id} value={dept.id}>{dept.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-12">
                  <div className="table-responsive">
                    <table id="sectorial-meeting-listing" className="table table-striped table-bordered" role="grid">
                      <thead>
                        <tr>
                          <th>Meeting Date</th>
                          <th>Title</th>
                          <th>Sector</th>
                          <th>Departments</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {meetings.length > 0 ? (
                          meetings.map(meeting => (
                            <tr key={meeting.id}>
                              <td>{meeting.date ? new Date(meeting.date).toLocaleDateString('en-GB') : '-'}</td>
                              <td style={{ whiteSpace: 'pre-wrap' }}>{meeting.title}</td>
                              <td>{meeting.sector || '-'}</td>
                              <td style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
                                {meeting.departments && meeting.departments.length > 0 ? (
                                  <ul>
                                    {meeting.departments.map((dept) => (
                                      <li key={dept.id}>{dept.name}</li>
                                    ))}
                                  </ul>
                                ) : (
                                  <p>-</p>
                                )}
                              </td>
                              <td className="text-center">
                                <Link
                                  to={`/admin/sectorialmeetings/edit/${meeting.id}`}
                                  className="btn btn-sm btn-info mb-2 mx-2"
                                  style={{ width: '45px' }}
                                  title="Edit meeting"
                                >
                                  <i className="ti-pencil"></i>
                                </Link>

                                <Link
                                  to={`/admin/sectorialmeetings/${meeting.id}/agenda-points`}
                                  className="btn btn-sm btn-primary mb-2 mx-2"
                                  style={{ width: '45px' }}
                                  title="Add/View agenda points"
                                >
                                  <i className="ti-pencil-alt"></i>
                                </Link>

                                <button
                                  type="button"
                                  style={{ width: '45px' }}
                                  className="btn btn-sm btn-danger mb-2 mx-2"
                                  onClick={() => handleDelete(meeting.id)}
                                  disabled={deleting === meeting.id}
                                  title="Delete meeting"
                                >
                                  {deleting === meeting.id ? (
                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                  ) : (
                                    <i className="ti-trash icon-sm"></i>
                                  )}
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={5}>There is no data.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Pagination */}
              {!USE_MOCK_DATA && totalPages > 1 && (
                <div className="pagination flex-wrap pagination-rounded-flat pagination-success mt-3">
                  <nav>
                    <ul className="pagination">
                      <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                        <button 
                          className="page-link" 
                          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                          disabled={currentPage === 1}
                        >
                          Previous
                        </button>
                      </li>
                      {(() => {
                        const pageNumbers = [];
                        const maxPagesToShow = 5;
                        let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
                        let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

                        if (endPage - startPage + 1 < maxPagesToShow) {
                          startPage = Math.max(1, endPage - maxPagesToShow + 1);
                        }

                        for (let i = startPage; i <= endPage; i++) {
                          pageNumbers.push(
                            <li key={i} className={`page-item ${currentPage === i ? 'active' : ''}`}>
                              <button className="page-link" onClick={() => setCurrentPage(i)}>
                                {i}
                              </button>
                            </li>
                          );
                        }
                        return pageNumbers;
                      })()}
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
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
