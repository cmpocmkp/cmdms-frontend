/**
 * Fund Distributions Index - Admin Module
 * EXACT replica of admin/funds/distributions/index.blade.php from old CMDMS
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

interface DistributionRow {
  id: string;
  candidate_id: string;
  allocated_fund: string;
  quantity?: string;
}

export default function FundDistributionsIndex() {
  const [searchParams] = useSearchParams();
  const schemeId = searchParams.get('scheme') || '';
  const annualScheme = mockAnnualSchemes.find(s => s.id === Number(schemeId));

  const [distributions, setDistributions] = useState<DistributionRow[]>([
    { id: '0', candidate_id: '', allocated_fund: '', quantity: '' }
  ]);
  const [showAddCandidateModal, setShowAddCandidateModal] = useState(false);
  const [newCandidateName, setNewCandidateName] = useState('');
  const [formFeedback, setFormFeedback] = useState<{ type: string; message: string } | null>(null);

  const totalCost = annualScheme?.costs && annualScheme.costs.length > 0 ? annualScheme.costs[0].local : 0;

  // Calculate total allocated amount
  const totalAllocated = useMemo(() => {
    return distributions.reduce((sum, dist) => {
      const amount = parseFloat(dist.allocated_fund) || 0;
      return sum + amount;
    }, 0);
  }, [distributions]);

  const remainingAmount = Math.max(0, totalCost - totalAllocated);
  const isValid = totalAllocated <= totalCost && totalAllocated >= 0 && distributions.every(d => parseFloat(d.allocated_fund) >= 0);

  useEffect(() => {
    if (totalAllocated > totalCost) {
      setFormFeedback({
        type: 'warning',
        message: `Warning: Total allocated fund (${totalAllocated.toFixed(2)}) exceeds the total cost (${totalCost.toFixed(2)}).`
      });
    } else {
      setFormFeedback(null);
    }
  }, [totalAllocated, totalCost]);

  if (!annualScheme) {
    return (
      <div className="content-wrapper">
        <div className="alert alert-danger">Annual Scheme not found</div>
      </div>
    );
  }

  const districts = schemeMockDistricts.filter(d => annualScheme.districts.includes(d.id));

  const handleAddRow = () => {
    const newId = distributions.length.toString();
    setDistributions([...distributions, { id: newId, candidate_id: '', allocated_fund: '', quantity: annualScheme.is_quantifiable ? '' : undefined }]);
  };

  const handleRemoveRow = (id: string) => {
    if (distributions.length > 1) {
      setDistributions(distributions.filter(d => d.id !== id));
    }
  };

  const handleDistributionChange = (id: string, field: keyof DistributionRow, value: string) => {
    setDistributions(distributions.map(d => d.id === id ? { ...d, [field]: value } : d));
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
      distributions: distributions.map(d => ({
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
    // In real implementation, this would call API to add candidate
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
        `}
      </style>
      <div className="card">
        <div className="card-body">
          <Link to="/admin/funds/annualschemes" style={{ float: 'right' }}>
            Annual Schemes
          </Link>
          <h4 className="card-title text-primary">Annual Scheme Distribution</h4>
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
                      <td></td>
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
                      {distributions.map((distribution) => (
                        <tr key={distribution.id}>
                          <td>
                            <select
                              className="form-control candidate-select"
                              id={`distributions${distribution.id}`}
                              name={`distributions[${distribution.id}][candidate_id]`}
                              required
                              value={distribution.candidate_id}
                              onChange={(e) => handleDistributionChange(distribution.id, 'candidate_id', e.target.value)}
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
                              onChange={(e) => handleDistributionChange(distribution.id, 'allocated_fund', e.target.value)}
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
                                onChange={(e) => handleDistributionChange(distribution.id, 'quantity', e.target.value)}
                              />
                            </td>
                          )}
                          <td>
                            <button
                              type="button"
                              className="btn btn-danger remove-candidate"
                              onClick={() => handleRemoveRow(distribution.id)}
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
                    <strong>Allocated Amount:</strong> <span id="total-allocated-fund">{totalAllocated.toFixed(2)}</span>
                  </div>
                  <div className="text-center text-info mt-2">
                    <strong>Remaining Amount:</strong> <span id="total-difference">{remainingAmount.toFixed(2)}</span>
                  </div>
                  <button type="submit" className="btn btn-success pull-right" disabled={!isValid}>
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
