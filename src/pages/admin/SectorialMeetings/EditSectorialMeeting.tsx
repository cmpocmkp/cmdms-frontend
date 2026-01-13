/**
 * Edit Sectorial Meeting - Admin Module
 * EXACT replica of admin/sectorialmeetings/edit.blade.php from old CMDMS
 * Integrated with real API following API_INTEGRATION_GUIDE.md
 * 
 * Note: API only supports: title, date, sector
 * Additional form fields (time, meetingType, meetingNumber, departments, attendees, attachments) are UI-only and not sent to API
 */

import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import * as sectoralMeetingService from '../../../lib/services/sectoralMeetingService';
import { USE_MOCK_DATA } from '../../../lib/api';
import { mockAdminDepartments } from '../../../lib/mocks/data/adminDepartments';

// Meeting types from old CMDMS enum (MeetingTypes)
const meetingTypes = [
  { id: 1, name: 'Normal' },
  { id: 17, name: 'PTF' },
  { id: 2, name: 'Call on' },
  { id: 3, name: 'ADP' },
  { id: 4, name: 'Inauguration' },
  { id: 5, name: 'Announcement' },
  { id: 6, name: 'Assembly Session' },
  { id: 7, name: 'Visit' },
  { id: 8, name: 'Video Conference' },
  { id: 9, name: 'File Work' },
  { id: 10, name: 'Delegation' },
  { id: 11, name: 'Cabinet' },
  { id: 12, name: 'Discussion' },
  { id: 13, name: 'Parliamentarian' },
  { id: 14, name: 'Introductory' },
  { id: 15, name: 'Prize Distribution' },
  { id: 16, name: 'Presentation' }
];

// Meeting numbers from old CMDMS
const meetingNumbers: Record<string, string> = {
  '111': 'First Meeting',
  '1': 'Follow-up 1',
  '2': 'Follow-up 2',
  '3': 'Follow-up 3',
  '4': 'Follow-up 4',
  '5': 'Follow-up 5',
  '6': 'Follow-up 6',
  '7': 'Follow-up 7',
  '8': 'Follow-up 8',
  '9': 'Follow-up 9',
  '10': 'Follow-up 10'
};

export default function EditSectorialMeeting() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [meeting, setMeeting] = useState<sectoralMeetingService.SectoralMeeting | null>(null);

  // API fields
  const [title, setTitle] = useState('');
  const [sector, setSector] = useState('');
  const [date, setDate] = useState('');
  
  // UI-only fields (not sent to API)
  const [time, setTime] = useState('');
  const [meetingType, setMeetingType] = useState<string>('1');
  const [meetingNumber, setMeetingNumber] = useState<string>('111');
  const [departments, setDepartments] = useState<string[]>([]);
  const [attendees, setAttendees] = useState('');
  const [attachmentFiles, setAttachmentFiles] = useState<FileList | null>(null);

  // Fetch meeting from API
  useEffect(() => {
    if (id) {
      fetchMeeting();
    }
  }, [id]);

  const fetchMeeting = async () => {
    try {
      setLoading(true);
      setError(null);

      if (USE_MOCK_DATA) {
        // Mock data
        const mockMeeting: sectoralMeetingService.SectoralMeeting = {
          id: Number(id),
          title: 'Mock Sectoral Meeting',
          date: new Date().toISOString().split('T')[0],
          sector: 'Education',
        };
        setMeeting(mockMeeting);
        setTitle(mockMeeting.title);
        setSector(mockMeeting.sector || '');
        setDate(mockMeeting.date || '');
      } else {
        // Real API call
        const response = await sectoralMeetingService.getSectoralMeeting(Number(id));

        if (response.success && response.data) {
          setMeeting(response.data);
          setTitle(response.data.title || '');
          setSector(response.data.sector || '');
          setDate(response.data.date || '');
        } else {
          setError(response.message || 'Sectorial meeting not found');
        }
      }
    } catch (err: any) {
      console.error('Error fetching sectoral meeting:', err);
      setError(err.response?.data?.error?.message || 'Failed to load sectoral meeting');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="content-wrapper">
        <div className="text-center p-5">
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only">Loading...</span>
          </div>
          <p className="mt-2 text-muted">Loading sectoral meeting...</p>
        </div>
      </div>
    );
  }

  if (error && !meeting) {
    return (
      <div className="content-wrapper">
        <div className="alert alert-danger" role="alert">
          <i className="ti-alert-circle mr-2"></i>
          <strong>Error:</strong> {error}
          <Link to="/admin/sectorialmeetings" className="btn btn-sm btn-outline-danger ml-3">
            Back to List
          </Link>
        </div>
      </div>
    );
  }

  if (!meeting) {
    return (
      <div className="content-wrapper">
        <div className="alert alert-danger">Sectorial Meeting not found</div>
        <Link to="/admin/sectorialmeetings" className="btn btn-outline-primary">
          Back to List
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setUpdating(true);
      setError(null);

      // Map form data to API format (only documented fields)
      const updateData: sectoralMeetingService.UpdateSectoralMeetingRequest = {
        title: title || undefined,
        date: date || undefined,
        sector: sector || undefined,
      };

      if (USE_MOCK_DATA) {
        // Mock update
        await new Promise(resolve => setTimeout(resolve, 500));
        alert('Sectoral meeting updated successfully! (Mock)');
        navigate('/admin/sectorialmeetings');
      } else {
        // Real API call
        const response = await sectoralMeetingService.updateSectoralMeeting(Number(id), updateData);

        if (response.success && response.data) {
          alert('Sectoral meeting updated successfully!');
          navigate('/admin/sectorialmeetings');
        } else {
          setError(response.message || 'Failed to update sectoral meeting');
        }
      }
    } catch (err: any) {
      console.error('Error updating sectoral meeting:', err);
      setError(err.response?.data?.error?.message || 'Failed to update sectoral meeting. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachmentFiles(e.target.files);
    }
  };

  const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setDepartments(selectedOptions);
  };

  return (
    <div className="content-wrapper">
      <div className="row">
        <div className="col-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-header text-center">
              <div className="d-flex gap-3 justify-content-between align-items-center">
                <div className="flex-grow-1 text-center">
                  <p className="block display-4">Edit Sectoral Meeting</p>
                </div>
                <div>
                  <div className="btn-toolbar pull-right">
                    <div className="btn-group">
                      <Link
                        to="/admin/sectorialmeetings"
                        className="btn btn-outline-primary btn-fw"
                        style={{ float: 'right' }}
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

              <form
                className="form-sample"
                onSubmit={handleSubmit}
                encType="multipart/form-data"
                id="edit_sectorial_meeting_form"
              >
                {/* row start */}
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>
                        Meeting Title <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        name="title"
                        id="sectorial_meeting_title"
                        className="form-control"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Sector Name</label>
                      <input
                        type="text"
                        name="sector"
                        id="sectorial_meeting_sector"
                        className="form-control"
                        value={sector}
                        onChange={(e) => setSector(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>
                        Meeting Date
                      </label>
                      <input
                        type="date"
                        name="date"
                        id="sectoral_date"
                        className="form-control"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                      />
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

                <div className="row">
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>Meeting Time <small className="text-muted">(UI-only)</small></label>
                      <input
                        type="time"
                        name="time"
                        id="sectorial_meeting_time"
                        className="form-control"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>Meeting Type <small className="text-muted">(UI-only)</small></label>
                      <select
                        name="meeting_type"
                        id="meeting_type"
                        className="form-control form-control-lg"
                        value={meetingType}
                        onChange={(e) => setMeetingType(e.target.value)}
                      >
                        {meetingTypes.map((type) => (
                          <option key={type.id} value={type.id}>
                            {type.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>Meeting Number <small className="text-muted">(UI-only)</small></label>
                      <select
                        id="meeting_number"
                        name="meeting_number"
                        className="form-control form-control-lg"
                        value={meetingNumber}
                        onChange={(e) => setMeetingNumber(e.target.value)}
                      >
                        {Object.entries(meetingNumbers).map(([key, number]) => (
                          <option key={key} value={key}>
                            {number}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-8">
                    <div className="form-group">
                      <label>
                        Departments <small className="text-muted">(UI-only)</small>
                      </label>
                      <select
                        id="departments"
                        name="departments[]"
                        multiple
                        style={{ width: '100%' }}
                        className="w-100 form-control form-control-lg"
                        value={departments}
                        onChange={handleDepartmentChange}
                        size={10}
                      >
                        {mockAdminDepartments.map((department) => (
                          <option key={department.id} value={department.id.toString()}>
                            {department.name}
                          </option>
                        ))}
                      </select>
                      <small className="form-text text-muted">
                        Select one or more departments for this sectorial meeting (UI-only, not sent to API)
                      </small>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label>
                        Update Attach Documents <small className="text-muted">(UI-only)</small>
                      </label>
                      <input
                        type="file"
                        name="attachments[]"
                        className="file-upload-default"
                        multiple
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                        id="file-upload-input"
                      />
                      <div className="input-group col-xs-12">
                        <input
                          type="text"
                          className="form-control file-upload-info"
                          disabled
                          placeholder="Upload files"
                          value={attachmentFiles ? `${attachmentFiles.length} file(s) selected` : ''}
                        />
                        <span className="input-group-append">
                          <button
                            className="file-upload-browse btn btn-success"
                            type="button"
                            onClick={() => document.getElementById('file-upload-input')?.click()}
                          >
                            Select Files
                          </button>
                        </span>
                      </div>
                      {/* Note: Attachments not in API response */}
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-12">
                    <div className="form-group">
                      <label>Meeting Attendees <small className="text-muted">(UI-only)</small></label>
                      <textarea
                        className="form-control"
                        id="attendies"
                        name="attendies"
                        rows={4}
                        placeholder="Enter meeting attendees..."
                        value={attendees}
                        onChange={(e) => setAttendees(e.target.value)}
                      />
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
                        disabled={updating}
                      >
                        {updating ? (
                          <>
                            <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                            Updating...
                          </>
                        ) : (
                          <>
                            <i className="ti-save mr-1"></i>Update Meeting
                          </>
                        )}
                      </button>
                      <Link to="/admin/sectorialmeetings" className="btn btn-light">
                        <i className="ti-arrow-left mr-1"></i>Cancel
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
