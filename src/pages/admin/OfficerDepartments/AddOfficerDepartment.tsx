/**
 * Add Officer Department - Admin Module
 * Placeholder component - to be fully implemented
 */

import { Link } from 'react-router-dom';

export default function AddOfficerDepartment() {
  return (
    <div className="content-wrapper">
      <div className="card">
        <div className="card-body">
          <Link to="/admin/officerdepartments" style={{ float: 'right' }}>
            Show Officer Departments
          </Link>
          <h4 className="card-title text-primary">Add officer department</h4>
          <p>Form implementation in progress...</p>
        </div>
      </div>
    </div>
  );
}
