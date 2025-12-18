/**
 * Add Board Act - Admin Module
 * EXACT replica of admin/boardacts/add.blade.php from old CMDMS
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { mockAdminDepartments } from '../../../lib/mocks/data/adminDepartments';

export default function AddBoardAct() {
  const today = new Date();
  const dateStr = today.toISOString().split('T')[0];

  const [title, setTitle] = useState('');
  const [actDate, setActDate] = useState(dateStr);
  const [departmentId, setDepartmentId] = useState<string>('');
  const [isAmend, setIsAmend] = useState<string>('0');
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
  const [powerFunctionsFile, setPowerFunctionsFile] = useState<File | null>(null);
  const [mattersFile, setMattersFile] = useState<File | null>(null);
  const [lastMeetingAttachmentFile, setLastMeetingAttachmentFile] = useState<File | null>(null);
  const [lastMeetingDate, setLastMeetingDate] = useState(dateStr);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Add Board Act:', {
      title,
      act_date: actDate,
      department_id: departmentId || null,
      is_amend: isAmend,
      attachment: attachmentFile,
      power_functions: powerFunctionsFile,
      matters: mattersFile,
      last_meeting_attachment: lastMeetingAttachmentFile,
      last_meeting_date: lastMeetingDate
    });
    alert('Add Board Act functionality will be implemented with backend API');
    // Navigate would be: navigate('/admin/boardacts');
  };

  const handleFileChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      switch (field) {
        case 'attachment':
          setAttachmentFile(file);
          break;
        case 'power_functions':
          setPowerFunctionsFile(file);
          break;
        case 'matters':
          setMattersFile(file);
          break;
        case 'last_meeting_attachment':
          setLastMeetingAttachmentFile(file);
          break;
      }
    }
  };

  return (
    <div className="content-wrapper">
      <div className="row">
        <div className="col-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <Link to="/admin/boardacts" style={{ float: 'right' }}>
                Show all Boards
              </Link>
              <p className="card-title">
                <strong>Add new board act</strong>
              </p>

              <form
                className="form-sample"
                onSubmit={handleSubmit}
                encType="multipart/form-data"
                id="add_board_act_form"
              >
                {/* row start */}
                <div className="row">
                  <div className="col-md-8">
                    <div className="form-group">
                      <label>Act Title</label>
                      <input
                        type="text"
                        name="title"
                        id="board_act_title"
                        className="form-control"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label>Act Date</label>
                      <input
                        type="date"
                        name="act_date"
                        id="act__date"
                        className="form-control"
                        value={actDate}
                        onChange={(e) => setActDate(e.target.value)}
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
                        required
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
                      <label>Is Act Amended?</label>
                      <select
                        id="is_amend"
                        name="is_amend"
                        style={{ width: '300px' }}
                        className="js-example-basic-multiple w-100 form-control form-control-lg"
                        value={isAmend}
                        onChange={(e) => setIsAmend(e.target.value)}
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
                      <label>Attach Act</label>
                      <input
                        type="file"
                        name="attachment"
                        className="file-upload-default"
                        required
                        onChange={handleFileChange('attachment')}
                        style={{ display: 'none' }}
                        id="attachment-input"
                      />
                      <div className="input-group col-xs-12">
                        <input
                          type="text"
                          className="form-control file-upload-info"
                          disabled
                          placeholder="Upload file"
                          value={attachmentFile ? attachmentFile.name : ''}
                        />
                        <span className="input-group-append">
                          <button
                            className="file-upload-browse btn btn-success"
                            type="button"
                            onClick={() => document.getElementById('attachment-input')?.click()}
                          >
                            Select File
                          </button>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Attach Power & Functions</label>
                      <input
                        type="file"
                        name="power_functions"
                        className="file-upload-default"
                        required
                        onChange={handleFileChange('power_functions')}
                        style={{ display: 'none' }}
                        id="power-functions-input"
                      />
                      <div className="input-group col-xs-12">
                        <input
                          type="text"
                          className="form-control file-upload-info"
                          disabled
                          placeholder="Upload file"
                          value={powerFunctionsFile ? powerFunctionsFile.name : ''}
                        />
                        <span className="input-group-append">
                          <button
                            className="file-upload-browse btn btn-success"
                            type="button"
                            onClick={() => document.getElementById('power-functions-input')?.click()}
                          >
                            Select File
                          </button>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Attach Matters</label>
                      <input
                        type="file"
                        name="matters"
                        className="file-upload-default"
                        required
                        onChange={handleFileChange('matters')}
                        style={{ display: 'none' }}
                        id="matters-input"
                      />
                      <div className="input-group col-xs-12">
                        <input
                          type="text"
                          className="form-control file-upload-info"
                          disabled
                          placeholder="Upload file"
                          value={mattersFile ? mattersFile.name : ''}
                        />
                        <span className="input-group-append">
                          <button
                            className="file-upload-browse btn btn-success"
                            type="button"
                            onClick={() => document.getElementById('matters-input')?.click()}
                          >
                            Select File
                          </button>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label>Attach Last meeting minutes</label>
                      <input
                        type="file"
                        name="last_meeting_attachment"
                        className="file-upload-default"
                        onChange={handleFileChange('last_meeting_attachment')}
                        style={{ display: 'none' }}
                        id="last-meeting-input"
                      />
                      <div className="input-group col-xs-12">
                        <input
                          type="text"
                          className="form-control file-upload-info"
                          disabled
                          placeholder="Upload file"
                          value={lastMeetingAttachmentFile ? lastMeetingAttachmentFile.name : ''}
                        />
                        <span className="input-group-append">
                          <button
                            className="file-upload-browse btn btn-success"
                            type="button"
                            onClick={() => document.getElementById('last-meeting-input')?.click()}
                          >
                            Select File
                          </button>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label>Last meeting Date</label>
                      <input
                        type="date"
                        name="last_meeting_date"
                        id="last_meeting_date"
                        className="form-control"
                        value={lastMeetingDate}
                        onChange={(e) => setLastMeetingDate(e.target.value)}
                      />
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

