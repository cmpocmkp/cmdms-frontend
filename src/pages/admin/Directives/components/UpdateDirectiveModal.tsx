/**
 * Update Directive Modal Component
 * Replicates the inline edit modal from old CMDMS directives list page
 */

import { useState, useEffect } from 'react';

interface UpdateDirectiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  directive: any;
  onSubmit: (data: any) => void;
}

const mockDepartments = [
  { id: 1, name: 'Health Department' },
  { id: 2, name: 'Education Department' },
  { id: 3, name: 'Finance Department' },
  { id: 4, name: 'Infrastructure Department' },
  { id: 5, name: 'Agriculture Department' },
];

export function UpdateDirectiveModal({ isOpen, onClose, directive, onSubmit }: UpdateDirectiveModalProps) {
  const [formData, setFormData] = useState({
    subject: '',
    comments: '',
    other_department_ids: [] as number[],
    letter_no: '',
    date: '',
    timeline: '',
    is_archived: false,
  });

  useEffect(() => {
    if (directive) {
      setFormData({
        subject: directive.subject || '',
        comments: directive.progress || '',
        other_department_ids: directive.department_ids || [],
        letter_no: directive.letter_no || '',
        date: directive.directive_date || '',
        timeline: directive.timeline || '',
        is_archived: directive.is_archived || false,
      });
    }
  }, [directive]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  if (!isOpen || !directive) return null;

  return (
    <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex={-1}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content" style={{ backgroundColor: '#fff' }}>
          <div className="modal-header" style={{ padding: '15px 27px' }}>
            <h5 className="modal-title">Update directive</h5>
            <button type="button" className="close" onClick={onClose}>
              <span>&times;</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} id="directive-update-form">
            <input type="hidden" name="directive_id" value={directive.id} />
            
            <div className="modal-body" style={{ padding: '10px 26px' }}>
              {/* Subject */}
              <div className="row">
                <div className="col">
                  <div className="form-group">
                    <label htmlFor="subject">Subject</label>
                    <textarea
                      className="form-control"
                      id="subject"
                      name="subject"
                      rows={4}
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    />
                    <div className="invalid-feedback"></div>
                  </div>
                </div>
              </div>

              {/* Progress */}
              <div className="row">
                <div className="col">
                  <div className="form-group">
                    <label htmlFor="comments">Progress</label>
                    <textarea
                      className="form-control"
                      id="comments"
                      name="comments"
                      rows={4}
                      value={formData.comments}
                      onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                    />
                    <div className="invalid-feedback"></div>
                  </div>
                </div>
              </div>

              {/* Responsible departments, Letter Number */}
              <div className="row">
                <div className="col-md-8">
                  <div className="form-group">
                    <label htmlFor="other_department_ids">Responsible departments</label>
                    <select
                      id="other_department_ids"
                      name="other_department_ids[]"
                      className="js-example-basic-multiple w-100 form-control form-control-lg"
                      multiple
                      value={formData.other_department_ids.map(String)}
                      onChange={(e) => {
                        const selected = Array.from(e.target.selectedOptions, option => parseInt(option.value));
                        setFormData({ ...formData, other_department_ids: selected });
                      }}
                      style={{ minHeight: '150px' }}
                    >
                      {mockDepartments.map(dept => (
                        <option key={dept.id} value={dept.id}>{dept.name}</option>
                      ))}
                    </select>
                    <div className="invalid-feedback"></div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label htmlFor="letter_no">Letter Number</label>
                    <input
                      type="text"
                      name="letter_no"
                      id="letter_no"
                      className="form-control"
                      required
                      value={formData.letter_no}
                      onChange={(e) => setFormData({ ...formData, letter_no: e.target.value })}
                    />
                    <div className="invalid-feedback"></div>
                  </div>
                </div>
              </div>

              {/* Dates and Attachments */}
              <div className="row">
                <div className="col-md-4">
                  <div className="form-group">
                    <label htmlFor="date">Directive Date</label>
                    <input
                      type="date"
                      name="date"
                      id="date"
                      className="form-control"
                      required
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    />
                    <div className="invalid-feedback"></div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label htmlFor="timeline">Timeline</label>
                    <input
                      type="date"
                      name="timeline"
                      id="timeline"
                      className="form-control"
                      required
                      readOnly
                      value={formData.timeline}
                    />
                    <div className="invalid-feedback"></div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label htmlFor="attachments">Update Documents <small>(if any)</small></label>
                    <input type="file" name="attachments[]" id="attachments" className="file-upload-default" multiple />
                    <div className="input-group col-xs-12">
                      <input type="text" className="form-control file-upload-info" disabled placeholder="Upload files" />
                      <span className="input-group-append">
                        <button className="file-upload-browse btn btn-success" type="button">Select Files</button>
                      </span>
                    </div>
                    <div className="invalid-feedback"></div>
                  </div>
                  <div className="uploaded_file_div"></div>
                </div>
              </div>

              {/* Archive Checkbox */}
              <div className="row">
                <div className="col-md-4">
                  <div className="form-group">
                    <div className="mt-5 form-check form-check-flat form-check-primary">
                      <label htmlFor="is_archived" className="form-check-label">
                        <input
                          id="is_archived"
                          type="checkbox"
                          name="is_archived"
                          className="form-check-input"
                          checked={formData.is_archived}
                          onChange={(e) => setFormData({ ...formData, is_archived: e.target.checked })}
                        />
                        Mark as Archived
                        <i className="input-helper"></i>
                      </label>
                    </div>
                    <div className="invalid-feedback"></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <input
                type="submit"
                value="Save changes"
                className="btn btn-primary btn-icon-text"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
