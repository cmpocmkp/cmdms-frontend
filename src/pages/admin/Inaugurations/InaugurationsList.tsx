/**
 * Inaugurations List - Admin Module
 * EXACT replica of admin/inaugrations/index.blade.php from old CMDMS
 */

import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { mockInaugurations } from '../../../lib/mocks/data/inaugurations';

// Format date as 'jS F' (e.g., "15th December")
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleDateString('en-GB', { month: 'long' });
  
  // Add ordinal suffix
  const getOrdinalSuffix = (n: number): string => {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };
  
  return `${getOrdinalSuffix(day)} ${month}`;
};

export default function InaugurationsList() {
  const [inaugurations] = useState(mockInaugurations);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter inaugurations based on search term
  const filteredInaugurations = useMemo(() => {
    if (!searchTerm) return inaugurations;
    
    const lowerSearch = searchTerm.toLowerCase();
    return inaugurations.filter(inaug => 
      inaug.department_name.toLowerCase().includes(lowerSearch) ||
      inaug.project_name.toLowerCase().includes(lowerSearch) ||
      (inaug.scheme && inaug.scheme.toLowerCase().includes(lowerSearch)) ||
      inaug.district_name.toLowerCase().includes(lowerSearch) ||
      inaug.division_name.toLowerCase().includes(lowerSearch) ||
      inaug.description.toLowerCase().includes(lowerSearch) ||
      (inaug.remarks && inaug.remarks.toLowerCase().includes(lowerSearch))
    );
  }, [inaugurations, searchTerm]);

  // Handle Excel export
  const handleExcelExport = () => {
    const headers = ['S.No', 'Department', 'Project Name', 'Scheme', 'Cost (Millions)', 'Description', 'District', 'Division', 'Expected Date', 'Remarks'];
    const rows = filteredInaugurations.map((inaug, index) => [
      index + 1,
      inaug.department_name,
      inaug.project_name.replace(/<[^>]*>/g, ''),
      inaug.scheme ? inaug.scheme.replace(/<[^>]*>/g, '') : '',
      inaug.cost,
      inaug.description.replace(/<[^>]*>/g, ''),
      inaug.district_name,
      inaug.division_name,
      formatDate(inaug.date),
      inaug.remarks ? inaug.remarks.replace(/<[^>]*>/g, '') : ''
    ]);
    
    let csv = headers.join(',') + '\n';
    rows.forEach(row => {
      csv += row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',') + '\n';
    });
    
    const blob = new Blob([csv], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `inaugurations_${new Date().toISOString().split('T')[0]}.xls`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  // Handle Print
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups to use print functionality');
      return;
    }
    
    printWindow.document.write('<html><head><title>Inaugurations</title>');
    printWindow.document.write('<style>');
    printWindow.document.write('body { font-family: Arial, sans-serif; margin: 20px; }');
    printWindow.document.write('h1 { color: #333; }');
    printWindow.document.write('table { border-collapse: collapse; width: 100%; margin-top: 20px; font-size: 11px; }');
    printWindow.document.write('th, td { border: 1px solid #ddd; padding: 6px; text-align: left; }');
    printWindow.document.write('th { background-color: #f2f2f2; font-weight: bold; }');
    printWindow.document.write('tr:nth-child(even) { background-color: #f9f9f9; }');
    printWindow.document.write('@media print { body { margin: 0; } }');
    printWindow.document.write('</style></head><body>');
    printWindow.document.write('<h1>Inaugurations</h1>');
    printWindow.document.write('<table>');
    printWindow.document.write('<thead><tr>');
    printWindow.document.write('<th>S.NO</th><th>Department</th><th>Scheme/Project Name</th><th>Cost</th><th>Inaugurations/GroundBreaking</th>');
    printWindow.document.write('<th>District</th><th>Division</th><th>Expected Date</th><th>Remarks</th>');
    printWindow.document.write('</tr></thead><tbody>');
    
    filteredInaugurations.forEach((inaug, idx) => {
      printWindow.document.write('<tr>');
      printWindow.document.write(`<td>${idx + 1}</td>`);
      printWindow.document.write(`<td>${inaug.department_name}</td>`);
      printWindow.document.write(`<td>${inaug.project_name}${inaug.scheme ? '<br/>' + inaug.scheme : ''}</td>`);
      printWindow.document.write(`<td>${inaug.cost}</td>`);
      printWindow.document.write(`<td>${inaug.description.replace(/<[^>]*>/g, '')}</td>`);
      printWindow.document.write(`<td>${inaug.district_name}</td>`);
      printWindow.document.write(`<td>${inaug.division_name}</td>`);
      printWindow.document.write(`<td>${formatDate(inaug.date)}</td>`);
      printWindow.document.write(`<td>${inaug.remarks ? inaug.remarks.replace(/<[^>]*>/g, '') : ''}</td>`);
      printWindow.document.write('</tr>');
    });
    
    printWindow.document.write('</tbody></table>');
    printWindow.document.write('<p style="margin-top: 20px; font-size: 10px; color: #666;">');
    printWindow.document.write(`Generated on: ${new Date().toLocaleString()}`);
    printWindow.document.write('</p>');
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="content-wrapper">
      <style>
        {`
          table#directive-listing td p {
            width: 100px !important;
          }
          table#directive-listing td {
            width: 100px !important;
          }
          table#directive-listing th {
            padding: 10px !important;
          }
          .modal .modal-dialog {
            margin-top: 70px !important;
          }
          /* Action column icon buttons styling */
          table#directive-listing td .btn-icon-text {
            width: 32px;
            height: 32px;
            padding: 0;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border-radius: 4px;
            margin-right: 8px;
          }
          table#directive-listing td .btn-icon-text i {
            font-size: 14px;
            line-height: 1;
          }
          table#directive-listing td .btn-icon-text:hover {
            opacity: 0.9;
            transform: translateY(-1px);
            box-shadow: 0 2px 4px rgba(0,0,0,0.15);
          }
        `}
      </style>
      <div className="card">
        <div className="card-body">
          <Link to="/admin/inaugurations/add" style={{ float: 'right' }}>
            Add Inauguration
          </Link>
          <h4 className="card-title text-primary">inaugurations</h4>

          {/* Export Buttons and Search */}
          <div className="row mb-3">
            <div className="col-sm-12 col-md-6">
              <div className="dt-buttons-wrapper">
                <div className="dt-buttons">
                  <button
                    type="button"
                    className="dt-button"
                    onClick={handleExcelExport}
                    title="Export to Excel"
                  >
                    <span>Excel</span>
                  </button>
                  <button
                    type="button"
                    className="dt-button"
                    onClick={handlePrint}
                    title="Print"
                  >
                    <span>Print</span>
                  </button>
                </div>
              </div>
            </div>
            <div className="col-sm-12 col-md-6">
              <div className="dataTables_filter">
                <label>
                  Search:
                  <input
                    type="search"
                    className="form-control form-control-sm"
                    placeholder=""
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </label>
              </div>
            </div>
          </div>

          <style>{`
            /* DataTables Export Buttons Styling - Exact Match */
            .dt-buttons-wrapper {
              margin-bottom: 1rem;
            }
            .dt-buttons {
              display: inline-block;
            }
            .dt-button {
              display: inline-block;
              background-color: #fff;
              background-image: linear-gradient(to bottom, #fff 0%, #e0e0e0 100%);
              border: 1px solid #999;
              border-radius: 2px;
              color: #333;
              cursor: pointer;
              font-size: 0.88em;
              line-height: 1.6em;
              padding: 0.5em 1em;
              text-align: center;
              text-decoration: none;
              user-select: none;
              vertical-align: middle;
              white-space: nowrap;
              margin-left: 0.167em;
              margin-right: 0;
              margin-bottom: 0.333em;
            }
            .dt-button:first-child {
              margin-left: 0;
            }
            .dt-button:hover {
              background-color: #e0e0e0;
              background-image: linear-gradient(to bottom, #f5f5f5 0%, #e0e0e0 100%);
              border-color: #666;
              text-decoration: none;
            }
            .dt-button:active {
              background-color: #e0e0e0;
              background-image: none;
              box-shadow: inset 0 2px 4px rgba(0,0,0,0.15);
              outline: none;
            }
            .dataTables_filter {
              text-align: right;
            }
            .dataTables_filter label {
              font-weight: normal;
              white-space: nowrap;
              text-align: left;
              display: inline-block;
              vertical-align: middle;
            }
            .dataTables_filter input {
              margin-left: 0.5em;
              display: inline-block;
              width: auto;
              border: 1px solid #aaa;
              border-radius: 3px;
              padding: 5px;
              background-color: transparent;
              color: inherit;
              font-size: inherit;
              margin-bottom: 0;
            }
            .dataTables_filter input:focus {
              outline: 2px solid #4A90E2;
              outline-offset: 0;
            }
          `}</style>

          <div className="row">
            <div className="col-12">
              <div className="table-responsive">
                <table id="directive-listing" className="table-striped" role="grid">
                  <thead>
                    <tr>
                      <th style={{ width: '15px' }}>S.NO</th>
                      <th style={{ width: '100px' }}>Department</th>
                      <th style={{ width: '100px' }}>Scheme<br/>/Project Name</th>
                      <th style={{ width: '100px' }}>Cost in Millions</th>
                      <th style={{ width: '100px' }}>Inaugurations<br/>/GroundBreaking</th>
                      <th style={{ width: '100px' }}>District</th>
                      <th style={{ width: '100px' }}>Division</th>
                      <th style={{ width: '100px' }}>Expected Date</th>
                      <th style={{ width: '100px' }}>Remarks</th>
                      <th style={{ width: '100px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInaugurations.length > 0 ? (
                      filteredInaugurations.map((inauguration, index) => (
                        <tr key={inauguration.id}>
                          <td style={{ width: '15px' }}>{index + 1}</td>
                          <td style={{ width: '100px' }}>{inauguration.department_name}</td>
                          <td style={{ width: '100px' }}>
                            <div dangerouslySetInnerHTML={{ __html: (inauguration.project_name || '') }} />
                            <br/>
                            <div dangerouslySetInnerHTML={{ __html: (inauguration.scheme || '') }} />
                            <br/>
                            {inauguration.attachments && inauguration.attachments.length > 0 && (
                              <>
                                {inauguration.attachments.map((file, idx) => (
                                  <span key={idx}>
                                    <a
                                      href="#"
                                      title="click to download attach file"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        console.log('Download attachment:', file);
                                      }}
                                    >
                                      Attachment:<i className="ti-file"></i>
                                    </a>
                                  </span>
                                ))}
                              </>
                            )}
                          </td>
                          <td style={{ width: '100px' }}>{inauguration.cost ?? ''}</td>
                          <td style={{ width: '100px' }}>
                            <div dangerouslySetInnerHTML={{ __html: inauguration.description ?? '' }} />
                          </td>
                          <td style={{ width: '100px' }}>{inauguration.district_name}</td>
                          <td style={{ width: '100px' }}>{inauguration.division_name}</td>
                          <td style={{ width: '100px' }}>{formatDate(inauguration.date)}</td>
                          <td style={{ width: '100px' }}>
                            <div dangerouslySetInnerHTML={{ __html: inauguration.remarks ?? '' }} />
                          </td>
                          <td style={{ width: '100px' }}>
                            <Link
                              to={`/admin/inaugurations/edit/${inauguration.id}`}
                              className="inauguration_id text-primary mr-2"
                              title="edit"
                              style={{ float: 'left', width: '20px' }}
                            >
                              <i className="ti-pencil-alt icon-sm"></i>
                            </Link>
                            &nbsp;&nbsp;
                            <form
                              action="#"
                              method="POST"
                              style={{ float: 'left', marginLeft: '10px', margin: 0 }}
                              onSubmit={(e) => {
                                e.preventDefault();
                                console.log('Delete inauguration:', inauguration.id);
                                alert('Delete functionality will be implemented with backend API');
                              }}
                            >
                              <button
                                type="submit"
                                className="btn btn-danger btn-icon-text"
                                title="delete"
                                onClick={(e) => {
                                  if (!confirm('Are you sure to delete?')) {
                                    e.preventDefault();
                                    e.stopPropagation();
                                  }
                                }}
                              >
                                <i className="ti-trash icon-sm"></i>
                              </button>
                            </form>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={10}>There are no data.</td>
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
