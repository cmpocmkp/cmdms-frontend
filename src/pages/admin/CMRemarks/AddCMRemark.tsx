/**
 * Add CM Remark - Admin Module
 * EXACT replica of admin/cmremarks/add.blade.php from old CMDMS
 * Integrated with real API following API_INTEGRATION_GUIDE.md
 * 
 * Note: API only supports: subject, remark, priority, deadline, departmentIds
 * Additional form fields (letter_number, issue_date, section_id, status, attachments) are UI-only and not sent to API
 */

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as cmRemarkService from '../../../lib/services/cmRemarkService';
import * as commonService from '../../../lib/services/commonService';
import { mapDisplayToCreateRequest } from '../../../lib/utils/cmRemarkMapper';
import { USE_MOCK_DATA } from '../../../lib/api';
import { mockAdminDepartments } from '../../../lib/mocks/data/adminDepartments';

export default function AddCMRemark() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [departments, setDepartments] = useState<Array<{ id: number; name: string }>>([]);
  
  // API fields
  const [subject, setSubject] = useState('');
  const [remark, setRemark] = useState('');
  const [priority, setPriority] = useState<string>('medium');
  const [deadline, setDeadline] = useState('');
  const [departmentIds, setDepartmentIds] = useState<string[]>([]);
  
  // UI-only fields (not sent to API)
  const [letterNumber, setLetterNumber] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [sectionId, setSectionId] = useState<string>('');
  const [attachmentFiles, setAttachmentFiles] = useState<FileList | null>(null);

  // Fetch departments from API
  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      if (USE_MOCK_DATA) {
        setDepartments(mockAdminDepartments);
      } else {
        const response = await commonService.getDepartmentsDropdown();
        if (response.success && response.data) {
          setDepartments(response.data);
        } else {
          setDepartments([]);
        }
      }
    } catch (err: any) {
      console.error('Error fetching departments:', err);
      setDepartments(mockAdminDepartments); // Fallback
    }
  };

  const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions);
    const selectedIds = selectedOptions.map(option => option.value);
    setDepartmentIds(selectedIds);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);

      // Map form data to API format
      const apiData = mapDisplayToCreateRequest({
        subject,
        remark: remark || undefined,
        priority: priority || 'medium',
        deadline: deadline || undefined,
        departmentIds: departmentIds.map(id => parseInt(id, 10)),
      });

      if (USE_MOCK_DATA) {
        // Mock create
        await new Promise(resolve => setTimeout(resolve, 500));
        alert('CM remark added successfully! (Mock)');
        navigate('/admin/cmremarks');
      } else {
        // Real API call
        const response = await cmRemarkService.createCMRemark(apiData);

        if (response.success && response.data) {
          alert('CM remark added successfully!');
          navigate('/admin/cmremarks');
        } else {
          setError(response.message || 'Failed to create CM remark');
        }
      }
    } catch (err: any) {
      console.error('Error creating CM remark:', err);
      setError(err.response?.data?.error?.message || 'Failed to create CM remark. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="content-wrapper">
      <style>
        {`
          .select2-container--default.select2-container--focus .select2-selection--multiple {
            height: 155px !important;
          }
          .chosen-container .chosen-results {
            max-height: 200px !important;
          }
          .select2-container--default .select2-selection--multiple .select2-selection__rendered {
            height: 140px !important;
          }
        `}
      </style>
      <div className="row">
        <div className="col-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <Link to="/admin/cmremarks" style={{ float: 'right' }}>
                Show all CM Remarks
              </Link>
              <p className="card-title"><strong>Add new CM Remarks</strong></p>

              {/* Error Message */}
              {error && (
                <div className="alert alert-danger" role="alert">
                  <i className="ti-alert-circle mr-2"></i>
                  <strong>Error:</strong> {error}
                </div>
              )}

              <form className="form-sample" onSubmit={handleSubmit} encType="multipart/form-data" id="record_note_form">
                <div className="row">
                  {/* API Fields */}
                  <div className="col-md-12">
                    <div className="form-group">
                      <label>Subject <span className="text-danger">*</span></label>
                      <input
                        type="text"
                        name="subject"
                        id="cmremarks_subject"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="form-control"
                        required
                      />
                    </div>
                  </div>

                  <div className="col-md-12">
                    <div className="form-group">
                      <label>Remark</label>
                      <textarea
                        name="remark"
                        id="remark"
                        rows={4}
                        value={remark}
                        onChange={(e) => setRemark(e.target.value)}
                        className="form-control"
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Priority</label>
                      <select
                        name="priority"
                        id="priority"
                        className="form-control"
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Deadline</label>
                      <input
                        type="date"
                        name="deadline"
                        id="deadline"
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                        className="form-control"
                      />
                    </div>
                  </div>

                  <div className="col-md-12">
                    <div className="form-group">
                      <label htmlFor="departments">To Departments <span className="text-danger">*</span></label>
                      <select
                        id="cmremarks_departments"
                        name="departments[]"
                        style={{ width: '100%', height: '200px' }}
                        className="w-100 form-control form-control-lg"
                        required
                        multiple
                        value={departmentIds}
                        onChange={handleDepartmentChange}
                      >
                        {departments.map((department) => (
                          <option key={department.id} value={department.id}>
                            {department.name}
                          </option>
                        ))}
                      </select>
                      <small className="form-text text-muted">Hold Ctrl/Cmd to select multiple departments</small>
                    </div>
                  </div>

                  {/* UI-Only Fields (Not sent to API) */}
                  <div className="col-md-12">
                    <hr />
                    <small className="text-muted">
                      <strong>Note:</strong> The following fields are UI-only and not sent to the API (not documented in API_INTEGRATION_GUIDE.md):
                    </small>
                  </div>

                  <div className="col-md-4">
                    <div className="form-group">
                      <label>Letter Number <small className="text-muted">(UI-only)</small></label>
                      <input
                        type="text"
                        name="letter_number"
                        id="letter_number"
                        value={letterNumber}
                        onChange={(e) => setLetterNumber(e.target.value)}
                        className="form-control"
                      />
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="form-group">
                      <label>Issue Date <small className="text-muted">(UI-only)</small></label>
                      <input
                        type="date"
                        name="issue_date"
                        id="issue_date"
                        value={issueDate}
                        onChange={(e) => setIssueDate(e.target.value)}
                        className="form-control"
                      />
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="form-group">
                      <label>From Section <small className="text-muted">(UI-only)</small></label>
                      <input
                        type="text"
                        name="section_id"
                        id="section_id"
                        value={sectionId}
                        onChange={(e) => setSectionId(e.target.value)}
                        className="form-control"
                        placeholder="Section ID"
                      />
                    </div>
                  </div>

                  <div className="col-md-12">
                    <div className="form-group">
                      <label>Attach Letter <small className="text-muted">(UI-only)</small></label>
                      <input
                        type="file"
                        name="attachments[]"
                        className="file-upload-default"
                        multiple
                        onChange={(e) => {
                          if (e.target.files) {
                            setAttachmentFiles(e.target.files);
                          }
                        }}
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
                            Select
                          </button>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="btn btn-success mr-2 pull-right"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                      Submitting...
                    </>
                  ) : (
                    'Save'
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
