/**
 * Roles List Page - Admin Module
 * Integrated with real API following API_INTEGRATION_GUIDE.md
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as roleService from '../../../lib/services/roleService';
import { USE_MOCK_DATA } from '../../../lib/api';

export default function RolesList() {
  const [roles, setRoles] = useState<roleService.Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Fetch roles from API
  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      setError(null);

      if (USE_MOCK_DATA) {
        // Mock data fallback
        setRoles([
          { id: 1, name: 'Admin', description: 'Full system access', isActive: true },
          { id: 2, name: 'Department', description: 'Department user', isActive: true },
          { id: 3, name: 'Data Entry', description: 'Data entry operator', isActive: true },
        ]);
      } else {
        // Real API call
        const response = await roleService.listRoles();

        if (response.success && response.data) {
          setRoles(response.data);
        } else {
          setError(response.message || 'Failed to load roles');
        }
      }
    } catch (err: any) {
      console.error('Error fetching roles:', err);
      setError(err.response?.data?.error?.message || 'Failed to load roles');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this role?')) {
      return;
    }

    try {
      setDeleting(true);
      setError(null);

      if (USE_MOCK_DATA) {
        // Mock delete
        setRoles(roles.filter(role => role.id !== id));
        alert('Role deleted successfully! (Mock)');
      } else {
        // Real API call
        const response = await roleService.deleteRole(id);

        if (response.success) {
          // Refresh list
          fetchRoles();
        } else {
          setError(response.message || 'Failed to delete role');
        }
      }
    } catch (err: any) {
      console.error('Error deleting role:', err);
      setError(err.response?.data?.error?.message || 'Failed to delete role');
    } finally {
      setDeleting(false);
      setDeleteConfirm(null);
    }
  };

  if (loading) {
    return (
      <div className="content-wrapper">
        <div className="card">
          <div className="card-body text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="sr-only">Loading...</span>
            </div>
            <p className="mt-3">Loading roles...</p>
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
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="card-title mb-0">Roles Management</h4>
                <Link to="/admin/roles/create" className="btn btn-primary">
                  <i className="ti-plus mr-2"></i>Add New Role
                </Link>
              </div>

              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                  <button
                    type="button"
                    className="close"
                    onClick={() => setError(null)}
                    aria-label="Close"
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
              )}

              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Description</th>
                      <th>Status</th>
                      <th>Created At</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {roles.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-5">
                          <p className="text-muted">No roles found</p>
                          <Link to="/admin/roles/create" className="btn btn-sm btn-primary">
                            Create First Role
                          </Link>
                        </td>
                      </tr>
                    ) : (
                      roles.map((role) => (
                        <tr key={role.id}>
                          <td>{role.id}</td>
                          <td>
                            <strong>{role.name}</strong>
                          </td>
                          <td>{role.description || '-'}</td>
                          <td>
                            {role.isActive === false ? (
                              <span className="badge badge-danger">Inactive</span>
                            ) : (
                              <span className="badge badge-success">Active</span>
                            )}
                          </td>
                          <td>
                            {role.createdAt
                              ? new Date(role.createdAt).toLocaleDateString()
                              : '-'}
                          </td>
                          <td>
                            <div className="btn-group" role="group">
                              <Link
                                to={`/admin/roles/edit/${role.id}`}
                                className="btn btn-sm btn-info"
                                title="Edit Role"
                              >
                                <i className="ti-pencil"></i>
                              </Link>
                              {/* Role permissions management - endpoint exists but page not created yet */}
                              {/* <Link
                                to={`/admin/roles/${role.id}/permissions`}
                                className="btn btn-sm btn-secondary"
                                title="Manage Permissions"
                              >
                                <i className="ti-lock"></i>
                              </Link> */}
                              <button
                                type="button"
                                className="btn btn-sm btn-danger"
                                onClick={() => handleDelete(role.id)}
                                disabled={deleting}
                                title="Delete Role"
                              >
                                {deleting && deleteConfirm === role.id ? (
                                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                ) : (
                                  <i className="ti-trash"></i>
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
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

