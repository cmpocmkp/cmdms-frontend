/**
 * Add Inauguration - Admin Module
 * EXACT replica of admin/inaugrations/add.blade.php from old CMDMS
 * Integrated with real API following API_INTEGRATION_GUIDE.md
 * 
 * Note: API supports: title, description, date, type, departmentId, districtId, projectCost
 * Additional form fields (scheme, divisionId, remarks, attachments) are UI-only and not sent to API
 */

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as inaugurationService from '../../../lib/services/inaugurationService';
import * as commonService from '../../../lib/services/commonService';
import { USE_MOCK_DATA } from '../../../lib/api';
import { inaugurationMockDistricts } from '../../../lib/mocks/data/inaugurations';
import { mockAdminDepartments } from '../../../lib/mocks/data/adminDepartments';

// Divisions from old CMDMS model (key-value pairs)
const divisions: Record<string, string> = {
  '7': 'Peshawar',
  '4': 'Kohat',
  '3': 'Hazara',
  '5': 'Malakand',
  '1': 'Banu',
  '2': 'D.I Khan',
  '6': 'Mardan'
};

export default function AddInauguration() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [departments, setDepartments] = useState<Array<{ id: number; name: string }>>([]);

  // API fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // Default to today
  const [type, setType] = useState<string>('inauguration');
  const [departmentId, setDepartmentId] = useState<string>('');
  const [districtId, setDistrictId] = useState<string>('');
  const [projectCost, setProjectCost] = useState<string>('');

  // UI-only fields (not sent to API)
  const [scheme, setScheme] = useState('');
  const [divisionId, setDivisionId] = useState<string>('');
  const [remarks, setRemarks] = useState('');
  const [attachmentFiles, setAttachmentFiles] = useState<FileList | null>(null);

  // Fetch departments
  useEffect(() => {
    fetchDepartments();
  }, []);

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
      setLoading(true);
      setError(null);

      // Map form data to API format (only documented fields)
      const apiData: inaugurationService.CreateInaugurationRequest = {
        title: title || '',
        description: description || undefined,
        date: date || undefined,
        type: type || undefined,
        departmentId: departmentId ? parseInt(departmentId, 10) : undefined,
        districtId: districtId ? parseInt(districtId, 10) : undefined,
        projectCost: projectCost ? parseFloat(projectCost) : undefined,
      };

      if (USE_MOCK_DATA) {
        // Mock create
        await new Promise(resolve => setTimeout(resolve, 500));
        alert('Inauguration added successfully! (Mock)');
        navigate('/admin/inaugurations');
      } else {
        // Real API call
        const response = await inaugurationService.createInauguration(apiData);

        if (response.success && response.data) {
          alert('Inauguration added successfully!');
          navigate('/admin/inaugurations');
        } else {
          setError(response.message || 'Failed to create inauguration');
        }
      }
    } catch (err: any) {
      console.error('Error creating inauguration:', err);
      setError(err.response?.data?.error?.message || 'Failed to create inauguration. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachmentFiles(e.target.files);
    }
  };

  return (
    <div className="content-wrapper">
      <div className="row">
        <div className="col-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <Link to="/admin/inaugurations" style={{ float: 'right' }}>
                Show all Inaugration/GroundBreaking
              </Link>
              <p className="card-title"><strong>Add new Inaugration/GroundBreaking</strong></p>

              {/* Error Message */}
              {error && (
                <div className="alert alert-danger" role="alert">
                  <i className="ti-alert-circle mr-2"></i>
                  <strong>Error:</strong> {error}
                </div>
              )}

              <form className="form-sample" onSubmit={handleSubmit} encType="multipart/form-data" id="add_inaugration_form">
                {/* row start */}
                <div className="row">
                  <div className="col-md-12">
                    <div className="form-group">
                      <label>
                        Title <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="inauguration_title"
                        name="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="form-group">
                      <label>Description</label>
                      <textarea
                        className="form-control"
                        id="inauguration_description"
                        name="description"
                        rows={4}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label>Date</label>
                      <input
                        type="date"
                        name="date"
                        id="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="form-control"
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label>Type</label>
                      <select
                        id="type"
                        name="type"
                        className="w-100 form-control form-control-lg"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                      >
                        <option value="inauguration">Inauguration</option>
                        <option value="ground_breaking">Ground Breaking</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label>Project Cost</label>
                      <input
                        type="number"
                        step="0.01"
                        name="projectCost"
                        id="projectCost"
                        value={projectCost}
                        onChange={(e) => setProjectCost(e.target.value)}
                        className="form-control"
                        min="0"
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Department</label>
                      <select
                        id="department_id"
                        name="departmentId"
                        className="w-100 form-control form-control-lg"
                        value={departmentId}
                        onChange={(e) => setDepartmentId(e.target.value)}
                      >
                        <option value="">Please Select Department</option>
                        {departments.map((department) => (
                          <option key={department.id} value={department.id.toString()}>
                            {department.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>District</label>
                      <select
                        id="district_id"
                        name="districtId"
                        className="w-100 form-control form-control-lg"
                        value={districtId}
                        onChange={(e) => setDistrictId(e.target.value)}
                      >
                        <option value="">Please Select District</option>
                        {inaugurationMockDistricts.map((district) => (
                          <option key={district.id} value={district.id.toString()}>
                            {district.name}
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
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Scheme Name <small className="text-muted">(UI-only)</small></label>
                      <textarea
                        className="form-control"
                        id="igbscheme"
                        name="scheme"
                        rows={4}
                        value={scheme}
                        onChange={(e) => setScheme(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Division <small className="text-muted">(UI-only)</small></label>
                      <select
                        id="division_id"
                        name="division_id"
                        className="w-100 form-control form-control-lg"
                        value={divisionId}
                        onChange={(e) => setDivisionId(e.target.value)}
                      >
                        <option value="">Please Select Division</option>
                        {Object.entries(divisions).map(([key, label]) => (
                          <option key={key} value={key}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="inaugration">Remarks <small className="text-muted">(UI-only)</small></label>
                      <textarea
                        className="form-control"
                        id="igbremarks"
                        name="remarks"
                        rows={4}
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Attach Documents <small className="text-muted">(UI-only)</small></label>
                      <input
                        type="file"
                        name="attachments[]"
                        className="file-upload-default"
                        multiple
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                        id="file-upload-input"
                      />
                      <div className="input-group col-xs-12">
                        <input
                          type="text"
                          className="form-control file-upload-info"
                          disabled
                          placeholder="Upload files"
                          value={attachmentFiles ? `${attachmentFiles.length} file(s) selected` : ''}
                        />
                        <span className="input-group-append">
                          <button
                            className="file-upload-browse btn btn-success"
                            type="button"
                            onClick={() => document.getElementById('file-upload-input')?.click()}
                          >
                            Select Files
                          </button>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="btn btn-success mr-2"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                      Submitting...
                    </>
                  ) : (
                    'Save'
                  )}
                </button>
                <Link to="/admin/inaugurations" className="btn btn-light">
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
