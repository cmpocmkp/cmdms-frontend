/**
 * PTF Module - District Wise Report (Latest)
 * EXACT replica of admin/ptfs/report-district-latest
 */

import { useState, useEffect } from 'react';

export default function PTFDistrictLatestReport() {
  const [loading, setLoading] = useState(true);
  const [data, _setData] = useState<any[]>([]);

  useEffect(() => {
    // TODO: Replace with actual API call
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
            <h3>PTF District Wise Report (Latest)</h3>
            <div className="row mt-4">
              <div className="col-12">
                <div className="table-responsive">
                  <table className="table table-striped table-bordered">
                    <thead style={{ background: 'rgb(37, 136, 95)', color: 'white' }}>
                      <tr>
                        <th>S#</th>
                        <th>District</th>
                        <th>Total Schemes</th>
                        <th>Completed</th>
                        <th>In Progress</th>
                        <th>Pending</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="text-center">No data available</td>
                        </tr>
                      ) : (
                        data.map((item, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item.district_name}</td>
                            <td>{item.total_schemes || 0}</td>
                            <td>{item.completed || 0}</td>
                            <td>{item.in_progress || 0}</td>
                            <td>{item.pending || 0}</td>
                            <td>
                              <a 
                                href={`/admin/ptfs/district/${item.district_id}`}
                                className="btn btn-sm btn-primary"
                              >
                                View Details
                              </a>
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
