/**
 * PTF Module - Meetings
 * EXACT replica of admin/report/ptf/meetings
 */

import { useState, useEffect } from 'react';

export default function PTFMeetingsReport() {
  const [loading, setLoading] = useState(true);
  const [meetings, _setMeetings] = useState<any[]>([]);

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
            <h3>PTF Meetings Report</h3>
            <div className="row mt-4">
              <div className="col-12">
                <div className="table-responsive">
                  <table className="table table-striped table-bordered">
                    <thead style={{ background: 'rgb(37, 136, 95)', color: 'white' }}>
                      <tr>
                        <th>S#</th>
                        <th>Meeting Date</th>
                        <th>Meeting Type</th>
                        <th>Total Decisions</th>
                        <th>Completed</th>
                        <th>On Target</th>
                        <th>On Going</th>
                        <th>Off Target</th>
                        <th>Overdue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {meetings.length === 0 ? (
                        <tr>
                          <td colSpan={9} className="text-center">No data available</td>
                        </tr>
                      ) : (
                        meetings.map((meeting, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{meeting.meeting_date}</td>
                            <td>{meeting.meeting_type}</td>
                            <td>{meeting.total_decisions || 0}</td>
                            <td>{meeting.completed || 0}</td>
                            <td>{meeting.on_target || 0}</td>
                            <td>{meeting.on_going || 0}</td>
                            <td>{meeting.off_target || 0}</td>
                            <td>{meeting.overdue || 0}</td>
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
