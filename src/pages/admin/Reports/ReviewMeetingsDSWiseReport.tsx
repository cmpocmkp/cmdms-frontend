/**
 * Review Meetings By DS Report
 * EXACT replica of admin/report/reviewmeetings/ds-wise.blade.php from old CMDMS
 */

import { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { mockReviewMeetings } from '../../../lib/mocks/data/reviewMeetings';
import { mockAdminDepartments } from '../../../lib/mocks/data/adminDepartments';
import { mockAdminUsers } from '../../../lib/mocks/data/adminUsers';

// Format date as 'd/m/Y'
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export default function ReviewMeetingsDSWiseReport() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [dpSecretary, setDpSecretary] = useState<string>(
    searchParams.get('dp_secretary') || ''
  );
  const [startDate, setStartDate] = useState<string>(
    searchParams.get('start_date') || new Date().toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState<string>(
    searchParams.get('end_date') || ''
  );

  // Filter deputy secretaries (users with Department role)
  const deputySecretaries = mockAdminUsers.filter(
    u => u.role_name === 'Department' || u.role_name === 'Admin'
  ).slice(0, 20);

  // Filter review meetings based on search criteria
  const filteredReviewMeetings = useMemo(() => {
    const hasToken = searchParams.has('_token');
    const hasDpSecretary = searchParams.has('dp_secretary');
    
    if (!hasToken && !hasDpSecretary) return [];
    
    let filtered = [...mockReviewMeetings];
    
    // Filter by date range
    if (startDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      filtered = filtered.filter(rm => {
        const meetingDate = new Date(rm.date);
        meetingDate.setHours(0, 0, 0, 0);
        return meetingDate >= start;
      });
    }
    
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      filtered = filtered.filter(rm => {
        const meetingDate = new Date(rm.date);
        return meetingDate <= end;
      });
    }
    
    // Note: In real implementation, dpSecretary would filter by DS association
    // For now, we'll just return filtered results
    
    return filtered.slice(0, 15); // Limit to 15 for display
  }, [searchParams, startDate, endDate]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (dpSecretary) params.append('dp_secretary', dpSecretary);
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    params.append('_token', 'dummy'); // Simulate CSRF token
    setSearchParams(params);
  };

  const handleReset = () => {
    setDpSecretary('');
    setStartDate(new Date().toISOString().split('T')[0]);
    setEndDate('');
    setSearchParams({});
  };

  const hasSearchParams = searchParams.has('_token') || searchParams.has('dp_secretary');

  return (
    <div className="content-wrapper">
      <style>
        {`
          table#record-note-listing th, td {
            border: 1px solid silver !important;
          }
          table#record-note-listing tr td {
            vertical-align: top !important;
          }
        `}
      </style>
      <div className="card">
        <div className="card-body">
          <h4 className="card-title text-primary text-center">Review Meetings</h4>

          <form
            className="forms-sample"
            onSubmit={handleSearch}
            id="overall_ds_wise_report"
          >
            <div className="row">
              <div className="col-md-3">
                <label>Deputy Secretaries</label>
                <div className="form-group">
                  <select
                    name="dp_secretary"
                    id="dp_secretary"
                    className="js-example-basic-single w-100 form-control"
                    required
                    value={dpSecretary}
                    onChange={(e) => setDpSecretary(e.target.value)}
                  >
                    <option value="">--Select DS--</option>
                    {deputySecretaries.map((secretary) => (
                      <option key={secretary.id} value={secretary.id.toString()}>
                        {secretary.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="col-md-3">
                <label>From Date</label>
                <div className="form-group">
                  <input
                    type="date"
                    name="start_date"
                    id="review_meeting_start_date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="form-control"
                    required
                  />
                </div>
              </div>
              <div className="col-md-3">
                <label>To Date</label>
                <div className="form-group">
                  <input
                    type="date"
                    name="end_date"
                    id="review_meeting_end_date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="form-control"
                  />
                </div>
              </div>
              <div className="col-md-3">
                <div className="form-group mt-4">
                  <button type="submit" className="btn btn-success">
                    Search
                  </button>
                  <Link
                    to="/admin/report/ds-wise-review-meetings"
                    className="btn btn-warning btn-md ml-2"
                    onClick={handleReset}
                  >
                    Reset
                  </Link>
                </div>
              </div>
            </div>
          </form>

          {hasSearchParams && (
            <>
              {filteredReviewMeetings.length === 0 ? (
                <p>No result found.</p>
              ) : (
                <div className="row">
                  <div className="col-12">
                    <div className="table-responsive">
                      <table
                        id="record-note-listing"
                        className="table table-striped"
                        role="grid"
                        style={{ border: '1px solid silver' }}
                      >
                        <thead>
                          <tr>
                            <th>S.NO</th>
                            <th>Subject</th>
                            <th>Date</th>
                            <th>Discussion</th>
                            <th>Number of <br />discussed decisions</th>
                            <th>Number of <br />updated decisions</th>
                            <th>Departments</th>
                            <th>Participants</th>
                            <th>Picture's</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredReviewMeetings.length > 0 ? (
                            filteredReviewMeetings.map((reviewMeeting, index) => {
                              const departments = mockAdminDepartments.filter(d =>
                                reviewMeeting.departments.includes(d.id)
                              );
                              return (
                                <tr key={reviewMeeting.id}>
                                  <td>{index + 1}</td>
                                  <td>
                                    <div dangerouslySetInnerHTML={{ __html: reviewMeeting.subject }} />
                                  </td>
                                  <td>{formatDate(reviewMeeting.date)}</td>
                                  <td>
                                    <div dangerouslySetInnerHTML={{ __html: reviewMeeting.discussion }} />
                                  </td>
                                  <td>{reviewMeeting.number_of_discussed_decisions}</td>
                                  <td>{reviewMeeting.number_of_updated_decisions}</td>
                                  <td>
                                    {departments.length > 0 && (
                                      <>
                                        ({departments.length})
                                      </>
                                    )}
                                    <ul style={{ margin: 0, paddingLeft: '20px', listStyle: 'disc' }}>
                                      {departments.map((dept) => (
                                        <li key={dept.id}>{dept.name}</li>
                                      ))}
                                    </ul>
                                  </td>
                                  <td>
                                    <div dangerouslySetInnerHTML={{ __html: reviewMeeting.participants }} />
                                  </td>
                                  <td>
                                    {reviewMeeting.images && reviewMeeting.images.length > 0 ? (
                                      reviewMeeting.images.map((image, idx) => (
                                        <span key={idx} style={{ marginRight: '5px' }}>
                                          <a
                                            href={image}
                                            title="click to view"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                          >
                                            <img width="150" height="150" src={image} alt={`Image ${idx + 1}`} />
                                          </a>
                                        </span>
                                      ))
                                    ) : (
                                      <>&nbsp;</>
                                    )}
                                  </td>
                                </tr>
                              );
                            })
                          ) : (
                            <tr>
                              <td colSpan={9} className="text-center">
                                There is no data.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
