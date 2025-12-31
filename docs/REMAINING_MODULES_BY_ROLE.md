# Remaining Modules by Role - Implementation Status

**Date:** December 2025  
**Purpose:** Identify what modules are remaining to build in new CMDMS for each role

---

## 📊 Executive Summary

| Role ID | Role Name | Sidebar Status | Pages Status | Priority |
|---------|-----------|----------------|--------------|----------|
| 1 | ADMIN (Super Admin) | ✅ Implemented | ✅ Fully Implemented | ✅ Complete |
| 2 | DEPARTMENT | ✅ Implemented | ⚠️ Placeholders Only | 🔴 High |
| 3 | DATAENTRY | ⚠️ Partial | ✅ Can Use Admin Pages | 🟡 Medium |
| 4 | CM (Chief Minister) | ⚠️ Partial | ✅ Can Use Admin Pages | 🟡 Medium |
| 5 | CS (Chief Secretary) | ❌ Missing | ❌ Missing | 🔴 High |
| 7 | SECTORIAL | ❌ Not Defined | ❌ Not Defined | 🟢 Low |

---

## 1. ADMIN (Role ID: 1) - Super Admin

### ✅ Status: FULLY IMPLEMENTED

**Sidebar:** ✅ Complete  
**Modules:** ✅ All 50+ modules implemented  
**Routes:** ✅ All routes configured

**Implemented Modules:**
- ✅ Dashboard
- ✅ Log Viewer (user.id === 1 only)
- ✅ Users Management
- ✅ Export Users
- ✅ Activity Logs
- ✅ Tags
- ✅ Departments
- ✅ Minutes (Record Notes)
- ✅ Directives
- ✅ Announcements
- ✅ PTIs KP
- ✅ Summaries for CM
- ✅ Trackers (Interventions)
- ✅ CM Remarks
- ✅ Inaugurations
- ✅ Sectoral Meetings
- ✅ All Schemes
- ✅ Boards (Meetings, Acts, Members)
- ✅ Funds Distribution (Annual Schemes, Distributed Schemes, Candidate Report)
- ✅ Review Meetings
- ✅ MNA/MPA Requests
- ✅ Officer Departments
- ✅ Officers
- ✅ Candidates
- ✅ MNA/MPA Posting Recommendation
- ✅ Khushhal Khyber Pakhtunkhwa
- ✅ All Reports (43+ report types)

**Note:** Currently only works for `user.id === 1`. Needs permission-based filtering for other admin roles.

---

## 2. DEPARTMENT (Role ID: 2) - Department Users

### ⚠️ Status: SIDEBAR & ROUTES IMPLEMENTED, PAGES ARE PLACEHOLDERS

**Sidebar:** ✅ Implemented (`DepartmentSidebar.tsx`)  
**Routes:** ✅ All 16 routes configured  
**Pages:** ❌ All pages are placeholders (show "under development")

### ❌ Remaining Modules to Build (16 Total)

#### Core Modules (Priority: HIGH)
1. **Record Notes** (`/department/record-notes`)
   - List view with department filtering
   - Reply functionality
   - Status updates
   - File attachments

2. **Cabinet Minutes** (`/department/record-notes?type=cabinet`)
   - Same as Record Notes but filtered for Cabinet meetings
   - Reply functionality

3. **CM Remarks** (`/department/cm-remarks`)
   - List view of CM remarks assigned to department
   - Reply functionality
   - Status tracking

4. **Directives** (`/department/directives`)
   - List view of directives assigned to department
   - Reply functionality
   - Progress updates

5. **Announcements** (`/department/announcements`)
   - List view of announcements visible to department
   - Reply functionality

#### Meeting Modules (Priority: HIGH)
6. **Sectoral Meetings** (`/department/sectorial-meetings`)
   - List view of sectoral meetings
   - Reply to agenda points
   - Status updates

7. **Boards Meetings** (`/department/board-meetings`)
   - List view of board meetings
   - Reply to agenda points

8. **Senate Meetings** (`/department/senate_meetings`)
   - List view of senate meetings
   - Reply to minutes

#### Development & Tracking Modules (Priority: MEDIUM)
9. **PTIs KP** (`/department/ptis`)
   - List view of PTIs assigned to department
   - Reply functionality
   - Status updates

10. **Summary Implementation Tasks** (`/department/summaries`)
    - List view of summary tasks assigned to department
    - Reply functionality
    - Progress tracking

11. **Khushhal Programme** (`/department/khushhal-programme`)
    - List view of Khushhal tasks
    - Progress updates
    - Status tracking

12. **Add KPI Data - Khushhal Programme** (`/department/khushhal-programme/add/kpis/data`)
    - Form to add KPI data
    - Data entry interface

13. **Show KPI Data - Khushhal Programme** (`/department/khushhal-programme/show/kpis/data`)
    - View KPI data
    - Reports and analytics

#### PTF Modules (Priority: MEDIUM)
14. **PTF Dashboard** (`/department/ptf`)
    - Dashboard view of PTF issues
    - Status overview

15. **Create New PTF Issue** (`/department/ptf/create-issue`)
    - Form to create new PTF issue
    - Issue details entry

16. **PTF Dashboard (Departments)** (`/department/ptf/departments/dashboard`)
    - Department-wise PTF dashboard
    - Issue tracking

### Implementation Notes
- All pages currently show placeholder content
- Need to implement full CRUD operations
- Need to match old CMDMS functionality exactly
- Permission-based access is already working

---

## 3. DATAENTRY (Role ID: 3) - Data Entry Operators

### ⚠️ Status: PARTIALLY IMPLEMENTED

**Sidebar:** ⚠️ Uses Admin Sidebar but hardcoded to `user.id === 1`  
**Pages:** ✅ Can use existing Admin pages  
**Permission Filtering:** ❌ Not implemented

### ❌ Remaining Work

1. **Update Sidebar Permission Logic**
   - ❌ Remove hardcoded `user?.id === 1` checks for most items
   - ❌ Add permission-based checks instead
   - ✅ Keep only these items restricted to `user.id === 1`:
     - Log Viewer
     - Users Management
     - Export Users
     - Tags
     - Departments

2. **Available Modules (Based on Permissions)**
   - ✅ Minutes (`admin.recordnotes.departments`)
   - ✅ Directives (`admin.directives.list`)
   - ✅ Announcements (`admin.announcements.list`)
   - ✅ PTIs KP (`admin.ptis.index`)
   - ✅ Summaries for CM (`admin.summaries.index`)
   - ✅ Trackers (`admin.interventions.index`)
   - ✅ CM Remarks (`admin.cmremarks.index`)
   - ✅ Inaugurations (`admin.inaugurations.index`)
   - ✅ Sectoral Meetings (`admin.sectorialmeetings.index`)
   - ✅ Boards (if permissions granted)
   - ✅ Funds Distribution (if permissions granted)
   - ✅ All Reports (if permissions granted)

### Implementation Required
- Update `Sidebar.tsx` to check permissions instead of `user?.id === 1`
- Test with Data Entry user credentials
- Ensure proper access control

---

## 4. CM (Role ID: 4) - Chief Minister

### ⚠️ Status: PARTIALLY IMPLEMENTED

**Sidebar:** ⚠️ Uses Admin Sidebar but hardcoded to `user.id === 1`  
**Pages:** ✅ Can use existing Admin pages  
**Permission Filtering:** ❌ Not implemented

### ❌ Remaining Work

1. **Update Sidebar Permission Logic**
   - ❌ Support CM role (role_id === 4)
   - ❌ Ensure CM has access to Reports section
   - ❌ Show only modules based on permissions

2. **Available Modules (Based on Permissions)**
   - ✅ Dashboard (`admin.dashboard`)
   - ✅ All Reports (if permissions granted)
   - ✅ Limited Admin modules (based on specific permissions)

### Implementation Required
- Update `Sidebar.tsx` to support CM role (role_id === 4)
- Ensure CM has access to Reports section
- Test with CM user credentials

---

## 5. CS (Role ID: 5) - Chief Secretary

### ❌ Status: NOT IMPLEMENTED

**Sidebar:** ❌ Missing CS Dashboard link  
**Dashboard:** ❌ CS Dashboard page not created  
**Routes:** ❌ CS routes not configured

### ❌ Remaining Work

1. **CS Dashboard** (Priority: HIGH)
   - ❌ Create CS Dashboard page (`/cs/dashboard`)
   - ❌ Implement CS-specific dashboard layout
   - ❌ Add CS dashboard route
   - ❌ Permission: `cs.csdashboard`

2. **Update Sidebar**
   - ❌ Show CS Dashboard link for `role_id === 5`
   - ❌ Hide Admin Dashboard for CS role
   - ❌ Show Reports section (if permissions granted)

3. **Old CMDMS Behavior**
   ```php
   @if (Auth::user()->role_id == 5)
       @if ($userpermission->contains('cs.csdashboard'))
           <li class="nav-item">
               <a class="nav-link" href="{{ route('cs.csdashboard') }}">
                   <i class="ti-home menu-icon"></i>
                   <span class="menu-title">Dashboard</span>
               </a>
           </li>
       @endif
   @endif
   ```

### Implementation Required
- Create `src/pages/cs/Dashboard.tsx`
- Add route `/cs/dashboard` in `src/routes/index.tsx`
- Update `Sidebar.tsx` to show CS Dashboard for role_id === 5
- Ensure CS has appropriate permissions for Reports
- Test with CS user credentials

---

## 6. SECTORIAL (Role ID: 7) - Sectorial Users

### ❌ Status: NOT CLEARLY DEFINED

**Sidebar:** ❌ Not clearly defined in old CMDMS  
**Pages:** ❌ Not clearly defined

### Notes from Old CMDMS
- Role exists in enum (`app/Enums/Roles.php`)
- Not clearly used in sidebar
- Likely uses Department sidebar with sectorial-specific permissions
- May have access to Sectoral Meetings module
- Appears in reply views: `role_id == 2 || role_id == 7`

### Implementation Required
1. ❌ Clarify SECTORIAL role usage in old CMDMS
2. ❌ Determine if it uses Department or Admin sidebar
3. ❌ Implement appropriate sidebar based on findings
4. ❌ Test with Sectorial user credentials

---

## 📋 Implementation Priority Summary

### 🔴 High Priority (Critical for Production)

1. **Department User Pages** (16 modules)
   - All department pages are placeholders
   - Need full implementation with CRUD operations
   - Estimated: 16 pages × 8 hours = 128 hours

2. **CS Dashboard**
   - CS role completely missing
   - Need dashboard and sidebar updates
   - Estimated: 16 hours

### 🟡 Medium Priority (Permission Fixes)

3. **Data Entry Role Support**
   - Update sidebar permission logic
   - Test with Data Entry users
   - Estimated: 8 hours

4. **CM Role Support**
   - Update sidebar permission logic
   - Test with CM users
   - Estimated: 8 hours

### 🟢 Low Priority (Clarification Needed)

5. **Sectorial Role**
   - Needs clarification from stakeholders
   - Determine requirements
   - Estimated: 16 hours (after clarification)

---

## 📝 Files to Create/Modify

### New Files to Create

#### Department Pages (16 files)
1. `src/pages/department/RecordNotesList.tsx` - Full implementation
2. `src/pages/department/CMRemarksList.tsx` - Full implementation
3. `src/pages/department/KhushhalProgrammeList.tsx` - Full implementation
4. `src/pages/department/AddKPIData.tsx` - Full implementation
5. `src/pages/department/ShowKPIData.tsx` - Full implementation
6. `src/pages/department/SectoralMeetingsList.tsx` - Full implementation
7. `src/pages/department/AnnouncementsList.tsx` - Full implementation
8. `src/pages/department/DirectivesList.tsx` - Full implementation
9. `src/pages/department/PTFDashboard.tsx` - Full implementation
10. `src/pages/department/CreatePTFIssue.tsx` - Full implementation
11. `src/pages/department/PTFDepartmentsDashboard.tsx` - Full implementation
12. `src/pages/department/BoardMeetingsList.tsx` - Full implementation
13. `src/pages/department/SenateMeetingsList.tsx` - Full implementation
14. `src/pages/department/PTIsList.tsx` - Full implementation
15. `src/pages/department/SummariesList.tsx` - Full implementation

#### CS Pages (1 file)
16. `src/pages/cs/Dashboard.tsx` - CS Dashboard implementation

### Files to Modify

1. **`src/components/shared/layout/Sidebar.tsx`**
   - Remove hardcoded `user?.id === 1` checks (except superadmin-only items)
   - Add permission-based checks
   - Add CS Dashboard link for `role_id === 5`
   - Support CM role (`role_id === 4`)
   - Support Data Entry role (`role_id === 3`)

2. **`src/routes/index.tsx`**
   - Add CS dashboard route
   - Ensure proper role-based route protection

3. **`src/types/index.ts`**
   - Verify UserRole enum matches old CMDMS roles
   - Update if needed

---

## 🎯 Quick Reference: Module Count by Role

| Role | Total Modules | Implemented | Remaining | Status |
|------|---------------|-------------|-----------|--------|
| **Admin (Super Admin)** | 50+ | 50+ | 0 | ✅ Complete |
| **Department** | 16 | 0 (placeholders) | 16 | ❌ Needs Implementation |
| **Data Entry** | 20+ | 20+ (via admin) | 0 | ⚠️ Needs Permission Fix |
| **CM** | 15+ | 15+ (via admin) | 0 | ⚠️ Needs Permission Fix |
| **CS** | 1 | 0 | 1 | ❌ Needs Implementation |
| **Sectorial** | ? | ? | ? | ❌ Needs Clarification |

---

## 📚 Reference Documents

- **Sidebar Implementation Plan:** `docs/SIDEBAR_IMPLEMENTATION_PLAN.md`
- **Business Rules:** `BUSINESS_RULES.md`
- **Department Implementation Summary:** `docs/IMPLEMENTATION_SUMMARY.md`
- **Test Credentials:** `docs/TEST_CREDENTIALS.md`

---

**Last Updated:** December 2025  
**Status:** Draft for Review

