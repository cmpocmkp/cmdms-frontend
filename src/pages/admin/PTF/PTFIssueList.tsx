/**
 * PTF Issue List
 * EXACT replica of admin/ptf/list-issue.blade.php from old CMDMS
 */

import React, { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { generateMockPTFIssues, PTFIssue } from '../../../lib/mocks/data/ptfIssuesData';
import { mockDepartments } from '../../../lib/mocks/data/departments';
import { Eye } from 'lucide-react';

export default function PTFIssueList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const status = searchParams.get('status');
  const type = searchParams.get('type');
  const district = searchParams.get('district');
  
  const districtId = district && district !== 'all' ? parseInt(district) : null;
  
  // Filter issues based on params
  const allIssues = useMemo(() => {
    let issues = generateMockPTFIssues();
    
    // Filter by status
    if (status && status !== 'no-decision') {
      issues = issues.filter(i => i.status === parseInt(status));
    } else if (status === 'no-decision') {
      issues = issues.filter(i => i.decision === null);
    }
    
    // Filter by type (on target / critically delayed)
    if (type === 'on') {
      const today = new Date().toISOString().split('T')[0];
      issues = issues.filter(i => 
        i.status === 1 && 
        i.timeline !== null && 
        i.timeline > today
      );
    } else if (type === 'off') {
      const today = new Date().toISOString().split('T')[0];
      issues = issues.filter(i => 
        i.status === 1 && 
        i.timeline !== null && 
        i.timeline < today
      );
    }
    
    // Filter by district
    if (districtId) {
      issues = issues.filter(i => i.department_id === districtId);
    }
    
    return issues;
  }, [status, type, districtId]);
  
  const statusText = useMemo(() => {
    if (status === '0') return 'Pending';
    if (status === '1') return 'Open/Approved';
    if (status === '2') return 'Rejected';
    if (status === '3') return 'Completed';
    if (status === 'no-decision') return 'Decisions Pending';
    return 'All';
  }, [status]);
  
  // Get unique departments for filter
  const departments = useMemo(() => {
    const deptIds = new Set(allIssues.map(i => i.department_id));
    return mockDepartments.filter(d => deptIds.has(d.id));
  }, [allIssues]);
  
  const handleFilter = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const selectedDistrict = formData.get('district') as string;
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      if (selectedDistrict && selectedDistrict !== 'all') {
        newParams.set('district', selectedDistrict);
      } else {
        newParams.delete('district');
      }
      return newParams;
    });
  };
  
  const getFlag = (issue: PTFIssue) => {
    if (issue.status === 1 && issue.timeline !== null) {
      const today = new Date().toISOString().split('T')[0];
      if (issue.timeline < today) {
        return { title: 'Critically Delayed', color: 'red' };
      }
      if (issue.timeline > today) {
        return { title: 'On Target', color: 'green' };
      }
    }
    if (issue.status === 0) return { title: 'Pending', color: 'yellow' };
    if (issue.status === 2) return { title: 'Rejected', color: 'red' };
    if (issue.status === 3) return { title: 'Completed', color: 'green' };
    return { title: 'N/A', color: '' };
  };
  
  const truncateText = (text: string, words: number = 5) => {
    const wordsArray = text.split(' ');
    if (wordsArray.length <= words) return text;
    return wordsArray.slice(0, words).join(' ') + '...';
  };
  
  return (
    <div className="content-wrapper">
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">PTF Issue List {statusText}</h4>
              <form onSubmit={handleFilter}>
                <div className="row">
                  <div className="col-md-4">
                    <label>Districts</label>
                    <select 
                      className="form-control" 
                      id="district" 
                      name="district"
                      defaultValue={district || 'all'}
                    >
                      <option value="all">All</option>
                      {departments.map((dept) => (
                        <option key={dept.id} value={dept.id}>
                          {dept.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-2 mt-4">
                    <input type="submit" value="Filter" className="btn-sm btn-primary" />
                  </div>
                </div>
              </form>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table id="order-listing" className="table table-striped dataTable no-footer">
                  <thead>
                    <tr>
                      <th>Sr.No</th>
                      <th>Issue #</th>
                      <th>Raised By</th>
                      <th>Issue</th>
                      <th>Way Forward</th>
                      <th>Source</th>
                      <th>Priority</th>
                      <th>Suggested Departments</th>
                      <th>Assigned Department</th>
                      <th>Created Date</th>
                      <th>Status</th>
                      <th>Progress</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allIssues.length > 0 ? (
                      allIssues.map((issue, index) => {
                        const flag = getFlag(issue);
                        return (
                          <tr key={issue.id}>
                            <td>{index + 1}</td>
                            <td>{issue.id_text}</td>
                            <td>{issue.department.name}</td>
                            <td>{truncateText(issue.issue, 5)}</td>
                            <td>{truncateText(issue.way_forward, 5)}</td>
                            <td>{issue.source.title}</td>
                            <td style={{ color: issue.priority.color }}>
                              {issue.priority.title}
                            </td>
                            <td>
                              {issue.suggestedDepartments.map((dept) => (
                                <label key={dept.id} className="badge badge-primary mr-1">
                                  {dept.name}
                                </label>
                              ))}
                            </td>
                            <td>
                              {issue.assignedTo.length > 0 ? (
                                issue.assignedTo.map((assigned) => (
                                  <label key={assigned.id} className="badge badge-primary mr-1">
                                    {assigned.department.name}
                                  </label>
                                ))
                              ) : (
                                'N/A'
                              )}
                            </td>
                            <td>
                              {new Date(issue.created_at).toLocaleDateString('en-GB', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric'
                              })}
                            </td>
                            <td>{issue.status_text}</td>
                            <td>
                              {issue.timeline !== null ? (
                                <p>
                                  <span
                                    className="priority-flag"
                                    style={{
                                      display: 'inline-block',
                                      width: '12px',
                                      height: '12px',
                                      backgroundColor: flag.color,
                                      marginRight: '5px'
                                    }}
                                  ></span>
                                  {flag.title}
                                </p>
                              ) : null}
                            </td>
                            <td>
                              <Link
                                to={`/admin/ptf/details/${issue.id}`}
                                className="btn btn-primary"
                              >
                                <Eye size={16} className="mr-1" />
                                View
                              </Link>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={13} className="text-center">
                          No issues found
                        </td>
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
  );
}
