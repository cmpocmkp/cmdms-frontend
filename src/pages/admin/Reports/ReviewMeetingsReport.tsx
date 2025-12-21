/**
 * Review Meetings Report
 * EXACT replica of admin/report/review-meetings/index.blade.php
 */

import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export default function ReviewMeetingsReport() {
  const [searchParams] = useSearchParams();
  const [_loading, setLoading] = useState(false);
  const [reviewMeetings, setReviewMeetings] = useState<any[]>([]);
  const [startDate, setStartDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState<string>('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // TODO: Replace with actual API call
    // try {
    //   const params = new URLSearchParams();
    //   if (startDate) params.append('start_date', startDate);
    //   if (endDate) params.append('end_date', endDate);
    //   const response = await api.get(`/admin/report/review-meetings?${params.toString()}`);
    //   setReviewMeetings(response.data);
    // } catch (error) {
    //   console.error('Error fetching review meetings:', error);
    // } finally {
    //   setLoading(false);
    // }
    setLoading(false);
  };

  const handleReset = () => {
    setStartDate(new Date().toISOString().split('T')[0]);
    setEndDate('');
    setReviewMeetings([]);
  };

  return (
    <div className="content-wrapper">
      <div className="card">
        <div className="card-body">
          <h4 className="card-title text-primary text-center">Review Meetings</h4>
          <p className="text-center">Admin User</p>
          
          <form className="forms-sample" onSubmit={handleSearch}>
            <div className="row">
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
                  <button type="submit" className="btn btn-success">Search</button>
                  <button type="button" onClick={handleReset} className="btn btn-warning btn-md ml-2">
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </form>

          {(searchParams.has('start_date') || reviewMeetings.length > 0) && (
            <>
              {reviewMeetings.length === 0 ? (
                <p>No result found.</p>
              ) : (
                <div className="row mt-4">
                  <div className="col-12">
                    <div className="table-responsive">
                      <table id="record-note-listing" className="table table-striped" role="grid">
                        <thead>
                          <tr>
                            <th>S.NO</th>
                            <th>Subject</th>
                            <th>Date</th>
                            <th>Discussion</th>
                            <th>Number of<br />discussed decisions</th>
                            <th>Number of<br />updated decisions</th>
                            <th>Departments</th>
                            <th>Participants</th>
                            <th>Picture's</th>
                          </tr>
                        </thead>
                        <tbody>
                          {reviewMeetings.map((meeting, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td dangerouslySetInnerHTML={{ __html: meeting.subject }} />
                              <td>{new Date(meeting.date).toLocaleDateString('en-GB')}</td>
                              <td dangerouslySetInnerHTML={{ __html: meeting.discussion }} />
                              <td>{meeting.number_of_discussed_decisions}</td>
                              <td>{meeting.number_of_updated_decisions}</td>
                              <td>
                                {meeting.departments && meeting.departments.length > 0 && (
                                  <>
                                    ({meeting.departments.length})
                                    {meeting.departments.map((dept: any, idx: number) => (
                                      <span key={idx} className="badge badge-info mr-1">
                                        {dept.name}
                                      </span>
                                    ))}
                                  </>
                                )}
                              </td>
                              <td dangerouslySetInnerHTML={{ __html: meeting.participants }} />
                              <td>
                                {meeting.images && meeting.images.length > 0 && (
                                  <div>
                                    {meeting.images.map((img: string, idx: number) => (
                                      <a key={idx} href={img} target="_blank" rel="noreferrer" className="mr-2">
                                        <img src={img} alt={`Image ${idx + 1}`} style={{ width: '50px', height: '50px' }} />
                                      </a>
                                    ))}
                                  </div>
                                )}
                              </td>
                            </tr>
                          ))}
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
