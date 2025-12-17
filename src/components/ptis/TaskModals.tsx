/**
 * Task Modals - Add, Edit Task, and Edit Departments
 * Matches old CMDMS admin/tasks/_modals.blade.php
 */

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

// Mock departments data
const mockDepartments = [
  { id: 1, name: 'Planning & Development' },
  { id: 2, name: 'Finance Department' },
  { id: 3, name: 'Health Department' },
  { id: 4, name: 'Education Department' },
  { id: 5, name: 'Local Government' },
];

interface TaskModalsProps {
  ptiId: number;
  showAddTask: boolean;
  setShowAddTask: (show: boolean) => void;
  showEditTask: boolean;
  setShowEditTask: (show: boolean) => void;
  editingTaskId: number | null;
  showEditDepartments: boolean;
  setShowEditDepartments: (show: boolean) => void;
  editingDepartmentsTaskId: number | null;
}

export function TaskModals({
  ptiId,
  showAddTask,
  setShowAddTask,
  showEditTask,
  setShowEditTask,
  editingTaskId,
  showEditDepartments,
  setShowEditDepartments,
  editingDepartmentsTaskId,
}: TaskModalsProps) {
  const [attachmentFields, setAttachmentFields] = useState([{ id: 1 }]);
  const [selectedDepartments, setSelectedDepartments] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  const handleAddAttachment = () => {
    setAttachmentFields([...attachmentFields, { id: attachmentFields.length + 1 }]);
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    if (checked) {
      setSelectedDepartments(mockDepartments.map(d => d.id));
    } else {
      setSelectedDepartments([]);
    }
  };

  const handleDepartmentToggle = (deptId: number) => {
    if (selectedDepartments.includes(deptId)) {
      setSelectedDepartments(selectedDepartments.filter(id => id !== deptId));
    } else {
      setSelectedDepartments([...selectedDepartments, deptId]);
    }
  };

  const handleSubmitAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Add Task submitted for PTI:', ptiId);
    alert('Task will be saved via API');
    setShowAddTask(false);
  };

  const handleSubmitEditTask = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Edit Task submitted for Task ID:', editingTaskId);
    alert('Task changes will be saved via API');
    setShowEditTask(false);
  };

  const handleSubmitEditDepartments = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Edit Departments submitted for Task ID:', editingDepartmentsTaskId);
    alert('Department assignments will be saved via API');
    setShowEditDepartments(false);
  };

  return (
    <>
      {/* Add Task Modal */}
      <Dialog open={showAddTask} onOpenChange={setShowAddTask}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Task</DialogTitle>
            <DialogDescription>
              Add a new task to this PTI initiative
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitAddTask}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="task-title">Title</Label>
                <Input id="task-title" name="title" required />
              </div>

              <div>
                <Label htmlFor="task-description">Description</Label>
                <textarea
                  id="task-description"
                  name="description"
                  className="form-control"
                  rows={4}
                  placeholder="Enter task description..."
                />
                <small className="text-muted">You can use rich text formatting here</small>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="task-timeline">Timeline</Label>
                  <Input
                    id="task-timeline"
                    name="timeline"
                    type="datetime-local"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="d-flex justify-content-start align-items-center mb-2">
                  <h5 className="mr-2">Attachments</h5>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddAttachment}
                  >
                    <i className="ti-plus mr-1"></i> Add Attachment
                  </Button>
                </div>
                {attachmentFields.map((field) => (
                  <div key={field.id} className="d-flex gap-2 mb-2">
                    <Input
                      type="file"
                      name="attachments[]"
                      className="flex-1"
                    />
                    <Input
                      type="text"
                      name="attachment_titles[]"
                      placeholder="Attachment Title"
                      className="flex-1"
                    />
                  </div>
                ))}
              </div>

              <div>
                <Label>Assign to Departments</Label>
                <div className="form-check form-check-flat form-check-primary mb-2">
                  <label className="form-check-label">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={selectAll}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                    />
                    Select all
                    <i className="input-helper"></i>
                  </label>
                </div>
                <div className="border rounded p-3" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                  {mockDepartments.map((dept) => (
                    <div key={dept.id} className="form-check form-check-flat form-check-primary">
                      <label className="form-check-label">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          checked={selectedDepartments.includes(dept.id)}
                          onChange={() => handleDepartmentToggle(dept.id)}
                        />
                        {dept.name}
                        <i className="input-helper"></i>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-check form-check-flat form-check-primary">
                <label className="form-check-label">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    name="auto_update_status"
                    defaultChecked
                  />
                  Enable automatic status update
                  <i className="input-helper"></i>
                </label>
                <small className="form-text text-muted d-block">
                  When checked, this task's status will be automatically set to{' '}
                  <strong>Overdue</strong> after the timeline passes, unless it is already completed.
                </small>
              </div>
            </div>

            <DialogFooter className="mt-4">
              <Button type="submit" className="btn btn-primary">
                Save Task
              </Button>
              <Button
                type="button"
                variant="secondary"
                className="btn btn-secondary"
                onClick={() => setShowAddTask(false)}
              >
                Cancel
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Task Modal */}
      <Dialog open={showEditTask} onOpenChange={setShowEditTask}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Task #{editingTaskId}</DialogTitle>
            <DialogDescription>
              Update task details and settings
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitEditTask}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-task-title">Title</Label>
                <Input
                  id="edit-task-title"
                  name="title"
                  defaultValue="Sample Task Title"
                  required
                />
              </div>

              <div>
                <Label htmlFor="edit-task-description">Description</Label>
                <textarea
                  id="edit-task-description"
                  name="description"
                  className="form-control"
                  rows={4}
                  defaultValue="<p>Sample task description</p>"
                />
              </div>

              <div>
                <Label htmlFor="edit-task-progress">Progress</Label>
                <textarea
                  id="edit-task-progress"
                  name="progress"
                  className="form-control"
                  rows={3}
                  defaultValue="<p>Task is in progress...</p>"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-task-timeline">Timeline</Label>
                  <Input
                    id="edit-task-timeline"
                    name="timeline"
                    type="datetime-local"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="d-flex justify-content-start align-items-center mb-2">
                  <h5 className="mr-2">Attachments</h5>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddAttachment}
                  >
                    <i className="ti-plus mr-1"></i> Add Attachment
                  </Button>
                </div>
                <div className="mb-3">
                  <Label>Existing Attachments:</Label>
                  <ul className="list-unstyled">
                    <li className="d-flex justify-content-between align-items-center mb-1">
                      <span>📎 sample-document.pdf</span>
                      <button type="button" className="btn btn-sm btn-danger">
                        <i className="ti-trash"></i>
                      </button>
                    </li>
                  </ul>
                </div>
                {attachmentFields.map((field) => (
                  <div key={field.id} className="d-flex gap-2 mb-2">
                    <Input
                      type="file"
                      name="attachments[]"
                      className="flex-1"
                    />
                    <Input
                      type="text"
                      name="attachment_titles[]"
                      placeholder="Attachment Title"
                      className="flex-1"
                    />
                  </div>
                ))}
              </div>

              <div>
                <Label>Assigned Departments</Label>
                <div className="form-check form-check-flat form-check-primary mb-2">
                  <label className="form-check-label">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={selectAll}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                    />
                    Select all
                    <i className="input-helper"></i>
                  </label>
                </div>
                <div className="border rounded p-3" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                  {mockDepartments.map((dept) => (
                    <div key={dept.id} className="form-check form-check-flat form-check-primary">
                      <label className="form-check-label">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          checked={selectedDepartments.includes(dept.id)}
                          onChange={() => handleDepartmentToggle(dept.id)}
                        />
                        {dept.name}
                        <i className="input-helper"></i>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter className="mt-4">
              <Button type="submit" className="btn btn-primary">
                Update Task
              </Button>
              <Button
                type="button"
                variant="secondary"
                className="btn btn-secondary"
                onClick={() => setShowEditTask(false)}
              >
                Cancel
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Departments Modal */}
      <Dialog open={showEditDepartments} onOpenChange={setShowEditDepartments}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Task Departments</DialogTitle>
            <DialogDescription>
              Manage department assignments and their statuses for Task #{editingDepartmentsTaskId}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitEditDepartments}>
            <div className="space-y-4">
              <div>
                <Label>Assigned Departments & Status</Label>
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Department</th>
                      <th>Status</th>
                      <th>Progress Note</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockDepartments.slice(0, 3).map((dept) => (
                      <tr key={dept.id}>
                        <td>{dept.name}</td>
                        <td>
                          <select className="form-control form-control-sm" name={`status[${dept.id}]`}>
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="On Target">On Target</option>
                            <option value="Completed">Completed</option>
                            <option value="Overdue">Overdue</option>
                          </select>
                        </td>
                        <td>
                          <textarea
                            className="form-control form-control-sm"
                            name={`notes[${dept.id}]`}
                            rows={2}
                            placeholder="Progress notes..."
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div>
                <Label>Add More Departments</Label>
                <div className="border rounded p-3" style={{ maxHeight: '150px', overflowY: 'auto' }}>
                  {mockDepartments.map((dept) => (
                    <div key={dept.id} className="form-check form-check-flat form-check-primary">
                      <label className="form-check-label">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          name="new_departments[]"
                          value={dept.id}
                        />
                        {dept.name}
                        <i className="input-helper"></i>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter className="mt-4">
              <Button type="submit" className="btn btn-primary">
                Save Changes
              </Button>
              <Button
                type="button"
                variant="secondary"
                className="btn btn-secondary"
                onClick={() => setShowEditDepartments(false)}
              >
                Cancel
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
