/**
 * Announcement Replies / Chat History - Admin Module
 * EXACT replica of admin/announcements/reply.blade.php from old CMDMS
 */

import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';

export default function AnnouncementReplies() {
  const { id } = useParams<{ id: string }>();

  // Mock announcement detail data
  const announcementDetail = {
    id: Number(id),
    title: 'Announcement regarding infrastructure development in district',
    announcement: {
      id: 1,
      district: { name: 'Peshawar' }
    },
    department: { name: 'Health Department' },
    otherDepartments: [
      { id: 2, name: 'Education Department' },
      { id: 3, name: 'Social Welfare' }
    ],
    creator: {
      name: 'Admin User',
      phone: '+92-300-1234567'
    },
    attachments: [
      { url: '#', iconClass: 'ti-file', label: 'document1.pdf' },
      { url: '#', iconClass: 'ti-file', label: 'image1.jpg' }
    ]
  };

  // Mock replies data
  const replies = [
    {
      id: 1,
      user: {
        role_id: 1, // Admin
        name: 'Admin Officer',
        phone: '+92-300-1111111',
        department: null
      },
      reply_detail: '<p>Initial announcement has been shared with all departments. Please provide your progress updates.</p>',
      taggedDepartments: [
        { id: 2, name: 'Education Department' },
        { id: 3, name: 'Social Welfare' }
      ],
      attachments: null,
      status: { label: 'On Target', badgeClass: 'badge-info' },
      remarks: null,
      reason: null,
      created_at: '15 December, 2025 10:30 am'
    },
    {
      id: 2,
      user: {
        role_id: 5, // Department
        name: 'Department Officer',
        phone: '+92-300-2222222',
        department: { name: 'Education Department' }
      },
      reply_detail: '<p>We have started the initial planning phase. Expected completion within 2 weeks.</p>',
      taggedDepartments: [],
      attachments: [
        { url: '#', iconClass: 'ti-file', label: 'progress_report.pdf' }
      ],
      status: { label: 'On Target', badgeClass: 'badge-info' },
      remarks: null,
      reason: null,
      created_at: '15 December, 2025 02:45 pm'
    },
    {
      id: 3,
      user: {
        role_id: 1, // Admin
        name: 'Admin User',
        phone: '+92-300-1111111',
        department: null
      },
      reply_detail: '<p>Good progress. Please keep us updated on the milestone achievements.</p>',
      taggedDepartments: [
        { id: 2, name: 'Education Department' }
      ],
      attachments: null,
      status: { label: 'Completed', badgeClass: 'badge-success' },
      remarks: null,
      reason: null,
      created_at: '16 December, 2025 09:15 am'
    }
  ];

  const [formData, setFormData] = useState({
    reply_detail: '',
    tagged_department_ids: [] as number[],
    attachments: [] as File[]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submit reply:', { detail_id: id, ...formData });
    alert('Reply functionality will be implemented with backend API');
  };

  return (
    <div className="content-wrapper">
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header text-center">
              <div className="d-flex gap-3 justify-content-between align-items-center">
                <div className="flex-grow-1 text-center">
                  <p className="block display-4">Announcements</p>
                </div>
                <div>
                  <div className="btn-toolbar pull-right">
                    <div className="btn-group">
                      <Link
                        to={`/admin/announcements/edit/${announcementDetail.announcement.id}#detail${announcementDetail.id}`}
                        className="btn btn-outline-primary btn-fw"
                        style={{ float: 'right' }}
                      >
                        <i className="ti-arrow-left text-primary mr-1"></i>Back
                      </Link>

                      <a href="#add-reply" className="btn btn-outline-primary btn-fw" role="button">
                        <i className="ti-share-alt mr-1"></i>
                        Reply
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="card-body">
              <div className="card-title">
                <p className="display-5 text-dark mb-3">
                  <span dangerouslySetInnerHTML={{ __html: announcementDetail.title }}></span> -{' '}
                  <span className="text-muted">{announcementDetail.announcement.district.name}</span>
                </p>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <p className="font-weight-bold text-dark">
                    <i className="fa fa-institution"></i> Departments
                  </p>
                  <ul className="list-arrow ml-2">
                    {announcementDetail.department && (
                      <li>
                        <span className="text-capitalize font-weight-bold">
                          {announcementDetail.department.name}
                        </span>
                      </li>
                    )}
                    {announcementDetail.otherDepartments.map((dept) => (
                      <li key={dept.id}>
                        <span className="text-capitalize">{dept.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="col-md-6">
                  {announcementDetail.attachments && announcementDetail.attachments.length > 0 && (
                    <>
                      <p className="font-weight-bold text-dark">
                        <i className="fa fa-briefcase"></i> Attachments
                      </p>
                      <div className="ml-sm-3 ml-md-0 ml-xl-3 mt-2 mt-sm-0 mt-md-2 mt-xl-0">
                        <ol>
                          {announcementDetail.attachments.map((attachment, idx) => (
                            <li key={idx}>
                              <a href={attachment.url} target="_blank" rel="noopener noreferrer">
                                <i className={attachment.iconClass}></i>
                                <small>{attachment.label}</small>
                              </a>
                            </li>
                          ))}
                        </ol>
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="row">
                <div className="col">
                  <ul className="nav profile-navbar d-flex justify-content-end border-top">
                    {announcementDetail.creator?.name && (
                      <li className="nav-item">
                        <a className="nav-link" href="#">
                          <i className="fa fa-user-circle" style={{ color: '#248afd' }}></i>
                          {announcementDetail.creator.name}
                        </a>
                      </li>
                    )}
                    {announcementDetail.creator?.phone && (
                      <li className="nav-item">
                        <a className="nav-link active" href="#">
                          <i className="fa fa-phone-square"></i>
                          {announcementDetail.creator.phone}
                        </a>
                      </li>
                    )}
                  </ul>
                </div>
              </div>

              {/* Timeline History Section */}
              <div className="mt-3">
                <div>
                  <h4 className="text-center">History</h4>
                </div>
                <hr />
                {replies.length > 0 ? (
                  <div className="timeline">
                    {replies.map((reply) => {
                      const isAdmin = reply.user.role_id === 1 || reply.user.role_id === 2;
                      
                      return (
                        <div
                          key={reply.id}
                          className={`timeline-wrapper ${
                            isAdmin ? 'timeline-wrapper-success' : 'timeline-inverted timeline-wrapper-primary'
                          }`}
                        >
                          <div className="timeline-badge"></div>
                          <div
                            className={`timeline-panel ${isAdmin ? 'admin-user-bg-color' : 'auth-user-bg-color'}`}
                            id={`reply${reply.id}`}
                          >
                            <div className="timeline-heading">
                              <h6 className="timeline-title">
                                <i className="ti-share-alt text-primary mr-1"></i>
                                {isAdmin ? 'Admin' : reply.user.department?.name || ''}
                              </h6>
                              <div className="mb-3">
                                {reply.user.name && (
                                  <small className="text-muted mb-0">
                                    <i className="fa fa-user-circle mr-1"></i>
                                    {reply.user.name}
                                  </small>
                                )}
                                {reply.user.phone && (
                                  <small className="text-muted mb-0 ml-3">
                                    <i className="fa fa-phone-square mr-1"></i>
                                    {reply.user.phone}
                                  </small>
                                )}
                              </div>
                            </div>
                            <div className="timeline-body mb-3">
                              {/* Tagged Departments */}
                              {reply.taggedDepartments && reply.taggedDepartments.length > 0 && (
                                <ul className="list-inline" style={{ padding: 0, margin: 0 }}>
                                  {reply.taggedDepartments.map((tagDept) => (
                                    <li
                                      key={tagDept.id}
                                      className="list-inline-item"
                                      style={{
                                        display: 'inline-block',
                                        fontSize: '14px',
                                        fontWeight: 'bold',
                                        color: '#007bff',
                                        marginRight: '10px'
                                      }}
                                    >
                                      <i className="fas fa-tag" style={{ color: '#007bff', marginRight: '5px' }}></i>
                                      {tagDept.name}
                                    </li>
                                  ))}
                                </ul>
                              )}
                              
                              {/* Reply Detail */}
                              <div
                                className="mt-3 mb-3 text-justify"
                                dangerouslySetInnerHTML={{ __html: reply.reply_detail }}
                              ></div>

                              {/* Attachments */}
                              {reply.attachments && reply.attachments.length > 0 && (
                                <div>
                                  <ol>
                                    {reply.attachments.map((att: any, idx: number) => (
                                      <li key={idx}>
                                        <a href={att.url} target="_blank" rel="noopener noreferrer">
                                          <i className={att.iconClass}></i>
                                          <small>{att.label}</small>
                                        </a>
                                      </li>
                                    ))}
                                  </ol>
                                </div>
                              )}

                              {/* Remarks/Reason */}
                              {reply.remarks && (
                                <div className="mb-2">
                                  <span className="font-weight-bold">Remarks: </span>
                                  <span className="font-weight-bold text-primary">{reply.remarks}</span>
                                </div>
                              )}
                              {reply.reason && (
                                <div className="mb-2">
                                  <span className="font-weight-bold">Reason: </span>
                                  <span className="mt-1 small">{reply.reason}</span>
                                </div>
                              )}
                            </div>
                            <div className="timeline-footer d-flex align-items-center flex-wrap">
                              <div>
                                <span className={`badge ${reply.status.badgeClass}`}>
                                  {reply.status.label}
                                </span>
                              </div>
                              <span className="ml-md-auto font-weight-bold">{reply.created_at}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div>There is no reply so far</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Reply Form */}
      <div className="row" id="add-reply">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-body">
              <form className="form-sample" id="admin_reply_form" onSubmit={handleSubmit} encType="multipart/form-data">
                <input type="hidden" name="detail_id" value={id} />
                <fieldset>
                  <div className="row">
                    <div className="col-md-12">
                      <div className="form-group">
                        <label>Progress Reply</label>
                        <textarea
                          className="form-control"
                          id="reply_detail"
                          placeholder="type reply here..."
                          name="reply_detail"
                          rows={6}
                          value={formData.reply_detail}
                          onChange={(e) => setFormData({ ...formData, reply_detail: e.target.value })}
                        ></textarea>
                      </div>
                      <div className="form-group">
                        <label htmlFor="tag_departments_dropdown" className="text-dark">
                          <b>Tag departments</b>
                        </label>
                        <select
                          id="tag_departments_dropdown"
                          name="tagged_department_ids[]"
                          style={{ width: '300px', minHeight: '150px' }}
                          className="js-example-basic-multiple w-100 form-control form-control-lg mb-3"
                          multiple
                          value={formData.tagged_department_ids.map(String)}
                          onChange={(e) => {
                            const selectedOptions = Array.from(
                              e.target.selectedOptions,
                              (option) => Number(option.value)
                            );
                            setFormData({ ...formData, tagged_department_ids: selectedOptions });
                          }}
                        >
                          {announcementDetail.department && (
                            <option value={announcementDetail.department.name}>
                              {announcementDetail.department.name}
                            </option>
                          )}
                          {announcementDetail.otherDepartments.map((dept) => (
                            <option key={dept.id} value={dept.id}>
                              {dept.name}
                            </option>
                          ))}
                        </select>
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
                          onChange={(e) => {
                            if (e.target.files) {
                              setFormData({ ...formData, attachments: Array.from(e.target.files) });
                            }
                          }}
                        />
                        <div className="input-group col-xs-12">
                          <input
                            type="text"
                            className="form-control file-upload-info"
                            disabled
                            placeholder="Upload files"
                            value={formData.attachments.length > 0 ? `${formData.attachments.length} file(s) selected` : ''}
                          />
                          <span className="input-group-append">
                            <button className="file-upload-browse btn btn-success" type="button">
                              Select Files
                            </button>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <input className="btn btn-primary pull-right" type="submit" value="Submit" />
                </fieldset>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
