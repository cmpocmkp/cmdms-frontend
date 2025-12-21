/**
 * KPI Data Reports - Index
 * EXACT replica of admin/kpi/data/index.blade.php from old CMDMS
 * Includes KPI Dashboard Cards from admin/report/khushhalkpk/index.blade.php
 */

import { mockKPIsData, mockTodayKPIsData, mockYesterdayKPIsData, mockKPICards } from '../../../lib/mocks/data/kpiData';
import { List, Check, Target, RefreshCw, AlertTriangle, Clock } from 'lucide-react';

// Helper function to capitalize words
const capitalizeWords = (str: string): string => {
  if (!str) return '';
  return str.toLowerCase().split(' ').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
};

// Icon mapping for KPI cards
const getIcon = (iconName: string) => {
  const iconMap: { [key: string]: React.ReactNode } = {
    'ti-list': <List size={24} />,
    'ti-check': <Check size={24} />,
    'ti-target': <Target size={24} />,
    'ti-reload': <RefreshCw size={24} />,
    'ti-alert': <AlertTriangle size={24} />,
    'ti-timer': <Clock size={24} />
  };
  return iconMap[iconName] || <List size={24} />;
};

export default function KPIDataReports() {
  return (
    <div className="content-wrapper">
      <style>{`
        .record-notes-custom-card-analytics {
          border-radius: 15px;
          margin-bottom: 10px !important;
          background: #fff !important;
          transition: all 0.2s linear;
          height: auto !important;
          padding: 0px !important;
        }
        .card.record-notes-custom-card-analytics {
          border: 2px solid #e3e3e3;
        }
        .record-notes-custom-card-analytics p {
          color: #000 !important;
          text-align: left !important;
          margin: 5px 0 !important;
        }
        .record-notes-custom-card-analytics .icon {
          width: 60px;
          height: 60px;
          border-radius: 100%;
          margin-bottom: 10px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .record-notes-custom-card-analytics .icon svg {
          color: white !important;
        }
        .record-notes-custom-card-analytics .card-body {
          display: flex;
          justify-content: flex-start !important;
          flex-direction: column;
          padding: 15px !important;
        }
        .record-notes-custom-card-analytics h3 {
          text-align: left !important;
          font-size: 2rem !important;
          margin-bottom: 0.5rem !important;
        }
        .record-notes-custom-card-analytics .card-body p.mb-0 {
          font-size: 1rem !important;
          font-weight: 400 !important;
        }
      `}</style>
      <div className="card">
        <div className="card-body">
          <h1 className="card-title text-success text-center" style={{ fontSize: '18px', marginBottom: '2rem' }}>
            KHUSHHAAL KHYBER PAKHTUNKHWA PROGRAMME
          </h1>

          {/* KPI Dashboard Cards */}
          <div className="row my-5 d-flex justify-content-end">
            {mockKPICards.map((card, index) => (
              <div key={index} className="col-md-2 p-2">
                <div 
                  className="card record-notes-custom-card-analytics" 
                  style={{ borderBottom: `8px solid ${card.borderColor}` }}
                >
                  <div className="card-body">
                    <div className="icon" style={{ background: card.borderColor }}>
                      {getIcon(card.icon)}
                    </div>
                    <h3 className="mb-2" style={{ color: card.borderColor }}>
                      {card.value}
                    </h3>
                    <p>{card.title}</p>
                    {card.showPercent && (
                      <p className="mb-0 mt-2">
                        {card.percent === 0 || card.percent === undefined ? '\u00A0' : `${card.percent}%`}
                      </p>
                    )}
                    {!card.showPercent && (
                      <p className="mb-0 mt-2">&nbsp;</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* DCs and DPOs Report Card */}
          <div className="row">
            <div className="col-md-12 grid-margin">
              <div className="card d-flex align-items-center" style={{ backgroundColor: '#e7940b' }}>
                <div className="card-body">
                  <div className="d-flex flex-row align-items-center">
                    <div className="ml-2">
                      <h3 className="text-white">DCs and DPOs Report</h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* DCs and DPOs Report Tables */}
          <div className="row">
            <div className="col-12">
              <div className="table-responsive">
                {mockKPIsData.length > 0 ? (
                  mockKPIsData.map((kpiData) => (
                    <div key={kpiData.id}>
                      <h4 style={{ color: 'blueviolet' }}>
                        {capitalizeWords(kpiData.description || '')} - {capitalizeWords(kpiData.name || '')}
                        :Total <span className="badge badge-success badge-pill">
                          {kpiData.users.length}
                        </span>
                      </h4>
                      <table className="kpidataexport table table-striped table-borderless">
                        <thead>
                          <tr>
                            <th>NO.</th>
                            <th>Name</th>
                            <th>District</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {kpiData.users.length > 0 ? (
                            kpiData.users.map((user, index) => (
                              <tr key={user.id}>
                                <td>{index + 1}</td>
                                <td>{capitalizeWords(user.name || '')}</td>
                                <td>{capitalizeWords(user.district_name || '')}</td>
                                <td>{user.has_kpi_data ? 'yes' : 'no'}</td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={4}>&nbsp;</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                      <br />
                    </div>
                  ))
                ) : (
                  <div>&nbsp;</div>
                )}
              </div>
            </div>
          </div>

          {/* Today Data Report Card */}
          <div className="row">
            <div className="col-md-12 grid-margin">
              <div className="card d-flex align-items-center" style={{ backgroundColor: '#e7e704', color: 'black' }}>
                <div className="card-body">
                  <div className="d-flex flex-row align-items-center">
                    <div className="ml-2">
                      <h3 className="text-black">Today Data Report</h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Today Data Report Tables */}
          <div className="row">
            <div className="col-12">
              <div className="table-responsive">
                {mockTodayKPIsData.length > 0 ? (
                  mockTodayKPIsData.map((kpiData) => (
                    <div key={kpiData.id}>
                      <h4 style={{ color: 'blueviolet' }}>
                        {capitalizeWords(kpiData.description || '')} - {capitalizeWords(kpiData.name || '')}
                        :Total <span className="badge badge-success badge-pill">
                          {kpiData.users.length}
                        </span>
                      </h4>
                      <table className="kpidataexport table table-striped table-borderless">
                        <thead>
                          <tr>
                            <th>NO.</th>
                            <th>Name</th>
                            <th>District</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {kpiData.users.length > 0 ? (
                            kpiData.users.map((user, index) => (
                              <tr key={user.id}>
                                <td>{index + 1}</td>
                                <td>{capitalizeWords(user.name || '')}</td>
                                <td>{capitalizeWords(user.district_name || '')}</td>
                                <td>{user.has_kpi_data ? 'yes' : 'no'}</td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={4}>&nbsp;</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                      <br />
                    </div>
                  ))
                ) : (
                  <div>&nbsp;</div>
                )}
              </div>
            </div>
          </div>

          {/* Yesterday Data Report Card */}
          <div className="row">
            <div className="col-md-12 grid-margin">
              <div className="card d-flex align-items-center" style={{ backgroundColor: 'blue', color: 'white' }}>
                <div className="card-body">
                  <div className="d-flex flex-row align-items-center">
                    <div className="ml-2">
                      <h3 className="text-white">Yesterday Data Report</h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Yesterday Data Report Tables */}
          <div className="row">
            <div className="col-12">
              <div className="table-responsive">
                {mockYesterdayKPIsData.length > 0 ? (
                  mockYesterdayKPIsData.map((kpiData) => (
                    <div key={kpiData.id}>
                      <h4 style={{ color: 'blueviolet' }}>
                        {capitalizeWords(kpiData.description || '')} - {capitalizeWords(kpiData.name || '')}
                        :Total <span className="badge badge-success badge-pill">
                          {kpiData.users.length}
                        </span>
                      </h4>
                      <table className="kpidataexport table table-striped table-borderless">
                        <thead>
                          <tr>
                            <th>NO.</th>
                            <th>Name</th>
                            <th>District</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {kpiData.users.length > 0 ? (
                            kpiData.users.map((user, index) => (
                              <tr key={user.id}>
                                <td>{index + 1}</td>
                                <td>{capitalizeWords(user.name || '')}</td>
                                <td>{capitalizeWords(user.district_name || '')}</td>
                                <td>{user.has_kpi_data ? 'yes' : 'no'}</td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={4}>&nbsp;</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                      <br />
                    </div>
                  ))
                ) : (
                  <div>&nbsp;</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
