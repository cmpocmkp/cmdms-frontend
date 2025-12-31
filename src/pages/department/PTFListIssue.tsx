/**
 * Department PTF List Issue Page
 * EXACT replica of department/ptf/list.blade.php from old CMDMS
 * Structure, classes, and behavior preserved exactly
 */

import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { generateMockPTFIssues, PTFIssue } from '../../lib/mocks/data/ptfIssuesData';
import { useMemo, useEffect, useRef } from 'react';

export default function PTFListIssue() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const statusParam = searchParams.get('status');
  const status = statusParam ? parseInt(statusParam, 10) : null;
  const tableRef = useRef<HTMLTableElement>(null);
  const dataTableRef = useRef<any>(null);
  
  // Get PTF issues for the current department, filtered by status
  const issues = useMemo(() => {
    if (!user?.department?.id) return [];
    const departmentId = typeof user.department.id === 'number' 
      ? user.department.id 
      : Number(user.department.id);
    return generateMockPTFIssues(status, null, departmentId);
  }, [user?.department?.id, status]);
  
  // Initialize DataTable
  useEffect(() => {
    let isMounted = true;
    
    const loadScript = (src: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) {
          resolve();
          return;
        }
        const script = document.createElement('script');
        script.src = src;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
        document.body.appendChild(script);
      });
    };
    
    const initializeDataTable = () => {
      if (!tableRef.current || !isMounted) return;
      
      // Check if DataTable is already initialized
      if (dataTableRef.current) {
        try {
          dataTableRef.current.destroy();
        } catch (e) {
          // Ignore destroy errors
        }
        dataTableRef.current = null;
      }
      
      // Check if jQuery and DataTables are available
      if (typeof window.$ === 'undefined' || !window.$.fn.DataTable) {
        return;
      }
      
      // Initialize DataTable
      if (window.$.fn.DataTable.isDataTable(tableRef.current)) {
        return;
      }
      
      dataTableRef.current = window.$(tableRef.current).DataTable({
        dom: 'Bfrtip',
        buttons: ['excel', 'print'],
        pageLength: 10,
        order: [[0, 'asc']],
        language: {
          search: '',
          searchPlaceholder: 'Search records...'
        },
        stateSave: false,
        autoWidth: false,
        info: true
      });
    };
    
    // Load jQuery and DataTables
    Promise.all([
      loadScript('https://code.jquery.com/jquery-3.6.0.min.js'),
      loadScript('https://cdn.datatables.net/1.13.6/js/jquery.dataTables.min.js'),
      loadScript('https://cdn.datatables.net/buttons/2.4.1/js/dataTables.buttons.min.js'),
      loadScript('https://cdn.datatables.net/buttons/2.4.1/js/buttons.html5.min.js'),
      loadScript('https://cdn.datatables.net/buttons/2.4.1/js/buttons.print.min.js')
    ])
      .then(() => {
        // Wait a bit for scripts to fully initialize
        const timer = setTimeout(() => {
          if (isMounted) {
            initializeDataTable();
          }
        }, 500);
        
        return () => clearTimeout(timer);
      })
      .catch((error) => {
        console.error('Error loading DataTable scripts:', error);
      });
    
    return () => {
      isMounted = false;
      if (dataTableRef.current) {
        try {
          dataTableRef.current.destroy();
        } catch (e) {
          // Ignore destroy errors
        }
        dataTableRef.current = null;
      }
    };
  }, [issues.length]);
  
  // Helper function to truncate text
  const truncateText = (text: string, words: number = 5): string => {
    const wordsArray = text.split(' ');
    if (wordsArray.length <= words) return text;
    return wordsArray.slice(0, words).join(' ') + '...';
  };
  
  // Helper function to format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };
  
  return (
    <div className="content-wrapper">
      <style>{`
        .table-responsive {
          overflow-x: auto;
        }
        .table-striped tbody tr:nth-of-type(odd) {
          background-color: rgba(0, 0, 0, 0.05);
        }
        .badge {
          display: inline-block;
          padding: 0.25em 0.6em;
          font-size: 75%;
          font-weight: 700;
          line-height: 1;
          text-align: center;
          white-space: nowrap;
          vertical-align: baseline;
          border-radius: 0.25rem;
        }
        .badge-primary {
          color: #fff;
          background-color: #007bff;
          margin-right: 5px;
          margin-bottom: 5px;
        }
        /* DataTables Export Buttons Styling - Match Old CMDMS */
        .dataTables_wrapper .dt-buttons {
          margin-bottom: 1rem;
          display: inline-block;
          float: left;
        }
        .dataTables_wrapper .dt-button {
          display: inline-block;
          background-color: #fff;
          background-image: linear-gradient(to bottom, #fff 0%, #e0e0e0 100%);
          border: 1px solid #999;
          border-radius: 2px;
          color: #333;
          cursor: pointer;
          font-size: 0.88em;
          line-height: 1.6em;
          padding: 0.5em 1em;
          text-align: center;
          text-decoration: none;
          user-select: none;
          vertical-align: middle;
          white-space: nowrap;
          margin-left: 0.167em;
          margin-right: 0;
          margin-bottom: 0.333em;
        }
        .dataTables_wrapper .dt-button:first-child {
          margin-left: 0;
        }
        .dataTables_wrapper .dt-button:hover {
          background-color: #e0e0e0;
          background-image: linear-gradient(to bottom, #f5f5f5 0%, #e0e0e0 100%);
          border-color: #666;
          text-decoration: none;
        }
        .dataTables_wrapper .dataTables_filter {
          text-align: right;
          margin-bottom: 1rem;
          float: right;
        }
        .dataTables_wrapper .dataTables_filter input {
          margin-left: 0.5em;
          display: inline-block;
          width: auto;
          border: 1px solid #aaa;
          border-radius: 3px;
          padding: 5px;
        }
      `}</style>
      
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">PTF List</h4>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table 
                  ref={tableRef}
                  id="order-listing" 
                  className="table table-striped dataTable no-footer"
                >
                  <thead>
                    <tr>
                      <th>Sr.No</th>
                      <th>Issue #</th>
                      <th>Department</th>
                      <th>Issue</th>
                      <th>Way Forward</th>
                      <th>Source</th>
                      <th>Priority</th>
                      <th>Suggested Departments</th>
                      <th>Created Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {issues.length > 0 ? (
                      issues.map((issue: PTFIssue, index: number) => (
                        <tr key={issue.id}>
                          <td>{index + 1}</td>
                          <td>{issue.id_text}</td>
                          <td>{issue.department.name}</td>
                          <td>{truncateText(issue.issue, 5)}</td>
                          <td>{truncateText(issue.way_forward, 5)}</td>
                          <td>{issue.source.title}</td>
                          <td style={{ color: issue.priority.color || '#000' }}>
                            {issue.priority.title}
                          </td>
                          <td>
                            {issue.suggestedDepartments.map((dept) => (
                              <span key={dept.id} className="badge badge-primary">
                                {dept.name}
                              </span>
                            ))}
                          </td>
                          <td>{formatDate(issue.created_at)}</td>
                          <td>{issue.status_text}</td>
                          <td>
                            <Link 
                              to={`/department/ptf/issue/${issue.id}`}
                              className="btn btn-primary"
                            >
                              View
                            </Link>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={11} className="text-center">
                          No issues found
                        </td>
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

// Extend Window interface for jQuery and DataTables
declare global {
  interface Window {
    $: any;
    jQuery: any;
  }
}

