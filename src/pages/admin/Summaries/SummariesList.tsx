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
  const [showFilters, setShowFilters] = useState(!!searchTerm);
  const itemsPerPage = 15;

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

  return (
    <div className="content-wrapper">
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
              <div className="card mb-3">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <span>Filter Summaries</span>
                  <button 
                    type="button" 
                    className="btn" 
                    onClick={() => setShowFilters(!showFilters)}
                    style={{ cursor: 'pointer' }}
                  >
                    <i className={`fas ${showFilters ? 'fa-minus' : 'fa-plus'}`}></i>
                  </button>
                </div>
                {showFilters && (
                  <div className="card-body">
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
                            onChange={(e) => {
                              setSearchTerm(e.target.value);
                              setCurrentPage(1);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <button 
                      type="button" 
                      className="btn btn-secondary ml-2"
                      onClick={() => {
                        setSearchTerm('');
                        setCurrentPage(1);
                      }}
                    >
                      Clear Filters
                    </button>
                  </div>
                )}
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
                    <td>{new Date(summary.created_date).toLocaleDateString('en-GB')}</td>
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
