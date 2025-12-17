/**
 * Users List Page - Admin Module
 * EXACT replica of admin/users/index.blade.php from old CMDMS
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { mockAdminUsers, type AdminUser } from '../../../lib/mocks/data/adminUsers';

export default function UsersList() {
  const [users] = useState<AdminUser[]>(mockAdminUsers);
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const currentUserId = 1; // Mock: assuming logged-in user is super admin

  const handleDelete = (userId: number, userName: string) => {
    if (window.confirm('Are you sure you want to delete?')) {
      console.log(`Delete user ${userId}: ${userName}`);
      // TODO: Implement delete functionality when backend is ready
    }
  };

  const toggleDropdown = (userId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    setOpenDropdownId(openDropdownId === userId ? null : userId);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      // Check if click is outside all dropdowns
      if (!target.closest('.dropdown')) {
        setOpenDropdownId(null);
      }
    };

    if (openDropdownId !== null) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [openDropdownId]);

  return (
    <div className="content-wrapper">
      <div className="card">
        <div className="card-body">
          <div className="row">
            <div className="col-md-12">
              {currentUserId === 1 && (
                <Link 
                  to="/admin/users/create" 
                  style={{ float: 'right' }} 
                  className="btn btn-primary mb-1"
                >
                  Add new user
                </Link>
              )}
              <h4 className="card-title">All Users</h4>
            </div>
            <div className="col-12">
              <div className="table-responsive">
                <table id="order-listing" className="table table-striped">
                  <thead style={{ background: 'rgb(37, 136, 95) !important', color: 'white !important' }}>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Department</th>
                      <th>Group</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length > 0 ? (
                      users.map((user) => (
                        <tr key={user.id}>
                          <td>{user.name}</td>
                          <td>{user.email}</td>
                          <td>{user.role_name}</td>
                          <td>{user.department_name}</td>
                          <td>
                            {user.group_name ? (
                              <>
                                {user.group_name}
                                {user.group_description && ` (${user.group_description})`}
                              </>
                            ) : (
                              '-'
                            )}
                          </td>
                          <td>{user.is_active ? 'Active' : 'Inactive'}</td>
                          <td>
                            <div className="dropdown">
                              <button
                                type="button"
                                className="btn btn-secondary dropdown-toggle"
                                id={`dropdownMenuIconButton${user.id}`}
                                onClick={(e) => toggleDropdown(user.id, e)}
                                aria-haspopup="true"
                                aria-expanded={openDropdownId === user.id}
                              >
                                <i className="ti-settings menu-icon"></i>
                              </button>
                              <div
                                className={`dropdown-menu ${openDropdownId === user.id ? 'show' : ''}`}
                                aria-labelledby={`dropdownMenuIconButton${user.id}`}
                              >
                                <Link 
                                  className="dropdown-item" 
                                  to={`/admin/users/edit/${user.id}`}
                                  onClick={() => setOpenDropdownId(null)}
                                >
                                  Update
                                </Link>
                                
                                {currentUserId === 1 && (
                                  <>
                                    <Link
                                      className="dropdown-item"
                                      to={`/admin/userdepartments/edit/${user.id}`}
                                      onClick={() => setOpenDropdownId(null)}
                                    >
                                      Assign Departments
                                    </Link>
                                    <Link
                                      className="dropdown-item"
                                      to={`/admin/userpermission/edit/${user.id}`}
                                      title={user.permissions.length > 0 ? 'Permission assigned' : 'No permission'}
                                      onClick={() => setOpenDropdownId(null)}
                                    >
                                      Assign Permissions
                                    </Link>
                                    <Link
                                      className="dropdown-item"
                                      to={`/admin/users/${user.id}/tokens`}
                                      onClick={() => setOpenDropdownId(null)}
                                    >
                                      API Tokens
                                    </Link>
                                    
                                    {user.permissions.length > 0 && (
                                      <>
                                        <div className="dropdown-divider"></div>
                                        <h6 className="dropdown-header bg-light-green-with-dark-green-color">
                                          Assigned Permissions
                                        </h6>
                                        {user.permissions.includes('department.recordnotes.list') && (
                                          <h6 className="dropdown-header">Record Notes</h6>
                                        )}
                                        {user.permissions.includes('department.sectorial-meetings.list') && (
                                          <h6 className="dropdown-header">Sectorial</h6>
                                        )}
                                        {user.permissions.includes('department.directives.list') && (
                                          <h6 className="dropdown-header">Directives</h6>
                                        )}
                                      </>
                                    )}
                                    
                                    <div className="dropdown-divider"></div>
                                    <button
                                      className="dropdown-item text-danger"
                                      onClick={() => {
                                        handleDelete(user.id, user.name);
                                        setOpenDropdownId(null);
                                      }}
                                    >
                                      Delete
                                    </button>
                                  </>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7}>There is no data.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
