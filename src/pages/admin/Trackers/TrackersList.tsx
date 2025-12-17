/**
 * Trackers List - Admin Module
 * Implementation based on old CMDMS patterns
 */

import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { mockTrackers } from '../../../lib/mocks/data/trackers';

export default function TrackersList() {
  const [trackers] = useState(mockTrackers);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const filteredTrackers = useMemo(() => {
    let filtered = trackers;

    if (statusFilter) {
      filtered = filtered.filter(tracker => tracker.status === statusFilter);
    }

    if (priorityFilter) {
      filtered = filtered.filter(tracker => tracker.priority === priorityFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(tracker =>
        tracker.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tracker.department_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [trackers, searchTerm, statusFilter, priorityFilter]);

  const totalPages = Math.ceil(filteredTrackers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedTrackers = filteredTrackers.slice(startIndex, endIndex);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed': return 'badge-success';
      case 'In Progress': return 'badge-info';
      case 'On Hold': return 'badge-warning';
      case 'Not Started': return 'badge-secondary';
      case 'Cancelled': return 'badge-danger';
      default: return 'badge-secondary';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'badge-danger';
      case 'High': return 'badge-warning';
      case 'Medium': return 'badge-info';
      case 'Low': return 'badge-secondary';
      default: return 'badge-secondary';
    }
  };

  return (
    <div className="content-wrapper">
      <div className="card">
        <div className="card-header text-center">
          <div className="d-flex gap-3 justify-content-between align-items-center">
            <div className="flex-grow-1 text-center">
              <p className="block display-4">Trackers</p>
            </div>
            <div>
              <Link 
                to="/admin/trackers/add" 
                className="btn btn-outline-primary btn-fw"
              >
                <i className="ti-plus mr-1"></i>Add Tracker
              </Link>
            </div>
          </div>
        </div>
        <div className="card-body">
          {/* Filters */}
          <div className="row mb-3">
            <div className="col-md-3">
              <input
                type="text"
                className="form-control"
                placeholder="Search trackers..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <div className="col-md-3">
              <select
                className="form-control"
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="">All Statuses</option>
                <option value="Not Started">Not Started</option>
                <option value="In Progress">In Progress</option>
                <option value="On Hold">On Hold</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            <div className="col-md-3">
              <select
                className="form-control"
                value={priorityFilter}
                onChange={(e) => {
                  setPriorityFilter(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="">All Priorities</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            <div className="col-md-3 text-right">
              <span className="text-muted">
                Showing {startIndex + 1} to {Math.min(endIndex, filteredTrackers.length)} of {filteredTrackers.length} entries
              </span>
            </div>
          </div>

          <div className="row">
            <div className="col-12">
              <div className="table-responsive">
                <table className="table table-bordered table-striped" role="grid">
                  <thead className="thead-light">
                    <tr>
                      <th>#</th>
                      <th>Subject</th>
                      <th>Department</th>
                      <th>Assigned To</th>
                      <th>Priority</th>
                      <th>Status</th>
                      <th>Progress</th>
                      <th>Deadline</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedTrackers.length > 0 ? (
                      paginatedTrackers.map((tracker, index) => (
                        <tr key={tracker.id}>
                          <td>{startIndex + index + 1}</td>
                          <td>{tracker.subject}</td>
                          <td>{tracker.department_name}</td>
                          <td>{tracker.assigned_to || '-'}</td>
                          <td>
                            <label className={`badge ${getPriorityBadge(tracker.priority)} badge-pill`}>
                              {tracker.priority}
                            </label>
                          </td>
                          <td>
                            <label className={`badge ${getStatusBadge(tracker.status)} badge-pill`}>
                              {tracker.status}
                            </label>
                          </td>
                          <td>
                            <div className="progress">
                              <div 
                                className="progress-bar" 
                                role="progressbar" 
                                style={{ width: `${tracker.progress_percent}%` }}
                                aria-valuenow={tracker.progress_percent} 
                                aria-valuemin={0} 
                                aria-valuemax={100}
                              >
                                {tracker.progress_percent}%
                              </div>
                            </div>
                          </td>
                          <td>{tracker.deadline ? new Date(tracker.deadline).toLocaleDateString('en-GB') : '-'}</td>
                          <td>
                            <Link
                              to={`/admin/trackers/edit/${tracker.id}`}
                              className="btn btn-primary btn-sm"
                              title="Edit Tracker"
                            >
                              <i className="ti-pencil-alt"></i>
                            </Link>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={9}>There is no data.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="row mt-3">
              <div className="col-12">
                <nav>
                  <ul className="pagination justify-content-center">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                      <button className="page-link" onClick={() => setCurrentPage(p => Math.max(1, p - 1))}>Previous</button>
                    </li>
                    {[...Array(Math.min(5, totalPages))].map((_, index) => {
                      const pageNum = index + 1;
                      return (
                        <li key={pageNum} className={`page-item ${currentPage === pageNum ? 'active' : ''}`}>
                          <button className="page-link" onClick={() => setCurrentPage(pageNum)}>{pageNum}</button>
                        </li>
                      );
                    })}
                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                      <button className="page-link" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}>Next</button>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
