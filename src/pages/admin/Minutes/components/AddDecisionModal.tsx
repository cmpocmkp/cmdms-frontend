/**
 * Add Decision Modal Component
 * Replicates the Add Decision modal from old CMDMS
 */

import { useState } from 'react';

interface AddDecisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  meetingId: number;
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

export function AddDecisionModal({ isOpen, onClose, meetingId: _meetingId, onSubmit }: AddDecisionModalProps) {
  const [formData, setFormData] = useState({
    issues: '',
    decisions: '',
    departments: [] as number[],
    responsibility: '',
    comments: '',
    status: '',
    timeline: new Date().toISOString().split('T')[0],
    sort_order: '',
    tags: [] as number[],
  });

  const [selectAll, setSelectAll] = useState(false);

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

  if (!isOpen) return null;

  return (
    <div className="modal fade show" style={{ display: 'block' }} tabIndex={-1}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header" style={{ padding: '15px 27px' }}>
            <h5 className="modal-title">Add new decision</h5>
            <button type="button" className="close" onClick={onClose}>
              <span>&times;</span>
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body" style={{ padding: '10px 26px' }}>
              {/* Issues and Decisions */}
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label htmlFor="minute-issues">Issues/Agenda Items/Decision title</label>
                    <textarea
                      className="form-control"
                      id="minute_issues"
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
                      id="decisions"
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
                      style={{ width: '100%', height: '200px' }}
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
                      id="responsibility"
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
                      id="comments"
                      name="comments"
                      rows={4}
                      required
                      value={formData.comments}
                      onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Timeline, Attachments, Status */}
              <div className="row">
                <div className="col-md-3">
                  <div className="form-group">
                    <label>Status</label>
                    <select
                      name="status"
                      className="js-example-basic-multiple w-100 form-control form-control-lg"
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
                  <div className="form-group">
                    <label>Attach decision documents<small> (if any)</small></label>
                    <input type="file" name="attachments[]" className="file-upload-default" multiple />
                    <div className="input-group col-xs-12">
                      <input type="text" className="form-control file-upload-info" disabled placeholder="Upload files" />
                      <span className="input-group-append">
                        <button className="file-upload-browse btn btn-success" type="button">Select Files</button>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
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
              </div>

              {/* Category/Tags */}
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
              <input
                type="submit"
                value="save"
                className="btn btn-primary btn-icon-text"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
