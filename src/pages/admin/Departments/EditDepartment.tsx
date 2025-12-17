/**
 * Edit Department Form - Admin Module
 * EXACT replica of admin/departments/edit.blade.php from old CMDMS
 */

import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { mockAdminDepartments } from '../../../lib/mocks/data/adminDepartments';

// Mock districts
const mockDistricts = [
  { id: 1, name: 'Peshawar' },
  { id: 2, name: 'Mardan' },
  { id: 3, name: 'Swat' },
  { id: 4, name: 'Abbottabad' },
  { id: 5, name: 'Mansehra' },
  { id: 6, name: 'Kohat' },
  { id: 7, name: 'Bannu' },
  { id: 8, name: 'D.I.Khan' },
];

export default function EditDepartment() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [department, setDepartment] = useState<any>(null);
  const [formData, setFormData] = useState({
    parent_id: '',
    meeting_frequency: '',
    minimum_members: '',
    district_id: '',
  });

  // Get parent departments (only department type, not boards)
  const parentDepartments = mockAdminDepartments.filter(
    d => d.type === 'department' && d.id !== parseInt(id || '0')
  );

  const isAdmin = true; // Mock: check if user is admin
  const isBoard = department?.type === 'board';

  useEffect(() => {
    const foundDept = mockAdminDepartments.find(d => d.id === parseInt(id || '0'));
    if (foundDept) {
      setDepartment(foundDept);
      setFormData({
        parent_id: foundDept.parent_id?.toString() || '',
        meeting_frequency: '', // Mock data doesn't have this
        minimum_members: '', // Mock data doesn't have this
        district_id: '', // Mock data doesn't have district_id
      });
    } else {
      alert('Department not found');
      navigate('/admin/departments');
    }
  }, [id, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Department updated:', formData);
    // TODO: Implement API call when backend is ready
    alert('Department/Board updated successfully! (Mock)');
    navigate('/admin/departments');
  };

  if (!department) {
    return (
      <div className="content-wrapper">
        <div className="card">
          <div className="card-body text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="sr-only">Loading...</span>
            </div>
            <p className="mt-3">Loading department...</p>
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
            <div className="card-body">
              <Link to="/admin/departments" style={{ float: 'right' }}>
                Show all departments/boards
              </Link>
              <p className="card-title">
                <strong>Edit Department/Board </strong>
              </p>
              <p className="card-description">{/* Edit Department */}</p>

              <form className="forms-sample" onSubmit={handleSubmit}>
                {/* Row 1: Department Name (disabled) */}
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group row">
                      <label className="col-sm-3 col-form-label">
                        Department/Board
                      </label>
                      <div className="col-sm-9">
                        <input
                          type="text"
                          className="form-control"
                          value={department.name}
                          disabled
                        />
                      </div>
                    </div>
                  </div>

                  {/* Parent Department (only for boards or admin) */}
                  {(isBoard || isAdmin) && (
                    <div className="col-md-6">
                      <div className="form-group row">
                        <label className="col-sm-3 col-form-label">
                          Parent (Board Under Department)
                        </label>
                        <div className="col-sm-9">
                          <select
                            name="parent_id"
                            id="form_parent_id"
                            className="js-example-basic-single form-control"
                            value={formData.parent_id}
                            onChange={handleChange}
                          >
                            <option value="">--select parent department--</option>
                            {parentDepartments.map(dept => (
                              <option key={dept.id} value={dept.id}>
                                {dept.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Board-specific fields */}
                {(isBoard || isAdmin) && (
                  <>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group row">
                          <label className="col-sm-3 col-form-label">
                            Meeting Frequency as per Law
                          </label>
                          <div className="col-sm-9">
                            <input
                              type="number"
                              name="meeting_frequency"
                              id="meeting_frequency"
                              value={formData.meeting_frequency}
                              onChange={handleChange}
                              className="form-control"
                              required
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group row">
                          <label className="col-sm-3 col-form-label">
                            Non-exofficio members
                          </label>
                          <div className="col-sm-9">
                            <input
                              type="number"
                              name="minimum_members"
                              id="minimum_members"
                              value={formData.minimum_members}
                              onChange={handleChange}
                              className="form-control"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* District field (admin only) */}
                {isAdmin && (
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group row">
                        <label className="col-sm-3 col-form-label">District</label>
                        <div className="col-sm-9">
                          <select
                            name="district_id"
                            className="js-example-basic-single form-control"
                            value={formData.district_id}
                            onChange={handleChange}
                          >
                            <option value="">--select district(optional)--</option>
                            {mockDistricts.map(district => (
                              <option key={district.id} value={district.id}>
                                {district.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <button type="submit" className="btn btn-primary mr-2">
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
