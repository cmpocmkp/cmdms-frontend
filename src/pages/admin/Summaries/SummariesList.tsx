/**
 * Summaries for CM List - Admin Module
 * EXACT replica of admin/summaries/index.blade.php from old CMDMS
 */

import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { mockSummaries } from '../../../lib/mocks/data/summaries';

export default function SummariesList() {
  const [summaries] = useState(mockSummaries);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);

  const filteredSummaries = useMemo(() => {
    if (!searchTerm) return summaries;
    
    return summaries.filter(summary =>
      summary.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      summary.reference_number.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [summaries, searchTerm]);

  const totalPages = Math.ceil(filteredSummaries.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedSummaries = filteredSummaries.slice(startIndex, endIndex);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setCurrentPage(1);
  };

  const handlePerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const perPageOptions = [10, 15, 25, 50, 100];

  return (
    <div className="content-wrapper">
      <style>
        {`
          /* Force filter card visibility */
          .content-wrapper .card .card-body .row .card {
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
          }

          .content-wrapper .card .card-body .row .card .card-header {
            display: flex !important;
            visibility: visible !important;
            opacity: 1 !important;
          }

          /* Force form elements visibility - but respect collapse state */
          .content-wrapper .card .card-body .row .card .card-body.collapse:not(.show) {
            display: none !important;
          }

          .content-wrapper .card .card-body .row .card .card-body.collapse.show {
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
          }

          .content-wrapper .card .card-body .row .card .card-body.collapse.show label {
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
            color: #000 !important;
          }

          .content-wrapper .card .card-body .row .card .card-body.collapse.show .form-control {
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
            border: 1px solid #ced4da !important;
            background-color: #fff !important;
            color: #495057 !important;
          }

          .content-wrapper .card .card-body .row .card .card-body.collapse.show .btn {
            display: inline-block !important;
            visibility: visible !important;
            opacity: 1 !important;
          }
        `}
      </style>
      <div className="card">
        <div className="card-header text-center">
          <div className="d-flex gap-3 justify-content-between align-items-center">
            <div className="flex-grow-1 text-center">
              <p className="block display-4">Summaries for CM</p>
            </div>
          </div>
        </div>
        <div className="card-body">
          {/* Filter Card */}
          <div className="row justify-content-center">
            <div className="col-md-8">
              <div className="card mb-3" style={{ backgroundColor: '#fff', border: '1px solid rgba(0,0,0,.125)' }}>
                <div 
                  className="card-header d-flex justify-content-between align-items-center" 
                  style={{ 
                    backgroundColor: '#fff',
                    borderBottom: '1px solid rgba(0,0,0,.125)',
                    padding: '0.75rem 1.25rem'
                  }}
                >
                  <span style={{ fontSize: '1rem', fontWeight: '400' }}>Filter Summaries</span>
                  <button 
                    type="button" 
                    className="btn"
                    onClick={() => setIsFilterExpanded(!isFilterExpanded)}
                    style={{ cursor: 'pointer', padding: '0.25rem 0.5rem' }}
                  >
                    <i className={`fa ${isFilterExpanded ? 'fa-minus' : 'fa-plus'}`}></i>
                  </button>
                </div>
                <div className={`card-body collapse ${isFilterExpanded ? 'show' : ''}`} id="filterCardBody">
                  <form onSubmit={handleSearch}>
                    <div className="row">
                      <div className="col-md-12">
                        <div className="form-group">
                          <label htmlFor="search">Subject</label>
                          <input 
                            type="text" 
                            name="search" 
                            className="form-control"
                            placeholder="Search Subject..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                    <button type="submit" className="btn btn-primary">Search</button>
                    <a 
                      href="/admin/summaries" 
                      className="btn btn-secondary ml-2"
                      onClick={(e) => {
                        e.preventDefault();
                        handleClearFilters();
                      }}
                    >
                      Clear Filters
                    </a>
                  </form>
                </div>
              </div>
            </div>
          </div>

          {/* DataTable */}
          <table id="senateMeetingsTable" className="table table-bordered" style={{ width: '100%' }}>
            <thead>
              <tr className="thead-light">
                <th>#</th>
                <th>Ref Number</th>
                <th>Subject</th>
                <th>Department</th>
                <th>Created Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedSummaries.length > 0 ? (
                paginatedSummaries.map((summary, index) => (
                  <tr key={summary.id}>
                    <td>{startIndex + index + 1}</td>
                    <td style={{ width: '100px' }}>
                      <span className="text-uppercase">{summary.reference_number}</span>
                    </td>
                    <td className="text">
                      <Link to={`/admin/summaries/show/${summary.id}`}>
                        {summary.subject}
                      </Link>
                    </td>
                    <td>{summary.initiator_department_name}</td>
                    <td>
                      {new Date(summary.created_date).toLocaleString('en-GB', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                      })}
                    </td>
                    <td>
                      <Link
                        to={`/admin/summaries/show/${summary.id}`}
                        className="btn btn-info mt-1"
                        title="View Summary Detail"
                      >
                        <i className="ti-eye mr-1"></i>
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6}>There is no data.</td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination Footer */}
          <div className="card-footer mt-3 border">
            <div className="row align-items-center">
              {/* Per Page Dropdown */}
              <div className="col">
                <div className="form-group mb-0 row align-items-center">
                  <label htmlFor="perPage" className="col-sm-3 col-form-label mb-0">Show</label>
                  <select 
                    id="perPage" 
                    className="form-control form-control-sm col-sm-3"
                    value={itemsPerPage}
                    onChange={handlePerPageChange}
                  >
                    {perPageOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                  <span className="inline-block col-sm-6"> per page</span>
                </div>
              </div>
              {/* Records Information */}
              <div className="col text-center">
                <p className="mb-0">
                  Showing <strong>{filteredSummaries.length > 0 ? startIndex + 1 : 0}</strong> to{' '}
                  <strong>{Math.min(endIndex, filteredSummaries.length)}</strong> of total{' '}
                  <strong>{filteredSummaries.length}</strong> records.
                </p>
              </div>
              {/* Pagination Links */}
              <div className="col d-flex justify-content-end">
                {totalPages > 1 && (
                  <nav>
                    <ul className="pagination mb-0">
                      <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                        <button 
                          className="page-link" 
                          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                          disabled={currentPage === 1}
                        >
                          Previous
                        </button>
                      </li>
                      {[...Array(totalPages)].map((_, index) => {
                        const pageNum = index + 1;
                        // Show first page, last page, current page, and pages around current
                        if (
                          pageNum === 1 ||
                          pageNum === totalPages ||
                          (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                        ) {
                          return (
                            <li 
                              key={pageNum} 
                              className={`page-item ${currentPage === pageNum ? 'active' : ''}`}
                            >
                              <button 
                                className="page-link" 
                                onClick={() => setCurrentPage(pageNum)}
                              >
                                {pageNum}
                              </button>
                            </li>
                          );
                        } else if (
                          pageNum === currentPage - 2 ||
                          pageNum === currentPage + 2
                        ) {
                          return <li key={pageNum} className="page-item disabled"><span className="page-link">...</span></li>;
                        }
                        return null;
                      })}
                      <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                        <button 
                          className="page-link" 
                          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                          disabled={currentPage === totalPages}
                        >
                          Next
                        </button>
                      </li>
                    </ul>
                  </nav>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
