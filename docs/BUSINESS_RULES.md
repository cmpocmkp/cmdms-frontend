# CMDMS Business Rules (Extracted from Legacy System)

> **Source:** Old CMDMS Laravel application
> **Extracted:** December 2025
> **Purpose:** Reference for frontend development

---

## User Roles & Access

### 1. Admin Role
- **Role ID:** 1
- **Role Name:** `admin`
- **Description:** Full system access
- **Middleware:** `['auth', 'admin']`
- **Route Prefix:** `/admin`

**Permissions:**
- ✅ Full CRUD on all modules
- ✅ User management
- ✅ Department management
- ✅ View all department data
- ✅ Generate reports
- ✅ System settings
- ✅ Activity logs

**Admin can access:**
- Dashboard (aggregated data from all departments)
- Record Notes (CM Meetings) - Create/Edit/View/Delete
- Announcements - Create/Edit/View/Delete/Approve
- Directives - Create/Edit/View/Delete
- Sectoral Meetings - Create/Edit/View/Delete
- Board Meetings - Manage all
- Senate Meetings - Manage all
- CM Remarks - Create/Assign
- PTI - Create/Monitor
- Summaries - Create/View
- Khushhal KPK - Manage
- Interventions - Manage all
- Issues (HCM Public Affairs) - Manage
- Public Days - Manage
- PTF (Provincial Task Force) - Manage issues
- Complaints - View/Manage
- Reports - Generate all types
- Users - Create/Edit/Delete/Manage tokens

### 2. Department Role
- **Role ID:** 2
- **Role Name:** `department`
- **Description:** Department user access
- **Middleware:** `['auth', 'department']`
- **Route Prefix:** `/department`

**Permissions:**
- ✅ View assigned items (own department only)
- ✅ Reply to minutes/announcements/directives
- ✅ Update progress/status
- ✅ View department-specific data
- ❌ Cannot create new meetings/announcements
- ❌ Cannot view other departments' data
- ❌ Cannot delete items

**Department users can access:**
- Dashboard (department-specific data)
- Record Notes - View/Reply to assigned minutes
- Announcements - View/Reply
- Directives - View/Reply/Update progress
- Sectoral Meetings - View/Reply to agenda points
- Board Meetings - View/Reply to agenda points
- Senate Meetings - View/Reply to minutes
- CM Remarks - View/Reply
- PTI - View/Reply to assigned tasks
- Summaries - View/Reply to implementation tasks
- Khushhal KPK - View/Update progress/Reply
- PTF - View/Reply to assigned issues
- Settings - Profile management

### 3. Data Entry Role
- **Role ID:** 3
- **Role Name:** `data-entry`
- **Description:** Manage data entry operations

**Permissions:**
- ✅ Create/Edit records
- ❌ Cannot approve
- ❌ Cannot delete

### 4. CM (Chief Minister) Role
- **Role ID:** 4
- **Role Name:** `cm`
- **Description:** CM Secretariat access

**Permissions:**
- ✅ View all data
- ✅ Add CM remarks
- ✅ Monitor progress

### 5. CS (Chief Secretary) Role
- **Role ID:** 5
- **Role Name:** `cs`
- **Description:** Chief Secretary access

**Permissions:**
- ✅ View all data
- ✅ Generate reports
- ✅ Monitor departments

### 6. Board Role
- **Role ID:** 6
- **Role Name:** `board`
- **Description:** Board member access

**Permissions:**
- ✅ View board meetings
- ✅ Participate in discussions

---

## KP Government Departments (47 Total)

### Main Departments (Type 1)
1. Administration
2. Agriculture
3. C & W (Communication & Works)
4. Auqaf (Religious Endowments)
5. Energy & Power
6. Law
7. E & SE (Elementary & Secondary Education)
8. Information & Public Relations
9. ST & IT (Science & Technology & Information Technology)
10. Forest, Environment and Wildlife
11. Relief Rehabilitation & Settlement
12. Establishment
13. Excise & Taxation
14. Finance
15. Food
16. Health
17. Industries
18. Irrigation
19. Labour
20. Higher Education
21. Home & Tribal Affairs
22. Housing
23. IPC (Integrated Population Census)
24. Zakat & Ushr
25. LG & RDD (Local Government & Rural Development)
26. Minerals Development
27. Planning & Development
28. Population Welfare
29. PHE (Public Health Engineering)
30. Revenue
31. Social Welfare
32. Transport
33. Culture, Sports, Tourism, Archaeology & Youth Affairs
34. Other

### Divisional Commissioners (Type 1)
35. Commissioner Bannu Division
36. Commissioner DI.Khan Division
37. Commissioner Kohat Division
38. Commissioner Hazara Division
39. Commissioner Malakand Division
40. Commissioner Mardan Division
41. Commissioner Peshawar Division

### Other Departments (Type 1)
42. Police Department
43. DG PDA (Peshawar Development Authority)
44. Admin (System Admin Department)
45. Data Entry (System Department)
46. Department (Generic)
47. NHA (National Highway Authority)
48. PESCO (Peshawar Electric Supply Company)
49. WAPDA (Water and Power Development Authority)

---

## Module-Specific Business Rules

### Record Notes (CM Meetings)
**Purpose:** Minutes from Chief Minister meetings

**Workflow:**
1. Admin creates meeting with date, type, description
2. Admin adds minutes (agenda points) with:
   - Subject
   - Decision/discussion
   - Assigned departments (can be multiple)
   - Timeline
   - Status
3. Departments receive notifications
4. Departments reply with:
   - Progress update
   - Attachments (if any)
   - Status update
5. Admin monitors progress
6. Timeline tracking (on-target, off-target, overdue)

**Status Flow:**
- Pending → In Progress → Completed
- Pending → In Progress → Overdue (if timeline exceeded)

**Permissions:**
- Admin: Full CRUD
- Department: View assigned minutes, Reply only

### Announcements
**Purpose:** Government announcements and circulars

**Workflow:**
1. Admin creates announcement with:
   - Title
   - Description
   - Assigned departments
   - Attachments
   - Date
2. Can have sub-tasks
3. Departments reply/update progress
4. Admin monitors

**Status Flow:**
- Draft → Published
- Published → In Progress → Completed

**Permissions:**
- Admin: Create/Edit/Delete/Publish
- Department: View/Reply

### Directives
**Purpose:** Directives from government to departments

**Workflow:**
1. Admin creates directive
2. Assigns to departments
3. Departments reply with implementation status
4. Can have sub-tasks
5. Progress tracking
6. Timeline monitoring

**Status Flow:**
- Issued → In Progress → Completed
- Issued → In Progress → Overdue

**Permissions:**
- Admin: Create/Edit/Delete
- Department: View/Reply/Update progress

### Sectoral Meetings
**Purpose:** Sector-specific meetings

**Workflow:**
1. Admin creates sectoral meeting
2. Adds agenda points
3. Assigns departments to each agenda point
4. Departments reply to agenda points
5. Track decisions and follow-ups

**Status Flow:**
- Scheduled → Held → Follow-up → Closed

**Permissions:**
- Admin: Create/Manage meetings
- Department: View/Reply to assigned agenda points

### Board Meetings
**Purpose:** Board of Directors meetings

**Workflow:**
1. Admin creates board meeting for specific board
2. Adds agenda points
3. Departments (board members) reply
4. Track decisions

**Board Types:**
- Public boards
- Private boards
- Government boards

**Permissions:**
- Admin: Full management
- Board members: View/Participate

### Senate Meetings
**Purpose:** University senate meetings

**Workflow:**
1. Admin creates senate meeting
2. Adds minutes
3. Departments reply
4. Track implementation

**Status Flow:**
- Scheduled → Conducted → Follow-up → Closed

### CM Remarks
**Purpose:** Direct remarks from Chief Minister

**Workflow:**
1. Admin creates CM remark
2. Assigns to departments
3. Departments respond
4. High priority tracking

**Status Flow:**
- Issued → Under Review → Responded → Closed

**Permissions:**
- Admin/CM: Create
- Department: View/Reply (mandatory)

### PTI (Priority Transformation Initiatives)
**Purpose:** Track priority initiatives

**Workflow:**
1. Admin creates PTI initiative
2. Creates tasks under initiative
3. Assigns to departments
4. Departments update progress
5. Timeline and milestone tracking

**Status Flow:**
- Planned → In Progress → On Track/Off Track → Completed

### Summaries
**Purpose:** Summary reports and briefs

**Workflow:**
1. Admin creates summary
2. Assigns implementation tasks to departments
3. Departments reply with updates
4. Track implementation status

**Permissions:**
- Admin: Create/Edit summaries
- Department: View/Reply to tasks

### Khushhal KPK Programme
**Purpose:** Provincial development program

**Workflow:**
1. Admin creates Khushhal KPK tasks
2. Assigns to departments
3. Departments update KPIs
4. Progress tracking with data points
5. Timeline monitoring

**Status Flow:**
- Assigned → In Progress → On Target/Off Target → Completed

### Interventions
**Purpose:** Track government interventions

**Types:**
- Development schemes
- Public works
- Emergency responses
- Special projects

**Workflow:**
1. Admin creates intervention
2. Assigns activities
3. Departments update progress
4. Timeline and budget tracking

**Status Flow:**
- Proposed → Approved → In Progress → Completed

### Issues (HCM Public Affairs)
**Purpose:** Public affairs and HCM (High-level Committee Meetings) issues

**Workflow:**
1. Issues raised
2. Assigned to departments
3. Departments respond
4. Resolution tracking

**Priority Levels:**
- High
- Medium
- Low

### Public Days
**Purpose:** Public interaction events

**Workflow:**
1. Schedule public day event
2. Record applications/complaints
3. Assign to departments
4. Track resolution
5. Follow-up

### PTF (Provincial Task Force)
**Purpose:** Provincial Task Force issue management

**Workflow:**
1. Admin creates issue
2. Assigns to departments
3. Departments submit:
   - Initial response (within deadline)
   - Final response (with resolution)
4. DC (Deputy Commissioner) monitoring
5. Status tracking

**Status Flow:**
- Created → Assigned → Initial Response → Final Response → Resolved

**Permissions:**
- Admin: Create/Manage issues
- Department: View/Reply
- DC: Monitor and track

### Complaints
**Purpose:** Public complaints management

**Workflow:**
1. Complaint registered
2. Assigned to department
3. Department investigates
4. Response provided
5. Closed or escalated

**Status Flow:**
- Registered → Under Investigation → Responded → Closed

---

## File Upload Rules

**Allowed File Types:**
- PDF (`.pdf`)
- Word Documents (`.doc`, `.docx`)
- Excel Sheets (`.xls`, `.xlsx`)
- Images (`.jpg`, `.jpeg`, `.png`)

**File Size Limits:**
- Maximum per file: 10MB
- Multiple files: Allowed (up to 5 files per upload)

**Storage:**
- Files stored with unique identifiers
- Organized by module and date

---

## Timeline & Status Tracking

### Status Types
1. **Pending** - Awaiting action
2. **In Progress** - Work ongoing
3. **On Target** - Progress as per timeline
4. **Off Target** - Behind schedule but within deadline
5. **Overdue** - Deadline exceeded
6. **Completed** - Task finished
7. **Closed** - Officially closed

### Timeline Calculation
- **On Target:** Progress >= Expected progress based on timeline
- **Off Target:** Progress < Expected but deadline not passed
- **Overdue:** Current date > Deadline date

### Progress Tracking
- Percentage-based (0-100%)
- Color codes:
  - Green: On target (>= 75% on time)
  - Yellow: Off target (50-74% or behind)
  - Red: Overdue (deadline passed)
  - Gray: Completed

---

## Notification Rules

**Triggers:**
1. New assignment to department
2. Reply from department
3. Status change
4. Deadline approaching (3 days before)
5. Deadline exceeded

**Channels:**
- In-app notifications
- Email notifications (if configured)

---

## Report Types

### 1. Department-wise Reports
- Summary of all tasks by department
- Status breakdown
- Timeline compliance
- Performance metrics

### 2. Module-specific Reports
- Record Notes summary
- Directive implementation
- PTI progress
- Intervention status
- Sectoral meeting follow-ups

### 3. Consolidated Reports
- All minutes combined
- All directives combined
- All sectoral agenda points combined
- Cross-module analysis

### 4. KPI Reports
- Department KPI data
- DC KPI reports
- Khushhal KPK KPIs
- Custom KPI dashboards

### 5. Export Formats
- PDF (formatted reports)
- Excel (data export)
- Print view (formatted for printing)

---

## Search & Filter Rules

**Global Filters (Available in most modules):**
- Date range (from date - to date)
- Department
- Status
- Priority (if applicable)
- Search by keywords (title, description, reference number)

**Sorting:**
- Date (newest first / oldest first)
- Title (A-Z / Z-A)
- Status
- Priority

**Pagination:**
- Default: 10 items per page
- Options: 10, 25, 50, 100

---

## Authentication & Session Rules

**Login:**
- Email + Password
- Session-based authentication
- Remember me option (30 days)

**Session:**
- Timeout: 2 hours of inactivity
- Concurrent sessions: Allowed
- Token-based API authentication (Sanctum)

**Password Rules:**
- Minimum 8 characters
- Must contain letters and numbers
- Password reset via email

---

## Activity Log

**Tracked Actions:**
- User login/logout
- Create/Edit/Delete operations
- Status changes
- File uploads
- Reply submissions
- Report generation

**Log Information:**
- User ID
- Action type
- Module/Entity affected
- Timestamp
- IP address

---

## Notes for Frontend Development

1. **All workflows above should be reflected in UI state management**
2. **Status badges should match color codes**
3. **Timeline calculations should be client-side for real-time updates**
4. **Filters should persist in URL params for shareable links**
5. **Pagination state should be maintained**
6. **Form validation should match backend rules**
7. **Role-based UI rendering (hide features user can't access)**
8. **Breadcrumb navigation for deep nested pages**

---

## Mock Data Requirements

For realistic frontend development, mock data should include:

1. **50+ users** (across all roles)
2. **49 departments** (as listed above)
3. **100+ meetings** (various types)
4. **200+ minutes/agenda points**
5. **50+ announcements**
6. **50+ directives**
7. **Sample replies** (conversations)
8. **Date ranges** (past 2 years)
9. **Various statuses** (realistic distribution)
10. **File attachments** (mock file objects)

---

**End of Business Rules Documentation**

**Last Updated:** December 2025
**Source:** Old CMDMS Laravel Application Analysis

