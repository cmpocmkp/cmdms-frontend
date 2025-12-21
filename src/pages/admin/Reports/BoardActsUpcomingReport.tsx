/**
 * Upcoming Board Acts Report
 * EXACT replica of admin/report/boardacts/upcoming
 */

import { useState, useEffect } from 'react';

interface BoardAct {
  id: number;
  board_name: string;
  act_name: string;
  act_number: string;
  act_date: string;
  status: string;
  status_class: string;
}

export default function BoardActsUpcomingReport() {
  const [loading, setLoading] = useState(true);
  const [boardActs, setBoardActs] = useState<BoardAct[]>([]);

  useEffect(() => {
    // TODO: Replace with actual API call
    // const fetchData = async () => {
    //   try {
    //     const response = await api.get('/admin/report/boardacts/upcoming');
    //     setBoardActs(response.data);
    //   } catch (error) {
    //     console.error('Error fetching upcoming board acts:', error);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchData();

    // Dummy data
    const dummyBoardActs: BoardAct[] = [
      {
        id: 1,
        board_name: 'Health Board',
        act_name: 'Health Act 2024',
        act_number: 'ACT-2024-001',
        act_date: '2024-06-01',
        status: 'Upcoming',
        status_class: 'warning',
      },
      {
        id: 2,
        board_name: 'Education Board',
        act_name: 'Education Act 2024',
        act_number: 'ACT-2024-002',
        act_date: '2024-07-15',
        status: 'Upcoming',
        status_class: 'warning',
      },
    ];

    setBoardActs(dummyBoardActs);
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
            <h3>Upcoming Board Acts</h3>
          </center>
          <div className="row mt-4">
            <div className="col-12">
              <div className="table-responsive">
                <table id="boardacts-listing" className="table table-striped table-bordered">
                  <thead style={{ background: 'rgb(37, 136, 95)', color: 'white' }}>
                    <tr>
                      <th>S#</th>
                      <th>Board</th>
                      <th>Act Name</th>
                      <th>Act Number</th>
                      <th>Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {boardActs.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center">
                          No data available
                        </td>
                      </tr>
                    ) : (
                      boardActs.map((act, index) => (
                        <tr key={act.id}>
                          <td>{index + 1}</td>
                          <td>{act.board_name}</td>
                          <td>{act.act_name}</td>
                          <td>{act.act_number}</td>
                          <td>{new Date(act.act_date).toLocaleDateString('en-GB')}</td>
                          <td>
                            <span className={`badge badge-${act.status_class || 'info'}`}>
                              {act.status}
                            </span>
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
