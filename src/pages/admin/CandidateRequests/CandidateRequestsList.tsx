/**
 * Candidate Requests List (MNA/MPA Requests) - Admin Module
 * EXACT replica of admin/candidaterequests/index.blade.php from old CMDMS
 */

import { Link } from 'react-router-dom';
import { mockCandidateRequests, candidateRequestStatuses } from '../../../lib/mocks/data/candidateRequests';
import { mockOfficers } from '../../../lib/mocks/data/officers';
import { mockCandidates } from '../../../lib/mocks/data/annualSchemes';
import { mockOfficerDepartments } from '../../../lib/mocks/data/officerDepartments';

// Format date as 'd-m-Y'
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

export default function CandidateRequestsList() {
  return (
    <div className="content-wrapper">
      <div className="card">
        <div className="card-body">
          <Link to="/admin/candidaterequests/add" className="btn btn-primary mb-1" style={{ float: 'right' }}>
            Add candidate request
          </Link>
          <h4 className="card-title text-primary">Candidate's Requests</h4>

          <div className="row">
            <div className="col-12">
              <div className="table-responsive">
                <table id="record-note-listing" className="table table-striped" role="grid">
                  <thead style={{ background: 'rgb(37, 136, 95)', color: 'white' }}>
                    <tr>
                      <th>S.No</th>
                      <th>Officer <br /> Name</th>
                      <th>Current <br />Designation</th>
                      <th>Proposed <br />Designation</th>
                      <th>Current <br />Department</th>
                      <th>Proposed <br />Department</th>
                      <th>Current/Proposed <br />Scale(BPS)</th>
                      <th>Recomended <br />By</th>
                      <th>Request<br />Date</th>
                      <th>Remarks</th>
                      <th>Status</th>
                      <th>Approved <br />Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockCandidateRequests.length > 0 ? (
                      mockCandidateRequests.map((request) => {
                        const officer = mockOfficers.find(o => o.id === request.officer_id);
                        const candidate = mockCandidates.find(c => c.id === request.candidate_id);
                        const currentDept = mockOfficerDepartments.find(d => d.id === request.current_department);
                        const proposedDept = mockOfficerDepartments.find(d => d.id === request.proposed_department);
                        
                        return (
                          <tr key={request.id}>
                            <td>{request.id}</td>
                            <td>{officer?.name || 'N/A'}</td>
                            <td>{request.current_designation}</td>
                            <td>{request.proposed_designation}</td>
                            <td>{currentDept?.name || 'N/A'}</td>
                            <td>{proposedDept?.name || 'N/A'}</td>
                            <td>
                              <span title="Current Scale">{request.current_scale}</span>
                              {' - '}
                              <span title="Proposed Scale">{request.proposed_scale}</span>
                            </td>
                            <td>{candidate?.name || 'N/A'}</td>
                            <td>{formatDate(request.date)}</td>
                            <td style={{ whiteSpace: 'pre-wrap' }}>
                              <div dangerouslySetInnerHTML={{ __html: request.remarks }} />
                            </td>
                            <td>{candidateRequestStatuses[request.status] || request.status}</td>
                            <td>{request.approved_date ? formatDate(request.approved_date) : ''}</td>
                            <td>
                              <Link
                                to={`/admin/candidaterequests/edit/${request.id}`}
                                style={{ float: 'left', marginLeft: '20px' }}
                                className="text-primary mr-2 mb-2"
                              >
                                <i className="ti-pencil-alt icon-sm"></i>
                              </Link>
                              <form
                                action="#"
                                method="post"
                                style={{ float: 'left', marginLeft: '20px' }}
                                onSubmit={(e) => {
                                  e.preventDefault();
                                  if (confirm('Are you sure to delete?')) {
                                    console.log('Delete candidate request:', request.id);
                                    alert('Delete functionality will be implemented with backend API');
                                  }
                                }}
                              >
                                <button
                                  type="submit"
                                  className="btn btn-danger btn-icon-text"
                                  title="delete"
                                >
                                  <i className="ti-trash icon-sm"></i>
                                </button>
                              </form>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td style={{ textAlign: 'center' }} colSpan={13}>There is no data in table</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
