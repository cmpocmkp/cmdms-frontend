/**
 * Navbar Component
 * EXACT replica of admin/partials/navbar.blade.php from old CMDMS
 */

import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { useUIStore } from '../../../store/uiStore';
import { NotificationPanel } from './NotificationPanel';

export function Navbar() {
  const { user, logout } = useAuth();
  const { unreadCount, toggleSidebar, toggleNotificationPanel } = useUIStore();
  const navigate = useNavigate();
  
  const handleLogout = (e: React.FormEvent) => {
    e.preventDefault();
    logout();
    navigate('/login');
  };

  const handleNotificationClick = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleNotificationPanel();
  };

  const handleSidebarToggle = () => {
    toggleSidebar();
  };
  
  return (
    <>
    <nav className="navbar col-lg-12 col-12 p-0 fixed-top d-flex flex-row">
      <div className="text-center navbar-brand-wrapper d-flex align-items-center justify-content-center">
        <Link className="navbar-brand brand-logo" to="/admin/dashboard">
          <img
            src="/admin_assets/images/CMDMSminilogo.png"
            className="mr-2"
            alt="logo"
          />
        </Link>
        <Link className="navbar-brand brand-logo-mini" to="/admin/dashboard">
          <img
            src="/admin_assets/images/CMDMSminilogo.png"
            alt="logo"
          />
        </Link>
      </div>
      
      <div className="navbar-menu-wrapper d-flex align-items-center justify-content-end">
        <button 
          className="navbar-toggler navbar-toggler align-self-center" 
          type="button" 
          data-toggle="minimize"
          onClick={handleSidebarToggle}
        >
          <span className="ti-layout-grid2"></span>
        </button>
        
        <ul className="navbar-nav mr-lg-2" style={{ margin: '0 auto' }}>
          <li className="nav-item nav-search d-lg-block">
            <div className="input-group">
              <div className="hover-cursor" id="navbar-search-icon">
                <h3 
                  className="text-center"
                  style={{
                    color: '#17c653',
                    fontSize: '28px',
                    margin: 0,
                    padding: 0,
                    fontWeight: 400
                  }}
                >
                  CMDMS
                </h3>
                <span>Chief Minister's Decision Monitoring System</span>
              </div>
            </div>
          </li>
        </ul>
        
        <ul className="navbar-nav navbar-nav-right">
          {/* Notifications Bell */}
          <li className="nav-item nav-settings d-lg-flex" id="cmdms-counter-list-section" style={{ marginRight: '30px' }}>
            <a 
              className="btn btn-rounded btn-icon nav-link count-indicator" 
              href="#" 
              title="Notifications"
              style={{ background: '#c9ccd7' }}
              onClick={handleNotificationClick}
            >
              <i style={{ paddingTop: '8px' }} className="fa fa-bell text-dark mx-0"></i>
              {unreadCount > 0 && (
                <div 
                  id="cms-notification-counter"
                  style={{
                    color: '#ffffff',
                    backgroundColor: '#cb112d',
                    fontWeight: 700,
                    position: 'relative',
                    left: '18px',
                    top: '-35px',
                    borderRadius: '10rem',
                    fontSize: '12px !important',
                    border: 'unset',
                    padding: unreadCount > 9 ? '3px 4px 4px 3px' : '3px 6px 4px 6px'
                  }}
                  className="badge badge-danger"
                >
                  {unreadCount}
                </div>
              )}
            </a>
          </li>
          
          {/* User Profile Dropdown */}
          <li className="nav-item nav-profile dropdown">
            <a 
              className="nav-link dropdown-toggle" 
              href="#" 
              data-toggle="dropdown" 
              id="profileDropdown"
              style={{ color: '#656565' }}
            >
              <i className="fa fa-user-circle fa-lg"></i>Settings
            </a>
            <div className="dropdown-menu dropdown-menu-right navbar-dropdown" aria-labelledby="profileDropdown">
              <a className="dropdown-item">
                <i className="ti-user text-primary"></i>
                {user?.name}
              </a>
              
              {user?.role_id === 1 ? (
                <Link className="dropdown-item" to="/admin/users">
                  <i className="ti-settings text-primary"></i>
                  Settings
                </Link>
              ) : (
                <Link className="dropdown-item" to={`/admin/users/edit/${user?.id}`}>
                  <i className="ti-settings text-primary"></i>
                  Settings
                </Link>
              )}
              
              <a 
                className="dropdown-item" 
                href="#"
                onClick={handleLogout}
              >
                <i className="ti-power-off text-primary"></i>
                Logout
              </a>
            </div>
          </li>
        </ul>
        
        <button 
          className="navbar-toggler navbar-toggler-right d-lg-none align-self-center" 
          type="button"
          data-toggle="offcanvas"
          onClick={handleSidebarToggle}
        >
          <span className="ti-layout-grid2"></span>
        </button>
      </div>
    </nav>

    {/* Notification Panel (Right Sidebar) */}
    <NotificationPanel />
    </>
  );
}

