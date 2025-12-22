/**
 * Recordnotes Updates Report
 * EXACT replica of admin/report/recordnotes/updates.blade.php from old CMDMS
 */

import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { generateMockRecordNotesUpdates, RecordNoteUpdateDepartment } from '../../../lib/mocks/data/recordnotesUpdates';

export default function RecordnotesUpdatesReport() {
  const [loading, setLoading] = useState(true);
  const [departments] = useState<RecordNoteUpdateDepartment[]>(() => generateMockRecordNotesUpdates());
  const tableRef = useRef<HTMLTableElement>(null);
  const dataTableRef = useRef<any>(null);

  useEffect(() => {
    // TODO: Replace with actual API call
    setLoading(false);
  }, []);

  // Initialize DataTables
  useEffect(() => {
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

    const initializeDataTables = async () => {
      try {
        // Load jQuery first
        if (!(window as any).jQuery) {
          await loadScript('https://code.jquery.com/jquery-3.7.1.min.js');
        }

        // Load DataTables
        await loadScript('https://cdn.datatables.net/1.13.7/js/jquery.dataTables.min.js');

        // Load DataTables CSS
        if (!document.querySelector('link[href*="jquery.dataTables"]')) {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = 'https://cdn.datatables.net/1.13.7/css/jquery.dataTables.min.css';
          document.head.appendChild(link);
        }

        const $ = (window as any).jQuery;

        // Destroy existing DataTable if it exists
        if (dataTableRef.current) {
          dataTableRef.current.destroy();
        }

        // Initialize table (matching old CMDMS configuration)
        if (tableRef.current && departments.length > 0) {
          dataTableRef.current = $(tableRef.current).DataTable({
            pageLength: 200,
            lengthChange: false,
            order: []
          });
        }
      } catch (error) {
        console.error('Error initializing DataTables:', error);
      }
    };

    if (!loading) {
      const timer = setTimeout(() => {
        initializeDataTables();
      }, 100);

      return () => {
        clearTimeout(timer);
        if (dataTableRef.current) {
          try {
            dataTableRef.current.destroy();
          } catch (e) {
            // Ignore destroy errors
          }
        }
      };
    }
  }, [loading, departments.length]);

  if (loading) {
    return <div className="text-center p-5">Loading...</div>;
  }

  return (
    <div className="content-wrapper">
      <style>{`
        table#table_record_report {
          width: 100% !important;
        }
        table#table_record_report td {
          color: blue !important;
          font-size: 16px !important;
          text-align: center !important;
        }
        #table_record_report td ul li {
          font-size: 16px !important;
        }
        table#table_record_report th {
          font-size: 16px !important;
          text-align: center !important;
        }
        table#table_record_report td small {
          color: black !important;
        }
        .card-body p {
          font-size: 16px;
          font-weight: bold;
        }
        .badge.badge-pill {
          font-size: 16px !important;
        }
      `}</style>

      <div className="card">
        <div className="card-body">
          <center>
            <h3>Record Notes Updates Report - Department-wise</h3>
            <br />
            <br />
          </center>
          <div className="row">
            <div className="col-12">
              <div className="table-responsive">
                <table id="table_record_report" className="table table-striped" ref={tableRef}>
                  <thead style={{ background: '#008000', color: 'white' }}>
                    <tr>
                      <th style={{ width: '15px' }}>S.NO</th>
                      <th style={{ width: '200px' }}>Departments</th>
                      <th style={{ width: '100px' }}>Total</th>
                      <th style={{ width: '100px' }}>
                        <div style={{ backgroundColor: '#71c016' }} className="badge badge-success badge-pill">
                          Completed
                        </div>
                      </th>
                      <th style={{ width: '100px' }}>
                        <div className="badge badge-warning badge-pill">On Target</div>
                      </th>
                      <th style={{ width: '100px' }}>
                        <div className="badge badge-danger badge-pill">Overdue</div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {departments.length > 0 ? (
                      departments.map((dept, index) => (
                        <tr key={dept.id}>
                          <td>{index + 1}</td>
                          <td>{dept.name}</td>
                          <td className="font-weight-bold">
                            {dept.total > 0 ? (
                              <Link to={`/admin/report/recordnotes-updates-detail/${dept.id}/4`}>
                                {dept.total}
                              </Link>
                            ) : (
                              dept.total
                            )}
                          </td>
                          <td className="font-weight-bold">
                            {dept.completed > 0 ? (
                              <>
                                <Link to={`/admin/report/recordnotes-updates-detail/${dept.id}/1`}>
                                  {dept.completed}
                                </Link>
                                <br />
                                <small style={{ fontWeight: 500 }}>
                                  ({dept.total ? ((dept.completed / dept.total) * 100).toFixed(2) : '0.00'})%
                                </small>
                              </>
                            ) : (
                              dept.completed
                            )}
                          </td>
                          <td className="font-weight-bold">
                            {dept.on_target > 0 ? (
                              <>
                                <Link to={`/admin/report/recordnotes-updates-detail/${dept.id}/2`}>
                                  {dept.on_target}
                                </Link>
                                <br />
                                <small style={{ fontWeight: 500 }}>
                                  ({dept.total ? ((dept.on_target / dept.total) * 100).toFixed(2) : '0.00'})%
                                </small>
                              </>
                            ) : (
                              dept.on_target
                            )}
                          </td>
                          <td className="font-weight-bold">
                            {dept.overdue > 0 ? (
                              <>
                                <Link to={`/admin/report/recordnotes-updates-detail/${dept.id}/3`}>
                                  {dept.overdue}
                                </Link>
                                <br />
                                <small style={{ fontWeight: 500 }}>
                                  ({dept.total ? ((dept.overdue / dept.total) * 100).toFixed(2) : '0.00'})%
                                </small>
                              </>
                            ) : (
                              dept.overdue
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="text-center">
                          There is no data.
                        </td>
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
