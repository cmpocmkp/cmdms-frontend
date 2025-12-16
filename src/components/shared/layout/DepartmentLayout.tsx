/**
 * Department Layout Component
 * Same structure as AdminLayout (old CMDMS uses same layout for both)
 */

import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';

export default function DepartmentLayout() {
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

