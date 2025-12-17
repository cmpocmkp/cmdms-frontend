/**
 * Add Sectorial Agenda Point - Admin Module
 * EXACT replica of admin/sectorialagendapoints/add.blade.php from old CMDMS
 */

import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { mockSectorialMeetings } from '../../../lib/mocks/data/sectorialMeetings';
import { mockAdminDepartments } from '../../../lib/mocks/data/adminDepartments';
import { mockSchemes } from '../../../lib/mocks/data/schemes';

export default function AddSectorialAgendaPoint() {
  const [searchParams] = useSearchParams();
  const meetingId = searchParams.get('meeting') || '';
  const meeting = mockSectorialMeetings.find(m => m.id === Number(meetingId));

  const [item, setItem] = useState('');
  const [departments, setDepartments] = useState<string[]>([]);
  const [responsibility, setResponsibility] = useState('');
  const [comments, setComments] = useState('');
  const [decision, setDecision] = useState('');
  const [timeline, setTimeline] = useState(new Date().toISOString().split('T')[0]); // Default to today
  const [isArchived, setIsArchived] = useState(false);
  const [schemeId, setSchemeId] = useState<string>('');
  const [attachmentFiles, setAttachmentFiles] = useState<FileList | null>(null);

  if (!meeting) {
    return (
      <div className="content-wrapper">
        <div className="alert alert-danger">Meeting not found</div>
      </div>
    );
  }

  // Format date as 'd/m/Y'
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Add Sectorial Agenda Point:', {
      sectorial_meeting_id: meeting.id,
      item,
      departments,
      responsibility,
      comments,
      decision,
      timeline,
      is_archived: isArchived,
      scheme_id: schemeId || null,
      attachments: attachmentFiles ? Array.from(attachmentFiles) : []
    });
    alert('Add Sectorial Agenda Point functionality will be implemented with backend API');
    // Navigate would be: navigate(`/admin/sectorialmeetings/${meeting.id}/agenda-points`);
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
                  <p className="block display-4">Add new Agenda Point</p>
                </div>
                <div>
                  <div className="btn-toolbar pull-right">
                    <div className="btn-group">
                      <Link
                        to={`/admin/sectorialmeetings/${meeting.id}/agenda-points`}
                        className="btn btn-outline-primary btn-fw"
                        title="Back to Agenda Points"
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
              {/* Meeting Details Table */}
              <div className="row">
                <div className="col-md-12">
                  <div className="table-responsive mt-2 mb-2">
                    <table className="table table-bordered table-striped w-100 mb-3">
                      <tbody>
                        <tr>
                          <th>Meeting Subject</th>
                          <td><strong>{meeting.subject}</strong></td>
                        </tr>
                        <tr>
                          <th>Meeting Date</th>
                          <td>{formatDate(meeting.date)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <form
                className="form-sample"
                onSubmit={handleSubmit}
                encType="multipart/form-data"
                id="add_sectorial_agenda_point_form"
              >
                <p className="card-description">
                  <input type="hidden" name="created_by" value="1" /> {/* Will be replaced with actual user ID */}
                  <input type="hidden" name="sectorial_meeting_id" value={meeting.id} />
                  <input type="hidden" name="department" value="" />
                </p>

                {/* row start */}
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Agenda Item</label>
                      <textarea
                        className="form-control"
                        id="subject"
                        name="item"
                        rows={4}
                        value={item}
                        onChange={(e) => setItem(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label>Responsible departments in agenda item</label>
                    <div className="form-group">
                      <select
                        id="add_departments_dropdown"
                        name="departments[]"
                        style={{ width: '500px' }}
                        className="js-example-basic-multiple w-100 form-control form-control-lg"
                        multiple
                        value={departments}
                        onChange={handleDepartmentChange}
                        size={10}
                      >
                        <option value="" disabled selected>
                          select related departments (optional)
                        </option>
                        {mockAdminDepartments.map((department) => (
                          <option key={department.id} value={department.id.toString()}>
                            {department.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Responsibility</label>
                      <textarea
                        className="form-control"
                        id="agenda_responsibility"
                        name="responsibility"
                        rows={4}
                        value={responsibility}
                        onChange={(e) => setResponsibility(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Progress So far</label>
                      <textarea
                        className="form-control"
                        id="comments"
                        name="comments"
                        rows={4}
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Decision</label>
                      <textarea
                        className="form-control"
                        id="agenda_decision"
                        name="decision"
                        rows={4}
                        value={decision}
                        onChange={(e) => setDecision(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label>Timeline</label>
                      <input
                        id="sectorialupdatetimeline"
                        type="date"
                        name="timeline"
                        className="form-control"
                        value={timeline}
                        onChange={(e) => setTimeline(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="form-group">
                      <div className="form-check form-check-flat form-check-primary">
                        <label className="form-check-label">
                          <input
                            id="is_archived"
                            type="checkbox"
                            name="is_archived"
                            className="form-check-input chkall"
                            checked={isArchived}
                            onChange={(e) => setIsArchived(e.target.checked)}
                          />
                          Mark as Archived
                          <i className="input-helper"></i>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="form-group">
                      <label>
                        Attach Documents<small> (if any)</small>
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
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="form-group">
                      <label>Scheme</label>
                      <select
                        id="scheme"
                        name="scheme_id"
                        className="js-example-basic-multiple w-100 form-control form-control-lg"
                        value={schemeId}
                        onChange={(e) => setSchemeId(e.target.value)}
                      >
                        <option value="" selected>
                          Please Select Scheme
                        </option>
                        {mockSchemes.map((scheme) => (
                          <option key={scheme.id} value={scheme.id.toString()}>
                            {scheme.name} ({scheme.district_name})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* row end */}
                <button type="submit" className="btn btn-success mr-2">
                  Save
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}