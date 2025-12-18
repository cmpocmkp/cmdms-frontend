/**
 * Add Annual Scheme - Admin Module
 * EXACT replica of admin/funds/annualschemes/add.blade.php from old CMDMS
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { mockSubSectors, approvalStatuses, approvalForums, schemeStatuses } from '../../../../lib/mocks/data/annualSchemes';
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

export default function AddAnnualScheme() {
  const today = new Date();
  const dateStr = today.toISOString().split('T')[0];

  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [serialNo, setSerialNo] = useState('');
  const [subSectorId, setSubSectorId] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [type, setType] = useState<string>('');
  const [approvalForum, setApprovalForum] = useState<string>('');
  const [approvalDate, setApprovalDate] = useState(dateStr);
  const [startYear, setStartYear] = useState<string>('');
  const [endYear, setEndYear] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [isApproved, setIsApproved] = useState<string>('');
  const [isQuantifiable, setIsQuantifiable] = useState(false);
  const [financialProgress, setFinancialProgress] = useState('');
  const [physicalProgress, setPhysicalProgress] = useState('');
  const [districts, setDistricts] = useState<string[]>([]);
  
  // Costs
  const [costLocal, setCostLocal] = useState('');
  const [costForeign, setCostForeign] = useState('');
  const [costYear, setCostYear] = useState<string>('');
  
  // Expenditures
  const [expenditureUptoJune, setExpenditureUptoJune] = useState('');
  const [expenditureYear, setExpenditureYear] = useState<string>('');
  
  // Allocations
  const [allocationCapital, setAllocationCapital] = useState('');
  const [allocationRevenue, setAllocationRevenue] = useState('');
  const [allocationTotal, setAllocationTotal] = useState('');
  const [allocationForeign, setAllocationForeign] = useState('');
  const [allocationYear, setAllocationYear] = useState<string>('');
  
  // Through Forward
  const [throughForwardAmount, setThroughForwardAmount] = useState('');
  const [throughForwardYear, setThroughForwardYear] = useState<string>('');
  
  // Revision
  const [isRevised, setIsRevised] = useState<string>('');
  const [revisionNumber, setRevisionNumber] = useState('');
  const [revisedDate, setRevisedDate] = useState('');
  const [revisionNewEndYear, setRevisionNewEndYear] = useState<string>('');
  const [revisionNotes, setRevisionNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Add Annual Scheme:', {
      name,
      code,
      serial_no: serialNo,
      sub_sector_id: subSectorId,
      category,
      type,
      approval_forum: approvalForum,
      approval_date: approvalDate,
      start_year: startYear,
      end_year: endYear,
      status,
      is_approved: isApproved,
      is_quantifiable: isQuantifiable,
      financial_progress: financialProgress,
      physical_progress: physicalProgress,
      districts,
      cost: { local: costLocal, foreign: costForeign, year: costYear },
      expenditure: { expenditure_upto_june: expenditureUptoJune, year: expenditureYear },
      allocation: { capital: allocationCapital, revenue: allocationRevenue, total: allocationTotal, foreign: allocationForeign, year: allocationYear },
      throughforward: { amount: throughForwardAmount, year: throughForwardYear },
      revision: isRevised === '1' ? { revision_number: revisionNumber, revised_date: revisedDate, new_end_year: revisionNewEndYear, notes: revisionNotes } : null
    });
    alert('Add Annual Scheme functionality will be implemented with backend API');
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setDistricts(selectedOptions);
  };

  return (
    <div className="content-wrapper">
      <style>
        {`
          .select2-container--default .select2-selection--multiple .select2-selection__rendered {
            height: 140px !important;
          }
        `}
      </style>
      <div className="card">
        <div className="card-body">
          <Link to="/admin/funds/annualschemes" style={{ float: 'right' }}>
            Show Annual Schemes
          </Link>
          <h4 className="card-title text-primary">Add new Annual Scheme</h4>
        </div>
      </div>
      <div className="card">
        <div className="card-body">
          <h4 className="card-title text-primary">Scheme</h4>
          <div className="row">
            <div className="col-md-12">
              <form
                className="form-sample"
                onSubmit={handleSubmit}
                encType="multipart/form-data"
                id="record_note_form"
              >
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Name</label>
                      <input
                        type="text"
                        name="scheme[name]"
                        id="name"
                        className="form-control"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>Code</label>
                      <input
                        type="number"
                        name="scheme[code]"
                        id="scheme_code"
                        className="form-control"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>Serial No</label>
                      <input
                        type="number"
                        name="scheme[serial_no]"
                        id="serial_no"
                        className="form-control"
                        value={serialNo}
                        onChange={(e) => setSerialNo(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>Subsectors</label>
                      <select
                        name="scheme[sub_sector_id]"
                        id="sub_sector_id"
                        className="js-example-basic-single w-100 form-control form-control-lg"
                        required
                        value={subSectorId}
                        onChange={(e) => setSubSectorId(e.target.value)}
                      >
                        <option value="">Select</option>
                        {mockSubSectors.map((subSector) => (
                          <option key={subSector.id} value={subSector.id.toString()}>
                            {subSector.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>Category</label>
                      <select
                        name="scheme[category]"
                        id="scheme_category"
                        className="js-example-basic-single w-100 form-control form-control-lg"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                      >
                        <option value="">Select</option>
                        {Object.entries(schemeCategories).map(([key, value]) => (
                          <option key={key} value={key}>
                            {String(value)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>Type</label>
                      <select
                        name="scheme[type]"
                        id="scheme_type"
                        className="js-example-basic-single w-100 form-control form-control-lg"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                      >
                        <option value="">Select</option>
                        {Object.entries(schemeTypes).map(([key, value]) => (
                          <option key={key} value={key}>
                            {String(value)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>Approval Forum</label>
                      <select
                        name="scheme[approval_forum]"
                        id="scheme_approval_forum"
                        className="js-example-basic-single w-100 form-control form-control-lg"
                        value={approvalForum}
                        onChange={(e) => setApprovalForum(e.target.value)}
                      >
                        <option value="">Select</option>
                        {Object.entries(approvalForums).map(([key, value]) => (
                          <option key={key} value={key}>
                            {value}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>Approval Date</label>
                      <input
                        type="date"
                        name="scheme[approval_date]"
                        id="scheme_approval_date"
                        className="form-control"
                        required
                        value={approvalDate}
                        onChange={(e) => setApprovalDate(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-2">
                    <div className="form-group">
                      <label>Start Year</label>
                      <select
                        name="scheme[start_year]"
                        id="scheme_start_year"
                        className="js-example-basic-single w-100 form-control form-control-lg"
                        value={startYear}
                        onChange={(e) => setStartYear(e.target.value)}
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
                  <div className="col-md-2">
                    <div className="form-group">
                      <label>End Year</label>
                      <select
                        name="scheme[end_year]"
                        id="scheme_end_year"
                        className="js-example-basic-single w-100 form-control form-control-lg"
                        value={endYear}
                        onChange={(e) => setEndYear(e.target.value)}
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
                  <div className="col-md-2">
                    <div className="form-group">
                      <label>Status</label>
                      <select
                        name="scheme[status]"
                        id="scheme_status"
                        className="js-example-basic-single w-100 form-control form-control-lg"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                      >
                        <option value="">Select</option>
                        {Object.entries(schemeStatuses).map(([key, value]) => (
                          <option key={key} value={key}>
                            {value}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="col-md-2">
                    <div className="form-group">
                      <label>Approval Status</label>
                      <select
                        name="scheme[is_approved]"
                        id="scheme_is_approved"
                        className="js-example-basic-single w-100 form-control form-control-lg"
                        value={isApproved}
                        onChange={(e) => setIsApproved(e.target.value)}
                      >
                        <option value="">Select</option>
                        {Object.entries(approvalStatuses).map(([key, value]) => (
                          <option key={key} value={key}>
                            {value}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="col-md-2 mt-4">
                    <div className="form-group">
                      <div className="form-check">
                        <label className="form-check-label">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            name="scheme[is_quantifiable]"
                            id="is_quantifiable"
                            checked={isQuantifiable}
                            onChange={(e) => setIsQuantifiable(e.target.checked)}
                          />
                          Is Scheme Quantifiable
                          <i className="input-helper"></i>
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-5">
                    <div className="form-group">
                      <label htmlFor="annual schme financial progress">Financial Progress</label>
                      <textarea
                        className="form-control"
                        id="financial_progress"
                        name="scheme[financial_progress]"
                        rows={4}
                        value={financialProgress}
                        onChange={(e) => setFinancialProgress(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-5">
                    <div className="form-group">
                      <label htmlFor="annual schme physical progress">Physical Progress</label>
                      <textarea
                        className="form-control"
                        id="physical_progress"
                        name="scheme[physical_progress]"
                        rows={4}
                        value={physicalProgress}
                        onChange={(e) => setPhysicalProgress(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-12">
                    <label>Assigned Districts</label>
                    <div className="form-group">
                      <select
                        id="add_districts_dropdown"
                        name="districts[]"
                        style={{ width: '500px' }}
                        className="js-example-basic-multiple w-100 form-control form-control-lg"
                        multiple
                        value={districts}
                        onChange={handleDistrictChange}
                      >
                        <option value="">select districts</option>
                        {schemeMockDistricts.map((district) => (
                          <option key={district.id} value={district.id.toString()}>
                            {district.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="col-md-12 grid-margin stretch-card">
                    <div className="card">
                      <div className="card-body">
                        <h4 className="card-title">Revisions (Optional)</h4>
                        <div className="row">
                          <div className="col-md-3">
                            <div className="form-group">
                              <label>Is Revised</label>
                              <select
                                name="scheme[revision]"
                                id="scheme_revision"
                                className="js-example-basic-single w-100 form-control form-control-lg"
                                value={isRevised}
                                onChange={(e) => setIsRevised(e.target.value)}
                              >
                                <option value="">Select</option>
                                <option value="0">NO</option>
                                <option value="1">Yes</option>
                              </select>
                            </div>
                          </div>
                          <div className="col-md-3">
                            <div className="form-group">
                              <label>Revision Number</label>
                              <input
                                type="number"
                                name="revision[revision_number]"
                                id="revision_number"
                                className="form-control"
                                value={revisionNumber}
                                onChange={(e) => setRevisionNumber(e.target.value)}
                              />
                            </div>
                          </div>
                          <div className="col-md-3">
                            <div className="form-group">
                              <label>Revision Date</label>
                              <input
                                type="date"
                                name="revision[revised_date]"
                                id="scheme_revised_date"
                                className="form-control"
                                value={revisedDate}
                                onChange={(e) => setRevisedDate(e.target.value)}
                              />
                            </div>
                          </div>
                          <div className="col-md-3">
                            <div className="form-group">
                              <label>New End Year</label>
                              <select
                                name="revision[new_end_year]"
                                id="revision_new_end_year"
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
                            <label>Revision Note</label>
                            <div className="form-group">
                              <textarea
                                name="revision[notes]"
                                className="form-control"
                                id="addmeetingsubject"
                                rows={4}
                                value={revisionNotes}
                                onChange={(e) => setRevisionNotes(e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-4 grid-margin stretch-card">
                    <div className="card">
                      <div className="card-body">
                        <h4 className="card-title">Costs</h4>
                        <div className="row">
                          <div className="col-md-6">
                            <div className="form-group">
                              <label>Local</label>
                              <input
                                type="number"
                                name="cost[local]"
                                step="any"
                                id="cost_local"
                                className="form-control"
                                value={costLocal}
                                onChange={(e) => setCostLocal(e.target.value)}
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group">
                              <label>Foreign</label>
                              <input
                                type="number"
                                name="cost[foreign]"
                                step="any"
                                id="costforeign"
                                className="form-control"
                                value={costForeign}
                                onChange={(e) => setCostForeign(e.target.value)}
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group">
                              <label>Year</label>
                              <select
                                name="cost[year]"
                                id="cost_year"
                                className="js-example-basic-single w-100 form-control form-control-lg"
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
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 grid-margin stretch-card">
                    <div className="card">
                      <div className="card-body">
                        <h4 className="card-title">Expenditures</h4>
                        <div className="row">
                          <div className="col-md-6">
                            <div className="form-group">
                              <label>Expenditure Up to June</label>
                              <input
                                type="number"
                                step="any"
                                name="expenditure[expenditure_upto_june]"
                                id="expenditure_upto_june"
                                className="form-control"
                                value={expenditureUptoJune}
                                onChange={(e) => setExpenditureUptoJune(e.target.value)}
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group">
                              <label>Year</label>
                              <select
                                name="expenditure[year]"
                                id="expenditure_end_year"
                                className="js-example-basic-single w-100 form-control form-control-lg"
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
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 grid-margin stretch-card">
                    <div className="card">
                      <div className="card-body">
                        <h4 className="card-title">Allocations</h4>
                        <div className="row">
                          <div className="col-md-6">
                            <div className="form-group">
                              <label>Capital</label>
                              <input
                                type="number"
                                step="any"
                                name="allocation[capital]"
                                id="allocation_capital"
                                className="form-control"
                                value={allocationCapital}
                                onChange={(e) => setAllocationCapital(e.target.value)}
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group">
                              <label>Revenue</label>
                              <input
                                type="number"
                                step="any"
                                name="allocation[revenue]"
                                id="allocation_revenue"
                                className="form-control"
                                value={allocationRevenue}
                                onChange={(e) => setAllocationRevenue(e.target.value)}
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group">
                              <label>Foreign</label>
                              <input
                                type="number"
                                step="any"
                                name="allocation[foreign]"
                                id="allocation_foreign"
                                className="form-control"
                                value={allocationForeign}
                                onChange={(e) => setAllocationForeign(e.target.value)}
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group">
                              <label>Total</label>
                              <input
                                type="number"
                                step="any"
                                name="allocation[total]"
                                id="allocation_total"
                                className="form-control"
                                value={allocationTotal}
                                onChange={(e) => setAllocationTotal(e.target.value)}
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group">
                              <label>Year</label>
                              <select
                                name="allocation[year]"
                                id="allocation_year"
                                className="js-example-basic-single w-100 form-control form-control-lg"
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
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 grid-margin stretch-card">
                    <div className="card">
                      <div className="card-body">
                        <h4 className="card-title">Through Forward</h4>
                        <div className="row">
                          <div className="col-md-6">
                            <div className="form-group">
                              <label>Amount</label>
                              <input
                                type="number"
                                step="any"
                                name="throughforward[amount]"
                                id="throughforward_amount"
                                className="form-control"
                                value={throughForwardAmount}
                                onChange={(e) => setThroughForwardAmount(e.target.value)}
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group">
                              <label>Year</label>
                              <select
                                name="throughforward[year]"
                                id="throughforward_year"
                                className="js-example-basic-single w-100 form-control form-control-lg"
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
                      </div>
                    </div>
                  </div>
                </div>
                <button type="submit" className="btn btn-success mr-2">
                  Save
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
