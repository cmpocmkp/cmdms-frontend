/**
 * Admin Dashboard Page - Department-Wise Dashboard
 * EXACT replica of admin/report/department-wise-dashboard.blade.php from old CMDMS
 * Includes DataTables with export buttons (Copy, Excel, CSV, PDF, Print) and Chart.js
 */

import { useState, useMemo, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { 
  mockDashboardDepartments, 
  moduleRelations,
  moduleDisplayNames,
  mockModuleTotals,
  calculateTotals
} from '../../lib/mocks/data/dashboardDepartments';
import type { DashboardDepartment } from '../../lib/mocks/data/dashboardDepartments';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);

export default function Dashboard() {
  // Filter state
  const [selectedModules, setSelectedModules] = useState<string[]>(moduleRelations);
  const [departmentFilter, setDepartmentFilter] = useState<'all' | 'departments' | 'district_administrations'>('all');
  const tableRef = useRef<HTMLTableElement>(null);
  const dataTableRef = useRef<any>(null);
  
  // Module select options
  const moduleOptions = moduleRelations.map(module => ({
    value: module,
    label: moduleDisplayNames[module]
  }));
  
  // Department filter options
  const departmentFilterOptions = [
    { value: 'all', label: 'All' },
    { value: 'departments', label: 'Departments' },
    { value: 'district_administrations', label: 'District Administrations' },
  ];
  
  // Filter departments based on selected filters
  const filteredDepartments = useMemo(() => {
    let filtered = [...mockDashboardDepartments];
    
    // Apply department filter
    if (departmentFilter === 'district_administrations') {
      filtered = filtered.filter(dept => 
        dept.name.toLowerCase().startsWith('dc ') || 
        dept.name.toLowerCase().includes('district')
      );
    } else if (departmentFilter === 'departments') {
      filtered = filtered.filter(dept => 
        !dept.name.toLowerCase().startsWith('dc ') && 
        !dept.name.toLowerCase().includes('district')
      );
    }
    
    return filtered;
  }, [departmentFilter]);
  
  // Recalculate totals based on filtered departments
  const overallTotals = useMemo(() => {
    return calculateTotals(filteredDepartments);
  }, [filteredDepartments]);
  
  // Summary cards data
  const summaryCards = [
    {
      borderColor: '#3282FF',
      title: 'Tasks',
      minutesClass: 'total_minutes',
      percentClass: '',
      count: overallTotals.total_tasks,
      percent: 0,
      icon: 'ti-list'
    },
    {
      borderColor: '#0E8160',
      title: 'Completed',
      minutesClass: 'completed_minutes',
      percentClass: 'compl_percent',
      count: overallTotals.total_completed,
      percent: overallTotals.completed_percentage,
      icon: 'ti-check'
    },
    {
      borderColor: '#1DC39F',
      title: 'On Target',
      minutesClass: 'on_target_minutes',
      percentClass: 'on_percent',
      count: overallTotals.total_on_target,
      percent: overallTotals.on_target_percentage,
      icon: 'ti-target'
    },
    {
      borderColor: '#E74039',
      title: 'Overdue',
      minutesClass: 'overdue_minutes',
      percentClass: 'over_percent',
      count: overallTotals.total_overdue,
      percent: overallTotals.overdue_percentage,
      icon: 'ti-timer'
    },
  ];
  
  // Chart data
  const chartData = {
    labels: selectedModules.map(m => moduleDisplayNames[m]),
    datasets: [{
      label: 'Tasks by Module',
      data: selectedModules.map(m => mockModuleTotals[m] || 0),
      backgroundColor: ['rgb(211 227 252)'],
      borderColor: ['rgb(176 202 243)'],
      borderWidth: 1
    }]
  };
  
  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 3.5,
    onHover: (event: any, activeEls: any) => {
      if (event && event.native && event.native.target) {
        (event.native.target as HTMLElement).style.cursor = activeEls.length > 0 ? 'pointer' : 'default';
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Total Tasks'
        },
        ticks: {
          stepSize: 100
        }
      },
      x: {
        title: {
          display: true,
          text: ' '
        }
      }
    },
    barPercentage: 0.3,
    categoryPercentage: 0.9,
    plugins: {
      legend: {
        display: false
      },
      datalabels: {
        display: false
      }
    }
  };
  
  const handleApplyFilters = () => {
    console.log('Filters applied:', { selectedModules, departmentFilter });
  };
  
  const handleClearFilters = () => {
    setSelectedModules(moduleRelations);
    setDepartmentFilter('all');
  };
  
  // Initialize DataTables
  useEffect(() => {
    if (tableRef.current && filteredDepartments.length > 0) {
      // Load DataTables CSS
      const datatablesCss = document.createElement('link');
      datatablesCss.rel = 'stylesheet';
      datatablesCss.href = 'https://cdn.datatables.net/1.13.7/css/jquery.dataTables.min.css';
      document.head.appendChild(datatablesCss);
      
      const buttonsCss = document.createElement('link');
      buttonsCss.rel = 'stylesheet';
      buttonsCss.href = 'https://cdn.datatables.net/buttons/2.4.2/css/buttons.dataTables.min.css';
      document.head.appendChild(buttonsCss);
      
      // Load jQuery and DataTables
      const loadScript = (src: string) => {
        return new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = src;
          script.onload = resolve;
          script.onerror = reject;
          document.body.appendChild(script);
        });
      };
      
      const initializeDataTable = async () => {
        try {
          // Load jQuery first
          if (!(window as any).jQuery) {
            await loadScript('https://code.jquery.com/jquery-3.7.1.min.js');
          }
          
          // Load DataTables
          await loadScript('https://cdn.datatables.net/1.13.7/js/jquery.dataTables.min.js');
          await loadScript('https://cdn.datatables.net/buttons/2.4.2/js/dataTables.buttons.min.js');
          await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js');
          await loadScript('https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/pdfmake.min.js');
          await loadScript('https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/vfs_fonts.js');
          await loadScript('https://cdn.datatables.net/buttons/2.4.2/js/buttons.html5.min.js');
          await loadScript('https://cdn.datatables.net/buttons/2.4.2/js/buttons.print.min.js');
          
          const $ = (window as any).jQuery;
          
          // Destroy existing DataTable if it exists
          if (dataTableRef.current) {
            dataTableRef.current.destroy();
          }
          
          // Initialize DataTable with export buttons
          dataTableRef.current = $(tableRef.current).DataTable({
            paging: false,
            ordering: false,
            searching: true,
            dom: 'Bfrtip',
            buttons: [
              'copy',
              'excel',
              'csv',
              'pdf',
              'print'
            ]
          });
        } catch (error) {
          console.error('Error initializing DataTable:', error);
        }
      };
      
      initializeDataTable();
    }
    
    return () => {
      if (dataTableRef.current) {
        dataTableRef.current.destroy();
        dataTableRef.current = null;
      }
    };
  }, [filteredDepartments]);
  
  return (
    <>
      <style>{`
        .table-compact th {
          padding: 0.5rem !important;
          font-size: 0.85rem !important;
        }
        .table-compact td {
          padding: 0.1rem !important;
          font-size: 0.85rem !important;
        }
        .table-compact th:nth-child(1), .table-compact td:nth-child(1) {
          width: 30%;
          min-width: 150px;
        }
        .table-compact th:nth-child(n+2), .table-compact td:nth-child(n+2) {
          width: 14%;
          min-width: 80px;
          text-align: center;
        }
        .table-responsive {
          overflow-x: auto;
        }
        .card-custom {
          border-radius: 0.75rem !important;
          margin-right: 1rem !important;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1) !important;
        }
        .card-custom:last-child {
          margin-right: 0 !important;
        }
        table.table td {
          padding: 5px !important;
        }
        .record-notes-custom-card-analytics .card-body {
          padding: 1rem !important;
        }
        .record-notes-custom-card-analytics .icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1rem;
        }
        .record-notes-custom-card-analytics .icon i {
          color: #fff;
          font-size: 1.5rem;
        }
        .record-notes-custom-card-analytics h3 {
          font-size: 1.75rem;
        }
        .record-notes-custom-card-analytics p {
          font-size: 0.9rem;
          margin-bottom: 0;
        }
        .bar-chart-box .stretch-card {
          min-height: 300px;
          max-height: 400px;
        }
      `}</style>
      
      <div className="content-wrapper">
        <div className="card">
          <div className="card-body">
            {/* Summary Cards Section */}
            <div className="row">
              <div className="col-md-12 d-flex justify-content-center flex-wrap">
                {summaryCards.map((card, index) => (
                  <div key={index} className="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-12 p-2">
                    <div 
                      className="card record-notes-custom-card-analytics" 
                      style={{ borderBottom: `8px solid ${card.borderColor}` }}
                    >
                      <div className="card-body">
                        <div className="icon" style={{ background: card.borderColor }}>
                          <i className={card.icon}></i>
                        </div>
                        <h3 
                          className={`mb-2 ${card.minutesClass}`}
                          style={{ color: card.borderColor }}
                        >
                          {card.count}
                        </h3>
                        <p>{card.title}</p>
                        <p className={`mb-0 mt-2 ${card.percentClass}`}>
                          {card.percent === 0 ? '\u00A0' : `${card.percent}%`}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Filter Section */}
            <div className="row form-row justify-content-center align-items-end mt-4">
              <div className="col-md-12">
                <div className="form-row align-items-end">
                  <div className="col-md-1"></div>
                  
                  {/* Modules Multi-Select */}
                  <div className="col-md-5">
                    <div className="form-group mb-2">
                      <label htmlFor="module">Modules</label>
                      <Select
                        isMulti
                        options={moduleOptions}
                        value={moduleOptions.filter(opt => selectedModules.includes(opt.value))}
                        onChange={(selected) => setSelectedModules(selected.map(s => s.value))}
                        className="basic-multi-select"
                        classNamePrefix="select"
                        placeholder="Select modules"
                      />
                    </div>
                  </div>
                  
                  {/* Department Filter */}
                  <div className="col-md-2">
                    <div className="form-group mb-2">
                      <label htmlFor="department_filter">Department Filter</label>
                      <Select
                        options={departmentFilterOptions}
                        value={departmentFilterOptions.find(opt => opt.value === departmentFilter)}
                        onChange={(selected) => setDepartmentFilter(selected?.value as any || 'all')}
                        className="basic-single"
                        classNamePrefix="select"
                      />
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="col-md-4 d-flex align-items-end">
                    <div className="form-group mb-2">
                      <button 
                        type="button" 
                        className="btn btn-primary btn-md mr-2"
                        onClick={handleApplyFilters}
                      >
                        Apply Filters
                      </button>
                      <button 
                        type="button" 
                        className="btn btn-secondary btn-md"
                        onClick={handleClearFilters}
                      >
                        Clear Filters
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Data Table Section with DataTables */}
            <div className="row mt-3">
              <div className="col-md-12">
                <div className="card mb-0">
                  <div className="card-body table-responsive p-2">
                    <h5 className="mb-3 text-center" style={{ color: '#6c757d' }}>
                      Department/District Wise Tasks
                    </h5>
                    <table 
                      ref={tableRef}
                      className="table datatable table-bordered table-sm table-compact"
                    >
                      <thead>
                        <tr>
                          <th>Department</th>
                          <th>Tasks</th>
                          <th>Completed</th>
                          <th>On Target</th>
                          <th>Overdue</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredDepartments.length > 0 ? (
                          filteredDepartments.map((department: DashboardDepartment) => (
                            <tr key={department.id}>
                              <td>
                                <Link to={`/admin/report/department/${department.id}/dashboard`}>
                                  {department.name}
                                </Link>
                              </td>
                              <td style={{ backgroundColor: '#dbe9ff', color: '#000000' }}>
                                <Link to={`/admin/report/department/${department.id}/dashboard`}>
                                  {department.total_tasks_count}
                                </Link>
                              </td>
                              <td style={{ backgroundColor: '#c7ede5', color: '#000000' }}>
                                <Link to={`/admin/report/department/${department.id}/dashboard?status=1`}>
                                  {department.total_completed_count}
                                </Link>
                              </td>
                              <td style={{ backgroundColor: '#d2f4ef', color: '#000000' }}>
                                <Link to={`/admin/report/department/${department.id}/dashboard?status=2`}>
                                  {department.total_on_target_count}
                                </Link>
                              </td>
                              <td style={{ backgroundColor: '#f66e68ab', color: '#000000' }}>
                                <Link to={`/admin/report/department/${department.id}/dashboard?status=3`}>
                                  {department.total_overdue_count}
                                </Link>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={5} className="text-center">
                              No departments found for the selected filters.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Bar Chart Section */}
            <div className="row bar-chart-box" style={{ display: 'block', marginTop: '20px' }}>
              <div className="col-lg-12">
                <Bar data={chartData} options={chartOptions} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
