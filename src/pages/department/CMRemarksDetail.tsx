/**
 * Department CM Remarks Detail/Reply Page
 * EXACT replica of department/cmremarks/reply.blade.php from old CMDMS
 */

import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { mockCMRemarks } from '../../lib/mocks/data/cmRemarks';

interface Reply {
  id: number;
  reply_detail: string;
  attachments?: string[];
  status?: number;
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
  tag_departments?: number[];
}

interface CMRemark {
  id: number;
  subject: string;
  section_name: string;
  letter_number: string;
  issue_date: string;
  timeline: string;
  attachments?: string[];
  creator?: {
    name: string;
    phone?: string;
  };
  status: string | number;
  replies: Reply[];
}

// Status mapping
const statusMap: { [key: number]: { label: string; badgeClass: string } } = {
  1: { label: 'Completed', badgeClass: 'badge-success' },
  2: { label: 'On Target', badgeClass: 'badge-info' },
  3: { label: 'Overdue', badgeClass: 'badge-danger' },
  4: { label: 'Off Target', badgeClass: 'badge-danger' },
  6: { label: 'Overdue Other Reason', badgeClass: 'badge-indigo' },
  7: { label: 'Ongoing', badgeClass: 'badge-warning' },
  8: { label: 'Task can not be completed', badgeClass: 'badge-dark' },
  9: { label: 'Off Target Other Reason', badgeClass: 'badge-lightred' }
};

// Mock replies data
const generateMockReplies = (_remarkId: number): Reply[] => {
  return [
    {
      id: 1,
      reply_detail: '<p>This is a sample reply from the department regarding the progress of this CM remark.</p>',
      attachments: ['document1.pdf', 'report.xlsx'],
      status: 2,
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      user: {
        id: 1,
        name: 'Admin User',
        phone: '+92-300-1234567',
        role_id: 1,
        department: undefined
      },
      tag_departments: []
    },
    {
      id: 2,
      reply_detail: '<p>Department response: We are working on this issue and expect to complete it within the timeline.</p>',
      attachments: ['update.pdf'],
      status: 2,
      created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      user: {
        id: 31,
        name: 'Muhammad Asif',
        phone: '+92-300-7654321',
        role_id: 2,
        department: {
          id: 22,
          name: 'Housing Department'
        }
      },
      tag_departments: [22]
    }
  ];
};

export default function CMRemarksDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [replyDetail, setReplyDetail] = useState('');
  const [status, setStatus] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [overdueReason, setOverdueReason] = useState('');
  const [remarks, setRemarks] = useState('');
  const [otherRemarks, setOtherRemarks] = useState('');

  const remarkId = id ? parseInt(id) : 0;
  const remark = mockCMRemarks.find(r => r.id === remarkId);

  // Mock remark data
  const remarkData: CMRemark = remark ? {
    id: remark.id,
    subject: remark.subject,
    section_name: remark.section_name,
    letter_number: remark.letter_number,
    issue_date: remark.issue_date,
    timeline: remark.timeline,
    attachments: remark.attachments,
    creator: {
      name: 'CM Office',
      phone: '+92-300-0000000'
    },
    status: remark.status,
    replies: generateMockReplies(remarkId)
  } : {
    id: 0,
    subject: '',
    section_name: '',
    letter_number: '',
    issue_date: '',
    timeline: '',
    status: '',
    replies: []
  };

  const isCompleted = remarkData.status === 'Completed' || remarkData.status === 1;
  const isAdminReply = (reply: Reply) => {
    return reply.user.role_id === 1 || reply.user.role_id === 3; // Admin or Data Entry
  };

  // Calculate days remaining
  const calculateDaysRemaining = () => {
    if (!remarkData.timeline) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(remarkData.timeline);
    dueDate.setHours(0, 0, 0, 0);
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysRemaining = calculateDaysRemaining();
  const statusStr = typeof remarkData.status === 'number' ? String(remarkData.status) : remarkData.status;
  const showDaysRemaining = ['Overdue', 'On Target'].includes(statusStr) && daysRemaining !== null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement API call
    console.log('Submit reply:', { replyDetail, status, attachments, overdueReason, remarks, otherRemarks });
    // Navigate back or show success message
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    
    // Show/hide reason fields based on status
    const overdueReasonField = document.getElementById('id_overdue_reason');
    const remarksNotCompletedField = document.getElementById('select_remarks_not_completed');
    const remarksResponseField = document.getElementById('select_remarks_response');
    
    if (overdueReasonField) {
      overdueReasonField.style.display = ['3', '4', '6', '9'].includes(newStatus) ? 'block' : 'none';
    }
    if (remarksNotCompletedField) {
      remarksNotCompletedField.style.display = newStatus === '8' ? 'block' : 'none';
    }
    if (remarksResponseField) {
      remarksResponseField.style.display = ['6', '9'].includes(newStatus) ? 'block' : 'none';
    }
  };

  if (!remark) {
    return (
      <div className="content-wrapper">
        <div className="card">
          <div className="card-body">
            <p>CM Remark not found.</p>
            <Link to="/department/cm-remarks" className="btn btn-sm btn-inverse-dark">
              <i className="ti-arrow-left text-primary mr-1"></i>Back
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="content-wrapper">
      <style>{`
        .timeline-wrapper {
          position: relative;
          padding: 20px 0;
        }
        .timeline-wrapper::before {
          content: '';
          position: absolute;
          left: 30px;
          top: 0;
          bottom: 0;
          width: 2px;
          background: #e0e0e0;
        }
        .timeline-wrapper-primary::before {
          background: #007bff;
        }
        .timeline-wrapper-success::before {
          background: #28a745;
        }
        .timeline-badge {
          position: absolute;
          left: 20px;
          top: 20px;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #fff;
          border: 3px solid #e0e0e0;
          z-index: 1;
        }
        .timeline-wrapper-primary .timeline-badge {
          border-color: #007bff;
        }
        .timeline-wrapper-success .timeline-badge {
          border-color: #28a745;
        }
        .timeline-panel {
          margin-left: 60px;
          background: #fff;
          border: 1px solid #e0e0e0;
          border-radius: 4px;
          padding: 15px;
          position: relative;
        }
        .timeline-inverted .timeline-panel {
          margin-left: 60px;
          margin-right: 0;
        }
        .auth-user-bg-color {
          background-color: #e3f2fd !important;
        }
        .admin-user-bg-color {
          background-color: #fff3e0 !important;
        }
        .timeline-heading {
          margin-bottom: 10px;
        }
        .timeline-title {
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 5px;
        }
        .timeline-body {
          margin-bottom: 10px;
        }
        .timeline-footer {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          margin-top: 10px;
          padding-top: 10px;
          border-top: 1px solid #e0e0e0;
        }
        .breadcrumb-custom {
          background: transparent;
          padding: 0;
          margin-bottom: 20px;
        }
        .breadcrumb-custom .breadcrumb-item {
          font-size: 14px;
        }
        .breadcrumb-custom .breadcrumb-item.active {
          color: #495057;
        }
        .nav-profile {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .nav-profile li {
          display: inline-block;
          margin-right: 15px;
        }
        .nav-profile .nav-link {
          color: #495057;
          text-decoration: none;
        }
        .file-upload-default {
          display: none;
        }
        .file-upload-info {
          background: #f8f9fa;
        }
      `}</style>

      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <ul className="nav profile-navbar">
                    {remarkData.creator?.name && (
                      <li className="nav-item">
                        <a className="nav-link" href="#">
                          <i className="fa fa-user-circle" style={{ color: '#248afd' }}></i>
                          {remarkData.creator.name}
                        </a>
                      </li>
                    )}
                    {remarkData.creator?.phone && (
                      <li className="nav-item">
                        <a className="nav-link active" href="#">
                          <i className="fa fa-phone-square"></i>
                          {remarkData.creator.phone}
                        </a>
                      </li>
                    )}
                  </ul>
                </div>

                <div className="col-md-6">
                  <div className="btn-toolbar pull-right mb-3">
                    <div className="btn-group">
                      <Link
                        to="/department/cm-remarks"
                        className="btn btn-sm btn-inverse-dark btn-fw"
                        style={{ float: 'right' }}
                      >
                        <i className="ti-arrow-left text-primary mr-1"></i>Back
                      </Link>
                      <a
                        href="#add-reply"
                        style={{ padding: '0.3rem 1rem' }}
                        className="btn btn-sm btn-inverse-dark btn-fw"
                        role="button"
                      >
                        <i className="ti-share-alt text-primary mr-1"></i> Reply
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-12">
                  <nav aria-label="breadcrumb">
                    <ol className="breadcrumb breadcrumb-custom">
                      <li className="breadcrumb-item">
                        <a href="#">CM Remarks</a>
                      </li>
                      <li className="breadcrumb-item active" aria-current="page">
                        <span dangerouslySetInnerHTML={{ __html: remarkData.subject }}></span>
                      </li>
                    </ol>

                    {showDaysRemaining && (
                      <span
                        className="fw-bold"
                        style={{
                          color:
                            daysRemaining! > 0
                              ? 'green'
                              : daysRemaining === 0
                              ? 'orange'
                              : 'red'
                        }}
                      >
                        (
                        {daysRemaining! > 1
                          ? `${daysRemaining} days remaining`
                          : daysRemaining === 1
                          ? '1 day remaining'
                          : daysRemaining === 0
                          ? 'Today is the last day'
                          : `${Math.abs(daysRemaining!)} ${Math.abs(daysRemaining!) === 1 ? 'day' : 'days'} overdue`}
                        )
                      </span>
                    )}
                    <hr />
                  </nav>
                </div>
              </div>

              <div className="mt-5">
                <div className="timeline">
                  {remarkData.replies.length > 0 ? (
                    remarkData.replies.map((reply, index) => {
                      const isAdmin = isAdminReply(reply);
                      const isEven = index % 2 === 0;
                      const statusInfo = reply.status ? statusMap[reply.status] : null;

                      return (
                        <div
                          key={reply.id}
                          className={`timeline-wrapper ${isEven ? 'timeline-inverted timeline-wrapper-primary' : 'timeline-wrapper-success'}`}
                        >
                          <div className="timeline-badge"></div>
                          <div
                            className={`timeline-panel ${user?.id === reply.user.id ? 'auth-user-bg-color' : ''} ${isAdmin ? 'admin-user-bg-color' : ''}`}
                            id={`reply${reply.id}`}
                          >
                            <div className="timeline-heading">
                              <h6 className="timeline-title">
                                <i className="ti-share-alt text-primary mr-1"></i>
                                {(reply.user.role_id === 2 || reply.user.role_id === 7)
                                  ? reply.user.department?.name || 'Department'
                                  : 'Admin'}
                              </h6>
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
                            <div className="timeline-body">
                              {reply.tag_departments && reply.tag_departments.length > 0 && (
                                <ul className="list-inline" style={{ padding: 0, margin: 0 }}>
                                  {reply.tag_departments.map((deptId, idx) => (
                                    <li
                                      key={idx}
                                      className="list-inline-item"
                                      style={{
                                        display: 'inline-block',
                                        fontSize: '14px',
                                        fontWeight: 'bold',
                                        color: '#007bff',
                                        marginRight: '10px'
                                      }}
                                    >
                                      <i className="fas fa-tag" style={{ color: '#007bff', marginRight: '5px' }}></i>
                                      Department {deptId}
                                    </li>
                                  ))}
                                </ul>
                              )}

                              <p dangerouslySetInnerHTML={{ __html: reply.reply_detail }}></p>

                              {statusInfo && (
                                <p className="mb-0">
                                  <label
                                    style={{ width: '100px' }}
                                    className={`badge ${statusInfo.badgeClass} badge-pill`}
                                  >
                                    {statusInfo.label}
                                  </label>
                                  <hr />
                                  {reply.overdue_reason && (
                                    <div dangerouslySetInnerHTML={{ __html: reply.overdue_reason }}></div>
                                  )}
                                </p>
                              )}
                            </div>
                            <div className="timeline-footer d-flex align-items-center flex-wrap">
                              {reply.attachments && reply.attachments.length > 0 && (
                                <div className="buttons">
                                  <i className="ti-file"></i>
                                  {reply.attachments.map((file, idx) => (
                                    <span key={idx}>
                                      |<a
                                        href={`/storage/cmremarks_replies_uploads/${file}`}
                                        title="click to download attach file"
                                        download
                                      >
                                        Download
                                      </a>
                                    </span>
                                  ))}
                                </div>
                              )}
                              <span className="ml-md-auto font-weight-bold">{formatDate(reply.created_at)}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div>There is no reply so far</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row" id="add-reply">
        <div className="col-lg-12">
          <div className="card">
            {!isCompleted ? (
              <div className="card-body">
                <form className="form-sample" id="department_reply_form" onSubmit={handleSubmit} encType="multipart/form-data">
                  <fieldset>
                    <div className="row">
                      <div className="col-md-12">
                        <div className="form-group">
                          <label>Response</label>
                          <textarea
                            className="form-control"
                            id="reply_detail"
                            placeholder="type reply here..."
                            name="reply_detail"
                            maxLength={1000}
                            rows={6}
                            required
                            value={replyDetail}
                            onChange={(e) => setReplyDetail(e.target.value)}
                          ></textarea>
                          <span id="maxContentPost"></span>
                          <p>
                            Character limit <span className="text-danger">1000</span>
                          </p>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-group">
                          <label>
                            Attach Documents<small> (if any)</small>
                          </label>
                          <input
                            type="file"
                            name="attachments[]"
                            className="file-upload-default"
                            multiple
                            onChange={(e) => {
                              if (e.target.files) {
                                setAttachments(Array.from(e.target.files));
                              }
                            }}
                          />
                          <div className="input-group col-xs-12">
                            <input
                              type="text"
                              className="form-control file-upload-info"
                              disabled
                              placeholder="Upload files"
                              value={attachments.length > 0 ? `${attachments.length} file(s) selected` : ''}
                            />
                            <span className="input-group-append">
                              <button
                                className="file-upload-browse btn btn-success"
                                type="button"
                                onClick={() => {
                                  const input = document.querySelector('input[name="attachments[]"]') as HTMLInputElement;
                                  input?.click();
                                }}
                              >
                                Select Files
                              </button>
                            </span>
                          </div>
                          <p>
                            Number of files limit is <span className="text-danger"> 3 </span>each
                            <span className="text-danger"> 5MB</span>
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-3">
                        <label>Response Status</label>
                        <div className="form-group">
                          <select
                            id="add_status_dropdown"
                            name="status"
                            style={{ width: '250px' }}
                            className="js-example-basic-multiple w-100 form-control form-control-lg"
                            required
                            value={status}
                            onChange={handleStatusChange}
                          >
                            <option value="" disabled>
                              Please Select Status
                            </option>
                            <option value="1">Completed</option>
                            <option value="2">On Target</option>
                            <option value="3">Overdue</option>
                            <option value="4">Off Target</option>
                            <option value="6">Overdue Other Reason</option>
                            <option value="7">Ongoing</option>
                            <option value="8">Task can not be completed</option>
                            <option value="9">Off Target Other Reason</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-12" style={{ display: 'none' }} id="id_overdue_reason">
                        <div className="form-group">
                          <label>Response status reason</label>
                          <textarea
                            className="form-control"
                            id="overdue_reason"
                            placeholder="type  here..."
                            name="overdue_reason"
                            maxLength={1000}
                            rows={6}
                            value={overdueReason}
                            onChange={(e) => setOverdueReason(e.target.value)}
                          ></textarea>
                        </div>
                      </div>
                      <div className="col-md-4" style={{ display: 'none' }} id="select_remarks_not_completed">
                        <div className="form-group">
                          <label>The task can not be completed due to</label>
                          <select
                            style={{ width: '300px' }}
                            name="remarks"
                            className="js-example-basic-single w-100 form-control form-control-lg"
                            value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                          >
                            <option value="">Select (Optional)</option>
                            <option value="Adminstration">Administration</option>
                            <option value="Legal">Legal</option>
                            <option value="Financial">Financial</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="row" style={{ display: 'none' }} id="select_remarks_response">
                      <div className="col-md-12">
                        <div className="form-group">
                          <label>Remarks</label>
                          <textarea
                            className="form-control"
                            id="other_remarks"
                            placeholder="type reply here..."
                            name="other_remarks"
                            maxLength={1000}
                            rows={6}
                            value={otherRemarks}
                            onChange={(e) => setOtherRemarks(e.target.value)}
                          ></textarea>
                        </div>
                      </div>
                    </div>
                    <input className="btn btn-primary pull-right" type="submit" value="Submit" />
                  </fieldset>
                </form>
              </div>
            ) : (
              <div style={{ background: '#71c016' }} className="badge badge-success badge-pill">
                Completed
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

