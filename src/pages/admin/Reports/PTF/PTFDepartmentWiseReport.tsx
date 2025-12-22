/**
 * PTF Module - Department Wise Report
 * EXACT replica of admin/ptf/department_wise_report.blade.php from old CMDMS
 */

import { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Target, AlertTriangle, CheckCircle } from 'lucide-react';
import {
  generateMockPTFDepartmentAssignments,
  generateMockPTFDepartmentRelationships,
  PTFDepartmentAssignment,
  PTFDepartmentRelationship
} from '../../../lib/mocks/data/ptfData';

export default function PTFDepartmentWiseReport() {
  const [loading, setLoading] = useState(true);
  const [assignments] = useState<PTFDepartmentAssignment[]>(() => generateMockPTFDepartmentAssignments());
  const [relationships] = useState<PTFDepartmentRelationship[]>(() => generateMockPTFDepartmentRelationships());
  
  const departmentsTableRef = useRef<HTMLTableElement>(null);
  const departmentsDataTableRef = useRef<any>(null);
  const relationsTableRef = useRef<HTMLTableElement>(null);
  const relationsDataTableRef = useRef<any>(null);

  useEffect(() => {
    // TODO: Replace with actual API call
    setLoading(false);
  }, []);

  // Initialize DataTables
  useEffect(() => {
    const loadScript = (src: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) {
          resolve();
          return;
        }
        const script = document.createElement('script');
        script.src = src;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
        document.head.appendChild(script);
      });
    };

    const initializeDataTables = async () => {
      try {
        // Load jQuery first
        if (!(window as any).jQuery) {
          await loadScript('https://code.jquery.com/jquery-3.7.1.min.js');
        }

        // Load DataTables
        await loadScript('https://cdn.datatables.net/1.13.7/js/jquery.dataTables.min.js');

        // Load DataTables CSS
        if (!document.querySelector('link[href*="jquery.dataTables"]')) {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = 'https://cdn.datatables.net/1.13.7/css/jquery.dataTables.min.css';
          document.head.appendChild(link);
        }

        const $ = (window as any).jQuery;

        // Destroy existing DataTables if they exist
        if (departmentsDataTableRef.current) {
          departmentsDataTableRef.current.destroy();
        }
        if (relationsDataTableRef.current) {
          relationsDataTableRef.current.destroy();
        }

        // Initialize departments table
        if (departmentsTableRef.current && assignments.length > 0) {
          departmentsDataTableRef.current = $(departmentsTableRef.current).DataTable({
            pageLength: 100,
            ordering: true
          });
        }

        // Initialize relationships table
        if (relationsTableRef.current && relationships.length > 0) {
          relationsDataTableRef.current = $(relationsTableRef.current).DataTable({
            pageLength: 100,
            ordering: true,
            order: [[0, 'asc'], [1, 'asc']]
          });
        }
      } catch (error) {
        console.error('Error initializing DataTables:', error);
      }
    };

    if (!loading) {
      const timer = setTimeout(() => {
        initializeDataTables();
      }, 100);

      return () => {
        clearTimeout(timer);
        if (departmentsDataTableRef.current) {
          try {
            departmentsDataTableRef.current.destroy();
          } catch (e) {
            // Ignore destroy errors
          }
        }
        if (relationsDataTableRef.current) {
          try {
            relationsDataTableRef.current.destroy();
          } catch (e) {
            // Ignore destroy errors
          }
        }
      };
    }
  }, [loading, assignments.length, relationships.length]);

  // Calculate summary totals
  const summaryTotals = useMemo(() => {
    return {
      on_target: assignments.reduce((sum, item) => sum + item.on_target, 0),
      critically_delayed: assignments.reduce((sum, item) => sum + item.critically_delayed, 0),
      closed: assignments.reduce((sum, item) => sum + item.closed, 0)
    };
  }, [assignments]);

  // Group relationships by assignment department
  const groupedRelationships = useMemo(() => {
    const grouped = new Map<string, PTFDepartmentRelationship[]>();
    relationships.forEach(rel => {
      const key = rel.assignment_department_name;
      if (!grouped.has(key)) {
        grouped.set(key, []);
      }
      grouped.get(key)!.push(rel);
    });
    return grouped;
  }, [relationships]);

  if (loading) {
    return <div className="text-center p-5">Loading...</div>;
  }

  return (
    <div className="content-wrapper">
      <style>{`
        .table img {
          border-radius: 0%;
        }
        .table th img {
          width: 20px;
        }
        .summary-icon {
          width: 20px;
          height: 20px;
          display: inline-block;
          margin-right: 8px;
          vertical-align: middle;
        }
      `}</style>
      
      {/* Summary Section */}
      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="card-body">
              <table className="table">
                <tbody>
                  <tr>
                    <td>
                      <Target className="summary-icon" style={{ color: '#17c653' }} size={20} />
                      On Target
                    </td>
                    <td>
                      <Link to="/admin/ptf/list-issue-all?status=1&type=on">
                        {summaryTotals.on_target}
                      </Link>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <AlertTriangle className="summary-icon" style={{ color: '#E74039' }} size={20} />
                      Critically Delayed
                    </td>
                    <td>
                      <Link to="/admin/ptf/list-issue-all?status=1&type=off">
                        {summaryTotals.critically_delayed}
                      </Link>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <CheckCircle className="summary-icon" style={{ color: '#0E8160' }} size={20} />
                      Closed
                    </td>
                    <td>
                      <Link to="/admin/ptf/list-issue-all?status=3">
                        {summaryTotals.closed}
                      </Link>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Department-wise PTF Assignment Report */}
      <div className="row mt-4">
        <div className="col-md-12">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Department-wise PTF Assignment Report</h4>
              <div className="table-responsive">
                <table className="table table-striped" id="table_departments" ref={departmentsTableRef}>
                  <thead>
                    <tr>
                      <th>Department</th>
                      <th>Total</th>
                      <th>Assigned</th>
                      <th>Open</th>
                      <th>Response Pending</th>
                      <th>Initial Responded</th>
                      <th>
                        <CheckCircle size={20} style={{ color: '#0E8160', display: 'inline-block', verticalAlign: 'middle' }} />
                        {' '}Closed
                      </th>
                      <th>
                        <Target size={20} style={{ color: '#17c653', display: 'inline-block', verticalAlign: 'middle' }} />
                        {' '}On Target
                      </th>
                      <th>
                        <AlertTriangle size={20} style={{ color: '#E74039', display: 'inline-block', verticalAlign: 'middle' }} />
                        {' '}Critically Delayed
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {assignments.length > 0 ? (
                      assignments.map((row) => (
                        <tr key={row.department_id}>
                          <td>{row.department.name}</td>
                          <td>
                            <Link to={`/admin/ptf/report/list-issue?department_id=${row.department_id}&status=all`}>
                              {row.total}
                            </Link>
                          </td>
                          <td>
                            <Link to={`/admin/ptf/report/list-issue?department_id=${row.department_id}&status=all`}>
                              {row.assigned}
                            </Link>
                          </td>
                          <td>
                            <Link to={`/admin/ptf/report/list-issue?department_id=${row.department_id}&status=0`}>
                              {row.open}
                            </Link>
                          </td>
                          <td>
                            <Link to={`/admin/ptf/report/list-issue?department_id=${row.department_id}&initial_response=0`}>
                              {row.response_pending}
                            </Link>
                          </td>
                          <td>
                            <Link to={`/admin/ptf/report/list-issue?department_id=${row.department_id}&initial_response=1`}>
                              {row.initial_response}
                            </Link>
                          </td>
                          <td>{row.closed}</td>
                          <td>{row.on_target}</td>
                          <td>{row.critically_delayed}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={9} className="text-center">No data available</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Department Assignment Relationships */}
      <div className="row mt-4">
        <div className="col-md-12">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Department Assignment Relationships</h4>
              <div className="table-responsive">
                <table className="table table-striped" id="table_department_relations" ref={relationsTableRef}>
                  <thead>
                    <tr>
                      <th>Assignment Department</th>
                      <th>Issue Department</th>
                      <th>Total</th>
                      <th>Assigned</th>
                      <th>Initial Response</th>
                      <th>Response Pending</th>
                      <th>Open</th>
                      <th>Closed</th>
                      <th>
                        <Target size={20} style={{ color: '#17c653', display: 'inline-block', verticalAlign: 'middle' }} />
                        {' '}On Target
                      </th>
                      <th>
                        <AlertTriangle size={20} style={{ color: '#E74039', display: 'inline-block', verticalAlign: 'middle' }} />
                        {' '}Critically Delayed
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from(groupedRelationships.entries()).map(([assignmentDept, deptIssues]) => {
                      // Group by issue department
                      const issueGroups = new Map<string, PTFDepartmentRelationship[]>();
                      deptIssues.forEach(rel => {
                        const key = rel.issue_department_name;
                        if (!issueGroups.has(key)) {
                          issueGroups.set(key, []);
                        }
                        issueGroups.get(key)!.push(rel);
                      });

                      return Array.from(issueGroups.entries()).map(([issueDept, deptIssuesList]) => {
                        const firstIssue = deptIssuesList[0];
                        const totals = deptIssuesList.reduce((acc, item) => ({
                          total: acc.total + item.total,
                          assigned: acc.assigned + item.assigned,
                          initial_response: acc.initial_response + item.initial_response,
                          response_pending: acc.response_pending + item.response_pending,
                          open: acc.open + item.open,
                          closed: acc.closed + item.closed,
                          on_target: acc.on_target + item.on_target,
                          critically_delayed: acc.critically_delayed + item.critically_delayed
                        }), {
                          total: 0,
                          assigned: 0,
                          initial_response: 0,
                          response_pending: 0,
                          open: 0,
                          closed: 0,
                          on_target: 0,
                          critically_delayed: 0
                        });

                        return (
                          <tr key={`${firstIssue.assignment_department_id}-${firstIssue.issue_department_id}`}>
                            <td>{assignmentDept}</td>
                            <td>{issueDept}</td>
                            <td>
                              <Link to={`/admin/ptf/report/list-issue?department_id=${firstIssue.assignment_department_id}&status=all&district=${firstIssue.issue_department_id}`}>
                                {totals.total}
                              </Link>
                            </td>
                            <td>
                              <Link to={`/admin/ptf/report/list-issue?department_id=${firstIssue.assignment_department_id}&status=all&district=${firstIssue.issue_department_id}`}>
                                {totals.assigned}
                              </Link>
                            </td>
                            <td>
                              <Link to={`/admin/ptf/report/list-issue?department_id=${firstIssue.assignment_department_id}&initial_response=1&district=${firstIssue.issue_department_id}`}>
                                {totals.initial_response}
                              </Link>
                            </td>
                            <td>
                              <Link to={`/admin/ptf/report/list-issue?department_id=${firstIssue.assignment_department_id}&initial_response=0&district=${firstIssue.issue_department_id}`}>
                                {totals.response_pending}
                              </Link>
                            </td>
                            <td>
                              <Link to={`/admin/ptf/report/list-issue?department_id=${firstIssue.assignment_department_id}&status=0&district=${firstIssue.issue_department_id}`}>
                                {totals.open}
                              </Link>
                            </td>
                            <td>
                              <Link to={`/admin/ptf/report/list-issue?department_id=${firstIssue.assignment_department_id}&status=1&district=${firstIssue.issue_department_id}`}>
                                {totals.closed}
                              </Link>
                            </td>
                            <td>{totals.on_target}</td>
                            <td>{totals.critically_delayed}</td>
                          </tr>
                        );
                      });
                    }).flat()}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
