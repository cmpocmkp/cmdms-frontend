/**
 * Add Officer - Admin Module
 * Placeholder component - to be fully implemented
 */

import { Link } from 'react-router-dom';

export default function AddOfficer() {
  return (
    <div className="content-wrapper">
      <div className="card">
        <div className="card-body">
          <Link to="/admin/officers" style={{ float: 'right' }}>
            Show Officers
          </Link>
          <h4 className="card-title text-primary">Add officer</h4>
          <p>Form implementation in progress...</p>
        </div>
      </div>
    </div>
  );
}
