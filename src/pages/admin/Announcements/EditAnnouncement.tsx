/**
 * Edit Announcement - Admin Module
 * EXACT replica of admin/announcements/edit.blade.php from old CMDMS
 */

import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { mockAnnouncements } from '../../../lib/mocks/data/announcements';
import { mockDepartments } from '../../../lib/mocks/data/departments';
import { AddAnnouncementDetailModal } from './components/AddAnnouncementDetailModal';
import { EditAnnouncementDetailModal } from './components/EditAnnouncementDetailModal';
import { ResponsibleDepartmentsModal } from './components/ResponsibleDepartmentsModal';

export default function EditAnnouncement() {
  const { id } = useParams<{ id: string }>();
  const announcement = mockAnnouncements.find(a => a.id === Number(id));
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDepartmentsModal, setShowDepartmentsModal] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState<any>(null);

  const [formData, setFormData] = useState({
    district_id: announcement?.district_id || '',
    venue: announcement?.venue || '',
    date: announcement?.date || new Date().toISOString().split('T')[0],
    attachments: [] as File[]
  });

  if (!announcement) {
    return (
      <div className="content-wrapper">
        <div className="alert alert-danger">Announcement not found</div>
      </div>
    );
  }

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Update announcement:', formData);
    alert('Update announcement functionality will be implemented with backend API');
  };

  const handleEditDetail = (detail: any) => {
    setSelectedDetail(detail);
    setShowEditModal(true);
  };

  const handleDeleteDetail = (detailId: number) => {
    if (confirm('Are you sure you want to delete? It will be permanently deleted.')) {
      console.log('Delete announcement detail:', detailId);
      alert('Delete functionality will be implemented with backend API');
    }
  };

  const handleViewDepartments = (detail: any) => {
    setSelectedDetail(detail);
    setShowDepartmentsModal(true);
  };

  // Mock announcement details
  const announcementDetails = [
    {
      id: 1,
      title: 'Announcement regarding infrastructure development',
      progress: 'Work in progress, 60% completed',
      other_departments: [
        { id: 1, name: 'Health Department', assigned_status: 'Completed', badge_class: 'badge-success' },
        { id: 2, name: 'Education Department', assigned_status: 'On Target', badge_class: 'badge-info' }
      ],
      timeline: '2025-01-15',
    },
    {
      id: 2,
      title: 'Public welfare scheme announcement',
      progress: 'Initial planning stage',
      other_departments: [
        { id: 3, name: 'Social Welfare', assigned_status: 'Overdue', badge_class: 'badge-danger' }
      ],
      timeline: '2025-02-01',
    }
  ];

  return (
    <div className="content-wrapper">
      {/* Start Tabs */}
      <div className="row">
        <div className="col-12 grid-margin">
          <div className="card">
            <div className="card-header">
              <div className="d-flex gap-3 justify-content-between align-items-center">
                <div className="flex-grow-1 text-center">
                  <p className="block display-4">Edit Announcement</p>
                </div>
                <div>
                  <div className="btn-toolbar pull-right">
                    <div className="btn-group">
                      <Link
                        to="/admin/announcements"
                        className="btn btn-outline-primary btn-fw"
                        style={{ float: 'right' }}
                      >
                        <i className="ti-arrow-left mr-1"></i>Back
                      </Link>
                      <button
                        className="btn btn-outline-primary btn-fw"
                        onClick={() => setShowAddModal(true)}
                      >
                        <i className="fa fa-plus mr-1"></i>
                        Add New Detail
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="card-body">
              {/* Announcement Details Table */}
              <div className="table-responsive mt-2">
                <table className="table table-bordered table-striped table-sm w-100 mb-3">
                  <tbody>
                    <tr>
                      <th className="w-25">District</th>
                      <td className="text-primary">{announcement.district_name}</td>
                    </tr>
                    <tr>
                      <th>Date</th>
                      <td className="text-primary">
                        {new Date(announcement.date).toLocaleDateString('en-GB')}
                      </td>
                    </tr>
                    {(announcement as any).attachments && (announcement as any).attachments.length > 0 && (
                      <tr>
                        <th>Attachments</th>
                        <td>
                          <div className="d-flex flex-wrap gap-2">
                            {(announcement as any).attachments.map((file: string, idx: number) => (
                              <a key={idx} href="#" className="btn btn-sm btn-outline-primary">
                                <i className="ti-file mr-1"></i>
                                {file}
                              </a>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Update Form */}
              <form
                name="main-announcement-detail-form"
                id={`announcement-form-${announcement.id}`}
                className="form-sample main-announcement-detail"
                onSubmit={handleUpdate}
                encType="multipart/form-data"
              >
                <input type="hidden" name="modified_by" value="1" />
                <input type="hidden" name="type" id="type" value="cm" />

                <div className="row">
                  {/* Districts */}
                  <div className="col-md-3">
                    <div className="form-group">
                      <label htmlFor="district_id">Districts</label>
                      <select
                        className="form-control"
                        name="district_id"
                        id="district_id"
                        value={formData.district_id}
                        onChange={(e) => setFormData({ ...formData, district_id: e.target.value })}
                        required
                      >
                        {mockDepartments.map((district: any) => (
                          <option key={district.id} value={district.id}>
                            {district.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Visit Date */}
                  <div className="col-md-3">
                    <div className="form-group">
                      <label htmlFor="date">Visit Date</label>
                      <input
                        type="date"
                        name="date"
                        id="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="form-control"
                        required
                      />
                    </div>
                  </div>

                  {/* Attach Documents */}
                  <div className="col-md-3">
                    <div className="form-group">
                      <label htmlFor="attachment">Attach Documents <small>(if any)</small></label>
                      <input
                        type="file"
                        name="attachment[]"
                        id="attachment"
                        className="file-upload-default"
                        multiple
                        onChange={(e) => {
                          if (e.target.files) {
                            setFormData({ ...formData, attachments: Array.from(e.target.files) });
                          }
                        }}
                      />
                      <div className="input-group">
                        <input
                          type="text"
                          className="form-control file-upload-info"
                          disabled
                          placeholder="Upload files"
                          value={formData.attachments.length > 0 ? `${formData.attachments.length} file(s) selected` : ''}
                        />
                        <span className="input-group-append">
                          <button className="file-upload-browse btn btn-success" type="button">
                            Select Files
                          </button>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Venue */}
                  <div className="col-md-4">
                    <div className="form-group">
                      <label htmlFor="venue">Venue</label>
                      <input
                        type="text"
                        name="venue"
                        id="venue"
                        value={formData.venue}
                        onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                        className="form-control"
                        required
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="col-md-4">
                    <div className="form-group form-group mt-3">
                      <button type="submit" className="btn btn-success btn-icon-text mt-3">
                        Update
                      </button>
                    </div>
                  </div>
                </div>
              </form>

              <hr />

              {/* Announcement Details Table */}
              <div className="row">
                <div className="col-12">
                  <div className="table-responsive">
                    <table className="table table-bordered table-condensed" role="grid">
                      <thead className="thead-light">
                        <tr>
                          <th>S.NO</th>
                          <th>Announcement</th>
                          <th>Progress</th>
                          <th>Responsibilities</th>
                          <th>Timeline</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {announcementDetails.length > 0 ? (
                          announcementDetails.map((detail, index) => (
                            <tr key={detail.id} id={`detail${detail.id}`}>
                              <td>{index + 1}</td>
                              <td className="text-wrapped">
                                <p dangerouslySetInnerHTML={{ __html: detail.title }}></p>
                              </td>
                              <td className="text-wrapped">
                                <p dangerouslySetInnerHTML={{ __html: detail.progress }}></p>
                              </td>
                              <td>
                                {/* Display departments and their statuses */}
                                <table className="table table-bordered table-sm mb-0">
                                  <tbody>
                                    {detail.other_departments && detail.other_departments.length > 0 ? (
                                      detail.other_departments.map((dept) => (
                                        <tr key={dept.id}>
                                          <td
                                            style={{
                                              width: '60%',
                                              color: '#495057',
                                              backgroundColor: '#e9ecef',
                                              borderColor: '#c9ccd7'
                                            }}
                                          >
                                            {dept.name}
                                          </td>
                                          <td style={{ width: '100px' }}>
                                            <span className={`badge ${dept.badge_class}`}>
                                              {dept.assigned_status}
                                            </span>
                                          </td>
                                        </tr>
                                      ))
                                    ) : (
                                      <tr>
                                        <td style={{ width: '60%', color: '#495057', backgroundColor: '#e9ecef' }}>
                                          N/A
                                        </td>
                                        <td style={{ width: '100px' }}>
                                          <span className="badge badge-secondary">N/A</span>
                                        </td>
                                      </tr>
                                    )}
                                  </tbody>
                                </table>
                              </td>
                              <td>{new Date(detail.timeline).toLocaleDateString('en-GB')}</td>
                              <td style={{ width: '15px', textAlign: 'center' }}>
                                <button
                                  className="btn btn-sm btn-primary mb-2"
                                  style={{ width: '43px' }}
                                  title="Edit Announcement detail"
                                  onClick={() => handleEditDetail(detail)}
                                >
                                  <i className="ti-pencil"></i>
                                </button>

                                <button
                                  className="btn btn-sm btn-danger mb-2"
                                  style={{ width: '43px' }}
                                  title="Delete Announcement detail"
                                  onClick={() => handleDeleteDetail(detail.id)}
                                >
                                  <i className="ti-trash"></i>
                                </button>

                                <Link
                                  to={`/admin/replies/announcements/${detail.id}`}
                                  className="btn btn-sm btn-info mb-2"
                                  style={{ width: '43px' }}
                                  role="button"
                                  aria-pressed="true"
                                  title="View Chat history"
                                >
                                  <i className="ti-comments"></i>
                                </Link>

                                {detail.other_departments && detail.other_departments.length > 0 && (
                                  <button
                                    className="btn btn-sm btn-success mb-2"
                                    style={{ width: '43px' }}
                                    role="button"
                                    aria-pressed="true"
                                    title="View Responsible Departments status"
                                    onClick={() => handleViewDepartments(detail)}
                                  >
                                    <i className="ti-link"></i>
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={10}>There is no data.</td>
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

      {/* Modals */}
      {showAddModal && (
        <AddAnnouncementDetailModal
          announcementId={Number(id)}
          onClose={() => setShowAddModal(false)}
          onSave={() => {
            setShowAddModal(false);
            alert('Add detail functionality will be implemented with backend API');
          }}
        />
      )}

      {showEditModal && selectedDetail && (
        <EditAnnouncementDetailModal
          detail={selectedDetail}
          onClose={() => {
            setShowEditModal(false);
            setSelectedDetail(null);
          }}
          onSave={() => {
            setShowEditModal(false);
            setSelectedDetail(null);
            alert('Update detail functionality will be implemented with backend API');
          }}
        />
      )}

      {showDepartmentsModal && selectedDetail && (
        <ResponsibleDepartmentsModal
          detailId={selectedDetail.id}
          departments={selectedDetail.other_departments || []}
          onClose={() => {
            setShowDepartmentsModal(false);
            setSelectedDetail(null);
          }}
          onSave={() => {
            setShowDepartmentsModal(false);
            setSelectedDetail(null);
            alert('Update department statuses functionality will be implemented with backend API');
          }}
        />
      )}
    </div>
  );
}
