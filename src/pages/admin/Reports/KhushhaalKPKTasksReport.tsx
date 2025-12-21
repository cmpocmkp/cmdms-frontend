/**
 * Khushhaal Khyber Pakhtunkhwa Tasks Report
 * EXACT replica of admin/report/khushhalkpk/index.blade.php from old CMDMS
 */

import React, { useState } from 'react';
import { mockKPICards } from '../../../lib/mocks/data/kpiData';
import { mockAdminDepartments } from '../../../lib/mocks/data/adminDepartments';
import { List, Check, Target, RefreshCw, AlertTriangle, Clock } from 'lucide-react';
import { faker } from '@faker-js/faker';

// Helper functions for badge status
const badgesWithIntegerStatus = (status: number | string): string => {
  const statusNum = typeof status === 'string' ? parseInt(status) : status;
  const statusMap: Record<number, string> = {
    1: 'success',
    2: 'warning',
    3: 'danger',
    4: 'info',
    7: 'ongoing',
    6: 'indigo',
    9: 'lightred'
  };
  return statusMap[statusNum] || 'danger';
};

const badgesWithStringStatus = (status: number | string): string => {
  const statusNum = typeof status === 'string' ? parseInt(status) : status;
  const statusMap: Record<number, string> = {
    1: 'Completed',
    2: 'On Target',
    3: 'Overdue',
    4: 'Off Target',
    7: 'Ongoing',
    6: 'Overdue Other Reason',
    9: 'Off Target Other Reason'
  };
  return statusMap[statusNum] || 'Overdue';
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

// Mock data for tasks
interface TaskDepartment {
  id: number;
  name: string;
  progress: Array<{
    id: number;
    type: string;
    progress: string;
    created_at: string;
    status: number;
    attachments?: string[];
  }>;
  replies: Array<{
    id: number;
    reply: string;
    created_at: string;
    attachments?: string[];
  }>;
}

interface ReportTask {
  id: number;
  subject_tasks: string;
  progress_so_far?: string;
  timeline_date?: string;
  timeline_note?: string;
  expected_outcomes?: string;
  departments: TaskDepartment[];
}

// Generate mock tasks for the report
const generateMockTasks = (): ReportTask[] => {
  return Array.from({ length: 10 }, (_, taskIdx) => {
    const departmentCount = faker.number.int({ min: 1, max: 4 });
    const departments: TaskDepartment[] = [];
    
    for (let i = 0; i < departmentCount; i++) {
      const dept = faker.helpers.arrayElement(mockAdminDepartments);
      const progressCount = faker.number.int({ min: 0, max: 3 });
      const progress = Array.from({ length: progressCount }, (_, pIdx) => ({
        id: pIdx + 1,
        type: faker.helpers.arrayElement(['Weekly', 'Monthly']),
        progress: faker.lorem.paragraph(),
        created_at: faker.date.past().toISOString(),
        status: faker.helpers.arrayElement([1, 2, 3, 4, 7]),
        attachments: faker.datatype.boolean({ probability: 0.5 }) 
          ? Array.from({ length: faker.number.int({ min: 1, max: 2 }) }, () => 
              faker.system.fileName({ extensionCount: 1 })
            )
          : undefined
      }));

      const replyCount = faker.number.int({ min: 0, max: 2 });
      const replies = Array.from({ length: replyCount }, (_, rIdx) => ({
        id: rIdx + 1,
        reply: faker.lorem.sentence(),
        created_at: faker.date.past().toISOString(),
        attachments: faker.datatype.boolean({ probability: 0.3 })
          ? Array.from({ length: faker.number.int({ min: 1, max: 1 }) }, () => 
              faker.system.fileName({ extensionCount: 1 })
            )
          : undefined
      }));

      departments.push({
        id: dept.id,
        name: dept.name,
        progress,
        replies
      });
    }

    return {
      id: taskIdx + 1,
      subject_tasks: faker.lorem.sentences(2),
      progress_so_far: faker.lorem.paragraph(),
      timeline_date: faker.date.future().toLocaleDateString('en-GB'),
      timeline_note: faker.lorem.sentence(),
      expected_outcomes: faker.lorem.paragraph(),
      departments
    };
  });
};

const mockTasks = generateMockTasks();

export default function KhushhaalKPKTasksReport() {
  const [selectedTask, setSelectedTask] = useState<number | null>(null);
  const [_selectedDepartment, setSelectedDepartment] = useState<number | null>(null);
  const [modalContent, setModalContent] = useState<string>('');

  const handleViewProgress = (taskId: number, deptId: number) => {
    const task = mockTasks.find(t => t.id === taskId);
    if (!task) return;

    const dept = task.departments.find(d => d.id === deptId);
    if (!dept) return;

    // Generate modal content HTML
    let content = `
      <p class="text-primary"><b class="text-dark">${dept.name}</b></p>
      <p class="text-primary">${task.subject_tasks}</p>
      <table class="related_department_table">
        <thead>
          <tr>
            <th style="width:60px;vertical-align: middle;text-align:center;">Weekly/Monthly</th>
            <th style="width:100px;vertical-align: middle;text-align:center;">Date</th>
            <th style="width:200px;vertical-align: middle;text-align:center;">Response/Progress Summary</th>
            <th style="width:100px;vertical-align: middle;text-align:center;">Status</th>
          </tr>
        </thead>
        <tbody>
    `;

    dept.progress.forEach(prog => {
      let filesHtml = '';
      if (prog.attachments && prog.attachments.length > 0) {
        filesHtml = '<p><b>Presentation/Docs</b></p><ol>';
        prog.attachments.forEach(_file => {
          const date = new Date(prog.created_at).toLocaleDateString('en-GB');
          filesHtml += `<li><a href="#" style="font-size:16px;" title="click to download attached file"><i class="ti-receipt" style="font-size: 16px;margin-right: 5px;"></i>${date}</a></li>`;
        });
        filesHtml += '</ol>';
      }

      const date = new Date(prog.created_at).toLocaleDateString('en-GB');
      const statusClass = badgesWithIntegerStatus(prog.status);
      const statusText = badgesWithStringStatus(prog.status);

      content += `
        <tr>
          <td style="width:60px;word-wrap: break-word;">${prog.type}</td>
          <td style="width:100px; text-align: center;">${date}</td>
          <td style="width:200px;">${prog.progress}<br/><br/>${filesHtml}</td>
          <td style="width:100px; text-align: center;">
            <label style="width:100px;" class="badge badge-${statusClass} badge-pill">${statusText}</label>
          </td>
        </tr>
      `;
    });

    content += '</tbody></table>';

    // Add replies section if exists
    if (dept.replies.length > 0) {
      let repliesHtml = '<div class="row" style="margin-top:10px;"><div class="col-md-12 grid-margin stretch-card"><div class="card"><div><h4 class="card-title" style="background: green;padding: 15px;color: white;">Overall Response Presentations/Docs/Attachments</h4><ol style="padding-left: 25px;">';
      dept.replies.forEach(reply => {
        if (reply.attachments && reply.attachments.length > 0) {
          reply.attachments.forEach(_file => {
            const date = new Date(reply.created_at).toLocaleDateString('en-GB');
            repliesHtml += `<li><a href="#" style="font-size:16px;" title="click to download attached file"><i class="ti-receipt" style="font-size: 16px;margin-right: 5px;"></i>${date}</a>${reply.reply}</li>`;
          });
        }
      });
      repliesHtml += '</ol></div></div></div></div>';
      content += repliesHtml;
    }

    setModalContent(content);
    setSelectedTask(taskId);
    setSelectedDepartment(deptId);
  };

  const closeModal = () => {
    setSelectedTask(null);
    setSelectedDepartment(null);
    setModalContent('');
  };

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
        table#department_decision_detial_repsort {
          width: 100% !important;
        }
        #department_decision_detial_repsort td {
          border: 1px solid silver;
          vertical-align: top !important;
          font-size: 16px !important;
        }
        #department_decision_detial_repsort th {
          border: 1px solid silver;
          text-align: center;
          height: 35px;
        }
        .related_department_table {
          width: 100% !important;
        }
        .related_department_table td {
          border: 1px solid silver;
          vertical-align: top !important;
          font-size: 16px !important;
          margin: 5px !important;
        }
        .related_department_table th {
          border: 1px solid silver;
          text-align: center;
          height: 35px;
        }
        .d-decision {
          word-break: break-word !important;
          width: 100px;
          padding-left: 5px;
          padding-right: 5px;
        }
        .pres {
          width: 30px;
          padding-left: 5px;
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

          {/* SERVICE AT DOOR STEP Table */}
          <div className="row">
            <div className="col-12">
              <div className="table-responsive">
                <table id="department_decision_detial_repsort" className="table-striped" style={{ width: '100%' }}>
                  <thead style={{ background: 'rgb(37, 136, 95)', color: 'white' }}>
                    <tr style={{ background: '#0f1531', color: 'white' }}>
                      <th colSpan={6} style={{ padding: '10px', textAlign: 'center' }}>
                        <h6>SERVICE AT DOOR STEP</h6>
                      </th>
                    </tr>
                    <tr>
                      <th style={{ width: '37px' }}>S.NO</th>
                      <th style={{ width: '208px' }}>Subject Task</th>
                      <th className="pres" style={{ width: '30px' }}>Action By</th>
                      <th style={{ width: '200px' }}>Progress By</th>
                      <th style={{ width: '150px' }}>Timeline</th>
                      <th style={{ width: '250px' }}>Expected outcomes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockTasks.map((task, taskIndex) => (
                      <React.Fragment key={task.id}>
                        {taskIndex > 0 && (
                          <>
                            <tr style={{ background: '#0f1531', color: 'white' }}>
                              <th colSpan={6} style={{ padding: '10px', textAlign: 'center' }}>
                                <h6>SERVICE AT DOOR STEP</h6>
                              </th>
                            </tr>
                            <tr style={{ background: 'green', color: 'white' }}>
                              <th style={{ width: '37px' }}>S.NO</th>
                              <th style={{ width: '208px' }}>Subject Task</th>
                              <th className="pres" style={{ width: '30px' }}>Action By</th>
                              <th style={{ width: '200px' }}>Progress By</th>
                              <th style={{ width: '150px' }}>Timeline</th>
                              <th style={{ width: '250px' }}>Expected outcomes</th>
                            </tr>
                          </>
                        )}
                        <tr>
                          <td style={{ width: '5px', textAlign: 'center' }}>
                            <button
                              style={{ width: '25px', height: '25px', padding: '0.1rem 0rem' }}
                              type="button"
                              className="btn btn-outline-secondary btn-rounded btn-icon text-dark"
                            >
                              {taskIndex + 1}
                            </button>
                          </td>
                          <td className="d-decision">
                            <p dangerouslySetInnerHTML={{ __html: task.subject_tasks }} />
                          </td>
                          <td style={{ width: '160px', paddingLeft: '5px', paddingRight: '10px' }}>
                            {task.departments.length > 0 ? (
                              task.departments.map((dept) => {
                                const latestStatus = dept.progress.length > 0
                                  ? dept.progress[dept.progress.length - 1].status
                                  : 1;
                                const statusClass = badgesWithIntegerStatus(latestStatus);
                                return (
                                  <a
                                    key={dept.id}
                                    href="#"
                                    style={{ textDecoration: 'none', fontSize: '12px', marginTop: '5px', float: 'left' }}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      handleViewProgress(task.id, dept.id);
                                    }}
                                    data-toggle="modal"
                                    data-target="#related-minute-update-modal-departments"
                                  >
                                    <span
                                      className={`badge badge-${statusClass} badge-pill`}
                                      title="Click to view progress"
                                    >
                                      {dept.name}
                                    </span>
                                  </a>
                                );
                              })
                            ) : (
                              <span>&nbsp;</span>
                            )}
                          </td>
                          <td className="pres" style={{ width: '40px', paddingLeft: '5px' }}>
                            <span dangerouslySetInnerHTML={{ __html: task.progress_so_far || '' }} />
                          </td>
                          <td style={{ width: '30px' }}>
                            <p style={{ fontWeight: 0 }}>{task.timeline_date || ''}</p>
                            <p style={{ fontWeight: 0 }}>{task.timeline_note || ''}</p>
                          </td>
                          <td className="pres" style={{ width: '30px', paddingLeft: '5px' }}>
                            <span dangerouslySetInnerHTML={{ __html: task.expected_outcomes || '' }} />
                          </td>
                        </tr>
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Related Department Details */}
      <div 
        className={`modal fade ${selectedTask !== null ? 'show' : ''}`}
        id="related-minute-update-modal-departments"
        tabIndex={-1}
        role="dialog"
        aria-labelledby="ModalLabel"
        aria-hidden={selectedTask === null}
        style={{ display: selectedTask !== null ? 'block' : 'none' }}
      >
        <div className="modal-dialog modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-header" style={{ padding: '15px 27px' }}>
              <h5 className="modal-title" id="ModalLabel">Overall Progress</h5>
              <button type="button" className="close" onClick={closeModal} aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body" style={{ padding: '10px 26px' }}>
              <div className="row">
                <div style={{ margin: 'auto', width: '80%', padding: '10px' }} 
                     dangerouslySetInnerHTML={{ __html: modalContent }} />
              </div>
            </div>
            <div className="modal-footer">
              &nbsp;
            </div>
          </div>
        </div>
      </div>
      {selectedTask !== null && (
        <div className="modal-backdrop fade show" onClick={closeModal}></div>
      )}
    </div>
  );
}
