/**
 * Add Department Form - Admin Module
 * EXACT replica of admin/departments/add.blade.php from old CMDMS
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { mockAdminDepartments } from '../../../lib/mocks/data/adminDepartments';

export default function AddDepartment() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    meeting_frequency: '',
    parent_id: '',
    minimum_members: '',
  });

  // Get parent departments (only department type, not boards)
  const parentDepartments = mockAdminDepartments.filter(d => d.type === 'department');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Department created:', formData);
    // TODO: Implement API call when backend is ready
    alert('Department/Board created successfully! (Mock)');
    navigate('/admin/departments');
  };

  return (
    <div className="content-wrapper">
      <div className="row">
        <div className="col-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <Link to="/admin/departments" style={{ float: 'right' }}>
                Show all Department/Board
              </Link>
              <p className="card-title">
                <strong>Add New Department/Board</strong>
              </p>
              <p className="card-description">{/* Create Department */}</p>

              <form className="form-sample" onSubmit={handleSubmit}>
                {/* Row 1: Name and Meeting Frequency */}
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group row">
                      <label className="col-sm-3 col-form-label">Name</label>
                      <div className="col-sm-9">
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
                  </div>
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
                </div>

                {/* Row 2: Parent and Non-exofficio members */}
                <div className="row">
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

                <button type="submit" className="btn btn-primary mr-2">
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
