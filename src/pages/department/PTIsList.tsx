/**
 * Department PTIs KP List Page
 * EXACT replica of department/ptis/index.blade.php from old CMDMS
 * Structure, classes, and behavior preserved exactly
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { mockPTIs, Task } from '../../lib/mocks/data/ptis';

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

const statusBadgeClasses: Record<string, string> = {
  [DecisionStatus.COMPLETED]: 'badge-success',
  [DecisionStatus.ON_TARGET]: 'badge-info',
  [DecisionStatus.OVERDUE]: 'badge-warning',
  [DecisionStatus.OFF_TARGET]: 'badge-danger',
  'Pending': 'badge-secondary'
};

interface TaskWithPTI extends Task {
  pti: {
    id: number;
    code: string;
    title: string;
  };
}

interface SummaryCounts {
  total: number;
  [key: string]: number | { count: number; percent: number };
}

export default function PTIsList() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [tasks, setTasks] = useState<TaskWithPTI[]>([]);
  const [counts, setCounts] = useState<SummaryCounts>({
    total: 0,
    [statusLabels[DecisionStatus.COMPLETED]]: { count: 0, percent: 0 },
    [statusLabels[DecisionStatus.ON_TARGET]]: { count: 0, percent: 0 },
    [statusLabels[DecisionStatus.OVERDUE]]: { count: 0, percent: 0 }
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [searchTerm, setSearchTerm] = useState('');
  const tableRef = useRef<HTMLTableElement>(null);
  const dataTableRef = useRef<any>(null);

  const statusFilter = searchParams.get('status') || '';

  // Get department ID
  const departmentId = useMemo(() => {
    if (!user?.department?.id) return null;
    return typeof user.department.id === 'number' 
      ? user.department.id 
      : Number(user.department.id);
  }, [user?.department?.id]);

  // Generate tasks from PTIs for this department
  useEffect(() => {
    if (!departmentId) return;

    const allTasks: TaskWithPTI[] = [];

    mockPTIs.forEach(pti => {
      pti.tasks?.forEach(task => {
        // Check if task is assigned to this department
        const isAssigned = task.departments?.some(dept => dept.id === departmentId);
        if (isAssigned) {
          allTasks.push({
            ...task,
            pti: {
              id: pti.id,
              code: pti.code,
              title: pti.title
            }
          });
        }
      });
    });

    setTasks(allTasks);
  }, [departmentId]);

  // Filter tasks by status
  const filteredTasks = useMemo(() => {
    let filtered = tasks;

    // Filter by status
    if (statusFilter) {
      filtered = filtered.filter(task => {
        const dept = task.departments?.find(d => d.id === departmentId);
        return dept?.pivot?.status === statusLabels[statusFilter];
      });
    }

    // Filter by search term
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(search) ||
        task.description.toLowerCase().includes(search) ||
        task.pti.title.toLowerCase().includes(search)
      );
    }

    return filtered;
  }, [tasks, statusFilter, searchTerm, departmentId]);

  // Calculate summary counts
  useEffect(() => {
    const total = filteredTasks.length;
    const statusCounts: Record<string, number> = {
      [statusLabels[DecisionStatus.COMPLETED]]: 0,
      [statusLabels[DecisionStatus.ON_TARGET]]: 0,
      [statusLabels[DecisionStatus.OVERDUE]]: 0
    };

    filteredTasks.forEach(task => {
      const dept = task.departments?.find(d => d.id === departmentId);
      if (dept?.pivot?.status) {
        const status = dept.pivot.status;
        if (statusCounts.hasOwnProperty(status)) {
          statusCounts[status]++;
        }
      }
    });

    setCounts({
      total,
      [statusLabels[DecisionStatus.COMPLETED]]: {
        count: statusCounts[statusLabels[DecisionStatus.COMPLETED]],
        percent: total > 0 ? Math.round((statusCounts[statusLabels[DecisionStatus.COMPLETED]] / total) * 100) : 0
      },
      [statusLabels[DecisionStatus.ON_TARGET]]: {
        count: statusCounts[statusLabels[DecisionStatus.ON_TARGET]],
        percent: total > 0 ? Math.round((statusCounts[statusLabels[DecisionStatus.ON_TARGET]] / total) * 100) : 0
      },
      [statusLabels[DecisionStatus.OVERDUE]]: {
        count: statusCounts[statusLabels[DecisionStatus.OVERDUE]],
        percent: total > 0 ? Math.round((statusCounts[statusLabels[DecisionStatus.OVERDUE]] / total) * 100) : 0
      }
    });
  }, [filteredTasks, departmentId]);

  // Group tasks by PTI
  const groupedTasks = useMemo(() => {
    const grouped = new Map<number, TaskWithPTI[]>();
    
    filteredTasks
      .sort((a, b) => {
        // Sort by PTI code
        if (a.pti.code < b.pti.code) return -1;
        if (a.pti.code > b.pti.code) return 1;
        return a.id - b.id;
      })
      .forEach(task => {
        if (!grouped.has(task.pti.id)) {
          grouped.set(task.pti.id, []);
        }
        grouped.get(task.pti.id)!.push(task);
      });

    return grouped;
  }, [filteredTasks]);

  // Pagination
  const totalPages = Math.ceil(filteredTasks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

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
      
      // Remove PTI header rows temporarily before initializing DataTable
      // DataTables requires all rows to have the same column count
      const $tbody = window.$(tableRef.current).find('tbody');
      const $headerRows = $tbody.find('.dd-meeting-title-heading');
      const headerRowsData: Array<{ element: any; taskId: string }> = [];
      
      $headerRows.each(function(this: HTMLElement) {
        const $row = window.$(this);
        // Find the first task row after this header to identify which PTI it belongs to
        const $nextTaskRow = $row.nextAll('tr:not(.dd-meeting-title-heading)').first();
        const taskId = $nextTaskRow.length > 0 ? $nextTaskRow.attr('id') || '' : '';
        
        headerRowsData.push({
          element: $row.clone(true, true),
          taskId: taskId.replace('task', '') // Extract task ID from "task123" format
        });
        $row.detach();
      });

      // Only initialize if we have data rows (excluding header rows)
      const $dataRows = $tbody.find('tr:not(.dd-meeting-title-heading)');
      if ($dataRows.length === 0) {
        // Re-insert header rows if no data
        headerRowsData.forEach(({ element }) => {
          $tbody.append(element);
        });
        return;
      }

      // Initialize DataTable with export buttons (matching old CMDMS)
      dataTableRef.current = window.$(tableRef.current).DataTable({
        paging: false, // We handle pagination manually
        ordering: true,
        searching: true,
        dom: 'Bfrtip',
        buttons: [
          {
            extend: 'excelHtml5',
            title: 'PTIs KP Tasks',
            exportOptions: {
              columns: ':visible',
              rows: function(_idx: number, _data: any, node: any) {
                // Exclude PTI header rows from export
                return !window.$(node).hasClass('dd-meeting-title-heading');
              }
            }
          },
          {
            extend: 'print',
            title: 'PTIs KP Tasks',
            exportOptions: {
              columns: ':visible',
              rows: function(_idx: number, _data: any, node: any) {
                // Exclude PTI header rows from print
                return !window.$(node).hasClass('dd-meeting-title-heading');
              }
            }
          }
        ],
        language: {
          search: '',
          searchPlaceholder: 'Search records...'
        },
        drawCallback: function() {
          // Re-insert PTI header rows after DataTable draws
          const $tbody = window.$(tableRef.current).find('tbody');
          const $dataRows = $tbody.find('tr:not(.dd-meeting-title-heading)');
          
          headerRowsData.forEach(({ element, taskId }) => {
            // Find the task row with matching ID
            const $targetRow = $dataRows.filter(`#task${taskId}`);
            if ($targetRow.length > 0) {
              // Insert header row before the first task of this PTI
              $targetRow.first().before(element);
            } else {
              // If task not found, append at the end
              $tbody.append(element);
            }
          });
          
          // Ensure PTI header rows span all columns
          window.$(tableRef.current).find('.dd-meeting-title-heading').each(function(this: HTMLElement) {
            const $row = window.$(this);
            const colCount = window.$(tableRef.current).find('thead tr').children().length;
            const $td = $row.find('td:first');
            $td.attr('colspan', colCount.toString());
            // Remove any extra cells
            $row.find('td:not(:first)').remove();
          });
        }
      });
    };
    
    Promise.all([
      loadScript('https://code.jquery.com/jquery-3.6.0.min.js'),
      loadScript('https://cdn.datatables.net/1.13.6/js/jquery.dataTables.min.js'),
      loadScript('https://cdn.datatables.net/buttons/2.4.1/js/dataTables.buttons.min.js'),
      loadScript('https://cdn.datatables.net/buttons/2.4.1/js/buttons.html5.min.js'),
      loadScript('https://cdn.datatables.net/buttons/2.4.1/js/buttons.print.min.js')
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
  }, [filteredTasks.length]);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours() % 12 || 12).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = date.getHours() >= 12 ? 'pm' : 'am';
    return `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`;
  };

  const truncateText = (html: string, maxLength: number = 150): string => {
    const stripped = html.replace(/<[^>]+>/g, '');
    if (stripped.length <= maxLength) return stripped;
    return stripped.substring(0, maxLength) + '...';
  };

  const handleStatusFilter = (status: string) => {
    const newParams = new URLSearchParams();
    if (status) newParams.set('status', status);
    setSearchParams(newParams);
    setCurrentPage(1);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const cards = [
    {
      status: '',
      borderColor: '#3282FF',
      title: 'Total',
      count: counts.total,
      percent: 0,
      icon: 'ti-list'
    },
    {
      status: DecisionStatus.COMPLETED,
      borderColor: '#0E8160',
      title: 'Completed',
      count: (counts[statusLabels[DecisionStatus.COMPLETED]] as { count: number; percent: number }).count,
      percent: (counts[statusLabels[DecisionStatus.COMPLETED]] as { count: number; percent: number }).percent,
      icon: 'ti-check'
    },
    {
      status: DecisionStatus.ON_TARGET,
      borderColor: '#1DC39F',
      title: 'On Target',
      count: (counts[statusLabels[DecisionStatus.ON_TARGET]] as { count: number; percent: number }).count,
      percent: (counts[statusLabels[DecisionStatus.ON_TARGET]] as { count: number; percent: number }).percent,
      icon: 'ti-target'
    },
    {
      status: DecisionStatus.OVERDUE,
      borderColor: '#E74039',
      title: 'Overdue',
      count: (counts[statusLabels[DecisionStatus.OVERDUE]] as { count: number; percent: number }).count,
      percent: (counts[statusLabels[DecisionStatus.OVERDUE]] as { count: number; percent: number }).percent,
      icon: 'ti-timer'
    }
  ];

  if (!departmentId) {
    return (
      <div className="content-wrapper">
        <div className="alert alert-warning">Please select a department to view PTIs tasks.</div>
      </div>
    );
  }

  return (
    <div className="content-wrapper">
      <style>
        {`
          .record-notes-custom-card-analytics {
            cursor: pointer;
            transition: transform 0.2s;
          }
          .record-notes-custom-card-analytics:hover {
            transform: translateY(-2px);
          }
          .record-notes-custom-card-analytics .icon {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 10px;
          }
          .record-notes-custom-card-analytics .icon i {
            color: white;
            font-size: 24px;
          }
          .dd-meeting-title-heading {
            background-color: #f8f9fa !important;
            font-weight: bold;
          }
          .dd-meeting-title-heading td {
            text-align: center !important;
            padding: 15px !important;
          }
          table thead {
            background: rgb(37, 136, 95) !important;
            color: white !important;
          }
          table thead th {
            background: rgb(37, 136, 95) !important;
            color: white !important;
          }
          table .btn {
            padding: 0.3rem !important;
            vertical-align: top;
          }
          table .btn i {
            margin-top: .4rem;
            margin-right: 0 !important;
          }
        `}
      </style>
      <div className="card">
        <div className="card-header text-center">
          <p className="block display-4">PRIORITY TRANSFORMATION INITIATIVES (PTI-KP)</p>
          <p className="block display-5">{user?.department?.name || ''} Department</p>
        </div>
        <div className="card-body">
          {/* Summary Cards */}
          <div className="row my-5 d-flex justify-content-center">
            {cards.map((card) => {
              const isActive = statusFilter === card.status;
              return (
                <div key={card.status || 'total'} className="col-md-2 p-2">
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handleStatusFilter(card.status);
                    }}
                    style={{ textDecoration: 'none' }}
                  >
                    <div
                      className="card record-notes-custom-card-analytics"
                      style={{
                        border: isActive ? `8px solid ${card.borderColor}` : `border-bottom: 8px solid ${card.borderColor}`
                      }}
                    >
                      <div className="card-body text-center">
                        <div className="icon" style={{ background: card.borderColor }}>
                          <i className={card.icon}></i>
                        </div>
                        <h3 className="mb-2" style={{ color: card.borderColor }}>
                          {card.count}
                        </h3>
                        <p className="mb-1">{card.title}</p>
                        <p className="mb-0 mt-2">
                          {card.percent > 0 ? `${card.percent}%` : '\u00A0'}
                        </p>
                      </div>
                    </div>
                  </a>
                </div>
              );
            })}
          </div>

          {/* Search and Export Buttons */}
          <div className="row mb-3">
            <div className="col-md-6">
              <form onSubmit={handleSearch} className="d-flex align-items-center">
                <label className="mr-2 mb-0">Search:</label>
                <input
                  type="text"
                  className="form-control"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search tasks..."
                  style={{ maxWidth: '300px' }}
                />
              </form>
            </div>
          </div>

          {/* Tasks Table */}
          <div className="row">
            <div className="col-12">
              <div className="table-responsive">
                <table
                  ref={tableRef}
                  className="table table-bordered table-condensed datatable"
                  role="grid"
                >
                  <thead style={{ background: 'rgb(37, 136, 95)', color: 'white' }}>
                    <tr>
                      <th>S.No</th>
                      <th>Task Detail</th>
                      <th>Progress</th>
                      <th>Timeline</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(() => {
                      let globalIndex = 0;
                      return Array.from(groupedTasks.entries()).map(([ptiId, ptiTasks]) => {
                        const firstTask = ptiTasks[0];
                        return (
                          <React.Fragment key={ptiId}>
                            <tr className="dd-meeting-title-heading even">
                              <td colSpan={6} className="text-center" style={{ width: '100%' }}>
                                <h4>{firstTask.pti.code} : {firstTask.pti.title}</h4>
                              </td>
                            </tr>
                            {ptiTasks.map((task) => {
                              globalIndex++;
                              const dept = task.departments?.find(d => d.id === departmentId);
                              const pivotStatus = dept?.pivot?.status || 'Pending';
                              
                              return (
                                <tr key={`${ptiId}-${task.id}`} id={`task${task.id}`}>
                                  <td>{globalIndex}</td>
                                <td className="text">
                                  <h5>{`Task#${task.id} - ${task.title}`}</h5>
                                  <div>{truncateText(task.description || '')}</div>
                                  {task.attachments && task.attachments.length > 0 && (
                                    <div className="mb-2 mt-2">
                                      <strong>Attachments:</strong>
                                      <ul className="list-arrow">
                                        {task.attachments.map((attachment, idx) => (
                                          <li key={idx}>
                                            <a href="#" onClick={(e) => {
                                              e.preventDefault();
                                              console.log('Download attachment:', attachment);
                                            }}>
                                              <i className="ti-file"></i>
                                              {attachment}
                                            </a>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                </td>
                                <td className="text">{truncateText(task.progress)}</td>
                                <td style={{ minWidth: '170px' }}>{formatDate(task.timeline)}</td>
                                <td>
                                  <span className={`badge ${statusBadgeClasses[pivotStatus] || 'badge-secondary'}`}>
                                    {pivotStatus}
                                  </span>
                                </td>
                                <td>
                                  <Link
                                    to={`/department/ptis/tasks/${task.id}/replies`}
                                    className="btn btn-info"
                                    title="Submit Response"
                                  >
                                    <i className="ti-comments"></i>
                                  </Link>
                                </td>
                              </tr>
                            );
                          })}
                        </React.Fragment>
                      );
                    });
                    })()}
                    {filteredTasks.length === 0 && (
                      <tr>
                        <td colSpan={6} className="text-center">
                          No tasks found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Pagination Footer */}
        {filteredTasks.length > 0 && (
          <div className="card-footer mt-3 border">
            <div className="row align-items-center">
              <div className="col">
                <div className="form-group mb-0 row align-items-center">
                  <label htmlFor="perPage" className="col-sm-3 col-form-label mb-0">
                    Show
                  </label>
                  <select
                    id="perPage"
                    className="form-control form-control-sm col-sm-3"
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                  >
                    {[10, 15, 25, 50, 100].map(option => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <span className="inline-block col-sm-6"> per page</span>
                </div>
              </div>
              <div className="col text-center">
                <p>
                  Showing <strong>{startIndex + 1}</strong> to{' '}
                  <strong>{Math.min(endIndex, filteredTasks.length)}</strong> of total{' '}
                  <strong>{filteredTasks.length}</strong> records.
                </p>
              </div>
              <div className="col d-flex justify-content-end">
                <nav>
                  <ul className="pagination mb-0">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
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
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ) {
                        return (
                          <li
                            key={page}
                            className={`page-item ${currentPage === page ? 'active' : ''}`}
                          >
                            <button
                              className="page-link"
                              onClick={() => setCurrentPage(page)}
                            >
                              {page}
                            </button>
                          </li>
                        );
                      } else if (page === currentPage - 2 || page === currentPage + 2) {
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
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        )}
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

