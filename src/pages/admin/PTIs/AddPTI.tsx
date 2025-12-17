/**
 * Add PTI - Admin Module
 * EXACT replica of admin/ptis/create.blade.php from old CMDMS
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function AddPTI() {
  const [codeNumber, setCodeNumber] = useState('');
  const [code, setCode] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // Update code when code_number changes
  useEffect(() => {
    setCode(codeNumber ? `PTI-${codeNumber}` : '');
  }, [codeNumber]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Add PTI:', { code, title, description });
    alert('Add PTI functionality will be implemented with backend API');
    // navigate('/admin/ptis');
  };

  return (
    <div className="content-wrapper">
      <div className="card">
        <div className="card-header text-center">
          <div className="d-flex gap-3 justify-content-between align-items-center">
            <div className="flex-grow-1 text-center">
              <p className="block display-4">Add New PTI</p>
            </div>
            <div>
              <div className="btn-toolbar pull-right">
                <div className="btn-group">
                  <Link 
                    to="/admin/ptis" 
                    className="btn btn-outline-primary btn-fw"
                    role="button"
                  >
                    <i className="ti-arrow-left mr-1"></i>Back to PTIs
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="code_number">Initiative Code</label>
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text">PTI-</span>
                    </div>
                    <input
                      type="number"
                      name="code_number"
                      id="code_number"
                      className="form-control"
                      value={codeNumber}
                      onChange={(e) => setCodeNumber(e.target.value)}
                      required
                      placeholder="Enter number only"
                    />
                  </div>
                  <input type="hidden" name="code" id="code" value={code} />
                </div>
              </div>
              <div className="col-md-12">
                <div className="form-group">
                  <label htmlFor="title">Title</label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    className="form-control"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="col-md-12">
                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <textarea
                    rows={4}
                    name="description"
                    id="description"
                    className="form-control"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                  <small className="form-text text-muted">
                    Note: Rich text editor (Summernote) will be integrated with backend
                  </small>
                </div>
              </div>
            </div>

            <button type="submit" className="btn btn-primary">Add PTI</button>
          </form>
        </div>
      </div>
    </div>
  );
}
