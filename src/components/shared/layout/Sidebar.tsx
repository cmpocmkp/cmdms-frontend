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
  
  // Nested submenu states for Reports section
  const [reportBoardsMenuOpen, setReportBoardsMenuOpen] = useState(location.pathname.startsWith('/admin/report/board'));
  
  // Helper to check if route is active
  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/');
  
  // Permission and role helpers
  const hasPermission = (permission: string) => {
    if (user?.role_id === 1) return true; // Admin has all
    // CS users (role_id === 5) should ONLY have access to cs.csdashboard permission
    if (user?.role_id === 5) {
      return permission === 'cs.csdashboard'; // CS users only have dashboard access
    }
    // CM users (role_id === 4) have access to most admin permissions (same as Admin and Data Entry in old CMDMS)
    if (user?.role_id === 4) {
      return true; // CM users have access to all admin modules (permission-based filtering will be added later)
    }
    if (user?.role?.role_name === 'data-entry') return true; // Data Entry has permissions
    return true; // For now, allow all (mock)
  };
  
  
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
          
          {/* Admin Menu - CS users (role_id === 5) should NOT see this */}
          {/* Priority Modules Only: Minutes, Directives, Announcements, Summaries for CM, Trackers, Inaugurations, Boards, MNA/MPA */}
          {user?.role_id !== 5 && (hasPermission('admin.recordnotes.departments') ||
            hasPermission('admin.announcements.list') ||
            hasPermission('admin.directives.list') ||
            hasPermission('admin.boardmeetings.index') ||
            hasPermission('admin.summaries.index') ||
            hasPermission('admin.interventions.index') ||
            hasPermission('admin.inaugurations.index') ||
            hasPermission('admin.candidaterequests.index')) && (
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
                  
                  {/* Users */}
                  {user?.id === 1 && hasPermission('admin.users.list') && (
                    <li className={cn("nav-item", isActive('/admin/users') && 'active')}>
                      <Link className="nav-link" to="/admin/users">
                        <span className="menu-title">Users</span>
                      </Link>
                    </li>
                  )}
                  
                  {/* Priority Modules */}
                  
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
                        <span className="menu-title">Tracker / Flagship Projects</span>
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
                  
                  {/* Boards / Council Submenu */}
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
                        <span className="menu-title">Boards / Council</span>
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
                  
                  {/* MNA/MPA Requests */}
                  {hasPermission('admin.candidaterequests.index') && (
                    <li className={cn("nav-item", isActive('/admin/candidaterequests') && 'active')}>
                      <Link className="nav-link" to="/admin/candidaterequests">
                        <span className="menu-title">MNA/MPA Requests</span>
                      </Link>
                    </li>
                  )}
                  
                </ul>
              </div>
            </li>
          )}
          
          {/* Reports Menu - CS users (role_id === 5) should NOT see this */}
          {/* Priority Reports Only: Cabinet and Boards */}
          {user?.role_id !== 5 && (hasPermission('admin.report.cabinet.meetings') || hasPermission('admin.report.boardmeetings')) && (
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
                  
                  {/* Priority Reports Only: Cabinet and Boards */}
                  
                  {/* Cabinet */}
                  {hasPermission('admin.report.cabinet.meetings') && (
                    <li className={cn("nav-item", isActive('/admin/report/cabinet-meetings') && 'active')}>
                      <Link className="nav-link" to="/admin/report/cabinet-meetings">Cabinet</Link>
                    </li>
                  )}
                  
                  {/* Boards / Council Submenu */}
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
                        <span className="menu-title">Boards / Council</span>
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
                  
                </ul>
              </div>
            </li>
          )}
          
        </ul>
      </nav>
    </>
  );
}

