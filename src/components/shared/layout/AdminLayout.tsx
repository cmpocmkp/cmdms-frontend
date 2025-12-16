/**
 * Admin Layout Component
 * EXACT replica of admin/layout/default.blade.php structure
 */

import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';

export default function AdminLayout() {
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

