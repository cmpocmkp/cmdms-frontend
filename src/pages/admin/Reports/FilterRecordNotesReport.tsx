/**
 * Filter Record Notes Report
 * EXACT replica of admin/report/filter-record-notes
 */

import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../../../lib/api';

export default function FilterRecordNotesReport() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [recordNotes, setRecordNotes] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [keyword, setKeyword] = useState<string>('');

  useEffect(() => {
    // TODO: Fetch departments
    // const fetchDepartments = async () => {
    //   try {
    //     const response = await api.get('/admin/departments');
    //     setDepartments(response.data);
    //   } catch (error) {
    //     console.error('Error fetching departments:', error);
    //   }
    // };
    // fetchDepartments();
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
    //   if (keyword) params.append('keyword', keyword);
    //   const response = await api.get(`/admin/report/filter-recordnotes?${params.toString()}`);
    //   setRecordNotes(response.data);
    // } catch (error) {
    //   console.error('Error fetching record notes:', error);
    // } finally {
    //   setLoading(false);
    // }
    setLoading(false);
  };

  const handleReset = () => {
    setSelectedDepartment('');
    setStartDate('');
    setEndDate('');
    setKeyword('');
    setRecordNotes([]);
  };

  return (
    <div className="content-wrapper">
      <div className="card">
        <div className="card-body">
          <center>
            <h3>Filter Record Notes</h3>
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
              <div className="col-md-3">
                <label>Keyword</label>
                <div className="form-group">
                  <input
                    type="text"
                    name="keyword"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    className="form-control"
                    placeholder="Search keyword"
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

          {(searchParams.has('department_id') || recordNotes.length > 0) && (
            <div className="row mt-4">
              <div className="col-12">
                <div className="table-responsive">
                  <table className="table table-striped table-bordered">
                    <thead style={{ background: 'rgb(37, 136, 95)', color: 'white' }}>
                      <tr>
                        <th>S#</th>
                        <th>Meeting Date</th>
                        <th>Department</th>
                        <th>Minute Title</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recordNotes.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="text-center">No data available</td>
                        </tr>
                      ) : (
                        recordNotes.map((note, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{note.meeting_date}</td>
                            <td>{note.department_name}</td>
                            <td>{note.minute_title}</td>
                            <td>
                              <span className={`badge badge-${note.status_class || 'info'}`}>
                                {note.status}
                              </span>
                            </td>
                            <td>
                              <a 
                                href={`/admin/recordnotes/edit/${note.id}`}
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
