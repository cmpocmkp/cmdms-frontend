/**
 * Add Minute Form - Admin Module
 * EXACT replica of admin/recordnotes/add.blade.php from old CMDMS
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { mockAdminDepartments } from '../../../lib/mocks/data/adminDepartments';

export default function AddMinute() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    subject: '',
    meeting_date: new Date().toISOString().split('T')[0],
    departments: [] as string[],
    participants: '',
    meeting_type: '1', // Normal meeting type
    attachement: null as File | null
  });

  const departments = mockAdminDepartments;
  const meetingTypes = [
    { id: '1', name: 'Normal' },
    { id: '2', name: 'Cabinet' },
    { id: '3', name: 'Board' },
    { id: '4', name: 'Sectorial' }
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
      departments: selected
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({
        ...prev,
        attachement: e.target.files![0]
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('New meeting:', formData);
    // TODO: Implement API call when backend is ready
    alert('Meeting added successfully! (Mock)');
    navigate('/admin/recordnotes');
  };

  return (
    <div className="content-wrapper">
      <div className="row">
        <div className="col-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-header text-center">
              <div className="d-flex gap-3 justify-content-between align-items-center">
                <div className="flex-grow-1 text-center">
                  <p className="block display-4">Add New Meeting</p>
                </div>
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
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="card-body">
              <form className="form-sample" onSubmit={handleSubmit} encType="multipart/form-data">
                {/* Subject */}
                <div className="row">
                  <div className="col-md-12">
                    <div className="form-group">
                      <label htmlFor="record-note-subject">Subject</label>
                      <textarea 
                        className="form-control" 
                        id="addmeetingsubject" 
                        name="subject" 
                        rows={4}
                        value={formData.subject}
                        onChange={handleChange}
                        required
                      ></textarea>
                    </div>
                  </div>
                </div>

                {/* Meeting Date, Upload, Meeting Type */}
                <div className="row">
                  <div className="col-md-4">
                    <div className="form-group">
                      <label>Meeting Date</label>
                      <input 
                        type="date" 
                        name="meeting_date" 
                        id="meeting_date"
                        value={formData.meeting_date}
                        onChange={handleChange}
                        className="form-control" 
                        required 
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label>Upload Minutes</label>
                      <input 
                        type="file" 
                        name="attachement" 
                        className="file-upload-default"
                        onChange={handleFileChange}
                      />
                      <div className="input-group col-xs-12">
                        <input 
                          type="text" 
                          className="form-control file-upload-info" 
                          disabled 
                          placeholder="Upload Image"
                          value={formData.attachement?.name || ''}
                        />
                        <span className="input-group-append">
                          <button 
                            className="file-upload-browse btn btn-success" 
                            type="button"
                            onClick={() => document.querySelector<HTMLInputElement>('input[type="file"]')?.click()}
                          >
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
                        name="meeting_type" 
                        id="meeting_type"
                        className="meeting_type_drop_down w-100 form-control form-control-lg"
                        value={formData.meeting_type}
                        onChange={handleChange}
                      >
                        <option value="">--select--</option>
                        {meetingTypes.map(type => (
                          <option key={type.id} value={type.id}>{type.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Departments and Participants */}
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Departments</label>
                      <select 
                        name="departments[]" 
                        id="departments"
                        className="js-example-basic-multiple w-100 form-control form-control-lg" 
                        multiple
                        value={formData.departments}
                        onChange={handleMultiSelectChange}
                        size={8}
                        style={{ minHeight: '150px' }}
                      >
                        {departments.map(department => (
                          <option key={department.id} value={department.id}>{department.name}</option>
                        ))}
                      </select>
                      <small className="form-text text-muted">Hold Ctrl (Windows) or Cmd (Mac) to select multiple departments</small>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="record-note-participants">Participants</label>
                      <textarea 
                        className="form-control" 
                        id="minutes_meetings_participants" 
                        name="participants" 
                        rows={8}
                        value={formData.participants}
                        onChange={handleChange}
                      ></textarea>
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
