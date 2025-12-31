/**
 * Department CM Remarks List Page
 * Based on department/cmremarks/index.blade.php from old CMDMS
 * EXACT replica - structure, classes, and behavior preserved
 */

import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { mockCMRemarks } from '../../lib/mocks/data/cmRemarks';

// Helper functions matching old CMDMS badgesWithIntegerStatus and badgesWithStringStatus
const badgesWithIntegerStatus = (status: number | string | undefined): string => {
  if (!status) return 'danger';
  const statusNum = typeof status === 'string' ? parseInt(status) : status;
  
  const statusMap: { [key: number]: string } = {
    1: 'success',   // Completed
    2: 'warning',   // On Target
    3: 'danger',    // Overdue
    4: 'info',      // Off Target
    7: 'ongoing',   // Ongoing
    6: 'indigo',    // Overdue Other Reason
    9: 'lightred'   // Off Target Other Reason
  };
  
  return statusMap[statusNum] || 'danger';
};

const badgesWithStringStatus = (status: number | string | undefined): string => {
  if (!status) return 'Overdue';
  const statusNum = typeof status === 'string' ? parseInt(status) : status;
  
  const statusMap: { [key: number]: string } = {
    1: 'Completed',
    2: 'On Target',
    3: 'Overdue',
    4: 'Off Target',
    7: 'Ongoing',
    6: 'Overdue Other Reason',
    9: 'Off Target Other Reason'
  };
  
  return statusMap[statusNum] || 'Overdue';
};

export default function CMRemarksList() {
  const { user } = useAuth();
  const departmentId = user?.department_id;

  // Filter CM remarks assigned to this department
  const departmentRemarks = useMemo(() => {
    if (!departmentId) return [];
    return mockCMRemarks.filter(remark => 
      remark.departments.some(dept => dept.id === departmentId)
    );
  }, [departmentId]);

  return (
    <div className="content-wrapper">
      <style>{`
        .select2-container--default .select2-selection--single .select2-selection__arrow {
          height: 26px !important;
          position: absolute !important;
          top: 10px !important;
          right: 10px !important;
          width: unset !important;
        }
        table#department-directive-listing {
          width: 100% !important;
        }
        #department-directive-listing td {
          vertical-align: top !important;
          font-size: 16px !important;
          min-height: 35px !important;
          border: 0.5px solid #dfdddd !important;
          color: #49525a !important;
          text-align: center !important;
        }
        #department-directive-listing td ul li {
          font-size: 16px !important;
        }
        #department-directive-listing th {
          border: 0.5px solid #dfdddd !important;
          text-align: center;
          padding: 15px;
        }
        #department-directive-listing td div, u, b, p {
          width: 100% !important;
        }
        .card-body p {
          font-size: 16px;
        }
        .badge.badge-pill {
          font-size: 16px !important;
        }
        table.related_department_table {
          width: 100% !important;
        }
        .related_department_table td {
          border: 1px solid silver;
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
        table.dataTable tbody td.d-decision {
          word-break: break-word !important;
          width: 200px !important;
        }
        .table th, .jsgrid .jsgrid-table th, .table td, .jsgrid .jsgrid-table td {
          padding: 10px !important;
        }
        #department-directive-listing tr {
          height: 20px !important;
        }
        h5 {
          font-size: 16px !important;
        }
        table#directive-listing th {
          padding: 10px !important;
        }
        table#directive-listing {
          border: 1px solid silver;
        }
        .datatable thead th {
          background: rgb(37, 136, 95) !important;
          color: white !important;
        }
      `}</style>
      
      <div className="card">
        <div className="card-body">
          <h4 className="card-title">
            <strong>{user?.department?.name ?? ''} department </strong> All CM Remarks
          </h4>
          <div className="row">
            <div className="col-12">
              <div className="table-responsive">
                <div className="container">
                  <h4>Your Assigned CM Remarks</h4>
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>S.No</th>
                        <th>Subject</th>
                        <th>Section</th>
                        <th>Letter #</th>
                        <th>Issue Date</th>
                        <th>Timeline</th>
                        <th>Attachments</th>
                        <th>Department's <br />Progress</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {departmentRemarks.length > 0 ? (
                        departmentRemarks.map((remark, index) => {
                          // Get status from department pivot (integer) or fallback to remark status
                          const deptPivot = remark.departments.find(d => d.id === departmentId);
                          const pivotStatus = deptPivot?.status;
                          // Convert string status to integer if needed
                          const statusValue = pivotStatus 
                            ? (typeof pivotStatus === 'string' ? parseInt(pivotStatus) : pivotStatus)
                            : (typeof remark.status === 'string' ? parseInt(remark.status) : remark.status);
                          
                          return (
                            <tr key={remark.id}>
                              <td>{index + 1}</td>
                              <td>{remark.subject}</td>
                              <td>{remark.section_name ?? 'N/A'}</td>
                              <td>{remark.letter_number}</td>
                              <td>{new Date(remark.issue_date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-')}</td>
                              <td>{new Date(remark.timeline).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-')}</td>
                              <td>
                                {remark.attachments && remark.attachments.length > 0 ? (
                                  remark.attachments.map((attachment, idx) => (
                                    <React.Fragment key={idx}>
                                      <a 
                                        href={`/storage/cm_remarks_uploads/${attachment}`} 
                                        target="_blank"
                                        rel="noopener noreferrer"
                                      >
                                        Download
                                      </a>
                                      {idx < remark.attachments!.length - 1 && <br />}
                                    </React.Fragment>
                                  ))
                                ) : (
                                  'N/A'
                                )}
                              </td>
                              <td style={{ whiteSpace: 'pre-line' }} dangerouslySetInnerHTML={{ __html: (remark.comments || '').replace(/\n/g, '<br>') }}></td>
                              <td style={{ width: '120px' }}>
                                <label className={`badge badge-${badgesWithIntegerStatus(statusValue)} badge-pill`}>
                                  {badgesWithStringStatus(statusValue)}
                                </label>
                              </td>
                              <td>
                                <Link
                                  to={`/department/cm-remarks/${remark.id}`}
                                  className="btn btn-sm btn-info"
                                >
                                  Response
                                </Link>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={10}>No remarks found for your department.</td>
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
    </div>
  );
}

