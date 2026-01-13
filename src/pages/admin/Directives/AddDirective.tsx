/**
 * Add Directive Form - Admin Module  
 * EXACT replica of admin/directives/add.blade.php from old CMDMS
 * Integrated with real API following API_INTEGRATION_GUIDE.md
 * 
 * Note: API only supports: title, description, referenceNumber, priority, deadline, departmentIds
 * Additional form fields (timeline, is_archived, attachments) are UI-only and not sent to API
 */

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as directiveService from '../../../lib/services/directiveService';
import * as commonService from '../../../lib/services/commonService';
import { USE_MOCK_DATA } from '../../../lib/api';
import { mockAdminDepartments } from '../../../lib/mocks/data/adminDepartments';

export default function AddDirective() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [departments, setDepartments] = useState<Array<{ id: number; name: string }>>([]);
  const [formData, setFormData] = useState({
    subject: '',
    comments: '',
    letter_no: '',
    date: new Date().toISOString().split('T')[0],
    timeline: new Date().toISOString().split('T')[0],
    priority: 'medium',
    other_department_ids: [] as string[],
    is_archived: false,
    attachments: [] as File[]
  });

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
      setDepartments(mockAdminDepartments); // Fallback to mock
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleMultiSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const options = e.target.options;
    const selected: string[] = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selected.push(options[i].value);
      }
    }
    setFormData(prev => ({
      ...prev,
      other_department_ids: selected
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData(prev => ({
        ...prev,
        attachments: Array.from(e.target.files || [])
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);

      // Map form data to API format
      const apiData: directiveService.CreateDirectiveRequest = {
        title: formData.subject,
        description: formData.comments || undefined,
        referenceNumber: formData.letter_no || undefined,
        priority: formData.priority || 'medium',
        deadline: formData.date || undefined,
        departmentIds: formData.other_department_ids.map(id => parseInt(id, 10)),
      };

      if (USE_MOCK_DATA) {
        // Mock create
        await new Promise(resolve => setTimeout(resolve, 500));
        alert('Directive added successfully! (Mock)');
        navigate('/admin/directives');
      } else {
        // Real API call
        const response = await directiveService.createDirective(apiData);

        if (response.success && response.data) {
          alert('Directive added successfully!');
          navigate('/admin/directives');
        } else {
          setError(response.message || 'Failed to create directive');
        }
      }
    } catch (err: any) {
      console.error('Error creating directive:', err);
      setError(err.response?.data?.error?.message || 'Failed to create directive. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="content-wrapper">
      <div className="row">
        <div className="col-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <Link to="/admin/directives" style={{ float: 'right' }}>
                Show all Directives
              </Link>
              <p className="card-title"><strong>Add new Directive</strong></p>
              <p className="card-description"></p>

              {/* Error Message */}
              {error && (
                <div className="alert alert-danger" role="alert">
                  <i className="ti-alert-circle mr-2"></i>
                  <strong>Error:</strong> {error}
                </div>
              )}

              <form className="form-sample" onSubmit={handleSubmit} encType="multipart/form-data">
                {/* Subject */}
                <div className="row">
                  <div className="col">
                    <div className="form-group">
                      <label htmlFor="subjectdirective">Subject</label>
                      <textarea 
                        className="form-control" 
                        id="subjectdirective" 
                        name="subject" 
                        rows={4}
                        value={formData.subject}
                        onChange={handleChange}
                        required
                      ></textarea>
                    </div>
                  </div>
                </div>

                {/* Progress */}
                <div className="row">
                  <div className="col">
                    <div className="form-group">
                      <label htmlFor="add_directive_comments">Progress</label>
                      <textarea 
                        className="form-control" 
                        id="add_directive_comments" 
                        name="comments" 
                        rows={4}
                        value={formData.comments}
                        onChange={handleChange}
                      ></textarea>
                    </div>
                  </div>
                </div>

                {/* Departments, Letter No, Date, Timeline, Attachments, Archive */}
                <div className="row">
                  <div className="col-md-8">
                    <div className="form-group">
                      <label>Responsible Departments</label>
                      <select 
                        id="other_departments" 
                        name="other_department_ids" 
                        className="js-example-basic-multiple w-100 form-control form-control-lg" 
                        multiple
                        value={formData.other_department_ids}
                        onChange={handleMultiSelectChange}
                        size={5}
                      >
                        {departments.map(department => (
                          <option key={department.id} value={department.id}>{department.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label>Letter Number</label>
                      <input 
                        type="text" 
                        name="letter_no" 
                        id="letter_no"
                        value={formData.letter_no}
                        onChange={handleChange}
                        className="form-control" 
                        required 
                      />
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="form-group">
                      <label>Directive Date</label>
                      <input 
                        type="date" 
                        name="date" 
                        id="date"
                        value={formData.date}
                        onChange={handleChange}
                        className="form-control" 
                        required 
                      />
                    </div>
                  </div>

                  <div className="col-md-4">
                    <label>Timeline</label>
                    <input 
                      type="date" 
                      name="timeline" 
                      id="timeline"
                      value={formData.timeline}
                      onChange={handleChange}
                      className="form-control" 
                    />
                  </div>

                  <div className="col-md-4">
                    <div className="form-group">
                      <label>Attach Documents<small> (if any)</small></label>
                      <input 
                        type="file" 
                        name="attachments" 
                        className="file-upload-default" 
                        multiple
                        onChange={handleFileChange}
                      />
                      <div className="input-group col-xs-12">
                        <input 
                          type="text" 
                          className="form-control file-upload-info" 
                          disabled 
                          placeholder="Upload files"
                          value={formData.attachments.length > 0 ? `${formData.attachments.length} file(s) selected` : ''}
                        />
                        <span className="input-group-append">
                          <button 
                            className="file-upload-browse btn btn-success" 
                            type="button"
                            onClick={() => document.querySelector<HTMLInputElement>('input[name="attachments"]')?.click()}
                          >
                            Select Files
                          </button>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="form-group">
                      <div className="mt-5 form-check form-check-flat form-check-primary">
                        <label className="form-check-label">
                          <input 
                            id="is_archived" 
                            type="checkbox" 
                            name="is_archived"
                            checked={formData.is_archived}
                            onChange={handleChange}
                            className="form-check-input chkall"
                          />
                          Mark as Archived
                          <i className="input-helper"></i>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="btn btn-success mr-2"
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
