/**
 * Add Directive Form - Admin Module  
 * EXACT replica of admin/directives/add.blade.php from old CMDMS
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { mockAdminDepartments } from '../../../lib/mocks/data/adminDepartments';

export default function AddDirective() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    subject: '',
    comments: '',
    letter_no: '',
    date: new Date().toISOString().split('T')[0],
    timeline: new Date().toISOString().split('T')[0],
    other_department_ids: [] as string[],
    is_archived: false,
    attachments: [] as File[]
  });

  const departments = mockAdminDepartments;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleMultiSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const options = e.target.options;
    const selected: string[] = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selected.push(options[i].value);
      }
    }
    setFormData(prev => ({
      ...prev,
      other_department_ids: selected
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData(prev => ({
        ...prev,
        attachments: Array.from(e.target.files || [])
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('New directive:', formData);
    // TODO: Implement API call when backend is ready
    alert('Directive added successfully! (Mock)');
    navigate('/admin/directives');
  };

  return (
    <div className="content-wrapper">
      <div className="row">
        <div className="col-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <Link to="/admin/directives" style={{ float: 'right' }}>
                Show all Directives
              </Link>
              <p className="card-title"><strong>Add new Directive</strong></p>
              <p className="card-description"></p>

              <form className="form-sample" onSubmit={handleSubmit} encType="multipart/form-data">
                {/* Subject */}
                <div className="row">
                  <div className="col">
                    <div className="form-group">
                      <label htmlFor="subjectdirective">Subject</label>
                      <textarea 
                        className="form-control" 
                        id="subjectdirective" 
                        name="subject" 
                        rows={4}
                        value={formData.subject}
                        onChange={handleChange}
                        required
                      ></textarea>
                    </div>
                  </div>
                </div>

                {/* Progress */}
                <div className="row">
                  <div className="col">
                    <div className="form-group">
                      <label htmlFor="add_directive_comments">Progress</label>
                      <textarea 
                        className="form-control" 
                        id="add_directive_comments" 
                        name="comments" 
                        rows={4}
                        value={formData.comments}
                        onChange={handleChange}
                      ></textarea>
                    </div>
                  </div>
                </div>

                {/* Departments, Letter No, Date, Timeline, Attachments, Archive */}
                <div className="row">
                  <div className="col-md-8">
                    <div className="form-group">
                      <label>Responsible Departments</label>
                      <select 
                        id="other_departments" 
                        name="other_department_ids" 
                        className="js-example-basic-multiple w-100 form-control form-control-lg" 
                        multiple
                        value={formData.other_department_ids}
                        onChange={handleMultiSelectChange}
                        size={5}
                      >
                        {departments.map(department => (
                          <option key={department.id} value={department.id}>{department.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label>Letter Number</label>
                      <input 
                        type="text" 
                        name="letter_no" 
                        id="letter_no"
                        value={formData.letter_no}
                        onChange={handleChange}
                        className="form-control" 
                        required 
                      />
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="form-group">
                      <label>Directive Date</label>
                      <input 
                        type="date" 
                        name="date" 
                        id="date"
                        value={formData.date}
                        onChange={handleChange}
                        className="form-control" 
                        required 
                      />
                    </div>
                  </div>

                  <div className="col-md-4">
                    <label>Timeline</label>
                    <input 
                      type="date" 
                      name="timeline" 
                      id="timeline"
                      value={formData.timeline}
                      onChange={handleChange}
                      className="form-control" 
                    />
                  </div>

                  <div className="col-md-4">
                    <div className="form-group">
                      <label>Attach Documents<small> (if any)</small></label>
                      <input 
                        type="file" 
                        name="attachments" 
                        className="file-upload-default" 
                        multiple
                        onChange={handleFileChange}
                      />
                      <div className="input-group col-xs-12">
                        <input 
                          type="text" 
                          className="form-control file-upload-info" 
                          disabled 
                          placeholder="Upload files"
                          value={formData.attachments.length > 0 ? `${formData.attachments.length} file(s) selected` : ''}
                        />
                        <span className="input-group-append">
                          <button 
                            className="file-upload-browse btn btn-success" 
                            type="button"
                            onClick={() => document.querySelector<HTMLInputElement>('input[name="attachments"]')?.click()}
                          >
                            Select Files
                          </button>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="form-group">
                      <div className="mt-5 form-check form-check-flat form-check-primary">
                        <label className="form-check-label">
                          <input 
                            id="is_archived" 
                            type="checkbox" 
                            name="is_archived"
                            checked={formData.is_archived}
                            onChange={handleChange}
                            className="form-check-input chkall"
                          />
                          Mark as Archived
                          <i className="input-helper"></i>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <button type="submit" className="btn btn-success mr-2">Save</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
