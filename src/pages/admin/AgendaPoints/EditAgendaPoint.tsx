/**
 * Edit Agenda Point - Admin Module
 * EXACT replica of admin/agendapoints/edit.blade.php from old CMDMS
 */

import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { mockBoardAgendaPoints, mockBoardMeetings } from '../../../lib/mocks/data/boardMeetings';

const statuses: Record<string, string> = {
  '1': 'Implemented',
  '2': 'Pending'
};

const highlights: Record<string, string> = {
  '0': 'No',
  '1': 'Yes'
};

export default function EditAgendaPoint() {
  const { id } = useParams<{ id: string }>();
  const agendaPoint = mockBoardAgendaPoints.find(ap => ap.id === Number(id));
  const meeting = agendaPoint
    ? mockBoardMeetings.find(m => m.id === agendaPoint.board_meeting_id)
    : null;

  const [item, setItem] = useState('');
  const [decision, setDecision] = useState('');
  const [responsibility, setResponsibility] = useState('');
  const [comments, setComments] = useState('');
  const [timeline, setTimeline] = useState('');
  const [status, setStatus] = useState<string>('');
  const [isHighlight, setIsHighlight] = useState<string>('0');
  const [attachmentFiles, setAttachmentFiles] = useState<FileList | null>(null);

  useEffect(() => {
    if (agendaPoint) {
      setItem(agendaPoint.item);
      setDecision(agendaPoint.decision);
      setResponsibility(agendaPoint.responsibility);
      setComments(agendaPoint.comments);
      setTimeline(agendaPoint.timeline || '');
      // Map status label to key
      const statusKey = Object.keys(statuses).find(
        key => statuses[key] === agendaPoint.status
      ) || '';
      setStatus(statusKey);
      setIsHighlight('0'); // Default, would come from agendaPoint.is_hilight
    }
  }, [agendaPoint]);

  if (!agendaPoint || !meeting) {
    return (
      <div className="content-wrapper">
        <div className="alert alert-danger">Agenda Point not found</div>
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
    console.log('Update Agenda Point:', {
      id: agendaPoint.id,
      board_meeting_id: meeting.id,
      item,
      decision,
      responsibility,
      comments,
      timeline,
      status: status || null,
      is_hilight: isHighlight,
      attachments: attachmentFiles ? Array.from(attachmentFiles) : []
    });
    alert('Update Agenda Point functionality will be implemented with backend API');
    // Navigate would be: navigate(`/admin/boardmeetings/${meeting.department_id}/agenda-points/${meeting.id}`);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachmentFiles(e.target.files);
    }
  };

  return (
    <div className="content-wrapper">
      <div className="row">
        <div className="col-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <div className="row">
                <div className="col-md-12">
                  <h4 style={{ float: 'left' }} className="card-title">
                    Edit Agenda Point
                  </h4>
                  <div style={{ marginBottom: '10px' }} className="btn-toolbar pull-right">
                    <div className="btn-group">
                      <Link
                        to={`/admin/boardmeetings/${meeting.department_id}/agenda-points/${meeting.id}`}
                        className="btn btn-md btn-inverse-dark btn-fw"
                        style={{ float: 'right' }}
                        title="Show all agenda points"
                      >
                        <i className="ti-layers-alt text-primary mr-1"></i>
                        Show all Agenda Points
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <p>
                    <strong className="text-success">Meeting Subject: </strong>
                    <strong>{meeting.subject}</strong>
                  </p>
                  <p>
                    <strong className="text-success">Date: </strong>
                    {formatDate(meeting.date)}
                  </p>
                </div>
              </div>

              <form
                className="form-sample"
                onSubmit={handleSubmit}
                encType="multipart/form-data"
                id="edit_agenda_point_form"
              >
                <p className="card-description">
                  <input type="hidden" name="modified_by" value="1" /> {/* Will be replaced with actual user ID */}
                  <input type="hidden" name="board_meeting_id" value={meeting.id} />
                  <input type="hidden" name="board" value={meeting.department_id} />
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
                      <label>Status</label>
                      <select
                        id="status"
                        name="status"
                        style={{ width: '300px' }}
                        className="js-example-basic-multiple w-100 form-control form-control-lg"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                      >
                        {Object.entries(statuses).map(([key, value]) => (
                          <option key={key} value={key}>
                            {value}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label>Is highlight this agenda item?</label>
                      <select
                        id="is_hilight"
                        name="is_hilight"
                        style={{ width: '300px' }}
                        className="js-example-basic-multiple w-100 form-control form-control-lg"
                        value={isHighlight}
                        onChange={(e) => setIsHighlight(e.target.value)}
                      >
                        {Object.entries(highlights).map(([key, value]) => (
                          <option key={key} value={key}>
                            {value}
                          </option>
                        ))}
                      </select>
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

