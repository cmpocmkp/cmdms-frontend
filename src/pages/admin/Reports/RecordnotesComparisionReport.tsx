/**
 * Recordnotes Comparison Report
 * EXACT replica of admin/report/recordnotes/comparision.blade.php from old CMDMS
 */

import { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { generateMockRecordNotesUpdates, RecordNoteUpdateDepartment } from '../../../lib/mocks/data/recordnotesUpdates';
import { mockDepartments } from '../../../lib/mocks/data/departments';

// Mock SO users (role_id 3, name starts with "SO")
interface SOUser {
  id: number;
  name: string;
}

const mockSOUsers: SOUser[] = [
  { id: 1, name: 'SO Finance' },
  { id: 2, name: 'SO Health' },
  { id: 3, name: 'SO Education' },
  { id: 4, name: 'SO Agriculture' },
  { id: 5, name: 'SO Planning' },
  { id: 6, name: 'SO Works' },
  { id: 7, name: 'SO Home' },
];

export default function RecordnotesComparisionReport() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [departments, setDepartments] = useState<RecordNoteUpdateDepartment[]>([]);
  const [lastWeekDepartments, setLastWeekDepartments] = useState<RecordNoteUpdateDepartment[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>(searchParams.get('user_id') || '');
  const [searchResult, setSearchResult] = useState<string>('');
  const currentTableRef = useRef<HTMLTableElement>(null);
  const lastWeekTableRef = useRef<HTMLTableElement>(null);
  const currentDataTableRef = useRef<any>(null);
  const lastWeekDataTableRef = useRef<any>(null);

  useEffect(() => {
    // TODO: Replace with actual API call
    loadData();
  }, []);

  const loadData = () => {
    const allDepartments = generateMockRecordNotesUpdates();
    
    // Generate last 7 days data (filter minutes updated in last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const lastWeekData = allDepartments.map(dept => {
      const filteredMeetings = dept.allmeetings.map(meeting => {
        const filteredMinutes = meeting.minutes.filter(minute => {
          const updatedAt = new Date(minute.updated_at);
          return updatedAt >= sevenDaysAgo;
        });
        return {
          ...meeting,
          minutes: filteredMinutes
        };
      }).filter(meeting => meeting.minutes.length > 0);
      
      // Recalculate stats for last 7 days
      let total = 0;
      let completed = 0;
      let on_target = 0;
      let overdue = 0;
      
      filteredMeetings.forEach(meeting => {
        meeting.minutes.forEach(minute => {
          total++;
          switch (minute.status) {
            case 'Completed':
              completed++;
              break;
            case 'On Target':
              on_target++;
              break;
            case 'Overdue':
              overdue++;
              break;
          }
        });
      });
      
      return {
        ...dept,
        allmeetings: filteredMeetings,
        total,
        completed,
        on_target,
        overdue
      };
    }).filter(dept => dept.total > 0);

    setDepartments(allDepartments);
    setLastWeekDepartments(lastWeekData);
    setLoading(false);
  };

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

        // Destroy existing DataTables if they exist
        if (currentDataTableRef.current) {
          currentDataTableRef.current.destroy();
        }
        if (lastWeekDataTableRef.current) {
          lastWeekDataTableRef.current.destroy();
        }

        // Initialize current table (no hidden sortby column, so no columnDefs needed for sorting)
        if (currentTableRef.current && departments.length > 0) {
          currentDataTableRef.current = $(currentTableRef.current).DataTable({
            pageLength: 100,
            bPaginate: false,
            paging: false,
            bInfo: false,
            lengthChange: false,
            ordering: false,
            searching: false,
            autoWidth: false,
            fnRowCallback: function(nRow: any, aData: any, iDisplayIndex: number) {
              $('td:first', nRow).html(iDisplayIndex + 1);
              return nRow;
            }
          });
        }

        // Initialize last week table
        if (lastWeekTableRef.current && lastWeekDepartments.length > 0) {
          lastWeekDataTableRef.current = $(lastWeekTableRef.current).DataTable({
            pageLength: 100,
            bPaginate: false,
            paging: false,
            bInfo: false,
            lengthChange: false,
            ordering: false,
            searching: false,
            columnDefs: [{
              targets: [4],
              visible: false
            }],
            autoWidth: false,
            order: [[4, 'desc'], [2, 'desc']],
            fnRowCallback: function(nRow: any, aData: any, iDisplayIndex: number) {
              $('td:first', nRow).html(iDisplayIndex + 1);
              return nRow;
            }
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
        if (currentDataTableRef.current) {
          try {
            currentDataTableRef.current.destroy();
          } catch (e) {
            // Ignore destroy errors
          }
        }
        if (lastWeekDataTableRef.current) {
          try {
            lastWeekDataTableRef.current.destroy();
          } catch (e) {
            // Ignore destroy errors
          }
        }
      };
    }
  }, [loading, departments.length, lastWeekDepartments.length]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedUserId === 'all' || !selectedUserId) {
      // Reset to show all departments
      setSearchParams({});
      setSearchResult('');
      loadData();
      return;
    }

    // TODO: Filter by SO user's departments
    // For now, just show search result message
    const selectedUser = mockSOUsers.find(u => u.id.toString() === selectedUserId);
    if (selectedUser) {
      setSearchResult(selectedUser.name);
      setSearchParams({ user_id: selectedUserId });
    }
  };

  if (loading) {
    return <div className="text-center p-5">Loading...</div>;
  }

  return (
    <div className="content-wrapper">
      <style>{`
        table.table_record_report_comparision {
          width: 100% !important;
        }
        table.table_record_report_comparision td {
          color: blue !important;
          font-size: 14px !important;
          text-align: center !important;
        }
        table.table_record_report_comparision td ul li {
          font-size: 14px !important;
        }
        table.table_record_report_comparision th {
          font-size: 14px !important;
          text-align: center !important;
        }
        table.table_record_report_comparision td small {
          color: black !important;
        }
        .card-body p {
          font-size: 14px;
          font-weight: bold;
        }
        .badge.badge-pill {
          font-size: 14px !important;
        }
        table.dataTable thead > tr > th.sorting_asc,
        table.dataTable thead > tr > th.sorting_desc,
        table.dataTable thead > tr > th.sorting,
        table.dataTable thead > tr > td.sorting_asc,
        table.dataTable thead > tr > td.sorting_desc,
        table.dataTable thead > tr > td.sorting {
          padding-right: unset !important;
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
            <form
              className="form-sample"
              onSubmit={handleSearch}
              id="record_note_comparision_form"
            >
              <div className="col-md-12">
                {searchResult && (
                  <p>
                    <span className="text-primary">
                      Search result for <span className="text-success">{searchResult}</span>
                    </span>
                  </p>
                )}
                <label>Filter By SO</label>
                <div className="form-group">
                  <select
                    name="user_id"
                    id="user_id"
                    className="form-control form-control-lg"
                    required
                    value={selectedUserId}
                    onChange={(e) => setSelectedUserId(e.target.value)}
                  >
                    <option value="">Please Select SO</option>
                    <option value="all">All Departments</option>
                    {mockSOUsers.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name}
                      </option>
                    ))}
                  </select>
                  <button type="submit" className="btn btn-success mr-2 pull-right" style={{ float: 'right', marginTop: '10px' }}>
                    Search
                  </button>
                </div>
              </div>
            </form>
          </div>

          <div className="row">
            <div className="col-md-6">
              <div className="badge badge-primary">
                <h6 className="mb-0 font-weight-bold">Current</h6>
              </div>
            </div>
            <div className="col-md-6">
              <div className="badge badge-primary">
                <h6 className="mb-0 font-weight-bold">Last 7 days</h6>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-6">
              <div className="table-responsive">
                <table
                  style={{ border: '1px solid var(--dark)' }}
                  className="table_record_report_comparision table-striped cell-border"
                  ref={currentTableRef}
                >
                  <thead style={{ background: '#008000', color: 'white' }}>
                    <tr>
                      <th style={{ width: '5px' }}>S.NO</th>
                      <th style={{ width: '30px' }}>Departments</th>
                      <th style={{ width: '5px' }}>Total</th>
                      <th style={{ width: '50px' }}>
                        <div style={{ backgroundColor: '#71c016' }} className="badge badge-success badge-pill">
                          Completed
                        </div>
                      </th>
                      {/* hidden sortby column commented out in blade template for first table */}
                      <th style={{ width: '50px' }}>
                        <div className="badge badge-warning badge-pill">On Target</div>
                      </th>
                      <th style={{ width: '50px' }}>
                        <div className="badge badge-danger badge-pill">Overdue</div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {departments.length > 0 ? (
                      departments.map((dept) => {
                        let total = 0;
                        let completed = 0;
                        let on_target = 0;
                        let overdue = 0;

                        dept.allmeetings.forEach(meeting => {
                          meeting.minutes.forEach(minute => {
                            total++;
                            switch (minute.status) {
                              case 'Completed':
                                completed++;
                                break;
                              case 'On Target':
                                on_target++;
                                break;
                              case 'Overdue':
                                overdue++;
                                break;
                            }
                          });
                        });

                        return (
                          <tr key={dept.id}>
                            <td style={{ width: '5px' }}></td>
                            <td style={{ width: '30px' }}>
                              <Link to={`#`}>{dept.name}</Link>
                            </td>
                            <td style={{ width: '5px' }} className="font-weight-bold">
                              {total > 0 ? (
                                <Link to={`/admin/report/recordnotes-updates-detail/${dept.id}/4`}>
                                  {total}
                                </Link>
                              ) : (
                                total
                              )}
                            </td>
                            <td style={{ width: '50px' }} className="font-weight-bold">
                              {completed > 0 ? (
                                <>
                                  <Link to={`/admin/report/recordnotes-updates-detail/${dept.id}/1`}>
                                    {completed}
                                  </Link>
                                  <br />
                                  <small style={{ fontWeight: 500 }}>
                                    ({total ? ((completed / total) * 100).toFixed(2) : '0.00'}) %
                                  </small>
                                </>
                              ) : (
                                completed
                              )}
                            </td>
                            {/* Hidden sortby column not included in first table per blade template */}
                            <td style={{ width: '50px' }} className="font-weight-bold">
                              {on_target > 0 ? (
                                <>
                                  <Link to={`/admin/report/recordnotes-updates-detail/${dept.id}/2`}>
                                    {on_target}
                                  </Link>
                                  <br />
                                  <small style={{ fontWeight: 500 }}>
                                    ({total ? ((on_target / total) * 100).toFixed(2) : '0.00'}) %
                                  </small>
                                </>
                              ) : (
                                on_target
                              )}
                            </td>
                            <td style={{ width: '50px' }} className="font-weight-bold">
                              {overdue > 0 ? (
                                <>
                                  <Link to={`/admin/report/recordnotes-updates-detail/${dept.id}/3`}>
                                    {overdue}
                                  </Link>
                                  <br />
                                  <small style={{ fontWeight: 500 }}>
                                    ({total ? ((overdue / total) * 100).toFixed(2) : '0.00'}) %
                                  </small>
                                </>
                              ) : (
                                overdue
                              )}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={10}>There is no data.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="col-md-6">
              <div className="table-responsive">
                <table
                  style={{ border: '1px solid var(--dark)' }}
                  className="table_record_report_comparision table-striped cell-border"
                  ref={lastWeekTableRef}
                >
                  <thead style={{ background: '#008000', color: 'white' }}>
                    <tr>
                      <th style={{ width: '5px' }}>S.NO</th>
                      <th style={{ width: '30px' }}>Departments</th>
                      <th style={{ width: '5px' }}>Total</th>
                      <th style={{ width: '50px' }}>
                        <div style={{ backgroundColor: '#71c016' }} className="badge badge-success badge-pill">
                          Completed
                        </div>
                      </th>
                      <th>hidden sortby</th>
                      <th style={{ width: '50px' }}>
                        <div className="badge badge-warning badge-pill">On Target</div>
                      </th>
                      <th style={{ width: '50px' }}>
                        <div className="badge badge-danger badge-pill">Overdue</div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {lastWeekDepartments.length > 0 ? (
                      lastWeekDepartments.map((dept) => {
                        let total = 0;
                        let completed = 0;
                        let on_target = 0;
                        let overdue = 0;

                        dept.allmeetings.forEach(meeting => {
                          meeting.minutes.forEach(minute => {
                            total++;
                            switch (minute.status) {
                              case 'Completed':
                                completed++;
                                break;
                              case 'On Target':
                                on_target++;
                                break;
                              case 'Overdue':
                                overdue++;
                                break;
                            }
                          });
                        });

                        return (
                          <tr key={dept.id}>
                            <td style={{ width: '5px' }}></td>
                            <td style={{ width: '30px' }}>
                              <Link to={`#`}>{dept.name}</Link>
                            </td>
                            <td style={{ width: '5px' }} className="font-weight-bold">
                              {total > 0 ? (
                                <Link to={`/admin/report/recordnotes-updates-detail/${dept.id}/4`}>
                                  {total}
                                </Link>
                              ) : (
                                total
                              )}
                            </td>
                            <td style={{ width: '50px' }} className="font-weight-bold">
                              {completed > 0 ? (
                                <>
                                  <Link to={`/admin/report/recordnotes-updates-detail/${dept.id}/1`}>
                                    {completed}
                                  </Link>
                                  <br />
                                  <small style={{ fontWeight: 500 }}>
                                    ({total ? ((completed / total) * 100).toFixed(2) : '0.00'}) %
                                  </small>
                                </>
                              ) : (
                                completed
                              )}
                            </td>
                            <td>
                              {total ? ((completed / total) * 100).toFixed(2) : 0}
                            </td>
                            <td style={{ width: '50px' }} className="font-weight-bold">
                              {on_target > 0 ? (
                                <>
                                  <Link to={`/admin/report/recordnotes-updates-detail/${dept.id}/2`}>
                                    {on_target}
                                  </Link>
                                  <br />
                                  <small style={{ fontWeight: 500 }}>
                                    ({total ? ((on_target / total) * 100).toFixed(2) : '0.00'}) %
                                  </small>
                                </>
                              ) : (
                                on_target
                              )}
                            </td>
                            <td style={{ width: '50px' }} className="font-weight-bold">
                              {overdue > 0 ? (
                                <>
                                  <Link to={`/admin/report/recordnotes-updates-detail/${dept.id}/3`}>
                                    {overdue}
                                  </Link>
                                  <br />
                                  <small style={{ fontWeight: 500 }}>
                                    ({total ? ((overdue / total) * 100).toFixed(2) : '0.00'}) %
                                  </small>
                                </>
                              ) : (
                                overdue
                              )}
                            </td>
                          </tr>
                        );
                      })
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
