/**
 * Add Board Meeting - Admin Module
 * EXACT replica of admin/boardmeetings/add.blade.php from old CMDMS
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { mockAdminDepartments } from '../../../lib/mocks/data/adminDepartments';

export default function AddBoardMeeting() {
  const today = new Date();
  const dateStr = today.toISOString().split('T')[0];

  const [subject, setSubject] = useState('');
  const [date, setDate] = useState(dateStr);
  const [departmentId, setDepartmentId] = useState<string>('');
  const [isUpcoming, setIsUpcoming] = useState<string>('0');
  const [attachmentFiles, setAttachmentFiles] = useState<FileList | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Add Board Meeting:', {
      subject,
      date,
      department_id: departmentId || null,
      is_upcoming: isUpcoming,
      attachments: attachmentFiles ? Array.from(attachmentFiles) : []
    });
    alert('Add Board Meeting functionality will be implemented with backend API');
    // Navigate would be: navigate('/admin/boardmeetings');
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
              <Link to="/admin/boardmeetings" style={{ float: 'right' }}>
                Show all Boards
              </Link>
              <p className="card-title">
                <strong>Add new board meeting</strong>
              </p>

              <form
                className="form-sample"
                onSubmit={handleSubmit}
                encType="multipart/form-data"
                id="add_board_meeting_form"
              >
                <p className="card-description">
                  <input type="hidden" name="created_by" value="1" /> {/* Will be replaced with actual user ID */}
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
                        id="meeting_date"
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
                        <option value="" disabled selected>
                          Please Select Board
                        </option>
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
                        <option value="0" selected>
                          No
                        </option>
                        <option value="1">Yes</option>
                      </select>
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

                {/* row end */}
                <button type="submit" className="btn btn-success mr-2">
                  Save
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

