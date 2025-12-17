/**
 * Show Summary Detail - Admin Module
 * EXACT replica of admin/summaries/show.blade.php from old CMDMS
 */

import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { mockSummaries } from '../../../lib/mocks/data/summaries';
import { formatDistanceToNow } from 'date-fns';
import { TaskModals } from '../../../components/ptis/TaskModals';

export default function ShowSummary() {
  const { id } = useParams<{ id: string }>();
  const summary = mockSummaries.find(s => s.id === Number(id));

  // Modal states
  const [showAddTask, setShowAddTask] = useState(false);
  const [showEditTask, setShowEditTask] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [showEditDepartments, setShowEditDepartments] = useState(false);
  const [editingDepartmentsTaskId, setEditingDepartmentsTaskId] = useState<number | null>(null);

  if (!summary) {
    return (
      <div className="content-wrapper">
        <div className="alert alert-danger">Summary not found</div>
      </div>
    );
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'badge-success';
      case 'In Progress':
        return 'badge-warning';
      case 'On Target':
        return 'badge-info';
      case 'Overdue':
        return 'badge-danger';
      case 'Pending':
        return 'badge-secondary';
      default:
        return 'badge-secondary';
    }
  };

  const handleAddTask = () => {
    setShowAddTask(true);
  };

  const handleEditTask = (taskId: number) => {
    setEditingTaskId(taskId);
    setShowEditTask(true);
  };

  const handleEditDepartments = (taskId: number) => {
    setEditingDepartmentsTaskId(taskId);
    setShowEditDepartments(true);
  };

  const handlePrintTask = (taskId: number) => {
    // Open print page in new tab
    window.open(`/admin/tasks/${taskId}`, '_blank');
  };

  return (
    <div className="content-wrapper">
      <style>
        {`
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
          <div className="d-flex gap-3 justify-content-between align-items-center">
            <div className="flex-grow-1 text-center">
              <p className="block display-4">Summaries for CM</p>
            </div>
            <div>
              <div className="btn-toolbar pull-right">
                <div className="btn-group">
                  <Link 
                    to="/admin/summaries" 
                    className="btn btn-outline-primary btn-fw"
                  >
                    <i className="ti-arrow-left mr-1"></i> Back to Summaries
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="card-body">
          {/* Summary Details */}
          <div className="card-title">
            <p className="display-5 text-dark mb-3"><strong>Subject:</strong> {summary.subject}</p>
          </div>
          <div className="mb-2">
            <strong>Reference number:</strong> {summary.reference_number}
          </div>
          <div className="mb-2">
            <strong>Department:</strong> {summary.initiator_department_name}
          </div>
          <div className="mb-2">
            <strong>Created Date:</strong>{' '}
            {new Date(summary.created_date).toLocaleString('en-GB', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              hour12: true
            })}
          </div>

          {/* Attachments */}
          {summary.attachments && summary.attachments.length > 0 && (
            <div className="mb-2">
              <strong>Attachments: </strong>
              <ol className="mt-2 pl-2 list-arrow">
                {summary.attachments.map((attachment) => (
                  <li key={attachment.id}>
                    <a href="#" target="_blank">
                      <i className="fa fa-file"></i> {attachment.file_title}
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Creator Info Bar */}
          <div className="row border-top">
            <div className="col">
              <ul className="nav profile-navbar d-flex justify-content-end">
                <li className="nav-item">
                  <a className="nav-link" href="#">
                    <i className="fa fa-clock text-primary"></i>
                    <span className="text-secondary inline-block mt-2">
                      Updated {formatDistanceToNow(new Date(summary.updated_at), { addSuffix: true })}
                    </span>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Tasks Card */}
          <div className="card mb-4 mt-4">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Tasks</h5>
              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={handleAddTask}
              >
                + Add Task
              </button>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-striped table-bordered mb-0">
                  <thead className="thead-light">
                    <tr>
                      <th>S.No</th>
                      <th>Task Detail</th>
                      <th>Progress</th>
                      <th>Resp. Departments</th>
                      <th>Timeline</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {summary.tasks && summary.tasks.length > 0 ? (
                      summary.tasks.map((task, index) => (
                        <tr key={task.id} id={`row${task.id}`}>
                          <td>{index + 1}</td>
                          <td className="text">
                            <h4>Task#{task.id} - {task.title}</h4>
                            <div dangerouslySetInnerHTML={{ __html: task.description }}></div>
                          </td>
                          <td className="text">
                            <div dangerouslySetInnerHTML={{ __html: task.progress }}></div>
                          </td>
                          <td style={{ minWidth: '150px' }}>
                            <ul className="list-arrow">
                              {task.departments.map(dept => (
                                <li key={dept.id}>{dept.name}</li>
                              ))}
                            </ul>
                          </td>
                          <td style={{ minWidth: '170px' }}>
                            {new Date(task.timeline).toLocaleString('en-GB', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                              hour12: true
                            })}
                          </td>
                          <td>
                            <span className={`badge ${getStatusBadgeClass(task.status)}`}>
                              {task.status}
                            </span>
                          </td>
                          <td style={{ textAlign: '-webkit-center' }}>
                            <button
                              className="btn btn-sm btn-primary mt-2"
                              title="Edit Task"
                              onClick={() => handleEditTask(task.id)}
                            >
                              <i className="ti-pencil-alt"></i>
                            </button>
                            <button
                              className="btn btn-success mt-2"
                              onClick={() => handleEditDepartments(task.id)}
                              title="Edit Departments"
                            >
                              <i className="ti-link"></i>
                            </button>
                            <Link
                              to={`/admin/tasks/${task.id}/comments`}
                              className="btn btn-info mt-2"
                              title="View chat history"
                            >
                              <i className="ti-comments mr-1"></i>
                            </Link>
                            <button
                              className="btn btn-info mt-2"
                              onClick={() => handlePrintTask(task.id)}
                              title="Print Task"
                            >
                              <i className="ti-printer"></i>
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="text-center text-muted">
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
      </div>

      {/* Task Modals */}
      <TaskModals
        ptiId={summary.id}
        showAddTask={showAddTask}
        setShowAddTask={setShowAddTask}
        showEditTask={showEditTask}
        setShowEditTask={setShowEditTask}
        editingTaskId={editingTaskId}
        showEditDepartments={showEditDepartments}
        setShowEditDepartments={setShowEditDepartments}
        editingDepartmentsTaskId={editingDepartmentsTaskId}
      />
    </div>
  );
}
