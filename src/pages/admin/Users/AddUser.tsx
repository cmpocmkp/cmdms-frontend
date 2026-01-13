/**
 * Add User Form - Admin Module
 * EXACT replica of admin/users/add.blade.php from old CMDMS
 * Integrated with real API following API_INTEGRATION_GUIDE.md
 * 
 * Note: API only supports: name, email, password, roleId, departmentId (optional)
 * Additional form fields (manager_id, type, user_group_id, phone) are UI-only and not sent to API
 */

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as userService from '../../../lib/services/userService';
import * as commonService from '../../../lib/services/commonService';
import { USE_MOCK_DATA } from '../../../lib/api';
import { mockUserRoles, mockAdminUsers } from '../../../lib/mocks/data/adminUsers';
import { mockAdminDepartments } from '../../../lib/mocks/data/adminDepartments';

// User types enum
const userTypes = [
  { value: 'DS', label: 'Deputy Secretary (DS)' },
  { value: 'SO', label: 'Section Officer (SO)' },
];

// User groups (mock data)
const userGroups = [
  { id: 1, name: 'Core Team', description: 'Core management' },
  { id: 2, name: 'Technical', description: 'Technical staff' },
  { id: 3, name: 'Administrative', description: 'Admin staff' },
  { id: 4, name: 'Field Officers', description: 'Field workers' },
];

export default function AddUser() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role_id: 1,
    manager_id: '',
    type: '',
    department_id: '',
    is_active: 1,
    user_group_id: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [roles, setRoles] = useState<commonService.DropdownOption[]>([]);
  const [departments, setDepartments] = useState<commonService.DropdownOption[]>([]);
  const [loadingDropdowns, setLoadingDropdowns] = useState(true);

  // Load dropdowns from API
  useEffect(() => {
    fetchDropdowns();
  }, []);

  const fetchDropdowns = async () => {
    try {
      setLoadingDropdowns(true);
      if (USE_MOCK_DATA) {
        // Use mock data for dropdowns
        setRoles(mockUserRoles.map(r => ({ id: r.id, name: r.role_name })));
        setDepartments(mockAdminDepartments.map(d => ({ id: d.id, name: d.name })));
      } else {
        // Load from API
        const [rolesRes, departmentsRes] = await Promise.all([
          commonService.getRolesDropdown(),
          commonService.getDepartmentsDropdown(),
        ]);

        if (rolesRes.success && rolesRes.data) {
          setRoles(rolesRes.data);
        }
        if (departmentsRes.success && departmentsRes.data) {
          setDepartments(departmentsRes.data);
        }
      }
    } catch (err: any) {
      console.error('Error loading dropdowns:', err);
      // Fallback to mock data on error
      if (import.meta.env.DEV) {
        setRoles(mockUserRoles.map(r => ({ id: r.id, name: r.role_name })));
        setDepartments(mockAdminDepartments.map(d => ({ id: d.id, name: d.name })));
      }
    } finally {
      setLoadingDropdowns(false);
    }
  };

  // Mock deputy secretaries for manager dropdown (UI only, not in API)
  const deputySecretaries = mockAdminUsers.filter(
    u => u.role_name === 'Department' || u.role_name === 'Admin'
  ).slice(0, 10);

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
        console.log('Form submitted (mock):', formData);
        alert('User created successfully! (Mock)');
        navigate('/admin/users');
      } else {
        // Real API call - only send documented fields
        const requestData: userService.CreateUserRequest = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          roleId: Number(formData.role_id),
          departmentId: formData.department_id ? Number(formData.department_id) : undefined,
        };

        const response = await userService.createUser(requestData);

        if (response.success) {
          // Success - navigate back to list
          navigate('/admin/users');
        } else {
          setError(response.message || 'Failed to create user');
        }
      }
    } catch (err: any) {
      console.error('Error creating user:', err);
      const errorMessage = err.response?.data?.error?.message || 
                          err.response?.data?.error?.details?.map((d: any) => d.message).join(', ') ||
                          'Failed to create user. Please try again.';
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
              <Link to="/admin/users" style={{ float: 'right' }}>
                Show all users
              </Link>
              <p className="card-title">
                <strong>Add New User </strong>
              </p>
              <p className="card-description">
                {!USE_MOCK_DATA && (
                  <small className="text-muted">
                    Note: Only name, email, password, role, and department are sent to API. 
                    Other fields are UI-only and not saved.
                  </small>
                )}
              </p>

              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <form className="form-sample" onSubmit={handleSubmit}>
                {/* Row 1: Name and Email */}
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group row">
                      <label className="col-sm-3 col-form-label">Name</label>
                      <div className="col-sm-9">
                        <input
                          type="text"
                          name="name"
                          id="Name"
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
                      <label className="col-sm-3 col-form-label">Email Address</label>
                      <div className="col-sm-9">
                        <input
                          type="email"
                          name="email"
                          id="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="form-control"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Row 2: Password, Role, Manager, Type */}
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group row">
                      <label className="col-sm-3 col-form-label">Password</label>
                      <div className="col-sm-9">
                        <input
                          type="password"
                          className="form-control"
                          name="password"
                          id="password"
                          value={formData.password}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group row">
                      <label className="col-sm-3 col-form-label">Role</label>
                      <div className="col-sm-9">
                        <select
                          name="role_id"
                          className="form-control"
                          value={formData.role_id}
                          onChange={handleChange}
                          disabled={loadingDropdowns}
                          required
                        >
                          {loadingDropdowns ? (
                            <option>Loading roles...</option>
                          ) : (
                            roles.map(role => (
                              <option key={role.id} value={role.id}>
                                {role.name}
                              </option>
                            ))
                          )}
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group row">
                      <label className="col-sm-3 col-form-label">DS Manager (of SO)</label>
                      <div className="col-sm-9">
                        <select
                          name="manager_id"
                          className="form-control"
                          value={formData.manager_id}
                          onChange={handleChange}
                        >
                          <option value="">--select (optional)--</option>
                          {deputySecretaries.map(secretary => (
                            <option key={secretary.id} value={secretary.id}>
                              {secretary.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group row">
                      <label className="col-sm-3 col-form-label">Type (DS or SO)</label>
                      <div className="col-sm-9">
                        <select
                          name="type"
                          className="form-control"
                          value={formData.type}
                          onChange={handleChange}
                        >
                          <option value="">--select (optional)--</option>
                          {userTypes.map(type => (
                            <option key={type.value} value={type.value}>
                              {type.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Row 3: Department, Status, Group, Mobile */}
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group row">
                      <label className="col-sm-3 col-form-label">Department</label>
                      <div className="col-sm-9">
                        <select
                          name="department_id"
                          className="js-example-basic-single w-100 form-control form-control-lg"
                          value={formData.department_id}
                          onChange={handleChange}
                          disabled={loadingDropdowns}
                        >
                          <option value="">--select (optional)--</option>
                          {loadingDropdowns ? (
                            <option>Loading departments...</option>
                          ) : (
                            departments.map(department => (
                              <option key={department.id} value={department.id}>
                                {department.name}
                              </option>
                            ))
                          )}
                        </select>
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
                          value={formData.is_active}
                          onChange={handleChange}
                        >
                          <option value="1">Active</option>
                          <option value="0">Inactive</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group row">
                      <label className="col-sm-3 col-form-label">Group</label>
                      <div className="col-sm-9">
                        <select
                          name="user_group_id"
                          className="form-control"
                          value={formData.user_group_id}
                          onChange={handleChange}
                        >
                          <option value="">Select user Group</option>
                          {userGroups.map(group => (
                            <option key={group.id} value={group.id}>
                              {group.name}
                              {group.description && ` (${group.description})`}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group row">
                      <label className="col-sm-3 col-form-label">Mobile#</label>
                      <div className="col-sm-9">
                        <input
                          type="number"
                          className="form-control"
                          name="phone"
                          id="phone"
                          value={formData.phone}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary mr-2"
                  disabled={loading || loadingDropdowns}
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
                <Link to="/admin/users" className="btn btn-light">
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
