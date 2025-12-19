/**
 * Summaries for CM Report - Detail
 * EXACT replica of admin/report/summaries/detail.blade.php
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { api } from '../../../lib/api';

interface Task {
  id: number;
  title: string;
  description: string;
  progress: string;
  status: {
    value: number;
    label: string;
    badgeClass: string;
  };
  timeline_label_html: string;
  departments: DepartmentTask[];
  taskable: {
    id: number;
    code_number: string;
    getTaskableTitle: () => string;
  };
}

interface DepartmentTask {
  id: number;
  name: string;
  pivot: {
    status: {
      value: number;
      label: string;
      badgeClass: string;
    };
  };
  latestComment?: {
    status: {
      value: number;
      label: string;
      badgeClass: string;
    };
  };
}

interface Department {
  id: number;
  name: string;
}

interface SummaryData {
  total: number;
  [key: string]: {
    count: number;
    percent: string;
  } | number;
}

export default function SummariesForCMDetailReport() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [summary, setSummary] = useState<SummaryData>({
    total: 0,
    'Completed': { count: 0, percent: '0' },
    'On Target': { count: 0, percent: '0' },
    'Ongoing': { count: 0, percent: '0' },
    'Off Target': { count: 0, percent: '0' },
    'Overdue': { count: 0, percent: '0' },
    'Off Target reason': { count: 0, percent: '0' },
    'Overdue other reason': { count: 0, percent: '0' },
  });
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || '');
  const [departmentFilter, setDepartmentFilter] = useState(searchParams.get('department_id') || '');
  const [tableSearchTerm, setTableSearchTerm] = useState('');
  
  // Initialize filter collapsed state based on whether filters are applied
  const initialFilterApplied = !!(searchParams.get('search') || searchParams.get('status') || searchParams.get('department_id'));
  const [filterCollapsed, setFilterCollapsed] = useState(!initialFilterApplied);

  const departmentId = searchParams.get('department_id');
  const status = searchParams.get('status');

  useEffect(() => {
    // TODO: Replace with actual API call
    // const fetchData = async () => {
    //   try {
    //     const params = new URLSearchParams();
    //     if (departmentId) params.append('department_id', departmentId);
    //     if (status) params.append('status', status);
    //     if (searchTerm) params.append('search', searchTerm);
    //     const response = await api.get(`/admin/report/summaries/detail?${params.toString()}`);
    //     setTasks(response.data.tasks);
    //     setDepartments(response.data.departments);
    //     setSelectedDepartment(response.data.selectedDepartment);
    //     setSummary(response.data.summary);
    //   } catch (error) {
    //     console.error('Error fetching summaries detail:', error);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchData();

    // Dummy data
    const dummyTasks: Task[] = [
      {
        id: 1,
        title: 'Task 1 - Implement Health Program',
        description: 'Description for task 1',
        progress: 'Progress update for task 1',
        status: { value: 1, label: 'Completed', badgeClass: 'badge-success' },
        timeline_label_html: '<span>30 days</span>',
        taskable: {
          id: 1,
          code_number: 'SUM-001',
          getTaskableTitle: () => 'Summary Title 1',
        },
        departments: [
          {
            id: 1,
            name: 'Health Department',
            pivot: {
              status: { value: 1, label: 'Completed', badgeClass: 'badge-success' },
            },
            latestComment: {
              status: { value: 1, label: 'Completed', badgeClass: 'badge-success' },
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Task 2 - Education Initiative',
        description: 'Description for task 2',
        progress: 'Progress update for task 2',
        status: { value: 2, label: 'On Target', badgeClass: 'badge-warning' },
        timeline_label_html: '<span>45 days</span>',
        taskable: {
          id: 1,
          code_number: 'SUM-001',
          getTaskableTitle: () => 'Summary Title 1',
        },
        departments: [
          {
            id: 2,
            name: 'Education Department',
            pivot: {
              status: { value: 2, label: 'On Target', badgeClass: 'badge-warning' },
            },
            latestComment: {
              status: { value: 2, label: 'On Target', badgeClass: 'badge-warning' },
            },
          },
        ],
      },
    ];

    const dummyDepartments: Department[] = [
      { id: 1, name: 'Health Department' },
      { id: 2, name: 'Education Department' },
      { id: 3, name: 'Finance Department' },
    ];

    setTasks(dummyTasks);
    setDepartments(dummyDepartments);
    setSelectedDepartment(departmentId ? dummyDepartments.find((d) => d.id === Number(departmentId)) || null : null);
    setSummary({
      total: 25,
      'Completed': { count: 10, percent: '40' },
      'On Target': { count: 5, percent: '20' },
      'Ongoing': { count: 4, percent: '16' },
      'Off Target': { count: 3, percent: '12' },
      'Overdue': { count: 2, percent: '8' },
      'Off Target reason': { count: 1, percent: '4' },
      'Overdue other reason': { count: 0, percent: '0' },
    });
    setLoading(false);
  }, [departmentId, status]);


  // Group tasks by summary
  const groupedTasks = useMemo(() => {
    const grouped: Record<number, Task[]> = {};
    tasks.forEach((task) => {
      const summaryId = task.taskable.id;
      if (!grouped[summaryId]) {
        grouped[summaryId] = [];
      }
      grouped[summaryId].push(task);
    });
    return grouped;
  }, [tasks]);

  // Filter tasks based on search term (for table search, not the filter form)
  const filteredGroupedTasks = useMemo(() => {
    if (!tableSearchTerm.trim()) {
      return groupedTasks;
    }
    const lowerSearchTerm = tableSearchTerm.toLowerCase();
    const filtered: Record<number, Task[]> = {};
    
    Object.entries(groupedTasks).forEach(([summaryId, summaryTasks]) => {
      const matchingTasks = summaryTasks.filter((task) => {
        const taskTitle = task.title.toLowerCase();
        const taskDescription = task.description.replace(/<[^>]*>/g, '').toLowerCase();
        const taskProgress = task.progress.replace(/<[^>]*>/g, '').toLowerCase();
        const summaryTitle = task.taskable.getTaskableTitle().toLowerCase();
        return (
          taskTitle.includes(lowerSearchTerm) ||
          taskDescription.includes(lowerSearchTerm) ||
          taskProgress.includes(lowerSearchTerm) ||
          summaryTitle.includes(lowerSearchTerm)
        );
      });
      
      if (matchingTasks.length > 0) {
        filtered[Number(summaryId)] = matchingTasks;
      }
    });
    
    return filtered;
  }, [groupedTasks, tableSearchTerm]);

  // Flatten tasks for export
  const flattenedTasks = useMemo(() => {
    const flat: Array<{ summaryTitle: string; task: Task }> = [];
    Object.entries(filteredGroupedTasks).forEach(([summaryId, summaryTasks]) => {
      const firstTask = summaryTasks[0];
      summaryTasks.forEach((task) => {
        flat.push({
          summaryTitle: firstTask.taskable.getTaskableTitle(),
          task,
        });
      });
    });
    return flat;
  }, [filteredGroupedTasks]);

  // Export functions
  const handleCopy = () => {
    const headers = ['S.No', 'Summary Title', 'Task Title', 'Description', 'Progress', 'Status', 'Timeline'];
    const rows = flattenedTasks.map((item, idx) => [
      idx + 1,
      item.summaryTitle,
      item.task.title,
      item.task.description.replace(/<[^>]*>/g, '').substring(0, 100),
      item.task.progress.replace(/<[^>]*>/g, '').substring(0, 100),
      item.task.status.label,
      item.task.timeline_label_html.replace(/<[^>]*>/g, ''),
    ]);
    
    const text = [headers.join('\t'), ...rows.map(row => row.join('\t'))].join('\n');
    
    navigator.clipboard.writeText(text).then(() => {
      alert('Data copied to clipboard!');
    }).catch(() => {
      alert('Failed to copy data');
    });
  };

  const handleExcel = () => {
    const headers = ['S.No', 'Summary Title', 'Task Title', 'Description', 'Progress', 'Status', 'Timeline'];
    const rows = flattenedTasks.map((item, idx) => [
      idx + 1,
      item.summaryTitle,
      item.task.title,
      item.task.description.replace(/<[^>]*>/g, '').substring(0, 200),
      item.task.progress.replace(/<[^>]*>/g, '').substring(0, 200),
      item.task.status.label,
      item.task.timeline_label_html.replace(/<[^>]*>/g, ''),
    ]);
    
    let csv = headers.join(',') + '\n';
    rows.forEach(row => {
      csv += row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',') + '\n';
    });
    
    const blob = new Blob([csv], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `summaries_cm_detail_${new Date().toISOString().split('T')[0]}.xls`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const handleCSV = () => {
    const headers = ['S.No', 'Summary Title', 'Task Title', 'Description', 'Progress', 'Status', 'Timeline'];
    const rows = flattenedTasks.map((item, idx) => [
      idx + 1,
      item.summaryTitle,
      item.task.title,
      item.task.description.replace(/<[^>]*>/g, '').substring(0, 200),
      item.task.progress.replace(/<[^>]*>/g, '').substring(0, 200),
      item.task.status.label,
      item.task.timeline_label_html.replace(/<[^>]*>/g, ''),
    ]);
    
    let csv = headers.join(',') + '\n';
    rows.forEach(row => {
      csv += row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',') + '\n';
    });
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `summaries_cm_detail_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const handlePDF = async () => {
    try {
      const pdfMake = await import('pdfmake/build/pdfmake');
      const pdfFonts = await import('pdfmake/build/vfs_fonts');
      
      (pdfMake as any).vfs = (pdfFonts as any).pdfMake?.vfs || (pdfFonts as any).default?.pdfMake?.vfs;
      
      const tableData = [
        ['S.No', 'Summary Title', 'Task Title', 'Status', 'Timeline']
      ];
      
      flattenedTasks.forEach((item, idx) => {
        tableData.push([
          String(idx + 1),
          item.summaryTitle.substring(0, 40),
          item.task.title.substring(0, 50),
          item.task.status.label,
          item.task.timeline_label_html.replace(/<[^>]*>/g, '').substring(0, 30),
        ]);
      });
      
      const docDefinition: any = {
        pageOrientation: 'landscape',
        pageSize: 'A4',
        pageMargins: [40, 60, 40, 60],
        content: [
          {
            text: 'Summaries for CM - Detail Report' + (selectedDepartment ? `\n${selectedDepartment.name} Department` : ''),
            style: 'header',
            margin: [0, 0, 0, 20]
          },
          {
            table: {
              headerRows: 1,
              widths: ['auto', '*', '*', 'auto', 'auto'],
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
            fontSize: 16,
            bold: true,
            alignment: 'center'
          }
        },
        defaultStyle: {
          fontSize: 9
        }
      };
      
      pdfMake.default.createPdf(docDefinition).download(`summaries_cm_detail_${new Date().toISOString().split('T')[0]}.pdf`);
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
    
    printWindow.document.write('<html><head><title>Summaries for CM - Detail Report</title>');
    printWindow.document.write('<style>');
    printWindow.document.write('body { font-family: Arial, sans-serif; margin: 20px; }');
    printWindow.document.write('h1 { color: #333; text-align: center; }');
    printWindow.document.write('table { border-collapse: collapse; width: 100%; margin-top: 20px; }');
    printWindow.document.write('th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 11px; }');
    printWindow.document.write('th { background-color: #f2f2f2; font-weight: bold; }');
    printWindow.document.write('tr:nth-child(even) { background-color: #f9f9f9; }');
    printWindow.document.write('@media print { body { margin: 0; } }');
    printWindow.document.write('</style></head><body>');
    printWindow.document.write('<h1>Summaries for CM - Detail Report</h1>');
    if (selectedDepartment) {
      printWindow.document.write(`<h2 style="text-align: center;">${selectedDepartment.name} Department</h2>`);
    }
    printWindow.document.write('<table>');
    printWindow.document.write('<thead><tr>');
    printWindow.document.write('<th>S.No</th><th>Summary Title</th><th>Task Title</th><th>Status</th><th>Timeline</th>');
    printWindow.document.write('</tr></thead><tbody>');
    
    flattenedTasks.forEach((item, idx) => {
      printWindow.document.write('<tr>');
      printWindow.document.write(`<td>${idx + 1}</td>`);
      printWindow.document.write(`<td>${item.summaryTitle}</td>`);
      printWindow.document.write(`<td>${item.task.title}</td>`);
      printWindow.document.write(`<td>${item.task.status.label}</td>`);
      printWindow.document.write(`<td>${item.task.timeline_label_html.replace(/<[^>]*>/g, '')}</td>`);
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

  const statusCards = [
    {
      status: '',
      borderColor: '#3282FF',
      title: 'Total',
      minutesClass: 'total_minutes',
      percentClass: '',
      count: summary.total,
      percent: '0',
      icon: 'ti-list',
    },
    {
      status: '1',
      borderColor: '#0E8160',
      title: 'Completed',
      minutesClass: 'completed_minutes',
      percentClass: 'compl_percent',
      count: typeof summary['Completed'] === 'object' ? summary['Completed'].count : 0,
      percent: typeof summary['Completed'] === 'object' ? summary['Completed'].percent : '0',
      icon: 'ti-check',
    },
    {
      status: '2',
      borderColor: '#1DC39F',
      title: 'On Target',
      minutesClass: 'on_target_minutes',
      percentClass: 'on_percent',
      count: typeof summary['On Target'] === 'object' ? summary['On Target'].count : 0,
      percent: typeof summary['On Target'] === 'object' ? summary['On Target'].percent : '0',
      icon: 'ti-target',
    },
    {
      status: '7',
      borderColor: '#F8C146',
      title: 'On Going',
      minutesClass: 'on_going_minutes',
      percentClass: 'on_going_percent',
      count: typeof summary['Ongoing'] === 'object' ? summary['Ongoing'].count : 0,
      percent: typeof summary['Ongoing'] === 'object' ? summary['Ongoing'].percent : '0',
      icon: 'ti-reload',
    },
    {
      status: '4',
      borderColor: '#E74039',
      title: 'Off Target',
      minutesClass: 'off_target_minutes',
      percentClass: 'off_percent',
      count: typeof summary['Off Target'] === 'object' ? summary['Off Target'].count : 0,
      percent: typeof summary['Off Target'] === 'object' ? summary['Off Target'].percent : '0',
      icon: 'ti-alert',
    },
    {
      status: '3',
      borderColor: '#FD7E01',
      title: 'Overdue',
      minutesClass: 'overdue_minutes',
      percentClass: 'over_percent',
      count: typeof summary['Overdue'] === 'object' ? summary['Overdue'].count : 0,
      percent: typeof summary['Overdue'] === 'object' ? summary['Overdue'].percent : '0',
      icon: 'ti-timer',
    },
    {
      status: '9',
      borderColor: '#f3726d',
      title: 'Off Target Reason',
      minutesClass: 'overdue_minutes_other',
      percentClass: 'over_other_percent',
      count: typeof summary['Off Target reason'] === 'object' ? summary['Off Target reason'].count : 0,
      percent: typeof summary['Off Target reason'] === 'object' ? summary['Off Target reason'].percent : '0',
      icon: 'ti-alert',
    },
    {
      status: '6',
      borderColor: '#874EFF',
      title: 'Overdue Reason',
      minutesClass: 'overdue_minutes_other',
      percentClass: 'over_other_percent',
      count: typeof summary['Overdue other reason'] === 'object' ? summary['Overdue other reason'].count : 0,
      percent: typeof summary['Overdue other reason'] === 'object' ? summary['Overdue other reason'].percent : '0',
      icon: 'ti-timer',
    },
  ];

  const statusOptions = [
    { value: '1', label: 'Completed' },
    { value: '2', label: 'On Target' },
    { value: '7', label: 'Ongoing' },
    { value: '4', label: 'Off Target' },
    { value: '3', label: 'Overdue' },
    { value: '9', label: 'Off Target reason' },
    { value: '6', label: 'Overdue other reason' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm) params.append('search', searchTerm);
    if (statusFilter) params.append('status', statusFilter);
    if (departmentFilter) params.append('department_id', departmentFilter);
    setSearchParams(params);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setDepartmentFilter('');
    setSearchParams({});
  };

  if (loading) {
    return <div className="text-center p-5">Loading...</div>;
  }

  let taskIndex = 0;

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
        .record-notes-custom-card-analytics {
          border-radius: 15px;
          margin-bottom: 10px !important;
          background: #fff !important;
          transition: all 0.2s linear;
          height: auto !important;
          padding: 0px !important;
          border: 2px solid #e3e3e3;
        }
        .record-notes-custom-card-analytics p {
          color: #000 !important;
          text-align: left !important;
          margin: 5px 0 !important;
        }
        .record-notes-custom-card-analytics .icon {
          width: 60px;
          height: 60px;
          border-radius: 100%;
          margin-bottom: 10px;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #fff;
        }
        .record-notes-custom-card-analytics .icon i {
          font-size: 1.8rem !important;
        }
        .record-notes-custom-card-analytics .card-body {
          display: flex;
          justify-content: flex-start !important;
          flex-direction: column;
          padding: 15px !important;
        }
        .record-notes-custom-card-analytics h3 {
          text-align: left !important;
          font-size: 2rem !important;
        }
        .record-notes-custom-card-analytics .card-body p.mb-0 {
          font-size: 1rem !important;
          font-weight: 400 !important;
        }
        .timeline-cell {
          min-width: 170px;
          font-weight: bold;
          text-align: center;
        }
        /* Bootstrap Collapse functionality */
        .collapse:not(.show) {
          display: none !important;
        }
        .collapse.show {
          display: block !important;
        }
        .collapsing {
          height: 0;
          overflow: hidden;
          transition: height 0.35s ease;
        }
        /* Force filter card visibility */
        .content-wrapper .card .card-body .row .card {
          display: block !important;
          visibility: visible !important;
          opacity: 1 !important;
        }
        .content-wrapper .card .card-body .row .card .card-header {
          display: flex !important;
          visibility: visible !important;
          opacity: 1 !important;
        }
        /* Force form elements visibility when expanded */
        .content-wrapper .card .card-body .row .card .card-body.collapse.show {
          display: block !important;
          visibility: visible !important;
          opacity: 1 !important;
        }
        .content-wrapper .card .card-body .row .card .card-body.collapse.show label {
          display: block !important;
          visibility: visible !important;
          opacity: 1 !important;
          color: #000 !important;
        }
        .content-wrapper .card .card-body .row .card .card-body.collapse.show .form-control {
          display: block !important;
          visibility: visible !important;
          opacity: 1 !important;
          border: 1px solid #ced4da !important;
          background-color: #fff !important;
          color: #495057 !important;
        }
        .content-wrapper .card .card-body .row .card .card-body.collapse.show .btn {
          display: inline-block !important;
          visibility: visible !important;
          opacity: 1 !important;
        }
      `}</style>

      <div className="card">
        <div className="card-header text-center">
          <div className="d-flex gap-3 justify-content-between align-items-center">
            <div className="flex-grow-1 text-center">
              <p className="block display-4">
                Summaries for CM - Detail Report
                {selectedDepartment && (
                  <>
                    <br />
                    <strong>{selectedDepartment.name} Department</strong>
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
        <div className="card-body">
          {/* Status Cards */}
          <div className="row my-5 d-flex justify-content-center">
            {statusCards.map((card) => (
              <div key={card.status} className="col-md-2 p-2">
                <Link
                  to={`/admin/report/summaries/detail?status=${card.status}${departmentId ? `&department_id=${departmentId}` : ''}`}
                >
                  <div
                    className="card record-notes-custom-card-analytics"
                    style={{
                      [status === card.status ? 'border' : 'borderBottom']: `8px solid ${card.borderColor}`,
                    }}
                  >
                    <div className="card-body">
                      <div className="icon" style={{ background: card.borderColor }}>
                        <i className={card.icon}></i>
                      </div>
                      <h3 className={`mb-2 ${card.minutesClass}`} style={{ color: card.borderColor }}>
                        {card.count}
                      </h3>
                      <p>{card.title}</p>
                      <p className={`mb-0 mt-2 ${card.percentClass}`}>
                        {card.percent === '0' ? '\u00A0' : `${card.percent}%`}
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          {/* Filter Form */}
          <div className="row justify-content-center">
            <div className="col-md-8">
              <div className="card mb-3">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <span>Filter Tasks</span>
                  <button
                    type="button"
                    className="btn"
                    onClick={() => setFilterCollapsed(!filterCollapsed)}
                    style={{ cursor: 'pointer' }}
                  >
                    <i className={`fas ${filterCollapsed ? 'fa-plus' : 'fa-minus'}`}></i>
                  </button>
                </div>
                <div className={`card-body collapse ${!filterCollapsed ? 'show' : ''}`} id="filterCardBody">
                  <form method="GET" onSubmit={handleSearch}>
                    <div className="row">
                      <div className="col-md-12">
                        <div className="form-group">
                          <label htmlFor="search">Task Title</label>
                          <input
                            type="text"
                            name="search"
                            id="search"
                            className="form-control"
                            placeholder="Search minute title..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="form-group">
                          <label htmlFor="status">Task Status</label>
                          <select
                            id="add_status_dropdown"
                            name="status"
                            style={{ width: '250px' }}
                            className="w-100 form-control form-control-lg"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                          >
                            <option value="">Select status</option>
                            {statusOptions.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="form-group">
                          <label htmlFor="department_id">Department</label>
                          <select
                            name="department_id"
                            id="department_id"
                            className="w-100 form-control form-control-lg"
                            value={departmentFilter}
                            onChange={(e) => setDepartmentFilter(e.target.value)}
                          >
                            <option value="">All Departments</option>
                            {departments.map((dept) => (
                              <option key={dept.id} value={dept.id}>
                                {dept.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                    <button type="submit" className="btn btn-primary">
                      Search
                    </button>
                    <Link to="/admin/report/summaries/detail" className="btn btn-secondary ml-2" onClick={handleClearFilters}>
                      Clear Filters
                    </Link>
                  </form>
                </div>
              </div>
            </div>
          </div>

          {/* Export Buttons and Search */}
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
                      value={tableSearchTerm}
                      onChange={(e) => setTableSearchTerm(e.target.value)}
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Tasks Table */}
          <div className="row mt-3">
            <div className="col">
              <div className="card mt-3">
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-bordered datatable">
                      <thead>
                        <tr className="thead-light">
                          <th>S.No</th>
                          <th>Details</th>
                          <th>Progress</th>
                          <th>Responsibility</th>
                          <th>Timeline</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.keys(filteredGroupedTasks).length === 0 ? (
                          <tr>
                            <td colSpan={7} className="text-center">
                              No data available
                            </td>
                          </tr>
                        ) : (
                          Object.entries(filteredGroupedTasks).map(([summaryId, summaryTasks]) => {
                            const firstTask = summaryTasks[0];
                            return (
                              <React.Fragment key={summaryId}>
                                <tr className="thead-light">
                                  <td colSpan={7} className="text-center" style={{ width: '100%' }}>
                                    <Link
                                      to={`/admin/summaries/show/${summaryId}`}
                                      className="lead text-info font-weight-bold"
                                    >
                                      {firstTask.taskable.getTaskableTitle()}
                                    </Link>
                                  </td>
                                </tr>
                                {summaryTasks.map((task) => {
                                  taskIndex++;
                                  return (
                                    <tr key={task.id}>
                                      <td>{taskIndex}</td>
                                      <td className="text">
                                        <h5>
                                          <Link
                                            to={`/admin/summaries/show/${summaryId}#row${task.id}`}
                                          >
                                            {`Task#${task.id} - ${task.title}`}
                                          </Link>
                                        </h5>
                                        <div dangerouslySetInnerHTML={{ __html: task.description }} />
                                      </td>
                                      <td className="text">
                                        <div dangerouslySetInnerHTML={{ __html: task.progress }} />
                                      </td>
                                      <td>
                                        <table className="table table-bordered">
                                          <thead>
                                            <tr className="thead-light">
                                              <th>Department</th>
                                              <th>Dept. Status</th>
                                              <th>CM Office Status</th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {task.departments.map((dept) => (
                                              <tr key={dept.id}>
                                                <td>{dept.name}</td>
                                                <td style={{ width: '100px' }}>
                                                  {dept.latestComment && (
                                                    <span className={`badge ${dept.latestComment.status.badgeClass}`}>
                                                      {dept.latestComment.status.label}
                                                    </span>
                                                  )}
                                                </td>
                                                <td style={{ width: '100px' }}>
                                                  <span className={`badge ${dept.pivot.status.badgeClass}`}>
                                                    {dept.pivot.status.label}
                                                  </span>
                                                </td>
                                              </tr>
                                            ))}
                                          </tbody>
                                        </table>
                                      </td>
                                      <td className="timeline-cell" dangerouslySetInnerHTML={{ __html: task.timeline_label_html }} />
                                      <td>
                                        <Link to={`/admin/summaries/show/${summaryId}#row${task.id}`}>
                                          <span className={`badge ${task.status.badgeClass}`}>{task.status.label}</span>
                                        </Link>
                                      </td>
                                      <td style={{ whiteSpace: 'nowrap' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                          <Link
                                            to={`/admin/tasks/${task.id}/comments`}
                                            className="btn btn-info"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{ width: 'auto', minWidth: '40px' }}
                                          >
                                            <i className="ti-comments"></i>
                                          </Link>
                                          <Link
                                            to={`/admin/tasks/${task.id}`}
                                            className="btn btn-info"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{ width: 'auto', minWidth: '40px' }}
                                          >
                                            <i className="ti-printer"></i>
                                          </Link>
                                        </div>
                                      </td>
                                    </tr>
                                  );
                                })}
                              </React.Fragment>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="card-footer mt-3 border">
                  <div className="row align-items-center">
                    <div className="col">
                      <div className="form-group mb-0 row align-items-center">
                        <label htmlFor="perPage" className="col-sm-3 col-form-label mb-0">
                          Show
                        </label>
                        <select id="perPage" className="form-control form-control-sm col-sm-3">
                          <option value="10">10</option>
                          <option value="25">25</option>
                          <option value="50">50</option>
                          <option value="100">100</option>
                        </select>
                        <span className="inline-block col-sm-6"> per page</span>
                      </div>
                    </div>
                    <div className="col text-center">
                      <p>
                        Showing <strong>1</strong> to <strong>{tasks.length}</strong> of total <strong>{tasks.length}</strong> records.
                      </p>
                    </div>
                    <div className="col d-flex justify-content-end">
                      {/* Pagination would go here */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
