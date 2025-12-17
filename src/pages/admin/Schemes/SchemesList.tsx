/**
 * Schemes List - Admin Module
 * EXACT replica of admin/schemes/index.blade.php from old CMDMS
 */

import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { mockSchemes, schemeTypes, schemeCategories } from '../../../lib/mocks/data/schemes';
import { schemeMockDistricts } from '../../../lib/mocks/data/schemes';

export default function SchemesList() {
  const [schemes] = useState(mockSchemes);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter schemes based on search term
  const filteredSchemes = useMemo(() => {
    if (!searchTerm.trim()) {
      return schemes;
    }

    const lowerSearchTerm = searchTerm.toLowerCase();
    return schemes.filter((scheme) => {
      const district = schemeMockDistricts.find(d => d.id === scheme.district_id);
      const districtName = district?.name.toLowerCase() || '';
      const schemeName = scheme.name.toLowerCase();
      const code = scheme.code.toLowerCase();
      const category = schemeCategories[scheme.category]?.toLowerCase() || scheme.category.toLowerCase();
      const type = schemeTypes[scheme.type]?.toLowerCase() || scheme.type.toLowerCase();

      return (
        schemeName.includes(lowerSearchTerm) ||
        code.includes(lowerSearchTerm) ||
        districtName.includes(lowerSearchTerm) ||
        category.includes(lowerSearchTerm) ||
        type.includes(lowerSearchTerm)
      );
    });
  }, [schemes, searchTerm]);

  return (
    <div className="content-wrapper">
      <style>
        {`
          table#schemes-listing {
            width: 100% !important;
          }
          table#schemes-listing td {
            color: blue !important;
            font-size: 16px !important;
          }
          #schemes-listing td ul li {
            font-size: 16px !important;
          }
          table#schemes-listing th {
            font-size: 16px !important;
          }
          table#schemes-listing td small {
            color: black !important;
          }
        `}
      </style>
      <div className="card">
        <div className="card-body">
          <Link to="/admin/schemes/add" style={{ float: 'right' }}>
            Add Scheme
          </Link>
          <h4 className="card-title text-primary">All Schemes</h4>

          {/* Search input */}
          <div className="row mb-3">
            <div className="col-md-4">
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search schemes by name, code, district, category, or type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-12">
              <div className="table-responsive">
                <table id="schemes-listing" className="table table-striped" role="grid">
                  <thead style={{ background: 'rgb(37, 136, 95)', color: 'white' }}>
                    <tr>
                      <th style={{ width: '15px' }}>S.No</th>
                      <th style={{ width: '300px' }}>Scheme</th>
                      <th style={{ width: '15px' }}>district</th>
                      <th style={{ width: '15px' }}>code</th>
                      <th style={{ width: '15px' }}>category</th>
                      <th style={{ width: '15px' }}>type</th>
                      <th style={{ width: '100px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSchemes.length > 0 ? (
                      filteredSchemes.map((scheme, index) => {
                        // Find district name from district_id
                        const district = schemeMockDistricts.find(d => d.id === scheme.district_id);

                        return (
                          <tr key={scheme.id}>
                            <td style={{ width: '15px' }}>{index + 1}</td>
                            <td style={{ width: '300px', whiteSpace: 'pre-wrap' }}>
                              <div dangerouslySetInnerHTML={{ __html: scheme.name }} />
                            </td>
                            <td style={{ width: '15px' }}>{district?.name || ''}</td>
                            <td style={{ width: '15px' }}>
                              <div dangerouslySetInnerHTML={{ __html: scheme.code }} />
                            </td>
                            <td style={{ width: '15px' }}>
                              {schemeCategories[scheme.category] || scheme.category}
                            </td>
                            <td style={{ width: '15px' }}>
                              {schemeTypes[scheme.type] || scheme.type}
                            </td>
                            <td style={{ width: '100px' }}>
                              <Link
                                to={`/admin/schemes/edit/${scheme.id}`}
                                className="text-primary mr-2"
                              >
                                Edit
                              </Link>
                              &nbsp;&nbsp;
                              <form
                                action="#"
                                method="POST"
                                style={{ float: 'left', marginLeft: '10px', display: 'inline' }}
                                onSubmit={(e) => {
                                  e.preventDefault();
                                  if (confirm('Are you sure to delete?')) {
                                    console.log('Delete scheme:', scheme.id);
                                    alert('Delete functionality will be implemented with backend API');
                                  }
                                }}
                              >
                                <button
                                  type="submit"
                                  className="btn btn-danger btn-sm btn-icon-text mt-4"
                                  title="delete"
                                >
                                  <i className="ti-trash icon-sm"></i>
                                </button>
                              </form>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={7}>
                          {searchTerm ? `No schemes found matching "${searchTerm}"` : 'There is no data.'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}