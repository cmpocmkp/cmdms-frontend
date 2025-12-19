/**
 * Board Acts Show/Detail Report
 * EXACT replica of admin/report/boardacts/show
 */

import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { api } from '../../../lib/api';

interface BoardAct {
  id: number;
  act_date: string;
  attachment?: string;
  power_functions?: string;
  matters?: string;
  last_meeting_attachment?: string;
  department?: {
    id: number;
    name: string;
    boardMembers: BoardMember[];
  };
}

interface BoardMember {
  id: number;
  name: string;
  designation: string;
  type: number; // 1 = PRIVATE, 2 = GOVERNMENT
  qualification?: string;
  domicile?: string;
  joining_date?: string;
  expiration_date?: string;
  phone?: string;
  mobile?: string;
  email?: string;
  nic?: string;
  address?: string;
  resume?: string;
  status: number; // ACTIVE = 1
  department?: {
    name: string;
  };
}

interface Board {
  id: number;
  name: string;
}

export default function BoardActsShowReport() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dateWiseBoardActs, setDateWiseBoardActs] = useState<Record<string, BoardAct[]>>({});
  const [departmentName, setDepartmentName] = useState('');
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [selectedMemberData, setSelectedMemberData] = useState<string>('');
  const [activeTab, setActiveTab] = useState<Record<number, string>>({});
  const [boards, setBoards] = useState<Board[]>([]);
  const [selectedBoardId, setSelectedBoardId] = useState<string>(id || '');

  useEffect(() => {
    // TODO: Replace with actual API call
    // const fetchData = async () => {
    //   try {
    //     const response = await api.get(`/admin/boardacts/show/${id}`);
    //     setDateWiseBoardActs(response.data.dateWiseBoardActs);
    //     setDepartmentName(response.data.department_name);
    //     setBoards(response.data.boards);
    //   } catch (error) {
    //     console.error('Error fetching board acts:', error);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchData();

    // Dummy data
    setDepartmentName('Health Department');
    const dummyDateWiseBoardActs: Record<string, BoardAct[]> = {
      '2023-01-01': [
        {
          id: 1,
          act_date: '2023-01-01',
          attachment: 'act_2023.pdf',
          power_functions: 'power_functions_2023.pdf',
          matters: 'matters_2023.pdf',
          last_meeting_attachment: 'last_meeting_2023.pdf',
          department: {
            id: 1,
            name: 'Health Department',
            boardMembers: [
              {
                id: 1,
                name: 'Dr. John Doe',
                designation: 'Chairman',
                type: 1,
                qualification: 'MBBS, MD',
                domicile: 'Peshawar',
                joining_date: '2023-01-15',
                expiration_date: '2025-01-15',
                phone: '091-1234567',
                mobile: '0300-1234567',
                email: 'john.doe@example.com',
                nic: '12345-1234567-1',
                address: 'Peshawar, KPK',
                resume: 'resume.pdf',
                status: 1,
                department: { name: 'Health Department' },
              },
              {
                id: 2,
                name: 'Dr. Jane Smith',
                designation: 'Member',
                type: 2,
                qualification: 'MBBS',
                domicile: 'Peshawar',
                joining_date: '2023-02-01',
                expiration_date: '2026-02-01',
                phone: '091-7654321',
                mobile: '0300-7654321',
                email: 'jane.smith@example.com',
                nic: '54321-7654321-2',
                address: 'Peshawar, KPK',
                status: 1,
                department: { name: 'Health Department' },
              },
            ],
          },
        },
      ],
      '2024-01-01': [
        {
          id: 2,
          act_date: '2024-01-01',
          attachment: 'act_2024.pdf',
          power_functions: 'power_functions_2024.pdf',
          matters: 'matters_2024.pdf',
          department: {
            id: 1,
            name: 'Health Department',
            boardMembers: [],
          },
        },
      ],
    };

    setDateWiseBoardActs(dummyDateWiseBoardActs);
    // Initialize active tabs
    const initialTabs: Record<number, string> = {};
    Object.values(dummyDateWiseBoardActs).forEach((acts, index) => {
      initialTabs[index + 1] = 'act';
    });
    setActiveTab(initialTabs);

    // Dummy boards data
    const dummyBoards: Board[] = [
      { id: 1, name: 'Health Board' },
      { id: 2, name: 'Education Board' },
      { id: 3, name: 'Finance Board' },
    ];
    setBoards(dummyBoards);
    setSelectedBoardId(id || '');
    setLoading(false);
  }, [id]);

  const handleBoardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const boardId = e.target.value;
    setSelectedBoardId(boardId);
    if (boardId) {
      navigate(`/admin/report/board/acts/show/${boardId}`);
    }
  };

  const handleMemberClick = (member: BoardMember, boardName: string) => {
    const joiningDate = member.joining_date
      ? new Date(member.joining_date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-')
      : '';
    const expirationDate = member.expiration_date
      ? new Date(member.expiration_date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-')
      : '';

    const memberData = `
      <table class="related_department_table">
        <thead>
          <tr>
            <th>Member<br/> Name</th>
            <th>Board<br/> Name</th>
            <th>Qualification</th>
            <th>Designation</th>
            <th>Resume</th>
            <th>Domicile</th>
            <th>Joining date</th>
            <th>Expiration date</th>
            <th>Phone</th>
            <th>Mobile</th>
            <th>Email</th>
            <th>Nic</th>
            <th>Address</th>
            <th>Type</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>${member.name}</td>
            <td>${boardName}</td>
            <td>${member.qualification || ''}</td>
            <td>${member.designation}</td>
            <td>${member.resume ? `<span><a href="#" title="click to download attach file">Downlaod:<i class="ti-file"></i></a></span>` : ''}</td>
            <td>${member.domicile || ''}</td>
            <td>${joiningDate}</td>
            <td>${expirationDate}</td>
            <td>${member.phone || ''}</td>
            <td>${member.mobile || ''}</td>
            <td>${member.email || ''}</td>
            <td>${member.nic || ''}</td>
            <td>${member.address || ''}</td>
            <td>${member.type === 1 ? 'Non-exofficio' : 'Exofficio'}</td>
          </tr>
        </tbody>
      </table>
    `;
    setSelectedMemberData(memberData);
    setShowMemberModal(true);
  };

  if (loading) {
    return <div className="text-center p-5">Loading...</div>;
  }

  return (
    <div className="content-wrapper">
      <style>{`
        .related_department_table td {
          border: 1px solid silver !important;
          vertical-align: top !important;
          font-size: 16px !important;
          margin: 5px !important;
        }
        .related_department_table th {
          border: 1px solid silver !important;
          vertical-align: top !important;
          font-size: 16px !important;
          margin: 5px !important;
        }
        table#boardmeeting-listing b {
          color: #000 !important;
        }
        table#boardmeeting-listing a {
          color: #000 !important;
        }
        table#boardmeeting-listing span {
          color: #000 !important;
        }
        table#boardmeeting-listing {
          width: 100% !important;
        }
        table#boardmeeting-listing td {
          color: #000 !important;
          padding: 10px !important;
          border: 1px solid silver !important;
          vertical-align: top !important;
          font-size: 16px !important;
        }
        #boardmeeting-listing td ul li {
          font-size: 16px !important;
        }
        table#boardmeeting-listing th {
          font-size: 16px !important;
          padding: 5px !important;
          border: 1px solid silver !important;
          text-align: center !important;
        }
        table#boardmeeting-listing td small {
          color: black !important;
        }
        .card-body p {
          font-size: 16px;
          font-weight: bold;
        }
        .badge.badge-pill {
          font-size: 16px !important;
        }
        .blinking {
          animation: blinkingText 1.2s infinite;
        }
        @keyframes blinkingText {
          0% { color: var(--indigo); }
          49% { color: var(--indigo); }
          60% { color: transparent; }
          99% { color: transparent; }
          100% { color: var(--indigo); }
        }
        .boardsbutton {
          background-color: #1c87c9;
          -webkit-border-radius: 20px;
          border: 2px solid #1c87c90a;
          cursor: pointer;
          display: inline-block;
          font-family: sans-serif;
          font-size: 16px;
          padding: 5px;
          text-align: center;
          width: 150px;
        }
        @keyframes glowing {
          0% {
            background-color: yellow;
            box-shadow: 0 0 5px yellow;
          }
          50% {
            background-color: yellow;
            box-shadow: 0 0 20px yellow;
          }
          100% {
            background-color: yellow;
            box-shadow: 0 0 5px yellow;
          }
        }
        .boardsbutton {
          animation: glowing 1300ms infinite;
        }
        /* Force form visibility - EXACT match to old CMDMS */
        #boards-act {
          display: block !important;
          visibility: visible !important;
          opacity: 1 !important;
        }
        #boards-act label {
          display: block !important;
          visibility: visible !important;
          color: #000 !important;
          margin-bottom: 5px !important;
          font-weight: normal !important;
        }
        #boards-act select {
          display: block !important;
          visibility: visible !important;
          opacity: 1 !important;
          border: 1px solid #ced4da !important;
          background-color: #fff !important;
          color: #495057 !important;
          padding: 8px 12px !important;
          width: 350px !important;
          font-size: 16px !important;
          line-height: 1.5 !important;
        }
        .form-group {
          display: block !important;
          visibility: visible !important;
        }
        .form-sample {
          display: block !important;
          visibility: visible !important;
        }
        .row .col-4 {
          display: block !important;
          visibility: visible !important;
        }
      `}</style>

      <div className="card">
        <div className="card-body">
          <center>
            <h3>{departmentName} Board Acts</h3>
          </center>
          <br />
          <br />

          {/* Filter By Boards - Uncommented from old CMDMS (was commented out but should be visible) */}
          <div className="row">
            <div className="col-4">
              <form className="form-sample" action="" method="get" id="boards-act">
                <div className="col-md-6">
                  <label htmlFor="board_id">Filter By Boards </label>
                  <div className="form-group">
                    <select
                      name="board_id"
                      id="board_id"
                      style={{ width: '350px' }}
                      className="js-example-basic-single form-control-lg"
                      value={selectedBoardId}
                      onChange={handleBoardChange}
                    >
                      <option value="">Please Select Board</option>
                      {boards.map((board) => (
                        <option key={board.id} value={board.id}>
                          {board.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </form>
            </div>
          </div>

          <Link to="/admin/report/board/meetings" style={{ float: 'right' }}>
            Back
          </Link>

          <div className="row">
            <div className="col-12">
              <div className="table-responsive">
                {Object.entries(dateWiseBoardActs).length > 0 ? (
                  Object.entries(dateWiseBoardActs).map(([dateKey, boardActs], index) => {
                    const tabIndex = index + 1;
                    const currentTab = activeTab[tabIndex] || 'act';
                    const boardAct = boardActs[0];
                    const privateMembers = boardAct.department?.boardMembers.filter(
                      (m) => m.type === 1 && m.status === 1
                    ) || [];
                    const governmentMembers = boardAct.department?.boardMembers.filter(
                      (m) => m.type === 2 && m.status === 1
                    ) || [];

                    return (
                      <div
                        key={dateKey}
                        className="card-body"
                        style={index >= 1 ? { padding: 'unset' } : {}}
                      >
                        <h4
                          className="text-success font-weight-bold mb-3"
                          title={new Date(dateKey).toLocaleDateString('en-GB')}
                        >
                          {new Date(dateKey).getFullYear()}
                        </h4>
                        <ul className="nav nav-tabs" role="tablist">
                          <li className="nav-item">
                            <a
                              className={`nav-link ${currentTab === 'act' ? 'active' : ''}`}
                              id={`act${tabIndex}-tab`}
                              onClick={() => setActiveTab({ ...activeTab, [tabIndex]: 'act' })}
                              role="tab"
                              aria-controls={`act${tabIndex}`}
                              aria-selected={currentTab === 'act'}
                              style={{ cursor: 'pointer' }}
                            >
                              Act
                            </a>
                          </li>
                          <li className="nav-item">
                            <a
                              className={`nav-link ${currentTab === 'powerfunctions' ? 'active' : ''}`}
                              id={`powerfunctions${tabIndex}-tab`}
                              onClick={() => setActiveTab({ ...activeTab, [tabIndex]: 'powerfunctions' })}
                              role="tab"
                              aria-controls={`powerfunctions${tabIndex}`}
                              aria-selected={currentTab === 'powerfunctions'}
                              style={{ cursor: 'pointer' }}
                            >
                              Power & Functions
                            </a>
                          </li>
                          <li className="nav-item">
                            <a
                              className={`nav-link ${currentTab === 'matters' ? 'active' : ''}`}
                              id={`matters${tabIndex}-tab`}
                              onClick={() => setActiveTab({ ...activeTab, [tabIndex]: 'matters' })}
                              role="tab"
                              aria-controls={`matters${tabIndex}`}
                              aria-selected={currentTab === 'matters'}
                              style={{ cursor: 'pointer' }}
                            >
                              Matters
                            </a>
                          </li>
                          <li className="nav-item">
                            <a
                              className={`nav-link ${currentTab === 'lastmeetingminutes' ? 'active' : ''}`}
                              id={`lastmeetingminutes${tabIndex}-tab`}
                              onClick={() => setActiveTab({ ...activeTab, [tabIndex]: 'lastmeetingminutes' })}
                              role="tab"
                              aria-controls={`lastmeetingminutes${tabIndex}`}
                              aria-selected={currentTab === 'lastmeetingminutes'}
                              style={{ cursor: 'pointer' }}
                            >
                              Last Meeting Minutes
                            </a>
                          </li>
                          <li className="nav-item">
                            <a
                              className={`nav-link ${currentTab === 'boardmembers' ? 'active' : ''}`}
                              id={`boardmembers${tabIndex}-tab`}
                              onClick={() => setActiveTab({ ...activeTab, [tabIndex]: 'boardmembers' })}
                              role="tab"
                              aria-controls={`boardmembers${tabIndex}`}
                              aria-selected={currentTab === 'boardmembers'}
                              style={{ cursor: 'pointer' }}
                            >
                              Board Composition
                              {boardAct.department?.boardMembers && boardAct.department.boardMembers.length > 0 &&
                                ` (${boardAct.department.boardMembers.length})`}
                            </a>
                          </li>
                        </ul>
                        <div className="tab-content mb-5">
                          {boardActs.map((act) => (
                            <React.Fragment key={act.id}>
                              <div
                                className={`tab-pane fade ${currentTab === 'act' ? 'show active' : ''}`}
                                id={`act${tabIndex}`}
                                role="tabpanel"
                                aria-labelledby={`act${tabIndex}-tab`}
                              >
                                <h4 style={{ color: '#607D8B' }}>
                                  {act.attachment ? (
                                    <object
                                      data="#"
                                      type="application/pdf"
                                      width="100%"
                                      height="500px"
                                      style={{ border: '1px solid #ddd' }}
                                    >
                                      <p>
                                        Unable to display PDF file.{' '}
                                        <a href="#" target="_blank">
                                          Download
                                        </a>{' '}
                                        instead.
                                      </p>
                                    </object>
                                  ) : (
                                    'no data found'
                                  )}
                                </h4>
                              </div>
                              <div
                                className={`tab-pane fade ${currentTab === 'powerfunctions' ? 'show active' : ''}`}
                                id={`powerfunctions${tabIndex}`}
                                role="tabpanel"
                                aria-labelledby={`powerfunctions${tabIndex}-tab`}
                              >
                                <h4 style={{ color: '#607D8B' }}>
                                  {act.power_functions ? (
                                    <object
                                      data="#"
                                      type="application/pdf"
                                      width="100%"
                                      height="500px"
                                      style={{ border: '1px solid #ddd' }}
                                    >
                                      <p>
                                        Unable to display PDF file.{' '}
                                        <a href="#" target="_blank">
                                          Download
                                        </a>{' '}
                                        instead.
                                      </p>
                                    </object>
                                  ) : (
                                    'no data found'
                                  )}
                                </h4>
                              </div>
                              <div
                                className={`tab-pane fade ${currentTab === 'matters' ? 'show active' : ''}`}
                                id={`matters${tabIndex}`}
                                role="tabpanel"
                                aria-labelledby={`matters${tabIndex}-tab`}
                              >
                                <h4 style={{ color: '#607D8B' }}>
                                  {act.matters ? (
                                    <object
                                      data="#"
                                      type="application/pdf"
                                      width="100%"
                                      height="500px"
                                      style={{ border: '1px solid #ddd' }}
                                    >
                                      <p>
                                        Unable to display PDF file.{' '}
                                        <a href="#" target="_blank">
                                          Download
                                        </a>{' '}
                                        instead.
                                      </p>
                                    </object>
                                  ) : (
                                    'no data found'
                                  )}
                                </h4>
                              </div>
                              <div
                                className={`tab-pane fade ${currentTab === 'lastmeetingminutes' ? 'show active' : ''}`}
                                id={`lastmeetingminutes${tabIndex}`}
                                role="tabpanel"
                                aria-labelledby={`lastmeetingminutes${tabIndex}-tab`}
                              >
                                <h4 style={{ color: '#607D8B' }}>
                                  {act.last_meeting_attachment ? (
                                    <object
                                      data="#"
                                      type="application/pdf"
                                      width="100%"
                                      height="500px"
                                      style={{ border: '1px solid #ddd' }}
                                    >
                                      <p>
                                        Unable to display PDF file.{' '}
                                        <a href="#" target="_blank">
                                          Download
                                        </a>{' '}
                                        instead.
                                      </p>
                                    </object>
                                  ) : (
                                    'no data found'
                                  )}
                                </h4>
                              </div>
                              <div
                                className={`tab-pane fade ${currentTab === 'boardmembers' ? 'show active' : ''}`}
                                id={`boardmembers${tabIndex}`}
                                role="tabpanel"
                                aria-labelledby={`boardmembers${tabIndex}-tab`}
                              >
                                <td className="font-weight-bold" style={{ width: '350px', display: 'table-cell' }}>
                                  {privateMembers.length > 0 ? (
                                    <>
                                      <span className="text-success">Non-exofficio member's</span>
                                      <ul className="list-arrow text-info">
                                        {privateMembers.map((member) => (
                                          <li key={member.id}>
                                            <a
                                              href="#"
                                              style={{ textDecoration: 'none', fontSize: '12px' }}
                                              onClick={(e) => {
                                                e.preventDefault();
                                                handleMemberClick(member, departmentName);
                                              }}
                                              className="update_related_department_minute_btn hide_in_print"
                                            >
                                              {member.name}
                                              <small className="text-dark"> ({member.designation})</small>
                                            </a>
                                          </li>
                                        ))}
                                      </ul>
                                    </>
                                  ) : null}
                                </td>
                                <td className="font-weight-bold" style={{ width: '250px', display: 'table-cell' }}>
                                  {governmentMembers.length > 0 ? (
                                    <>
                                      <span className="text-success">Exofficio member's</span>
                                      <ul className="list-arrow text-info">
                                        {governmentMembers.map((member) => (
                                          <li key={member.id}>
                                            <a
                                              href="#"
                                              style={{ textDecoration: 'none', fontSize: '12px' }}
                                              onClick={(e) => {
                                                e.preventDefault();
                                                handleMemberClick(member, departmentName);
                                              }}
                                              className="update_related_department_minute_btn hide_in_print"
                                            >
                                              {member.name}
                                              <small className="text-dark"> ({member.designation})</small>
                                            </a>
                                          </li>
                                        ))}
                                      </ul>
                                    </>
                                  ) : null}
                                </td>
                              </div>
                            </React.Fragment>
                          ))}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div>&nbsp;</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Member Details */}
      {showMemberModal && (
        <div
          className="modal fade show"
          style={{ display: 'block' }}
          tabIndex={-1}
          role="dialog"
          aria-labelledby="ModalLabel"
          aria-hidden="false"
        >
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header" style={{ padding: '15px 27px' }}>
                <h5 className="modal-title" id="ModalLabel">
                  Member Detail
                </h5>
                <button
                  type="button"
                  className="close"
                  onClick={() => setShowMemberModal(false)}
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body" style={{ padding: '10px 26px' }}>
                <div className="row">
                  <div
                    style={{ margin: 'auto', width: '80%', padding: '10px' }}
                    id="related_departments_data_show"
                    dangerouslySetInnerHTML={{ __html: selectedMemberData }}
                  />
                </div>
              </div>
              <div className="modal-footer">
                &nbsp;
              </div>
            </div>
          </div>
        </div>
      )}
      {showMemberModal && (
        <div className="modal-backdrop fade show" onClick={() => setShowMemberModal(false)}></div>
      )}
    </div>
  );
}
