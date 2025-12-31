/**
 * Edit CM Remark Departments - Admin Module
 * EXACT replica of admin/cmremarks/relateddepartments/edit.blade.php from old CMDMS
 */

import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { mockCMRemarks } from '../../../lib/mocks/data/cmRemarks';

// sectorialStatuses from old CMDMS
const sectorialStatuses: Record<string, string> = {
  '2': 'On Target',
  '1': 'Completed',
  '3': 'Overdue',
  '4': 'Off Target',
  '6': 'Overdue Other Reason',
  '7': 'Ongoing',
  '9': 'Off Target Reason'
};

// badgesWithStatus mapping
const getBadgeClass = (status: string | number) => {
  const statusStr = typeof status === 'number' ? String(status) : status;
  const badgesWithStatus: Record<string, string> = {
    "Completed": "success",
    "On Target": "warning",
    "Overdue": "danger",
    "Off Target": "info",
    "Ongoing": "ongoing",
    "Overdue Other Reason": "indigo",
    "Off Target Reason": "lightred"
  };
    return badgesWithStatus[statusStr] || "secondary";
  };

export default function EditCMRemarkDepartments() {
  const { id } = useParams<{ id: string }>();
  const cmRemark = mockCMRemarks.find(r => r.id === Number(id));

  const [departmentRemarks, setDepartmentRemarks] = useState<Record<number, string>>({});
  const [departmentStatuses, setDepartmentStatuses] = useState<Record<number, string>>({});

  useEffect(() => {
    if (cmRemark) {
      const remarks: Record<number, string> = {};
      const statuses: Record<number, string> = {};
      
      cmRemark.departments.forEach(dept => {
        remarks[dept.id] = '';
        statuses[dept.id] = dept.status ? (typeof dept.status === 'number' ? String(dept.status) : dept.status) : '';
      });
      
      setDepartmentRemarks(remarks);
      setDepartmentStatuses(statuses);
    }
  }, [cmRemark]);

  if (!cmRemark) {
    return (
      <div className="content-wrapper">
        <div className="alert alert-danger">CM Remark not found</div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Update Department Remarks/Status:', {
      cmremark_id: cmRemark.id,
      departments: Object.keys(departmentRemarks).map(deptId => ({
        id: parseInt(deptId.toString()),
        remarks: departmentRemarks[parseInt(deptId.toString())],
        status: departmentStatuses[parseInt(deptId.toString())]
      }))
    });
    alert('Update Department Remarks/Status functionality will be implemented with backend API');
    // Navigate would be: navigate('/admin/cmremarks');
  };

  const calculateDaysRemaining = () => {
    const dueDate = new Date(cmRemark.timeline);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysRemaining = calculateDaysRemaining();

  const getDaysRemainingText = () => {
    if (daysRemaining > 1) {
      return `${daysRemaining} days remaining`;
    } else if (daysRemaining === 1) {
      return '1 day remaining';
    } else if (daysRemaining === 0) {
      return 'Today is the last day';
    } else {
      return `${Math.abs(daysRemaining)} ${Math.abs(daysRemaining) === 1 ? 'day' : 'days'} overdue`;
    }
  };

  const getDaysRemainingColor = () => {
    if (daysRemaining > 0) return 'green';
    if (daysRemaining === 0) return 'orange';
    return 'red';
  };

  return (
    <div className="content-wrapper">
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <div className="btn-group pull-right">
                <Link to="/admin/cmremarks" className="btn btn-sm btn-inverse-dark btn-fw" style={{ float: 'right' }}>
                  <i className="ti-arrow-left text-primary mr-1"></i>Back
                </Link>
              </div>
              <h4>CM Remark: {cmRemark.subject}</h4>
              <p><strong>Section:</strong> {cmRemark.section_name}</p>
              <p><strong>Letter #:</strong> {cmRemark.letter_number}</p>
              <p><strong>Issue Date:</strong> {new Date(cmRemark.issue_date).toLocaleDateString('en-GB')}</p>
              <p><strong>Timeline:</strong> {new Date(cmRemark.timeline).toLocaleDateString('en-GB')}</p>
              <p>
                <label className={`badge badge-${getBadgeClass(cmRemark.status)} badge-pill`}>
                  {cmRemark.status ?? ""}
                </label>
              </p>
              {(['Overdue', 'On Target'].includes(typeof cmRemark.status === 'number' ? String(cmRemark.status) : cmRemark.status)) && (
                <span className="fw-bold" style={{ color: getDaysRemainingColor() }}>
                  ({getDaysRemainingText()})
                </span>
              )}

              <form onSubmit={handleSubmit}>
                {cmRemark.departments.map((department) => (
                  <div key={department.id} className="card mb-3 mt-3">
                    <div className="card-header font-weight-bold">
                      {department.name}
                    </div>
                    <div className="card-body">
                      <div className="row align-items-center">
                        <div className="col-md-8">
                          <label htmlFor={`remarks_${department.id}`} className="form-label">Remarks</label>
                          <input
                            type="text"
                            id={`remarks_${department.id}`}
                            name={`departments[${department.id}][remarks]`}
                            value={departmentRemarks[department.id] || ''}
                            onChange={(e) => setDepartmentRemarks({
                              ...departmentRemarks,
                              [department.id]: e.target.value
                            })}
                            className="form-control"
                            placeholder="Enter remarks"
                          />
                        </div>
                        <div className="col-md-4">
                          <label htmlFor={`status_${department.id}`} className="form-label">Status</label>
                          <select
                            id={`status_${department.id}`}
                            name={`departments[${department.id}][status]`}
                            className="form-control"
                            value={departmentStatuses[department.id] || ''}
                            onChange={(e) => setDepartmentStatuses({
                              ...departmentStatuses,
                              [department.id]: e.target.value
                            })}
                          >
                            <option value="">-- Select Status --</option>
                            {Object.entries(sectorialStatuses).map(([key, label]) => (
                              <option key={key} value={key}>
                                {label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <button type="submit" className="btn btn-primary mt-4 pull-right">
                  Update Department Remarks/Status
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
