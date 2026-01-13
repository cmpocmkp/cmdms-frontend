/**
 * Edit Tag Form - Admin Module
 * EXACT replica of admin/tags/edit.blade.php from old CMDMS
 * 
 * ⚠️ IMPORTANT NOTE: Tag Update endpoint is NOT documented in API_INTEGRATION_GUIDE.md
 * This page is read-only for now. Tags can only be created, not updated via API.
 * 
 * Alternative: Delete and recreate tag if update is needed.
 */

import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
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

export default function EditTag() {
  const { id } = useParams<{ id: string }>();
  const [tag, setTag] = useState<tagService.Tag | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    color: '',
    module: 'recordnotes',
    parent_id: '',
    status: 'active',
  });
  const [availableTags, setAvailableTags] = useState<tagService.Tag[]>([]);

  // Load tags for parent tag dropdown and current tag
  useEffect(() => {
    fetchTags();
  }, [id]);

  const fetchTags = async () => {
    try {
      if (USE_MOCK_DATA) {
        // Mock data fallback
        const foundTag = mockAdminTags.find(t => t.id === parseInt(id || '0'));
        if (foundTag) {
          setTag({
            id: foundTag.id,
            name: foundTag.name,
            color: undefined,
            parentId: foundTag.parent_id,
          } as tagService.Tag);
          setFormData({
            name: foundTag.name,
            color: '',
            module: foundTag.module || 'recordnotes',
            parent_id: foundTag.parent_id?.toString() || '',
            status: 'active',
          });
        }
        setAvailableTags(mockAdminTags.map(t => ({ id: t.id, name: t.name })));
      } else {
        // Real API call
        const response = await tagService.listTags();
        if (response.success && response.data) {
          setAvailableTags(response.data);
          const foundTag = response.data.find(t => t.id === parseInt(id || '0'));
          if (foundTag) {
            setTag(foundTag);
            setFormData({
              name: foundTag.name,
              color: foundTag.color || '',
              module: 'recordnotes',
              parent_id: foundTag.parentId?.toString() || '',
              status: 'active',
            });
          } else {
            setError('Tag not found');
          }
        } else {
          setError('Failed to load tag');
        }
      }
    } catch (err: any) {
      console.error('Error loading tags:', err);
      setError(err.response?.data?.error?.message || 'Failed to load tag');
      if (import.meta.env.DEV && USE_MOCK_DATA) {
        const foundTag = mockAdminTags.find(t => t.id === parseInt(id || '0'));
        if (foundTag) {
          setTag({
            id: foundTag.id,
            name: foundTag.name,
            color: undefined,
            parentId: foundTag.parent_id,
          } as tagService.Tag);
          setFormData({
            name: foundTag.name,
            color: '',
            module: foundTag.module || 'recordnotes',
            parent_id: foundTag.parent_id?.toString() || '',
            status: 'active',
          });
        }
      }
    } finally {
      setLoading(false);
    }
  };

  // Get parent tags (tags without parent, excluding current tag) - UI only, not in API
  const parentTags = availableTags.filter(
    t => !t.parentId && t.id !== parseInt(id || '0')
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // ⚠️ Tag update endpoint is not available in API guide
    alert('⚠️ Tag update is not supported by the API. Please delete and recreate the tag if you need to modify it.');
  };

  if (loading || !tag) {
    return (
      <div className="content-wrapper">
        <div className="card">
          <div className="card-body text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="sr-only">Loading...</span>
            </div>
            <p className="mt-3">Loading tag...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="content-wrapper">
      <div className="row">
        <div className="col-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-header text-center">
              <div className="d-flex gap-3 justify-content-between align-items-center">
                <div className="flex-grow-1 text-center">
                  <p className="block display-4">Edit Tag</p>
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
              
              {!USE_MOCK_DATA && (
                <div className="alert alert-warning" role="alert">
                  <strong>⚠️ Note:</strong> Tag update endpoint is not documented in API_INTEGRATION_GUIDE.md. 
                  This form is read-only. To modify a tag, delete and recreate it.
                </div>
              )}

              <form className="form-sample" onSubmit={handleSubmit}>
                <p className="card-description">
                  {/* Hidden fields would go here */}
                </p>

                <div className="row">
                  <div className="col-md-4">
                    <div className="form-group">
                      <label htmlFor="name">Tag Name</label>
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
                      <label htmlFor="module">Module (Optional)</label>
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
                      <label htmlFor="parent_id">Parent Tag (Optional)</label>
                      <select
                        name="parent_id"
                        id="parent_id"
                        className="js-example-basic-single w-100 form-control form-control-lg"
                        value={formData.parent_id}
                        onChange={handleChange}
                      >
                        <option value="">-- Select Parent Tag --</option>
                        {parentTags.map(parentTag => (
                          <option key={parentTag.id} value={parentTag.id}>
                            {parentTag.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-4">
                    <div className="form-group">
                      <label htmlFor="status">Status</label>
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

                <button type="submit" className="btn btn-success mr-2">
                  Update
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
