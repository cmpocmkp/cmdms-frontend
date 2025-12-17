/**
 * Add CM Remark - Admin Module
 * EXACT replica of admin/cmremarks/add.blade.php from old CMDMS
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
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

export default function AddCMRemark() {
  const [subject, setSubject] = useState('');
  const [letterNumber, setLetterNumber] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [timeline, setTimeline] = useState('');
  const [sectionId, setSectionId] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [departments, setDepartments] = useState<number[]>([]);
  const [attachmentFiles, setAttachmentFiles] = useState<FileList | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Add CM Remark:', {
      subject,
      letter_number: letterNumber,
      issue_date: issueDate,
      timeline,
      section_id: sectionId,
      status,
      departments,
      attachments: attachmentFiles ? Array.from(attachmentFiles) : []
    });
    alert('Add CM Remark functionality will be implemented with backend API');
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
                Show all CM Remarks
              </Link>
              <p className="card-title"><strong>Add new CM Remarks</strong></p>

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
                          <option key={key} value={key}>
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
                </div>

                <button type="submit" className="btn btn-success mr-2 pull-right">
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
