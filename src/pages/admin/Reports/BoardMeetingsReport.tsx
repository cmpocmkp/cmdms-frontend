/**
 * Board Meetings Report
 * EXACT replica of admin/report/board/meetings
 */

import { useState, useEffect } from 'react';
import { api } from '../../../lib/api';

export default function BoardMeetingsReport() {
  const [loading, setLoading] = useState(true);
  const [boardMeetings, setBoardMeetings] = useState<any[]>([]);

  useEffect(() => {
    // TODO: Replace with actual API call
    // const fetchData = async () => {
    //   try {
    //     const response = await api.get('/admin/report/board/meetings');
    //     setBoardMeetings(response.data);
    //   } catch (error) {
    //     console.error('Error fetching board meetings:', error);
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
            <h3>Board Meetings Report</h3>
            <div className="row mt-4">
              <div className="col-12">
                <div className="table-responsive">
                  <table id="boardmeeting-listing" className="table table-striped table-bordered">
                    <thead style={{ background: 'rgb(37, 136, 95)', color: 'white' }}>
                      <tr>
                        <th>S#</th>
                        <th>Board</th>
                        <th>Meeting Date</th>
                        <th>Meeting Type</th>
                        <th>Total Agenda Points</th>
                        <th>Completed</th>
                        <th>On Target</th>
                        <th>On Going</th>
                        <th>Off Target</th>
                        <th>Overdue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {boardMeetings.length === 0 ? (
                        <tr>
                          <td colSpan={10} className="text-center">No data available</td>
                        </tr>
                      ) : (
                        boardMeetings.map((meeting, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{meeting.board_name}</td>
                            <td>{meeting.meeting_date}</td>
                            <td>{meeting.meeting_type}</td>
                            <td>{meeting.total_agenda_points || 0}</td>
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
