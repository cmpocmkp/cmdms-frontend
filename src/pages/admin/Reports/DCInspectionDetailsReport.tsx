/**
 * DC Inspection Details Report
 * EXACT replica of admin/report/dc/inspection
 */

import { useState, useEffect } from 'react';
import { api } from '../../../lib/api';

export default function DCInspectionDetailsReport() {
  const [loading, setLoading] = useState(true);
  const [inspections, setInspections] = useState<any[]>([]);

  useEffect(() => {
    // TODO: Replace with actual API call
    // const fetchData = async () => {
    //   try {
    //     const response = await api.get('/admin/report/dc-inspection');
    //     setInspections(response.data);
    //   } catch (error) {
    //     console.error('Error fetching DC inspections:', error);
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
            <h3>DC Inspection Details Report</h3>
            <div className="row mt-4">
              <div className="col-12">
                <div className="table-responsive">
                  <table className="table table-striped table-bordered">
                    <thead style={{ background: 'rgb(37, 136, 95)', color: 'white' }}>
                      <tr>
                        <th>S#</th>
                        <th>District</th>
                        <th>DC Name</th>
                        <th>Inspection Date</th>
                        <th>Inspection Type</th>
                        <th>Details</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inspections.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="text-center">No data available</td>
                        </tr>
                      ) : (
                        inspections.map((inspection, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{inspection.district_name}</td>
                            <td>{inspection.dc_name}</td>
                            <td>{inspection.inspection_date}</td>
                            <td>{inspection.inspection_type}</td>
                            <td>{inspection.details}</td>
                            <td>
                              <span className={`badge badge-${inspection.status_class || 'info'}`}>
                                {inspection.status}
                              </span>
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
