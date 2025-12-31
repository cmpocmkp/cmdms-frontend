# Remaining Modules by Role - Verification List

**Purpose:** Clear list of remaining modules organized by role for email verification

---

## ✅ COMPLETE - No Remaining Modules

### 1. ADMIN (Super Admin) - Role ID: 1
**Status:** ✅ Fully Implemented  
**Remaining Modules:** 0

---

## ⚠️ PARTIALLY IMPLEMENTED - Needs Completion

### 2. DEPARTMENT (Department Users) - Role ID: 2
**Status:** ⚠️ Sidebar & Routes Done, Pages are Placeholders  
**Remaining Modules:** 16

#### Core Modules (5)
1. **Record Notes** - `/department/record-notes`
2. **Cabinet Minutes** - `/department/record-notes?type=cabinet`
3. **CM Remarks** - `/department/cm-remarks`
4. **Directives** - `/department/directives`
5. **Announcements** - `/department/announcements`

#### Meeting Modules (3)
6. **Sectoral Meetings** - `/department/sectorial-meetings`
7. **Boards Meetings** - `/department/board-meetings`
8. **Senate Meetings** - `/department/senate_meetings`

#### Development & Tracking Modules (5)
9. **PTIs KP** - `/department/ptis`
10. **Summary Implementation Tasks** - `/department/summaries`
11. **Khushhal Programme** - `/department/khushhal-programme`
12. **Add KPI Data - Khushhal Programme** - `/department/khushhal-programme/add/kpis/data`
13. **Show KPI Data - Khushhal Programme** - `/department/khushhal-programme/show/kpis/data`

#### PTF Modules (3)
14. **PTF Dashboard** - `/department/ptf`
15. **Create New PTF Issue** - `/department/ptf/create-issue`
16. **PTF Dashboard (Departments)** - `/department/ptf/departments/dashboard`

---

### 3. DATAENTRY (Data Entry Operators) - Role ID: 3
**Status:** ⚠️ Can Use Admin Pages, But Sidebar Needs Permission Fix  
**Remaining Work:** Permission-based sidebar filtering

**Issue:** Sidebar currently only works for `user.id === 1`. Needs to check permissions instead.

**Should Have Access To (Based on Permissions):**
- Minutes
- Directives
- Announcements
- PTIs KP
- Summaries for CM
- Trackers
- CM Remarks
- Inaugurations
- Sectoral Meetings
- Boards (if permissions granted)
- Funds Distribution (if permissions granted)
- Reports (if permissions granted)

**Restricted From:**
- Log Viewer (user.id === 1 only)
- Users Management (user.id === 1 only)
- Export Users (user.id === 1 only)
- Tags (user.id === 1 only)
- Departments (user.id === 1 only)

---

### 4. CM (Chief Minister) - Role ID: 4
**Status:** ⚠️ Can Use Admin Pages, But Sidebar Needs Permission Fix  
**Remaining Work:** Permission-based sidebar filtering

**Issue:** Sidebar currently only works for `user.id === 1`. Needs to support CM role.

**Should Have Access To (Based on Permissions):**
- Dashboard
- All Reports (if permissions granted)
- Limited Admin modules (based on specific permissions)

---

## ❌ NOT IMPLEMENTED

### 5. CS (Chief Secretary) - Role ID: 5
**Status:** ❌ Not Implemented  
**Remaining Modules:** 1

1. **CS Dashboard** - `/cs/dashboard`
   - CS-specific dashboard page
   - Different from Admin Dashboard
   - Permission: `cs.csdashboard`

**Note:** CS uses Admin Sidebar but with different Dashboard link.

---

### 6. SECTORIAL (Sectorial Users) - Role ID: 7
**Status:** ❌ Not Clearly Defined  
**Remaining Work:** Needs Clarification

**Questions to Verify:**
- Does SECTORIAL role use Department sidebar or Admin sidebar?
- What modules should SECTORIAL users have access to?
- Is it just Sectoral Meetings or more modules?

**From Old CMDMS:**
- Role exists in enum
- Appears in reply views alongside Department users (`role_id == 2 || role_id == 7`)
- Not clearly defined in sidebar structure

---

## 📊 Summary by Numbers

| Role Name | Role ID | Remaining Modules | Status |
|-----------|---------|-------------------|--------|
| **ADMIN** | 1 | 0 | ✅ Complete |
| **DEPARTMENT** | 2 | 16 pages | ⚠️ Placeholders |
| **DATAENTRY** | 3 | 0 (permission fix) | ⚠️ Sidebar fix needed |
| **CM** | 4 | 0 (permission fix) | ⚠️ Sidebar fix needed |
| **CS** | 5 | 1 dashboard | ❌ Not implemented |
| **SECTORIAL** | 7 | ? (needs clarification) | ❌ Not defined |

---

## 🔍 Verification Checklist

### For DEPARTMENT Role (16 modules)
- [ ] Record Notes - List, Reply, Status Update
- [ ] Cabinet Minutes - List, Reply
- [ ] CM Remarks - List, Reply
- [ ] Directives - List, Reply, Progress Update
- [ ] Announcements - List, Reply
- [ ] Sectoral Meetings - List, Reply to Agenda Points
- [ ] Boards Meetings - List, Reply to Agenda Points
- [ ] Senate Meetings - List, Reply to Minutes
- [ ] PTIs KP - List, Reply, Status Update
- [ ] Summary Implementation Tasks - List, Reply, Progress
- [ ] Khushhal Programme - List, Progress Update
- [ ] Add KPI Data - Form for KPI Entry
- [ ] Show KPI Data - View KPI Reports
- [ ] PTF Dashboard - Dashboard View
- [ ] Create New PTF Issue - Form to Create Issue
- [ ] PTF Dashboard (Departments) - Department-wise Dashboard

### For DATAENTRY Role
- [ ] Verify sidebar shows modules based on permissions (not user.id)
- [ ] Verify restricted items (Log Viewer, Users, etc.) are hidden
- [ ] Test with Data Entry user credentials

### For CM Role
- [ ] Verify sidebar shows Dashboard and Reports
- [ ] Verify modules shown based on permissions
- [ ] Test with CM user credentials

### For CS Role
- [ ] Create CS Dashboard page
- [ ] Add CS Dashboard route
- [ ] Update sidebar to show CS Dashboard (not Admin Dashboard)
- [ ] Test with CS user credentials

### For SECTORIAL Role
- [ ] Clarify which sidebar to use (Department or Admin)
- [ ] Clarify which modules to show
- [ ] Determine if it's just Sectoral Meetings or more

---

## 📧 Email Verification Template

**Subject:** CMDMS Module Verification - [Role Name]

**For DEPARTMENT Role:**
Please verify the following 16 modules are required for Department Users:
[List the 16 modules above]

**For DATAENTRY Role:**
Please confirm Data Entry users should see modules based on permissions, not just user.id === 1.

**For CM Role:**
Please confirm CM users should see Dashboard and Reports based on permissions.

**For CS Role:**
Please confirm CS users need a separate CS Dashboard (different from Admin Dashboard).

**For SECTORIAL Role:**
Please clarify:
1. Which sidebar should SECTORIAL users see? (Department or Admin)
2. Which modules should SECTORIAL users have access to?
3. Is it primarily for Sectoral Meetings or more?

---

**Last Updated:** December 2025  
**For Verification:** Email stakeholders for each role

