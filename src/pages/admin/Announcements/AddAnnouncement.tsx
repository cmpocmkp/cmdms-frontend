/**
 * Add Announcement - Admin Module
 * EXACT replica of admin/announcements/add.blade.php from old CMDMS
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { mockDepartments } from '../../../lib/mocks/data/departments';

export default function AddAnnouncement() {
  const [formData, setFormData] = useState({
    district_id: '',
    venue: '',
    date: new Date().toISOString().split('T')[0],
    attachments: [] as File[]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submit announcement:', formData);
    alert('Add announcement functionality will be implemented with backend API');
  };

  return (
    <div className="content-wrapper">
      <div className="row">
        <div className="col-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-header text-center">
              <div className="d-flex gap-3 justify-content-between align-items-center">
                <div className="flex-grow-1 text-center">
                  <p className="block display-4">Add New Announcement</p>
                </div>
                <div>
                  <div className="btn-toolbar pull-right">
                    <div className="btn-group">
                      <Link
                        to="/admin/announcements"
                        className="btn btn-outline-primary btn-fw"
                        style={{ float: 'right' }}
                      >
                        <i className="ti-arrow-left mr-1"></i>Back
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="card-body">
              <form className="form-sample" onSubmit={handleSubmit} encType="multipart/form-data" id="record_note_form">
                <p className="card-description">
                  <input type="hidden" name="created_by" value="1" />
                </p>
                {/* row start */}
                <div className="row">
                  <div className="col-md-6 col-sm-12">
                    <div className="form-group">
                      <label>District</label>
                      <select
                        name="district_id"
                        id="district_id"
                        className="js-example-basic-single w-100 form-control form-control-lg"
                        required
                        value={formData.district_id}
                        onChange={(e) => setFormData({ ...formData, district_id: e.target.value })}
                      >
                        <option value="">Select District</option>
                        {mockDepartments.map((district: any) => (
                          <option key={district.id} value={district.id}>
                            {district.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="col-md-6 col-sm-12">
                    <div className="form-group">
                      <label>Venue</label>
                      <input
                        type="text"
                        name="venue"
                        id="venue"
                        value={formData.venue}
                        onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                        className="form-control"
                        required
                      />
                    </div>
                  </div>

                  <div className="col-md-6 col-sm-12">
                    <div className="form-group">
                      <label>Visit Date</label>
                      <input
                        type="date"
                        name="date"
                        id="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="form-control"
                        required
                      />
                    </div>
                  </div>

                  <div className="col-md-6 col-sm-12">
                    <div className="form-group">
                      <label>Attach Documents<small> (if any)</small></label>
                      <input
                        type="file"
                        name="attachment[]"
                        className="file-upload-default"
                        multiple
                        onChange={(e) => {
                          if (e.target.files) {
                            setFormData({ ...formData, attachments: Array.from(e.target.files) });
                          }
                        }}
                      />
                      <div className="input-group col-xs-12">
                        <input
                          type="text"
                          className="form-control file-upload-info"
                          disabled
                          placeholder="Upload files"
                          value={formData.attachments.length > 0 ? `${formData.attachments.length} file(s) selected` : ''}
                        />
                        <span className="input-group-append">
                          <button className="file-upload-browse btn btn-success" type="button">
                            Select Files
                          </button>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-12 text-center">
                    <button type="submit" className="btn btn-success btn-icon-text">
                      <i className="ti-check mr-1"></i>Save
                    </button>
                  </div>
                </div>
                {/* row end */}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
