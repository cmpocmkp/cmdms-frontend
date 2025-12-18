/**
 * Distributed Schemes List - Admin Module
 * EXACT replica of admin/funds/distributions/distributed-schemes.blade.php from old CMDMS
 */

import { Link } from 'react-router-dom';
import { mockAnnualSchemes, approvalStatuses, approvalForums, schemeStatuses } from '../../../../lib/mocks/data/annualSchemes';
import { schemeMockDistricts, schemeCategories, schemeTypes } from '../../../../lib/mocks/data/schemes';

// Format date as 'd-m-Y'
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

export default function DistributedSchemesList() {
  // Filter schemes that have fund distributions
  const distributedSchemes = mockAnnualSchemes.filter(s => s.fundDistributions && s.fundDistributions.length > 0);

  return (
    <div className="content-wrapper">
      <style>
        {`
          table#annual_scheme_table th {
            border: 1px solid silver;
          }
        `}
      </style>
      <div className="card">
        <div className="card-body">
          <Link to="/admin/funds/annualschemes" style={{ float: 'right' }}>
            Annual Schemes
          </Link>
          <h4 className="card-title text-primary">Distributed Schemes</h4>
          <div className="row">
            <div className="col-12">
              <div className="table-responsive">
                <table id="annual_scheme_table" className="table table-bordered text-center align-middle">
                  <thead className="table-light">
                    <tr>
                      <th rowSpan={2}>ADP S.#</th>
                      <th rowSpan={2}>
                        Code, Name of the Scheme<br />
                        (Status) with forum and<br />
                        date of last approval
                      </th>
                      <th rowSpan={2}>Sector - SubSector / Status</th>
                      <th rowSpan={2}>Progress</th>
                      <th rowSpan={2}>Districts</th>
                      <th rowSpan={2}>
                        Action<br />
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {distributedSchemes.length > 0 ? (
                      distributedSchemes.map((annualScheme) => {
                        const districts = schemeMockDistricts.filter(d => annualScheme.districts.includes(d.id));
                        return (
                          <tr key={annualScheme.id}>
                            <td>{annualScheme.serial_no}</td>
                            <td>
                              {annualScheme.code} -{' '}
                              <div dangerouslySetInnerHTML={{ __html: annualScheme.name }} />
                              <br />
                              ({approvalStatuses[annualScheme.is_approved] || annualScheme.is_approved}) /{' '}
                              {approvalForums[annualScheme.approval_forum] || annualScheme.approval_forum} /{' '}
                              {formatDate(annualScheme.approval_date)}
                            </td>
                            <td>
                              {annualScheme.sector_name} - {annualScheme.sub_sector_name}
                              <br />
                              {schemeStatuses[annualScheme.status] || annualScheme.status}
                              <br />
                              {schemeCategories[annualScheme.category] || annualScheme.category}
                              <br />
                              {schemeTypes[annualScheme.type] || annualScheme.type}
                            </td>
                            <td>
                              {annualScheme.financial_progress && (
                                <div dangerouslySetInnerHTML={{ __html: annualScheme.financial_progress }} />
                              )}
                              <br />
                              {annualScheme.physical_progress && (
                                <div dangerouslySetInnerHTML={{ __html: annualScheme.physical_progress }} />
                              )}
                            </td>
                            <td>
                              {districts.length > 0 && (
                                <>
                                  ({districts.length})
                                  <br />
                                </>
                              )}
                              {districts.map((district, idx) => (
                                <div key={district.id}>
                                  {district.name}
                                  {idx < districts.length - 1 && <br />}
                                </div>
                              ))}
                            </td>
                            <td>
                              <div>
                                <Link
                                  to={`/admin/funds/distributions/edit?scheme=${annualScheme.id}`}
                                  style={{ display: 'block', float: 'left', marginLeft: '20px' }}
                                  className="text-primary mr-2 mb-2"
                                >
                                  <button type="button" className="btn btn-success btn-md">
                                    Update Distribution
                                  </button>
                                </Link>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={6} style={{ textAlign: 'center' }}>no data so far</td>
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
