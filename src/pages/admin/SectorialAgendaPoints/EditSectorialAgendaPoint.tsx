/**
 * Edit Sectorial Agenda Point - Admin Module
 * EXACT replica of admin/sectorialagendapoints/edit.blade.php from old CMDMS
 */

import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { mockAgendaPoints, mockSectorialMeetings } from '../../../lib/mocks/data/sectorialMeetings';
import { mockAdminDepartments } from '../../../lib/mocks/data/adminDepartments';
import { mockSchemes } from '../../../lib/mocks/data/schemes';

export default function EditSectorialAgendaPoint() {
  const { id } = useParams<{ id: string }>();
  const agendaPoint = mockAgendaPoints.find(ap => ap.id === Number(id));

  const [item, setItem] = useState('');
  const [departments, setDepartments] = useState<string[]>([]);
  const [responsibility, setResponsibility] = useState('');
  const [comments, setComments] = useState('');
  const [decision, setDecision] = useState('');
  const [timeline, setTimeline] = useState('');
  const [isArchived, setIsArchived] = useState(false);
  const [schemeId, setSchemeId] = useState<string>('');
  const [attachmentFiles, setAttachmentFiles] = useState<FileList | null>(null);

  useEffect(() => {
    if (agendaPoint) {
      setItem(agendaPoint.item);
      setDecision(agendaPoint.decision);
      setComments(agendaPoint.comments);
      setResponsibility(agendaPoint.responsibility || '');
      setTimeline(agendaPoint.timeline || '');
      setIsArchived(agendaPoint.is_archived || false);
      setSchemeId(agendaPoint.scheme_id?.toString() || '');
      // Get department IDs from agendaPoint.departments
      setDepartments(agendaPoint.departments.map(d => d.id.toString()));
    }
  }, [agendaPoint]);

  if (!agendaPoint) {
    return (
      <div className="content-wrapper">
        <div className="alert alert-danger">Agenda Point not found</div>
      </div>
    );
  }

  const meeting = mockSectorialMeetings.find(m => m.id === agendaPoint.meeting_id);

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
    console.log('Update Sectorial Agenda Point:', {
      id: agendaPoint.id,
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
    alert('Update Sectorial Agenda Point functionality will be implemented with backend API');
    // Navigate would be: navigate(`/admin/sectorialmeetings/${agendaPoint.meeting_id}/agenda-points`);
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
                  <p className="block display-4">Edit Agenda Point</p>
                </div>
                <div>
                  <div className="btn-toolbar pull-right">
                    <div className="btn-group">
                      <Link
                        to={`/admin/sectorialmeetings/${agendaPoint.meeting_id}/agenda-points`}
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
              <div className="row">
                <div className="col-md-12">
                  {meeting && (
                    <>
                      <p>
                        <strong className="text-success">Meeting Subject: </strong>
                        <strong>{meeting.subject}</strong>
                      </p>
                      <p>
                        <strong className="text-success">Date: </strong>
                        {formatDate(meeting.date)}
                      </p>
                    </>
                  )}
                </div>
              </div>

              <form
                className="form-sample"
                onSubmit={handleSubmit}
                encType="multipart/form-data"
                id="edit_sectorial_agenda_point_form"
              >
                <p className="card-description">
                  <input type="hidden" name="modified_by" value="1" /> {/* Will be replaced with actual user ID */}
                  <input type="hidden" name="sectorial_meeting_id" value={agendaPoint.meeting_id} />
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
                        style={{ width: '300px' }}
                        className="js-example-basic-multiple w-100 form-control form-control-lg"
                        multiple
                        value={departments}
                        onChange={handleDepartmentChange}
                        size={10}
                      >
                        {departments.length === 0 && (
                          <option value="" disabled selected>
                            select related departments (optional)
                          </option>
                        )}
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
                      <label>Progress so far</label>
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
                        id="updatetimeline"
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
                        Update Attach Documents<small> (if any)</small>
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
                      {agendaPoint.attachments && agendaPoint.attachments.length > 0 && (
                        <div style={{ marginTop: '10px' }}>
                          {agendaPoint.attachments.map((file, idx) => (
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
                        <option value="">Please Select Scheme</option>
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
                  Update
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}