/**
 * DC Inspection Details Report
 * EXACT replica of admin/report/kpi/dc/index.blade.php from old CMDMS
 */

import React, { useState, useMemo } from 'react';
import { generateMockDistrictInspectionData } from '../../../lib/mocks/data/kpiData';

export default function DCInspectionDetailsReport() {
  const [searchTerm, setSearchTerm] = useState('');
  const districtWiseInspectionReport = useMemo(() => generateMockDistrictInspectionData(), []);

  // Filter districts based on search term
  const filteredDistricts = useMemo(() => {
    if (!searchTerm) return districtWiseInspectionReport;
    
    const lowerSearch = searchTerm.toLowerCase();
    return districtWiseInspectionReport.filter(district =>
      district.name.toLowerCase().includes(lowerSearch)
    );
  }, [districtWiseInspectionReport, searchTerm]);

  // Calculate totals based on filtered data
  const totals = useMemo(() => {
    const adultrationCountArray: Array<{
      unitinspected: number;
      finecollected: number;
      warningissued: number;
      firregistered: number;
      unitssealed: number;
      noofoffences: number;
    }> = [];
    const spuriousCountArray: typeof adultrationCountArray = [];
    const priceCheckingCountArray: typeof adultrationCountArray = [];
    const hoardingCountArray: typeof adultrationCountArray = [];

    filteredDistricts.forEach((district) => {
      if (district.kpiData.length > 0) {
        const singleKpiData = new Map<number, typeof district.kpiData>();
        district.kpiData.forEach((kpi) => {
          if (!singleKpiData.has(kpi.kpi_id)) {
            singleKpiData.set(kpi.kpi_id, []);
          }
          singleKpiData.get(kpi.kpi_id)!.push(kpi);
        });

        const adultration = singleKpiData.get(18)?.slice(0, 6) || [];
        const spurious = singleKpiData.get(19)?.slice(0, 6) || [];
        const priceChecking = singleKpiData.get(20)?.slice(0, 6) || [];
        const hoarding = singleKpiData.get(21)?.slice(0, 6) || [];

        if (adultration.length === 6) {
          adultrationCountArray.push({
            unitinspected: Number(adultration[0]?.value || 0),
            finecollected: Number(adultration[1]?.value || 0),
            warningissued: Number(adultration[2]?.value || 0),
            firregistered: Number(adultration[3]?.value || 0),
            unitssealed: Number(adultration[4]?.value || 0),
            noofoffences: Number(adultration[5]?.value || 0)
          });
        }

        if (spurious.length === 6) {
          spuriousCountArray.push({
            unitinspected: Number(spurious[0]?.value || 0),
            finecollected: Number(spurious[1]?.value || 0),
            warningissued: Number(spurious[2]?.value || 0),
            firregistered: Number(spurious[3]?.value || 0),
            unitssealed: Number(spurious[4]?.value || 0),
            noofoffences: Number(spurious[5]?.value || 0)
          });
        }

        if (priceChecking.length === 6) {
          priceCheckingCountArray.push({
            unitinspected: Number(priceChecking[0]?.value || 0),
            finecollected: Number(priceChecking[1]?.value || 0),
            warningissued: Number(priceChecking[2]?.value || 0),
            firregistered: Number(priceChecking[3]?.value || 0),
            unitssealed: Number(priceChecking[4]?.value || 0),
            noofoffences: Number(priceChecking[5]?.value || 0)
          });
        }

        if (hoarding.length === 6) {
          hoardingCountArray.push({
            unitinspected: Number(hoarding[0]?.value || 0),
            finecollected: Number(hoarding[1]?.value || 0),
            warningissued: Number(hoarding[2]?.value || 0),
            firregistered: Number(hoarding[3]?.value || 0),
            unitssealed: Number(hoarding[4]?.value || 0),
            noofoffences: Number(hoarding[5]?.value || 0)
          });
        }
      }
    });

    return {
      adultration: {
        unitinspected: adultrationCountArray.reduce((sum, item) => sum + item.unitinspected, 0),
        finecollected: adultrationCountArray.reduce((sum, item) => sum + item.finecollected, 0),
        warningissued: adultrationCountArray.reduce((sum, item) => sum + item.warningissued, 0),
        firregistered: adultrationCountArray.reduce((sum, item) => sum + item.firregistered, 0),
        unitssealed: adultrationCountArray.reduce((sum, item) => sum + item.unitssealed, 0),
        noofoffences: adultrationCountArray.reduce((sum, item) => sum + item.noofoffences, 0)
      },
      spurious: {
        unitinspected: spuriousCountArray.reduce((sum, item) => sum + item.unitinspected, 0),
        finecollected: spuriousCountArray.reduce((sum, item) => sum + item.finecollected, 0),
        warningissued: spuriousCountArray.reduce((sum, item) => sum + item.warningissued, 0),
        firregistered: spuriousCountArray.reduce((sum, item) => sum + item.firregistered, 0),
        unitssealed: spuriousCountArray.reduce((sum, item) => sum + item.unitssealed, 0),
        noofoffences: spuriousCountArray.reduce((sum, item) => sum + item.noofoffences, 0)
      },
      priceChecking: {
        unitinspected: priceCheckingCountArray.reduce((sum, item) => sum + item.unitinspected, 0),
        finecollected: priceCheckingCountArray.reduce((sum, item) => sum + item.finecollected, 0),
        warningissued: priceCheckingCountArray.reduce((sum, item) => sum + item.warningissued, 0),
        firregistered: priceCheckingCountArray.reduce((sum, item) => sum + item.firregistered, 0),
        unitssealed: priceCheckingCountArray.reduce((sum, item) => sum + item.unitssealed, 0),
        noofoffences: priceCheckingCountArray.reduce((sum, item) => sum + item.noofoffences, 0)
      },
      hoarding: {
        unitinspected: hoardingCountArray.reduce((sum, item) => sum + item.unitinspected, 0),
        finecollected: hoardingCountArray.reduce((sum, item) => sum + item.finecollected, 0),
        warningissued: hoardingCountArray.reduce((sum, item) => sum + item.warningissued, 0),
        firregistered: hoardingCountArray.reduce((sum, item) => sum + item.firregistered, 0),
        unitssealed: hoardingCountArray.reduce((sum, item) => sum + item.unitssealed, 0),
        noofoffences: hoardingCountArray.reduce((sum, item) => sum + item.noofoffences, 0)
      }
    };
  }, [filteredDistricts]);

  // Handle CSV Export
  const handleCSVExport = () => {
    const headers = [
      'S#',
      'District',
      'Adultration - Units Inspected',
      'Adultration - Fine Collected',
      'Adultration - Warnings Issued',
      'Adultration - FIR\'s Registered',
      'Adultration - Units Sealed',
      'Adultration - No of offences',
      'Spurious - Units Inspected',
      'Spurious - Fine Collected',
      'Spurious - Warnings Issued',
      'Spurious - FIR\'s Registered',
      'Spurious - Units Sealed',
      'Spurious - No of offences',
      'Price Checking - Units Inspected',
      'Price Checking - Fine Collected',
      'Price Checking - Warnings Issued',
      'Price Checking - FIR\'s Registered',
      'Price Checking - Units Sealed',
      'Price Checking - No of offences',
      'Hoarding - Units Inspected',
      'Hoarding - Fine Collected',
      'Hoarding - Warnings Issued',
      'Hoarding - FIR\'s Registered',
      'Hoarding - Units Sealed',
      'Hoarding - No of offences'
    ];

    const rows: string[][] = [];

    filteredDistricts.forEach((district, index) => {
      const singleKpiData = new Map<number, typeof district.kpiData>();
      district.kpiData.forEach((kpi) => {
        if (!singleKpiData.has(kpi.kpi_id)) {
          singleKpiData.set(kpi.kpi_id, []);
        }
        singleKpiData.get(kpi.kpi_id)!.push(kpi);
      });

      const adultration = singleKpiData.get(18)?.slice(0, 6) || Array(6).fill({ value: 0 });
      const spurious = singleKpiData.get(19)?.slice(0, 6) || Array(6).fill({ value: 0 });
      const priceChecking = singleKpiData.get(20)?.slice(0, 6) || Array(6).fill({ value: 0 });
      const hoarding = singleKpiData.get(21)?.slice(0, 6) || Array(6).fill({ value: 0 });

      const row = [
        String(index + 1),
        district.name,
        String(adultration[0]?.value || 0),
        String(adultration[1]?.value || 0),
        String(adultration[2]?.value || 0),
        String(adultration[3]?.value || 0),
        String(adultration[4]?.value || 0),
        String(adultration[5]?.value || 0),
        String(spurious[0]?.value || 0),
        String(spurious[1]?.value || 0),
        String(spurious[2]?.value || 0),
        String(spurious[3]?.value || 0),
        String(spurious[4]?.value || 0),
        String(spurious[5]?.value || 0),
        String(priceChecking[0]?.value || 0),
        String(priceChecking[1]?.value || 0),
        String(priceChecking[2]?.value || 0),
        String(priceChecking[3]?.value || 0),
        String(priceChecking[4]?.value || 0),
        String(priceChecking[5]?.value || 0),
        String(hoarding[0]?.value || 0),
        String(hoarding[1]?.value || 0),
        String(hoarding[2]?.value || 0),
        String(hoarding[3]?.value || 0),
        String(hoarding[4]?.value || 0),
        String(hoarding[5]?.value || 0)
      ];
      rows.push(row);
    });

    // Add total row
    rows.push([
      'Total',
      '',
      String(totals.adultration.unitinspected),
      String(totals.adultration.finecollected),
      String(totals.adultration.warningissued),
      String(totals.adultration.firregistered),
      String(totals.adultration.unitssealed),
      String(totals.adultration.noofoffences),
      String(totals.spurious.unitinspected),
      String(totals.spurious.finecollected),
      String(totals.spurious.warningissued),
      String(totals.spurious.firregistered),
      String(totals.spurious.unitssealed),
      String(totals.spurious.noofoffences),
      String(totals.priceChecking.unitinspected),
      String(totals.priceChecking.finecollected),
      String(totals.priceChecking.warningissued),
      String(totals.priceChecking.firregistered),
      String(totals.priceChecking.unitssealed),
      String(totals.priceChecking.noofoffences),
      String(totals.hoarding.unitinspected),
      String(totals.hoarding.finecollected),
      String(totals.hoarding.warningissued),
      String(totals.hoarding.firregistered),
      String(totals.hoarding.unitssealed),
      String(totals.hoarding.noofoffences)
    ]);

    let csv = headers.join(',') + '\n';
    rows.forEach(row => {
      csv += row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',') + '\n';
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `dc_inspection_report_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <div className="content-wrapper">
      <style>{`
        .table-bordered thead th,
        .table-bordered thead td {
          border-bottom-width: 1px !important;
          font-size: 12px !important;
          font-weight: 300 !important;
          text-align: center !important;
        }
        th.verticle-headings {
          height: 150px !important;
          vertical-align: middle !important;
          text-align: center !important;
          word-wrap: break-word;
        }
        th.verticle-headings p {
          font-size: 10px;
          width: 33px;
          margin: 0px !important;
          white-space: pre;
          transform: rotate(90deg);
        }
        .table-bordered th,
        .table-bordered td {
          border: 1px solid #c9ccd7;
          font-size: 12px;
          font-weight: 300;
          text-align: center;
        }
        tr.inspection-total-row th {
          font-weight: bolder !important;
          font-size: 12px;
          background: #ddd;
          text-align: center;
          height: 35px;
          color: #787878;
        }
        tr.inspection-body-row td {
          color: #98989f !important;
          font-size: 12px !important;
          padding: 3px !important;
          font-weight: 500 !important;
        }
        .card-body p {
          font-size: 12px;
        }
        /* DataTables Export Buttons Styling */
        .dt-buttons-wrapper {
          margin-bottom: 1rem !important;
          display: block !important;
          visibility: visible !important;
        }
        .dt-buttons {
          display: inline-block !important;
          visibility: visible !important;
        }
        .dt-button {
          display: inline-block !important;
          background-color: #fff !important;
          background-image: linear-gradient(to bottom, #fff 0%, #e0e0e0 100%) !important;
          border: 1px solid #999 !important;
          border-radius: 2px !important;
          color: #333 !important;
          cursor: pointer !important;
          font-size: 0.88em !important;
          line-height: 1.6em !important;
          padding: 0.5em 1em !important;
          text-align: center !important;
          text-decoration: none !important;
          user-select: none !important;
          vertical-align: middle !important;
          white-space: nowrap !important;
          margin-left: 0.167em !important;
          margin-right: 0 !important;
          margin-bottom: 0.333em !important;
          visibility: visible !important;
          opacity: 1 !important;
          z-index: 1 !important;
        }
        .dt-button:first-child {
          margin-left: 0 !important;
        }
        .dt-button:hover {
          background-color: #e0e0e0 !important;
          background-image: linear-gradient(to bottom, #f5f5f5 0%, #e0e0e0 100%) !important;
          border-color: #666 !important;
          text-decoration: none !important;
        }
        .dt-button:active {
          background-color: #e0e0e0 !important;
          background-image: none !important;
          box-shadow: inset 0 2px 4px rgba(0,0,0,0.15) !important;
          outline: none !important;
        }
        .dataTables_filter {
          text-align: right !important;
          display: block !important;
          visibility: visible !important;
        }
        .dataTables_filter label {
          font-weight: normal !important;
          white-space: nowrap !important;
          text-align: left !important;
          display: inline-block !important;
          vertical-align: middle !important;
          margin-bottom: 0 !important;
        }
        .dataTables_filter input {
          margin-left: 0.5em !important;
          display: inline-block !important;
          width: auto !important;
          border: 1px solid #aaa !important;
          border-radius: 3px !important;
          padding: 5px !important;
          background-color: transparent !important;
          color: inherit !important;
          font-size: inherit !important;
          margin-bottom: 0 !important;
          visibility: visible !important;
          opacity: 1 !important;
        }
        .dataTables_filter input:focus {
          outline: 2px solid #4A90E2 !important;
          outline-offset: 0 !important;
        }
      `}</style>
      <div className="col-lg-12 grid-margin stretch-card">
        <div className="card">
          <div className="card-body">
            <div className="row">
              <div className="col-md-12">
                <h4 className="card-title">District Wise Breakup</h4>
                
                {/* Export Buttons and Search */}
                <div className="row mb-3" style={{ marginTop: '20px', marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
                  <div className="col-sm-12 col-md-6">
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={handleCSVExport}
                      title="Export to CSV"
                      style={{ 
                        marginRight: '10px',
                        display: 'inline-block',
                        visibility: 'visible',
                        opacity: 1
                      }}
                    >
                      <span>Export CSV</span>
                    </button>
                  </div>
                  <div className="col-sm-12 col-md-6" style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-block' }}>
                      <label style={{ marginRight: '10px', marginBottom: 0 }}>
                        Search:
                      </label>
                      <input
                        type="search"
                        className="form-control form-control-sm"
                        placeholder="Search districts..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ 
                          display: 'inline-block', 
                          width: '200px',
                          visibility: 'visible',
                          opacity: 1
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="table-responsive">
                  <table
                    id="district-wise-breakup"
                    className="table-bordered table-compact"
                    style={{ width: '100%' }}
                  >
                    <thead style={{ background: 'rgb(37, 136, 95)', color: 'white' }}>
                      <tr>
                        <th className="text-center" rowSpan={3}>
                          S#
                        </th>
                        <th className="text-center" rowSpan={3}>
                          District
                        </th>
                        <th className="text-center" colSpan={24} style={{ height: '40px' }}>
                          District Administration
                        </th>
                      </tr>
                      <tr>
                        <th colSpan={6}>
                          <p>Adultration</p>
                        </th>
                        <th colSpan={6}>
                          <p>Spurious</p>
                        </th>
                        <th colSpan={6}>
                          <p>Price Checking</p>
                        </th>
                        <th colSpan={6}>
                          <p>Hoarding</p>
                        </th>
                      </tr>
                      <tr>
                        {/* Adultration columns */}
                        <th className="verticle-headings">
                          <p>Units Inspected</p>
                        </th>
                        <th className="verticle-headings">
                          <p>Fine Collected</p>
                        </th>
                        <th className="verticle-headings">
                          <p>Warnings Issued</p>
                        </th>
                        <th className="verticle-headings">
                          <p>FIR's Registered</p>
                        </th>
                        <th className="verticle-headings">
                          <p>Units Sealed</p>
                        </th>
                        <th className="verticle-headings">
                          <p>No of offences</p>
                        </th>
                        {/* Spurious columns */}
                        <th className="verticle-headings">
                          <p>Units Inspected</p>
                        </th>
                        <th className="verticle-headings">
                          <p>Fine Collected</p>
                        </th>
                        <th className="verticle-headings">
                          <p>Warnings Issued</p>
                        </th>
                        <th className="verticle-headings">
                          <p>FIR's Registered</p>
                        </th>
                        <th className="verticle-headings">
                          <p>Units Sealed</p>
                        </th>
                        <th className="verticle-headings">
                          <p>No of offences</p>
                        </th>
                        {/* Price Checking columns */}
                        <th className="verticle-headings">
                          <p>Units Inspected</p>
                        </th>
                        <th className="verticle-headings">
                          <p>Fine Collected</p>
                        </th>
                        <th className="verticle-headings">
                          <p>Warnings Issued</p>
                        </th>
                        <th className="verticle-headings">
                          <p>FIR's Registered</p>
                        </th>
                        <th className="verticle-headings">
                          <p>Units Sealed</p>
                        </th>
                        <th className="verticle-headings">
                          <p>No of offences</p>
                        </th>
                        {/* Hoarding columns */}
                        <th className="verticle-headings">
                          <p>Units Inspected</p>
                        </th>
                        <th className="verticle-headings">
                          <p>Fine Collected</p>
                        </th>
                        <th className="verticle-headings">
                          <p>Warnings Issued</p>
                        </th>
                        <th className="verticle-headings">
                          <p>FIR's Registered</p>
                        </th>
                        <th className="verticle-headings">
                          <p>Units Sealed</p>
                        </th>
                        <th className="verticle-headings">
                          <p>No of offences</p>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredDistricts.map((district, index) => {
                        const singleKpiData = new Map<number, typeof district.kpiData>();
                        district.kpiData.forEach((kpi) => {
                          if (!singleKpiData.has(kpi.kpi_id)) {
                            singleKpiData.set(kpi.kpi_id, []);
                          }
                          singleKpiData.get(kpi.kpi_id)!.push(kpi);
                        });

                        const adultration = singleKpiData.get(18)?.slice(0, 6) || [];
                        const spurious = singleKpiData.get(19)?.slice(0, 6) || [];
                        const priceChecking = singleKpiData.get(20)?.slice(0, 6) || [];
                        const hoarding = singleKpiData.get(21)?.slice(0, 6) || [];

                        return (
                          <tr key={district.id} className="inspection-body-row">
                            <td>{index + 1}</td>
                            <td style={{ width: '100px', textAlign: 'center' }}>{district.name}</td>

                            {district.kpiData.length > 0 ? (
                              <>
                                {/* Adultration */}
                                {adultration.length === 6 ? (
                                  adultration.map((kpiData) => (
                                    <td key={`adultration-${kpiData.id}`}>{kpiData.value}</td>
                                  ))
                                ) : (
                                  <>
                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>
                                  </>
                                )}

                                {/* Spurious */}
                                {spurious.length === 6 ? (
                                  spurious.map((kpiData) => (
                                    <td key={`spurious-${kpiData.id}`}>{kpiData.value}</td>
                                  ))
                                ) : (
                                  <>
                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>
                                  </>
                                )}

                                {/* Price Checking */}
                                {priceChecking.length === 6 ? (
                                  priceChecking.map((kpiData) => (
                                    <td key={`priceChecking-${kpiData.id}`}>{kpiData.value}</td>
                                  ))
                                ) : (
                                  <>
                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>
                                  </>
                                )}

                                {/* Hoarding */}
                                {hoarding.length === 6 ? (
                                  hoarding.map((kpiData) => (
                                    <td key={`hoarding-${kpiData.id}`}>{kpiData.value}</td>
                                  ))
                                ) : (
                                  <>
                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>
                                  </>
                                )}
                              </>
                            ) : (
                              <>
                                <td>0</td>
                                <td>0</td>
                                <td>0</td>
                                <td>0</td>
                                <td>0</td>
                                <td>0</td>
                                <td>0</td>
                                <td>0</td>
                                <td>0</td>
                                <td>0</td>
                                <td>0</td>
                                <td>0</td>
                                <td>0</td>
                                <td>0</td>
                                <td>0</td>
                                <td>0</td>
                                <td>0</td>
                                <td>0</td>
                                <td>0</td>
                                <td>0</td>
                                <td>0</td>
                                <td>0</td>
                                <td>0</td>
                                <td>0</td>
                              </>
                            )}
                          </tr>
                        );
                      })}
                      {/* Total Row */}
                      <tr className="inspection-total-row">
                        <th colSpan={2}>Total</th>
                        <th>{totals.adultration.unitinspected}</th>
                        <th>{totals.adultration.finecollected}</th>
                        <th>{totals.adultration.warningissued}</th>
                        <th>{totals.adultration.firregistered}</th>
                        <th>{totals.adultration.unitssealed}</th>
                        <th>{totals.adultration.noofoffences}</th>
                        <th>{totals.spurious.unitinspected}</th>
                        <th>{totals.spurious.finecollected}</th>
                        <th>{totals.spurious.warningissued}</th>
                        <th>{totals.spurious.firregistered}</th>
                        <th>{totals.spurious.unitssealed}</th>
                        <th>{totals.spurious.noofoffences}</th>
                        <th>{totals.priceChecking.unitinspected}</th>
                        <th>{totals.priceChecking.finecollected}</th>
                        <th>{totals.priceChecking.warningissued}</th>
                        <th>{totals.priceChecking.firregistered}</th>
                        <th>{totals.priceChecking.unitssealed}</th>
                        <th>{totals.priceChecking.noofoffences}</th>
                        <th>{totals.hoarding.unitinspected}</th>
                        <th>{totals.hoarding.finecollected}</th>
                        <th>{totals.hoarding.warningissued}</th>
                        <th>{totals.hoarding.firregistered}</th>
                        <th>{totals.hoarding.unitssealed}</th>
                        <th>{totals.hoarding.noofoffences}</th>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
