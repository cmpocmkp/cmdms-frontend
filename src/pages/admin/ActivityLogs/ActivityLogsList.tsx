/**
 * Activity Logs Page - Admin Module
 * EXACT replica of admin/activitylogs/index.blade.php from old CMDMS
 * Integrated with real API following API_INTEGRATION_GUIDE.md
 * 
 * ⚠️ NOTE: Activity Logs endpoint is not documented in API_INTEGRATION_GUIDE.md
 * Using assumed endpoint /api/activity-logs. Verify with backend team.
 */

import { useState, useEffect, useRef } from 'react';
import { formatDistanceToNow } from 'date-fns';
import * as activityLogService from '../../../lib/services/activityLogService';
import { USE_MOCK_DATA } from '../../../lib/api';
import { mockActivityLogs, activityActionOptions } from '../../../lib/mocks/data/activityLogs';

interface DisplayActivityLog {
  id: number;
  user_name: string;
  user_email: string;
  department_name: string;
  action: string;
  created_at: Date;
}

export default function ActivityLogsList() {
  const [logs, setLogs] = useState<DisplayActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nameFilter, setNameFilter] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const tableRef = useRef<HTMLTableElement>(null);
  const dataTableRef = useRef<any>(null);

  // Fetch activity logs from API
  useEffect(() => {
    fetchActivityLogs();
  }, []);

  const fetchActivityLogs = async () => {
    try {
      setLoading(true);
      setError(null);

      if (USE_MOCK_DATA) {
        // Use mock data as fallback
        setLogs(mockActivityLogs as DisplayActivityLog[]);
      } else {
        // Real API call
        // Build params object
        const params: activityLogService.ListActivityLogsParams = {
          limit: 1000, // Get all logs for now (adjust if pagination needed)
        };

        if (actionFilter) {
          params.action = actionFilter;
        }

        const response = await activityLogService.listActivityLogs(params);

        if (response.success && response.data) {
          // Map API response to display format
          const mappedLogs: DisplayActivityLog[] = response.data.map((log) => ({
            id: log.id,
            user_name: log.userName || 'Unknown',
            user_email: log.userEmail || '',
            department_name: log.departmentName || '-',
            action: log.action || 'unknown',
            created_at: new Date(log.createdAt),
          }));

          setLogs(mappedLogs);
        } else {
          setError('Failed to load activity logs');
        }
      }
    } catch (err: any) {
      console.error('Error fetching activity logs:', err);
      setError(err.response?.data?.error?.message || 'Failed to load activity logs');
      
      // Fallback to mock data on error if in development
      if (import.meta.env.DEV) {
        setLogs(mockActivityLogs as DisplayActivityLog[]);
      }
    } finally {
      setLoading(false);
    }
  };

  // Filter logs based on name and action (client-side)
  const filteredLogs = logs.filter(log => {
    const matchesName = nameFilter === '' || 
      log.user_name.toLowerCase().includes(nameFilter.toLowerCase()) ||
      log.user_email.toLowerCase().includes(nameFilter.toLowerCase());
    
    const matchesAction = actionFilter === '' || 
      log.action.toLowerCase() === actionFilter.toLowerCase();
    
    return matchesName && matchesAction;
  });

  // Refetch when action filter changes (if API supports it)
  useEffect(() => {
    if (!USE_MOCK_DATA && actionFilter) {
      fetchActivityLogs();
    }
  }, [actionFilter]);

  // Format date
  const formatDate = (date: Date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');
    return `${day}-${month}-${year}  ${hours}:${minutes}:${seconds}`;
  };

  // Initialize DataTables
  useEffect(() => {
    if (tableRef.current && filteredLogs.length > 0) {
      const loadScript = (src: string) => {
        return new Promise((resolve, reject) => {
          // Check if script already exists
          if (document.querySelector(`script[src="${src}"]`)) {
            resolve(true);
            return;
          }
          const script = document.createElement('script');
          script.src = src;
          script.onload = resolve;
          script.onerror = reject;
          document.body.appendChild(script);
        });
      };

      const initializeDataTable = async () => {
        try {
          if (!(window as any).jQuery) {
            await loadScript('https://code.jquery.com/jquery-3.7.1.min.js');
          }
          await loadScript('https://cdn.datatables.net/1.13.7/js/jquery.dataTables.min.js');

          const $ = (window as any).jQuery;
          
          if (dataTableRef.current) {
            dataTableRef.current.destroy();
          }

          dataTableRef.current = $(tableRef.current).DataTable({
            pageLength: 50,
            lengthChange: false,
            ordering: false,
            info: false,
            paging: true,
          });
        } catch (error) {
          console.error('Error initializing DataTable:', error);
        }
      };

      initializeDataTable();
    }

    return () => {
      if (dataTableRef.current) {
        dataTableRef.current.destroy();
        dataTableRef.current = null;
      }
    };
  }, [filteredLogs]);

  return (
    <div className="content-wrapper">
      <div className="card">
        <div className="card-body">
          <h4 className="card-title">All Activity Logs</h4>
          <h4 className="display-3 mb-4">Logs Filters</h4>
          
          <div className="row">
            <div className="col-md-3">
              <label>User Name</label>
              <input
                type="text"
                id="activity_name_search"
                placeholder="type name"
                className="form-control"
                value={nameFilter}
                onChange={(e) => setNameFilter(e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <label>Action Status</label>
              <select
                id="activity_action_dropdown"
                className="form-control input-md"
                value={actionFilter}
                onChange={(e) => setActionFilter(e.target.value)}
              >
                {activityActionOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <p></p>

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
            <div className="row">
              <div className="col-12">
                <div className="table-responsive">
                  <table ref={tableRef} id="users_activity_logs" className="table table-striped">
                    <thead>
                      <tr>
                        <th>S.NO</th>
                        <th>Name</th>
                        <th>Department</th>
                        <th>Date</th>
                        <th>Log Type</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredLogs.length > 0 ? (
                        filteredLogs.map((log, index) => (
                        <tr key={log.id}>
                          <td>{index + 1}</td>
                          <td>
                            {log.user_name}
                            <br />
                            {log.user_email}
                          </td>
                          <td>{log.department_name}</td>
                          <td>
                            {formatDate(log.created_at)} - {formatDistanceToNow(log.created_at, { addSuffix: true })}
                          </td>
                          <td>{log.action.charAt(0).toUpperCase() + log.action.slice(1)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5}>There is no data.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          )}
        </div>
      </div>
    </div>
  );
}
