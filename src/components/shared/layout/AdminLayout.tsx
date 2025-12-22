/**
 * Admin Layout Component
 * EXACT replica of admin/layout/default.blade.php structure
 */

import { Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import { useUIStore } from '../../../store/uiStore';

export default function AdminLayout() {
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
          <Sidebar />
          <div className="main-panel">
            <div className="content-wrapper">
              <Outlet />
            </div>
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
}

