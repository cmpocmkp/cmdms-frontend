/**
 * Announcements List - Admin Module
 * EXACT replica of admin/announcements/index.blade.php from old CMDMS
 * Integrated with real API following API_INTEGRATION_GUIDE.md
 */

import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as announcementService from '../../../lib/services/announcementService';
import { mapAnnouncementToDisplay, type DisplayAnnouncement } from '../../../lib/utils/announcementMapper';
import { USE_MOCK_DATA } from '../../../lib/api';
import { mockAnnouncements } from '../../../lib/mocks/data/announcements';

export default function AnnouncementsList() {
  const [announcements, setAnnouncements] = useState<DisplayAnnouncement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [deleting, setDeleting] = useState<number | null>(null);

  // Fetch announcements from API
  useEffect(() => {
    fetchAnnouncements();
  }, [currentPage, itemsPerPage, searchTerm]);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      setError(null);

      if (USE_MOCK_DATA) {
        // Use mock data - convert to display format
        const mockDisplay = mockAnnouncements.map((ann: any) => ({
          id: ann.id,
          title: `${ann.district_name} - ${ann.venue}`,
          description: ann.venue,
          startDate: ann.date,
          departmentIds: [ann.district_id],
          departments: [{ id: ann.district_id, name: ann.district_name }],
        }));
        setAnnouncements(mockDisplay as DisplayAnnouncement[]);
        setTotal(mockAnnouncements.length);
        setTotalPages(Math.ceil(mockAnnouncements.length / itemsPerPage));
      } else {
        // Real API call
        const params: announcementService.ListAnnouncementsParams = {
          page: currentPage,
          limit: itemsPerPage,
        };

        if (searchTerm) {
          params.search = searchTerm;
        }

        const response = await announcementService.listAnnouncements(params);

        if (response.success && response.data) {
          // Map API response to display format
          const mappedAnnouncements = response.data.map(mapAnnouncementToDisplay);
          setAnnouncements(mappedAnnouncements);
          setTotal(response.meta?.total || mappedAnnouncements.length);
          setTotalPages(response.meta?.totalPages || Math.ceil(mappedAnnouncements.length / itemsPerPage));
        } else {
          setError(response.message || 'Failed to load announcements');
        }
      }
    } catch (err: any) {
      console.error('Error fetching announcements:', err);
      setError(err.response?.data?.error?.message || 'Failed to load announcements');
    } finally {
      setLoading(false);
    }
  };

  // For real API, filtering is done server-side, so we use announcements directly
  // For mock data, we still do client-side filtering
  const filteredAnnouncements = useMemo(() => {
    if (USE_MOCK_DATA) {
      if (!searchTerm) return announcements;
      
      return announcements.filter(announcement =>
        announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        announcement.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    // For real API, announcements are already filtered server-side
    return announcements;
  }, [announcements, searchTerm, USE_MOCK_DATA]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedAnnouncements = USE_MOCK_DATA 
    ? filteredAnnouncements.slice(startIndex, endIndex)
    : filteredAnnouncements; // API already returns paginated data

  const handleDelete = async (announcementId: number) => {
    if (!confirm('Are you sure you want to delete this announcement? This action cannot be undone.')) {
      return;
    }

    try {
      setDeleting(announcementId);
      
      if (USE_MOCK_DATA) {
        // Mock delete
        setAnnouncements(announcements.filter(a => a.id !== announcementId));
        alert('Announcement deleted successfully!');
      } else {
        // Real API delete
        const response = await announcementService.deleteAnnouncement(announcementId);
        
        if (response.success) {
          // Refresh the list
          await fetchAnnouncements();
          alert('Announcement deleted successfully!');
        } else {
          alert(response.message || 'Failed to delete announcement');
        }
      }
    } catch (err: any) {
      console.error('Error deleting announcement:', err);
      alert(err.response?.data?.error?.message || 'Failed to delete announcement');
    } finally {
      setDeleting(null);
    }
  };

  // Export Functions - Matching old CMDMS DataTables functionality
  const handleCopy = () => {
    const headers = ['S.No', 'Title', 'Description', 'Date', 'Departments'];
    const rows = filteredAnnouncements.map((ann, idx) => [
      idx + 1,
      ann.title,
      ann.description?.replace(/<[^>]*>/g, '') || '',
      ann.startDate ? new Date(ann.startDate).toLocaleDateString('en-GB') : '',
      ann.departments?.map(d => d.name).join(', ') || ''
    ]);
    
    const text = [headers, ...rows].map(row => row.join('\t')).join('\n');
    navigator.clipboard.writeText(text).then(() => {
      alert('Copied to clipboard!');
    }).catch(() => {
      alert('Failed to copy to clipboard');
    });
  };

  const handleExcel = () => {
    const headers = ['S.No', 'Title', 'Description', 'Date', 'Departments'];
    const rows = filteredAnnouncements.map((ann, idx) => [
      idx + 1,
      ann.title,
      ann.description?.replace(/<[^>]*>/g, '') || '',
      ann.startDate ? new Date(ann.startDate).toLocaleDateString('en-GB') : '',
      ann.departments?.map(d => d.name).join(', ') || ''
    ]);
    
    let csv = headers.join(',') + '\n';
    rows.forEach(row => {
      csv += row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',') + '\n';
    });
    
    const blob = new Blob([csv], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `announcements_${new Date().toISOString().split('T')[0]}.xls`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const handleCSV = () => {
    const headers = ['S.No', 'Title', 'Description', 'Date', 'Departments'];
    const rows = filteredAnnouncements.map((ann, idx) => [
      idx + 1,
      ann.title,
      ann.description?.replace(/<[^>]*>/g, '') || '',
      ann.startDate ? new Date(ann.startDate).toLocaleDateString('en-GB') : '',
      ann.departments?.map(d => d.name).join(', ') || ''
    ]);
    
    let csv = headers.join(',') + '\n';
    rows.forEach(row => {
      csv += row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',') + '\n';
    });
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `announcements_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const handlePDF = async () => {
    try {
      const pdfMake = await import('pdfmake/build/pdfmake');
      const pdfFonts = await import('pdfmake/build/vfs_fonts');
      
      (pdfMake as any).vfs = (pdfFonts as any).pdfMake?.vfs || (pdfFonts as any).default?.pdfMake?.vfs;
      
      const tableData = [
        ['S.No', 'Title', 'Description', 'Date', 'Departments']
      ];
      
      filteredAnnouncements.forEach((ann, idx) => {
        tableData.push([
          String(idx + 1),
          ann.title.substring(0, 100),
          ann.description?.replace(/<[^>]*>/g, '').substring(0, 150) || '',
          ann.startDate ? new Date(ann.startDate).toLocaleDateString('en-GB') : '',
          ann.departments?.map(d => d.name).join(', ').substring(0, 80) || ''
        ]);
      });
      
      const docDefinition: any = {
        pageOrientation: 'landscape',
        pageSize: 'A4',
        pageMargins: [40, 60, 40, 60],
        content: [
          {
            text: 'Announcements',
            style: 'header',
            margin: [0, 0, 0, 20]
          },
          {
            table: {
              headerRows: 1,
              widths: ['auto', 'auto', '*', 'auto'],
              body: tableData
            },
            layout: {
              fillColor: function (rowIndex: number) {
                return rowIndex === 0 ? '#CCCCCC' : (rowIndex % 2 === 0 ? '#F3F3F3' : null);
              },
              hLineWidth: () => 1,
              vLineWidth: () => 1,
              hLineColor: () => '#AAAAAA',
              vLineColor: () => '#AAAAAA'
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
      
      pdfMake.default.createPdf(docDefinition).download(`announcements_${new Date().toISOString().split('T')[0]}.pdf`);
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
    
    printWindow.document.write('<html><head><title>Announcements</title>');
    printWindow.document.write('<style>');
    printWindow.document.write('body { font-family: Arial, sans-serif; margin: 20px; }');
    printWindow.document.write('h1 { color: #333; }');
    printWindow.document.write('table { border-collapse: collapse; width: 100%; margin-top: 20px; }');
    printWindow.document.write('th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 12px; }');
    printWindow.document.write('th { background-color: #f2f2f2; font-weight: bold; }');
    printWindow.document.write('tr:nth-child(even) { background-color: #f9f9f9; }');
    printWindow.document.write('@media print { body { margin: 0; } }');
    printWindow.document.write('</style></head><body>');
    printWindow.document.write('<h1>Announcements</h1>');
    printWindow.document.write('<table>');
    printWindow.document.write('<thead><tr>');
    printWindow.document.write('<th>S.No</th><th>Title</th><th>Description</th><th>Date</th><th>Departments</th>');
    printWindow.document.write('</tr></thead><tbody>');
    
    filteredAnnouncements.forEach((ann, idx) => {
      printWindow.document.write('<tr>');
      printWindow.document.write(`<td>${idx + 1}</td>`);
      printWindow.document.write(`<td>${ann.title}</td>`);
      printWindow.document.write(`<td>${ann.description?.replace(/<[^>]*>/g, '') || ''}</td>`);
      printWindow.document.write(`<td>${ann.startDate ? new Date(ann.startDate).toLocaleDateString('en-GB') : ''}</td>`);
      printWindow.document.write(`<td>${ann.departments?.map(d => d.name).join(', ') || ''}</td>`);
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
      <div className="card">
        <div className="card-header">
          <div className="d-flex gap-3 justify-content-between align-items-center">
            <div className="flex-grow-1 text-center">
              <p className="block display-4">Announcements</p>
            </div>
            <div>
              <Link 
                to="/admin/announcements/add" 
                className="btn btn-outline-primary btn-fw"
              >
                <i className="ti-plus mr-1"></i>Add Announcement
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
              <p className="mt-2 text-muted">Loading announcements...</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="alert alert-danger" role="alert">
              <i className="ti-alert-circle mr-2"></i>
              <strong>Error:</strong> {error}
              <button 
                className="btn btn-sm btn-outline-danger ml-3" 
                onClick={fetchAnnouncements}
              >
                Retry
              </button>
            </div>
          )}

          {/* Content */}
          {!loading && !error && (
            <>
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

          <div className="row">
            <div className="col-12">
              <div className="table-responsive">
                <table className="table datatable table-striped" role="grid">
                  <thead className="thead-light">
                    <tr>
                      <th>S.NO</th>
                      <th>Title</th>
                      <th>Description</th>
                      <th>Date</th>
                      <th>Departments</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedAnnouncements.length > 0 ? (
                      paginatedAnnouncements.map((announcement, index) => (
                        <tr key={announcement.id}>
                          <td>{startIndex + index + 1}</td>
                          <td>{announcement.title}</td>
                          <td dangerouslySetInnerHTML={{ __html: announcement.description || '' }}></td>
                          <td>{announcement.startDate ? new Date(announcement.startDate).toLocaleDateString('en-GB') : '-'}</td>
                          <td>{announcement.departments?.map(d => d.name).join(', ') || '-'}</td>
                          <td>
                            <Link
                              to={`/admin/announcements/edit/${announcement.id}`}
                              className="btn btn-info"
                              title="View Announcement details"
                            >
                              <i className="ti-eye"></i>
                            </Link>

                            <Link
                              to={`/admin/announcements/edit/${announcement.id}`}
                              className="btn btn-primary ml-2"
                              title="Edit Announcement"
                            >
                              <i className="ti-pencil"></i>
                            </Link>

                            <button
                              className="btn btn-danger ml-2"
                              title="Delete Announcement"
                              onClick={() => handleDelete(announcement.id)}
                              disabled={deleting === announcement.id}
                            >
                              {deleting === announcement.id ? (
                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                              ) : (
                                <i className="ti-trash"></i>
                              )}
                            </button>
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
            </>
          )}

        </div>

        {/* Pagination Footer - Matching old CMDMS */}
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
            {/* Records Information */}
            <div className="col text-center">
              <p className="mb-0">
                Showing <strong>{startIndex + 1}</strong> to{' '}
                <strong>{Math.min(endIndex, USE_MOCK_DATA ? filteredAnnouncements.length : total)}</strong> of total{' '}
                <strong>{USE_MOCK_DATA ? filteredAnnouncements.length : total}</strong> records.
              </p>
            </div>
            {/* Pagination Links */}
            <div className="col d-flex justify-content-end">
              <nav>
                <ul className="pagination mb-0">
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
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
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
