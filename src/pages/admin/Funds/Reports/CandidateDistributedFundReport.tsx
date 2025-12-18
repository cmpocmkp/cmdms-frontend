/**
 * Candidate Distributed Fund Report - Admin Module
 * EXACT replica of admin/report/funds/index.blade.php from old CMDMS
 */

import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { mockCandidates, mockAnnualSchemes, approvalStatuses, approvalForums, schemeStatuses } from '../../../../lib/mocks/data/annualSchemes';
import { schemeCategories, schemeTypes } from '../../../../lib/mocks/data/schemes';

// Format date as 'd-m-Y'
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

export default function CandidateDistributedFundReport() {
  const [searchParams, setSearchParams] = useSearchParams();
  const candidateId = searchParams.get('candidate');
  const [selectedCandidateId, setSelectedCandidateId] = useState(candidateId || '');

  // Find selected candidate
  const selectedCandidate = useMemo(() => {
    if (!selectedCandidateId) return null;
    return mockCandidates.find(c => c.id === Number(selectedCandidateId));
  }, [selectedCandidateId]);

  // Find schemes with fund distributions for the selected candidate
  const candidateSchemes = useMemo(() => {
    if (!selectedCandidate) return null;
    
    // Find all schemes that have fund distributions for this candidate
    const schemesWithDistributions = mockAnnualSchemes.filter(scheme => 
      scheme.fundDistributions?.some(dist => dist.candidate_id === selectedCandidate.id)
    );

    if (schemesWithDistributions.length === 0) return null;

    // Get all fund distributions for this candidate
    const distributions = schemesWithDistributions.flatMap(scheme => 
      (scheme.fundDistributions || [])
        .filter(dist => dist.candidate_id === selectedCandidate.id)
        .map(dist => ({
          ...dist,
          annualScheme: scheme
        }))
    );

    return {
      candidate: selectedCandidate,
      distributions
    };
  }, [selectedCandidate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCandidateId) {
      setSearchParams({ candidate: selectedCandidateId });
    } else {
      setSearchParams({});
    }
  };

  const handleReset = () => {
    setSelectedCandidateId('');
    setSearchParams({});
  };

  const handlePrint = () => {
    const printArea = document.getElementById('print-area');
    if (printArea) {
      let printSection = document.getElementById('printSection');
      if (!printSection) {
        const newPrintSection = document.createElement('div');
        newPrintSection.id = 'printSection';
        newPrintSection.className = 'container-fluid page-body-wrapper';
        document.body.appendChild(newPrintSection);
        printSection = newPrintSection;
      }
      if (printSection) {
        printSection.innerHTML = '';
        const domClone = printArea.cloneNode(true);
        printSection.appendChild(domClone);
        window.print();
      }
    }
  };

  return (
    <div className="content-wrapper">
      <style>
        {`
          .accordion .card .card-header h6,
          .accordion .card .card-header a {
            color: #272020 !important;
          }
          .accordion .card .card-header {
            padding: 1rem !important;
            background-color: #F8C146 !important;
          }
          @media print {
            body {
              margin: 0;
              color: #000;
              background-color: #fff;
            }
            body * {
              visibility: hidden;
            }
            .accordion .card .card-body {
              max-height: fit-content !important;
              overflow-y: visible;
            }
            table thead {
              display: table-row-group !important;
              background: #fff !important;
              color: #000 !important;
            }
            table.table thead tr,
            table thead tr,
            tr.table-head-bg-color {
              background: #fff !important;
              color: #000 !important;
            }
            .table-striped tbody tr:nth-of-type(odd) {
              background-color: #fff !important;
            }
            #printSection,
            #printSection * {
              visibility: visible;
            }
            #printSection {
              position: absolute;
              top: 0;
              width: 100%;
            }
            .dd-meeting-title-heading {
              background: #f6f8f7 !important;
              color: #000000 !important;
            }
            .hide_in_print {
              display: none !important;
            }
            .show_in_print {
              display: block !important;
            }
          }
          table#annual_scheme_table th {
            border: 1px solid silver;
          }
        `}
      </style>
      <div className="row">
        <div className="col-12 grid-margin stretch-card">
          <div className="card mb-4">
            <div className="card-body">
              <h4>Filter By Candidate</h4>
              <form className="forms-sample" onSubmit={handleSubmit} id="overall_department_wise_report">
                <div className="row">
                  <div className="col-md-8">
                    <div className="form-group mb-2">
                      <select
                        name="candidate"
                        id="candidate"
                        className="js-example-basic-single w-100 form-control"
                        required
                        value={selectedCandidateId}
                        onChange={(e) => setSelectedCandidateId(e.target.value)}
                      >
                        <option value="">--Select Candidate--</option>
                        {mockCandidates.map((candidate) => (
                          <option key={candidate.id} value={candidate.id.toString()}>
                            {candidate.name} - {candidate.constituency} {candidate.district}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <button type="submit" className="btn btn-success">Search</button>
                    <button type="button" onClick={handleReset} className="btn btn-warning btn-md">Reset</button>
                  </div>
                </div>
              </form>

              {candidateId && (
                <>
                  <div className="my-5 text-center">
                    {selectedCandidate ? (
                      <h3>
                        Candidate Scheme's Report - {selectedCandidate.name} - {selectedCandidate.constituency} {selectedCandidate.district}
                      </h3>
                    ) : (
                      <h3>Candidate Report</h3>
                    )}
                  </div>
                  {candidateSchemes && candidateSchemes.distributions.length > 0 ? (
                    <>
                      <div className="row">
                        <div className="col-12 mb-2">
                          <button
                            type="button"
                            className="btn btn-info btn-icon-text pull-right"
                            id="btnPrint"
                            onClick={handlePrint}
                          >
                            <i className="ti-printer mr-1"></i> Print all
                          </button>
                        </div>
                      </div>
                      <div id="print-area">
                        <div className="row">
                          <div className="table-responsive">
                            <table id="annual_scheme_table" className="table table-bordered table-striped">
                              <thead className="table-light">
                                <tr>
                                  <th>S.#</th>
                                  <th>MPA / MNA / Source Person</th>
                                  <th>Constituency</th>
                                  <th>District</th>
                                  <th>Party</th>
                                  <th>Sector</th>
                                  <th>Code & Nomenclature of ADP Scheme</th>
                                  <th>Total Cost of Scheme</th>
                                  <th>Share/Quantity</th>
                                  <th>Allocated Fund</th>
                                </tr>
                              </thead>
                              <tbody>
                                {candidateSchemes.distributions.map((distribution, index) => {
                                  const scheme = distribution.annualScheme;
                                  const isFirstRow = index === 0;
                                  return (
                                    <tr key={distribution.id}>
                                      {isFirstRow ? (
                                        <>
                                          <td>{index + 1}</td>
                                          <td>
                                            {selectedCandidate?.name} - MNA/MPA
                                          </td>
                                          <td>{selectedCandidate?.constituency}</td>
                                          <td>{selectedCandidate?.district}</td>
                                          <td>Party Name</td>
                                        </>
                                      ) : (
                                        <>
                                          <td></td>
                                          <td></td>
                                          <td></td>
                                          <td></td>
                                          <td></td>
                                        </>
                                      )}
                                      <td>{scheme.sub_sector_name}</td>
                                      <td>
                                        ADP# {scheme.serial_no}<br />
                                        Code: {scheme.code}<br />
                                        <div dangerouslySetInnerHTML={{ __html: scheme.name }} />
                                        <br />
                                        ({approvalStatuses[scheme.is_approved] || scheme.is_approved}) /{' '}
                                        {approvalForums[scheme.approval_forum] || scheme.approval_forum} /{' '}
                                        {formatDate(scheme.approval_date)}
                                        <br />
                                        {schemeStatuses[scheme.status] || scheme.status}
                                        <br />
                                        {schemeCategories[scheme.category] || scheme.category}
                                        <br />
                                        {schemeTypes[scheme.type] || scheme.type}
                                      </td>
                                      <td>
                                        {scheme.costs && scheme.costs.length > 0
                                          ? scheme.costs[0].local
                                          : ''}
                                      </td>
                                      <td>{distribution.quantity || ''}</td>
                                      <td>{distribution.allocated_fund}</td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="row">
                      <div className="col-md-12 text-center">No result found.</div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
