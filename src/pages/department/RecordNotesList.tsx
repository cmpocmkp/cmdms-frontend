/**
 * Department Record Notes List Page
 * EXACT replica of department/recordnotes/index.blade.php from old CMDMS
 * Supports both Record Notes and Cabinet Minutes (via type query param)
 */

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { mockMinutes, mockMinuteDecisions, MinuteDecision } from '../../lib/mocks/data/minutes';
import ReadMore from '../../components/shared/ReadMore';

interface MeetingWithMinutes {
  id: number;
  subject: string;
  date: string;
  attachment?: string;
  minutes: MinuteDecision[];
}

interface StatusSummary {
  total: number;
  'Completed': { count: number; percent: number };
  'On Target': { count: number; percent: number };
  'Overdue': { count: number; percent: number };
  'Ongoing'?: { count: number; percent: number };
  'Off Target'?: { count: number; percent: number };
  'Off Target Other Reason'?: { count: number; percent: number };
  'Overdue Other Reason'?: { count: number; percent: number };
}

// Mock data generator for department record notes
function generateDepartmentRecordNotes(departmentId: number, meetingType: 'normal' | 'cabinet'): {
  meetings: MeetingWithMinutes[];
  summary: StatusSummary;
} {
  // Filter minutes assigned to this department
  const departmentMinutes = mockMinuteDecisions.filter(m => 
    m.departments.includes(departmentId)
  );

  // Group by meeting (minute_id)
  const meetingsMap = new Map<number, MeetingWithMinutes>();
  
  departmentMinutes.forEach(minute => {
    const meeting = mockMinutes.find(m => m.id === minute.minute_id);
    if (!meeting) return;

    if (!meetingsMap.has(meeting.id)) {
      meetingsMap.set(meeting.id, {
        id: meeting.id,
        subject: meeting.subject,
        date: meeting.meeting_date,
        attachment: meeting.attachments?.[0],
        minutes: []
      });
    }

    meetingsMap.get(meeting.id)!.minutes.push(minute);
  });

  const meetings = Array.from(meetingsMap.values());

  // Calculate summary
  const total = departmentMinutes.length;
  const completed = departmentMinutes.filter(m => m.status === 'Completed').length;
  const onTarget = departmentMinutes.filter(m => m.status === 'On Target').length;
  const overdue = departmentMinutes.filter(m => m.status === 'Overdue').length;
  const ongoing = departmentMinutes.filter(m => m.status === 'Ongoing').length;
  const offTarget = departmentMinutes.filter(m => m.status === 'Off Target').length;
  const offTargetOther = departmentMinutes.filter(m => m.status === 'Off Target Other Reason').length;
  const overdueOther = departmentMinutes.filter(m => m.status === 'Overdue Other Reason').length;

  const summary: StatusSummary = {
    total,
    'Completed': {
      count: completed,
      percent: total > 0 ? Math.round((completed / total) * 100) : 0
    },
    'On Target': {
      count: onTarget,
      percent: total > 0 ? Math.round((onTarget / total) * 100) : 0
    },
    'Overdue': {
      count: overdue,
      percent: total > 0 ? Math.round((overdue / total) * 100) : 0
    }
  };

  // Add cabinet-specific statuses
  if (meetingType === 'cabinet') {
    summary['Ongoing'] = {
      count: ongoing,
      percent: total > 0 ? Math.round((ongoing / total) * 100) : 0
    };
    summary['Off Target'] = {
      count: offTarget,
      percent: total > 0 ? Math.round((offTarget / total) * 100) : 0
    };
    summary['Off Target Other Reason'] = {
      count: offTargetOther,
      percent: total > 0 ? Math.round((offTargetOther / total) * 100) : 0
    };
    summary['Overdue Other Reason'] = {
      count: overdueOther,
      percent: total > 0 ? Math.round((overdueOther / total) * 100) : 0
    };
  }

  return { meetings, summary };
}

// Status Badge Component
function StatusBadge({ status }: { status: string }) {
  const statusConfig: { [key: string]: { class: string; label: string } } = {
    'Completed': { class: 'badge-success', label: 'Completed' },
    'On Target': { class: 'badge-info', label: 'On Target' },
    'Overdue': { class: 'badge-danger', label: 'Overdue' },
    'Ongoing': { class: 'badge-warning', label: 'Ongoing' },
    'Off Target': { class: 'badge-danger', label: 'Off Target' },
    'Off Target Other Reason': { class: 'badge-danger', label: 'Off Target Other Reason' },
    'Overdue Other Reason': { class: 'badge-danger', label: 'Overdue Other Reason' }
  };

  const config = statusConfig[status] || { class: 'badge-secondary', label: status };

  return (
    <span className={`badge badge-pill ${config.class}`}>
      {config.label}
    </span>
  );
}

export default function RecordNotesList() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const meetingType = searchParams.get('type') === 'cabinet' ? 'cabinet' : 'normal';
  const statusFilter = searchParams.get('status') || '';
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [currentPage, setCurrentPage] = useState(1);
  const tableRef = useRef<HTMLTableElement>(null);
  const dataTableRef = useRef<any>(null);

  const departmentId = user?.department_id || 14; // Default to Finance if no user

  const { meetings, summary } = useMemo(() => 
    generateDepartmentRecordNotes(departmentId, meetingType),
    [departmentId, meetingType]
  );

  // Filter by status
  const filteredMeetings = useMemo(() => {
    if (!statusFilter) return meetings;

    const statusMap: { [key: string]: string } = {
      '1': 'Completed',
      '2': 'On Target',
      '3': 'Overdue',
      '4': 'Off Target',
      '6': 'Overdue Other Reason',
      '7': 'Ongoing',
      '9': 'Off Target Other Reason'
    };

    const targetStatus = statusMap[statusFilter];
    if (!targetStatus) return meetings;

    return meetings.map(meeting => ({
      ...meeting,
      minutes: meeting.minutes.filter(m => m.status === targetStatus)
    })).filter(meeting => meeting.minutes.length > 0);
  }, [meetings, statusFilter]);

  // Pagination
  const totalMinutes = filteredMeetings.reduce((sum, m) => sum + m.minutes.length, 0);
  const totalPages = Math.ceil(totalMinutes / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Flatten meetings for pagination
  const allMinutes: Array<{ meeting: MeetingWithMinutes; minute: MinuteDecision; index: number }> = [];
  let globalIndex = 1;
  filteredMeetings.forEach(meeting => {
    meeting.minutes.forEach(minute => {
      allMinutes.push({ meeting, minute, index: globalIndex++ });
    });
  });

  const paginatedMinutes = allMinutes.slice(startIndex, endIndex);
  const firstItem = startIndex + 1;
  const lastItem = Math.min(endIndex, totalMinutes);

  // Status cards configuration - matching old CMDMS exactly
  // Order: Total, Completed, On Target, Ongoing, Overdue, Off Target, Off Target Other Reason, Overdue Other Reason
  // Enum values: COMPLETED=1, ON_TARGET=2, OVERDUE=3, OFF_TARGET=4, OVERDUE_OTHER_REASON=6, ONGOING=7, OFF_TARGET_OTHER_REASON=9
  const allowedStatuses = meetingType === 'cabinet'
    ? [
        { value: '', label: 'Total', color: '#3282FF', icon: 'ti-list' },
        { value: '1', label: 'Completed', color: '#0E8160', icon: 'ti-check' },
        { value: '2', label: 'On Target', color: '#1DC39F', icon: 'ti-target' },
        { value: '7', label: 'Ongoing', color: '#F8C146', icon: 'ti-reload' },
        { value: '3', label: 'Overdue', color: '#E74039', icon: 'ti-timer' },
        { value: '4', label: 'Off Target', color: '#E74039', icon: 'ti-alert' },
        { value: '9', label: 'Off Target Other Reason', color: '#f3726d', icon: 'ti-alert' },
        { value: '6', label: 'Overdue Other Reason', color: '#874EFF', icon: 'ti-timer' }
      ]
    : [
        { value: '', label: 'Total', color: '#3282FF', icon: 'ti-list' },
        { value: '1', label: 'Completed', color: '#0E8160', icon: 'ti-check' },
        { value: '2', label: 'On Target', color: '#1DC39F', icon: 'ti-target' },
        { value: '3', label: 'Overdue', color: '#E74039', icon: 'ti-timer' }
      ];

  const getCardData = (statusValue: string) => {
    if (statusValue === '') {
      return {
        count: summary.total,
        percent: 0,
        title: 'Total'
      };
    }

    const statusMap: { [key: string]: keyof StatusSummary } = {
      '1': 'Completed',
      '2': 'On Target',
      '3': 'Overdue',
      '4': 'Off Target',
      '6': 'Overdue Other Reason',  // Enum value 6
      '7': 'Ongoing',  // Enum value 7
      '9': 'Off Target Other Reason'  // Enum value 9
    };

    const statusKey = statusMap[statusValue];
    if (!statusKey || !summary[statusKey]) {
      return { count: 0, percent: 0, title: '' };
    }

    const statusData = summary[statusKey];
    // Type guard to ensure statusData is an object with count and percent
    if (typeof statusData === 'number') {
      return { count: 0, percent: 0, title: '' };
    }
    
    return {
      count: statusData.count,
      percent: statusData.percent,
      title: statusKey
    };
  };

  const handlePerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  // Group paginated minutes by meeting for display
  const groupedMinutes = useMemo(() => {
    const groups: { [key: number]: { meeting: MeetingWithMinutes; minutes: Array<{ minute: MinuteDecision; index: number }> } } = {};
    
    paginatedMinutes.forEach(({ meeting, minute, index }) => {
      if (!groups[meeting.id]) {
        groups[meeting.id] = { meeting, minutes: [] };
      }
      groups[meeting.id].minutes.push({ minute, index });
    });

    return Object.values(groups);
  }, [paginatedMinutes]);

  // Initialize DataTable with Excel, Print, and Search
  useEffect(() => {
    // Only initialize once when component mounts or meetingType changes
    // Don't re-initialize when groupedMinutes changes (that's just data)
    let isMounted = true;
    
    const loadScript = (src: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) {
          resolve();
          return;
        }
        const script = document.createElement('script');
        script.src = src;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
        document.head.appendChild(script);
      });
    };

    const initializeDataTable = async () => {
      if (!isMounted) return;
      
      try {
        // Load CSS first
        if (!document.querySelector('link[href*="dataTables.bootstrap4"]')) {
          const link1 = document.createElement('link');
          link1.rel = 'stylesheet';
          link1.href = 'https://cdn.datatables.net/1.13.7/css/dataTables.bootstrap4.min.css';
          document.head.appendChild(link1);
        }
        if (!document.querySelector('link[href*="buttons.dataTables"]')) {
          const link2 = document.createElement('link');
          link2.rel = 'stylesheet';
          link2.href = 'https://cdn.datatables.net/buttons/2.4.2/css/buttons.dataTables.min.css';
          document.head.appendChild(link2);
        }

        // Load jQuery first
        if (!(window as any).jQuery) {
          await loadScript('https://code.jquery.com/jquery-3.7.1.min.js');
        }

        // Wait a bit for jQuery to be ready
        await new Promise(resolve => setTimeout(resolve, 50));

        // Load DataTables core
        if (!(window as any).jQuery.fn.DataTable) {
          await loadScript('https://cdn.datatables.net/1.13.7/js/jquery.dataTables.min.js');
        }
        
        // Load Bootstrap 4 integration
        await loadScript('https://cdn.datatables.net/1.13.7/js/dataTables.bootstrap4.min.js');
        
        // Load Buttons extension
        await loadScript('https://cdn.datatables.net/buttons/2.4.2/js/dataTables.buttons.min.js');
        
        // Load dependencies for Excel export
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js');
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/pdfmake.min.js');
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/vfs_fonts.js');
        
        // Load HTML5 and Print buttons
        await loadScript('https://cdn.datatables.net/buttons/2.4.2/js/buttons.html5.min.js');
        await loadScript('https://cdn.datatables.net/buttons/2.4.2/js/buttons.print.min.js');

        // Wait for all scripts to be ready
        await new Promise(resolve => setTimeout(resolve, 100));

        if (!isMounted) return;

        const $ = (window as any).jQuery;

        // Verify DataTable is available
        if (!$.fn.DataTable) {
          console.error('DataTable plugin not loaded');
          return;
        }

        // Destroy existing DataTable if it exists
        if (dataTableRef.current) {
          try {
            dataTableRef.current.destroy();
            dataTableRef.current = null;
          } catch (e) {
            // Ignore destroy errors
          }
        }

        // Initialize DataTable with export buttons
        if (tableRef.current && tableRef.current.querySelector('tbody') && isMounted) {
          // Check if DataTable is already initialized
          if ($.fn.DataTable.isDataTable(tableRef.current)) {
            $(tableRef.current).DataTable().destroy();
          }
          
          dataTableRef.current = $(tableRef.current).DataTable({
            paging: false,
            ordering: false,
            searching: true,
            dom: 'Bfrtip',
            buttons: [
              {
                extend: 'excelHtml5',
                title: meetingType === 'cabinet' ? 'Cabinet Minutes' : 'Record Notes',
                exportOptions: {
                  columns: ':visible',
                  rows: function(_idx: number, _data: any, node: any) {
                    // Exclude meeting header rows from export
                    return !$(node).hasClass('dd-meeting-title-heading');
                  }
                }
              },
              {
                extend: 'print',
                title: meetingType === 'cabinet' ? 'Cabinet Minutes' : 'Record Notes',
                exportOptions: {
                  columns: ':visible',
                  rows: function(_idx: number, _data: any, node: any) {
                    // Exclude meeting header rows from print
                    return !$(node).hasClass('dd-meeting-title-heading');
                  }
                },
                customize: function(win: any) {
                  $(win.document.body).find('table').find('td').each(function(this: HTMLElement) {
                    if ($(this).css('display') === 'none') {
                      $(this).remove();
                    }
                  });
                }
              }
            ],
            language: {
              search: '',
              searchPlaceholder: 'Search records...'
            },
            drawCallback: function(_settings: any) {
              if (!isMounted) return;
              
              // After each draw, ensure all rows and cells are visible
              const $table = $(tableRef.current);
              const $wrapper = $table.closest('.dataTables_wrapper');
              
              // Force visibility of table elements
              $wrapper.find('table').css({ display: 'table', visibility: 'visible' });
              $wrapper.find('tbody').css({ display: 'table-row-group', visibility: 'visible' });
              
              // Ensure all rows are visible
              $table.find('tbody tr').each(function(this: HTMLElement) {
                const $row = $(this);
                $row.css({ display: 'table-row', visibility: 'visible' });
                
                // Fix meeting header rows
                if ($row.hasClass('dd-meeting-title-heading')) {
                  const firstCell = $row.find('td').first();
                  if (firstCell.length) {
                    // Ensure colspan is set
                    if (firstCell.attr('colspan') !== '7') {
                      firstCell.attr('colspan', '7');
                    }
                    // Hide extra cells (keep them in DOM but hidden)
                    $row.find('td').slice(1).each(function(this: HTMLElement) {
                      const $cell = $(this);
                      if ($cell.attr('data-print') === 'false') {
                        $cell.css('display', 'none');
                      }
                    });
                  }
                } else {
                  // Ensure regular rows have all cells visible
                    $row.find('td').each(function(this: HTMLElement) {
                      const $cell = $(this);
                    if ($cell.attr('data-print') !== 'false') {
                      $cell.css({ display: 'table-cell', visibility: 'visible' });
                    }
                  });
                }
              });
            }
          });
          
          // Force visibility of buttons and search after initialization
          setTimeout(() => {
            if (!isMounted) return;
            
            const wrapper = $(tableRef.current).closest('.dataTables_wrapper');
            if (wrapper.length) {
              wrapper.find('.dt-buttons').css({ 
                display: 'inline-block', 
                visibility: 'visible',
                opacity: '1'
              });
              wrapper.find('.dataTables_filter').css({ 
                display: 'block', 
                visibility: 'visible',
                opacity: '1'
              });
              wrapper.find('.dt-button').css({ 
                display: 'inline-block', 
                visibility: 'visible',
                opacity: '1'
              });
            } else {
              console.warn('DataTable wrapper not found');
            }
          }, 300);
        }
      } catch (error) {
        console.error('Error initializing DataTable:', error);
      }
    };

    // Small delay to ensure table is rendered
    const timer = setTimeout(() => {
      if (tableRef.current && tableRef.current.querySelector('tbody') && isMounted) {
        initializeDataTable();
      }
    }, 500);

    return () => {
      isMounted = false;
      clearTimeout(timer);
      if (dataTableRef.current) {
        try {
          dataTableRef.current.destroy();
          dataTableRef.current = null;
        } catch (e) {
          // Ignore destroy errors
        }
      }
    };
  }, [meetingType]); // Only depend on meetingType, not groupedMinutes

  return (
    <div className="content-wrapper">
      <style>{`
        .record-notes-custom-card-analytics {
          border-radius: 15px;
          margin-bottom: 10px !important;
          background: #fff !important;
          transition: all 0.2s linear;
          height: auto !important;
        }
        .card.record-notes-custom-card-analytics {
          border: 2px solid #e3e3e3;
        }
        .record-notes-custom-card-analytics:hover {
          transform: scale(1.02);
        }
        .record-notes-custom-card-analytics .card-body {
          display: flex;
          justify-content: flex-start !important;
          flex-direction: column;
          padding: 15px !important;
          text-align: center;
        }
        .record-notes-custom-card-analytics .icon {
          width: 60px;
          height: 60px;
          border-radius: 100%;
          margin-bottom: 10px;
          display: flex;
          justify-content: center;
          align-items: center;
          margin: 0 auto 10px;
          color: white;
        }
        .record-notes-custom-card-analytics .icon i {
          font-size: 1.8rem !important;
        }
        .record-notes-custom-card-analytics h3 {
          text-align: left !important;
          font-size: 2rem !important;
          font-weight: bold;
          margin-bottom: 0.5rem;
        }
        .record-notes-custom-card-analytics p {
          color: #000 !important;
          text-align: left !important;
          margin: 5px 0 !important;
          font-size: 0.9rem;
        }
        .record-notes-custom-card-analytics .card-body p.mb-0 {
          font-size: 1rem !important;
          font-weight: 400 !important;
        }
        .table-bordered th, .table-bordered td {
          border: 1px solid #dee2e6;
        }
        .datatable thead th {
          background: rgb(37, 136, 95) !important;
          color: white !important;
        }
        .dd-meeting-title-heading {
          background-color: #f8f9fa !important;
          font-weight: bold;
        }
        .dd-meeting-title-heading td {
          padding: 15px !important;
        }
        /* DataTables Export Buttons Styling - Match Old CMDMS */
        .dataTables_wrapper .dt-buttons {
          margin-bottom: 1rem;
          display: inline-block;
        }
        .dataTables_wrapper .dt-button {
          display: inline-block;
          background-color: #fff;
          background-image: linear-gradient(to bottom, #fff 0%, #e0e0e0 100%);
          border: 1px solid #999;
          border-radius: 2px;
          color: #333;
          cursor: pointer;
          font-size: 0.88em;
          line-height: 1.6em;
          padding: 0.5em 1em;
          text-align: center;
          text-decoration: none;
          user-select: none;
          vertical-align: middle;
          white-space: nowrap;
          margin-left: 0.167em;
          margin-right: 0;
          margin-bottom: 0.333em;
        }
        .dataTables_wrapper .dt-button:first-child {
          margin-left: 0;
        }
        .dataTables_wrapper .dt-button:hover {
          background-color: #e0e0e0;
          background-image: linear-gradient(to bottom, #f5f5f5 0%, #e0e0e0 100%);
          border-color: #666;
          text-decoration: none;
        }
        .dataTables_wrapper .dt-button:active {
          background-color: #e0e0e0;
          background-image: none;
          box-shadow: inset 0 2px 4px rgba(0,0,0,0.15);
          outline: none;
        }
        .dataTables_wrapper .dataTables_filter {
          text-align: right;
          margin-bottom: 1rem;
        }
        .dataTables_wrapper .dataTables_filter label {
          font-weight: normal;
          white-space: nowrap;
          text-align: left;
          display: inline-block;
          vertical-align: middle;
        }
        .dataTables_wrapper .dataTables_filter input {
          margin-left: 0.5em;
          display: inline-block;
          width: auto;
          border: 1px solid #aaa;
          border-radius: 3px;
          padding: 5px;
          background-color: transparent;
          color: inherit;
          font-size: inherit;
          margin-bottom: 0;
        }
        .dataTables_wrapper .dataTables_filter input:focus {
          outline: 2px solid #4A90E2;
          outline-offset: 0;
        }
        /* Force visibility of DataTable controls */
        .dataTables_wrapper {
          display: block !important;
          visibility: visible !important;
          width: 100% !important;
        }
        .dataTables_wrapper .dt-buttons {
          display: inline-block !important;
          visibility: visible !important;
          opacity: 1 !important;
          margin-bottom: 1rem !important;
          float: left !important;
        }
        .dataTables_wrapper .dt-button {
          display: inline-block !important;
          visibility: visible !important;
          opacity: 1 !important;
        }
        .dataTables_wrapper .dataTables_filter {
          display: block !important;
          visibility: visible !important;
          opacity: 1 !important;
          float: right !important;
          margin-bottom: 1rem !important;
        }
        .dataTables_wrapper .dataTables_filter label {
          display: inline-block !important;
          visibility: visible !important;
          opacity: 1 !important;
        }
        .dataTables_wrapper .dataTables_filter input {
          display: inline-block !important;
          visibility: visible !important;
          opacity: 1 !important;
        }
        /* Ensure table and tbody are always visible */
        .dataTables_wrapper table {
          display: table !important;
          visibility: visible !important;
        }
        .dataTables_wrapper tbody {
          display: table-row-group !important;
          visibility: visible !important;
        }
        .dataTables_wrapper tbody tr {
          display: table-row !important;
          visibility: visible !important;
        }
        .dataTables_wrapper tbody td {
          display: table-cell !important;
          visibility: visible !important;
        }
        /* Ensure meeting header rows are visible */
        .dataTables_wrapper tbody tr.dd-meeting-title-heading {
          display: table-row !important;
          visibility: visible !important;
        }
        .dataTables_wrapper tbody tr.dd-meeting-title-heading td {
          display: table-cell !important;
          visibility: visible !important;
        }
      `}</style>

      <div className="card">
        <div className="card-header text-center">
          <p className="block display-4">
            {meetingType === 'cabinet' ? 'Cabinet Minutes' : 'Record Notes'}
          </p>
          <p className="block display-5">{user?.department?.name || 'Department'} Department</p>
        </div>
        <div className="card-body">
          {/* Status Cards */}
          <div className="row my-5 d-flex justify-content-center">
            {allowedStatuses.map((status) => {
              const cardData = getCardData(status.value);
              
              return (
                <div key={status.value} className="col-md-2 p-2">
                  <Link
                    to={`/department/record-notes?type=${meetingType}&status=${status.value}`}
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    <div
                      className="card record-notes-custom-card-analytics"
                      style={{
                        borderBottom: statusFilter === status.value ? `8px solid ${status.color}` : `8px solid ${status.color}`,
                        border: statusFilter === status.value ? `8px solid ${status.color}` : undefined
                      }}
                    >
                      <div className="card-body">
                        <div className="icon" style={{ background: status.color }}>
                          <i className={status.icon}></i>
                        </div>
                        <h3 className="mb-2" style={{ color: status.color }}>
                          {cardData.count}
                        </h3>
                        <p>{cardData.title}</p>
                        <p className="mb-0 mt-2">
                          {cardData.percent === 0 ? '\u00A0' : `${cardData.percent}%`}
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>

          {/* Table */}
          <div className="row">
            <div className="col-12">
              <div className="table-responsive">
                <table ref={tableRef} className="table table-bordered table-condensed datatable" role="grid" style={{ width: '100%' }}>
                  <thead>
                    <tr>
                      <th>S.NO</th>
                      <th>Details</th>
                      <th>Progress</th>
                      <th>Responsibility</th>
                      <th>Timeline</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupedMinutes.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center">
                          There is no data.
                        </td>
                      </tr>
                    ) : (
                      groupedMinutes.map(({ meeting, minutes }) => (
                        <React.Fragment key={meeting.id}>
                          {/* Meeting Header Row */}
                          <tr className="dd-meeting-title-heading even">
                            <td colSpan={7} className="text-center" style={{ width: '100%' }}>
                              <h4>
                                {meeting.subject} - {new Date(meeting.date).toLocaleDateString('en-GB')}
                              </h4>
                              {meeting.attachment && (
                                <a
                                  href={`/storage/meetings_uploads/${meeting.attachment}`}
                                  title="download the attached minutes"
                                  className="mb-3 btn btn-primary btn-icon-text"
                                >
                                  <i className="ti-download btn-icon-prepend"></i> Download attachment
                                </a>
                              )}
                            </td>
                            <td data-print="false" style={{ display: 'none' }}>&nbsp;</td>
                            <td data-print="false" style={{ display: 'none' }}>&nbsp;</td>
                            <td data-print="false" style={{ display: 'none' }}>&nbsp;</td>
                            <td data-print="false" style={{ display: 'none' }}>&nbsp;</td>
                            <td data-print="false" style={{ display: 'none' }}>&nbsp;</td>
                            <td data-print="false" style={{ display: 'none' }}>&nbsp;</td>
                          </tr>
                          {/* Minutes Rows */}
                          {minutes.map(({ minute, index }) => (
                            <tr key={minute.id} id={`minute${minute.id}`}>
                              <td>{index}</td>
                              <td className="text">
                                {minute.issues && <ReadMore text={minute.issues} />}
                                {minute.heading && <ReadMore text={minute.heading} />}
                                {minute.decisions && <ReadMore text={minute.decisions} />}
                                {minute.attachments && minute.attachments.length > 0 && (
                                  <div className="mt-2">
                                    <span>Download Attached Minutes: </span>
                                    {minute.attachments.map((file, idx) => (
                                      <span key={idx} className="ml-1">
                                        <a
                                          href={`/storage/minutes_uploads/${file}`}
                                          title="Click to download attached minute"
                                        >
                                          <i className="ti-file" style={{ fontSize: '25px' }}></i>
                                        </a>
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </td>
                              <td className="text">
                                <ReadMore text={minute.comments || ''} />
                              </td>
                              <td>{minute.responsibility || ''}</td>
                              <td>
                                {minute.timeline
                                  ? new Date(minute.timeline).toLocaleDateString('en-GB')
                                  : 'N/A'}
                              </td>
                              <td>
                                <StatusBadge status={minute.status} />
                              </td>
                              <td className="text-center">
                                <Link
                                  to={`/department/record-notes/${minute.id}/reply?status=${minute.status}&page=${currentPage}&type=${meetingType}`}
                                  className="btn btn-info"
                                  style={{ padding: '0.3rem 1rem' }}
                                  role="button"
                                  aria-pressed="true"
                                  title="View Chat history"
                                >
                                  <i className="ti-comments"></i>
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </React.Fragment>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Pagination Footer */}
        <div className="card-footer mt-3 border">
          <div className="row align-items-center">
            <div className="col">
              <div className="form-group mb-0 row align-items-center">
                <label htmlFor="perPage" className="col-sm-3 col-form-label mb-0">
                  Show
                </label>
                <select
                  id="perPage"
                  className="form-control form-control-sm col-sm-3"
                  value={itemsPerPage}
                  onChange={handlePerPageChange}
                >
                  {[10, 15, 25, 50, 100].map(option => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <span className="inline-block col-sm-6"> per page</span>
              </div>
            </div>
            <div className="col text-center">
              <p>
                Showing <strong>{firstItem}</strong> to <strong>{lastItem}</strong> of total{' '}
                <strong>{totalMinutes}</strong> records.
              </p>
            </div>
            <div className="col d-flex justify-content-end">
              <nav>
                <ul className="pagination mb-0">
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </button>
                  </li>
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(page => {
                      // Show first, last, current, and adjacent pages
                      return (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      );
                    })
                    .map((page, idx, arr) => {
                      // Add ellipsis if needed
                      const prevPage = arr[idx - 1];
                      const showEllipsis = prevPage && page - prevPage > 1;
                      
                      return (
                        <React.Fragment key={page}>
                          {showEllipsis && (
                            <li className="page-item disabled">
                              <span className="page-link">...</span>
                            </li>
                          )}
                          <li className={`page-item ${currentPage === page ? 'active' : ''}`}>
                            <button
                              className="page-link"
                              onClick={() => setCurrentPage(page)}
                            >
                              {page}
                            </button>
                          </li>
                        </React.Fragment>
                      );
                    })}
                  <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
