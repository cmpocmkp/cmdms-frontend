/**
 * Edit Officer Department - Admin Module
 * Placeholder component - to be fully implemented
 */

import { Link, useParams } from 'react-router-dom';

export default function EditOfficerDepartment() {
  const { id } = useParams<{ id: string }>();
  return (
    <div className="content-wrapper">
      <div className="card">
        <div className="card-body">
          <Link to="/admin/officerdepartments" style={{ float: 'right' }}>
            Show Officer Departments
          </Link>
          <h4 className="card-title text-primary">Edit officer department</h4>
          <p>Form implementation in progress... (ID: {id})</p>
        </div>
      </div>
    </div>
  );
}
