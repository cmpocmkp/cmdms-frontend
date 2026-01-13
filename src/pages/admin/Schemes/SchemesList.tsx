/**
 * Schemes List - Admin Module
 * EXACT replica of admin/schemes/index.blade.php from old CMDMS
 * Integrated with real API following API_INTEGRATION_GUIDE.md
 * 
 * Note: API structure (name, code, sector, estimatedCost, status, departmentId) differs from frontend mock structure.
 * Frontend fields like district_id, category, type are not in API.
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as schemeService from '../../../lib/services/schemeService';
import { USE_MOCK_DATA } from '../../../lib/api';
import { mockSchemes } from '../../../lib/mocks/data/schemes';

export default function SchemesList() {
  const [schemes, setSchemes] = useState<schemeService.Scheme[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('');

  // Fetch schemes from API
  useEffect(() => {
    fetchSchemes();
  }, [currentPage, searchTerm, statusFilter]);

  const fetchSchemes = async () => {
    try {
      setLoading(true);
      setError(null);

      if (USE_MOCK_DATA) {
        // Use mock data - convert to API format
        const apiSchemes: schemeService.Scheme[] = mockSchemes.map((scheme: any) => ({
          id: scheme.id,
          name: scheme.name,
          code: scheme.code,
          sector: scheme.sector || 'General',
          estimatedCost: scheme.estimatedCost || 0,
          status: scheme.status || 'pending',
          departmentId: scheme.departmentId || undefined,
        }));
        setSchemes(apiSchemes);
        setTotalPages(1);
      } else {
        // Real API call
        const params: schemeService.ListSchemesParams = {
          page: currentPage,
          limit: 15,
        };

        if (searchTerm) {
          params.search = searchTerm;
        }
        if (statusFilter) {
          params.status = statusFilter;
        }

        const response = await schemeService.listSchemes(params);

        if (response.success && response.data) {
          setSchemes(response.data);
          setTotalPages(response.meta?.totalPages || 1);
        } else {
          setError(response.message || 'Failed to load schemes');
        }
      }
    } catch (err: any) {
      console.error('Error fetching schemes:', err);
      setError(err.response?.data?.error?.message || 'Failed to load schemes');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (schemeId: number) => {
    if (!confirm('Are you sure to delete this scheme? This action cannot be undone.')) {
      return;
    }

    try {
      setDeleting(schemeId);
      
      if (USE_MOCK_DATA) {
        // Mock delete
        setSchemes(schemes.filter(s => s.id !== schemeId));
        alert('Scheme deleted successfully!');
      } else {
        // Real API delete
        const response = await schemeService.deleteScheme(schemeId);
        
        if (response.success) {
          // Refresh the list
          await fetchSchemes();
          alert('Scheme deleted successfully!');
        } else {
          alert(response.message || 'Failed to delete scheme');
        }
      }
    } catch (err: any) {
      console.error('Error deleting scheme:', err);
      alert(err.response?.data?.error?.message || 'Failed to delete scheme');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="content-wrapper">
      <style>
        {`
          table#schemes-listing {
            width: 100% !important;
          }
          table#schemes-listing td {
            color: blue !important;
            font-size: 16px !important;
          }
          #schemes-listing td ul li {
            font-size: 16px !important;
          }
          table#schemes-listing th {
            font-size: 16px !important;
          }
          table#schemes-listing td small {
            color: black !important;
          }
        `}
      </style>
      <div className="card">
        <div className="card-body">
          <Link to="/admin/schemes/add" style={{ float: 'right' }}>
            Add Scheme
          </Link>
          <h4 className="card-title text-primary">All Schemes</h4>

          {/* Loading State */}
          {loading && (
            <div className="text-center p-5">
              <div className="spinner-border text-primary" role="status">
                <span className="sr-only">Loading...</span>
              </div>
              <p className="mt-2 text-muted">Loading schemes...</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="alert alert-danger" role="alert">
              <i className="ti-alert-circle mr-2"></i>
              <strong>Error:</strong> {error}
              <button 
                className="btn btn-sm btn-outline-danger ml-3" 
                onClick={fetchSchemes}
              >
                Retry
              </button>
            </div>
          )}

          {/* Content */}
          {!loading && !error && (
            <>
              {/* Search and Filter */}
              <div className="row mb-3">
                <div className="col-md-4">
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search schemes by name or code..."
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                      }}
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <select
                      className="form-control"
                      value={statusFilter}
                      onChange={(e) => {
                        setStatusFilter(e.target.value);
                        setCurrentPage(1);
                      }}
                    >
                      <option value="">All Statuses</option>
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-12">
                  <div className="table-responsive">
                    <table id="schemes-listing" className="table table-striped" role="grid">
                      <thead style={{ background: 'rgb(37, 136, 95)', color: 'white' }}>
                        <tr>
                          <th style={{ width: '15px' }}>S.No</th>
                          <th style={{ width: '300px' }}>Scheme Name</th>
                          <th style={{ width: '15px' }}>Code</th>
                          <th style={{ width: '15px' }}>Sector</th>
                          <th style={{ width: '15px' }}>Department</th>
                          <th style={{ width: '15px' }}>Estimated Cost</th>
                          <th style={{ width: '15px' }}>Status</th>
                          <th style={{ width: '100px' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {schemes.length > 0 ? (
                          schemes.map((scheme, index) => (
                            <tr key={scheme.id}>
                              <td style={{ width: '15px' }}>{(currentPage - 1) * 15 + index + 1}</td>
                              <td style={{ width: '300px', whiteSpace: 'pre-wrap' }}>
                                {scheme.name}
                              </td>
                              <td style={{ width: '15px' }}>{scheme.code || '-'}</td>
                              <td style={{ width: '15px' }}>{scheme.sector || '-'}</td>
                              <td style={{ width: '15px' }}>
                                {scheme.department?.name || scheme.departmentId || '-'}
                              </td>
                              <td style={{ width: '15px' }}>
                                {scheme.estimatedCost ? `₹${scheme.estimatedCost.toLocaleString()}` : '-'}
                              </td>
                              <td style={{ width: '15px' }}>
                                <span className={`badge badge-${scheme.status === 'approved' ? 'success' : scheme.status === 'rejected' ? 'danger' : 'warning'}`}>
                                  {scheme.status || 'pending'}
                                </span>
                              </td>
                              <td style={{ width: '100px' }}>
                                <Link
                                  to={`/admin/schemes/edit/${scheme.id}`}
                                  className="text-primary mr-2"
                                >
                                  Edit
                                </Link>
                                &nbsp;&nbsp;
                                <button
                                  type="button"
                                  className="btn btn-danger btn-sm btn-icon-text mt-4"
                                  title="delete"
                                  onClick={() => handleDelete(scheme.id)}
                                  disabled={deleting === scheme.id}
                                >
                                  {deleting === scheme.id ? (
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
                            <td colSpan={8}>
                              {searchTerm || statusFilter ? `No schemes found matching your criteria` : 'There is no data.'}
                            </td>
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