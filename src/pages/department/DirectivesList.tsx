/**
 * Department Directives List Page
 * Based on department/directives/index.blade.php from old CMDMS
 * EXACT replica - structure, classes, and behavior preserved
 */

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { mockDirectives } from '../../lib/mocks/data/directives';

// Helper to get badge class based on status (supports both string and number)
const getBadgeClass = (status: string | number) => {
  const statusStr = typeof status === 'number' ? String(status) : status;
  switch (statusStr) {
    case '1':
    case 'Completed': return 'badge-success';
    case '2':
    case 'On Target': return 'badge-info';
    case '3':
    case 'Overdue': return 'badge-danger';
    case 'Pending': return 'badge-warning';
    default: return 'badge-secondary';
  }
};

// Helper to get status label from number
const getStatusLabel = (status: string | number): string => {
  const statusStr = typeof status === 'number' ? String(status) : status;
  switch (statusStr) {
    case '1': return 'Completed';
    case '2': return 'On Target';
    case '3': return 'Overdue';
    default: return statusStr;
  }
};

export default function DirectivesList() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const statusFilter = searchParams.get('status') || '';
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const tableRef = useRef<HTMLTableElement>(null);
  const dataTableRef = useRef<any>(null);

  const departmentId = user?.department_id;

  // Filter directives assigned to this department
  const filteredDirectives = useMemo(() => {
    if (!departmentId) return [];
    
    let directives = mockDirectives.filter(directive =>
      directive.departments.some(dept => dept.id === departmentId)
    );

    // Filter by status if provided
    if (statusFilter) {
      directives = directives.filter(directive => {
        const dept = directive.departments.find(d => d.id === departmentId);
        const directiveStatus = dept?.status || directive.status;
        // Convert to number for comparison
        const statusNum = typeof directiveStatus === 'string' 
          ? (directiveStatus === 'Completed' ? 1 : directiveStatus === 'On Target' ? 2 : directiveStatus === 'Overdue' ? 3 : 0)
          : directiveStatus;
        return String(statusNum) === statusFilter;
      });
    }

    return directives;
  }, [departmentId, statusFilter]);

  // Calculate summary for department
  const summary = useMemo(() => {
    if (!departmentId) {
      return {
        total: 0,
        'Completed': { count: 0, percent: 0 },
        'On Target': { count: 0, percent: 0 },
        'Overdue': { count: 0, percent: 0 }
      };
    }

    const allDirectives = mockDirectives.filter(directive =>
      directive.departments.some(dept => dept.id === departmentId)
    );

    const total = allDirectives.length;
    const completed = allDirectives.filter(d => {
      const dept = d.departments.find(dept => dept.id === departmentId);
      const status = dept?.status || d.status;
      return status === 'Completed' || status === 1 || String(status) === '1';
    }).length;
    const onTarget = allDirectives.filter(d => {
      const dept = d.departments.find(dept => dept.id === departmentId);
      const status = dept?.status || d.status;
      return status === 'On Target' || status === 2 || String(status) === '2';
    }).length;
    const overdue = allDirectives.filter(d => {
      const dept = d.departments.find(dept => dept.id === departmentId);
      const status = dept?.status || d.status;
      return status === 'Overdue' || status === 3 || String(status) === '3';
    }).length;

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
  }, [departmentId]);

  // Pagination - removed for DataTable (DataTable handles pagination)
  // Keep for fallback display
  const totalPages = Math.ceil(filteredDirectives.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const statusCards = [
    { status: '', borderColor: '#3282FF', title: 'Total', count: summary.total, percent: 0, icon: 'ti-list' },
    { status: '1', borderColor: '#0E8160', title: 'Completed', count: summary['Completed'].count, percent: summary['Completed'].percent, icon: 'ti-check' },
    { status: '2', borderColor: '#1DC39F', title: 'On Target', count: summary['On Target'].count, percent: summary['On Target'].percent, icon: 'ti-target' },
    { status: '3', borderColor: '#E74039', title: 'Overdue', count: summary['Overdue'].count, percent: summary['Overdue'].percent, icon: 'ti-timer' },
  ];

  // Initialize DataTable
  // Only initialize once when component mounts or statusFilter changes
  // Don't re-initialize when filteredDirectives changes (that's just data)
  useEffect(() => {
    let isMounted = true;
    
    const loadScript = (src: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) {
          resolve();
          return;
        }
        const script = document.createElement('script');
        script.src = src;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
        document.head.appendChild(script);
      });
    };

    const initializeDataTable = async () => {
      if (!isMounted) return;
      
      try {
        // Load CSS first
        if (!document.querySelector('link[href*="dataTables.bootstrap4"]')) {
          const link1 = document.createElement('link');
          link1.rel = 'stylesheet';
          link1.href = 'https://cdn.datatables.net/1.13.7/css/dataTables.bootstrap4.min.css';
          document.head.appendChild(link1);
        }
        if (!document.querySelector('link[href*="buttons.dataTables"]')) {
          const link2 = document.createElement('link');
          link2.rel = 'stylesheet';
          link2.href = 'https://cdn.datatables.net/buttons/2.4.2/css/buttons.dataTables.min.css';
          document.head.appendChild(link2);
        }

        // Load jQuery first
        if (!(window as any).jQuery) {
          await loadScript('https://code.jquery.com/jquery-3.7.1.min.js');
        }

        // Wait a bit for jQuery to be ready
        await new Promise(resolve => setTimeout(resolve, 50));

        // Load DataTables core
        if (!(window as any).jQuery.fn.DataTable) {
          await loadScript('https://cdn.datatables.net/1.13.7/js/jquery.dataTables.min.js');
        }
        
        // Load Bootstrap 4 integration
        await loadScript('https://cdn.datatables.net/1.13.7/js/dataTables.bootstrap4.min.js');
        
        // Load Buttons extension
        await loadScript('https://cdn.datatables.net/buttons/2.4.2/js/dataTables.buttons.min.js');
        
        // Load dependencies for Excel export
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js');
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/pdfmake.min.js');
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/vfs_fonts.js');
        
        // Load HTML5 and Print buttons
        await loadScript('https://cdn.datatables.net/buttons/2.4.2/js/buttons.html5.min.js');
        await loadScript('https://cdn.datatables.net/buttons/2.4.2/js/buttons.print.min.js');

        // Wait for all scripts to be ready
        await new Promise(resolve => setTimeout(resolve, 100));

        if (!isMounted) return;

        const $ = (window as any).jQuery;

        // Verify DataTable is available
        if (!$.fn.DataTable) {
          console.error('DataTable plugin not loaded');
          return;
        }

        // Destroy existing DataTable if it exists
        if (dataTableRef.current) {
          try {
            dataTableRef.current.destroy();
            dataTableRef.current = null;
          } catch (e) {
            // Ignore destroy errors
          }
        }

        // Initialize DataTable with export buttons
        if (tableRef.current && tableRef.current.querySelector('tbody') && isMounted) {
          // Check if DataTable is already initialized - if so, skip re-initialization
          if ($.fn.DataTable.isDataTable(tableRef.current)) {
            console.log('DataTable already initialized, skipping...');
            return;
          }
          
          // Verify table structure before initializing
          const $table = $(tableRef.current);
          const $thead = $table.find('thead tr');
          const $tbody = $table.find('tbody');
          const $rows = $tbody.find('tr');
          
          // Count columns in thead
          const headerColCount = $thead.find('th').length;
          
          // Separate data rows from "no data" rows (rows with colspan)
          const rowsWithColspan: any[] = [];
          const dataRows: any[] = [];
          
          $rows.each(function(this: HTMLElement) {
            const $row = $(this);
            const $cells = $row.find('td');
            const colspan = $cells.first().attr('colspan');
            
            // If row has colspan, it's likely the "no data" row
            if (colspan && parseInt(colspan) === headerColCount) {
              rowsWithColspan.push($row);
            } else {
              // Verify regular rows have correct column count
              const cellCount = $cells.length;
              if (cellCount === headerColCount) {
                dataRows.push($row);
              } else {
                console.warn(`Row has ${cellCount} cells but header has ${headerColCount} columns.`);
              }
            }
          });
          
          // Only initialize DataTable if we have data rows
          if (dataRows.length === 0) {
            console.log('No data rows found. Skipping DataTable initialization.');
            return;
          }
          
          // Remove "no data" rows temporarily before initializing DataTable
          rowsWithColspan.forEach($row => {
            $row.detach();
          });
          
          dataTableRef.current = $(tableRef.current).DataTable({
            paging: true,
            pageLength: itemsPerPage,
            ordering: true,
            searching: true,
            info: true,
            dom: 'Bfrtip',
            stateSave: false,
            autoWidth: false,
            buttons: [
              {
                extend: 'excelHtml5',
                title: 'Directives',
                exportOptions: {
                  columns: ':visible'
                }
              },
              {
                extend: 'print',
                title: 'Directives',
                exportOptions: {
                  columns: ':visible'
                }
              }
            ],
            language: {
              search: '',
              searchPlaceholder: 'Search records...'
            },
            drawCallback: function(_settings: any) {
              if (!isMounted) return;
              
              // After each draw, ensure all rows and cells are visible
              const $table = $(tableRef.current);
              const $wrapper = $table.closest('.dataTables_wrapper');
              
              // Force visibility of table elements
              $wrapper.find('table').css({ display: 'table', visibility: 'visible' });
              $wrapper.find('tbody').css({ display: 'table-row-group', visibility: 'visible' });
              
              // Ensure all rows are visible with correct background
              $table.find('tbody tr').each(function(this: HTMLElement) {
                const $row = $(this);
                $row.css({ 
                  display: 'table-row', 
                  visibility: 'visible',
                  backgroundColor: '#f5f5f5'
                });
                
                // Ensure all cells are visible
                $row.find('td').each(function(this: HTMLElement) {
                  $(this).css({ display: 'table-cell', visibility: 'visible' });
                });
              });
            }
          });
          
          // Force visibility of buttons and search after initialization
          setTimeout(() => {
            if (!isMounted) return;
            
            const wrapper = $(tableRef.current).closest('.dataTables_wrapper');
            if (wrapper.length) {
              wrapper.find('.dt-buttons').css({ 
                display: 'inline-block', 
                visibility: 'visible',
                opacity: '1'
              });
              wrapper.find('.dataTables_filter').css({ 
                display: 'block', 
                visibility: 'visible',
                opacity: '1'
              });
              wrapper.find('.dt-button').css({ 
                display: 'inline-block', 
                visibility: 'visible',
                opacity: '1'
              });
              
              // Ensure table structure is preserved
              wrapper.find('table').css({ 
                display: 'table', 
                visibility: 'visible',
                width: '100%'
              });
              wrapper.find('tbody').css({ 
                display: 'table-row-group', 
                visibility: 'visible'
              });
            } else {
              console.warn('DataTable wrapper not found');
            }
          }, 300);
        }
      } catch (error) {
        console.error('Error initializing DataTable:', error);
      }
    };

    // Small delay to ensure table is rendered
    // Use a longer delay to ensure React has finished rendering
    const timer = setTimeout(() => {
      if (tableRef.current && tableRef.current.querySelector('tbody') && isMounted) {
        // Double-check DataTable isn't already initialized
        const $ = (window as any).jQuery;
        if ($ && $.fn.DataTable && $.fn.DataTable.isDataTable(tableRef.current)) {
          console.log('DataTable already initialized, skipping...');
          return;
        }
        initializeDataTable();
      }
    }, 800); // Increased delay to ensure React rendering is complete

    return () => {
      isMounted = false;
      clearTimeout(timer);
      if (dataTableRef.current) {
        try {
          dataTableRef.current.destroy();
          dataTableRef.current = null;
        } catch (e) {
          // Ignore destroy errors
        }
      }
    };
  }, [statusFilter]); // Only re-initialize when status filter changes, not when data changes

  return (
    <div className="content-wrapper">
      <style>{`
        .record-notes-custom-card-analytics {
          border-radius: 15px;
          margin-bottom: 10px !important;
          background: #fff !important;
          transition: all 0.2s linear;
          height: auto !important;
        }
        .card.record-notes-custom-card-analytics {
          border: 2px solid #e3e3e3;
        }
        .record-notes-custom-card-analytics:hover {
          transform: scale(1.02);
        }
        .record-notes-custom-card-analytics .card-body {
          display: flex;
          justify-content: flex-start !important;
          flex-direction: column;
          padding: 15px !important;
          text-align: center;
        }
        .record-notes-custom-card-analytics .icon {
          width: 60px;
          height: 60px;
          border-radius: 100%;
          margin-bottom: 10px;
          display: flex;
          justify-content: center;
          align-items: center;
          margin: 0 auto 10px;
          color: white;
        }
        .record-notes-custom-card-analytics .icon i {
          font-size: 1.8rem !important;
        }
        .record-notes-custom-card-analytics h3 {
          text-align: center !important;
          font-size: 2rem !important;
          font-weight: bold;
          margin-bottom: 0.5rem;
        }
        .record-notes-custom-card-analytics p {
          color: #000 !important;
          text-align: center !important;
          margin: 5px 0 !important;
          font-size: 0.9rem;
        }
        .datatable thead th {
          background: rgb(37, 136, 95) !important;
          color: white !important;
        }
        .table-bordered th, .table-bordered td {
          border: 1px solid #dee2e6;
        }
        /* Table row background - match old CMDMS light beige */
        .table tbody tr {
          background-color: #f5f5f5;
        }
        .table tbody tr:hover {
          background-color: #e9ece5;
        }
        /* Force visibility of DataTable elements */
        .dataTables_wrapper table {
          display: table !important;
          visibility: visible !important;
        }
        .dataTables_wrapper tbody {
          display: table-row-group !important;
          visibility: visible !important;
        }
        .dataTables_wrapper tbody tr {
          display: table-row !important;
          visibility: visible !important;
          background-color: #f5f5f5 !important;
        }
        .dataTables_wrapper tbody tr:hover {
          background-color: #e9ece5 !important;
        }
        .dataTables_wrapper tbody td {
          display: table-cell !important;
          visibility: visible !important;
        }
        /* DataTables Export Buttons Styling - Match Old CMDMS */
        .dataTables_wrapper .dt-buttons {
          margin-bottom: 1rem;
          display: inline-block;
          float: left;
        }
        .dataTables_wrapper .dt-button {
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
        .dataTables_wrapper .dt-button:first-child {
          margin-left: 0;
        }
        .dataTables_wrapper .dt-button:hover {
          background-color: #e0e0e0;
          background-image: linear-gradient(to bottom, #f5f5f5 0%, #e0e0e0 100%);
          border-color: #666;
          text-decoration: none;
        }
        .dataTables_wrapper .dt-button:active {
          background-color: #e0e0e0;
          background-image: none;
          box-shadow: inset 0 2px 4px rgba(0,0,0,0.15);
          outline: none;
        }
        .dataTables_wrapper .dataTables_filter {
          text-align: right;
          margin-bottom: 1rem;
          float: right;
        }
        .dataTables_wrapper .dataTables_filter label {
          font-weight: normal;
          white-space: nowrap;
          text-align: left;
          display: inline-block;
          vertical-align: middle;
        }
        .dataTables_wrapper .dataTables_filter input {
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
        .dataTables_wrapper .dataTables_filter input:focus {
          outline: 2px solid #4A90E2;
          outline-offset: 0;
        }
        /* Force visibility of DataTable controls */
        .dataTables_wrapper {
          display: block !important;
          visibility: visible !important;
          width: 100% !important;
        }
        .dataTables_wrapper .dt-buttons {
          display: inline-block !important;
          visibility: visible !important;
          opacity: 1 !important;
          margin-bottom: 1rem !important;
          float: left !important;
        }
        .dataTables_wrapper .dt-button {
          display: inline-block !important;
          visibility: visible !important;
          opacity: 1 !important;
        }
        .dataTables_wrapper .dataTables_filter {
          display: block !important;
          visibility: visible !important;
          opacity: 1 !important;
          float: right !important;
          margin-bottom: 1rem !important;
        }
        .dataTables_wrapper .dataTables_filter label {
          display: inline-block !important;
          visibility: visible !important;
          opacity: 1 !important;
        }
        .dataTables_wrapper .dataTables_filter input {
          display: inline-block !important;
          visibility: visible !important;
          opacity: 1 !important;
        }
      `}</style>
      
      <div className="card">
        <div className="card-header text-center">
          <p className="block display-4">Directives</p>
          <p className="block display-5">{user?.department?.name ?? ''} Department</p>
        </div>
        <div className="card-body">
          {/* Status Cards */}
          <div className="row my-5 d-flex justify-content-center">
            {statusCards.map(card => (
              <div key={card.status} className="col-md-2 p-2">
                <Link
                  to={`/department/directives?status=${card.status}`}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <div
                    className="card record-notes-custom-card-analytics"
                    style={{
                      ...(statusFilter === card.status 
                        ? { border: `8px solid ${card.borderColor}` }
                        : { borderBottom: `8px solid ${card.borderColor}` }
                      )
                    }}
                  >
                    <div className="card-body">
                      <div className="icon" style={{ background: card.borderColor }}>
                        <i className={card.icon}></i>
                      </div>
                      <h3 
                        className={`mb-2 ${card.status === '' ? 'total_minutes' : card.status === '1' ? 'completed_minutes' : card.status === '2' ? 'on_target_minutes' : 'overdue_minutes'}`}
                        style={{ color: card.borderColor }}
                      >
                        {card.count}
                      </h3>
                      <p>{card.title}</p>
                      <p className={`mb-0 mt-2 ${card.status === '1' ? 'compl_percent' : card.status === '2' ? 'on_percent' : card.status === '3' ? 'over_percent' : ''}`}>
                        {card.percent === 0 ? '\u00A0' : `${card.percent}%`}
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          <div className="row">
            <div className="col-12">
              <div className="table-responsive">
                <table 
                  ref={tableRef}
                  className="table table-bordered table-condensed datatable" 
                  role="grid"
                  width="100%"
                >
                  <thead style={{ background: 'rgb(37, 136, 95)', color: 'white' }}>
                    <tr>
                      <th>S.No</th>
                      <th>Subject</th>
                      <th>Progress</th>
                      <th>Letter Number</th>
                      <th>Timeline</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDirectives.length > 0 ? (
                      filteredDirectives.map((directive, index) => {
                        const dept = directive.departments.find(d => d.id === departmentId);
                        const directiveStatus = dept?.status || directive.status;
                        const statusLabel = typeof directiveStatus === 'number' 
                          ? getStatusLabel(directiveStatus) 
                          : directiveStatus;
                        return (
                          <tr key={directive.id} id={`directive${directive.id}`}>
                            <td style={{ width: '5px', verticalAlign: 'top', textAlign: 'center' }}>
                              {index + 1}
                            </td>
                            <td style={{ width: '100px' }}>
                              <div id={`getsubject${directive.id}`} style={{ width: '300px', textAlign: 'left' }}>
                                <span dangerouslySetInnerHTML={{ __html: directive.subject ?? '' }}></span>
                              </div>
                            </td>
                            <td style={{ width: '100px' }}>
                              <div id={`getprogress${directive.id}`} style={{ width: '300px', textAlign: 'left' }}>
                                <span dangerouslySetInnerHTML={{ __html: directive.comments ?? '' }}></span>
                              </div>
                            </td>
                            <td style={{ width: '100px', textAlign: 'left' }}>
                              <div style={{ width: '100px', wordWrap: 'break-word', textAlign: 'left' }}>
                                {new Date(directive.date).toLocaleDateString('en-GB')} - {directive.letter_no ?? ''}
                              </div>
                            </td>
                            <td>{new Date(directive.timeline).toLocaleDateString('en-GB')}</td>
                            <td style={{ width: '85px' }}>
                              <label className={`badge ${getBadgeClass(directiveStatus)} badge-pill`}>
                                {statusLabel ?? ''}
                              </label>
                            </td>
                            <td style={{ textAlign: 'center' }}>
                              <Link
                                to={`/department/directives/${directive.id}?status=${statusFilter}&page=${currentPage}`}
                                style={{ padding: '0.3rem 1rem' }}
                                className="btn btn-primary btn-lg active"
                                role="button"
                                aria-pressed="true"
                                title="View Chat history"
                              >
                                <i className="ti-comments"></i>
                              </Link>
                            </td>
                          </tr>
                        );
                      })
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
        </div>
        {/* DataTable handles pagination, but keep footer for consistency */}
        <div className="card-footer mt-3 border" style={{ display: 'none' }}>
          <div className="row align-items-center">
            <div className="col">
              <div className="form-group mb-0 row align-items-center">
                <label htmlFor="perPage" className="col-sm-3 col-form-label mb-0">Show</label>
                <select
                  id="perPage"
                  className="form-control form-control-sm col-sm-3"
                  onChange={handleItemsPerPageChange}
                  value={itemsPerPage}
                >
                  {[15, 25, 50, 100].map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                <span className="inline-block col-sm-6"> per page</span>
              </div>
            </div>
            <div className="col text-center">
              <p>
                Showing <strong>{(currentPage - 1) * itemsPerPage + 1}</strong> to
                <strong> {Math.min(currentPage * itemsPerPage, filteredDirectives.length)}</strong> of total
                <strong> {filteredDirectives.length}</strong> records.
              </p>
            </div>
            <div className="col d-flex justify-content-end">
              <nav>
                <ul className="pagination">
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>Previous</button>
                  </li>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                      <button className="page-link" onClick={() => handlePageChange(page)}>{page}</button>
                    </li>
                  ))}
                  <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>Next</button>
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

