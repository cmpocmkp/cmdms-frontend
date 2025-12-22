/**
 * PTF Module - District Wise Report
 * EXACT replica of admin/ptf/district_wise_report.blade.php from old CMDMS
 */

import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Target, AlertTriangle, CheckCircle } from 'lucide-react';
import {
  generateMockPTFDistrictWiseReport,
  PTFDistrictWiseReport as PTFDistrictWiseReportData
} from '../../../lib/mocks/data/ptfData';

export default function PTFDistrictWiseReport() {
  const [loading, setLoading] = useState(true);
  const [report] = useState<PTFDistrictWiseReportData[]>(() => generateMockPTFDistrictWiseReport());

  useEffect(() => {
    // TODO: Replace with actual API call
    setLoading(false);
  }, []);

  // Calculate summary totals
  const summaryTotals = useMemo(() => {
    return {
      on_target: report.reduce((sum, item) => sum + item.on_target, 0),
      critically_delayed: report.reduce((sum, item) => sum + item.critically_delayed, 0),
      completed: report.reduce((sum, item) => sum + item.closed, 0)
    };
  }, [report]);

  if (loading) {
    return <div className="text-center p-5">Loading...</div>;
  }

  return (
    <div className="content-wrapper">
      <style>{`
        .table img {
          border-radius: 0%;
        }
        .table th img {
          width: 20px;
        }
        .summary-icon {
          width: 20px;
          height: 20px;
          display: inline-block;
          margin-right: 8px;
          vertical-align: middle;
        }
      `}</style>
      
      {/* Summary Section */}
      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="card-body">
              <table className="table">
                <tbody>
                  <tr>
                    <td>
                      <Target className="summary-icon" style={{ color: '#17c653' }} size={20} />
                      On Target
                    </td>
                    <td>
                      <Link to="/admin/ptf/list-issue-all?status=1&type=on">
                        {summaryTotals.on_target}
                      </Link>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <AlertTriangle className="summary-icon" style={{ color: '#E74039' }} size={20} />
                      Critically Delayed
                    </td>
                    <td>
                      <Link to="/admin/ptf/list-issue-all?status=2&type=on">
                        {summaryTotals.critically_delayed}
                      </Link>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <CheckCircle className="summary-icon" style={{ color: '#0E8160' }} size={20} />
                      Completed
                    </td>
                    <td>
                      <Link to="/admin/ptf/list-issue-all?status=3&type=on">
                        {summaryTotals.completed}
                      </Link>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* District-wise PTF Issue Report */}
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">District-wise PTF Issue Report</h4>
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>District</th>
                      <th>Total Issues</th>
                      <th>Pending</th>
                      <th>Open</th>
                      <th>Rejected</th>
                      <th>
                        <CheckCircle size={20} style={{ color: '#0E8160', display: 'inline-block', verticalAlign: 'middle' }} />
                        {' '}Closed
                      </th>
                      <th>
                        <AlertTriangle size={20} style={{ color: '#E74039', display: 'inline-block', verticalAlign: 'middle' }} />
                        {' '}Critically Delayed
                      </th>
                      <th>
                        <Target size={20} style={{ color: '#17c653', display: 'inline-block', verticalAlign: 'middle' }} />
                        {' '}On Target
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.length > 0 ? (
                      report.map((row) => (
                        <tr key={row.department_id}>
                          <td>{row.department.name}</td>
                          <td>{row.total}</td>
                          <td>{row.pending}</td>
                          <td>{row.open}</td>
                          <td>{row.rejected}</td>
                          <td>{row.closed}</td>
                          <td>{row.critically_delayed}</td>
                          <td>{row.on_target}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={8} className="text-center">No data available</td>
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
