/**
 * Khushhaal Khyber Pakhtunkhwa Tasks Report
 * EXACT replica of admin/report/khushhal-khyber-pakhtunkhwa
 */

import { useState, useEffect } from 'react';
import { api } from '../../../lib/api';

export default function KhushhaalKPKTasksReport() {
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    // TODO: Replace with actual API call
    // const fetchData = async () => {
    //   try {
    //     const response = await api.get('/admin/report/khushhalkpk-tasks');
    //     setTasks(response.data);
    //   } catch (error) {
    //     console.error('Error fetching Khushhaal KPK tasks:', error);
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
            <h3>Khushhaal Khyber Pakhtunkhwa Tasks Report</h3>
            <div className="row mt-4">
              <div className="col-12">
                <div className="table-responsive">
                  <table className="table table-striped table-bordered">
                    <thead style={{ background: 'rgb(37, 136, 95)', color: 'white' }}>
                      <tr>
                        <th>S#</th>
                        <th>Task Title</th>
                        <th>Department</th>
                        <th>Status</th>
                        <th>Created Date</th>
                        <th>Due Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tasks.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="text-center">No data available</td>
                        </tr>
                      ) : (
                        tasks.map((task, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{task.title}</td>
                            <td>{task.department_name}</td>
                            <td>
                              <span className={`badge badge-${task.status_class || 'info'}`}>
                                {task.status}
                              </span>
                            </td>
                            <td>{task.created_at}</td>
                            <td>{task.due_date}</td>
                            <td>
                              <a 
                                href={`/admin/khushhalkpk/show/${task.id}`}
                                className="btn btn-sm btn-primary"
                              >
                                View
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
