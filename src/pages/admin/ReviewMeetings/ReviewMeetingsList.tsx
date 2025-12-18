/**
 * Review Meetings List - Admin Module
 * EXACT replica of admin/reviewmeetings/index.blade.php from old CMDMS
 */

import { Link } from 'react-router-dom';
import { mockReviewMeetings } from '../../../lib/mocks/data/reviewMeetings';
import { mockAdminDepartments } from '../../../lib/mocks/data/adminDepartments';

// Format date as 'd/m/Y'
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export default function ReviewMeetingsList() {
  return (
    <div className="content-wrapper">
      <div className="card">
        <div className="card-body">
          <Link to="/admin/reviewmeetings/add" style={{ float: 'right' }}>
            Add review Meeting
          </Link>
          <h4 className="card-title text-primary">Review Meetings</h4>

          <div className="row">
            <div className="col-12">
              <div className="table-responsive">
                <table id="record-note-listing" className="table table-striped" role="grid">
                  <thead>
                    <tr>
                      <th>S.NO</th>
                      <th>Timestamps/Identifier</th>
                      <th>Subject</th>
                      <th>Date</th>
                      <th>Discussion</th>
                      <th>Number of <br/>discussed decisions</th>
                      <th>Number of <br/>updated decisions</th>
                      <th>Departments</th>
                      <th>Participants</th>
                      <th>Picture's</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockReviewMeetings.length > 0 ? (
                      mockReviewMeetings.map((reviewMeeting) => {
                        const departments = mockAdminDepartments.filter(d => 
                          reviewMeeting.departments.includes(d.id)
                        );
                        return (
                          <tr key={reviewMeeting.id}>
                            <td>{reviewMeeting.id}</td>
                            <td>
                              Created at: <span className="text-muted">{formatDate(reviewMeeting.created_at)}</span> <br/><br/>
                              Created by: <span className="text-muted">{reviewMeeting.creator_name || 'N/A'}</span> <br/><br/>
                              Updated at: <span className="text-muted">{formatDate(reviewMeeting.updated_at)}</span> <br/><br/>
                              Last Updated by: <span className="text-muted">{reviewMeeting.editor_name || 'N/A'}</span>
                            </td>
                            <td>
                              <div dangerouslySetInnerHTML={{ __html: reviewMeeting.subject }} />
                            </td>
                            <td>{formatDate(reviewMeeting.date)}</td>
                            <td>
                              <div dangerouslySetInnerHTML={{ __html: reviewMeeting.discussion }} />
                            </td>
                            <td>{reviewMeeting.number_of_discussed_decisions}</td>
                            <td>{reviewMeeting.number_of_updated_decisions}</td>
                            <td>
                              {departments.length > 0 && (
                                <>
                                  ({departments.length})
                                  <br />
                                </>
                              )}
                              {departments.map((dept, idx) => (
                                <span key={dept.id}>
                                  {dept.name}
                                  {idx < departments.length - 1 && <br />}
                                </span>
                              ))}
                            </td>
                            <td>
                              <div dangerouslySetInnerHTML={{ __html: reviewMeeting.participants }} />
                            </td>
                            <td>
                              {reviewMeeting.images && reviewMeeting.images.length > 0 ? (
                                reviewMeeting.images.map((image, idx) => (
                                  <span key={idx} style={{ marginRight: '5px' }}>
                                    <a href={image} title="click to view" target="_blank" rel="noopener noreferrer">
                                      <img width="150" height="150" src={image} alt={`Image ${idx + 1}`} />
                                    </a>
                                  </span>
                                ))
                              ) : (
                                <>&nbsp;</>
                              )}
                            </td>
                            <td>
                              <Link
                                to={`/admin/reviewmeetings/edit/${reviewMeeting.id}`}
                                style={{ float: 'left', marginLeft: '20px' }}
                                className="text-primary mr-2"
                                title="edit"
                              >
                                <i className="ti-pencil-alt icon-sm"></i>
                              </Link>
                              <form
                                action="#"
                                method="post"
                                style={{ float: 'left', marginLeft: '20px' }}
                                onSubmit={(e) => {
                                  e.preventDefault();
                                  if (confirm('Are you sure to delete?')) {
                                    console.log('Delete review meeting:', reviewMeeting.id);
                                    alert('Delete functionality will be implemented with backend API');
                                  }
                                }}
                              >
                                <button
                                  type="submit"
                                  className="btn btn-danger btn-sm btn-icon-text"
                                  title="delete"
                                >
                                  <i className="ti-trash icon-sm"></i>
                                </button>
                              </form>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={11} className="text-center">There is no data.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
