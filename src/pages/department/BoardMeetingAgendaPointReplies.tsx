/**
 * Department Board Meeting Agenda Point Replies/Chat History Page
 * EXACT replica of department/boardmeetings/agendapoints/reply.blade.php from old CMDMS
 */

import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getMockAgendaPointById, BoardReply } from '../../lib/mocks/data/boardMeetings';
import { mockDepartments } from '../../lib/mocks/data/departments';

// Status mapping
const statusMap: { [key: string]: { label: string; badgeClass: string } } = {
  'Implemented': { label: 'Implemented', badgeClass: 'badge-success' },
  'Pending': { label: 'Pending', badgeClass: 'badge-danger' },
  'On Target': { label: 'On Target', badgeClass: 'badge-warning' }
};

export default function BoardMeetingAgendaPointReplies() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [replyDetail, setReplyDetail] = useState('');
  const [status, setStatus] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [overdueReason, setOverdueReason] = useState('');
  const [remarks, setRemarks] = useState('');
  const [otherRemarks, setOtherRemarks] = useState('');

  const agendaPointId = id ? parseInt(id) : 0;
  const agendaPoint = getMockAgendaPointById(agendaPointId);

  if (!agendaPoint) {
    return (
      <div className="content-wrapper">
        <div className="card">
          <div className="card-body">
            <p>Agenda point not found.</p>
            <Link to="/department/board-meetings" className="btn btn-primary">Back to Board Meetings</Link>
          </div>
        </div>
      </div>
    );
  }

  const isCompleted = agendaPoint.status === 'Implemented';
  const isAdminReply = (reply: BoardReply) => {
    return reply.user.role_id === 1 || reply.user.role_id === 3; // Admin or Data Entry
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Calculate days remaining or delay
  const getTimelineInfo = (timeline: string, status: string): { text: string; color: string } => {
    const today = new Date();
    const timelineDate = new Date(timeline);
    const diffTime = timelineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (status === 'Implemented') {
      return { text: '', color: '' };
    } else if (status === 'Pending') {
      const delayDays = Math.abs(diffDays);
      const dayText = delayDays === 1 ? 'day' : 'days';
      return {
        text: `Delay ${delayDays} ${dayText}`,
        color: 'red'
      };
    } else {
      // On Target
      const remainDays = diffDays;
      const dayText = remainDays === 1 ? 'day' : 'days';
      return {
        text: `Remaining ${remainDays} ${dayText}`,
        color: 'green'
      };
    }
  };

  const timelineInfo = getTimelineInfo(agendaPoint.timeline, agendaPoint.status);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      if (files.length <= 3) {
        setAttachments(files);
      } else {
        alert('Maximum 3 files allowed');
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Submit reply to backend
    console.log('Submit reply:', { replyDetail, status, attachments, overdueReason, remarks, otherRemarks });
  };

  const getTaggedDepartments = (tagDepartmentIds: number[] | null) => {
    if (!tagDepartmentIds) return [];
    return mockDepartments.filter(d => {
      const deptId = typeof d.id === 'number' ? d.id : Number(d.id);
      return tagDepartmentIds.includes(deptId);
    });
  };

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
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <ul className="nav profile-navbar">
                    {agendaPoint.creator?.name && (
                      <li className="nav-item">
                        <a className="nav-link" href="#">
                          <i className="fa fa-user-circle" style={{ color: '#248afd' }}></i>
                          {agendaPoint.creator.name}
                        </a>
                      </li>
                    )}
                    {agendaPoint.creator?.phone && (
                      <li className="nav-item">
                        <a className="nav-link active" href="#">
                          <i className="fa fa-phone-square"></i>
                          {agendaPoint.creator.phone}
                        </a>
                      </li>
                    )}
                  </ul>
                </div>
                <div className="col-md-6">
                  <div className="btn-toolbar pull-right mb-3">
                    <div className="btn-group">
                      {agendaPoint.boardMeeting?.id && (
                        <Link
                          to={`/department/board-meetings/${agendaPoint.boardMeeting.id}/agenda-points`}
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
              
              <div className="row">
                <div className="col-md-12">
                  <nav aria-label="breadcrumb">
                    <ol className="breadcrumb breadcrumb-custom">
                      <li className="breadcrumb-item">
                        <a href="#">Agenda Point/Decision</a>
                      </li>
                      <li className="breadcrumb-item active" aria-current="page">
                        <span>
                          <span dangerouslySetInnerHTML={{ __html: agendaPoint.item ?? '' }}></span>
                          <br />
                          <b>Decision:</b> <span dangerouslySetInnerHTML={{ __html: agendaPoint.decision ?? '' }}></span>
                          <br />
                          {timelineInfo.text && (
                            <span style={{ color: timelineInfo.color, fontSize: '16px' }}>
                              {timelineInfo.text}
                            </span>
                          )}
                        </span>
                      </li>
                    </ol>
                  </nav>
                </div>
              </div>

              {/* Timeline of Replies */}
              <div className="mt-5">
                <div className="timeline">
                  {agendaPoint.replies.length > 0 ? (
                    agendaPoint.replies.map((reply, index) => {
                      const isEven = index % 2 === 0;
                      const taggedDepts = getTaggedDepartments(reply.tag_departments);
                      const isAdmin = isAdminReply(reply);
                      const isAuthUser = user?.id === reply.user.id;

                      return (
                        <div
                          key={reply.id}
                          className={`timeline-wrapper ${isEven ? 'timeline-wrapper-success' : 'timeline-inverted timeline-wrapper-primary'}`}
                        >
                          <div className="timeline-badge"></div>
                          <div
                            className={`timeline-panel ${isAuthUser ? 'auth-user-bg-color' : ''} ${isAdmin ? 'admin-user-bg-color' : ''}`}
                            id={`reply${reply.id}`}
                          >
                            <div className="timeline-heading">
                              <h6 className="timeline-title">
                                <i className="ti-share-alt text-primary mr-1"></i>
                                {isAdmin ? 'Admin' : reply.department.name}
                              </h6>
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
                            <div className="timeline-body">
                              {taggedDepts.length > 0 && (
                                <ul className="list-inline" style={{ padding: 0, margin: 0 }}>
                                  {taggedDepts.map((dept) => (
                                    <li
                                      key={dept.id}
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
                                      {dept.name}
                                    </li>
                                  ))}
                                </ul>
                              )}
                              <p dangerouslySetInnerHTML={{ __html: reply.reply_detail }}></p>
                            </div>
                            {reply.status && (
                              <label
                                style={{
                                  width: reply.status === 'Pending' ? '85px' : '115px',
                                  background: reply.status === 'Pending' ? '#E74039 !important' : undefined
                                }}
                                className={`badge ${statusMap[reply.status]?.badgeClass || 'badge-primary'} badge-pill`}
                              >
                                {reply.status}
                              </label>
                            )}
                            <div className="timeline-footer d-flex align-items-center flex-wrap">
                              {reply.attachments && reply.attachments.length > 0 && (
                                <div className="buttons">
                                  <i className="ti-file"></i>
                                  {reply.attachments.map((file, fileIndex) => (
                                    <span key={fileIndex}>
                                      |<a
                                        href={`/storage/board_replies_uploads/${file}`}
                                        title="click to download attach file"
                                        download
                                      >
                                        Download
                                      </a>
                                    </span>
                                  ))}
                                </div>
                              )}
                              <span className="ml-md-auto font-weight-bold">
                                {formatDate(reply.created_at)}
                              </span>
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

      {/* Reply Form */}
      {!isCompleted && (
        <div className="row" id="add-reply">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-body">
                <form className="form-sample" onSubmit={handleSubmit}>
                  <input type="hidden" name="agenda_point_id" value={agendaPoint.id} />
                  <fieldset>
                    <div className="row">
                      <div className="col-md-12">
                        <div className="form-group">
                          <label>Reply Detail</label>
                          <textarea
                            className="form-control"
                            id="reply_detail"
                            placeholder="Type reply here..."
                            name="reply_detail"
                            maxLength={1000}
                            rows={6}
                            required
                            value={replyDetail}
                            onChange={(e) => setReplyDetail(e.target.value)}
                          />
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
                              value={attachments.map(f => f.name).join(', ')}
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
                            Number of files limit is <span className="text-danger">3</span> each{' '}
                            <span className="text-danger">5MB</span>
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-3">
                        <label>Status</label>
                        <div className="form-group">
                          <select
                            id="add_status_dropdown"
                            name="status"
                            style={{ width: '250px' }}
                            className="w-100 form-control form-control-lg"
                            required
                            value={status}
                            onChange={(e) => {
                              setStatus(e.target.value);
                              if (e.target.value === '8') {
                                // Task cannot be completed
                                setOverdueReason('');
                              }
                            }}
                          >
                            <option value="" disabled>
                              Please Select Status
                            </option>
                            <option value="1">Implemented</option>
                            <option value="2">Pending</option>
                            <option value="8">Task cannot be completed</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div
                        className="col-md-12"
                        style={{ display: status === '2' ? 'block' : 'none' }}
                        id="id_overdue_reason"
                      >
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
                      <div
                        className="col-md-4"
                        style={{ display: status === '8' ? 'block' : 'none' }}
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
                    </div>
                    <div
                      className="row"
                      style={{ display: status === '8' ? 'block' : 'none' }}
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
                          />
                        </div>
                      </div>
                    </div>
                    <input className="btn btn-primary pull-right" type="submit" value="Submit" />
                  </fieldset>
                </form>
              </div>
              {isCompleted && (
                <div style={{ background: '#71c016' }} className="badge badge-success badge-pill">
                  Implemented
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

