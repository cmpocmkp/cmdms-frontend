/**
 * Khushhal Khyber Pakhtunkhwa List - Admin Module
 * EXACT replica of admin/khushhalkpk/index.blade.php from old CMDMS
 */

import { Link } from 'react-router-dom';
import { mockKhushhalKPKTasks, khushhalStatuses } from '../../../lib/mocks/data/khushhalKPK';
import { mockAdminDepartments } from '../../../lib/mocks/data/adminDepartments';

// Format date as 'd/m/Y'
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export default function KhushhalKPKList() {
  return (
    <div className="content-wrapper">
      <style>
        {`
          #directive-listing td {
            border: 1px solid silver !important;
            vertical-align: top !important;
            font-size: 16px !important;
          }
          #directive-listing td ul li {
            font-size: 16px !important;
          }
          #directive-listing th {
            border: 1px solid silver !important;
            text-align: center !important;
            height: 35px;
          }
        `}
      </style>
      <div className="card">
        <div className="card-body">
          <Link to="/admin/khushhalkpk/add" style={{ float: 'right' }}>
            Add Task
          </Link>
          <h4 className="card-title text-primary">Khushhal Khyber Pakhtunkhwa</h4>
          <div className="row">
            <div className="col-12">
              <div className="table-responsive">
                <table id="directive-listing" className="table-striped" style={{ width: '100%' }}>
                  <thead>
                    <tr>
                      <th style={{ width: '5px' }}>S.No</th>
                      <th style={{ width: '100px' }}>Subject Task</th>
                      <th style={{ width: '100px' }}>Action By</th>
                      <th style={{ width: '100px' }}>Progress</th>
                      <th style={{ width: '100px' }}>Timeline</th>
                      <th style={{ width: '100px' }}>Expected outcomes</th>
                      <th style={{ width: '85px' }}>Status</th>
                      <th style={{ width: '100px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockKhushhalKPKTasks.length > 0 ? (
                      mockKhushhalKPKTasks.map((task) => {
                        const departments = mockAdminDepartments.filter(d => 
                          task.departments.includes(d.id)
                        );
                        return (
                          <tr key={task.id}>
                            <td style={{ width: '5px' }}>{task.id}</td>
                            <td style={{ width: '100px' }}>
                              <div dangerouslySetInnerHTML={{ __html: task.subject_tasks || '' }} />
                              {task.attachments && task.attachments.length > 0 && (
                                <div>
                                  {task.attachments.map((_, idx) => (
                                    <span key={idx} style={{ marginRight: '5px' }}>
                                      <a href="#" title="click to download attach file">
                                        <i className="ti-file"></i>
                                      </a>
                                    </span>
                                  ))}
                                </div>
                              )}
                            </td>
                            <td style={{ width: '100px' }}>
                              {departments.map((dept, idx) => (
                                <div key={dept.id}>
                                  {dept.name}
                                  {idx < departments.length - 1 && <br />}
                                </div>
                              ))}
                              <br/><br/>
                              <div dangerouslySetInnerHTML={{ __html: task.action_by_note || '' }} />
                            </td>
                            <td style={{ width: '100px' }}>
                              <div dangerouslySetInnerHTML={{ __html: task.progress_so_far || '' }} />
                            </td>
                            <td style={{ width: '100px' }}>
                              {formatDate(task.timeline_date)}
                              <br/><br/>
                              <div dangerouslySetInnerHTML={{ __html: task.timeline_note || '' }} />
                            </td>
                            <td style={{ width: '100px' }}>
                              <div dangerouslySetInnerHTML={{ __html: task.expected_outcomes || '' }} />
                            </td>
                            <td style={{ width: '85px' }}>
                              {departments.map((dept, idx) => (
                                <div key={dept.id}>
                                  {dept.name}
                                  <label className="badge badge-info badge-pill">
                                    {khushhalStatuses['2'] || 'Nill'}
                                  </label>
                                  {idx < departments.length - 1 && <br />}
                                </div>
                              ))}
                            </td>
                            <td style={{ width: '100px' }}>
                              <Link
                                to={`/admin/khushhalkpk/edit/${task.id}`}
                                style={{ float: 'left', marginLeft: '10px' }}
                                className="text-primary mr-2"
                                title="edit"
                              >
                                <i className="ti-pencil-alt icon-sm"></i>
                              </Link>
                              <form
                                action="#"
                                method="post"
                                style={{ float: 'left', marginLeft: '10px' }}
                                onSubmit={(e) => {
                                  e.preventDefault();
                                  if (confirm('Are you sure to delete? This action can not be undone.')) {
                                    console.log('Delete Khushhal KPK task:', task.id);
                                    alert('Delete functionality will be implemented with backend API');
                                  }
                                }}
                              >
                                <button
                                  type="submit"
                                  className="btn btn-danger btn-icon-text"
                                  title="delete"
                                >
                                  <i className="ti-trash icon-sm"></i>
                                </button>
                              </form>
                              <Link
                                to={`/admin/khushhalkpk/show/${task.id}`}
                                style={{ padding: '0.3rem 1rem', margin: '5px', display: 'block' }}
                                className="btn btn-primary btn-sm active"
                                role="button"
                              >
                                Add Weekly/Monthly progress
                              </Link>
                              <Link
                                to={`/admin/replies/khushhalkpk/${task.id}`}
                                style={{ padding: '0.3rem 1rem', margin: '5px', display: 'block' }}
                                className="btn btn-warning btn-sm active"
                                role="button"
                              >
                                Departments Replies
                              </Link>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={8}>There is no data.</td>
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
