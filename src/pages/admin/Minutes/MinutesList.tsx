/**
 * Minutes List - Admin Module
 * EXACT replica of admin/recordnotes/index.blade.php from old CMDMS
 * Integrated with real API following API_INTEGRATION_GUIDE.md
 * 
 * Note: API structure (title, date, type, venue) differs from frontend mock structure.
 * Frontend fields like created_by, updated_by, departments_names, decisions_count are not in API.
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as meetingService from '../../../lib/services/meetingService';
import { USE_MOCK_DATA } from '../../../lib/api';
import { mockMinutes } from '../../../lib/mocks/data/minutes';

export default function MinutesList() {
  const [meetings, setMeetings] = useState<meetingService.Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleting, setDeleting] = useState<number | null>(null);

  // Fetch meetings from API
  useEffect(() => {
    fetchMeetings();
  }, [currentPage]);

  const fetchMeetings = async () => {
    try {
      setLoading(true);
      setError(null);

      if (USE_MOCK_DATA) {
        // Use mock data - convert to API format
        const apiMeetings: meetingService.Meeting[] = mockMinutes.map((meeting: any) => ({
          id: meeting.id,
          title: meeting.subject,
          date: meeting.meeting_date,
          type: meeting.meeting_type?.toLowerCase() || 'cabinet',
          venue: undefined,
        }));
        setMeetings(apiMeetings);
        setTotalPages(1);
      } else {
        // Real API call
        const params: meetingService.ListMeetingsParams = {
          page: currentPage,
          limit: 15,
        };

        const response = await meetingService.listMeetings(params);

        if (response.success && response.data) {
          setMeetings(response.data);
          setTotalPages(response.meta?.totalPages || 1);
        } else {
          setError(response.message || 'Failed to load meetings');
        }
      }
    } catch (err: any) {
      console.error('Error fetching meetings:', err);
      setError(err.response?.data?.error?.message || 'Failed to load meetings');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (meetingId: number) => {
    if (!confirm('Are you sure you want to delete this meeting? This action cannot be undone.')) {
      return;
    }

    try {
      setDeleting(meetingId);
      
      if (USE_MOCK_DATA) {
        // Mock delete
        setMeetings(meetings.filter(m => m.id !== meetingId));
        alert('Meeting deleted successfully!');
      } else {
        // Real API delete
        const response = await meetingService.deleteMeeting(meetingId);
        
        if (response.success) {
          // Refresh the list
          await fetchMeetings();
          alert('Meeting deleted successfully!');
        } else {
          alert(response.message || 'Failed to delete meeting');
        }
      }
    } catch (err: any) {
      console.error('Error deleting meeting:', err);
      alert(err.response?.data?.error?.message || 'Failed to delete meeting');
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
              <p className="block display-4">Minutes Meetings</p>
            </div>
            <div>
              <div className="btn-toolbar pull-right">
                <div className="btn-group">
                  <Link 
                    to="/admin/recordnotes/add" 
                    className="btn btn-outline-primary btn-fw" 
                    role="button"
                  >
                    <i className="ti-plus mr-1"></i>Add Minutes
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
              <p className="mt-2 text-muted">Loading meetings...</p>
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
              <div className="row">
                <div className="col-12">
                  <div className="table-responsive">
                    <table id="record-note-listing" className="table table-striped table-bordered" role="grid">
                      <thead>
                        <tr>
                          <th>Meeting Date</th>
                          <th>Title</th>
                          <th>Type</th>
                          <th>Venue</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {meetings.length > 0 ? (
                          meetings.map(meeting => (
                            <tr key={meeting.id}>
                              <td>{meeting.date ? new Date(meeting.date).toLocaleDateString('en-GB') : '-'}</td>
                              <td style={{ whiteSpace: 'pre-wrap' }}>{meeting.title}</td>
                              <td>{meeting.type ? meeting.type.charAt(0).toUpperCase() + meeting.type.slice(1) : '-'}</td>
                              <td>{meeting.venue || '-'}</td>
                              <td className="text-center">
                                <Link
                                  to={`/admin/recordnotes/edit/${meeting.id}`}
                                  className="btn btn-sm btn-info mb-2 mx-2"
                                  style={{ width: '45px' }}
                                  title="Show all decisions"
                                >
                                  <i className="ti-eye"></i>
                                </Link>

                                <Link
                                  to={`/admin/recordnotes/edit/${meeting.id}`}
                                  className="btn btn-sm btn-primary mb-2 mx-2"
                                  style={{ width: '45px' }}
                                  title="View minutes"
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
