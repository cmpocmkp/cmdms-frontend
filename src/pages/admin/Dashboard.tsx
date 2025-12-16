/**
 * Admin Dashboard Page - Department-Wise Dashboard
 * EXACT replica of admin/report/department-wise-dashboard.blade.php from old CMDMS
 * Includes DataTables with export buttons (Copy, Excel, CSV, PDF, Print) and Chart.js
 * 
 * ENHANCED UI:
 * - Polished summary cards with hover effects
 * - Modernized DataTables buttons and inputs
 * - Cleaner table typography and spacing
 * - Improved filter controls
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
      backgroundColor: ['rgba(50, 130, 255, 0.2)'],
      borderColor: ['#3282FF'],
      borderWidth: 1,
      hoverBackgroundColor: ['rgba(50, 130, 255, 0.4)'],
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
          text: 'Total Tasks',
          font: {
            weight: 'bold' as const
          }
        },
        grid: {
          color: '#f0f0f0'
        },
        ticks: {
          stepSize: 100,
          font: {
            size: 11
          }
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 11
          }
        }
      }
    },
    barPercentage: 0.5,
    categoryPercentage: 0.8,
    plugins: {
      legend: {
        display: false
      },
      datalabels: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#1e293b',
        bodyColor: '#475569',
        borderColor: '#e2e8f0',
        borderWidth: 1,
        padding: 10,
        boxPadding: 4,
        usePointStyle: true,
        titleFont: {
          size: 13,
          weight: 'bold' as const
        }
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
  
  // Custom Styles for React Select
  const selectStyles = {
    control: (base: any, state: any) => ({
      ...base,
      borderColor: state.isFocused ? '#3282FF' : '#e2e8f0',
      boxShadow: state.isFocused ? '0 0 0 2px rgba(50, 130, 255, 0.1)' : 'none',
      '&:hover': {
        borderColor: '#3282FF'
      },
      borderRadius: '6px',
      minHeight: '38px',
      fontSize: '0.9rem'
    }),
    multiValue: (base: any) => ({
      ...base,
      backgroundColor: '#eff6ff',
      borderRadius: '4px',
    }),
    multiValueLabel: (base: any) => ({
      ...base,
      color: '#1e40af',
      fontSize: '0.85rem',
      fontWeight: 500
    }),
    multiValueRemove: (base: any) => ({
      ...base,
      color: '#1e40af',
      ':hover': {
        backgroundColor: '#dbeafe',
        color: '#1e3a8a',
      },
    }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isSelected ? '#3282FF' : state.isFocused ? '#eff6ff' : 'white',
      color: state.isSelected ? 'white' : '#334155',
      fontSize: '0.9rem',
      ':active': {
        backgroundColor: '#3282FF',
        color: 'white'
      }
    })
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
              { extend: 'copy', className: 'btn-dt-custom' },
              { extend: 'excel', className: 'btn-dt-custom' },
              { extend: 'csv', className: 'btn-dt-custom' },
              { extend: 'pdf', className: 'btn-dt-custom' },
              { extend: 'print', className: 'btn-dt-custom' }
            ],
            language: {
              search: "",
              searchPlaceholder: "Search records..."
            }
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
        /* Table Typography & Spacing */
        .table-compact th {
          padding: 0.75rem 0.5rem !important;
          font-size: 0.75rem !important;
          font-weight: 700 !important;
          text-transform: uppercase !important;
          letter-spacing: 0.05em !important;
          color: #64748b !important;
          background-color: #f8fafc !important;
          border-bottom: 2px solid #e2e8f0 !important;
          vertical-align: middle !important;
        }
        .table-compact td {
          padding: 0.6rem 0.5rem !important;
          font-size: 0.875rem !important;
          vertical-align: middle !important;
          border-color: #f1f5f9 !important;
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
          border-radius: 8px;
        }
        
        /* DataTables Custom UI */
        .dataTables_wrapper .dt-buttons {
          margin-bottom: 1rem !important;
        }
        .dataTables_wrapper .dt-button {
          background: #ffffff !important;
          border: 1px solid #e2e8f0 !important;
          border-radius: 6px !important;
          color: #475569 !important;
          font-size: 0.8rem !important;
          padding: 0.4rem 0.8rem !important;
          margin-right: 0.5rem !important;
          transition: all 0.2s ease !important;
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05) !important;
          font-weight: 500 !important;
        }
        .dataTables_wrapper .dt-button:hover {
          background: #f8fafc !important;
          border-color: #cbd5e1 !important;
          color: #0f172a !important;
          transform: translateY(-1px);
        }
        .dataTables_wrapper .dataTables_filter {
          margin-bottom: 1rem !important;
        }
        .dataTables_wrapper .dataTables_filter input {
          border: 1px solid #e2e8f0 !important;
          border-radius: 6px !important;
          padding: 0.4rem 0.8rem !important;
          font-size: 0.875rem !important;
          outline: none !important;
          transition: all 0.2s !important;
          margin-left: 0.5rem !important;
          min-width: 250px;
        }
        .dataTables_wrapper .dataTables_filter input:focus {
          border-color: #3b82f6 !important;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
        }
        
        /* Summary Cards Enhancements */
        .record-notes-custom-card-analytics {
          transition: transform 0.25s ease, box-shadow 0.25s ease !important;
          border: none !important;
          border-radius: 12px !important;
          background: #fff !important;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
          overflow: hidden;
        }
        .record-notes-custom-card-analytics:hover {
          transform: translateY(-5px) !important;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
        }
        .record-notes-custom-card-analytics .card-body {
          padding: 1.5rem !important;
          position: relative;
          z-index: 1;
        }
        .record-notes-custom-card-analytics .icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        .record-notes-custom-card-analytics .icon i {
          color: #fff;
          font-size: 1.25rem;
        }
        .record-notes-custom-card-analytics h3 {
          font-size: 2rem;
          font-weight: 700;
          letter-spacing: -0.02em;
        }
        .record-notes-custom-card-analytics p {
          font-size: 0.875rem;
          color: #64748b;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.025em;
        }
        
        /* Chart Container */
        .bar-chart-box {
          background: #fff;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          border: 1px solid #f1f5f9;
        }
        
        /* Link styling in table */
        table.table a {
          color: inherit;
          text-decoration: none;
          display: block;
          width: 100%;
          height: 100%;
          transition: color 0.2s;
        }
        table.table td:first-child a {
          color: #3b82f6;
          font-weight: 500;
        }
        table.table td:first-child a:hover {
          color: #1d4ed8;
          text-decoration: underline;
        }
        
        /* Ensure filter labels look good */
        label {
          font-weight: 500;
          color: #475569;
          font-size: 0.875rem;
          margin-bottom: 0.5rem;
        }
      `}</style>
      
      <div className="content-wrapper">
        <div className="card border-0 shadow-sm" style={{ background: 'transparent', boxShadow: 'none' }}>
          <div className="card-body p-0">
            {/* Summary Cards Section */}
            <div className="row mb-4">
              <div className="col-md-12 d-flex justify-content-center flex-wrap gap-3">
                {summaryCards.map((card, index) => (
                  <div key={index} className="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-12 p-2" style={{ minWidth: '220px' }}>
                    <div 
                      className="card record-notes-custom-card-analytics h-100" 
                      style={{ borderBottom: `4px solid ${card.borderColor}` }}
                    >
                      <div className="card-body d-flex flex-column align-items-center text-center">
                        <div className="icon mb-3" style={{ background: card.borderColor }}>
                          <i className={card.icon}></i>
                        </div>
                        <h3 
                          className={`mb-1 ${card.minutesClass}`}
                          style={{ color: card.borderColor }}
                        >
                          {card.count}
                        </h3>
                        <p className="mb-2">{card.title}</p>
                        <div 
                          className={`mt-auto px-2 py-1 rounded-pill ${card.percentClass}`}
                          style={{ 
                            background: `${card.borderColor}15`,
                            color: card.borderColor,
                            fontSize: '0.75rem',
                            fontWeight: 'bold',
                            opacity: card.percent === 0 ? 0 : 1
                          }}
                        >
                          {card.percent === 0 ? '0%' : `${card.percent}%`}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Filter Section */}
            <div className="card border-0 shadow-sm rounded-lg mb-4 bg-white">
              <div className="card-body p-4">
                <div className="row justify-content-center align-items-end">
                  <div className="col-md-1"></div>
                  
                  {/* Modules Multi-Select */}
                  <div className="col-md-5">
                    <div className="form-group mb-0">
                      <label htmlFor="module">Filter by Modules</label>
                      <Select
                        isMulti
                        options={moduleOptions}
                        value={moduleOptions.filter(opt => selectedModules.includes(opt.value))}
                        onChange={(selected) => setSelectedModules(selected.map(s => s.value))}
                        className="basic-multi-select"
                        classNamePrefix="select"
                        placeholder="Select modules..."
                        styles={selectStyles}
                      />
                    </div>
                  </div>
                  
                  {/* Department Filter */}
                  <div className="col-md-2">
                    <div className="form-group mb-0">
                      <label htmlFor="department_filter">Organization Type</label>
                      <Select
                        options={departmentFilterOptions}
                        value={departmentFilterOptions.find(opt => opt.value === departmentFilter)}
                        onChange={(selected) => setDepartmentFilter(selected?.value as any || 'all')}
                        className="basic-single"
                        classNamePrefix="select"
                        styles={selectStyles}
                      />
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="col-md-4 d-flex align-items-end">
                    <div className="form-group mb-0 d-flex gap-2">
                      <button 
                        type="button" 
                        className="btn btn-primary d-flex align-items-center justify-content-center shadow-sm"
                        style={{ 
                          height: '38px', 
                          borderRadius: '6px',
                          background: '#3282FF',
                          borderColor: '#3282FF',
                          fontWeight: 500,
                          padding: '0 1.5rem'
                        }}
                        onClick={handleApplyFilters}
                      >
                        <i className="ti-filter mr-2"></i> Apply
                      </button>
                      <button 
                        type="button" 
                        className="btn btn-light d-flex align-items-center justify-content-center shadow-sm"
                        style={{ 
                          height: '38px', 
                          borderRadius: '6px',
                          background: '#fff',
                          borderColor: '#e2e8f0',
                          color: '#475569',
                          fontWeight: 500,
                          padding: '0 1.5rem'
                        }}
                        onClick={handleClearFilters}
                      >
                        <i className="ti-close mr-2"></i> Clear
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Data Table Section with DataTables */}
            <div className="row mt-3">
              <div className="col-md-12">
                <div className="card border-0 shadow-sm rounded-lg mb-0 bg-white">
                  <div className="card-body table-responsive p-4">
                    <div className="d-flex align-items-center justify-content-between mb-4">
                       <h5 className="mb-0 font-weight-bold" style={{ color: '#334155' }}>
                        <i className="ti-files mr-2 text-primary"></i>
                        Department/District Wise Tasks
                      </h5>
                    </div>
                    
                    <table 
                      ref={tableRef}
                      className="table datatable table-bordered table-sm table-compact table-hover"
                      style={{ width: '100%' }}
                    >
                      <thead>
                        <tr>
                          <th>Department Name</th>
                          <th>Total Tasks</th>
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
                              <td style={{ backgroundColor: '#eff6ff', color: '#1e40af', fontWeight: 'bold' }}>
                                <Link to={`/admin/report/department/${department.id}/dashboard`}>
                                  {department.total_tasks_count}
                                </Link>
                              </td>
                              <td style={{ backgroundColor: '#ecfdf5', color: '#047857', fontWeight: 'bold' }}>
                                <Link to={`/admin/report/department/${department.id}/dashboard?status=1`}>
                                  {department.total_completed_count}
                                </Link>
                              </td>
                              <td style={{ backgroundColor: '#f0fdfa', color: '#0f766e', fontWeight: 'bold' }}>
                                <Link to={`/admin/report/department/${department.id}/dashboard?status=2`}>
                                  {department.total_on_target_count}
                                </Link>
                              </td>
                              <td style={{ backgroundColor: '#fef2f2', color: '#b91c1c', fontWeight: 'bold' }}>
                                <Link to={`/admin/report/department/${department.id}/dashboard?status=3`}>
                                  {department.total_overdue_count}
                                </Link>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={5} className="text-center p-4 text-muted">
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
            <div className="row mt-4">
              <div className="col-lg-12">
                <div className="bar-chart-box bg-white">
                  <h5 className="mb-4 font-weight-bold" style={{ color: '#334155' }}>
                    <i className="ti-bar-chart mr-2 text-primary"></i>
                    Tasks Distribution by Module
                  </h5>
                  <Bar data={chartData} options={chartOptions} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
