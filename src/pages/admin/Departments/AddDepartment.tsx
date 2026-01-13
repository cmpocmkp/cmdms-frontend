/**
 * Add Department Form - Admin Module
 * EXACT replica of admin/departments/add.blade.php from old CMDMS
 * Integrated with real API following API_INTEGRATION_GUIDE.md
 * 
 * Note: API only supports: name, code (optional)
 * Additional form fields (meeting_frequency, parent_id, minimum_members) are UI-only and not sent to API
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as departmentService from '../../../lib/services/departmentService';
import { USE_MOCK_DATA } from '../../../lib/api';
import { mockAdminDepartments } from '../../../lib/mocks/data/adminDepartments';

export default function AddDepartment() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    meeting_frequency: '',
    parent_id: '',
    minimum_members: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get parent departments (only department type, not boards) - UI only, not in API
  const parentDepartments = mockAdminDepartments.filter(d => d.type === 'department');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
        console.log('Department created (mock):', formData);
        alert('Department/Board created successfully! (Mock)');
        navigate('/admin/departments');
      } else {
        // Real API call - only send documented fields
        const requestData: departmentService.CreateDepartmentRequest = {
          name: formData.name,
          code: formData.code || undefined,
        };

        const response = await departmentService.createDepartment(requestData);

        if (response.success) {
          // Success - navigate back to list
          navigate('/admin/departments');
        } else {
          setError(response.message || 'Failed to create department');
        }
      }
    } catch (err: any) {
      console.error('Error creating department:', err);
      const errorMessage = err.response?.data?.error?.message || 
                          err.response?.data?.error?.details?.map((d: any) => d.message).join(', ') ||
                          'Failed to create department. Please try again.';
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
              <Link to="/admin/departments" style={{ float: 'right' }}>
                Show all Department/Board
              </Link>
              <p className="card-title">
                <strong>Add New Department/Board</strong>
              </p>
              <p className="card-description">
                {!USE_MOCK_DATA && (
                  <small className="text-muted">
                    Note: Only name and code are sent to API. 
                    Other fields (meeting frequency, parent, members) are UI-only and not saved.
                  </small>
                )}
              </p>

              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <form className="form-sample" onSubmit={handleSubmit}>
                {/* Row 1: Name and Code */}
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group row">
                      <label className="col-sm-3 col-form-label">Name <span className="text-danger">*</span></label>
                      <div className="col-sm-9">
                        <input
                          type="text"
                          name="name"
                          id="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="form-control"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group row">
                      <label className="col-sm-3 col-form-label">Code (Optional)</label>
                      <div className="col-sm-9">
                        <input
                          type="text"
                          name="code"
                          id="code"
                          value={formData.code}
                          onChange={handleChange}
                          className="form-control"
                        />
                      </div>
                    </div>
                  </div>
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
                </div>

                {/* Row 2: Parent and Non-exofficio members */}
                <div className="row">
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
