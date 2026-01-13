/**
 * Edit Department Form - Admin Module
 * EXACT replica of admin/departments/edit.blade.php from old CMDMS
 * Integrated with real API following API_INTEGRATION_GUIDE.md
 * 
 * Note: API only supports: name, code (optional), isActive (optional) for updates
 * Additional form fields (meeting_frequency, parent_id, minimum_members, district_id) are UI-only and not sent to API
 */

import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import * as departmentService from '../../../lib/services/departmentService';
import { USE_MOCK_DATA } from '../../../lib/api';
import { mockAdminDepartments } from '../../../lib/mocks/data/adminDepartments';

// Mock districts
const mockDistricts = [
  { id: 1, name: 'Peshawar' },
  { id: 2, name: 'Mardan' },
  { id: 3, name: 'Swat' },
  { id: 4, name: 'Abbottabad' },
  { id: 5, name: 'Mansehra' },
  { id: 6, name: 'Kohat' },
  { id: 7, name: 'Bannu' },
  { id: 8, name: 'D.I.Khan' },
];

export default function EditDepartment() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [department, setDepartment] = useState<departmentService.Department | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    parent_id: '',
    meeting_frequency: '',
    minimum_members: '',
    district_id: '',
    is_active: 1,
  });

  // Get parent departments (only department type, not boards) - UI only, not in API
  const parentDepartments = mockAdminDepartments.filter(
    d => d.type === 'department' && d.id !== parseInt(id || '0')
  );

  const isAdmin = true; // Mock: check if user is admin
  const isBoard = false; // API doesn't return type, assume false for now

  useEffect(() => {
    fetchDepartmentData();
  }, [id]);

  const fetchDepartmentData = async () => {
    if (!id) {
      navigate('/admin/departments');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (USE_MOCK_DATA) {
        // Mock data fallback
        const foundDept = mockAdminDepartments.find(d => d.id === parseInt(id));
        if (foundDept) {
          setDepartment({
            id: foundDept.id,
            name: foundDept.name,
            code: undefined,
            description: undefined,
            isActive: true, // Mock data doesn't have is_active, default to true
          } as departmentService.Department);
          setFormData({
            name: foundDept.name,
            code: '',
            parent_id: foundDept.parent_id?.toString() || '',
            meeting_frequency: '',
            minimum_members: '',
            district_id: '',
            is_active: 1, // Default to active for mock data
          });
        } else {
          setError('Department not found');
        }
      } else {
        // Real API call
        const response = await departmentService.getDepartment(parseInt(id));

        if (response.success && response.data) {
          const apiDept = response.data;
          setDepartment(apiDept);
          setFormData({
            name: apiDept.name,
            code: apiDept.code || '',
            parent_id: '',
            meeting_frequency: '',
            minimum_members: '',
            district_id: '',
            is_active: apiDept.isActive ? 1 : 0,
          });
        } else {
          setError('Department not found');
        }
      }
    } catch (err: any) {
      console.error('Error fetching department:', err);
      setError(err.response?.data?.error?.message || 'Failed to load department');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setError(null);
    setSaving(true);

    try {
      if (USE_MOCK_DATA) {
        // Mock submission
        console.log('Department updated (mock):', formData);
        alert('Department/Board updated successfully! (Mock)');
        navigate('/admin/departments');
      } else {
        // Real API call - only send documented fields
        const updateData: departmentService.UpdateDepartmentRequest = {
          name: formData.name,
          code: formData.code || undefined,
          isActive: formData.is_active === 1,
        };

        const response = await departmentService.updateDepartment(parseInt(id), updateData);

        if (response.success) {
          // Success - navigate back to list
          navigate('/admin/departments');
        } else {
          setError(response.message || 'Failed to update department');
        }
      }
    } catch (err: any) {
      console.error('Error updating department:', err);
      const errorMessage = err.response?.data?.error?.message || 
                          err.response?.data?.error?.details?.map((d: any) => d.message).join(', ') ||
                          'Failed to update department. Please try again.';
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !department) {
    return (
      <div className="content-wrapper">
        <div className="card">
          <div className="card-body text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="sr-only">Loading...</span>
            </div>
            <p className="mt-3">Loading department...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="content-wrapper">
      <div className="row">
        <div className="col-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <Link to="/admin/departments" style={{ float: 'right' }}>
                Show all departments/boards
              </Link>
              <p className="card-title">
                <strong>Edit Department/Board </strong>
              </p>
              <p className="card-description">
                {!USE_MOCK_DATA && (
                  <small className="text-muted">
                    Note: Only name, code, and status are sent to API. 
                    Other fields (meeting frequency, parent, members, district) are UI-only and not saved.
                  </small>
                )}
              </p>

              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <form className="forms-sample" onSubmit={handleSubmit}>
                {/* Row 1: Department Name and Code */}
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group row">
                      <label className="col-sm-3 col-form-label">
                        Name <span className="text-danger">*</span>
                      </label>
                      <div className="col-sm-9">
                        <input
                          type="text"
                          name="name"
                          className="form-control"
                          value={formData.name}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group row">
                      <label className="col-sm-3 col-form-label">
                        Code (Optional)
                      </label>
                      <div className="col-sm-9">
                        <input
                          type="text"
                          name="code"
                          className="form-control"
                          value={formData.code}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Parent Department (only for boards or admin) */}
                  {(isBoard || isAdmin) && (
                    <div className="col-md-6">
                      <div className="form-group row">
                        <label className="col-sm-3 col-form-label">
                          Parent (Board Under Department) <small className="text-muted">(UI only)</small>
                        </label>
                        <div className="col-sm-9">
                          <select
                            name="parent_id"
                            id="form_parent_id"
                            className="js-example-basic-single form-control"
                            value={formData.parent_id}
                            onChange={handleChange}
                          >
                            <option value="">--select parent department--</option>
                            {parentDepartments.map(dept => (
                              <option key={dept.id} value={dept.id}>
                                {dept.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Board-specific fields */}
                {(isBoard || isAdmin) && (
                  <>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group row">
                          <label className="col-sm-3 col-form-label">
                            Meeting Frequency as per Law <small className="text-muted">(UI only)</small>
                          </label>
                          <div className="col-sm-9">
                            <input
                              type="number"
                              name="meeting_frequency"
                              id="meeting_frequency"
                              value={formData.meeting_frequency}
                              onChange={handleChange}
                              className="form-control"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group row">
                          <label className="col-sm-3 col-form-label">
                            Non-exofficio members <small className="text-muted">(UI only)</small>
                          </label>
                          <div className="col-sm-9">
                            <input
                              type="number"
                              name="minimum_members"
                              id="minimum_members"
                              value={formData.minimum_members}
                              onChange={handleChange}
                              className="form-control"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Status and District fields */}
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group row">
                      <label className="col-sm-3 col-form-label">Status</label>
                      <div className="col-sm-9">
                        <select
                          name="is_active"
                          className="form-control"
                          value={formData.is_active}
                          onChange={handleChange}
                        >
                          <option value="1">Active</option>
                          <option value="0">Inactive</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  {/* District field (admin only) - UI only, not in API */}
                  {isAdmin && (
                    <div className="col-md-6">
                      <div className="form-group row">
                        <label className="col-sm-3 col-form-label">
                          District <small className="text-muted">(UI only)</small>
                        </label>
                        <div className="col-sm-9">
                          <select
                            name="district_id"
                            className="js-example-basic-single form-control"
                            value={formData.district_id}
                            onChange={handleChange}
                          >
                            <option value="">--select district(optional)--</option>
                            {mockDistricts.map(district => (
                              <option key={district.id} value={district.id}>
                                {district.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* UI-only fields note */}
                {(isBoard || isAdmin) && !USE_MOCK_DATA && (
                  <div className="row mb-3">
                    <div className="col-12">
                      <small className="text-muted">
                        Note: Meeting frequency, parent department, and members fields are UI-only and not saved to API.
                      </small>
                    </div>
                  </div>
                )}

                <button 
                  type="submit" 
                  className="btn btn-primary mr-2"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                      Updating...
                    </>
                  ) : (
                    'Update'
                  )}
                </button>
                <Link to="/admin/departments" className="btn btn-light">
                  Cancel
                </Link>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
