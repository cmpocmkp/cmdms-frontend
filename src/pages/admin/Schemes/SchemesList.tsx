/**
 * Schemes List - Admin Module
 * EXACT replica of admin/schemes/index.blade.php from old CMDMS
 */

import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { mockSchemes } from '../../../lib/mocks/data/schemes';

export default function SchemesList() {
  const [schemes] = useState(mockSchemes);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const filteredSchemes = useMemo(() => {
    if (!searchTerm) return schemes;
    
    return schemes.filter(scheme =>
      scheme.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scheme.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scheme.district_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [schemes, searchTerm]);

  const totalPages = Math.ceil(filteredSchemes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedSchemes = filteredSchemes.slice(startIndex, endIndex);

  return (
    <div className="content-wrapper">
      <div className="card">
        <div className="card-body">
          <Link to="/admin/schemes/add" style={{ float: 'right' }}>
            Add Scheme
          </Link>
          <h4 className="card-title text-primary">All Schemes</h4>

          {/* Search */}
          <div className="row mb-3">
            <div className="col-md-6">
              <input
                type="text"
                className="form-control"
                placeholder="Search schemes by name, code, or district..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <div className="col-md-6 text-right">
              <span className="text-muted">
                Showing {startIndex + 1} to {Math.min(endIndex, filteredSchemes.length)} of {filteredSchemes.length} entries
              </span>
            </div>
          </div>

          <div className="row">
            <div className="col-12">
              <div className="table-responsive">
                <table id="schemes-listing" className="table table-striped" role="grid">
                  <thead style={{ background: 'rgb(37, 136, 95)', color: 'white' }}>
                    <tr>
                      <th style={{ width: '15px' }}>S.No</th>
                      <th style={{ width: '300px' }}>Scheme</th>
                      <th style={{ width: '15px' }}>district</th>
                      <th style={{ width: '15px' }}>code</th>
                      <th style={{ width: '15px' }}>category</th>
                      <th style={{ width: '15px' }}>type</th>
                      <th style={{ width: '100px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedSchemes.length > 0 ? (
                      paginatedSchemes.map((scheme, index) => (
                        <tr key={scheme.id}>
                          <td style={{ width: '15px', color: 'blue', fontSize: '16px' }}>{startIndex + index + 1}</td>
                          <td style={{ width: '300px', whiteSpace: 'pre-wrap', color: 'blue', fontSize: '16px' }}>{scheme.name}</td>
                          <td style={{ width: '15px', color: 'blue', fontSize: '16px' }}>{scheme.district_name}</td>
                          <td style={{ width: '15px', color: 'blue', fontSize: '16px' }}>{scheme.code}</td>
                          <td style={{ width: '15px', color: 'blue', fontSize: '16px' }}>{scheme.category}</td>
                          <td style={{ width: '15px', color: 'blue', fontSize: '16px' }}>{scheme.type}</td>
                          <td style={{ width: '100px' }}>
                            <Link
                              to={`/admin/schemes/edit/${scheme.id}`}
                              className="text-primary mr-2"
                            >
                              Edit
                            </Link>
                            &nbsp;&nbsp;
                            <button
                              type="button"
                              onClick={() => {
                                if (confirm('Are you sure to delete?')) {
                                  console.log('Delete scheme:', scheme.id);
                                  alert('Delete functionality will be implemented with backend API');
                                }
                              }}
                              className="btn btn-danger btn-sm btn-icon-text"
                              title="delete"
                            >
                              <i className="ti-trash icon-sm"></i>
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={10}>There is no data.</td>
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
