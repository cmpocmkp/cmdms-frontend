/**
 * Update Decision Modal Component
 * Replicates the Update Decision modal from old CMDMS
 */

import { useState, useEffect } from 'react';

interface UpdateDecisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  decision: any;
  onSubmit: (data: any) => void;
}

const mockDepartments = [
  { id: 1, name: 'Health Department' },
  { id: 2, name: 'Education Department' },
  { id: 3, name: 'Finance Department' },
  { id: 4, name: 'Infrastructure Department' },
  { id: 5, name: 'Agriculture Department' },
];

const mockTags = [
  { id: 1, name: 'Urgent' },
  { id: 2, name: 'High Priority' },
  { id: 3, name: 'Regular' },
];

export function UpdateDecisionModal({ isOpen, onClose, decision, onSubmit }: UpdateDecisionModalProps) {
  const [formData, setFormData] = useState({
    issues: '',
    decisions: '',
    departments: [] as number[],
    responsibility: '',
    comments: '',
    status: '',
    timeline: '',
    sort_order: '',
    is_archived: false,
    tags: [] as number[],
  });

  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    if (decision) {
      setFormData({
        issues: decision.subject || '',
        decisions: decision.decision_text || '',
        departments: decision.departments || [],
        responsibility: decision.responsibility || '',
        comments: decision.comments || '',
        status: decision.status || '',
        timeline: decision.timeline || '',
        sort_order: decision.sort_order || '',
        is_archived: decision.is_archived || false,
        tags: decision.tags || [],
      });
    }
  }, [decision]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  const handleSelectAll = () => {
    if (!selectAll) {
      setFormData({ ...formData, departments: mockDepartments.map(d => d.id) });
    } else {
      setFormData({ ...formData, departments: [] });
    }
    setSelectAll(!selectAll);
  };

  if (!isOpen || !decision) return null;

  return (
    <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex={-1}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content" style={{ backgroundColor: '#fff' }}>
          <div className="modal-header" style={{ padding: '15px 27px' }}>
            <h5 className="modal-title">Update decision</h5>
            <button type="button" className="close" onClick={onClose}>
              <span>&times;</span>
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body" style={{ padding: '10px 26px' }}>
              {/* Success Message */}
              <div className="row">
                <div className="col-md-12">
                  <div className="minute_update_message" style={{ display: 'none' }}>
                    <label className="badge badge-success">Decision updated successfully.</label>
                  </div>
                </div>
              </div>

              {/* Issues and Decisions */}
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label htmlFor="minute-issues">Issues/Agenda Items/Decision title</label>
                    <textarea
                      className="form-control"
                      id="updateissues"
                      name="issues"
                      rows={4}
                      value={formData.issues}
                      onChange={(e) => setFormData({ ...formData, issues: e.target.value })}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label htmlFor="minute-decisions">Decision Detail</label>
                    <textarea
                      className="form-control"
                      id="updatedecisions"
                      name="decisions"
                      rows={4}
                      required
                      value={formData.decisions}
                      onChange={(e) => setFormData({ ...formData, decisions: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Responsible Departments */}
              <div className="row">
                <div className="col-md-12">
                  <label>Responsible Department's (involved in decision)</label>
                  <div style={{ width: '85px' }} className="form-check form-check-flat form-check-primary">
                    <label className="form-check-label">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={selectAll}
                        onChange={handleSelectAll}
                      />
                      Select all
                      <i className="input-helper"></i>
                    </label>
                  </div>
                  <div className="form-group">
                    <select
                      name="departments[]"
                      style={{ width: '100%', height: '300px' }}
                      className="js-example-basic-multiple w-100 form-control form-control-lg"
                      required
                      multiple
                      value={formData.departments.map(String)}
                      onChange={(e) => {
                        const selected = Array.from(e.target.selectedOptions, option => parseInt(option.value));
                        setFormData({ ...formData, departments: selected });
                      }}
                    >
                      {mockDepartments.map(dept => (
                        <option key={dept.id} value={dept.id}>{dept.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Responsibility and Progress */}
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label htmlFor="minute-responsibility">Responsibility</label>
                    <textarea
                      className="form-control"
                      id="updateresponsibility"
                      name="responsibility"
                      rows={4}
                      required
                      value={formData.responsibility}
                      onChange={(e) => setFormData({ ...formData, responsibility: e.target.value })}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label htmlFor="minute-comments">Progress So far (Summary)</label>
                    <textarea
                      className="form-control"
                      id="updatedcomments"
                      name="comments"
                      rows={4}
                      value={formData.comments}
                      onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Timeline, Status, Documents, Sort Order */}
              <div className="row">
                <div className="col-md-2">
                  <div className="form-group">
                    <label>Timeline</label>
                    <input
                      type="date"
                      name="timeline"
                      className="form-control"
                      required
                      value={formData.timeline}
                      onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <label>Status</label>
                  <div className="form-group">
                    <select
                      name="status"
                      className="js-example-basic-multiple form-control-lg"
                      required
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                      <option value="">Please Select Status</option>
                      <option value="1">Completed</option>
                      <option value="2">On Target</option>
                      <option value="3">Overdue</option>
                      <option value="4">Off Target</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label>Update Documents<small> (if any)</small></label>
                    <input type="file" name="attachments[]" className="file-upload-default" multiple />
                    <div className="input-group col-xs-12">
                      <input type="text" className="form-control file-upload-info" disabled placeholder="Upload files" />
                      <span className="input-group-append">
                        <button className="file-upload-browse btn btn-success" type="button">Select Files</button>
                      </span>
                    </div>
                    <div className="uploaded_file_div"></div>
                  </div>
                </div>
                <div className="col-md-2">
                  <div className="form-group">
                    <label htmlFor="sort_order">Sort Order</label>
                    <input
                      type="number"
                      name="sort_order"
                      className="form-control"
                      placeholder="Enter Sort Order like 1,2,3..."
                      value={formData.sort_order}
                      onChange={(e) => setFormData({ ...formData, sort_order: e.target.value })}
                    />
                  </div>
                </div>
                <div className="col-md-2">
                  <div className="form-group">
                    <div className="mt-5 form-check form-check-flat form-check-primary">
                      <label className="form-check-label">
                        <input
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
                  </div>
                </div>
              </div>

              {/* Category */}
              <div className="row">
                <div className="col-md-6">
                  <label>Category</label>
                  <div className="form-group">
                    <select
                      name="tags[]"
                      style={{ width: '100%', height: '200px' }}
                      className="js-example-basic-multiple w-100 form-control form-control-lg"
                      multiple
                      value={formData.tags.map(String)}
                      onChange={(e) => {
                        const selected = Array.from(e.target.selectedOptions, option => parseInt(option.value));
                        setFormData({ ...formData, tags: selected });
                      }}
                    >
                      <option value="" disabled>Please Select Category</option>
                      {mockTags.map(tag => (
                        <option key={tag.id} value={tag.id}>{tag.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <a href="#" className="mr-3" onClick={(e) => { e.preventDefault(); onClose(); }}>
                Back to recordnote
              </a>
              <input
                type="submit"
                value="Update Changes"
                className="btn btn-primary btn-icon-text"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
