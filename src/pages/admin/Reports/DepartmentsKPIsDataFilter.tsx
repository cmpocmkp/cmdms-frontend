/**
 * Departments KPIs Data Filter
 * EXACT replica of admin/kpi/data/departments.blade.php from old CMDMS
 */

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { generateMockKPIColumns, generateMockKPIDataEntries, mockUserGroups, KPIColumn, KPIDataEntry } from '../../../lib/mocks/data/kpiData';

export default function DepartmentsKPIsDataFilter() {
  const tableRef = useRef<HTMLTableElement>(null);
  const dataTableRef = useRef<any>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [todate, setTodate] = useState<string>(() => {
    const dateParam = searchParams.get('todate');
    if (dateParam) return dateParam;
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [selectedGroup, setSelectedGroup] = useState<string>(() => {
    return searchParams.get('userGroup') || '';
  });

  // Generate mock data only if filters are applied
  const departmentKpiColumns: KPIColumn[] = useMemo(() => {
    if (todate && selectedGroup) {
      return generateMockKPIColumns(5);
    }
    return [];
  }, [todate, selectedGroup]);

  const mockUserIds = useMemo(() => Array.from({ length: 8 }, (_, i) => i + 1), []);
  
  const kpiDataMap = useMemo(() => {
    if (todate && selectedGroup) {
      const dateStr = todate;
      return generateMockKPIDataEntries(mockUserIds, departmentKpiColumns, dateStr);
    }
    return new Map<number, KPIDataEntry[]>();
  }, [todate, selectedGroup, departmentKpiColumns, mockUserIds]);

  // Process data: group by user_id, then by date
  const processedData = useMemo(() => {
    if (!todate || !selectedGroup) return [];
    
    const result: Array<{ userId: number; dateGroups: Map<string, KPIDataEntry[]> }> = [];
    
    kpiDataMap.forEach((entries, userId) => {
      const dateGroups = new Map<string, KPIDataEntry[]>();
      entries.forEach((entry) => {
        // For departments, group by date and time (h:i:s)
        const dateKey = new Date(entry.created_at).toISOString();
        if (!dateGroups.has(dateKey)) {
          dateGroups.set(dateKey, []);
        }
        dateGroups.get(dateKey)!.push(entry);
      });
      result.push({ userId, dateGroups });
    });
    
    return result;
  }, [kpiDataMap, todate, selectedGroup]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params: Record<string, string> = {};
    if (todate) params.todate = todate;
    if (selectedGroup) params.userGroup = selectedGroup;
    setSearchParams(params);
  };

  const handleReset = () => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    setTodate(todayStr);
    setSelectedGroup('');
    setSearchParams({});
  };

  // Format date for display (d/m/Y)
  const formatDateDisplay = (dateStr: string): string => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
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

    const initializeDataTable = async () => {
      try {
        // Only initialize if table exists and has data
        if (!tableRef.current || processedData.length === 0 || departmentKpiColumns.length === 0) {
          return;
        }

        // Load jQuery first
        if (!(window as any).jQuery) {
          await loadScript('https://code.jquery.com/jquery-3.7.1.min.js');
        }

        // Load DataTables
        await loadScript('https://cdn.datatables.net/1.13.7/js/jquery.dataTables.min.js');
        await loadScript('https://cdn.datatables.net/buttons/2.4.2/js/dataTables.buttons.min.js');
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js');
        await loadScript('https://cdn.datatables.net/buttons/2.4.2/js/buttons.html5.min.js');

        // Load DataTables CSS
        if (!document.querySelector('link[href*="jquery.dataTables"]')) {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = 'https://cdn.datatables.net/1.13.7/css/jquery.dataTables.min.css';
          document.head.appendChild(link);
        }
        if (!document.querySelector('link[href*="buttons.dataTables"]')) {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = 'https://cdn.datatables.net/buttons/2.4.2/css/buttons.dataTables.min.css';
          document.head.appendChild(link);
        }

        const $ = (window as any).jQuery;

        // Destroy existing DataTable if it exists
        if (dataTableRef.current) {
          dataTableRef.current.destroy();
        }

        // Initialize DataTable with export buttons
        if (tableRef.current) {
          dataTableRef.current = $(tableRef.current).DataTable({
            dom: 'Bfrtip',
            buttons: [{
              extend: 'csvHtml5',
              title: 'Department KPI Report',
              exportOptions: {
                orthogonal: "export",
                rows: function(_idx: number, _data: any, _node: any) {
                  return true;
                }
              }
            }],
            scrollX: true,
            pageLength: 100,
            lengthChange: false,
            order: [],
            ordering: false,
            info: false,
            paging: false,
            searching: true
          });
        }
      } catch (error) {
        console.error('Error initializing DataTable:', error);
      }
    };

    // Small delay to ensure table is rendered
    const timer = setTimeout(() => {
      initializeDataTable();
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
  }, [processedData, departmentKpiColumns, todate, selectedGroup]); // Re-initialize when data or filters change

  return (
    <div className="content-wrapper">
      <div className="col-md-12 grid-margin stretch-card">
        <div className="card">
          <span className="ml-4 mt-3">Departments KPIs Reports</span>
          <div className="row">
            <div className="col-12">
              <form className="forms-sample" onSubmit={handleSubmit} id="date_filter_form">
                <div className="row">
                  <div className="col-md-1"></div>
                  <div className="col-md-3">
                    <div className="form-group row">
                      <label className="col-sm-3 col-form-label">Date</label>
                      <div className="col-sm-9 date datepicker">
                        <input
                          type="date"
                          name="todate"
                          id="todate"
                          value={todate}
                          onChange={(e) => setTodate(e.target.value)}
                          className="form-control"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-5">
                    <div className="form-group row">
                      <label className="col-sm-3 col-form-label">Departments</label>
                      <div className="col-sm-8">
                        <select
                          name="userGroup"
                          className="form-control"
                          value={selectedGroup}
                          onChange={(e) => setSelectedGroup(e.target.value)}
                          required
                        >
                          <option value="">Select Department</option>
                          {mockUserGroups.map((userGroup) => (
                            <option key={userGroup.id} value={userGroup.id}>
                              {userGroup.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-2">
                    <button type="submit" className="btn btn-primary mr-2" id="filter_result">
                      Filter
                    </button>
                  </div>
                </div>
              </form>
              <div className="col-md-3">
                <span className="card-title pull-right">
                  <a href="#" onClick={(e) => { e.preventDefault(); handleReset(); }}>Reset Filter</a>
                </span>
              </div>
            </div>
          </div>
          <div className="card-body">
            {processedData.length > 0 && departmentKpiColumns.length > 0 ? (
              <table
                ref={tableRef}
                id="showdepartmentskpidata"
                className="table-striped"
                style={{ width: '100%', border: '1px solid silver' }}
              >
                <thead>
                  <tr>
                    <th
                      style={{
                        width: '200px',
                        fontSize: '10px',
                        fontWeight: 100,
                        textAlign: 'center',
                        border: '1px solid silver'
                      }}
                    >
                      S.NO
                    </th>
                    <th
                      style={{
                        width: '200px',
                        fontSize: '10px',
                        fontWeight: 100,
                        textAlign: 'center',
                        border: '1px solid silver'
                      }}
                    >
                      District
                    </th>
                    {departmentKpiColumns.map((departmentKpiColumn) => (
                      <th
                        key={departmentKpiColumn.id}
                        style={{
                          width: '200px',
                          fontSize: '10px',
                          fontWeight: 100,
                          textAlign: 'center',
                          border: '1px solid silver'
                        }}
                      >
                        ({departmentKpiColumn.kpi?.name || ''}) - {departmentKpiColumn.name || 'column name missing'}
                      </th>
                    ))}
                    <th
                      style={{
                        width: '200px',
                        fontSize: '10px',
                        fontWeight: 100,
                        textAlign: 'center',
                        border: '1px solid silver'
                      }}
                    >
                      Created Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    let districtCounter = 0;
                    const rows: React.ReactNode[] = [];

                    processedData.forEach(({ userId, dateGroups }) => {
                      dateGroups.forEach((dateWise, date) => {
                        districtCounter++;

                        // Build row cells matching old CMDMS structure exactly
                        const cells: React.ReactNode[] = [];
                        let handleSerialNumberAndDistrictColumns = 0;
                        let snoAndDistrictRendered = false;

                        departmentKpiColumns.forEach((departmentKpiColumn) => {
                          let handleColumnRepetition = 0;
                          let samDayDoubleEntryCounter = 0;

                          // Loop through dateWise data to find matches
                          dateWise.forEach((userData) => {
                            handleSerialNumberAndDistrictColumns++;

                            // Render S.NO and District only once per row (on first iteration of first column)
                            if (handleSerialNumberAndDistrictColumns === 1 && !snoAndDistrictRendered) {
                              cells.push(
                                <td
                                  key="sno"
                                  style={{
                                    fontSize: '10px',
                                    textAlign: 'center',
                                    border: '1px solid silver'
                                  }}
                                >
                                  {districtCounter}
                                </td>
                              );
                              cells.push(
                                <td
                                  key="district"
                                  style={{
                                    fontSize: '10px',
                                    textAlign: 'center',
                                    border: '1px solid silver'
                                  }}
                                >
                                  {userData.district?.name || ''}
                                </td>
                              );
                              snoAndDistrictRendered = true;
                            }

                            // Check if this KPI column matches the userData
                            if (departmentKpiColumn.id === userData.kpi_column_id) {
                              samDayDoubleEntryCounter++;

                              // Only render if this is the first match (avoid duplicates)
                              // Note: Old CMDMS has this check commented out, but we'll keep it for safety
                              if (samDayDoubleEntryCounter === 1) {
                                cells.push(
                                  <td
                                    key={departmentKpiColumn.id}
                                    style={{
                                      fontSize: '10px',
                                      textAlign: 'center',
                                      border: '1px solid silver',
                                      background: 'lightcyan'
                                    }}
                                  >
                                    {userData.value}
                                  </td>
                                );
                                handleColumnRepetition = 1;
                              }
                            }
                          });

                          // If no match found for this column, render 0
                          if (handleColumnRepetition === 0) {
                            cells.push(
                              <td
                                key={departmentKpiColumn.id}
                                style={{
                                  fontSize: '10px',
                                  textAlign: 'center',
                                  border: '1px solid silver'
                                }}
                              >
                                0
                              </td>
                            );
                          }
                        });

                        // Add Created Date at the end
                        cells.push(
                          <td
                            key="created-date"
                            style={{
                              fontSize: '10px',
                              textAlign: 'center',
                              border: '1px solid silver'
                            }}
                          >
                            {formatDateDisplay(date)}
                          </td>
                        );

                        rows.push(
                          <tr key={`${userId}-${date}`}>
                            {cells}
                          </tr>
                        );
                      });
                    });

                    return rows;
                  })()}
                </tbody>
              </table>
            ) : (
              <>
                {searchParams.has('todate') || searchParams.has('userGroup') ? (
                  <p>No data found</p>
                ) : null}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
