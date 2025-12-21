/**
 * DPOs KPIs Data Filter
 * EXACT replica of admin/kpi/data/dpos.blade.php from old CMDMS
 */

import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { generateMockKPIColumns, generateMockKPIDataEntries, KPIColumn, KPIDataEntry } from '../../../lib/mocks/data/kpiData';

export default function DPOsKPIsDataFilter() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [todate, setTodate] = useState<string>(() => {
    const dateParam = searchParams.get('todate');
    if (dateParam) return dateParam;
    const today = new Date();
    return today.toISOString().split('T')[0];
  });

  // Generate mock data
  const dcKpiColumns: KPIColumn[] = useMemo(() => generateMockKPIColumns(6), []);
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
                          {dcKpiColumns.map((dcKpiColumn) => {
                            const matchingEntries = dateWise.filter(
                              (d) => d.kpi_column_id === dcKpiColumn.id
                            );
                            const matchingEntry = matchingEntries.length > 0 ? matchingEntries[0] : null;

                            if (matchingEntry) {
                              return (
                                <td
                                  key={dcKpiColumn.id}
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
                          })}
                          <td
                            style={{
                              width: '200px',
                              fontSize: '10px',
                              textAlign: 'center',
                              border: '1px solid silver'
                            }}
                          >
                            {date}
                          </td>
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
