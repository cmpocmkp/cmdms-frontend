/**
 * Inaugurations List - Admin Module
 * EXACT replica of admin/inaugrations/index.blade.php from old CMDMS
 * Integrated with real API following API_INTEGRATION_GUIDE.md
 * 
 * Note: API structure (title, description, date, type, departmentId, districtId, projectCost) differs from frontend mock structure.
 * Frontend fields like project_name, scheme, division_name, remarks are not in API.
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as inaugurationService from '../../../lib/services/inaugurationService';
import { USE_MOCK_DATA } from '../../../lib/api';
import { mockInaugurations } from '../../../lib/mocks/data/inaugurations';

// Format date as 'jS F' (e.g., "15th December")
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleDateString('en-GB', { month: 'long' });
  
  // Add ordinal suffix
  const getOrdinalSuffix = (n: number): string => {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };
  
  return `${getOrdinalSuffix(day)} ${month}`;
};

export default function InaugurationsList() {
  const [inaugurations, setInaugurations] = useState<inaugurationService.Inauguration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleting, setDeleting] = useState<number | null>(null);

  // Fetch inaugurations from API
  useEffect(() => {
    fetchInaugurations();
  }, [currentPage, searchTerm]);

  const fetchInaugurations = async () => {
    try {
      setLoading(true);
      setError(null);

      if (USE_MOCK_DATA) {
        // Use mock data - convert to API format
        const apiInaugurations: inaugurationService.Inauguration[] = mockInaugurations.map((inaug: any) => ({
          id: inaug.id,
          title: inaug.project_name || 'Inauguration',
          description: inaug.description || '',
          date: inaug.date,
          type: inaug.type || 'inauguration',
          departmentId: inaug.department_id,
          districtId: inaug.district_id,
          projectCost: inaug.cost ? inaug.cost * 1000000 : undefined, // Convert millions to actual cost
        }));
        setInaugurations(apiInaugurations);
        setTotalPages(1);
      } else {
        // Real API call
        const params: inaugurationService.ListInaugurationsParams = {
          page: currentPage,
          limit: 15,
        };

        if (searchTerm) {
          params.search = searchTerm;
        }

        const response = await inaugurationService.listInaugurations(params);

        if (response.success && response.data) {
          setInaugurations(response.data);
          setTotalPages(response.meta?.totalPages || 1);
        } else {
          setError(response.message || 'Failed to load inaugurations');
        }
      }
    } catch (err: any) {
      console.error('Error fetching inaugurations:', err);
      setError(err.response?.data?.error?.message || 'Failed to load inaugurations');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (inaugurationId: number) => {
    if (!confirm('Are you sure to delete this inauguration? This action cannot be undone.')) {
      return;
    }

    try {
      setDeleting(inaugurationId);
      
      if (USE_MOCK_DATA) {
        // Mock delete
        setInaugurations(inaugurations.filter(i => i.id !== inaugurationId));
        alert('Inauguration deleted successfully!');
      } else {
        // Real API delete
        const response = await inaugurationService.deleteInauguration(inaugurationId);
        
        if (response.success) {
          // Refresh the list
          await fetchInaugurations();
          alert('Inauguration deleted successfully!');
        } else {
          alert(response.message || 'Failed to delete inauguration');
        }
      }
    } catch (err: any) {
      console.error('Error deleting inauguration:', err);
      alert(err.response?.data?.error?.message || 'Failed to delete inauguration');
    } finally {
      setDeleting(null);
    }
  };

  // Filter inaugurations based on search term (client-side for mock, server-side for API)
  const filteredInaugurations = USE_MOCK_DATA ? inaugurations.filter(inaug => {
    if (!searchTerm) return true;
    const lowerSearch = searchTerm.toLowerCase();
    return (
      inaug.title?.toLowerCase().includes(lowerSearch) ||
      inaug.description?.toLowerCase().includes(lowerSearch) ||
      inaug.type?.toLowerCase().includes(lowerSearch) ||
      inaug.department?.name?.toLowerCase().includes(lowerSearch) ||
      inaug.district?.name?.toLowerCase().includes(lowerSearch)
    );
  }) : inaugurations;

  // Handle Excel export
  const handleExcelExport = () => {
    const headers = ['S.No', 'Title', 'Description', 'Type', 'Department', 'District', 'Project Cost', 'Date'];
    const rows = filteredInaugurations.map((inaug, index) => [
      (currentPage - 1) * 15 + index + 1,
      inaug.title || '',
      inaug.description?.replace(/<[^>]*>/g, '') || '',
      inaug.type || '',
      inaug.department?.name || '',
      inaug.district?.name || '',
      inaug.projectCost ? `₹${(inaug.projectCost / 1000000).toFixed(2)}M` : '',
      inaug.date ? formatDate(inaug.date) : ''
    ]);
    
    let csv = headers.join(',') + '\n';
    rows.forEach(row => {
      csv += row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',') + '\n';
    });
    
    const blob = new Blob([csv], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `inaugurations_${new Date().toISOString().split('T')[0]}.xls`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  // Handle Print
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups to use print functionality');
      return;
    }
    
    printWindow.document.write('<html><head><title>Inaugurations</title>');
    printWindow.document.write('<style>');
    printWindow.document.write('body { font-family: Arial, sans-serif; margin: 20px; }');
    printWindow.document.write('h1 { color: #333; }');
    printWindow.document.write('table { border-collapse: collapse; width: 100%; margin-top: 20px; font-size: 11px; }');
    printWindow.document.write('th, td { border: 1px solid #ddd; padding: 6px; text-align: left; }');
    printWindow.document.write('th { background-color: #f2f2f2; font-weight: bold; }');
    printWindow.document.write('tr:nth-child(even) { background-color: #f9f9f9; }');
    printWindow.document.write('@media print { body { margin: 0; } }');
    printWindow.document.write('</style></head><body>');
    printWindow.document.write('<h1>Inaugurations</h1>');
    printWindow.document.write('<table>');
    printWindow.document.write('<thead><tr>');
    printWindow.document.write('<th>S.NO</th><th>Title</th><th>Description</th><th>Type</th><th>Department</th>');
    printWindow.document.write('<th>District</th><th>Project Cost</th><th>Date</th>');
    printWindow.document.write('</tr></thead><tbody>');
    
    filteredInaugurations.forEach((inaug, idx) => {
      printWindow.document.write('<tr>');
      printWindow.document.write(`<td>${(currentPage - 1) * 15 + idx + 1}</td>`);
      printWindow.document.write(`<td>${inaug.title || ''}</td>`);
      printWindow.document.write(`<td>${inaug.description?.replace(/<[^>]*>/g, '') || ''}</td>`);
      printWindow.document.write(`<td>${inaug.type || ''}</td>`);
      printWindow.document.write(`<td>${inaug.department?.name || ''}</td>`);
      printWindow.document.write(`<td>${inaug.district?.name || ''}</td>`);
      printWindow.document.write(`<td>${inaug.projectCost ? '₹' + (inaug.projectCost / 1000000).toFixed(2) + 'M' : ''}</td>`);
      printWindow.document.write(`<td>${inaug.date ? formatDate(inaug.date) : ''}</td>`);
      printWindow.document.write('</tr>');
    });
    
    printWindow.document.write('</tbody></table>');
    printWindow.document.write('<p style="margin-top: 20px; font-size: 10px; color: #666;">');
    printWindow.document.write(`Generated on: ${new Date().toLocaleString()}`);
    printWindow.document.write('</p>');
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="content-wrapper">
      <style>
        {`
          table#directive-listing td p {
            width: 100px !important;
          }
          table#directive-listing td {
            width: 100px !important;
          }
          table#directive-listing th {
            padding: 10px !important;
          }
          .modal .modal-dialog {
            margin-top: 70px !important;
          }
          /* Action column icon buttons styling */
          table#directive-listing td .btn-icon-text {
            width: 32px;
            height: 32px;
            padding: 0;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border-radius: 4px;
            margin-right: 8px;
          }
          table#directive-listing td .btn-icon-text i {
            font-size: 14px;
            line-height: 1;
          }
          table#directive-listing td .btn-icon-text:hover {
            opacity: 0.9;
            transform: translateY(-1px);
            box-shadow: 0 2px 4px rgba(0,0,0,0.15);
          }
        `}
      </style>
      <div className="card">
        <div className="card-body">
          <Link to="/admin/inaugurations/add" style={{ float: 'right' }}>
            Add Inauguration
          </Link>
          <h4 className="card-title text-primary">inaugurations</h4>

          {/* Export Buttons and Search */}
          <div className="row mb-3">
            <div className="col-sm-12 col-md-6">
              <div className="dt-buttons-wrapper">
                <div className="dt-buttons">
                  <button
                    type="button"
                    className="dt-button"
                    onClick={handleExcelExport}
                    title="Export to Excel"
                  >
                    <span>Excel</span>
                  </button>
                  <button
                    type="button"
                    className="dt-button"
                    onClick={handlePrint}
                    title="Print"
                  >
                    <span>Print</span>
                  </button>
                </div>
              </div>
            </div>
            <div className="col-sm-12 col-md-6">
              <div className="dataTables_filter">
                <label>
                  Search:
                  <input
                    type="search"
                    className="form-control form-control-sm"
                    placeholder=""
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </label>
              </div>
            </div>
          </div>

          <style>{`
            /* DataTables Export Buttons Styling - Exact Match */
            .dt-buttons-wrapper {
              margin-bottom: 1rem;
            }
            .dt-buttons {
              display: inline-block;
            }
            .dt-button {
              display: inline-block;
              background-color: #fff;
              background-image: linear-gradient(to bottom, #fff 0%, #e0e0e0 100%);
              border: 1px solid #999;
              border-radius: 2px;
              color: #333;
              cursor: pointer;
              font-size: 0.88em;
              line-height: 1.6em;
              padding: 0.5em 1em;
              text-align: center;
              text-decoration: none;
              user-select: none;
              vertical-align: middle;
              white-space: nowrap;
              margin-left: 0.167em;
              margin-right: 0;
              margin-bottom: 0.333em;
            }
            .dt-button:first-child {
              margin-left: 0;
            }
            .dt-button:hover {
              background-color: #e0e0e0;
              background-image: linear-gradient(to bottom, #f5f5f5 0%, #e0e0e0 100%);
              border-color: #666;
              text-decoration: none;
            }
            .dt-button:active {
              background-color: #e0e0e0;
              background-image: none;
              box-shadow: inset 0 2px 4px rgba(0,0,0,0.15);
              outline: none;
            }
            .dataTables_filter {
              text-align: right;
            }
            .dataTables_filter label {
              font-weight: normal;
              white-space: nowrap;
              text-align: left;
              display: inline-block;
              vertical-align: middle;
            }
            .dataTables_filter input {
              margin-left: 0.5em;
              display: inline-block;
              width: auto;
              border: 1px solid #aaa;
              border-radius: 3px;
              padding: 5px;
              background-color: transparent;
              color: inherit;
              font-size: inherit;
              margin-bottom: 0;
            }
            .dataTables_filter input:focus {
              outline: 2px solid #4A90E2;
              outline-offset: 0;
            }
          `}</style>

          {/* Loading State */}
          {loading && (
            <div className="text-center p-5">
              <div className="spinner-border text-primary" role="status">
                <span className="sr-only">Loading...</span>
              </div>
              <p className="mt-2 text-muted">Loading inaugurations...</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="alert alert-danger" role="alert">
              <i className="ti-alert-circle mr-2"></i>
              <strong>Error:</strong> {error}
              <button 
                className="btn btn-sm btn-outline-danger ml-3" 
                onClick={fetchInaugurations}
              >
                Retry
              </button>
            </div>
          )}

          {/* Content */}
          {!loading && !error && (
            <div className="row">
              <div className="col-12">
                <div className="table-responsive">
                  <table id="directive-listing" className="table-striped" role="grid">
                    <thead>
                      <tr>
                        <th style={{ width: '15px' }}>S.NO</th>
                        <th style={{ width: '100px' }}>Title</th>
                        <th style={{ width: '100px' }}>Description</th>
                        <th style={{ width: '100px' }}>Type</th>
                        <th style={{ width: '100px' }}>Department</th>
                        <th style={{ width: '100px' }}>District</th>
                        <th style={{ width: '100px' }}>Project Cost</th>
                        <th style={{ width: '100px' }}>Date</th>
                        <th style={{ width: '100px' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredInaugurations.length > 0 ? (
                        filteredInaugurations.map((inauguration, index) => (
                          <tr key={inauguration.id}>
                            <td style={{ width: '15px' }}>{(currentPage - 1) * 15 + index + 1}</td>
                            <td style={{ width: '100px' }}>{inauguration.title || '-'}</td>
                            <td style={{ width: '100px' }}>
                              <div dangerouslySetInnerHTML={{ __html: (inauguration.description || '') }} />
                            </td>
                            <td style={{ width: '100px' }}>{inauguration.type || '-'}</td>
                            <td style={{ width: '100px' }}>{inauguration.department?.name || '-'}</td>
                            <td style={{ width: '100px' }}>{inauguration.district?.name || '-'}</td>
                            <td style={{ width: '100px' }}>
                              {inauguration.projectCost ? `₹${(inauguration.projectCost / 1000000).toFixed(2)}M` : '-'}
                            </td>
                            <td style={{ width: '100px' }}>
                              {inauguration.date ? formatDate(inauguration.date) : '-'}
                            </td>
                            <td style={{ width: '100px' }}>
                              <Link
                                to={`/admin/inaugurations/edit/${inauguration.id}`}
                                className="btn btn-sm btn-info mb-2 mx-2"
                                style={{ width: '45px' }}
                                title="Edit inauguration"
                              >
                                <i className="ti-pencil"></i>
                              </Link>
                              <button
                                type="button"
                                className="btn btn-sm btn-danger mb-2 mx-2"
                                style={{ width: '45px' }}
                                title="Delete inauguration"
                                onClick={() => handleDelete(inauguration.id)}
                                disabled={deleting === inauguration.id}
                              >
                                {deleting === inauguration.id ? (
                                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                ) : (
                                  <i className="ti-trash icon-sm"></i>
                                )}
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={9}>
                            {searchTerm ? `No inaugurations found matching "${searchTerm}"` : 'There is no data.'}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Pagination */}
          {!USE_MOCK_DATA && totalPages > 1 && (
            <div className="pagination flex-wrap pagination-rounded-flat pagination-success mt-3">
              <nav>
                <ul className="pagination">
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button 
                      className="page-link" 
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </button>
                  </li>
                  {(() => {
                    const pageNumbers = [];
                    const maxPagesToShow = 5;
                    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
                    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

                    if (endPage - startPage + 1 < maxPagesToShow) {
                      startPage = Math.max(1, endPage - maxPagesToShow + 1);
                    }

                    for (let i = startPage; i <= endPage; i++) {
                      pageNumbers.push(
                        <li key={i} className={`page-item ${currentPage === i ? 'active' : ''}`}>
                          <button className="page-link" onClick={() => setCurrentPage(i)}>
                            {i}
                          </button>
                        </li>
                      );
                    }
                    return pageNumbers;
                  })()}
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
