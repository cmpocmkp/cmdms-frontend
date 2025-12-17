/**
 * Edit Inauguration - Admin Module
 * EXACT replica of admin/inaugrations/edit.blade.php from old CMDMS
 */

import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { mockInaugurations } from '../../../lib/mocks/data/inaugurations';
import { mockDepartments } from '../../../lib/mocks/data/departments';

// Inauguration types from old CMDMS model
const inaugurationTypes: Record<string, string> = {
  'ing': 'Inauguration',
  'grb': 'Ground Breaking'
};

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

export default function EditInauguration() {
  const { id } = useParams<{ id: string }>();
  const inauguration = mockInaugurations.find(i => i.id === Number(id));

  const [scheme, setScheme] = useState('');
  const [projectName, setProjectName] = useState('');
  const [cost, setCost] = useState<number | ''>('');
  const [date, setDate] = useState('');
  const [type, setType] = useState<string>('');
  const [departmentId, setDepartmentId] = useState<string>('');
  const [districtId, setDistrictId] = useState<string>('');
  const [divisionId, setDivisionId] = useState<string>('');
  const [description, setDescription] = useState('');
  const [remarks, setRemarks] = useState('');
  const [attachmentFiles, setAttachmentFiles] = useState<FileList | null>(null);

  // Filter departments - exclude IDs 44, 45, 46 as per old CMDMS controller
  const departments = mockDepartments.filter(dept => ![44, 45, 46].includes(Number(dept.id)));

  useEffect(() => {
    if (inauguration) {
      setScheme(inauguration.scheme || '');
      setProjectName(inauguration.project_name);
      setCost(inauguration.cost);
      setDate(inauguration.date);
      setDepartmentId(inauguration.department_id.toString());
      setDistrictId(inauguration.district_id.toString());
      setDivisionId(inauguration.division_id.toString());
      setDescription(inauguration.description);
      setRemarks(inauguration.remarks || '');
    }
  }, [inauguration]);

  if (!inauguration) {
    return (
      <div className="content-wrapper">
        <div className="alert alert-danger">Inauguration not found</div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Update Inauguration:', {
      id: inauguration.id,
      scheme,
      project_name: projectName,
      cost,
      date,
      type,
      department_id: departmentId,
      district_id: districtId,
      division_id: divisionId,
      description,
      remarks,
      attachments: attachmentFiles ? Array.from(attachmentFiles) : []
    });
    alert('Update Inauguration functionality will be implemented with backend API');
    // Navigate would be: navigate('/admin/inaugurations');
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
                Show all Inaugurations
              </Link>
              <p className="card-title"><strong>Edit Inauguration</strong></p>

              <form className="form-sample" onSubmit={handleSubmit} encType="multipart/form-data" id="edit_inauguration_form">
                <p className="card-description">
                  <input type="hidden" name="modified_by" value="1" /> {/* Will be replaced with actual user ID */}
                </p>

                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Scheme Name</label>
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
                      <label>Project Name</label>
                      <textarea
                        className="form-control"
                        id="igbproject_name"
                        name="project_name"
                        rows={4}
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label>Cost in Millions</label>
                      <input
                        type="number"
                        step="0.00001"
                        name="cost"
                        id="cost"
                        value={cost}
                        onChange={(e) => setCost(e.target.value === '' ? '' : parseFloat(e.target.value))}
                        className="form-control"
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label>Expected Date</label>
                      <input
                        type="date"
                        name="date"
                        id="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="form-control"
                        required
                      />
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="form-group">
                      <label>Type</label>
                      <select
                        id="type"
                        name="type"
                        style={{ width: '280px' }}
                        className="w-100 form-control form-control-lg"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                      >
                        {Object.entries(inaugurationTypes).map(([key, label]) => (
                          <option key={key} value={key}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label>Department</label>
                      <select
                        id="department_id"
                        name="department_id"
                        style={{ width: '280px' }}
                        className="w-100 form-control form-control-lg"
                        value={departmentId}
                        onChange={(e) => setDepartmentId(e.target.value)}
                      >
                        {departments.map((department) => (
                          <option key={department.id} value={department.id}>
                            {department.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label>District</label>
                      <select
                        id="district_id"
                        name="district_id"
                        style={{ width: '280px' }}
                        className="w-100 form-control form-control-lg"
                        value={districtId}
                        onChange={(e) => setDistrictId(e.target.value)}
                      >
                        {/* Districts would come from mock data - using inaugurationMockDistricts */}
                      </select>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label>Division</label>
                      <select
                        id="division_id"
                        name="division_id"
                        style={{ width: '280px' }}
                        className="w-100 form-control form-control-lg"
                        value={divisionId}
                        onChange={(e) => setDivisionId(e.target.value)}
                      >
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
                      <label htmlFor="inaugurations">Inaugration/GroundBreaking</label>
                      <textarea
                        className="form-control"
                        id="igbdescription"
                        name="description"
                        rows={4}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="inaugration">Remarks</label>
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

                  <div className="col-md-4">
                    <div className="form-group">
                      <label>Attach Documents<small> (if any)</small></label>
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
                  <div className="col-md-4">
                    <div className="form-group">
                      {inauguration.attachments && inauguration.attachments.length > 0 && (
                        <>
                          {inauguration.attachments.map((file, idx) => (
                            <span key={idx}>
                              <a
                                href="#"
                                title="click to download attach file"
                                onClick={(e) => {
                                  e.preventDefault();
                                  console.log('Download attachment:', file);
                                }}
                              >
                                Attachment:<i className="ti-file"></i>
                              </a>
                            </span>
                          ))}
                        </>
                      )}
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
