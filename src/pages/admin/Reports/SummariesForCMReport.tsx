/**
 * Summaries for CM Report - Summary
 * EXACT replica of admin/report/summaries/summary.blade.php
 */

import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../../lib/api';

interface Department {
  id: number;
  name: string;
  status_counts: {
    total: number;
    [key: string]: number;
  };
}

export default function SummariesForCMReport() {
  const [loading, setLoading] = useState(true);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // TODO: Replace with actual API call
    // const fetchData = async () => {
    //   try {
    //     const response = await api.get('/admin/report/summaries/summary');
    //     setDepartments(response.data.departments);
    //   } catch (error) {
    //     console.error('Error fetching summaries:', error);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchData();

    // Dummy data matching old CMDMS structure
    const dummyDepartments: Department[] = [
      {
        id: 1,
        name: 'Health Department',
        status_counts: {
          total: 25,
          'Completed': 10,
          'On Target': 5,
          'Ongoing': 4,
          'Off Target': 3,
          'Overdue': 2,
          'Off Target reason': 1,
          'Overdue other reason': 0,
        },
      },
      {
        id: 2,
        name: 'Education Department',
        status_counts: {
          total: 30,
          'Completed': 12,
          'On Target': 8,
          'Ongoing': 5,
          'Off Target': 3,
          'Overdue': 1,
          'Off Target reason': 1,
          'Overdue other reason': 0,
        },
      },
      {
        id: 3,
        name: 'Finance Department',
        status_counts: {
          total: 20,
          'Completed': 8,
          'On Target': 6,
          'Ongoing': 3,
          'Off Target': 2,
          'Overdue': 1,
          'Off Target reason': 0,
          'Overdue other reason': 0,
        },
      },
    ];

    setDepartments(dummyDepartments);
    setLoading(false);
  }, []);

  // Status mapping based on DecisionStatus enum
  const statusColumns = [
    { label: 'Completed', value: '1' },
    { label: 'On Target', value: '2' },
    { label: 'Ongoing', value: '7' },
    { label: 'Off Target', value: '4' },
    { label: 'Overdue', value: '3' },
    { label: 'Off Target reason', value: '9' },
    { label: 'Overdue other reason', value: '6' },
  ];

  // Filter departments based on search term
  const filteredDepartments = useMemo(() => {
    if (!searchTerm.trim()) {
      return departments;
    }
    const lowerSearchTerm = searchTerm.toLowerCase();
    return departments.filter((dept) => {
      const deptName = dept.name.toLowerCase();
      return deptName.includes(lowerSearchTerm);
    });
  }, [departments, searchTerm]);

  if (loading) {
    return <div className="text-center p-5">Loading...</div>;
  }

  // Export functions
  const handleCopy = () => {
    const headers = ['#', 'Department', 'Total Tasks', ...statusColumns.map(s => s.label)];
    const rows = filteredDepartments.map((dept, idx) => [
      idx + 1,
      dept.name,
      dept.status_counts?.total || 0,
      ...statusColumns.map(status => dept.status_counts?.[status.label] || 0),
    ]);
    
    const text = [headers.join('\t'), ...rows.map(row => row.join('\t'))].join('\n');
    
    navigator.clipboard.writeText(text).then(() => {
      alert('Data copied to clipboard!');
    }).catch(() => {
      alert('Failed to copy data');
    });
  };

  const handleExcel = () => {
    const headers = ['#', 'Department', 'Total Tasks', ...statusColumns.map(s => s.label)];
    const rows = filteredDepartments.map((dept, idx) => [
      idx + 1,
      dept.name,
      dept.status_counts?.total || 0,
      ...statusColumns.map(status => dept.status_counts?.[status.label] || 0),
    ]);
    
    let csv = headers.join(',') + '\n';
    rows.forEach(row => {
      csv += row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',') + '\n';
    });
    
    const blob = new Blob([csv], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `summaries_cm_report_${new Date().toISOString().split('T')[0]}.xls`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const handleCSV = () => {
    const headers = ['#', 'Department', 'Total Tasks', ...statusColumns.map(s => s.label)];
    const rows = filteredDepartments.map((dept, idx) => [
      idx + 1,
      dept.name,
      dept.status_counts?.total || 0,
      ...statusColumns.map(status => dept.status_counts?.[status.label] || 0),
    ]);
    
    let csv = headers.join(',') + '\n';
    rows.forEach(row => {
      csv += row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',') + '\n';
    });
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `summaries_cm_report_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const handlePDF = async () => {
    try {
      const pdfMake = await import('pdfmake/build/pdfmake');
      const pdfFonts = await import('pdfmake/build/vfs_fonts');
      
      (pdfMake as any).vfs = (pdfFonts as any).pdfMake?.vfs || (pdfFonts as any).default?.pdfMake?.vfs;
      
      const tableData = [
        ['#', 'Department', 'Total Tasks', ...statusColumns.map(s => s.label)]
      ];
      
      departments.forEach((dept, idx) => {
        tableData.push([
          String(idx + 1),
          dept.name.substring(0, 50),
          String(dept.status_counts?.total || 0),
          ...statusColumns.map(status => String(dept.status_counts?.[status.label] || 0)),
        ]);
      });
      
      const docDefinition: any = {
        pageOrientation: 'landscape',
        pageSize: 'A4',
        pageMargins: [40, 60, 40, 60],
        content: [
          {
            text: 'Summaries for CM Report',
            style: 'header',
            margin: [0, 0, 0, 20]
          },
          {
            table: {
              headerRows: 1,
              widths: ['auto', '*', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
              body: tableData
            },
            layout: {
              fillColor: function (rowIndex: number) {
                return rowIndex === 0 ? '#CCCCCC' : (rowIndex % 2 === 0 ? '#F3F3F3' : null);
              },
              hLineWidth: function () { return 1; },
              vLineWidth: function () { return 1; },
              hLineColor: function () { return '#AAAAAA'; },
              vLineColor: function () { return '#AAAAAA'; }
            }
          }
        ],
        styles: {
          header: {
            fontSize: 18,
            bold: true,
            alignment: 'center'
          }
        },
        defaultStyle: {
          fontSize: 9
        }
      };
      
      pdfMake.default.createPdf(docDefinition).download(`summaries_cm_report_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('PDF generation error:', error);
      alert('Failed to generate PDF. Please try Excel or Print export instead.');
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '', 'height=600,width=1200');
    if (!printWindow) {
      alert('Please allow popups to use print functionality');
      return;
    }
    
    printWindow.document.write('<html><head><title>Summaries for CM Report</title>');
    printWindow.document.write('<style>');
    printWindow.document.write('body { font-family: Arial, sans-serif; margin: 20px; }');
    printWindow.document.write('h1 { color: #333; text-align: center; }');
    printWindow.document.write('table { border-collapse: collapse; width: 100%; margin-top: 20px; }');
    printWindow.document.write('th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 11px; }');
    printWindow.document.write('th { background-color: #f2f2f2; font-weight: bold; }');
    printWindow.document.write('tr:nth-child(even) { background-color: #f9f9f9; }');
    printWindow.document.write('@media print { body { margin: 0; } }');
    printWindow.document.write('</style></head><body>');
    printWindow.document.write('<h1>Summaries for CM Report</h1>');
    printWindow.document.write('<table>');
    printWindow.document.write('<thead><tr>');
    printWindow.document.write('<th>#</th><th>Department</th><th>Total Tasks</th>');
    statusColumns.forEach(status => {
      printWindow.document.write(`<th>${status.label}</th>`);
    });
    printWindow.document.write('</tr></thead><tbody>');
    
    filteredDepartments.forEach((dept, idx) => {
      printWindow.document.write('<tr>');
      printWindow.document.write(`<td>${idx + 1}</td>`);
      printWindow.document.write(`<td>${dept.name}</td>`);
      printWindow.document.write(`<td>${dept.status_counts?.total || 0}</td>`);
      statusColumns.forEach(status => {
        printWindow.document.write(`<td>${dept.status_counts?.[status.label] || 0}</td>`);
      });
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
      <style>{`
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
      <div className="card">
        <div className="card-header text-center">
          <div className="d-flex gap-3 justify-content-between align-items-center">
            <div className="flex-grow-1 text-center">
              <p className="block display-4">Summaries for CM Report</p>
            </div>
          </div>
        </div>
        <div className="card-body">
          {/* Export Buttons */}
          <div className="dataTables_wrapper dt-bootstrap4">
            <div className="row">
              <div className="col-sm-12 col-md-6">
                <div className="dt-buttons btn-group flex-wrap">
                  <button 
                    className="btn btn-secondary buttons-copy buttons-html5" 
                    tabIndex={0} 
                    type="button"
                    onClick={handleCopy}
                    title="Copy to clipboard"
                  >
                    <span>Copy</span>
                  </button>
                  <button 
                    className="btn btn-secondary buttons-excel buttons-html5" 
                    tabIndex={0} 
                    type="button"
                    onClick={handleExcel}
                    title="Export to Excel"
                  >
                    <span>Excel</span>
                  </button>
                  <button 
                    className="btn btn-secondary buttons-csv buttons-html5" 
                    tabIndex={0} 
                    type="button"
                    onClick={handleCSV}
                    title="Export to CSV"
                  >
                    <span>CSV</span>
                  </button>
                  <button 
                    className="btn btn-secondary buttons-pdf buttons-html5" 
                    tabIndex={0} 
                    type="button"
                    onClick={handlePDF}
                    title="Export to PDF"
                  >
                    <span>PDF</span>
                  </button>
                  <button 
                    className="btn btn-secondary buttons-print" 
                    tabIndex={0} 
                    type="button"
                    onClick={handlePrint}
                    title="Print"
                  >
                    <span>Print</span>
                  </button>
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
          </div>
          <div className="row mt-3">
            <div className="col">
              <div className="table-responsive">
                <table className="table table-bordered datatable">
                  <thead>
                    <tr className="thead-light">
                      <th>#</th>
                      <th>Department</th>
                      <th>Total Tasks</th>
                      {statusColumns.map((status) => (
                        <th key={status.value}>{status.label}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDepartments.length === 0 ? (
                      <tr>
                        <td colSpan={10} className="text-center">
                          No data available
                        </td>
                      </tr>
                    ) : (
                      filteredDepartments.map((dept, index) => (
                        <tr key={dept.id}>
                          <td>{index + 1}</td>
                          <td>{dept.name}</td>
                          <td>
                            {dept.status_counts?.total > 0 ? (
                              <Link
                                to={`/admin/report/summaries/detail?department_id=${dept.id}`}
                              >
                                {dept.status_counts.total}
                              </Link>
                            ) : (
                              0
                            )}
                          </td>
                          {statusColumns.map((status) => {
                            const count = dept.status_counts?.[status.label] || 0;
                            return (
                              <td key={status.value}>
                                {count > 0 ? (
                                  <Link
                                    to={`/admin/report/summaries/detail?department_id=${dept.id}&status=${status.value}`}
                                  >
                                    {count}
                                  </Link>
                                ) : (
                                  0
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))
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
