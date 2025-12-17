/**
 * Activity Logs Page - Admin Module
 * EXACT replica of admin/activitylogs/index.blade.php from old CMDMS
 */

import { useState, useMemo, useEffect, useRef } from 'react';
import { mockActivityLogs, activityActionOptions, type ActivityLog } from '../../../lib/mocks/data/activityLogs';
import { formatDistanceToNow } from 'date-fns';

export default function ActivityLogsList() {
  const [logs] = useState<ActivityLog[]>(mockActivityLogs);
  const [nameFilter, setNameFilter] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const tableRef = useRef<HTMLTableElement>(null);
  const dataTableRef = useRef<any>(null);

  // Filter logs based on name and action
  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const matchesName = nameFilter === '' || 
        log.user_name.toLowerCase().includes(nameFilter.toLowerCase()) ||
        log.user_email.toLowerCase().includes(nameFilter.toLowerCase());
      
      const matchesAction = actionFilter === '' || 
        log.action.toLowerCase() === actionFilter.toLowerCase();
      
      return matchesName && matchesAction;
    });
  }, [logs, nameFilter, actionFilter]);

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
        </div>
      </div>
    </div>
  );
}
