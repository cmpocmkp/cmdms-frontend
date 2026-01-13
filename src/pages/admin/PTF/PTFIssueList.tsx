/**
 * PTF Issue List
 * EXACT replica of admin/ptf/list-issue.blade.php from old CMDMS
 * Integrated with real API following API_INTEGRATION_GUIDE.md
 * 
 * Note: API structure (title, description, priority, districtId, status, deadline) differs from frontend mock structure.
 * Frontend fields like way_forward, source, suggestedDepartments, assignedTo are not in API.
 */

import React, { useMemo, useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import * as ptfService from '../../../lib/services/ptfService';
import { USE_MOCK_DATA } from '../../../lib/api';
import { generateMockPTFIssues, PTFIssue as MockPTFIssue } from '../../../lib/mocks/data/ptfIssuesData';
import { mockDepartments } from '../../../lib/mocks/data/departments';
import { Eye } from 'lucide-react';

export default function PTFIssueList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const status = searchParams.get('status');
  const type = searchParams.get('type');
  const district = searchParams.get('district');
  const tableRef = useRef<HTMLTableElement>(null);
  const dataTableRef = useRef<any>(null);
  
  const [issues, setIssues] = useState<ptfService.PTFIssue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage] = useState(1);
  
  const districtId = district && district !== 'all' ? parseInt(district) : null;
  
  // Fetch issues from API
  useEffect(() => {
    fetchIssues();
  }, [status, districtId, currentPage]);

  const fetchIssues = async () => {
    try {
      setLoading(true);
      setError(null);

      if (USE_MOCK_DATA) {
        // Use mock data
        const mockIssues = generateMockPTFIssues();
        // Convert mock to API format
        const apiIssues: ptfService.PTFIssue[] = mockIssues.map((issue: MockPTFIssue) => ({
          id: issue.id,
          title: issue.issue,
          description: issue.way_forward,
          priority: issue.priority.title.toLowerCase(),
          districtId: issue.department_id,
          district: { id: issue.department_id, name: issue.department.name },
          status: String(issue.status),
          deadline: issue.timeline || undefined,
        }));
        setIssues(apiIssues);
      } else {
        // Real API call
        const params: ptfService.ListPTFIssuesParams = {
          page: currentPage,
          limit: 15,
        };

        if (status && status !== 'no-decision') {
          params.status = status;
        }

        if (districtId) {
          params.districtId = districtId;
        }

        const response = await ptfService.listPTFIssues(params);

        if (response.success && response.data) {
          setIssues(response.data);
        } else {
          setError(response.message || 'Failed to load PTF issues');
        }
      }
    } catch (err: any) {
      console.error('Error fetching PTF issues:', err);
      setError(err.response?.data?.error?.message || 'Failed to load PTF issues');
    } finally {
      setLoading(false);
    }
  };
  
  // Filter issues based on params (for mock data or client-side filtering)
  const allIssues = useMemo(() => {
    if (USE_MOCK_DATA) {
      let filtered = issues;
      
      // Filter by type (on target / critically delayed)
      if (type === 'on') {
        const today = new Date().toISOString().split('T')[0];
        filtered = filtered.filter(i => 
          i.status === 'pending' && 
          i.deadline && 
          i.deadline > today
        );
      } else if (type === 'off') {
        const today = new Date().toISOString().split('T')[0];
        filtered = filtered.filter(i => 
          i.status === 'pending' && 
          i.deadline && 
          i.deadline < today
        );
      }
      
      return filtered;
    }
    
    // For real API, filtering is done server-side
    return issues;
  }, [issues, type, USE_MOCK_DATA]);
  
  const statusText = useMemo(() => {
    if (status === 'pending') return 'Pending';
    if (status === 'open' || status === 'approved') return 'Open/Approved';
    if (status === 'rejected') return 'Rejected';
    if (status === 'completed') return 'Completed';
    if (status === 'no-decision') return 'Decisions Pending';
    return 'All';
  }, [status]);
  
  // Get unique departments for filter
  const departments = useMemo(() => {
    if (USE_MOCK_DATA) {
      const deptIds = new Set(allIssues.map(i => i.districtId).filter(Boolean));
      return mockDepartments.filter(d => deptIds.has(Number(d.id)));
    }
    // For real API, would need to fetch districts separately or from Common APIs
    return mockDepartments;
  }, [allIssues, USE_MOCK_DATA]);
  
  const handleFilter = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const selectedDistrict = formData.get('district') as string;
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      if (selectedDistrict && selectedDistrict !== 'all') {
        newParams.set('district', selectedDistrict);
      } else {
        newParams.delete('district');
      }
      return newParams;
    });
  };
  
  const getFlag = (issue: ptfService.PTFIssue) => {
    if (issue.status === 'pending' || issue.status === 'open') {
      if (issue.deadline) {
        const today = new Date().toISOString().split('T')[0];
        if (issue.deadline < today) {
          return { title: 'Critically Delayed', color: 'red' };
        }
        if (issue.deadline > today) {
          return { title: 'On Target', color: 'green' };
        }
      }
      return { title: 'Pending', color: 'yellow' };
    }
    if (issue.status === 'rejected') return { title: 'Rejected', color: 'red' };
    if (issue.status === 'completed') return { title: 'Completed', color: 'green' };
    return { title: 'N/A', color: '' };
  };
  
  const truncateText = (text: string, words: number = 5) => {
    const wordsArray = text.split(' ');
    if (wordsArray.length <= words) return text;
    return wordsArray.slice(0, words).join(' ') + '...';
  };

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
      
      // Initialize DataTable
      dataTableRef.current = window.$(tableRef.current).DataTable({
        dom: 'Bfrtip',
        buttons: ['excel', 'print'],
        pageLength: 10,
        order: [[0, 'asc']],
        language: {
          search: '',
          searchPlaceholder: 'Search records...'
        },
        stateSave: false,
        autoWidth: false,
        info: true
      });
    };
    
    // Load jQuery and DataTables
    Promise.all([
      loadScript('https://code.jquery.com/jquery-3.6.0.min.js'),
      loadScript('https://cdn.datatables.net/1.13.6/js/jquery.dataTables.min.js'),
      loadScript('https://cdn.datatables.net/buttons/2.4.1/js/dataTables.buttons.min.js'),
      loadScript('https://cdn.datatables.net/buttons/2.4.1/js/buttons.html5.min.js'),
      loadScript('https://cdn.datatables.net/buttons/2.4.1/js/buttons.print.min.js')
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
  }, [allIssues.length]);

  return (
    <div className="content-wrapper">
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">PTF Issue List {statusText}</h4>
              <form onSubmit={handleFilter}>
                <div className="row">
                  <div className="col-md-4">
                    <label>Districts</label>
                    <select 
                      className="form-control" 
                      id="district" 
                      name="district"
                      defaultValue={district || 'all'}
                    >
                      <option value="all">All</option>
                      {departments.map((dept) => (
                        <option key={dept.id} value={dept.id}>
                          {dept.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-2 mt-4">
                    <input type="submit" value="Filter" className="btn-sm btn-primary" />
                  </div>
                </div>
              </form>
            </div>
            <div className="card-body">
              {/* Loading State */}
              {loading && (
                <div className="text-center p-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="sr-only">Loading...</span>
                  </div>
                  <p className="mt-2 text-muted">Loading PTF issues...</p>
                </div>
              )}

              {/* Error State */}
              {error && !loading && (
                <div className="alert alert-danger" role="alert">
                  <i className="ti-alert-circle mr-2"></i>
                  <strong>Error:</strong> {error}
                  <button 
                    className="btn btn-sm btn-outline-danger ml-3" 
                    onClick={fetchIssues}
                  >
                    Retry
                  </button>
                </div>
              )}

              {/* Content */}
              {!loading && !error && (
                <div className="table-responsive">
                  <table 
                    ref={tableRef}
                    id="order-listing" 
                    className="table table-striped dataTable no-footer"
                  >
                    <thead>
                      <tr>
                        <th>Sr.No</th>
                        <th>Title</th>
                        <th>Description</th>
                        <th>District</th>
                        <th>Priority</th>
                        <th>Status</th>
                        <th>Deadline</th>
                        <th>Progress</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allIssues.length > 0 ? (
                        allIssues.map((issue, index) => {
                          const flag = getFlag(issue);
                          return (
                            <tr key={issue.id}>
                              <td>{index + 1}</td>
                              <td>{truncateText(issue.title, 10)}</td>
                              <td>{truncateText(issue.description || '', 10)}</td>
                              <td>{issue.district?.name || 'N/A'}</td>
                              <td>
                                <span className={`badge badge-${issue.priority === 'high' ? 'danger' : issue.priority === 'medium' ? 'warning' : 'info'}`}>
                                  {issue.priority || 'N/A'}
                                </span>
                              </td>
                              <td>
                                <span className={`badge badge-${issue.status === 'completed' ? 'success' : issue.status === 'rejected' ? 'danger' : 'warning'}`}>
                                  {issue.status || 'pending'}
                                </span>
                              </td>
                              <td>
                                {issue.deadline ? new Date(issue.deadline).toLocaleDateString('en-GB') : '-'}
                              </td>
                              <td>
                                {issue.deadline ? (
                                  <p>
                                    <span
                                      className="priority-flag"
                                      style={{
                                        display: 'inline-block',
                                        width: '12px',
                                        height: '12px',
                                        backgroundColor: flag.color,
                                        marginRight: '5px'
                                      }}
                                    ></span>
                                    {flag.title}
                                  </p>
                                ) : (
                                  <span>-</span>
                                )}
                              </td>
                              <td>
                                <Link
                                  to={`/admin/ptf/details/${issue.id}`}
                                  className="btn btn-primary btn-sm"
                                >
                                  <Eye size={16} className="mr-1" />
                                  View
                                </Link>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={9} className="text-center">
                            No issues found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
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
