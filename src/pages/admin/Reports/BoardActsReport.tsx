/**
 * Board Acts Report - Board-wise
 * EXACT replica of admin/report/boardacts/index
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../../lib/api';

interface Board {
  id: number;
  name: string;
  boardMembers: BoardMember[];
  boardActs: BoardAct[];
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

interface BoardAct {
  id: number;
  act_date: string;
}

export default function BoardActsReport() {
  const [loading, setLoading] = useState(true);
  const [boardsWithActs, setBoardsWithActs] = useState<Board[]>([]);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [selectedMemberData, setSelectedMemberData] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // TODO: Replace with actual API call
    // const fetchData = async () => {
    //   try {
    //     const response = await api.get('/admin/report/boardacts');
    //     setBoardsWithActs(response.data.boards);
    //   } catch (error) {
    //     console.error('Error fetching board acts:', error);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchData();

    // Dummy data matching the screenshot
    const dummyBoards: Board[] = [
      {
        id: 1,
        name: 'Cadet College Wana, South Waziristan',
        boardMembers: [
          {
            id: 1,
            name: 'IG FC KP South',
            designation: 'Member',
            type: 1, // PRIVATE
            status: 1,
            department: { name: 'Cadet College Wana, South Waziristan' },
          },
          {
            id: 2,
            name: 'Chief Minister',
            designation: 'Member',
            type: 2, // GOVERNMENT
            status: 1,
            department: { name: 'Cadet College Wana, South Waziristan' },
          },
          {
            id: 3,
            name: 'Secretary E&SED',
            designation: 'Member',
            type: 2,
            status: 1,
            department: { name: 'Cadet College Wana, South Waziristan' },
          },
          {
            id: 4,
            name: 'Secretary Finance',
            designation: 'Member',
            type: 2,
            status: 1,
            department: { name: 'Cadet College Wana, South Waziristan' },
          },
          {
            id: 5,
            name: 'Director E&SE',
            designation: 'Member',
            type: 2,
            status: 1,
            department: { name: 'Cadet College Wana, South Waziristan' },
          },
          {
            id: 6,
            name: 'DC South Waziristan',
            designation: 'Member',
            type: 2,
            status: 1,
            department: { name: 'Cadet College Wana, South Waziristan' },
          },
          {
            id: 7,
            name: 'Principal Cadet College Wana',
            designation: 'Member',
            type: 2,
            status: 1,
            department: { name: 'Cadet College Wana, South Waziristan' },
          },
        ],
        boardActs: [],
      },
      {
        id: 2,
        name: 'RTB (Road Transport Board)',
        boardMembers: [
          {
            id: 8,
            name: 'TBD (Unknown)',
            designation: 'Member',
            type: 1,
            status: 1,
            department: { name: 'RTB' },
          },
          {
            id: 9,
            name: 'Minister for Transport and Mass Transit Govt: of KP',
            designation: 'Member',
            type: 2,
            status: 1,
            department: { name: 'RTB' },
          },
          {
            id: 10,
            name: 'Secretary Transport & Mass Transit',
            designation: 'Member',
            type: 2,
            status: 1,
            department: { name: 'RTB' },
          },
          {
            id: 11,
            name: 'Secretary Finance Govt: of KP',
            designation: 'Member',
            type: 2,
            status: 1,
            department: { name: 'RTB' },
          },
          {
            id: 12,
            name: 'Secretary Law & Human Rights Govt: of KP',
            designation: 'Member',
            type: 2,
            status: 1,
            department: { name: 'RTB' },
          },
          {
            id: 13,
            name: 'Director Transport KP',
            designation: 'Member',
            type: 2,
            status: 1,
            department: { name: 'RTB' },
          },
        ],
        boardActs: [{ id: 1, act_date: '1965-01-01' }],
      },
    ];

    setBoardsWithActs(dummyBoards);
    setLoading(false);
  }, []);

  // Filter boards based on search term
  const filteredBoards = useMemo(() => {
    if (!searchTerm.trim()) {
      return boardsWithActs;
    }
    const lowerSearchTerm = searchTerm.toLowerCase();
    return boardsWithActs.filter((board) => {
      const boardName = board.name.toLowerCase();
      const privateMembers = board.boardMembers
        .filter((m) => m.type === 1 && m.status === 1)
        .map((m) => m.name.toLowerCase())
        .join(' ');
      const governmentMembers = board.boardMembers
        .filter((m) => m.type === 2 && m.status === 1)
        .map((m) => m.name.toLowerCase())
        .join(' ');
      return (
        boardName.includes(lowerSearchTerm) ||
        privateMembers.includes(lowerSearchTerm) ||
        governmentMembers.includes(lowerSearchTerm)
      );
    });
  }, [boardsWithActs, searchTerm]);

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
          padding: 12px !important;
          border: 1px solid silver !important;
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
        table#boardmeeting-listing tbody tr:nth-child(odd) {
          background-color: #f5f5f5 !important;
        }
        table#boardmeeting-listing tbody tr:nth-child(even) {
          background-color: #fff !important;
        }
      `}</style>

      <div className="card">
        <div className="card-body">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <center style={{ flex: 1 }}>
              <h3>Board Acts Report - Board-wise</h3>
            </center>
            <div style={{ marginLeft: 'auto' }}>
              <label htmlFor="search" style={{ marginRight: '5px' }}>Search:</label>
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  padding: '5px 10px',
                  border: '1px solid #ced4da',
                  borderRadius: '4px',
                  fontSize: '14px',
                  width: '200px',
                }}
                placeholder="Search..."
              />
            </div>
          </div>
          <br />
          <div className="row">
            <div className="col-12">
              <div className="table-responsive">
                <table id="boardmeeting-listing" className="table-striped">
                  <thead style={{ background: 'rgb(37, 136, 95) !important', color: 'white !important' }}>
                    <tr>
                      <th style={{ width: '15px' }}>S.NO</th>
                      <th style={{ width: '250px' }}>Boards</th>
                      <th style={{ width: '250px' }}>Private Members</th>
                      <th style={{ width: '250px' }}>Government Members</th>
                      <th style={{ width: '100px', textAlign: 'center' }}>Acts</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBoards.length === 0 ? (
                      <tr>
                        <td colSpan={5}>There is no data.</td>
                      </tr>
                    ) : (
                      filteredBoards.map((board, index) => {
                        const privateMembers = board.boardMembers.filter(
                          (m) => m.type === 1 && m.status === 1
                        );
                        const governmentMembers = board.boardMembers.filter(
                          (m) => m.type === 2 && m.status === 1
                        );

                        // Group acts by date
                        const actsByDate = board.boardActs.reduce((acc, act) => {
                          const year = new Date(act.act_date).getFullYear().toString();
                          if (!acc[year]) {
                            acc[year] = [];
                          }
                          acc[year].push(act);
                          return acc;
                        }, {} as Record<string, BoardAct[]>);

                        return (
                          <tr key={board.id}>
                            <td>{index + 1}</td>
                            <td>
                              <Link to={`/admin/report/board/acts/show/${board.id}`}>{board.name}</Link>
                            </td>
                            <td className="font-weight-bold" style={{ width: '350px' }}>
                              {privateMembers.length > 0 ? (
                                <>
                                  <span className="text-dark font-weight-bold">Private member's</span>
                                  <ul className="list-arrow text-info" style={{ marginTop: '5px', paddingLeft: '20px' }}>
                                    {privateMembers.map((member) => (
                                      <li key={member.id}>
                                        <a
                                          href="#"
                                          style={{ textDecoration: 'none', fontSize: '12px' }}
                                          onClick={(e) => {
                                            e.preventDefault();
                                            handleMemberClick(member, board.name);
                                          }}
                                          className="update_related_department_minute_btn hide_in_print"
                                        >
                                          {member.name}
                                        </a>
                                      </li>
                                    ))}
                                  </ul>
                                </>
                              ) : null}
                            </td>
                            <td className="font-weight-bold" style={{ width: '250px' }}>
                              {governmentMembers.length > 0 ? (
                                <>
                                  <span className="text-success font-weight-bold">Government member's</span>
                                  <ul className="list-arrow text-info" style={{ marginTop: '5px', paddingLeft: '20px' }}>
                                    {governmentMembers.map((member) => (
                                      <li key={member.id}>
                                        <a
                                          href="#"
                                          style={{ textDecoration: 'none', fontSize: '12px' }}
                                          onClick={(e) => {
                                            e.preventDefault();
                                            handleMemberClick(member, board.name);
                                          }}
                                          className="update_related_department_minute_btn hide_in_print"
                                        >
                                          {member.name}
                                        </a>
                                      </li>
                                    ))}
                                  </ul>
                                </>
                              ) : null}
                            </td>
                            <td className="font-weight-bold" style={{ textAlign: 'center' }}>
                              {Object.keys(actsByDate).length > 0 ? (
                                Object.entries(actsByDate).map(([year, acts]) => (
                                  <React.Fragment key={year}>
                                    <Link
                                      to={`/admin/report/board/acts/show/${board.id}#act${acts[0].id}`}
                                      style={{ color: 'blue !important' }}
                                      title={new Date(acts[0].act_date).toLocaleDateString('en-GB')}
                                    >
                                      {year}
                                    </Link>
                                    <br />
                                  </React.Fragment>
                                ))
                              ) : (
                                <>&nbsp;</>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
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
