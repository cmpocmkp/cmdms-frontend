/**
 * Add Board Member - Admin Module
 * EXACT replica of admin/boardmembers/add.blade.php from old CMDMS
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { mockAdminDepartments } from '../../../lib/mocks/data/adminDepartments';
import { boardMemberTypes, boardMemberStatuses } from '../../../lib/mocks/data/boardMembers';

export default function AddBoardMember() {
  const [name, setName] = useState('');
  const [departmentId, setDepartmentId] = useState<string>('');
  const [qualification, setQualification] = useState('');
  const [designation, setDesignation] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [notificationFile, setNotificationFile] = useState<File | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [domicile, setDomicile] = useState('');
  const [joiningDate, setJoiningDate] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [type, setType] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [phone, setPhone] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [nic, setNic] = useState('');
  const [address, setAddress] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Add Board Member:', {
      name,
      department_id: departmentId || null,
      qualification,
      designation,
      resume: resumeFile,
      notification: notificationFile,
      photo: photoFile,
      domicile,
      joining_date: joiningDate || null,
      expiration_date: expirationDate || null,
      type: type || null,
      status: status || null,
      phone: phone || null,
      mobile: mobile || null,
      email: email || null,
      nic: nic || null,
      address: address || null
    });
    alert('Add Board Member functionality will be implemented with backend API');
    // Navigate would be: navigate('/admin/boardmembers');
  };

  const handleFileChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      switch (field) {
        case 'resume':
          setResumeFile(file);
          break;
        case 'notification':
          setNotificationFile(file);
          break;
        case 'photo':
          setPhotoFile(file);
          break;
      }
    }
  };

  return (
    <div className="content-wrapper">
      <div className="row">
        <div className="col-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <Link to="/admin/boardmembers" style={{ float: 'right' }}>
                Show all boardmembers
              </Link>
              <p className="card-title">
                <strong>Add new board member</strong>
              </p>

              <form
                className="form-sample"
                onSubmit={handleSubmit}
                encType="multipart/form-data"
                id="record_note_form"
              >
                {/* row start */}
                <div className="row">
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>Member Name</label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        className="form-control"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="col-md-3">
                    <div className="form-group">
                      <label>Board Name</label>
                      <select
                        name="department_id"
                        id="department_id"
                        className="js-example-basic-single w-100 form-control form-control-lg"
                        value={departmentId}
                        onChange={(e) => setDepartmentId(e.target.value)}
                      >
                        {mockAdminDepartments.slice(0, 10).map((department) => (
                          <option key={department.id} value={department.id.toString()}>
                            {department.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>Qualification</label>
                      <input
                        type="text"
                        name="qualification"
                        id="qualification"
                        className="form-control"
                        value={qualification}
                        onChange={(e) => setQualification(e.target.value)}
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
                        className="form-control"
                        value={designation}
                        onChange={(e) => setDesignation(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>Attach CV/Resume</label>
                      <input
                        type="file"
                        name="resume"
                        className="file-upload-default"
                        onChange={handleFileChange('resume')}
                        style={{ display: 'none' }}
                        id="resume-input"
                      />
                      <div className="input-group col-xs-12">
                        <input
                          type="text"
                          className="form-control file-upload-info"
                          disabled
                          placeholder="Upload CV/Resume"
                          value={resumeFile ? resumeFile.name : ''}
                        />
                        <span className="input-group-append">
                          <button
                            className="file-upload-browse btn btn-success"
                            type="button"
                            onClick={() => document.getElementById('resume-input')?.click()}
                          >
                            Select File
                          </button>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>Member Notification</label>
                      <input
                        type="file"
                        name="notification"
                        className="file-upload-default"
                        onChange={handleFileChange('notification')}
                        style={{ display: 'none' }}
                        id="notification-input"
                      />
                      <div className="input-group col-xs-12">
                        <input
                          type="text"
                          className="form-control file-upload-info"
                          disabled
                          placeholder="Upload Member Notification"
                          value={notificationFile ? notificationFile.name : ''}
                        />
                        <span className="input-group-append">
                          <button
                            className="file-upload-browse btn btn-success"
                            type="button"
                            onClick={() => document.getElementById('notification-input')?.click()}
                          >
                            Select File
                          </button>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>Photo</label>
                      <input
                        type="file"
                        name="photo"
                        className="file-upload-default"
                        onChange={handleFileChange('photo')}
                        style={{ display: 'none' }}
                        id="photo-input"
                      />
                      <div className="input-group col-xs-12">
                        <input
                          type="text"
                          className="form-control file-upload-info"
                          disabled
                          placeholder="Upload Picture"
                          value={photoFile ? photoFile.name : ''}
                        />
                        <span className="input-group-append">
                          <button
                            className="file-upload-browse btn btn-success"
                            type="button"
                            onClick={() => document.getElementById('photo-input')?.click()}
                          >
                            Select File
                          </button>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>Domicile</label>
                      <input
                        type="text"
                        name="domicile"
                        id="domicile"
                        className="form-control"
                        value={domicile}
                        onChange={(e) => setDomicile(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>Joining Date</label>
                      <input
                        type="date"
                        name="joining_date"
                        id="joining_date"
                        className="form-control"
                        value={joiningDate}
                        onChange={(e) => setJoiningDate(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>Expiration Date</label>
                      <input
                        type="date"
                        name="expiration_date"
                        id="expiration_date"
                        className="form-control"
                        value={expirationDate}
                        onChange={(e) => setExpirationDate(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>Member Type</label>
                      <select
                        name="type"
                        id="type"
                        className="js-example-basic-single w-100 form-control form-control-lg"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                      >
                        <option value="">--select--</option>
                        {Object.entries(boardMemberTypes).map(([key, value]) => (
                          <option key={key} value={key}>
                            {value}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>Status</label>
                      <select
                        name="status"
                        id="status"
                        className="js-example-basic-single w-100 form-control form-control-lg"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                      >
                        <option value="">--select--</option>
                        {Object.entries(boardMemberStatuses).map(([key, value]) => (
                          <option key={key} value={key}>
                            {value}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>Phone</label>
                      <input
                        type="number"
                        name="phone"
                        id="phone"
                        className="form-control"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>Mobile</label>
                      <input
                        type="number"
                        name="mobile"
                        id="mobile"
                        className="form-control"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>Email</label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>NIC</label>
                      <input
                        type="number"
                        name="nic"
                        id="nic"
                        className="form-control"
                        value={nic}
                        onChange={(e) => setNic(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Address</label>
                      <input
                        type="text"
                        name="address"
                        id="address"
                        className="form-control"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* row end */}
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

