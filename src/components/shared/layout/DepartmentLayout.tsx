/**
 * Department Layout Component
 * Same structure as AdminLayout (old CMDMS uses same layout for both)
 */

import { Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import { Navbar } from './Navbar';
import { DepartmentSidebar } from './DepartmentSidebar';
import { DepartmentFooter } from './DepartmentFooter';
import { useUIStore } from '../../../store/uiStore';

export default function DepartmentLayout() {
  const { sidebarCollapsed } = useUIStore();

  // Apply sidebar-icon-only class to body element when sidebar is collapsed
  // This matches the old CMDMS behavior where template.js toggles this class
  useEffect(() => {
    const body = document.body;
    if (sidebarCollapsed) {
      body.classList.add('sidebar-icon-only');
    } else {
      body.classList.remove('sidebar-icon-only');
    }

    // Cleanup on unmount
    return () => {
      body.classList.remove('sidebar-icon-only');
    };
  }, [sidebarCollapsed]);

  return (
    <div className="container-scroller">
      <div id="app">
        <Navbar />
        <div className="container-fluid page-body-wrapper">
          <DepartmentSidebar />
          <div className="main-panel">
            <div className="content-wrapper">
              <Outlet />
            </div>
            <DepartmentFooter />
          </div>
        </div>
      </div>
    </div>
  );
}

