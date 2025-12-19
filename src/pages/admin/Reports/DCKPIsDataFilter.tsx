/**
 * DC KPIs Data Filter
 * EXACT replica of admin/kpidata/show
 */

import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../../../lib/api';

export default function DCKPIsDataFilter() {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [kpiData, setKpiData] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');

  useEffect(() => {
    // TODO: Fetch districts and KPI data
    setLoading(false);
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // TODO: Replace with actual API call
    setLoading(false);
  };

  if (loading) {
    return <div className="text-center p-5">Loading...</div>;
  }

  return (
    <div className="content-wrapper">
      <div className="card">
        <div className="card-body">
          <center>
            <h3>DC KPIs Data Filter</h3>
          </center>
          
          <form className="forms-sample mt-4" onSubmit={handleSearch}>
            <div className="row">
              <div className="col-md-4">
                <label>District</label>
                <div className="form-group">
                  <select
                    name="district_id"
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    className="form-control"
                  >
                    <option value="">All Districts</option>
                    {districts.map((district) => (
                      <option key={district.id} value={district.id}>
                        {district.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="col-md-2">
                <div className="form-group mt-4">
                  <button type="submit" className="btn btn-success">Search</button>
                </div>
              </div>
            </div>
          </form>

          <div className="row mt-4">
            <div className="col-12">
              <div className="table-responsive">
                <table className="table table-striped table-bordered">
                  <thead style={{ background: 'rgb(37, 136, 95)', color: 'white' }}>
                    <tr>
                      <th>S#</th>
                      <th>District</th>
                      <th>DC Name</th>
                      <th>KPI Name</th>
                      <th>Target</th>
                      <th>Achieved</th>
                      <th>Percentage</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {kpiData.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="text-center">No data available</td>
                      </tr>
                    ) : (
                      kpiData.map((item, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{item.district_name}</td>
                          <td>{item.dc_name}</td>
                          <td>{item.kpi_name}</td>
                          <td>{item.target}</td>
                          <td>{item.achieved}</td>
                          <td>{item.percentage}%</td>
                          <td>
                            <span className={`badge badge-${item.status_class || 'info'}`}>
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))
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
