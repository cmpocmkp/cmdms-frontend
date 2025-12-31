/**
 * Department PTIs Task Replies/Submit Response Page
 * EXACT replica of department/ptis/reply.blade.php from old CMDMS
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getTaskById, generateMockTaskComments, Task, TaskComment } from '../../lib/mocks/data/ptis';

// Status mapping matching old CMDMS DecisionStatus enum
const statusOptions = [
  { value: '1', label: 'Completed' },
  { value: '2', label: 'On Target' },
  { value: '3', label: 'Overdue' },
  { value: '4', label: 'Off Target' },
  { value: '6', label: 'Overdue - Other Reason' },
  { value: '8', label: 'Can Not Be Completed' },
  { value: '9', label: 'Off Target - Other Reason' }
];

const statusBadgeClasses: Record<string, string> = {
  '1': 'badge-success',
  '2': 'badge-info',
  '3': 'badge-warning',
  '4': 'badge-danger',
  '6': 'badge-warning',
  '8': 'badge-danger',
  '9': 'badge-danger',
  'Completed': 'badge-success',
  'On Target': 'badge-info',
  'Overdue': 'badge-warning',
  'Off Target': 'badge-danger',
  'Pending': 'badge-secondary'
};

interface AttachmentField {
  file: File | null;
  title: string;
}

export default function DepartmentPTIsTaskReplies() {
  const { taskId } = useParams<{ taskId: string }>();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [task, setTask] = useState<Task | null>(null);
  const [comments, setComments] = useState<TaskComment[]>([]);
  const [replyDetail, setReplyDetail] = useState('');
  const [status, setStatus] = useState('');
  const [attachmentFields, setAttachmentFields] = useState<AttachmentField[]>([{ file: null, title: '' }]);
  const [overdueReason, setOverdueReason] = useState('');
  const [remarks, setRemarks] = useState('');
  const [otherRemarks, setOtherRemarks] = useState('');
  const [isChatCollapsed, setIsChatCollapsed] = useState(false);
  const [isReplyCollapsed, setIsReplyCollapsed] = useState(false);

  const taskIdNum = taskId ? parseInt(taskId) : 0;
  const statusParam = searchParams.get('status') || '';
  const pageParam = searchParams.get('page') || '1';

  // Get department ID
  const departmentId = useMemo(() => {
    if (!user?.department?.id) return null;
    return typeof user.department.id === 'number' 
      ? user.department.id 
      : Number(user.department.id);
  }, [user?.department?.id]);

  // Load task and comments
  useEffect(() => {
    if (taskIdNum && departmentId) {
      const taskData = getTaskById(taskIdNum);
      if (taskData) {
        setTask(taskData);
        // Generate comments for this task and department
        const taskComments = generateMockTaskComments(taskIdNum, departmentId);
        setComments(taskComments);
      }
    }
  }, [taskIdNum, departmentId]);

  const isCompleted = useMemo(() => {
    if (!task || !departmentId) return false;
    const dept = task.departments?.find(d => d.id === departmentId);
    return dept?.pivot?.status === 'Completed';
  }, [task, departmentId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getFileIconClass = (filename: string): string => {
    const ext = filename.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'pdf': return 'ti-file';
      case 'doc':
      case 'docx': return 'ti-file';
      case 'xls':
      case 'xlsx': return 'ti-file';
      case 'jpg':
      case 'jpeg':
      case 'png': return 'ti-image';
      default: return 'ti-file';
    }
  };

  const isAdminReply = (comment: TaskComment) => {
    return comment.user.role_id === 1 || comment.user.role_id === 3; // Admin or Data Entry
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
  };

  const addAttachmentField = () => {
    setAttachmentFields([...attachmentFields, { file: null, title: '' }]);
  };

  const removeAttachmentField = (index: number) => {
    setAttachmentFields(attachmentFields.filter((_, i) => i !== index));
  };

  const handleAttachmentChange = (index: number, file: File | null) => {
    const newFields = [...attachmentFields];
    newFields[index].file = file;
    setAttachmentFields(newFields);
  };

  const handleAttachmentTitleChange = (index: number, title: string) => {
    const newFields = [...attachmentFields];
    newFields[index].title = title;
    setAttachmentFields(newFields);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Submit reply to backend
    console.log('Submit reply:', { 
      taskId: taskIdNum, 
      replyDetail, 
      status, 
      attachments: attachmentFields,
      overdueReason, 
      remarks, 
      otherRemarks 
    });
    // Show success message and refresh comments
    alert('Reply submitted successfully!');
  };

  const getTaggedDepartments = (taggedDepts: Array<{ id: number; name: string }> | undefined) => {
    if (!taggedDepts) return [];
    return taggedDepts;
  };

  if (!task) {
    return (
      <div className="content-wrapper">
        <div className="card">
          <div className="card-body">
            <p>Task not found.</p>
            <Link to={`/department/ptis?status=${statusParam}&page=${pageParam}`} className="btn btn-sm btn-inverse-dark">
              <i className="ti-arrow-left mr-1"></i>Back
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const dept = task.departments?.find(d => d.id === departmentId);
  const pivotStatus = dept?.pivot?.status || 'Pending';

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
          background: #e9ecef;
        }
        .timeline-inverted {
          text-align: right;
        }
        .timeline-badge {
          position: absolute;
          left: 20px;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #007bff;
          border: 3px solid #fff;
          z-index: 1;
        }
        .timeline-panel {
          margin-left: 60px;
          padding: 15px;
          background: #f8f9fa;
          border-radius: 5px;
          margin-bottom: 20px;
        }
        .timeline-inverted .timeline-panel {
          margin-left: 0;
          margin-right: 60px;
        }
        .auth-user-bg-color {
          background: #e3f2fd !important;
        }
        .admin-user-bg-color {
          background: #fff3e0 !important;
        }
        .timeline-title {
          font-weight: bold;
          margin-bottom: 5px;
        }
        .timeline-footer {
          margin-top: 10px;
          font-size: 0.9rem;
          color: #6c757d;
        }
        .badge-pill {
          border-radius: 50rem;
        }
      `}</style>

      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <div className="d-flex gap-3 justify-content-between align-items-center">
                <div className="flex-grow-1 text-center">
                  <p className="block display-4">PTI Tasks</p>
                  <p className="block display-5">
                    {user?.department?.name || 'Department'}
                  </p>
                </div>
                <div className="btn-toolbar mb-3">
                  <div className="btn-group">
                    {task.id && (
                      <Link
                        to={`/department/ptis?status=${statusParam}&page=${pageParam}#task${task.id}`}
                        className="btn btn-sm btn-inverse-dark btn-fw"
                        style={{ float: 'right' }}
                      >
                        <i className="ti-arrow-left mr-1"></i>Back
                      </Link>
                    )}
                    <a
                      href="#add-reply"
                      style={{ padding: '0.3rem 1rem' }}
                      className="btn btn-sm btn-inverse-dark btn-fw"
                      role="button"
                      onClick={(e) => {
                        e.preventDefault();
                        document.getElementById('add-reply')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                    >
                      <i className="ti-share-alt text-primary mr-1"></i> Reply
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="card-body">
              <div className="card-title">
                <p className="display-5 text-dark mb-3"><strong>Title:</strong> {task.title}</p>
              </div>
              <div className="mb-2">
                <p><strong>Details:</strong></p>
                <div dangerouslySetInnerHTML={{ __html: task.description }}></div>
              </div>
              <div className="mb-2">
                <p><strong>Progress:</strong></p>
                <div dangerouslySetInnerHTML={{ __html: task.progress }}></div>
              </div>
              <div className="mb-2">
                <p><strong>Timeline:</strong> {formatDate(task.timeline)}</p>
              </div>
              <div className="mb-2">
                <p><strong>Status:</strong>
                  <span className={`badge ${statusBadgeClasses[pivotStatus] || 'badge-secondary'}`}>
                    {pivotStatus}
                  </span>
                </p>
              </div>
              <div className="mb-2">
                <p><strong>Attachments:</strong></p>
              </div>
              <ul className="list-arrow">
                {task.attachments && task.attachments.length > 0 ? (
                  task.attachments.map((attachment, idx) => (
                    <li key={idx}>
                      <a href="#" onClick={(e) => {
                        e.preventDefault();
                        console.log('Download attachment:', attachment);
                      }}>
                        <i className={getFileIconClass(attachment)}></i>
                        {attachment}
                      </a>
                    </li>
                  ))
                ) : (
                  <li>No attachments</li>
                )}
              </ul>
              <div className="row border-top">
                <div className="col">
                  <ul className="nav profile-navbar d-flex justify-content-end">
                    <li className="nav-item">
                      <a className="nav-link" href="#">
                        <i className="fa fa-clock text-primary"></i>
                        <span className="text-secondary inline-block mt-2">
                          Updated {task.updated_at ? new Date(task.updated_at).toLocaleString() : 'Recently'}
                        </span>
                      </a>
                    </li>
                    {task.creator?.name && (
                      <li className="nav-item">
                        <a className="nav-link" href="#">
                          <i className="fa fa-user-circle" style={{ color: '#248afd' }}></i>
                          {task.creator.name}
                        </a>
                      </li>
                    )}
                    {task.creator?.phone && (
                      <li className="nav-item">
                        <a className="nav-link active" href="#">
                          <i className="fa fa-phone-square"></i>
                          {task.creator.phone}
                        </a>
                      </li>
                    )}
                  </ul>
                </div>
              </div>

              {/* Chat History */}
              <div className="card mt-2">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <span>Chat History</span>
                  <button
                    type="button"
                    className="btn"
                    onClick={() => setIsChatCollapsed(!isChatCollapsed)}
                    style={{ cursor: 'pointer' }}
                  >
                    <i className={`fas ${isChatCollapsed ? 'fa-plus' : 'fa-minus'}`}></i>
                  </button>
                </div>
                <div className={`card-body ${isChatCollapsed ? 'collapse' : ''}`}>
                  {comments.length === 0 ? (
                    <p className="text-muted mt-3 mb-0">
                      No responses received yet.
                    </p>
                  ) : (
                    <div className="timeline">
                      {comments.map((comment, index) => {
                        const isEven = index % 2 === 0;
                        const isAuthUser = user?.id === comment.user.id;
                        const isAdmin = isAdminReply(comment);
                        const taggedDepts = getTaggedDepartments(comment.taggedDepartments);
                        const statusLabel = comment.status 
                          ? statusOptions.find(s => s.value === comment.status)?.label || ''
                          : '';

                        return (
                          <div
                            key={comment.id}
                            className={`timeline-wrapper ${isEven ? 'timeline-inverted timeline-wrapper-primary' : 'timeline-wrapper-success'}`}
                          >
                            <div className="timeline-badge"></div>
                            <div
                              className={`timeline-panel ${isAuthUser ? 'auth-user-bg-color' : ''} ${isAdmin ? 'admin-user-bg-color' : ''}`}
                              id={`reply${comment.id}`}
                            >
                              <div className="timeline-heading">
                                <h6 className="timeline-title">
                                  <i className="ti-share-alt text-primary mr-1"></i>
                                  {comment.user.department.name}
                                </h6>
                                <div className="mb-3">
                                  {comment.user.name && (
                                    <small className="text-muted mb-0">
                                      <i className="fa fa-user-circle mr-1"></i>
                                      {comment.user.name}
                                    </small>
                                  )}
                                  {comment.user.phone && (
                                    <small className="text-muted mb-0">
                                      <i className="fa fa-phone-square mr-1"></i>
                                      {comment.user.phone}
                                    </small>
                                  )}
                                </div>
                              </div>
                              <div className="timeline-body mb-3">
                                {taggedDepts.length > 0 && (
                                  <ul className="list-inline" style={{ padding: 0, margin: 0 }}>
                                    {taggedDepts.map((tagDept) => (
                                      <li
                                        key={tagDept.id}
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
                                        {tagDept.name}
                                      </li>
                                    ))}
                                  </ul>
                                )}
                                <div className="mt-3 mb-3 text-justify" dangerouslySetInnerHTML={{ __html: comment.content }}></div>
                                {comment.attachments && comment.attachments.length > 0 && (
                                  <div className="form-group mt-3 mb-2">
                                    <span className="text-dark">
                                      <i className="ti-files"></i>
                                      <small>Attachments</small>
                                    </span>
                                    <ol className="mt-1 ml-2">
                                      {comment.attachments.map((attachment) => (
                                        <li key={attachment.id}>
                                          <a
                                            href="#"
                                            onClick={(e) => {
                                              e.preventDefault();
                                              console.log('Download attachment:', attachment.file_path);
                                            }}
                                            title="Click to download"
                                          >
                                            <i className={getFileIconClass(attachment.file_path)}></i>
                                            {attachment.file_title}
                                          </a>
                                        </li>
                                      ))}
                                    </ol>
                                  </div>
                                )}
                                {comment.status === '8' && comment.remarks && (
                                  <div className="mb-2">
                                    <span className="font-weight-bold">Remarks: </span>
                                    <span className="font-weight-bold text-primary">{comment.remarks}</span>
                                    {comment.other_remarks && (
                                      <span className="mt-1 small" dangerouslySetInnerHTML={{ __html: comment.other_remarks }}></span>
                                    )}
                                  </div>
                                )}
                                {(comment.status === '6' || comment.status === '9') && comment.reason && (
                                  <div className="mb-2">
                                    <span className="font-weight-bold">Reason: </span>
                                    <span className="mt-1 small" dangerouslySetInnerHTML={{ __html: comment.reason }}></span>
                                  </div>
                                )}
                              </div>
                              <div className="timeline-footer d-flex align-items-center flex-wrap">
                                <div>
                                  {comment.status && (
                                    <span className={`badge ${statusBadgeClasses[comment.status] || 'badge-secondary'}`}>
                                      {statusLabel}
                                    </span>
                                  )}
                                </div>
                                <span className="ml-md-auto font-weight-bold">
                                  {formatDateTime(comment.created_at)}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Reply Form */}
            <div className="card mt-2" id="add-reply">
              {!isCompleted ? (
                <>
                  <div className="card-header d-flex justify-content-between align-items-center">
                    <span>Submit Reply</span>
                    <button
                      type="button"
                      className="btn"
                      onClick={() => setIsReplyCollapsed(!isReplyCollapsed)}
                      style={{ cursor: 'pointer' }}
                    >
                      <i className={`fas ${isReplyCollapsed ? 'fa-plus' : 'fa-minus'}`}></i>
                    </button>
                  </div>

                  <div className={`card-body ${isReplyCollapsed ? 'collapse' : ''}`}>
                    <form className="form-sample" id="department_reply_form" onSubmit={handleSubmit} encType="multipart/form-data">
                      <input type="hidden" name="task_id" value={task.id} />
                      <fieldset>
                        <div className="row">
                          <div className="col-md-12">
                            <div className="form-group">
                              <label>Progress Reply</label>
                              <textarea
                                className="form-control"
                                id="content"
                                placeholder="type reply here..."
                                name="content"
                                maxLength={300}
                                rows={6}
                                value={replyDetail}
                                onChange={(e) => setReplyDetail(e.target.value)}
                              ></textarea>
                            </div>
                          </div>

                          <div className="col-md-12">
                            <div className="form-group d-flex justify-content-start align-items-center">
                              <h4 className="mr-2">Attachments</h4>
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-primary mr-2"
                                onClick={addAttachmentField}
                              >
                                <i className="ti-plus"></i> Add Attachment
                              </button>
                            </div>
                            <div className="form-group">
                              <div id="attachment-fields">
                                {attachmentFields.map((field, index) => (
                                  <div
                                    key={index}
                                    className="attachment-row d-flex align-items-center justify-content-between mb-2"
                                  >
                                    <input
                                      type="file"
                                      className="form-control mr-2"
                                      onChange={(e) => handleAttachmentChange(index, e.target.files?.[0] || null)}
                                    />
                                    <input
                                      type="text"
                                      className="form-control mr-2"
                                      placeholder="Attachment Title"
                                      value={field.title}
                                      onChange={(e) => handleAttachmentTitleChange(index, e.target.value)}
                                    />
                                    {attachmentFields.length > 1 && (
                                      <button
                                        type="button"
                                        className="btn btn-sm btn-danger"
                                        onClick={() => removeAttachmentField(index)}
                                      >
                                        <i className="ti-close"></i>
                                      </button>
                                    )}
                                  </div>
                                ))}
                              </div>
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
                                className="w-100 form-control form-control-lg"
                                value={status}
                                onChange={handleStatusChange}
                              >
                                <option value="">Select status</option>
                                {statusOptions.map((option) => (
                                  <option key={option.value} value={option.value}>
                                    {option.label}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          {(['3', '4', '6', '9'].includes(status)) && (
                            <div
                              className="col-md-12"
                              id="id_overdue_reason"
                            >
                              <div className="form-group">
                                <label id="label_reason">Overdue | Off Target reason</label>
                                <textarea
                                  className="form-control"
                                  id="reason"
                                  placeholder="type here..."
                                  name="reason"
                                  maxLength={1000}
                                  rows={6}
                                  value={overdueReason}
                                  onChange={(e) => setOverdueReason(e.target.value)}
                                ></textarea>
                              </div>
                            </div>
                          )}
                          {status === '8' && (
                            <div
                              className="col-md-4"
                              id="select_remarks_not_completed"
                            >
                              <div className="form-group">
                                <label>The task can not be completed due to</label>
                                <select
                                  style={{ width: '300px' }}
                                  name="remarks"
                                  className="w-100 form-control form-control-lg"
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
                          )}
                        </div>
                        {(['6', '9'].includes(status)) && (
                          <div
                            className="row"
                            id="select_remarks_response"
                          >
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
                        )}
                        <input className="btn btn-primary pull-right" type="submit" value="Submit" />
                      </fieldset>
                    </form>
                  </div>
                </>
              ) : (
                <div className="card-body text-center">
                  <div style={{ backgroundColor: '#71c016' }} className="badge badge-success badge-pill">
                    Completed
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

