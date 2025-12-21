/**
 * Task Show/Print Page
 * EXACT replica of admin/tasks/show.blade.php
 */

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

interface Task {
  id: number;
  title: string;
  description: string;
  progress: string;
  status: {
    value: number;
    label: string;
    badgeClass: string;
  };
  timeline: string;
  created_at: string;
  attachments: Array<{
    id: number;
    file_path: string;
    file_title: string;
  }>;
  departments: Array<{
    id: number;
    name: string;
    pivot: {
      status: {
        value: number;
        label: string;
        badgeClass: string;
      };
    };
    latestComment?: {
      status: {
        value: number;
        label: string;
        badgeClass: string;
      };
    };
  }>;
  taskable: {
    id: number;
    getTaskableTitle: () => string;
    getTaskableLabel: () => string;
    getTaskReturnUrl: () => string;
  };
}

export default function TaskShow() {
  const { taskId } = useParams<{ taskId: string }>();
  const [loading, setLoading] = useState(true);
  const [task, setTask] = useState<Task | null>(null);

  useEffect(() => {
    // TODO: Replace with actual API call
    // const fetchData = async () => {
    //   try {
    //     const response = await api.get(`/admin/tasks/${taskId}`);
    //     setTask(response.data.task);
    //   } catch (error) {
    //     console.error('Error fetching task:', error);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchData();

    // Dummy data for now
    const dummyTask: Task = {
      id: Number(taskId) || 1,
      title: 'Sample Task',
      description: '<p>This is a sample task description.</p>',
      progress: '<p>Task is in progress.</p>',
      status: {
        value: 2,
        label: 'On Target',
        badgeClass: 'badge-warning',
      },
      timeline: new Date().toISOString(),
      created_at: new Date().toISOString(),
      attachments: [],
      departments: [
        {
          id: 1,
          name: 'Health Department',
          pivot: {
            status: {
              value: 2,
              label: 'On Target',
              badgeClass: 'badge-warning',
            },
          },
        },
      ],
      taskable: {
        id: 1,
        getTaskableTitle: () => 'Sample Summary Title',
        getTaskableLabel: () => 'Summary',
        getTaskReturnUrl: () => '/admin/summaries/show/1',
      },
    };

    setTask(dummyTask);
    setLoading(false);
  }, [taskId]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return <div className="text-center p-5">Loading...</div>;
  }

  if (!task) {
    return <div className="text-center p-5">Task not found</div>;
  }

  const returnUrl = task.taskable.getTaskReturnUrl();

  return (
    <div className="content-wrapper">
      <style>{`
        @media print {
          .no-print {
            display: none !important;
          }
        }
      `}</style>
      <div className="row">
        <div className="col">
          <div className="card">
            <div className="card-header text-center">
              <div className="d-flex gap-3 justify-content-between align-items-center">
                <div className="flex-grow-1 text-center">
                  <p className="block display-4">Task Details</p>
                </div>
                {returnUrl && (
                  <div>
                    <div className="btn-toolbar pull-right">
                      <div className="btn-group">
                        <Link
                          to={`${returnUrl}#row${task.id}`}
                          className="btn btn-outline-primary btn-fw"
                        >
                          <i className="ti-arrow-left mr-1"></i>Back to {task.taskable.getTaskableLabel() || 'Parent'}
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="card-body">
              <div className="card">
                <div className="card-body" id="print-body">
                  <div className="">
                    <div className="no-print text-right">
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        title="Print Task"
                        onClick={handlePrint}
                        type="button"
                      >
                        <i className="ti-printer"></i>
                      </button>
                    </div>
                    <div className="mb-3 text-center">
                      <h3>{task.taskable.getTaskableTitle()}</h3>
                    </div>

                    <div>
                      <h4>1. Task Details</h4>
                      <blockquote className="blockquote blockquote-primary">
                        <header className="blockquote-header">
                          <strong>Title: </strong>{task.title}
                        </header>
                        <p className="mt-2">
                          <strong>Description: </strong>
                          <span dangerouslySetInnerHTML={{ __html: task.description }} />
                        </p>
                        <p>
                          <strong>Status: </strong>
                          <span className={`badge ${task.status.badgeClass}`}>{task.status.label}</span>
                        </p>
                        <p>
                          <strong>Timeline:</strong> {new Date(task.timeline).toLocaleString()}
                        </p>
                        <p>
                          <strong>Created:</strong> {new Date(task.created_at).toLocaleString()}
                        </p>
                        {task.attachments && task.attachments.length > 0 && (
                          <div className="mb-2">
                            <p><strong>Attachments: </strong></p>
                            <ul className="list-arrow">
                              {task.attachments.map((attachment) => (
                                <li key={attachment.id}>
                                  <a href={`/storage/${attachment.file_path}`} target="_blank" rel="noopener noreferrer">
                                    <i className="ti-file"></i>
                                    {attachment.file_title}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </blockquote>
                    </div>

                    {task.progress && (
                      <div className="mt-2">
                        <blockquote className="blockquote blockquote-primary">
                          <header className="blockquote-header">
                            <strong>Progress: </strong>
                          </header>
                          <p dangerouslySetInnerHTML={{ __html: task.progress }} />
                        </blockquote>
                      </div>
                    )}
                  </div>

                  <div className="mt-2">
                    <h4>2. Assigned Departments</h4>
                    <table className="table table-bordered table-sm">
                      <thead className="thead-light">
                        <tr>
                          <th>Department</th>
                          <th>Dept. Status</th>
                          <th>CM Status</th>
                          <th>CM Remarks</th>
                        </tr>
                      </thead>
                      <tbody>
                        {task.departments.map((dept) => (
                          <tr key={dept.id}>
                            <td>{dept.name}</td>
                            <td>
                              {dept.latestComment && (
                                <span className={`badge ${dept.latestComment.status.badgeClass}`}>
                                  {dept.latestComment.status.label}
                                </span>
                              )}
                            </td>
                            <td>
                              <span className={`badge ${dept.pivot.status.badgeClass}`}>
                                {dept.pivot.status.label}
                              </span>
                            </td>
                            <td>-</td>
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
      </div>
    </div>
  );
}
