/**
 * Sidebar Component
 * EXACT replica of admin/partials/sidebar.blade.php from old CMDMS
 * Structure, classes, and behavior preserved exactly
 */

import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { cn } from '../../../utils/cn';

export function Sidebar() {
  const location = useLocation();
  const { user } = useAuth();
  
  // Main menu states - START OPEN FOR DEBUGGING
  const [adminMenuOpen, setAdminMenuOpen] = useState(true);
  const [reportsMenuOpen, setReportsMenuOpen] = useState(true);
  
  // Debug: Log state changes
  useEffect(() => {
    console.log('🔍 Sidebar State Update:', { adminMenuOpen, reportsMenuOpen });
  }, [adminMenuOpen, reportsMenuOpen]);
  
  // Nested submenu states for Admin section
  const [boardsMenuOpen, setBoardsMenuOpen] = useState(location.pathname.startsWith('/admin/board'));
  const [fundsDistMenuOpen, setFundsDistMenuOpen] = useState(
    location.pathname.startsWith('/admin/funds/annualschemes') || 
    location.pathname.startsWith('/admin/funds/distributions') || 
    location.pathname.startsWith('/admin/candidate/distributed-fund')
  );
  
  // Nested submenu states for Reports section
  const [reportBoardsMenuOpen, setReportBoardsMenuOpen] = useState(location.pathname.startsWith('/admin/report/board'));
  const [summariesMenuOpen, setSummariesMenuOpen] = useState(location.pathname.startsWith('/admin/report/summaries'));
  const [ptfMenuOpen, setPtfMenuOpen] = useState(
    location.pathname.startsWith('/admin/report/ptf') || 
    location.pathname.startsWith('/admin/ptfs')
  );
  
  // Helper to check if route is active
  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/');
  
  // Permission and role helpers
  const hasPermission = (_permission: string) => {
    if (user?.role_id === 1) return true; // Admin has all
    if (user?.role_id === 5) return true; // CS has permissions
    if (user?.role?.role_name === 'data-entry') return true; // Data Entry has permissions
    return true; // For now, allow all (mock)
  };
  
  const isAdmin = () => user?.role_id === 1;
  const isDataEntry = () => user?.role?.role_name === 'data-entry';
  const isAdminOrDataEntry = () => isAdmin() || isDataEntry();
  
  return (
    <>
      <style>{`
        .thirdItem .thirdul {
          list-style-type: none !important;
          display: none;
          padding-left: 10px !important;
        }
        .thirdItem:hover .thirdul {
          display: block;
        }
        .thirdItem a i {
          margin-left: auto;
          margin-right: 0;
          transition: all 0.2s linear;
        }
        .thirdItem:hover a i {
          transform: rotate(90deg);
        }
        
        /* FORCE collapse divs to be visible - MAXIMUM PRIORITY */
        .sidebar .nav .nav-item .collapse.show,
        #ui-administer.show,
        #reports-submenu.show {
          display: block !important;
          visibility: visible !important;
          opacity: 1 !important;
          height: auto !important;
          max-height: none !important;
          overflow: visible !important;
        }
        
        /* Force sub-menu UL to be visible */
        .sidebar .nav .nav-item .collapse.show .sub-menu {
          display: block !important;
          visibility: visible !important;
        }
        
        /* Override any conflicting Bootstrap collapse */
        .collapse.show {
          display: block !important;
        }
      `}</style>
      
      <nav className="sidebar sidebar-offcanvas" id="sidebar">
        <ul className="nav">
          
          {/* Dashboard */}
          {user?.role_id !== 5 && hasPermission('admin.dashboard') && (
            <li className={cn(
              "nav-item",
              isActive('/admin/dashboard') && 'active'
            )}>
              <Link className="nav-link" to="/admin/dashboard">
                <i className="ti-home menu-icon"></i>
                <span className="menu-title">Dashboard</span>
              </Link>
            </li>
          )}
          
          {/* CS Dashboard */}
          {user?.role_id === 5 && hasPermission('cs.csdashboard') && (
            <li className="nav-item">
              <Link className="nav-link" to="/cs/dashboard">
                <i className="ti-home menu-icon"></i>
                <span className="menu-title">Dashboard</span>
              </Link>
            </li>
          )}
          
          {/* Admin Menu */}
          {(hasPermission('admin.users.list') || 
            hasPermission('admin.department.index') ||
            hasPermission('admin.recordnotes.departments') ||
            hasPermission('admin.announcements.list') ||
            hasPermission('admin.directives.list') ||
            hasPermission('admin.sectorialmeetings.index') ||
            hasPermission('admin.boardmeetings.index') ||
            hasPermission('admin.ptis.index') ||
            hasPermission('admin.summaries.index') ||
            hasPermission('admin.interventions.index') ||
            hasPermission('admin.cmremarks.index') ||
            hasPermission('admin.khushhalkpk.index')) && (
            <li className={cn(
              "nav-item",
              location.pathname.startsWith('/admin/') && 
              !location.pathname.startsWith('/admin/report/') &&
              !location.pathname.startsWith('/admin/ptfs/') && 'active'
            )}>
              <a 
                className="nav-link" 
                data-toggle="collapse" 
                href="#ui-administer"
                aria-expanded={adminMenuOpen}
                aria-controls="ui-administer"
                onClick={(e) => {
                  e.preventDefault();
                  console.log('Admin clicked! Current state:', adminMenuOpen, 'New state will be:', !adminMenuOpen);
                  setAdminMenuOpen(!adminMenuOpen);
                }}
              >
                <i className="ti-settings menu-icon"></i>
                <span className="menu-title">Admin</span>
                <i className="menu-arrow"></i>
              </a>
              <div 
                className={cn("collapse", adminMenuOpen && 'show')} 
                id="ui-administer"
                style={{ display: adminMenuOpen ? 'block' : 'none' }}
                data-state={adminMenuOpen ? 'open' : 'closed'}
              >
                <ul className="nav flex-column sub-menu">
                  
                  {/* Log Viewer - Only for user ID 1 */}
                  {user?.id === 1 && (
                    <li className="nav-item">
                      <Link className="nav-link" to="/admin/log-viewer">
                        <span className="menu-title">Log Viewer</span>
                      </Link>
                    </li>
                  )}
                  
                  {/* Users */}
                  {user?.id === 1 && hasPermission('admin.users.list') && (
                    <li className={cn("nav-item", isActive('/admin/users') && 'active')}>
                      <Link className="nav-link" to="/admin/users">
                        <span className="menu-title">Users</span>
                      </Link>
                    </li>
                  )}
                  
                  {/* Export Users */}
                  {user?.id === 1 && hasPermission('admin.userExport') && (
                    <li className={cn("nav-item", isActive('/admin/users/export') && 'active')}>
                      <Link className="nav-link" to="/admin/users/export">
                        <span className="menu-title">Export Users</span>
                      </Link>
                    </li>
                  )}
                  
                  {/* Activity Logs */}
                  {user?.id === 1 && hasPermission('admin.activitylogs.index') && (
                    <li className={cn("nav-item", isActive('/admin/activitylogs') && 'active')}>
                      <Link className="nav-link" to="/admin/activitylogs">
                        <span className="menu-title">Users Activity Logs</span>
                      </Link>
                    </li>
                  )}
                  
                  {/* Tags */}
                  {user?.id === 1 && hasPermission('admin.tags.index') && (
                    <li className={cn("nav-item", isActive('/admin/tags') && 'active')}>
                      <Link className="nav-link" to="/admin/tags">
                        <span className="menu-title">Tags</span>
                      </Link>
                    </li>
                  )}
                  
                  {/* Departments */}
                  {user?.id === 1 && hasPermission('admin.department.index') && (
                    <li className={cn("nav-item", isActive('/admin/departments') && 'active')}>
                      <Link className="nav-link" to="/admin/departments">
                        <span className="menu-title">Departments</span>
                      </Link>
                    </li>
                  )}
                  
                  {/* Record Notes / Minutes */}
                  {hasPermission('admin.recordnotes.departments') && (
                    <li className={cn(
                      "nav-item", 
                      (isActive('/admin/recordnotes') || isActive('/admin/report/minutes-detail')) && 'active'
                    )}>
                      <Link className="nav-link" to="/admin/recordnotes">
                        <span className="menu-title">Minutes</span>
                      </Link>
                    </li>
                  )}
                  
                  {/* Directives */}
                  {hasPermission('admin.directives.list') && (
                    <li className={cn("nav-item", isActive('/admin/directives') && 'active')}>
                      <Link className="nav-link" to="/admin/directives">
                        <span className="menu-title">Directives</span>
                      </Link>
                    </li>
                  )}
                  
                  {/* Announcements */}
                  {hasPermission('admin.announcements.list') && (
                    <li className={cn("nav-item", isActive('/admin/announcements') && 'active')}>
                      <Link className="nav-link" to="/admin/announcements">
                        <span className="menu-title">Announcements</span>
                      </Link>
                    </li>
                  )}
                  
                  {/* PTIs KP */}
                  {hasPermission('admin.ptis.index') && (
                    <li className={cn("nav-item", isActive('/admin/ptis') && 'active')}>
                      <Link className="nav-link" to="/admin/ptis">
                        <span className="menu-title">PTIs KP</span>
                      </Link>
                    </li>
                  )}
                  
                  {/* Summaries for CM */}
                  {hasPermission('admin.summaries.index') && (
                    <li className={cn("nav-item", isActive('/admin/summaries') && 'active')}>
                      <Link className="nav-link" to="/admin/summaries">
                        <span className="menu-title">Summaries for CM</span>
                      </Link>
                    </li>
                  )}
                  
                  {/* Trackers (Interventions) */}
                  {hasPermission('admin.interventions.index') && (
                    <li className={cn("nav-item", isActive('/admin/trackers') && 'active')}>
                      <Link className="nav-link" to="/admin/trackers">
                        <span className="menu-title">Trackers</span>
                      </Link>
                    </li>
                  )}
                  
                  {/* CM Remarks */}
                  {hasPermission('admin.cmremarks.index') && (
                    <li className={cn("nav-item", isActive('/admin/cmremarks') && 'active')}>
                      <Link className="nav-link" to="/admin/cmremarks">
                        <span className="menu-title">CM Remarks</span>
                      </Link>
                    </li>
                  )}
                  
                  {/* Inaugurations */}
                  {hasPermission('admin.inaugurations.index') && (
                    <li className={cn("nav-item", isActive('/admin/inaugurations') && 'active')}>
                      <Link className="nav-link" to="/admin/inaugurations">
                        <span className="menu-title">Inaugurations</span>
                      </Link>
                    </li>
                  )}
                  
                  {/* Sectoral Meetings */}
                  {hasPermission('admin.sectorialmeetings.index') && (
                    <li className={cn(
                      "nav-item", 
                      (isActive('/admin/sectorialmeetings') || isActive('/admin/sectorialagendapoints')) && 'active'
                    )}>
                      <Link className="nav-link" to="/admin/sectorialmeetings">
                        <span className="menu-title">Sectoral Meetings</span>
                      </Link>
                    </li>
                  )}
                  
                  {/* All Schemes */}
                  {hasPermission('admin.schemes.index') && (
                    <li className={cn("nav-item", isActive('/admin/schemes') && 'active')}>
                      <Link className="nav-link" to="/admin/schemes">
                        <span className="menu-title">All Schemes</span>
                      </Link>
                    </li>
                  )}
                  
                  {/* Board Meetings Submenu */}
                  {hasPermission('admin.boardmeetings.index') && (
                    <li className={cn("nav-item", isActive('/admin/board') && 'active')}>
                      <a 
                        className="nav-link" 
                        data-toggle="collapse" 
                        href="#boards-submenu"
                        aria-expanded={boardsMenuOpen}
                        aria-controls="boards-submenu"
                        onClick={(e) => { 
                          e.preventDefault(); 
                          setBoardsMenuOpen(!boardsMenuOpen);
                        }}
                      >
                        <span className="menu-title">Boards</span>
                        <i className="menu-arrow"></i>
                      </a>
                      <div 
                        className={cn("collapse", boardsMenuOpen && 'show')} 
                        id="boards-submenu"
                        style={{ display: boardsMenuOpen ? 'block' : 'none' }}
                      >
                        <ul className="nav flex-column sub-menu">
                          <li className={cn("nav-item", isActive('/admin/boardmeetings') && 'active')}>
                            <Link className="nav-link" to="/admin/boardmeetings">Meetings</Link>
                          </li>
                          {hasPermission('admin.boardacts.index') && (
                            <li className={cn("nav-item", isActive('/admin/boardacts') && 'active')}>
                              <Link className="nav-link" to="/admin/boardacts">Acts</Link>
                            </li>
                          )}
                          {hasPermission('admin.boardmembers.index') && (
                            <li className={cn("nav-item", isActive('/admin/boardmembers') && 'active')}>
                              <Link className="nav-link" to="/admin/boardmembers">Members</Link>
                            </li>
                          )}
                        </ul>
                      </div>
                    </li>
                  )}
                  
                  {/* Funds Distribution Submenu */}
                  {hasPermission('admin.annualschemes.index') && (
                    <li className={cn(
                      "nav-item",
                      (isActive('/admin/funds/annualschemes') || isActive('/admin/funds/distributions') || isActive('/admin/candidate/distributed-fund')) && 'active'
                    )}>
                      <a 
                        className="nav-link" 
                        data-toggle="collapse" 
                        href="#funds-dist-submenu"
                        aria-expanded={fundsDistMenuOpen}
                        aria-controls="funds-dist-submenu"
                        onClick={(e) => { 
                          e.preventDefault(); 
                          setFundsDistMenuOpen(!fundsDistMenuOpen);
                        }}
                      >
                        <span className="menu-title">Funds Distribution</span>
                        <i className="menu-arrow"></i>
                      </a>
                      <div 
                        className={cn("collapse", fundsDistMenuOpen && 'show')} 
                        id="funds-dist-submenu"
                        style={{ display: fundsDistMenuOpen ? 'block' : 'none' }}
                      >
                        <ul className="nav flex-column sub-menu">
                          <li className={cn("nav-item", isActive('/admin/funds/annualschemes') && 'active')}>
                            <Link className="nav-link" to="/admin/funds/annualschemes">Annual Schemes</Link>
                          </li>
                          {hasPermission('admin.distributed.schemes') && (
                            <li className={cn("nav-item", isActive('/admin/funds/distributions/distributed-schemes') && 'active')}>
                              <Link className="nav-link" to="/admin/funds/distributions/distributed-schemes">Distributed Schemes</Link>
                            </li>
                          )}
                          {hasPermission('admin.candidate.distributed.fund.report') && (
                            <li className={cn("nav-item", isActive('/admin/candidate/distributed-fund/report') && 'active')}>
                              <Link className="nav-link" to="/admin/candidate/distributed-fund/report">Candidate Report</Link>
                            </li>
                          )}
                        </ul>
                      </div>
                    </li>
                  )}
                  
                  {/* Review Meetings */}
                  {hasPermission('admin.reviewmeetings.index') && (
                    <li className={cn("nav-item", isActive('/admin/reviewmeetings') && 'active')}>
                      <Link className="nav-link" to="/admin/reviewmeetings">
                        <span className="menu-title">Review Meetings</span>
                      </Link>
                    </li>
                  )}
                  
                  {/* MNA/MPA Requests */}
                  {hasPermission('admin.candidaterequests.index') && (
                    <li className={cn("nav-item", isActive('/admin/candidaterequests') && 'active')}>
                      <Link className="nav-link" to="/admin/candidaterequests">
                        <span className="menu-title">MNA/MPA Requests</span>
                      </Link>
                    </li>
                  )}
                  
                  {/* Officer Departments */}
                  {hasPermission('admin.officerdepartments.index') && (
                    <li className={cn("nav-item", isActive('/admin/officerdepartments') && 'active')}>
                      <Link className="nav-link" to="/admin/officerdepartments">
                        <span className="menu-title">Officer Departments</span>
                      </Link>
                    </li>
                  )}
                  
                  {/* Officers */}
                  {hasPermission('admin.officers.index') && (
                    <li className={cn("nav-item", isActive('/admin/officers') && 'active')}>
                      <Link className="nav-link" to="/admin/officers">
                        <span className="menu-title">Officers</span>
                      </Link>
                    </li>
                  )}
                  
                  {/* Candidates */}
                  {hasPermission('admin.candidates.index') && (
                    <li className={cn("nav-item", isActive('/admin/candidates') && 'active')}>
                      <Link className="nav-link" to="/admin/candidates">
                        <span className="menu-title">Candidates</span>
                      </Link>
                    </li>
                  )}
                  
                  {/* MNA/MPA Posting Recommendation */}
                  {hasPermission('admin.posting.recommendation.index') && (
                    <li className={cn("nav-item", isActive('/admin/mna-mpa/posting/recommendation') && 'active')}>
                      <Link className="nav-link" to="/admin/mna-mpa/posting/recommendation">
                        <span className="menu-title">MNA/MPA Posting<br /> Recommendation</span>
                      </Link>
                    </li>
                  )}
                  
                  {/* Khushhal Khyber Pakhtunkhwa */}
                  {hasPermission('admin.khushhalkpk.index') && (
                    <li className={cn("nav-item", isActive('/admin/khushhalkpk') && 'active')}>
                      <Link className="nav-link" to="/admin/khushhalkpk">
                        <span className="menu-title">Khushhal <br /> Khyber Pakhtunkhwa</span>
                      </Link>
                    </li>
                  )}
                  
                </ul>
              </div>
            </li>
          )}
          
          {/* Reports Menu */}
          {hasPermission('admin.report.department-wise') && (
            <li className={cn(
              "nav-item",
              (isActive('/admin/report') || isActive('/admin/ptfs')) && 'active'
            )}>
              <a 
                className="nav-link" 
                data-toggle="collapse" 
                href="#reports-submenu"
                aria-expanded={reportsMenuOpen}
                aria-controls="reports-submenu"
                onClick={(e) => {
                  e.preventDefault();
                  setReportsMenuOpen(!reportsMenuOpen);
                }}
              >
                <i className="ti-bar-chart-alt menu-icon"></i>
                <span className="menu-title">Reports</span>
                <i className="menu-arrow"></i>
              </a>
              <div 
                className={cn("collapse", reportsMenuOpen && 'show')} 
                id="reports-submenu"
                style={{ display: reportsMenuOpen ? 'block' : 'none' }}
              >
                <ul className="nav flex-column sub-menu">
                  
                  {/* Cabinet */}
                  {hasPermission('admin.report.cabinet.meetings') && (
                    <li className={cn("nav-item", isActive('/admin/report/cabinet-meetings') && 'active')}>
                      <Link className="nav-link" to="/admin/report/cabinet-meetings">Cabinet</Link>
                    </li>
                  )}
                  
                  {/* Cabinet Department-wise */}
                  {hasPermission('admin.report.department.wise.cabinet.meeting.decisions') && (
                    <li className={cn("nav-item", isActive('/admin/report/department-wise/cabinet-meeting/decisions') && 'active')}>
                      <Link className="nav-link" to="/admin/report/department-wise/cabinet-meeting/decisions">
                        Cabinet<br /> Department-wise
                      </Link>
                    </li>
                  )}
                  
                  {/* Boards Submenu */}
                  {hasPermission('admin.report.boardmeetings') && (
                    <li className={cn("nav-item", isActive('/admin/report/board') && 'active')}>
                      <a 
                        className="nav-link" 
                        data-toggle="collapse" 
                        href="#reports-boards-submenu"
                        aria-expanded={reportBoardsMenuOpen}
                        aria-controls="reports-boards-submenu"
                        onClick={(e) => { 
                          e.preventDefault(); 
                          setReportBoardsMenuOpen(!reportBoardsMenuOpen);
                        }}
                      >
                        <span className="menu-title">Boards</span>
                        <i className="menu-arrow"></i>
                      </a>
                      <div 
                        className={cn("collapse", reportBoardsMenuOpen && 'show')} 
                        id="reports-boards-submenu"
                        style={{ display: reportBoardsMenuOpen ? 'block' : 'none' }}
                      >
                        <ul className="nav flex-column sub-menu">
                          <li className={cn("nav-item", isActive('/admin/report/board/meetings') && 'active')}>
                            <Link className="nav-link" to="/admin/report/board/meetings">Meetings</Link>
                          </li>
                          {hasPermission('admin.report.boardacts') && (
                            <li className={cn("nav-item", isActive('/admin/report/board/acts') && 'active')}>
                              <Link className="nav-link" to="/admin/report/board/acts">Acts</Link>
                            </li>
                          )}
                        </ul>
                      </div>
                    </li>
                  )}
                  
                  {/* CM Initiatives Tracker */}
                  <li className="nav-item">
                    <a 
                      className="nav-link"
                      href="https://docs.google.com/presentation/d/1IasOhWNW9JjefGabLRDG8WEWqdYmuEO5wr4CbM1NeTI/edit?usp=sharing"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <span className="menu-title">CM Initiatives Tracker</span>
                    </a>
                  </li>
                  
                  {/* Summaries for CM Submenu */}
                  {(hasPermission('admin.report.summaries.summary') || hasPermission('admin.report.summaries.detail')) && (
                    <li className={cn("nav-item", isActive('/admin/report/summaries') && 'active')}>
                      <a 
                        className="nav-link" 
                        data-toggle="collapse" 
                        href="#summaries-report-submenu"
                        aria-expanded={summariesMenuOpen}
                        aria-controls="summaries-report-submenu"
                        onClick={(e) => { 
                          e.preventDefault(); 
                          setSummariesMenuOpen(!summariesMenuOpen);
                        }}
                      >
                        <span className="menu-title">Summaries for CM</span>
                        <i className="menu-arrow"></i>
                      </a>
                      <div 
                        className={cn("collapse", summariesMenuOpen && 'show')} 
                        id="summaries-report-submenu"
                        style={{ display: summariesMenuOpen ? 'block' : 'none' }}
                      >
                        <ul className="nav flex-column sub-menu">
                          {hasPermission('admin.report.summaries.summary') && (
                            <li className={cn("nav-item", isActive('/admin/report/summaries/summary') && 'active')}>
                              <Link className="nav-link" to="/admin/report/summaries/summary">Summary</Link>
                            </li>
                          )}
                          {hasPermission('admin.report.summaries.detail') && (
                            <li className={cn("nav-item", isActive('/admin/report/summaries/detail') && 'active')}>
                              <Link className="nav-link" to="/admin/report/summaries/detail">Detail</Link>
                            </li>
                          )}
                        </ul>
                      </div>
                    </li>
                  )}
                  
                  {/* Inaugurations */}
                  {hasPermission('admin.report.inaugurations') && (
                    <li className={cn("nav-item", isActive('/admin/report/inaugurations') && 'active')}>
                      <Link className="nav-link" to="/admin/report/inaugurations">Inaugurations</Link>
                    </li>
                  )}
                  
                  {/* Review Meetings */}
                  {hasPermission('admin.report.review.meetings') && (
                    <li className={cn("nav-item", isActive('/admin/report/review-meetings') && 'active')}>
                      <Link className="nav-link" to="/admin/report/review-meetings">Review Meetings</Link>
                    </li>
                  )}
                  
                  {/* Review Meetings By DS */}
                  {hasPermission('admin.report.ds.wise.review.meetings') && (
                    <li className={cn("nav-item", isActive('/admin/report/ds-wise-review-meetings') && 'active')}>
                      <Link className="nav-link" to="/admin/report/ds-wise-review-meetings">
                        Review Meetings<br />By DS
                      </Link>
                    </li>
                  )}
                  
                  {/* Khushhaal Khyber Pakhtunkhwa */}
                  {hasPermission('admin.report.khushhalkpk.tasks') && (
                    <li className={cn("nav-item", isActive('/admin/report/khushhalkpk-tasks') && 'active')}>
                      <Link className="nav-link" to="/admin/report/khushhalkpk-tasks">
                        Khushhaal<br /> Khyber Pakhtunkhwa
                      </Link>
                    </li>
                  )}
                  
                  {/* KPi Data Reports */}
                  {hasPermission('admin.kpidata.index') && (
                    <li className={cn("nav-item", isActive('/admin/kpidata') && 'active')}>
                      <Link className="nav-link" to="/admin/kpidata">
                        <span className="menu-title">KPi Data Reports</span>
                      </Link>
                    </li>
                  )}
                  
                  {/* DC KPIs Data Filter */}
                  {hasPermission('admin.kpidata.show') && (
                    <li className={cn("nav-item", isActive('/admin/kpidata/show') && 'active')}>
                      <Link className="nav-link" to="/admin/kpidata/show">
                        <span className="menu-title">DC KPIs Data Filter</span>
                      </Link>
                    </li>
                  )}
                  
                  {/* DPOs KPIs Data Filter */}
                  {hasPermission('admin.kpidata.dpos') && (
                    <li className={cn("nav-item", isActive('/admin/kpidata/dpos') && 'active')}>
                      <Link className="nav-link" to="/admin/kpidata/dpos">
                        <span className="menu-title">DPOs KPIs Data Filter</span>
                      </Link>
                    </li>
                  )}
                  
                  {/* Departments KPIs Data Filter */}
                  {hasPermission('admin.kpidata.department') && (
                    <li className={cn("nav-item", isActive('/admin/kpidata/departments') && 'active')}>
                      <Link className="nav-link" to="/admin/kpidata/departments">
                        <span className="menu-title">Departments KPIs <br /> Data Filter</span>
                      </Link>
                    </li>
                  )}
                  
                  {/* DC Inspection Details */}
                  {hasPermission('admin.report.dc.inspection') && (
                    <li className={cn("nav-item", isActive('/admin/report/dc-inspection') && 'active')}>
                      <Link className="nav-link" to="/admin/report/dc-inspection">DC Inspection Details</Link>
                    </li>
                  )}
                  
                  {/* PMRU */}
                  {hasPermission('admin.report.pmru.meetings') && (
                    <li className={cn("nav-item", isActive('/admin/report/pmru-meetings') && 'active')}>
                      <Link className="nav-link" to="/admin/report/pmru-meetings">PMRU</Link>
                    </li>
                  )}
                  
                  {/* Filter Record Notes */}
                  {hasPermission('admin.report.filter.recordnotes') && (
                    <li className={cn("nav-item", isActive('/admin/report/filter-recordnotes') && 'active')}>
                      <Link className="nav-link" to="/admin/report/filter-recordnotes">Filter Record Notes</Link>
                    </li>
                  )}
                  
                  {/* PTF Module Submenu */}
                  {hasPermission('admin.cm.ptf.index') && (
                    <li className={cn(
                      "nav-item",
                      (isActive('/admin/report/ptf') || isActive('/admin/ptfs')) && 'active'
                    )}>
                      <a 
                        className="nav-link" 
                        data-toggle="collapse" 
                        href="#ptf-report-submenu"
                        aria-expanded={ptfMenuOpen}
                        aria-controls="ptf-report-submenu"
                        onClick={(e) => { 
                          e.preventDefault(); 
                          setPtfMenuOpen(!ptfMenuOpen);
                        }}
                      >
                        <span className="menu-title">PTF Module</span>
                        <i className="menu-arrow"></i>
                      </a>
                      <div 
                        className={cn("collapse", ptfMenuOpen && 'show')} 
                        id="ptf-report-submenu"
                        style={{ display: ptfMenuOpen ? 'block' : 'none' }}
                      >
                        <ul className="nav flex-column sub-menu">
                          <li className={cn("nav-item", isActive('/admin/report/ptf/index') && 'active')}>
                            <Link className="nav-link" to="/admin/report/ptf/index">Dashboard</Link>
                          </li>
                          {hasPermission('admin.cm.ptf.meetings') && (
                            <li className={cn("nav-item", isActive('/admin/report/ptf/meetings') && 'active')}>
                              <Link className="nav-link" to="/admin/report/ptf/meetings">Meetings</Link>
                            </li>
                          )}
                          {hasPermission('admin.cm.ptf.report.departmentwise') && (
                            <li className={cn("nav-item", isActive('/admin/report/ptf/department-wise') && 'active')}>
                              <Link className="nav-link" to="/admin/report/ptf/department-wise">
                                Department Wise <br /> Report
                              </Link>
                            </li>
                          )}
                          {hasPermission('admin.cm.ptf.report.districtwise') && (
                            <li className={cn("nav-item", isActive('/admin/report/ptf/district-wise') && 'active')}>
                              <Link className="nav-link" to="/admin/report/ptf/district-wise">
                                District Wise <br /> Report
                              </Link>
                            </li>
                          )}
                          {hasPermission('admin.cm.ptf.report.districtdetail') && (
                            <li className={cn("nav-item", isActive('/admin/ptfs/report-district-detail') && 'active')}>
                              <Link className="nav-link" to="/admin/ptfs/report-district-detail">
                                District Detail <br /> Report 1
                              </Link>
                            </li>
                          )}
                          {hasPermission('admin.cm.ptf.report.districtlatest') && (
                            <li className={cn("nav-item", isActive('/admin/ptfs/report-district-latest') && 'active')}>
                              <Link className="nav-link" to="/admin/ptfs/report-district-latest">
                                District Wise <br /> Report (Latest)
                              </Link>
                            </li>
                          )}
                        </ul>
                      </div>
                    </li>
                  )}
                  
                  {/* Recordnotes Updates - Only for user ID 1 */}
                  {user?.id === 1 && hasPermission('admin.report.recordnotes.updates') && (
                    <>
                      <li className={cn("nav-item", isActive('/admin/report/recordnotes-updates') && 'active')}>
                        <Link className="nav-link" to="/admin/report/recordnotes-updates">
                          <span className="menu-title">Recordnotes Updates</span>
                        </Link>
                      </li>
                      <li className={cn("nav-item", isActive('/admin/report/recordnotes-comparision') && 'active')}>
                        <Link className="nav-link" to="/admin/report/recordnotes-comparision">
                          <span className="menu-title">Recordnotes Comparision</span>
                        </Link>
                      </li>
                    </>
                  )}
                  
                </ul>
              </div>
            </li>
          )}
          
          {/* External Links - OUTSIDE Reports section */}
          {(isAdminOrDataEntry() || user?.role_id === 3) && (
            <>
              {/* Good Governance Roadmap */}
              {hasPermission('admin.good.governance.roadmap.link') && (
                <li className="nav-item">
                  <a 
                    className="nav-link" 
                    href="https://ipms.kpdata.gov.pk/guardian/users/bypass-login?rt=ggrm"
                    id="loginLink"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span className="menu-title">Good Governance<br /> Roadmap</span>
                  </a>
                </li>
              )}
              
              {/* CM DSD Visit */}
              {hasPermission('admin.cm.dsd.visit.link') && (
                <li className="nav-item">
                  <a 
                    className="nav-link" 
                    href="https://ipms.kpdata.gov.pk/guardian/users/bypass-login?rt=dsd"
                    id="loginLink"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span className="menu-title">CM DSD Visit</span>
                  </a>
                </li>
              )}
              
              {/* Ekhteyar Aawam Ka */}
              {hasPermission('admin.ekhtyar.awamka.link') && (
                <li className="nav-item">
                  <a 
                    className="nav-link" 
                    href="javascript:void(0)"
                    id="loginLink"
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.preventDefault()}
                  >
                    <span className="menu-title">Ekhteyar Aawam Ka</span>
                  </a>
                </li>
              )}
            </>
          )}
          
        </ul>
      </nav>
    </>
  );
}

