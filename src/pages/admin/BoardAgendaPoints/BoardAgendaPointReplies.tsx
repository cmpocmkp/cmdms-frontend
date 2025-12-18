/**
 * Board Agenda Point Replies - Admin Module
 * EXACT replica of admin/replies/boards/index.blade.php from old CMDMS
 */

import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { mockBoardAgendaPoints, mockBoardMeetings } from '../../../lib/mocks/data/boardMeetings';
import { mockAdminDepartments } from '../../../lib/mocks/data/adminDepartments';

// Badge mapping for status
const getBadgeClass = (status?: string) => {
  if (!status) return '';
  const badgesWithStatus: Record<string, string> = {
    'Implemented': 'success',
    'Pending': 'danger',
    'Other': 'warning'
  };
  return badgesWithStatus[status] || '';
};

interface BoardAgendaPointReply {
  id: number;
  reply_detail: string;
  status?: string;
  attachments?: string[];
  tag_departments?: number[];
  user: {
    id: number;
    name: string;
    phone?: string;
    role_id: number;
  };
  department?: {
    id: number;
    name: string;
  };
  created_at: string;
}

// Mock replies for board agenda points
const mockBoardAgendaPointReplies: BoardAgendaPointReply[] = Array.from({ length: 20 }, (_, index) => {
  const isAdmin = Math.random() > 0.5;
  
  return {
    id: index + 1,
    reply_detail: `Progress update ${index + 1}: Work is proceeding as planned.`,
    status: Math.random() > 0.5 ? 'Implemented' : 'Pending',
    attachments: Math.random() > 0.6 ? ['file1.pdf', 'file2.doc'] : undefined,
    tag_departments: [1, 2],
    user: {
      id: index + 1,
      name: `User ${index + 1}`,
      phone: Math.random() > 0.5 ? '123-456-7890' : undefined,
      role_id: isAdmin ? 1 : 2
    },
    department: !isAdmin ? {
      id: 1,
      name: 'Department ' + (index + 1)
    } : undefined,
    created_at: new Date(Date.now() - index * 86400000).toISOString()
  };
});

export default function BoardAgendaPointReplies() {
  const { id } = useParams<{ id: string }>();
  const agendaPoint = mockBoardAgendaPoints.find(ap => ap.id === Number(id));
  const meeting = agendaPoint
    ? mockBoardMeetings.find(m => m.id === agendaPoint.board_meeting_id)
    : null;

  // Filter replies for this agenda point
  const replies = mockBoardAgendaPointReplies.filter((_, idx) => idx < 5); // Show first 5 for demo

  const [replyDetail, setReplyDetail] = useState('');
  const [attachmentFiles, setAttachmentFiles] = useState<FileList | null>(null);

  if (!agendaPoint || !meeting) {
    return (
      <div className="content-wrapper">
        <div className="alert alert-danger">Agenda Point not found</div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submit reply:', {
      agenda_point_id: agendaPoint.id,
      reply_detail: replyDetail,
      attachments: attachmentFiles ? Array.from(attachmentFiles) : []
    });
    alert('Reply functionality will be implemented with backend API');
    setReplyDetail('');
    setAttachmentFiles(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachmentFiles(e.target.files);
    }
  };

  // Format date as 'd/m/Y' (matching old CMDMS)
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="content-wrapper">
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <div className="row pull-right">
                <div className="col-md-12">
                  <div className="btn-toolbar">
                    <div className="btn-group">
                      <Link
                        style={{ float: 'left', marginLeft: '10px' }}
                        to={`/admin/boardmeetings/${meeting.department_id}/agenda-points/${meeting.id}`}
                        title="Back to Agenda Points"
                        className="btn btn-sm btn-inverse-dark btn-fw"
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
                        <a href="#">Agenda Item</a>
                      </li>
                      <li className="breadcrumb-item active" aria-current="page">
                        <span>
                          <div dangerouslySetInnerHTML={{ __html: agendaPoint.item || '' }} />
                        </span>
                      </li>
                    </ol>
                  </nav>
                </div>
              </div>

              <div className="mt-5">
                {replies.length > 0 ? (
                  <div className="timeline">
                    {replies.map((reply, index) => {
                      const isEven = (index + 1) % 2 === 0;
                      const isAdmin = reply.user.role_id === 1;

                      return (
                        <div
                          key={reply.id}
                          className={
                            isEven
                              ? 'timeline-wrapper timeline-inverted timeline-wrapper-primary'
                              : 'timeline-wrapper timeline-wrapper-success'
                          }
                        >
                          <div className="timeline-badge"></div>
                          <div
                            className={
                              isAdmin ? 'timeline-panel admin-user-bg-color' : 'timeline-panel auth-user-bg-color'
                            }
                            id={`reply${reply.id}`}
                          >
                            <div className="timeline-heading">
                              <h6 className="timeline-title">
                                <i className="ti-share-alt text-primary mr-1"></i>
                                {isAdmin ? 'Admin' : reply.department?.name || 'Department'}
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
                                  {reply.tag_departments.map((deptId) => {
                                    const dept = mockAdminDepartments.find(d => d.id === deptId);
                                    return dept ? (
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
                                        {dept.name}
                                      </li>
                                    ) : null;
                                  })}
                                </ul>
                              )}
                              <p>
                                <div dangerouslySetInnerHTML={{ __html: reply.reply_detail }} />
                              </p>
                            </div>
                            {reply.status && (
                              <label
                                style={{
                                  width: reply.status === 'Pending' ? '85px' : '115px',
                                  background: reply.status === 'Pending' ? '#E74039 !important' : undefined
                                }}
                                className={`badge badge-${getBadgeClass(reply.status)} badge-pill`}
                              >
                                {reply.status ?? ''}
                              </label>
                            )}
                            <div className="timeline-footer d-flex align-items-center flex-wrap">
                              {reply.attachments && reply.attachments.length > 0 && (
                                <div className="buttons">
                                  <i className="ti-file"></i>
                                  {reply.attachments.map((file, idx) => (
                                    <span key={idx}>
                                      |<a
                                        href="#"
                                        title="click to download attach file"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          console.log('Download:', file);
                                        }}
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

      {/* Add Reply Form */}
      <div className="row" id="add-reply">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-body">
              <form
                className="form-sample"
                id="admin_reply_board_form"
                onSubmit={handleSubmit}
                encType="multipart/form-data"
              >
                <p className="description">
                  <input type="hidden" name="agenda_point_id" value={agendaPoint.id} />
                </p>
                <fieldset>
                  <div className="row">
                    <div className="col-md-12">
                      <div className="form-group">
                        <label>Progress Reply</label>
                        <textarea
                          className="form-control"
                          id="reply_detail"
                          placeholder="type reply here..."
                          name="reply_detail"
                          rows={6}
                          value={replyDetail}
                          onChange={(e) => setReplyDetail(e.target.value)}
                        />
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
                          onChange={handleFileChange}
                          style={{ display: 'none' }}
                          id="file-upload-input"
                        />
                        <div className="input-group col-xs-12">
                          <input
                            type="text"
                            className="form-control file-upload-info"
                            disabled
                            placeholder="Upload files"
                            value={attachmentFiles ? `${attachmentFiles.length} file(s) selected` : ''}
                          />
                          <span className="input-group-append">
                            <button
                              className="file-upload-browse btn btn-success"
                              type="button"
                              onClick={() => document.getElementById('file-upload-input')?.click()}
                            >
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

