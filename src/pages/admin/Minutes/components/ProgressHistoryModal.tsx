/**
 * Progress History Modal Component
 * Shows progress so far history details
 */

interface ProgressHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  progressHistory: string;
}

export function ProgressHistoryModal({ isOpen, onClose, progressHistory }: ProgressHistoryModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex={-1}>
      <div className="modal-dialog modal-md">
        <div className="modal-content" style={{ backgroundColor: '#fff' }}>
          <div className="modal-header" style={{ padding: '15px 27px' }}>
            <h5 className="modal-title">Progress so far history by SO</h5>
            <button type="button" className="close" onClick={onClose}>
              <span>&times;</span>
            </button>
          </div>

          <div className="modal-body" style={{ padding: '10px 26px' }}>
            <div className="row">
              <div className="col-md-12">
                <div className="px-3" style={{ margin: 'auto', width: '80%', padding: '10px' }}>
                  <div dangerouslySetInnerHTML={{ __html: progressHistory || 'No progress history available.' }} />
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            &nbsp;
          </div>
        </div>
      </div>
    </div>
  );
}
