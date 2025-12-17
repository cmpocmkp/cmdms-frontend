/**
 * Edit/View Minute - Admin Module
 * EXACT replica of admin/recordnotes/edit.blade.php from old CMDMS
 * Features: Meeting details display with tabs for "Update Meeting" and "All decisions"
 */

import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { mockMinutes, mockMinuteDecisions } from '../../../lib/mocks/data/minutes';
import { AddDecisionModal } from './components/AddDecisionModal';
import { UpdateDecisionModal } from './components/UpdateDecisionModal';
import { ProgressHistoryModal } from './components/ProgressHistoryModal';
import { ActivityLogModal } from './components/ActivityLogModal';
import { UpdateDepartmentsModal } from './components/UpdateDepartmentsModal';

export default function EditMinute() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [meeting, setMeeting] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'decisions' | 'update'>('decisions');
  const [decisions, setDecisions] = useState<any[]>([]);
  
  // Modal states
  const [showAddDecisionModal, setShowAddDecisionModal] = useState(false);
  const [showUpdateDecisionModal, setShowUpdateDecisionModal] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [showActivityLogModal, setShowActivityLogModal] = useState(false);
  const [showUpdateDepartmentsModal, setShowUpdateDepartmentsModal] = useState(false);
  const [selectedDecision, setSelectedDecision] = useState<any>(null);
  const [selectedProgressHistory, setSelectedProgressHistory] = useState('');

  useEffect(() => {
    // Load meeting data
    const foundMeeting = mockMinutes.find(m => m.id === parseInt(id || '0'));
    if (foundMeeting) {
      setMeeting(foundMeeting);
      // Load decisions for this meeting
      const meetingDecisions = mockMinuteDecisions.filter(d => d.minute_id === foundMeeting.id);
      setDecisions(meetingDecisions);
    } else {
      alert('Meeting not found');
      navigate('/admin/recordnotes');
    }
  }, [id, navigate]);

  if (!meeting) {
    return (
      <div className="content-wrapper">
        <div className="card">
          <div className="card-body text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="sr-only">Loading...</span>
            </div>
            <p className="mt-3">Loading meeting...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="content-wrapper">
      {/* Start Tabs */}
      <div className="row">
        <div className="col-12 grid-margin">
          <div className="card">
            <div className="card-header text-center">
              <div className="d-flex gap-3 justify-content-between align-items-center">
                <div className="flex-grow-1 text-center"></div>
                <div>
                  <div className="btn-toolbar pull-right">
                    <div className="btn-group">
                      <Link 
                        to="/admin/recordnotes" 
                        className="btn btn-outline-primary btn-fw" 
                        role="button"
                      >
                        <i className="ti-arrow-left mr-1"></i>Back
                      </Link>
                      <button
                        className="btn btn-outline-primary btn-fw"
                        onClick={() => alert('Add Decision modal will be implemented')}
                      >
                        <i className="ti-plus mr-1"></i>Add decision
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card-body">
              <div className="col-md-12 grid-margin stretch-card">
                <div className="card">
                  <div className="card-body">
                    {/* Meeting Details Table */}
                    <div className="table-responsive mt-3">
                      <table className="table table-bordered table-striped w-100">
                        <tbody>
                          <tr>
                            <th className="w-25">Meeting Subject</th>
                            <td>{meeting.subject}</td>
                          </tr>
                          {meeting.departments_names && meeting.departments_names.length > 0 && (
                            <tr>
                              <th>Department's</th>
                              <td>
                                <ul className="departments-inline">
                                  {meeting.departments_names.map((deptName: string, idx: number) => (
                                    <li key={idx}>{deptName}</li>
                                  ))}
                                </ul>
                              </td>
                            </tr>
                          )}
                          <tr>
                            <th>Meeting Date</th>
                            <td>{new Date(meeting.meeting_date).toLocaleDateString('en-GB')}</td>
                          </tr>
                          {meeting.attachments && meeting.attachments.length > 0 && (
                            <tr>
                              <th>Attachment</th>
                              <td>
                                <a 
                                  href="#" 
                                  className="text-primary font-weight-bold"
                                  title="Click to download the meeting minutes"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  Click to Download Meeting Minutes
                                </a>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Tabs */}
                  <div className="row">
                    <div className="col-md-12 mx-auto">
                      <ul className="nav nav-pills nav-pills-custom pl-4" id="pills-tab-custom" role="tablist">
                        <li className="nav-item" style={{ marginRight: '0.2rem' }}>
                          <button
                            className={`nav-link ${activeTab === 'update' ? 'active' : ''}`}
                            style={{ padding: '7px 20px' }}
                            onClick={() => setActiveTab('update')}
                            type="button"
                          >
                            Update Meeting
                          </button>
                        </li>
                        <li className="nav-item" style={{ marginRight: '0.2rem' }}>
                          <button
                            className={`nav-link ${activeTab === 'decisions' ? 'active' : ''}`}
                            style={{ padding: '7px 20px' }}
                            onClick={() => setActiveTab('decisions')}
                            type="button"
                          >
                            All decisions
                          </button>
                        </li>
                      </ul>

                      <div className="tab-content tab-content-custom-pill" id="pills-tabContent-custom">
                        {/* Update Meeting Tab */}
                        {activeTab === 'update' && (
                          <div className="tab-pane fade show active p-4" role="tabpanel">
                            <form 
                              onSubmit={(e) => {
                                e.preventDefault();
                                alert('Update functionality will be implemented with backend API');
                              }}
                              className="form-sample"
                            >
                              <div className="row">
                                <div className="col-md-12">
                                  <div className="form-group">
                                    <label htmlFor="record-note-subject">Subject</label>
                                    <textarea 
                                      className="form-control" 
                                      id="meetingsubject"
                                      name="subject"
                                      rows={4}
                                      required
                                      defaultValue={meeting.subject}
                                    />
                                  </div>
                                </div>
                              </div>

                              <div className="row">
                                <div className="col-md-4">
                                  <div className="form-group">
                                    <label>Meeting Date</label>
                                    <input 
                                      type="date"
                                      name="meeting_date"
                                      id="meeting_date"
                                      className="form-control"
                                      required
                                      defaultValue={meeting.meeting_date}
                                    />
                                  </div>
                                </div>

                                <div className="col-md-4">
                                  <div className="form-group">
                                    <label>Update Minutes</label>
                                    <input type="file" name="attachement" className="file-upload-default" />
                                    <div className="input-group col-xs-12">
                                      <input 
                                        type="text" 
                                        className="form-control file-upload-info" 
                                        disabled 
                                        placeholder="Upload Image"
                                      />
                                      <span className="input-group-append">
                                        <button className="file-upload-browse btn btn-success" type="button">
                                          Upload
                                        </button>
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                <div className="col-md-4">
                                  <div className="form-group">
                                    <label>Meeting Type</label>
                                    <select 
                                      className="js-example-basic-single w-100 form-control form-control-lg" 
                                      name="meeting_type"
                                      defaultValue={meeting.meeting_type_id || ''}
                                      required
                                    >
                                      <option value="1">Normal</option>
                                      <option value="2">Cabinet</option>
                                      <option value="3">Special</option>
                                    </select>
                                  </div>
                                </div>
                              </div>

                              <div className="row">
                                <div className="col-md-6">
                                  <div className="form-group">
                                    <label>Departments</label>
                                    <select 
                                      name="departments[]" 
                                      id="departments"
                                      className="js-example-basic-multiple w-100 form-control form-control-lg"
                                      multiple
                                      required
                                      style={{ minHeight: '150px' }}
                                      defaultValue={meeting.department_ids || []}
                                    >
                                      {meeting.departments_names && meeting.departments_names.map((name: string, idx: number) => (
                                        <option key={idx} value={idx} selected>
                                          {name}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                </div>

                                <div className="col-md-6">
                                  <div className="form-group">
                                    <label htmlFor="record-note-participants">Participants</label>
                                    <textarea 
                                      className="form-control"
                                      id="minutes_meetings_participants"
                                      name="participants"
                                      rows={4}
                                      defaultValue={meeting.participants || ''}
                                    />
                                  </div>
                                </div>
                              </div>

                              <button type="submit" className="btn btn-success btn-icon-text mr-2">
                                Update
                              </button>
                              <button 
                                type="button" 
                                className="btn btn-light"
                                onClick={() => window.history.back()}
                              >
                                Cancel
                              </button>
                            </form>
                          </div>
                        )}

                        {/* All Decisions Tab */}
                        {activeTab === 'decisions' && (
                          <div className="tab-pane fade show active p-4" role="tabpanel">
                            <style>{`
                              .table th, .jsgrid .jsgrid-table th, .table td, .jsgrid .jsgrid-table td {
                                vertical-align: unset !important;
                              }
                              table#minute-listing td {
                                text-align: left;
                                line-height: 18px;
                              }
                              table#minute-listing th, td {
                                border: 1px solid silver;
                                margin: 0px;
                              }
                            `}</style>
                            <h4 className="card-title mb-3">Meeting Decisions</h4>
                            {decisions.length > 0 ? (
                              <div className="table-responsive">
                                <table className="table table-bordered no-footer" id="minute-listing">
                                  <thead>
                                    <tr>
                                      <th style={{ width: '5px', verticalAlign: 'top', textAlign: 'center' }}>S.no</th>
                                      <th style={{ width: '50px', verticalAlign: 'top', textAlign: 'center' }}>Timestamp/<br/>Identifier</th>
                                      <th style={{ width: '180px', verticalAlign: 'top', textAlign: 'center' }}>Issues/Agenda Items/Decision title</th>
                                      <th style={{ width: '180px', verticalAlign: 'top', textAlign: 'center' }}>Decisions Made</th>
                                      <th style={{ width: '15px', verticalAlign: 'top', textAlign: 'center' }}>Responsibility</th>
                                      <th style={{ width: '100px', verticalAlign: 'top', textAlign: 'center' }}>Progress</th>
                                      <th style={{ width: '30px', verticalAlign: 'top', textAlign: 'center' }}>Status</th>
                                      <th style={{ width: '200px', verticalAlign: 'top', textAlign: 'center' }}>Timeline</th>
                                      <th style={{ width: '200px', verticalAlign: 'top', textAlign: 'center' }}>Action</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {decisions.map((decision, index) => (
                                      <tr key={decision.id} id={`decision${decision.id}`}>
                                        <td style={{ width: '5px', verticalAlign: 'top' }}>{index + 1}</td>
                                        <td style={{ width: '5px', verticalAlign: 'top' }}>
                                          Created at: <span className="text-muted">{new Date(decision.created_at).toLocaleDateString('en-GB')}</span><br/><br/>
                                          Created by: <span className="text-muted">{decision.creator_name || 'System'}</span><br/><br/>
                                          Updated at: <span className="text-muted">{new Date(decision.updated_at).toLocaleDateString('en-GB')}</span><br/><br/>
                                          Last Updated by: <span className="text-muted">{decision.editor_name || 'System'}</span>
                                        </td>
                                        <td style={{ width: '180px', verticalAlign: 'top' }}>
                                          <div style={{ width: '200px' }}>{decision.subject || '-'}</div>
                                        </td>
                                        <td style={{ width: '180px', verticalAlign: 'top' }}>
                                          <div style={{ width: '200px' }}>{decision.decision_text}</div>
                                        </td>
                                        <td style={{ width: '15px', verticalAlign: 'top' }}>
                                          <div className="text-primary">{meeting.department_name || ''}</div>
                                          <div style={{ width: '100%' }}>{decision.responsibility || '-'}</div>
                                        </td>
                                        <td style={{ width: '100px', verticalAlign: 'top' }}>
                                          <div style={{ width: '200px' }}>{decision.progress || decision.comments || '-'}</div>
                                          {decision.progress_detail && (
                                            <button 
                                              style={{ margin: 'unset', padding: 'unset' }}
                                              title="click to view progress so far details"
                                              className="btn btn-link btn-sm"
                                              onClick={() => {
                                                setSelectedProgressHistory(decision.progress_detail);
                                                setShowProgressModal(true);
                                              }}
                                            >
                                              more details
                                            </button>
                                          )}
                                        </td>
                                        <td style={{ width: '30px', verticalAlign: 'top' }}>
                                          {decision.responsible_departments && decision.responsible_departments.length > 0 ? (
                                            <table className="table table-bordered table-sm mb-0">
                                              <tbody>
                                                {decision.responsible_departments.map((dept: any, dIdx: number) => (
                                                  <tr key={dIdx}>
                                                    <td style={{ 
                                                      width: '60%', 
                                                      color: '#495057', 
                                                      backgroundColor: '#e9ecef',
                                                      borderColor: '#c9ccd7'
                                                    }}>
                                                      {dept.name}
                                                    </td>
                                                    <td style={{ width: '100px' }}>
                                                      <span className={`badge ${
                                                        dept.status === 'Completed' ? 'badge-success' :
                                                        dept.status === 'On Target' ? 'badge-warning' :
                                                        dept.status === 'Overdue' ? 'badge-danger' :
                                                        dept.status === 'Off Target' ? 'badge-info' :
                                                        'badge-secondary'
                                                      }`}>
                                                        {dept.status}
                                                      </span>
                                                    </td>
                                                  </tr>
                                                ))}
                                              </tbody>
                                            </table>
                                          ) : (
                                            <span className={`badge ${
                                              decision.status === 'Completed' ? 'badge-success' :
                                              decision.status === 'On Target' ? 'badge-warning' :
                                              decision.status === 'Overdue' ? 'badge-danger' :
                                              'badge-secondary'
                                            }`}>
                                              {decision.status}
                                            </span>
                                          )}
                                        </td>
                                        <td style={{ width: '200px', verticalAlign: 'top' }}>
                                          {decision.timeline ? new Date(decision.timeline).toLocaleDateString('en-GB') : '-'}
                                          <br/>
                                          {decision.delay_remaining && (
                                            <span className="text-muted small">{decision.delay_remaining}</span>
                                          )}
                                        </td>
                                        <td style={{ width: '200px', verticalAlign: 'top' }}>
                                          {/* Update Decision Button */}
                                          <button 
                                            className="btn btn-primary btn-fw btn-sm"
                                            title="update"
                                            onClick={() => {
                                              setSelectedDecision(decision);
                                              setShowUpdateDecisionModal(true);
                                            }}
                                          >
                                            <i className="ti-pencil-alt"></i>
                                          </button>

                                          {/* Responsible Department Button */}
                                          {decision.responsible_departments && decision.responsible_departments.length > 0 && (
                                            <>
                                              <br/><br/>
                                              <button 
                                                className="btn btn-success btn-sm"
                                                title="Responsible department"
                                                onClick={() => {
                                                  setSelectedDecision(decision);
                                                  setShowUpdateDepartmentsModal(true);
                                                }}
                                              >
                                                <i className="ti-link"></i>
                                              </button>
                                            </>
                                          )}

                                          {/* Delete Button */}
                                          <br/><br/>
                                          <button 
                                            className="btn btn-danger btn-fw btn-sm"
                                            onClick={() => {
                                              if (confirm('Are you sure you want to delete? It will delete all related data to this decision e.g. responsible departments, replies and letters.')) {
                                                console.log('Delete decision:', decision.id);
                                                alert('Delete functionality will be implemented with backend API');
                                              }
                                            }}
                                          >
                                            <i className="ti-trash icon-sm"></i>
                                          </button>

                                          {/* Progress So Far (Replies) Button */}
                                          <br/><br/>
                                          <button 
                                            className="btn btn-primary btn-sm mb-2"
                                            title="Progress so far"
                                            onClick={() => alert('Navigate to replies page (will be implemented)')}
                                          >
                                            <i className="ti-comments"></i>
                                          </button>

                                          {/* Activity Logs Button */}
                                          <br/>
                                          <button 
                                            className="btn btn-secondary btn-sm mb-2"
                                            title="Show decision logs"
                                            onClick={() => {
                                              setSelectedDecision(decision);
                                              setShowActivityLogModal(true);
                                            }}
                                          >
                                            <i className="ti-book"></i>
                                          </button>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            ) : (
                              <p className="text-muted">No decisions recorded for this meeting yet.</p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* End Tabs */}

      {/* All Modals */}
      <AddDecisionModal
        isOpen={showAddDecisionModal}
        onClose={() => setShowAddDecisionModal(false)}
        meetingId={meeting.id}
        onSubmit={(data) => {
          console.log('Add Decision:', data);
          alert('Decision added successfully! (Backend integration pending)');
        }}
      />

      <UpdateDecisionModal
        isOpen={showUpdateDecisionModal}
        onClose={() => {
          setShowUpdateDecisionModal(false);
          setSelectedDecision(null);
        }}
        decision={selectedDecision}
        onSubmit={(data) => {
          console.log('Update Decision:', data);
          alert('Decision updated successfully! (Backend integration pending)');
        }}
      />

      <ProgressHistoryModal
        isOpen={showProgressModal}
        onClose={() => {
          setShowProgressModal(false);
          setSelectedProgressHistory('');
        }}
        progressHistory={selectedProgressHistory}
      />

      <ActivityLogModal
        isOpen={showActivityLogModal}
        onClose={() => {
          setShowActivityLogModal(false);
          setSelectedDecision(null);
        }}
        decisionId={selectedDecision?.id || 0}
        logs={[
          {
            date: new Date().toISOString(),
            user: 'Admin User',
            action: 'created',
            changes: 'Decision created'
          },
          {
            date: new Date(Date.now() - 86400000).toISOString(),
            user: 'Department User',
            action: 'updated',
            changes: 'Status changed to On Target'
          }
        ]}
      />

      <UpdateDepartmentsModal
        isOpen={showUpdateDepartmentsModal}
        onClose={() => {
          setShowUpdateDepartmentsModal(false);
          setSelectedDecision(null);
        }}
        decision={selectedDecision}
        onSubmit={(data) => {
          console.log('Update Departments:', data);
          alert('Department statuses updated successfully! (Backend integration pending)');
        }}
      />
    </div>
  );
}
