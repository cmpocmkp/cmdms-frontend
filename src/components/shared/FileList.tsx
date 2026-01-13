/**
 * File List Component
 * Reusable component for displaying attached files
 * Integrated with real API following API_INTEGRATION_GUIDE.md
 * 
 * Usage:
 * <FileList
 *   files={filesArray}
 *   onDelete={(fileId) => console.log('Delete:', fileId)}
 *   onDownload={(file) => console.log('Download:', file)}
 * />
 */

import { useState } from 'react';
import * as fileService from '../../lib/services/fileService';

interface FileListProps {
  files: fileService.FileData[];
  onDelete?: (fileId: number) => void;
  onDownload?: (file: fileService.FileData) => void;
  showActions?: boolean;
  className?: string;
}

export default function FileList({
  files,
  onDelete,
  onDownload,
  showActions = true,
  className = '',
}: FileListProps) {
  const [deleting, setDeleting] = useState<number | null>(null);

  const handleDelete = async (file: fileService.FileData) => {
    if (!window.confirm(`Are you sure you want to delete "${file.originalName}"?`)) {
      return;
    }

    try {
      setDeleting(file.id);

      if (onDelete) {
        await onDelete(file.id);
      } else {
        // Default delete behavior
        await fileService.deleteFile(file.id);
      }

      // Optionally refresh or remove from list
    } catch (error: any) {
      console.error('Error deleting file:', error);
      alert('Failed to delete file. Please try again.');
    } finally {
      setDeleting(null);
    }
  };

  const handleDownload = async (file: fileService.FileData) => {
    try {
      if (onDownload) {
        onDownload(file);
      } else {
        // Default download behavior
        await fileService.downloadFile(file);
      }
    } catch (error: any) {
      console.error('Error downloading file:', error);
      alert('Failed to download file. Please try again.');
    }
  };

  const handlePreview = (file: fileService.FileData) => {
    const previewUrl = fileService.getFilePreviewUrl(file);
    window.open(previewUrl, '_blank');
  };

  if (files.length === 0) {
    return (
      <div className={`mt-3 ${className}`}>
        <p className="text-muted mb-0">No files attached</p>
      </div>
    );
  }

  return (
    <div className={`uploaded_file_div mt-3 ${className}`}>
      <h6 className="mb-2">Attached Files ({files.length})</h6>
      <div className="list-group">
        {files.map((file) => {
          const iconClass = fileService.getFileIcon(file.mimeType);
          const fileSize = fileService.formatFileSize(file.size);

          return (
            <div
              key={file.id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <div className="d-flex align-items-center">
                <i className={`${iconClass} mr-2`} style={{ fontSize: '1.2rem' }}></i>
                <div>
                  <strong>{file.originalName}</strong>
                  <br />
                  <small className="text-muted">
                    {fileSize} • {file.mimeType}
                  </small>
                </div>
              </div>
              {showActions && (
                <div className="btn-group" role="group">
                  {file.mimeType.startsWith('image/') || file.mimeType === 'application/pdf' ? (
                    <button
                      type="button"
                      className="btn btn-sm btn-info"
                      onClick={() => handlePreview(file)}
                      title="Preview"
                    >
                      <i className="ti-eye"></i>
                    </button>
                  ) : null}
                  <button
                    type="button"
                    className="btn btn-sm btn-secondary"
                    onClick={() => handleDownload(file)}
                    title="Download"
                  >
                    <i className="ti-download"></i>
                  </button>
                  {onDelete && (
                    <button
                      type="button"
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(file)}
                      disabled={deleting === file.id}
                      title="Delete"
                    >
                      {deleting === file.id ? (
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      ) : (
                        <i className="ti-trash"></i>
                      )}
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

