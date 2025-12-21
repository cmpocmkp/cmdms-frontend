/**
 * PTF Module - District Detail Report 1
 * EXACT replica of admin/ptfs/report-district-detail
 */

import { useState, useEffect } from 'react';

export default function PTFDistrictDetailReport() {
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
            <h3>PTF District Detail Report</h3>
            <div className="row mt-4">
              <div className="col-12">
                <div className="table-responsive">
                  <table className="table table-striped table-bordered">
                    <thead style={{ background: 'rgb(37, 136, 95)', color: 'white' }}>
                      <tr>
                        <th>S#</th>
                        <th>District</th>
                        <th>Scheme Name</th>
                        <th>Cost</th>
                        <th>Status</th>
                        <th>Progress</th>
                        <th>Remarks</th>
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
                            <td>{item.scheme_name}</td>
                            <td>{item.cost}</td>
                            <td>
                              <span className={`badge badge-${item.status_class || 'info'}`}>
                                {item.status}
                              </span>
                            </td>
                            <td>{item.progress}%</td>
                            <td>{item.remarks}</td>
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
