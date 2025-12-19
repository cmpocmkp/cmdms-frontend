/**
 * PTF Module - Department Wise Report
 * EXACT replica of admin/report/ptf/department-wise
 */

import { useState, useEffect } from 'react';
import { api } from '../../../lib/api';

export default function PTFDepartmentWiseReport() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);

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
            <h3>PTF Department Wise Report</h3>
            <div className="row mt-4">
              <div className="col-12">
                <div className="table-responsive">
                  <table className="table table-striped table-bordered">
                    <thead style={{ background: 'rgb(37, 136, 95)', color: 'white' }}>
                      <tr>
                        <th>S#</th>
                        <th>Department</th>
                        <th>Total Decisions</th>
                        <th>Completed</th>
                        <th>On Target</th>
                        <th>On Going</th>
                        <th>Off Target</th>
                        <th>Overdue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="text-center">No data available</td>
                        </tr>
                      ) : (
                        data.map((item, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item.department_name}</td>
                            <td>{item.total_decisions || 0}</td>
                            <td>{item.completed || 0}</td>
                            <td>{item.on_target || 0}</td>
                            <td>{item.on_going || 0}</td>
                            <td>{item.off_target || 0}</td>
                            <td>{item.overdue || 0}</td>
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
