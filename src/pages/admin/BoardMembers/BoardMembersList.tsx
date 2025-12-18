/**
 * Board Members List - Admin Module
 * EXACT replica of admin/boardmembers/index.blade.php from old CMDMS
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { mockBoardMembers, boardMemberTypes } from '../../../lib/mocks/data/boardMembers';

// Format date as 'd-m-Y'
const formatDate = (dateString?: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

export default function BoardMembersList() {
  const [boardMembers] = useState(mockBoardMembers);

  return (
    <div className="content-wrapper">
      <div className="card">
        <div className="card-body">
          <Link to="/admin/boardmembers/add" style={{ float: 'right' }}>
            Add board member
          </Link>
          <h4 className="card-title text-primary">Board Members</h4>

          <div className="row">
            <div className="col-12">
              <div className="table-responsive">
                <table id="record-note-listing" className="table table-striped" role="grid">
                  <thead>
                    <tr>
                      <th>S.No</th>
                      <th>
                        Member<br /> Name
                      </th>
                      <th>
                        Board<br /> Name
                      </th>
                      <th>Qualification</th>
                      <th>Designation</th>
                      <th>Resume</th>
                      <th>Notification</th>
                      <th>Photo</th>
                      <th>Domicile</th>
                      <th>Joining date</th>
                      <th>Expiration date</th>
                      <th>Phone</th>
                      <th>Mobile</th>
                      <th>Email</th>
                      <th>Nic</th>
                      <th>Address</th>
                      <th>Type</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {boardMembers.length > 0 ? (
                      boardMembers.map((member, index) => (
                        <tr key={member.id}>
                          <td>{index + 1}</td>
                          <td>{member.name ?? ''}</td>
                          <td>{member.department_name ?? ''}</td>
                          <td>{member.qualification ?? ''}</td>
                          <td>{member.designation ?? ''}</td>
                          <td>
                            {member.resume ? (
                              <span>
                                <a
                                  href="#"
                                  target="_blank"
                                  title="click to download attach file"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    console.log('Download resume:', member.resume);
                                  }}
                                >
                                  Download Resume:<i className="ti-file"></i>
                                </a>
                              </span>
                            ) : (
                              ''
                            )}
                          </td>
                          <td>
                            {member.notification ? (
                              <span>
                                <a
                                  href="#"
                                  target="_blank"
                                  title="click to download attach file"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    console.log('Download notification:', member.notification);
                                  }}
                                >
                                  Download Notification:<i className="ti-file"></i>
                                </a>
                              </span>
                            ) : (
                              ''
                            )}
                          </td>
                          <td>
                            {member.photo ? (
                              <span>
                                <img
                                  height={100}
                                  width={100}
                                  src="#"
                                  alt="Member photo"
                                  title="click to download attach file"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    console.log('View photo:', member.photo);
                                  }}
                                  style={{ cursor: 'pointer' }}
                                />
                              </span>
                            ) : (
                              ''
                            )}
                          </td>
                          <td>{member.domicile ?? ''}</td>
                          <td>{formatDate(member.joining_date)}</td>
                          <td>{formatDate(member.expiration_date)}</td>
                          <td>{member.phone ?? ''}</td>
                          <td>{member.mobile ?? ''}</td>
                          <td>{member.email ?? ''}</td>
                          <td>{member.nic ?? ''}</td>
                          <td>
                            <div dangerouslySetInnerHTML={{ __html: member.address || '' }} />
                          </td>
                          <td>
                            {member.type ? boardMemberTypes[member.type] || member.type : ''}
                          </td>
                          <td>
                            <Link
                              to={`/admin/boardmembers/edit/${member.id}`}
                              style={{ float: 'left', marginLeft: '20px' }}
                              className="text-primary mr-2 mb-2"
                            >
                              <i className="ti-pencil-alt icon-sm"></i>
                            </Link>
                            &nbsp;&nbsp;
                            <form
                              action="#"
                              method="POST"
                              style={{ float: 'left', marginLeft: '20px' }}
                              onSubmit={(e) => {
                                e.preventDefault();
                                if (confirm('Are you sure to delete?')) {
                                  console.log('Delete board member:', member.id);
                                  alert('Delete functionality will be implemented with backend API');
                                }
                              }}
                            >
                              <button
                                type="submit"
                                className="btn btn-danger btn-icon-text"
                                title="delete"
                              >
                                <i className="ti-trash icon-sm"></i>
                              </button>
                            </form>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td style={{ textAlign: 'center' }} colSpan={16}>
                          There is no data in table
                        </td>
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

