/**
 * CM Remarks List - Admin Module
 * EXACT replica of admin/cmremarks/index.blade.php from old CMDMS
 * Integrated with real API following API_INTEGRATION_GUIDE.md
 * 
 * Note: API structure (subject, remark, priority, deadline) differs from frontend mock structure.
 * Frontend fields like section_id, letter_number, issue_date are mapped to API fields.
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as cmRemarkService from '../../../lib/services/cmRemarkService';
import { mapCMRemarkToDisplay, type DisplayCMRemark } from '../../../lib/utils/cmRemarkMapper';
import { USE_MOCK_DATA } from '../../../lib/api';
import { mockCMRemarks } from '../../../lib/mocks/data/cmRemarks';

export default function CMRemarksList() {
  const [cmRemarks, setCMRemarks] = useState<DisplayCMRemark[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(15);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('');
  const [deleting, setDeleting] = useState<number | null>(null);

  // Fetch CM remarks from API
  useEffect(() => {
    fetchCMRemarks();
  }, [currentPage, searchTerm, priorityFilter]);

  const fetchCMRemarks = async () => {
    try {
      setLoading(true);
      setError(null);

      if (USE_MOCK_DATA) {
        // Use mock data - convert to display format
        const mockDisplay = mockCMRemarks.map((remark: any) => ({
          id: remark.id,
          subject: remark.subject,
          remark: remark.comments,
          priority: 'medium', // Mock doesn't have priority
          deadline: remark.timeline,
          status: typeof remark.status === 'number' ? String(remark.status) : remark.status,
          departmentIds: remark.departments?.map((d: any) => d.id) || [],
          departments: remark.departments?.map((d: any) => ({
            id: d.id,
            name: d.name,
            status: d.status ? String(d.status) : undefined,
          })) || [],
        }));
        setCMRemarks(mockDisplay as DisplayCMRemark[]);
        setTotal(mockCMRemarks.length);
        setTotalPages(Math.ceil(mockCMRemarks.length / itemsPerPage));
      } else {
        // Real API call
        const params: cmRemarkService.ListCMRemarksParams = {
          page: currentPage,
          limit: itemsPerPage,
        };

        if (searchTerm) {
          params.search = searchTerm;
        }

        if (priorityFilter) {
          params.priority = priorityFilter;
        }

        const response = await cmRemarkService.listCMRemarks(params);

        if (response.success && response.data) {
          // Map API response to display format
          const mappedRemarks = response.data.map(mapCMRemarkToDisplay);
          setCMRemarks(mappedRemarks);
          setTotal(response.meta?.total || mappedRemarks.length);
          setTotalPages(response.meta?.totalPages || Math.ceil(mappedRemarks.length / itemsPerPage));
        } else {
          setError(response.message || 'Failed to load CM remarks');
        }
      }
    } catch (err: any) {
      console.error('Error fetching CM remarks:', err);
      setError(err.response?.data?.error?.message || 'Failed to load CM remarks');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (remarkId: number) => {
    if (!confirm('Are you sure you want to delete this CM remark? This action cannot be undone.')) {
      return;
    }

    try {
      setDeleting(remarkId);
      
      if (USE_MOCK_DATA) {
        // Mock delete
        setCMRemarks(cmRemarks.filter(r => r.id !== remarkId));
        alert('CM remark deleted successfully!');
      } else {
        // Real API delete
        const response = await cmRemarkService.deleteCMRemark(remarkId);
        
        if (response.success) {
          // Refresh the list
          await fetchCMRemarks();
          alert('CM remark deleted successfully!');
        } else {
          alert(response.message || 'Failed to delete CM remark');
        }
      }
    } catch (err: any) {
      console.error('Error deleting CM remark:', err);
      alert(err.response?.data?.error?.message || 'Failed to delete CM remark');
    } finally {
      setDeleting(null);
    }
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedRemarks = USE_MOCK_DATA 
    ? cmRemarks.slice(startIndex, endIndex)
    : cmRemarks; // API already returns paginated data

  // badgesWithStatus mapping from old CMDMS
  const getBadgeClass = (status: string | number) => {
    const statusStr = typeof status === 'number' ? String(status) : status;
    const badgesWithStatus: Record<string, string> = {
      "Completed": "success",
      "On Target": "warning",
      "Overdue": "danger",
      "Off Target": "info",
      "Ongoing": "ongoing",
      "Overdue Other Reason": "indigo",
      "Off Target Reason": "lightred"
    };
    return badgesWithStatus[statusStr] || "secondary";
  };

  return (
    <div className="content-wrapper">
      <div className="card">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="card-title text-primary mb-0">CM Remarks</h4>
            <Link to="/admin/cmremarks/add" className="btn btn-primary">
              <i className="ti-plus mr-1"></i>Add CM Remarks
            </Link>
          </div>

          {/* Search and Filter */}
          <div className="row mb-3">
            <div className="col-md-6">
              <input
                type="text"
                className="form-control"
                placeholder="Search by subject..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <div className="col-md-3">
              <select
                className="form-control"
                value={priorityFilter}
                onChange={(e) => {
                  setPriorityFilter(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="">All Priorities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center p-5">
              <div className="spinner-border text-primary" role="status">
                <span className="sr-only">Loading...</span>
              </div>
              <p className="mt-2 text-muted">Loading CM remarks...</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="alert alert-danger" role="alert">
              <i className="ti-alert-circle mr-2"></i>
              <strong>Error:</strong> {error}
              <button 
                className="btn btn-sm btn-outline-danger ml-3" 
                onClick={fetchCMRemarks}
              >
                Retry
              </button>
            </div>
          )}

          {/* Content */}
          {!loading && !error && (
            <>
              {cmRemarks.length > 0 ? (
                <>
                  <div className="row">
                    <div className="col-12">
                      <div className="table-responsive">
                        <table className="table table-striped" role="grid">
                          <thead>
                            <tr>
                              <th>S.No</th>
                              <th>Subject</th>
                              <th>Remark</th>
                              <th>Priority</th>
                              <th>Deadline</th>
                              <th>Departments</th>
                              <th>Status</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {paginatedRemarks.length > 0 ? (
                              paginatedRemarks.map((remark, index) => (
                                <tr key={remark.id}>
                                  <td>{startIndex + index + 1}</td>
                                  <td>{remark.subject}</td>
                                  <td>{remark.remark || '-'}</td>
                                  <td>
                                    <span className={`badge badge-${remark.priority === 'high' ? 'danger' : remark.priority === 'medium' ? 'warning' : 'info'}`}>
                                      {remark.priority || 'N/A'}
                                    </span>
                                  </td>
                                  <td>{remark.deadline ? new Date(remark.deadline).toLocaleDateString('en-GB') : '-'}</td>
                                  <td>
                                    {remark.departments && remark.departments.length > 0 ? (
                                      remark.departments.map(dept => (
                                        <div key={dept.id}>{dept.name}<br/></div>
                                      ))
                                    ) : (
                                      '-'
                                    )}
                                  </td>
                                  <td style={{ width: '120px' }}>
                                    <label className={`badge badge-${getBadgeClass(remark.status || '')} badge-pill`}>
                                      {remark.status || 'Pending'}
                                    </label>
                                  </td>
                                  <td>
                                    <Link
                                      to={`/admin/cmremarks/edit/${remark.id}`}
                                      className="mr-2 mb-2 btn btn-primary btn-sm"
                                      title="Edit CM Remark"
                                    >
                                      <i className="ti-pencil-alt icon-sm"></i>
                                    </Link>

                                    {remark.departments && remark.departments.length > 0 && (
                                      <Link
                                        to={`/admin/cmremarks/departments/${remark.id}`}
                                        title="Related Departments Status"
                                        className="mr-2 mb-2 btn btn-secondary btn-sm"
                                        role="button"
                                        aria-pressed="true"
                                      >
                                        <i className="ti-layout-grid3 icon-sm"></i>
                                      </Link>
                                    )}

                                    <Link
                                      to={`/admin/cmremarks/replies/${remark.id}`}
                                      title="Progress replies"
                                      className="mr-2 mb-2 btn btn-info btn-sm"
                                      role="button"
                                      aria-pressed="true"
                                    >
                                      <i className="ti-comment-alt icon-sm"></i>
                                    </Link>

                                    <button
                                      type="button"
                                      className="btn btn-danger btn-sm"
                                      onClick={() => handleDelete(remark.id)}
                                      disabled={deleting === remark.id}
                                      title="Delete CM Remark"
                                    >
                                      {deleting === remark.id ? (
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
                                <td colSpan={8} className="text-center">No CM remarks found.</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-center">No records found.</p>
              )}
            </>
          )}

          {/* Pagination */}
          {!loading && !error && totalPages > 1 && (
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
              <div className="mt-2 text-muted text-center">
                Showing {startIndex + 1} to {Math.min(endIndex, total)} of {total} records
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
