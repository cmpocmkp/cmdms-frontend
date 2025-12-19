/**
 * Summaries for CM Report - Summary
 * EXACT replica of admin/report/summaries/summary.blade.php
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../../lib/api';

export default function SummariesForCMReport() {
  const [loading, setLoading] = useState(true);
  const [departments, setDepartments] = useState<any[]>([]);

  useEffect(() => {
    // TODO: Replace with actual API call
    // const fetchData = async () => {
    //   try {
    //     const response = await api.get('/admin/report/summaries/summary');
    //     setDepartments(response.data.departments);
    //   } catch (error) {
    //     console.error('Error fetching summaries:', error);
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
        <div className="card-header text-center">
          <div className="d-flex gap-3 justify-content-between align-items-center">
            <div className="flex-grow-1 text-center">
              <p className="block display-4">Summaries for CM Report</p>
            </div>
          </div>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col">
              <div className="table-responsive">
                <table className="table table-bordered datatable">
                  <thead>
                    <tr className="thead-light">
                      <th>#</th>
                      <th>Department</th>
                      <th>Total Tasks</th>
                      <th>Completed</th>
                      <th>On Target</th>
                      <th>On Going</th>
                      <th>Off Target</th>
                      <th>Overdue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {departments.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="text-center">No data available</td>
                      </tr>
                    ) : (
                      departments.map((dept, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{dept.name}</td>
                          <td>
                            {dept.status_counts?.total > 0 ? (
                              <Link to={`/admin/report/summaries/detail?department_id=${dept.id}`}>
                                {dept.status_counts.total}
                              </Link>
                            ) : (
                              0
                            )}
                          </td>
                          <td>
                            {dept.status_counts?.completed > 0 ? (
                              <Link to={`/admin/report/summaries/detail?department_id=${dept.id}&status=1`}>
                                {dept.status_counts.completed}
                              </Link>
                            ) : (
                              0
                            )}
                          </td>
                          <td>
                            {dept.status_counts?.on_target > 0 ? (
                              <Link to={`/admin/report/summaries/detail?department_id=${dept.id}&status=2`}>
                                {dept.status_counts.on_target}
                              </Link>
                            ) : (
                              0
                            )}
                          </td>
                          <td>
                            {dept.status_counts?.on_going > 0 ? (
                              <Link to={`/admin/report/summaries/detail?department_id=${dept.id}&status=7`}>
                                {dept.status_counts.on_going}
                              </Link>
                            ) : (
                              0
                            )}
                          </td>
                          <td>
                            {dept.status_counts?.off_target > 0 ? (
                              <Link to={`/admin/report/summaries/detail?department_id=${dept.id}&status=4`}>
                                {dept.status_counts.off_target}
                              </Link>
                            ) : (
                              0
                            )}
                          </td>
                          <td>
                            {dept.status_counts?.overdue > 0 ? (
                              <Link to={`/admin/report/summaries/detail?department_id=${dept.id}&status=3`}>
                                {dept.status_counts.overdue}
                              </Link>
                            ) : (
                              0
                            )}
                          </td>
                        </tr>
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
