/**
 * Edit Khushhal KPK Task - Admin Module
 * EXACT replica of admin/khushhalkpk/edit.blade.php from old CMDMS
 */

import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { mockKhushhalKPKTasks, khushhalStatuses } from '../../../lib/mocks/data/khushhalKPK';
import { mockAdminDepartments } from '../../../lib/mocks/data/adminDepartments';

export default function EditKhushhalKPK() {
  const { id } = useParams<{ id: string }>();
  const task = mockKhushhalKPKTasks.find(t => t.id === Number(id));

  const [subjectTasks, setSubjectTasks] = useState('');
  const [progressSoFar, setProgressSoFar] = useState('');
  const [expectedOutcomes, setExpectedOutcomes] = useState('');
  const [timelineNote, setTimelineNote] = useState('');
  const [timelineDate, setTimelineDate] = useState('');
  const [departments, setDepartments] = useState<string[]>([]);
  const [actionByNote, setActionByNote] = useState('');
  const [status, setStatus] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [fileInputValue, setFileInputValue] = useState('');

  useEffect(() => {
    if (task) {
      setSubjectTasks(task.subject_tasks);
      setProgressSoFar(task.progress_so_far || '');
      setExpectedOutcomes(task.expected_outcomes || '');
      setTimelineNote(task.timeline_note || '');
      setTimelineDate(task.timeline_date);
      setDepartments(task.departments.map(d => d.toString()));
      setActionByNote(task.action_by_note || '');
      setStatus(task.status || '2'); // Default to '2' (In Progress) if not available
    }
  }, [task]);

  if (!task) {
    return (
      <div className="content-wrapper">
        <div className="alert alert-danger">Task not found</div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Update Khushhal KPK Task:', {
      id: task.id,
      subject_tasks: subjectTasks,
      progress_so_far: progressSoFar,
      expected_outcomes: expectedOutcomes,
      timeline_note: timelineNote,
      timeline_date: timelineDate,
      departments,
      action_by_note: actionByNote,
      status,
      attachments: selectedFiles
    });
    alert('Update Khushhal KPK Task functionality will be implemented with backend API');
  };

  const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setDepartments(selectedOptions);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedFiles(files);
      setFileInputValue(e.target.files.length > 0 ? `${e.target.files.length} file(s) selected` : '');
    }
  };

  const handleFileUploadClick = () => {
    const fileInput = document.getElementById('attachments-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  };

  return (
    <div className="content-wrapper">
      <style>
        {`
          .select2-selection--multiple {
            overflow: hidden !important;
            min-height: 75px !important;
            max-height: 165px !important;
          }
        `}
      </style>
      <div className="row">
        <div className="col-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <Link to="/admin/khushhalkpk" style={{ float: 'right' }}>
                Show all Tasks
              </Link>
              <p className="card-title"><strong>Update task</strong></p>
              <p className="card-description"></p>

              <form
                className="form-sample"
                onSubmit={handleSubmit}
                encType="multipart/form-data"
                id="khushhalkpk_update_form"
              >
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="subject_task">Subject Task</label>
                      <textarea
                        className="form-control"
                        id="subject_tasks"
                        name="subject_tasks"
                        rows={4}
                        value={subjectTasks}
                        onChange={(e) => setSubjectTasks(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="progress_so_far">Progress so far</label>
                      <textarea
                        className="form-control"
                        id="progress_so_far"
                        name="progress_so_far"
                        rows={4}
                        value={progressSoFar}
                        onChange={(e) => setProgressSoFar(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="expected_outcomes">Expected Outcomes</label>
                      <textarea
                        className="form-control"
                        id="expected_outcomes"
                        name="expected_outcomes"
                        rows={4}
                        value={expectedOutcomes}
                        onChange={(e) => setExpectedOutcomes(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="timeline_note">Timeline Note</label>
                      <textarea
                        className="form-control"
                        id="timeline_note"
                        name="timeline_note"
                        rows={4}
                        value={timelineNote}
                        onChange={(e) => setTimelineNote(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>Timeline Date</label>
                      <input
                        type="date"
                        name="timeline_date"
                        id="timeline_date"
                        value={timelineDate}
                        className="form-control"
                        onChange={(e) => setTimelineDate(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <label>Action By</label>
                    <div className="form-group">
                      <select
                        id="khushhalkpk_departments"
                        name="departments[]"
                        style={{ width: '300px', minHeight: '65px' }}
                        className="js-example-basic-multiple w-100 form-control form-control-lg"
                        required
                        multiple
                        value={departments}
                        onChange={handleDepartmentChange}
                      >
                        {mockAdminDepartments.map((department) => (
                          <option key={department.id} value={department.id.toString()}>
                            {department.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="col-md-5">
                    <div className="form-group">
                      <label htmlFor="action_by_note">Action by Note</label>
                      <textarea
                        className="form-control"
                        id="action_by_note"
                        name="action_by_note"
                        rows={4}
                        value={actionByNote}
                        onChange={(e) => setActionByNote(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label>Status</label>
                      <select
                        id="add_status_dropdown"
                        name="status"
                        className="js-example-basic-multiple w-100 form-control form-control-lg"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                      >
                        {Object.entries(khushhalStatuses).map(([key, value]) => (
                          <option key={key} value={key}>
                            {value}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label>Attach Documents<small> (if any)</small></label>
                      <input
                        type="file"
                        id="attachments-upload"
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
                    {task.attachments && task.attachments.length > 0 && (
                      <div style={{ marginTop: '10px' }}>
                        {task.attachments.map((_, idx) => (
                          <span key={idx} style={{ marginRight: '10px' }}>
                            <a href="#" title="click to download attach file">
                              Attachment: <i className="ti-file"></i>
                            </a>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <input type="submit" name="submit" className="btn btn-success mr-2" value="Update" />
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
