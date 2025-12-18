/**
 * Edit Review Meeting - Admin Module
 * EXACT replica of admin/reviewmeetings/edit.blade.php from old CMDMS
 */

import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { mockReviewMeetings } from '../../../lib/mocks/data/reviewMeetings';
import { mockAdminDepartments } from '../../../lib/mocks/data/adminDepartments';

export default function EditReviewMeeting() {
  const { id } = useParams<{ id: string }>();
  const reviewMeeting = mockReviewMeetings.find(rm => rm.id === Number(id));

  const [subject, setSubject] = useState('');
  const [discussion, setDiscussion] = useState('');
  const [date, setDate] = useState('');
  const [numberOfDiscussedDecisions, setNumberOfDiscussedDecisions] = useState('');
  const [numberOfUpdatedDecisions, setNumberOfUpdatedDecisions] = useState('');
  const [isActive, setIsActive] = useState('');
  const [departments, setDepartments] = useState<string[]>([]);
  const [participants, setParticipants] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [fileInputValue, setFileInputValue] = useState('');

  useEffect(() => {
    if (reviewMeeting) {
      setSubject(reviewMeeting.subject);
      setDiscussion(reviewMeeting.discussion);
      setDate(reviewMeeting.date);
      setNumberOfDiscussedDecisions(reviewMeeting.number_of_discussed_decisions.toString());
      setNumberOfUpdatedDecisions(reviewMeeting.number_of_updated_decisions.toString());
      setDepartments(reviewMeeting.departments.map(d => d.toString()));
      setParticipants(reviewMeeting.participants);
    }
  }, [reviewMeeting]);

  if (!reviewMeeting) {
    return (
      <div className="content-wrapper">
        <div className="alert alert-danger">Review Meeting not found</div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Update Review Meeting:', {
      id: reviewMeeting.id,
      subject,
      discussion,
      date,
      number_of_discussed_decisions: numberOfDiscussedDecisions,
      number_of_updated_decisions: numberOfUpdatedDecisions,
      is_active: isActive,
      departments,
      participants,
      images: selectedFiles
    });
    alert('Update Review Meeting functionality will be implemented with backend API');
  };

  const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setDepartments(selectedOptions);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedFiles(files);
      setFileInputValue(e.target.files.length > 0 ? `${e.target.files.length} file(s) selected` : '');
    }
  };

  const handleFileUploadClick = () => {
    const fileInput = document.getElementById('images-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  };

  return (
    <div className="content-wrapper">
      <style>
        {`
          .select2-container--default .select2-selection--multiple .select2-selection__rendered {
            height: 140px !important;
          }
        `}
      </style>
      <div className="card">
        <div className="card-body">
          <Link to="/admin/reviewmeetings" style={{ float: 'right' }}>
            Show Review Meetings
          </Link>
          <h4 className="card-title text-primary">Edit review meeting</h4>
        </div>
      </div>
      <div className="card">
        <div className="card-body">
          <div className="row">
            <div className="col-md-12">
              <form
                className="form-sample"
                onSubmit={handleSubmit}
                encType="multipart/form-data"
                id="record_note_form"
              >
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Subject</label>
                      <textarea
                        name="subject"
                        className="form-control"
                        id="subject"
                        rows={4}
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label>Discussion</label>
                    <div className="form-group">
                      <textarea
                        name="discussion"
                        className="form-control"
                        id="addmeetingsubject"
                        rows={4}
                        value={discussion}
                        onChange={(e) => setDiscussion(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>Date</label>
                      <input
                        type="date"
                        name="date"
                        id="review_meeting_date"
                        value={date}
                        className="form-control"
                        required
                        onChange={(e) => setDate(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>Number of discussed decisions</label>
                      <input
                        type="number"
                        name="number_of_discussed_decisions"
                        id="number_of_discussed_decisions"
                        value={numberOfDiscussedDecisions}
                        className="form-control"
                        onChange={(e) => setNumberOfDiscussedDecisions(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>Number of updated decisions</label>
                      <input
                        type="number"
                        name="number_of_updated_decisions"
                        id="number_of_updated_decisions"
                        value={numberOfUpdatedDecisions}
                        className="form-control"
                        onChange={(e) => setNumberOfUpdatedDecisions(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>Status</label>
                      <select
                        name="is_active"
                        id="review_meeting_is_active"
                        className="js-example-basic-single w-100 form-control form-control-lg"
                        value={isActive}
                        onChange={(e) => setIsActive(e.target.value)}
                      >
                        <option value="">Select</option>
                        <option value="1">Active</option>
                        <option value="0">Inactive</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-12">
                    <label>
                      Departments<small> (you can select multipple departments)</small>
                    </label>
                    <div className="form-group">
                      <select
                        id="add_departments_dropdown"
                        name="departments[]"
                        style={{ width: '100%', height: '200px' }}
                        className="js-example-basic-multiple w-100 form-control form-control-lg"
                        multiple
                        value={departments}
                        onChange={handleDepartmentChange}
                      >
                        {mockAdminDepartments.map((department) => (
                          <option key={department.id} value={department.id.toString()}>
                            {department.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="form-group">
                      <label>Participants</label>
                      <textarea
                        className="form-control"
                        id="attendies"
                        name="participants"
                        rows={5}
                        value={participants}
                        onChange={(e) => setParticipants(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label>Upload Multiple images</label>
                      <input
                        type="file"
                        id="images-upload"
                        name="images[]"
                        className="file-upload-default"
                        multiple
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                      />
                      <div className="input-group col-xs-12">
                        <input
                          type="text"
                          className="form-control file-upload-info"
                          disabled
                          placeholder="Upload Images"
                          value={fileInputValue}
                        />
                        <span className="input-group-append">
                          <button
                            className="file-upload-browse btn btn-success"
                            type="button"
                            onClick={handleFileUploadClick}
                          >
                            Upload images
                          </button>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-12 mb-2">
                    {reviewMeeting.images && reviewMeeting.images.length > 0 && (
                      <>
                        {reviewMeeting.images.map((image, idx) => (
                          <span key={idx} style={{ marginRight: '10px' }}>
                            <a
                              href={image}
                              title="click to view"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <img width="75" height="75" src={image} alt={`Image ${idx + 1}`} />
                            </a>
                          </span>
                        ))}
                      </>
                    )}
                  </div>
                </div>

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
