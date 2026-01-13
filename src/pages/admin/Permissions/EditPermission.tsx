/**
 * Edit Permission Form - Admin Module
 * Integrated with real API following API_INTEGRATION_GUIDE.md
 * 
 * Note: API supports: name (optional), description (optional)
 */

import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import * as permissionService from '../../../lib/services/permissionService';
import { USE_MOCK_DATA } from '../../../lib/api';

export default function EditPermission() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [permission, setPermission] = useState<permissionService.Permission | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  useEffect(() => {
    fetchPermissionData();
  }, [id]);

  const fetchPermissionData = async () => {
    if (!id) {
      navigate('/admin/permissions');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (USE_MOCK_DATA) {
        // Mock data fallback
        const mockPermission: permissionService.Permission = {
          id: parseInt(id),
          name: 'read:users',
          description: 'Can read users',
        };
        setPermission(mockPermission);
        setFormData({
          name: mockPermission.name,
          description: mockPermission.description || '',
        });
      } else {
        // Real API call
        const response = await permissionService.getPermission(parseInt(id));

        if (response.success && response.data) {
          const apiPermission = response.data;
          setPermission(apiPermission);
          setFormData({
            name: apiPermission.name,
            description: apiPermission.description || '',
          });
        } else {
          setError('Permission not found');
        }
      }
    } catch (err: any) {
      console.error('Error fetching permission:', err);
      setError(err.response?.data?.error?.message || 'Failed to load permission');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
        console.log('Permission updated (mock):', formData);
        alert('Permission updated successfully! (Mock)');
        navigate('/admin/permissions');
      } else {
        // Real API call - only send documented fields
        const updateData: permissionService.UpdatePermissionRequest = {};

        if (formData.name) updateData.name = formData.name;
        if (formData.description !== undefined) {
          updateData.description = formData.description || undefined;
        }

        const response = await permissionService.updatePermission(parseInt(id), updateData);

        if (response.success) {
          // Success - navigate back to list
          navigate('/admin/permissions');
        } else {
          setError(response.message || 'Failed to update permission');
        }
      }
    } catch (err: any) {
      console.error('Error updating permission:', err);
      const errorMessage = err.response?.data?.error?.message || 
                          err.response?.data?.error?.details?.map((d: any) => d.message).join(', ') ||
                          'Failed to update permission. Please try again.';
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !permission) {
    return (
      <div className="content-wrapper">
        <div className="card">
          <div className="card-body text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="sr-only">Loading...</span>
            </div>
            <p className="mt-3">Loading permission...</p>
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
              <Link to="/admin/permissions" style={{ float: 'right' }}>
                Show all permissions
              </Link>
              <p className="card-title">
                <strong>Edit Permission</strong>
              </p>
              <p className="card-description">
                {!USE_MOCK_DATA && (
                  <small className="text-muted">
                    Note: Only name and description are sent to API.
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
                  <div className="col-md-12">
                    <div className="form-group row">
                      <label className="col-sm-2 col-form-label">Name</label>
                      <div className="col-sm-10">
                        <input
                          type="text"
                          name="name"
                          id="name"
                          className="form-control"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          placeholder="e.g., read:users, write:departments"
                        />
                        <small className="form-text text-muted">
                          Format: action:resource
                        </small>
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
                <Link to="/admin/permissions" className="btn btn-light">
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

