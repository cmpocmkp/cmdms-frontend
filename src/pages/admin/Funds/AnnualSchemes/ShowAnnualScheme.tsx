/**
 * Show Annual Scheme - Admin Module
 * EXACT replica of admin/funds/annualschemes/show.blade.php from old CMDMS
 */

import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { mockAnnualSchemes, approvalStatuses, approvalForums, schemeStatuses, Cost, Expenditure, Allocation, ThroughForward, SchemeRevision } from '../../../../lib/mocks/data/annualSchemes';
import { schemeMockDistricts, schemeCategories, schemeTypes } from '../../../../lib/mocks/data/schemes';

// Generate year options (from current year + 5 down to 1900)
const generateYearOptions = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let year = currentYear + 5; year >= 1900; year--) {
    years.push(year);
  }
  return years;
};

const yearOptions = generateYearOptions();

// Format date as 'd-m-Y'
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

export default function ShowAnnualScheme() {
  const { id } = useParams<{ id: string }>();
  const annualScheme = mockAnnualSchemes.find(s => s.id === Number(id));

  // Modal states
  const [showCostModal, setShowCostModal] = useState(false);
  const [showExpenditureModal, setShowExpenditureModal] = useState(false);
  const [showAllocationModal, setShowAllocationModal] = useState(false);
  const [showThroughForwardModal, setShowThroughForwardModal] = useState(false);
  const [showSchemeRevisionModal, setShowSchemeRevisionModal] = useState(false);

  // Cost form state
  const [costId, setCostId] = useState<number | null>(null);
  const [costLocal, setCostLocal] = useState('');
  const [costForeign, setCostForeign] = useState('');
  const [costYear, setCostYear] = useState<string>('');

  // Expenditure form state
  const [expenditureId, setExpenditureId] = useState<number | null>(null);
  const [expenditureUptoJune, setExpenditureUptoJune] = useState('');
  const [expenditureYear, setExpenditureYear] = useState<string>('');

  // Allocation form state
  const [allocationId, setAllocationId] = useState<number | null>(null);
  const [allocationCapital, setAllocationCapital] = useState('');
  const [allocationRevenue, setAllocationRevenue] = useState('');
  const [allocationTotal, setAllocationTotal] = useState('');
  const [allocationForeign, setAllocationForeign] = useState('');
  const [allocationYear, setAllocationYear] = useState<string>('');

  // ThroughForward form state
  const [throughForwardId, setThroughForwardId] = useState<number | null>(null);
  const [throughForwardAmount, setThroughForwardAmount] = useState('');
  const [throughForwardYear, setThroughForwardYear] = useState<string>('');

  // SchemeRevision form state
  const [schemeRevisionId, setSchemeRevisionId] = useState<number | null>(null);
  const [revisionNumber, setRevisionNumber] = useState('');
  const [revisedDate, setRevisedDate] = useState('');
  const [revisionNewEndYear, setRevisionNewEndYear] = useState<string>('');
  const [revisionNotes, setRevisionNotes] = useState('');

  // Local state for costs, expenditures, etc. (will be updated via API in real implementation)
  const [costs, setCosts] = useState<Cost[]>([]);
  const [expenditures, setExpenditures] = useState<Expenditure[]>([]);
  const [allocations, setAllocations] = useState<Allocation[]>([]);
  const [throughForwards, setThroughForwards] = useState<ThroughForward[]>([]);
  const [schemeRevisions, setSchemeRevisions] = useState<SchemeRevision[]>([]);

  useEffect(() => {
    if (annualScheme) {
      setCosts(annualScheme.costs || []);
      setExpenditures(annualScheme.expenditures || []);
      setAllocations(annualScheme.allocations || []);
      setThroughForwards(annualScheme.throughForwards || []);
      setSchemeRevisions(annualScheme.schemeRevisions || []);
    }
  }, [annualScheme]);

  if (!annualScheme) {
    return (
      <div className="content-wrapper">
        <div className="alert alert-danger">Annual Scheme not found</div>
      </div>
    );
  }

  const districts = schemeMockDistricts.filter(d => annualScheme.districts.includes(d.id));

  // Cost handlers
  const handleAddCost = () => {
    setCostId(null);
    setCostLocal('');
    setCostForeign('');
    setCostYear('');
    setShowCostModal(true);
  };

  const handleEditCost = (cost: Cost) => {
    setCostId(cost.id);
    setCostLocal(cost.local.toString());
    setCostForeign(cost.foreign.toString());
    setCostYear(cost.year.toString());
    setShowCostModal(true);
  };

  const handleDeleteCost = (costId: number) => {
    if (confirm('Are you sure?')) {
      setCosts(costs.filter(c => c.id !== costId));
      alert('Cost deleted successfully!');
    }
  };

  const handleCostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (costId) {
      // Update
      setCosts(costs.map(c => c.id === costId ? {
        ...c,
        local: parseFloat(costLocal),
        foreign: parseFloat(costForeign),
        year: parseInt(costYear)
      } : c));
      alert('Cost updated successfully!');
    } else {
      // Add
      const newCost: Cost = {
        id: costs.length + 1,
        annual_scheme_id: annualScheme.id,
        local: parseFloat(costLocal),
        foreign: parseFloat(costForeign),
        year: parseInt(costYear),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      setCosts([...costs, newCost]);
      alert('Cost added successfully!');
    }
    setShowCostModal(false);
  };

  // Expenditure handlers
  const handleAddExpenditure = () => {
    setExpenditureId(null);
    setExpenditureUptoJune('');
    setExpenditureYear('');
    setShowExpenditureModal(true);
  };

  const handleEditExpenditure = (expenditure: Expenditure) => {
    setExpenditureId(expenditure.id);
    setExpenditureUptoJune(expenditure.expenditure_upto_june.toString());
    setExpenditureYear(expenditure.year.toString());
    setShowExpenditureModal(true);
  };

  const handleDeleteExpenditure = (expenditureId: number) => {
    if (confirm('Are you sure?')) {
      setExpenditures(expenditures.filter(e => e.id !== expenditureId));
      alert('Expenditure deleted successfully!');
    }
  };

  const handleExpenditureSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (expenditureId) {
      setExpenditures(expenditures.map(e => e.id === expenditureId ? {
        ...e,
        expenditure_upto_june: parseFloat(expenditureUptoJune),
        year: parseInt(expenditureYear)
      } : e));
      alert('Expenditure updated successfully!');
    } else {
      const newExpenditure: Expenditure = {
        id: expenditures.length + 1,
        annual_scheme_id: annualScheme.id,
        expenditure_upto_june: parseFloat(expenditureUptoJune),
        year: parseInt(expenditureYear),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      setExpenditures([...expenditures, newExpenditure]);
      alert('Expenditure added successfully!');
    }
    setShowExpenditureModal(false);
  };

  // Allocation handlers
  const handleAddAllocation = () => {
    setAllocationId(null);
    setAllocationCapital('');
    setAllocationRevenue('');
    setAllocationTotal('');
    setAllocationForeign('');
    setAllocationYear('');
    setShowAllocationModal(true);
  };

  const handleEditAllocation = (allocation: Allocation) => {
    setAllocationId(allocation.id);
    setAllocationCapital(allocation.capital.toString());
    setAllocationRevenue(allocation.revenue.toString());
    setAllocationTotal(allocation.total.toString());
    setAllocationForeign(allocation.foreign.toString());
    setAllocationYear(allocation.year.toString());
    setShowAllocationModal(true);
  };

  const handleDeleteAllocation = (allocationId: number) => {
    if (confirm('Are you sure?')) {
      setAllocations(allocations.filter(a => a.id !== allocationId));
      alert('Allocation deleted successfully!');
    }
  };

  const handleAllocationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (allocationId) {
      setAllocations(allocations.map(a => a.id === allocationId ? {
        ...a,
        capital: parseFloat(allocationCapital),
        revenue: parseFloat(allocationRevenue),
        total: parseFloat(allocationTotal),
        foreign: parseFloat(allocationForeign),
        year: parseInt(allocationYear)
      } : a));
      alert('Allocation updated successfully!');
    } else {
      const newAllocation: Allocation = {
        id: allocations.length + 1,
        annual_scheme_id: annualScheme.id,
        capital: parseFloat(allocationCapital),
        revenue: parseFloat(allocationRevenue),
        total: parseFloat(allocationTotal),
        foreign: parseFloat(allocationForeign),
        year: parseInt(allocationYear),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      setAllocations([...allocations, newAllocation]);
      alert('Allocation added successfully!');
    }
    setShowAllocationModal(false);
  };

  // ThroughForward handlers
  const handleAddThroughForward = () => {
    setThroughForwardId(null);
    setThroughForwardAmount('');
    setThroughForwardYear('');
    setShowThroughForwardModal(true);
  };

  const handleEditThroughForward = (throughForward: ThroughForward) => {
    setThroughForwardId(throughForward.id);
    setThroughForwardAmount(throughForward.amount.toString());
    setThroughForwardYear(throughForward.year.toString());
    setShowThroughForwardModal(true);
  };

  const handleDeleteThroughForward = (throughForwardId: number) => {
    if (confirm('Are you sure?')) {
      setThroughForwards(throughForwards.filter(tf => tf.id !== throughForwardId));
      alert('ThroughForward deleted successfully!');
    }
  };

  const handleThroughForwardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (throughForwardId) {
      setThroughForwards(throughForwards.map(tf => tf.id === throughForwardId ? {
        ...tf,
        amount: parseFloat(throughForwardAmount),
        year: parseInt(throughForwardYear)
      } : tf));
      alert('ThroughForward updated successfully!');
    } else {
      const newThroughForward: ThroughForward = {
        id: throughForwards.length + 1,
        annual_scheme_id: annualScheme.id,
        amount: parseFloat(throughForwardAmount),
        year: parseInt(throughForwardYear),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      setThroughForwards([...throughForwards, newThroughForward]);
      alert('ThroughForward added successfully!');
    }
    setShowThroughForwardModal(false);
  };

  // SchemeRevision handlers
  const handleAddSchemeRevision = () => {
    setSchemeRevisionId(null);
    setRevisionNumber('');
    setRevisedDate('');
    setRevisionNewEndYear('');
    setRevisionNotes('');
    setShowSchemeRevisionModal(true);
  };

  const handleEditSchemeRevision = (revision: SchemeRevision) => {
    setSchemeRevisionId(revision.id);
    setRevisionNumber(revision.revision_number.toString());
    setRevisedDate(revision.revised_date);
    setRevisionNewEndYear(revision.new_end_year?.toString() || '');
    setRevisionNotes(revision.notes || '');
    setShowSchemeRevisionModal(true);
  };

  const handleDeleteSchemeRevision = (revisionId: number) => {
    if (confirm('Are you sure?')) {
      setSchemeRevisions(schemeRevisions.filter(sr => sr.id !== revisionId));
      alert('Scheme Revision deleted successfully!');
    }
  };

  const handleSchemeRevisionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (schemeRevisionId) {
      setSchemeRevisions(schemeRevisions.map(sr => sr.id === schemeRevisionId ? {
        ...sr,
        revision_number: parseInt(revisionNumber),
        revised_date: revisedDate,
        new_end_year: revisionNewEndYear ? parseInt(revisionNewEndYear) : undefined,
        notes: revisionNotes
      } : sr));
      alert('Scheme Revision updated successfully!');
    } else {
      const newRevision: SchemeRevision = {
        id: schemeRevisions.length + 1,
        annual_scheme_id: annualScheme.id,
        revision_number: parseInt(revisionNumber),
        revised_date: revisedDate,
        new_end_year: revisionNewEndYear ? parseInt(revisionNewEndYear) : undefined,
        notes: revisionNotes,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      setSchemeRevisions([...schemeRevisions, newRevision]);
      alert('Scheme Revision added successfully!');
    }
    setShowSchemeRevisionModal(false);
  };

  return (
    <div className="content-wrapper">
      <style>
        {`
          table#annual_scheme_table th {
            border: 1px solid silver;
          }
          .modal-body {
            max-height: 250px;
          }
          .table th, .jsgrid .jsgrid-table th, .table td, .jsgrid .jsgrid-table td {
            padding: 5px !important;
          }
        `}
      </style>
      <div className="card">
        <div className="card-body">
          <div className="row">
            <div className="col-12">
              <h4 className="card-title">
                Scheme detail
                <Link to="/admin/funds/annualschemes" style={{ float: 'right' }}>
                  Show Annual Schemes
                </Link>
              </h4>
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

          <div className="row mt-3">
            <div id="alertMessage" className="alert alert-fill-success d-none" role="alert"></div>
            <div className="col-md-6 grid-margin stretch-card">
              <div className="card">
                <div className="card-body">
                  <h4 className="card-title text-primary">Costs</h4>
                  <button
                    id="addCost"
                    className="btn btn-success btn-sm mb-3 pull-right"
                    onClick={handleAddCost}
                  >
                    Add Cost
                  </button>
                  <div className="table-responsive">
                    <table id="annual_scheme_table" className="table table-bordered text-center align-middle">
                      <thead className="table-light">
                        <tr>
                          <th rowSpan={2}>S.#</th>
                          <th rowSpan={2}>Local</th>
                          <th rowSpan={2}>Foreign</th>
                          <th rowSpan={2}>Year</th>
                          <th rowSpan={2}>
                            Action<br />
                          </th>
                        </tr>
                      </thead>
                      <tbody id="costTable">
                        {costs.length > 0 ? (
                          costs.map((cost, index) => (
                            <tr key={cost.id}>
                              <td>{index + 1}</td>
                              <td>{cost.local}</td>
                              <td>{cost.foreign}</td>
                              <td>{cost.year}</td>
                              <td>
                                <button
                                  className="btn btn-sm btn-primary edit"
                                  onClick={() => handleEditCost(cost)}
                                >
                                  Edit
                                </button>
                                <button
                                  className="btn btn-sm btn-danger delete"
                                  onClick={() => handleDeleteCost(cost.id)}
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={5}></td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6 grid-margin stretch-card">
              <div className="card">
                <div className="card-body">
                  <h4 className="card-title text-primary">Expenditures</h4>
                  <button
                    id="addExpenditure"
                    className="btn btn-success btn-sm mb-3 pull-right"
                    onClick={handleAddExpenditure}
                  >
                    Add Expenditure
                  </button>
                  <div className="table-responsive">
                    <table id="annual_scheme_table" className="table table-bordered text-center align-middle">
                      <thead className="table-light">
                        <tr>
                          <th rowSpan={2}>S.#</th>
                          <th rowSpan={2}>Expenditure upto June</th>
                          <th rowSpan={2}>Year</th>
                          <th rowSpan={2}>
                            Action<br />
                          </th>
                        </tr>
                      </thead>
                      <tbody id="expenditureTable">
                        {expenditures.length > 0 ? (
                          expenditures.map((expenditure, index) => (
                            <tr key={expenditure.id}>
                              <td>{index + 1}</td>
                              <td>{expenditure.expenditure_upto_june}</td>
                              <td>{expenditure.year}</td>
                              <td>
                                <button
                                  className="btn btn-sm btn-primary edit"
                                  onClick={() => handleEditExpenditure(expenditure)}
                                >
                                  Edit
                                </button>
                                <button
                                  className="btn btn-sm btn-danger delete"
                                  onClick={() => handleDeleteExpenditure(expenditure.id)}
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={4}>No data found</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6 grid-margin stretch-card">
              <div className="card">
                <div className="card-body">
                  <h4 className="card-title text-primary">Allocations</h4>
                  <button
                    id="addAllocation"
                    className="btn btn-success btn-sm mb-3 pull-right"
                    onClick={handleAddAllocation}
                  >
                    Add Allocation
                  </button>
                  <div className="table-responsive">
                    <table id="annual_scheme_table" className="table table-bordered text-center align-middle">
                      <thead className="table-light">
                        <tr>
                          <th rowSpan={2}>S.#</th>
                          <th rowSpan={2}>Capital</th>
                          <th rowSpan={2}>Revenue</th>
                          <th rowSpan={2}>Total</th>
                          <th rowSpan={2}>Foreign</th>
                          <th rowSpan={2}>Year</th>
                          <th rowSpan={2}>
                            Action<br />
                          </th>
                        </tr>
                      </thead>
                      <tbody id="allocationTable">
                        {allocations.length > 0 ? (
                          allocations.map((allocation, index) => (
                            <tr key={allocation.id}>
                              <td>{index + 1}</td>
                              <td>{allocation.capital}</td>
                              <td>{allocation.revenue}</td>
                              <td>{allocation.total}</td>
                              <td>{allocation.foreign}</td>
                              <td>{allocation.year}</td>
                              <td>
                                <button
                                  className="btn btn-sm btn-primary edit"
                                  onClick={() => handleEditAllocation(allocation)}
                                >
                                  Edit
                                </button>
                                <button
                                  className="btn btn-sm btn-danger delete"
                                  onClick={() => handleDeleteAllocation(allocation.id)}
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={7}>No data found</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6 grid-margin stretch-card">
              <div className="card">
                <div className="card-body">
                  <h4 className="card-title text-primary">ThroughForwards</h4>
                  <button
                    id="addThroughFarward"
                    className="btn btn-success btn-sm mb-3 pull-right"
                    onClick={handleAddThroughForward}
                  >
                    Add ThroughFarward
                  </button>
                  <div className="table-responsive">
                    <table id="annual_scheme_table" className="table table-bordered text-center align-middle">
                      <thead className="table-light">
                        <tr>
                          <th rowSpan={2}>S.#</th>
                          <th rowSpan={2}>Amount</th>
                          <th rowSpan={2}>Year</th>
                          <th rowSpan={2}>
                            Action<br />
                          </th>
                        </tr>
                      </thead>
                      <tbody id="throughFarwardTable">
                        {throughForwards.length > 0 ? (
                          throughForwards.map((throughForward, index) => (
                            <tr key={throughForward.id}>
                              <td>{index + 1}</td>
                              <td>{throughForward.amount}</td>
                              <td>{throughForward.year}</td>
                              <td>
                                <button
                                  className="btn btn-sm btn-primary edit"
                                  onClick={() => handleEditThroughForward(throughForward)}
                                >
                                  Edit
                                </button>
                                <button
                                  className="btn btn-sm btn-danger delete"
                                  onClick={() => handleDeleteThroughForward(throughForward.id)}
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={4}>No data found</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6 grid-margin stretch-card">
              <div className="card">
                <div className="card-body">
                  <h4 className="card-title text-primary">Scheme Revision</h4>
                  <button
                    id="addSchemeRevision"
                    className="btn btn-success btn-sm mb-3 pull-right"
                    onClick={handleAddSchemeRevision}
                  >
                    Add Revision
                  </button>
                  <div className="table-responsive">
                    <table id="annual_scheme_table" className="table table-bordered text-center align-middle">
                      <thead className="table-light">
                        <tr>
                          <th rowSpan={2}>S.#</th>
                          <th rowSpan={2}>Revision Number</th>
                          <th rowSpan={2}>Revised Date</th>
                          <th rowSpan={2}>Revised Notes</th>
                          <th rowSpan={2}>New End Year</th>
                          <th rowSpan={2}>
                            Action<br />
                          </th>
                        </tr>
                      </thead>
                      <tbody id="schemerevisionTable">
                        {schemeRevisions.length > 0 ? (
                          schemeRevisions.map((revision, index) => (
                            <tr key={revision.id}>
                              <td>{index + 1}</td>
                              <td>{revision.revision_number}</td>
                              <td>{formatDate(revision.revised_date)}</td>
                              <td>
                                <div dangerouslySetInnerHTML={{ __html: revision.notes || '' }} />
                              </td>
                              <td>{revision.new_end_year || ''}</td>
                              <td>
                                <button
                                  className="btn btn-sm btn-primary edit"
                                  onClick={() => handleEditSchemeRevision(revision)}
                                >
                                  Edit
                                </button>
                                <button
                                  className="btn btn-sm btn-danger delete"
                                  onClick={() => handleDeleteSchemeRevision(revision.id)}
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={6}>No data found</td>
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
      </div>

      {/* Cost Modal */}
      {showCostModal && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex={-1} role="dialog">
          <div className="modal-dialog" role="document">
            <form id="costForm" onSubmit={handleCostSubmit}>
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="modalLabel">
                    {costId ? 'Edit Cost' : 'Add Cost'}
                  </h5>
                  <button
                    type="button"
                    className="close"
                    onClick={() => setShowCostModal(false)}
                    aria-label="Close"
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <input type="hidden" id="costId" value={costId || ''} />
                  <input type="hidden" id="annual_scheme_id" value={annualScheme.id} />
                  <div className="mb-3">
                    <label htmlFor="local" className="form-label">Local</label>
                    <input
                      type="number"
                      step="0.001"
                      id="local"
                      className="form-control"
                      required
                      value={costLocal}
                      onChange={(e) => setCostLocal(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="foreign" className="form-label">Foreign</label>
                    <input
                      type="number"
                      step="0.001"
                      id="foreign"
                      className="form-control"
                      required
                      value={costForeign}
                      onChange={(e) => setCostForeign(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <div className="form-group">
                      <label>Year</label>
                      <select
                        name="year"
                        id="cost_year"
                        className="js-example-basic-single w-100 form-control form-control-lg"
                        required
                        value={costYear}
                        onChange={(e) => setCostYear(e.target.value)}
                      >
                        <option value="">Select</option>
                        {yearOptions.map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowCostModal(false)}>
                    Close
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Save
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Expenditure Modal */}
      {showExpenditureModal && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex={-1} role="dialog">
          <div className="modal-dialog" role="document">
            <form id="expenditureForm" onSubmit={handleExpenditureSubmit}>
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="expenditureModalLabel">
                    {expenditureId ? 'Edit Expenditure' : 'Add Expenditure'}
                  </h5>
                  <button
                    type="button"
                    className="close"
                    onClick={() => setShowExpenditureModal(false)}
                    aria-label="Close"
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <input type="hidden" id="expenditureId" value={expenditureId || ''} />
                  <input type="hidden" id="annual_scheme_id" value={annualScheme.id} />
                  <div className="mb-3">
                    <label htmlFor="expenditure_upto_june" className="form-label">Expenditure upto June</label>
                    <input
                      type="number"
                      step="0.001"
                      id="expenditure_upto_june"
                      className="form-control"
                      required
                      value={expenditureUptoJune}
                      onChange={(e) => setExpenditureUptoJune(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <div className="form-group">
                      <label>Year</label>
                      <select
                        name="expenditure_year"
                        id="expenditure_year"
                        className="js-example-basic-single w-100 form-control form-control-lg"
                        required
                        value={expenditureYear}
                        onChange={(e) => setExpenditureYear(e.target.value)}
                      >
                        <option value="">Select</option>
                        {yearOptions.map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowExpenditureModal(false)}>
                    Close
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Save
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Allocation Modal */}
      {showAllocationModal && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex={-1} role="dialog">
          <div className="modal-dialog" role="document">
            <form id="allocationForm" onSubmit={handleAllocationSubmit}>
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="allocationModalLabel">
                    {allocationId ? 'Edit Allocation' : 'Add Allocation'}
                  </h5>
                  <button
                    type="button"
                    className="close"
                    onClick={() => setShowAllocationModal(false)}
                    aria-label="Close"
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <input type="hidden" id="allocationId" value={allocationId || ''} />
                  <input type="hidden" id="annual_scheme_id" value={annualScheme.id} />
                  <div className="mb-3">
                    <label htmlFor="capital" className="form-label">capital</label>
                    <input
                      type="number"
                      step="0.001"
                      id="allocation_capital"
                      className="form-control"
                      required
                      value={allocationCapital}
                      onChange={(e) => setAllocationCapital(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="revenue" className="form-label">revenue</label>
                    <input
                      type="number"
                      step="0.001"
                      id="allocation_revenue"
                      className="form-control"
                      required
                      value={allocationRevenue}
                      onChange={(e) => setAllocationRevenue(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="total" className="form-label">total</label>
                    <input
                      type="number"
                      step="0.001"
                      id="allocation_total"
                      className="form-control"
                      required
                      value={allocationTotal}
                      onChange={(e) => setAllocationTotal(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="foreign" className="form-label">foreign</label>
                    <input
                      type="number"
                      step="0.001"
                      id="allocation_foreign"
                      className="form-control"
                      required
                      value={allocationForeign}
                      onChange={(e) => setAllocationForeign(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <div className="form-group">
                      <label>Year</label>
                      <select
                        name="allocation_year"
                        id="allocation_year"
                        className="js-example-basic-single w-100 form-control form-control-lg"
                        required
                        value={allocationYear}
                        onChange={(e) => setAllocationYear(e.target.value)}
                      >
                        <option value="">Select</option>
                        {yearOptions.map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowAllocationModal(false)}>
                    Close
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Save
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ThroughForward Modal */}
      {showThroughForwardModal && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex={-1} role="dialog">
          <div className="modal-dialog" role="document">
            <form id="throughforwardForm" onSubmit={handleThroughForwardSubmit}>
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="throughforwardModalLabel">
                    {throughForwardId ? 'Edit ThroughForward' : 'Add ThroughForward'}
                  </h5>
                  <button
                    type="button"
                    className="close"
                    onClick={() => setShowThroughForwardModal(false)}
                    aria-label="Close"
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <input type="hidden" id="throughforwardId" value={throughForwardId || ''} />
                  <input type="hidden" id="annual_scheme_id" value={annualScheme.id} />
                  <div className="mb-3">
                    <label htmlFor="amount" className="form-label">Amount</label>
                    <input
                      type="number"
                      step="0.001"
                      id="through_forward_amount"
                      className="form-control"
                      required
                      value={throughForwardAmount}
                      onChange={(e) => setThroughForwardAmount(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <div className="form-group">
                      <label>Year</label>
                      <select
                        name="through_forward_year"
                        id="through_forward_year"
                        className="js-example-basic-single w-100 form-control form-control-lg"
                        required
                        value={throughForwardYear}
                        onChange={(e) => setThroughForwardYear(e.target.value)}
                      >
                        <option value="">Select</option>
                        {yearOptions.map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowThroughForwardModal(false)}>
                    Close
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Save
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SchemeRevision Modal */}
      {showSchemeRevisionModal && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex={-1} role="dialog">
          <div className="modal-dialog" role="document">
            <form id="schemerevisionForm" onSubmit={handleSchemeRevisionSubmit}>
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="schemerevisionModalLabel">
                    {schemeRevisionId ? 'Edit Revision' : 'Add Revision'}
                  </h5>
                  <button
                    type="button"
                    className="close"
                    onClick={() => setShowSchemeRevisionModal(false)}
                    aria-label="Close"
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <div className="row">
                    <input type="hidden" id="schemerevisionId" value={schemeRevisionId || ''} />
                    <input type="hidden" id="annual_scheme_id" value={annualScheme.id} />
                    <div className="col-md-12">
                      <div className="form-group">
                        <label htmlFor="revision_number" className="form-label">Revision Number</label>
                        <input
                          type="number"
                          step="0.001"
                          id="sr_revision_number"
                          className="form-control"
                          required
                          value={revisionNumber}
                          onChange={(e) => setRevisionNumber(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="form-group">
                        <label htmlFor="revised_date" className="form-label">Revised Date</label>
                        <input
                          name="revised_date"
                          type="date"
                          id="sr_revised_date"
                          className="form-control"
                          required
                          value={revisedDate}
                          onChange={(e) => setRevisedDate(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="form-group">
                        <label>New End Year</label>
                        <select
                          name="reviced_new_year"
                          id="sr_revised_new_year"
                          className="js-example-basic-single w-100 form-control form-control-lg"
                          value={revisionNewEndYear}
                          onChange={(e) => setRevisionNewEndYear(e.target.value)}
                        >
                          <option value="">Select</option>
                          {yearOptions.map((year) => (
                            <option key={year} value={year}>
                              {year}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="col-md-12">
                      <label htmlFor="reviced_notes" className="form-label">Revised Notes</label>
                      <textarea
                        id="sr_revised_notes"
                        cols={5}
                        rows={5}
                        className="form-control"
                        value={revisionNotes}
                        onChange={(e) => setRevisionNotes(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowSchemeRevisionModal(false)}>
                    Close
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Save
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal backdrop */}
      {(showCostModal || showExpenditureModal || showAllocationModal || showThroughForwardModal || showSchemeRevisionModal) && (
        <div className="modal-backdrop fade show" onClick={() => {
          setShowCostModal(false);
          setShowExpenditureModal(false);
          setShowAllocationModal(false);
          setShowThroughForwardModal(false);
          setShowSchemeRevisionModal(false);
        }}></div>
      )}
    </div>
  );
}
