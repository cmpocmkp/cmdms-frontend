/**
 * PTIs KP Summary Report - Admin Module
 * EXACT replica of admin/report/ptis/summary.blade.php from old CMDMS
 */

import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { mockAdminDepartments } from '../../../lib/mocks/data/adminDepartments';
import { mockPTIs } from '../../../lib/mocks/data/ptis';

// Status enum matching old CMDMS
enum DecisionStatus {
  COMPLETED = '1',
  ON_TARGET = '2',
  OVERDUE = '3',
  OFF_TARGET = '4'
}

const statusLabels: Record<string, string> = {
  [DecisionStatus.COMPLETED]: 'Completed',
  [DecisionStatus.ON_TARGET]: 'On Target',
  [DecisionStatus.OVERDUE]: 'Overdue',
  [DecisionStatus.OFF_TARGET]: 'Off Target'
};

interface DepartmentStatusCounts {
  total: number;
  [key: string]: number;
}

interface DepartmentWithCounts {
  id: number;
  name: string;
  status_counts: DepartmentStatusCounts;
}

export default function PTIsSummaryReport() {
  const [departments, setDepartments] = useState<DepartmentWithCounts[]>([]);
  const [loading, setLoading] = useState(true);
  const tableRef = useRef<HTMLTableElement>(null);
  const dataTableRef = useRef<any>(null);

  useEffect(() => {
    // TODO: Replace with actual API call
    // For now, generate mock data based on PTIs tasks
    const generateDepartmentCounts = (): DepartmentWithCounts[] => {
      const deptCounts: Map<number, DepartmentStatusCounts> = new Map();

      // Initialize all departments
      mockAdminDepartments.slice(0, 15).forEach(dept => {
        deptCounts.set(dept.id, {
          total: 0,
          [statusLabels[DecisionStatus.COMPLETED]]: 0,
          [statusLabels[DecisionStatus.ON_TARGET]]: 0,
          [statusLabels[DecisionStatus.OVERDUE]]: 0,
          [statusLabels[DecisionStatus.OFF_TARGET]]: 0
        });
      });

      // Count tasks by department and status
      mockPTIs.forEach(pti => {
        pti.tasks?.forEach(task => {
          task.departments?.forEach(dept => {
            const counts = deptCounts.get(dept.id);
            if (counts) {
              counts.total++;
              const status = dept.pivot?.status || 'Pending';
              if (statusLabels[DecisionStatus.COMPLETED] === status) {
                counts[statusLabels[DecisionStatus.COMPLETED]]++;
              } else if (statusLabels[DecisionStatus.ON_TARGET] === status) {
                counts[statusLabels[DecisionStatus.ON_TARGET]]++;
              } else if (statusLabels[DecisionStatus.OVERDUE] === status) {
                counts[statusLabels[DecisionStatus.OVERDUE]]++;
              } else if (statusLabels[DecisionStatus.OFF_TARGET] === status) {
                counts[statusLabels[DecisionStatus.OFF_TARGET]]++;
              }
            }
          });
        });
      });

      return mockAdminDepartments.slice(0, 15).map(dept => ({
        id: dept.id,
        name: dept.name,
        status_counts: deptCounts.get(dept.id) || {
          total: 0,
          [statusLabels[DecisionStatus.COMPLETED]]: 0,
          [statusLabels[DecisionStatus.ON_TARGET]]: 0,
          [statusLabels[DecisionStatus.OVERDUE]]: 0,
          [statusLabels[DecisionStatus.OFF_TARGET]]: 0
        }
      }));
    };

    setDepartments(generateDepartmentCounts());
    setLoading(false);
  }, []);

  // Initialize DataTable
  useEffect(() => {
    if (loading) return;

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
      
      if (dataTableRef.current) {
        try {
          dataTableRef.current.destroy();
        } catch (e) {
          // Ignore destroy errors
        }
        dataTableRef.current = null;
      }
      
      if (typeof window.$ === 'undefined' || !window.$.fn.DataTable) {
        return;
      }
      
      if (window.$.fn.DataTable.isDataTable(tableRef.current)) {
        return;
      }
      
      dataTableRef.current = window.$(tableRef.current).DataTable({
        paging: false,
        ordering: true,
        searching: true,
        info: false
      });
    };
    
    Promise.all([
      loadScript('https://code.jquery.com/jquery-3.6.0.min.js'),
      loadScript('https://cdn.datatables.net/1.13.6/js/jquery.dataTables.min.js')
    ])
      .then(() => {
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
  }, [loading, departments.length]);

  if (loading) {
    return <div className="text-center p-5">Loading...</div>;
  }

  const progressStatuses = [
    DecisionStatus.COMPLETED,
    DecisionStatus.ON_TARGET,
    DecisionStatus.OFF_TARGET,
    DecisionStatus.OVERDUE
  ];

  return (
    <div className="content-wrapper">
      <div className="card">
        <div className="card-header text-center">
          <div className="d-flex gap-3 justify-content-between align-items-center">
            <div className="flex-grow-1 text-center">
              <p className="block display-4">PTIs KP Report</p>
            </div>
          </div>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col">
              <div className="table-responsive">
                <table 
                  ref={tableRef}
                  className="table table-bordered datatable"
                >
                  <thead>
                    <tr className="thead-light">
                      <th>Department</th>
                      <th>Total Tasks</th>
                      {progressStatuses.map(status => (
                        <th key={status}>{statusLabels[status]}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {departments.map((department) => (
                      <tr key={department.id}>
                        <td>{department.name}</td>
                        <td>
                          {department.status_counts.total > 0 ? (
                            <Link
                              to={`/admin/report/ptis/detail?department_id=${department.id}`}
                            >
                              {department.status_counts.total}
                            </Link>
                          ) : (
                            0
                          )}
                        </td>
                        {progressStatuses.map(status => {
                          const label = statusLabels[status];
                          const count = department.status_counts[label] || 0;
                          return (
                            <td key={status}>
                              {count > 0 ? (
                                <Link
                                  to={`/admin/report/ptis/detail?department_id=${department.id}&status=${status}`}
                                >
                                  {count}
                                </Link>
                              ) : (
                                0
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
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

