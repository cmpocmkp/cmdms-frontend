/**
 * Officer Departments List - Admin Module
 * EXACT replica of admin/officerdepartments/index.blade.php from old CMDMS
 */

import { Link } from 'react-router-dom';
import { mockOfficerDepartments } from '../../../lib/mocks/data/officerDepartments';

export default function OfficerDepartmentsList() {
  return (
    <div className="content-wrapper">
      <div className="card">
        <div className="card-body">
          <Link to="/admin/officerdepartments/add" style={{ float: 'right' }}>
            Add officer department
          </Link>
          <h4 className="card-title text-primary">Officer Departments</h4>

          <div className="row">
            <div className="col-12">
              <div className="table-responsive">
                <table id="record-note-listing" className="table table-striped" role="grid">
                  <thead>
                    <tr>
                      <th>S.No</th>
                      <th>Department Name</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockOfficerDepartments.length > 0 ? (
                      mockOfficerDepartments.map((department) => (
                        <tr key={department.id}>
                          <td>{department.id}</td>
                          <td>{department.name || ''}</td>
                          <td>
                            <Link
                              to={`/admin/officerdepartments/edit/${department.id}`}
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
                                  console.log('Delete officer department:', department.id);
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
                        <td style={{ textAlign: 'center' }} colSpan={3}>There is no data in table</td>
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
