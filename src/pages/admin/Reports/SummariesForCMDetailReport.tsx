/**
 * Summaries for CM Report - Detail
 * EXACT replica of admin/report/summaries/detail.blade.php
 */

import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { api } from '../../../lib/api';

export default function SummariesForCMDetailReport() {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [summaries, setSummaries] = useState<any[]>([]);
  const departmentId = searchParams.get('department_id');
  const status = searchParams.get('status');

  useEffect(() => {
    // TODO: Replace with actual API call
    // const fetchData = async () => {
    //   try {
    //     const params = new URLSearchParams();
    //     if (departmentId) params.append('department_id', departmentId);
    //     if (status) params.append('status', status);
    //     const response = await api.get(`/admin/report/summaries/detail?${params.toString()}`);
    //     setSummaries(response.data);
    //   } catch (error) {
    //     console.error('Error fetching summaries detail:', error);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchData();
    setLoading(false);
  }, [departmentId, status]);

  if (loading) {
    return <div className="text-center p-5">Loading...</div>;
  }

  return (
    <div className="content-wrapper">
      <div className="card">
        <div className="card-header text-center">
          <div className="d-flex gap-3 justify-content-between align-items-center">
            <div className="flex-grow-1 text-center">
              <p className="block display-4">Summaries for CM Report - Detail</p>
            </div>
          </div>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-12">
              <div className="table-responsive">
                <table className="table table-bordered datatable">
                  <thead>
                    <tr className="thead-light">
                      <th>#</th>
                      <th>Summary Title</th>
                      <th>Department</th>
                      <th>Status</th>
                      <th>Created Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {summaries.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center">No data available</td>
                      </tr>
                    ) : (
                      summaries.map((summary, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{summary.title}</td>
                          <td>{summary.department_name}</td>
                          <td>
                            <span className={`badge badge-${summary.status_class || 'info'}`}>
                              {summary.status}
                            </span>
                          </td>
                          <td>{summary.created_at}</td>
                          <td>
                            <Link 
                              to={`/admin/summaries/show/${summary.id}`}
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
        </div>
      </div>
    </div>
  );
}
