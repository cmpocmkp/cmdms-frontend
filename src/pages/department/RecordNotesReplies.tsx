/**
 * Department Record Notes Replies/Chat History Page
 * EXACT replica of department/recordnotes/reply.blade.php from old CMDMS
 */

import React, { useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { mockMinutes, mockMinuteDecisions } from '../../lib/mocks/data/minutes';

interface Reply {
  id: number;
  reply_detail: string;
  attachments?: string[];
  status?: {
    value: number;
    label: string;
    badgeClass: string;
  };
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

interface Minute {
  id: number;
  heading?: string;
  issues?: string;
  decisions?: string;
  creator?: {
    name: string;
    phone?: string;
  };
  allMeeting?: {
    id: number;
  };
  replies: Reply[];
}

// Mock replies data
const generateMockReplies = (_minuteId: number): Reply[] => {
  return [
    {
      id: 1,
      reply_detail: '<p>This is a sample reply from the department regarding the progress of this minute.</p>',
      attachments: ['document1.pdf', 'report.xlsx'],
      status: {
        value: 2,
        label: 'On Target',
        badgeClass: 'badge-info'
      },
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
      status: {
        value: 2,
        label: 'On Target',
        badgeClass: 'badge-info'
      },
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

export default function RecordNotesReplies() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [replyDetail, setReplyDetail] = useState('');
  const [status, setStatus] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [overdueReason, setOverdueReason] = useState('');
  const [remarks, setRemarks] = useState('');
  const [otherRemarks, setOtherRemarks] = useState('');

  const minuteId = id ? parseInt(id) : 0;
  const meetingType = searchParams.get('type') || 'normal';
  const statusParam = searchParams.get('status') || '';
  const pageParam = searchParams.get('page') || '1';

  // Find the minute
  const minute = mockMinuteDecisions.find(m => m.id === minuteId);
  const meeting = minute ? mockMinutes.find(m => m.id === minute.minute_id) : null;

  // Mock minute data
  const minuteData: Minute = {
    id: minuteId,
    heading: minute?.subject || '',
    issues: minute?.issues || '',
    decisions: minute?.decisions || minute?.decision_text || '',
    creator: {
      name: minute?.creator_name || 'System',
      phone: '+92-300-0000000'
    },
    allMeeting: meeting ? { id: meeting.id } : undefined,
    replies: generateMockReplies(minuteId)
  };

  const isCompleted = minute?.status === 'Completed';
  const isAdminReply = (reply: Reply) => {
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
    const iconMap: { [key: string]: string } = {
      pdf: 'ti-file',
      doc: 'ti-file',
      docx: 'ti-file',
      xls: 'ti-file',
      xlsx: 'ti-file',
      jpg: 'ti-image',
      jpeg: 'ti-image',
      png: 'ti-image',
      gif: 'ti-image'
    };
    return iconMap[ext || ''] || 'ti-file';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement API call
    alert('Reply submission will be implemented with backend API');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments(Array.from(e.target.files));
    }
  };

  const backUrl = `/department/record-notes?type=${meetingType}&status=${statusParam}&page=${pageParam}#minute${minuteId}`;

  return (
    <div className="content-wrapper">
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <div className="d-flex gap-3 justify-content-between align-items-center">
                <div className="flex-grow-1 text-center">
                  <p className="block display-4">Minutes</p>
                  <p className="block display-5">{user?.department?.name || 'Department'} Department</p>
                </div>
                <div className="btn-toolbar mb-3">
                  <div className="btn-group">
                    {minuteData.allMeeting?.id && (
                      <Link
                        to={backUrl}
                        className="btn btn-sm btn-inverse-dark btn-fw"
                        style={{ float: 'right' }}
                      >
                        <i className="ti-arrow-left text-primary mr-1"></i>Back
                      </Link>
                    )}
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
                  {minuteData.heading ? (
                    <div className="display-5 text-justify" dangerouslySetInnerHTML={{ __html: minuteData.heading }} />
                  ) : minuteData.issues ? (
                    <div className="display-5 text-justify" dangerouslySetInnerHTML={{ __html: minuteData.issues }} />
                  ) : null}
                </div>
                <div className="d-flex justify-content-start">
                  <div className="pr-3 display-5 font-weight-bold">Decision: </div>
                  <div className="display-5 text-justify" dangerouslySetInnerHTML={{ __html: minuteData.decisions || '' }} />
                </div>
              </div>
              <div className="row">
                <div className="col">
                  <ul className="nav profile-navbar d-flex justify-content-end border-top">
                    {minuteData.creator?.name && (
                      <li className="nav-item">
                        <a className="nav-link" href="#">
                          <i className="fa fa-user-circle" style={{ color: '#248afd' }}></i>
                          {minuteData.creator.name}
                        </a>
                      </li>
                    )}
                    {minuteData.creator?.phone && (
                      <li className="nav-item">
                        <a className="nav-link active" href="#">
                          <i className="fa fa-phone-square"></i>
                          {minuteData.creator.phone}
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
                {minuteData.replies.length > 0 ? (
                  <div className="timeline">
                    {minuteData.replies.map((reply) => {
                      const isAdmin = isAdminReply(reply);
                      return (
                        <div
                          key={reply.id}
                          className={`timeline-wrapper ${isAdmin ? 'timeline-wrapper-success' : 'timeline-inverted timeline-wrapper-primary'}`}
                        >
                          <div className="timeline-badge"></div>
                          <div
                            className={`timeline-panel ${isAdmin ? 'admin-user-bg-color' : 'auth-user-bg-color'}`}
                            id={`reply${reply.id}`}
                          >
                            <div className="timeline-heading">
                              <h6 className="timeline-title">
                                <i className="ti-share-alt text-primary mr-1"></i>
                                {reply.user.role_id === 2 || reply.user.role_id === 7
                                  ? reply.user.department?.name || 'Department'
                                  : 'Admin'}
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
                            <div className="timeline-body">
                              {reply.tag_departments && reply.tag_departments.length > 0 && (
                                <ul className="list-inline" style={{ padding: 0, margin: 0 }}>
                                  {reply.tag_departments.map((deptId) => (
                                    <li
                                      key={deptId}
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
                              <div className="mb-3 text-justify" dangerouslySetInnerHTML={{ __html: reply.reply_detail }} />
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
                                          href={`/storage/department_replies/${file}`}
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
                              {reply.status && reply.status.value === 6 && (
                                <div className="mb-2">
                                  <span className="font-weight-bold">Remarks: </span>
                                  <span className="font-weight-bold text-primary">{reply.remarks}</span>
                                  {reply.other_remarks && (
                                    <span className="mt-1 small" dangerouslySetInnerHTML={{ __html: reply.other_remarks }} />
                                  )}
                                </div>
                              )}
                              {reply.status && [7, 8].includes(reply.status.value) && reply.overdue_reason && (
                                <div className="mb-2">
                                  <span className="font-weight-bold">Reason: </span>
                                  <span className="mt-1 small" dangerouslySetInnerHTML={{ __html: reply.overdue_reason }} />
                                </div>
                              )}
                            </div>
                            <div className="timeline-footer d-flex align-items-center flex-wrap">
                              <div>
                                {reply.status && (
                                  <span className={`badge ${reply.status.badgeClass}`}>{reply.status.label}</span>
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
                <form className="form-sample" id="department_reply_form" onSubmit={handleSubmit}>
                  <p className="description">
                    <input type="hidden" name="minute_id" value={minuteId} />
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
                          />
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
                              value={attachments.length > 0 ? `${attachments.length} file(s) selected` : ''}
                            />
                            <span className="input-group-append">
                              <button
                                className="file-upload-browse btn btn-success"
                                type="button"
                                onClick={() => document.querySelector<HTMLInputElement>('input[name="attachments[]"]')?.click()}
                              >
                                Select Files
                              </button>
                            </span>
                          </div>
                          <p>
                            Number of files limit is <span className="text-danger"> 3 </span>each<span className="text-danger"> 5MB</span>
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
                            onChange={(e) => setStatus(e.target.value)}
                          >
                            <option value="">Select status</option>
                            {meetingType === 'cabinet' ? (
                              <>
                                <option value="1">Completed</option>
                                <option value="2">On Target</option>
                                <option value="4">Ongoing</option>
                                <option value="3">Overdue</option>
                                <option value="5">Off Target</option>
                                <option value="8">Off Target Other Reason</option>
                                <option value="7">Overdue Other Reason</option>
                              </>
                            ) : (
                              <>
                                <option value="1">Completed</option>
                                <option value="2">On Target</option>
                                <option value="3">Overdue</option>
                              </>
                            )}
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-12" style={{ display: ['7', '8'].includes(status) ? 'block' : 'none' }} id="id_overdue_reason">
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
                          />
                        </div>
                      </div>
                      <div className="col-md-4" style={{ display: status === '6' ? 'block' : 'none' }} id="select_remarks_not_completed">
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
                            <option value="Administration">Administration</option>
                            <option value="Legal">Legal</option>
                            <option value="Financial">Financial</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="row" style={{ display: status === '6' && remarks ? 'block' : 'none' }} id="select_remarks_response">
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
                          />
                        </div>
                      </div>
                    </div>
                    <input className="btn btn-primary pull-right" type="submit" value="Submit" />
                  </fieldset>
                </form>
              </div>
            ) : (
              <div className="card-body" style={{ margin: '0 auto !important' }}>
                <div style={{ backgroundColor: '#71c016' }} className="badge badge-success badge-pill">
                  Completed
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

