/**
 * Edit/View Minute - Admin Module
 * EXACT replica of admin/recordnotes/edit.blade.php from old CMDMS
 * Integrated with real API following API_INTEGRATION_GUIDE.md
 * Features: Meeting details display with tabs for "Update Meeting" and "All decisions"
 */

import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import * as meetingService from '../../../lib/services/meetingService';
import * as minuteService from '../../../lib/services/minuteService';
import { USE_MOCK_DATA } from '../../../lib/api';
import { mockMinutes, mockMinuteDecisions } from '../../../lib/mocks/data/minutes';
import { AddDecisionModal } from './components/AddDecisionModal';
import { UpdateDecisionModal } from './components/UpdateDecisionModal';
import { ProgressHistoryModal } from './components/ProgressHistoryModal';
import { ActivityLogModal } from './components/ActivityLogModal';
import { UpdateDepartmentsModal } from './components/UpdateDepartmentsModal';

// Status mapping: API returns numbers, UI displays labels
const mapStatusToLabel = (status: number | undefined): string => {
  if (!status) return 'Pending';
  switch (status) {
    case 1: return 'Completed';
    case 2: return 'On Target';
    case 3: return 'Overdue';
    default: return 'Pending';
  }
};

const mapStatusLabelToNumber = (label: string): number | undefined => {
  switch (label) {
    case 'Completed': return 1;
    case 'On Target': return 2;
    case 'Overdue': return 3;
    default: return undefined;
  }
};

// Meeting types mapping: form IDs to API type strings
const meetingTypeMap: Record<string, string> = {
  '1': 'normal',
  '2': 'cabinet',
  '3': 'board',
  '4': 'sectorial'
};

// Reverse mapping: API type strings to form IDs
const meetingTypeReverseMap: Record<string, string> = {
  'normal': '1',
  'cabinet': '2',
  'board': '3',
  'sectorial': '4'
};

const meetingTypes = [
  { id: '1', name: 'Normal' },
  { id: '2', name: 'Cabinet' },
  { id: '3', name: 'Board' },
  { id: '4', name: 'Sectorial' }
];

export default function EditMinute() {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [meeting, setMeeting] = useState<meetingService.Meeting | null>(null);
  const [activeTab, setActiveTab] = useState<'decisions' | 'update'>('decisions');
  const [decisions, setDecisions] = useState<minuteService.Minute[]>([]);
  
  // Modal states
  const [showAddDecisionModal, setShowAddDecisionModal] = useState(false);
  const [showUpdateDecisionModal, setShowUpdateDecisionModal] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [showActivityLogModal, setShowActivityLogModal] = useState(false);
  const [showUpdateDepartmentsModal, setShowUpdateDepartmentsModal] = useState(false);
  const [selectedDecision, setSelectedDecision] = useState<minuteService.Minute | null>(null);
  const [selectedProgressHistory, setSelectedProgressHistory] = useState('');
  const [updating, setUpdating] = useState(false);
  
  // Update meeting form state
  const [updateTitle, setUpdateTitle] = useState('');
  const [updateDate, setUpdateDate] = useState('');
  const [updateType, setUpdateType] = useState<string>('2');
  const [updateVenue, setUpdateVenue] = useState('');

  // Fetch meeting and minutes
  useEffect(() => {
    if (id) {
      fetchMeeting();
      fetchMinutes();
    }
  }, [id]);

  const fetchMeeting = async () => {
    try {
      setLoading(true);
      setError(null);

      if (USE_MOCK_DATA) {
        const foundMeeting = mockMinutes.find(m => m.id === parseInt(id || '0'));
        if (foundMeeting) {
          const meetingData = {
            id: foundMeeting.id,
            title: foundMeeting.subject,
            date: foundMeeting.meeting_date,
            type: foundMeeting.meeting_type?.toLowerCase() || 'cabinet',
            venue: undefined,
          };
          setMeeting(meetingData);
          setUpdateTitle(foundMeeting.subject);
          setUpdateDate(foundMeeting.meeting_date);
          setUpdateType(meetingTypeReverseMap[meetingData.type] || '2');
          setUpdateVenue('');
        }
      } else {
        if (!id) {
          setError('Meeting ID is required');
          setLoading(false);
          return;
        }
        const response = await meetingService.getMeeting(parseInt(id));
        if (response.success && response.data) {
          setMeeting(response.data);
          setUpdateTitle(response.data.title || '');
          setUpdateDate(response.data.date || '');
          setUpdateType(response.data.type ? (meetingTypeReverseMap[response.data.type] || '2') : '2');
          setUpdateVenue(response.data.venue || '');
        } else {
          setError(response.message || 'Meeting not found');
        }
      }
    } catch (err: any) {
      console.error('Error fetching meeting:', err);
      setError(err.response?.data?.error?.message || 'Failed to load meeting');
    } finally {
      setLoading(false);
    }
  };

  const fetchMinutes = async () => {
    try {
      if (!id) return;

      if (USE_MOCK_DATA) {
        const meetingDecisions = mockMinuteDecisions.filter(d => d.minute_id === parseInt(id));
        setDecisions(meetingDecisions.map((d: any) => ({
          id: d.id,
          meetingId: parseInt(id),
          heading: d.heading || d.subject,
          issues: d.issues || d.subject,
          decisions: d.decision_text || d.decisions,
          responsibility: d.responsibility,
          timeline: d.timeline,
          status: typeof d.status === 'string' ? mapStatusLabelToNumber(d.status) : d.status,
          progressHistory: d.progress_detail || d.comments,
          departments: d.responsible_departments?.map((dept: any) => ({
            id: dept.id,
            name: dept.name,
          })) || [],
        })));
      } else {
        const response = await minuteService.listMinutesByMeeting(parseInt(id));
        if (response.success && response.data) {
          setDecisions(response.data);
        }
      }
    } catch (err: any) {
      console.error('Error fetching minutes:', err);
      // Don't set error for minutes, just log it
    }
  };

  const handleUpdateMeeting = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !meeting) return;

    try {
      setUpdating(true);
      setError(null);

      // Map form data to API format (only documented fields)
      const updateData: meetingService.UpdateMeetingRequest = {
        title: updateTitle || undefined,
        date: updateDate || undefined,
        type: updateType ? meetingTypeMap[updateType] : undefined,
        venue: updateVenue || undefined,
      };

      if (USE_MOCK_DATA) {
        // Mock update
        await new Promise(resolve => setTimeout(resolve, 500));
        alert('Meeting updated successfully! (Mock)');
        await fetchMeeting();
        setActiveTab('decisions');
      } else {
        // Real API call
        const response = await meetingService.updateMeeting(parseInt(id), updateData);

        if (response.success && response.data) {
          alert('Meeting updated successfully!');
          await fetchMeeting();
          setActiveTab('decisions');
        } else {
          setError(response.message || 'Failed to update meeting');
        }
      }
    } catch (err: any) {
      console.error('Error updating meeting:', err);
      setError(err.response?.data?.error?.message || 'Failed to update meeting. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteMinute = async (minuteId: number) => {
    if (!confirm('Are you sure you want to delete this minute/decision? It will delete all related data.')) {
      return;
    }

    try {
      setError(null);

      if (USE_MOCK_DATA) {
        // Mock delete
        await new Promise(resolve => setTimeout(resolve, 500));
        alert('Minute deleted successfully! (Mock)');
        await fetchMinutes();
      } else {
        // Real API call
        const response = await minuteService.deleteMinute(minuteId);

        if (response.success) {
          alert('Minute deleted successfully!');
          await fetchMinutes();
        } else {
          setError(response.message || 'Failed to delete minute');
          alert(response.message || 'Failed to delete minute');
        }
      }
    } catch (err: any) {
      console.error('Error deleting minute:', err);
      const errorMsg = err.response?.data?.error?.message || 'Failed to delete minute. Please try again.';
      setError(errorMsg);
      alert(errorMsg);
    }
  };

  const handleAddMinute = async (data: any) => {
    if (!meeting) return;

    try {
      setError(null);

      // Map modal form data to API format
      const apiData: minuteService.CreateMinuteRequest = {
        meetingId: meeting.id,
        heading: data.issues || undefined,
        issues: data.issues || undefined,
        decisions: data.decisions || undefined,
        responsibility: data.responsibility || undefined,
        timeline: data.timeline || undefined,
        status: data.status ? (typeof data.status === 'string' ? mapStatusLabelToNumber(data.status) : data.status) : undefined,
        departmentIds: Array.isArray(data.departments) && data.departments.length > 0 ? data.departments : undefined,
        progressHistory: data.comments || undefined,
      };

      if (USE_MOCK_DATA) {
        // Mock create
        await new Promise(resolve => setTimeout(resolve, 500));
        alert('Minute/Decision added successfully! (Mock)');
        setShowAddDecisionModal(false);
        await fetchMinutes();
      } else {
        // Real API call
        const response = await minuteService.createMinute(apiData);

        if (response.success && response.data) {
          alert('Minute/Decision added successfully!');
          setShowAddDecisionModal(false);
          await fetchMinutes();
        } else {
          setError(response.message || 'Failed to create minute/decision');
          alert(response.message || 'Failed to create minute/decision');
        }
      }
    } catch (err: any) {
      console.error('Error creating minute:', err);
      const errorMsg = err.response?.data?.error?.message || 'Failed to create minute/decision. Please try again.';
      setError(errorMsg);
      alert(errorMsg);
    }
  };

  const handleUpdateMinute = async (data: any) => {
    if (!selectedDecision) return;

    try {
      setError(null);

      // Map modal form data to API format
      const apiData: minuteService.UpdateMinuteRequest = {
        heading: data.issues || undefined,
        issues: data.issues || undefined,
        decisions: data.decisions || undefined,
        responsibility: data.responsibility || undefined,
        timeline: data.timeline || undefined,
        status: data.status ? (typeof data.status === 'string' ? mapStatusLabelToNumber(data.status) : data.status) : undefined,
        departmentIds: Array.isArray(data.departments) && data.departments.length > 0 ? data.departments : undefined,
        progressHistory: data.comments || undefined,
      };

      if (USE_MOCK_DATA) {
        // Mock update
        await new Promise(resolve => setTimeout(resolve, 500));
        alert('Minute/Decision updated successfully! (Mock)');
        setShowUpdateDecisionModal(false);
        setSelectedDecision(null);
        await fetchMinutes();
      } else {
        // Real API call
        const response = await minuteService.updateMinute(selectedDecision.id, apiData);

        if (response.success && response.data) {
          alert('Minute/Decision updated successfully!');
          setShowUpdateDecisionModal(false);
          setSelectedDecision(null);
          await fetchMinutes();
        } else {
          setError(response.message || 'Failed to update minute/decision');
          alert(response.message || 'Failed to update minute/decision');
        }
      }
    } catch (err: any) {
      console.error('Error updating minute:', err);
      const errorMsg = err.response?.data?.error?.message || 'Failed to update minute/decision. Please try again.';
      setError(errorMsg);
      alert(errorMsg);
    }
  };

  if (loading || !meeting) {
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

  if (error) {
    return (
      <div className="content-wrapper">
        <div className="card">
          <div className="card-body text-center py-5">
            <div className="alert alert-danger" role="alert">
              <i className="ti-alert-circle mr-2"></i>
              <strong>Error:</strong> {error}
              <button 
                className="btn btn-sm btn-outline-danger ml-3" 
                onClick={() => {
                  fetchMeeting();
                  fetchMinutes();
                }}
              >
                Retry
              </button>
            </div>
            <Link to="/admin/recordnotes" className="btn btn-secondary mt-3">
              <i className="ti-arrow-left mr-1"></i>Back to Meetings
            </Link>
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
                        onClick={() => setShowAddDecisionModal(true)}
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
                            <td>{meeting.title}</td>
                          </tr>
                          <tr>
                            <th>Meeting Date</th>
                            <td>{meeting.date ? new Date(meeting.date).toLocaleDateString('en-GB') : '-'}</td>
                          </tr>
                          {meeting.type && (
                            <tr>
                              <th>Meeting Type</th>
                              <td>{meeting.type.charAt(0).toUpperCase() + meeting.type.slice(1)}</td>
                            </tr>
                          )}
                          {meeting.venue && (
                            <tr>
                              <th>Venue</th>
                              <td>{meeting.venue}</td>
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
                              onSubmit={handleUpdateMeeting}
                              className="form-sample"
                            >
                              {/* Error Message */}
                              {error && (
                                <div className="alert alert-danger" role="alert">
                                  <i className="ti-alert-circle mr-2"></i>
                                  <strong>Error:</strong> {error}
                                </div>
                              )}

                              <div className="row">
                                <div className="col-md-12">
                                  <div className="form-group">
                                    <label htmlFor="record-note-subject">
                                      Subject (Title) <span className="text-danger">*</span>
                                    </label>
                                    <textarea 
                                      className="form-control" 
                                      id="meetingsubject"
                                      name="title"
                                      rows={4}
                                      required
                                      value={updateTitle}
                                      onChange={(e) => setUpdateTitle(e.target.value)}
                                    />
                                  </div>
                                </div>
                              </div>

                              <div className="row">
                                <div className="col-md-4">
                                  <div className="form-group">
                                    <label>
                                      Meeting Date <span className="text-danger">*</span>
                                    </label>
                                    <input 
                                      type="date"
                                      name="date"
                                      id="meeting_date"
                                      className="form-control"
                                      required
                                      value={updateDate}
                                      onChange={(e) => setUpdateDate(e.target.value)}
                                    />
                                  </div>
                                </div>

                                <div className="col-md-4">
                                  <div className="form-group">
                                    <label>Venue</label>
                                    <input
                                      type="text"
                                      name="venue"
                                      id="meeting_venue"
                                      className="form-control"
                                      value={updateVenue}
                                      onChange={(e) => setUpdateVenue(e.target.value)}
                                      placeholder="Enter venue"
                                    />
                                  </div>
                                </div>

                                <div className="col-md-4">
                                  <div className="form-group">
                                    <label>Meeting Type</label>
                                    <select 
                                      className="js-example-basic-single w-100 form-control form-control-lg" 
                                      name="type"
                                      value={updateType}
                                      onChange={(e) => setUpdateType(e.target.value)}
                                    >
                                      {meetingTypes.map(typeOption => (
                                        <option key={typeOption.id} value={typeOption.id}>{typeOption.name}</option>
                                      ))}
                                    </select>
                                  </div>
                                </div>
                              </div>

                              {/* UI-Only Fields Note */}
                              <div className="row">
                                <div className="col-md-12">
                                  <hr />
                                  <small className="text-muted">
                                    <strong>Note:</strong> The following fields are UI-only and not sent to the API (not documented in API_INTEGRATION_GUIDE.md): departments, participants, attachments
                                  </small>
                                </div>
                              </div>

                              <button 
                                type="submit" 
                                className="btn btn-success btn-icon-text mr-2"
                                disabled={updating}
                              >
                                {updating ? (
                                  <>
                                    <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                                    Updating...
                                  </>
                                ) : (
                                  'Update'
                                )}
                              </button>
                              <button 
                                type="button" 
                                className="btn btn-light"
                                onClick={() => setActiveTab('decisions')}
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
                                    {decisions.map((decision, index) => {
                                      const statusLabel = mapStatusToLabel(decision.status);
                                      const statusClass = decision.status === 1 ? 'badge-success' :
                                                         decision.status === 2 ? 'badge-warning' :
                                                         decision.status === 3 ? 'badge-danger' :
                                                         'badge-secondary';
                                      return (
                                        <tr key={decision.id} id={`decision${decision.id}`}>
                                          <td style={{ width: '5px', verticalAlign: 'top' }}>{index + 1}</td>
                                          <td style={{ width: '5px', verticalAlign: 'top' }}>
                                            {decision.createdAt && (
                                              <>
                                                Created at: <span className="text-muted">{new Date(decision.createdAt).toLocaleDateString('en-GB')}</span><br/><br/>
                                              </>
                                            )}
                                            {decision.updatedAt && (
                                              <>
                                                Updated at: <span className="text-muted">{new Date(decision.updatedAt).toLocaleDateString('en-GB')}</span>
                                              </>
                                            )}
                                          </td>
                                          <td style={{ width: '180px', verticalAlign: 'top' }}>
                                            <div style={{ width: '200px' }}>{decision.heading || decision.issues || '-'}</div>
                                          </td>
                                          <td style={{ width: '180px', verticalAlign: 'top' }}>
                                            <div style={{ width: '200px' }}>{decision.decisions || '-'}</div>
                                          </td>
                                          <td style={{ width: '15px', verticalAlign: 'top' }}>
                                            <div style={{ width: '100%' }}>{decision.responsibility || '-'}</div>
                                          </td>
                                          <td style={{ width: '100px', verticalAlign: 'top' }}>
                                            <div style={{ width: '200px' }}>{decision.progressHistory || '-'}</div>
                                            {decision.progressHistory && (
                                              <button 
                                                style={{ margin: 'unset', padding: 'unset' }}
                                                title="click to view progress so far details"
                                                className="btn btn-link btn-sm"
                                                onClick={() => {
                                                  setSelectedProgressHistory(decision.progressHistory || '');
                                                  setShowProgressModal(true);
                                                }}
                                              >
                                                more details
                                              </button>
                                            )}
                                          </td>
                                          <td style={{ width: '30px', verticalAlign: 'top' }}>
                                            {decision.departments && decision.departments.length > 0 ? (
                                              <table className="table table-bordered table-sm mb-0">
                                                <tbody>
                                                  {decision.departments.map((dept, dIdx: number) => (
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
                                                        <span className={statusClass}>
                                                          {statusLabel}
                                                        </span>
                                                      </td>
                                                    </tr>
                                                  ))}
                                                </tbody>
                                              </table>
                                            ) : (
                                              <span className={statusClass}>
                                                {statusLabel}
                                              </span>
                                            )}
                                          </td>
                                          <td style={{ width: '200px', verticalAlign: 'top' }}>
                                            {decision.timeline ? new Date(decision.timeline).toLocaleDateString('en-GB') : '-'}
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
                                          {decision.departments && decision.departments.length > 0 && (
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
                                            onClick={() => handleDeleteMinute(decision.id)}
                                          >
                                            <i className="ti-trash icon-sm"></i>
                                          </button>

                                          {/* Progress So Far (Replies) Button */}
                                          <br/><br/>
                                          <Link
                                            to={`/admin/replies/minutes/${decision.id}`}
                                            className="btn btn-primary btn-sm mb-2"
                                            title="Progress so far"
                                          >
                                            <i className="ti-comments"></i>
                                          </Link>

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
                                      );
                                    })}
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
        onSubmit={handleAddMinute}
      />

      <UpdateDecisionModal
        isOpen={showUpdateDecisionModal}
        onClose={() => {
          setShowUpdateDecisionModal(false);
          setSelectedDecision(null);
        }}
        decision={selectedDecision}
        onSubmit={handleUpdateMinute}
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
