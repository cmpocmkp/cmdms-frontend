/**
 * Edit Officer - Admin Module
 * EXACT replica of admin/officers/edit.blade.php from old CMDMS
 */

import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { mockOfficers } from '../../../lib/mocks/data/officers';
import { mockOfficerDepartments } from '../../../lib/mocks/data/officerDepartments';

// BPS Scales matching old CMDMS officerScales() function
// Old CMDMS returns numeric values [7,9,11,12,14,15,16,17,18,19,20,21,22]
// but we'll use string format for consistency with mock data
const bpsScales = ['7', '9', '11', '12', '14', '15', '16', '17', '18', '19', '20', '21', '22'];

export default function EditOfficer() {
  const { id } = useParams<{ id: string }>();
  const officer = mockOfficers.find(o => o.id === Number(id));

  const [name, setName] = useState('');
  const [designation, setDesignation] = useState('');
  const [officerDepartmentId, setOfficerDepartmentId] = useState('');
  const [joiningDate, setJoiningDate] = useState('');
  const [scale, setScale] = useState('');

  useEffect(() => {
    if (officer) {
      setName(officer.name);
      setDesignation(officer.designation);
      setOfficerDepartmentId(officer.officer_department_id.toString());
      setJoiningDate(officer.joining_date || '');
      // Extract numeric value from BPS-XX format for form
      const scaleNum = officer.scale.replace('BPS-', '');
      setScale(scaleNum);
    }
  }, [officer]);

  if (!officer) {
    return (
      <div className="content-wrapper">
        <div className="alert alert-danger">Officer not found</div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Update Officer:', {
      id: officer.id,
      name,
      designation,
      officer_department_id: officerDepartmentId,
      joining_date: joiningDate,
      scale
    });
    alert('Update Officer functionality will be implemented with backend API');
  };

  return (
    <div className="content-wrapper">
      <div className="row">
        <div className="col-12 grid-margin">
          <div className="card">
            <div className="card-body">
              <Link to="/admin/officers" style={{ float: 'right' }}>
                Show all officers
              </Link>
              <p className="card-title"><strong>Edit Officer</strong></p>

              <form
                className="form-sample"
                onSubmit={handleSubmit}
                encType="multipart/form-data"
                id="record_note_form"
              >
                <div className="row">
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>Officer Name</label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        value={name}
                        className="form-control"
                        required
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>Designation</label>
                      <input
                        type="text"
                        name="designation"
                        id="designation"
                        value={designation}
                        className="form-control"
                        onChange={(e) => setDesignation(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>Department</label>
                      <select
                        name="officer_department_id"
                        id="officer_department_id"
                        className="js-example-basic-single w-100 form-control form-control-lg"
                        value={officerDepartmentId}
                        onChange={(e) => setOfficerDepartmentId(e.target.value)}
                      >
                        <option value="">Select</option>
                        {mockOfficerDepartments.map((department) => (
                          <option key={department.id} value={department.id.toString()}>
                            {department.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>Joining Date</label>
                      <input
                        type="date"
                        name="joining_date"
                        id="joining_date"
                        value={joiningDate}
                        className="form-control"
                        onChange={(e) => setJoiningDate(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-1">
                    <div className="form-group">
                      <label>Scale(BPS)</label>
                      <select
                        name="scale"
                        id="scale"
                        className="js-example-basic-single w-100 form-control form-control-lg"
                        value={scale}
                        onChange={(e) => setScale(e.target.value)}
                      >
                        <option value="">Select</option>
                        {bpsScales.map((scaleValue) => (
                          <option key={scaleValue} value={scaleValue}>
                            {scaleValue}
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
