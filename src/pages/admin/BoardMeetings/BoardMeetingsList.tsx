/**
 * Board Meetings List - Admin Module
 * EXACT replica of admin/boardmeetings/index.blade.php from old CMDMS
 */

import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { mockAdminDepartments } from '../../../lib/mocks/data/adminDepartments';

// Mock boards (departments that are boards)
const mockBoards = mockAdminDepartments.slice(0, 10).map((dept) => ({
  id: dept.id,
  name: dept.name + ' Board'
}));

export default function BoardMeetingsList() {
  const [boards] = useState(mockBoards);
  const tableRef = useRef<HTMLTableElement>(null);
  const dataTableRef = useRef<any>(null);

  // Initialize DataTable
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
        document.body.appendChild(script);
      });
    };
    
    const initializeDataTable = () => {
      if (!tableRef.current || !isMounted) return;
      
      // Check if DataTable is already initialized
      if (dataTableRef.current) {
        try {
          dataTableRef.current.destroy();
        } catch (e) {
          // Ignore destroy errors
        }
        dataTableRef.current = null;
      }
      
      // Check if jQuery and DataTables are available
      if (typeof window.$ === 'undefined' || !window.$.fn.DataTable) {
        return;
      }
      
      // Check if already initialized
      if (window.$.fn.DataTable.isDataTable(tableRef.current)) {
        return;
      }
      
      // Initialize DataTable (matching old CMDMS configuration)
      dataTableRef.current = window.$(tableRef.current).DataTable({
        pageLength: 100,
        lengthChange: false,
        order: [],
        ordering: false,
        info: false,
        paging: false
      });
    };
    
    // Load jQuery and DataTables
    Promise.all([
      loadScript('https://code.jquery.com/jquery-3.6.0.min.js'),
      loadScript('https://cdn.datatables.net/1.13.6/js/jquery.dataTables.min.js')
    ])
      .then(() => {
        // Wait a bit for scripts to fully initialize
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
  }, [boards.length]);

  return (
    <div className="content-wrapper">
      <div className="card">
        <div className="card-body">
          <Link to="/admin/boardmeetings/add" style={{ float: 'right' }}>
            Add New Board Meeting
          </Link>
          <h4 className="card-title">All Boards</h4>

          <div className="row">
            <div className="col-12">
              <div className="table-responsive">
                <table 
                  ref={tableRef}
                  id="table_record_report_list" 
                  className="table table-striped" 
                  role="grid"
                >
                  <thead>
                    <tr>
                      <th>Boards</th>
                    </tr>
                  </thead>
                  <tbody>
                    {boards.length > 0 ? (
                      boards.map((board) => (
                        <tr key={board.id}>
                          <td>
                            <Link
                              to={`/admin/boardmeetings/show/${board.id}`}
                              className="text-primary mr-2"
                            >
                              <div dangerouslySetInnerHTML={{ __html: board.name }} />
                            </Link>
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
      </div>
    </div>
  );
}

// Extend Window interface for jQuery and DataTables
declare global {
  interface Window {
    $: any;
    jQuery: any;
  }
}

