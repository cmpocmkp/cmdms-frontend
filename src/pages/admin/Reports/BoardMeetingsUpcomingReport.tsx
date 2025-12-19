/**
 * Upcoming Board Meetings Report
 * EXACT replica of admin/report/boardmeetings/upcoming
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../../lib/api';

interface BoardMeeting {
  id: number;
  board_name: string;
  subject: string;
  date: string;
  meeting_type: string;
  total_agenda_points: number;
}

export default function BoardMeetingsUpcomingReport() {
  const [loading, setLoading] = useState(true);
  const [boardMeetings, setBoardMeetings] = useState<BoardMeeting[]>([]);

  useEffect(() => {
    // TODO: Replace with actual API call
    // const fetchData = async () => {
    //   try {
    //     const response = await api.get('/admin/report/boardmeetings/upcoming');
    //     setBoardMeetings(response.data);
    //   } catch (error) {
    //     console.error('Error fetching upcoming board meetings:', error);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchData();

    // Dummy data
    const dummyMeetings: BoardMeeting[] = [
      {
        id: 1,
        board_name: 'Health Board',
        subject: 'Health Board Meeting - Q3 2024',
        date: '2024-07-15',
        meeting_type: 'Regular',
        total_agenda_points: 10,
      },
      {
        id: 2,
        board_name: 'Education Board',
        subject: 'Education Board Meeting - Q3 2024',
        date: '2024-08-01',
        meeting_type: 'Special',
        total_agenda_points: 8,
      },
    ];

    setBoardMeetings(dummyMeetings);
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
            <h3>Upcoming Board Meetings</h3>
          </center>
          <div className="row mt-4">
            <div className="col-12">
              <div className="table-responsive">
                <table id="boardmeeting-listing" className="table table-striped table-bordered">
                  <thead style={{ background: 'rgb(37, 136, 95)', color: 'white' }}>
                    <tr>
                      <th>S#</th>
                      <th>Board</th>
                      <th>Meeting Subject</th>
                      <th>Meeting Date</th>
                      <th>Meeting Type</th>
                      <th>Total Agenda Points</th>
                    </tr>
                  </thead>
                  <tbody>
                    {boardMeetings.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center">
                          No data available
                        </td>
                      </tr>
                    ) : (
                      boardMeetings.map((meeting, index) => (
                        <tr key={meeting.id}>
                          <td>{index + 1}</td>
                          <td>{meeting.board_name}</td>
                          <td>{meeting.subject}</td>
                          <td>{new Date(meeting.date).toLocaleDateString('en-GB')}</td>
                          <td>{meeting.meeting_type}</td>
                          <td>{meeting.total_agenda_points || 0}</td>
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
