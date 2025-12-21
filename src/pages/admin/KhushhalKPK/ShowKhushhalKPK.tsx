/**
 * Show Khushhal KPK Task - Admin Module
 * EXACT replica of admin/khushhalkpk/show.blade.php from old CMDMS
 */

import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { mockKhushhalKPKTasks, khushhalStatuses } from '../../../lib/mocks/data/khushhalKPK';
import { mockAdminDepartments } from '../../../lib/mocks/data/adminDepartments';

// Format date as 'd/m/Y'
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

// Badge color mapping based on status
const getBadgeColor = (status: string): string => {
  const statusMap: Record<string, string> = {
    '1': 'warning', // Pending
    '2': 'info',    // In Progress
    '3': 'success', // Completed
    '4': 'danger'   // On Hold
  };
  return statusMap[status] || 'secondary';
};

// Progress type enum
const progressTypes = [
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' }
];

export interface KhushhalProgress {
  id: number;
  khushhal_kpk_id: number;
  department_id: number;
  type: 'weekly' | 'monthly';
  progress: string;
  status: string;
  attachments?: string[];
  created_at: string;
}

// Mock progress data (in real implementation, this would come from API)
const mockProgressData: KhushhalProgress[] = [
  {
    id: 1,
    khushhal_kpk_id: 1,
    department_id: 1,
    type: 'weekly',
    progress: 'Progress update for this week',
    status: '2',
    attachments: ['file1.pdf'],
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    khushhal_kpk_id: 1,
    department_id: 1,
    type: 'monthly',
    progress: 'Monthly progress summary',
    status: '2',
    created_at: new Date().toISOString()
  }
];

export default function ShowKhushhalKPK() {
  const { id } = useParams<{ id: string }>();
  const task = mockKhushhalKPKTasks.find(t => t.id === Number(id));

  const [departmentId, setDepartmentId] = useState<string>('');
  const [type, setType] = useState<string>('');
  const [progress, setProgress] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [fileInputValue, setFileInputValue] = useState('');

  useEffect(() => {
    if (task && task.departments.length > 0) {
      setDepartmentId(task.departments[0].toString());
    }
  }, [task]);

  if (!task) {
    return (
      <div className="content-wrapper">
        <div className="alert alert-danger">Task not found</div>
      </div>
    );
  }

  const departments = mockAdminDepartments.filter(d => 
    task.departments.includes(d.id)
  );

  // Group progress by department
  const progressByDepartment = departments.map(dept => {
    const deptProgress = mockProgressData.filter(p => 
      p.department_id === dept.id && p.khushhal_kpk_id === task.id
    );
    return { department: dept, progress: deptProgress };
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Add Progress:', {
      khushhal_kpk_id: task.id,
      department_id: departmentId,
      type,
      progress,
      status,
      attachments: selectedFiles
    });
    alert('Add Progress functionality will be implemented with backend API');
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
      <style>
        {`
          #directive-listing td {
            border: 1px solid silver !important;
            vertical-align: top !important;
            font-size: 16px !important;
          }
          #directive-listing td ul li {
            font-size: 16px !important;
          }
          #directive-listing th {
            border: 1px solid silver !important;
            text-align: center !important;
            height: 35px;
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
              <p className="card-title"><strong>Add department task progress</strong></p>
              <div className="d-sm-flex flex-row flex-wrap text-center text-sm-left align-items-center">
                <div className="ml-sm-3 ml-md-0 ml-xl-3 mt-2 mt-sm-0 mt-md-2 mt-xl-0">
                  <h1 className="mb-3 display-6">
                    <p><b className="text-primary">{task.subject_tasks || '-'}</b></p>
                  </h1>
                </div>
              </div>

              <form
                className="form-sample"
                onSubmit={handleSubmit}
                encType="multipart/form-data"
                id="add_khushhal_progress_form"
              >
                <input type="hidden" name="khushhal_kpk_id" value={task.id} />
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
                        <option value="" disabled>Please select department</option>
                        {departments.map((dept) => (
                          <option key={dept.id} value={dept.id.toString()}>
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
                        <option value="" disabled>Please select</option>
                        {progressTypes.map((pt) => (
                          <option key={pt.value} value={pt.value}>
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
                        value={progress}
                        onChange={(e) => setProgress(e.target.value)}
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
                        <option value="" disabled>Please Select Status</option>
                        {Object.entries(khushhalStatuses).map(([key, value]) => (
                          <option key={key} value={key}>
                            {value}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                <button type="submit" className="btn btn-success mr-2">
                  Save
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <div className="table-responsive">
            <table id="directive-listing" className="table-striped" style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th style={{ width: '3px' }}>S.No</th>
                  <th style={{ width: '100px' }}>Progress Summary</th>
                  <th style={{ width: '100px' }}>Type</th>
                  <th style={{ width: '100px' }}>Create Date</th>
                  <th style={{ width: '85px' }}>Status</th>
                  <th style={{ width: '100px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {progressByDepartment.length > 0 ? (
                  progressByDepartment.map(({ department, progress: deptProgress }) => (
                    <React.Fragment key={department.id}>
                      <tr style={{ backgroundColor: '#71c016', textAlign: 'center' }}>
                        <td colSpan={6}><b>{department.name}</b></td>
                      </tr>
                      {deptProgress.length > 0 ? (
                        deptProgress.map((prog, idx) => (
                          <tr key={prog.id}>
                            <td style={{ width: '5px' }}>{idx + 1}</td>
                            <td style={{ width: '100px' }}>
                              <div dangerouslySetInnerHTML={{ __html: prog.progress || '' }} />
                              <br/><br/>
                              {prog.attachments && prog.attachments.length > 0 && (
                                <>
                                  {prog.attachments.map((_file, fileIdx) => (
                                    <span key={fileIdx} style={{ marginRight: '5px' }}>
                                      <a href="#" title="click to download attach file">
                                        Attachment/Presentation:<i className="ti-file"></i>
                                      </a>
                                    </span>
                                  ))}
                                </>
                              )}
                            </td>
                            <td style={{ width: '100px' }}>
                              {prog.type === 'weekly' ? 'Weekly' : 'Monthly'}
                            </td>
                            <td style={{ width: '100px' }}>
                              {formatDate(prog.created_at)}
                            </td>
                            <td style={{ width: '85px' }}>
                              <label
                                style={{ width: '85px' }}
                                className={`badge badge-${getBadgeColor(prog.status)} badge-pill`}
                              >
                                {khushhalStatuses[prog.status] || ''}
                              </label>
                            </td>
                            <td style={{ width: '100px' }}>
                              <Link
                                to={`/admin/khushhalprogress/edit/${prog.id}`}
                                style={{ float: 'left', marginLeft: '10px' }}
                                className="text-primary mr-2"
                                title="edit"
                              >
                                <i className="ti-pencil-alt icon-sm"></i>
                              </Link>
                              &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp;
                              <form
                                action="#"
                                method="post"
                                style={{ float: 'left', marginLeft: '10px' }}
                                onSubmit={(e) => {
                                  e.preventDefault();
                                  if (confirm('Are you sure to delete?This action can not be undone.')) {
                                    console.log('Delete progress:', prog.id);
                                    alert('Delete functionality will be implemented with backend API');
                                  }
                                }}
                              >
                                <button
                                  type="submit"
                                  className="btn btn-danger btn-sm btn-icon-text"
                                  title="delete"
                                >
                                  <i className="ti-trash icon-sm"></i>
                                </button>
                              </form>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6}>Progress not entered so far.</td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6}>Progress not entered so far.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
