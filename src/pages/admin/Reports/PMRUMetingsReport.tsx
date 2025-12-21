/**
 * PMRU Meetings Report
 * EXACT replica of admin/report/pmru/department-wise.blade.php from old CMDMS
 */

import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { generateMockPMRUDepartments, generateMockPMRURelatedDepartments, PMRUDepartment, PMRURelatedDepartment } from '../../../lib/mocks/data/pmruData';
import { List, Check, Target, RefreshCw, AlertTriangle, Clock } from 'lucide-react';

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

export default function PMRUMetingsReport() {
  const [pmruDepartments] = useState<PMRUDepartment[]>(() => generateMockPMRUDepartments());
  const [relatedDepartments] = useState<PMRURelatedDepartment[]>(() => generateMockPMRURelatedDepartments());

  // Calculate totals
  const totals = useMemo(() => {
    let total_count = 0;
    let completed_count = 0;
    let on_target_count = 0;
    let on_going_count = 0;
    let off_target_count = 0;
    let overdue_count = 0;
    let off_target_other_count = 0;
    let overdue_other_count = 0;

    pmruDepartments.forEach(dept => {
      total_count += dept.decisions_count;
      completed_count += dept.completed;
      on_target_count += dept.on_target;
      on_going_count += dept.on_going;
      off_target_count += dept.off_target;
      overdue_count += dept.overdue;
      off_target_other_count += dept.off_target_other;
      overdue_other_count += dept.overdue_other;
    });

    return {
      total_count,
      completed_count,
      on_target_count,
      on_going_count,
      off_target_count,
      overdue_count,
      off_target_other_count,
      overdue_other_count
    };
  }, [pmruDepartments]);

  // Calculate percentages
  const percentages = useMemo(() => {
    const total = totals.total_count || 1; // Avoid division by zero
    return {
      completed: totals.completed_count / total * 100,
      on_target: totals.on_target_count / total * 100,
      on_going: totals.on_going_count / total * 100,
      off_target: totals.off_target_count / total * 100,
      overdue: totals.overdue_count / total * 100,
      off_target_other: totals.off_target_other_count / total * 100,
      overdue_other: totals.overdue_other_count / total * 100
    };
  }, [totals]);

  // Status cards data (matching old CMDMS structure)
  const statusCards = useMemo(() => [
    {
      route: '#',
      status: '5',
      borderColor: '#3282FF',
      title: 'Decisions',
      minutesClass: 'total_minutes',
      percentClass: '',
      percent: 0,
      icon: 'ti-list',
      count: totals.total_count
    },
    {
      route: '#',
      status: '1',
      borderColor: '#0E8160',
      title: 'Completed',
      minutesClass: 'completed_minutes',
      percentClass: 'compl_percent',
      percent: percentages.completed,
      icon: 'ti-check',
      count: totals.completed_count
    },
    {
      route: '#',
      status: '2',
      borderColor: '#1DC39F',
      title: 'On Target',
      minutesClass: 'on_target_minutes',
      percentClass: 'on_percent',
      percent: percentages.on_target,
      icon: 'ti-target',
      count: totals.on_target_count
    },
    {
      route: '#',
      status: '7',
      borderColor: '#F8C146',
      title: 'On Going',
      minutesClass: 'on_going_minutes',
      percentClass: 'on_going_percent',
      percent: percentages.on_going,
      icon: 'ti-reload',
      count: totals.on_going_count
    },
    {
      route: '#',
      status: '4',
      borderColor: '#E74039',
      title: 'Off Target',
      minutesClass: 'off_target_minutes',
      percentClass: 'off_percent',
      percent: percentages.off_target,
      icon: 'ti-alert',
      count: totals.off_target_count
    },
    {
      route: '#',
      status: '3',
      borderColor: '#FD7E01',
      title: 'Overdue',
      minutesClass: 'overdue_minutes',
      percentClass: 'over_percent',
      percent: percentages.overdue,
      icon: 'ti-timer',
      count: totals.overdue_count
    },
    {
      route: '#',
      status: '9',
      borderColor: '#f3726d',
      title: 'Off Target Reason',
      minutesClass: 'off_target_other',
      percentClass: 'off_target_other_percent',
      percent: percentages.off_target_other,
      icon: 'ti-alert',
      count: totals.off_target_other_count
    },
    {
      route: '#',
      status: '6',
      borderColor: '#874EFF',
      title: 'Overdue Reason',
      minutesClass: 'overdue_minutes_other',
      percentClass: 'over_other_percent',
      percent: percentages.overdue_other,
      icon: 'ti-timer',
      count: totals.overdue_other_count
    }
  ], [totals, percentages]);

  // Update card values in DOM (matching old CMDMS script behavior)
  useEffect(() => {
    statusCards.forEach(card => {
      const element = document.querySelector(`.${card.minutesClass}`);
      if (element) {
        element.textContent = String(card.count);
      }
      
      if (card.percentClass) {
        const percentElement = document.querySelector(`.${card.percentClass}`);
        if (percentElement) {
          const percentValue = isNaN(card.percent) ? 0 : card.percent.toFixed(0);
          percentElement.textContent = percentValue === '0' ? '\u00A0' : `${percentValue}%`;
        }
      }
    });
  }, [statusCards]);

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
          border-radius: 10px;
          margin: 10px;
          background: #fff;
          transition: transform 0.2s;
          padding: 20px;
          text-align: center;
        }
        .record-notes-custom-card-analytics .icon {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 15px;
          color: white;
        }
        .record-notes-custom-card-analytics h3 {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 10px;
        }
        .record-notes-custom-card-analytics p {
          margin: 5px 0;
          font-size: 14px;
        }
      `}</style>
      <div className="card">
        <div className="card-body">
          <center>
            <h3>PMRU Meetings Report</h3>
            <div className="row my-5 d-flex justify-content-end">
              {statusCards.map((card, index) => {
                const IconComponent = getIcon(card.icon);
                return (
                  <div key={index} className="col-md-2 p-2">
                    <a href={card.route}>
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
                    </a>
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
                      {pmruDepartments.length > 0 ? (
                        <>
                          {pmruDepartments.map((dept) => (
                            <tr key={dept.id}>
                              <td style={{ textAlign: 'left', width: '50px' }}>{dept.name || ''}</td>
                              <td className="font-weight-bold" style={{ textAlign: 'left', width: '50px' }}>
                                {dept.decisions_count > 0 ? (
                                  <Link to={`/admin/report/subtasks/of-department/pmru-meeting/${dept.id}`}>
                                    {dept.decisions_count}
                                  </Link>
                                ) : (
                                  dept.decisions_count
                                )}
                              </td>
                            </tr>
                          ))}
                          {relatedDepartments.map((dept) => (
                            <tr key={`related-${dept.id}`} className="table-info">
                              <td style={{ textAlign: 'left', width: '50px' }}>
                                {dept.name ?? ''}
                              </td>
                              <td className="font-weight-bold" style={{ textAlign: 'left', width: '50px' }}>
                                {dept.count > 0 ? (
                                  <Link to={`/admin/report/subtasks/of-department/pmru-meeting/${dept.id}`}>
                                    {dept.count ?? ''}
                                  </Link>
                                ) : (
                                  0
                                )}
                              </td>
                            </tr>
                          ))}
                        </>
                      ) : (
                        <tr>
                          <td colSpan={2}>There is no data.</td>
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
