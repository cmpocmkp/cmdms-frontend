/**
 * Department Sectorial Agenda Point Replies/Chat History Page
 * EXACT replica of department/sectorialmeetings/reply.blade.php from old CMDMS
 */

import React, { useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { mockAgendaPoints, mockSectorialAgendaPointReplies, SectorialAgendaPointReply } from '../../lib/mocks/data/sectorialMeetings';

interface AgendaPoint {
  id: number;
  item: string;
  decision: string;
  creator?: {
    name: string;
    phone?: string;
  };
  status?: number;
  replies: SectorialAgendaPointReply[];
}

// Status mapping
const statusMap: { [key: number]: { label: string; badgeClass: string } } = {
  1: { label: 'Completed', badgeClass: 'badge-success' },
  2: { label: 'On Target', badgeClass: 'badge-warning' },
  3: { label: 'Overdue', badgeClass: 'badge-danger' },
  4: { label: 'Off Target', badgeClass: 'badge-info' },
  6: { label: 'Overdue Other Reason', badgeClass: 'badge-indigo' },
  7: { label: 'Ongoing', badgeClass: 'badge-ongoing' },
  8: { label: 'Task can not be completed', badgeClass: 'badge-dark' },
  9: { label: 'Off Target Other Reason', badgeClass: 'badge-lightred' }
};

// Mock replies data
const generateMockReplies = (agendaPointId: number): SectorialAgendaPointReply[] => {
  return mockSectorialAgendaPointReplies.filter(r => r.id % 10 === agendaPointId % 10).slice(0, 5);
};

export default function SectorialAgendaPointReplies() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [replyDetail, setReplyDetail] = useState('');
  const [status, setStatus] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [overdueReason, setOverdueReason] = useState('');
  const [remarks, setRemarks] = useState('');
  const [otherRemarks, setOtherRemarks] = useState('');

  const agendaPointId = id ? parseInt(id) : 0;
  const statusParam = searchParams.get('status') || '';
  const pageParam = searchParams.get('page') || '1';

  // Find the agenda point
  const agendaPoint = mockAgendaPoints.find(p => p.id === agendaPointId);

  // Mock agenda point data
  const agendaPointData: AgendaPoint = agendaPoint ? {
    id: agendaPoint.id,
    item: agendaPoint.item,
    decision: agendaPoint.decision,
    creator: {
      name: 'System',
      phone: '+92-300-0000000'
    },
    status: agendaPoint.status,
    replies: generateMockReplies(agendaPointId)
  } : {
    id: 0,
    item: '',
    decision: '',
    replies: []
  };

  const isCompleted = agendaPointData.status === 1; // Completed status
  const isAdminReply = (reply: SectorialAgendaPointReply) => {
    return reply.user.role_id === 1 || reply.user.role_id === 3; // Admin or Data Entry
  };

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

  const getFileIconClass = (filename: string): string => {
    const ext = filename.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'pdf': return 'ti-file';
      case 'doc':
      case 'docx': return 'ti-file';
      case 'xls':
      case 'xlsx': return 'ti-file';
      default: return 'ti-file';
    }
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

  if (!agendaPoint) {
    return (
      <div className="content-wrapper">
        <div className="card">
          <div className="card-body">
            <p>Agenda point not found.</p>
            <Link to={`/department/sectorial-meetings?status=${statusParam}&page=${pageParam}`} className="btn btn-sm btn-inverse-dark">
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
      `}</style>

      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <div className="d-flex gap-3 justify-content-between align-items-center">
                <div className="flex-grow-1 text-center">
                  <p className="block display-4">Sectoral Agenda Point</p>
                  <p className="block display-5">{user?.department?.name || 'Department'} Department</p>
                </div>
                <div className="btn-toolbar mb-3">
                  <div className="btn-group">
                    <Link
                      to={`/department/sectorial-meetings?status=${statusParam}&page=${pageParam}#minute${agendaPointId}`}
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
              <div className="card-title text-dark">
                <div className="d-flex justify-content-start mb-3">
                  <div className="pr-3 display-5 font-weight-bold">Agenda: </div>
                  <div className="display-5 text-justify" dangerouslySetInnerHTML={{ __html: agendaPointData.item || '' }}></div>
                </div>
                <div className="d-flex justify-content-start">
                  <div className="pr-3 display-5 font-weight-bold">Decision: </div>
                  <div className="display-5 text-justify" dangerouslySetInnerHTML={{ __html: agendaPointData.decision || '' }}></div>
                </div>
              </div>
              <div className="row">
                <div className="col">
                  <ul className="nav profile-navbar d-flex justify-content-end border-top">
                    {agendaPointData.creator?.name && (
                      <li className="nav-item">
                        <a className="nav-link" href="#">
                          <i className="fa fa-user-circle" style={{ color: '#248afd' }}></i>
                          {agendaPointData.creator.name}
                        </a>
                      </li>
                    )}
                    {agendaPointData.creator?.phone && (
                      <li className="nav-item">
                        <a className="nav-link active" href="#">
                          <i className="fa fa-phone-square"></i>
                          {agendaPointData.creator.phone}
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
                {agendaPointData.replies.length > 0 ? (
                  <div className="timeline">
                    {agendaPointData.replies.map((reply, index) => {
                      const isAdmin = isAdminReply(reply);
                      const isEven = index % 2 === 0;
                      const statusInfo = reply.status ? statusMap[reply.status] : null;

                      return (
                        <div
                          key={reply.id}
                          className={`timeline-wrapper ${isAdmin 
                            ? 'timeline-wrapper-success' 
                            : isEven 
                            ? 'timeline-inverted timeline-wrapper-primary' 
                            : 'timeline-wrapper-primary'}`}
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
                                  ? reply.department?.name || 'Department'
                                  : 'Admin'}
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
                            <div className="timeline-body">
                              <div className="mb-3 text-justify" dangerouslySetInnerHTML={{ __html: reply.reply_detail }}></div>
                              {reply.attachments && reply.attachments.length > 0 && (
                                <div className="form-group mt-3">
                                  <span className="text-dark">
                                    <i className="ti-files"></i>
                                    <small>Attachments</small>
                                  </span>
                                  <ol className="mt-1 ml-2">
                                    {reply.attachments.map((file, idx) => (
                                      <li key={idx}>
                                        <a
                                          href={`/storage/sectorial_replies_uploads/${file}`}
                                          target="_blank"
                                          title="Click to download"
                                        >
                                          <i className={getFileIconClass(file)}></i>
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
                              {reply.status && [6, 9].includes(reply.status) && reply.overdue_reason && (
                                <div className="mb-2">
                                  <span className="font-weight-bold">Reason: </span>
                                  <span className="mt-1 small" dangerouslySetInnerHTML={{ __html: reply.overdue_reason }} />
                                </div>
                              )}
                            </div>
                            <div className="timeline-footer d-flex align-items-center flex-wrap">
                              <div>
                                {statusInfo && (
                                  <span className={`badge ${statusInfo.badgeClass}`}>
                                    {statusInfo.label}
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
            {!isCompleted ? (
              <div className="card-body">
                <form className="form-sample" id="department_sectorial_reply_form" onSubmit={handleSubmit} encType="multipart/form-data">
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

