/**
 * Edit Officer Department - Admin Module
 * EXACT replica of admin/officerdepartments/edit.blade.php from old CMDMS
 */

import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { mockOfficerDepartments } from '../../../lib/mocks/data/officerDepartments';

export default function EditOfficerDepartment() {
  const { id } = useParams<{ id: string }>();
  const officerDepartment = mockOfficerDepartments.find(od => od.id === Number(id));

  const [name, setName] = useState('');

  useEffect(() => {
    if (officerDepartment) {
      setName(officerDepartment.name);
    }
  }, [officerDepartment]);

  if (!officerDepartment) {
    return (
      <div className="content-wrapper">
        <div className="alert alert-danger">Officer Department not found</div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Update Officer Department:', {
      id: officerDepartment.id,
      name
    });
    alert('Update Officer Department functionality will be implemented with backend API');
  };

  return (
    <div className="content-wrapper">
      <div className="row">
        <div className="col-12 grid-margin">
          <div className="card">
            <div className="card-body">
              <Link to="/admin/officerdepartments" style={{ float: 'right' }}>
                Show all officer departments
              </Link>
              <p className="card-title"><strong>Edit Officer Department</strong></p>

              <form
                className="form-sample"
                onSubmit={handleSubmit}
                encType="multipart/form-data"
                id="record_note_form"
              >
                <div className="row">
                  <div className="col-md-4">
                    <div className="form-group">
                      <label>Department Name</label>
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
