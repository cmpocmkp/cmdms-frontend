/**
 * Edit Board Meeting - Admin Module
 * EXACT replica of admin/boardmeetings/edit.blade.php from old CMDMS
 */

import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { mockBoardMeetings } from '../../../lib/mocks/data/boardMeetings';
import { mockAdminDepartments } from '../../../lib/mocks/data/adminDepartments';

export default function EditBoardMeeting() {
  const { id } = useParams<{ id: string }>();
  const meeting = mockBoardMeetings.find(m => m.id === Number(id));

  const [subject, setSubject] = useState('');
  const [date, setDate] = useState('');
  const [departmentId, setDepartmentId] = useState<string>('');
  const [isUpcoming, setIsUpcoming] = useState<string>('0');
  const [attachmentFiles, setAttachmentFiles] = useState<FileList | null>(null);

  useEffect(() => {
    if (meeting) {
      setSubject(meeting.subject);
      setDate(meeting.date);
      setDepartmentId(meeting.department_id.toString());
      setIsUpcoming(meeting.is_upcoming ? '1' : '0');
    }
  }, [meeting]);

  if (!meeting) {
    return (
      <div className="content-wrapper">
        <div className="alert alert-danger">Board Meeting not found</div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Update Board Meeting:', {
      id: meeting.id,
      subject,
      date,
      department_id: departmentId || null,
      is_upcoming: isUpcoming,
      attachments: attachmentFiles ? Array.from(attachmentFiles) : []
    });
    alert('Update Board Meeting functionality will be implemented with backend API');
    // Navigate would be: navigate(`/admin/boardmeetings/show/${meeting.department_id}`);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachmentFiles(e.target.files);
    }
  };

  return (
    <div className="content-wrapper">
      <div className="row">
        <div className="col-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <Link
                to={`/admin/boardmeetings/show/${meeting.department_id}`}
                style={{ float: 'right' }}
              >
                Back to meetings
              </Link>
              <p className="card-title">
                <strong>Edit Board Meeting</strong>
              </p>

              <form
                className="form-sample"
                onSubmit={handleSubmit}
                encType="multipart/form-data"
                id="edit_board_meeting_form"
              >
                <p className="card-description">
                  <input type="hidden" name="modified_by" value="1" /> {/* Will be replaced with actual user ID */}
                </p>

                {/* row start */}
                <div className="row">
                  <div className="col-md-8">
                    <div className="form-group">
                      <label>Board Meeting Subject</label>
                      <input
                        type="text"
                        name="subject"
                        id="board_meeting_subject"
                        className="form-control"
                        required
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label>Meeting Date</label>
                      <input
                        type="date"
                        name="date"
                        id="date"
                        className="form-control"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label>All Boards</label>
                      <select
                        id="department_id"
                        name="department_id"
                        style={{ width: '300px' }}
                        className="js-example-basic-multiple w-100 form-control form-control-lg"
                        value={departmentId}
                        onChange={(e) => setDepartmentId(e.target.value)}
                      >
                        {mockAdminDepartments.slice(0, 10).map((department) => (
                          <option key={department.id} value={department.id.toString()}>
                            {department.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label>Is upcomming meeting?</label>
                      <select
                        id="is_upcoming"
                        name="is_upcoming"
                        style={{ width: '300px' }}
                        className="js-example-basic-multiple w-100 form-control form-control-lg"
                        value={isUpcoming}
                        onChange={(e) => setIsUpcoming(e.target.value)}
                      >
                        <option value="0">No</option>
                        <option value="1">Yes</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label>
                        Update Attach Documents<small> (if any)</small>
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
                      {meeting.attachments && meeting.attachments.length > 0 && (
                        <div style={{ marginTop: '10px' }}>
                          {meeting.attachments.map((file, idx) => (
                            <span key={idx} style={{ display: 'block', marginBottom: '5px' }}>
                              <a
                                href="#"
                                title="click to download attach file"
                                onClick={(e) => {
                                  e.preventDefault();
                                  console.log('Download attachment:', file);
                                }}
                              >
                                Attachment:<i className="ti-file"></i>
                              </a>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* row end */}
                <button type="submit" className="btn btn-success mr-2">
                  Update
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

