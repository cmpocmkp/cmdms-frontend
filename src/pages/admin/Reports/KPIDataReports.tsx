/**
 * KPI Data Reports - Index
 * EXACT replica of admin/kpidata/index
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../../lib/api';

export default function KPIDataReports() {
  const [loading, setLoading] = useState(true);
  const [kpiData, setKpiData] = useState<any[]>([]);

  useEffect(() => {
    // TODO: Replace with actual API call
    // const fetchData = async () => {
    //   try {
    //     const response = await api.get('/admin/kpidata');
    //     setKpiData(response.data);
    //   } catch (error) {
    //     console.error('Error fetching KPI data:', error);
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
            <h3>KPI Data Reports</h3>
            <div className="row mt-4">
              <div className="col-12">
                <div className="table-responsive">
                  <table className="table table-striped table-bordered">
                    <thead style={{ background: 'rgb(37, 136, 95)', color: 'white' }}>
                      <tr>
                        <th>S#</th>
                        <th>District/Department</th>
                        <th>KPI Name</th>
                        <th>Target</th>
                        <th>Achieved</th>
                        <th>Percentage</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {kpiData.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="text-center">No data available</td>
                        </tr>
                      ) : (
                        kpiData.map((item, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item.district_or_department_name}</td>
                            <td>{item.kpi_name}</td>
                            <td>{item.target}</td>
                            <td>{item.achieved}</td>
                            <td>{item.percentage}%</td>
                            <td>
                              <span className={`badge badge-${item.status_class || 'info'}`}>
                                {item.status}
                              </span>
                            </td>
                            <td>
                              <Link 
                                to={`/admin/kpidata/show/${item.id}`}
                                className="btn btn-sm btn-primary"
                              >
                                View
                              </Link>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </center>
        </div>
      </div>
    </div>
  );
}
