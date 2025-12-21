/**
 * Navbar Component
 * EXACT replica of admin/partials/navbar.blade.php from old CMDMS
 */

import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { useUIStore } from '../../../store/uiStore';
import { NotificationPanel } from './NotificationPanel';

export function Navbar() {
  const { user, logout } = useAuth();
  const { unreadCount, toggleSidebar, toggleNotificationPanel } = useUIStore();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLLIElement>(null);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);
  
  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    logout();
    navigate('/login');
  };

  const handleSettingsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setDropdownOpen(false);
    // Navigate to settings page
    if (user?.role_id === 1) {
      navigate('/admin/users');
    } else {
      navigate(`/admin/settings`);
    }
  };

  const toggleDropdown = (e: React.MouseEvent) => {
    e.preventDefault();
    setDropdownOpen(!dropdownOpen);
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
    <style>{`
      .nav-profile.dropdown.show .dropdown-menu {
        display: block !important;
      }
      .dropdown-menu {
        min-width: 200px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      }
      .dropdown-item {
        padding: 10px 20px;
        display: flex;
        align-items: center;
      }
      .dropdown-item:hover {
        background-color: #f8f9fa;
      }
      .dropdown-item i,
      .dropdown-item svg {
        margin-right: 8px;
      }
      .dropdown-divider {
        margin: 5px 0;
      }
      .nav-item.nav-settings {
        display: flex !important;
        align-items: center;
        justify-content: center;
      }
      .nav-item.nav-settings .nav-link {
        display: flex !important;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        padding: 0 !important;
        position: relative;
      }
      .nav-item.nav-settings .nav-link i {
        margin: 0 !important;
        padding: 0 !important;
        line-height: 1;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      #cms-notification-counter {
        position: absolute !important;
        top: -8px;
        right: -8px;
        left: auto !important;
        top: -8px !important;
      }
    `}</style>
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
              style={{ 
                background: '#c9ccd7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40px',
                height: '40px',
                padding: 0,
                position: 'relative'
              }}
              onClick={handleNotificationClick}
            >
              <i className="fa fa-bell text-dark" style={{ 
                margin: 0,
                padding: 0,
                lineHeight: 1,
                fontSize: '18px'
              }}></i>
              {unreadCount > 0 && (
                <div 
                  id="cms-notification-counter"
                  style={{
                    color: '#ffffff',
                    backgroundColor: '#cb112d',
                    fontWeight: 700,
                    position: 'absolute',
                    top: '-8px',
                    right: '-8px',
                    borderRadius: '10rem',
                    fontSize: '12px',
                    border: 'unset',
                    minWidth: '18px',
                    height: '18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: unreadCount > 9 ? '3px 4px' : '3px 6px',
                    lineHeight: 1
                  }}
                  className="badge badge-danger"
                >
                  {unreadCount}
                </div>
              )}
            </a>
          </li>
          
          {/* User Profile Dropdown */}
          <li 
            ref={dropdownRef}
            className={`nav-item nav-profile dropdown ${dropdownOpen ? 'show' : ''}`}
          >
            <a 
              className="nav-link dropdown-toggle" 
              href="#" 
              id="profileDropdown"
              style={{ color: '#656565', cursor: 'pointer' }}
              onClick={toggleDropdown}
              aria-expanded={dropdownOpen}
            >
              <i className="fa fa-user-circle fa-lg"></i>Settings
            </a>
            <div 
              className={`dropdown-menu dropdown-menu-right navbar-dropdown ${dropdownOpen ? 'show' : ''}`}
              aria-labelledby="profileDropdown"
              style={{
                position: 'absolute',
                right: 0,
                top: '100%',
                zIndex: 1000,
                display: dropdownOpen ? 'block' : 'none'
              }}
            >
              <a className="dropdown-item" style={{ cursor: 'default', pointerEvents: 'none' }}>
                <i className="ti-user text-primary"></i>
                {user?.name}
              </a>
              
              <a 
                className="dropdown-item" 
                href="#"
                onClick={handleSettingsClick}
                style={{ cursor: 'pointer' }}
              >
                <i className="ti-settings text-primary"></i>
                Settings
              </a>
              
              <div className="dropdown-divider"></div>
              
              <a 
                className="dropdown-item" 
                href="#"
                onClick={handleLogout}
                style={{ cursor: 'pointer' }}
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

