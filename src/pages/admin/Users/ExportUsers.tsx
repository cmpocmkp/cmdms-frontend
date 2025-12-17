/**
 * Export Users Page
 * Triggers CSV download of all users
 */

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockAdminUsers } from '../../../lib/mocks/data/adminUsers';

export default function ExportUsers() {
  const navigate = useNavigate();

  useEffect(() => {
    // Generate CSV data
    const headers = ['ID', 'Name', 'Email', 'Role', 'Department', 'Group', 'Status'];
    const csvRows = [headers.join(',')];

    mockAdminUsers.forEach(user => {
      const row = [
        user.id,
        `"${user.name}"`,
        user.email,
        `"${user.role_name}"`,
        `"${user.department_name}"`,
        user.group_name ? `"${user.group_name}"` : '-',
        user.is_active ? 'Active' : 'Inactive'
      ];
      csvRows.push(row.join(','));
    });

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    // Create download link and trigger download
    const link = document.createElement('a');
    link.href = url;
    link.download = `users_export_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // Redirect back to users list after download
    setTimeout(() => {
      navigate('/admin/users');
    }, 100);
  }, [navigate]);

  return (
    <div className="content-wrapper">
      <div className="card">
        <div className="card-body text-center py-5">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="sr-only">Loading...</span>
          </div>
          <h5>Preparing user export...</h5>
          <p className="text-muted">Your download will start shortly.</p>
        </div>
      </div>
    </div>
  );
}
