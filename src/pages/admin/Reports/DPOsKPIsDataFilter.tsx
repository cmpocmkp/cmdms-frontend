/**
 * DPOs KPIs Data Filter
 * EXACT replica of admin/kpi/data/dpos.blade.php from old CMDMS
 */

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { generateDPOsKPIColumns, generateMockKPIDataEntries, KPIColumn, KPIDataEntry } from '../../../lib/mocks/data/kpiData';

export default function DPOsKPIsDataFilter() {
  const tableRef = useRef<HTMLTableElement>(null);
  const dataTableRef = useRef<any>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [todate, setTodate] = useState<string>(() => {
    const dateParam = searchParams.get('todate');
    if (dateParam) return dateParam;
    const today = new Date();
    return today.toISOString().split('T')[0];
  });

  // Generate mock data - use specific DPOs columns matching old CMDMS
  const dcKpiColumns: KPIColumn[] = useMemo(() => generateDPOsKPIColumns(), []);
  const mockUserIds = useMemo(() => Array.from({ length: 10 }, (_, i) => i + 1), []);
  
  const kpiDataMap = useMemo(() => {
    const dateStr = todate || new Date().toISOString().split('T')[0];
    return generateMockKPIDataEntries(mockUserIds, dcKpiColumns, dateStr);
  }, [todate, dcKpiColumns, mockUserIds]);

  // Process data: group by user_id, then by date
  const processedData = useMemo(() => {
    const result: Array<{ userId: number; dateGroups: Map<string, KPIDataEntry[]> }> = [];
    
    kpiDataMap.forEach((entries, userId) => {
      const dateGroups = new Map<string, KPIDataEntry[]>();
      entries.forEach((entry) => {
        const dateKey = new Date(entry.created_at).toISOString().split('T')[0];
        if (!dateGroups.has(dateKey)) {
          dateGroups.set(dateKey, []);
        }
        dateGroups.get(dateKey)!.push(entry);
      });
      result.push({ userId, dateGroups });
    });
    
    return result;
  }, [kpiDataMap]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (todate) {
      setSearchParams({ todate });
    } else {
      setSearchParams({});
    }
  };

  const handleReset = () => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    setTodate(todayStr);
    setSearchParams({});
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
              title: 'DPOs District KPi Report',
              exportOptions: {
                orthogonal: "export",
                rows: function(idx: number, data: any, node: any) {
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
  }, [processedData, todate]); // Re-initialize when data or date filter changes

  return (
    <div className="content-wrapper">
      <div className="col-md-12 grid-margin stretch-card">
        <div className="card">
          <span className="ml-4 mt-3">DPOs Reports</span>
          <div className="row">
            <div className="col-12">
              <form className="forms-sample" onSubmit={handleSubmit} id="date_filter_form">
                <div className="row">
                  <div className="col-md-3"></div>
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
                  <div className="col-md-3">
                    <button type="submit" style={{ marginTop: '5px' }} className="btn btn-primary mr-2" id="filter_result">
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
            <table
              ref={tableRef}
              id="showdposkpidata"
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
                      paddingRight: '10px',
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
                      paddingRight: '10px',
                      border: '1px solid silver'
                    }}
                  >
                    District
                  </th>
                  {dcKpiColumns.map((dcKpiColumn) => (
                    <th
                      key={dcKpiColumn.id}
                      style={{
                        width: '200px',
                        fontSize: '10px',
                        fontWeight: 100,
                        textAlign: 'center',
                        paddingRight: '10px',
                        border: '1px solid silver'
                      }}
                    >
                      ({dcKpiColumn.kpi?.name || ''}) - {dcKpiColumn.name || 'column name missing'}
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
                      const firstEntry = dateWise[0];

                      // Build row cells matching old CMDMS structure exactly
                      const cells: React.ReactNode[] = [];
                      let handleSerialNumberAndDistrictColumns = 0;
                      let snoAndDistrictRendered = false;

                      dcKpiColumns.forEach((dcKpiColumn) => {
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
                          if (dcKpiColumn.id === userData.kpi_column_id) {
                            samDayDoubleEntryCounter++;

                            // Only render if this is the first match (avoid duplicates)
                            if (samDayDoubleEntryCounter === 1) {
                              cells.push(
                                <td
                                  key={dcKpiColumn.id}
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
                              key={dcKpiColumn.id}
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
                            width: '200px',
                            fontSize: '10px',
                            textAlign: 'center',
                            border: '1px solid silver'
                          }}
                        >
                          {date}
                        </td>
                      );

                      rows.push(
                        <tr key={`${userId}-${date}`}>
                          {cells}
                        </tr>
                      );
                    });
                  });

                  return rows.length > 0 ? rows : (
                    <tr>
                      <td colSpan={dcKpiColumns.length + 3} style={{ textAlign: 'center' }}>
                        No data available
                      </td>
                    </tr>
                  );
                })()}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
