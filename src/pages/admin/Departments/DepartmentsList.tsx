/**
 * Departments List Page - Admin Module
 * EXACT replica of admin/departments/index.blade.php from old CMDMS
 * Enhanced with search and pagination
 */

import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { mockAdminDepartments, type Department } from '../../../lib/mocks/data/adminDepartments';

export default function DepartmentsList() {
  const [departments] = useState<Department[]>(mockAdminDepartments);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  const hasCreatePermission = true; // Mock: assuming user has permission

  // Filter departments based on search
  const filteredDepartments = useMemo(() => {
    if (!searchTerm) return departments;
    
    const search = searchTerm.toLowerCase();
    return departments.filter(dept => 
      dept.name.toLowerCase().includes(search) ||
      dept.district_name?.toLowerCase().includes(search) ||
      dept.type_label?.toLowerCase().includes(search) ||
      dept.parent_name?.toLowerCase().includes(search)
    );
  }, [departments, searchTerm]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredDepartments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedDepartments = filteredDepartments.slice(startIndex, endIndex);
  const firstItem = startIndex + 1;
  const lastItem = Math.min(endIndex, filteredDepartments.length);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Reset to page 1 when search changes
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  return (
    <div className="content-wrapper">
      <div className="card">
        <div className="card-body">
          {hasCreatePermission && (
            <Link 
              to="/admin/departments/create" 
              style={{ float: 'right' }}
              className="btn btn-primary mb-2"
            >
              Add new department/board
            </Link>
          )}
          <h4 className="card-title">All Departments/Boards</h4>
          
          {/* Search Section */}
          <div className="row mb-3">
            <div className="col-md-6">
              <input
                type="text"
                className="form-control"
                placeholder="Search departments, districts, or types..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
            <div className="col-md-6 text-right">
              <span className="text-muted">
                Showing {firstItem} to {lastItem} of {filteredDepartments.length} entries
              </span>
            </div>
          </div>
          
          <div className="row">
            <div className="col-12">
              <div className="table-responsive">
                <table id="order-listing" className="table table-striped">
                  <thead style={{ background: 'rgb(37, 136, 95) !important', color: 'white !important' }}>
                    <tr>
                      <th>S.NO.</th>
                      <th>Name</th>
                      <th>District</th>
                      <th>Type</th>
                      <th>Parent</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedDepartments.length > 0 ? (
                      paginatedDepartments.map((department, index) => (
                        <tr key={department.id}>
                          <td>{startIndex + index + 1}</td>
                          <td>{department.name || '-'}</td>
                          <td>{department.district_name || '-'}</td>
                          <td>{department.type_label || '-'}</td>
                          <td>{department.parent_name || '-'}</td>
                          <td>
                            <Link
                              to={`/admin/departments/edit/${department.id}`}
                              className="text-white p-2 btn btn-primary"
                            >
                              update
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
              </div>
            </div>
          </div>

          {/* Pagination Section */}
          {totalPages > 1 && (
            <div className="row mt-3">
              <div className="col-12">
                <nav>
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
                    
                    {[...Array(totalPages)].map((_, index) => {
                      const page = index + 1;
                      // Show first page, last page, current page, and pages around current
                      if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 2 && page <= currentPage + 2)
                      ) {
                        return (
                          <li
                            key={page}
                            className={`page-item ${currentPage === page ? 'active' : ''}`}
                          >
                            <button
                              className="page-link"
                              onClick={() => goToPage(page)}
                            >
                              {page}
                            </button>
                          </li>
                        );
                      } else if (page === currentPage - 3 || page === currentPage + 3) {
                        return (
                          <li key={page} className="page-item disabled">
                            <span className="page-link">...</span>
                          </li>
                        );
                      }
                      return null;
                    })}
                    
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
