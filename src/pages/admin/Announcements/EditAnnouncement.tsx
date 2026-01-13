/**
 * Edit Announcement - Admin Module
 * EXACT replica of admin/announcements/edit.blade.php from old CMDMS
 * Integrated with real API following API_INTEGRATION_GUIDE.md
 * 
 * ⚠️ IMPORTANT: "Announcement Details" functionality (sub-items) is NOT documented in API_INTEGRATION_GUIDE.md
 * The API only provides:
 * - Update Announcement (main announcement fields)
 * - Create Announcement Detail Response (but no endpoints for details themselves)
 * 
 * Missing API endpoints (not documented):
 * - GET /api/announcements/:id/details - List announcement details
 * - GET /api/announcements/details/:id - Get announcement detail
 * - POST /api/announcements/:id/details - Create announcement detail
 * - PATCH /api/announcements/details/:id - Update announcement detail
 * - DELETE /api/announcements/details/:id - Delete announcement detail
 * - GET /api/announcements/details/:id/responses - List announcement detail responses
 */

import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import * as announcementService from '../../../lib/services/announcementService';
import * as commonService from '../../../lib/services/commonService';
import { mapAnnouncementToDisplay, mapDisplayToUpdateRequest } from '../../../lib/utils/announcementMapper';
import { USE_MOCK_DATA } from '../../../lib/api';
import { mockAdminDepartments } from '../../../lib/mocks/data/adminDepartments';

export default function EditAnnouncement() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState<any>(null);
  const [departments, setDepartments] = useState<Array<{ id: number; name: string }>>([]);
  const [updating, setUpdating] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    type: 'general',
    priority: 'medium',
    startDate: '',
    endDate: '',
    targetAudience: '',
    departmentIds: [] as string[],
    attachments: [] as File[]
  });

  // Fetch announcement and departments
  useEffect(() => {
    if (id) {
      fetchAnnouncement();
      fetchDepartments();
    }
  }, [id]);

  const fetchAnnouncement = async () => {
    try {
      setLoading(true);
      setError(null);

      if (USE_MOCK_DATA) {
        // Mock data - would need to be converted
        setAnnouncement({ id: Number(id), title: 'Mock Announcement' });
        setFormData({
          title: 'Mock Announcement',
          description: '',
          content: '',
          type: 'general',
          priority: 'medium',
          startDate: new Date().toISOString().split('T')[0],
          endDate: '',
          targetAudience: '',
          departmentIds: [],
          attachments: []
        });
      } else {
        const response = await announcementService.getAnnouncement(Number(id));
        
        if (response.success && response.data) {
          const displayAnnouncement = mapAnnouncementToDisplay(response.data);
          setAnnouncement(displayAnnouncement);
          setFormData({
            title: displayAnnouncement.title || '',
            description: displayAnnouncement.description || '',
            content: displayAnnouncement.content || '',
            type: displayAnnouncement.type || 'general',
            priority: displayAnnouncement.priority || 'medium',
            startDate: displayAnnouncement.startDate || '',
            endDate: displayAnnouncement.endDate || '',
            targetAudience: displayAnnouncement.targetAudience || '',
            departmentIds: displayAnnouncement.departmentIds?.map(id => id.toString()) || [],
            attachments: []
          });
        } else {
          setError(response.message || 'Announcement not found');
        }
      }
    } catch (err: any) {
      console.error('Error fetching announcement:', err);
      setError(err.response?.data?.error?.message || 'Failed to load announcement');
    } finally {
      setLoading(false);
    }
  };

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

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setUpdating(true);
      setError(null);

      // Map form data to API format
      const updateData = mapDisplayToUpdateRequest({
        title: formData.title,
        description: formData.description,
        content: formData.content,
        type: formData.type,
        priority: formData.priority,
        startDate: formData.startDate,
        endDate: formData.endDate,
        targetAudience: formData.targetAudience,
        departmentIds: formData.departmentIds.map(id => parseInt(id, 10)),
      });

      if (USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 500));
        alert('Announcement updated successfully! (Mock)');
        navigate('/admin/announcements');
      } else {
        const response = await announcementService.updateAnnouncement(Number(id), updateData);

        if (response.success && response.data) {
          alert('Announcement updated successfully!');
          navigate('/admin/announcements');
        } else {
          setError(response.message || 'Failed to update announcement');
        }
      }
    } catch (err: any) {
      console.error('Error updating announcement:', err);
      setError(err.response?.data?.error?.message || 'Failed to update announcement. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  // Mock announcement details - NOTE: This functionality is NOT documented in API_INTEGRATION_GUIDE.md
  // The API only provides "Create Announcement Detail Response" but no endpoints for details themselves
  // const announcementDetails: any[] = []; // Empty array - details functionality not available via API

  if (loading) {
    return (
      <div className="content-wrapper">
        <div className="text-center p-5">
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only">Loading...</span>
          </div>
          <p className="mt-2 text-muted">Loading announcement...</p>
        </div>
      </div>
    );
  }

  if (error && !announcement) {
    return (
      <div className="content-wrapper">
        <div className="alert alert-danger" role="alert">
          <i className="ti-alert-circle mr-2"></i>
          <strong>Error:</strong> {error}
          <Link to="/admin/announcements" className="btn btn-sm btn-outline-danger ml-3">
            Back to List
          </Link>
        </div>
      </div>
    );
  }

  if (!announcement) {
    return (
      <div className="content-wrapper">
        <div className="alert alert-danger">Announcement not found</div>
        <Link to="/admin/announcements" className="btn btn-outline-primary">
          Back to List
        </Link>
      </div>
    );
  }

  return (
    <div className="content-wrapper">
      {/* Start Tabs */}
      <div className="row">
        <div className="col-12 grid-margin">
          <div className="card">
            <div className="card-header">
              <div className="d-flex gap-3 justify-content-between align-items-center">
                <div className="flex-grow-1 text-center">
                  <p className="block display-4">Edit Announcement</p>
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
                      {/* Note: Add Detail button disabled - API endpoints not documented */}
                      <button
                        className="btn btn-outline-primary btn-fw"
                        onClick={() => {
                          alert('⚠️ Announcement Details functionality is NOT documented in API_INTEGRATION_GUIDE.md. Please contact backend team to add the required endpoints.');
                        }}
                        title="API endpoints for announcement details are not documented"
                      >
                        <i className="fa fa-plus mr-1"></i>
                        Add New Detail
                      </button>
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

              {/* Announcement Info Table */}
              <div className="table-responsive mt-2">
                <table className="table table-bordered table-striped table-sm w-100 mb-3">
                  <tbody>
                    <tr>
                      <th className="w-25">Title</th>
                      <td className="text-primary">{announcement.title}</td>
                    </tr>
                    {announcement.startDate && (
                      <tr>
                        <th>Start Date</th>
                        <td className="text-primary">
                          {new Date(announcement.startDate).toLocaleDateString('en-GB')}
                        </td>
                      </tr>
                    )}
                    {announcement.endDate && (
                      <tr>
                        <th>End Date</th>
                        <td className="text-primary">
                          {new Date(announcement.endDate).toLocaleDateString('en-GB')}
                        </td>
                      </tr>
                    )}
                    {announcement.departments && announcement.departments.length > 0 && (
                      <tr>
                        <th>Departments</th>
                        <td>
                          {announcement.departments.map((d: { id: number; name: string }) => d.name).join(', ')}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Update Form */}
              <form
                name="main-announcement-detail-form"
                id={`announcement-form-${announcement.id}`}
                className="form-sample main-announcement-detail"
                onSubmit={handleUpdate}
                encType="multipart/form-data"
              >
                <div className="row">
                  <div className="col-md-12">
                    <div className="form-group">
                      <label htmlFor="title">Title <span className="text-danger">*</span></label>
                      <input
                        type="text"
                        name="title"
                        id="title"
                        className="form-control"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="col-md-12">
                    <div className="form-group">
                      <label htmlFor="description">Description</label>
                      <textarea
                        name="description"
                        id="description"
                        rows={4}
                        className="form-control"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="col-md-12">
                    <div className="form-group">
                      <label htmlFor="content">Content</label>
                      <textarea
                        name="content"
                        id="content"
                        rows={6}
                        className="form-control"
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="type">Type</label>
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

                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="priority">Priority</label>
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

                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="startDate">Start Date</label>
                      <input
                        type="date"
                        name="startDate"
                        id="startDate"
                        className="form-control"
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="endDate">End Date</label>
                      <input
                        type="date"
                        name="endDate"
                        id="endDate"
                        className="form-control"
                        value={formData.endDate}
                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="col-md-12">
                    <div className="form-group">
                      <label htmlFor="targetAudience">Target Audience</label>
                      <input
                        type="text"
                        name="targetAudience"
                        id="targetAudience"
                        className="form-control"
                        value={formData.targetAudience}
                        onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                        placeholder="e.g., All Departments, Public, etc."
                      />
                    </div>
                  </div>

                  <div className="col-md-12">
                    <div className="form-group">
                      <label htmlFor="departmentIds">Departments</label>
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

                  {/* Submit Button */}
                  <div className="col-md-12 text-center">
                    <div className="form-group mt-3">
                      <button 
                        type="submit" 
                        className="btn btn-success btn-icon-text"
                        disabled={updating}
                      >
                        {updating ? (
                          <>
                            <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                            Updating...
                          </>
                        ) : (
                          <>
                            <i className="ti-check mr-1"></i>Update
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </form>

              <hr />

              {/* Announcement Details Section - NOT AVAILABLE VIA API */}
              <div className="alert alert-warning" role="alert">
                <i className="ti-alert-circle mr-2"></i>
                <strong>⚠️ Announcement Details Functionality Not Available</strong>
                <br />
                <small>
                  The API_INTEGRATION_GUIDE.md does not document endpoints for managing "Announcement Details" (sub-items).
                  The following endpoints are missing:
                  <ul className="mb-0 mt-2">
                    <li>GET /api/announcements/:id/details - List announcement details</li>
                    <li>GET /api/announcements/details/:id - Get announcement detail</li>
                    <li>POST /api/announcements/:id/details - Create announcement detail</li>
                    <li>PATCH /api/announcements/details/:id - Update announcement detail</li>
                    <li>DELETE /api/announcements/details/:id - Delete announcement detail</li>
                    <li>GET /api/announcements/details/:id/responses - List announcement detail responses</li>
                  </ul>
                  The API only provides: <code>POST /api/announcements/details/:id/responses</code> (create response only).
                  <br />
                  Please contact the backend team to add these endpoints to the API guide.
                </small>
              </div>

              {/* Announcement Details Table - Disabled */}
              <div className="row">
                <div className="col-12">
                  <div className="table-responsive">
                    <table className="table table-bordered table-condensed" role="grid">
                      <thead className="thead-light">
                        <tr>
                          <th>S.NO</th>
                          <th>Announcement</th>
                          <th>Progress</th>
                          <th>Responsibilities</th>
                          <th>Timeline</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td colSpan={6} className="text-center text-muted">
                            Announcement Details functionality is not available via API.
                            <br />
                            <small>Required endpoints are not documented in API_INTEGRATION_GUIDE.md</small>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals - Disabled due to missing API endpoints */}
      {/* Note: These modals are kept in code but functionality is disabled as API endpoints are not documented */}
    </div>
  );
}
