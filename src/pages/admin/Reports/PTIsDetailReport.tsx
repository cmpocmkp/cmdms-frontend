/**
 * PTIs KP Detail Report - Admin Module
 * EXACT replica of admin/report/ptis/detail.blade.php from old CMDMS
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { mockPTIs, Task } from '../../../lib/mocks/data/ptis';
import { mockAdminDepartments } from '../../../lib/mocks/data/adminDepartments';

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

interface SummaryData {
  total: number;
  [key: string]: number | { count: number; percent: number };
}

export default function PTIsDetailReport() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<TaskWithPTI[]>([]);
  const [summary, setSummary] = useState<SummaryData>({
    total: 0,
    [statusLabels[DecisionStatus.COMPLETED]]: { count: 0, percent: 0 },
    [statusLabels[DecisionStatus.ON_TARGET]]: { count: 0, percent: 0 },
    [statusLabels[DecisionStatus.OVERDUE]]: { count: 0, percent: 0 },
    [statusLabels[DecisionStatus.OFF_TARGET]]: { count: 0, percent: 0 }
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  // Note: DataTables not initialized for this report table

  const searchTerm = searchParams.get('search') || '';
  const statusFilter = searchParams.get('status') || '';
  const departmentId = searchParams.get('department_id') || '';
  const selectedDepartment = departmentId 
    ? mockAdminDepartments.find(d => d.id.toString() === departmentId)
    : null;

  // Check if filter is applied
  const isFilterApplied = !!(searchTerm || departmentId || statusFilter);

  useEffect(() => {
    setIsFilterExpanded(isFilterApplied);
  }, [isFilterApplied]);

  // Generate tasks from PTIs
  useEffect(() => {
    const generateTasks = (): TaskWithPTI[] => {
      const allTasks: TaskWithPTI[] = [];

      mockPTIs.forEach(pti => {
        pti.tasks?.forEach(task => {
          allTasks.push({
            ...task,
            pti: {
              id: pti.id,
              code: pti.code,
              title: pti.title
            }
          });
        });
      });

      return allTasks;
    };

    setTasks(generateTasks());
    setLoading(false);
  }, []);

  // Filter tasks
  const filteredTasks = useMemo(() => {
    let filtered = tasks;

    // Filter by department
    if (departmentId) {
      filtered = filtered.filter(task =>
        task.departments?.some(dept => dept.id.toString() === departmentId)
      );
    }

    // Filter by status
    if (statusFilter) {
      filtered = filtered.filter(task => {
        if (departmentId) {
          const dept = task.departments?.find(d => d.id.toString() === departmentId);
          return dept?.pivot?.status === statusLabels[statusFilter];
        }
        return task.departments?.some(dept => 
          dept.pivot?.status === statusLabels[statusFilter]
        );
      });
    }

    // Filter by search term
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(search) ||
        task.description.toLowerCase().includes(search)
      );
    }

    return filtered;
  }, [tasks, departmentId, statusFilter, searchTerm]);

  // Calculate summary
  useEffect(() => {
    const total = filteredTasks.length;
    const counts: Record<string, number> = {
      [statusLabels[DecisionStatus.COMPLETED]]: 0,
      [statusLabels[DecisionStatus.ON_TARGET]]: 0,
      [statusLabels[DecisionStatus.OVERDUE]]: 0,
      [statusLabels[DecisionStatus.OFF_TARGET]]: 0
    };

    filteredTasks.forEach(task => {
      const dept = departmentId 
        ? task.departments?.find(d => d.id.toString() === departmentId)
        : task.departments?.[0];
      
      if (dept?.pivot?.status) {
        const status = dept.pivot.status;
        if (counts.hasOwnProperty(status)) {
          counts[status]++;
        }
      }
    });

    const summaryData: SummaryData = {
      total,
      [statusLabels[DecisionStatus.COMPLETED]]: {
        count: counts[statusLabels[DecisionStatus.COMPLETED]],
        percent: total > 0 ? Math.round((counts[statusLabels[DecisionStatus.COMPLETED]] / total) * 100) : 0
      },
      [statusLabels[DecisionStatus.ON_TARGET]]: {
        count: counts[statusLabels[DecisionStatus.ON_TARGET]],
        percent: total > 0 ? Math.round((counts[statusLabels[DecisionStatus.ON_TARGET]] / total) * 100) : 0
      },
      [statusLabels[DecisionStatus.OFF_TARGET]]: {
        count: counts[statusLabels[DecisionStatus.OFF_TARGET]],
        percent: total > 0 ? Math.round((counts[statusLabels[DecisionStatus.OFF_TARGET]] / total) * 100) : 0
      },
      [statusLabels[DecisionStatus.OVERDUE]]: {
        count: counts[statusLabels[DecisionStatus.OVERDUE]],
        percent: total > 0 ? Math.round((counts[statusLabels[DecisionStatus.OVERDUE]] / total) * 100) : 0
      }
    };

    setSummary(summaryData);
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

  const handleFilter = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const search = formData.get('search') as string;
    const status = formData.get('status') as string;
    const deptId = formData.get('department_id') as string;

    const newParams = new URLSearchParams();
    if (search) newParams.set('search', search);
    if (status) newParams.set('status', status);
    if (deptId) newParams.set('department_id', deptId);

    setSearchParams(newParams);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSearchParams({});
    setCurrentPage(1);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = date.getHours() >= 12 ? 'pm' : 'am';
    return `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`;
  };

  const truncateText = (html: string, maxLength: number = 150): string => {
    const stripped = html.replace(/<[^>]+>/g, '');
    if (stripped.length <= maxLength) return stripped;
    return stripped.substring(0, maxLength) + '...';
  };

  if (loading) {
    return <div className="text-center p-5">Loading...</div>;
  }

  const cards = [
    {
      status: '',
      borderColor: '#3282FF',
      title: 'Total',
      count: summary.total,
      percent: 0,
      icon: 'ti-list'
    },
    {
      status: DecisionStatus.COMPLETED,
      borderColor: '#0E8160',
      title: 'Completed',
      count: (summary[statusLabels[DecisionStatus.COMPLETED]] as { count: number; percent: number }).count,
      percent: (summary[statusLabels[DecisionStatus.COMPLETED]] as { count: number; percent: number }).percent,
      icon: 'ti-check'
    },
    {
      status: DecisionStatus.ON_TARGET,
      borderColor: '#1DC39F',
      title: 'On Target',
      count: (summary[statusLabels[DecisionStatus.ON_TARGET]] as { count: number; percent: number }).count,
      percent: (summary[statusLabels[DecisionStatus.ON_TARGET]] as { count: number; percent: number }).percent,
      icon: 'ti-target'
    },
    {
      status: DecisionStatus.OFF_TARGET,
      borderColor: '#E74039',
      title: 'Off Target',
      count: (summary[statusLabels[DecisionStatus.OFF_TARGET]] as { count: number; percent: number }).count,
      percent: (summary[statusLabels[DecisionStatus.OFF_TARGET]] as { count: number; percent: number }).percent,
      icon: 'ti-alert'
    },
    {
      status: DecisionStatus.OVERDUE,
      borderColor: '#FD7E01',
      title: 'Overdue',
      count: (summary[statusLabels[DecisionStatus.OVERDUE]] as { count: number; percent: number }).count,
      percent: (summary[statusLabels[DecisionStatus.OVERDUE]] as { count: number; percent: number }).percent,
      icon: 'ti-timer'
    }
  ];

  const progressStatuses = [
    DecisionStatus.COMPLETED,
    DecisionStatus.ON_TARGET,
    DecisionStatus.OFF_TARGET,
    DecisionStatus.OVERDUE
  ];

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
          .timeline-cell {
            width: 30px;
            font-weight: bold;
            text-align: center;
          }
          .action-buttons {
            white-space: nowrap;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
          }
          .action-buttons .btn {
            padding: 0.25rem 0.5rem;
            font-size: 0.875rem;
            margin: 2px 0;
          }
        `}
      </style>
      <div className="card">
        <div className="card-header text-center">
          <div className="d-flex gap-3 justify-content-between align-items-center">
            <div className="flex-grow-1 text-center">
              <p className="block display-4">
                PTIs KP - Detail Report
                {selectedDepartment && (
                  <>
                    <br />
                    <strong>{selectedDepartment.name} Department</strong>
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
        <div className="card-body">
          {/* Summary Cards */}
          <div className="row my-5 d-flex justify-content-center">
            {cards.map((card) => {
              const isActive = statusFilter === card.status;
              return (
                <div key={card.status || 'total'} className="col-md-2 p-2">
                  <Link
                    to={`/admin/report/ptis/detail?status=${card.status}&department_id=${departmentId}`}
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
                  </Link>
                </div>
              );
            })}
          </div>

          {/* Filter Card */}
          <div className="row justify-content-center">
            <div className="col-md-8">
              <div className="card mb-3">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <span>Filter Meetings</span>
                  <button
                    type="button"
                    className="btn"
                    onClick={() => setIsFilterExpanded(!isFilterExpanded)}
                    style={{ cursor: 'pointer' }}
                  >
                    <i className={`fas ${isFilterExpanded ? 'fa-minus' : 'fa-plus'}`}></i>
                  </button>
                </div>
                {isFilterExpanded && (
                  <div className="card-body">
                    <form onSubmit={handleFilter}>
                      <div className="row">
                        <div className="col-md-12">
                          <div className="form-group">
                            <label>Task Title</label>
                            <input
                              type="text"
                              name="search"
                              className="form-control"
                              placeholder="Search minute title..."
                              defaultValue={searchTerm}
                            />
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div className="form-group">
                            <label>Task Status</label>
                            <select
                              name="status"
                              className="form-control form-control-lg"
                              defaultValue={statusFilter}
                            >
                              <option value="">Select status</option>
                              {progressStatuses.map(status => (
                                <option key={status} value={status}>
                                  {statusLabels[status]}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div className="form-group">
                            <label>Department</label>
                            <select
                              name="department_id"
                              className="form-control form-control-lg"
                              defaultValue={departmentId}
                            >
                              <option value="">All Departments</option>
                              {mockAdminDepartments.slice(0, 20).map(dept => (
                                <option key={dept.id} value={dept.id.toString()}>
                                  {dept.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                      <button type="submit" className="btn btn-primary">
                        Search
                      </button>
                      <button
                        type="button"
                        onClick={handleClearFilters}
                        className="btn btn-secondary ml-2"
                      >
                        Clear Filters
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tasks Table */}
          <div className="row">
            <div className="col">
              <div className="card mt-3">
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-bordered datatable">
                      <thead>
                        <tr className="thead-light">
                          <th>S.No</th>
                          <th>Details</th>
                          <th>Progress</th>
                          {selectedDepartment ? <th>Status</th> : <th>Responsibility</th>}
                          <th>Timeline</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Array.from(groupedTasks.entries()).map(([ptiId, ptiTasks]) => {
                          const firstTask = ptiTasks[0];
                          return (
                            <React.Fragment key={ptiId}>
                              <tr className="thead-light">
                                <td colSpan={6} className="text-center" style={{ width: '100%' }}>
                                  <Link
                                    to={`/admin/ptis/${ptiId}`}
                                    className="lead text-info font-weight-bold"
                                  >
                                    {firstTask.pti.code} : {firstTask.pti.title}
                                  </Link>
                                </td>
                              </tr>
                              {ptiTasks.map((task, taskIndex) => {
                                const dept = selectedDepartment
                                  ? task.departments?.find(d => d.id.toString() === departmentId)
                                  : task.departments?.[0];
                                const pivotStatus = dept?.pivot?.status || 'Pending';
                                
                                return (
                                  <tr key={`${ptiId}-${task.id}`}>
                                    <td>{taskIndex + 1}</td>
                                    <td>
                                      <h5>
                                        <Link
                                          to={`/admin/ptis/${ptiId}#row${task.id}`}
                                        >
                                          {`Task#${task.id} - ${task.title}`}
                                        </Link>
                                      </h5>
                                      <div>{truncateText(task.description)}</div>
                                    </td>
                                    <td>{truncateText(task.progress)}</td>
                                    <td>
                                      {selectedDepartment ? (
                                        <span className={`badge ${statusBadgeClasses[pivotStatus] || 'badge-secondary'}`}>
                                          {pivotStatus}
                                        </span>
                                      ) : (
                                        <table className="table table-bordered mb-0">
                                          <tbody>
                                            {task.departments && task.departments.length > 0 ? (
                                              task.departments.map(dept => (
                                                <tr key={dept.id}>
                                                  <td style={{
                                                    width: '60%',
                                                    color: '#495057 !important',
                                                    backgroundColor: '#e9ecef !important',
                                                    borderColor: '#c9ccd7 !important'
                                                  }}>
                                                    {dept.name}
                                                  </td>
                                                  <td style={{ width: '40%' }}>
                                                    <span className={`badge ${statusBadgeClasses[dept.pivot?.status || 'Pending'] || 'badge-secondary'}`}>
                                                      {dept.pivot?.status || 'Pending'}
                                                    </span>
                                                  </td>
                                                </tr>
                                              ))
                                            ) : (
                                              <tr>
                                                <td colSpan={2} className="text-center">
                                                  No departments assigned
                                                </td>
                                              </tr>
                                            )}
                                          </tbody>
                                        </table>
                                      )}
                                    </td>
                                    <td style={{ minWidth: '170px' }} className="timeline-cell">
                                      {formatDate(task.timeline)}
                                    </td>
                                    <td className="action-buttons">
                                      <Link
                                        to={`/admin/tasks/${task.id}/comments`}
                                        className="btn btn-info btn-sm"
                                        target="_blank"
                                        title="View chat history"
                                      >
                                        <i className="ti-comments"></i>
                                      </Link>
                                    </td>
                                  </tr>
                                );
                              })}
                            </React.Fragment>
                          );
                        })}
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

                {/* Pagination Footer */}
                {totalPages > 1 && (
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

