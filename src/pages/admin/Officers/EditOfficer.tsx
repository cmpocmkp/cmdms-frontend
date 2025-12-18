/**
 * Edit Officer - Admin Module
 * Placeholder component - to be fully implemented
 */

import { Link, useParams } from 'react-router-dom';

export default function EditOfficer() {
  const { id } = useParams<{ id: string }>();
  return (
    <div className="content-wrapper">
      <div className="card">
        <div className="card-body">
          <Link to="/admin/officers" style={{ float: 'right' }}>
            Show Officers
          </Link>
          <h4 className="card-title text-primary">Edit officer</h4>
          <p>Form implementation in progress... (ID: {id})</p>
        </div>
      </div>
    </div>
  );
}
