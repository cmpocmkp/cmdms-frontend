/**
 * Sectorial Agenda Point Related Departments - Admin Module
 * EXACT replica of admin/sectorialagendapoints/relateddepartments/index.blade.php from old CMDMS
 */

import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { mockAgendaPoints } from '../../../lib/mocks/data/sectorialMeetings';
import { mockSectorialMeetings } from '../../../lib/mocks/data/sectorialMeetings';

// Progress statuses from DecisionStatus enum (1: Completed, 2: On Target, 3: Overdue)
const progressStatuses = [
  { value: 1, label: 'Completed' },
  { value: 2, label: 'On Target' },
  { value: 3, label: 'Overdue' }
];

export default function SectorialAgendaPointRelatedDepartments() {
  const { id } = useParams<{ id: string }>();
  const agendaPoint = mockAgendaPoints.find(ap => ap.id === Number(id));

  const [departmentStatuses, setDepartmentStatuses] = useState<Record<number, number>>({});

  useEffect(() => {
    if (agendaPoint && agendaPoint.departments) {
      const initialStatuses: Record<number, number> = {};
      agendaPoint.departments.forEach(dept => {
        // Map status label to value (default to 2 = On Target if not found)
        const statusValue = progressStatuses.find(s => s.label === dept.status)?.value || 2;
        initialStatuses[dept.id] = statusValue;
      });
      setDepartmentStatuses(initialStatuses);
    }
  }, [agendaPoint]);

  if (!agendaPoint) {
    return (
      <div className="content-wrapper">
        <div className="alert alert-danger">Agenda Point not found</div>
      </div>
    );
  }

  const meeting = mockSectorialMeetings.find(m => m.id === agendaPoint.meeting_id);

  // Format date as 'd/m/Y'
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Update Related Departments Status:', {
      sectorial_agenda_point_id: agendaPoint.id,
      departmentStatuses
    });
    alert('Update Related Departments Status functionality will be implemented with backend API');
    // Navigate would be: navigate(`/admin/sectorialmeetings/${agendaPoint.meeting_id}/agenda-points`);
  };

  const handleStatusChange = (departmentId: number, statusValue: number) => {
    setDepartmentStatuses(prev => ({
      ...prev,
      [departmentId]: statusValue
    }));
  };

  return (
    <div className="content-wrapper">
      <style>
        {`
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
        `}
      </style>
      <div className="card">
        <div className="card-header text-center">
          <div className="d-flex gap-3 justify-content-between align-items-center">
            <div className="flex-grow-1 text-center">
              <p className="block display-4">Edit Related Departments status</p>
            </div>
            <div>
              <div className="btn-toolbar pull-right">
                <div className="btn-group">
                  <Link
                    to={`/admin/sectorialmeetings/${agendaPoint.meeting_id}/agenda-points`}
                    className="btn btn-outline-primary btn-fw"
                    title="Back to Agenda Points"
                    style={{ float: 'right' }}
                  >
                    <i className="ti-arrow-left mr-1"></i>Back
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-12">
              {meeting && (
                <>
                  <p>
                    <strong className="text-success">Meeting Subject: </strong>
                    <strong>{meeting.subject}</strong>
                  </p>
                  <p>
                    <strong className="text-success">Agenda Item: </strong>
                    <strong>
                      <div dangerouslySetInnerHTML={{ __html: agendaPoint.item }} />
                    </strong>
                  </p>
                  <p>
                    <strong className="text-success">Date: </strong>
                    {formatDate(meeting.date)}
                  </p>
                </>
              )}
            </div>
          </div>
          <hr />
          <form
            className="form-sample"
            onSubmit={handleSubmit}
            encType="multipart/form-data"
            id="add_sectorial_agenda_point_form"
          >
            <p className="card-description">
              <input type="hidden" name="sectorial_agenda_point_id" value={agendaPoint.id} />
            </p>
            <div className="row">
              <div className="col-md-4">
                <div className="form-group">
                  <h4 className="text-primary">Departments</h4>
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-group">
                  <h4 className="text-primary">Status</h4>
                </div>
              </div>
            </div>

            {agendaPoint.departments.map((department) => (
              <div className="row" key={department.id}>
                <div className="col-md-4">
                  <div className="form-group">
                    <h6>{department.name}</h6>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <select
                      id={`update_related_department_status${department.id}`}
                      name={`departmentStatuses[${department.id}]`}
                      style={{ width: '300px' }}
                      className="minute_department_status_class js-example-basic-multiple w-100 form-control form-control-lg"
                      required
                      value={departmentStatuses[department.id] || 2}
                      onChange={(e) => handleStatusChange(department.id, Number(e.target.value))}
                    >
                      {progressStatuses.map((status) => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            ))}

            <div className="row">
              <div className="col-md-4"></div>
              <div className="col-md-4">
                <button type="submit" className="btn btn-success pull-right">
                  Update
                </button>
              </div>
              <div className="col-md-4"></div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
