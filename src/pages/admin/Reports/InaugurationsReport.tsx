/**
 * Inaugurations Report - Department-wise
 * EXACT replica of admin/report/inaugurations/index.blade.php from old CMDMS
 */

import React, { useState, useEffect } from 'react';
import { mockInaugurations } from '../../../lib/mocks/data/inaugurations';
import { mockDepartments } from '../../../lib/mocks/data/departments';

interface DepartmentInauguration {
  id: number;
  name: string;
  inaugurationsBreaking: InaugurationItem[];
}

interface InaugurationItem {
  id: number;
  project_name: string;
  scheme?: string;
  cost: number;
  description: string;
  district_id: number;
  district_name: string;
  division_id: string;
  division_name: string;
  date: string;
  remarks?: string;
  attachments?: string[];
}

// Format date as 'jS F' (e.g., "28th July")
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleDateString('en-GB', { month: 'long' });
  
  const getOrdinalSuffix = (n: number): string => {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };
  
  return `${getOrdinalSuffix(day)} ${month}`;
};

// Get month name from date
const getMonth = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', { month: 'long' });
};

// Get year from date
const getYear = (dateString: string): string => {
  const date = new Date(dateString);
  return date.getFullYear().toString();
};

export default function InaugurationsReport() {
  const [departmentInaugurations, setDepartmentInaugurations] = useState<DepartmentInauguration[]>([]);

  useEffect(() => {
    // Group inaugurations by department
    const grouped: Record<number, DepartmentInauguration> = {};
    
    // Filter departments (exclude 44, 45, 46)
    const availableDepartments = mockDepartments.filter(dept => ![44, 45, 46].includes(Number(dept.id)));
    
    // Initialize departments
    availableDepartments.slice(0, 10).forEach(dept => {
      const deptId = Number(dept.id);
      grouped[deptId] = {
        id: deptId,
        name: dept.name,
        inaugurationsBreaking: []
      };
    });
    
    // Assign inaugurations to departments
    mockInaugurations.slice(0, 30).forEach((inaug, _index) => {
      const deptId = inaug.department_id;
      if (grouped[deptId]) {
        grouped[deptId].inaugurationsBreaking.push({
          id: inaug.id,
          project_name: inaug.project_name,
          scheme: inaug.scheme,
          cost: inaug.cost,
          description: inaug.description,
          district_id: inaug.district_id,
          district_name: inaug.district_name,
          division_id: inaug.division_id,
          division_name: inaug.division_name,
          date: inaug.date,
          remarks: inaug.remarks,
          attachments: inaug.attachments
        });
      }
    });
    
    // Convert to array and filter out departments with no inaugurations
    const result = Object.values(grouped).filter(dept => dept.inaugurationsBreaking.length > 0);
    setDepartmentInaugurations(result);
  }, []);

  return (
    <div className="content-wrapper">
      <style>
        {`
          table#inaugurations-listing td p {
            width: 100px !important;
          }
          table#inaugurations-listing td {
            width: 100px !important;
            border: 1px solid silver;
          }
          table#inaugurations-listing th {
            padding: 10px !important;
            border: 1px solid silver;
          }
          .modal .modal-dialog {
            margin-top: 70px !important;
          }
          table.dataTable tbody td {
            padding-left: 2px !important;
          }
          /* Bootstrap table classes - matching old CMDMS */
          .table-primary,
          .table-primary > th,
          .table-primary > td {
            background-color: #cfe2ff !important;
          }
          .table-info,
          .table-info > th,
          .table-info > td {
            background-color: #d1ecf1 !important;
          }
          /* Badge styling - matching Bootstrap exactly */
          .badge-warning {
            background-color: #ffc107 !important;
            color: #000 !important;
            padding: 0.25em 0.6em;
            border-radius: 0.25rem;
            font-weight: 500;
            display: inline-block;
          }
          .badge-danger {
            background-color: #dc3545 !important;
            color: #fff !important;
            padding: 0.25em 0.6em;
            border-radius: 50rem;
            font-weight: 500;
            display: inline-block;
          }
          .badge-pill {
            border-radius: 50rem;
          }
          mark.bg-warning {
            background-color: #ffc107 !important;
            color: #fff !important;
            padding: 0.25em 0.5em;
            border-radius: 0.25rem;
            display: inline-block;
          }
          /* Ensure table cells have proper borders */
          table#inaugurations-listing tbody td,
          table#inaugurations-listing tbody th {
            border: 1px solid silver;
          }
          /* Match old CMDMS table styling */
          table#inaugurations-listing.table-striped tbody tr.table-primary,
          table#inaugurations-listing.table-striped tbody tr.table-info {
            border: 1px solid silver;
          }
        `}
      </style>
      <div className="card">
        <div className="card-body">
          <center>
            <h3>Inaugrations / Ground Breaking - Department-wise</h3>
          </center>
          <br /><br />

          <div className="row">
            <div className="col-12">
              <div className="table-responsive">
                <table id="inaugurations-listing" className="table-striped" role="grid">
                  <thead style={{ background: 'rgb(37, 136, 95)', color: 'white' }}>
                    <tr>
                      <th>S#</th>
                      <th>Department</th>
                      <th>Month</th>
                      <th>Scheme<br />/Project Name</th>
                      <th>Cost in<br /> Millions</th>
                      <th>Inaugurations<br />/GroundBreaking</th>
                      <th>District</th>
                      <th>Division</th>
                      <th>Expected<br /> Date</th>
                      <th>Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {departmentInaugurations.length === 0 ? (
                      <tr>
                        <td colSpan={10}>There are no data.</td>
                      </tr>
                    ) : (
                      departmentInaugurations.map((department, deptIndex) => {
                        const rowClass = (deptIndex + 1) % 2 === 0 ? 'table-info' : 'table-primary';
                        const rowspan = department.inaugurationsBreaking.length + 1;
                        
                        return (
                          <React.Fragment key={department.id}>
                            {/* First row with S# and Department (rowspan) */}
                            <tr className={rowClass}>
                              <th 
                                style={{ verticalAlign: 'top' }}
                                rowSpan={rowspan}
                              >
                                {deptIndex + 1}
                              </th>
                              <th 
                                style={{ verticalAlign: 'top', color: 'var(--gray-dark)' }}
                                rowSpan={rowspan}
                              >
                                <mark className="bg-warning text-white">{department.name}</mark>
                              </th>
                            </tr>
                            {/* Subsequent rows for each inauguration */}
                            {department.inaugurationsBreaking.map((inaug, _inaugIndex) => (
                              <tr key={inaug.id} className={rowClass}>
                                <td style={{ width: '100px' }}>
                                  {getMonth(inaug.date)}
                                </td>
                                <td style={{ width: '100px' }}>
                                  <div dangerouslySetInnerHTML={{ __html: inaug.project_name || '' }} />
                                  <br />
                                  {inaug.scheme && (
                                    <>
                                      <div dangerouslySetInnerHTML={{ __html: inaug.scheme }} />
                                      <br />
                                    </>
                                  )}
                                  {inaug.attachments && inaug.attachments.length > 0 && (
                                    <>
                                      {inaug.attachments.map((file, idx) => (
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
                                <td style={{ width: '100px', color: 'red' }}>
                                  <div 
                                    style={{ width: '100px', fontWeight: 500, fontSize: '16px' }}
                                    className="badge badge-danger badge-pill"
                                  >
                                    {inaug.cost ?? ''}
                                  </div>
                                </td>
                                <td style={{ width: '100px' }}>
                                  <div dangerouslySetInnerHTML={{ __html: inaug.description ?? '' }} />
                                </td>
                                <td style={{ width: '100px' }}>
                                  {inaug.district_name}
                                </td>
                                <td style={{ width: '100px' }}>
                                  {inaug.division_name}
                                </td>
                                <td style={{ width: '100px', color: 'darkblue', fontWeight: 500 }}>
                                  <label
                                    style={{ fontWeight: 500, fontSize: '16px' }}
                                    className="badge badge-warning"
                                  >
                                    {formatDate(inaug.date)}<br />{getYear(inaug.date)}
                                  </label>
                                </td>
                                <td style={{ width: '100px' }}>
                                  <div dangerouslySetInnerHTML={{ __html: inaug.remarks ?? '' }} />
                                </td>
                              </tr>
                            ))}
                          </React.Fragment>
                        );
                      })
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
