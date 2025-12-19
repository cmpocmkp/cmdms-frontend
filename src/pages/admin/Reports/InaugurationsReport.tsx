/**
 * Inaugurations Report
 * EXACT replica of admin/report/inaugurations/index.blade.php
 */

import { useState, useEffect } from 'react';
import { api } from '../../../lib/api';

export default function InaugurationsReport() {
  const [loading, setLoading] = useState(true);
  const [departmentInaugurations, setDepartmentInaugurations] = useState<any[]>([]);

  useEffect(() => {
    // TODO: Replace with actual API call
    // const fetchData = async () => {
    //   try {
    //     const response = await api.get('/admin/report/inaugurations');
    //     setDepartmentInaugurations(response.data);
    //   } catch (error) {
    //     console.error('Error fetching inaugurations:', error);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchData();
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="text-center p-5">Loading...</div>;
  }

  return (
    <div className="content-wrapper">
      <div className="card">
        <div className="card-body">
          <center>
            <h3>Inaugrations / Ground Breaking - Department-wise</h3>
          </center>
          <br /><br />

          <div className="row">
            <div className="col-12">
              <div className="table-responsive">
                <table id="inaugurations-listing" className="table-striped" role="grid">
                  <thead style={{ background: 'rgb(37, 136, 95)', color: 'white' }}>
                    <tr>
                      <th>S#</th>
                      <th>Department</th>
                      <th>Month</th>
                      <th>Scheme<br />/Project Name</th>
                      <th>Cost in<br /> Millions</th>
                      <th>Inaugurations<br />/GroundBreaking</th>
                      <th>District</th>
                      <th>Division</th>
                      <th>Expected<br /> Date</th>
                      <th>Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {departmentInaugurations.length === 0 ? (
                      <tr>
                        <td colSpan={10} className="text-center">No data available</td>
                      </tr>
                    ) : (
                      departmentInaugurations.map((department, deptIndex) => (
                        department.inaugrationsBreaking && department.inaugrationsBreaking.length > 0 ? (
                          department.inaugrationsBreaking.map((inaug: any, inaugIndex: number) => (
                            <tr 
                              key={`${deptIndex}-${inaugIndex}`}
                              className={deptIndex % 2 === 0 ? 'table-primary' : 'table-info'}
                            >
                              {inaugIndex === 0 && (
                                <>
                                  <th 
                                    style={{ verticalAlign: 'top' }}
                                    rowSpan={department.inaugrationsBreaking.length + 1}
                                  >
                                    {deptIndex + 1}
                                  </th>
                                  <th 
                                    style={{ verticalAlign: 'top', color: 'var(--gray-dark)' }}
                                    rowSpan={department.inaugrationsBreaking.length + 1}
                                  >
                                    <mark className="bg-warning text-white">{department.name}</mark>
                                  </th>
                                </>
                              )}
                              <td>{inaug.month}</td>
                              <td>{inaug.scheme_project_name}</td>
                              <td>{inaug.cost_in_millions}</td>
                              <td>{inaug.inauguration_groundbreaking}</td>
                              <td>{inaug.district}</td>
                              <td>{inaug.division}</td>
                              <td>{inaug.expected_date}</td>
                              <td>{inaug.remarks}</td>
                            </tr>
                          ))
                        ) : (
                          <tr key={deptIndex} className={deptIndex % 2 === 0 ? 'table-primary' : 'table-info'}>
                            <th style={{ verticalAlign: 'top' }}>{deptIndex + 1}</th>
                            <th style={{ verticalAlign: 'top', color: 'var(--gray-dark)' }}>
                              <mark className="bg-warning text-white">{department.name}</mark>
                            </th>
                            <td colSpan={8} className="text-center">No inaugurations</td>
                          </tr>
                        )
                      ))
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
