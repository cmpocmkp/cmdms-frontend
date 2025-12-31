# CMDMS Sidebar Implementation Plan

## Executive Summary

This document outlines the sidebar and module access for each user role in the old CMDMS system, compares it with the new CMDMS implementation status, and provides a roadmap for completing the implementation.

**Current Status**: Only the **Admin/Superadmin sidebar** (user ID 1) has been implemented in the new CMDMS.

**Missing**: Department User sidebar, CS (Chief Secretary) sidebar, and role-based permission filtering for all admin roles.

---

## User Roles in CMDMS

Based on `app/Enums/Roles.php` from old CMDMS:

| Role ID | Role Name | Description | Old CMDMS Layout |
|---------|-----------|-------------|------------------|
| 1 | ADMIN | Super Admin (Full System Access) | `admin/partials/sidebar.blade.php` |
| 2 | DEPARTMENT | Department User | `department/partials/sidebar.blade.php` |
| 3 | DATAENTRY | Data Entry Operator | `admin/partials/sidebar.blade.php` (with permissions) |
| 4 | CM | Chief Minister | `admin/partials/sidebar.blade.php` (with permissions) |
| 5 | CS | Chief Secretary | `admin/partials/sidebar.blade.php` (CS Dashboard) |
| 7 | SECTORIAL | Sectorial User | Not clearly defined in sidebar (likely department-based) |

---

## 1. ADMIN (Role ID: 1) - Super Admin

### Status: ✅ **IMPLEMENTED** (Partially - Only for user.id === 1)

### Old CMDMS Sidebar Structure

#### Dashboard
- **Dashboard** (`admin.dashboard`) - Route: `/admin/dashboard`
  - ✅ Implemented

#### Admin Menu (Collapsible)
Shown when user has ANY of the admin permissions.

**Super Admin Only (user.id === 1):**
- ✅ **Log Viewer** - `/admin/log-viewer`
- ✅ **Users** (`admin.users.list`) - `/admin/users`
- ✅ **Export Users** (`admin.userExport`) - `/admin/users/export`
- ✅ **Users Activity Logs** (`admin.activitylogs.index`) - `/admin/activitylogs`
- ✅ **Tags** (`admin.tags.index`) - `/admin/tags`
- ✅ **Departments** (`admin.department.index`) - `/admin/departments`

**Admin & Data Entry:**
- ✅ **Minutes** (`admin.recordnotes.departments`) - `/admin/recordnotes` or `/admin/record-notes`
- ✅ **Directives** (`admin.directives.list`) - `/admin/directives`
- ✅ **Announcements** (`admin.announcements.list`) - `/admin/announcements`
- ✅ **PTIs KP** (`admin.ptis.index`) - `/admin/ptis`
- ✅ **Summaries for CM** (`admin.summaries.index`) - `/admin/summaries`
- ✅ **Trackers** (`admin.interventions.index`) - `/admin/interventions` or `/admin/report/interventions/detail`
- ✅ **CM Remarks** (`admin.cmremarks.index`) - `/admin/cmremarks`
- ✅ **Inaugurations** (`admin.inaugurations.index`) - `/admin/inaugurations`
- ✅ **Sectoral Meetings** (`admin.sectorialmeetings.index`) - `/admin/sectorialmeetings`
- ✅ **All Schemes** (`admin.schemes.index`) - `/admin/schemes` (when sectorial meetings permission exists)

**Boards (Collapsible Submenu):**
- ✅ **Meetings** (`admin.boardmeetings.index`) - `/admin/boardmeetings`
- ✅ **Acts** (`admin.boardacts.index`) - `/admin/boardacts`
- ✅ **Members** (`admin.boardmembers.index`) - `/admin/boardmembers`

**Funds Distribution (Collapsible Submenu):**
- ✅ **Annual Schemes** (`admin.annualschemes.index`) - `/admin/annualschemes`
- ✅ **Distributed Schemes** (`admin.distributed.schemes`) - `/admin/distributed`
- ✅ **Candidate Report** (`admin.candidate.distributed.fund.report`) - `/admin/candidate`

**Other Admin Modules:**
- ✅ **Review Meetings** (`admin.reviewmeetings.index`) - `/admin/reviewmeetings`
- ✅ **MNA/MPA Requests** (`admin.candidaterequests.index`) - `/admin/candidaterequests`
- ✅ **Officer Departments** (`admin.officerdepartments.index`) - `/admin/officerdepartments`
- ✅ **Officers** (`admin.officers.index`) - `/admin/officers`
- ✅ **Candidates** (`admin.candidates.index`) - `/admin/candidates`
- ✅ **MNA/MPA Posting Recommendation** (`admin.posting.recommendation.index`) - `/admin/mna-mpa/posting/recommendation`
- ✅ **Khushhal Khyber Pakhtunkhwa** (`admin.khushhalkpk.index`) - `/admin/khushhalkpk`

#### Reports Menu (Collapsible)
Shown when user has ANY report permission.

- ✅ **Cabinet** (`admin.report.cabinet.meetings`) - `/admin/report/cabinet-meetings`
- ✅ **Cabinet Department-wise** (`admin.report.department.wise.cabinet.meeting.decisions`) - `/admin/report/department-wise/cabinet-meeting/decisions`

**Boards Reports (Collapsible Submenu):**
- ✅ **Meetings** (`admin.report.boardmeetings`) - `/admin/report/board/meetings`
- ✅ **Acts** (`admin.report.boardacts`) - `/admin/report/board/acts`

**Summaries for CM (Collapsible Submenu):**
- ✅ **Summary** (`admin.report.summaries.summary`) - `/admin/report/summaries/summary`
- ✅ **Detail** (`admin.report.summaries.detail`) - `/admin/report/summaries/detail`

- ✅ **Inaugurations** (`admin.report.inaugurations`) - `/admin/report/inaugurations`
- ✅ **Review Meetings** (`admin.report.review.meetings`) - `/admin/report/review-meetings`
- ✅ **Review Meetings By DS** (`admin.report.ds.wise.review.meetings`) - `/admin/report/ds-wise-review-meetings`
- ✅ **Khushhaal Khyber Pakhtunkhwa** (`admin.report.khushhalkpk.tasks`) - `/admin/report/khushhalkpk-tasks`
- ✅ **KPi Data Reports** (`admin.kpidata.index`) - `/admin/kpidata`
- ✅ **DC KPIs Data Filter** (`admin.kpidata.show`) - `/admin/kpidata/show`
- ✅ **DPOs KPIs Data Filter** (`admin.kpidata.dpos`) - `/admin/kpidata/dpos`
- ✅ **Departments KPIs Data Filter** (`admin.kpidata.department`) - `/admin/kpidata/departments`
- ✅ **DC Inspection Details** (`admin.report.dc.inspection`) - `/admin/report/dc-inspection`
- ✅ **PMRU** (`admin.report.pmru.meetings`) - `/admin/report/pmru-meetings`
- ✅ **Filter Record Notes** (`admin.admin.report.filter.recordnotes`) - `/admin/report/filter-recordnotes`

**PTF Module (Collapsible Submenu):**
- ✅ **Dashboard** (`admin.cm.ptf.index`) - `/admin/report/ptf/index`
- ✅ **Meetings** (`admin.cm.ptf.meetings`) - `/admin/report/ptf/meetings`
- ✅ **Department Wise Report** (`admin.cm.ptf.report.departmentwise`) - `/admin/report/ptf/department-wise`
- ✅ **District Wise Report** (`admin.cm.ptf.report.districtwise`) - `/admin/report/ptf/district-wise`
- ✅ **District Detail Report 1** (`admin.cm.ptf.report.districtdetail`) - `/admin/ptfs/report-district-detail`
- ✅ **District Wise Report (Latest)** (`admin.cm.ptf.report.districtlatest`) - `/admin/ptfs/report-district-latest`

**Super Admin Only Reports (user.id === 1):**
- ✅ **Recordnotes Updates** (`admin.report.recordnotes.updates`) - `/admin/report/recordnotes-updates`
- ✅ **Recordnotes Comparision** (`admin.report.recordnotes.comparision`) - `/admin/report/recordnotes-comparision`

**External Links (in Reports section):**
- ❌ **CM Initiatives Tracker** - External Google Docs link (removed from new CMDMS)
- ❌ **Good Governance Roadmap** (`admin.good.governance.roadmap.link`) - External IPMS link (removed)
- ❌ **CM DSD Visit** (`admin.cm.dsd.visit.link`) - External IPMS link (removed)
- ❌ **Ekhteyar Aawam Ka** (`admin.ekhtyar.awamka.link`) - Placeholder (removed)

### Missing/Issues in New CMDMS
1. ❌ **Permission-based filtering**: Currently only checks `user?.id === 1`, but should check permissions for roles 3 (Data Entry) and 4 (CM)
2. ❌ **CS Dashboard**: Role 5 (CS) has a different dashboard route (`cs.csdashboard`) - not implemented
3. ❌ **Cabinet Meeting special case**: User ID for Cabinet user has special handling for "Add Cabinet Meeting" vs "Minutes" - needs verification

---

## 2. DEPARTMENT (Role ID: 2) - Department Users

### Status: ❌ **NOT IMPLEMENTED**

### Old CMDMS Sidebar Structure
**File**: `department/partials/sidebar.blade.php`

**Layout**: Completely different from admin sidebar. Shows department name at top.

#### Dashboard
- **Dashboard** - Route: `/department/dashboard`
  - ✅ Route exists, but sidebar not implemented

#### Modules (Permission-based)

1. **Record Notes** (`department.recordnotes.list`)
   - Route: `/department/record-notes`
   - ❌ Not implemented

2. **Cabinet Minutes** (`department.recordnotes.list` with type=cabinet)
   - Route: `/department/record-notes?type=cabinet`
   - ❌ Not implemented

3. **CM Remarks** (`department.cmremarks.index`)
   - Route: `/department/cm-remarks`
   - ❌ Not implemented

4. **Khushhal Programme** (`department.khushhal.task.list`)
   - Route: `/department/khushhal-programme`
   - ❌ Not implemented

5. **Add KPI Data - Khushhal Programme** (`department.khushhal-programme.create`)
   - Route: `/department/khushhal-programme/add/kpis/data`
   - ❌ Not implemented

6. **Show KPI Data - Khushhal Programme** (`department.khushhal-programme.show`)
   - Route: `/department/khushhal-programme/show/kpis/data`
   - ❌ Not implemented

7. **Sectoral Meetings** (`department.sectorial-meetings.list`)
   - Route: `/department/sectorial-meetings`
   - ❌ Not implemented

8. **Announcements** (`department.announcements.list`)
   - Route: `/department/announcements`
   - ❌ Not implemented

9. **Directives** (`department.directives.list`)
   - Route: `/department/directives`
   - ❌ Not implemented

10. **PTF Dashboard** (`department.ptf.index`)
    - Route: `/department/ptf`
    - ❌ Not implemented

11. **Create New PTF Issue** (`department.ptf.create-issue`)
    - Route: `/department/ptf/create-issue`
    - ❌ Not implemented

12. **PTF Dashboard (Departments)** (`department.ptf.departments.dashboard` or `department.ptf.departments.index`)
    - Route: `/department/ptf/departments/dashboard`
    - ❌ Not implemented

13. **Boards Meetings** (`department.board-meetings.list`)
    - Route: `/department/board-meetings`
    - ❌ Not implemented

14. **Senate Meetings** (`department.senate_meetings.index`)
    - Route: `/department/senate_meetings`
    - ❌ Not implemented

15. **PTIs KP** (`department.ptis.index`)
    - Route: `/department/ptis`
    - ❌ Not implemented

16. **Summary Implementation Tasks** (`department.summaries.index`)
    - Route: `/department/summaries`
    - ❌ Not implemented

### Implementation Required
1. ❌ Create `DepartmentSidebar.tsx` component
2. ❌ Implement all 16 department modules
3. ❌ Add department name display at top of sidebar
4. ❌ Implement permission-based menu rendering
5. ❌ Update `DepartmentLayout.tsx` to use `DepartmentSidebar` instead of `Sidebar`

---

## 3. DATAENTRY (Role ID: 3) - Data Entry Operators

### Status: ❌ **NOT IMPLEMENTED** (Uses Admin Sidebar with Permissions)

### Access
- Uses **Admin Sidebar** (`admin/partials/sidebar.blade.php`)
- Has **limited permissions** compared to Super Admin
- Cannot access:
  - Log Viewer
  - Users Management (only for user.id === 1)
  - Export Users
  - Tags (only for user.id === 1)
  - Departments (only for user.id === 1)

### Available Modules (Based on Permissions)
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
1. ❌ Update `Sidebar.tsx` to check permissions instead of `user?.id === 1` for most items
2. ❌ Only restrict Log Viewer, Users, Export Users, Tags, Departments to `user?.id === 1`
3. ❌ Test with Data Entry user credentials

---

## 4. CM (Role ID: 4) - Chief Minister

### Status: ❌ **NOT IMPLEMENTED** (Uses Admin Sidebar with Permissions)

### Access
- Uses **Admin Sidebar** (`admin/partials/sidebar.blade.php`)
- Has **report-focused permissions**
- Dashboard: Same as Admin (`admin.dashboard`)

### Available Modules (Based on Permissions)
- ✅ Dashboard (`admin.dashboard`)
- ✅ All Reports (if permissions granted)
- ✅ Limited Admin modules (based on specific permissions)

### Implementation Required
1. ❌ Update `Sidebar.tsx` to support CM role (role_id === 4)
2. ❌ Ensure CM has access to Reports section
3. ❌ Test with CM user credentials

---

## 5. CS (Role ID: 5) - Chief Secretary

### Status: ❌ **NOT IMPLEMENTED**

### Access
- Uses **Admin Sidebar** (`admin/partials/sidebar.blade.php`)
- Has **different Dashboard** (`cs.csdashboard`)
- Route: `/cs/dashboard` or similar

### Old CMDMS Behavior
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
1. ❌ Update `Sidebar.tsx` to show CS Dashboard link for role_id === 5
2. ❌ Implement CS Dashboard route and page
3. ❌ Ensure CS has appropriate permissions for Reports
4. ❌ Test with CS user credentials

---

## 6. SECTORIAL (Role ID: 7) - Sectorial Users

### Status: ❌ **NOT CLEARLY DEFINED**

### Notes
- Role exists in enum but not clearly used in sidebar
- Likely uses Department sidebar with sectorial-specific permissions
- May have access to Sectoral Meetings module

### Implementation Required
1. ❌ Clarify SECTORIAL role usage in old CMDMS
2. ❌ Determine if it uses Department or Admin sidebar
3. ❌ Implement appropriate sidebar based on findings

---

## Implementation Priority

### Phase 1: High Priority (Critical for Department Users)
1. ✅ **Department Sidebar** - Complete implementation
2. ✅ **Department Routes** - All 16 department modules
3. ✅ **Department Layout** - Update to use DepartmentSidebar

### Phase 2: Medium Priority (Permission Fixes)
1. ✅ **Permission-based Admin Sidebar** - Remove hardcoded `user?.id === 1` checks
2. ✅ **Data Entry Support** - Ensure role 3 works correctly
3. ✅ **CM Support** - Ensure role 4 works correctly

### Phase 3: Low Priority (Special Cases)
1. ✅ **CS Dashboard** - Implement CS-specific dashboard
2. ✅ **SECTORIAL Role** - Clarify and implement if needed
3. ✅ **Cabinet User Special Case** - Verify and implement if needed

---

## Test User Credentials (To Be Created)

For testing each role in new CMDMS, create the following test users:

| Role ID | Username | Email | Password | Purpose |
|---------|----------|-------|----------|---------|
| 1 | superadmin | superadmin@cmdms.test | `SuperAdmin@123` | Full admin access |
| 2 | deptuser | deptuser@cmdms.test | `DeptUser@123` | Department user testing |
| 3 | dataentry | dataentry@cmdms.test | `DataEntry@123` | Data entry operator testing |
| 4 | cm | cm@cmdms.test | `CM@123` | Chief Minister testing |
| 5 | cs | cs@cmdms.test | `CS@123` | Chief Secretary testing |
| 7 | sectorial | sectorial@cmdms.test | `Sectorial@123` | Sectorial user testing (if needed) |

**Note**: These are suggested credentials. Actual credentials should be set up in the backend/database.

---

## Files to Create/Modify

### New Files to Create

1. **`src/components/shared/layout/DepartmentSidebar.tsx`**
   - Complete department sidebar implementation
   - Based on `department/partials/sidebar.blade.php`

2. **`src/pages/department/RecordNotesList.tsx`** (and other department pages)
   - All 16 department module pages

### Files to Modify

1. **`src/components/shared/layout/Sidebar.tsx`**
   - Remove hardcoded `user?.id === 1` checks (except for superadmin-only items)
   - Add permission-based checks
   - Add CS Dashboard link for role_id === 5

2. **`src/components/shared/layout/DepartmentLayout.tsx`**
   - Import and use `DepartmentSidebar` instead of `Sidebar`

3. **`src/routes/index.tsx`**
   - Add all department routes
   - Add CS dashboard route
   - Ensure proper role-based route protection

4. **`src/types/index.ts`**
   - Verify UserRole enum matches old CMDMS roles
   - Update if needed

---

## Permission Keys Reference

### Admin Permissions (from old CMDMS sidebar)
- `admin.dashboard`
- `admin.users.list`
- `admin.userExport`
- `admin.activitylogs.index`
- `admin.tags.index`
- `admin.department.index`
- `admin.recordnotes.departments`
- `admin.directives.list`
- `admin.announcements.list`
- `admin.ptis.index`
- `admin.summaries.index`
- `admin.interventions.index`
- `admin.cmremarks.index`
- `admin.inaugurations.index`
- `admin.sectorialmeetings.index`
- `admin.schemes.index`
- `admin.boardmeetings.index`
- `admin.boardacts.index`
- `admin.boardmembers.index`
- `admin.annualschemes.index`
- `admin.distributed.schemes`
- `admin.candidate.distributed.fund.report`
- `admin.reviewmeetings.index`
- `admin.candidaterequests.index`
- `admin.officerdepartments.index`
- `admin.officers.index`
- `admin.candidates.index`
- `admin.posting.recommendation.index`
- `admin.khushhalkpk.index`
- `admin.report.*` (various report permissions)
- `cs.csdashboard`

### Department Permissions (from old CMDMS sidebar)
- `department.recordnotes.list`
- `department.cmremarks.index`
- `department.khushhal.task.list`
- `department.khushhal-programme.create`
- `department.khushhal-programme.show`
- `department.sectorial-meetings.list`
- `department.announcements.list`
- `department.directives.list`
- `department.ptf.index`
- `department.ptf.create-issue`
- `department.ptf.departments.dashboard`
- `department.ptf.departments.index`
- `department.board-meetings.list`
- `department.senate_meetings.index`
- `department.ptis.index`
- `department.summaries.index`

---

## Next Steps

1. **Review this document** with stakeholders
2. **Prioritize implementation** based on business needs
3. **Create test users** in development database
4. **Implement Phase 1** (Department Sidebar)
5. **Test thoroughly** with each role
6. **Implement Phase 2** (Permission fixes)
7. **Implement Phase 3** (Special cases)
8. **Document any deviations** from old CMDMS

---

## Notes

- Old CMDMS uses Laravel Blade templates with `@can`, `@canany`, and `@if` directives for permission checks
- New CMDMS should replicate the same permission structure using React conditional rendering
- Permission keys should match exactly between old and new CMDMS for consistency
- Some menu items are commented out in old CMDMS (e.g., PIM, Senate, Development sections) - verify if these should be implemented
- External links (Good Governance, CM DSD Visit, Ekhteyar Aawam Ka) have been removed from new CMDMS per user request

---

**Document Version**: 1.0  
**Last Updated**: Based on old CMDMS codebase analysis  
**Status**: Draft for Review

