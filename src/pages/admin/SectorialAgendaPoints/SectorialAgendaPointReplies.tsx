/**
 * Sectorial Agenda Point Replies - Admin Module
 * EXACT replica of admin/replies/sectorialmeetings/index.blade.php from old CMDMS
 */

import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { mockAgendaPoints, mockSectorialAgendaPointReplies } from '../../../lib/mocks/data/sectorialMeetings';
import { formatDistanceToNow } from 'date-fns';

// Badge classes based on DecisionStatus enum
const getBadgeClass = (status?: number) => {
  if (!status) return '';
  const statusMap: Record<number, string> = {
    1: 'badge-success', // Completed
    2: 'badge-warning', // On Target
    3: 'badge-danger', // Overdue
    4: 'badge-info', // Off Target
    7: 'badge-ongoing', // Ongoing
    6: 'badge-indigo', // Overdue Other Reason
    9: 'badge-lightred' // Off Target Reason
  };
  return statusMap[status] || '';
};

const getStatusLabel = (status?: number) => {
  if (!status) return '';
  const statusMap: Record<number, string> = {
    1: 'Completed',
    2: 'On Target',
    3: 'Overdue',
    4: 'Off Target',
    7: 'Ongoing',
    6: 'Overdue Other Reason',
    9: 'Off Target Reason'
  };
  return statusMap[status] || '';
};

export default function SectorialAgendaPointReplies() {
  const { id } = useParams<{ id: string }>();
  const agendaPoint = mockAgendaPoints.find(ap => ap.id === Number(id));

  // Filter replies for this agenda point
  const replies = mockSectorialAgendaPointReplies.filter((_, idx) => idx < 5); // Show first 5 for demo

  const [replyDetail, setReplyDetail] = useState('');
  const [attachmentFiles, setAttachmentFiles] = useState<FileList | null>(null);

  if (!agendaPoint) {
    return (
      <div className="content-wrapper">
        <div className="alert alert-danger">Agenda Point not found</div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submit reply:', {
      sectorial_agenda_point_id: agendaPoint.id,
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

  const formatDate = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };

  return (
    <div className="content-wrapper">
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header text-center">
              <div className="d-flex gap-3 justify-content-between align-items-center">
                <div className="flex-grow-1 text-center">
                  <p className="block display-4">Sectoral Agenda Point</p>
                </div>
                <div>
                  <div className="btn-toolbar pull-right">
                    <div className="btn-group">
                      <Link
                        to={`/admin/sectorialmeetings/${agendaPoint.meeting_id}/agenda-points`}
                        className="btn btn-outline-primary btn-fw"
                        style={{ float: 'right' }}
                      >
                        <i className="ti-arrow-left mr-1"></i>Back
                      </Link>
                      <a
                        href="#add-reply"
                        className="btn btn-outline-primary btn-fw"
                        role="button"
                      >
                        <i className="ti-share-alt mr-1"></i>Reply
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
                    <div dangerouslySetInnerHTML={{ __html: agendaPoint.item }} />
                  </div>
                </div>
                <div className="d-flex justify-content-start">
                  <div className="pr-3 display-5 font-weight-bold">Decision: </div>
                  <div className="display-5 text-justify">
                    <div dangerouslySetInnerHTML={{ __html: agendaPoint.decision }} />
                  </div>
                </div>
              </div>

              <div className="mt-3">
                <div>
                  <h4 className="text-center">History</h4>
                </div>
                <hr />
                {replies.length > 0 ? (
                  <div className="timeline">
                    {replies.map((reply) => {
                      const isAdmin = reply.user.role_id === 1; // Admin or DataEntry

                      return (
                        <div
                          key={reply.id}
                          className={
                            isAdmin
                              ? 'timeline-wrapper timeline-wrapper-success'
                              : 'timeline-wrapper timeline-inverted timeline-wrapper-primary'
                          }
                        >
                          <div className="timeline-badge"></div>
                          <div
                            className={isAdmin ? 'timeline-panel admin-user-bg-color' : 'timeline-panel auth-user-bg-color'}
                            id={`reply${reply.id}`}
                          >
                            <div className="timeline-heading">
                              <h6 className="timeline-title">
                                <i className="ti-share-alt text-primary mr-1"></i>
                                {isAdmin ? 'Admin' : reply.department?.name || 'Department'}
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
                              <div className="mt-3 mb-3 text-justify">
                                <div dangerouslySetInnerHTML={{ __html: reply.reply_detail }} />
                              </div>
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
                                          href="#"
                                          target="_blank"
                                          title="Click to download"
                                          onClick={(e) => {
                                            e.preventDefault();
                                            console.log('Download:', file);
                                          }}
                                        >
                                          <i className="ti-file"></i>
                                          <small>{file}</small>
                                        </a>
                                      </li>
                                    ))}
                                  </ol>
                                </div>
                              )}
                              {reply.status === 8 && reply.remarks && ( // CAN_NOT_COMPLETED
                                <div className="mb-2">
                                  <span className="font-weight-bold">Remarks: </span>
                                  <span className="font-weight-bold text-primary">{reply.remarks}</span>
                                  {reply.other_remarks && (
                                    <span className="mt-1 small">
                                      <div dangerouslySetInnerHTML={{ __html: reply.other_remarks }} />
                                    </span>
                                  )}
                                </div>
                              )}
                              {(reply.status === 6 || reply.status === 9) && reply.overdue_reason && ( // OVERDUE_OTHER_REASON or OFF_TARGET_OTHER_REASON
                                <div className="mb-2">
                                  <span className="font-weight-bold">Reason: </span>
                                  <span className="mt-1 small">
                                    <div dangerouslySetInnerHTML={{ __html: reply.overdue_reason }} />
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="timeline-footer d-flex align-items-center flex-wrap">
                              {!isAdmin && reply.status && (
                                <div>
                                  <span className={`badge ${getBadgeClass(reply.status)}`}>
                                    {getStatusLabel(reply.status)}
                                  </span>
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
                id="admin_reply_sectorial_form"
                onSubmit={handleSubmit}
                encType="multipart/form-data"
              >
                <p className="description">
                  <input type="hidden" name="sectorial_agenda_point_id" value={agendaPoint.id} />
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
