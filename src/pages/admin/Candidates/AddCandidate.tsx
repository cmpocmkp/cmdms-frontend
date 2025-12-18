/**
 * Add Candidate - Admin Module
 * EXACT replica of admin/candidates/add.blade.php from old CMDMS
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { schemeMockDistricts } from '../../../lib/mocks/data/schemes';

// Mock parties
const mockParties = [
  { id: 1, name: 'PTI' },
  { id: 2, name: 'PML-N' },
  { id: 3, name: 'PPP' },
  { id: 4, name: 'ANP' },
  { id: 5, name: 'JUI-F' },
  { id: 6, name: 'MQM' },
  { id: 7, name: 'Independent' }
];

// Mock constituencies
const mockConstituencies = Array.from({ length: 50 }, (_, index) => ({
  id: index + 1,
  name: `NA-${index + 1}`
}));

export default function AddCandidate() {
  const [name, setName] = useState('');
  const [districtId, setDistrictId] = useState('');
  const [partyId, setPartyId] = useState('');
  const [constituencyId, setConstituencyId] = useState('');
  const [position, setPosition] = useState('');
  const [area, setArea] = useState('');
  const [division, setDivision] = useState('');
  const [phone, setPhone] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [nic, setNic] = useState('');
  const [address, setAddress] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Add Candidate:', {
      name,
      district_id: districtId,
      party_id: partyId,
      constituency_id: constituencyId,
      position,
      area,
      division,
      phone,
      mobile,
      email,
      nic,
      address
    });
    alert('Add Candidate functionality will be implemented with backend API');
  };

  return (
    <div className="content-wrapper">
      <div className="row">
        <div className="col-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <Link to="/admin/candidates" style={{ float: 'right' }}>
                Show all candidates
              </Link>
              <p className="card-title"><strong>Add new candidate</strong></p>
              <p className="card-description"></p>

              <form
                className="form-sample"
                onSubmit={handleSubmit}
                encType="multipart/form-data"
                id="record_note_form"
              >
                <div className="row">
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>Candidate Name</label>
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
                      <label>District</label>
                      <select
                        name="district_id"
                        id="district_id"
                        className="js-example-basic-single w-100 form-control form-control-lg"
                        value={districtId}
                        onChange={(e) => setDistrictId(e.target.value)}
                      >
                        <option value="">Select</option>
                        {schemeMockDistricts.map((district) => (
                          <option key={district.id} value={district.id.toString()}>
                            {district.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>Party</label>
                      <select
                        name="party_id"
                        id="party_id"
                        className="js-example-basic-single w-100 form-control form-control-lg"
                        value={partyId}
                        onChange={(e) => setPartyId(e.target.value)}
                      >
                        <option value="">Select</option>
                        {mockParties.map((party) => (
                          <option key={party.id} value={party.id.toString()}>
                            {party.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>Constituency</label>
                      <select
                        name="constituency_id"
                        id="constituency_id"
                        className="js-example-basic-single w-100 form-control form-control-lg"
                        value={constituencyId}
                        onChange={(e) => setConstituencyId(e.target.value)}
                      >
                        <option value="">Select</option>
                        {mockConstituencies.map((constituency) => (
                          <option key={constituency.id} value={constituency.id.toString()}>
                            {constituency.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>Position</label>
                      <input
                        type="text"
                        name="position"
                        id="position"
                        value={position}
                        className="form-control"
                        onChange={(e) => setPosition(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>Area</label>
                      <input
                        type="text"
                        name="area"
                        id="area"
                        value={area}
                        className="form-control"
                        onChange={(e) => setArea(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>Division</label>
                      <input
                        type="text"
                        name="division"
                        id="division"
                        value={division}
                        className="form-control"
                        onChange={(e) => setDivision(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>Phone</label>
                      <input
                        type="number"
                        name="phone"
                        id="phone"
                        value={phone}
                        className="form-control"
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
                        value={mobile}
                        className="form-control"
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
                        value={email}
                        className="form-control"
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
                        value={nic}
                        className="form-control"
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
                        value={address}
                        className="form-control"
                        onChange={(e) => setAddress(e.target.value)}
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
