/**
 * PTF Module - Meetings Report (Department-wise)
 * EXACT replica of admin/report/ptf/index.blade.php from old CMDMS
 */

import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { List, Check, Target, RefreshCw, AlertTriangle, Clock } from 'lucide-react';
import { generateMockPTFDepartments, PTFDepartment } from '../../../lib/mocks/data/ptfData';

// Helper function to map old icon classes to Lucide React icons
const getIcon = (iconClass: string) => {
  const iconMap: Record<string, React.ComponentType<any>> = {
    'ti-list': List,
    'ti-check': Check,
    'ti-target': Target,
    'ti-reload': RefreshCw,
    'ti-alert': AlertTriangle,
    'ti-timer': Clock
  };
  return iconMap[iconClass] || List;
};

interface StatusCard {
  route: string;
  status: string;
  borderColor: string;
  title: string;
  minutesClass: string;
  percentClass: string;
  percent: number;
  icon: string;
  count: number;
}

export default function PTFMeetingsReport() {
  const [loading, setLoading] = useState(true);
  const [departments] = useState<PTFDepartment[]>(() => generateMockPTFDepartments());

  useEffect(() => {
    // TODO: Replace with actual API call
    setLoading(false);
  }, []);

  // Calculate totals from departments data
  const totals = useMemo(() => {
    return departments.reduce(
      (acc, dept) => ({
        total: acc.total + dept.total,
        completed: acc.completed + dept.completed,
        on_target: acc.on_target + dept.on_target,
        on_going: acc.on_going + dept.on_going,
        off_target: acc.off_target + dept.off_target,
        overdue: acc.overdue + dept.overdue,
        overdue_other: acc.overdue_other + dept.overdue_other,
        off_target_other: acc.off_target_other + dept.off_target_other,
      }),
      {
        total: 0,
        completed: 0,
        on_target: 0,
        on_going: 0,
        off_target: 0,
        overdue: 0,
        overdue_other: 0,
        off_target_other: 0,
      }
    );
  }, [departments]);

  // Calculate percentages
  const percentages = useMemo(() => {
    const total = totals.total || 1; // Avoid division by zero
    return {
      completed: totals.completed / total * 100,
      on_target: totals.on_target / total * 100,
      on_going: totals.on_going / total * 100,
      off_target: totals.off_target / total * 100,
      overdue: totals.overdue / total * 100,
      overdue_other: totals.overdue_other / total * 100,
      off_target_other: totals.off_target_other / total * 100,
    };
  }, [totals]);

  // Status cards configuration (8 cards matching old CMDMS)
  const statusCards: StatusCard[] = useMemo(() => [
    {
      route: '/admin/report/ptf/meetings/by-status',
      status: '5',
      borderColor: '#3282FF',
      title: 'Decisions',
      minutesClass: 'total_minutes',
      percentClass: '',
      percent: 0,
      icon: 'ti-list',
      count: totals.total,
    },
    {
      route: '/admin/report/ptf/meetings/by-status',
      status: '1',
      borderColor: '#0E8160',
      title: 'Completed',
      minutesClass: 'completed_minutes',
      percentClass: 'compl_percent',
      percent: percentages.completed,
      icon: 'ti-check',
      count: totals.completed,
    },
    {
      route: '/admin/report/ptf/meetings/by-status',
      status: '2',
      borderColor: '#1DC39F',
      title: 'On Target',
      minutesClass: 'on_target_minutes',
      percentClass: 'on_percent',
      percent: percentages.on_target,
      icon: 'ti-target',
      count: totals.on_target,
    },
    {
      route: '/admin/report/ptf/meetings/by-status',
      status: '7',
      borderColor: '#F8C146',
      title: 'On Going',
      minutesClass: 'on_going_minutes',
      percentClass: 'on_going_percent',
      percent: percentages.on_going,
      icon: 'ti-reload',
      count: totals.on_going,
    },
    {
      route: '/admin/report/ptf/meetings/by-status',
      status: '4',
      borderColor: '#E74039',
      title: 'Off Target',
      minutesClass: 'off_target_minutes',
      percentClass: 'off_percent',
      percent: percentages.off_target,
      icon: 'ti-alert',
      count: totals.off_target,
    },
    {
      route: '/admin/report/ptf/meetings/by-status',
      status: '3',
      borderColor: '#FD7E01',
      title: 'Overdue',
      minutesClass: 'overdue_minutes',
      percentClass: 'over_percent',
      percent: percentages.overdue,
      icon: 'ti-timer',
      count: totals.overdue,
    },
    {
      route: '/admin/report/ptf/meetings/by-status',
      status: '9',
      borderColor: '#f3726d',
      title: 'Off Target Reason',
      minutesClass: 'off_target_minutes_other',
      percentClass: 'off_target_other_percent',
      percent: percentages.off_target_other,
      icon: 'ti-alert',
      count: totals.off_target_other,
    },
    {
      route: '/admin/report/ptf/meetings/by-status',
      status: '6',
      borderColor: '#874EFF',
      title: 'Overdue Reason',
      minutesClass: 'overdue_minutes_other',
      percentClass: 'over_other_percent',
      percent: percentages.overdue_other,
      icon: 'ti-timer',
      count: totals.overdue_other,
    },
  ], [totals, percentages]);

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
        .record-notes-custom-card-analytics .card-body p {
          font-weight: bold;
        }
        .badge.badge-pill {
          font-size: 16px !important;
        }
        .record-notes-custom-card-analytics {
          border-radius: 15px;
          margin-bottom: 10px !important;
          background: #fff !important;
          transition: all 0.2s linear;
          height: auto !important;
          padding: 0px !important;
          border: 2px solid #e3e3e3;
          cursor: pointer;
        }
        .record-notes-custom-card-analytics:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        .record-notes-custom-card-analytics .card-body {
          display: flex;
          justify-content: flex-start !important;
          flex-direction: column;
          padding: 15px !important;
        }
        .record-notes-custom-card-analytics .icon {
          width: 60px;
          height: 60px;
          border-radius: 100%;
          margin-bottom: 10px;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #fff;
        }
        .record-notes-custom-card-analytics .icon svg {
          color: white !important;
        }
        .record-notes-custom-card-analytics h3 {
          text-align: left !important;
          font-size: 2rem !important;
          margin-bottom: 0.5rem !important;
        }
        .record-notes-custom-card-analytics p {
          color: #000 !important;
          text-align: left !important;
          margin: 5px 0 !important;
        }
        .record-notes-custom-card-analytics .card-body p.mb-0 {
          font-size: 1rem !important;
          font-weight: 400 !important;
        }
      `}</style>
      <div className="card">
        <div className="card-body">
          <center>
            <h3>PTF Meetings - Department-wise</h3>
            <div className="row my-5 d-flex justify-content-end">
              {statusCards.map((card, index) => {
                const IconComponent = getIcon(card.icon);
                return (
                  <div key={index} className="col-md-2 p-2">
                    <Link to={`${card.route}?status=${card.status}`}>
                      <div 
                        className="card record-notes-custom-card-analytics"
                        style={{ borderBottom: `8px solid ${card.borderColor}` }}
                      >
                        <div className="card-body">
                          <div className="icon" style={{ background: card.borderColor }}>
                            <IconComponent size={24} color="white" />
                          </div>
                          <h3 
                            className={`mb-2 ${card.minutesClass}`}
                            style={{ color: card.borderColor }}
                          >
                            {card.count}
                          </h3>
                          <p>{card.title}</p>
                          <p className={`mb-0 mt-2 ${card.percentClass}`}>
                            {card.percent === 0 ? '\u00A0' : `${card.percent.toFixed(0)}%`}
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
                  <table id="table_record_report" className="table table-striped dataTable">
                    <thead style={{ background: 'rgb(37, 136, 95)', color: 'white' }}>
                      <tr>
                        <th style={{ textAlign: 'left' }}>Departments</th>
                        <th>Total</th>
                        <th>Completed</th>
                        <th>On Target</th>
                        <th>On Going</th>
                        <th>Off Target</th>
                        <th>Overdue</th>
                        <th>Overdue Reason</th>
                        <th>Off Target Reason</th>
                      </tr>
                    </thead>
                    <tbody>
                      {departments.length > 0 ? (
                        departments.map((dept) => (
                          <tr key={dept.id}>
                            <td style={{ textAlign: 'left', width: '200px' }}>
                              {dept.name || ''}
                            </td>
                            <td className="font-weight-bold">
                              {dept.total > 0 ? (
                                <Link to={`/admin/report/ptf/detail/meetings/${dept.id}/5`}>
                                  {dept.total}
                                </Link>
                              ) : (
                                0
                              )}
                            </td>
                            <td className="font-weight-bold">
                              {dept.completed > 0 ? (
                                <Link to={`/admin/report/ptf/detail/meetings/${dept.id}/1`}>
                                  {dept.completed}
                                </Link>
                              ) : (
                                0
                              )}
                            </td>
                            <td className="font-weight-bold">
                              {dept.on_target > 0 ? (
                                <Link to={`/admin/report/ptf/detail/meetings/${dept.id}/2`}>
                                  {dept.on_target}
                                </Link>
                              ) : (
                                0
                              )}
                            </td>
                            <td className="font-weight-bold">
                              {dept.on_going > 0 ? (
                                <Link to={`/admin/report/ptf/detail/meetings/${dept.id}/7`}>
                                  {dept.on_going}
                                </Link>
                              ) : (
                                0
                              )}
                            </td>
                            <td className="font-weight-bold">
                              {dept.off_target > 0 ? (
                                <Link to={`/admin/report/ptf/detail/meetings/${dept.id}/4`}>
                                  {dept.off_target}
                                </Link>
                              ) : (
                                0
                              )}
                            </td>
                            <td className="font-weight-bold">
                              {dept.overdue > 0 ? (
                                <Link to={`/admin/report/ptf/detail/meetings/${dept.id}/3`}>
                                  {dept.overdue}
                                </Link>
                              ) : (
                                0
                              )}
                            </td>
                            <td className="font-weight-bold">
                              {dept.overdue_other > 0 ? (
                                <Link to={`/admin/report/ptf/detail/meetings/${dept.id}/6`}>
                                  {dept.overdue_other}
                                </Link>
                              ) : (
                                0
                              )}
                            </td>
                            <td className="font-weight-bold">
                              {dept.off_target_other > 0 ? (
                                <Link to={`/admin/report/ptf/detail/meetings/${dept.id}/9`}>
                                  {dept.off_target_other}
                                </Link>
                              ) : (
                                0
                              )}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={9}>There is no data.</td>
                        </tr>
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
