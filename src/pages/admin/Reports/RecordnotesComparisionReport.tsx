/**
 * Recordnotes Comparision Report
 * EXACT replica of admin/report/recordnotes-comparision
 * Only visible for user_id == 1
 */

import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export default function RecordnotesComparisionReport() {
  const [searchParams] = useSearchParams();
  const [_loading, setLoading] = useState(false);
  const [comparisonData, setComparisonData] = useState<any[]>([]);
  const [departments, _setDepartments] = useState<any[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  useEffect(() => {
    // TODO: Fetch departments
    setLoading(false);
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // TODO: Replace with actual API call
    // try {
    //   const params = new URLSearchParams();
    //   if (selectedDepartment) params.append('department_id', selectedDepartment);
    //   if (startDate) params.append('start_date', startDate);
    //   if (endDate) params.append('end_date', endDate);
    //   const response = await api.get(`/admin/report/recordnotes-comparision?${params.toString()}`);
    //   setComparisonData(response.data);
    // } catch (error) {
    //   console.error('Error fetching comparison data:', error);
    // } finally {
    //   setLoading(false);
    // }
    setLoading(false);
  };

  const handleReset = () => {
    setSelectedDepartment('');
    setStartDate('');
    setEndDate('');
    setComparisonData([]);
  };

  return (
    <div className="content-wrapper">
      <div className="card">
        <div className="card-body">
          <center>
            <h3>Record Notes Comparision Report</h3>
          </center>
          
          <form className="forms-sample mt-4" onSubmit={handleSearch}>
            <div className="row">
              <div className="col-md-3">
                <label>Department</label>
                <div className="form-group">
                  <select
                    name="department_id"
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    className="form-control"
                  >
                    <option value="">All Departments</option>
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="col-md-2">
                <label>From Date</label>
                <div className="form-group">
                  <input
                    type="date"
                    name="start_date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="form-control"
                  />
                </div>
              </div>
              <div className="col-md-2">
                <label>To Date</label>
                <div className="form-group">
                  <input
                    type="date"
                    name="end_date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="form-control"
                  />
                </div>
              </div>
              <div className="col-md-2">
                <div className="form-group mt-4">
                  <button type="submit" className="btn btn-success">Search</button>
                  <button type="button" onClick={handleReset} className="btn btn-warning btn-md ml-2">
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </form>

          {(searchParams.has('department_id') || comparisonData.length > 0) && (
            <div className="row mt-4">
              <div className="col-12">
                <div className="table-responsive">
                  <table className="table table-striped table-bordered">
                    <thead style={{ background: 'rgb(37, 136, 95)', color: 'white' }}>
                      <tr>
                        <th>S#</th>
                        <th>Department</th>
                        <th>Meeting Date</th>
                        <th>Minute Title</th>
                        <th>Old Status</th>
                        <th>New Status</th>
                        <th>Updated Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {comparisonData.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="text-center">No data available</td>
                        </tr>
                      ) : (
                        comparisonData.map((item, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item.department_name}</td>
                            <td>{item.meeting_date}</td>
                            <td>{item.minute_title}</td>
                            <td>
                              <span className={`badge badge-${item.old_status_class || 'info'}`}>
                                {item.old_status}
                              </span>
                            </td>
                            <td>
                              <span className={`badge badge-${item.new_status_class || 'info'}`}>
                                {item.new_status}
                              </span>
                            </td>
                            <td>{item.updated_date}</td>
                            <td>
                              <a 
                                href={`/admin/recordnotes/edit/${item.id}`}
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
          )}
        </div>
      </div>
    </div>
  );
}
