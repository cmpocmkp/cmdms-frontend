/**
 * PTF Module - District Detail Report
 * EXACT replica of admin/ptf/district_detail_report.blade.php from old CMDMS
 */

import { useState, useEffect, useMemo } from 'react';
import { Printer, Building2, ListTodo, Network, Clock, CheckCircle2 } from 'lucide-react';
import { generateMockPTFIssues, PTFIssue } from '../../../lib/mocks/data/ptfIssuesData';

export default function PTFDistrictDetailReport() {
  const [loading, setLoading] = useState(true);
  const [issues] = useState<PTFIssue[]>(() => generateMockPTFIssues());

  useEffect(() => {
    // TODO: Replace with actual API call
    setLoading(false);
  }, []);

  // Group issues by department_id (district)
  const groupedIssues = useMemo(() => {
    const grouped = new Map<number, PTFIssue[]>();
    issues.forEach(issue => {
      const deptId = issue.department_id;
      if (!grouped.has(deptId)) {
        grouped.set(deptId, []);
      }
      grouped.get(deptId)!.push(issue);
    });
    return grouped;
  }, [issues]);

  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  // Helper function to get status badge class
  const getStatusBadgeClass = (status: number) => {
    switch (status) {
      case 0:
        return 'badge-warning';
      case 1:
        return 'badge-info';
      case 2:
        return 'badge-danger';
      case 3:
        return 'badge-success';
      default:
        return 'badge-secondary';
    }
  };

  // Helper function to get status text
  const getStatusText = (status: number) => {
    switch (status) {
      case 0:
        return 'Pending';
      case 1:
        return 'Open';
      case 2:
        return 'Rejected';
      case 3:
        return 'Completed';
      default:
        return 'Unknown';
    }
  };

  // Helper function to get history type badge
  const getHistoryTypeBadge = (type: string) => {
    if (type.includes('Initial')) {
      return 'badge-info';
    } else if (type.includes('Final')) {
      return 'badge-success';
    }
    return 'badge-secondary';
  };

  if (loading) {
    return <div className="text-center p-5">Loading...</div>;
  }

  return (
    <div className="content-wrapper">
      <style>{`
        .district-card {
          border-left: 5px solid #28a745;
          margin-bottom: 20px;
          background-color: #f8f9fa;
        }
        .issue-card {
          border-left: 4px solid #007bff;
          margin: 10px 20px;
          background-color: #fff;
        }
        .department-card {
          border-left: 3px solid #6c757d;
          margin: 10px 40px;
          background-color: #fff;
        }
        .response-card {
          border-left: 2px solid #e9ecef;
          margin: 5px 60px;
          padding: 10px;
          background-color: #fff;
        }
        .card-header {
          padding: 10px 15px;
          background-color: rgba(0,0,0,.03);
        }
        .card-body {
          padding: 15px;
        }
        .badge {
          padding: 0.25rem 0.5rem;
          font-size: 0.875rem;
          font-weight: 600;
          border-radius: 0.25rem;
          display: inline-block;
        }
        .badge-warning {
          background-color: #ffc107;
          color: #212529;
        }
        .badge-info {
          background-color: #17a2b8;
          color: #fff;
        }
        .badge-danger {
          background-color: #dc3545;
          color: #fff;
        }
        .badge-success {
          background-color: #28a745;
          color: #fff;
        }
        .badge-secondary {
          background-color: #6c757d;
          color: #fff;
        }
        
        @media print {
          @page {
            size: A4;
            margin: 2cm;
          }
          
          .no-print {
            display: none !important;
          }
          
          .district-card {
            border: 2px solid #000 !important;
            margin: 20px 0 !important;
            padding: 15px !important;
            page-break-inside: avoid;
            background: white !important;
          }
          
          .issue-card {
            border-left: 3px solid #666 !important;
            margin: 15px 0 15px 15px !important;
            padding: 10px !important;
            page-break-inside: avoid;
            background: white !important;
          }
          
          .department-card {
            border-left: 2px solid #999 !important;
            margin: 10px 0 10px 30px !important;
            padding: 10px !important;
            page-break-inside: avoid;
            background: white !important;
          }
          
          .response-card {
            border-left: 1px solid #ccc !important;
            margin: 5px 0 5px 45px !important;
            padding: 10px !important;
            background: white !important;
          }
          
          h3.card-title {
            font-size: 18pt !important;
            text-align: center !important;
            margin-bottom: 20px !important;
            border-bottom: 2px solid #000 !important;
            padding-bottom: 10px !important;
          }
        }
      `}</style>

      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h3 className="card-title">District Wise Detailed Report</h3>
              <div className="no-print">
                <button onClick={() => window.print()} className="btn btn-primary">
                  <Printer className="mr-2" size={16} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '0.5rem' }} />
                  Print Report
                </button>
              </div>
            </div>
            <div className="card-body">
              <h3 className="card-title">District Wise Detailed Report</h3>
              {Array.from(groupedIssues.entries()).map(([districtId, districtIssues]) => {
                const firstIssue = districtIssues[0];
                if (!firstIssue || !firstIssue.department) return null;

                const today = new Date().toISOString().split('T')[0];
                const pendingCount = districtIssues.filter(i => i.status === 0).length;
                const openCount = districtIssues.filter(i => i.status === 1).length;
                const rejectedCount = districtIssues.filter(i => i.status === 2).length;
                const completedCount = districtIssues.filter(i => i.status === 3).length;
                const criticallyDelayedCount = districtIssues.filter(
                  i => i.status === 1 && i.timeline && i.timeline < today
                ).length;
                const onTargetCount = districtIssues.filter(
                  i => i.status === 1 && i.timeline && i.timeline > today
                ).length;

                return (
                  <div key={districtId} className="district-card">
                    <div className="card-header">
                      <div className="d-flex justify-content-between align-items-center">
                        <h5 className="m-0">
                          <Building2 size={16} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '0.5rem' }} />
                          {firstIssue.department.name}
                          <small className="text-muted ml-2">({districtIssues.length} Issues)</small>
                        </h5>
                        <div>
                          <span className="badge badge-warning mr-2">
                            Pending: {pendingCount}
                          </span>
                          <span className="badge badge-info mr-2">
                            Open: {openCount}
                          </span>
                          <span className="badge badge-danger mr-2">
                            Rejected: {rejectedCount}
                          </span>
                          <span className="badge badge-success">
                            Completed: {completedCount}
                          </span>
                        </div>
                      </div>
                      <div className="mt-2">
                        <small className="text-muted">
                          <span className="mr-3">
                            <Clock size={14} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '0.25rem', color: '#ffc107' }} />
                            Critically Delayed: {criticallyDelayedCount}
                          </span>
                          <span>
                            <CheckCircle2 size={14} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '0.25rem', color: '#28a745' }} />
                            On Target: {onTargetCount}
                          </span>
                        </small>
                      </div>
                    </div>

                    {districtIssues.map((issue) => (
                      <div key={issue.id} className="issue-card">
                        <div className="card-header d-flex justify-content-between align-items-center">
                          <h6 className="m-0">
                            <ListTodo size={14} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '0.5rem' }} />
                            {issue.issue}
                          </h6>
                          <div>
                            <span className={`badge ${getStatusBadgeClass(issue.status)}`}>
                              {getStatusText(issue.status)}
                            </span>
                          </div>
                        </div>
                        <div className="card-body">
                          {issue.way_forward && (
                            <div className="text-muted mb-3">
                              <strong>Way Forward:</strong><br />
                              {issue.way_forward}
                            </div>
                          )}
                          {issue.timeline && (
                            <div className="text-muted mb-3">
                              <strong>Timeline:</strong> {formatDate(issue.timeline)}
                            </div>
                          )}

                          {issue.assignedTo && issue.assignedTo.length > 0 && issue.assignedTo.map((assignment) => (
                            <div key={assignment.id} className="department-card">
                              <div className="card-header">
                                <h6 className="m-0">
                                  <Network size={14} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '0.5rem' }} />
                                  {assignment.department.name}
                                </h6>
                              </div>
                              <div className="card-body">
                                {assignment.histories && assignment.histories.length > 0 ? (
                                  assignment.histories.map((history) => (
                                    <div key={history.id} className="response-card">
                                      <div>{history.remarks}</div>
                                      <div className="mt-2">
                                        <small className="text-muted">
                                          {formatDate(history.created_at)}{' '}
                                          <span className={`badge ${getHistoryTypeBadge(history.type_text)}`}>
                                            {history.type_text}
                                          </span>
                                        </small>
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  <div className="response-card">
                                    <small className="text-muted">No responses yet</small>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
