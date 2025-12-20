/**
 * Khushhal KPK Departments Replies - Admin Module
 * EXACT replica of admin/replies/khushhalkpk/index.blade.php from old CMDMS
 */

import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { mockKhushhalKPKTasks } from '../../../lib/mocks/data/khushhalKPK';
import { mockAdminDepartments } from '../../../lib/mocks/data/adminDepartments';

// Format date as 'd F Y' (e.g., "15 December 2024")
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleDateString('en-GB', { month: 'long' });
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
};

// Mock reply data
interface Reply {
  id: number;
  user_id: number;
  department_id: number;
  reply: string;
  attachments?: string[];
  created_at: string;
}

const mockReplies: Reply[] = [
  {
    id: 1,
    user_id: 1,
    department_id: 1,
    reply: 'Department response regarding the progress update.',
    attachments: ['file1.pdf'],
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    user_id: 2,
    department_id: 2,
    reply: 'Additional information and updates from department.',
    created_at: new Date().toISOString()
  }
];

export default function KhushhalKPKReplies() {
  const { id } = useParams<{ id: string }>();
  const task = mockKhushhalKPKTasks.find(t => t.id === Number(id));
  const [reply, setReply] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [fileInputValue, setFileInputValue] = useState('');

  if (!task) {
    return (
      <div className="content-wrapper">
        <div className="alert alert-danger">Task not found</div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submit Reply:', {
      task_id: task.id,
      reply,
      attachments: selectedFiles
    });
    alert('Reply functionality will be implemented with backend API');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedFiles(files);
      setFileInputValue(e.target.files.length > 0 ? `${e.target.files.length} file(s) selected` : '');
    }
  };

  const handleFileUploadClick = () => {
    const fileInput = document.getElementById('reply-attachments') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
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
                        to="/admin/khushhalkpk"
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
                        <a href="#">Khushhal Program Task</a>
                      </li>
                      <li className="breadcrumb-item active" aria-current="page">
                        <span dangerouslySetInnerHTML={{ __html: task.subject_tasks || '' }} />
                      </li>
                    </ol>
                  </nav>
                </div>
              </div>

              <div className="mt-5">
                {mockReplies.length > 0 ? (
                  <div className="timeline">
                    {mockReplies.map((replyItem, index) => {
                      const department = mockAdminDepartments.find(d => d.id === replyItem.department_id);
                      const isEven = (index + 1) % 2 === 0;
                      
                      return (
                        <div
                          key={replyItem.id}
                          className={`timeline-wrapper ${isEven ? 'timeline-inverted timeline-wrapper-primary' : 'timeline-wrapper-success'}`}
                        >
                          <div className="timeline-badge"></div>
                          <div className="timeline-panel">
                            <div className="timeline-heading">
                              <h6 className="timeline-title">
                                <i className="ti-share-alt text-primary mr-1"></i>
                                {department?.name || 'Unknown Department'}
                              </h6>
                            </div>
                            <div className="timeline-body">
                              <p dangerouslySetInnerHTML={{ __html: replyItem.reply }} />
                            </div>
                            <div className="timeline-footer d-flex align-items-center flex-wrap">
                              {replyItem.attachments && replyItem.attachments.length > 0 && (
                                <div className="buttons">
                                  <i className="ti-file"></i>
                                  {replyItem.attachments.map((file, fileIdx) => (
                                    <span key={fileIdx}>
                                      |<span>
                                        <a href="#" title="click to download attach file">
                                          Download
                                        </a>
                                      </span>
                                    </span>
                                  ))}
                                </div>
                              )}
                              <span className="ml-md-auto font-weight-bold">
                                {formatDate(replyItem.created_at)}
                              </span>
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
              <form
                className="form-sample"
                id="admin_reply_form"
                method="post"
                encType="multipart/form-data"
                onSubmit={handleSubmit}
              >
                <input type="hidden" name="task_id" value={task.id} />
                <fieldset>
                  <div className="row">
                    <div className="col-md-12">
                      <div className="form-group">
                        <label>Progress Reply</label>
                        <textarea
                          className="form-control"
                          id="reply_detail"
                          placeholder="type reply here..."
                          name="reply"
                          rows={6}
                          value={reply}
                          onChange={(e) => setReply(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="form-group">
                        <label>Attach Documents<small> (if any)</small></label>
                        <input
                          type="file"
                          id="reply-attachments"
                          name="attachments[]"
                          className="file-upload-default"
                          multiple
                          style={{ display: 'none' }}
                          onChange={handleFileChange}
                        />
                        <div className="input-group col-xs-12">
                          <input
                            type="text"
                            className="form-control file-upload-info"
                            disabled
                            placeholder="Upload files"
                            value={fileInputValue}
                          />
                          <span className="input-group-append">
                            <button
                              className="file-upload-browse btn btn-success"
                              type="button"
                              onClick={handleFileUploadClick}
                            >
                              Select Files
                            </button>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <input
                    className="btn btn-primary pull-right"
                    type="submit"
                    value="Submit"
                  />
                </fieldset>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
