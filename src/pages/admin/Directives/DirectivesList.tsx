/**
 * Directives List - Admin Module
 * EXACT replica of admin/directives/index.blade.php from old CMDMS
 * Integrated with real API following API_INTEGRATION_GUIDE.md
 */

import { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import * as directiveService from '../../../lib/services/directiveService';
import { mapDirectiveToDisplay, type DisplayDirective } from '../../../lib/utils/directiveMapper';
import { USE_MOCK_DATA } from '../../../lib/api';
import { mockDirectives } from '../../../lib/mocks/data/directives';
import { EditDirectiveModal } from './components/EditDirectiveModal';

export default function DirectivesList() {
  const [searchParams] = useSearchParams();
  const [directives, setDirectives] = useState<DisplayDirective[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>(searchParams.get('status') || '');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedDirective, setSelectedDirective] = useState<DisplayDirective | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);

  // Calculate summary from directives
  const summary = useMemo(() => {
    const total = directives.length;
    const completed = directives.filter(d => d.status === 'Completed').length;
    const onTarget = directives.filter(d => d.status === 'On Target').length;
    const overdue = directives.filter(d => d.status === 'Overdue').length;
    
    return {
      total,
      'Completed': {
        count: completed,
        percent: total > 0 ? Math.round((completed / total) * 100) : 0
      },
      'On Target': {
        count: onTarget,
        percent: total > 0 ? Math.round((onTarget / total) * 100) : 0
      },
      'Overdue': {
        count: overdue,
        percent: total > 0 ? Math.round((overdue / total) * 100) : 0
      }
    };
  }, [directives]);

  // Fetch directives from API
  useEffect(() => {
    fetchDirectives();
  }, [currentPage, itemsPerPage, statusFilter, searchTerm]);

  const fetchDirectives = async () => {
    try {
      setLoading(true);
      setError(null);

      if (USE_MOCK_DATA) {
        // Use mock data
        setDirectives(mockDirectives as DisplayDirective[]);
        setTotal(mockDirectives.length);
        setTotalPages(Math.ceil(mockDirectives.length / itemsPerPage));
      } else {
        // Real API call
        const params: directiveService.ListDirectivesParams = {
          page: currentPage,
          limit: itemsPerPage,
        };

        if (searchTerm) {
          params.search = searchTerm;
        }

        if (statusFilter) {
          // Map status filter to API format (1=Completed, 2=On Target, 3=Overdue)
          params.status = statusFilter;
        }

        const response = await directiveService.listDirectives(params);

        if (response.success && response.data) {
          // Map API response to display format
          const mappedDirectives = response.data.map(mapDirectiveToDisplay);
          setDirectives(mappedDirectives);
          setTotal(response.meta?.total || mappedDirectives.length);
          setTotalPages(response.meta?.totalPages || Math.ceil(mappedDirectives.length / itemsPerPage));
        } else {
          setError(response.message || 'Failed to load directives');
        }
      }
    } catch (err: any) {
      console.error('Error fetching directives:', err);
      setError(err.response?.data?.error?.message || 'Failed to load directives');
    } finally {
      setLoading(false);
    }
  };

  // For real API, filtering is done server-side, so we use directives directly
  // For mock data, we still do client-side filtering
  const filteredDirectives = useMemo(() => {
    if (USE_MOCK_DATA) {
      let filtered = directives;

      // Filter by status
      if (statusFilter) {
        const statusMap: { [key: string]: string } = {
          '1': 'Completed',
          '2': 'On Target',
          '3': 'Overdue'
        };
        const statusLabel = statusMap[statusFilter];
        filtered = filtered.filter(d => d.status === statusLabel);
      }

      // Filter by search term
      if (searchTerm) {
        filtered = filtered.filter(d =>
          d.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
          d.letter_no.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      return filtered;
    }
    // For real API, directives are already filtered server-side
    return directives;
  }, [directives, statusFilter, searchTerm, USE_MOCK_DATA]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedDirectives = USE_MOCK_DATA 
    ? filteredDirectives.slice(startIndex, endIndex)
    : filteredDirectives; // API already returns paginated data

  // Export Functions - Matching old CMDMS DataTables functionality
  const handleCopy = () => {
    const headers = ['S.No', 'Subject', 'Progress', 'Letter Number', 'Responsibility'];
    const rows = filteredDirectives.map((dir, idx) => [
      idx + 1,
      dir.subject.replace(/<[^>]*>/g, ''),
      (dir.comments || '').replace(/<[^>]*>/g, ''),
      `${new Date(dir.date).toLocaleDateString()} - ${dir.letter_no}`,
      dir.departments.map(d => d.name).join(', ')
    ]);
    
    const text = [headers, ...rows].map(row => row.join('\t')).join('\n');
    navigator.clipboard.writeText(text).then(() => {
      alert('Copied to clipboard!');
    }).catch(() => {
      alert('Failed to copy to clipboard');
    });
  };

  const handleExcel = () => {
    const headers = ['S.No', 'Subject', 'Progress', 'Letter Number', 'Responsibility'];
    const rows = filteredDirectives.map((dir, idx) => [
      idx + 1,
      dir.subject.replace(/<[^>]*>/g, ''),
      (dir.comments || '').replace(/<[^>]*>/g, ''),
      `${new Date(dir.date).toLocaleDateString()} - ${dir.letter_no}`,
      dir.departments.map(d => d.name).join(', ')
    ]);
    
    let csv = headers.join(',') + '\n';
    rows.forEach(row => {
      csv += row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',') + '\n';
    });
    
    const blob = new Blob([csv], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `directives_${new Date().toISOString().split('T')[0]}.xls`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const handleCSV = () => {
    const headers = ['S.No', 'Subject', 'Progress', 'Letter Number', 'Responsibility'];
    const rows = filteredDirectives.map((dir, idx) => [
      idx + 1,
      dir.subject.replace(/<[^>]*>/g, ''),
      (dir.comments || '').replace(/<[^>]*>/g, ''),
      `${new Date(dir.date).toLocaleDateString()} - ${dir.letter_no}`,
      dir.departments.map(d => d.name).join(', ')
    ]);
    
    let csv = headers.join(',') + '\n';
    rows.forEach(row => {
      csv += row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',') + '\n';
    });
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `directives_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const handlePDF = async () => {
    try {
      // Dynamically import pdfmake
      const pdfMake = await import('pdfmake/build/pdfmake');
      const pdfFonts = await import('pdfmake/build/vfs_fonts');
      
      // Set fonts - access vfs correctly
      (pdfMake as any).vfs = (pdfFonts as any).pdfMake?.vfs || (pdfFonts as any).default?.pdfMake?.vfs;
      
      // Prepare table data
      const tableData = [
        ['S.No', 'Subject', 'Progress', 'Letter Number', 'Responsibility']
      ];
      
      filteredDirectives.forEach((dir, idx) => {
        tableData.push([
          String(idx + 1),
          dir.subject.replace(/<[^>]*>/g, '').substring(0, 100),
          (dir.comments || '').replace(/<[^>]*>/g, '').substring(0, 100),
          `${new Date(dir.date).toLocaleDateString()} - ${dir.letter_no}`,
          dir.departments.map(d => d.name).join(', ').substring(0, 80)
        ]);
      });
      
      // Define PDF document
      const docDefinition: any = {
        pageOrientation: 'landscape',
        pageSize: 'A4',
        pageMargins: [40, 60, 40, 60],
        content: [
          {
            text: 'Directives',
            style: 'header',
            margin: [0, 0, 0, 20]
          },
          {
            table: {
              headerRows: 1,
              widths: ['auto', '*', '*', 'auto', '*'],
              body: tableData
            },
            layout: {
              fillColor: function (rowIndex: number) {
                return rowIndex === 0 ? '#CCCCCC' : (rowIndex % 2 === 0 ? '#F3F3F3' : null);
              },
              hLineWidth: function () {
                return 1;
              },
              vLineWidth: function () {
                return 1;
              },
              hLineColor: function () {
                return '#AAAAAA';
              },
              vLineColor: function () {
                return '#AAAAAA';
              }
            }
          }
        ],
        styles: {
          header: {
            fontSize: 18,
            bold: true,
            alignment: 'center'
          }
        },
        defaultStyle: {
          fontSize: 9
        }
      };
      
      // Generate and download PDF
      pdfMake.default.createPdf(docDefinition).download(`directives_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('PDF generation error:', error);
      alert('Failed to generate PDF. Please try Excel or Print export instead.');
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '', 'height=600,width=800');
    if (!printWindow) {
      alert('Please allow popups to use print functionality');
      return;
    }
    
    printWindow.document.write('<html><head><title>Directives</title>');
    printWindow.document.write('<style>');
    printWindow.document.write('body { font-family: Arial, sans-serif; margin: 20px; }');
    printWindow.document.write('h1 { color: #333; }');
    printWindow.document.write('table { border-collapse: collapse; width: 100%; margin-top: 20px; }');
    printWindow.document.write('th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 12px; }');
    printWindow.document.write('th { background-color: #f2f2f2; font-weight: bold; }');
    printWindow.document.write('tr:nth-child(even) { background-color: #f9f9f9; }');
    printWindow.document.write('@media print { body { margin: 0; } }');
    printWindow.document.write('</style></head><body>');
    printWindow.document.write('<h1>Directives</h1>');
    printWindow.document.write('<table>');
    printWindow.document.write('<thead><tr>');
    printWindow.document.write('<th>S.No</th><th>Subject</th><th>Progress</th><th>Letter Number</th><th>Responsibility</th>');
    printWindow.document.write('</tr></thead><tbody>');
    
    filteredDirectives.forEach((dir, idx) => {
      printWindow.document.write('<tr>');
      printWindow.document.write(`<td>${idx + 1}</td>`);
      printWindow.document.write(`<td>${dir.subject.replace(/<[^>]*>/g, '')}</td>`);
      printWindow.document.write(`<td>${(dir.comments || '').replace(/<[^>]*>/g, '')}</td>`);
      printWindow.document.write(`<td>${new Date(dir.date).toLocaleDateString()} - ${dir.letter_no}</td>`);
      printWindow.document.write(`<td>${dir.departments.map(d => d.name).join(', ')}</td>`);
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

  const handleDelete = async (directiveId: number) => {
    if (!confirm('Are you sure you want to delete this directive? This action cannot be undone.')) {
      return;
    }

    try {
      setDeleting(directiveId);
      
      if (USE_MOCK_DATA) {
        // Mock delete
        setDirectives(directives.filter(d => d.id !== directiveId));
        alert('Directive deleted successfully!');
      } else {
        // Real API delete
        const response = await directiveService.deleteDirective(directiveId);
        
        if (response.success) {
          // Refresh the list
          await fetchDirectives();
          alert('Directive deleted successfully!');
        } else {
          alert(response.message || 'Failed to delete directive');
        }
      }
    } catch (err: any) {
      console.error('Error deleting directive:', err);
      alert(err.response?.data?.error?.message || 'Failed to delete directive');
    } finally {
      setDeleting(null);
    }
  };

  const handleEditClick = (directive: any) => {
    setSelectedDirective(directive);
    setShowEditModal(true);
  };

  const statusCards = [
    {
      status: '',
      borderColor: '#3282FF',
      title: 'Total',
      count: summary.total,
      percent: 0,
      icon: 'ti-list'
    },
    {
      status: '1',
      borderColor: '#0E8160',
      title: 'Completed',
      count: summary['Completed'].count,
      percent: summary['Completed'].percent,
      icon: 'ti-check'
    },
    {
      status: '2',
      borderColor: '#1DC39F',
      title: 'On Target',
      count: summary['On Target'].count,
      percent: summary['On Target'].percent,
      icon: 'ti-target'
    },
    {
      status: '3',
      borderColor: '#E74039',
      title: 'Overdue',
      count: summary['Overdue'].count,
      percent: summary['Overdue'].percent,
      icon: 'ti-timer'
    }
  ];

  return (
    <div className="content-wrapper">
      <div className="card">
        <div className="card-header text-center">
          <div className="d-flex gap-3 justify-content-between align-items-center">
            <div className="flex-grow-1 text-center">
              <p className="block display-4">Directives</p>
            </div>
            <div>
              <Link 
                to="/admin/directives/add" 
                className="btn btn-outline-primary btn-fw" 
                role="button"
              >
                <i className="ti-plus mr-1"></i>Add Directive
              </Link>
            </div>
          </div>
        </div>
        <div className="card-body">
          {/* Loading State */}
          {loading && (
            <div className="text-center p-5">
              <div className="spinner-border text-primary" role="status">
                <span className="sr-only">Loading...</span>
              </div>
              <p className="mt-2 text-muted">Loading directives...</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="alert alert-danger" role="alert">
              <i className="ti-alert-circle mr-2"></i>
              <strong>Error:</strong> {error}
              <button 
                className="btn btn-sm btn-outline-danger ml-3" 
                onClick={fetchDirectives}
              >
                Retry
              </button>
            </div>
          )}

          {/* Content */}
          {!loading && !error && (
            <>
          {/* Status Cards */}
          <div className="row my-5 d-flex justify-content-center">
            {statusCards.map(card => (
              <div key={card.status} className="col-md-2 p-2">
                <Link to={`/admin/directives?status=${card.status}`} onClick={() => setStatusFilter(card.status)}>
                  <div 
                    className="card record-notes-custom-card-analytics"
                    style={{ 
                      borderBottom: `8px solid ${card.borderColor}`,
                      border: statusFilter === card.status ? `8px solid ${card.borderColor}` : undefined
                    }}
                  >
                    <div className="card-body">
                      <div className="icon" style={{ background: card.borderColor }}>
                        <i className={card.icon}></i>
                      </div>
                      <h3 className="mb-2" style={{ color: card.borderColor }}>{card.count}</h3>
                      <p>{card.title}</p>
                      <p className="mb-0 mt-2">
                        {card.percent === 0 ? '\u00A0' : `${card.percent}%`}
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          {/* DataTables Export Buttons and Search Section - Exact Match */}
          <div className="dataTables_wrapper dt-bootstrap4">
            <div className="row">
              <div className="col-sm-12 col-md-6">
                <div className="dt-buttons btn-group flex-wrap">
                  <button 
                    className="btn btn-secondary buttons-copy buttons-html5" 
                    tabIndex={0} 
                    type="button"
                    onClick={handleCopy}
                    title="Copy to clipboard"
                  >
                    <span>Copy</span>
                  </button>
                  <button 
                    className="btn btn-secondary buttons-excel buttons-html5" 
                    tabIndex={0} 
                    type="button"
                    onClick={handleExcel}
                    title="Export to Excel"
                  >
                    <span>Excel</span>
                  </button>
                  <button 
                    className="btn btn-secondary buttons-csv buttons-html5" 
                    tabIndex={0} 
                    type="button"
                    onClick={handleCSV}
                    title="Export to CSV"
                  >
                    <span>CSV</span>
                  </button>
                  <button 
                    className="btn btn-secondary buttons-pdf buttons-html5" 
                    tabIndex={0} 
                    type="button"
                    onClick={handlePDF}
                    title="Export to PDF"
                  >
                    <span>PDF</span>
                  </button>
                  <button 
                    className="btn btn-secondary buttons-print" 
                    tabIndex={0} 
                    type="button"
                    onClick={handlePrint}
                    title="Print"
                  >
                    <span>Print</span>
                  </button>
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
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                      }}
                    />
                  </label>
                </div>
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

          {/* Table */}
          <div className="row">
            <div className="col-12">
              <div className="table-responsive">
                <table className="table table-bordered datatable">
                  <thead>
                    <tr className="thead-light">
                      <th>S.No</th>
                      <th>Subject</th>
                      <th>Progress</th>
                      <th>Letter Number</th>
                      <th>Responsibility</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedDirectives.length > 0 ? (
                      paginatedDirectives.map((directive, index) => (
                        <tr key={directive.id}>
                          <td>{startIndex + index + 1}</td>
                          <td className="text">{directive.subject}</td>
                          <td className="text">{directive.comments || '-'}</td>
                          <td style={{ width: '100px' }}>
                            {new Date(directive.date).toLocaleDateString('en-GB')}
                            - <div style={{ width: '100px', wordWrap: 'break-word' }}>
                              {directive.letter_no}
                            </div>
                          </td>
                          <td style={{ width: '200px' }}>
                            {directive.departments.length > 0 ? (
                              <table className="table table-bordered">
                                <tbody>
                                  {directive.departments.map((dept: { id: number; name: string; status?: string | number }) => (
                                    <tr key={dept.id}>
                                      <td style={{ width: '60%', color: '#495057', backgroundColor: '#e9ecef', borderColor: '#c9ccd7' }}>
                                        {dept.name}
                                      </td>
                                      <td style={{ width: '40%' }}>
                                        <label className={`badge ${dept.status === 'Completed' ? 'badge-success' : dept.status === 'On Target' ? 'badge-info' : 'badge-danger'} badge-pill`}>
                                          {dept.status || 'N/A'}
                                        </label>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            ) : (
                              <span>No departments assigned</span>
                            )}
                          </td>
                          <td style={{ width: '15px', textAlign: 'center' }}>
                            {/* Edit Button */}
                            <button
                              className="btn btn-primary mb-2"
                              title="edit"
                              onClick={() => handleEditClick(directive)}
                            >
                              <i className="ti-pencil-alt"></i>
                            </button>

                            {/* Delete Button */}
                            <button
                              onClick={() => handleDelete(directive.id)}
                              className="btn btn-danger mb-2"
                              title="delete"
                              disabled={deleting === directive.id}
                            >
                              {deleting === directive.id ? (
                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                              ) : (
                                <i className="ti-trash"></i>
                              )}
                            </button>

                            {/* View Chat History (Replies) */}
                            <Link
                              to={`/admin/replies/directive/${directive.id}`}
                              className="btn btn-primary mb-2"
                              role="button"
                              title="View Chat history"
                            >
                              <i className="ti-comments"></i>
                            </Link>

                            {/* Related Departments */}
                            {directive.departments && directive.departments.length > 0 && (
                              <Link
                                to={`/admin/directives/${directive.id}/departments`}
                                className="btn btn-success"
                                role="button"
                                title="Related Departments"
                              >
                                <i className="ti-link"></i>
                              </Link>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7}>There is no data.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Pagination Footer */}
          <div className="card-footer mt-3 border">
            <div className="row align-items-center">
              <div className="col">
                <div className="form-group mb-0 row align-items-center">
                  <label htmlFor="perPage" className="col-sm-3 col-form-label mb-0">Show</label>
                  <select
                    id="perPage"
                    className="form-control form-control-sm col-sm-3"
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                  >
                    <option value="10">10</option>
                    <option value="15">15</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                  </select>
                  <span className="inline-block col-sm-6">per page</span>
                </div>
              </div>
              <div className="col text-center">
                <p className="mb-0">
                  Showing <strong>{startIndex + 1}</strong> to{' '}
                  <strong>{Math.min(endIndex, USE_MOCK_DATA ? filteredDirectives.length : total)}</strong> of total{' '}
                  <strong>{USE_MOCK_DATA ? filteredDirectives.length : total}</strong> records.
                </p>
              </div>
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
                      {[...Array(Math.min(5, totalPages))].map((_, index) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = index + 1;
                        } else if (currentPage <= 3) {
                          pageNum = index + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + index;
                        } else {
                          pageNum = currentPage - 2 + index;
                        }
                        return (
                          <li key={index} className={`page-item ${currentPage === pageNum ? 'active' : ''}`}>
                            <button className="page-link" onClick={() => setCurrentPage(pageNum)}>
                              {pageNum}
                            </button>
                          </li>
                        );
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
            </>
          )}
        </div>
      </div>

      {/* Edit Directive Modal */}
      <EditDirectiveModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedDirective(null);
        }}
        directive={selectedDirective}
        onSubmit={async (data) => {
          if (!selectedDirective) return;

          try {
            if (USE_MOCK_DATA) {
              alert('Directive updated successfully! (Mock mode)');
            } else {
              const updateData = {
                title: data.subject,
                description: data.comments,
                referenceNumber: data.letter_no,
                deadline: data.date,
                status: data.status === 'Completed' ? 1 : data.status === 'On Target' ? 2 : 3,
              };

              const response = await directiveService.updateDirective(selectedDirective.id, updateData);
              
              if (response.success) {
                await fetchDirectives();
                alert('Directive updated successfully!');
              } else {
                alert(response.message || 'Failed to update directive');
                return;
              }
            }
            setShowEditModal(false);
            setSelectedDirective(null);
          } catch (err: any) {
            console.error('Error updating directive:', err);
            alert(err.response?.data?.error?.message || 'Failed to update directive');
          }
        }}
      />
    </div>
  );
}
