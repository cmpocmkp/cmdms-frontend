/**
 * Inaugurations List - Admin Module
 * EXACT replica of admin/inaugrations/index.blade.php from old CMDMS
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { mockInaugurations } from '../../../lib/mocks/data/inaugurations';

// Format date as 'jS F' (e.g., "15th December")
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleDateString('en-GB', { month: 'long' });
  
  // Add ordinal suffix
  const getOrdinalSuffix = (n: number): string => {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };
  
  return `${getOrdinalSuffix(day)} ${month}`;
};

export default function InaugurationsList() {
  const [inaugurations] = useState(mockInaugurations);

  return (
    <div className="content-wrapper">
      <style>
        {`
          table#directive-listing td p {
            width: 100px !important;
          }
          table#directive-listing td {
            width: 100px !important;
          }
          table#directive-listing th {
            padding: 10px !important;
          }
          .modal .modal-dialog {
            margin-top: 70px !important;
          }
          /* Action column icon buttons styling */
          table#directive-listing td .btn-icon-text {
            width: 32px;
            height: 32px;
            padding: 0;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border-radius: 4px;
            margin-right: 8px;
          }
          table#directive-listing td .btn-icon-text i {
            font-size: 14px;
            line-height: 1;
          }
          table#directive-listing td .btn-icon-text:hover {
            opacity: 0.9;
            transform: translateY(-1px);
            box-shadow: 0 2px 4px rgba(0,0,0,0.15);
          }
        `}
      </style>
      <div className="card">
        <div className="card-body">
          <Link to="/admin/inaugurations/add" style={{ float: 'right' }}>
            Add Inauguration
          </Link>
          <h4 className="card-title text-primary">inaugurations</h4>

          <div className="row">
            <div className="col-12">
              <div className="table-responsive">
                <table id="directive-listing" className="table-striped" role="grid">
                  <thead>
                    <tr>
                      <th style={{ width: '15px' }}>S.NO</th>
                      <th style={{ width: '100px' }}>Department</th>
                      <th style={{ width: '100px' }}>Scheme<br/>/Project Name</th>
                      <th style={{ width: '100px' }}>Cost in Millions</th>
                      <th style={{ width: '100px' }}>Inaugurations<br/>/GroundBreaking</th>
                      <th style={{ width: '100px' }}>District</th>
                      <th style={{ width: '100px' }}>Division</th>
                      <th style={{ width: '100px' }}>Expected Date</th>
                      <th style={{ width: '100px' }}>Remarks</th>
                      <th style={{ width: '100px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inaugurations.length > 0 ? (
                      inaugurations.map((inauguration, index) => (
                        <tr key={inauguration.id}>
                          <td style={{ width: '15px' }}>{index + 1}</td>
                          <td style={{ width: '100px' }}>{inauguration.department_name}</td>
                          <td style={{ width: '100px' }}>
                            <div dangerouslySetInnerHTML={{ __html: (inauguration.project_name || '') }} />
                            <br/>
                            <div dangerouslySetInnerHTML={{ __html: (inauguration.scheme || '') }} />
                            <br/>
                            {inauguration.attachments && inauguration.attachments.length > 0 && (
                              <>
                                {inauguration.attachments.map((file, idx) => (
                                  <span key={idx}>
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
                              </>
                            )}
                          </td>
                          <td style={{ width: '100px' }}>{inauguration.cost ?? ''}</td>
                          <td style={{ width: '100px' }}>
                            <div dangerouslySetInnerHTML={{ __html: inauguration.description ?? '' }} />
                          </td>
                          <td style={{ width: '100px' }}>{inauguration.district_name}</td>
                          <td style={{ width: '100px' }}>{inauguration.division_name}</td>
                          <td style={{ width: '100px' }}>{formatDate(inauguration.date)}</td>
                          <td style={{ width: '100px' }}>
                            <div dangerouslySetInnerHTML={{ __html: inauguration.remarks ?? '' }} />
                          </td>
                          <td style={{ width: '100px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <Link
                                to={`/admin/inaugurations/edit/${inauguration.id}`}
                                className="btn btn-primary btn-icon-text inauguration_id"
                                title="edit"
                              >
                                <i className="ti-pencil-alt icon-sm"></i>
                              </Link>
                              <form
                                action="#"
                                method="POST"
                                style={{ margin: 0 }}
                                onSubmit={(e) => {
                                  e.preventDefault();
                                  console.log('Delete inauguration:', inauguration.id);
                                  alert('Delete functionality will be implemented with backend API');
                                }}
                              >
                                <button
                                  type="submit"
                                  className="btn btn-danger btn-icon-text"
                                  title="delete"
                                  onClick={(e) => {
                                    if (!confirm('Are you sure to delete?')) {
                                      e.preventDefault();
                                      e.stopPropagation();
                                    }
                                  }}
                                  style={{ marginRight: 0 }}
                                >
                                  <i className="ti-trash icon-sm"></i>
                                </button>
                              </form>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={10}>There are no data.</td>
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
