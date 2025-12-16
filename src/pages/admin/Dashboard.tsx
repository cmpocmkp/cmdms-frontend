/**
 * Admin Dashboard Page
 * EXACT replica of admin/dashboard.blade.php from old CMDMS
 */

import { useState } from 'react';
import { mockDepartments } from '../../lib/mocks/data/departments';

export default function Dashboard() {
  const [selectedDepartments, setSelectedDepartments] = useState<number[]>([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [showResults, setShowResults] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowResults(true);
    // In real app, this would fetch filtered data
  };
  
  const handleReset = () => {
    setSelectedDepartments([]);
    setStartDate('');
    setEndDate('');
    setSearchKeyword('');
    setShowResults(false);
  };
  
  return (
    <>
      <style>{`
        .select2-container--default .select2-selection--multiple {
          background-color: white;
          border: 1px solid #caccd7;
          border-radius: 2px!important;
          cursor: text;
          height: 46px!important;
        }
        .accordion .card .card-header h6, .accordion .card .card-header a {
          color: #272020 !important;
        }
        .accordion .card .card-header {
          padding: 1rem !important;
          background-color: #F8C146 !important;
        }
        .select2-container--default .select2-selection--multiple .select2-selection__choice {
          color: #ffffff;
          border: 0;
          border-radius: 3px;
          font-size: 8px !important;
          font-family: inherit;
          line-height: 1;
          font-weight: bold!important;
        }
        #department_decision_detial_repsort, #involved_meetings_table {
          width: 100% !important;
        }
        #department_decision_detial_repsort td, #involved_meetings_table td {
          border: 1px solid silver !important;
          vertical-align: top !important;
          font-size: 16px !important;
          padding: 0.5rem 1rem !important;
        }
        #department_decision_detial_repsort th, #involved_meetings_table th {
          border: 1px solid silver !important;
          text-align: center !important;
          height: 35px;
          padding: 0.5rem 1rem !important;
          vertical-align: middle !important;
          background-color: rgb(37, 136, 95) !important;
          color: white !important;
        }
        .moduleCard {
          background: linear-gradient(to bottom, #1e3c72 0%, #2a5298 100%);
          padding: 20px;
          border-radius: 8px;
          text-align: center;
          transition: transform 0.3s ease;
          cursor: pointer;
          margin-bottom: 20px;
        }
        .moduleCard:hover {
          transform: translateY(-5px);
        }
        .moduleCard.green {
          background: linear-gradient(to bottom, #134e4a 0%, #166534 100%);
        }
        .moduleCard .imgdiv {
          margin-bottom: 10px;
        }
        .moduleCard h4 {
          color: white;
          font-size: 14px;
          margin: 0;
          font-weight: 500;
        }
      `}</style>
      
      <div className="row">
        {/* Filter Form Card */}
        <div className="col-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <form onSubmit={handleSubmit} id="filter_form" className="forms-sample">
                <div className="row">
                  <div className="col-md-4">
                    <div className="form-group mb-2">
                      <label>Department<span className="text-danger">*</span></label>
                      <select 
                        name="department" 
                        id="select_department" 
                        className="form-control select2"
                        value={selectedDepartments[0] || ''}
                        onChange={(e) => setSelectedDepartments(e.target.value ? [parseInt(e.target.value)] : [])}
                        required
                      >
                        <option value="">Select Department</option>
                        {mockDepartments.map(dept => (
                          <option key={dept.id} value={dept.id}>
                            {dept.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="col-md-2">
                    <div className="form-group">
                      <label>From Date</label>
                      <input 
                        type="date" 
                        name="start_date" 
                        className="form-control"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="col-md-2">
                    <div className="form-group">
                      <label>To Date</label>
                      <input 
                        type="date" 
                        name="end_date" 
                        className="form-control"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="col-md-4">
                    <div className="form-group">
                      <label>Search Keyword</label>
                      <input 
                        type="text"
                        className="form-control"
                        name="search_keyword"
                        placeholder="Search in subject or decisions"
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="row">
                  <div className="col-md-4">
                    <button type="submit" className="btn btn-success">Search</button>
                    <button type="button" onClick={handleReset} className="btn btn-warning">Reset</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
        
        {/* Results or Module Cards */}
        {!showResults ? (
          /* Module Cards - Default View */
          <div className="row mb-5 mt-3" style={{ width: '100%' }}>
            <div className="col-xl-2 col-lg-2 col-md-2 col-sm-6 col-12">
              <a href="/admin/report/filter/cm-meetings">
                <div className="moduleCard">
                  <div className="imgdiv">
                    <img style={{ opacity: 'unset' }} src="/admin_assets/images/dashboard/cmdmsupdated.png" alt="CM DMS" />
                  </div>
                  <h4>CM | DMS</h4>
                </div>
              </a>
            </div>
            
            <div className="col-xl-2 col-lg-2 col-md-2 col-sm-6 col-12">
              <a href="/admin/report/consolidated">
                <div className="moduleCard green">
                  <div className="imgdiv">
                    <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
                      <rect width="100" height="100" fill="white" fillOpacity="0.2"/>
                      <text x="50" y="55" textAnchor="middle" fill="white" fontSize="16">Report</text>
                    </svg>
                  </div>
                  <h4>Consolidated Report</h4>
                </div>
              </a>
            </div>
            
            <div className="col-xl-2 col-lg-2 col-md-2 col-sm-6 col-12">
              <a href="/admin/report/department-wise">
                <div className="moduleCard green">
                  <div className="imgdiv">
                    <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
                      <rect width="100" height="100" fill="white" fillOpacity="0.2"/>
                      <text x="50" y="55" textAnchor="middle" fill="white" fontSize="14">Dept</text>
                    </svg>
                  </div>
                  <h4>Department-wise Report</h4>
                </div>
              </a>
            </div>
            
            <div className="col-xl-2 col-lg-2 col-md-2 col-sm-6 col-12">
              <a href="https://cmdu.kp.gov.pk/portal/admin" target="_blank" rel="noreferrer">
                <div className="moduleCard">
                  <div className="imgdiv">
                    <img src="/admin_assets/images/dashboard/cmdu-updated.png" alt="CMDU" />
                  </div>
                  <h4>CMDU</h4>
                </div>
              </a>
            </div>
            
            {/* Add more module cards as needed */}
            <div className="col-12 mt-4">
              <p className="text-muted text-center">
                More modules will appear here based on permissions
              </p>
            </div>
          </div>
        ) : (
          /* Filtered Results View */
          <>
            <div className="my-5 text-center">
              <h3>
                Search results for department - {mockDepartments.find(d => d.id === selectedDepartments[0])?.name || 'All'}
              </h3>
            </div>
            
            {/* Summary Cards would go here */}
            <div className="row d-flex justify-content-end">
              <div className="col-12">
                <p className="text-muted text-center py-4">
                  Filtered results will be displayed here with accordion sections for:
                  <br />• Minutes of the meetings
                  <br />• Sectoral agenda points
                  <br />• Directives
                  <br />• Cabinet minutes
                  <br />• PTF minutes
                  <br />• Announcements
                </p>
              </div>
            </div>
            
            {/* Print Button */}
            <div className="row">
              <div className="col-12 mb-2">
                <button type="button" className="btn btn-info btn-icon-text pull-right" id="btnPrint">
                  <i className="ti-printer mr-1"></i> Print all
                </button>
              </div>
            </div>
            
            {/* Accordion with module data */}
            <div className="row">
              <div className="col-lg-12 grid-margin stretch-card cmdms-combined-report-accordion-list">
                <div className="card">
                  <div className="card-body">
                    <div className="mt-4">
                      <div className="accordion" id="accordion" role="tablist">
                        
                        {/* Minutes Section */}
                        <div className="card">
                          <div className="card-header" role="tab" id="heading-1">
                            <h6 className="mb-0">
                              <a data-toggle="collapse" href="#collapse-1" aria-expanded="true" aria-controls="collapse-1">
                                Minutes of the meetings
                              </a>
                            </h6>
                          </div>
                          <div id="collapse-1" className="collapse show" role="tabpanel" aria-labelledby="heading-1" data-parent="#accordion">
                            <div className="card-body">
                              <p>Minutes data will be populated here</p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Sectoral Agenda Points */}
                        <div className="card">
                          <div className="card-header" role="tab" id="heading-2">
                            <h6 className="mb-0">
                              <a className="collapsed" data-toggle="collapse" href="#collapse-2" aria-expanded="false" aria-controls="collapse-2">
                                Sectoral agenda points of the meetings
                              </a>
                            </h6>
                          </div>
                          <div id="collapse-2" className="collapse" role="tabpanel" aria-labelledby="heading-2" data-parent="#accordion">
                            <div className="card-body">
                              <p>Sectoral data will be populated here</p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Directives */}
                        <div className="card">
                          <div className="card-header" role="tab" id="heading-3">
                            <h6 className="mb-0">
                              <a className="collapsed" data-toggle="collapse" href="#collapse-3" aria-expanded="false" aria-controls="collapse-3">
                                Directives
                              </a>
                            </h6>
                          </div>
                          <div id="collapse-3" className="collapse" role="tabpanel" aria-labelledby="heading-3" data-parent="#accordion">
                            <div className="card-body">
                              <p>Directives data will be populated here</p>
                            </div>
                          </div>
                        </div>
                        
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
