/**
 * Assign Permissions Page - Admin Module
 * EXACT replica of admin/users/permissions/edit.blade.php from old CMDMS
 */

import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { mockAdminUsers, type AdminUser } from '../../../lib/mocks/data/adminUsers';

// Mock permissions grouped by controller
const mockPermissions = {
  'Admin\\DashboardController': [
    { id: 1, name: 'admin.dashboard.index' },
    { id: 2, name: 'admin.dashboard.stats' },
  ],
  'Admin\\UsersController': [
    { id: 3, name: 'admin.users.list' },
    { id: 4, name: 'admin.users.create' },
    { id: 5, name: 'admin.users.edit' },
    { id: 6, name: 'admin.users.delete' },
  ],
  'Department\\RecordNotesController': [
    { id: 7, name: 'department.recordnotes.list' },
    { id: 8, name: 'department.recordnotes.create' },
    { id: 9, name: 'department.recordnotes.edit' },
    { id: 10, name: 'department.recordnotes.delete' },
  ],
  'Department\\DirectivesController': [
    { id: 11, name: 'department.directives.list' },
    { id: 12, name: 'department.directives.create' },
    { id: 13, name: 'department.directives.edit' },
    { id: 14, name: 'department.directives.delete' },
  ],
  'Department\\SectorialMeetingsController': [
    { id: 15, name: 'department.sectorial-meetings.list' },
    { id: 16, name: 'department.sectorial-meetings.create' },
    { id: 17, name: 'department.sectorial-meetings.edit' },
    { id: 18, name: 'department.sectorial-meetings.delete' },
  ],
  'Admin\\TagsController': [
    { id: 19, name: 'admin.tags.list' },
    { id: 20, name: 'admin.tags.create' },
    { id: 21, name: 'admin.tags.edit' },
    { id: 22, name: 'admin.tags.delete' },
  ],
  'Admin\\DepartmentsController': [
    { id: 23, name: 'admin.departments.list' },
    { id: 24, name: 'admin.departments.create' },
    { id: 25, name: 'admin.departments.edit' },
    { id: 26, name: 'admin.departments.delete' },
  ],
};

export default function AssignPermissions() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [checkAll, setCheckAll] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);

  useEffect(() => {
    const foundUser = mockAdminUsers.find(u => u.id === parseInt(id || '0'));
    if (foundUser) {
      setUser(foundUser);
      // Load user's existing permissions
      // In real app, this would be fetched from backend
      // For now, randomly select some permissions for demo
      const existingPerms = foundUser.permissions
        .map(perm => {
          if (perm === 'department.recordnotes.list') return 7;
          if (perm === 'department.directives.list') return 11;
          if (perm === 'department.sectorial-meetings.list') return 15;
          return null;
        })
        .filter(Boolean) as number[];
      setSelectedPermissions(existingPerms);
    } else {
      alert('User not found');
      navigate('/admin/users');
    }
  }, [id, navigate]);

  const handleCheckboxChange = (permissionId: number) => {
    setSelectedPermissions(prev => {
      const isSelected = prev.includes(permissionId);
      return isSelected 
        ? prev.filter(id => id !== permissionId)
        : [...prev, permissionId];
    });
  };

  const handleGroupSelectAll = (permissions: any[]) => {
    const permIds = permissions.map(p => p.id);
    const allSelected = permIds.every(id => selectedPermissions.includes(id));
    
    if (allSelected) {
      // Uncheck all in this group
      setSelectedPermissions(prev => prev.filter(id => !permIds.includes(id)));
    } else {
      // Check all in this group
      setSelectedPermissions(prev => {
        const newPerms = [...prev];
        permIds.forEach(id => {
          if (!newPerms.includes(id)) {
            newPerms.push(id);
          }
        });
        return newPerms;
      });
    }
  };

  const handleCheckAll = () => {
    const newCheckAll = !checkAll;
    setCheckAll(newCheckAll);
    
    if (newCheckAll) {
      // Check all permissions
      const allPermIds: number[] = [];
      Object.values(mockPermissions).forEach(perms => {
        perms.forEach(p => allPermIds.push(p.id));
      });
      setSelectedPermissions(allPermIds);
    } else {
      // Uncheck all
      setSelectedPermissions([]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Assigned permissions:', selectedPermissions);
    // TODO: Implement API call when backend is ready
    alert('Permissions assigned successfully! (Mock)');
    navigate('/admin/users');
  };

  if (!user) {
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
    <>
      <style>{`
        ul {
          list-style: none;
        }
        .form-check > .chk-label input {
          top: 3px!important;
          left: 250px!important;
        }
        .form-check .chk-label input[type="checkbox"] + .input-helper:before, 
        .form-check .chk-label input[type="checkbox"] + .input-helper:after {
          position: absolute;
          top: 1px!important;
          left: 250px!important;
        }
        .permission-name {
          width: 270px;
          float: left;
          font-weight: bold;
          font-size: 14px;
        }
        .permission-options {
          left: 350px;
          position: relative;
          top: -28px;
        }
        .form-check .chk-label {
          width: 315px;
        }
      `}</style>

      <div className="content-wrapper">
        <div className="row">
          <div className="col-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <Link to="/admin/users" style={{ float: 'right' }}>
                  Show all users
                </Link>
                <p className="card-title">
                  <strong>Add User Permissions </strong>
                </p>
                <p className="card-description">{/* Create User */}</p>

                <div className="row">
                  <div className="col-md-12">
                    <div className="form-group">
                      <label htmlFor="name">
                        <h5>
                          Name : {user.name} | Department : {user.department_name} |
                          Role : {user.role_name} | Email : {user.email}
                        </h5>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="form-check" style={{ marginTop: '0px' }}>
                  <label className="form-check-label">
                    <input
                      type="checkbox"
                      id="checkAll"
                      className="form-check-input"
                      checked={checkAll}
                      onChange={handleCheckAll}
                    />
                    Check All
                  </label>
                </div>
                <hr />

                <form className="form-sample" onSubmit={handleSubmit}>
                  <ul>
                    {Object.entries(mockPermissions).map(([controller, methods]) => {
                      const controllerName = controller
                        .replace('Controller', '')
                        .replace('App\\Http\\Controllers\\', '');
                      
                      const allGroupSelected = methods.every(m => 
                        selectedPermissions.includes(m.id)
                      );

                      return (
                        <div key={controller} className="row">
                          <li>
                            <div className="permission-name">{controllerName}</div>
                            <div className="form-check chk-permission" style={{ marginTop: '0px' }}>
                              <label className="form-check-label chk-label">
                                <input
                                  type="checkbox"
                                  className="form-check-input check_all"
                                  checked={allGroupSelected}
                                  onChange={() => handleGroupSelectAll(methods)}
                                />
                                Select All
                                <i className="input-helper"></i>
                              </label>
                            </div>
                            <div className="permission-options">
                              <ul>
                                <div className="form-group">
                                  {methods.map(method => (
                                    <li key={method.id}>
                                      <div className="form-check" style={{ marginTop: '0px' }}>
                                        <label className="form-check-label">
                                          <input
                                            type="checkbox"
                                            name="permissions[]"
                                            value={method.id}
                                            className="form-check-input input-icheck"
                                            checked={selectedPermissions.includes(method.id)}
                                            onChange={() => handleCheckboxChange(method.id)}
                                          />
                                          {method.name}
                                        </label>
                                      </div>
                                    </li>
                                  ))}
                                </div>
                              </ul>
                            </div>
                          </li>
                          <hr />
                        </div>
                      );
                    })}
                  </ul>

                  <button type="submit" className="btn btn-primary mr-2">
                    Submit
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
