/**
 * PTF Module - Dashboard
 * EXACT replica of admin/report/ptf/index.blade.php
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../../../lib/api';

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

export default function PTFDashboard() {
  const [loading, setLoading] = useState(true);
  const [departments, setDepartments] = useState<any[]>([]);
  const [statusCards, setStatusCards] = useState<StatusCard[]>([]);

  useEffect(() => {
    // TODO: Replace with actual API call
    // Mock data for now
    setStatusCards([
      { route: '/admin/report/ptf/meetings/by-status', status: '5', borderColor: '#3282FF', title: 'Decisions', minutesClass: 'total_minutes', percentClass: '', percent: 0, icon: 'ti-list', count: 0 },
      { route: '/admin/report/ptf/meetings/by-status', status: '1', borderColor: '#0E8160', title: 'Completed', minutesClass: 'completed_minutes', percentClass: 'compl_percent', percent: 0, icon: 'ti-check', count: 0 },
      { route: '/admin/report/ptf/meetings/by-status', status: '2', borderColor: '#1DC39F', title: 'On Target', minutesClass: 'on_target_minutes', percentClass: 'on_percent', percent: 0, icon: 'ti-target', count: 0 },
      { route: '/admin/report/ptf/meetings/by-status', status: '7', borderColor: '#F8C146', title: 'On Going', minutesClass: 'on_going_minutes', percentClass: 'on_going_percent', percent: 0, icon: 'ti-reload', count: 0 },
      { route: '/admin/report/ptf/meetings/by-status', status: '4', borderColor: '#E74039', title: 'Off Target', minutesClass: 'off_target_minutes', percentClass: 'off_percent', percent: 0, icon: 'ti-alert', count: 0 },
      { route: '/admin/report/ptf/meetings/by-status', status: '3', borderColor: '#FD7E01', title: 'Overdue', minutesClass: 'overdue_minutes', percentClass: 'over_percent', percent: 0, icon: 'ti-timer', count: 0 },
    ]);
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
            <h3>PTF Meetings - Department-wise</h3>
            <div className="row my-5 d-flex justify-content-end">
              {statusCards.map((card, index) => (
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
                          {card.count}
                        </h3>
                        <p>{card.title}</p>
                        <p className={`mb-0 mt-2 ${card.percentClass}`}>
                          {card.percent === 0 ? '\u00A0' : `${card.percent}%`}
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
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
                          <td colSpan={2} className="text-center">No data available</td>
                        </tr>
                      ) : (
                        departments.map((dept, index) => (
                          <tr key={index}>
                            <td>{dept.name}</td>
                            <td>{dept.decisions_count || 0}</td>
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
