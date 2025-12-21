/**
 * Departments KPIs Data Filter
 * EXACT replica of admin/kpi/data/departments.blade.php from old CMDMS
 */

import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { generateMockKPIColumns, generateMockKPIDataEntries, mockUserGroups, UserGroup, KPIColumn, KPIDataEntry } from '../../../lib/mocks/data/kpiData';

export default function DepartmentsKPIsDataFilter() {
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
                        const firstEntry = dateWise[0];

                        rows.push(
                          <tr key={`${userId}-${date}`}>
                            <td
                              style={{
                                fontSize: '10px',
                                textAlign: 'center',
                                border: '1px solid silver'
                              }}
                            >
                              {districtCounter}
                            </td>
                            <td
                              style={{
                                fontSize: '10px',
                                textAlign: 'center',
                                border: '1px solid silver'
                              }}
                            >
                              {firstEntry.district?.name || ''}
                            </td>
                            {departmentKpiColumns.map((departmentKpiColumn) => {
                              const matchingEntries = dateWise.filter(
                                (d) => d.kpi_column_id === departmentKpiColumn.id
                              );
                              const matchingEntry = matchingEntries.length > 0 ? matchingEntries[0] : null;

                              if (matchingEntry) {
                                return (
                                  <td
                                    key={departmentKpiColumn.id}
                                    style={{
                                      fontSize: '10px',
                                      textAlign: 'center',
                                      border: '1px solid silver',
                                      background: 'lightcyan'
                                    }}
                                  >
                                    {matchingEntry.value}
                                  </td>
                                );
                              }

                              return (
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
                            })}
                            <td
                              style={{
                                fontSize: '10px',
                                textAlign: 'center',
                                border: '1px solid silver'
                              }}
                            >
                              {formatDateDisplay(date)}
                            </td>
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
