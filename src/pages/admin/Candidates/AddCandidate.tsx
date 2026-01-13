/**
 * Add Candidate - Admin Module
 * EXACT replica of admin/candidates/add.blade.php from old CMDMS
 * Integrated with real API following API_INTEGRATION_GUIDE.md
 * 
 * Note: API supports: name, party, constituencyId
 * Additional form fields (districtId, position, area, division, phone, mobile, email, nic, address) are UI-only and not sent to API
 */

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as candidateService from '../../../lib/services/candidateService';
import { USE_MOCK_DATA } from '../../../lib/api';
import { schemeMockDistricts } from '../../../lib/mocks/data/schemes';

export default function AddCandidate() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [constituencies, setConstituencies] = useState<candidateService.Constituency[]>([]);

  // API fields
  const [name, setName] = useState('');
  const [party, setParty] = useState('');
  const [constituencyId, setConstituencyId] = useState<string>('');

  // UI-only fields (not sent to API)
  const [districtId, setDistrictId] = useState('');
  const [position, setPosition] = useState('');
  const [area, setArea] = useState('');
  const [division, setDivision] = useState('');
  const [phone, setPhone] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [nic, setNic] = useState('');
  const [address, setAddress] = useState('');

  // Fetch constituencies
  useEffect(() => {
    fetchConstituencies();
  }, []);

  const fetchConstituencies = async () => {
    try {
      if (USE_MOCK_DATA) {
        // Mock constituencies
        const mockConstituencies: candidateService.Constituency[] = Array.from({ length: 50 }, (_, index) => ({
          id: index + 1,
          name: `NA-${index + 1}`
        }));
        setConstituencies(mockConstituencies);
      } else {
        // Real API call
        const response = await candidateService.listConstituencies();
        if (response.success && response.data) {
          setConstituencies(response.data);
        } else {
          // Fallback to mock
          const mockConstituencies: candidateService.Constituency[] = Array.from({ length: 50 }, (_, index) => ({
            id: index + 1,
            name: `NA-${index + 1}`
          }));
          setConstituencies(mockConstituencies);
        }
      }
    } catch (err: any) {
      console.error('Error fetching constituencies:', err);
      // Fallback to mock
      const mockConstituencies: candidateService.Constituency[] = Array.from({ length: 50 }, (_, index) => ({
        id: index + 1,
        name: `NA-${index + 1}`
      }));
      setConstituencies(mockConstituencies);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);

      // Map form data to API format (only documented fields)
      const apiData: candidateService.CreateCandidateRequest = {
        name: name || '',
        party: party || undefined,
        constituencyId: constituencyId ? parseInt(constituencyId, 10) : undefined,
      };

      if (USE_MOCK_DATA) {
        // Mock create
        await new Promise(resolve => setTimeout(resolve, 500));
        alert('Candidate added successfully! (Mock)');
        navigate('/admin/candidates');
      } else {
        // Real API call
        const response = await candidateService.createCandidate(apiData);

        if (response.success && response.data) {
          alert('Candidate added successfully!');
          navigate('/admin/candidates');
        } else {
          setError(response.message || 'Failed to create candidate');
        }
      }
    } catch (err: any) {
      console.error('Error creating candidate:', err);
      setError(err.response?.data?.error?.message || 'Failed to create candidate. Please try again.');
    } finally {
      setLoading(false);
    }
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

              {/* Error Message */}
              {error && (
                <div className="alert alert-danger" role="alert">
                  <i className="ti-alert-circle mr-2"></i>
                  <strong>Error:</strong> {error}
                </div>
              )}

              <form
                className="form-sample"
                onSubmit={handleSubmit}
                encType="multipart/form-data"
                id="record_note_form"
              >
                {/* API Fields */}
                <div className="row">
                  <div className="col-md-4">
                    <div className="form-group">
                      <label>
                        Candidate Name <span className="text-danger">*</span>
                      </label>
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
                  <div className="col-md-4">
                    <div className="form-group">
                      <label>Party</label>
                      <input
                        type="text"
                        name="party"
                        id="party"
                        value={party}
                        className="form-control"
                        onChange={(e) => setParty(e.target.value)}
                        placeholder="e.g., PTI, PML-N, PPP"
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label>Constituency</label>
                      <select
                        name="constituencyId"
                        id="constituency_id"
                        className="js-example-basic-single w-100 form-control form-control-lg"
                        value={constituencyId}
                        onChange={(e) => setConstituencyId(e.target.value)}
                      >
                        <option value="">Select Constituency</option>
                        {constituencies.map((constituency) => (
                          <option key={constituency.id} value={constituency.id.toString()}>
                            {constituency.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* UI-Only Fields (Not sent to API) */}
                <div className="row">
                  <div className="col-md-12">
                    <hr />
                    <small className="text-muted">
                      <strong>Note:</strong> The following fields are UI-only and not sent to the API (not documented in API_INTEGRATION_GUIDE.md):
                    </small>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>District <small className="text-muted">(UI-only)</small></label>
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
                      <label>Position <small className="text-muted">(UI-only)</small></label>
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
                      <label>Area <small className="text-muted">(UI-only)</small></label>
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
                      <label>Division <small className="text-muted">(UI-only)</small></label>
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
                      <label>Phone <small className="text-muted">(UI-only)</small></label>
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
                      <label>Mobile <small className="text-muted">(UI-only)</small></label>
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
                      <label>Email <small className="text-muted">(UI-only)</small></label>
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
                      <label>NIC <small className="text-muted">(UI-only)</small></label>
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
                      <label>Address <small className="text-muted">(UI-only)</small></label>
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

                <button 
                  type="submit" 
                  className="btn btn-success mr-2"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                      Submitting...
                    </>
                  ) : (
                    'Save'
                  )}
                </button>
                <Link to="/admin/candidates" className="btn btn-light">
                  Cancel
                </Link>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
