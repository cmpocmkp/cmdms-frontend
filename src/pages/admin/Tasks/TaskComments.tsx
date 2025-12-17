/**
 * Task Comments/Chat History - Admin Module
 * EXACT replica of admin/tasks/comments.blade.php from old CMDMS
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

// Mock comment data structure
interface CommentAttachment {
  id: number;
  file_path: string;
  file_title: string;
}

interface Comment {
  id: number;
  content: string; // HTML content
  status: string | null;
  remarks?: string;
  other_remarks?: string;
  reason?: string;
  created_at: string;
  user: {
    id: number;
    name: string;
    phone?: string;
    role_id: number; // 1=Admin, 2=Department, 3=DataEntry
    department: {
      name: string;
    };
  };
  taggedDepartments?: Array<{
    id: number;
    name: string;
  }>;
  attachments?: CommentAttachment[];
}

interface Task {
  id: number;
  title: string;
  description: string;
  progress: string;
  timeline: string;
  status: string;
  updated_at: string;
  creator?: {
    name: string;
    phone: string;
  };
  attachments?: Array<{
    id: number;
    file_path: string;
    file_title: string;
  }>;
  comments: Comment[];
  departments: Array<{
    id: number;
    name: string;
  }>;
}

// Mock task data (in real app, fetch from API)
const mockTask: Task = {
  id: 1,
  title: 'Sample Task Title',
  description: '<p>This is a sample task description with some details.</p>',
  progress: '<p>Task is progressing well.</p>',
  timeline: new Date().toISOString(),
  status: 'In Progress',
  updated_at: new Date().toISOString(),
  creator: {
    name: 'John Doe',
    phone: '+92-300-1234567'
  },
  attachments: [
    { id: 1, file_path: 'path/to/file.pdf', file_title: 'Task Document.pdf' }
  ],
  departments: [
    { id: 1, name: 'Planning & Development' },
    { id: 2, name: 'Finance Department' }
  ],
  comments: [
    {
      id: 1,
      content: '<p>This is a comment from the department.</p>',
      status: 'In Progress',
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      user: {
        id: 1,
        name: 'Jane Smith',
        phone: '+92-300-7654321',
        role_id: 2, // Department user
        department: { name: 'Finance Department' }
      },
      attachments: []
    },
    {
      id: 2,
      content: '<p>This is a reply from admin.</p>',
      status: 'Completed',
      created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      user: {
        id: 2,
        name: 'Admin User',
        role_id: 1, // Admin
        department: { name: 'Admin Department' }
      },
      taggedDepartments: [{ id: 1, name: 'Planning & Development' }],
      attachments: []
    }
  ]
};

export default function TaskComments() {
  // const { taskId } = useParams<{ taskId: string }>(); // Will be used when API is integrated
  // In real app: const task = await fetchTask(taskId);
  const task = mockTask;
  
  const [isChatExpanded, setIsChatExpanded] = useState(true);
  const [isReplyExpanded, setIsReplyExpanded] = useState(true);
  const [attachmentFields, setAttachmentFields] = useState([{ id: 1 }]);

  const getStatusBadgeClass = (status: string | null) => {
    if (!status) return 'badge-secondary';
    switch (status) {
      case 'Completed':
        return 'badge-success';
      case 'In Progress':
        return 'badge-warning';
      case 'On Target':
        return 'badge-info';
      case 'Overdue':
        return 'badge-danger';
      case 'Pending':
        return 'badge-secondary';
      default:
        return 'badge-secondary';
    }
  };

  const handleAddAttachment = () => {
    setAttachmentFields([...attachmentFields, { id: attachmentFields.length + 1 }]);
  };

  const handleSubmitReply = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submit reply form');
    alert('Reply will be submitted via API');
  };

  // Get return URL (back to PTI detail page)
  const returnUrl = `/admin/ptis/1#row${task.id}`;

  return (
    <div className="content-wrapper">
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header text-center">
              <div className="d-flex gap-3 justify-content-between align-items-center">
                <div className="flex-grow-1 text-center">
                  <p className="block display-4">Tasks Chat</p>
                </div>
                <div>
                  <div className="btn-toolbar pull-right">
                    <div className="btn-group">
                      {returnUrl && (
                        <Link
                          to={returnUrl}
                          className="btn btn-outline-primary btn-fw"
                        >
                          <i className="ti-arrow-left mr-1"></i>Back to Parent
                        </Link>
                      )}
                      <a
                        href="#add-reply"
                        className="btn btn-outline-primary btn-fw"
                        role="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setIsReplyExpanded(true);
                          document.getElementById('add-reply')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                      >
                        <i className="ti-share-alt mr-1"></i>Reply
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="card-body">
              {/* Task Details */}
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
                <p><strong>Timeline:</strong> {new Date(task.timeline).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric'
                })}</p>
              </div>
              <div className="mb-2">
                <p><strong>Status:</strong> <span className={`badge ${getStatusBadgeClass(task.status)}`}>
                  {task.status}
                </span></p>
              </div>
              <div className="mb-2">
                <p><strong>Attachments:</strong></p>
                <ul className="list-arrow">
                  {task.attachments && task.attachments.map((attachment) => (
                    <li key={attachment.id}>
                      <a href="#" target="_blank">
                        <i className="fa fa-file"></i> {attachment.file_title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Creator Info Bar */}
              <div className="row border-top">
                <div className="col">
                  <ul className="nav profile-navbar d-flex justify-content-end">
                    <li className="nav-item">
                      <a className="nav-link" href="#">
                        <i className="fa fa-clock text-primary"></i>
                        <span className="text-secondary inline-block mt-2">
                          Updated {formatDistanceToNow(new Date(task.updated_at), { addSuffix: true })}
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

              {/* Chat History Section */}
              <div className="card mt-2">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <span>Chat History</span>
                  <button
                    type="button"
                    className="btn"
                    onClick={() => setIsChatExpanded(!isChatExpanded)}
                    style={{ cursor: 'pointer' }}
                  >
                    <i className={`fa ${isChatExpanded ? 'fa-minus' : 'fa-plus'}`}></i>
                  </button>
                </div>
                <div className={`card-body collapse ${isChatExpanded ? 'show' : ''}`} id="chatCardBody">
                  {task.comments.length === 0 ? (
                    <p className="text-muted mt-3 mb-0">
                      No responses received for this task yet.
                    </p>
                  ) : (
                    <div className="timeline">
                      {task.comments.map((comment) => {
                        const isAdmin = comment.user.role_id === 1 || comment.user.role_id === 3;
                        return (
                          <div
                            key={comment.id}
                            className={`timeline-wrapper ${isAdmin ? 'timeline-wrapper-success' : 'timeline-inverted timeline-wrapper-primary'}`}
                          >
                            <div className="timeline-badge"></div>
                            <div
                              className={`timeline-panel ${isAdmin ? 'admin-user-bg-color' : 'auth-user-bg-color'}`}
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
                                {comment.taggedDepartments && comment.taggedDepartments.length > 0 && (
                                  <ul className="list-inline" style={{ padding: 0, margin: 0 }}>
                                    {comment.taggedDepartments.map((tagDept) => (
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
                                        <i className="fa fa-tag" style={{ color: '#007bff', marginRight: '5px' }}></i>
                                        {tagDept.name}
                                      </li>
                                    ))}
                                  </ul>
                                )}
                                <div className="mt-3 mb-3 text-justify" dangerouslySetInnerHTML={{ __html: comment.content }}></div>
                                
                                {comment.attachments && comment.attachments.length > 0 && (
                                  <div className="mb-2">
                                    <p><strong>Attachments:</strong></p>
                                    <ul className="list-arrow">
                                      {comment.attachments.map((attachment) => (
                                        <li key={attachment.id}>
                                          <a href="#" target="_blank">
                                            <i className="fa fa-file"></i> {attachment.file_title}
                                          </a>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}

                                {comment.remarks && (
                                  <div className="mb-2">
                                    <span className="font-weight-bold">Remarks: </span>
                                    <span className="font-weight-bold text-primary">{comment.remarks}</span>
                                    {comment.other_remarks && (
                                      <span className="mt-1 small" dangerouslySetInnerHTML={{ __html: comment.other_remarks }}></span>
                                    )}
                                  </div>
                                )}

                                {comment.reason && (
                                  <div className="mb-2">
                                    <span className="font-weight-bold">Reason: </span>
                                    <span className="mt-1 small" dangerouslySetInnerHTML={{ __html: comment.reason }}></span>
                                  </div>
                                )}
                              </div>
                              <div className="timeline-footer d-flex align-items-center flex-wrap">
                                <div>
                                  {comment.status && (
                                    <span className={`badge ${getStatusBadgeClass(comment.status)}`}>
                                      {comment.status}
                                    </span>
                                  )}
                                </div>
                                <span className="ml-md-auto font-weight-bold">
                                  {new Date(comment.created_at).toLocaleString('en-GB', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    hour12: true
                                  })}
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

              {/* Submit Reply Section */}
              <div className="card mt-2" id="add-reply">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <span>Submit Reply</span>
                  <button
                    type="button"
                    className="btn"
                    onClick={() => setIsReplyExpanded(!isReplyExpanded)}
                    style={{ cursor: 'pointer' }}
                  >
                    <i className={`fa ${isReplyExpanded ? 'fa-minus' : 'fa-plus'}`}></i>
                  </button>
                </div>
                <div className={`card-body collapse ${isReplyExpanded ? 'show' : ''}`} id="replyCardBody">
                  <form className="form-sample" onSubmit={handleSubmitReply}>
                    <div className="row">
                      <div className="col-md-12">
                        <div className="form-group">
                          <label htmlFor="content" className="text-dark"><b>Reply Detail</b></label>
                          <textarea
                            className="form-control"
                            id="detail"
                            placeholder="type reply here..."
                            name="content"
                            rows={4}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="tag_departments_dropdown" className="text-dark"><b>Tag departments</b></label>
                          <select
                            id="tag_departments_dropdown"
                            name="tagged_department_ids[]"
                            className="form-control form-control-lg mb-3"
                            multiple
                            style={{ width: '100%', minHeight: '100px' }}
                          >
                            {task.departments.map((dept) => (
                              <option key={dept.id} value={dept.id}>
                                {dept.name}
                              </option>
                            ))}
                          </select>
                          <small className="text-muted">Hold Ctrl/Cmd to select multiple departments</small>
                        </div>
                      </div>

                      <div className="col-md-12">
                        <div className="form-group d-flex justify-content-start align-items-center">
                          <h4 className="mr-2">Attachments</h4>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-primary mr-2"
                            onClick={handleAddAttachment}
                          >
                            <i className="ti-plus"></i> Add Attachment
                          </button>
                        </div>
                        <div className="form-group">
                          <div id="attachment-fields">
                            {attachmentFields.map((field) => (
                              <div key={field.id} className="attachment-row d-flex align-items-center justify-content-between mb-2">
                                <input
                                  type="file"
                                  name="attachments[]"
                                  className="form-control mr-2"
                                />
                                <input
                                  type="text"
                                  name="attachment_titles[]"
                                  className="form-control mr-2"
                                  placeholder="Attachment Title"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    <input className="btn btn-primary pull-right" type="submit" value="Submit" />
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
