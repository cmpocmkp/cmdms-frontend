/**
 * Board Acts Report
 * EXACT replica of admin/report/board/acts
 */

import { useState, useEffect } from 'react';
import { api } from '../../../lib/api';

export default function BoardActsReport() {
  const [loading, setLoading] = useState(true);
  const [boardActs, setBoardActs] = useState<any[]>([]);

  useEffect(() => {
    // TODO: Replace with actual API call
    // const fetchData = async () => {
    //   try {
    //     const response = await api.get('/admin/report/board/acts');
    //     setBoardActs(response.data);
    //   } catch (error) {
    //     console.error('Error fetching board acts:', error);
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
            <h3>Board Acts Report</h3>
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
                          <td colSpan={6} className="text-center">No data available</td>
                        </tr>
                      ) : (
                        boardActs.map((act, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{act.board_name}</td>
                            <td>{act.act_name}</td>
                            <td>{act.act_number}</td>
                            <td>{act.date}</td>
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
          </center>
        </div>
      </div>
    </div>
  );
}
