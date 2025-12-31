/**
 * Department PTF Dashboard Page
 * EXACT replica of department/ptf/index.blade.php from old CMDMS
 * Structure, classes, and behavior preserved exactly
 */

import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { generateMockPTFIssues } from '../../lib/mocks/data/ptfIssuesData';
import { useMemo } from 'react';

export default function PTFDashboard() {
  const { user } = useAuth();
  
  // Get all PTF issues for the current department
  const ptfIssues = useMemo(() => {
    if (!user?.department?.id) return [];
    const departmentId = typeof user.department.id === 'number' 
      ? user.department.id 
      : Number(user.department.id);
    return generateMockPTFIssues(null, null, departmentId);
  }, [user?.department?.id]);
  
  // Calculate counts by status
  const totalIssues = ptfIssues.length;
  const pendingIssues = ptfIssues.filter(issue => issue.status === 0).length;
  const openApprovedIssues = ptfIssues.filter(issue => issue.status === 1).length;
  const notApprovedIssues = ptfIssues.filter(issue => issue.status === 2).length;
  const completedIssues = ptfIssues.filter(issue => issue.status === 3).length;
  
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
        .moduleCard:hover {
          transform: scale(1.02);
        }
        .moduleCard h4 {
          font-size: 1rem;
          color: #000;
          text-align: center;
          margin-top: 10px;
        }
        .moduleCard .imgdiv {
          width: 100%;
          height: 80px;
          margin-bottom: 10px;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          padding: 10px;
        }
        .moduleCard .imgdiv img {
          margin-bottom: 5px;
        }
        .moduleCard .imgdiv img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
        .content-wrapper {
          background: linear-gradient(270deg, #f4fff3 0%, #fbfefc 100%) !important;
        }
      `}</style>
      
      <div className="row">
        <div className="col-md-12">
          <Link 
            to="/department/ptf/create-issue" 
            className="pull-right btn btn-primary"
            style={{ float: 'right' }}
          >
            <i className="fa fa-add"></i> Create New Issue
          </Link>
        </div>
      </div>
      
      <div className="row mt-4">
        {/* Total Issues */}
        <div className="col-md-4">
          <Link to="/department/ptf/list-issue" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="moduleCard">
              <div className="imgdiv">
                <img src="/ptf_assets/list.svg" alt="Total Issues" />
                Total Issues
              </div>
              <h4>{totalIssues}</h4>
            </div>
          </Link>
        </div>
        
        {/* Pending Issues */}
        <div className="col-md-4">
          <Link to="/department/ptf/list-issue?status=0" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="moduleCard">
              <div className="imgdiv">
                <img src="/ptf_assets/pending.svg" alt="Pending Issues" />
                Pending Issues
              </div>
              <h4>{pendingIssues}</h4>
            </div>
          </Link>
        </div>
        
        {/* Open / Approved */}
        <div className="col-md-4">
          <Link to="/department/ptf/list-issue?status=1" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="moduleCard">
              <div className="imgdiv">
                <img src="/ptf_assets/progress.svg" alt="Open / Approved" />
                Open / Approved
              </div>
              <h4>{openApprovedIssues}</h4>
            </div>
          </Link>
        </div>
        
        {/* Not Approved */}
        <div className="col-md-4">
          <Link to="/department/ptf/list-issue?status=2" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="moduleCard">
              <div className="imgdiv">
                <img src="/ptf_assets/rejected.svg" alt="Not Approved" />
                Not Approved
              </div>
              <h4>{notApprovedIssues}</h4>
            </div>
          </Link>
        </div>
        
        {/* Completed */}
        <div className="col-md-4">
          <Link to="/department/ptf/list-issue?status=3" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="moduleCard">
              <div className="imgdiv">
                <img src="/ptf_assets/green.svg" alt="Completed" />
                Completed
              </div>
              <h4>{completedIssues}</h4>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

