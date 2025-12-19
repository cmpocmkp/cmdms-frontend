/**
 * Cabinet Department-wise Report
 * EXACT replica of admin/report/cabinet/department-wise
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../../../lib/api';

interface Department {
  id: number;
  name: string;
}

interface Meeting {
  id: number;
  subject: string;
  meeting_date: string;
  created_at: string;
  updated_at: string;
  creator: { name: string };
  editor: { name: string };
  minutes: Minute[];
}

interface Minute {
  id: number;
  issues: string;
  comments: string;
  heading: string;
  decisions: string;
  timeline: string;
  status: number;
  departments: Array<{
    id: number;
    name: string;
    pivot: {
      status: number;
      remarks: string;
    };
  }>;
  replies: Array<{
    id: number;
    reply_detail: string;
    created_at: string;
    department_id: number;
    user: {
      name: string;
      role_id: number;
      department: { name: string };
    };
    attachments?: string | string[];
    type?: string;
    status?: number;
  }>;
}

export default function CabinetDepartmentWiseReport() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [cabinetMeetings, setCabinetMeetings] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  
  // Form state
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [selectedMeetings, setSelectedMeetings] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    // Initialize form from URL params
    const deptParam = searchParams.get('department');
    const meetingParam = searchParams.get('meeting_id');
    const statusParam = searchParams.get('status');
    const tagParam = searchParams.get('tag');
    
    if (deptParam) {
      setSelectedDepartments(Array.isArray(deptParam) ? deptParam : [deptParam]);
    }
    if (meetingParam) {
      setSelectedMeetings(Array.isArray(meetingParam) ? meetingParam : [meetingParam]);
    }
    if (statusParam) {
      setSelectedStatuses(Array.isArray(statusParam) ? statusParam : [statusParam]);
    }
    if (tagParam) {
      setSelectedTags(Array.isArray(tagParam) ? tagParam : [tagParam]);
    }

    // TODO: Replace with actual API calls
    // const fetchData = async () => {
    //   try {
    //     const [deptsRes, meetingsRes, tagsRes, dataRes] = await Promise.all([
    //       api.get('/admin/departments'),
    //       api.get('/admin/cabinet-meetings'),
    //       api.get('/admin/tags'),
    //       api.get('/admin/report/department-wise/cabinet-meeting/decisions', { params: searchParams })
    //     ]);
    //     setDepartments(deptsRes.data);
    //     setCabinetMeetings(meetingsRes.data);
    //     setTags(tagsRes.data);
    //     setMeetings(dataRes.data.meetings);
    //   } catch (error) {
    //     console.error('Error fetching data:', error);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchData();

    // Dummy data
    setDepartments([
      { id: 1, name: 'Health Department' },
      { id: 2, name: 'Finance Department' },
      { id: 3, name: 'Education Department' },
      { id: 4, name: 'Public Works Department' },
    ]);

    setCabinetMeetings([
      { id: 1, subject: 'Health Insurance Scheme Implementation' },
      { id: 2, subject: 'Infrastructure Development Projects' },
      { id: 3, subject: 'Education Reforms and Policies' },
    ]);

    setTags([
      { id: 1, name: 'Priority' },
      { id: 2, name: 'Urgent' },
      { id: 3, name: 'Ongoing' },
    ]);

    // Dummy meetings data
    const dummyMeetings: Meeting[] = [
      {
        id: 1,
        subject: 'Health Insurance Scheme Implementation',
        meeting_date: '2024-01-15',
        created_at: '2024-01-10',
        updated_at: '2024-01-12',
        creator: { name: 'Admin User' },
        editor: { name: 'Admin User' },
        minutes: [
          {
            id: 1,
            issues: '<p>Implementation of Health Insurance Scheme</p>',
            comments: '<p>Progress is on track. Initial phase completed successfully.</p>',
            heading: 'Health Insurance',
            decisions: '<p>Approved for implementation</p>',
            timeline: '2024-03-15',
            status: 2, // ON_TARGET
            departments: [
              { id: 1, name: 'Health Department', pivot: { status: 2, remarks: 'Working on implementation' } },
              { id: 2, name: 'Finance Department', pivot: { status: 2, remarks: 'Budget allocated' } },
            ],
            replies: [
              {
                id: 1,
                reply_detail: 'Initial progress update',
                created_at: '2024-01-20',
                department_id: 1,
                user: { name: 'Department User', role_id: 2, department: { name: 'Health Department' } },
                status: 2,
              },
            ],
          },
          {
            id: 2,
            issues: '<p>Upgradation of District Hospitals</p>',
            comments: '<p>Tender process initiated. Expected completion in 6 months.</p>',
            heading: 'Hospital Upgradation',
            decisions: '<p>Tender to be floated</p>',
            timeline: '2024-04-30',
            status: 3, // OVERDUE
            departments: [
              { id: 1, name: 'Health Department', pivot: { status: 3, remarks: 'Tender floated' } },
              { id: 3, name: 'Public Works Department', pivot: { status: 3, remarks: 'Design approved' } },
            ],
            replies: [],
          },
        ],
      },
      {
        id: 2,
        subject: 'Infrastructure Development Projects',
        meeting_date: '2024-02-10',
        created_at: '2024-02-05',
        updated_at: '2024-02-08',
        creator: { name: 'Admin User' },
        editor: { name: 'Admin User' },
        minutes: [
          {
            id: 3,
            issues: '<p>Road Construction Projects</p>',
            comments: '<p>Multiple road projects approved for execution.</p>',
            heading: 'Road Projects',
            decisions: '<p>Projects approved</p>',
            timeline: '2024-06-30',
            status: 2, // ON_TARGET
            departments: [
              { id: 4, name: 'Public Works Department', pivot: { status: 2, remarks: 'Survey completed' } },
            ],
            replies: [],
          },
        ],
      },
    ];

    setMeetings(dummyMeetings);
    setLoading(false);
  }, [searchParams]);

  const getBadgeClass = (status: number): string => {
    switch (status) {
      case 1: return 'badge-success'; // COMPLETED
      case 2: return 'badge-warning'; // ON_TARGET
      case 3: return 'badge-danger'; // OVERDUE
      case 4: return 'badge-info'; // OFF_TARGET
      case 6: return 'badge-indigo'; // OVERDUE_OTHER_REASON
      case 7: return 'badge-ongoing'; // ONGOING
      case 8: return 'badge-dark'; // CAN_NOT_COMPLETED
      case 9: return 'badge-lightred'; // OFF_TARGET_OTHER_REASON
      default: return 'badge-secondary';
    }
  };

  const getStatusLabel = (status: number): string => {
    switch (status) {
      case 1: return 'Completed';
      case 2: return 'On Target';
      case 3: return 'Overdue';
      case 4: return 'Off Target';
      case 6: return 'Overdue other reason';
      case 7: return 'Ongoing';
      case 8: return 'Can not be completed';
      case 9: return 'Off Target reason';
      default: return 'Pending';
    }
  };

  const calculateTimelineInfo = (minute: Minute) => {
    const timelineDate = new Date(minute.timeline);
    const now = new Date();
    const diffTime = Math.abs(timelineDate.getTime() - now.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    const formattedDate = timelineDate.toLocaleDateString('en-GB');
    let timelineHtml = formattedDate;

    if (minute.status === 2) { // ON_TARGET
      const remainDays = diffDays === 1 ? ' day' : ' days';
      timelineHtml += `<br/><span style="color:red;font-size:14px;">Remaining ${diffDays}  ${remainDays}</span>`;
    } else if (minute.status === 3) { // OVERDUE
      const delayDays = diffDays === 1 ? ' day' : ' days';
      timelineHtml += `<br/><span style="color:red;font-size:12px;">Delay ${diffDays}${delayDays}</span>`;
    }
    
    return timelineHtml;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    
    selectedDepartments.forEach(dept => params.append('department', dept));
    selectedMeetings.forEach(meeting => params.append('meeting_id', meeting));
    selectedStatuses.forEach(status => params.append('status', status));
    selectedTags.forEach(tag => params.append('tag', tag));
    
    setSearchParams(params);
    // TODO: Trigger API call with new params
  };

  const handleReset = () => {
    setSelectedDepartments([]);
    setSelectedMeetings([]);
    setSelectedStatuses([]);
    setSelectedTags([]);
    setSearchParams({});
  };

  const getMeetingOwnershipData = (meeting: Meeting) => {
    let data = '';
    if (meeting.creator?.name) {
      data += `Created by: ${meeting.creator.name}`;
      data += `<br/>Created at: ${new Date(meeting.created_at).toLocaleDateString('en-GB')}`;
    }
    if (meeting.editor?.name) {
      data += `<br/>Last Updated by: ${meeting.editor.name}`;
      data += `<br/>Updated at: ${new Date(meeting.updated_at).toLocaleDateString('en-GB')}`;
    }
    return data;
  };

  // MultiSelect Component (Select2-like)
  interface MultiSelectOption {
    value: string;
    label: string;
  }

  interface MultiSelectProps {
    id: string;
    name: string;
    options: MultiSelectOption[];
    value: string[];
    onChange: (values: string[]) => void;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
  }

  const MultiSelect: React.FC<MultiSelectProps> = ({
    id,
    name,
    options,
    value,
    onChange,
    placeholder = '--Select option--',
    required = false,
    disabled = false,
  }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
          setIsOpen(false);
          setSearchTerm('');
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredOptions = options.filter(option =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const selectedOptions = options.filter(option => value.includes(option.value));

    const toggleOption = (optionValue: string) => {
      if (disabled) return;
      if (value.includes(optionValue)) {
        onChange(value.filter(v => v !== optionValue));
      } else {
        onChange([...value, optionValue]);
      }
    };

    const removeOption = (optionValue: string, e: React.MouseEvent) => {
      e.stopPropagation();
      onChange(value.filter(v => v !== optionValue));
    };

    return (
      <div className="multi-select-wrapper" ref={wrapperRef} style={{ position: 'relative' }}>
        <div
          className="js-example-basic-multiple form-control form-control-lg"
          style={{
            minHeight: '38px',
            padding: '5px',
            cursor: disabled ? 'not-allowed' : 'pointer',
            backgroundColor: disabled ? '#e9ecef' : '#fff',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '5px',
            border: '1px solid #ced4da',
            borderRadius: '0.25rem',
          }}
          onClick={() => !disabled && setIsOpen(!isOpen)}
        >
          {selectedOptions.length > 0 ? (
            selectedOptions.map(option => (
              <span
                key={option.value}
                className="badge badge-primary"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '2px 8px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  borderRadius: '3px',
                  fontSize: '0.875rem',
                  margin: '2px',
                }}
              >
                {option.label}
                {!disabled && (
                  <span
                    onClick={(e) => removeOption(option.value, e)}
                    style={{
                      marginLeft: '5px',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                    }}
                  >
                    ×
                  </span>
                )}
              </span>
            ))
          ) : (
            <span style={{ color: '#6c757d', padding: '8px' }}>{placeholder}</span>
          )}
          <span
            style={{
              marginLeft: 'auto',
              color: '#6c757d',
              fontSize: '14px',
              paddingRight: '10px',
            }}
          >
            ▾
          </span>
        </div>
        {isOpen && !disabled && (
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              backgroundColor: 'white',
              border: '1px solid #ced4da',
              borderTop: 'none',
              borderRadius: '0 0 0.25rem 0.25rem',
              maxHeight: '200px',
              overflowY: 'auto',
              zIndex: 1000,
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}
          >
            <div style={{ padding: '5px', borderBottom: '1px solid #ced4da' }}>
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                style={{ border: 'none', outline: 'none' }}
              />
            </div>
            <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
              {filteredOptions.length > 0 ? (
                filteredOptions.map(option => (
                  <div
                    key={option.value}
                    onClick={() => toggleOption(option.value)}
                    style={{
                      padding: '8px 12px',
                      cursor: 'pointer',
                      backgroundColor: value.includes(option.value) ? '#e7f3ff' : 'transparent',
                    }}
                    onMouseEnter={(e) => {
                      if (!value.includes(option.value)) {
                        e.currentTarget.style.backgroundColor = '#f8f9fa';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!value.includes(option.value)) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={value.includes(option.value)}
                      onChange={() => {}}
                      style={{ marginRight: '8px' }}
                    />
                    {option.label}
                  </div>
                ))
              ) : (
                <div style={{ padding: '8px 12px', color: '#6c757d' }}>No results found</div>
              )}
            </div>
          </div>
        )}
        <select
          name={name}
          id={id}
          multiple
          required={required}
          disabled={disabled}
          style={{ display: 'none' }}
          value={value}
          onChange={() => {}}
        >
          {options.map(option => (
            <option key={option.value} value={option.value} selected={value.includes(option.value)}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  };

  if (loading) {
    return <div className="text-center p-5">Loading...</div>;
  }

  return (
    <div className="content-wrapper">
      <style>{`
        .private {
          display: none;
        }
        .btn-default:hover {
          color: #000 !important;
          border-color: unset !important;
          background: unset !important;
        }
        .hide_in_form {
          display: none !important;
        }
        @media screen {
          #printSection {
            display: none;
          }
        }
        table#department_decision_detial_repsort {
          width: 100% !important;
        }
        #department_decision_detial_repsort td {
          border: 1px solid silver;
          vertical-align: top !important;
        }
        #department_decision_detial_repsort td ul li {
          font-size: 16px !important;
        }
        table.related_department_table {
          width: 100% !important;
        }
        .related_department_table td {
          border: 1px solid silver;
          vertical-align: top !important;
          font-size: 16px !important;
          margin: 5px !important;
        }
        .related_department_table td p {
          width: 200px !important;
        }
        .related_department_table td div {
          width: 200px !important;
        }
        .related_department_table td ul li {
          font-size: 16px !important;
        }
        .related_department_table th {
          border: 1px solid silver;
          text-align: center;
          height: 35px;
        }
        table td {
          padding: 0.5rem 1rem !important;
        }
        table th {
          font-size: 13px;
          padding: 0.5rem 1rem !important;
        }
        .table td {
          font-size: 0.875rem;
          vertical-align: middle;
          line-height: 1;
          white-space: nowrap;
        }
        .d-decision {
          text-wrap: wrap !important;
        }
        /* Select2-like styling for multi-select */
        .js-example-basic-multiple {
          min-height: 38px;
        }
        .select2-container--default .select2-selection--multiple {
          position: relative;
          padding-right: 30px;
          min-height: 38px;
        }
        .select2-container--default .select2-selection--multiple::after {
          content: "▾";
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 14px;
          color: #6c757d;
          pointer-events: none;
        }
        /* Multi-select tag display */
        .multi-select-wrapper {
          position: relative;
        }
        .multi-select-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 5px;
          padding: 5px;
          min-height: 38px;
          border: 1px solid #ced4da;
          border-radius: 0.25rem;
          background-color: #fff;
          cursor: pointer;
        }
        .multi-select-tag {
          display: inline-flex;
          align-items: center;
          padding: 2px 8px;
          background-color: #007bff;
          color: white;
          border-radius: 3px;
          font-size: 0.875rem;
        }
        .multi-select-tag-remove {
          margin-left: 5px;
          cursor: pointer;
          font-weight: bold;
        }
        .multi-select-placeholder {
          color: #6c757d;
          padding: 8px;
        }
        .multi-select-dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: white;
          border: 1px solid #ced4da;
          border-top: none;
          border-radius: 0 0 0.25rem 0.25rem;
          max-height: 200px;
          overflow-y: auto;
          z-index: 1000;
          display: none;
        }
        .multi-select-dropdown.show {
          display: block;
        }
        .multi-select-option {
          padding: 8px 12px;
          cursor: pointer;
        }
        .multi-select-option:hover {
          background-color: #f8f9fa;
        }
        .multi-select-option.selected {
          background-color: #007bff;
          color: white;
        }
      `}</style>
      
      <div className="card mb-4">
        <div className="card-body">
          <h4>Filters</h4>
          <form className="form-sample" onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-12">
                <div className="form-group">
                  <label>Departments <span className="text-danger">*</span></label>
                  <MultiSelect
                    id="department"
                    name="department[]"
                    options={departments.map(dept => ({ value: dept.id.toString(), label: dept.name }))}
                    value={selectedDepartments}
                    onChange={setSelectedDepartments}
                    placeholder="--Select department--"
                    required
                  />
                </div>
              </div>
              <div className="col-md-12">
                <div className="form-group">
                  <label>Meetings</label>
                  <MultiSelect
                    id="meeting_id"
                    name="meeting_id[]"
                    options={cabinetMeetings.map(meeting => ({ value: meeting.id.toString(), label: meeting.subject }))}
                    value={selectedMeetings}
                    onChange={setSelectedMeetings}
                    placeholder="--Select Meeting--"
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Status</label>
                  <MultiSelect
                    id="status"
                    name="status[]"
                    options={[
                      { value: '1', label: 'Completed' },
                      { value: '2', label: 'On Target' },
                      { value: '3', label: 'Overdue' },
                      { value: '4', label: 'Off Target' },
                      { value: '7', label: 'Ongoing' },
                      { value: '6', label: 'Overdue other reason' },
                      { value: '9', label: 'Off Target reason' },
                    ]}
                    value={selectedStatuses}
                    onChange={setSelectedStatuses}
                    placeholder="--Select status--"
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Category</label>
                  <MultiSelect
                    id="tag"
                    name="tag[]"
                    options={tags.map(tag => ({ value: tag.id.toString(), label: tag.name }))}
                    value={selectedTags}
                    onChange={setSelectedTags}
                    placeholder="--Select tag--"
                  />
                </div>
              </div>
            </div>
            <button type="submit" className="btn btn-success mr-2 pull-left">Search</button>
            <button type="button" onClick={handleReset} className="btn btn-warning btn-md pull-left">Reset</button>
          </form>

          {meetings.length > 0 && (
            <div className="export-buttons ml-3 mt-2" style={{ display: 'inline-block' }}>
              <button className="btn btn-danger" style={{ marginRight: '5px' }}>
                <i className="ti-file"></i> Export PDF
              </button>
              <button className="btn btn-success" style={{ marginRight: '5px' }}>
                <i className="ti-file"></i> Export Excel
              </button>
              <button className="btn btn-primary">
                <i className="ti-file"></i> Export Word
              </button>
            </div>
          )}
        </div>
        
        <div id="printmymodal">
          <div className="row">
            <div className="col-12">
              {meetings.length > 0 ? (
                <div className="table-responsive">
                  <table id="department_decision_detial_repsort" className="table table-striped">
                    <thead style={{ background: 'rgb(37, 136, 95) !important', color: 'white !important' }}>
                      {meetings[0] && (
                        <tr className="dd-meeting-title-heading">
                          <th colSpan={8} style={{ padding: '8px', whiteSpace: 'unset' }}>
                            <h4
                              className="text-center"
                              title={getMeetingOwnershipData(meetings[0])}
                            >
                              {meetings[0].subject}
                            </h4>
                          </th>
                        </tr>
                      )}
                      {meetings.length > 0 && (
                        <tr style={{ background: 'rgb(37, 136, 95) !important', color: 'white !important' }}>
                          <th style={{ width: '5px' }}>S.NO</th>
                          <th style={{ width: '5px' }}>Decision</th>
                          <th style={{ width: '200px' }}>Progress So Far</th>
                          <th className="pres">Responsibility</th>
                          <th style={{ width: '30px' }}>Timeline</th>
                          <th style={{ width: '15px' }}>Status</th>
                        </tr>
                      )}
                    </thead>
                    <tbody>
                      {meetings.map((meeting, meetingIndex) => {
                        const meetingOwnershipData = getMeetingOwnershipData(meeting);
                        return (
                          <React.Fragment key={meeting.id}>
                            {meetingIndex > 0 && (
                              <>
                                <tr className="dd-meeting-title-heading">
                                  <th colSpan={8} style={{ padding: '8px' }}>
                                    <center>
                                      <h4 title={meetingOwnershipData}>
                                        {meeting.subject}
                                      </h4>
                                    </center>
                                  </th>
                                </tr>
                                <tr className="table-head-bg-color" style={{ background: 'rgb(37, 136, 95) !important', color: 'white !important' }}>
                                  <th style={{ width: '5px' }}>S.NO</th>
                                  <th style={{ width: '5px' }}>Decision</th>
                                  <th style={{ width: '200px' }}>Progress So Far</th>
                                  <th className="pres">Responsibility</th>
                                  <th style={{ width: '30px' }}>Timeline</th>
                                  <th style={{ width: '15px' }}>Status</th>
                                </tr>
                              </>
                            )}
                            {meeting.minutes.map((minute, minuteIndex) => {
                              // Get last comment for each department
                              const departmentComments = minute.departments.map(dept => {
                                const lastComment = minute.replies
                                  ?.filter(reply => (reply as any).department_id === dept.id)
                                  ?.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
                                return {
                                  department: dept,
                                  lastComment,
                                  comment: lastComment?.reply_detail || minute.comments,
                                };
                              });

                              return (
                                <tr key={minute.id} id={`decision${minute.id}`}>
                                  <td>
                                    <button
                                      style={{ width: '25px', height: '25px', padding: '0.1rem 0rem' }}
                                      type="button"
                                      className="btn btn-outline-secondary btn-rounded btn-icon text-dark"
                                      title={meetingOwnershipData}
                                    >
                                      {minuteIndex + 1}
                                    </button>
                                  </td>
                                  <td className="d-decision">
                                    <div dangerouslySetInnerHTML={{ __html: minute.issues || '' }} />
                                    <div dangerouslySetInnerHTML={{ __html: minute.comments || '' }} />
                                  </td>
                                  <td style={{ width: '260px', paddingLeft: '5px', paddingRight: '10px' }}>
                                    {minute.comments ? (
                                      <div dangerouslySetInnerHTML={{ __html: minute.comments.replace(/<[^>]*>/g, '') }} />
                                    ) : (
                                      <span className="text-danger">No correspondence from both sides</span>
                                    )}
                                  </td>
                                  <td>
                                    <table style={{ width: '100%' }}>
                                      <thead>
                                        <tr style={{ backgroundColor: '#25885F', color: 'white' }}>
                                          <th>Dept. Status</th>
                                          <th>CM Office Status</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {minute.departments.map((dept) => {
                                          const deptLastComment = minute.replies
                                            ?.filter((reply: any) => reply.department_id === dept.id)
                                            ?.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
                                          
                                          const cmStatus = dept.pivot.status;
                                          
                                          return (
                                            <tr key={dept.id}>
                                              <td>
                                                {deptLastComment?.status ? (
                                                  <span className={`badge ${getBadgeClass(deptLastComment.status)} badge-pill`}>
                                                    {getStatusLabel(deptLastComment.status)}
                                                  </span>
                                                ) : null}
                                              </td>
                                              <td>
                                                {cmStatus ? (
                                                  <span className={`badge ${getBadgeClass(cmStatus)} badge-pill`}>
                                                    {getStatusLabel(cmStatus)}
                                                  </span>
                                                ) : null}
                                              </td>
                                            </tr>
                                          );
                                        })}
                                      </tbody>
                                    </table>
                                  </td>
                                  <td style={{ width: '30px', fontWeight: 'bold', textAlign: 'center' }} dangerouslySetInnerHTML={{ __html: calculateTimelineInfo(minute) }} />
                                  <td style={{ width: '15px', textAlign: 'center' }}>
                                    {minute.status ? (
                                      <Link to={`/admin/recordnotes/edit/${meeting.id}#decision${minute.id}`}>
                                        <label
                                          style={{ cursor: 'pointer', display: 'block', marginBottom: '5px' }}
                                          className={`badge ${getBadgeClass(minute.status)} badge-pill`}
                                        >
                                          {getStatusLabel(minute.status)}
                                        </label>
                                      </Link>
                                    ) : null}
                                    <Link
                                      to={`/admin/report/recordnotes/detail_list/${meeting.id}/${minute.id}`}
                                      className="btn btn-success"
                                      title="View Report"
                                      style={{ display: 'inline-block', marginTop: '5px', marginLeft: '5px' }}
                                    >
                                      <i className="ti-printer"></i>
                                    </Link>
                                    <Link
                                      to={`/admin/replies/minutes/${minute.id}`}
                                      className="btn btn-info"
                                      title="CM office and departments responses"
                                      style={{ display: 'inline-block', marginTop: '5px', marginLeft: '5px' }}
                                    >
                                      <i className="ti-comments"></i>
                                    </Link>
                                  </td>
                                </tr>
                              );
                            })}
                          </React.Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                searchParams.get('department') && (
                  <p className="text-center">No data found for the search filters</p>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
