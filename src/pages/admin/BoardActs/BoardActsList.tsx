/**
 * Board Acts List - Admin Module
 * EXACT replica of admin/boardacts/index.blade.php from old CMDMS
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { mockAdminDepartments } from '../../../lib/mocks/data/adminDepartments';

// Mock boards (departments that are boards)
const mockBoards = mockAdminDepartments.slice(0, 10).map((dept) => ({
  id: dept.id,
  name: dept.name + ' Board'
}));

export default function BoardActsList() {
  const [boards] = useState(mockBoards);

  return (
    <div className="content-wrapper">
      <div className="card">
        <div className="card-body">
          <Link to="/admin/boardacts/add" style={{ float: 'right' }}>
            Add New Board Act
          </Link>
          <h4 className="card-title">All Boards</h4>

          <div className="row">
            <div className="col-12">
              <div className="table-responsive">
                <table id="table_record_report_list" className="table table-striped" role="grid">
                  <thead>
                    <tr>
                      <th>Boards</th>
                    </tr>
                  </thead>
                  <tbody>
                    {boards.length > 0 ? (
                      boards.map((board) => (
                        <tr key={board.id}>
                          <td>
                            <Link
                              to={`/admin/boardacts/show/${board.id}`}
                              className="text-primary mr-2"
                            >
                              <div dangerouslySetInnerHTML={{ __html: board.name }} />
                            </Link>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={10}>There is no data.</td>
                      </tr>
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

