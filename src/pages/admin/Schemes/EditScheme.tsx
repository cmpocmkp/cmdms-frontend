/**
 * Edit Scheme - Admin Module
 * EXACT replica of admin/schemes/edit.blade.php from old CMDMS
 */

import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { mockSchemes } from '../../../lib/mocks/data/schemes';
import { schemeMockDistricts, schemeTypes, schemeCategories } from '../../../lib/mocks/data/schemes';

export default function EditScheme() {
  const { id } = useParams<{ id: string }>();
  const scheme = mockSchemes.find(s => s.id === Number(id));

  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [districtId, setDistrictId] = useState<string>('');
  const [type, setType] = useState<string>('');
  const [category, setCategory] = useState<string>('');

  useEffect(() => {
    if (scheme) {
      setName(scheme.name);
      setCode(scheme.code);
      setDistrictId(scheme.district_id.toString());
      setType(scheme.type);
      setCategory(scheme.category);
    }
  }, [scheme]);

  if (!scheme) {
    return (
      <div className="content-wrapper">
        <div className="alert alert-danger">Scheme not found</div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Update Scheme:', {
      id: scheme.id,
      name,
      code,
      district_id: districtId || null,
      type: type || null,
      category: category || null
    });
    alert('Update Scheme functionality will be implemented with backend API');
    // Navigate would be: navigate('/admin/schemes');
  };

  return (
    <div className="content-wrapper">
      <div className="row">
        <div className="col-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <Link to="/admin/schemes" style={{ float: 'right' }}>
                Show all schemes
              </Link>
              <p className="card-title">
                <strong>Edit scheme</strong>
              </p>

              <form
                className="form-sample"
                onSubmit={handleSubmit}
                encType="multipart/form-data"
                id="edit_scheme_form"
              >
                <p className="card-description">
                  <input type="hidden" name="modified_by" value="1" /> {/* Will be replaced with actual user ID */}
                </p>

                {/* row start */}
                <div className="row">
                  <div className="col-md-12">
                    <div className="form-group">
                      <label>Name</label>
                      <textarea
                        name="name"
                        id="scheme_name"
                        rows={5}
                        className="form-control"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>Code</label>
                      <input
                        type="text"
                        name="code"
                        id="scheme_code"
                        className="form-control"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label>District</label>
                      <select
                        id="scheme_district"
                        name="district_id"
                        className="js-example-basic-multiple w-100 form-control form-control-lg"
                        required
                        value={districtId}
                        onChange={(e) => setDistrictId(e.target.value)}
                      >
                        <option value="">Please Select District</option>
                        {schemeMockDistricts.map((district) => (
                          <option key={district.id} value={district.id.toString()}>
                            {district.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label>Type</label>
                      <select
                        id="scheme_type"
                        name="type"
                        className="js-example-basic-multiple w-100 form-control form-control-lg"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                      >
                        <option value="">Please Select Type</option>
                        {Object.entries(schemeTypes).map(([key, value]) => (
                          <option key={key} value={key}>
                            {value}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label>Category</label>
                      <select
                        id="scheme_category"
                        name="category"
                        className="js-example-basic-multiple w-100 form-control form-control-lg"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                      >
                        <option value="">Please Select Category</option>
                        {Object.entries(schemeCategories).map(([key, value]) => (
                          <option key={key} value={key}>
                            {value}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* row end */}
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