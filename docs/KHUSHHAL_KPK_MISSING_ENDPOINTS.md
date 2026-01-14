# Khushhal KPK Module - Missing API Endpoints

**Date:** Current Session  
**Module:** Khushhal KPK  
**Status:** ⚠️ Significant API Mismatch

## Summary

The Khushhal KPK module frontend has a **complex structure** that requires significantly more fields and functionality than what is currently documented in `API_INTEGRATION_GUIDE.md`. The documented API endpoints (`GET /api/khushhal-kpk/tasks`, `POST /api/khushhal-kpk/tasks`, etc.) only support basic fields (`title`, `description`, `districtId`, `budget`, `status`), while the frontend requires rich text fields, multiple departments, file attachments, timeline management, department-specific progress tracking, and replies functionality.

## Documented Endpoints (✅ Implemented in Service)

The following endpoints are documented in `API_INTEGRATION_GUIDE.md` and have been integrated in `khushhalKPKService.ts`:

1. ✅ `GET /api/khushhal-kpk/tasks` - List tasks (basic pagination/filters)
2. ✅ `GET /api/khushhal-kpk/tasks/:id` - Get task
3. ✅ `POST /api/khushhal-kpk/tasks` - Create task (basic fields only)
4. ✅ `PATCH /api/khushhal-kpk/tasks/:id` - Update task (basic fields only)
5. ✅ `DELETE /api/khushhal-kpk/tasks/:id` - Delete task
6. ✅ `POST /api/khushhal-kpk/tasks/:id/progress` - Add task progress (basic: progress percentage, notes)

**Note:** These endpoints support only basic fields (`title`, `description`, `districtId`, `budget`, `status`), which do not match the frontend requirements.

## Missing/Insufficient Endpoints (❌ Not Documented or Incomplete)

### Core Task Fields (Current API Missing)

The documented API endpoints are missing support for the following fields that the frontend requires:

1. ❌ `subject_tasks` - Rich text/HTML field for task subject/description
2. ❌ `progress_so_far` - Rich text/HTML field for progress description
3. ❌ `expected_outcomes` - Rich text/HTML field for expected outcomes
4. ❌ `timeline_note` - Rich text/HTML field for timeline notes
5. ❌ `timeline_date` - Date field for timeline
6. ❌ `action_by_note` - Rich text/HTML field for action notes
7. ❌ `departments` - Array of department IDs (currently only supports `districtId`)
8. ❌ `attachments` - File attachments support (multiple files)
9. ❌ `status` per department - Currently only supports single status per task

### Enhanced Task Management

1. ❌ `GET /api/khushhal-kpk/tasks/:id/departments` - Get assigned departments for a task
2. ❌ `POST /api/khushhal-kpk/tasks/:id/departments` - Assign departments to a task
3. ❌ `PATCH /api/khushhal-kpk/tasks/:id/departments` - Update department assignments
4. ❌ `DELETE /api/khushhal-kpk/tasks/:id/departments/:departmentId` - Remove a department from task

### File Attachments

5. ❌ `POST /api/khushhal-kpk/tasks/:id/attachments` - Upload attachments for a task (multipart/form-data)
6. ❌ `GET /api/khushhal-kpk/tasks/:id/attachments` - List attachments for a task
7. ❌ `GET /api/khushhal-kpk/tasks/:id/attachments/:attachmentId` - Download/get specific attachment
8. ❌ `DELETE /api/khushhal-kpk/tasks/:id/attachments/:attachmentId` - Delete an attachment

### Department-Specific Progress Tracking

9. ❌ `GET /api/khushhal-kpk/tasks/:id/progress` - List all progress entries for a task
10. ❌ `GET /api/khushhal-kpk/tasks/:id/progress/departments/:departmentId` - Get progress for a specific department
11. ❌ `POST /api/khushhal-kpk/tasks/:id/progress/departments/:departmentId` - Add department-specific progress
   - **Expected Fields:**
     - `type` (string: "weekly" | "monthly")
     - `progress` (string: rich text/HTML)
     - `status` (string)
     - `attachments` (files array)
12. ❌ `PATCH /api/khushhal-kpk/tasks/:id/progress/:progressId` - Update progress entry
13. ❌ `DELETE /api/khushhal-kpk/tasks/:id/progress/:progressId` - Delete progress entry

### Department Replies

14. ❌ `GET /api/khushhal-kpk/tasks/:id/replies` - List replies for a task
15. ❌ `GET /api/khushhal-kpk/tasks/:id/replies/departments/:departmentId` - Get replies from a specific department
16. ❌ `POST /api/khushhal-kpk/tasks/:id/replies` - Create a reply (from department)
   - **Expected Fields:**
     - `department_id` (number)
     - `reply` (string: rich text/HTML)
     - `attachments` (files array)
17. ❌ `GET /api/khushhal-kpk/tasks/:id/replies/:replyId` - Get a specific reply
18. ❌ `PATCH /api/khushhal-kpk/tasks/:id/replies/:replyId` - Update a reply
19. ❌ `DELETE /api/khushhal-kpk/tasks/:id/replies/:replyId` - Delete a reply

### Task Status Management (Per Department)

20. ❌ `GET /api/khushhal-kpk/tasks/:id/departments/:departmentId/status` - Get status for a department
21. ❌ `PATCH /api/khushhal-kpk/tasks/:id/departments/:departmentId/status` - Update status for a department
   - **Expected Fields:**
     - `status` (string: "1" (Pending), "2" (In Progress), "3" (Completed), "4" (On Hold))

## Frontend Pages Affected

### 1. KhushhalKPKList.tsx
- **Status:** ❌ Cannot be integrated
- **Issues:**
  - Requires `subject_tasks` (rich text), `departments` (array), `progress_so_far` (rich text), `timeline_date`, `timeline_note` (rich text), `expected_outcomes` (rich text), `action_by_note` (rich text), `attachments`, per-department status
  - Current API only provides: `title`, `description`, `districtId`, `budget`, `status`
- **Current State:** Uses mock data only

### 2. AddKhushhalKPK.tsx
- **Status:** ❌ Cannot be integrated
- **Issues:**
  - Form requires: `subject_tasks`, `progress_so_far`, `expected_outcomes`, `timeline_note`, `timeline_date`, `departments[]` (array), `action_by_note`, `status`, `attachments[]` (files)
  - Current API only supports: `title`, `description`, `districtId`, `budget`
- **Current State:** Uses mock data only

### 3. EditKhushhalKPK.tsx
- **Status:** ❌ Cannot be integrated
- **Issues:**
  - Same field requirements as AddKhushhalKPK.tsx
  - Requires update endpoint with all rich text fields and file attachments
- **Current State:** Uses mock data only

### 4. ShowKhushhalKPK.tsx
- **Status:** ❌ Cannot be integrated
- **Issues:**
  - Requires department-specific progress tracking
  - Requires progress type (weekly/monthly)
  - Requires file attachments for progress
  - Current progress endpoint only supports: `progress` (percentage), `notes` (text)
- **Current State:** Uses mock data only

### 5. KhushhalKPKReplies.tsx
- **Status:** ❌ Cannot be integrated
- **Issues:**
  - No replies endpoints documented
  - Requires department-based replies with attachments
- **Current State:** Uses mock data only

## Expected API Response Structure

For full frontend integration, the API should return tasks in this structure:

```json
{
  "success": true,
  "data": {
    "id": 1,
    "subject_tasks": "<p>Task description with HTML</p>",
    "progress_so_far": "<p>Progress description</p>",
    "expected_outcomes": "<p>Expected outcomes</p>",
    "timeline_note": "<p>Timeline notes</p>",
    "timeline_date": "2024-12-31",
    "action_by_note": "<p>Action notes</p>",
    "departments": [
      {
        "id": 1,
        "name": "Health Department",
        "status": "2"
      },
      {
        "id": 2,
        "name": "Education Department",
        "status": "3"
      }
    ],
    "attachments": [
      {
        "id": 1,
        "filename": "document.pdf",
        "url": "/api/khushhal-kpk/tasks/1/attachments/1",
        "size": 1024000,
        "mime_type": "application/pdf"
      }
    ],
    "status": "2",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-15T00:00:00Z"
  }
}
```

## Expected Create/Update Request Structure

```json
{
  "subject_tasks": "<p>Task description</p>",
  "progress_so_far": "<p>Progress so far</p>",
  "expected_outcomes": "<p>Expected outcomes</p>",
  "timeline_note": "<p>Timeline notes</p>",
  "timeline_date": "2024-12-31",
  "action_by_note": "<p>Action notes</p>",
  "departments": [1, 2, 3],
  "status": "2"
}
```

**Note:** File attachments should be sent via `multipart/form-data` with field name `attachments[]`.

## Expected Progress Response Structure

```json
{
  "success": true,
  "data": {
    "id": 1,
    "task_id": 1,
    "department_id": 1,
    "department": {
      "id": 1,
      "name": "Health Department"
    },
    "type": "weekly",
    "progress": "<p>Progress update for this week</p>",
    "status": "2",
    "attachments": [
      {
        "id": 1,
        "filename": "progress_report.pdf",
        "url": "/api/khushhal-kpk/tasks/1/progress/1/attachments/1"
      }
    ],
    "created_at": "2024-01-15T00:00:00Z",
    "created_by": {
      "id": 1,
      "name": "User Name"
    }
  }
}
```

## Expected Reply Response Structure

```json
{
  "success": true,
  "data": {
    "id": 1,
    "task_id": 1,
    "department_id": 1,
    "department": {
      "id": 1,
      "name": "Health Department"
    },
    "reply": "<p>Department response</p>",
    "attachments": [
      {
        "id": 1,
        "filename": "reply_attachment.pdf",
        "url": "/api/khushhal-kpk/tasks/1/replies/1/attachments/1"
      }
    ],
    "created_at": "2024-01-15T00:00:00Z",
    "created_by": {
      "id": 1,
      "name": "User Name"
    }
  }
}
```

## Recommendations

1. **Expand Core Task Endpoints:** Update `POST /api/khushhal-kpk/tasks` and `PATCH /api/khushhal-kpk/tasks/:id` to support all required fields including rich text fields, departments array, and file attachments.

2. **Add Department Management:** Implement endpoints for managing department assignments and per-department status.

3. **Enhance Progress Tracking:** Extend the progress endpoint to support department-specific progress, progress types (weekly/monthly), rich text, and file attachments.

4. **Implement Replies System:** Add comprehensive endpoints for department replies with attachments.

5. **File Attachment System:** Implement a complete file attachment system for tasks, progress entries, and replies.

## Priority

**HIGH** - The Khushhal KPK module is a core feature with 4 pages that cannot be integrated without these endpoints. The current API structure is too basic and does not match the frontend requirements at all.



