/**
 * CM Remark Replies - Admin Module
 * EXACT replica of admin/replies/cmremarks/index.blade.php from old CMDMS
 */

import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { mockCMRemarks } from '../../../lib/mocks/data/cmRemarks';
import { mockDepartments } from '../../../lib/mocks/data/departments';
import { formatDistanceToNow } from 'date-fns';

interface CMRemarkReply {
  id: number;
  reply_detail: string;
  status?: number;
  overdue_reason?: string;
  attachments?: string[];
  tag_departments?: number[];
  user: {
    id: number;
    name: string;
    role_id: number;
  };
  department?: {
    id: number;
    name: string;
  };
  created_at: string;
}

// Mock replies for a CM remark
const mockReplies: CMRemarkReply[] = [
  {
    id: 1,
    reply_detail: 'Progress is on track. All departments have been notified.',
    status: 2, // On Target
    tag_departments: [1, 2],
    user: { id: 1, name: 'Admin User', role_id: 1 },
    created_at: new Date().toISOString()
  }
];

// badgesWithIntegerStatus and badgesWithStringStatus from old CMDMS
const getBadgeClass = (status?: number) => {
  if (!status) return 'secondary';
  const statusMap: Record<number, string> = {
    1: 'success', // Completed
    2: 'warning', // On Target
    3: 'danger', // Overdue
    4: 'info', // Off Target
    7: 'ongoing', // Ongoing
    6: 'indigo', // Overdue Other Reason
    9: 'lightred' // Off Target Reason
  };
  return statusMap[status] || 'secondary';
};

const getStatusLabel = (status?: number) => {
  if (!status) return 'Not set';
  const statusMap: Record<number, string> = {
    1: 'Completed',
    2: 'On Target',
    3: 'Overdue',
    4: 'Off Target',
    7: 'Ongoing',
    6: 'Overdue Other Reason',
    9: 'Off Target Reason'
  };
  return statusMap[status] || 'Unknown';
};

export default function CMRemarkReplies() {
  const { id } = useParams<{ id: string }>();
  const cmRemark = mockCMRemarks.find(r => r.id === Number(id));
  const [replies] = useState<CMRemarkReply[]>(mockReplies);
  const [tagDepartments, setTagDepartments] = useState<number[]>([]);
  const [replyDetail, setReplyDetail] = useState('');
  const [attachmentFiles, setAttachmentFiles] = useState<FileList | null>(null);

  const relatedDepartments = cmRemark?.departments || [];

  useEffect(() => {
    if (relatedDepartments.length > 0 && tagDepartments.length === 0) {
      // Auto-select first department like old CMDMS
      setTagDepartments([relatedDepartments[0].id]);
    }
  }, [relatedDepartments, tagDepartments.length]);

  if (!cmRemark) {
    return (
      <div className="content-wrapper">
        <div className="alert alert-danger">CM Remark not found</div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submit reply:', {
      detail_id: cmRemark.id,
      tag_departments: tagDepartments,
      reply_detail: replyDetail,
      attachments: attachmentFiles ? Array.from(attachmentFiles) : []
    });
    alert('Reply functionality will be implemented with backend API');
    // Reset form
    setReplyDetail('');
    setTagDepartments(relatedDepartments.length > 0 ? [relatedDepartments[0].id] : []);
    setAttachmentFiles(null);
  };

  const handleTagDepartmentsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions);
    const selectedIds = selectedOptions.map(option => Number(option.value));
    setTagDepartments(selectedIds);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachmentFiles(e.target.files);
    }
  };

  const getTaggedDepartments = (tagDeptIds?: number[]) => {
    if (!tagDeptIds) return [];
    return mockDepartments.filter(dept => tagDeptIds.includes(Number(dept.id)));
  };

  const formatDate = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
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
                      <Link to="/admin/cmremarks" className="btn btn-sm btn-inverse-dark btn-fw" style={{ float: 'right' }}>
                        <i className="ti-arrow-left text-primary mr-1"></i>Back
                      </Link>
                      <a href="#add-reply" style={{ padding: '0.3rem 1rem' }} className="btn btn-sm btn-inverse-dark btn-fw" role="button">
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
                      <li className="breadcrumb-item"><a href="#">CM Remarks</a></li>
                      <li className="breadcrumb-item active" aria-current="page">
                        <span>{cmRemark.subject}</span>
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
                      const taggedDepts = getTaggedDepartments(reply.tag_departments);
                      const replyUser = reply.user.role_id === 2 && reply.department
                        ? reply.department.name
                        : reply.user.name;

                      return (
                        <div
                          key={reply.id}
                          className={isEven ? 'timeline-wrapper timeline-inverted timeline-wrapper-primary' : 'timeline-wrapper timeline-wrapper-success'}
                        >
                          <div className="timeline-badge"></div>
                          <div className="timeline-panel">
                            <div className="timeline-heading">
                              <h6 className="timeline-title">
                                <i className="ti-share-alt text-primary mr-1"></i>
                                {replyUser}
                              </h6>
                            </div>
                            <div className="timeline-body">
                              {taggedDepts.length > 0 && (
                                <ul className="list-inline" style={{ padding: 0, margin: 0 }}>
                                  {taggedDepts.map((dept) => (
                                    <li
                                      key={dept.id}
                                      className="list-inline-item"
                                      style={{ display: 'inline-block', fontSize: '14px', fontWeight: 'bold', color: '#007bff', marginRight: '10px' }}
                                    >
                                      <i className="fas fa-tag" style={{ color: '#007bff', marginRight: '5px' }}></i>
                                      {dept.name}
                                    </li>
                                  ))}
                                </ul>
                              )}
                              <p dangerouslySetInnerHTML={{ __html: reply.reply_detail }}></p>
                              {reply.status && (
                                <p className="mb-0">
                                  <label
                                    style={{ width: '100px' }}
                                    className={`badge badge-${getBadgeClass(reply.status)} badge-pill`}
                                  >
                                    {getStatusLabel(reply.status)}
                                  </label>
                                  {reply.overdue_reason && (
                                    <>
                                      <hr />
                                      <div dangerouslySetInnerHTML={{ __html: reply.overdue_reason }}></div>
                                    </>
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
                                      |<a href="#" target="_blank" title="click to download attach file" onClick={(e) => { e.preventDefault(); console.log('Download:', file); }}>
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

      <div className="row" id="add-reply">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-body">
              <form className="form-sample" id="admin_reply_form" onSubmit={handleSubmit} encType="multipart/form-data">
                <p className="description">
                  <input type="hidden" name="detail_id" value={cmRemark.id} />
                </p>
                <fieldset>
                  <div className="row">
                    <div className="col-md-12">
                      <div className="mb-3">
                        <label htmlFor="tagDepartments">Tag Departments</label>
                        <select
                          className="w-100 form-control form-control-lg mb-3"
                          id="tagDepartments"
                          name="tag_departments[]"
                          multiple
                          value={tagDepartments.map(d => d.toString())}
                          onChange={handleTagDepartmentsChange}
                        >
                          {relatedDepartments.map((dept) => (
                            <option key={dept.id} value={dept.id}>
                              {dept.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Progress Reply</label>
                        <textarea
                          className="form-control"
                          id="reply_detail"
                          placeholder="type reply here..."
                          name="reply_detail"
                          rows={6}
                          required
                          value={replyDetail}
                          onChange={(e) => setReplyDetail(e.target.value)}
                        ></textarea>
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
                          style={{ display: 'none' }}
                          id="file-upload-reply"
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
                              onClick={() => document.getElementById('file-upload-reply')?.click()}
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
