/**
 * Tags List Page - Admin Module
 * EXACT replica of admin/tags/index.blade.php from old CMDMS
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { mockAdminTags, type Tag } from '../../../lib/mocks/data/adminTags';

export default function TagsList() {
  const [tags] = useState<Tag[]>(mockAdminTags);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  // Calculate pagination
  const totalPages = Math.ceil(tags.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedTags = tags.slice(startIndex, endIndex);
  const firstItem = startIndex + 1;

  const handleDelete = (tagId: number, tagName: string) => {
    if (window.confirm('Are you sure you want to delete this tag?')) {
      console.log(`Delete tag ${tagId}: ${tagName}`);
      // TODO: Implement delete functionality when backend is ready
    }
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="content-wrapper">
      <div className="row">
        <div className="col-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-header text-center">
              <div className="d-flex gap-3 justify-content-between align-items-center">
                <div className="flex-grow-1 text-center">
                  <p className="block display-4">Tags List</p>
                </div>
                <div>
                  <div className="btn-toolbar pull-right">
                    <div className="btn-group">
                      <Link
                        to="/admin/tags/create"
                        className="btn btn-outline-primary btn-fw"
                        role="button"
                      >
                        <i className="ti-plus mr-1"></i>Add New Tag
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead style={{ background: 'rgb(37, 136, 95) !important', color: 'white !important' }}>
                    <tr>
                      <th>#</th>
                      <th>Name</th>
                      <th>Module</th>
                      <th>Parent Tag</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedTags.length > 0 ? (
                      paginatedTags.map((tag, index) => (
                        <tr key={tag.id}>
                          <td>{firstItem + index}</td>
                          <td>{tag.name.charAt(0).toUpperCase() + tag.name.slice(1)}</td>
                          <td>{tag.module_label || '-'}</td>
                          <td>{tag.parent_name ? tag.parent_name.charAt(0).toUpperCase() + tag.parent_name.slice(1) : 'None'}</td>
                          <td>{tag.status_label || '-'}</td>
                          <td style={{ width: '15px', textAlign: 'center' }}>
                            <Link
                              to={`/admin/tags/edit/${tag.id}`}
                              className="btn btn-sm btn-primary mb-2 mx-2"
                              title="Edit"
                            >
                              <i className="ti-pencil-alt icon-sm"></i>
                            </Link>
                            <button
                              onClick={() => handleDelete(tag.id, tag.name)}
                              className="btn btn-sm btn-danger"
                              title="Delete"
                            >
                              <i className="ti-trash"></i>
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td className="text-center" colSpan={6}>
                          No records found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-4">
                  <nav aria-label="Page navigation">
                    <ul className="pagination justify-content-center">
                      <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                        <button
                          className="page-link"
                          onClick={() => goToPage(currentPage - 1)}
                          disabled={currentPage === 1}
                        >
                          Previous
                        </button>
                      </li>
                      {[...Array(totalPages)].map((_, index) => (
                        <li
                          key={index + 1}
                          className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}
                        >
                          <button
                            className="page-link"
                            onClick={() => goToPage(index + 1)}
                          >
                            {index + 1}
                          </button>
                        </li>
                      ))}
                      <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                        <button
                          className="page-link"
                          onClick={() => goToPage(currentPage + 1)}
                          disabled={currentPage === totalPages}
                        >
                          Next
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
