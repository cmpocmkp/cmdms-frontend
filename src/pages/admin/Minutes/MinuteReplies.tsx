/**
 * Minute Replies/Chat - Admin Module
 * EXACT replica of admin/recordnotes/reply.blade.php
 * Integrated with real API following API_INTEGRATION_GUIDE.md
 */

import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import * as minuteService from '../../../lib/services/minuteService';
import { USE_MOCK_DATA } from '../../../lib/api';

interface TaggedDepartment {
  id: number;
  name: string;
}

interface Reply {
  id: number;
  reply_detail: string;
  attachments?: string[];
  status?: number;
  status_label?: string;
  status_class?: string;
  remarks?: string;
  other_remarks?: string;
  overdue_reason?: string;
  created_at: string;
  user: {
    id: number;
    name: string;
    phone?: string;
    role_id: number;
    department?: {
      id: number;
      name: string;
    };
  };
  taggedDepartments?: TaggedDepartment[];
}

interface Department {
  id: number;
  name: string;
}

interface Minute {
  id: number;
  issues: string;
  heading?: string;
  decisions: string;
  comments?: string;
  timeline: string;
  status: number;
  status_label: string;
  status_class: string;
  meeting_id: number;
  creator?: {
    name: string;
    phone?: string;
  };
  replies: Reply[];
  departments: Department[];
}

export default function MinuteReplies() {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [minute, setMinute] = useState<Minute | null>(null);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [relatedDepartments, setRelatedDepartments] = useState<Department[]>([]);
  const [submitting, setSubmitting] = useState(false);
  
  // Reply form state
  const [replyContent, setReplyContent] = useState('');
  const [taggedDepartmentIds, setTaggedDepartmentIds] = useState<number[]>([]);

  useEffect(() => {
    if (id) {
      fetchMinuteAndReplies();
    }
  }, [id]);

  const fetchMinuteAndReplies = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!id) return;

      if (USE_MOCK_DATA) {
        // Mock data - keeping existing structure for now
        setMinute({
          id: parseInt(id),
          issues: '<p>Implementation of Health Insurance Scheme for all citizens</p>',
          heading: 'Health Insurance Scheme',
          decisions: '<p>Approved the health insurance scheme with comprehensive coverage.</p>',
          timeline: '2024-03-15',
          status: 2,
          status_label: 'On Target',
          status_class: 'badge-warning',
          meeting_id: 1,
          departments: [
            { id: 1, name: 'Health Department' },
            { id: 2, name: 'Finance Department' },
          ],
          replies: [],
        });
        setRelatedDepartments([
          { id: 1, name: 'Health Department' },
          { id: 2, name: 'Finance Department' },
        ]);
        setReplies([]);
      } else {
        // Fetch minute
        const minuteResponse = await minuteService.getMinute(parseInt(id));
        if (minuteResponse.success && minuteResponse.data) {
          const minuteData = minuteResponse.data;
          setMinute({
            id: minuteData.id,
            issues: minuteData.issues || minuteData.heading || '',
            heading: minuteData.heading,
            decisions: minuteData.decisions || '',
            timeline: minuteData.timeline || '',
            status: minuteData.status || 0,
            status_label: getStatusLabel(minuteData.status),
            status_class: getBadgeClass(minuteData.status),
            meeting_id: minuteData.meetingId,
            departments: minuteData.departments || [],
            replies: [],
          });
          setRelatedDepartments(minuteData.departments || []);
        } else {
          setError(minuteResponse.message || 'Failed to load minute');
        }

        // Fetch replies
        const repliesResponse = await minuteService.getMinuteReplies(parseInt(id));
        if (repliesResponse.success && repliesResponse.data) {
          const mappedReplies: Reply[] = repliesResponse.data.map((reply) => ({
            id: reply.id,
            reply_detail: reply.content || '',
            attachments: reply.attachments || [],
            status: reply.status,
            status_label: getStatusLabel(reply.status),
            status_class: getBadgeClass(reply.status),
            created_at: reply.createdAt || new Date().toISOString(),
            user: reply.user ? {
              id: reply.user.id,
              name: reply.user.name || '',
              role_id: 2, // Default role, API doesn't provide this
              department: undefined, // API doesn't provide department in user object
            } : {
              id: 0,
              name: 'Unknown User',
              role_id: 2,
            },
            taggedDepartments: [], // API doesn't provide tagged departments
          }));
          setReplies(mappedReplies);
        }
      }
    } catch (err: any) {
      console.error('Error fetching minute and replies:', err);
      setError(err.response?.data?.error?.message || 'Failed to load minute and replies');
    } finally {
      setLoading(false);
    }
  };

  const getBadgeClass = (status?: number): string => {
    if (!status) return '';
    switch (status) {
      case 1: return 'badge-success';
      case 2: return 'badge-warning';
      case 3: return 'badge-danger';
      case 4: return 'badge-info';
      default: return 'badge-secondary';
    }
  };

  const getStatusLabel = (status?: number): string => {
    if (!status) return '';
    switch (status) {
      case 1: return 'Completed';
      case 2: return 'On Target';
      case 3: return 'Overdue';
      case 4: return 'Off Target';
      default: return 'Pending';
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const isAdminReply = (reply: Reply): boolean => {
    return reply.user.role_id === 1 || reply.user.role_id === 3; // ADMIN or DATAENTRY
  };

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !replyContent.trim()) return;

    try {
      setSubmitting(true);
      setError(null);

      // Map form data to API format (only documented fields)
      const apiData: minuteService.CreateMinuteReplyRequest = {
        content: replyContent.trim(),
        // Note: status and progress are optional, not included in form
        // attachments[] is documented but file upload not implemented yet
      };

      if (USE_MOCK_DATA) {
        // Mock create
        await new Promise(resolve => setTimeout(resolve, 500));
        alert('Reply added successfully! (Mock)');
        setReplyContent('');
        setTaggedDepartmentIds([]);
        await fetchMinuteAndReplies();
      } else {
        // Real API call
        const response = await minuteService.createMinuteReply(parseInt(id), apiData);

        if (response.success && response.data) {
          alert('Reply added successfully!');
          setReplyContent('');
          setTaggedDepartmentIds([]);
          await fetchMinuteAndReplies();
        } else {
          setError(response.message || 'Failed to create reply');
        }
      }
    } catch (err: any) {
      console.error('Error creating reply:', err);
      setError(err.response?.data?.error?.message || 'Failed to create reply. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="content-wrapper">
        <div className="card">
          <div className="card-body text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="sr-only">Loading...</span>
            </div>
            <p className="mt-3">Loading minute replies...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !minute) {
    return (
      <div className="content-wrapper">
        <div className="card">
          <div className="card-body text-center py-5">
            <div className="alert alert-danger" role="alert">
              <i className="ti-alert-circle mr-2"></i>
              <strong>Error:</strong> {error}
            </div>
            <Link to="/admin/recordnotes" className="btn btn-secondary mt-3">
              <i className="ti-arrow-left mr-1"></i> Back to Meetings
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!minute) {
    return (
      <div className="content-wrapper">
        <div className="card">
          <div className="card-body text-center py-5">
            <p>Minute not found</p>
            <Link to="/admin/recordnotes" className="btn btn-secondary">
              <i className="ti-arrow-left mr-1"></i> Back
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const sortedReplies = [...replies].sort((a, b) => 
    new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  return (
    <div className="content-wrapper">
      <style>{`
        .select2 {
          width: 100% !important;
          margin-bottom: 10px;
        }
        .timeline-wrapper {
          position: relative;
          padding: 20px 0;
        }
        .timeline-wrapper-success .timeline-badge {
          background-color: #28a745;
        }
        .timeline-wrapper-primary .timeline-badge {
          background-color: #007bff;
        }
        .timeline-badge {
          position: absolute;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          left: 50%;
          transform: translateX(-50%);
          z-index: 2;
        }
        .timeline-panel {
          position: relative;
          width: 45%;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 20px;
        }
        .timeline-wrapper-success .timeline-panel {
          left: 0;
          background-color: #d4edda;
        }
        .timeline-wrapper-primary .timeline-panel {
          right: 0;
          background-color: #cce5ff;
        }
        .timeline-inverted .timeline-panel {
          left: auto;
          right: 0;
        }
        .timeline-heading {
          margin-bottom: 10px;
        }
        .timeline-title {
          font-weight: bold;
          margin-bottom: 5px;
        }
        .timeline-body {
          margin-bottom: 10px;
        }
        .timeline-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 10px;
        }
        .admin-user-bg-color {
          background-color: #d4edda !important;
        }
        .auth-user-bg-color {
          background-color: #cce5ff !important;
        }
        .list-inline {
          padding: 0;
          margin: 0;
        }
        .list-inline-item {
          display: inline-block;
          font-size: 14px;
          font-weight: bold;
          color: #007bff;
          margin-right: 10px;
        }
      `}</style>
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header text-center">
              <div className="d-flex gap-3 justify-content-between align-items-center">
                <div className="flex-grow-1 text-center">
                  <p className="block display-4">Minutes</p>
                </div>
                <div>
                  <div className="btn-toolbar pull-right">
                    <div className="btn-group">
                      <Link
                        to="/admin/recordnotes"
                        className="btn btn-outline-primary btn-fw"
                        role="button"
                      >
                        <i className="ti-arrow-left mr-1"></i> Back
                      </Link>
                      <a href="#add-reply" className="btn btn-outline-primary btn-fw" role="button">
                        <i className="ti-share-alt mr-1"></i> Reply
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="card-body">
              <div className="card-title text-dark">
                <div className="d-flex justify-content-start mb-3">
                  <div className="pr-3 display-5 font-weight-bold">Agenda: </div>
                  <div className="display-5 text-justify">
                    {minute.issues ? (
                      <div dangerouslySetInnerHTML={{ __html: minute.issues }} />
                    ) : (
                      minute.heading || ''
                    )}
                  </div>
                </div>
                <div className="d-flex justify-content-start">
                  <div className="pr-3 display-5 font-weight-bold">Decision Detail: </div>
                  <div className="display-5 text-justify" dangerouslySetInnerHTML={{ __html: minute.decisions || '' }} />
                </div>
              </div>
              <div className="row">
                <div className="col">
                  <ul className="nav profile-navbar d-flex justify-content-end border-top">
                    {minute.creator?.name && (
                      <li className="nav-item">
                        <a className="nav-link" href="#">
                          <i className="fa fa-user-circle" style={{ color: '#248afd' }}></i>
                          {minute.creator.name}
                        </a>
                      </li>
                    )}
                    {minute.creator?.phone && (
                      <li className="nav-item">
                        <a className="nav-link active" href="#">
                          <i className="fa fa-phone-square"></i>
                          {minute.creator.phone}
                        </a>
                      </li>
                    )}
                  </ul>
                </div>
              </div>

              <div className="mt-3">
                <div>
                  <h4 className="text-center">History</h4>
                </div>
                <hr />
                {sortedReplies.length > 0 ? (
                  <div className="timeline">
                    {sortedReplies.map((reply) => {
                      const isAdmin = isAdminReply(reply);
                      return (
                        <div
                          key={reply.id}
                          className={`timeline-wrapper ${isAdmin ? 'timeline-wrapper-success' : 'timeline-wrapper-primary timeline-inverted'}`}
                        >
                          <div className="timeline-badge"></div>
                          <div
                            className={`timeline-panel ${isAdmin ? 'admin-user-bg-color' : 'auth-user-bg-color'}`}
                            id={`reply${reply.id}`}
                          >
                            <div className="timeline-heading">
                              <h6 className="timeline-title">
                                <i className="ti-share-alt text-primary mr-1"></i>
                                {isAdmin ? 'Admin' : (reply.user.department?.name || 'Department')}
                              </h6>
                              <div className="mb-3">
                                {reply.user.name && (
                                  <small className="text-muted mb-0">
                                    <i className="fa fa-user-circle mr-1"></i>
                                    {reply.user.name}
                                  </small>
                                )}
                                {reply.user.phone && (
                                  <small className="text-muted mb-0">
                                    <i className="fa fa-phone-square mr-1"></i>
                                    {reply.user.phone}
                                  </small>
                                )}
                              </div>
                            </div>
                            <div className="timeline-body mb-3">
                              {reply.taggedDepartments && reply.taggedDepartments.length > 0 && (
                                <ul className="list-inline">
                                  {reply.taggedDepartments.map((dept) => (
                                    <li key={dept.id} className="list-inline-item">
                                      <i className="fas fa-tag" style={{ color: '#007bff', marginRight: '5px' }}></i>
                                      {dept.name}
                                    </li>
                                  ))}
                                </ul>
                              )}
                              <div className="mt-3 mb-3 text-justify" dangerouslySetInnerHTML={{ __html: reply.reply_detail }} />
                              {reply.attachments && reply.attachments.length > 0 && (
                                <div className="form-group mt-3">
                                  <span className="text-dark">
                                    <i className="ti-files"></i>
                                    <small>Attachments</small>
                                  </span>
                                  <ol className="mt-1 ml-2">
                                    {reply.attachments.map((file, idx) => (
                                      <li key={idx}>
                                        <a href="#" target="_blank" title="Click to download">
                                          <i className="ti-file"></i>
                                          <small>{file}</small>
                                        </a>
                                      </li>
                                    ))}
                                  </ol>
                                </div>
                              )}
                              {reply.status === 8 && reply.remarks && (
                                <div className="mb-2">
                                  <span className="font-weight-bold">Remarks: </span>
                                  <span className="font-weight-bold text-primary">{reply.remarks}</span>
                                  {reply.other_remarks && (
                                    <span className="mt-1 small" dangerouslySetInnerHTML={{ __html: reply.other_remarks }} />
                                  )}
                                </div>
                              )}
                              {(reply.status === 6 || reply.status === 9) && reply.overdue_reason && (
                                <div className="mb-2">
                                  <span className="font-weight-bold">Reason: </span>
                                  <span className="mt-1 small" dangerouslySetInnerHTML={{ __html: reply.overdue_reason }} />
                                </div>
                              )}
                            </div>
                            <div className="timeline-footer d-flex align-items-center flex-wrap">
                              <div>
                                {reply.status && (
                                  <span className={`badge ${getBadgeClass(reply.status)}`}>
                                    {getStatusLabel(reply.status)}
                                  </span>
                                )}
                              </div>
                              <span className="ml-md-auto font-weight-bold">{formatDate(reply.created_at)}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div>There is no reply so far</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row" id="add-reply">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-body">
              <form 
                className="form-sample" 
                id="admin_reply_form" 
                onSubmit={handleSubmitReply}
              >
                {error && (
                  <div className="alert alert-danger" role="alert">
                    <i className="ti-alert-circle mr-2"></i>
                    <strong>Error:</strong> {error}
                  </div>
                )}
                <fieldset>
                  <div className="row">
                    <div className="col-md-12">
                      <div className="form-group">
                        <label htmlFor="reply_detail" className="text-dark">
                          <b>Progress Reply</b> <span className="text-danger">*</span>
                        </label>
                        <textarea
                          className="form-control mt-3"
                          id="reply_detail"
                          placeholder="type reply here..."
                          name="reply_detail"
                          rows={6}
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                          required
                        ></textarea>
                      </div>
                      {/* Note: Tag departments is UI-only, not supported by API */}
                      <div className="form-group">
                        <label htmlFor="tag_departments_dropdown" className="text-dark">
                          <b>Tag departments</b> <small className="text-muted">(UI-only, not sent to API)</small>
                        </label>
                        <select
                          id="tag_departments_dropdown"
                          name="tag_departments[]"
                          style={{ width: '300px' }}
                          className="w-100 form-control form-control-lg mb-3"
                          multiple
                          value={taggedDepartmentIds.map(String)}
                          onChange={(e) => {
                            const selected = Array.from(e.target.selectedOptions, option => parseInt(option.value));
                            setTaggedDepartmentIds(selected);
                          }}
                        >
                          {relatedDepartments.map((dept) => (
                            <option key={dept.id} value={dept.id}>
                              {dept.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    {/* Note: Attachments is UI-only, API supports attachments[] but implementation pending */}
                    <div className="col-md-4">
                      <div className="form-group">
                        <label>
                          Attach Documents<small> (if any)</small> <small className="text-muted">(UI-only)</small>
                        </label>
                        <input type="file" name="attachments[]" className="file-upload-default" multiple disabled />
                        <div className="input-group col-xs-12">
                          <input
                            type="text"
                            className="form-control file-upload-info"
                            disabled
                            placeholder="Upload files (not implemented)"
                          />
                          <span className="input-group-append">
                            <button className="file-upload-browse btn btn-success" type="button" disabled>
                              Select Files
                            </button>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button 
                    className="btn btn-primary pull-right" 
                    type="submit"
                    disabled={submitting || !replyContent.trim()}
                  >
                    {submitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                        Submitting...
                      </>
                    ) : (
                      'Submit'
                    )}
                  </button>
                </fieldset>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
