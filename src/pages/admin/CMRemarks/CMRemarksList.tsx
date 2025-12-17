/**
 * CM Remarks List - Admin Module
 * EXACT replica of admin/cmremarks/index.blade.php from old CMDMS
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { mockCMRemarks } from '../../../lib/mocks/data/cmRemarks';

export default function CMRemarksList() {
  const [cmRemarks] = useState(mockCMRemarks);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const totalPages = Math.ceil(cmRemarks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedRemarks = cmRemarks.slice(startIndex, endIndex);

  // badgesWithStatus mapping from old CMDMS
  const getBadgeClass = (status: string) => {
    const badgesWithStatus: Record<string, string> = {
      "Completed": "success",
      "On Target": "warning",
      "Overdue": "danger",
      "Off Target": "info",
      "Ongoing": "ongoing",
      "Overdue Other Reason": "indigo",
      "Off Target Reason": "lightred"
    };
    return badgesWithStatus[status] || "secondary";
  };

  return (
    <div className="content-wrapper">
      <div className="card">
        <div className="card-body">
          <Link to="/admin/cmremarks/add" style={{ float: 'right' }}>
            Add CM Remarks
          </Link>

          <h4 className="card-title text-primary">CM Remarks</h4>

          {cmRemarks.length > 0 ? (
            <>
              <div className="row">
                <div className="col-12">
                  <div className="table-responsive">
                    <table className="table table-striped" role="grid">
                      <thead>
                        <tr>
                          <th>S.No</th>
                          <th>Section</th>
                          <th>Subject</th>
                          <th>Letter Number</th>
                          <th>Issue Date</th>
                          <th>Timeline</th>
                          <th>Attachments</th>
                          <th>Departments</th>
                          <th>Departments <br/>summarize Progress</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedRemarks.length > 0 ? (
                          paginatedRemarks.map((remark, index) => (
                            <tr key={remark.id}>
                              <td>{startIndex + index + 1}</td>
                              <td>{remark.section_name}</td>
                              <td>{remark.subject}</td>
                              <td>{remark.letter_number}</td>
                              <td>{new Date(remark.issue_date).toLocaleDateString('en-GB')}</td>
                              <td>{new Date(remark.timeline).toLocaleDateString('en-GB')}</td>
                              <td>
                                {remark.attachments && remark.attachments.length > 0 ? (
                                  remark.attachments.map((_, idx) => (
                                    <div key={idx}>
                                      <a href="#" target="_blank">View</a><br/>
                                    </div>
                                  ))
                                ) : (
                                  'N/A'
                                )}
                              </td>
                              <td>
                                {remark.departments.map(dept => (
                                  <div key={dept.id}>{dept.name}<br/></div>
                                ))}
                              </td>
                              <td>{remark.comments ? remark.comments.split('\n').map((line, i) => <span key={i}>{line}<br/></span>) : '-'}</td>
                              <td style={{ width: '120px' }}>
                                <label className={`badge badge-${getBadgeClass(remark.status)} badge-pill`}>
                                  {remark.status ?? ""}
                                </label>
                              </td>
                              <td>
                                <Link
                                  to={`/admin/cmremarks/edit/${remark.id}`}
                                  className="mr-2 mb-2 btn btn-primary btn-sm"
                                >
                                  <i className="ti-pencil-alt icon-sm"></i>
                                </Link>

                                {remark.departments.length > 0 && (
                                  <Link
                                    to={`/admin/cmremarks/departments/${remark.id}`}
                                    title="Related Departments Status"
                                    className="mr-2 mb-2 btn btn-secondary btn-sm"
                                    role="button"
                                    aria-pressed="true"
                                  >
                                    <i className="ti-layout-grid3 icon-sm"></i>
                                  </Link>
                                )}

                                <Link
                                  to={`/admin/cmremarks/replies/${remark.id}`}
                                  title="Progress replies"
                                  className="mr-2 mb-2 btn btn-info btn-sm"
                                  role="button"
                                  aria-pressed="true"
                                >
                                  <i className="ti-comment-alt icon-sm"></i>
                                </Link>

                                <button
                                  type="button"
                                  className="btn btn-danger btn-sm"
                                  onClick={() => {
                                    if (confirm('Are you sure?')) {
                                      console.log('Delete CM Remark:', remark.id);
                                      alert('Delete functionality will be implemented with backend API');
                                    }
                                  }}
                                >
                                  <i className="ti-trash icon-sm"></i>
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={8} className="text-center">No CM remarks found.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination flex-wrap pagination-rounded-flat pagination-success mt-3">
                  <nav>
                    <ul className="pagination">
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
              )}
            </>
          ) : (
            <p>No records found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
