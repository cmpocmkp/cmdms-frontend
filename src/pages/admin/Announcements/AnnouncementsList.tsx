/**
 * Announcements List - Admin Module
 * EXACT replica of admin/announcements/index.blade.php from old CMDMS
 */

import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { mockAnnouncements } from '../../../lib/mocks/data/announcements';

export default function AnnouncementsList() {
  const [announcements] = useState(mockAnnouncements);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);

  const filteredAnnouncements = useMemo(() => {
    if (!searchTerm) return announcements;
    
    return announcements.filter(announcement =>
      announcement.district_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      announcement.venue.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [announcements, searchTerm]);

  const totalPages = Math.ceil(filteredAnnouncements.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedAnnouncements = filteredAnnouncements.slice(startIndex, endIndex);

  // Export Functions - Matching old CMDMS DataTables functionality
  const handleCopy = () => {
    const headers = ['S.No', 'District', 'Venue', 'Visit Date'];
    const rows = filteredAnnouncements.map((ann, idx) => [
      idx + 1,
      ann.district_name,
      ann.venue.replace(/<[^>]*>/g, ''),
      new Date(ann.date).toLocaleDateString('en-GB')
    ]);
    
    const text = [headers, ...rows].map(row => row.join('\t')).join('\n');
    navigator.clipboard.writeText(text).then(() => {
      alert('Copied to clipboard!');
    }).catch(() => {
      alert('Failed to copy to clipboard');
    });
  };

  const handleExcel = () => {
    const headers = ['S.No', 'District', 'Venue', 'Visit Date'];
    const rows = filteredAnnouncements.map((ann, idx) => [
      idx + 1,
      ann.district_name,
      ann.venue.replace(/<[^>]*>/g, ''),
      new Date(ann.date).toLocaleDateString('en-GB')
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
    const headers = ['S.No', 'District', 'Venue', 'Visit Date'];
    const rows = filteredAnnouncements.map((ann, idx) => [
      idx + 1,
      ann.district_name,
      ann.venue.replace(/<[^>]*>/g, ''),
      new Date(ann.date).toLocaleDateString('en-GB')
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
        ['S.No', 'District', 'Venue', 'Visit Date']
      ];
      
      filteredAnnouncements.forEach((ann, idx) => {
        tableData.push([
          String(idx + 1),
          ann.district_name,
          ann.venue.replace(/<[^>]*>/g, '').substring(0, 150),
          new Date(ann.date).toLocaleDateString('en-GB')
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
    printWindow.document.write('<th>S.No</th><th>District</th><th>Venue</th><th>Visit Date</th>');
    printWindow.document.write('</tr></thead><tbody>');
    
    filteredAnnouncements.forEach((ann, idx) => {
      printWindow.document.write('<tr>');
      printWindow.document.write(`<td>${idx + 1}</td>`);
      printWindow.document.write(`<td>${ann.district_name}</td>`);
      printWindow.document.write(`<td>${ann.venue.replace(/<[^>]*>/g, '')}</td>`);
      printWindow.document.write(`<td>${new Date(ann.date).toLocaleDateString('en-GB')}</td>`);
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
                      <th>District</th>
                      <th>Venue</th>
                      <th>Visit Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedAnnouncements.length > 0 ? (
                      paginatedAnnouncements.map((announcement, index) => (
                        <tr key={announcement.id}>
                          <td>{startIndex + index + 1}</td>
                          <td>{announcement.district_name}</td>
                          <td dangerouslySetInnerHTML={{ __html: announcement.venue }}></td>
                          <td>{new Date(announcement.date).toLocaleDateString('en-GB')}</td>
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

                            {announcement.announcements_count === 0 && (
                              <button
                                className="btn btn-danger ml-2"
                                title="Delete Announcement"
                                onClick={() => {
                                  if (confirm('Are you sure you want to delete?')) {
                                    console.log('Delete announcement:', announcement.id);
                                    alert('Delete functionality will be implemented with backend API');
                                  }
                                }}
                              >
                                <i className="ti-trash"></i>
                              </button>
                            )}
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
                <strong>{Math.min(endIndex, filteredAnnouncements.length)}</strong> of total{' '}
                <strong>{filteredAnnouncements.length}</strong> records.
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
