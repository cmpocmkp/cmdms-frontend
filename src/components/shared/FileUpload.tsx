/**
 * File Upload Component
 * Reusable component for file uploads across modules
 * Integrated with real API following API_INTEGRATION_GUIDE.md
 * 
 * Usage:
 * <FileUpload
 *   attachableType="minute"
 *   attachableId={123}
 *   onUploadSuccess={(file) => console.log('Uploaded:', file)}
 *   onUploadError={(error) => console.error('Error:', error)}
 *   multiple={true}
 *   accept=".pdf,.doc,.docx,.jpg,.png"
 * />
 */

import { useState, useRef } from 'react';
import * as fileService from '../../lib/services/fileService';
import { USE_MOCK_DATA } from '../../lib/api';

interface FileUploadProps {
  attachableType: string; // e.g., 'minute', 'directive', 'announcement'
  attachableId: number; // ID of the entity this file is attached to
  onUploadSuccess?: (file: fileService.FileData) => void;
  onUploadError?: (error: string) => void;
  multiple?: boolean;
  accept?: string; // e.g., ".pdf,.doc,.docx"
  maxSize?: number; // Max file size in bytes (default: 25MB)
  disabled?: boolean;
  label?: string;
  className?: string;
}

export default function FileUpload({
  attachableType,
  attachableId,
  onUploadSuccess,
  onUploadError,
  multiple = false,
  accept = '.pdf,.doc,.docx,.jpg,.jpeg,.png,.txt,.csv,.xlsx,.xls',
  maxSize = 25 * 1024 * 1024, // 25MB default
  disabled = false,
  label = 'Attach Documents',
  className = '',
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    // Validate file sizes
    const oversizedFiles = files.filter(file => file.size > maxSize);
    if (oversizedFiles.length > 0) {
      const errorMsg = `File size exceeds ${Math.round(maxSize / (1024 * 1024))}MB: ${oversizedFiles.map(f => f.name).join(', ')}`;
      setError(errorMsg);
      if (onUploadError) {
        onUploadError(errorMsg);
      }
      return;
    }

    setSelectedFiles(files);
    setError(null);

    // Auto-upload files when selected
    if (files.length > 0) {
      uploadFiles(files);
    }
  };

  const uploadFiles = async (files: File[]) => {
    setUploading(true);
    setError(null);

    try {
      if (USE_MOCK_DATA) {
        // Mock upload
        const mockFiles: fileService.FileData[] = files.map((file, index) => ({
          id: Date.now() + index,
          originalName: file.name,
          fileName: `mock_${Date.now()}_${file.name}`,
          filePath: `uploads/mock/${file.name}`,
          mimeType: file.type,
          size: file.size,
          url: URL.createObjectURL(file),
          attachableType,
          attachableId,
        }));

        // Simulate upload delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        mockFiles.forEach(file => {
          if (onUploadSuccess) {
            onUploadSuccess(file);
          }
        });

        setSelectedFiles([]);
      } else {
        // Real API uploads - upload each file
        const uploadPromises = files.map(async (file) => {
          return fileService.uploadFile(
            {
              file,
              attachableType,
              attachableId,
            },
            (progress) => {
              setUploadProgress(progress);
            }
          );
        });

        const results = await Promise.all(uploadPromises);

        // Handle results
        results.forEach((result) => {
          if (result.success && result.data) {
            if (onUploadSuccess) {
              onUploadSuccess(result.data);
            }
          } else {
            const errorMsg = result.message || 'Failed to upload file';
            setError(errorMsg);
            if (onUploadError) {
              onUploadError(errorMsg);
            }
          }
        });

        setSelectedFiles([]);
        setUploadProgress(0);
      }
    } catch (err: any) {
      console.error('Error uploading files:', err);
      const errorMsg = err.response?.data?.error?.message || 'Failed to upload files. Please try again.';
      setError(errorMsg);
      if (onUploadError) {
        onUploadError(errorMsg);
      }
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleBrowseClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className={`form-group ${className}`}>
      <label>{label}{!disabled && <small> (optional)</small>}</label>
      <input
        ref={fileInputRef}
        type="file"
        className="file-upload-default"
        multiple={multiple}
        accept={accept}
        onChange={handleFileSelect}
        disabled={disabled || uploading}
        style={{ display: 'none' }}
      />
      <div className="input-group col-xs-12">
        <input
          type="text"
          className="form-control file-upload-info"
          disabled
          placeholder={uploading ? 'Uploading...' : 'Upload files'}
          value={
            uploading
              ? `Uploading... ${uploadProgress}%`
              : selectedFiles.length > 0
              ? `${selectedFiles.length} file(s) selected`
              : ''
          }
        />
        <span className="input-group-append">
          <button
            className="file-upload-browse btn btn-success"
            type="button"
            onClick={handleBrowseClick}
            disabled={disabled || uploading}
          >
            {uploading ? (
              <>
                <span className="spinner-border spinner-border-sm mr-1" role="status" aria-hidden="true"></span>
                Uploading...
              </>
            ) : (
              'Select Files'
            )}
          </button>
        </span>
      </div>
      {error && (
        <div className="alert alert-danger mt-2" role="alert" style={{ padding: '0.5rem', marginTop: '0.5rem' }}>
          <small>{error}</small>
        </div>
      )}
      {maxSize && (
        <small className="form-text text-muted">
          Max file size: {Math.round(maxSize / (1024 * 1024))}MB. Accepted formats: {accept}
        </small>
      )}
    </div>
  );
}

