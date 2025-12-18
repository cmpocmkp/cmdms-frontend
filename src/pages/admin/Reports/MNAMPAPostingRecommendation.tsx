/**
 * MNA/MPA Posting Recommendation - Admin Module
 * EXACT replica of admin/report/candidaterequests/index.blade.php from old CMDMS
 */

import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { mockCandidateRequests, candidateRequestStatuses } from '../../../lib/mocks/data/candidateRequests';
import { mockCandidates } from '../../../lib/mocks/data/annualSchemes';
import { mockOfficers } from '../../../lib/mocks/data/officers';
import { mockOfficerDepartments } from '../../../lib/mocks/data/officerDepartments';

// Format date as 'd-m-Y'
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

export default function MNAMPAPostingRecommendation() {
  const [searchParams, setSearchParams] = useSearchParams();
  const candidateId = searchParams.get('candidate_id');
  const [selectedCandidateId, setSelectedCandidateId] = useState(candidateId || 'all');

  // Filter candidate requests based on selected candidate
  const filteredRequests = candidateId && candidateId !== 'all'
    ? mockCandidateRequests.filter(r => r.candidate_id === Number(candidateId))
    : mockCandidateRequests;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCandidateId && selectedCandidateId !== 'all') {
      setSearchParams({ candidate_id: selectedCandidateId });
    } else {
      setSearchParams({});
    }
  };

  const handleReset = () => {
    setSelectedCandidateId('all');
    setSearchParams({});
  };

  return (
    <div className="content-wrapper">
      <style>
        {`
          div.ml-2 h6 {
            font-size: 1.5rem !important;
            font-weight: normal !important;
            font-weight: 100 !important;
            color: #9e9e9e !important;
          }
          #meetings_decisions_table_id td {
            border: 0.5px solid #dfdddd !important;
            vertical-align: top !important;
            font-size: 14px !important;
            min-height: 35px !important;
            color: #49525a !important;
          }
        `}
      </style>
      <div className="card">
        <div className="card-body">
          <center>
            <h3>MNA/MPA Posting Recommendation</h3>
          </center>
          <form className="form-sample" onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-3">
                <div className="form-group">
                  <label>Recommended By</label>
                  <select
                    name="candidate_id"
                    id="candidate_id"
                    className="js-example-basic-single w-100 form-control"
                    required
                    value={selectedCandidateId}
                    onChange={(e) => setSelectedCandidateId(e.target.value)}
                  >
                    <option value="all">--select--</option>
                    {mockCandidates.map((candidate) => (
                      <option key={candidate.id} value={candidate.id.toString()}>
                        {candidate.name || ''} {candidate.constituency || ''} {candidate.district || ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-group mt-1">
                  <button type="submit" className="btn btn-success btn-sm mt-4">Search</button>
                  <button type="button" onClick={handleReset} className="btn btn-warning btn-sm mt-4">Reset</button>
                </div>
              </div>
            </div>
          </form>

          <div className="row">
            <div className="col-12">
              <div className="table-responsive">
                <table id="meetings_decisions_table_id" className="table-striped">
                  <thead style={{ background: 'rgb(37, 136, 95)', color: 'white' }}>
                    <tr>
                      <th>S.No</th>
                      <th>Officer Name</th>
                      <th>Current Designation</th>
                      <th>Proposed Designation</th>
                      <th>Current<br />-Proposed <br />Scale(BPS)</th>
                      <th>Current <br />Department</th>
                      <th>Proposed <br />Department</th>
                      <th>Recomended <br />By</th>
                      <th>Request<br />Date</th>
                      <th>Remarks</th>
                      <th>Status</th>
                      <th>Approved <br />Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRequests.length > 0 ? (
                      filteredRequests.map((request, index) => {
                        const officer = mockOfficers.find(o => o.id === request.officer_id);
                        const candidate = mockCandidates.find(c => c.id === request.candidate_id);
                        const currentDept = mockOfficerDepartments.find(d => d.id === request.current_department);
                        const proposedDept = mockOfficerDepartments.find(d => d.id === request.proposed_department);
                        
                        return (
                          <tr key={request.id}>
                            <td>{index + 1}</td>
                            <td>{officer?.name || 'N/A'}</td>
                            <td>{request.current_designation}</td>
                            <td>{request.proposed_designation}</td>
                            <td>
                              <span title="Current Scale">{request.current_scale}</span>
                              {' - '}
                              <span title="Proposed Scale">{request.proposed_scale}</span>
                            </td>
                            <td>{currentDept?.name || 'N/A'}</td>
                            <td>{proposedDept?.name || 'N/A'}</td>
                            <td>{candidate?.name || 'N/A'}</td>
                            <td>{formatDate(request.date)}</td>
                            <td style={{ whiteSpace: 'pre-wrap' }}>
                              <div dangerouslySetInnerHTML={{ __html: request.remarks }} />
                            </td>
                            <td>{candidateRequestStatuses[request.status] || request.status}</td>
                            <td>{request.approved_date ? formatDate(request.approved_date) : ''}</td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={12} style={{ textAlign: 'center' }}>No data found</td>
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
