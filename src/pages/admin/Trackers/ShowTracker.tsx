/**
 * Show Tracker Detail - Admin Module
 * EXACT replica of admin/interventions/show_new.blade.php from old CMDMS
 */

import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { mockTrackers } from '../../../lib/mocks/data/trackers';
import { formatDistanceToNow } from 'date-fns';
import { TrackerModal } from '../../../components/trackers/TrackerModal';

export default function ShowTracker() {
  const { id } = useParams<{ id: string }>();
  const tracker = mockTrackers.find(t => t.id === Number(id));

  // Modal states
  const [showEditTracker, setShowEditTracker] = useState(false);
  const [showAddActivity, setShowAddActivity] = useState(false);
  const [showEditActivity, setShowEditActivity] = useState(false);
  const [editingActivityId, setEditingActivityId] = useState<number | null>(null);
  const [showEditDepartments, setShowEditDepartments] = useState(false);
  const [editingDepartmentsActivityId, setEditingDepartmentsActivityId] = useState<number | null>(null);

  if (!tracker) {
    return (
      <div className="content-wrapper">
        <div className="alert alert-danger">Tracker not found</div>
      </div>
    );
  }

  const getStatusBadgeClass = (status?: string) => {
    switch (status) {
      case '1':
        return 'badge-success'; // Completed
      case '2':
        return 'badge-info'; // On Target
      case '3':
        return 'badge-danger'; // Overdue
      case '4':
        return 'badge-warning'; // Off Target
      default:
        return 'badge-secondary';
    }
  };

  const getStatusLabel = (status?: string) => {
    switch (status) {
      case '1':
        return 'Completed';
      case '2':
        return 'On Target';
      case '3':
        return 'Overdue';
      case '4':
        return 'Off Target';
      default:
        return 'Not set';
    }
  };

  const handleAddActivity = () => {
    setShowAddActivity(true);
  };

  const handleEditActivity = (activityId: number) => {
    setEditingActivityId(activityId);
    setShowEditActivity(true);
  };

  const handleEditDepartments = (activityId: number) => {
    setEditingDepartmentsActivityId(activityId);
    setShowEditDepartments(true);
  };

  const handleDeleteActivity = (activityId: number) => {
    if (confirm('Are you sure you want to delete this activity?')) {
      console.log('Delete activity:', activityId);
      alert('Activity will be deleted via API');
    }
  };

  const handleSaveActivity = () => {
    console.log('Save activity');
    alert('Activity will be saved via API');
    setShowAddActivity(false);
    setShowEditActivity(false);
    setEditingActivityId(null);
  };

  const handleSaveDepartments = () => {
    console.log('Save departments for activity:', editingDepartmentsActivityId);
    alert('Department statuses will be updated via API');
    setShowEditDepartments(false);
    setEditingDepartmentsActivityId(null);
  };

  const handleEditTracker = () => {
    setShowEditTracker(true);
  };

  const handleSaveTracker = (trackerData: { title: string; description: string; attachments: File[] }) => {
    console.log('Update tracker:', tracker.id, trackerData);
    alert('Tracker will be updated via API');
    setShowEditTracker(false);
  };

  return (
    <div className="content-wrapper">
      <style>
        {`
          table .btn {
            padding: 0.3rem !important;
            vertical-align: top;
          }

          table .btn i {
            margin-top: .4rem;
            margin-right: 0 !important;
          }
        `}
      </style>

      <div className="card">
        <div className="card-header text-center">
          <div className="d-flex gap-3 justify-content-between align-items-center">
            <div className="flex-grow-1 text-center">
              <p className="block display-4">Trackers</p>
            </div>
            <div>
              <div className="btn-toolbar pull-right">
                <div className="btn-group">
                  <Link 
                    to="/admin/trackers" 
                    className="btn btn-outline-primary btn-fw"
                  >
                    <i className="ti-arrow-left mr-1"></i> Back to Trackers
                  </Link>
                  <button
                    className="btn btn-outline-primary btn-fw"
                    onClick={handleEditTracker}
                  >
                    <i className="ti-pencil-alt mr-1"></i> Edit Tracker
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="card-body">
          {/* Tracker Details Table */}
          <div className="table-responsive">
            <table className="table table-striped table-bordered">
              <tbody>
                {tracker.title && (
                  <tr>
                    <th style={{ width: '20%' }}>Title</th>
                    <td>{tracker.title}</td>
                  </tr>
                )}

                {tracker.description && (
                  <tr>
                    <th>Description</th>
                    <td dangerouslySetInnerHTML={{ __html: tracker.description }} />
                  </tr>
                )}

                {tracker.attachments && tracker.attachments.length > 0 && (
                  <tr>
                    <th>Attachments</th>
                    <td>
                      <ul className="list-unstyled mb-0">
                        {tracker.attachments.map((attachment, index) => (
                          <li key={index} className="mb-1">
                            <a
                              href="#"
                              className="text-primary"
                              title={attachment}
                              onClick={(e) => {
                                e.preventDefault();
                                console.log('Download attachment:', attachment);
                              }}
                            >
                              <i className="ti-paperclip mr-1"></i>
                              {attachment}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Creator Info Bar */}
          <div className="row border-top pt-3 mt-3">
            <div className="col">
              <ul className="nav profile-navbar d-flex justify-content-end">
                <li className="nav-item">
                  <a className="nav-link" href="#">
                    <i className="fa fa-clock text-primary"></i>
                    <span className="text-secondary inline-block mt-2">
                      Updated {formatDistanceToNow(new Date(tracker.updated_at), { addSuffix: true })}
                    </span>
                  </a>
                </li>
                {tracker.creator?.name && (
                  <li className="nav-item">
                    <a className="nav-link" href="#">
                      <i className="fa fa-user-circle" style={{ color: '#248afd' }}></i>
                      {tracker.creator.name}
                    </a>
                  </li>
                )}
              </ul>
            </div>
          </div>

          {/* Activities Section */}
          <div className="mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5>Activities ({tracker.activities?.length || 0})</h5>
              <button 
                className="btn btn-primary btn-sm" 
                onClick={handleAddActivity}
              >
                <i className="ti-plus mr-1"></i> Add Activity
              </button>
            </div>

            <div className="table-responsive">
              <table className="table table-bordered" id="activitiesTable">
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Title</th>
                    <th>Remarks</th>
                    <th>Way Forward</th>
                    <th>Timeline</th>
                    <th>Responsibility</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tracker.activities && tracker.activities.length > 0 ? (
                    tracker.activities.map((activity, index) => (
                      <tr key={activity.id} id={`row${activity.id}`}>
                        <td>{index + 1}</td>
                        <td className="text">
                          <strong>{activity.title}</strong>
                        </td>
                        <td className="text">
                          {activity.remarks ? (
                            <div 
                              dangerouslySetInnerHTML={{ __html: activity.remarks.substring(0, 100) + (activity.remarks.length > 100 ? '...' : '') }}
                            />
                          ) : (
                            <span className="text-muted">No remarks</span>
                          )}
                        </td>
                        <td className="text">
                          {activity.way_forward ? (
                            <div 
                              dangerouslySetInnerHTML={{ __html: activity.way_forward.substring(0, 100) + (activity.way_forward.length > 100 ? '...' : '') }}
                            />
                          ) : (
                            <span className="text-muted">Not set</span>
                          )}
                        </td>
                        <td>
                          {activity.timeline 
                            ? new Date(activity.timeline).toLocaleDateString('en-GB', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric'
                              })
                            : 'Not set'}
                        </td>
                        <td style={{ minWidth: '150px' }}>
                          {activity.departments && activity.departments.length > 0 ? (
                            <div className="table-responsive">
                              <table className="table table-sm table-bordered mb-0">
                                <thead>
                                  <tr>
                                    <th style={{ fontSize: '11px', padding: '2px 4px' }}>Department</th>
                                    <th style={{ fontSize: '11px', padding: '2px 4px' }}>Status</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {activity.departments.map((dept) => (
                                    <tr key={dept.id}>
                                      <td style={{ fontSize: '11px', padding: '2px 4px' }}>
                                        {dept.name.replace(/<[^>]*>/g, '')}
                                      </td>
                                      <td style={{ fontSize: '11px', padding: '2px 4px' }}>
                                        <span className={`badge badge-xs ${getStatusBadgeClass(dept.pivot.status)}`}>
                                          {getStatusLabel(dept.pivot.status)}
                                        </span>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          ) : (
                            <span className="text-muted">Not assigned</span>
                          )}
                        </td>
                        <td style={{ width: '15px', textAlign: 'center' }}>
                          <button
                            className="btn btn-sm btn-primary edit-activity mb-2 d-flex align-items-center justify-content-center"
                            title="Edit Activity"
                            onClick={() => handleEditActivity(activity.id)}
                            style={{ width: '35px', height: '35px', padding: 0, margin: '0 auto' }}
                          >
                            <i className="ti-pencil-alt" style={{ margin: 'unset !important', padding: 'unset !important' }}></i>
                          </button>

                          <button
                            className="btn btn-sm btn-success edit-departments mb-2 d-flex align-items-center justify-content-center"
                            title="Edit Departments"
                            onClick={() => handleEditDepartments(activity.id)}
                            style={{ width: '35px', height: '35px', padding: 0, margin: '0 auto' }}
                          >
                            <i className="ti-link" style={{ margin: 'unset !important', padding: 'unset !important' }}></i>
                          </button>

                          <button
                            type="button"
                            className="btn btn-danger btn-sm d-flex align-items-center justify-content-center"
                            title="Delete Activity"
                            onClick={() => handleDeleteActivity(activity.id)}
                            style={{ width: '35px', height: '35px', padding: 0, margin: '0 auto' }}
                          >
                            <i className="ti-trash" style={{ margin: 'unset!important', padding: 'unset!important' }}></i>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="text-center text-muted py-4">
                        No activities found. <a href="#" onClick={(e) => { e.preventDefault(); handleAddActivity(); }}>Add the first activity</a>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Add Activity Modal - Placeholder */}
      {showAddActivity && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex={-1}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add New Activity</h5>
                <button type="button" className="close" onClick={() => setShowAddActivity(false)}>
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <p>Add Activity form will be implemented here</p>
                <button className="btn btn-primary" onClick={handleSaveActivity}>Save (Placeholder)</button>
                <button className="btn btn-secondary ml-2" onClick={() => setShowAddActivity(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Activity Modal - Placeholder */}
      {showEditActivity && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex={-1}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Activity</h5>
                <button type="button" className="close" onClick={() => { setShowEditActivity(false); setEditingActivityId(null); }}>
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <p>Edit Activity form for Activity ID: {editingActivityId}</p>
                <button className="btn btn-primary" onClick={handleSaveActivity}>Update (Placeholder)</button>
                <button className="btn btn-secondary ml-2" onClick={() => { setShowEditActivity(false); setEditingActivityId(null); }}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Departments Modal - Placeholder */}
      {showEditDepartments && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex={-1}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Manage Department Status</h5>
                <button type="button" className="close" onClick={() => { setShowEditDepartments(false); setEditingDepartmentsActivityId(null); }}>
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <p>Edit Departments form for Activity ID: {editingDepartmentsActivityId}</p>
                <button className="btn btn-primary" onClick={handleSaveDepartments}>Update Status (Placeholder)</button>
                <button className="btn btn-secondary ml-2" onClick={() => { setShowEditDepartments(false); setEditingDepartmentsActivityId(null); }}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Tracker Modal */}
      <TrackerModal
        open={showEditTracker}
        onOpenChange={setShowEditTracker}
        tracker={tracker}
        onSave={handleSaveTracker}
      />

      {/* Modal Backdrop for Activity Modals */}
      {(showAddActivity || showEditActivity || showEditDepartments) && (
        <div className="modal-backdrop fade show" onClick={() => {
          setShowAddActivity(false);
          setShowEditActivity(false);
          setEditingActivityId(null);
          setShowEditDepartments(false);
          setEditingDepartmentsActivityId(null);
        }}></div>
      )}
    </div>
  );
}
