/**
 * Update Responsible Departments Modal Component
 * Updates status of responsible departments for a decision
 */

import { useState, useEffect } from 'react';

interface UpdateDepartmentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  decision: any;
  onSubmit: (data: any) => void;
}

export function UpdateDepartmentsModal({ isOpen, onClose, decision, onSubmit }: UpdateDepartmentsModalProps) {
  const [departmentStatuses, setDepartmentStatuses] = useState<Record<number, string>>({});

  useEffect(() => {
    if (decision && decision.responsible_departments) {
      const statuses: Record<number, string> = {};
      decision.responsible_departments.forEach((dept: any) => {
        statuses[dept.id] = dept.status || '';
      });
      setDepartmentStatuses(statuses);
    }
  }, [decision]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(departmentStatuses);
    onClose();
  };

  const handleStatusChange = (deptId: number, status: string) => {
    setDepartmentStatuses({
      ...departmentStatuses,
      [deptId]: status
    });
  };

  if (!isOpen || !decision || !decision.responsible_departments) return null;

  return (
    <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex={-1}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content" style={{ backgroundColor: '#fff' }}>
          <div className="modal-header" style={{ padding: '15px 27px' }}>
            <h5 className="modal-title">Update Responsible Departments Detail</h5>
            <button type="button" className="close" onClick={onClose}>
              <span>&times;</span>
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body" style={{ padding: '10px 26px' }}>
              <div className="row">
                <div className="col-md-12">
                  <div className="minute_update_message" style={{ display: 'none' }}>
                    <label className="badge badge-success">Responsible department's detail updated successfully.</label>
                  </div>
                </div>
              </div>

              {/* Dynamic Department Status Forms */}
              <div className="row">
                <div className="col-md-12">
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>Department</th>
                        <th>Current Status</th>
                        <th>Update Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {decision.responsible_departments.map((dept: any) => (
                        <tr key={dept.id}>
                          <td>{dept.name}</td>
                          <td>
                            <span className={`badge ${
                              dept.status === 'Completed' ? 'badge-success' :
                              dept.status === 'On Target' ? 'badge-warning' :
                              dept.status === 'Overdue' ? 'badge-danger' :
                              dept.status === 'Off Target' ? 'badge-info' :
                              'badge-secondary'
                            }`}>
                              {dept.status}
                            </span>
                          </td>
                          <td>
                            <select
                              className="form-control"
                              value={departmentStatuses[dept.id] || dept.status}
                              onChange={(e) => handleStatusChange(dept.id, e.target.value)}
                            >
                              <option value="">Select Status</option>
                              <option value="Completed">Completed</option>
                              <option value="On Target">On Target</option>
                              <option value="Overdue">Overdue</option>
                              <option value="Off Target">Off Target</option>
                              <option value="Ongoing">Ongoing</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <div className="row">
                <div className="col-md-12">
                  <div className="minute_update_message" style={{ display: 'none' }}>
                    <label className="badge badge-success">Responsible department's detail updated successfully.</label>
                  </div>
                </div>
              </div>
              <input
                type="submit"
                value="Update"
                className="btn btn-primary btn-icon-text"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
