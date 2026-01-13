/**
 * Edit Role Form - Admin Module
 * Integrated with real API following API_INTEGRATION_GUIDE.md
 * 
 * Note: API supports: name (optional), description (optional), isActive (optional)
 */

import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import * as roleService from '../../../lib/services/roleService';
import { USE_MOCK_DATA } from '../../../lib/api';

export default function EditRole() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [role, setRole] = useState<roleService.Role | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    is_active: true,
  });

  useEffect(() => {
    fetchRoleData();
  }, [id]);

  const fetchRoleData = async () => {
    if (!id) {
      navigate('/admin/roles');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (USE_MOCK_DATA) {
        // Mock data fallback
        const mockRole: roleService.Role = {
          id: parseInt(id),
          name: 'Mock Role',
          description: 'Mock description',
          isActive: true,
        };
        setRole(mockRole);
        setFormData({
          name: mockRole.name,
          description: mockRole.description || '',
          is_active: mockRole.isActive ?? true,
        });
      } else {
        // Real API call
        const response = await roleService.getRole(parseInt(id));

        if (response.success && response.data) {
          const apiRole = response.data;
          setRole(apiRole);
          setFormData({
            name: apiRole.name,
            description: apiRole.description || '',
            is_active: apiRole.isActive ?? true,
          });
        } else {
          setError('Role not found');
        }
      }
    } catch (err: any) {
      console.error('Error fetching role:', err);
      setError(err.response?.data?.error?.message || 'Failed to load role');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
        console.log('Role updated (mock):', formData);
        alert('Role updated successfully! (Mock)');
        navigate('/admin/roles');
      } else {
        // Real API call - only send documented fields
        const updateData: roleService.UpdateRoleRequest = {};

        if (formData.name) updateData.name = formData.name;
        if (formData.description !== undefined) {
          updateData.description = formData.description || undefined;
        }
        updateData.isActive = formData.is_active;

        const response = await roleService.updateRole(parseInt(id), updateData);

        if (response.success) {
          // Success - navigate back to list
          navigate('/admin/roles');
        } else {
          setError(response.message || 'Failed to update role');
        }
      }
    } catch (err: any) {
      console.error('Error updating role:', err);
      const errorMessage = err.response?.data?.error?.message || 
                          err.response?.data?.error?.details?.map((d: any) => d.message).join(', ') ||
                          'Failed to update role. Please try again.';
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !role) {
    return (
      <div className="content-wrapper">
        <div className="card">
          <div className="card-body text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="sr-only">Loading...</span>
            </div>
            <p className="mt-3">Loading role...</p>
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
              <Link to="/admin/roles" style={{ float: 'right' }}>
                Show all roles
              </Link>
              <p className="card-title">
                <strong>Edit Role</strong>
              </p>
              <p className="card-description">
                {!USE_MOCK_DATA && (
                  <small className="text-muted">
                    Note: Only name, description, and status are sent to API.
                  </small>
                )}
              </p>

              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <form className="forms-sample" onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group row">
                      <label className="col-sm-3 col-form-label">Name</label>
                      <div className="col-sm-9">
                        <input
                          type="text"
                          name="name"
                          id="name"
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
                      <label className="col-sm-3 col-form-label">Status</label>
                      <div className="col-sm-9">
                        <select
                          name="is_active"
                          className="form-control"
                          value={formData.is_active ? '1' : '0'}
                          onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.value === '1' }))}
                        >
                          <option value="1">Active</option>
                          <option value="0">Inactive</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-12">
                    <div className="form-group row">
                      <label className="col-sm-2 col-form-label">Description</label>
                      <div className="col-sm-10">
                        <textarea
                          name="description"
                          id="description"
                          className="form-control"
                          value={formData.description}
                          onChange={handleChange}
                          rows={3}
                        />
                      </div>
                    </div>
                  </div>
                </div>

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
                <Link to="/admin/roles" className="btn btn-light">
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

