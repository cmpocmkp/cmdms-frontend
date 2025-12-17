/**
 * Trackers List - Admin Module
 * EXACT replica of admin/interventions/index_new.blade.php from old CMDMS
 */

import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { mockTrackers, Tracker } from '../../../lib/mocks/data/trackers';
import { mockDepartments } from '../../../lib/mocks/data/departments';
import { TrackerModal } from '../../../components/trackers/TrackerModal';

export default function TrackersList() {
  const [trackers] = useState(mockTrackers);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' or status value
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const [showTrackerModal, setShowTrackerModal] = useState(false);
  const [editingTracker, setEditingTracker] = useState<Tracker | null>(null);

  const filteredTrackers = useMemo(() => {
    let filtered = trackers;

    if (searchTerm) {
      filtered = filtered.filter(tracker =>
        tracker.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tracker.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (departmentFilter) {
      filtered = filtered.filter(tracker => tracker.department_id === Number(departmentFilter));
    }

    if (statusFilter && statusFilter !== 'all') {
      filtered = filtered.filter(tracker => tracker.status === statusFilter);
    }

    return filtered;
  }, [trackers, searchTerm, departmentFilter, statusFilter]);

  // Calculate filtered status counts
  const filteredStatusCounts = useMemo(() => {
    const counts = {
      all: filteredTrackers.length,
      completed: filteredTrackers.filter(t => t.status === '1').length,
      on_target: filteredTrackers.filter(t => t.status === '2').length,
      overdue: filteredTrackers.filter(t => t.status === '3').length,
      off_target: filteredTrackers.filter(t => t.status === '4').length
    };
    return counts;
  }, [filteredTrackers]);

  // Status cards configuration
  const total = filteredStatusCounts.all;
  const statusCards = [
    {
      status: 'all',
      borderColor: '#3282FF',
      title: 'Total',
      count: filteredStatusCounts.all,
      icon: 'ti-list',
      countId: 'count-all',
      minutesClass: 'total_minutes',
    },
    {
      status: '1',
      borderColor: '#0E8160',
      title: 'Completed',
      count: filteredStatusCounts.completed,
      icon: 'ti-check',
      countId: 'count-completed',
      minutesClass: 'completed_minutes',
    },
    {
      status: '2',
      borderColor: '#1DC39F',
      title: 'On Target',
      count: filteredStatusCounts.on_target,
      icon: 'ti-target',
      countId: 'count-on_target',
      minutesClass: 'on_target_minutes',
    },
    {
      status: '4',
      borderColor: '#E74039',
      title: 'Off Target',
      count: filteredStatusCounts.off_target,
      icon: 'ti-alert',
      countId: 'count-off_target',
      minutesClass: 'off_target_minutes',
    },
    {
      status: '3',
      borderColor: '#FD7E01',
      title: 'Overdue',
      count: filteredStatusCounts.overdue,
      icon: 'ti-timer',
      countId: 'count-overdue',
      minutesClass: 'overdue_minutes',
    },
  ];

  const totalPages = Math.ceil(filteredTrackers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedTrackers = filteredTrackers.slice(startIndex, endIndex);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setDepartmentFilter('');
    setStatusFilter('all');
    setCurrentPage(1);
  };

  const handleCardClick = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handlePerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleDelete = (trackerId: number) => {
    if (confirm('Are you sure you want to delete this tracker? All associated activities will also be deleted permanently.')) {
      console.log('Delete tracker:', trackerId);
      alert('Delete functionality will be implemented with backend API');
    }
  };

  const handleAddTracker = () => {
    setEditingTracker(null);
    setShowTrackerModal(true);
  };

  const handleEditTracker = (tracker: Tracker) => {
    setEditingTracker(tracker);
    setShowTrackerModal(true);
  };

  const handleSaveTracker = (trackerData: { title: string; description: string; attachments: File[] }) => {
    if (editingTracker) {
      console.log('Update tracker:', editingTracker.id, trackerData);
      alert('Tracker will be updated via API');
    } else {
      console.log('Create tracker:', trackerData);
      alert('Tracker will be created via API');
    }
    setShowTrackerModal(false);
    setEditingTracker(null);
  };

  // Export Functions - Matching DataTables functionality
  const handleCopy = () => {
    const headers = ['S.No', 'Title', 'Description', 'Activities Count', 'Created Date'];
    const rows = filteredTrackers.map((tracker, idx) => [
      idx + 1,
      tracker.title.replace(/<[^>]*>/g, ''),
      tracker.description.replace(/<[^>]*>/g, '').substring(0, 100),
      tracker.activities_count,
      new Date(tracker.created_at).toLocaleDateString('en-GB')
    ]);
    
    const text = [headers, ...rows].map(row => row.join('\t')).join('\n');
    navigator.clipboard.writeText(text).then(() => {
      alert('Copied to clipboard!');
    }).catch(() => {
      alert('Failed to copy to clipboard');
    });
  };

  const handleExcel = () => {
    const headers = ['S.No', 'Title', 'Description', 'Activities Count', 'Created Date'];
    const rows = filteredTrackers.map((tracker, idx) => [
      idx + 1,
      tracker.title.replace(/<[^>]*>/g, ''),
      tracker.description.replace(/<[^>]*>/g, '').substring(0, 100),
      tracker.activities_count,
      new Date(tracker.created_at).toLocaleDateString('en-GB')
    ]);
    
    let csv = headers.join(',') + '\n';
    rows.forEach(row => {
      csv += row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',') + '\n';
    });
    
    const blob = new Blob([csv], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `trackers_${new Date().toISOString().split('T')[0]}.xls`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const handleCSV = () => {
    const headers = ['S.No', 'Title', 'Description', 'Activities Count', 'Created Date'];
    const rows = filteredTrackers.map((tracker, idx) => [
      idx + 1,
      tracker.title.replace(/<[^>]*>/g, ''),
      tracker.description.replace(/<[^>]*>/g, '').substring(0, 100),
      tracker.activities_count,
      new Date(tracker.created_at).toLocaleDateString('en-GB')
    ]);
    
    let csv = headers.join(',') + '\n';
    rows.forEach(row => {
      csv += row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',') + '\n';
    });
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `trackers_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const handlePDF = async () => {
    try {
      const pdfMake = await import('pdfmake/build/pdfmake');
      const pdfFonts = await import('pdfmake/build/vfs_fonts');
      
      (pdfMake as any).vfs = (pdfFonts as any).pdfMake?.vfs || (pdfFonts as any).default?.pdfMake?.vfs;
      
      const tableData = [
        ['S.No', 'Title', 'Description', 'Activities Count', 'Created Date']
      ];
      
      filteredTrackers.forEach((tracker, idx) => {
        tableData.push([
          String(idx + 1),
          tracker.title.replace(/<[^>]*>/g, '').substring(0, 60),
          tracker.description.replace(/<[^>]*>/g, '').substring(0, 80),
          String(tracker.activities_count),
          new Date(tracker.created_at).toLocaleDateString('en-GB')
        ]);
      });
      
      const docDefinition: any = {
        pageOrientation: 'landscape',
        pageSize: 'A4',
        pageMargins: [40, 60, 40, 60],
        content: [
          {
            text: 'Trackers',
            style: 'header',
            margin: [0, 0, 0, 20]
          },
          {
            table: {
              headerRows: 1,
              widths: ['auto', '*', '*', 'auto', 'auto'],
              body: tableData
            },
            layout: 'lightHorizontalLines'
          }
        ],
        styles: {
          header: {
            fontSize: 18,
            bold: true,
            alignment: 'center'
          }
        }
      };
      
      (pdfMake as any).createPdf(docDefinition).download(`trackers_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups to use print functionality');
      return;
    }
    
    printWindow.document.write('<html><head><title>Trackers</title>');
    printWindow.document.write('<style>');
    printWindow.document.write('body { font-family: Arial, sans-serif; margin: 20px; }');
    printWindow.document.write('h1 { color: #333; }');
    printWindow.document.write('table { border-collapse: collapse; width: 100%; margin-top: 20px; }');
    printWindow.document.write('th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 12px; }');
    printWindow.document.write('th { background-color: #f2f2f2; font-weight: bold; }');
    printWindow.document.write('tr:nth-child(even) { background-color: #f9f9f9; }');
    printWindow.document.write('@media print { body { margin: 0; } }');
    printWindow.document.write('</style></head><body>');
    printWindow.document.write('<h1>Trackers</h1>');
    printWindow.document.write('<table>');
    printWindow.document.write('<thead><tr>');
    printWindow.document.write('<th>S.No</th><th>Title</th><th>Description</th><th>Activities Count</th><th>Created Date</th>');
    printWindow.document.write('</tr></thead><tbody>');
    
    filteredTrackers.forEach((tracker, idx) => {
      printWindow.document.write('<tr>');
      printWindow.document.write(`<td>${idx + 1}</td>`);
      printWindow.document.write(`<td>${tracker.title.replace(/<[^>]*>/g, '')}</td>`);
      printWindow.document.write(`<td>${tracker.description.replace(/<[^>]*>/g, '').substring(0, 100)}</td>`);
      printWindow.document.write(`<td>${tracker.activities_count}</td>`);
      printWindow.document.write(`<td>${new Date(tracker.created_at).toLocaleDateString('en-GB')}</td>`);
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

  const perPageOptions = [10, 15, 25, 50, 100];

  // Check if filter is applied to determine initial collapse state
  const isFilterApplied = searchTerm || departmentFilter || (statusFilter && statusFilter !== 'all');

  return (
    <div className="content-wrapper">
      <style>
        {`
          table .btn {
            padding: 0.3rem !important;
            vertical-align: top;
          }

          table .btn i {
            margin-top: .4rem;
            margin-right: 0 !important;
          }

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

          /* DataTables Export Buttons Styling */
          .dt-buttons {
            display: inline-block;
          }
          .dt-buttons .btn {
            margin-right: 0.25rem;
          }
        `}
      </style>
      <div className="card">
        <div className="card-header text-center">
          <div className="d-flex gap-3 justify-content-between align-items-center">
            <div className="flex-grow-1 text-center">
              <p className="block display-4">Trackers</p>
            </div>
            <div>
              <div className="btn-toolbar pull-right">
                <div className="btn-group">
                  <button 
                    className="btn btn-primary"
                    onClick={handleAddTracker}
                  >
                    <i className="ti-plus"></i> Add Tracker
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="card-body">
          {/* Status Cards */}
          <div className="row my-5 d-flex justify-content-center">
            {statusCards.map(card => {
              const percent = (total > 0 && card.status !== 'all' && card.count > 0)
                ? `${Math.round((card.count / total) * 100 * 10) / 10}%`
                : '\u00A0';
              
              const isActive = statusFilter === card.status;
              
              return (
                <div key={card.status} className="col-md-2 p-2">
                  <div
                    className="card record-notes-custom-card-analytics status-card"
                    data-status={card.status}
                    data-border={card.borderColor}
                    onClick={() => handleCardClick(card.status)}
                    style={{
                      cursor: 'pointer',
                      borderBottom: `8px solid ${card.borderColor}`,
                      border: isActive ? `8px solid ${card.borderColor}` : '2px solid #e3e3e3'
                    }}
                  >
                    <div className="card-body text-center">
                      <div className="icon" style={{ background: card.borderColor }}>
                        <i className={card.icon}></i>
                      </div>
                      <h3
                        id={card.countId}
                        className={`mb-2 ${card.minutesClass}`}
                        style={{ color: card.borderColor }}
                      >
                        {card.count}
                      </h3>
                      <p className="mb-0">{card.title}</p>
                      <p className={`mb-0 mt-2 ${card.minutesClass}_percent`}>
                        {percent}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

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
                  <span style={{ fontSize: '1rem', fontWeight: '400' }}>Filter Trackers</span>
                  <button 
                    type="button" 
                    className="btn"
                    onClick={() => setIsFilterExpanded(!isFilterExpanded)}
                    style={{ cursor: 'pointer', padding: '0.25rem 0.5rem' }}
                  >
                    <i className={`fa ${isFilterExpanded ? 'fa-minus' : 'fa-plus'}`}></i>
                  </button>
                </div>
                <div className={`card-body collapse ${isFilterExpanded || isFilterApplied ? 'show' : ''}`} id="filterCardBody">
                  <form onSubmit={handleSearch}>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group">
                          <label htmlFor="search">Title | Activity</label>
                          <input 
                            type="text" 
                            name="search" 
                            className="form-control"
                            placeholder="Search interventions or activities..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label htmlFor="department_id">Department</label>
                          <select 
                            name="department_id" 
                            className="form-control"
                            value={departmentFilter}
                            onChange={(e) => setDepartmentFilter(e.target.value)}
                          >
                            <option value="">All Departments</option>
                            {mockDepartments.map(dept => (
                              <option key={dept.id} value={dept.id}>
                                {dept.name.replace(/<[^>]*>/g, '')}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group">
                          <label htmlFor="status">Status</label>
                          <select 
                            name="status" 
                            className="form-control"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                          >
                            <option value="">All Status</option>
                            <option value="1">Completed</option>
                            <option value="2">On Target</option>
                            <option value="4">Off Target</option>
                            <option value="3">Overdue</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <button type="submit" className="btn btn-primary">Search</button>
                    <a 
                      href="/admin/trackers" 
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

          {/* DataTables Export Buttons and Search Section */}
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

          {/* DataTable */}
          <table id="interventionsTable" className="table table-bordered" style={{ width: '100%' }}>
            <thead>
              <tr className="thead-light">
                <th>#</th>
                <th>Title</th>
                <th>Description</th>
                <th>Activities Count</th>
                <th>Created Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedTrackers.length > 0 ? (
                paginatedTrackers.map((tracker, index) => (
                  <tr key={tracker.id}>
                    <td>{startIndex + index + 1}</td>
                    <td className="text">
                      <Link to={`/admin/trackers/show/${tracker.id}`}>
                        {tracker.title}
                      </Link>
                    </td>
                    <td>
                      <div 
                        dangerouslySetInnerHTML={{ __html: tracker.description.substring(0, 100) + (tracker.description.length > 100 ? '...' : '') }}
                      />
                    </td>
                    <td className="text-center">
                      <span className="badge badge-primary">{tracker.activities_count}</span>
                    </td>
                    <td>
                      {new Date(tracker.created_at).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      })}
                    </td>
                    <td>
                      <Link
                        to={`/admin/trackers/show/${tracker.id}`}
                        className="btn btn-info mt-1"
                        title="View Tracker"
                      >
                        <i className="ti-eye mr-1"></i>
                      </Link>
                      <button
                        type="button"
                        className="btn btn-primary mt-1"
                        title="Edit Tracker"
                        onClick={() => handleEditTracker(tracker)}
                      >
                        <i className="ti-pencil-alt mr-1"></i>
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-danger mt-1"
                        title="Delete Tracker"
                        onClick={() => handleDelete(tracker.id)}
                      >
                        <i className="ti-trash mr-1"></i>
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
                Showing <strong>{filteredTrackers.length > 0 ? startIndex + 1 : 0}</strong> to{' '}
                <strong>{Math.min(endIndex, filteredTrackers.length)}</strong> of total{' '}
                <strong>{filteredTrackers.length}</strong> records.
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

      {/* Tracker Modal */}
      <TrackerModal
        open={showTrackerModal}
        onOpenChange={setShowTrackerModal}
        tracker={editingTracker}
        onSave={handleSaveTracker}
      />
    </div>
  );
}
