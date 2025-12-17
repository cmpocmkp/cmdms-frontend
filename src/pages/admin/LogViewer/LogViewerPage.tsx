/**
 * Log Viewer Page - Admin Module
 * This is a Laravel package interface (arcanedev/log-viewer)
 * In the old CMDMS, it's accessed at /log-viewer and is a third-party package UI
 */

export default function LogViewerPage() {
  return (
    <div className="content-wrapper">
      <div className="card">
        <div className="card-body">
          <h4 className="card-title mb-4">
            <i className="ti-files mr-2"></i>
            System Log Viewer
          </h4>
          
          <div className="alert alert-info" role="alert">
            <h5 className="alert-heading">
              <i className="ti-info-alt mr-2"></i>
              Laravel Package Interface
            </h5>
            <p className="mb-2">
              The Log Viewer is a Laravel package (<strong>arcanedev/log-viewer</strong>) that provides 
              a web interface to view and analyze application logs.
            </p>
            <hr />
            <p className="mb-2">
              <strong>Features:</strong>
            </p>
            <ul className="mb-3">
              <li>View application logs by date and level (emergency, alert, critical, error, warning, notice, info, debug)</li>
              <li>Search and filter logs</li>
              <li>Download log files</li>
              <li>Delete old log files</li>
            </ul>
            <p className="mb-0">
              <strong>Note:</strong> This interface will be available once the backend Laravel application is integrated. 
              The Log Viewer package runs independently on the server side.
            </p>
          </div>

          <div className="card mt-4" style={{ borderLeft: '4px solid #3282FF' }}>
            <div className="card-body">
              <h6 className="card-title">
                <i className="ti-link mr-2"></i>
                Access Information
              </h6>
              <p className="mb-2">
                <strong>URL:</strong> <code>/log-viewer</code>
              </p>
              <p className="mb-2">
                <strong>Package:</strong> <code>arcanedev/log-viewer</code>
              </p>
              <p className="mb-0">
                <strong>Status:</strong> <span className="badge badge-warning">Pending Backend Integration</span>
              </p>
            </div>
          </div>

          <div className="mt-4 text-center">
            <button 
              className="btn btn-outline-secondary" 
              disabled
              title="Available after backend integration"
            >
              <i className="ti-lock mr-2"></i>
              Open Log Viewer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
