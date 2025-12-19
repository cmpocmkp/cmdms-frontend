/**
 * Recordnotes Updates Report
 * EXACT replica of admin/report/recordnotes-updates
 * Only visible for user_id == 1
 */

import { useState, useEffect } from 'react';
import { api } from '../../../lib/api';

export default function RecordnotesUpdatesReport() {
  const [loading, setLoading] = useState(true);
  const [departments, setDepartments] = useState<any[]>([]);

  useEffect(() => {
    // TODO: Replace with actual API call
    // const fetchData = async () => {
    //   try {
    //     const response = await api.get('/admin/report/recordnotes-updates');
    //     setDepartments(response.data);
    //   } catch (error) {
    //     console.error('Error fetching recordnotes updates:', error);
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
            <h3>Record Notes Updates Report - Department-wise</h3>
            <div className="row mt-4">
              <div className="col-12">
                <div className="table-responsive">
                  <table id="table_record_report" className="table table-striped">
                    <thead style={{ background: 'rgb(37, 136, 95)', color: 'white' }}>
                      <tr>
                        <th>S#</th>
                        <th>Department</th>
                        <th>Total Updates</th>
                        <th>Last Updated</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {departments.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="text-center">No data available</td>
                        </tr>
                      ) : (
                        departments.map((dept, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{dept.name}</td>
                            <td>{dept.total_updates || 0}</td>
                            <td>{dept.last_updated || 'N/A'}</td>
                            <td>
                              <a 
                                href={`/admin/report/recordnotes-updates-detail/${dept.id}`}
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
