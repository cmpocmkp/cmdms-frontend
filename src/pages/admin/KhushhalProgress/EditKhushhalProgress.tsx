/**
 * Edit Khushhal Progress - Admin Module
 * EXACT replica of admin/khushhalprogress/edit.blade.php from old CMDMS
 */

import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { mockKhushhalKPKTasks, khushhalStatuses } from '../../../lib/mocks/data/khushhalKPK';
import { mockAdminDepartments } from '../../../lib/mocks/data/adminDepartments';

// Progress type enum
const progressTypes = [
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' }
];

// Mock progress data (in real implementation, this would come from API)
interface KhushhalProgress {
  id: number;
  khushhal_kpk_id: number;
  department_id: number;
  type: 'weekly' | 'monthly';
  progress: string;
  status: string;
  attachments?: string[];
}

const mockProgress: KhushhalProgress = {
  id: 1,
  khushhal_kpk_id: 1,
  department_id: 1,
  type: 'weekly',
  progress: 'Progress update for this week',
  status: '2',
  attachments: ['file1.pdf']
};

export default function EditKhushhalProgress() {
  const { id: _id } = useParams<{ id: string }>();
  const progress = mockProgress; // In real implementation, fetch by id
  const task = mockKhushhalKPKTasks.find(t => t.id === progress.khushhal_kpk_id);

  const [departmentId, setDepartmentId] = useState<string>('');
  const [type, setType] = useState<string>('');
  const [progressSummary, setProgressSummary] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [fileInputValue, setFileInputValue] = useState('');

  useEffect(() => {
    if (progress) {
      setDepartmentId(progress.department_id.toString());
      setType(progress.type);
      setProgressSummary(progress.progress);
      setStatus(progress.status);
    }
  }, [progress]);

  if (!progress || !task) {
    return (
      <div className="content-wrapper">
        <div className="alert alert-danger">Progress entry not found</div>
      </div>
    );
  }

  const departments = mockAdminDepartments.filter(d => 
    task.departments.includes(d.id)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Update Progress:', {
      id: progress.id,
      khushhal_kpk_id: progress.khushhal_kpk_id,
      department_id: departmentId,
      type,
      progress: progressSummary,
      status,
      attachments: selectedFiles
    });
    alert('Update Progress functionality will be implemented with backend API');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedFiles(files);
      setFileInputValue(e.target.files.length > 0 ? `${e.target.files.length} file(s) selected` : '');
    }
  };

  const handleFileUploadClick = () => {
    const fileInput = document.getElementById('progress-attachments') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  };

  return (
    <div className="content-wrapper">
      <div className="row">
        <div className="col-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <Link
                to={`/admin/khushhalkpk/show/${progress.khushhal_kpk_id}`}
                style={{ float: 'right' }}
              >
                Back
              </Link>
              <p className="card-title"><strong>Update task progress</strong></p>
              <div className="d-sm-flex flex-row flex-wrap text-center text-sm-left align-items-center">
                <div className="ml-sm-3 ml-md-0 ml-xl-3 mt-2 mt-sm-0 mt-md-2 mt-xl-0">
                  <h1 className="mb-3 display-6">
                    <p>
                      <b className="text-primary">{task.subject_tasks || '-'}</b>
                    </p>
                  </h1>
                </div>
              </div>

              <form
                className="form-sample"
                onSubmit={handleSubmit}
                encType="multipart/form-data"
                id="update_khushhal_progress_form"
              >
                <input type="hidden" name="khushhal_kpk_id" value={progress.khushhal_kpk_id} />
                <div className="row">
                  <div className="col-md-4">
                    <div className="form-group">
                      <label>All responsible department's</label>
                      <select
                        id="department_id"
                        name="department_id"
                        style={{ width: '300px' }}
                        className="js-example-basic-multiple w-100 form-control form-control-lg"
                        value={departmentId}
                        onChange={(e) => setDepartmentId(e.target.value)}
                        required
                      >
                        {departments.map((dept) => (
                          <option
                            key={dept.id}
                            value={dept.id.toString()}
                          >
                            {dept.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label>Is Weekly/Monthly</label>
                      <select
                        id="type"
                        name="type"
                        style={{ width: '300px' }}
                        className="js-example-basic-multiple w-100 form-control form-control-lg"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        required
                      >
                        {progressTypes.map((pt) => (
                          <option
                            key={pt.value}
                            value={pt.value}
                            selected={pt.value === progress.type}
                          >
                            {pt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label>Attach Documents/Presentations<small> (if any)</small></label>
                      <input
                        type="file"
                        id="progress-attachments"
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
                      {progress.attachments && progress.attachments.length > 0 && (
                        <div style={{ marginTop: '10px' }}>
                          {progress.attachments.map((_file, idx) => (
                            <span key={idx} style={{ marginRight: '10px' }}>
                              <a href="#" title="click to download attach file">
                                Attachment:<i className="ti-file"></i>
                              </a>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="subject_task">Progress Summary</label>
                      <textarea
                        className="form-control"
                        id="khushhal_progress_detail"
                        name="progress"
                        rows={4}
                        value={progressSummary}
                        onChange={(e) => setProgressSummary(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>Status</label>
                      <select
                        id="add_status_dropdown"
                        name="status"
                        className="js-example-basic-multiple w-100 form-control form-control-lg"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        required
                      >
                        {Object.entries(khushhalStatuses).map(([key, value]) => (
                          <option
                            key={key}
                            value={key}
                          >
                            {value}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
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
