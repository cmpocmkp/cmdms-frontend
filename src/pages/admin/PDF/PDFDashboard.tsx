/**
 * PDF Module Dashboard
 * Dashboard for accessing all PDF/Print functionalities in CMDMS
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Download, Printer, FileCheck, FileBarChart, FileSpreadsheet, FileImage } from 'lucide-react';

interface PDFModule {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  route: string;
  category: string;
  color: string;
}

const pdfModules: PDFModule[] = [
  // Record Notes PDFs
  {
    id: 'record-note',
    title: 'Record Note PDF',
    description: 'Generate PDF for a single record note',
    icon: FileText,
    route: '/admin/print/{id}/reocrdnote/',
    category: 'Record Notes',
    color: '#3282FF'
  },
  {
    id: 'record-note-list',
    title: 'Record Notes List PDF',
    description: 'Generate PDF for list of record notes',
    icon: FileText,
    route: '/admin/print/recordnotelist/',
    category: 'Record Notes',
    color: '#3282FF'
  },
  {
    id: 'record-note-status',
    title: 'Record Note by Status PDF',
    description: 'Generate PDF for record notes filtered by status',
    icon: FileText,
    route: '/admin/print/{meeting_id}/{department_id}/{status}/reocrdnote/',
    category: 'Record Notes',
    color: '#3282FF'
  },
  {
    id: 'record-note-updates',
    title: 'Record Notes Updates PDF',
    description: 'Generate PDF for record notes updates',
    icon: FileText,
    route: '/admin/print/{meeting_id}/{department_id}/{status}/reocrdnotes-updates/',
    category: 'Record Notes',
    color: '#3282FF'
  },
  
  // Directives PDFs
  {
    id: 'directives',
    title: 'Directives PDF',
    description: 'Generate PDF for directives by status',
    icon: FileCheck,
    route: '/admin/print/{department_id}/{status}/directives/',
    category: 'Directives',
    color: '#0E8160'
  },
  
  // Announcements PDFs
  {
    id: 'announcements-depts',
    title: 'Announcements by Department PDF',
    description: 'Generate PDF for announcements filtered by department',
    icon: FileImage,
    route: '/admin/print/{department_id}/{status}/announcements/{type}',
    category: 'Announcements',
    color: '#1DC39F'
  },
  {
    id: 'announcements-districts',
    title: 'Announcements by District PDF',
    description: 'Generate PDF for announcements filtered by district',
    icon: FileImage,
    route: '/admin/print/{district_id}/{status}/districts/{type}',
    category: 'Announcements',
    color: '#1DC39F'
  },
  
  // Complaints PDFs
  {
    id: 'complaints',
    title: 'Complaints PDF',
    description: 'Generate PDF for complaints by status',
    icon: FileBarChart,
    route: '/admin/print/{department_id}/{status}/complaints/',
    category: 'Complaints',
    color: '#E74039'
  },
  
  // Welfare Initiatives PDFs
  {
    id: 'welfare-initiative',
    title: 'Welfare Initiative PDF',
    description: 'Generate PDF for welfare initiatives by status',
    icon: FileSpreadsheet,
    route: '/admin/print/{status}/welfareinitiative/',
    category: 'Welfare Initiatives',
    color: '#F8C146'
  },
  
  // Board Meetings PDFs
  {
    id: 'board-meeting',
    title: 'Board Meeting PDF',
    description: 'Generate PDF for board meetings',
    icon: FileText,
    route: '/admin/print/{meeting}/{board}/{status}/boardmeeting/',
    category: 'Board Meetings',
    color: '#874EFF'
  },
  
  // Sectorial Meetings PDFs
  {
    id: 'sectorial-meeting',
    title: 'Sectorial Meeting PDF',
    description: 'Generate PDF for sectorial meetings',
    icon: FileText,
    route: '/admin/print/{meeting}/{department}/{status}/sectorialmeeting/',
    category: 'Sectorial Meetings',
    color: '#f3726d'
  },
  
  // Consolidated Reports PDFs
  {
    id: 'consolidated-export',
    title: 'Consolidated Report PDF',
    description: 'Export consolidated report as PDF',
    icon: FileBarChart,
    route: '/admin/print/report/consolidated/export',
    category: 'Reports',
    color: '#17c653'
  },
  
  // Issues PDFs
  {
    id: 'issues-export',
    title: 'Issues Export PDF',
    description: 'Export issues as PDF',
    icon: FileText,
    route: '/admin/issues/export/pdf',
    category: 'Issues',
    color: '#FD7E01'
  },
  
  // HCM Public Affairs PDFs
  {
    id: 'hcm-public-affairs',
    title: 'HCM Public Affairs PDF',
    description: 'Export HCM public affairs report as PDF',
    icon: FileBarChart,
    route: '/admin/hcm-public-affairs-export-pdf',
    category: 'Reports',
    color: '#17c653'
  },
  
  // Public Days PDFs
  {
    id: 'public-days',
    title: 'Public Days PDF',
    description: 'Export public days as PDF',
    icon: FileText,
    route: '/admin/publicdays/export/pdf',
    category: 'Public Days',
    color: '#1b84ff'
  }
];

// Group modules by category
const groupedModules = pdfModules.reduce((acc, module) => {
  if (!acc[module.category]) {
    acc[module.category] = [];
  }
  acc[module.category].push(module);
  return acc;
}, {} as Record<string, PDFModule[]>);

export default function PDFDashboard() {
  return (
    <div className="content-wrapper">
      <div className="card">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="card-title text-primary">PDF Module Dashboard</h4>
            <div className="d-flex align-items-center">
              <Printer size={24} className="mr-2 text-primary" />
              <span className="text-muted">Generate and Export PDFs</span>
            </div>
          </div>

          <p className="text-muted mb-4">
            Access all PDF generation and export functionalities. Click on any module to generate or export PDFs.
          </p>

          {Object.entries(groupedModules).map(([category, modules]) => (
            <div key={category} className="mb-5">
              <h5 className="mb-3" style={{ color: '#495057', borderBottom: '2px solid #dee2e6', paddingBottom: '10px' }}>
                {category}
              </h5>
              <div className="row">
                {modules.map((module) => {
                  const IconComponent = module.icon;
                  return (
                    <div key={module.id} className="col-xl-3 col-lg-4 col-md-6 col-sm-12 mb-4">
                      <Link
                        to={module.route}
                        style={{ textDecoration: 'none', color: 'inherit' }}
                        onClick={(e) => {
                          // If route contains parameters, show info instead of navigating
                          if (module.route.includes('{')) {
                            e.preventDefault();
                            alert(`This PDF requires parameters:\n${module.route}\n\nPlease navigate from the relevant report page.`);
                          }
                        }}
                      >
                        <div
                          className="card h-100"
                          style={{
                            border: `2px solid ${module.color}`,
                            borderRadius: '10px',
                            transition: 'all 0.3s ease',
                            cursor: 'pointer',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-5px)';
                            e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                          }}
                        >
                          <div className="card-body">
                            <div className="d-flex align-items-center mb-3">
                              <div
                                style={{
                                  width: '50px',
                                  height: '50px',
                                  borderRadius: '10px',
                                  background: module.color,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  marginRight: '15px'
                                }}
                              >
                                <IconComponent size={24} color="white" />
                              </div>
                              <div className="flex-grow-1">
                                <h6 className="mb-1" style={{ color: '#212529', fontWeight: '600' }}>
                                  {module.title}
                                </h6>
                              </div>
                            </div>
                            <p className="text-muted mb-0" style={{ fontSize: '0.875rem' }}>
                              {module.description}
                            </p>
                            {module.route.includes('{') && (
                              <small className="text-info d-block mt-2">
                                <i>Requires parameters - access from report page</i>
                              </small>
                            )}
                          </div>
                          <div
                            className="card-footer"
                            style={{
                              background: `${module.color}15`,
                              borderTop: `1px solid ${module.color}40`,
                              borderRadius: '0 0 10px 10px'
                            }}
                          >
                            <div className="d-flex align-items-center justify-content-between">
                              <span style={{ fontSize: '0.75rem', color: module.color, fontWeight: '500' }}>
                                {category}
                              </span>
                              <Download size={16} color={module.color} />
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          <div className="mt-4 p-3" style={{ background: '#f8f9fa', borderRadius: '8px' }}>
            <h6 className="mb-2">Note:</h6>
            <ul className="mb-0" style={{ fontSize: '0.875rem', color: '#6c757d' }}>
              <li>Some PDF modules require specific parameters (meeting ID, department ID, status, etc.)</li>
              <li>For parameterized PDFs, navigate from the relevant report or detail page</li>
              <li>All PDFs are generated on-demand and can be downloaded or printed</li>
              <li>PDF generation may take a few moments depending on data size</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
