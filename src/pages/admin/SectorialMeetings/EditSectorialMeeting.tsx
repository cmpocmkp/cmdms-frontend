/**
 * Edit Sectorial Meeting - Admin Module
 * EXACT replica of admin/sectorialmeetings/edit.blade.php from old CMDMS
 */

import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { mockSectorialMeetings } from '../../../lib/mocks/data/sectorialMeetings';
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
  const meeting = mockSectorialMeetings.find(m => m.id === Number(id));

  const [subject, setSubject] = useState('');
  const [sector, setSector] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [meetingType, setMeetingType] = useState<string>('1');
  const [meetingNumber, setMeetingNumber] = useState<string>('111');
  const [departments, setDepartments] = useState<string[]>([]);
  const [attendees, setAttendees] = useState('');
  const [attachmentFiles, setAttachmentFiles] = useState<FileList | null>(null);

  useEffect(() => {
    if (meeting) {
      setSubject(meeting.subject);
      setSector(meeting.sector || '');
      setDate(meeting.date);
      setTime(meeting.time || '');
      setMeetingType((meeting.meeting_type_id || 1).toString());
      setMeetingNumber(meeting.meeting_number || '111');
      setDepartments(meeting.departments.map(d => d.toString()));
      setAttendees(meeting.attendies || '');
    }
  }, [meeting]);

  if (!meeting) {
    return (
      <div className="content-wrapper">
        <div className="alert alert-danger">Sectorial Meeting not found</div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!departments || departments.length === 0) {
      alert('Please select at least one department.');
      return;
    }

    console.log('Update Sectorial Meeting:', {
      id: meeting.id,
      subject,
      sector,
      date,
      time,
      meeting_type: meetingType,
      meeting_number: meetingNumber,
      departments,
      attendies: attendees,
      attachments: attachmentFiles ? Array.from(attachmentFiles) : []
    });
    alert('Update Sectorial Meeting functionality will be implemented with backend API');
    // Navigate would be: navigate('/admin/sectorialmeetings');
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
              <form
                className="form-sample"
                onSubmit={handleSubmit}
                encType="multipart/form-data"
                id="edit_sectorial_meeting_form"
              >
                <p className="card-description">
                  <input type="hidden" name="modified_by" value="1" /> {/* Will be replaced with actual user ID */}
                  <input type="hidden" name="department_id" value="" />
                </p>

                {/* row start */}
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>
                        Meeting Subject <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        name="subject"
                        id="sectorial_meeting_subject"
                        className="form-control"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
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
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>
                        Meeting Date <span className="text-danger">*</span>
                      </label>
                      <input
                        type="date"
                        name="date"
                        id="sectoral_date"
                        className="form-control"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>Meeting Time</label>
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
                      <label>Meeting Type</label>
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
                      <label>Meeting Number</label>
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
                        Departments <span className="text-danger">*</span>
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
                        Select one or more departments for this sectorial meeting
                      </small>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label>
                        Update Attach Documents <small>(if any)</small>
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
                      {meeting.attachments && meeting.attachments.length > 0 && (
                        <div style={{ marginTop: '10px' }}>
                          {meeting.attachments.map((file, idx) => (
                            <span key={idx} style={{ display: 'block', marginBottom: '5px' }}>
                              <a
                                href="#"
                                title="click to download attach file"
                                onClick={(e) => {
                                  e.preventDefault();
                                  console.log('Download attachment:', file);
                                }}
                              >
                                Attachment:<i className="ti-file"></i>
                              </a>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-12">
                    <div className="form-group">
                      <label>Meeting Attendees</label>
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
                      <button type="submit" className="btn btn-success mr-2">
                        <i className="ti-save mr-1"></i>Update Meeting
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