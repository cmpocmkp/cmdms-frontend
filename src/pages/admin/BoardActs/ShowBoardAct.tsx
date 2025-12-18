/**
 * Show Board Act - Admin Module
 * EXACT replica of admin/boardacts/show.blade.php from old CMDMS
 */

import { useState, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { mockBoardActs } from '../../../lib/mocks/data/boardActs';
import { mockAdminDepartments } from '../../../lib/mocks/data/adminDepartments';

export default function ShowBoardAct() {
  const { id } = useParams<{ id: string }>();
  const boardId = Number(id);
  
  // Filter acts for this board
  const boardActs = mockBoardActs.filter(a => a.department_id === boardId);
  const board = mockAdminDepartments.find(d => d.id === boardId);
  const [searchTerm, setSearchTerm] = useState('');

  // Format date as 'd/m/Y'
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Export to Excel
  const handleExcel = () => {
    const headers = ['S.No', 'Act Date', 'Act Title', 'Attached Act'];
    const rows = filteredBoardActs.map((act, idx) => [
      idx + 1,
      formatDate(act.act_date),
      act.title.replace(/<[^>]*>/g, ''),
      act.attachment ? 'Yes' : 'No'
    ]);
    
    let csv = headers.join(',') + '\n';
    rows.forEach(row => {
      csv += row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',') + '\n';
    });
    
    const blob = new Blob([csv], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `board_acts_${new Date().toISOString().split('T')[0]}.xls`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  // Print functionality
  const handlePrint = () => {
    window.print();
  };

  // Filter acts based on search term
  const filteredBoardActs = useMemo(() => {
    if (!searchTerm.trim()) {
      return boardActs;
    }

    const lowerSearchTerm = searchTerm.toLowerCase();
    return boardActs.filter((act) => {
      const actTitle = act.title.toLowerCase();
      const actDate = formatDate(act.act_date).toLowerCase();
      return actTitle.includes(lowerSearchTerm) || actDate.includes(lowerSearchTerm);
    });
  }, [boardActs, searchTerm]);

  return (
    <div className="content-wrapper">
      <style>
        {`
          table#directive-listing {
            width: 100% !important;
          }
          table#directive-listing td p {
            width: 300px !important;
          }
          table#directive-listing th {
            padding: 10px !important;
          }
          table#directive-listing td {
            padding: 10px !important;
          }
        `}
      </style>
      <div className="card">
        <div className="card-body">
          <div className="row">
            <div className="col-md-12">
              <h4 style={{ float: 'left' }} className="card-title">
                All Board Acts of <strong className="text-success">{board?.name || ''}</strong>
              </h4>
              <div style={{ marginBottom: '10px' }} className="btn-toolbar pull-right">
                <div className="btn-group">
                  <Link
                    to="/admin/boardacts"
                    className="btn btn-sm btn-inverse-dark btn-fw"
                    style={{ float: 'right' }}
                  >
                    <i className="ti-layers-alt text-primary mr-1"></i>all boards
                  </Link>
                  <Link
                    to="/admin/boardacts/add"
                    style={{ padding: '0.3rem 1rem' }}
                    className="btn btn-sm btn-inverse-dark btn-fw"
                    role="button"
                  >
                    <i className="ti-plus text-primary mr-1"></i>board act
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Excel, Print, and Search Section */}
          <div className="row mb-3" style={{ marginTop: '15px' }}>
            <div className="col-md-6">
              <div className="btn-group" style={{ marginRight: '10px' }}>
                <button
                  type="button"
                  className="btn btn-light"
                  onClick={handleExcel}
                  style={{
                    backgroundColor: '#f5f5f5',
                    border: '1px solid #ddd',
                    padding: '6px 12px',
                    borderRadius: '4px',
                    marginRight: '5px'
                  }}
                >
                  Excel
                </button>
                <button
                  type="button"
                  className="btn btn-light"
                  onClick={handlePrint}
                  style={{
                    backgroundColor: '#f5f5f5',
                    border: '1px solid #ddd',
                    padding: '6px 12px',
                    borderRadius: '4px'
                  }}
                >
                  Print
                </button>
              </div>
            </div>
            <div className="col-md-6" style={{ textAlign: 'right' }}>
              <div className="form-group" style={{ display: 'inline-block', margin: 0 }}>
                <label style={{ marginRight: '8px', marginBottom: 0 }}>Search:</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search acts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    display: 'inline-block',
                    width: '200px',
                    padding: '6px 12px',
                    borderRadius: '4px',
                    border: '1px solid #ddd'
                  }}
                />
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-12">
              <div className="table-responsive">
                <table id="directive-listing" className="table-striped" role="grid">
                  <thead>
                    <tr>
                      <th>S.NO</th>
                      <th>Act Date</th>
                      <th>Act Title</th>
                      <th>Atttached Act</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBoardActs.length > 0 ? (
                      filteredBoardActs.map((act, index) => (
                        <tr key={act.id}>
                          <td>{index + 1}</td>
                          <td>{formatDate(act.act_date)}</td>
                          <td>{act.title}</td>
                          <td>
                            {act.attachment ? (
                              <span style={{ display: 'block', marginBottom: '5px' }}>
                                <a
                                  href="#"
                                  title="click to download attach file"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    console.log('Download attachment:', act.attachment);
                                  }}
                                >
                                  Attachment:<i className="ti-file"></i>
                                </a>
                              </span>
                            ) : (
                              <>&nbsp;</>
                            )}
                          </td>
                          <td>
                            <Link
                              style={{ float: 'left', marginLeft: '20px' }}
                              className="boardact_id text-primary mr-2"
                              to={`/admin/boardacts/edit/${act.id}`}
                              title="edit"
                            >
                              <i className="ti-pencil-alt icon-sm"></i>
                            </Link>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={10}>
                          {searchTerm ? `No board acts found matching "${searchTerm}"` : 'There is no data.'}
                        </td>
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

