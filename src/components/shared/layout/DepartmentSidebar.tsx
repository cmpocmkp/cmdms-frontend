/**
 * Department Sidebar Component
 * EXACT replica of department/partials/sidebar.blade.php from old CMDMS
 * Structure, classes, and behavior preserved exactly
 */

import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { cn } from '../../../utils/cn';

export function DepartmentSidebar() {
  const location = useLocation();
  const { user, hasPermission, permissions } = useAuth();
  
  // Debug: Log permissions for Housing user (ID 31)
  if (user?.id === 31) {
    console.log('Housing User Permissions:', permissions);
    console.log('Has PTF permission:', hasPermission('department.ptf.index'));
    console.log('Has PTIs permission:', hasPermission('department.ptis.index'));
  }
  
  // Helper to check if route is active
  const isActive = (path: string) => {
    const pathname = location.pathname;
    const search = location.search;
    
    // Special handling for record-notes (check query param for cabinet)
    if (path === '/department/record-notes' && search === '?type=cabinet') {
      return false; // This is cabinet minutes, not record notes
    }
    if (path === '/department/record-notes' && search !== '?type=cabinet') {
      return pathname === path && search !== '?type=cabinet';
    }
    
    return pathname === path || pathname.startsWith(path + '/');
  };
  
  return (
    <nav className="sidebar sidebar-offcanvas" id="sidebar">
      {/* Department Name Header */}
      <div className="text-white text-center bg-dark pl-1 py-2">
        {user?.department?.name ?? 'Department'}
      </div>
      
      <ul className="nav">
        {/* Dashboard */}
        <li className={cn("nav-item", isActive('/department/dashboard') && 'active')}>
          <Link className="nav-link" to="/department/dashboard">
            <i className="ti-home menu-icon"></i>
            <span className="menu-title">Dashboard</span>
          </Link>
        </li>
        
        {/* Record Notes */}
        {hasPermission('department.recordnotes.list') && (
          <>
            <li className={cn(
              "nav-item",
              isActive('/department/record-notes') && location.search !== '?type=cabinet' && 'active'
            )}>
              <Link className="nav-link" to="/department/record-notes">
                <i className="ti-notepad menu-icon"></i>
                <span className="menu-title">Record Notes</span>
              </Link>
            </li>
            
            {/* Cabinet Minutes */}
            <li className={cn(
              "nav-item",
              isActive('/department/record-notes') && location.search === '?type=cabinet' && 'active'
            )}>
              <Link className="nav-link" to="/department/record-notes?type=cabinet">
                <i className="ti-envelope menu-icon"></i>
                <span className="menu-title">Cabinet Minutes</span>
              </Link>
            </li>
          </>
        )}
        
        {/* CM Remarks */}
        {hasPermission('department.cmremarks.index') && (
          <li className={cn(
            "nav-item",
            (isActive('/department/cm-remarks') || location.pathname.startsWith('/department/replies/')) && 'active'
          )}>
            <Link className="nav-link" to="/department/cm-remarks">
              <i className="ti-list menu-icon"></i>
              <span className="menu-title">CM Remarks</span>
            </Link>
          </li>
        )}
        
        {/* Khushhal Programme */}
        {hasPermission('department.khushhal.task.list') && (
          <li className={cn(
            "nav-item",
            (location.pathname.startsWith('/department/khushhal-programme') || location.pathname.startsWith('/department/replies/')) && 'active'
          )}>
            <Link className="nav-link" to="/department/khushhal-programme">
              <i className="fa fa-group fa-md pr-3"></i>
              <span className="menu-title">Khushhal Programme</span>
            </Link>
          </li>
        )}
        
        {/* Add KPI Data - Khushhal Programme */}
        {hasPermission('department.khushhal-programme.create') && (
          <li className={cn(
            "nav-item",
            location.pathname.startsWith('/department/khushhal-programme/add/kpis/data') && 'active'
          )}>
            <Link className="nav-link" to="/department/khushhal-programme/add/kpis/data">
              <i className="fa fa-group fa-md pr-3"></i>
              <span className="menu-title">Add Kpi Data <br /> Khushhal Programme</span>
            </Link>
          </li>
        )}
        
        {/* Show KPI Data - Khushhal Programme */}
        {hasPermission('department.khushhal-programme.show') && (
          <li className={cn(
            "nav-item",
            location.pathname.startsWith('/department/khushhal-programme/show/kpis/data') && 'active'
          )}>
            <Link className="nav-link" to="/department/khushhal-programme/show/kpis/data">
              <i className="fa fa-group fa-md pr-3"></i>
              <span className="menu-title">Show Kpi Data <br /> Khushhal Programme</span>
            </Link>
          </li>
        )}
        
        {/* Sectoral Meetings */}
        {hasPermission('department.sectorial-meetings.list') && (
          <li className={cn(
            "nav-item",
            (location.pathname.startsWith('/department/sectorial-meetings') || location.pathname.startsWith('/department/replies/')) && 'active'
          )}>
            <Link className="nav-link" to="/department/sectorial-meetings">
              <i className="ti-notepad menu-icon"></i>
              <span className="menu-title">Sectoral Meetings</span>
            </Link>
          </li>
        )}
        
        {/* Announcements */}
        {hasPermission('department.announcements.list') && (
          <li className={cn(
            "nav-item",
            (location.pathname.startsWith('/department/announcements') || location.pathname.startsWith('/department/announcement-replies/')) && 'active'
          )}>
            <Link className="nav-link" to="/department/announcements">
              <i className="ti-announcement menu-icon"></i>
              <div className="menu-title-container">
                <span className="menu-title">Announcements</span>
              </div>
            </Link>
          </li>
        )}
        
        {/* Directives */}
        {hasPermission('department.directives.list') && (
          <li className={cn(
            "nav-item",
            (location.pathname.startsWith('/department/directives') || location.pathname.startsWith('/department/directive-replies/')) && 'active'
          )}>
            <Link className="nav-link" to="/department/directives">
              <i className="ti-agenda menu-icon"></i>
              <span className="menu-title">Directives</span>
            </Link>
          </li>
        )}
        
        {/* PTF Dashboard */}
        {hasPermission('department.ptf.index') && (
          <li className={cn("nav-item", location.pathname === '/department/ptf' && 'active')}>
            <Link className="nav-link" to="/department/ptf">
              <i className="ti-list menu-icon"></i>
              <span className="menu-title">PTF Dashboard</span>
            </Link>
          </li>
        )}
        
        {/* Create New PTF Issue */}
        {hasPermission('department.ptf.create-issue') && (
          <li className={cn("nav-item", location.pathname === '/department/ptf/create-issue' && 'active')}>
            <Link className="nav-link" to="/department/ptf/create-issue">
              <i className="ti-bell menu-icon"></i>
              <span className="menu-title">Create New PTF Issue</span>
            </Link>
          </li>
        )}
        
        {/* PTF Dashboard (Departments) */}
        {(hasPermission('department.ptf.departments.dashboard') || hasPermission('department.ptf.departments.index')) && (
          <li className={cn("nav-item", location.pathname === '/department/ptf/departments/dashboard' && 'active')}>
            <Link className="nav-link" to="/department/ptf/departments/dashboard">
              <i className="ti-list menu-icon"></i>
              <span className="menu-title">PTF Dashboard</span>
            </Link>
          </li>
        )}
        
        {/* Boards Meetings */}
        {hasPermission('department.board-meetings.list') && (
          <li className={cn(
            "nav-item",
            location.pathname.startsWith('/department/board-meetings') && 'active'
          )}>
            <Link className="nav-link" to="/department/board-meetings">
              <i className="ti-notepad menu-icon"></i>
              <span className="menu-title">Boards Meetings</span>
            </Link>
          </li>
        )}
        
        {/* Senate Meetings */}
        {hasPermission('department.senate_meetings.index') && (
          <li className={cn(
            "nav-item",
            location.pathname.startsWith('/department/senate_meetings') && 'active'
          )}>
            <Link className="nav-link" to="/department/senate_meetings">
              <i className="ti-list menu-icon"></i>
              <span className="menu-title">Senate Meetings</span>
            </Link>
          </li>
        )}
        
        {/* PTIs KP */}
        {hasPermission('department.ptis.index') && (
          <li className={cn(
            "nav-item",
            location.pathname.startsWith('/department/ptis') && 'active'
          )}>
            <Link className="nav-link" to="/department/ptis">
              <i className="ti-list menu-icon"></i>
              <span className="menu-title">PTIs KP</span>
            </Link>
          </li>
        )}
        
        {/* Summary Implementation Tasks */}
        {hasPermission('department.summaries.index') && (
          <li className={cn(
            "nav-item",
            location.pathname.startsWith('/department/summaries') && 'active'
          )}>
            <Link className="nav-link" to="/department/summaries">
              <i className="ti-list menu-icon"></i>
              <span className="menu-title">Summary Implementation Tasks</span>
            </Link>
          </li>
        )}
        
      </ul>
    </nav>
  );
}


