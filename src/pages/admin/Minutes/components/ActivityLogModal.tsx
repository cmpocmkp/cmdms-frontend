/**
 * Activity Log Modal Component
 * Shows weekly change log for decision
 */

interface ActivityLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  decisionId: number;
  logs: any[];
}

export function ActivityLogModal({ isOpen, onClose, decisionId: _decisionId, logs }: ActivityLogModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex={-1}>
      <div className="modal-dialog modal-md">
        <div className="modal-content" style={{ backgroundColor: '#fff' }}>
          <div className="modal-header">
            <h5 className="modal-title">Weekly Change Log for Decision</h5>
            <button type="button" className="close" onClick={onClose}>
              <span>&times;</span>
            </button>
          </div>

          <div className="modal-body">
            {logs && logs.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-bordered table-sm">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>User</th>
                      <th>Action</th>
                      <th>Changes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map((log, index) => (
                      <tr key={index}>
                        <td>{new Date(log.date).toLocaleDateString('en-GB')}</td>
                        <td>{log.user}</td>
                        <td>
                          <span className={`badge ${
                            log.action === 'created' ? 'badge-success' :
                            log.action === 'updated' ? 'badge-info' :
                            'badge-secondary'
                          }`}>
                            {log.action}
                          </span>
                        </td>
                        <td>{log.changes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-muted text-center py-4">No activity logs available for this decision.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
