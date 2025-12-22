/**
 * PTF Module - District Wise Latest Responses Report
 * EXACT replica of admin/ptf/district_latest_report.blade.php from old CMDMS
 */

import { useState, useEffect, useMemo } from 'react';
import { Printer } from 'lucide-react';
import { generateMockPTFIssues, PTFIssue } from '../../../lib/mocks/data/ptfIssuesData';
import { mockDepartments } from '../../../lib/mocks/data/departments';

export default function PTFDistrictLatestReport() {
  const [loading, setLoading] = useState(true);
  const [selectedDistricts, setSelectedDistricts] = useState<number[]>([]);
  const [allIssues] = useState<PTFIssue[]>(() => generateMockPTFIssues());

  useEffect(() => {
    // TODO: Replace with actual API call
    setLoading(false);
  }, []);

  // Filter issues based on selected districts and exclude status 2 (Rejected)
  const filteredIssues = useMemo(() => {
    let issues = allIssues.filter(issue => issue.status !== 2);
    if (selectedDistricts.length > 0) {
      issues = issues.filter(issue => selectedDistricts.includes(issue.department_id));
    }
    return issues;
  }, [allIssues, selectedDistricts]);

  // Group issues by department_id (district)
  const groupedIssues = useMemo(() => {
    const grouped = new Map<number, PTFIssue[]>();
    filteredIssues.forEach(issue => {
      const deptId = issue.department_id;
      if (!grouped.has(deptId)) {
        grouped.set(deptId, []);
      }
      grouped.get(deptId)!.push(issue);
    });
    return grouped;
  }, [filteredIssues]);

  // Get unique districts for filter
  const districts = useMemo(() => {
    const uniqueDeptIds = new Set(allIssues.map(issue => issue.department_id));
    return Array.from(uniqueDeptIds).map(deptId => {
      const issue = allIssues.find(i => i.department_id === deptId);
      return {
        department_id: deptId,
        department: issue?.department || { id: deptId, name: 'Unknown' }
      };
    });
  }, [allIssues]);

  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  // Helper function to get status class for district header
  const getStatusClass = (issues: PTFIssue[]): string => {
    const statusCounts = new Map<number, number>();
    issues.forEach(issue => {
      statusCounts.set(issue.status, (statusCounts.get(issue.status) || 0) + 1);
    });

    let maxStatus = 0;
    let maxCount = 0;
    statusCounts.forEach((count, status) => {
      if (count > maxCount) {
        maxCount = count;
        maxStatus = status;
      }
    });

    switch (maxStatus) {
      case 1:
        return 'on-target';
      case 2:
        return 'critically-delayed';
      case 3:
        return 'completed';
      case 0:
        return 'pending';
      case 4:
        return 'rejected';
      default:
        return 'pending';
    }
  };

  // Helper function to get status badge and cell class
  const getStatusInfo = (status: number) => {
    switch (status) {
      case 0:
        return { badge: 'bg-warning text-dark', text: 'Pending', cellClass: 'status-pending' };
      case 1:
        return { badge: 'bg-success', text: 'On Target', cellClass: 'status-on-target' };
      case 2:
        return { badge: 'bg-danger', text: 'Critically Delayed', cellClass: 'status-critically-delayed' };
      case 3:
        return { badge: 'bg-success', text: 'Completed', cellClass: 'status-completed' };
      case 4:
        return { badge: 'bg-danger', text: 'Rejected', cellClass: 'status-rejected' };
      default:
        return { badge: 'bg-secondary', text: 'Unknown', cellClass: '' };
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(e.target.selectedOptions, option => Number(option.value));
    setSelectedDistricts(selected);
  };

  const handleReset = () => {
    setSelectedDistricts([]);
  };

  if (loading) {
    return <div className="text-center p-5">Loading...</div>;
  }

  return (
    <div className="content-wrapper">
      <style>{`
        .status-on-target {
          background-color: #d4edda !important;
          color: #155724 !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        
        .status-critically-delayed {
          background-color: #f8d7da !important;
          color: #721c24 !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        
        .status-completed {
          background-color: #d4edda !important;
          color: #155724 !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        
        .status-pending {
          background-color: #fff3cd !important;
          color: #856404 !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        
        .status-rejected {
          background-color: #f8d7da !important;
          color: #721c24 !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }

        .table thead th {
          background-color: #2c3e50 !important;
          color: white !important;
          border-bottom: 2px solid #1a2634 !important;
        }

        @media print {
          @page {
            size: A4 landscape;
            margin: 1.5cm;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
            color-adjust: exact;
          }

          html, body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          
          .no-print {
            display: none !important;
          }

          .table {
            max-width: 100% !important;
            font-size: 12px !important;
          }

          .table td, .table th {
            padding: 0.5rem !important;
          }

          .table thead th {
            background-color: #2c3e50 !important;
            color: white !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>

      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <div className="d-flex justify-content-between align-items-center">
                <h3 className="card-title">District Wise Latest Responses</h3>
                <div className="no-print">
                  <button onClick={() => window.print()} className="btn btn-primary ml-2">
                    <Printer size={16} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '0.5rem' }} />
                    Print Report
                  </button>
                </div>
              </div>
              <div className="mt-3 no-print">
                <form className="form-inline" onSubmit={(e) => { e.preventDefault(); }}>
                  <div className="form-group" style={{ width: '300px' }}>
                    <select
                      name="districts[]"
                      className="form-control"
                      multiple
                      value={selectedDistricts.map(String)}
                      onChange={handleFilterChange}
                      style={{ minHeight: '38px' }}
                    >
                      {districts.map((district) => (
                        <option key={district.department_id} value={district.department_id}>
                          {district.department.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button type="submit" className="btn btn-primary ml-2">Apply Filter</button>
                  <button type="button" onClick={handleReset} className="btn btn-secondary ml-2">Reset</button>
                </form>
              </div>
            </div>
            <div className="card-body">
              <h3 className="card-title text-center mb-4">District Wise Latest Responses</h3>
              {Array.from(groupedIssues.entries()).map(([districtId, districtIssues]) => {
                const firstIssue = districtIssues[0];
                if (!firstIssue || !firstIssue.department) return null;

                const statusClass = getStatusClass(districtIssues);

                return (
                  <div key={districtId} className="table-responsive mb-4">
                    <h4 className={`mb-3 status-${statusClass}`}>
                      {firstIssue.department.name} ({districtIssues.length} Issues)
                    </h4>
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th style={{ width: '5%' }}>#</th>
                          <th style={{ width: '25%' }}>Issue</th>
                          <th style={{ width: '35%' }}>Department & Latest Response</th>
                          <th style={{ width: '15%' }}>Response Date</th>
                          <th style={{ width: '10%' }}>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {districtIssues.map((issue, index) => {
                          const statusInfo = getStatusInfo(issue.status);
                          return (
                            <tr key={issue.id}>
                              <td>{index + 1}</td>
                              <td>
                                {issue.issue}
                                {issue.way_forward && (
                                  <>
                                    <br />
                                    <small className="text-muted">Way Forward: {issue.way_forward}</small>
                                  </>
                                )}
                              </td>
                              <td className={statusInfo.cellClass}>
                                {issue.assignedTo && issue.assignedTo.length > 0 ? (
                                  issue.assignedTo.map((assignment, assIdx) => {
                                    const latestHistory = assignment.histories && assignment.histories.length > 0
                                      ? assignment.histories[0]
                                      : null;
                                    return (
                                      <div key={assignment.id}>
                                        {assIdx > 0 && <hr className="my-2" />}
                                        <div className="mb-2">
                                          <strong>{assignment.department.name}</strong>
                                          {latestHistory ? (
                                            <>
                                              <br />
                                              {latestHistory.remarks}
                                              <br />
                                              <small>
                                                {latestHistory.type === 0 ? (
                                                  <span className="badge bg-info">Initial Response</span>
                                                ) : latestHistory.type === 1 ? (
                                                  <span className="badge bg-success">Final Response</span>
                                                ) : (
                                                  <span className="badge bg-secondary">{latestHistory.type_text}</span>
                                                )}
                                              </small>
                                            </>
                                          ) : (
                                            <>
                                              <br />
                                              <small className="text-muted">No response yet</small>
                                            </>
                                          )}
                                        </div>
                                      </div>
                                    );
                                  })
                                ) : (
                                  <small className="text-muted">No assignments</small>
                                )}
                              </td>
                              <td>
                                {issue.assignedTo && issue.assignedTo.length > 0 ? (
                                  issue.assignedTo.map((assignment, assIdx) => {
                                    const latestHistory = assignment.histories && assignment.histories.length > 0
                                      ? assignment.histories[0]
                                      : null;
                                    return (
                                      <div key={assignment.id}>
                                        {assIdx > 0 && <hr className="my-2" />}
                                        <div className="mb-2">
                                          {latestHistory ? formatDate(latestHistory.created_at) : '-'}
                                        </div>
                                      </div>
                                    );
                                  })
                                ) : (
                                  '-'
                                )}
                              </td>
                              <td>
                                <span className={`badge ${statusInfo.badge}`}>
                                  {statusInfo.text}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
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
