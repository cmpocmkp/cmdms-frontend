/**
 * Add Minute Form - Admin Module
 * EXACT replica of admin/recordnotes/add.blade.php from old CMDMS
 * Integrated with real API following API_INTEGRATION_GUIDE.md
 * 
 * Note: API supports: title, date, type, venue
 * Additional form fields (departments, participants, attachment) are UI-only and not sent to API
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as meetingService from '../../../lib/services/meetingService';
import { USE_MOCK_DATA } from '../../../lib/api';
import { mockAdminDepartments } from '../../../lib/mocks/data/adminDepartments';

// Meeting types mapping: form IDs to API type strings
const meetingTypeMap: Record<string, string> = {
  '1': 'normal',
  '2': 'cabinet',
  '3': 'board',
  '4': 'sectorial'
};

const meetingTypes = [
  { id: '1', name: 'Normal' },
  { id: '2', name: 'Cabinet' },
  { id: '3', name: 'Board' },
  { id: '4', name: 'Sectorial' }
];

export default function AddMinute() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Default date to today
  const today = new Date();
  const dateStr = today.toISOString().split('T')[0];

  // API fields
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(dateStr);
  const [type, setType] = useState<string>('2'); // Default to Cabinet
  const [venue, setVenue] = useState('');
  
  // UI-only fields (not sent to API)
  const [departments, setDepartments] = useState<string[]>([]);
  const [participants, setParticipants] = useState('');
  const [attachment, setAttachment] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'title') setTitle(value);
    else if (name === 'date') setDate(value);
    else if (name === 'type') setType(value);
    else if (name === 'venue') setVenue(value);
    else if (name === 'participants') setParticipants(value);
  };

  const handleMultiSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const options = e.target.options;
    const selected: string[] = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selected.push(options[i].value);
      }
    }
    setDepartments(selected);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachment(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);

      // Map form data to API format (only documented fields)
      const apiData: meetingService.CreateMeetingRequest = {
        title: title || '',
        date: date || '',
        type: type ? meetingTypeMap[type] : undefined,
        venue: venue || undefined,
      };

      if (USE_MOCK_DATA) {
        // Mock create
        await new Promise(resolve => setTimeout(resolve, 500));
        alert('Meeting added successfully! (Mock)');
        navigate('/admin/recordnotes');
      } else {
        // Real API call
        const response = await meetingService.createMeeting(apiData);

        if (response.success && response.data) {
          alert('Meeting added successfully!');
          navigate('/admin/recordnotes');
        } else {
          setError(response.message || 'Failed to create meeting');
        }
      }
    } catch (err: any) {
      console.error('Error creating meeting:', err);
      setError(err.response?.data?.error?.message || 'Failed to create meeting. Please try again.');
    } finally {
      setLoading(false);
    }
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
              {/* Error Message */}
              {error && (
                <div className="alert alert-danger" role="alert">
                  <i className="ti-alert-circle mr-2"></i>
                  <strong>Error:</strong> {error}
                </div>
              )}

              <form className="form-sample" onSubmit={handleSubmit} encType="multipart/form-data">
                {/* Subject (Title) */}
                <div className="row">
                  <div className="col-md-12">
                    <div className="form-group">
                      <label htmlFor="record-note-subject">
                        Subject (Title) <span className="text-danger">*</span>
                      </label>
                      <textarea 
                        className="form-control" 
                        id="addmeetingsubject" 
                        name="title" 
                        rows={4}
                        value={title}
                        onChange={handleChange}
                        required
                      ></textarea>
                    </div>
                  </div>
                </div>

                {/* Meeting Date, Venue, Meeting Type */}
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
                        value={date}
                        onChange={handleChange}
                        className="form-control" 
                        required 
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
                        value={venue}
                        onChange={handleChange}
                        placeholder="Enter venue"
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label>Meeting Type</label>
                      <select 
                        name="type" 
                        id="meeting_type"
                        className="meeting_type_drop_down w-100 form-control form-control-lg"
                        value={type}
                        onChange={handleChange}
                      >
                        {meetingTypes.map(typeOption => (
                          <option key={typeOption.id} value={typeOption.id}>{typeOption.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* UI-Only Fields (Not sent to API) */}
                <div className="row">
                  <div className="col-md-12">
                    <hr />
                    <small className="text-muted">
                      <strong>Note:</strong> The following fields are UI-only and not sent to the API (not documented in API_INTEGRATION_GUIDE.md):
                    </small>
                  </div>
                </div>

                {/* Departments and Participants */}
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Departments <small className="text-muted">(UI-only)</small></label>
                      <select 
                        name="departments[]" 
                        id="departments"
                        className="js-example-basic-multiple w-100 form-control form-control-lg" 
                        multiple
                        value={departments}
                        onChange={handleMultiSelectChange}
                        size={8}
                        style={{ minHeight: '150px' }}
                      >
                        {mockAdminDepartments.map(department => (
                          <option key={department.id} value={department.id}>{department.name}</option>
                        ))}
                      </select>
                      <small className="form-text text-muted">Hold Ctrl (Windows) or Cmd (Mac) to select multiple departments</small>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="record-note-participants">
                        Participants <small className="text-muted">(UI-only)</small>
                      </label>
                      <textarea 
                        className="form-control" 
                        id="minutes_meetings_participants" 
                        name="participants" 
                        rows={8}
                        value={participants}
                        onChange={handleChange}
                      ></textarea>
                    </div>
                  </div>
                </div>

                {/* Attachment (UI-only) */}
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Upload Minutes <small className="text-muted">(UI-only)</small></label>
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
                          value={attachment?.name || ''}
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
                </div>

                {/* Form Actions */}
                <div className="row">
                  <div className="col-md-12">
                    <div className="form-group text-left">
                      <button 
                        type="submit" 
                        className="btn btn-success mr-2"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                            Saving...
                          </>
                        ) : (
                          'Save'
                        )}
                      </button>
                      <Link to="/admin/recordnotes" className="btn btn-light">
                        Cancel
                      </Link>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
