/**
 * Edit Announcement Detail Modal
 * EXACT replica of annonucement-update-modal from old CMDMS
 */

import { useState, useEffect } from 'react';
import { mockDepartments } from '../../../../lib/mocks/data/departments';

interface EditAnnouncementDetailModalProps {
  detail: any;
  onClose: () => void;
  onSave: () => void;
}

export function EditAnnouncementDetailModal({ detail, onClose, onSave }: EditAnnouncementDetailModalProps) {
  const [formData, setFormData] = useState({
    title: detail.title || '',
    progress: detail.progress || '',
    other_department_ids: detail.other_departments?.map((d: any) => d.id) || [],
    timeline: detail.timeline || new Date().toISOString().split('T')[0],
    attachments: [] as File[]
  });

  useEffect(() => {
    setFormData({
      title: detail.title || '',
      progress: detail.progress || '',
      other_department_ids: detail.other_departments?.map((d: any) => d.id) || [],
      timeline: detail.timeline || new Date().toISOString().split('T')[0],
      attachments: []
    });
  }, [detail]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Update announcement detail:', { detailId: detail.id, ...formData });
    onSave();
  };

  return (
    <div className="modal fade show" id="annonucement-update-modal" tabIndex={-1} role="dialog" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg" role="document">
        <div className="modal-content" style={{ backgroundColor: '#fff' }}>
          <div className="modal-header" style={{ padding: '15px 27px' }}>
            <h5 className="modal-title">Update Announcement Detail</h5>
            <button type="button" className="close" onClick={onClose} aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>

          <form method="post" id="annonpuncement-detail-update-form" onSubmit={handleSubmit} encType="multipart/form-data">
            <input type="hidden" name="announcement_detail_id" value={detail.id} />
            <input type="hidden" name="update_user_id" value="1" />

            <div className="modal-body" style={{ padding: '10px 26px' }}>
              <div className="row">
                <div className="col">
                  <div className="form-group">
                    <label htmlFor="update_title">Title</label>
                    <input
                      type="text"
                      className="form-control"
                      id="update_title"
                      name="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                    <div className="invalid-feedback"></div>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-12">
                  <div className="form-group">
                    <label htmlFor="update_progress">Progress So far</label>
                    <textarea
                      className="form-control"
                      id="update_progress"
                      name="progress"
                      rows={4}
                      placeholder="Progress..."
                      value={formData.progress}
                      onChange={(e) => setFormData({ ...formData, progress: e.target.value })}
                    ></textarea>
                    <div className="invalid-feedback"></div>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-12">
                  <div className="form-group">
                    <label htmlFor="update_other_department_ids">Responsible departments</label>
                    <select
                      id="update_other_department_ids"
                      name="other_department_ids[]"
                      style={{ width: '100%', minHeight: '150px' }}
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
                <div className="col-md-4">
                  <div className="form-group">
                    <label htmlFor="update_timeline">Timeline</label>
                    <input
                      type="date"
                      name="timeline"
                      id="update_timeline"
                      value={formData.timeline}
                      onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                      className="form-control"
                      required
                    />
                    <div className="invalid-feedback"></div>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="form-group">
                    <label htmlFor="update_attachments">Upload Documents<small> (if any)</small></label>
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
                        id="update_attachments"
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
              <input type="submit" value="Update" name="minute_tab_submit" className="btn btn-primary btn-icon-text" />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
