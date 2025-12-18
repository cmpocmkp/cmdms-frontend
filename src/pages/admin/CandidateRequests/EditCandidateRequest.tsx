/**
 * Edit Candidate Request - Admin Module
 * EXACT replica of admin/candidaterequests/edit.blade.php from old CMDMS
 */

import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { mockCandidateRequests, candidateRequestStatuses } from '../../../lib/mocks/data/candidateRequests';
import { mockOfficers } from '../../../lib/mocks/data/officers';
import { mockOfficerDepartments } from '../../../lib/mocks/data/officerDepartments';
import { mockCandidates } from '../../../lib/mocks/data/annualSchemes';

// BPS Scales matching old CMDMS officerScales() function
// Note: Old CMDMS returns numeric values [7,9,11,12,14,15,16,17,18,19,20,21,22]
// but we'll use string format for consistency with mock data
const bpsScales = ['7', '9', '11', '12', '14', '15', '16', '17', '18', '19', '20', '21', '22'];

export default function EditCandidateRequest() {
  const { id } = useParams<{ id: string }>();
  const candidateRequest = mockCandidateRequests.find(cr => cr.id === Number(id));

  const [officerId, setOfficerId] = useState('');
  const [currentScale, setCurrentScale] = useState('');
  const [proposedScale, setProposedScale] = useState('');
  const [currentDesignation, setCurrentDesignation] = useState('');
  const [proposedDesignation, setProposedDesignation] = useState('');
  const [currentDepartment, setCurrentDepartment] = useState('');
  const [proposedDepartment, setProposedDepartment] = useState('');
  const [candidateId, setCandidateId] = useState('');
  const [date, setDate] = useState('');
  const [status, setStatus] = useState('');
  const [approvedDate, setApprovedDate] = useState('');
  const [remarks, setRemarks] = useState('');

  useEffect(() => {
    if (candidateRequest) {
      setOfficerId(candidateRequest.officer_id.toString());
      // Extract numeric value from BPS-XX format for form
      const currentScaleNum = candidateRequest.current_scale.replace('BPS-', '');
      const proposedScaleNum = candidateRequest.proposed_scale.replace('BPS-', '');
      setCurrentScale(currentScaleNum);
      setProposedScale(proposedScaleNum);
      setCurrentDesignation(candidateRequest.current_designation);
      setProposedDesignation(candidateRequest.proposed_designation);
      setCurrentDepartment(candidateRequest.current_department.toString());
      setProposedDepartment(candidateRequest.proposed_department.toString());
      setCandidateId(candidateRequest.candidate_id.toString());
      setDate(candidateRequest.date);
      setStatus(candidateRequest.status);
      setApprovedDate(candidateRequest.approved_date || '');
      setRemarks(candidateRequest.remarks);
    }
  }, [candidateRequest]);

  if (!candidateRequest) {
    return (
      <div className="content-wrapper">
        <div className="alert alert-danger">Candidate Request not found</div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Update Candidate Request:', {
      id: candidateRequest.id,
      officer_id: officerId,
      current_scale: currentScale,
      proposed_scale: proposedScale,
      current_designation: currentDesignation,
      proposed_designation: proposedDesignation,
      current_department: currentDepartment,
      proposed_department: proposedDepartment,
      candidate_id: candidateId,
      date,
      status,
      approved_date: approvedDate,
      remarks
    });
    alert('Update Candidate Request functionality will be implemented with backend API');
  };

  return (
    <div className="content-wrapper">
      <div className="row">
        <div className="col-12 grid-margin">
          <div className="card">
            <div className="card-body">
              <Link to="/admin/candidaterequests" style={{ float: 'right' }}>
                Show all candidate requests
              </Link>
              <p className="card-title"><strong>Edit Candidate Requests</strong></p>

              <form
                className="form-sample"
                onSubmit={handleSubmit}
                encType="multipart/form-data"
                id="record_note_form"
              >
                <div className="row">
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>Officer Name</label>
                      <select
                        name="officer_id"
                        id="officer_id"
                        className="js-example-basic-single w-100 form-control form-control-lg"
                        value={officerId}
                        onChange={(e) => setOfficerId(e.target.value)}
                        required
                      >
                        <option value="">Select Officer</option>
                        {mockOfficers.map((officer) => (
                          <option
                            key={officer.id}
                            value={officer.id.toString()}
                          >
                            {officer.name} - {officer.designation}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="col-md-1">
                    <div className="form-group">
                      <label>Current Scale(BPS)</label>
                      <select
                        name="current_scale"
                        id="current_scale"
                        className="js-example-basic-single w-100 form-control form-control-lg"
                        value={currentScale}
                        onChange={(e) => setCurrentScale(e.target.value)}
                      >
                        <option value="">Select</option>
                        {bpsScales.map((scale) => (
                          <option key={scale} value={scale}>
                            BPS-{scale}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="col-md-1">
                    <div className="form-group">
                      <label>Proposed Scale(BPS)</label>
                      <select
                        name="proposed_scale"
                        id="proposed_scale"
                        className="js-example-basic-single w-100 form-control form-control-lg"
                        value={proposedScale}
                        onChange={(e) => setProposedScale(e.target.value)}
                      >
                        <option value="">Select</option>
                        {bpsScales.map((scale) => (
                          <option key={scale} value={scale}>
                            BPS-{scale}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>Current Designation</label>
                      <input
                        type="text"
                        name="current_designation"
                        id="current_designation"
                        value={currentDesignation}
                        className="form-control"
                        required
                        onChange={(e) => setCurrentDesignation(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>Proposed Designation</label>
                      <input
                        type="text"
                        name="proposed_designation"
                        id="proposed_designation"
                        value={proposedDesignation}
                        className="form-control"
                        required
                        onChange={(e) => setProposedDesignation(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>Current Department</label>
                      <select
                        name="current_department"
                        id="current_department"
                        className="js-example-basic-single w-100 form-control form-control-lg"
                        value={currentDepartment}
                        onChange={(e) => setCurrentDepartment(e.target.value)}
                      >
                        <option value="">Select</option>
                        {mockOfficerDepartments.map((department) => (
                          <option key={department.id} value={department.id.toString()}>
                            {department.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>Proposed Department</label>
                      <select
                        name="proposed_department"
                        id="proposed_department"
                        className="js-example-basic-single w-100 form-control form-control-lg"
                        value={proposedDepartment}
                        onChange={(e) => setProposedDepartment(e.target.value)}
                      >
                        <option value="">Select</option>
                        {mockOfficerDepartments.map((department) => (
                          <option key={department.id} value={department.id.toString()}>
                            {department.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>Recommended By</label>
                      <select
                        name="candidate_id"
                        id="candidate_id"
                        className="js-example-basic-single w-100 form-control form-control-lg"
                        value={candidateId}
                        onChange={(e) => setCandidateId(e.target.value)}
                      >
                        <option value="">Select</option>
                        {mockCandidates.map((candidate) => (
                          <option key={candidate.id} value={candidate.id.toString()}>
                            {candidate.name || ''} {candidate.constituency || ''} {candidate.district || ''}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>Request Date</label>
                      <input
                        type="date"
                        name="date"
                        id="date"
                        value={date}
                        className="form-control"
                        required
                        onChange={(e) => setDate(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>Status</label>
                      <select
                        name="status"
                        id="status"
                        className="js-example-basic-single w-100 form-control form-control-lg"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                      >
                        <option value="">--select--</option>
                        {Object.entries(candidateRequestStatuses).map(([key, value]) => (
                          <option key={key} value={key}>
                            {value}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>Approved Date</label>
                      <input
                        type="date"
                        name="approved_date"
                        id="approved_date"
                        value={approvedDate}
                        className="form-control"
                        onChange={(e) => setApprovedDate(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <div className="form-group">
                      <label htmlFor="record-note-subject">Remarks</label>
                      <textarea
                        className="form-control"
                        id="subject"
                        name="remarks"
                        rows={4}
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <button type="submit" className="btn btn-success mr-2">
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
