/**
 * Edit Annual Scheme - Admin Module
 * EXACT replica of admin/funds/annualschemes/edit.blade.php from old CMDMS
 */

import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { mockAnnualSchemes, mockSubSectors, approvalStatuses, approvalForums, schemeStatuses } from '../../../../lib/mocks/data/annualSchemes';
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

export default function EditAnnualScheme() {
  const { id } = useParams<{ id: string }>();
  const annualScheme = mockAnnualSchemes.find(s => s.id === Number(id));

  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [serialNo, setSerialNo] = useState('');
  const [subSectorId, setSubSectorId] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [type, setType] = useState<string>('');
  const [approvalForum, setApprovalForum] = useState<string>('');
  const [approvalDate, setApprovalDate] = useState('');
  const [startYear, setStartYear] = useState<string>('');
  const [endYear, setEndYear] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [isApproved, setIsApproved] = useState<string>('');
  const [isQuantifiable, setIsQuantifiable] = useState(false);
  const [financialProgress, setFinancialProgress] = useState('');
  const [physicalProgress, setPhysicalProgress] = useState('');
  const [districts, setDistricts] = useState<string[]>([]);

  useEffect(() => {
    if (annualScheme) {
      setName(annualScheme.name);
      setCode(annualScheme.code);
      setSerialNo(annualScheme.serial_no.toString());
      setSubSectorId(annualScheme.sub_sector_id.toString());
      setCategory(annualScheme.category);
      setType(annualScheme.type);
      setApprovalForum(annualScheme.approval_forum);
      setApprovalDate(annualScheme.approval_date);
      setStartYear(annualScheme.start_year?.toString() || '');
      setEndYear(annualScheme.end_year?.toString() || '');
      setStatus(annualScheme.status);
      setIsApproved(annualScheme.is_approved);
      setIsQuantifiable(annualScheme.is_quantifiable);
      setFinancialProgress(annualScheme.financial_progress || '');
      setPhysicalProgress(annualScheme.physical_progress || '');
      setDistricts(annualScheme.districts.map(d => d.toString()));
    }
  }, [annualScheme]);

  if (!annualScheme) {
    return (
      <div className="content-wrapper">
        <div className="alert alert-danger">Annual Scheme not found</div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Update Annual Scheme:', {
      id: annualScheme.id,
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
      districts
    });
    alert('Update Annual Scheme functionality will be implemented with backend API');
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
          <h4 className="card-title">Edit Annual Scheme</h4>
        </div>
      </div>
      <div className="card">
        <div className="card-body">
          <Link
            to={`/admin/funds/annualschemes/show/${annualScheme.id}`}
            className="card-title text-primary mb-2"
          >
            view scheme detail
          </Link>
          <div className="row mt-5">
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
                        style={{ width: '300px' }}
                        className="js-example-basic-multiple w-100 form-control form-control-lg"
                        multiple
                        value={districts}
                        onChange={handleDistrictChange}
                      >
                        {schemeMockDistricts.map((district) => (
                          <option key={district.id} value={district.id.toString()}>
                            {district.name}
                          </option>
                        ))}
                      </select>
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
