/**
 * Candidates List - Admin Module
 * EXACT replica of admin/candidates/index.blade.php from old CMDMS
 */

import { Link } from 'react-router-dom';
import { mockCandidatesDetailed } from '../../../lib/mocks/data/candidates';

export default function CandidatesList() {
  return (
    <div className="content-wrapper">
      <div className="card">
        <div className="card-body">
          <Link to="/admin/candidates/add" style={{ float: 'right' }}>
            Add candidate
          </Link>
          <h4 className="card-title text-primary">Candidates</h4>

          <div className="row">
            <div className="col-12">
              <div className="table-responsive">
                <table id="record-note-listing" className="table table-striped" role="grid">
                  <thead>
                    <tr>
                      <th>S.No</th>
                      <th>Candidate<br/> Name</th>
                      <th>District<br/> Name</th>
                      <th>Party</th>
                      <th>Constituency</th>
                      <th>Position</th>
                      <th>Area</th>
                      <th>Division</th>
                      <th>Phone</th>
                      <th>Mobile</th>
                      <th>Email</th>
                      <th>Nic</th>
                      <th>Address</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockCandidatesDetailed.length > 0 ? (
                      mockCandidatesDetailed.map((candidate) => (
                        <tr key={candidate.id}>
                          <td>{candidate.id}</td>
                          <td>{candidate.name || ''}</td>
                          <td>{candidate.district_name || ''}</td>
                          <td>{candidate.party_name || ''}</td>
                          <td>{candidate.constituency_name || ''}</td>
                          <td>{candidate.position || ''}</td>
                          <td>{candidate.area || ''}</td>
                          <td>{candidate.division || ''}</td>
                          <td>{candidate.phone || ''}</td>
                          <td>{candidate.mobile || ''}</td>
                          <td>{candidate.email || ''}</td>
                          <td>{candidate.nic || ''}</td>
                          <td>
                            <div dangerouslySetInnerHTML={{ __html: candidate.address || '' }} />
                          </td>
                          <td>
                            <Link
                              to={`/admin/candidates/edit/${candidate.id}`}
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
                                  console.log('Delete candidate:', candidate.id);
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
                      ))
                    ) : (
                      <tr>
                        <td style={{ textAlign: 'center' }} colSpan={14}>There is no data in table</td>
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
