/**
 * Department Dashboard Page
 * EXACT replica of department/dashboard.blade.php from old CMDMS
 * Structure, classes, and behavior preserved exactly
 */

import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function Dashboard() {
  const { user, hasPermission, permissions } = useAuth();
  
  // Debug: Log permissions for Housing user (ID 31)
  if (user?.id === 31) {
    console.log('Housing User Dashboard - Permissions:', permissions);
    console.log('Has PTF permission:', hasPermission('department.ptf.index'));
    console.log('Has PTIs permission:', hasPermission('department.ptis.index'));
  }
  
  return (
    <div className="content-wrapper">
      <style>{`
        .moduleCard {
          padding: 20px;
          width: 100%;
          min-height: 180px;
          background-color: #fff;
          border-radius: 10px;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          border: 1px solid rgba(224, 230, 246, 1);
          transition: all 0.2s linear;
          margin-bottom: 20px;
          box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
        }
        .moduleCard.green {
          background-color: #247b2d;
        }
        .moduleCard.green h4 {
          color: #fff;
        }
        .moduleCard:hover {
          transform: scale(1.02);
        }
        .moduleCard h4 {
          font-size: 1rem;
          color: #000;
          text-align: center;
        }
        .moduleCard .imgdiv {
          width: 100%;
          height: 80px;
          margin-bottom: 10px;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 10px;
        }
        .moduleCard .imgdiv img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
        .moduleCard .imgdiv i {
          font-size: 60px !important;
          color: #3282FF !important;
        }
        .moduleCard .imgdiv svg {
          width: 60px !important;
          color: #fff !important;
        }
        .content-wrapper {
          background: linear-gradient(270deg, #f4fff3 0%, #fbfefc 100%) !important;
        }
      `}</style>
      
      <div className="row">
        {/* Greeting and Welcome Section - EXACT match with old CMDMS */}
        <div className="col-md-12 grid-margin">
          <div className="row align-items-center">
            <div className="">
              <h4 className="font-weight-bold mx-1">
                Hi, <span className="text-primary">{user?.name}</span> Welcome back!
              </h4>
            </div>
            <div className="text-center">
              <h4 className="font-weight-bold mx-1">
                <span className="text-success">{user?.department?.name ?? ''}</span> Department Dashboard
              </h4>
            </div>
            <div className="text-right">
              <h4 className="font-weight-normal mx-1">
                Khyber Pakhtunkhwa
              </h4>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Record Notes */}
        {hasPermission('department.recordnotes.list') && (
          <>
            <div className="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-12">
              <Link to="/department/record-notes" style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="moduleCard">
                  <div className="imgdiv">
                    <img 
                      src="/admin_assets/images/dashboard/cm-muhammad-sohail-afridi.jpg" 
                      alt="Record Notes" 
                    />
                  </div>
                  <h4>Record Notes</h4>
                </div>
              </Link>
            </div>
            
            {/* Cabinet Minutes */}
            <div className="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-12">
              <Link to="/department/record-notes?type=cabinet" style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="moduleCard">
                  <div className="imgdiv">
                    <img 
                      src="/admin_assets/images/dashboard/cm-muhammad-sohail-afridi.jpg" 
                      alt="Cabinet" 
                    />
                  </div>
                  <h4>Cabinet</h4>
                </div>
              </Link>
            </div>
          </>
        )}

        {/* CM Remarks */}
        {hasPermission('department.cmremarks.index') && (
          <div className="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-12">
            <Link to="/department/cm-remarks" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="moduleCard">
                <div className="imgdiv">
                  <img 
                    src="/admin_assets/images/dashboard/cm-muhammad-sohail-afridi.jpg" 
                    alt="CM Remarks" 
                  />
                </div>
                <h4>CM Remarks</h4>
              </div>
            </Link>
          </div>
        )}

        {/* Khushhal Programme */}
        {hasPermission('department.khushhal.task.list') && (
          <div className="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-12">
            <Link to="/department/khushhal-programme" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="moduleCard">
                <div className="imgdiv">
                  <img 
                    style={{ opacity: 'unset' }}
                    src="/admin_assets/images/dashboard/khushalkpkprograme.jpg" 
                    alt="Khushal Programme" 
                  />
                </div>
                <h4>Khushhaal Khyber Pakhtunkhwa Programme</h4>
              </div>
            </Link>
          </div>
        )}

        {/* Directives */}
        {hasPermission('department.directives.list') && (
          <div className="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-12">
            <Link to="/department/directives" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="moduleCard">
                <div className="imgdiv">
                  <img 
                    src="/admin_assets/images/dashboard/directive.jpg" 
                    alt="Directives" 
                  />
                </div>
                <h4>Directives / Correspondence</h4>
              </div>
            </Link>
          </div>
        )}

        {/* Sectoral Meetings */}
        {hasPermission('department.sectorial-meetings.list') && (
          <div className="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-12">
            <Link to="/department/sectorial-meetings" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="moduleCard">
                <div className="imgdiv">
                  <img 
                    src="/admin_assets/images/dashboard/sectorialmeeting-dummy.jpeg" 
                    alt="Sectoral Meetings" 
                  />
                </div>
                <h4>Sectoral Meetings</h4>
              </div>
            </Link>
          </div>
        )}

        {/* Announcements */}
        {hasPermission('department.announcements.list') && (
          <div className="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-12">
            <Link to="/department/announcements" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="moduleCard">
                <div className="imgdiv">
                  <img 
                    src="/admin_assets/images/dashboard/announcement-dummy.jpg" 
                    alt="Announcements" 
                  />
                </div>
                <h4>Announcements</h4>
              </div>
            </Link>
          </div>
        )}

        {/* PTF Dashboard */}
        {hasPermission('department.ptf.index') && (
          <div className="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-12">
            <Link to="/department/ptf" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="moduleCard">
                <div className="imgdiv">
                  <img 
                    src="/admin_assets/images/dashboard/sectorialmeeting-dummy.jpeg" 
                    alt="PTF" 
                  />
                </div>
                <h4>Provincial Task Force (PTF)</h4>
              </div>
            </Link>
          </div>
        )}

        {/* PTF Dashboard (Departments) */}
        {(hasPermission('department.ptf.departments.dashboard') || hasPermission('department.ptf.departments.index')) && (
          <div className="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-12">
            <Link to="/department/ptf/departments/dashboard" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="moduleCard">
                <div className="imgdiv">
                  <img 
                    src="/admin_assets/images/dashboard/sectorialmeeting-dummy.jpeg" 
                    alt="PTF" 
                  />
                </div>
                <h4>Provincial Task Force (PTF)</h4>
              </div>
            </Link>
          </div>
        )}

        {/* Board Meetings */}
        {hasPermission('department.board-meetings.list') && (
          <div className="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-12">
            <Link to="/department/board-meetings" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="moduleCard">
                <div className="imgdiv">
                  <img 
                    src="/admin_assets/images/dashboard/sectorialmeeting-dummy.jpeg" 
                    alt="Board Meetings" 
                  />
                </div>
                <h4>Boards Meetings</h4>
              </div>
            </Link>
          </div>
        )}

        {/* CM Initiatives Tracker - Always visible (external link) */}
        <div className="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-12">
          <a 
            href="https://docs.google.com/presentation/d/1IasOhWNW9JjefGabLRDG8WEWqdYmuEO5wr4CbM1NeTI/edit?usp=sharing"
            target="_blank"
            rel="noreferrer"
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <div className="moduleCard">
              <div className="imgdiv">
                <img 
                  src="/admin_assets/images/dashboard/sectorialmeeting-dummy.jpeg" 
                  alt="CM Initiatives Tracker" 
                />
              </div>
              <h4>CM Initiatives Tracker</h4>
            </div>
          </a>
        </div>

        {/* Senate Meetings */}
        {hasPermission('department.senate_meetings.index') && (
          <div className="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-12">
            <Link to="/department/senate_meetings" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="moduleCard">
                <div className="imgdiv">
                  <img 
                    src="/admin_assets/images/dashboard/sectorialmeeting-dummy.jpeg" 
                    alt="Senate Meetings" 
                  />
                </div>
                <h4>Senate Meetings</h4>
              </div>
            </Link>
          </div>
        )}

        {/* PTIs KP */}
        {hasPermission('department.ptis.index') && (
          <div className="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-12">
            <Link to="/department/ptis" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="moduleCard">
                <div className="imgdiv" style={{ fontSize: '60px' }}>
                  <i className="ti-list"></i>
                </div>
                <h4>Priority Transformation Initiatives KP</h4>
              </div>
            </Link>
          </div>
        )}

        {/* Summary Implementation Tasks */}
        {hasPermission('department.summaries.index') && (
          <div className="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-12">
            <Link to="/department/summaries" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="moduleCard">
                <div className="imgdiv" style={{ fontSize: '60px' }}>
                  <i className="ti-list-ol"></i>
                </div>
                <h4>Summary Implementation Tasks</h4>
              </div>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
