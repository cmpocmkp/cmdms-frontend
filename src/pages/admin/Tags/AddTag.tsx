/**
 * Add Tag Form - Admin Module
 * EXACT replica of admin/tags/create.blade.php from old CMDMS
 * Integrated with real API following API_INTEGRATION_GUIDE.md
 * 
 * Note: API only supports: name, color (optional)
 * Additional form fields (module, parent_id, status) are UI-only and not sent to API
 */

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as tagService from '../../../lib/services/tagService';
import { USE_MOCK_DATA } from '../../../lib/api';
import { mockAdminTags } from '../../../lib/mocks/data/adminTags';

// Mock modules enum
const modules = [
  { value: 'recordnotes', label: 'Record Notes' },
  { value: 'directives', label: 'Directives' },
  { value: 'sectorial', label: 'Sectorial Meetings' },
  { value: 'cmremarks', label: 'CM Remarks' },
  { value: 'reviewmeetings', label: 'Review Meetings' },
];

// Mock status enum
const statuses = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

export default function AddTag() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    color: '',
    module: 'recordnotes',
    parent_id: '',
    status: 'active',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [availableTags, setAvailableTags] = useState<tagService.Tag[]>([]);
  const [loadingTags, setLoadingTags] = useState(true);

  // Load tags for parent tag dropdown
  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      setLoadingTags(true);
      if (USE_MOCK_DATA) {
        setAvailableTags(mockAdminTags.map(t => ({ id: t.id, name: t.name })));
      } else {
        const response = await tagService.listTags();
        if (response.success && response.data) {
          setAvailableTags(response.data);
        }
      }
    } catch (err: any) {
      console.error('Error loading tags:', err);
      if (import.meta.env.DEV) {
        setAvailableTags(mockAdminTags.map(t => ({ id: t.id, name: t.name })));
      }
    } finally {
      setLoadingTags(false);
    }
  };

  // Get parent tags (tags without parent) - UI only, not in API
  const parentTags = availableTags.filter(tag => !tag.parentId);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (USE_MOCK_DATA) {
        // Mock submission
        console.log('Tag created (mock):', formData);
        alert('Tag created successfully! (Mock)');
        navigate('/admin/tags');
      } else {
        // Real API call - only send documented fields
        const requestData: tagService.CreateTagRequest = {
          name: formData.name,
          color: formData.color || undefined,
        };

        const response = await tagService.createTag(requestData);

        if (response.success) {
          // Success - navigate back to list
          navigate('/admin/tags');
        } else {
          setError(response.message || 'Failed to create tag');
        }
      }
    } catch (err: any) {
      console.error('Error creating tag:', err);
      const errorMessage = err.response?.data?.error?.message || 
                          err.response?.data?.error?.details?.map((d: any) => d.message).join(', ') ||
                          'Failed to create tag. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="content-wrapper">
      <div className="row">
        <div className="col-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-header text-center">
              <div className="d-flex gap-3 justify-content-between align-items-center">
                <div className="flex-grow-1 text-center">
                  <p className="block display-4">Add New Tag</p>
                </div>
                <div>
                  <div className="btn-toolbar pull-right">
                    <div className="btn-group">
                      <Link
                        to="/admin/tags"
                        className="btn btn-outline-primary btn-fw"
                        role="button"
                      >
                        <i className="ti-arrow-left mr-1"></i>Back
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="card-body">
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <form className="form-sample" onSubmit={handleSubmit}>
                <p className="card-description">
                  {!USE_MOCK_DATA && (
                    <small className="text-muted">
                      Note: Only name and color are sent to API. 
                      Other fields (module, parent tag, status) are UI-only and not saved.
                    </small>
                  )}
                </p>

                <div className="row">
                  <div className="col-md-4">
                    <div className="form-group">
                      <label htmlFor="name">Tag Name <span className="text-danger">*</span></label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="form-control"
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label htmlFor="color">Color (Optional)</label>
                      <input
                        type="color"
                        name="color"
                        id="color"
                        value={formData.color || '#000000'}
                        onChange={handleChange}
                        className="form-control form-control-lg"
                        style={{ height: '38px' }}
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label htmlFor="module">Module <small className="text-muted">(UI only)</small></label>
                      <select
                        name="module"
                        className="form-control"
                        value={formData.module}
                        onChange={handleChange}
                      >
                        {modules.map(module => (
                          <option key={module.value} value={module.value}>
                            {module.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label htmlFor="parent_id">Parent Tag <small className="text-muted">(UI only)</small></label>
                      <select
                        name="parent_id"
                        id="parent_id"
                        className="js-example-basic-single w-100 form-control form-control-lg"
                        value={formData.parent_id}
                        onChange={handleChange}
                        disabled={loadingTags}
                      >
                        <option value="">-- Select Parent Tag --</option>
                        {loadingTags ? (
                          <option>Loading tags...</option>
                        ) : (
                          parentTags.map(tag => (
                            <option key={tag.id} value={tag.id}>
                              {tag.name}
                            </option>
                          ))
                        )}
                      </select>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label htmlFor="status">Status <small className="text-muted">(UI only)</small></label>
                      <select
                        name="status"
                        id="status"
                        className="form-control form-control-lg"
                        value={formData.status}
                        onChange={handleChange}
                      >
                        {statuses.map(status => (
                          <option key={status.value} value={status.value}>
                            {status.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="btn btn-success mr-2"
                  disabled={loading || loadingTags}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                      Creating...
                    </>
                  ) : (
                    'Save'
                  )}
                </button>
                <Link to="/admin/tags" className="btn btn-light">
                  Cancel
                </Link>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
