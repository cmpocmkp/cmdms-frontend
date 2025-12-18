/**
 * Edit Board Act - Admin Module
 * EXACT replica of admin/boardacts/edit.blade.php from old CMDMS
 */

import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { mockBoardActs } from '../../../lib/mocks/data/boardActs';
import { mockAdminDepartments } from '../../../lib/mocks/data/adminDepartments';

export default function EditBoardAct() {
  const { id } = useParams<{ id: string }>();
  const act = mockBoardActs.find(a => a.id === Number(id));

  const [title, setTitle] = useState('');
  const [actDate, setActDate] = useState('');
  const [departmentId, setDepartmentId] = useState<string>('');
  const [isAmend, setIsAmend] = useState<string>('0');
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
  const [powerFunctionsFile, setPowerFunctionsFile] = useState<File | null>(null);
  const [mattersFile, setMattersFile] = useState<File | null>(null);
  const [lastMeetingAttachmentFile, setLastMeetingAttachmentFile] = useState<File | null>(null);
  const [lastMeetingDate, setLastMeetingDate] = useState('');

  useEffect(() => {
    if (act) {
      setTitle(act.title);
      setActDate(act.act_date);
      setDepartmentId(act.department_id.toString());
      setIsAmend(act.is_amend ? '1' : '0');
      setLastMeetingDate(act.last_meeting_date || '');
    }
  }, [act]);

  if (!act) {
    return (
      <div className="content-wrapper">
        <div className="alert alert-danger">Board Act not found</div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Update Board Act:', {
      id: act.id,
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
    alert('Update Board Act functionality will be implemented with backend API');
    // Navigate would be: navigate(`/admin/boardacts/show/${act.department_id}`);
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
              <Link
                to={`/admin/boardacts/show/${act.department_id}`}
                style={{ float: 'right' }}
              >
                Back to Acts
              </Link>
              <p className="card-title">
                <strong>Edit Board Act</strong>
              </p>

              <form
                className="form-sample"
                onSubmit={handleSubmit}
                encType="multipart/form-data"
                id="edit_board_act_form"
              >
                {/* row start */}
                <div className="row">
                  <div className="col-md-8">
                    <div className="form-group">
                      <label>Board Act Title</label>
                      <input
                        type="text"
                        name="title"
                        id="board_act_title"
                        className="form-control"
                        required
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
                        id="date"
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
                      <label>Is Act Amended?</label>
                      <select
                        id="is_amend"
                        name="is_amend"
                        style={{ width: '300px' }}
                        className="js-example-basic-multiple w-100 form-control form-control-lg"
                        value={isAmend}
                        onChange={(e) => setIsAmend(e.target.value)}
                      >
                        <option value="0">No</option>
                        <option value="1">Yes</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label>Update Attach act</label>
                      <input
                        type="file"
                        name="attachment"
                        className="file-upload-default"
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
                      {act.attachment && (
                        <div style={{ marginTop: '10px' }}>
                          <span>
                            <a
                              href="#"
                              title="click to download attach file"
                              onClick={(e) => {
                                e.preventDefault();
                                console.log('Download attachment:', act.attachment);
                              }}
                            >
                              Attachment:<i className="ti-file"></i>
                            </a>
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Attach Power & Functions</label>
                      <input
                        type="file"
                        name="power_functions"
                        className="file-upload-default"
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
                      {act.power_functions && (
                        <div style={{ marginTop: '10px' }}>
                          <span>
                            <a
                              href="#"
                              title="click to download attach file"
                              onClick={(e) => {
                                e.preventDefault();
                                console.log('Download power functions:', act.power_functions);
                              }}
                            >
                              Attachment:<i className="ti-file"></i>
                            </a>
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Attach Matters</label>
                      <input
                        type="file"
                        name="matters"
                        className="file-upload-default"
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
                      {act.matters && (
                        <div style={{ marginTop: '10px' }}>
                          <span>
                            <a
                              href="#"
                              title="click to download attach file"
                              onClick={(e) => {
                                e.preventDefault();
                                console.log('Download matters:', act.matters);
                              }}
                            >
                              Attachment:<i className="ti-file"></i>
                            </a>
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label>Update Last meeting minutes Attach</label>
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
                      {act.last_meeting_attachment && (
                        <div style={{ marginTop: '10px' }}>
                          <span>
                            <a
                              href="#"
                              title="click to download attach file"
                              onClick={(e) => {
                                e.preventDefault();
                                console.log('Download last meeting attachment:', act.last_meeting_attachment);
                              }}
                            >
                              Attachment:<i className="ti-file"></i>
                            </a>
                          </span>
                        </div>
                      )}
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

