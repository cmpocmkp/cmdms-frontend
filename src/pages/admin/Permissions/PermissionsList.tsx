/**
 * Permissions List Page - Admin Module
 * Integrated with real API following API_INTEGRATION_GUIDE.md
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as permissionService from '../../../lib/services/permissionService';
import { USE_MOCK_DATA } from '../../../lib/api';

export default function PermissionsList() {
  const [permissions, setPermissions] = useState<permissionService.Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Fetch permissions from API
  useEffect(() => {
    fetchPermissions();
  }, []);

  const fetchPermissions = async () => {
    try {
      setLoading(true);
      setError(null);

      if (USE_MOCK_DATA) {
        // Mock data fallback
        setPermissions([
          { id: 1, name: 'read:users', description: 'Can read users' },
          { id: 2, name: 'write:users', description: 'Can create/edit users' },
          { id: 3, name: 'delete:users', description: 'Can delete users' },
          { id: 4, name: 'read:departments', description: 'Can read departments' },
          { id: 5, name: 'write:departments', description: 'Can create/edit departments' },
        ]);
      } else {
        // Real API call
        const response = await permissionService.listPermissions();

        if (response.success && response.data) {
          setPermissions(response.data);
        } else {
          setError(response.message || 'Failed to load permissions');
        }
      }
    } catch (err: any) {
      console.error('Error fetching permissions:', err);
      setError(err.response?.data?.error?.message || 'Failed to load permissions');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this permission?')) {
      return;
    }

    try {
      setDeleting(true);
      setError(null);

      if (USE_MOCK_DATA) {
        // Mock delete
        setPermissions(permissions.filter(permission => permission.id !== id));
        alert('Permission deleted successfully! (Mock)');
      } else {
        // Real API call
        const response = await permissionService.deletePermission(id);

        if (response.success) {
          // Refresh list
          fetchPermissions();
        } else {
          setError(response.message || 'Failed to delete permission');
        }
      }
    } catch (err: any) {
      console.error('Error deleting permission:', err);
      setError(err.response?.data?.error?.message || 'Failed to delete permission');
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
            <p className="mt-3">Loading permissions...</p>
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
                <h4 className="card-title mb-0">Permissions Management</h4>
                <Link to="/admin/permissions/create" className="btn btn-primary">
                  <i className="ti-plus mr-2"></i>Add New Permission
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
                      <th>Created At</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {permissions.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center py-5">
                          <p className="text-muted">No permissions found</p>
                          <Link to="/admin/permissions/create" className="btn btn-sm btn-primary">
                            Create First Permission
                          </Link>
                        </td>
                      </tr>
                    ) : (
                      permissions.map((permission) => (
                        <tr key={permission.id}>
                          <td>{permission.id}</td>
                          <td>
                            <strong>{permission.name}</strong>
                          </td>
                          <td>{permission.description || '-'}</td>
                          <td>
                            {permission.createdAt
                              ? new Date(permission.createdAt).toLocaleDateString()
                              : '-'}
                          </td>
                          <td>
                            <div className="btn-group" role="group">
                              <Link
                                to={`/admin/permissions/edit/${permission.id}`}
                                className="btn btn-sm btn-info"
                                title="Edit Permission"
                              >
                                <i className="ti-pencil"></i>
                              </Link>
                              <button
                                type="button"
                                className="btn btn-sm btn-danger"
                                onClick={() => handleDelete(permission.id)}
                                disabled={deleting}
                                title="Delete Permission"
                              >
                                {deleting && deleteConfirm === permission.id ? (
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

