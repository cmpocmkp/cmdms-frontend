/**
 * Add Khushhal KPK Task - Admin Module
 * Placeholder component - to be fully implemented
 */

import { Link } from 'react-router-dom';

export default function AddKhushhalKPK() {
  return (
    <div className="content-wrapper">
      <div className="card">
        <div className="card-body">
          <Link to="/admin/khushhalkpk" style={{ float: 'right' }}>
            Show Khushhal KPK Tasks
          </Link>
          <h4 className="card-title text-primary">Add Task</h4>
          <p>Form implementation in progress...</p>
        </div>
      </div>
    </div>
  );
}
