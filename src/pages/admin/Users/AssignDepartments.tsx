/**
 * Assign Departments Page - Admin Module
 * EXACT replica of admin/users/departments/edit.blade.php from old CMDMS
 */

import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { mockAdminUsers, type AdminUser } from '../../../lib/mocks/data/adminUsers';
import { mockAdminDepartments } from '../../../lib/mocks/data/adminDepartments';

export default function AssignDepartments() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [checkAll, setCheckAll] = useState(false);
  
  // Group departments by type
  const departmentsByType = {
    'Main Departments': mockAdminDepartments.filter(d => d.type === 'department').slice(0, 30),
    'Boards': mockAdminDepartments.filter(d => d.type === 'board'),
    'District Administrations': mockAdminDepartments.filter(d => d.type === 'district_administration'),
  };

  const [selectedDepartments, setSelectedDepartments] = useState<{
    [key: string]: number[];
  }>({
    'Main Departments': [],
    'Boards': [],
    'District Administrations': [],
    'Sectorial': [],
    'Record Notes': [],
  });

  useEffect(() => {
    const foundUser = mockAdminUsers.find(u => u.id === parseInt(id || '0'));
    if (foundUser) {
      setUser(foundUser);
      // TODO: Load user's assigned departments when backend is ready
    } else {
      alert('User not found');
      navigate('/admin/users');
    }
  }, [id, navigate]);

  const handleCheckboxChange = (type: string, deptId: number) => {
    setSelectedDepartments(prev => {
      const current = prev[type] || [];
      const isSelected = current.includes(deptId);
      
      return {
        ...prev,
        [type]: isSelected 
          ? current.filter(id => id !== deptId)
          : [...current, deptId]
      };
    });
  };

  const handleCheckAll = () => {
    const newCheckAll = !checkAll;
    setCheckAll(newCheckAll);
    
    if (newCheckAll) {
      // Check all
      const allSelected: { [key: string]: number[] } = {};
      Object.entries(departmentsByType).forEach(([type, depts]) => {
        allSelected[type] = depts.map(d => d.id);
      });
      setSelectedDepartments(allSelected);
    } else {
      // Uncheck all
      setSelectedDepartments({
        'Main Departments': [],
        'Boards': [],
        'District Administrations': [],
        'Sectorial': [],
        'Record Notes': [],
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Assigned departments:', selectedDepartments);
    // TODO: Implement API call when backend is ready
    alert('Departments assigned successfully! (Mock)');
    navigate('/admin/users');
  };

  if (!user) {
    return (
      <div className="content-wrapper">
        <div className="card">
          <div className="card-body text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="sr-only">Loading...</span>
            </div>
            <p className="mt-3">Loading user...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        ul {
          list-style: none;
        }
        .form-check > .chk-label input {
          top: 3px!important;
          left: 250px!important;
        }
        .form-check .chk-label input[type="checkbox"] + .input-helper:before, 
        .form-check .chk-label input[type="checkbox"] + .input-helper:after {
          position: absolute;
          top: 1px!important;
          left: 250px!important;
        }
        .permission-name {
          width: 270px;
          float: left;
          font-weight: bold;
          font-size: 14px;
        }
        .permission-options {
          left: 350px;
          position: relative;
          top: -28px;
        }
        .form-check .chk-label {
          width: 315px;
        }
      `}</style>
      
      <div className="content-wrapper">
        <div className="row">
          <div className="col-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <Link to="/admin/users" style={{ float: 'right' }}>
                  Show all users
                </Link>
                <p className="card-title">
                  <strong>Add User departments </strong>
                </p>
                <p className="card-description">{/* Create User */}</p>

                <div className="row">
                  <div className="col-md-12">
                    <div className="form-group">
                      <label htmlFor="name">
                        <h5>
                          Name : {user.name} | Department : {user.department_name} |
                          Role : {user.role_name} | Email : {user.email}
                        </h5>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="form-check" style={{ marginTop: '0px' }}>
                  <label className="form-check-label">
                    <input
                      type="checkbox"
                      id="checkAll"
                      className="form-check-input"
                      checked={checkAll}
                      onChange={handleCheckAll}
                    />
                    Check All
                  </label>
                </div>
                <hr />

                <form className="form-sample" onSubmit={handleSubmit}>
                  {Object.entries(departmentsByType).map(([typeName, depts]) => (
                    <div key={typeName}>
                      <h4>{typeName}</h4>
                      <br />
                      <div className="row">
                        {depts.map(dept => (
                          <div key={dept.id} className="col-md-4">
                            <div className="form-group">
                              <div className="form-check" style={{ marginTop: '0px' }}>
                                <label className="form-check-label">
                                  <input
                                    type="checkbox"
                                    name={`${typeName}[]`}
                                    value={dept.id}
                                    className="form-check-input input-icheck"
                                    checked={selectedDepartments[typeName]?.includes(dept.id) || false}
                                    onChange={() => handleCheckboxChange(typeName, dept.id)}
                                  />
                                  {dept.name}
                                </label>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <hr />
                    </div>
                  ))}

                  {/* Sectorial Section */}
                  <h4>Sectorial</h4>
                  <br />
                  <div className="row">
                    {mockAdminDepartments.filter(d => d.type === 'department').slice(0, 15).map(dept => (
                      <div key={dept.id} className="col-md-4">
                        <div className="form-group">
                          <div className="form-check" style={{ marginTop: '0px' }}>
                            <label className="form-check-label">
                              <input
                                type="checkbox"
                                name="sectorial[]"
                                value={dept.id}
                                className="form-check-input input-icheck"
                                checked={selectedDepartments['Sectorial']?.includes(dept.id) || false}
                                onChange={() => handleCheckboxChange('Sectorial', dept.id)}
                              />
                              {dept.name}
                            </label>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Record Notes DC's and DPO's Section */}
                  <h4>Record Notes DC's and DPO's</h4>
                  <br />
                  <div className="row">
                    {mockAdminDepartments.filter(d => d.type === 'district_administration').slice(0, 20).map(dept => (
                      <div key={dept.id} className="col-md-4">
                        <div className="form-group">
                          <div className="form-check" style={{ marginTop: '0px' }}>
                            <label className="form-check-label">
                              <input
                                type="checkbox"
                                name="maindepartments[]"
                                value={dept.id}
                                className="form-check-input input-icheck"
                                checked={selectedDepartments['Record Notes']?.includes(dept.id) || false}
                                onChange={() => handleCheckboxChange('Record Notes', dept.id)}
                              />
                              {dept.name}
                            </label>
                          </div>
                        </div>
                      </div>
                    ))}
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
    </>
  );
}
