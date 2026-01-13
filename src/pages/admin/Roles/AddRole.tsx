/**
 * Add Role Form - Admin Module
 * Integrated with real API following API_INTEGRATION_GUIDE.md
 * 
 * Note: API supports: name, description (optional)
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as roleService from '../../../lib/services/roleService';
import { USE_MOCK_DATA } from '../../../lib/api';

export default function AddRole() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (USE_MOCK_DATA) {
        // Mock submission
        console.log('Role created (mock):', formData);
        alert('Role created successfully! (Mock)');
        navigate('/admin/roles');
      } else {
        // Real API call - only send documented fields
        const requestData: roleService.CreateRoleRequest = {
          name: formData.name,
          description: formData.description || undefined,
        };

        const response = await roleService.createRole(requestData);

        if (response.success) {
          // Success - navigate back to list
          navigate('/admin/roles');
        } else {
          setError(response.message || 'Failed to create role');
        }
      }
    } catch (err: any) {
      console.error('Error creating role:', err);
      const errorMessage = err.response?.data?.error?.message || 
                          err.response?.data?.error?.details?.map((d: any) => d.message).join(', ') ||
                          'Failed to create role. Please try again.';
      setError(errorMessage);
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
              <Link to="/admin/roles" style={{ float: 'right' }}>
                Show all roles
              </Link>
              <p className="card-title">
                <strong>Add New Role</strong>
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

              <form className="form-sample" onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group row">
                      <label className="col-sm-3 col-form-label">Name <span className="text-danger">*</span></label>
                      <div className="col-sm-9">
                        <input
                          type="text"
                          name="name"
                          id="name"
                          className="form-control"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          placeholder="e.g., Manager, Editor"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-12">
                    <div className="form-group row">
                      <label className="col-sm-2 col-form-label">Description (Optional)</label>
                      <div className="col-sm-10">
                        <textarea
                          name="description"
                          id="description"
                          className="form-control"
                          value={formData.description}
                          onChange={handleChange}
                          rows={3}
                          placeholder="Role description..."
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary mr-2"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                      Creating...
                    </>
                  ) : (
                    'Submit'
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

