/**
 * Add Announcement - Admin Module
 * EXACT replica of admin/announcements/add.blade.php from old CMDMS
 * Integrated with real API following API_INTEGRATION_GUIDE.md
 * 
 * Note: API only supports: title, description, content, type, priority, startDate, endDate, targetAudience, departmentIds
 * Additional form fields (attachments) are UI-only and not sent to API
 */

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as announcementService from '../../../lib/services/announcementService';
import * as commonService from '../../../lib/services/commonService';
import { USE_MOCK_DATA } from '../../../lib/api';
import { mockAdminDepartments } from '../../../lib/mocks/data/adminDepartments';

export default function AddAnnouncement() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [departments, setDepartments] = useState<Array<{ id: number; name: string }>>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    type: 'general',
    priority: 'medium',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    targetAudience: '',
    departmentIds: [] as string[],
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
      departmentIds: selected
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);

      // Map form data to API format
      const apiData: announcementService.CreateAnnouncementRequest = {
        title: formData.title,
        description: formData.description || undefined,
        content: formData.content || undefined,
        type: formData.type || undefined,
        priority: formData.priority || 'medium',
        startDate: formData.startDate || undefined,
        endDate: formData.endDate || undefined,
        targetAudience: formData.targetAudience || undefined,
        departmentIds: formData.departmentIds.map(id => parseInt(id, 10)),
      };

      if (USE_MOCK_DATA) {
        // Mock create
        await new Promise(resolve => setTimeout(resolve, 500));
        alert('Announcement added successfully! (Mock)');
        navigate('/admin/announcements');
      } else {
        // Real API call
        const response = await announcementService.createAnnouncement(apiData);

        if (response.success && response.data) {
          alert('Announcement added successfully!');
          navigate('/admin/announcements');
        } else {
          setError(response.message || 'Failed to create announcement');
        }
      }
    } catch (err: any) {
      console.error('Error creating announcement:', err);
      setError(err.response?.data?.error?.message || 'Failed to create announcement. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="content-wrapper">
      <div className="row">
        <div className="col-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-header text-center">
              <div className="d-flex gap-3 justify-content-between align-items-center">
                <div className="flex-grow-1 text-center">
                  <p className="block display-4">Add New Announcement</p>
                </div>
                <div>
                  <div className="btn-toolbar pull-right">
                    <div className="btn-group">
                      <Link
                        to="/admin/announcements"
                        className="btn btn-outline-primary btn-fw"
                        style={{ float: 'right' }}
                      >
                        <i className="ti-arrow-left mr-1"></i>Back
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="card-body">
              {/* Error Message */}
              {error && (
                <div className="alert alert-danger" role="alert">
                  <i className="ti-alert-circle mr-2"></i>
                  <strong>Error:</strong> {error}
                </div>
              )}

              <form className="form-sample" onSubmit={handleSubmit} encType="multipart/form-data" id="record_note_form">
                {/* row start */}
                <div className="row">
                  <div className="col-md-12">
                    <div className="form-group">
                      <label>Title <span className="text-danger">*</span></label>
                      <input
                        type="text"
                        name="title"
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="form-control"
                        required
                      />
                    </div>
                  </div>

                  <div className="col-md-12">
                    <div className="form-group">
                      <label>Description</label>
                      <textarea
                        name="description"
                        id="description"
                        rows={4}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="form-control"
                      />
                    </div>
                  </div>

                  <div className="col-md-12">
                    <div className="form-group">
                      <label>Content</label>
                      <textarea
                        name="content"
                        id="content"
                        rows={6}
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        className="form-control"
                      />
                    </div>
                  </div>

                  <div className="col-md-6 col-sm-12">
                    <div className="form-group">
                      <label>Type</label>
                      <select
                        name="type"
                        id="type"
                        className="form-control"
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      >
                        <option value="general">General</option>
                        <option value="policy">Policy</option>
                        <option value="event">Event</option>
                        <option value="notice">Notice</option>
                      </select>
                    </div>
                  </div>

                  <div className="col-md-6 col-sm-12">
                    <div className="form-group">
                      <label>Priority</label>
                      <select
                        name="priority"
                        id="priority"
                        className="form-control"
                        value={formData.priority}
                        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                  </div>

                  <div className="col-md-6 col-sm-12">
                    <div className="form-group">
                      <label>Start Date</label>
                      <input
                        type="date"
                        name="startDate"
                        id="startDate"
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        className="form-control"
                      />
                    </div>
                  </div>

                  <div className="col-md-6 col-sm-12">
                    <div className="form-group">
                      <label>End Date</label>
                      <input
                        type="date"
                        name="endDate"
                        id="endDate"
                        value={formData.endDate}
                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                        className="form-control"
                      />
                    </div>
                  </div>

                  <div className="col-md-12">
                    <div className="form-group">
                      <label>Target Audience</label>
                      <input
                        type="text"
                        name="targetAudience"
                        id="targetAudience"
                        value={formData.targetAudience}
                        onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                        className="form-control"
                        placeholder="e.g., All Departments, Public, etc."
                      />
                    </div>
                  </div>

                  <div className="col-md-12">
                    <div className="form-group">
                      <label>Departments</label>
                      <select
                        name="departmentIds"
                        id="departmentIds"
                        className="js-example-basic-multiple w-100 form-control form-control-lg"
                        multiple
                        value={formData.departmentIds}
                        onChange={handleMultiSelectChange}
                        size={5}
                      >
                        {departments.map(department => (
                          <option key={department.id} value={department.id}>
                            {department.name}
                          </option>
                        ))}
                      </select>
                      <small className="form-text text-muted">Hold Ctrl/Cmd to select multiple departments</small>
                    </div>
                  </div>

                  <div className="col-md-6 col-sm-12">
                    <div className="form-group">
                      <label>Attach Documents<small> (if any)</small></label>
                      <input
                        type="file"
                        name="attachment[]"
                        className="file-upload-default"
                        multiple
                        onChange={(e) => {
                          if (e.target.files) {
                            setFormData({ ...formData, attachments: Array.from(e.target.files) });
                          }
                        }}
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
                          <button className="file-upload-browse btn btn-success" type="button">
                            Select Files
                          </button>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-12 text-center">
                    <button 
                      type="submit" 
                      className="btn btn-success btn-icon-text"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                          Submitting...
                        </>
                      ) : (
                        <>
                          <i className="ti-check mr-1"></i>Save
                        </>
                      )}
                    </button>
                  </div>
                </div>
                {/* row end */}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
