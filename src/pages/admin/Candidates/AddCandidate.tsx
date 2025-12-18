/**
 * Add Candidate - Admin Module
 * Placeholder component - to be fully implemented
 */

import { Link } from 'react-router-dom';

export default function AddCandidate() {
  return (
    <div className="content-wrapper">
      <div className="card">
        <div className="card-body">
          <Link to="/admin/candidates" style={{ float: 'right' }}>
            Show Candidates
          </Link>
          <h4 className="card-title text-primary">Add candidate</h4>
          <p>Form implementation in progress...</p>
        </div>
      </div>
    </div>
  );
}
