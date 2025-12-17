/**
 * Directive Replies/Chat - Admin Module
 * EXACT replica of admin/replies/directives/index.blade.php
 * Features: View and add replies for a directive
 */

import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { mockDirectives } from '../../../lib/mocks/data/directives';

export default function DirectiveReplies() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [directive, setDirective] = useState<any>(null);

  useEffect(() => {
    const foundDirective = mockDirectives.find(d => d.id === parseInt(id || '0'));
    if (foundDirective) {
      setDirective(foundDirective);
    } else {
      alert('Directive not found');
      navigate('/admin/directives');
    }
  }, [id, navigate]);

  if (!directive) {
    return (
      <div className="content-wrapper">
        <div className="card">
          <div className="card-body text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="sr-only">Loading...</span>
            </div>
            <p className="mt-3">Loading directive...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="content-wrapper">
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header text-center">
              <div className="d-flex gap-3 justify-content-between align-items-center">
                <div className="flex-grow-1 text-center">
                  <p className="block display-4">CM Directives</p>
                </div>
                <div>
                  <div className="btn-toolbar pull-right">
                    <div className="btn-group">
                      <Link
                        to="/admin/directives"
                        className="btn btn-outline-primary btn-fw"
                      >
                        <i className="ti-arrow-left mr-1"></i>Back
                      </Link>
                      <a href="#add-reply" className="btn btn-outline-primary btn-fw" role="button">
                        <i className="ti-share-alt mr-1"></i>Reply
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card-body">
              {/* Directive Details */}
              <div className="card-title display-5 text-dark mb-3">
                {directive.subject}
              </div>

              <div className="row">
                <div className="col-md-6">
                  <p className="font-weight-bold text-dark">
                    <i className="fa fa-institution"></i> Departments
                  </p>
                  <ul className="list-arrow ml-2">
                    {directive.departments && directive.departments.map((dept: any, idx: number) => (
                      <li key={idx}>
                        <span className="text-capitalize">{dept.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="col-md-6">
                  {directive.attachments && directive.attachments.length > 0 && (
                    <>
                      <p className="font-weight-bold text-dark">
                        <i className="fa fa-briefcase"></i> Attachments
                      </p>
                      <div className="ml-sm-3 ml-md-0 ml-xl-3 mt-2 mt-sm-0 mt-md-2 mt-xl-0">
                        <ol>
                          {directive.attachments.map((attachment: string, idx: number) => (
                            <li key={idx}>
                              <a href="#" target="_blank">
                                <i className="ti-file"></i>
                                <small>{attachment}</small>
                              </a>
                            </li>
                          ))}
                        </ol>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Creator Info */}
              <div className="row">
                <div className="col">
                  <ul className="nav profile-navbar d-flex justify-content-end border-top">
                    {directive.creator_name && (
                      <li className="nav-item">
                        <a className="nav-link" href="#">
                          <i className="fa fa-user-circle" style={{ color: '#248afd' }}></i> {directive.creator_name}
                        </a>
                      </li>
                    )}
                    {directive.created_at && (
                      <li className="nav-item">
                        <a className="nav-link" href="#">
                          <i className="fa fa-calendar" style={{ color: '#248afd' }}></i>{' '}
                          {new Date(directive.created_at).toLocaleDateString('en-GB')}
                        </a>
                      </li>
                    )}
                  </ul>
                </div>
              </div>

              {/* Reply Form and History */}
              <div className="row mt-4">
                <div className="col-md-12">
                  <div className="alert alert-info">
                    <strong>Note:</strong> Reply functionality will be implemented with backend integration.
                  </div>
                  
                  {/* Placeholder for reply form */}
                  <div id="add-reply" className="card mb-3">
                    <div className="card-body">
                      <h5>Add Reply</h5>
                      <form onSubmit={(e) => {
                        e.preventDefault();
                        alert('Reply submission will be implemented with backend API');
                      }}>
                        <div className="form-group">
                          <label>Reply Detail</label>
                          <textarea className="form-control" rows={4} required></textarea>
                        </div>
                        <button type="submit" className="btn btn-primary">Submit Reply</button>
                      </form>
                    </div>
                  </div>

                  {/* Reply History Placeholder */}
                  <div className="card">
                    <div className="card-body">
                      <h5>Reply History</h5>
                      <p className="text-muted">No replies yet.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
