/**
 * Edit CM Remark - Admin Module
 * EXACT replica of admin/cmremarks/edit.blade.php from old CMDMS
 */

import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { mockCMRemarks } from '../../../lib/mocks/data/cmRemarks';
import { mockSections } from '../../../lib/mocks/data/cmRemarks';
import { mockDepartments } from '../../../lib/mocks/data/departments';

// sectorialStatuses from old CMDMS
const sectorialStatuses: Record<string, string> = {
  '2': 'On Target',
  '1': 'Completed',
  '3': 'Overdue',
  '4': 'Off Target',
  '6': 'Overdue Other Reason',
  '7': 'Ongoing',
  '9': 'Off Target Reason'
};

export default function EditCMRemark() {
  const { id } = useParams<{ id: string }>();
  const cmRemark = mockCMRemarks.find(r => r.id === Number(id));

  const [subject, setSubject] = useState('');
  const [letterNumber, setLetterNumber] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [timeline, setTimeline] = useState('');
  const [sectionId, setSectionId] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [departments, setDepartments] = useState<number[]>([]);
  const [comments, setComments] = useState('');
  const [attachmentFiles, setAttachmentFiles] = useState<FileList | null>(null);
  const [removeAttachments, setRemoveAttachments] = useState<string[]>([]);

  useEffect(() => {
    if (cmRemark) {
      setSubject(cmRemark.subject);
      setLetterNumber(cmRemark.letter_number);
      setIssueDate(cmRemark.issue_date);
      setTimeline(cmRemark.timeline);
      setSectionId(cmRemark.section_id.toString());
      setStatus(typeof cmRemark.status === 'number' ? String(cmRemark.status) : cmRemark.status);
      setDepartments(cmRemark.departments.map(d => d.id));
      setComments(cmRemark.comments || '');
    }
  }, [cmRemark]);

  if (!cmRemark) {
    return (
      <div className="content-wrapper">
        <div className="alert alert-danger">CM Remark not found</div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Update CM Remark:', {
      id: cmRemark.id,
      subject,
      letter_number: letterNumber,
      issue_date: issueDate,
      timeline,
      section_id: sectionId,
      status,
      departments,
      comments,
      attachments: attachmentFiles ? Array.from(attachmentFiles) : [],
      remove_attachments: removeAttachments
    });
    alert('Update CM Remark functionality will be implemented with backend API');
    // Navigate would be: navigate('/admin/cmremarks');
  };

  const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions);
    const selectedIds = selectedOptions.map(option => parseInt(option.value));
    setDepartments(selectedIds);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachmentFiles(e.target.files);
    }
  };

  const handleRemoveAttachment = (attachment: string, checked: boolean) => {
    if (checked) {
      setRemoveAttachments([...removeAttachments, attachment]);
    } else {
      setRemoveAttachments(removeAttachments.filter(a => a !== attachment));
    }
  };

  const getFileExtension = (filename: string) => {
    return filename.split('.').pop()?.toLowerCase() || '';
  };

  const isImageFile = (filename: string) => {
    const ext = getFileExtension(filename);
    return ['jpg', 'jpeg', 'png', 'gif'].includes(ext);
  };

  return (
    <div className="content-wrapper">
      <style>
        {`
          .select2-container--default.select2-container--focus .select2-selection--multiple {
            height: 155px !important;
          }
          .chosen-container .chosen-results {
            max-height: 200px !important;
          }
          .select2-container--default .select2-selection--multiple .select2-selection__rendered {
            height: 140px !important;
          }
        `}
      </style>
      <div className="row">
        <div className="col-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <Link to="/admin/cmremarks" style={{ float: 'right' }}>
                Show All CM Remarks
              </Link>
              <p className="card-title"><strong>Edit CM Remarks</strong></p>

              <form className="form-sample" onSubmit={handleSubmit} encType="multipart/form-data" id="record_note_form">
                <div className="row">
                  <div className="col-md-12">
                    <div className="form-group">
                      <label>Subject</label>
                      <input
                        type="text"
                        name="subject"
                        id="cmremarks_subject"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="form-control"
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label>Letter Number</label>
                      <input
                        type="text"
                        name="letter_number"
                        id="letter_number"
                        value={letterNumber}
                        onChange={(e) => setLetterNumber(e.target.value)}
                        className="form-control"
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label>Issue Date</label>
                      <input
                        type="date"
                        name="issue_date"
                        id="issue_date"
                        value={issueDate}
                        onChange={(e) => setIssueDate(e.target.value)}
                        className="form-control"
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label>Timeline</label>
                      <input
                        type="date"
                        name="timeline"
                        id="timeline"
                        value={timeline}
                        onChange={(e) => setTimeline(e.target.value)}
                        className="form-control"
                      />
                    </div>
                  </div>

                  <div className="col-md-3">
                    <label>From Section</label>
                    <div className="form-group">
                      <select
                        name="section_id"
                        id="section_id"
                        className="w-100 form-control form-control-lg"
                        value={sectionId}
                        onChange={(e) => setSectionId(e.target.value)}
                      >
                        <option value="">Select From Section</option>
                        {mockSections.map((section) => (
                          <option key={section.id} value={section.id}>
                            {section.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label>Attach Letter</label>
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
                            Select
                          </button>
                        </span>
                      </div>
                    </div>
                    {cmRemark.attachments && cmRemark.attachments.length > 0 && (
                      <div className="mt-2">
                        {cmRemark.attachments.map((attachment, idx) => (
                          <div key={idx} className="mt-3">
                            <input
                              type="checkbox"
                              name="remove_attachments[]"
                              value={attachment}
                              checked={removeAttachments.includes(attachment)}
                              onChange={(e) => handleRemoveAttachment(attachment, e.target.checked)}
                            /> Remove
                            {isImageFile(attachment) ? (
                              <a href="#" target="_blank" onClick={(e) => { e.preventDefault(); console.log('View attachment:', attachment); }}>
                                <img src="#" alt="Attachment" width="100" height="100" style={{ marginLeft: '10px' }} />
                              </a>
                            ) : (
                              <a href="#" target="_blank" onClick={(e) => { e.preventDefault(); console.log('View attachment:', attachment); }} style={{ marginLeft: '10px' }}>
                                {attachment}
                              </a>
                            )}
                            <br />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label>Status</label>
                      <select
                        name="status"
                        id="cmremark_status"
                        className="w-100 form-control form-control-lg"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                      >
                        {Object.entries(sectorialStatuses).map(([key, label]) => (
                          <option key={key} value={key} selected={key === status}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="form-group">
                      <label htmlFor="departments">To Departments</label>
                      <select
                        id="cmremarks_departments"
                        name="departments[]"
                        style={{ width: '100%', height: '300px' }}
                        className="w-100 form-control form-control-lg"
                        required
                        multiple
                        value={departments.map(d => d.toString())}
                        onChange={handleDepartmentChange}
                      >
                        {mockDepartments.map((department) => (
                          <option key={department.id} value={department.id}>
                            {department.name.replace(/<[^>]*>/g, '')}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="col-md-12">
                    <label>Departments Summerize Progress</label>
                    <div className="form-group">
                      <textarea
                        name="comments"
                        id="cmremarks_comments"
                        rows={10}
                        cols={140}
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                        className="form-control"
                      />
                    </div>
                  </div>
                </div>

                <button type="submit" className="btn btn-success mr-2 pull-right">
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
