/**
 * Board Meetings Dashboard Report
 * EXACT replica of admin/report/boardmeetings/index
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../../lib/api';

interface Department {
  id: number;
  name: string;
  boards: Board[];
}

interface Board {
  id: number;
  name: string;
  is_active: boolean;
  meetings_count: number;
  agenda_points_count: number;
  pending_agenda_points_count: number;
  boardDetail?: {
    meeting_frequency?: string;
    minimum_members?: string;
  };
  boardMembers: BoardMember[];
  boardMeetings: any[];
  boardActs?: Array<{
    id: number;
    power_functions?: string;
  }>;
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
  notification?: string;
  photo?: string;
  department?: {
    name: string;
  };
}

export default function BoardMeetingsReport() {
  const [loading, setLoading] = useState(true);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [stats, setStats] = useState({
    active_boards_count: 0,
    inactive_boards_count: 0,
    boards_agenda_points_count: 0,
    boards_completed_agenda_points_count: 0,
    boards_pending_agenda_points_count: 0,
  });
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [selectedMemberData, setSelectedMemberData] = useState<string>('');

  useEffect(() => {
    // TODO: Replace with actual API call
    // const fetchData = async () => {
    //   try {
    //     const response = await api.get('/admin/report/boardmeetings');
    //     setDepartments(response.data.departments);
    //     setStats(response.data.stats);
    //   } catch (error) {
    //     console.error('Error fetching board meetings:', error);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchData();

    // Dummy data
    const dummyDepartments: Department[] = [
      {
        id: 1,
        name: 'Health Department',
        boards: [
          {
            id: 1,
            name: 'Health Board',
            is_active: true,
            meetings_count: 5,
            agenda_points_count: 25,
            pending_agenda_points_count: 8,
            boardDetail: {
              meeting_frequency: '4',
              minimum_members: '5',
            },
            boardMembers: [
              {
                id: 1,
                name: 'Dr. John Doe',
                designation: 'Chairman',
                type: 1, // PRIVATE
                qualification: 'MBBS, MD',
                domicile: 'Peshawar',
                joining_date: '2023-01-15',
                expiration_date: '2025-01-15',
                phone: '091-1234567',
                mobile: '0300-1234567',
                email: 'john.doe@example.com',
                nic: '12345-1234567-1',
                address: 'Peshawar, KPK',
              },
              {
                id: 2,
                name: 'Dr. Jane Smith',
                designation: 'Member',
                type: 2, // GOVERNMENT
                qualification: 'MBBS',
                domicile: 'Peshawar',
                joining_date: '2023-02-01',
                expiration_date: '2026-02-01',
                phone: '091-7654321',
                mobile: '0300-7654321',
                email: 'jane.smith@example.com',
                nic: '54321-7654321-2',
                address: 'Peshawar, KPK',
              },
            ],
            boardMeetings: [{ id: 1 }],
            boardActs: [{ id: 1, power_functions: 'test.pdf' }],
          },
        ],
      },
      {
        id: 2,
        name: 'Education Department',
        boards: [
          {
            id: 2,
            name: 'Education Board',
            is_active: false,
            meetings_count: 3,
            agenda_points_count: 15,
            pending_agenda_points_count: 5,
            boardDetail: {
              meeting_frequency: '6',
              minimum_members: '7',
            },
            boardMembers: [],
            boardMeetings: [],
            boardActs: [],
          },
        ],
      },
    ];

    setDepartments(dummyDepartments);
    setStats({
      active_boards_count: 1,
      inactive_boards_count: 1,
      boards_agenda_points_count: 40,
      boards_completed_agenda_points_count: 27,
      boards_pending_agenda_points_count: 13,
    });
    setLoading(false);
  }, []);

  const handleMemberClick = (member: BoardMember, boardName: string) => {
    const joiningDate = member.joining_date
      ? new Date(member.joining_date).toLocaleDateString('en-GB')
      : '';
    const expirationDate = member.expiration_date
      ? new Date(member.expiration_date).toLocaleDateString('en-GB')
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
            <th>Notification</th>
            <th>Photo</th>
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
            <td>${member.resume ? `<a href="#" target="_blank">Download <i class="ti-file"></i></a>` : ''}</td>
            <td>${member.notification ? `<a href="#" target="_blank">Download <i class="ti-file"></i></a>` : ''}</td>
            <td>${member.photo ? `<img src="#" width="100" height="100" />` : ''}</td>
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

  const getExpiredMembers = (board: Board) => {
    const currentDate = new Date();
    return board.boardMembers.filter((member) => {
      if (!member.expiration_date) return false;
      return new Date(member.expiration_date) < currentDate && member.type === 1;
    });
  };

  if (loading) {
    return <div className="text-center p-5">Loading...</div>;
  }

  const cards = [
    {
      status: '5',
      borderColor: '#3282FF',
      title: 'Boards under CM Chairmanship',
      minutesClass: 'total_minutes',
      percentClass: '',
      percent: '0',
      count: stats.active_boards_count + stats.inactive_boards_count,
      icon: 'fa fa-users',
      link: undefined,
    },
    {
      status: '1',
      borderColor: '#0E8160',
      title: 'Active boards',
      minutesClass: 'completed_minutes',
      percentClass: 'compl_percent',
      percent: '0',
      count: stats.active_boards_count,
      icon: 'ti-check',
      link: undefined,
    },
    {
      status: '9',
      borderColor: '#f3726d',
      title: 'Inactive boards',
      minutesClass: 'off_target_other',
      percentClass: 'off_target_other',
      percent: '0',
      count: stats.inactive_boards_count,
      icon: 'ti-alert',
      link: undefined,
    },
    {
      status: '1',
      borderColor: '#3282FF',
      title: 'Agenda Points Cumulative',
      minutesClass: 'completed_minutes',
      percentClass: 'compl_percent',
      percent: '0',
      count: stats.boards_agenda_points_count,
      icon: 'ti-list',
      link: '/admin/report/search/board/meetings',
    },
    {
      status: '1',
      borderColor: '#0E8160',
      title: 'Implemented',
      minutesClass: 'completed_minutes',
      percentClass: 'compl_percent',
      percent: '0',
      count: stats.boards_completed_agenda_points_count,
      icon: 'ti-check',
      link: '/admin/report/search/board/meetings?status=1',
    },
    {
      status: '9',
      borderColor: '#E74039',
      title: 'Pending Agenda Points',
      minutesClass: 'off_target_other',
      percentClass: 'off_target_other',
      percent: '0',
      count: stats.boards_pending_agenda_points_count,
      icon: 'ti-alert',
      link: '/admin/report/search/board/meetings?status=2',
    },
  ];

  let boardsCount = 1;

  return (
    <div className="content-wrapper">
      <style>{`
        .record-notes-custom-card-analytics .card-body {
          height: 235px !important;
        }
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
        table#department_decision_detial_repsort {
          width: 100% !important;
        }
        #department_decision_detial_repsort td {
          border: 1px solid silver;
          vertical-align: top !important;
        }
        #department_decision_detial_repsort td ul li {
          font-size: 16px !important;
        }
        table#department_decision_detial_repsort th, td {
          white-space: normal !important;
        }
        .table th, td {
          white-space: normal !important;
        }
        table.related_department_table {
          width: 100% !important;
        }
        .related_department_table td {
          border: 1px solid silver;
          vertical-align: top !important;
          font-size: 16px !important;
          margin: 5px !important;
        }
        .related_department_table td p {
          width: 200px !important;
        }
        .related_department_table td div {
          width: 200px !important;
        }
        .related_department_table td ul li {
          font-size: 16px !important;
        }
        .related_department_table th {
          border: 1px solid silver;
          text-align: center;
          height: 35px;
        }
        .table th, .jsgrid .jsgrid-table th, .table td, .jsgrid .jsgrid-table td {
          padding: 0.5rem 1rem !important;
        }
      `}</style>

      <div className="card">
        <div className="card-body">
          <center>
            <h3>Boards Dashboard</h3>
          </center>
          <br />
          <div className="row d-flex justify-content-center mb-5">
            {cards.map((card, index) => (
              <div key={index} className="col-md-2 p-2">
                {card.link ? (
                  <Link to={card.link}>
                    <div
                      className="card record-notes-custom-card-analytics"
                      style={{ borderBottom: `8px solid ${card.borderColor}` }}
                    >
                      <div className="card-body">
                        <div className="icon" style={{ background: card.borderColor }}>
                          <i className={card.icon}></i>
                        </div>
                        <h3
                          className={`mb-2 ${card.minutesClass}`}
                          style={{ color: card.borderColor }}
                        >
                          {card.count}
                        </h3>
                        <p>{card.title}</p>
                        <p className={`mb-0 mt-2 ${card.percentClass}`}>
                          {card.percent === '0' ? '\u00A0' : card.percent}
                        </p>
                      </div>
                    </div>
                  </Link>
                ) : (
                  <div
                    className="card record-notes-custom-card-analytics"
                    style={{ borderBottom: `8px solid ${card.borderColor}` }}
                  >
                    <div className="card-body">
                      <div className="icon" style={{ background: card.borderColor }}>
                        <i className={card.icon}></i>
                      </div>
                      <h3
                        className={`mb-2 ${card.minutesClass}`}
                        style={{ color: card.borderColor }}
                      >
                        {card.count}
                      </h3>
                      <p>{card.title}</p>
                      <p className={`mb-0 mt-2 ${card.percentClass}`}>
                        {card.percent === '0' ? '\u00A0' : card.percent}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="row">
            <div className="col-12">
              <div className="table-responsive">
                <table id="department_decision_detial_repsort" className="table table-striped">
                  <thead style={{ background: 'rgb(37, 136, 95) !important', color: 'white !important' }}>
                    <tr>
                      <th style={{ width: '5px' }}>S.NO</th>
                      <th style={{ width: '50px' }}>Departments</th>
                      <th style={{ width: '300px', textAlign: 'center' }}>Boards</th>
                    </tr>
                  </thead>
                  <tbody>
                    {departments.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="text-center">
                          No data available
                        </td>
                      </tr>
                    ) : (
                      departments.map((department, deptIndex) => (
                        <tr key={department.id}>
                          <td style={{ width: '5px' }}>
                            <button
                              style={{
                                width: '15px',
                                height: '15px',
                                padding: '0.1rem 0rem',
                                float: 'left',
                                marginRight: '10px',
                              }}
                              type="button"
                              className="btn btn-outline-secondary btn-rounded btn-icon text-dark"
                            >
                              {deptIndex + 1}
                            </button>
                          </td>
                          <td style={{ width: '100px' }}>
                            <Link
                              to={`/admin/report/search/board/meetings?department_id=${department.id}`}
                              target="_blank"
                            >
                              {department.name}
                            </Link>
                          </td>
                          <td style={{ width: '400px', textAlign: 'center' }}>
                            {department.boards.length > 0 ? (
                              <table style={{ width: '100%' }}>
                                <thead>
                                  <tr style={{ backgroundColor: '#25885F', color: 'white' }}>
                                    <th style={{ width: '225px' }}>Name</th>
                                    <th style={{ width: '300px' }}>Composition</th>
                                    <th style={{ width: '100px' }}>Meetings</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {department.boards.map((board) => {
                                    const privateMembers = board.boardMembers.filter(
                                      (m) => m.type === 1
                                    );
                                    const governmentMembers = board.boardMembers.filter(
                                      (m) => m.type === 2
                                    );
                                    const privateMembersCount = privateMembers.length;
                                    const governmentMembersCount = governmentMembers.length;
                                    const expiredMembers = getExpiredMembers(board);

                                    return (
                                      <tr key={board.id}>
                                        <td>
                                          <button
                                            style={{
                                              width: '15px',
                                              height: '15px',
                                              padding: '0.1rem 0rem',
                                              float: 'left',
                                              marginRight: '10px',
                                            }}
                                            type="button"
                                            className="btn btn-outline-secondary btn-rounded btn-icon text-dark"
                                          >
                                            {boardsCount++}
                                          </button>

                                          {board.is_active ? (
                                            <p style={{ color: '#0E8160' }}>
                                              {board.boardActs?.[0]?.power_functions ? (
                                                <Link
                                                  to={`/admin/boardacts/show/${board.id}`}
                                                  target="_blank"
                                                  style={{ color: '#0E8160', width: '260px' }}
                                                >
                                                  {board.name}
                                                </Link>
                                              ) : (
                                                board.name
                                              )}
                                            </p>
                                          ) : (
                                            <p style={{ color: '#ff4747' }}>
                                              {board.boardActs?.[0]?.power_functions ? (
                                                <Link
                                                  to={`/admin/boardacts/show/${board.id}`}
                                                  target="_blank"
                                                  style={{ color: '#ff4747', width: '260px' }}
                                                >
                                                  {board.name}
                                                </Link>
                                              ) : (
                                                board.name
                                              )}
                                            </p>
                                          )}

                                          {board.boardMembers.length > 0 ? (
                                            <>
                                              <br />
                                              <p>
                                                <b>Annual Min. No. of meetings under Law:</b>{' '}
                                                {board.boardDetail?.meeting_frequency || 'Not Entered'}
                                              </p>
                                              <p>
                                                <b>Min. No. of Non-exofficio members under Law:</b>{' '}
                                                {board.boardDetail?.minimum_members || 'Not Entered'}
                                              </p>
                                              <p>
                                                <b>Meetings Held:</b> {board.meetings_count}
                                              </p>
                                              {expiredMembers.length > 0 && (
                                                <>
                                                  <b>Non-exofficio members Tenure's</b>
                                                  <p>Expired: {expiredMembers.length}</p>
                                                  <ul className="list-arrow text-warning">
                                                    {expiredMembers.map((member) => (
                                                      <li key={member.id}>
                                                        <del className="text-danger">{member.name}</del>
                                                      </li>
                                                    ))}
                                                  </ul>
                                                </>
                                              )}
                                            </>
                                          ) : (
                                            <>
                                              <br />
                                              <p>
                                                <b>Annual Min. No. of Meetings under Law:</b>{' '}
                                                {board.boardDetail?.meeting_frequency || 'Not Entered'}
                                              </p>
                                              <p>
                                                <b>Min. No. of Non-exofficio members under Law:</b>{' '}
                                                {board.boardDetail?.minimum_members || 'Not Entered'}
                                              </p>
                                              <p>
                                                <b>Meetings Held:</b> {board.meetings_count}
                                              </p>
                                              <b>Members:</b>
                                              <p style={{ color: '#ff4747' }}>Not Attached</p>
                                            </>
                                          )}
                                        </td>
                                        <td>
                                          {board.boardMembers.length > 0 ? (
                                            <table style={{ width: '100%' }}>
                                              <thead>
                                                <tr style={{ backgroundColor: 'rgb(27, 117, 80)', color: 'white' }}>
                                                  <th colSpan={3} style={{ textAlign: 'center' }}>
                                                    Members
                                                    <button
                                                      style={{
                                                        width: '28px',
                                                        height: '23px',
                                                        padding: '0.1rem 0rem',
                                                      }}
                                                      type="button"
                                                      className="btn-success btn btn-rounded btn-icon text-dark"
                                                    >
                                                      {privateMembersCount + governmentMembersCount}
                                                    </button>
                                                  </th>
                                                </tr>
                                                <tr>
                                                  <td style={{ color: '#222' }}>
                                                    Non-exofficio
                                                    {privateMembersCount > 0 && (
                                                      <button
                                                        style={{
                                                          width: '28px',
                                                          height: '23px',
                                                          padding: '0.1rem 0rem',
                                                        }}
                                                        type="button"
                                                        className="btn-success btn btn-rounded btn-icon text-dark"
                                                      >
                                                        {privateMembersCount}
                                                      </button>
                                                    )}
                                                  </td>
                                                  <td style={{ color: '#222' }}>
                                                    Exofficio
                                                    {governmentMembersCount > 0 && (
                                                      <button
                                                        style={{
                                                          width: '28px',
                                                          height: '23px',
                                                          padding: '0.1rem 0rem',
                                                        }}
                                                        type="button"
                                                        className="btn-success btn btn-rounded btn-icon text-dark"
                                                      >
                                                        {governmentMembersCount}
                                                      </button>
                                                    )}
                                                  </td>
                                                </tr>
                                              </thead>
                                              <tbody>
                                                <tr>
                                                  <td>
                                                    {privateMembers.length > 0 && (
                                                      <ul className="list-arrow text-info">
                                                        {privateMembers.map((member) => (
                                                          <li key={member.id}>
                                                            <a
                                                              href="#"
                                                              style={{
                                                                textDecoration: 'none',
                                                                fontSize: '12px',
                                                              }}
                                                              onClick={(e) => {
                                                                e.preventDefault();
                                                                handleMemberClick(member, board.name);
                                                              }}
                                                              className="update_related_department_minute_btn hide_in_print"
                                                            >
                                                              {member.name}{' '}
                                                              <small className="text-dark">
                                                                ({member.designation})
                                                              </small>
                                                            </a>
                                                          </li>
                                                        ))}
                                                      </ul>
                                                    )}
                                                  </td>
                                                  <td>
                                                    {governmentMembers.length > 0 && (
                                                      <ul className="list-arrow text-info">
                                                        {governmentMembers.map((member) => (
                                                          <li key={member.id}>
                                                            <a
                                                              href="#"
                                                              style={{
                                                                textDecoration: 'none',
                                                                fontSize: '12px',
                                                              }}
                                                              onClick={(e) => {
                                                                e.preventDefault();
                                                                handleMemberClick(member, board.name);
                                                              }}
                                                              className="update_related_department_minute_btn hide_in_print"
                                                            >
                                                              {member.name}{' '}
                                                              <small className="text-dark">
                                                                ({member.designation})
                                                              </small>
                                                            </a>
                                                          </li>
                                                        ))}
                                                      </ul>
                                                    )}
                                                  </td>
                                                </tr>
                                              </tbody>
                                            </table>
                                          ) : null}
                                        </td>
                                        <td>
                                          <p>
                                            No. of Meetings
                                            {board.boardMeetings.length > 0 ? (
                                              <Link
                                                to={`/admin/report/search/board/meetings?board_id=${board.id}&department_id=${department.id}`}
                                                target="_blank"
                                              >
                                                <button
                                                  style={{
                                                    width: '28px',
                                                    height: '23px',
                                                    padding: '0.1rem 0rem',
                                                  }}
                                                  type="button"
                                                  className="btn-success btn btn-rounded btn-icon text-dark"
                                                >
                                                  {board.meetings_count}
                                                </button>
                                              </Link>
                                            ) : (
                                              <button
                                                style={{
                                                  width: '28px',
                                                  height: '23px',
                                                  padding: '0.1rem 0rem',
                                                }}
                                                type="button"
                                                className="btn-success btn btn-rounded btn-icon text-dark"
                                              >
                                                {board.meetings_count}
                                              </button>
                                            )}
                                          </p>

                                          <p>
                                            No. of Agenda Points
                                            {board.boardMeetings.length > 0 ? (
                                              <Link
                                                to={`/admin/report/search/board/meetings?board_id=${board.id}&department_id=${department.id}`}
                                                target="_blank"
                                              >
                                                <button
                                                  style={{
                                                    width: '28px',
                                                    height: '23px',
                                                    padding: '0.1rem 0rem',
                                                  }}
                                                  type="button"
                                                  className="btn-success btn btn-rounded btn-icon text-dark"
                                                >
                                                  {board.agenda_points_count}
                                                </button>
                                              </Link>
                                            ) : (
                                              <button
                                                style={{
                                                  width: '28px',
                                                  height: '23px',
                                                  padding: '0.1rem 0rem',
                                                }}
                                                type="button"
                                                className="btn-success btn btn-rounded btn-icon text-dark"
                                              >
                                                {board.agenda_points_count}
                                              </button>
                                            )}
                                          </p>
                                          {board.pending_agenda_points_count > 0 && (
                                            <p>
                                              No. of Pending Agenda Points
                                              <Link
                                                to={`/admin/report/search/board/meetings?department_id=${department.id}&board_id=${board.id}&status=2`}
                                                target="_blank"
                                              >
                                                <button
                                                  style={{
                                                    width: '28px',
                                                    height: '23px',
                                                    padding: '0.1rem 0rem',
                                                  }}
                                                  type="button"
                                                  className="btn-danger btn btn-rounded btn-icon"
                                                >
                                                  {board.pending_agenda_points_count}
                                                </button>
                                              </Link>
                                            </p>
                                          )}
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            ) : null}
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
                    id="related_departments_data_show"
                    dangerouslySetInnerHTML={{ __html: selectedMemberData }}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowMemberModal(false)}
                >
                  Close
                </button>
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
