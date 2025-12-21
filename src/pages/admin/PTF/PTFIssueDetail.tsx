/**
 * PTF Issue Detail
 * EXACT replica of admin/ptf/details.blade.php from old CMDMS
 */

import { useParams, Link } from 'react-router-dom';
import { getMockPTFIssueById } from '../../../lib/mocks/data/ptfIssuesData';
import { Edit, CheckCircle, XCircle, FileText } from 'lucide-react';

export default function PTFIssueDetail() {
  const { id } = useParams<{ id: string }>();
  const issue = id ? getMockPTFIssueById(parseInt(id)) : undefined;
  
  if (!issue) {
    return (
      <div className="content-wrapper">
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <p>PTF issue not found.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  const getFlag = () => {
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
  
  const flag = getFlag();
  
  return (
    <div className="content-wrapper">
      <style>{`
        .vertical-timeline {
          width: 100%;
          position: relative;
          padding: 1.5rem 0 1rem;
        }
        .vertical-timeline::before {
          content: '';
          position: absolute;
          top: 0;
          left: 67px;
          height: 100%;
          width: 4px;
          background: #e9ecef;
          border-radius: .25rem;
        }
        .vertical-timeline-element {
          position: relative;
          margin: 0 0 1rem;
        }
        .vertical-timeline-element-icon {
          position: absolute;
          top: 0;
          left: 60px;
        }
        .vertical-timeline-element-icon .badge-dot-xl {
          box-shadow: 0 0 0 5px #fff;
        }
        .badge-dot-xl {
          width: 18px;
          height: 18px;
          position: relative;
          border-radius: 50%;
          background-color: #28a745;
        }
        .badge-dot-xl::before {
          content: '';
          width: 10px;
          height: 10px;
          border-radius: .25rem;
          position: absolute;
          left: 50%;
          top: 50%;
          margin: -5px 0 0 -5px;
          background: #fff;
        }
        .vertical-timeline-element-content {
          position: relative;
          margin-left: 90px;
          font-size: .8rem;
        }
        .vertical-timeline-element-content .timeline-title {
          font-size: .8rem;
          text-transform: uppercase;
          margin: 0 0 .5rem;
          padding: 2px 0 0;
          font-weight: bold;
        }
        .vertical-timeline-element-content .vertical-timeline-element-date {
          display: block;
          position: absolute;
          left: -90px;
          top: 0;
          padding-right: 10px;
          text-align: right;
          color: #adb5bd;
          font-size: .7619rem;
          white-space: nowrap;
        }
        .vertical-timeline-element-content:after {
          content: "";
          display: table;
          clear: both;
        }
      `}</style>
      
      <div className="row mb-2">
        <div className="col-md-12">
          <Link to="/admin/report/ptf/index" className="btn btn-secondary mb-3">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
      
      {/* Issue Details Section */}
      <div className="row">
        <div className="col-md-8">
          <div className="row">
            <div className="col-md-12">
              <div className="card">
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-12">
                      <button
                        style={{ margin: '2px' }}
                        type="button"
                        className="pull-right btn-sm btn-success mb-3"
                        data-toggle="modal"
                        data-target="#editModal"
                      >
                        <Edit size={16} className="mr-1" />
                        Edit & Approve
                      </button>
                      {issue.status === 1 && issue.decision === null && (
                        <button
                          style={{ margin: '2px' }}
                          type="button"
                          className="pull-right btn-sm btn-success mb-3"
                          data-toggle="modal"
                          data-target="#decisionModal"
                        >
                          <CheckCircle size={16} className="mr-1" />
                          Make Decision
                        </button>
                      )}
                      {issue.status === 1 && issue.decision !== null && (
                        <button
                          type="button"
                          className="pull-right btn btn-success mb-3"
                          data-toggle="modal"
                          data-target="#closeModal"
                        >
                          <XCircle size={16} className="mr-1" />
                          Close Issue
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <div className="row mt-4">
                    <div className="col-12">
                      <h6>
                        <u>
                          <FileText size={16} className="mr-1" />
                          Issue
                        </u>
                      </h6>
                      <p>{issue.issue}</p>
                    </div>
                    <hr />
                    <div className="col-12">
                      <h6>
                        <u>
                          <FileText size={16} className="mr-1" />
                          Way Forward
                        </u>
                      </h6>
                      <p>{issue.way_forward}</p>
                    </div>
                    {issue.attachment && (
                      <div className="col-md-12">
                        <a href={`#attachment-${issue.id}`}>
                          <FileText size={16} className="mr-1" />
                          Attachment
                        </a>
                      </div>
                    )}
                    <hr style={{ width: '100%' }} />
                    <div className="col-12">
                      <h6>
                        <u>
                          <CheckCircle size={16} className="mr-1" />
                          Decision
                        </u>
                      </h6>
                      <p>{issue.decision || 'No Decision Yet'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Assigned Departments Table */}
            <div className="col-md-12">
              <div className="card">
                <div id="table">
                  {issue.assignedTo.length === 0 ? (
                    <p className="p-3">No assigned department</p>
                  ) : (
                    <>
                      <h6 style={{ padding: '10px' }}>Assigned Departments</h6>
                      <table className="table table-striped">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Department</th>
                            <th>Latest Response</th>
                          </tr>
                        </thead>
                        <tbody>
                          {issue.assignedTo.map((assignment, index) => (
                            <tr key={assignment.id}>
                              <td>{index + 1}</td>
                              <td>{assignment.department.name}</td>
                              <td>
                                {assignment.latestResponse ? (
                                  <>
                                    {assignment.latestResponse.remarks}
                                    {assignment.latestResponse.created_at && (
                                      <span className="ml-2">
                                        ({new Date(assignment.latestResponse.created_at).toLocaleDateString('en-GB', {
                                          day: '2-digit',
                                          month: '2-digit',
                                          year: 'numeric'
                                        })})
                                      </span>
                                    )}
                                    <label className="badge badge-primary ml-2">
                                      {assignment.latestResponse.type_text}
                                    </label>
                                    {assignment.latestResponse.attachments && (
                                      <div className="mt-1">
                                        {assignment.latestResponse.attachments.map((file, idx) => (
                                          <a key={idx} href={`#file-${idx}`} className="mr-2">
                                            <FileText size={14} className="mr-1" />
                                            {file}
                                          </a>
                                        ))}
                                      </div>
                                    )}
                                  </>
                                ) : (
                                  'No response yet'
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Sidebar with Issue Info */}
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <div className="row">
                <div className="col-md-12">
                  {/* QR Code placeholder */}
                  <div style={{ 
                    width: '140px', 
                    height: '140px', 
                    backgroundColor: '#f0f0f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '10px',
                    border: '1px solid #ddd'
                  }}>
                    QR Code
                  </div>
                  <p>
                    <strong>Issue Code:</strong> {issue.id_text}
                  </p>
                  <p>
                    <strong>Status:</strong> {issue.status_text}
                  </p>
                  {issue.timeline && (
                    <>
                      <p style={{ color: 'red' }}>
                        <strong>Timeline:</strong> {new Date(issue.timeline).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric'
                        })}
                      </p>
                      <p>
                        <strong>Progress:</strong>
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
                    </>
                  )}
                  <p>
                    <strong>Priority:</strong>
                    <span style={{ color: issue.priority.color }}>
                      {' '}{issue.priority.title}
                    </span>
                  </p>
                  <p>
                    <strong>Sector:</strong> {issue.sector || 'N/A'}
                  </p>
                  <p>
                    <strong>Source:</strong> {issue.source.title}
                  </p>
                  <p>
                    <strong>Suggested Departments:</strong>{' '}
                    {issue.suggestedDepartments.map(d => d.name).join(', ')}
                  </p>
                  <p>
                    <strong>Department:</strong> {issue.department.name}
                  </p>
                  <p>
                    <strong>Created By:</strong> {issue.userCreatedBy.name}
                  </p>
                  <p>
                    <strong>Created At:</strong>{' '}
                    {new Date(issue.created_at).toLocaleString('en-GB', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <hr style={{ width: '100%' }} />
                <div className="col-md-12">
                  <p>
                    <strong>Total Meetings on this Issue:</strong> {issue.meetings.length}
                  </p>
                  <ul>
                    {issue.meetings.map((met) => (
                      <li key={met.id}>{met.meeting.meeting_code_text}</li>
                    ))}
                  </ul>
                </div>
                <hr style={{ width: '100%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Responses Timeline */}
      <div className="row d-flex justify-content-center mt-4 mb-4">
        <div className="col-md-8">
          <div className="main-card mb-3 card" style={{ height: '350px' }}>
            <div className="card-body" style={{ overflow: 'scroll' }}>
              <h5 className="card-title">Responses</h5>
              {issue.histories.length > 0 ? (
                issue.histories.map((history) => (
                  <div key={history.id} className="vertical-timeline vertical-timeline--animate vertical-timeline--one-column">
                    <div className="vertical-timeline-item vertical-timeline-element">
                      <div>
                        <span className="vertical-timeline-element-icon bounce-in">
                          <i className="badge badge-dot badge-dot-xl badge-success"></i>
                        </span>
                        <div className="vertical-timeline-element-content bounce-in">
                          <h4 className="timeline-title">
                            {history.department.name} ({history.userCreatedBy.name}){' '}
                            <label className="badge badge-primary">{history.type_text}</label>
                          </h4>
                          <p>
                            {history.remarks}
                            <br />
                            {history.attachments && history.attachments.map((file, idx) => (
                              <a key={idx} href={`#file-${idx}`} className="mr-2">
                                <FileText size={14} className="mr-1" />
                                {file}
                              </a>
                            ))}
                          </p>
                          <span className="vertical-timeline-element-date">
                            {new Date(history.created_at).toLocaleDateString('en-GB', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p>No responses yet</p>
              )}
            </div>
          </div>
        </div>
        
        <div className="col-md-4">
          <div className="main-card mb-3 card" style={{ height: '350px' }}>
            <div className="card-body" style={{ overflow: 'scroll' }}>
              <h5 className="card-title">CM Office Responses</h5>
              {issue.responses.length > 0 ? (
                issue.responses.map((response) => (
                  <div key={response.id} className="vertical-timeline vertical-timeline--animate vertical-timeline--one-column">
                    <div className="vertical-timeline-item vertical-timeline-element">
                      <div>
                        <span className="vertical-timeline-element-icon bounce-in">
                          <i className="badge badge-dot badge-dot-xl badge-success"></i>
                        </span>
                        <div className="vertical-timeline-element-content bounce-in">
                          <h4 className="timeline-title">
                            {response.department.name} ({response.userCreatedBy.name})
                          </h4>
                          <p>
                            {response.remarks}
                            <br />
                            {response.attachments && response.attachments.map((file, idx) => (
                              <a key={idx} href={`#file-${idx}`} className="mr-2">
                                <FileText size={14} className="mr-1" />
                                {file}
                              </a>
                            ))}
                          </p>
                          <span className="vertical-timeline-element-date">
                            {new Date(response.created_at).toLocaleDateString('en-GB', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p>No CM office responses yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
