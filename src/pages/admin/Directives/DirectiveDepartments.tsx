/**
 * Directive Related Departments - Admin Module
 * EXACT replica of admin/directives/directive_departments.blade.php
 * Features: Update status and remarks for each responsible department
 */

import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { mockDirectives } from '../../../lib/mocks/data/directives';

export default function DirectiveDepartments() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [directive, setDirective] = useState<any>(null);
  const [expandedDepts, setExpandedDepts] = useState<number[]>([]);
  const [departmentStatuses, setDepartmentStatuses] = useState<Record<number, string>>({});
  const [departmentRemarks, setDepartmentRemarks] = useState<Record<number, string>>({});

  useEffect(() => {
    const foundDirective = mockDirectives.find(d => d.id === parseInt(id || '0'));
    if (foundDirective) {
      setDirective(foundDirective);
      
      // Initialize statuses and remarks
      if (foundDirective.departments) {
        const statuses: Record<number, string> = {};
        const remarks: Record<number, string> = {};
        foundDirective.departments.forEach((dept: any) => {
          statuses[dept.id] = dept.status || '';
          remarks[dept.id] = dept.remarks || '';
        });
        setDepartmentStatuses(statuses);
        setDepartmentRemarks(remarks);
      }
    } else {
      alert('Directive not found');
      navigate('/admin/directives');
    }
  }, [id, navigate]);

  const toggleDepartment = (deptId: number) => {
    setExpandedDepts(prev =>
      prev.includes(deptId) ? prev.filter(id => id !== deptId) : [...prev, deptId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Update departments:', { departmentStatuses, departmentRemarks });
    alert('Departments updated successfully! (Backend integration pending)');
  };

  if (!directive) {
    return (
      <div className="content-wrapper">
        <div className="card">
          <div className="card-body text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="sr-only">Loading...</span>
            </div>
            <p className="mt-3">Loading directive...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="content-wrapper">
      <style>{`
        table#directive-listing td p {
          width: 100px !important;
        }
        table#directive-listing {
          width: 100% !important;
        }
        table#directive-listing td div p {
          width: 100px !important;
        }
        table#directive-listing th {
          padding: 10px !important;
        }
      `}</style>

      <div className="card">
        <div className="card-body">
          {/* Header with Back Button */}
          <div className="row">
            <div className="col-md-12">
              <div style={{ marginBottom: '10px' }} className="btn-toolbar pull-right">
                <div className="btn-group pull-right">
                  <Link
                    to="/admin/directives"
                    title="Back to directives list"
                    className="btn btn-sm btn-inverse-dark btn-fw"
                  >
                    <i className="ti-arrow-left text-primary mr-1"></i>Back
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Directive Details */}
          <div className="row">
            <div className="col-md-12">
              <div className="table-responsive mt-2">
                <table className="table table-bordered table-striped w-100 mb-0">
                  <tbody>
                    <tr>
                      <th>Subject</th>
                      <td><strong>{directive.subject}</strong></td>
                    </tr>
                    <tr>
                      <th>Date</th>
                      <td>{new Date(directive.date).toLocaleDateString('en-GB')}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <hr />

          {/* Department Headers */}
          <div className="row">
            <div className="col-md-2">
              <div className="form-group">
                <h4 className="text-primary">Departments</h4>
              </div>
            </div>
            <div className="col-md-3">
              <div className="form-group">
                <h4 className="text-primary">Status</h4>
              </div>
            </div>
            <div className="col-md-7">
              <div className="form-group">
                <h4 className="text-primary">Remarks</h4>
              </div>
            </div>
          </div>

          {/* Form to Update Departments */}
          <form className="form-sample" onSubmit={handleSubmit}>
            {directive.departments && directive.departments.map((dept: any) => (
              <div key={dept.id}>
                {/* Department Row */}
                <div className="row">
                  <div className="col-md-2">
                    <div className="form-group">
                      <span
                        className="toggle-btn"
                        style={{ cursor: 'pointer' }}
                        onClick={() => toggleDepartment(dept.id)}
                      >
                        <h6>
                          {expandedDepts.includes(dept.id) ? '-' : '+'} {dept.name}
                        </h6>
                      </span>
                      <input type="hidden" name="directive_departments_id[]" value={dept.id} />
                    </div>
                  </div>

                  <div className="col-md-3 px-1">
                    <div className="form-group">
                      <select
                        name={`departmentStatuses[${dept.id}]`}
                        className="minute_department_status_class js-example-basic-multiple w-100 form-control form-control-lg"
                        required
                        value={departmentStatuses[dept.id] || ''}
                        onChange={(e) => setDepartmentStatuses({
                          ...departmentStatuses,
                          [dept.id]: e.target.value
                        })}
                      >
                        <option value="">Please Select Status</option>
                        <option value="1">Completed</option>
                        <option value="2">On Target</option>
                        <option value="3">Overdue</option>
                        <option value="4">Off Target</option>
                        <option value="7">Ongoing</option>
                      </select>
                    </div>
                  </div>

                  <div className="col-md-7">
                    <div className="form-group">
                      <textarea
                        className="form-control"
                        name={`departmentStatusesInput[${dept.id}]`}
                        rows={4}
                        value={departmentRemarks[dept.id] || ''}
                        onChange={(e) => setDepartmentRemarks({
                          ...departmentRemarks,
                          [dept.id]: e.target.value
                        })}
                      />
                    </div>
                  </div>
                </div>

                {/* Collapsible Replies Section */}
                {expandedDepts.includes(dept.id) && (
                  <div className="row collapse show mb-5">
                    <div className="col-md-12 replies-section">
                      <div className="card">
                        <div className="card-body">
                          <h5>Replies for {dept.name}</h5>
                          {dept.replies && dept.replies.length > 0 ? (
                            <ul className="list-group">
                              {dept.replies.map((reply: any, idx: number) => (
                                <li key={idx} className="list-group-item">
                                  <strong>Reply Detail:</strong> {reply.reply_detail}<br />
                                  {reply.attachments && reply.attachments.length > 0 && (
                                    <>
                                      <strong>Attachments:</strong>{' '}
                                      {reply.attachments.map((_: string, fIdx: number) => (
                                        <a key={fIdx} href="#" target="_blank" className="mr-2">
                                          View Attachment {fIdx + 1}
                                        </a>
                                      ))}
                                      <br />
                                    </>
                                  )}
                                  <strong>Status:</strong> {reply.status || 'N/A'}<br />
                                  <strong>Remarks:</strong> {reply.remarks || '-'}<br />
                                  {reply.overdue_reason && (
                                    <>
                                      <strong>Overdue Reason:</strong> {reply.overdue_reason}<br />
                                    </>
                                  )}
                                  <small>Posted on: {new Date(reply.created_at).toLocaleString('en-GB')}</small>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p>No replies available.</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            <div className="row">
              <div className="col-md-7 margin-auto">
                <button type="submit" className="btn btn-success pull-right">Update</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
