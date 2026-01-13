/**
 * Edit User Form - Admin Module
 * EXACT replica of admin/users/edit.blade.php from old CMDMS
 * Integrated with real API following API_INTEGRATION_GUIDE.md
 * 
 * Note: API only supports: name, email, password (optional), roleId (optional), 
 * departmentId (optional), isActive (optional)
 * Additional form fields (manager_id, type, user_group_id, phone) are UI-only and not sent to API
 */

import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import * as userService from '../../../lib/services/userService';
import * as commonService from '../../../lib/services/commonService';
import { USE_MOCK_DATA } from '../../../lib/api';
import { mockUserRoles, mockAdminUsers, type AdminUser } from '../../../lib/mocks/data/adminUsers';
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

export default function EditUser() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
  const [roles, setRoles] = useState<commonService.DropdownOption[]>([]);
  const [departments, setDepartments] = useState<commonService.DropdownOption[]>([]);
  const [loadingDropdowns, setLoadingDropdowns] = useState(true);

  // Mock deputy secretaries for manager dropdown (UI only, not in API)
  const deputySecretaries = mockAdminUsers.filter(
    u => u.role_name === 'Department' || u.role_name === 'Admin'
  ).slice(0, 10);

  useEffect(() => {
    fetchUserData();
    fetchDropdowns();
  }, [id]);

  const fetchDropdowns = async () => {
    try {
      setLoadingDropdowns(true);
      if (USE_MOCK_DATA) {
        setRoles(mockUserRoles.map(r => ({ id: r.id, name: r.role_name })));
        setDepartments(mockAdminDepartments.map(d => ({ id: d.id, name: d.name })));
      } else {
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
      if (import.meta.env.DEV) {
        setRoles(mockUserRoles.map(r => ({ id: r.id, name: r.role_name })));
        setDepartments(mockAdminDepartments.map(d => ({ id: d.id, name: d.name })));
      }
    } finally {
      setLoadingDropdowns(false);
    }
  };

  const fetchUserData = async () => {
    if (!id) {
      navigate('/admin/users');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (USE_MOCK_DATA) {
        // Mock data fallback
        const foundUser = mockAdminUsers.find(u => u.id === parseInt(id));
        if (foundUser) {
          setUser(foundUser);
          setFormData({
            name: foundUser.name,
            email: foundUser.email,
            password: '',
            role_id: foundUser.role_id,
            manager_id: '',
            type: '',
            department_id: foundUser.department_id?.toString() || '',
            is_active: foundUser.is_active ? 1 : 0,
            user_group_id: foundUser.group_id?.toString() || '',
            phone: '',
          });
        } else {
          setError('User not found');
        }
      } else {
        // Real API call
        const response = await userService.getUser(parseInt(id));

        if (response.success && response.data) {
          const apiUser = response.data;
          // Map API response to display format (create AdminUser-like structure)
          const mappedUser: AdminUser = {
            id: apiUser.id,
            name: apiUser.name,
            email: apiUser.email,
            role_id: apiUser.roleId,
            role_name: apiUser.role?.name || 'Unknown',
            department_id: apiUser.departmentId || 0,
            department_name: apiUser.department?.name || '',
            is_active: apiUser.isActive ?? true,
            group_id: undefined,
            permissions: [],
          };

          setUser(mappedUser);
          setFormData({
            name: apiUser.name,
            email: apiUser.email,
            password: '',
            role_id: apiUser.roleId,
            manager_id: '',
            type: '',
            department_id: apiUser.departmentId?.toString() || '',
            is_active: apiUser.isActive ? 1 : 0,
            user_group_id: '',
            phone: apiUser.phone || '',
          });
        } else {
          setError('User not found');
        }
      }
    } catch (err: any) {
      console.error('Error fetching user:', err);
      setError(err.response?.data?.error?.message || 'Failed to load user');
    } finally {
      setLoading(false);
    }
  };

  // Prevent editing super admin (user ID 1)
  if (user && user.id === 1) {
    useEffect(() => {
      navigate('/admin/dashboard');
    }, [navigate]);
    return null;
  }

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
        console.log('Form submitted (mock):', formData);
        alert('User updated successfully! (Mock)');
        navigate('/admin/users');
      } else {
        // Real API call - only send documented fields
        const updateData: userService.UpdateUserRequest = {};

        if (formData.name) updateData.name = formData.name;
        if (formData.email) updateData.email = formData.email;
        if (formData.password) updateData.password = formData.password;
        if (formData.role_id) updateData.roleId = Number(formData.role_id);
        if (formData.department_id) {
          updateData.departmentId = Number(formData.department_id);
        }
        updateData.isActive = formData.is_active === 1;

        const response = await userService.updateUser(parseInt(id), updateData);

        if (response.success) {
          // Success - navigate back to list
          navigate('/admin/users');
        } else {
          setError(response.message || 'Failed to update user');
        }
      }
    } catch (err: any) {
      console.error('Error updating user:', err);
      const errorMessage = err.response?.data?.error?.message || 
                          err.response?.data?.error?.details?.map((d: any) => d.message).join(', ') ||
                          'Failed to update user. Please try again.';
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="content-wrapper">
        <div className="card">
          <div className="card-body text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="sr-only">Loading...</span>
            </div>
            <p className="mt-3">Loading user...</p>
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
              <Link to="/admin/users" style={{ float: 'right' }}>
                Show all users
              </Link>
              <p className="card-title">
                <strong>Edit User </strong>
              </p>
              <p className="card-description">
                {!USE_MOCK_DATA && (
                  <small className="text-muted">
                    Note: Only name, email, password, role, department, and status are sent to API. 
                    Other fields are UI-only and not saved.
                  </small>
                )}
              </p>

              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <form className="forms-sample" onSubmit={handleSubmit}>
                {/* Row 1: Name and Email */}
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group row">
                      <label className="col-sm-3 col-form-label"> Name</label>
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
                      <label className="col-sm-3 col-form-label">Email Address</label>
                      <div className="col-sm-9">
                        <input
                          type="email"
                          name="email"
                          id="email"
                          className="form-control"
                          value={formData.email}
                          onChange={handleChange}
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
                          placeholder="Leave blank to keep current password"
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
                      <label className="col-sm-3 col-form-label">Manager</label>
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
                      <label className="col-sm-3 col-form-label">Type</label>
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
                  disabled={saving || loadingDropdowns}
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
