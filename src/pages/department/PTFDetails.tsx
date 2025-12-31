/**
 * Department PTF Details Page
 * EXACT replica of department/ptf/details.blade.php from old CMDMS
 * Structure, classes, and behavior preserved exactly
 */

import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getMockPTFIssueById } from '../../lib/mocks/data/ptfIssuesData';
import { useMemo } from 'react';

export default function PTFDetails() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Get PTF issue by ID
  const issue = useMemo(() => {
    if (!id) return null;
    return getMockPTFIssueById(parseInt(id, 10));
  }, [id]);
  
  if (!issue) {
    return (
      <div className="content-wrapper">
        <div className="card">
          <div className="card-body">
            <p>PTF issue not found.</p>
            <Link to="/department/ptf" className="btn btn-primary">Back to PTF Dashboard</Link>
          </div>
        </div>
      </div>
    );
  }
  
  // Check if user is the creator
  const isCreator = user?.id === issue.created_by;
  
  // Format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
  
  // Format date for timeline
  const formatTimelineDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };
  
  // Get file icon class based on extension
  const getFileIconClass = (filename: string): string => {
    const ext = filename.split('.').pop()?.toLowerCase();
    if (['pdf'].includes(ext || '')) return 'fa fa-file-pdf';
    if (['doc', 'docx'].includes(ext || '')) return 'fa fa-file-word';
    if (['xls', 'xlsx'].includes(ext || '')) return 'fa fa-file-excel';
    if (['jpg', 'jpeg', 'png', 'gif'].includes(ext || '')) return 'fa fa-file-image';
    return 'fa fa-file';
  };
  
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
          border-radius: 50%;
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
        .badge:empty {
          display: none;
        }
        .table-striped tbody tr:nth-of-type(odd) {
          background-color: rgba(0, 0, 0, 0.05);
        }
        .badge-primary {
          color: #fff;
          background-color: #007bff;
          padding: 0.25em 0.6em;
          font-size: 75%;
          font-weight: 700;
          line-height: 1;
          text-align: center;
          white-space: nowrap;
          vertical-align: baseline;
          border-radius: 0.25rem;
        }
      `}</style>
      
      {/* PTF Detail Section */}
      <div className="row">
        <div className="col-md-8">
          <div className="row">
            <div className="col-md-12">
              <div className="card">
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-12">
                      {isCreator && (
                        <button
                          style={{ margin: '2px' }}
                          type="button"
                          className="pull-right btn-sm btn-success mb-3"
                          onClick={() => {
                            // TODO: Open edit modal
                            alert('Edit functionality will be implemented');
                          }}
                        >
                          Edit Issue Details
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="row mt-4">
                    <div className="col-12">
                      <h6>
                        <u><i className="fa fa-list"></i> Issue</u>
                      </h6>
                      <p>{issue.issue}</p>
                    </div>
                    <hr />
                    <div className="col-12">
                      <h6>
                        <u><i className="fa fa-road"></i> Way Forward</u>
                      </h6>
                      <p>{issue.way_forward}</p>
                    </div>
                    {issue.attachment && (
                      <div className="col-md-12">
                        <a href={`/ptf_uploads/${issue.attachment}`} target="_blank" rel="noopener noreferrer">
                          <i className="fa fa-file"></i> Attachment
                        </a>
                      </div>
                    )}
                    <hr style={{ width: '100%' }} />
                    <div className="col-12">
                      <h6>
                        <u><i className="fa fa-star"></i> Decision</u>
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
                    <p>No assigned department</p>
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
                          {issue.assignedTo.map((assignment, index) => {
                            const latestResponse = assignment.latestResponse;
                            return (
                              <tr key={assignment.id}>
                                <td>{index + 1}</td>
                                <td>{assignment.department.name}</td>
                                <td>
                                  {latestResponse ? (
                                    <>
                                      {latestResponse.remarks}
                                      {latestResponse.created_at && (
                                        <> ({formatTimelineDate(latestResponse.created_at)})</>
                                      )}
                                      <span className="badge badge-primary" style={{ marginLeft: '5px' }}>
                                        {latestResponse.type_text}
                                      </span>
                                      {latestResponse.attachments && latestResponse.attachments.length > 0 && (
                                        <>
                                          <br />
                                          {latestResponse.attachments.map((file, fileIndex) => (
                                            <a
                                              key={fileIndex}
                                              href={`/ptf_uploads/${file}`}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              style={{ marginRight: '10px' }}
                                            >
                                              <i className={getFileIconClass(file)}></i> {file}
                                            </a>
                                          ))}
                                        </>
                                      )}
                                    </>
                                  ) : (
                                    <span className="badge badge-primary">No response yet</span>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <div className="row">
                <div className="col-md-12">
                  {/* QR Code placeholder - would need a QR code library */}
                  <div style={{ width: '140px', height: '140px', border: '1px solid #ddd', marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    QR Code
                  </div>
                  <p><strong>Issue Code:</strong> {issue.id_text}</p>
                  <p><strong>Status:</strong> {issue.status_text}</p>
                  {issue.timeline && (
                    <>
                      <p style={{ color: 'red' }}>
                        <strong>Timeline:</strong> {formatDate(issue.timeline)}
                      </p>
                      <p>
                        <strong>Progress:</strong>
                        <span
                          className="priority-flag"
                          style={{
                            display: 'inline-block',
                            width: '12px',
                            height: '12px',
                            backgroundColor: '#000',
                            marginRight: '5px'
                          }}
                        ></span>
                        {/* TODO: Calculate progress flag */}
                      </p>
                    </>
                  )}
                  <p>
                    <strong>Priority:</strong>
                    <span style={{ color: issue.priority.color }}>
                      {issue.priority.title}
                    </span>
                  </p>
                  <p><strong>Sector:</strong> {issue.sector || 'N/A'}</p>
                  <p><strong>Source:</strong> {issue.source.title}</p>
                  <p>
                    <strong>Suggested Departments:</strong>
                    {issue.suggestedDepartments.length > 0
                      ? issue.suggestedDepartments.map(d => d.name).join(', ')
                      : 'None'}
                  </p>
                  <p><strong>Department:</strong> {issue.department.name}</p>
                  <p><strong>Created By:</strong> {issue.userCreatedBy.name}</p>
                  <p><strong>Created At:</strong> {formatDate(issue.created_at)}</p>
                </div>
                <hr style={{ width: '100%' }} />
                <div className="col-md-12">
                  <p><strong>Total Meetings on this Issue:</strong> {issue.meetings.length}</p>
                  {issue.meetings.length > 0 ? (
                    <ul>
                      {issue.meetings.map((met) => (
                        <li key={met.id}>{met.meeting.meeting_code_text}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>No meetings</p>
                  )}
                </div>
                <hr style={{ width: '100%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* PTF Histories Section */}
      <div className="row d-flex justify-content-center mt-70 mb-70">
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
                            <span className="badge badge-primary">{history.type_text}</span>
                          </h4>
                          <p>
                            {history.remarks}
                            {history.attachments && history.attachments.length > 0 && (
                              <>
                                <br />
                                {history.attachments.map((file, fileIndex) => (
                                  <a
                                    key={fileIndex}
                                    href={`/ptf_uploads/${file}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ marginRight: '10px' }}
                                  >
                                    <i className={getFileIconClass(file)}></i> {file}
                                  </a>
                                ))}
                              </>
                            )}
                          </p>
                          <span className="vertical-timeline-element-date">
                            {formatTimelineDate(history.created_at)}
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
                issue.responses.map((history) => (
                  <div key={history.id} className="vertical-timeline vertical-timeline--animate vertical-timeline--one-column">
                    <div className="vertical-timeline-item vertical-timeline-element">
                      <div>
                        <span className="vertical-timeline-element-icon bounce-in">
                          <i className="badge badge-dot badge-dot-xl badge-success"></i>
                        </span>
                        <div className="vertical-timeline-element-content bounce-in">
                          <h4 className="timeline-title">
                            {history.department.name} ({history.userCreatedBy.name})
                          </h4>
                          <p>
                            {history.remarks}
                            {history.attachments && history.attachments.length > 0 && (
                              <>
                                <br />
                                {history.attachments.map((file, fileIndex) => (
                                  <a
                                    key={fileIndex}
                                    href={`/ptf_uploads/${file}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ marginRight: '10px' }}
                                  >
                                    <i className={getFileIconClass(file)}></i> {file}
                                  </a>
                                ))}
                              </>
                            )}
                          </p>
                          <span className="vertical-timeline-element-date">
                            {formatTimelineDate(history.created_at)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p>No CM Office responses yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Back Button */}
      <div className="row">
        <div className="col-md-12">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate(-1)}
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}
