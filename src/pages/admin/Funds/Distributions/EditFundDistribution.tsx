/**
 * Edit Fund Distribution - Admin Module
 * EXACT replica of admin/funds/distributions/edit.blade.php from old CMDMS
 */

import { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { mockAnnualSchemes, mockCandidates, approvalStatuses, approvalForums, schemeStatuses } from '../../../../lib/mocks/data/annualSchemes';
import { schemeMockDistricts, schemeCategories, schemeTypes } from '../../../../lib/mocks/data/schemes';

// Format date as 'd-m-Y'
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

// Distribution statuses
const distributionStatuses: Record<string, string> = {
  '1': 'Distributed',
  '2': 'Reverted',
  '3': 'Other'
};

interface UpdatedDistribution {
  id: number;
  candidate_id: string;
  allocated_fund: string;
  quantity?: string;
  remarks: string;
  is_approved: boolean;
  status: string;
  status_remarks: string;
}

export default function EditFundDistribution() {
  const [searchParams] = useSearchParams();
  const schemeId = searchParams.get('scheme') || '';
  const annualScheme = mockAnnualSchemes.find(s => s.id === Number(schemeId));

  const [updatedDistributions, setUpdatedDistributions] = useState<UpdatedDistribution[]>([]);
  const [newDistributions, setNewDistributions] = useState<UpdatedDistribution[]>([]);
  const [showAddCandidateModal, setShowAddCandidateModal] = useState(false);
  const [newCandidateName, setNewCandidateName] = useState('');
  const [formFeedback, setFormFeedback] = useState<{ type: string; message: string } | null>(null);

  const totalCost = annualScheme?.costs && annualScheme.costs.length > 0 ? annualScheme.costs[0].local : 0;
  const existingDistributions = annualScheme?.fundDistributions || [];

  useEffect(() => {
    if (annualScheme && existingDistributions.length > 0) {
      setUpdatedDistributions(
        existingDistributions.map((d) => ({
          id: d.id,
          candidate_id: d.candidate_id.toString(),
          allocated_fund: d.allocated_fund.toFixed(3),
          quantity: d.quantity?.toString(),
          remarks: d.remarks || '',
          is_approved: d.is_approved,
          status: d.status,
          status_remarks: d.status_remarks || ''
        }))
      );
    }
  }, [annualScheme, existingDistributions]);

  // Calculate total allocated amount
  const totalAllocated = useMemo(() => {
    const updatedTotal = updatedDistributions.reduce((sum, d) => sum + parseFloat(d.allocated_fund) || 0, 0);
    const newTotal = newDistributions.reduce((sum, d) => sum + parseFloat(d.allocated_fund) || 0, 0);
    return updatedTotal + newTotal;
  }, [updatedDistributions, newDistributions]);

  const remainingAmount = Math.max(0, totalCost - totalAllocated);

  if (!annualScheme) {
    return (
      <div className="content-wrapper">
        <div className="alert alert-danger">Annual Scheme not found</div>
      </div>
    );
  }

  const districts = schemeMockDistricts.filter(d => annualScheme.districts.includes(d.id));

  const handleUpdateDistribution = (distributionId: number) => {
    const dist = updatedDistributions.find(d => d.id === distributionId);
    if (!dist) return;

    console.log('Update Distribution:', {
      id: distributionId,
      candidate_id: dist.candidate_id,
      allocated_fund: parseFloat(dist.allocated_fund),
      quantity: dist.quantity ? parseFloat(dist.quantity) : undefined,
      remarks: dist.remarks,
      is_approved: dist.is_approved,
      status: dist.status,
      status_remarks: dist.status_remarks
    });
    alert('Update distribution functionality will be implemented with backend API');
  };

  const handleUpdateDistributionChange = (id: number, field: keyof UpdatedDistribution, value: string | boolean) => {
    setUpdatedDistributions(
      updatedDistributions.map((d) => (d.id === id ? { ...d, [field]: value } : d))
    );
  };

  const handleAddRow = () => {
    const newId = -(newDistributions.length + 1); // Negative IDs for new rows
    setNewDistributions([
      ...newDistributions,
      {
        id: newId,
        candidate_id: '',
        allocated_fund: '',
        quantity: annualScheme.is_quantifiable ? '' : undefined,
        remarks: '',
        is_approved: false,
        status: '1',
        status_remarks: ''
      }
    ]);
  };

  const handleRemoveNewRow = (id: number) => {
    setNewDistributions(newDistributions.filter(d => d.id !== id));
  };

  const handleNewDistributionChange = (id: number, field: keyof UpdatedDistribution, value: string | boolean) => {
    setNewDistributions(newDistributions.map(d => d.id === id ? { ...d, [field]: value } : d));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (totalAllocated > totalCost) {
      setFormFeedback({
        type: 'danger',
        message: 'Error: Total allocated amount exceeds the total cost.'
      });
      return;
    }

    if (!confirm('Do you want to proceed with the selected distribution\'s?')) {
      return;
    }

    console.log('Distribute Funds:', {
      annual_scheme_id: annualScheme.id,
      distributions: [...updatedDistributions, ...newDistributions].map(d => ({
        id: d.id > 0 ? d.id : undefined,
        candidate_id: d.candidate_id,
        allocated_fund: parseFloat(d.allocated_fund),
        quantity: d.quantity ? parseFloat(d.quantity) : undefined
      }))
    });
    alert('Fund distribution functionality will be implemented with backend API');
  };

  const handleAddCandidate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCandidateName.trim()) {
      alert('Please enter candidate name');
      return;
    }
    console.log('Add Candidate:', { name: newCandidateName });
    alert('Add Candidate functionality will be implemented with backend API');
    setNewCandidateName('');
    setShowAddCandidateModal(false);
  };

  return (
    <div className="content-wrapper">
      <style>
        {`
          .modal-body {
            max-height: 250px;
          }
          table#annual_scheme_table th {
            border: 1px solid silver;
          }
          .table th, .jsgrid .jsgrid-table th, .table td, .jsgrid .jsgrid-table td {
            padding: 5px !important;
          }
        `}
      </style>
      <div className="card">
        <div className="card-body">
          <Link to="/admin/funds/distributions/distributed-schemes" style={{ float: 'right' }}>
            Distributed Schemes
          </Link>
          <h4 className="card-title text-primary">Edit Scheme Distribution</h4>
          <div className="row">
            <div className="col-12">
              <div className="table-responsive">
                <table id="annual_scheme_table" className="table table-bordered text-center align-middle">
                  <thead className="table-light">
                    <tr>
                      <th rowSpan={2}>ADP S.#</th>
                      <th rowSpan={2}>
                        Code, Name of the Scheme<br />
                        (Status) with forum and<br />
                        date of last approval
                      </th>
                      <th rowSpan={2}>Sector - SubSector / Status</th>
                      <th rowSpan={2}>Progress</th>
                      <th rowSpan={2}>Districts</th>
                      <th rowSpan={2}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{annualScheme.serial_no}</td>
                      <td>
                        {annualScheme.code} -{' '}
                        <div dangerouslySetInnerHTML={{ __html: annualScheme.name }} />
                        <br />
                        ({approvalStatuses[annualScheme.is_approved] || annualScheme.is_approved}) /{' '}
                        {approvalForums[annualScheme.approval_forum] || annualScheme.approval_forum} /{' '}
                        {formatDate(annualScheme.approval_date)}
                      </td>
                      <td>
                        {annualScheme.sector_name} - {annualScheme.sub_sector_name}
                        <br />
                        {schemeStatuses[annualScheme.status] || annualScheme.status}
                        <br />
                        {schemeCategories[annualScheme.category] || annualScheme.category}
                        <br />
                        {schemeTypes[annualScheme.type] || annualScheme.type}
                      </td>
                      <td>
                        {annualScheme.financial_progress && (
                          <div dangerouslySetInnerHTML={{ __html: annualScheme.financial_progress }} />
                        )}
                        <br />
                        {annualScheme.physical_progress && (
                          <div dangerouslySetInnerHTML={{ __html: annualScheme.physical_progress }} />
                        )}
                      </td>
                      <td>
                        {districts.length > 0 && (
                          <>
                            ({districts.length})
                            <br />
                          </>
                        )}
                        {districts.map((district, idx) => (
                          <div key={district.id}>
                            {district.name}
                            {idx < districts.length - 1 && <br />}
                          </div>
                        ))}
                      </td>
                      <td>
                        <Link
                          to={`/admin/funds/annualschemes/edit/${annualScheme.id}`}
                          style={{ float: 'left', marginLeft: '20px' }}
                          className="btn btn-sm btn-primary mr-2 mb-2"
                        >
                          Edit
                        </Link>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <div className="text-center mt-3">
                <h1 id="total-cost">Cost: {totalCost.toFixed(3)}</h1>
                <small className="text-inline-block">(Rs. In Million)</small>
              </div>
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-12">
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th style={{ width: '200px' }}>Candidate</th>
                      <th style={{ width: '200px' }}>Allocated Fund</th>
                      {annualScheme.is_quantifiable && <th style={{ width: '100px' }}>Quantity</th>}
                      <th style={{ width: '300px' }}>Remarks</th>
                      <th style={{ width: '50px' }}>Approved</th>
                      <th>Status</th>
                      <th>Status Remarks</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody id="updatedCandidatesRows">
                    {updatedDistributions.map((distribution) => (
                      <tr key={distribution.id}>
                        <td>{distribution.id}</td>
                        <td>
                          <select
                            style={{ width: '5% !important' }}
                            className="form-control candidate_id"
                            value={distribution.candidate_id}
                            onChange={(e) => handleUpdateDistributionChange(distribution.id, 'candidate_id', e.target.value)}
                          >
                            {mockCandidates.map((candidate) => (
                              <option key={candidate.id} value={candidate.id.toString()}>
                                {candidate.name} {candidate.constituency} {candidate.district}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td style={{ width: '150px !important' }}>
                          <input
                            style={{ width: '150px !important' }}
                            type="number"
                            step={0.01}
                            className="form-control allocated-fund"
                            value={distribution.allocated_fund}
                            onChange={(e) => handleUpdateDistributionChange(distribution.id, 'allocated_fund', e.target.value)}
                          />
                        </td>
                        {annualScheme.is_quantifiable && (
                          <td style={{ width: '100px !important' }}>
                            <input
                              style={{ width: '100px !important' }}
                              type="number"
                              step={0.01}
                              className="form-control quantity"
                              value={distribution.quantity || ''}
                              onChange={(e) => handleUpdateDistributionChange(distribution.id, 'quantity', e.target.value)}
                            />
                          </td>
                        )}
                        <td>
                          <textarea
                            rows={5}
                            cols={25}
                            className="form-control remarks"
                            value={distribution.remarks}
                            onChange={(e) => handleUpdateDistributionChange(distribution.id, 'remarks', e.target.value)}
                          />
                        </td>
                        <td>
                          <input
                            type="checkbox"
                            className="is_approved"
                            checked={distribution.is_approved}
                            onChange={(e) => handleUpdateDistributionChange(distribution.id, 'is_approved', e.target.checked)}
                          />
                        </td>
                        <td>
                          <select
                            style={{ width: '5% !important' }}
                            className="form-control status"
                            value={distribution.status}
                            onChange={(e) => handleUpdateDistributionChange(distribution.id, 'status', e.target.value)}
                          >
                            {Object.entries(distributionStatuses).map(([key, value]) => (
                              <option key={key} value={key}>
                                {value}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <textarea
                            rows={5}
                            cols={25}
                            className="form-control status_remarks"
                            value={distribution.status_remarks}
                            onChange={(e) => handleUpdateDistributionChange(distribution.id, 'status_remarks', e.target.value)}
                          />
                        </td>
                        <td>
                          <button
                            type="button"
                            className="btn btn-success btn-sm updateFundDistribution"
                            onClick={() => handleUpdateDistribution(distribution.id)}
                          >
                            Update
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-12">
              <div id="funds-form-validation-errors"></div>
              <button
                type="button"
                id="add-new-candidate"
                className="btn btn-primary pull-right mb-2"
                onClick={() => setShowAddCandidateModal(true)}
              >
                Add candidate
              </button>
              <div className="table-responsive">
                <form id="candidate-form" onSubmit={handleSubmit}>
                  <input type="hidden" id="annual_scheme_id" name="annual_scheme_id" value={annualScheme.id} />
                  <input type="hidden" id="annual_scheme_cost" name="scheme_cost" value={totalCost} />
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Candidate</th>
                        <th>Amount to be Allocate</th>
                        {annualScheme.is_quantifiable && <th>Quantity</th>}
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody id="candidates">
                      {newDistributions.map((distribution) => (
                        <tr key={distribution.id}>
                          <td>
                            <select
                              className="form-control candidate-select"
                              id={`distributions${distribution.id}`}
                              name={`distributions[${distribution.id}][candidate_id]`}
                              required
                              value={distribution.candidate_id}
                              onChange={(e) => handleNewDistributionChange(distribution.id, 'candidate_id', e.target.value)}
                            >
                              <option value="">Please Select a Candidate</option>
                              {mockCandidates.map((candidate) => (
                                <option key={candidate.id} value={candidate.id.toString()}>
                                  {candidate.name} - {candidate.constituency} - {candidate.district}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td>
                            <input
                              type="number"
                              step={0.01}
                              className="form-control allocated-fund"
                              name={`distributions[${distribution.id}][allocated_fund]`}
                              required
                              value={distribution.allocated_fund}
                              onChange={(e) => handleNewDistributionChange(distribution.id, 'allocated_fund', e.target.value)}
                            />
                          </td>
                          {annualScheme.is_quantifiable && (
                            <td>
                              <input
                                type="number"
                                step={0.01}
                                className="form-control allocated-fund"
                                name={`distributions[${distribution.id}][quantity]`}
                                required
                                value={distribution.quantity || ''}
                                onChange={(e) => handleNewDistributionChange(distribution.id, 'quantity', e.target.value)}
                              />
                            </td>
                          )}
                          <td>
                            <button
                              type="button"
                              className="btn btn-danger remove-candidate"
                              onClick={() => handleRemoveNewRow(distribution.id)}
                            >
                              X
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <button id="add-candidate" type="button" className="btn btn-primary" onClick={handleAddRow}>
                    Add
                  </button>
                  <div className="text-center">
                    <strong>Allocated Amount:</strong> <span id="total-allocated-fund">{totalAllocated.toFixed(3)}</span>
                  </div>
                  <div className="text-center text-info mt-2">
                    <strong>Remaining Amount:</strong> <span id="total-difference">{remainingAmount.toFixed(3)}</span>
                  </div>
                  <h3 id="total-cost">Cost: {totalCost.toFixed(3)}</h3>
                  <small className="text-inline-block">(Rs. In Million)</small>
                  <button type="submit" className="btn btn-success pull-right">
                    Distribute
                  </button>
                </form>
                {formFeedback && (
                  <div
                    id="form-feedback"
                    className={`alert alert-${formFeedback.type}`}
                    style={{ width: '50%', display: 'block' }}
                  >
                    {formFeedback.message}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Add Candidate Modal */}
        {showAddCandidateModal && (
          <div className="modal fade show" style={{ display: 'block' }} tabIndex={-1} role="dialog">
            <div className="modal-dialog modal-md" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Add New Candidate</h5>
                  <button
                    type="button"
                    className="close"
                    onClick={() => setShowAddCandidateModal(false)}
                    aria-label="Close"
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <form id="addCandidateForm" onSubmit={handleAddCandidate}>
                  <div className="modal-body">
                    <div id="validation-errors"></div>
                    <div className="form-group">
                      <label htmlFor="candidateName">Candidate Name</label>
                      <input
                        type="text"
                        id="candidateName"
                        name="name"
                        className="form-control"
                        required
                        value={newCandidateName}
                        onChange={(e) => setNewCandidateName(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setShowAddCandidateModal(false)}
                    >
                      Close
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Save Candidate
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Modal backdrop */}
        {showAddCandidateModal && (
          <div
            className="modal-backdrop fade show"
            onClick={() => setShowAddCandidateModal(false)}
          ></div>
        )}
      </div>
    </div>
  );
}
