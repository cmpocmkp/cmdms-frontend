/**
 * Candidates List - Admin Module
 * EXACT replica of admin/candidates/index.blade.php from old CMDMS
 * Integrated with real API following API_INTEGRATION_GUIDE.md
 * 
 * Note: API structure (name, party, constituencyId) differs from frontend mock structure.
 * Frontend fields like district_name, position, area, division, phone, mobile, email, nic, address are not in API.
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as candidateService from '../../../lib/services/candidateService';
import { USE_MOCK_DATA } from '../../../lib/api';
import { mockCandidatesDetailed } from '../../../lib/mocks/data/candidates';

export default function CandidatesList() {
  const [candidates, setCandidates] = useState<candidateService.Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleting, setDeleting] = useState<number | null>(null);

  // Fetch candidates from API
  useEffect(() => {
    fetchCandidates();
  }, [currentPage, searchTerm]);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      setError(null);

      if (USE_MOCK_DATA) {
        // Use mock data - convert to API format
        const apiCandidates: candidateService.Candidate[] = mockCandidatesDetailed.map((candidate: any) => ({
          id: candidate.id,
          name: candidate.name || '',
          party: candidate.party_name || '',
          constituencyId: candidate.constituency_id,
        }));
        setCandidates(apiCandidates);
        setTotalPages(1);
      } else {
        // Real API call
        const params: candidateService.ListCandidatesParams = {
          page: currentPage,
          limit: 15,
        };

        if (searchTerm) {
          params.search = searchTerm;
        }

        const response = await candidateService.listCandidates(params);

        if (response.success && response.data) {
          setCandidates(response.data);
          setTotalPages(response.meta?.totalPages || 1);
        } else {
          setError(response.message || 'Failed to load candidates');
        }
      }
    } catch (err: any) {
      console.error('Error fetching candidates:', err);
      setError(err.response?.data?.error?.message || 'Failed to load candidates');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (candidateId: number) => {
    if (!confirm('Are you sure to delete this candidate? This action cannot be undone.')) {
      return;
    }

    try {
      setDeleting(candidateId);
      
      if (USE_MOCK_DATA) {
        // Mock delete
        setCandidates(candidates.filter(c => c.id !== candidateId));
        alert('Candidate deleted successfully!');
      } else {
        // Real API delete
        await candidateService.deleteCandidate(candidateId);
        // Refresh the list
        await fetchCandidates();
        alert('Candidate deleted successfully!');
      }
    } catch (err: any) {
      console.error('Error deleting candidate:', err);
      alert(err.response?.data?.error?.message || 'Failed to delete candidate');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="content-wrapper">
      <div className="card">
        <div className="card-body">
          <Link to="/admin/candidates/add" style={{ float: 'right' }}>
            Add candidate
          </Link>
          <h4 className="card-title text-primary">Candidates</h4>

          {/* Loading State */}
          {loading && (
            <div className="text-center p-5">
              <div className="spinner-border text-primary" role="status">
                <span className="sr-only">Loading...</span>
              </div>
              <p className="mt-2 text-muted">Loading candidates...</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="alert alert-danger" role="alert">
              <i className="ti-alert-circle mr-2"></i>
              <strong>Error:</strong> {error}
              <button 
                className="btn btn-sm btn-outline-danger ml-3" 
                onClick={fetchCandidates}
              >
                Retry
              </button>
            </div>
          )}

          {/* Content */}
          {!loading && !error && (
            <>
              {/* Search */}
              <div className="row mb-3">
                <div className="col-md-4">
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search candidates by name or party..."
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-12">
                  <div className="table-responsive">
                    <table id="record-note-listing" className="table table-striped" role="grid">
                      <thead>
                        <tr>
                          <th>S.No</th>
                          <th>Candidate<br/> Name</th>
                          <th>Party</th>
                          <th>Constituency</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {candidates.length > 0 ? (
                          candidates.map((candidate, index) => (
                            <tr key={candidate.id}>
                              <td>{(currentPage - 1) * 15 + index + 1}</td>
                              <td>{candidate.name || '-'}</td>
                              <td>{candidate.party || '-'}</td>
                              <td>{candidate.constituency?.name || candidate.constituencyId || '-'}</td>
                              <td>
                                <Link
                                  to={`/admin/candidates/edit/${candidate.id}`}
                                  style={{ float: 'left', marginLeft: '20px' }}
                                  className="text-primary mr-2 mb-2"
                                  title="Edit candidate"
                                >
                                  <i className="ti-pencil-alt icon-sm"></i>
                                </Link>
                                <button
                                  type="button"
                                  className="btn btn-danger btn-icon-text"
                                  title="delete"
                                  onClick={() => handleDelete(candidate.id)}
                                  disabled={deleting === candidate.id}
                                  style={{ float: 'left', marginLeft: '20px' }}
                                >
                                  {deleting === candidate.id ? (
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
                            <td style={{ textAlign: 'center' }} colSpan={5}>
                              {searchTerm ? `No candidates found matching "${searchTerm}"` : 'There is no data in table'}
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
