/**
 * Add Officer Department - Admin Module
 * EXACT replica of admin/officerdepartments/add.blade.php from old CMDMS
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function AddOfficerDepartment() {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Add Officer Department:', {
      name
    });
    alert('Add Officer Department functionality will be implemented with backend API');
  };

  return (
    <div className="content-wrapper">
      <div className="row">
        <div className="col-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <Link to="/admin/officerdepartments" style={{ float: 'right' }}>
                Show all officer departments
              </Link>
              <p className="card-title"><strong>Add new officer department</strong></p>
              <p className="card-description"></p>

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
                  Save
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
