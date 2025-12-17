/**
 * Inaugurations List - Admin Module
 * EXACT replica of admin/inaugrations/index.blade.php from old CMDMS
 */

import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { mockInaugurations } from '../../../lib/mocks/data/inaugurations';

export default function InaugurationsList() {
  const [inaugurations] = useState(mockInaugurations);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const filteredInaugurations = useMemo(() => {
    if (!searchTerm) return inaugurations;
    
    return inaugurations.filter(inauguration =>
      inauguration.project_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inauguration.department_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inauguration.district_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [inaugurations, searchTerm]);

  const totalPages = Math.ceil(filteredInaugurations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedInaugurations = filteredInaugurations.slice(startIndex, endIndex);

  return (
    <div className="content-wrapper">
      <div className="card">
        <div className="card-body">
          <Link to="/admin/inaugurations/add" style={{ float: 'right' }}>
            Add Inauguration
          </Link>
          <h4 className="card-title text-primary">inaugurations</h4>

          {/* Search */}
          <div className="row mb-3">
            <div className="col-md-6">
              <input
                type="text"
                className="form-control"
                placeholder="Search inaugurations..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <div className="col-md-6 text-right">
              <span className="text-muted">
                Showing {startIndex + 1} to {Math.min(endIndex, filteredInaugurations.length)} of {filteredInaugurations.length} entries
              </span>
            </div>
          </div>

          <div className="row">
            <div className="col-12">
              <div className="table-responsive">
                <table id="directive-listing" className="table table-striped" role="grid">
                  <thead>
                    <tr>
                      <th style={{ width: '15px' }}>S.NO</th>
                      <th style={{ width: '100px' }}>Department</th>
                      <th style={{ width: '100px' }}>Scheme<br/>/Project Name</th>
                      <th style={{ width: '100px' }}>Cost in Millions</th>
                      <th style={{ width: '100px' }}>Inaugurations<br/>/GroundBreaking</th>
                      <th style={{ width: '100px' }}>District</th>
                      <th style={{ width: '100px' }}>Division</th>
                      <th style={{ width: '100px' }}>Expected Date</th>
                      <th style={{ width: '100px' }}>Remarks</th>
                      <th style={{ width: '100px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedInaugurations.length > 0 ? (
                      paginatedInaugurations.map((inauguration, index) => (
                        <tr key={inauguration.id}>
                          <td style={{ width: '15px' }}>{startIndex + index + 1}</td>
                          <td style={{ width: '100px' }}>{inauguration.department_name}</td>
                          <td style={{ width: '100px' }}>
                            {inauguration.project_name}<br/>
                            {inauguration.scheme}
                          </td>
                          <td style={{ width: '100px' }}>{inauguration.cost}</td>
                          <td style={{ width: '100px' }}>{inauguration.description}</td>
                          <td style={{ width: '100px' }}>{inauguration.district_name}</td>
                          <td style={{ width: '100px' }}>{inauguration.division_name}</td>
                          <td style={{ width: '100px' }}>
                            {new Date(inauguration.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })}
                          </td>
                          <td style={{ width: '100px' }}>{inauguration.remarks || '-'}</td>
                          <td style={{ width: '100px' }}>
                            <Link
                              to={`/admin/inaugurations/edit/${inauguration.id}`}
                              className="inauguration_id"
                              style={{ float: 'left', width: '20px' }}
                              title="edit"
                            >
                              <i className="ti-pencil-alt icon-sm"></i>
                            </Link>
                            &nbsp;&nbsp;
                            <button
                              type="button"
                              onClick={() => {
                                if (confirm('Are you sure to delete?')) {
                                  console.log('Delete inauguration:', inauguration.id);
                                  alert('Delete functionality will be implemented with backend API');
                                }
                              }}
                              className="btn btn-danger btn-icon-text"
                              title="delete"
                              style={{ marginLeft: '10px' }}
                            >
                              <i className="ti-trash icon-sm"></i>
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={10}>There are no data.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="row mt-3">
              <div className="col-12">
                <nav>
                  <ul className="pagination justify-content-center">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                      <button className="page-link" onClick={() => setCurrentPage(p => Math.max(1, p - 1))}>Previous</button>
                    </li>
                    {[...Array(Math.min(5, totalPages))].map((_, index) => {
                      const pageNum = index + 1;
                      return (
                        <li key={pageNum} className={`page-item ${currentPage === pageNum ? 'active' : ''}`}>
                          <button className="page-link" onClick={() => setCurrentPage(pageNum)}>{pageNum}</button>
                        </li>
                      );
                    })}
                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                      <button className="page-link" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}>Next</button>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
