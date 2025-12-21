/**
 * Cabinet Meetings Report
 * EXACT replica of admin/report/cabinet/index.blade.php
 */

import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';

interface StatusCard {
  route: string;
  status: string;
  borderColor: string;
  title: string;
  minutesClass: string;
  percentClass: string;
  icon: string;
}

interface Department {
  id: number;
  name: string;
  total: number;
  completed: number;
  on_target: number;
  on_going: number;
  off_target: number;
  overdue: number;
  off_target_other: number;
  overdue_other: number;
}

interface RelatedDepartment {
  id: number;
  name: string;
  count: number;
}

export default function CabinetMeetingsReport() {
  const [loading, setLoading] = useState(true);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [relatedDepartments, setRelatedDepartments] = useState<RelatedDepartment[]>([]);

  // Dummy data for testing
  useEffect(() => {
    // TODO: Replace with actual API call
    // const fetchData = async () => {
    //   try {
    //     const response = await api.get('/admin/report/cabinet-meetings');
    //     setDepartments(response.data.departments);
    //     setRelatedDepartments(response.data.relatedDepartments);
    //   } catch (error) {
    //     console.error('Error fetching cabinet meetings:', error);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchData();

    // Mock data for testing
    setDepartments([
      { id: 1, name: 'Health Department', total: 25, completed: 15, on_target: 5, on_going: 3, off_target: 1, overdue: 1, off_target_other: 0, overdue_other: 0 },
      { id: 2, name: 'Education Department', total: 30, completed: 18, on_target: 7, on_going: 3, off_target: 1, overdue: 1, off_target_other: 0, overdue_other: 0 },
      { id: 3, name: 'Finance Department', total: 20, completed: 12, on_target: 4, on_going: 2, off_target: 1, overdue: 1, off_target_other: 0, overdue_other: 0 },
      { id: 4, name: 'Planning & Development', total: 18, completed: 10, on_target: 4, on_going: 2, off_target: 1, overdue: 1, off_target_other: 0, overdue_other: 0 },
      { id: 5, name: 'Public Works Department', total: 22, completed: 13, on_target: 5, on_going: 2, off_target: 1, overdue: 1, off_target_other: 0, overdue_other: 0 },
    ]);

    setRelatedDepartments([
      { id: 6, name: 'Agriculture Department', count: 12 },
      { id: 7, name: 'Irrigation Department', count: 8 },
      { id: 8, name: 'Transport Department', count: 15 },
    ]);

    setLoading(false);
  }, []);

  // Calculate totals
  const totals = useMemo(() => {
    const total_count = departments.reduce((sum, dept) => sum + dept.total, 0);
    const completed_count = departments.reduce((sum, dept) => sum + dept.completed, 0);
    const on_target_count = departments.reduce((sum, dept) => sum + dept.on_target, 0);
    const on_going_count = departments.reduce((sum, dept) => sum + dept.on_going, 0);
    const off_target_count = departments.reduce((sum, dept) => sum + dept.off_target, 0);
    const overdue_count = departments.reduce((sum, dept) => sum + dept.overdue, 0);
    const off_target_other_count = departments.reduce((sum, dept) => sum + dept.off_target_other, 0);
    const overdue_other_count = departments.reduce((sum, dept) => sum + dept.overdue_other, 0);

    return {
      total_count,
      completed_count,
      on_target_count,
      on_going_count,
      off_target_count,
      overdue_count,
      off_target_other_count,
      overdue_other_count,
    };
  }, [departments]);

  // Calculate percentages
  const percentages = useMemo(() => {
    const total = totals.total_count || 1;
    return {
      completed: totals.completed_count / total * 100,
      on_target: totals.on_target_count / total * 100,
      on_going: totals.on_going_count / total * 100,
      off_target: totals.off_target_count / total * 100,
      overdue: totals.overdue_count / total * 100,
      off_target_other: totals.off_target_other_count / total * 100,
      overdue_other: totals.overdue_other_count / total * 100,
    };
  }, [totals]);

  const statusCards: StatusCard[] = [
    { route: '/admin/report/cabinet-meetings/by-status', status: '5', borderColor: '#3282FF', title: 'Decisions', minutesClass: 'total_minutes', percentClass: '', icon: 'ti-list' },
    { route: '/admin/report/cabinet-meetings/by-status', status: '1', borderColor: '#0E8160', title: 'Completed', minutesClass: 'completed_minutes', percentClass: 'compl_percent', icon: 'ti-check' },
    { route: '/admin/report/cabinet-meetings/by-status', status: '2', borderColor: '#1DC39F', title: 'On Target', minutesClass: 'on_target_minutes', percentClass: 'on_percent', icon: 'ti-target' },
    { route: '/admin/report/cabinet-meetings/by-status', status: '7', borderColor: '#F8C146', title: 'On Going', minutesClass: 'on_going_minutes', percentClass: 'on_going_percent', icon: 'ti-reload' },
    { route: '/admin/report/cabinet-meetings/by-status', status: '4', borderColor: '#E74039', title: 'Off Target', minutesClass: 'off_target_minutes', percentClass: 'off_percent', icon: 'ti-alert' },
    { route: '/admin/report/cabinet-meetings/by-status', status: '3', borderColor: '#FD7E01', title: 'Overdue', minutesClass: 'overdue_minutes', percentClass: 'over_percent', icon: 'ti-timer' },
    { route: '/admin/report/cabinet-meetings/by-status', status: '9', borderColor: '#f3726d', title: 'Off Target Reason', minutesClass: 'off_target_other', percentClass: 'off_target_other_percent', icon: 'ti-alert' },
    { route: '/admin/report/cabinet-meetings/by-status', status: '6', borderColor: '#874EFF', title: 'Overdue Reason', minutesClass: 'overdue_minutes_other', percentClass: 'over_other_percent', icon: 'ti-timer' },
  ];

  const getCardCount = (card: StatusCard): number => {
    switch (card.status) {
      case '5': return totals.total_count;
      case '1': return totals.completed_count;
      case '2': return totals.on_target_count;
      case '7': return totals.on_going_count;
      case '4': return totals.off_target_count;
      case '3': return totals.overdue_count;
      case '9': return totals.off_target_other_count;
      case '6': return totals.overdue_other_count;
      default: return 0;
    }
  };

  const getCardPercent = (card: StatusCard): number => {
    switch (card.status) {
      case '1': return percentages.completed;
      case '2': return percentages.on_target;
      case '7': return percentages.on_going;
      case '4': return percentages.off_target;
      case '3': return percentages.overdue;
      case '9': return percentages.off_target_other;
      case '6': return percentages.overdue_other;
      default: return 0;
    }
  };

  if (loading) {
    return <div className="text-center p-5">Loading...</div>;
  }

  return (
    <div className="content-wrapper">
      <style>{`
        table#table_record_report {
          width: 100% !important;
        }
        table#table_record_report td {
          color: #1b84ff !important;
          font-size: 16px !important;
          text-align: center !important;
        }
        #table_record_report td ul li {
          font-size: 16px !important;
        }
        table#table_record_report th {
          font-size: 16px !important;
        }
        table#table_record_report td small {
          color: #000000ba !important;
        }
        .card-body p {
          font-size: 16px;
          font-weight: bold;
        }
        .badge.badge-pill {
          font-size: 16px !important;
        }
        .record-notes-custom-card-analytics {
          transition: transform 0.2s, box-shadow 0.2s;
          cursor: pointer;
        }
        .record-notes-custom-card-analytics:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        .record-notes-custom-card-analytics .card-body {
          padding: 1.5rem;
          text-align: center;
        }
        .record-notes-custom-card-analytics .icon {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem;
        }
        .record-notes-custom-card-analytics .icon i {
          color: white;
          font-size: 24px;
        }
        .record-notes-custom-card-analytics h3 {
          font-size: 2rem;
          font-weight: bold;
          margin-bottom: 0.5rem;
        }
        .record-notes-custom-card-analytics p {
          margin: 0;
          font-size: 14px;
        }
      `}</style>
      <div className="card">
        <div className="card-body">
          <center>
            <h3>Cabinet Meetings Report</h3>
            <div className="row my-5 d-flex justify-content-end">
              {statusCards.map((card, index) => {
                const count = getCardCount(card);
                const percent = getCardPercent(card);
                return (
                  <div key={index} className="col-md-2 p-2">
                    <Link to={`${card.route}?status=${card.status}`}>
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
                            {count}
                          </h3>
                          <p>{card.title}</p>
                          <p className={`mb-0 mt-2 ${card.percentClass}`}>
                            {percent === 0 ? '\u00A0' : `${percent.toFixed(0)}%`}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>

            <div className="row">
              <div className="col-12">
                <div className="table-responsive">
                  <table id="table_record_report" className="table table-striped">
                    <thead style={{ background: 'rgb(37, 136, 95)', color: 'white' }}>
                      <tr>
                        <th style={{ textAlign: 'left', width: '50px' }}>Department's</th>
                        <th style={{ textAlign: 'left', width: '50px' }}>Decisions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {departments.length === 0 ? (
                        <tr>
                          <td colSpan={2} className="text-center">There is no data.</td>
                        </tr>
                      ) : (
                        departments.map((dept) => (
                          <tr key={dept.id}>
                            <td style={{ textAlign: 'left', width: '50px' }}>
                              {dept.name}
                            </td>
                            <td 
                              className="font-weight-bold"
                              style={{ textAlign: 'left', width: '50px' }}
                            >
                              {dept.total > 0 ? (
                                <Link to={`/admin/report/cabinet-meetings/detail/${dept.id}/5`}>
                                  {dept.total}
                                </Link>
                              ) : (
                                dept.total
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                      {relatedDepartments.map((dept) => (
                        <tr key={dept.id} className="table-info">
                          <td style={{ textAlign: 'left', width: '50px' }}>
                            {dept.name}
                          </td>
                          <td 
                            className="font-weight-bold"
                            style={{ textAlign: 'left', width: '50px' }}
                          >
                            {dept.count > 0 ? (
                              <Link to={`/admin/report/subtasks/of-department/cabinet-meeting/${dept.id}`}>
                                {dept.count}
                              </Link>
                            ) : (
                              0
                            )}
                          </td>
                        </tr>
                      ))}
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
