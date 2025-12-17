/**
 * Responsible Departments Modal - Update department statuses
 * EXACT replica of announcement-update-modal-departments from old CMDMS
 */

import { useState, useEffect } from 'react';

interface Department {
  id: number;
  name: string;
  progress: string;
  status: string;
}

interface ResponsibleDepartmentsModalProps {
  detailId: number;
  departments: Department[];
  onClose: () => void;
  onSave: () => void;
}

export function ResponsibleDepartmentsModal({
  detailId,
  departments,
  onClose,
  onSave
}: ResponsibleDepartmentsModalProps) {
  const [formData, setFormData] = useState<Record<number, { progress: string; status: string }>>({});

  useEffect(() => {
    // Initialize form data with current department values
    const initialData: Record<number, { progress: string; status: string }> = {};
    departments.forEach((dept) => {
      initialData[dept.id] = {
        progress: dept.progress || '',
        status: dept.status || ''
      };
    });
    setFormData(initialData);
  }, [departments]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Update department statuses:', { detail_id: detailId, ...formData });
    onSave();
  };

  const updateDepartment = (deptId: number, field: 'progress' | 'status', value: string) => {
    setFormData((prev) => ({
      ...prev,
      [deptId]: {
        ...prev[deptId],
        [field]: value
      }
    }));
  };

  // Status options matching old CMDMS DecisionStatus enum
  const statusOptions = [
    { value: 'on_target', label: 'On Target' },
    { value: 'completed', label: 'Completed' },
    { value: 'off_target', label: 'Off Target' },
    { value: 'overdue', label: 'Overdue' },
    { value: 'can_not_completed', label: 'Cannot be Completed' }
  ];

  return (
    <div
      className="modal fade show"
      id="announcement-update-modal-departments"
      tabIndex={-1}
      role="dialog"
      style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
    >
      <div className="modal-dialog modal-lg" role="document">
        <div className="modal-content" style={{ backgroundColor: '#fff' }}>
          <div className="modal-header" style={{ padding: '15px 27px' }}>
            <h5 className="modal-title">Update Responsible Departments</h5>
            <button type="button" className="close" onClick={onClose} aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>

          <form
            method="post"
            id="announcement-detail-department-update-form"
            onSubmit={handleSubmit}
            encType="multipart/form-data"
          >
            <input type="hidden" name="announcement_detail_id" value={detailId} />
            <input type="hidden" name="statusesarray" value="{}" />

            <div className="modal-body" style={{ padding: '10px 26px' }}>
              <div id="display-department-minute-form_date">
                {/* Header Row */}
                <div className="row">
                  <div className="col-md-3">
                    <div className="form-group">
                      <h4>Departments</h4>
                    </div>
                  </div>
                  <div className="col-md-7">
                    <div className="form-group">
                      <h4>Progress So far</h4>
                    </div>
                  </div>
                  <div className="col-md-2">
                    <div className="form-group">
                      <h4>Status</h4>
                    </div>
                  </div>
                </div>

                {/* Department Rows */}
                {departments.map((dept) => (
                  <div className="row" key={dept.id}>
                    <div className="col-md-3">
                      <div className="form-group">
                        <h6>{dept.name}</h6>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <textarea
                          className="form-control"
                          id={`progressrelated_${dept.id}`}
                          name={`progress[${dept.id}]`}
                          rows={4}
                          value={formData[dept.id]?.progress || ''}
                          onChange={(e) => updateDepartment(dept.id, 'progress', e.target.value)}
                        ></textarea>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="form-group">
                        <select
                          id={`update_related_department_status_${dept.id}`}
                          name={`status[${dept.id}]`}
                          style={{ width: '100%' }}
                          className="minute_department_status_class js-example-basic-multiple w-100 form-control form-control-lg"
                          required
                          data-department-id={dept.id}
                          value={formData[dept.id]?.status || ''}
                          onChange={(e) => updateDepartment(dept.id, 'status', e.target.value)}
                        >
                          {statusOptions.map((status) => (
                            <option key={status.value} value={status.value}>
                              {status.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="modal-footer">
              <input
                id="announcementdepartmentupdatebutton"
                type="submit"
                value="Save Changes"
                name="announcementdepartmentupdatebutton"
                className="btn btn-primary btn-icon-text"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
