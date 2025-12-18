/**
 * Officers List - Admin Module
 * EXACT replica of admin/officers/index.blade.php from old CMDMS
 */

import { Link } from 'react-router-dom';
import { mockOfficers } from '../../../lib/mocks/data/officers';
import { mockOfficerDepartments } from '../../../lib/mocks/data/officerDepartments';

// Format date as 'd-m-Y'
const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

export default function OfficersList() {
  return (
    <div className="content-wrapper">
      <div className="card">
        <div className="card-body">
          <Link to="/admin/officers/add" style={{ float: 'right' }}>
            Add officer
          </Link>
          <h4 className="card-title text-primary">Officers</h4>

          <div className="row">
            <div className="col-12">
              <div className="table-responsive">
                <table id="record-note-listing" className="table table-striped" role="grid">
                  <thead>
                    <tr>
                      <th>S.No</th>
                      <th>Officer <br/> Name</th>
                      <th>Designation</th>
                      <th>Department</th>
                      <th>Scale(BPS)</th>
                      <th>Joining Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockOfficers.length > 0 ? (
                      mockOfficers.map((officer) => {
                        const department = mockOfficerDepartments.find(d => d.id === officer.officer_department_id);
                        return (
                          <tr key={officer.id}>
                            <td>{officer.id}</td>
                            <td>{officer.name || ''}</td>
                            <td>{officer.designation}</td>
                            <td>{department?.name || 'N/A'}</td>
                            <td>
                              <span title="Current Scale">{officer.scale}</span>
                            </td>
                            <td>{formatDate(officer.joining_date || '')}</td>
                            <td>
                              <Link
                                to={`/admin/officers/edit/${officer.id}`}
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
                                    console.log('Delete officer:', officer.id);
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
                        <td style={{ textAlign: 'center' }} colSpan={7}>There is no data in table</td>
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
