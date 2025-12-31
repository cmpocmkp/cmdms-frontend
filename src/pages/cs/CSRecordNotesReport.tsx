/**
 * CS (Chief Secretary) Record Notes Report - Department-wise
 * EXACT replica of admin/cs/reports/index.blade.php from old CMDMS
 * Shows departments with overdue minutes count
 */

import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { generateMockCSRecordNotes } from '../../lib/mocks/data/csRecordNotes';
import type { CSRecordNoteDepartment } from '../../lib/mocks/data/csRecordNotes';

declare global {
  interface Window {
    $: any;
    jQuery: any;
  }
}

export default function CSRecordNotesReport() {
  const [departments, setDepartments] = useState<CSRecordNoteDepartment[]>([]);
  const tableRef = useRef<HTMLTableElement>(null);
  const dataTableRef = useRef<any>(null);

  useEffect(() => {
    // Load mock data
    const data = generateMockCSRecordNotes();
    setDepartments(data);
  }, []);

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

    const initializeDataTable = () => {
      if (!tableRef.current || !isMounted) return;

      if (dataTableRef.current) {
        try {
          dataTableRef.current.destroy();
        } catch (e) {
          // Ignore destroy errors
        }
        dataTableRef.current = null;
      }

      if (typeof window.$ === 'undefined' || !window.$.fn.DataTable) {
        return;
      }

      if (window.$.fn.DataTable.isDataTable(tableRef.current)) {
        return;
      }

      // Initialize DataTable - EXACT match to old CMDMS configuration from scripts.blade.php line 746
      const $table = window.$(tableRef.current);
      dataTableRef.current = $table.DataTable({
        pageLength: 100,
        columnDefs: [{
          targets: [2],
          visible: false
        }],
        autoWidth: false,
        order: [
          [3, 'desc'],
          [3, 'desc'] // Duplicated in old CMDMS, matching exactly
        ],
        // DOM layout: l=length, f=filter (on same line), r=processing, t=table, i=info, p=pagination
        dom: 'lfrtip',
        // Auto-number S.NO column (fnRowCallback matches old CMDMS exactly)
        fnRowCallback: function(nRow: any, _aData: any, iDisplayIndex: number) {
          window.$('td:first', nRow).html((iDisplayIndex + 1).toString());
          return nRow;
        }
      });
    };

    Promise.all([
      loadScript('https://code.jquery.com/jquery-3.6.0.min.js'),
      loadScript('https://cdn.datatables.net/1.13.6/js/jquery.dataTables.min.js')
    ])
      .then(() => {
        const timer = setTimeout(() => {
          if (isMounted) {
            initializeDataTable();
          }
        }, 500);
        return () => clearTimeout(timer);
      })
      .catch((error) => {
        console.error('Error loading DataTable scripts:', error);
      });

    return () => {
      isMounted = false;
      if (dataTableRef.current) {
        try {
          dataTableRef.current.destroy();
        } catch (e) {
          // Ignore destroy errors
        }
        dataTableRef.current = null;
      }
    };
  }, [departments.length]);

  // Calculate overdue count for each department
  const calculateOverdueCount = (dept: CSRecordNoteDepartment): number => {
    let count = 0;
    dept.allmeetings.forEach(meeting => {
      meeting.minutes.forEach(minute => {
        if (minute.status === 'Overdue') {
          count++;
        }
      });
    });
    return count;
  };

  return (
    <div className="content-wrapper">
      <style>{`
        table#table_record_csreport {
          width: 100% !important;
        }
        table#table_record_csreport td {
          color: blue !important;
          font-size: 16px !important;
          text-align: center !important;
        }
        #table_record_csreport td ul li {
          font-size: 16px !important;
        }
        table#table_record_csreport th {
          font-size: 16px !important;
          text-align: center !important;
        }
        table#table_record_csreport td small {
          color: black !important;
        }
        .card-body p {
          font-size: 16px;
          font-weight: bold;
        }
        .badge.badge-pill {
          font-size: 16px !important;
        }
        /* Enhanced DataTables filter section styling */
        .dataTables_wrapper {
          margin-bottom: 1.5rem;
        }
        .dataTables_wrapper .dataTables_length,
        .dataTables_wrapper .dataTables_filter {
          display: inline-block;
          margin-bottom: 1rem;
          vertical-align: middle;
        }
        .dataTables_wrapper .dataTables_length {
          float: left;
          margin-right: 2rem;
        }
        .dataTables_wrapper .dataTables_length label {
          font-weight: 500;
          color: #333;
          margin-bottom: 0;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .dataTables_wrapper .dataTables_length select {
          border: 1px solid #ced4da;
          border-radius: 4px;
          padding: 0.375rem 1.75rem 0.375rem 0.75rem;
          font-size: 0.875rem;
          line-height: 1.5;
          color: #495057;
          background-color: #fff;
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23343a40' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3e%3c/svg%3e");
          background-repeat: no-repeat;
          background-position: right 0.5rem center;
          background-size: 16px 12px;
          appearance: none;
          transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
        }
        .dataTables_wrapper .dataTables_length select:focus {
          border-color: #4A90E2;
          outline: 0;
          box-shadow: 0 0 0 0.2rem rgba(74, 144, 226, 0.25);
        }
        .dataTables_wrapper .dataTables_length select:hover {
          border-color: #adb5bd;
        }
        .dataTables_wrapper .dataTables_filter {
          float: right;
          text-align: right;
        }
        .dataTables_wrapper .dataTables_filter label {
          font-weight: 500;
          color: #333;
          white-space: nowrap;
          text-align: left;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0;
          vertical-align: middle;
        }
        .dataTables_wrapper .dataTables_filter input {
          margin-left: 0;
          display: inline-block;
          width: auto;
          min-width: 200px;
          border: 1px solid #ced4da;
          border-radius: 4px;
          padding: 0.375rem 0.75rem;
          font-size: 0.875rem;
          line-height: 1.5;
          color: #495057;
          background-color: #fff;
          transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
        }
        .dataTables_wrapper .dataTables_filter input:focus {
          border-color: #4A90E2;
          outline: 0;
          box-shadow: 0 0 0 0.2rem rgba(74, 144, 226, 0.25);
        }
        .dataTables_wrapper .dataTables_filter input:hover {
          border-color: #adb5bd;
        }
        .dataTables_wrapper .dataTables_filter input::placeholder {
          color: #6c757d;
          opacity: 0.6;
        }
        .dataTables_wrapper .dataTables_info {
          padding-top: 0.75rem;
          color: #6c757d;
          font-size: 0.875rem;
        }
        .dataTables_wrapper .dataTables_paginate {
          padding-top: 0.75rem;
        }
        .dataTables_wrapper .dataTables_paginate .paginate_button {
          padding: 0.375rem 0.75rem;
          margin-left: 0.25rem;
          border: 1px solid #dee2e6;
          border-radius: 4px;
          color: #495057;
          background-color: #fff;
          transition: all 0.15s ease-in-out;
        }
        .dataTables_wrapper .dataTables_paginate .paginate_button:hover {
          background-color: #e9ecef;
          border-color: #adb5bd;
          color: #495057;
        }
        .dataTables_wrapper .dataTables_paginate .paginate_button.current {
          background-color: #4A90E2;
          border-color: #4A90E2;
          color: #fff;
        }
        .dataTables_wrapper .dataTables_paginate .paginate_button.current:hover {
          background-color: #357abd;
          border-color: #357abd;
          color: #fff;
        }
      `}</style>

      <div className="card">
        <div className="card-body">
          <center>
            <h3>Minutes Report - Department-wise</h3>
          </center>
          <br />
          <br />
          <div className="row">
            <div className="col-12">
              <div className="table-responsive">
                <table
                  id="table_record_csreport"
                  className="table table-striped"
                  ref={tableRef}
                >
                  <thead style={{ background: '#008000', color: 'white' }}>
                    <tr>
                      <th style={{ width: '15px', background: '#008000', color: 'white' }}>S.NO</th>
                      <th style={{ width: '200px', background: '#008000', color: 'white' }}>Departments</th>
                      <th style={{ background: '#008000', color: 'white' }}>hidden sortby</th>
                      <th style={{ width: '100px', background: '#008000', color: 'white' }}>
                        <div className="badge badge-danger badge-pill">Overdue</div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {departments.length > 0 ? (
                      departments.map((dept) => {
                        const overDue = calculateOverdueCount(dept);
                        return (
                          <tr key={dept.id}>
                            <td></td>
                            <td>{dept.name}</td>
                            <td>&nbsp;</td>
                            <td className="font-weight-bold">
                              {overDue > 0 ? (
                                <Link
                                  to={`/cs/report/over-due-detail/${dept.id}/3`}
                                >
                                  {overDue}
                                </Link>
                              ) : (
                                overDue
                              )}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={4}>There are no data.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

