/**
 * CS (Chief Secretary) Dashboard Page
 * EXACT replica of admin/cs/dashboard.blade.php from old CMDMS
 * Structure, classes, and behavior preserved exactly
 * 
 * Note: 'record_notes' label translates to 'Minutes' in the UI
 * Minutes card is clickable and links to report pages
 * CS users have access to dashboard, minutes card, and minutes report pages
 * CS users do NOT have access to other sidebar menus (only Dashboard)
 */

import { Link } from 'react-router-dom';

export default function CSDashboard() {
  return (
    <div className="content-wrapper">
      <div className="row">
        <div className="col-12">
          <div className="row portfolio-grid">
            <div className="col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
              <Link 
                className="nav-link" 
                to="/cs/report/all-record-notes"
              >
                <figure>
                  <img 
                    style={{ 
                      opacity: 'unset',
                      borderRadius: '50%',
                      width: '200px',
                      height: '200px',
                      objectFit: 'cover',
                      display: 'block',
                      margin: '0 auto'
                    }} 
                    src="/admin_assets/images/dashboard/recordnotes.png.jfif" 
                    alt="Minutes" 
                    onError={(e) => {
                      // Fallback if image doesn't exist - show placeholder
                      const img = e.target as HTMLImageElement;
                      img.style.display = 'none';
                      const placeholder = document.createElement('div');
                      placeholder.style.cssText = 'width: 200px; height: 200px; border-radius: 50%; background: #f0f0f0; display: flex; align-items: center; justify-content: center; border: 2px dashed #ccc; margin: 0 auto;';
                      placeholder.innerHTML = '<i class="ti-file" style="font-size: 48px; color: #999;"></i>';
                      img.parentElement?.appendChild(placeholder);
                    }}
                  />
                </figure>
              </Link>
              <center>
                <Link 
                  className="nav-link" 
                  to="/cs/report/all-record-notes"
                >
                  <h4 className="text-primary">Minutes</h4>
                </Link>
              </center>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

