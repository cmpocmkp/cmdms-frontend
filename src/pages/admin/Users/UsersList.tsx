/**
 * Users List Page - Admin Module
 * EXACT replica of admin/users/index.blade.php from old CMDMS
 * Integrated with real API following API_INTEGRATION_GUIDE.md
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import * as userService from '../../../lib/services/userService';
import { USE_MOCK_DATA } from '../../../lib/api';
import { mockAdminUsers } from '../../../lib/mocks/data/adminUsers';

interface DisplayUser {
  id: number;
  name: string;
  email: string;
  role_name: string;
  department_name: string;
  group_name?: string;
  group_description?: string;
  is_active: boolean;
  permissions: string[];
}

export default function UsersList() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<DisplayUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const itemsPerPage = 10;

  // Fetch users from API
  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      if (USE_MOCK_DATA) {
        // Use mock data as fallback
        setUsers(mockAdminUsers as DisplayUser[]);
        setTotal(mockAdminUsers.length);
        setTotalPages(Math.ceil(mockAdminUsers.length / itemsPerPage));
      } else {
        // Real API call
        const response = await userService.listUsers({
          page: currentPage,
          limit: itemsPerPage,
        });

        if (response.success && response.data) {
          // Map API response to display format
          const mappedUsers: DisplayUser[] = response.data.map((apiUser) => ({
            id: apiUser.id,
            name: apiUser.name,
            email: apiUser.email,
            role_name: apiUser.role?.name || 'Unknown',
            department_name: apiUser.department?.name || '-',
            group_name: undefined, // Not in API response
            group_description: undefined,
            is_active: apiUser.isActive ?? true,
            permissions: [], // Will be loaded separately if needed
          }));

          setUsers(mappedUsers);
          setTotal(response.meta?.total || 0);
          setTotalPages(response.meta?.totalPages || 1);
        } else {
          setError('Failed to load users');
        }
      }
    } catch (err: any) {
      console.error('Error fetching users:', err);
      setError(err.response?.data?.error?.message || 'Failed to load users');
      // Fallback to mock data on error if in development
      if (import.meta.env.DEV) {
        setUsers(mockAdminUsers as DisplayUser[]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId: number, userName: string) => {
    if (window.confirm(`Are you sure you want to delete user "${userName}"?`)) {
      try {
        if (!USE_MOCK_DATA) {
          const response = await userService.deleteUser(userId);
          if (response.success) {
            // Refresh the list
            fetchUsers();
          } else {
            alert('Failed to delete user');
          }
        } else {
          console.log(`Delete user ${userId}: ${userName}`);
          // Mock delete - just refresh
          fetchUsers();
        }
      } catch (err: any) {
        console.error('Error deleting user:', err);
        alert(err.response?.data?.error?.message || 'Failed to delete user');
      }
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

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="content-wrapper">
      <div className="card">
        <div className="card-body">
          <div className="row">
            <div className="col-md-12">
              {currentUser?.id === 1 && (
                <Link 
                  to="/admin/users/create" 
                  style={{ float: 'right' }} 
                  className="btn btn-primary mb-1"
                >
                  Add new user
                </Link>
              )}
              <h4 className="card-title">All Users</h4>
              {!USE_MOCK_DATA && total > 0 && (
                <p className="text-muted">
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, total)} of {total} entries
                </p>
              )}
            </div>
            <div className="col-12">
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              {loading ? (
                <div className="text-center py-4">
                  <div className="spinner-border" role="status">
                    <span className="sr-only">Loading...</span>
                  </div>
                </div>
              ) : (
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
                                
                                {currentUser?.id === 1 && (
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
              )}
            </div>
          </div>

          {/* Pagination */}
          {!USE_MOCK_DATA && totalPages > 1 && (
            <div className="row mt-3">
              <div className="col-12">
                <nav>
                  <ul className="pagination justify-content-center">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </button>
                    </li>
                    
                    {[...Array(totalPages)].map((_, index) => {
                      const page = index + 1;
                      if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 2 && page <= currentPage + 2)
                      ) {
                        return (
                          <li
                            key={page}
                            className={`page-item ${currentPage === page ? 'active' : ''}`}
                          >
                            <button
                              className="page-link"
                              onClick={() => goToPage(page)}
                            >
                              {page}
                            </button>
                          </li>
                        );
                      } else if (page === currentPage - 3 || page === currentPage + 3) {
                        return (
                          <li key={page} className="page-item disabled">
                            <span className="page-link">...</span>
                          </li>
                        );
                      }
                      return null;
                    })}
                    
                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
