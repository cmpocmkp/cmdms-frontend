/**
 * Edit Scheme - Admin Module
 * EXACT replica of admin/schemes/edit.blade.php from old CMDMS
 * Integrated with real API following API_INTEGRATION_GUIDE.md
 * 
 * Note: API supports: name, code, sector, estimatedCost, status, departmentId
 * Additional form fields (districtId, type, category) are UI-only and not sent to API
 */

import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import * as schemeService from '../../../lib/services/schemeService';
import * as commonService from '../../../lib/services/commonService';
import { USE_MOCK_DATA } from '../../../lib/api';
import { schemeMockDistricts, schemeTypes, schemeCategories } from '../../../lib/mocks/data/schemes';
import { mockAdminDepartments } from '../../../lib/mocks/data/adminDepartments';

export default function EditScheme() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scheme, setScheme] = useState<schemeService.Scheme | null>(null);
  const [departments, setDepartments] = useState<Array<{ id: number; name: string }>>([]);

  // API fields
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [sector, setSector] = useState('');
  const [estimatedCost, setEstimatedCost] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [departmentId, setDepartmentId] = useState<string>('');

  // UI-only fields (not sent to API)
  const [districtId, setDistrictId] = useState<string>('');
  const [type, setType] = useState<string>('');
  const [category, setCategory] = useState<string>('');

  // Fetch scheme and departments from API
  useEffect(() => {
    if (id) {
      fetchScheme();
      fetchDepartments();
    }
  }, [id]);

  const fetchScheme = async () => {
    try {
      setLoading(true);
      setError(null);

      if (USE_MOCK_DATA) {
        // Mock data
        const mockScheme: schemeService.Scheme = {
          id: Number(id),
          name: 'Mock Scheme',
          code: 'MOCK-001',
          sector: 'Infrastructure',
          estimatedCost: 50000000,
          status: 'pending',
          departmentId: 10,
        };
        setScheme(mockScheme);
        setName(mockScheme.name);
        setCode(mockScheme.code || '');
        setSector(mockScheme.sector || '');
        setEstimatedCost(mockScheme.estimatedCost?.toString() || '');
        setStatus(mockScheme.status || '');
        setDepartmentId(mockScheme.departmentId?.toString() || '');
      } else {
        // Real API call
        const response = await schemeService.getScheme(Number(id));

        if (response.success && response.data) {
          setScheme(response.data);
          setName(response.data.name || '');
          setCode(response.data.code || '');
          setSector(response.data.sector || '');
          setEstimatedCost(response.data.estimatedCost?.toString() || '');
          setStatus(response.data.status || '');
          setDepartmentId(response.data.departmentId?.toString() || '');
        } else {
          setError(response.message || 'Scheme not found');
        }
      }
    } catch (err: any) {
      console.error('Error fetching scheme:', err);
      setError(err.response?.data?.error?.message || 'Failed to load scheme');
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      if (USE_MOCK_DATA) {
        setDepartments(mockAdminDepartments);
      } else {
        const response = await commonService.getDepartmentsDropdown();
        if (response.success && response.data) {
          setDepartments(response.data);
        } else {
          setDepartments(mockAdminDepartments); // Fallback
        }
      }
    } catch (err: any) {
      console.error('Error fetching departments:', err);
      setDepartments(mockAdminDepartments); // Fallback
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setUpdating(true);
      setError(null);

      // Map form data to API format (only documented fields)
      const updateData: schemeService.UpdateSchemeRequest = {
        name: name || undefined,
        code: code || undefined,
        sector: sector || undefined,
        estimatedCost: estimatedCost ? parseFloat(estimatedCost) : undefined,
        status: status || undefined,
        departmentId: departmentId ? parseInt(departmentId, 10) : undefined,
      };

      if (USE_MOCK_DATA) {
        // Mock update
        await new Promise(resolve => setTimeout(resolve, 500));
        alert('Scheme updated successfully! (Mock)');
        navigate('/admin/schemes');
      } else {
        // Real API call
        const response = await schemeService.updateScheme(Number(id), updateData);

        if (response.success && response.data) {
          alert('Scheme updated successfully!');
          navigate('/admin/schemes');
        } else {
          setError(response.message || 'Failed to update scheme');
        }
      }
    } catch (err: any) {
      console.error('Error updating scheme:', err);
      setError(err.response?.data?.error?.message || 'Failed to update scheme. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="content-wrapper">
        <div className="text-center p-5">
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only">Loading...</span>
          </div>
          <p className="mt-2 text-muted">Loading scheme...</p>
        </div>
      </div>
    );
  }

  if (error && !scheme) {
    return (
      <div className="content-wrapper">
        <div className="alert alert-danger" role="alert">
          <i className="ti-alert-circle mr-2"></i>
          <strong>Error:</strong> {error}
          <Link to="/admin/schemes" className="btn btn-sm btn-outline-danger ml-3">
            Back to List
          </Link>
        </div>
      </div>
    );
  }

  if (!scheme) {
    return (
      <div className="content-wrapper">
        <div className="alert alert-danger">Scheme not found</div>
        <Link to="/admin/schemes" className="btn btn-outline-primary">
          Back to List
        </Link>
      </div>
    );
  }

  return (
    <div className="content-wrapper">
      <div className="row">
        <div className="col-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <Link to="/admin/schemes" style={{ float: 'right' }}>
                Show all schemes
              </Link>
              <p className="card-title">
                <strong>Edit scheme</strong>
              </p>

              {/* Error Message */}
              {error && (
                <div className="alert alert-danger" role="alert">
                  <i className="ti-alert-circle mr-2"></i>
                  <strong>Error:</strong> {error}
                </div>
              )}

              <form
                className="form-sample"
                onSubmit={handleSubmit}
                encType="multipart/form-data"
                id="edit_scheme_form"
              >
                {/* row start */}
                <div className="row">
                  <div className="col-md-12">
                    <div className="form-group">
                      <label>
                        Name <span className="text-danger">*</span>
                      </label>
                      <textarea
                        name="name"
                        id="scheme_name"
                        rows={5}
                        className="form-control"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>Code</label>
                      <input
                        type="text"
                        name="code"
                        id="scheme_code"
                        className="form-control"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>Sector</label>
                      <input
                        type="text"
                        name="sector"
                        id="scheme_sector"
                        className="form-control"
                        value={sector}
                        onChange={(e) => setSector(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>Estimated Cost</label>
                      <input
                        type="number"
                        name="estimatedCost"
                        id="scheme_estimated_cost"
                        className="form-control"
                        value={estimatedCost}
                        onChange={(e) => setEstimatedCost(e.target.value)}
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>Status</label>
                      <select
                        id="scheme_status"
                        name="status"
                        className="w-100 form-control form-control-lg"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                      >
                        <option value="">Select Status</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>Department</label>
                      <select
                        id="scheme_department"
                        name="departmentId"
                        className="w-100 form-control form-control-lg"
                        value={departmentId}
                        onChange={(e) => setDepartmentId(e.target.value)}
                      >
                        <option value="">Please Select Department</option>
                        {departments.map((dept) => (
                          <option key={dept.id} value={dept.id.toString()}>
                            {dept.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* UI-Only Fields (Not sent to API) */}
                <div className="row">
                  <div className="col-md-12">
                    <hr />
                    <small className="text-muted">
                      <strong>Note:</strong> The following fields are UI-only and not sent to the API (not documented in API_INTEGRATION_GUIDE.md):
                    </small>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-4">
                    <div className="form-group">
                      <label>District <small className="text-muted">(UI-only)</small></label>
                      <select
                        id="scheme_district"
                        name="district_id"
                        className="js-example-basic-multiple w-100 form-control form-control-lg"
                        value={districtId}
                        onChange={(e) => setDistrictId(e.target.value)}
                      >
                        <option value="">Please Select District</option>
                        {schemeMockDistricts.map((district) => (
                          <option key={district.id} value={district.id.toString()}>
                            {district.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label>Type <small className="text-muted">(UI-only)</small></label>
                      <select
                        id="scheme_type"
                        name="type"
                        className="js-example-basic-multiple w-100 form-control form-control-lg"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                      >
                        <option value="">Please Select Type</option>
                        {Object.entries(schemeTypes).map(([key, value]) => (
                          <option key={key} value={key}>
                            {value}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label>Category <small className="text-muted">(UI-only)</small></label>
                      <select
                        id="scheme_category"
                        name="category"
                        className="js-example-basic-multiple w-100 form-control form-control-lg"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                      >
                        <option value="">Please Select Category</option>
                        {Object.entries(schemeCategories).map(([key, value]) => (
                          <option key={key} value={key}>
                            {value}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* row end */}
                <button 
                  type="submit" 
                  className="btn btn-success mr-2"
                  disabled={updating}
                >
                  {updating ? (
                    <>
                      <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                      Updating...
                    </>
                  ) : (
                    'Update'
                  )}
                </button>
                <Link to="/admin/schemes" className="btn btn-light">
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