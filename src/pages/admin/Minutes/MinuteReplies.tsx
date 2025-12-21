/**
 * Minute Replies/Chat - Admin Module
 * EXACT replica of admin/recordnotes/reply.blade.php
 */

import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

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
  const [minute, setMinute] = useState<Minute | null>(null);
  const [relatedDepartments, setRelatedDepartments] = useState<Department[]>([]);
  const [_allDepartments, setAllDepartments] = useState<Department[]>([]);

  useEffect(() => {
    // TODO: Replace with actual API call
    // const fetchData = async () => {
    //   try {
    //     const response = await api.get(`/admin/replies/minutes/${id}`);
    //     setMinute(response.data.minutes);
    //     setRelatedDepartments(response.data.relatedDepartments);
    //     setAllDepartments(response.data.allDepartments);
    //   } catch (error) {
    //     console.error('Error fetching minute replies:', error);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchData();

    // Mock data for testing
    setMinute({
      id: parseInt(id || '1'),
      issues: '<p>Implementation of Health Insurance Scheme for all citizens</p>',
      heading: 'Health Insurance Scheme',
      decisions: '<p>Approved the health insurance scheme with comprehensive coverage including primary healthcare, emergency services, and specialized treatments.</p>',
      comments: '<p>CM Office Response: The implementation is progressing well.</p>',
      timeline: '2024-03-15',
      status: 2,
      status_label: 'On Target',
      status_class: 'badge-warning',
      meeting_id: 1,
      creator: {
        name: 'Admin User',
        phone: '+92-300-1234567',
      },
      departments: [
        { id: 1, name: 'Health Department' },
        { id: 2, name: 'Finance Department' },
        { id: 3, name: 'Public Works Department' },
      ],
      replies: [
        {
          id: 1,
          reply_detail: '<p>Health Department Response: We have completed the initial assessment and identified key implementation areas. The scheme will cover all districts.</p>',
          attachments: ['assessment_report.pdf'],
          status: 2,
          status_label: 'On Target',
          status_class: 'badge-warning',
          created_at: '2024-01-20T10:30:00',
          user: {
            id: 2,
            name: 'Department User',
            phone: '+92-300-7654321',
            role_id: 2,
            department: {
              id: 1,
              name: 'Health Department',
            },
          },
          taggedDepartments: [
            { id: 1, name: 'Health Department' },
          ],
        },
        {
          id: 2,
          reply_detail: '<p>Admin Response: Thank you for the update. Please ensure all districts are covered and provide a detailed implementation timeline.</p>',
          status: 2,
          status_label: 'On Target',
          status_class: 'badge-warning',
          created_at: '2024-01-21T14:20:00',
          user: {
            id: 1,
            name: 'Admin User',
            phone: '+92-300-1234567',
            role_id: 1,
            department: {
              id: 1,
              name: 'CM Office',
            },
          },
        },
        {
          id: 3,
          reply_detail: '<p>Finance Department Response: Budget has been allocated. We are coordinating with Health Department for fund disbursement schedule.</p>',
          status: 2,
          status_label: 'On Target',
          status_class: 'badge-warning',
          created_at: '2024-01-22T09:15:00',
          user: {
            id: 3,
            name: 'Finance User',
            phone: '+92-300-9876543',
            role_id: 2,
            department: {
              id: 2,
              name: 'Finance Department',
            },
          },
          taggedDepartments: [
            { id: 2, name: 'Finance Department' },
          ],
        },
      ],
    });

    setRelatedDepartments([
      { id: 1, name: 'Health Department' },
      { id: 2, name: 'Finance Department' },
      { id: 3, name: 'Public Works Department' },
    ]);

    setAllDepartments([
      { id: 1, name: 'Health Department' },
      { id: 2, name: 'Finance Department' },
      { id: 3, name: 'Public Works Department' },
      { id: 4, name: 'Education Department' },
    ]);

    setLoading(false);
  }, [id]);

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

  if (!minute) {
    return (
      <div className="content-wrapper">
        <div className="card">
          <div className="card-body text-center py-5">
            <p>Minute not found</p>
            <Link to="/admin/report/cabinet-meetings" className="btn btn-secondary">
              <i className="ti-arrow-left mr-1"></i> Back
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const sortedReplies = [...minute.replies].sort((a, b) => 
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
                        to="/admin/report/cabinet-meetings"
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
              <form className="form-sample" id="admin_reply_form" method="post" encType="multipart/form-data">
                <p className="description">
                  <input type="hidden" name="minute_id" value={minute.id} />
                </p>
                <fieldset>
                  <div className="row">
                    <div className="col-md-12">
                      <div className="form-group">
                        <label htmlFor="reply_detail" className="text-dark">
                          <b>Progress Reply</b>
                        </label>
                        <textarea
                          className="form-control mt-3"
                          id="reply_detail"
                          placeholder="type reply here..."
                          name="reply_detail"
                          rows={6}
                        ></textarea>
                      </div>
                      <div className="form-group">
                        <label htmlFor="tag_departments_dropdown" className="text-dark">
                          <b>Tag departments</b>
                        </label>
                        <select
                          id="tag_departments_dropdown"
                          name="tag_departments[]"
                          style={{ width: '300px' }}
                          className="w-100 form-control form-control-lg mb-3"
                          multiple
                        >
                          {relatedDepartments.map((dept) => (
                            <option key={dept.id} value={dept.id}>
                              {dept.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="form-group">
                        <label>
                          Attach Documents<small> (if any)</small>
                        </label>
                        <input type="file" name="attachments[]" className="file-upload-default" multiple />
                        <div className="input-group col-xs-12">
                          <input
                            type="text"
                            className="form-control file-upload-info"
                            disabled
                            placeholder="Upload files"
                          />
                          <span className="input-group-append">
                            <button className="file-upload-browse btn btn-success" type="button">
                              Select Files
                            </button>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <input className="btn btn-primary pull-right" type="submit" value="Submit" />
                </fieldset>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
