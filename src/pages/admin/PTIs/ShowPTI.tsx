/**
 * Show PTI Detail - Admin Module
 * EXACT replica of admin/ptis/show.blade.php from old CMDMS
 */

import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { mockPTIs } from '../../../lib/mocks/data/ptis';
import { formatDistanceToNow } from 'date-fns';
import { TaskModals } from '../../../components/ptis/TaskModals';

export default function ShowPTI() {
  const { id } = useParams<{ id: string }>();
  const pti = mockPTIs.find(p => p.id === Number(id));

  // Modal states
  const [showAddTask, setShowAddTask] = useState(false);
  const [showEditTask, setShowEditTask] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [showEditDepartments, setShowEditDepartments] = useState(false);
  const [editingDepartmentsTaskId, setEditingDepartmentsTaskId] = useState<number | null>(null);

  if (!pti) {
    return (
      <div className="content-wrapper">
        <div className="alert alert-danger">PTI not found</div>
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
              <p className="block display-4">Priority Transformation Initiatives KP</p>
            </div>
            <div>
              <div className="btn-toolbar pull-right">
                <div className="btn-group">
                  <Link 
                    to="/admin/ptis" 
                    className="btn btn-outline-primary btn-fw"
                  >
                    <i className="ti-arrow-left mr-1"></i> Back to Initiatives
                  </Link>
                  <Link 
                    to={`/admin/ptis/edit/${pti.id}`} 
                    className="btn btn-outline-primary btn-fw"
                  >
                    <i className="ti-pencil-alt mr-1"></i> Edit PTI
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="card-body">
          <div className="card-title">
            <p className="display-5 text-dark mb-3">{pti.code} : {pti.title}</p>
          </div>
          <div className="mb-2">
            {pti.description && (
              <>
                <strong>Description:</strong>
                <div dangerouslySetInnerHTML={{ __html: pti.description }}></div>
              </>
            )}
          </div>

          <div className="row border-top">
            <div className="col">
              <ul className="nav profile-navbar d-flex justify-content-end">
                <li className="nav-item">
                  <a className="nav-link" href="#">
                    <i className="fa fa-clock text-primary"></i>
                    <span className="text-secondary inline-block mt-2">
                      Updated {formatDistanceToNow(new Date(pti.updated_at), { addSuffix: true })}
                    </span>
                  </a>
                </li>
                {pti.creator?.name && (
                  <li className="nav-item">
                    <a className="nav-link" href="#">
                      <i className="fa fa-user-circle" style={{ color: '#248afd' }}></i>
                      {pti.creator.name}
                    </a>
                  </li>
                )}
                {pti.creator?.phone && (
                  <li className="nav-item">
                    <a className="nav-link active" href="#">
                      <i className="fa fa-phone-square"></i>
                      {pti.creator.phone}
                    </a>
                  </li>
                )}
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
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pti.tasks && pti.tasks.length > 0 ? (
                      pti.tasks.map((task, index) => (
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
                            <table className="table table-bordered mb-0">
                              <tbody>
                                {task.departments.map(dept => (
                                  <tr key={dept.id}>
                                    <td
                                      style={{
                                        width: '60%',
                                        color: '#495057',
                                        backgroundColor: '#e9ecef',
                                        borderColor: '#c9ccd7'
                                      }}
                                    >
                                      {dept.name}
                                    </td>
                                    <td style={{ width: '40%' }}>
                                      {dept.pivot.status && (
                                        <label className={`badge ${getStatusBadgeClass(dept.pivot.status)} badge-pill`}>
                                          {dept.pivot.status}
                                        </label>
                                      )}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
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
                          <td style={{ textAlign: '-webkit-center' }}>
                            <button
                              className="btn btn-sm btn-primary mt-2"
                              title="Edit Task"
                              onClick={() => handleEditTask(task.id)}
                            >
                              <i className="ti-pencil-alt"></i>
                            </button>
                            <Link
                              to={`/admin/tasks/${task.id}/comments`}
                              className="btn btn-info mt-2"
                              title="View chat history"
                            >
                              <i className="ti-comments mr-1"></i>
                            </Link>
                            <button
                              className="btn btn-success mt-2"
                              onClick={() => handleEditDepartments(task.id)}
                              title="Edit Departments"
                            >
                              <i className="ti-link"></i>
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="text-center text-muted">
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
        ptiId={pti.id}
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
