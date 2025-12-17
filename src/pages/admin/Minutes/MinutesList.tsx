/**
 * Minutes List - Admin Module
 * EXACT replica of admin/recordnotes/index.blade.php from old CMDMS
 */

import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { mockMinutes } from '../../../lib/mocks/data/minutes';
import { mockAdminDepartments } from '../../../lib/mocks/data/adminDepartments';

export default function MinutesList() {
  const [meetings] = useState(mockMinutes);
  const [departmentFilter, setDepartmentFilter] = useState<string>('');
  const departments = mockAdminDepartments;

  const filteredMeetings = useMemo(() => {
    if (!departmentFilter) return meetings;
    return meetings.filter(meeting => 
      meeting.departments.includes(parseInt(departmentFilter))
    );
  }, [meetings, departmentFilter]);

  return (
    <div className="content-wrapper">
      <div className="card">
        <div className="card-header text-center">
          <div className="d-flex gap-3 justify-content-between align-items-center">
            <div className="flex-grow-1 text-center">
              <p className="block display-4">Minutes Meetings</p>
            </div>
            <div>
              <div className="btn-toolbar pull-right">
                <div className="btn-group">
                  <Link 
                    to="/admin/recordnotes/add" 
                    className="btn btn-outline-primary btn-fw" 
                    role="button"
                  >
                    <i className="ti-plus mr-1"></i>Add Minutes
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="card-body">
          {/* Department Filter */}
          <div className="row mb-3">
            <div className="col-md-4">
              <form method="GET">
                <div className="form-group">
                  <label htmlFor="department_filter">Filter by Department:</label>
                  <select 
                    name="department_filter" 
                    id="department_filter" 
                    className="form-control"
                    value={departmentFilter}
                    onChange={(e) => setDepartmentFilter(e.target.value)}
                  >
                    <option value="">All Departments</option>
                    {departments.map(dept => (
                      <option key={dept.id} value={dept.id}>{dept.name}</option>
                    ))}
                  </select>
                </div>
              </form>
            </div>
          </div>

          <div className="row">
            <div className="col-12">
              <div className="table-responsive">
                <table id="record-note-listing" className="table table-striped table-bordered" role="grid">
                  <thead>
                    <tr>
                      <th>Meeting Date</th>
                      <th>Timestamp/Identifier</th>
                      <th>Subject</th>
                      <th>Departments</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMeetings.length > 0 ? (
                      filteredMeetings.map(meeting => (
                        <tr key={meeting.id}>
                          <td>{new Date(meeting.meeting_date).toLocaleDateString('en-GB')}</td>
                          <td>
                            Created at: <span className="text-muted">{new Date(meeting.created_at).toLocaleDateString('en-GB')}</span>
                            <br /><br />
                            Created by: <span className="text-muted">{meeting.created_by}</span>
                            <br /><br />
                            Updated at: <span className="text-muted">{new Date(meeting.updated_at).toLocaleDateString('en-GB')}</span>
                            <br /><br />
                            Last Updated by: <span className="text-muted">{meeting.updated_by}</span>
                          </td>
                          <td style={{ whiteSpace: 'pre-wrap' }}>{meeting.subject}</td>
                          <td style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
                            {meeting.departments_names && meeting.departments_names.length > 0 ? (
                              <ul>
                                {meeting.departments_names.map((deptName, idx) => (
                                  <li key={idx}>{deptName}</li>
                                ))}
                              </ul>
                            ) : (
                              <p>-</p>
                            )}
                          </td>
                          <td className="text-center">
                            <Link
                              to={`/admin/recordnotes/edit/${meeting.id}`}
                              className="btn btn-sm btn-info mb-2 mx-2"
                              style={{ width: '45px' }}
                              title="Show all decisions"
                            >
                              <i className="ti-eye"></i>
                            </Link>

                            {meeting.decisions_count > 0 && (
                              <Link
                                to={`/admin/recordnotes/edit/${meeting.id}`}
                                className="btn btn-sm btn-primary mb-2 mx-2"
                                style={{ width: '45px' }}
                                title="View minutes"
                              >
                                <i className="ti-pencil-alt"></i>
                              </Link>
                            )}

                            <button
                              onClick={() => {
                                if (confirm('Are you sure you want to delete?')) {
                                  console.log('Delete minute:', meeting.id);
                                  alert('Delete functionality will be implemented with backend API');
                                }
                              }}
                              style={{ width: '45px' }}
                              className="btn btn-sm btn-danger mb-2 mx-2"
                            >
                              <i className="ti-trash icon-sm"></i>
                            </button>
                          </td>
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
