/**
 * Department Directive Detail/Reply Page
 * EXACT replica of department/directives/reply.blade.php from old CMDMS
 */

import React, { useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { mockDirectives } from '../../lib/mocks/data/directives';

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
  taggedDepartments?: Array<{
    id: number;
    name: string;
  }>;
}

interface Directive {
  id: number;
  subject: string;
  departments: Array<{
    id: number;
    name: string;
  }>;
  attachments?: Array<{
    url: string;
    label: string;
    iconClass: string;
  }>;
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
const generateMockReplies = (_directiveId: number, departmentId: number): Reply[] => {
  return [
    {
      id: 1,
      reply_detail: '<p>This is a sample reply from the admin regarding the progress of this directive.</p>',
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
      taggedDepartments: []
    },
    {
      id: 2,
      reply_detail: '<p>Department response: We are working on this directive and expect to complete it within the timeline.</p>',
      attachments: ['update.pdf'],
      status: 2,
      created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      user: {
        id: 31,
        name: 'Muhammad Asif',
        phone: '+92-300-7654321',
        role_id: 2,
        department: {
          id: departmentId,
          name: 'Housing Department'
        }
      },
      taggedDepartments: [{ id: departmentId, name: 'Housing Department' }]
    }
  ];
};

const getFileIconClass = (filename: string): string => {
  const ext = filename.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'pdf':
      return 'ti-file';
    case 'doc':
    case 'docx':
      return 'ti-file';
    case 'xls':
    case 'xlsx':
      return 'ti-file';
    case 'jpg':
    case 'jpeg':
    case 'png':
      return 'ti-image';
    default:
      return 'ti-file';
  }
};

export default function DirectiveDetailReplies() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [replyDetail, setReplyDetail] = useState('');
  const [status, setStatus] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [overdueReason, setOverdueReason] = useState('');
  const [remarks, setRemarks] = useState('');
  const [otherRemarks, setOtherRemarks] = useState('');

  const directiveId = id ? parseInt(id) : 0;
  const statusParam = searchParams.get('status') || '';
  const pageParam = searchParams.get('page') || '1';
  const directive = mockDirectives.find(d => d.id === directiveId);
  const departmentId = user?.department_id;

  // Mock directive data
  const directiveData: Directive = directive ? {
    id: directive.id,
    subject: directive.subject,
    departments: directive.departments,
    attachments: directive.attachments?.map((att, idx) => ({
      url: `/admin_assets/directives/${att}`,
      label: `document-${idx + 1}`,
      iconClass: getFileIconClass(att)
    })),
    creator: directive.creator_name ? {
      name: directive.creator_name,
      phone: '+92-300-0000000'
    } : undefined,
    status: directive.status,
    replies: generateMockReplies(directiveId, departmentId || 0)
  } : {
    id: 0,
    subject: '',
    departments: [],
    status: '',
    replies: []
  };

  // Get department-specific status
  const dept = directive?.departments.find(d => d.id === departmentId);
  const directiveStatus = dept?.status || directiveData.status;
  const isCompleted = directiveStatus === 'Completed' || directiveStatus === 1 || String(directiveStatus) === '1';

  const isAdminReply = (reply: Reply) => {
    return reply.user.role_id === 1 || reply.user.role_id === 3; // Admin or Data Entry
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setAttachments(filesArray);
      // Update the file input display
      const fileInputInfo = document.querySelector('.file-upload-info') as HTMLInputElement;
      if (fileInputInfo) {
        fileInputInfo.value = filesArray.map(f => f.name).join(', ');
      }
    }
  };

  const handleFileBrowse = () => {
    const fileInput = document.querySelector('input[name="attachments[]"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  };

  if (!directive) {
    return (
      <div className="content-wrapper">
        <div className="card">
          <div className="card-body">
            <p>Directive not found.</p>
            <Link to={`/department/directives?status=${statusParam}&page=${pageParam}`} className="btn btn-sm btn-inverse-dark">
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
        .file-upload-default {
          display: none;
        }
        .file-upload-info {
          background: #f8f9fa;
        }
        .list-arrow {
          list-style: none;
          padding: 0;
        }
        .list-arrow li {
          padding-left: 1.5rem;
        }
        .list-arrow li:before {
          font-family: "themify";
          content: "\\e649";
          color: #71c016;
          margin-left: -1.5rem;
          width: 1.5rem;
          margin-right: 0.5rem;
        }
      `}</style>

      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <div className="d-flex gap-3 justify-content-between align-items-center">
                <div className="flex-grow-1 text-center">
                  <p className="block display-4">Directives</p>
                  <p className="block display-5">{user?.department?.name ?? ''} Department</p>
                </div>
                <div className="btn-toolbar mb-3">
                  <div className="btn-group">
                    <Link
                      to={`/department/directives?status=${statusParam}&page=${pageParam}#directive${directiveId}`}
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
            <div className="card-body">
              {/* Success messages and validation errors would appear here when backend is integrated */}
              <div className="card-title">
                <div className="display-5 text-dark mb-3" dangerouslySetInnerHTML={{ __html: directiveData.subject }}></div>
              </div>
              <div className="container">
                <div className="row">
                  <div className="col-md-6">
                    <p className="font-weight-bold text-dark">
                      <i className="fa fa-institution"></i> Departments
                    </p>
                    <ul className="list-arrow ml-2">
                      {directiveData.departments.map(dept => (
                        <li key={dept.id}>
                          <span className="text-capitalize">{dept.name}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="col-md-6">
                    {directiveData.attachments && directiveData.attachments.length > 0 && (
                      <>
                        <p className="font-weight-bold text-dark">
                          <i className="fa fa-briefcase"></i> Attachments
                        </p>
                        <div className="ml-sm-3 ml-md-0 ml-xl-3 mt-2 mt-sm-0 mt-md-2 mt-xl-0">
                          <ol>
                            {directiveData.attachments.map((attachment, idx) => (
                              <li key={idx}>
                                <a href={attachment.url} target="_blank" rel="noopener noreferrer">
                                  <i className={attachment.iconClass}></i>
                                  <small>{attachment.label}</small>
                                </a>
                              </li>
                            ))}
                          </ol>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    <ul className="nav profile-navbar d-flex justify-content-end border-top">
                      {directiveData.creator?.name && (
                        <li className="nav-item">
                          <a className="nav-link" href="#">
                            <i className="fa fa-user-circle" style={{ color: '#248afd' }}></i>
                            {directiveData.creator.name}
                          </a>
                        </li>
                      )}
                      {directiveData.creator?.phone && (
                        <li className="nav-item">
                          <a className="nav-link active" href="#">
                            <i className="fa fa-phone-square"></i>
                            {directiveData.creator.phone}
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
                  <div className="timeline">
                    {directiveData.replies.length > 0 ? (
                      directiveData.replies
                        .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
                        .map((reply) => {
                          if (isAdminReply(reply)) {
                            // Admin reply on the left
                            return (
                              <div key={reply.id} className="timeline-wrapper timeline-wrapper-success">
                                <div className="timeline-badge"></div>
                                <div
                                  className={`timeline-panel admin-user-bg-color ${user?.id === reply.user.id ? 'auth-user-bg-color' : ''}`}
                                  id={`reply${reply.id}`}
                                >
                                  <div className="timeline-heading">
                                    <h6 className="timeline-title">
                                      <i className="ti-share-alt text-primary mr-1"></i>Admin
                                    </h6>
                                    <div className="mb-3">
                                      {reply.user.name && (
                                        <small className="text-muted mb-0">
                                          <i className="fa fa-user-circle mr-1"></i>{reply.user.name}
                                        </small>
                                      )}
                                      {reply.user.phone && (
                                        <small className="text-muted mb-0">
                                          <i className="fa fa-phone-square mr-1"></i>{reply.user.phone}
                                        </small>
                                      )}
                                    </div>
                                  </div>
                                  <div className="timeline-body mb-3">
                                    {reply.taggedDepartments && reply.taggedDepartments.length > 0 && (
                                      <ul className="list-inline" style={{ padding: 0, margin: 0 }}>
                                        {reply.taggedDepartments.map(tagDept => (
                                          <li key={tagDept.id} className="list-inline-item" style={{ display: 'inline-block', fontSize: '14px', fontWeight: 'bold', color: '#007bff', marginRight: '10px' }}>
                                            <i className="fas fa-tag" style={{ color: '#007bff', marginRight: '5px' }}></i>
                                            {tagDept.name}
                                          </li>
                                        ))}
                                      </ul>
                                    )}
                                    <div className="mt-3 mb-3 text-justify" dangerouslySetInnerHTML={{ __html: reply.reply_detail }}></div>
                                    {reply.attachments && reply.attachments.length > 0 && (
                                      <div className="form-group mt-3">
                                        <span className="text-dark">
                                          <i className="ti-files"></i><small>Attachments</small>
                                        </span>
                                        <ol className="mt-1 ml-2">
                                          {reply.attachments.map((file, idx) => (
                                            <li key={idx}>
                                              <a href={`/admin_assets/directives/${file}`} target="_blank" rel="noopener noreferrer" title="Click to download">
                                                <i className={getFileIconClass(file)}></i>
                                                <small>{file}</small>
                                              </a>
                                            </li>
                                          ))}
                                        </ol>
                                      </div>
                                    )}
                                    {reply.status === 8 && (
                                      <div className="mb-2">
                                        <span className="font-weight-bold">Remarks: </span>
                                        <span className="font-weight-bold text-primary">{reply.remarks}</span>
                                        {reply.other_remarks && (
                                          <span className="mt-1 small" dangerouslySetInnerHTML={{ __html: reply.other_remarks }}></span>
                                        )}
                                      </div>
                                    )}
                                    {reply.status && [6, 9].includes(reply.status) && reply.overdue_reason && (
                                      <div className="mb-2">
                                        <span className="font-weight-bold">Reason: </span>
                                        <span className="mt-1 small" dangerouslySetInnerHTML={{ __html: reply.overdue_reason }}></span>
                                      </div>
                                    )}
                                  </div>
                                  <div className="timeline-footer d-flex align-items-center flex-wrap">
                                    <div>
                                      {reply.status && statusMap[reply.status] && (
                                        <span className={`badge ${statusMap[reply.status].badgeClass}`}>
                                          {statusMap[reply.status].label}
                                        </span>
                                      )}
                                    </div>
                                    <span className="ml-md-auto font-weight-bold">{formatDate(reply.created_at)}</span>
                                  </div>
                                </div>
                              </div>
                            );
                          } else {
                            // Department reply on the right
                            return (
                              <div key={reply.id} className="timeline-wrapper timeline-inverted timeline-wrapper-primary">
                                <div className="timeline-badge"></div>
                                <div
                                  className={`timeline-panel ${user?.id === reply.user.id ? 'auth-user-bg-color' : ''}`}
                                  id={`reply${reply.id}`}
                                >
                                  <div className="timeline-heading">
                                    <h6 className="timeline-title">
                                      <i className="ti-share-alt text-primary mr-1"></i>
                                      {reply.user.department?.name ?? 'Department'}
                                    </h6>
                                    <div className="mb-3">
                                      {reply.user.name && (
                                        <small className="text-muted mb-0">
                                          <i className="fa fa-user-circle mr-1"></i>{reply.user.name}
                                        </small>
                                      )}
                                      {reply.user.phone && (
                                        <small className="text-muted mb-0">
                                          <i className="fa fa-phone-square mr-1"></i>{reply.user.phone}
                                        </small>
                                      )}
                                    </div>
                                  </div>
                                  <div className="timeline-body mb-3">
                                    {reply.taggedDepartments && reply.taggedDepartments.length > 0 && (
                                      <ul className="list-inline" style={{ padding: 0, margin: 0 }}>
                                        {reply.taggedDepartments.map(tagDept => (
                                          <li key={tagDept.id} className="list-inline-item" style={{ display: 'inline-block', fontSize: '14px', fontWeight: 'bold', color: '#007bff', marginRight: '10px' }}>
                                            <i className="fas fa-tag" style={{ color: '#007bff', marginRight: '5px' }}></i>
                                            {tagDept.name}
                                          </li>
                                        ))}
                                      </ul>
                                    )}
                                    <div className="mt-3 mb-3 text-justify" dangerouslySetInnerHTML={{ __html: reply.reply_detail }}></div>
                                    {reply.attachments && reply.attachments.length > 0 && (
                                      <div className="form-group mt-3">
                                        <span className="text-dark">
                                          <i className="ti-files"></i><small>Attachments</small>
                                        </span>
                                        <ol className="mt-1 ml-2">
                                          {reply.attachments.map((file, idx) => (
                                            <li key={idx}>
                                              <a href={`/admin_assets/directives/${file}`} target="_blank" rel="noopener noreferrer" title="Click to download">
                                                <i className={getFileIconClass(file)}></i>
                                                <small>{file}</small>
                                              </a>
                                            </li>
                                          ))}
                                        </ol>
                                      </div>
                                    )}
                                    {reply.status === 8 && (
                                      <div className="mb-2">
                                        <span className="font-weight-bold">Remarks: </span>
                                        <span className="font-weight-bold text-primary">{reply.remarks}</span>
                                        {reply.other_remarks && (
                                          <span className="mt-1 small" dangerouslySetInnerHTML={{ __html: reply.other_remarks }}></span>
                                        )}
                                      </div>
                                    )}
                                    {reply.status && [6, 9].includes(reply.status) && reply.overdue_reason && (
                                      <div className="mb-2">
                                        <span className="font-weight-bold">Reason: </span>
                                        <span className="mt-1 small" dangerouslySetInnerHTML={{ __html: reply.overdue_reason }}></span>
                                      </div>
                                    )}
                                  </div>
                                  <div className="timeline-footer d-flex align-items-center flex-wrap">
                                    <div>
                                      {reply.status && statusMap[reply.status] && (
                                        <span className={`badge ${statusMap[reply.status].badgeClass}`}>
                                          {statusMap[reply.status].label}
                                        </span>
                                      )}
                                    </div>
                                    <span className="ml-md-auto font-weight-bold">{formatDate(reply.created_at)}</span>
                                  </div>
                                </div>
                              </div>
                            );
                          }
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
      </div>

      <div className="row" id="add-reply">
        <div className="col-lg-12">
          <div className="card">
            {!isCompleted ? (
              <div className="card-body">
                <form className="form-sample" id="department_reply_form" onSubmit={handleSubmit} encType="multipart/form-data">
                  <p className="description">
                    <input type="hidden" name="directive_id" value={directiveData.id} />
                  </p>
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
                            value={replyDetail}
                            onChange={(e) => setReplyDetail(e.target.value)}
                          ></textarea>
                          <span id="maxContentPost"></span>
                          <p>Character limit <span className="text-danger">1000</span></p>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-group">
                          <label>Attach Documents<small> (if any)</small></label>
                          <input
                            type="file"
                            name="attachments[]"
                            className="file-upload-default"
                            multiple
                            onChange={handleFileChange}
                          />
                          <div className="input-group col-xs-12">
                            <input
                              type="text"
                              className="form-control file-upload-info"
                              disabled
                              placeholder="Upload files"
                            />
                            <span className="input-group-append">
                              <button
                                className="file-upload-browse btn btn-success"
                                type="button"
                                onClick={handleFileBrowse}
                              >
                                Select Files
                              </button>
                            </span>
                          </div>
                          <p>Number of files limit is <span className="text-danger">3</span> each <span className="text-danger">25MB</span></p>
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
                            <option value="">Please Select Status</option>
                            <option value="1">Completed</option>
                            <option value="2">On Target</option>
                            <option value="3">Overdue</option>
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
                            placeholder="type here..."
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
              <div style={{ background: '#71c016', padding: '10px', textAlign: 'center' }}>
                <span className="badge badge-success badge-pill">Completed</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

