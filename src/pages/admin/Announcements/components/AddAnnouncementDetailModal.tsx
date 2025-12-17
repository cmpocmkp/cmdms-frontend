/**
 * Add Announcement Detail Modal
 * EXACT replica of annonucement-add-modal from old CMDMS
 */

import { useState } from 'react';
import { mockDepartments } from '../../../../lib/mocks/data/departments';

interface AddAnnouncementDetailModalProps {
  announcementId: number;
  onClose: () => void;
  onSave: () => void;
}

export function AddAnnouncementDetailModal({ announcementId, onClose, onSave }: AddAnnouncementDetailModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    progress: '',
    other_department_ids: [] as number[],
    timeline: new Date().toISOString().split('T')[0],
    attachments: [] as File[]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Add announcement detail:', { announcementId, ...formData });
    onSave();
  };

  return (
    <div className="modal fade show" id="annonucement-add-modal" tabIndex={-1} role="dialog" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg" role="document">
        <div className="modal-content" style={{ backgroundColor: '#fff' }}>
          <div className="modal-header" style={{ padding: '15px 27px' }}>
            <h5 className="modal-title">Add Announcement Detail</h5>
            <button type="button" className="close" onClick={onClose} aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          
          <form method="post" id="announcemnet-detail-add-form" onSubmit={handleSubmit} encType="multipart/form-data">
            <input type="hidden" name="announcement_id" value={announcementId} />
            <input type="hidden" name="user_id" value="1" />

            <div className="modal-body" style={{ padding: '10px 26px' }}>
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input
                      type="text"
                      className="form-control"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                    <div className="invalid-feedback"></div>
                  </div>
                </div>

                <div className="col-md-12">
                  <label htmlFor="other_department_ids">Responsible departments</label>
                  <div className="form-group">
                    <select
                      id="other_department_ids"
                      name="other_department_ids[]"
                      style={{ width: '100%' }}
                      className="js-example-basic-multiple w-100 form-control form-control-lg"
                      multiple
                      value={formData.other_department_ids.map(String)}
                      onChange={(e) => {
                        const selectedOptions = Array.from(e.target.selectedOptions, option => Number(option.value));
                        setFormData({ ...formData, other_department_ids: selectedOptions });
                      }}
                    >
                      {mockDepartments.map(department => (
                        <option key={department.id} value={department.id}>
                          {department.name}
                        </option>
                      ))}
                    </select>
                    <div className="invalid-feedback"></div>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-12">
                  <div className="form-group">
                    <label htmlFor="progress">Progress So far</label>
                    <textarea
                      className="form-control"
                      id="progress"
                      name="progress"
                      rows={4}
                      placeholder="Progress"
                      value={formData.progress}
                      onChange={(e) => setFormData({ ...formData, progress: e.target.value })}
                    ></textarea>
                    <div className="invalid-feedback"></div>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-3">
                  <div className="form-group">
                    <label htmlFor="timeline">Timeline</label>
                    <input
                      type="date"
                      name="timeline"
                      id="timeline"
                      className="form-control"
                      value={formData.timeline}
                      onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                      required
                    />
                    <div className="invalid-feedback"></div>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="form-group">
                    <label htmlFor="attachments">Upload Documents<small> (if any)</small></label>
                    <input
                      type="file"
                      name="attachments[]"
                      className="file-upload-default"
                      multiple
                      onChange={(e) => {
                        if (e.target.files) {
                          setFormData({ ...formData, attachments: Array.from(e.target.files) });
                        }
                      }}
                    />
                    <div className="input-group col-xs-12">
                      <input
                        type="text"
                        className="form-control file-upload-info"
                        disabled
                        placeholder="Upload files"
                        id="attachments"
                        value={formData.attachments.length > 0 ? `${formData.attachments.length} file(s) selected` : ''}
                      />
                      <span className="input-group-append">
                        <button className="file-upload-browse btn btn-success" type="button">
                          Select Files
                        </button>
                      </span>
                      <div className="invalid-feedback"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <input type="submit" value="Add" name="minute_tab_submit" className="btn btn-primary btn-icon-text" />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
