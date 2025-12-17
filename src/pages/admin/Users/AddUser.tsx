/**
 * Add User Form - Admin Module
 * EXACT replica of admin/users/add.blade.php from old CMDMS
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { mockUserRoles } from '../../../lib/mocks/data/adminUsers';
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
    department_id: 1,
    is_active: 1,
    user_group_id: '',
    phone: '',
  });

  // Mock deputy secretaries for manager dropdown
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // TODO: Implement API call when backend is ready
    alert('User created successfully! (Mock)');
    navigate('/admin/users');
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
              <p className="card-description">{/* Create User */}</p>

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
                        >
                          {mockUserRoles.map(role => (
                            <option key={role.id} value={role.id}>
                              {role.role_name}
                            </option>
                          ))}
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
                        >
                          {mockAdminDepartments.map(department => (
                            <option key={department.id} value={department.id}>
                              {department.name}
                            </option>
                          ))}
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

                <button type="submit" className="btn btn-primary mr-2">
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Import mockAdminUsers for deputy secretaries dropdown
import { mockAdminUsers } from '../../../lib/mocks/data/adminUsers';
