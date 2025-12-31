# Department User Test Credentials

**Purpose:** Temporary credentials for testing department-wise UI in new CMDMS (before backend implementation)

---

## 🔐 Test Credentials

### ⭐ FULL ACCESS TEST ACCOUNT (ALL MODULES - Recommended for Development Testing)
- **Email:** `test.fullaccess@finance.gov.pk`
- **Password:** `DeptUser@123`
- **Department:** Finance
- **User ID:** 32
- **Access:** ALL 16 Department Modules (Complete Access)
  - ✅ Dashboard
  - ✅ Record Notes
  - ✅ Cabinet Minutes
  - ✅ CM Remarks
  - ✅ Khushhal Programme
  - ✅ Add KPI Data - Khushhal Programme
  - ✅ Show KPI Data - Khushhal Programme
  - ✅ Directives
  - ✅ Sectoral Meetings
  - ✅ Announcements
  - ✅ PTF Dashboard
  - ✅ Create New PTF Issue
  - ✅ PTF Dashboard (Departments)
  - ✅ Boards Meetings
  - ✅ Senate Meetings
  - ✅ PTIs KP
  - ✅ Summary Implementation Tasks

### PRIMARY TEST ACCOUNT (Basic Testing)
- **Email:** `saqib.zaman@finance.gov.pk`
- **Password:** `DeptUser@123`
- **Department:** Finance
- **User ID:** 10
- **Access:** Record Notes, CM Remarks, Directives, Announcements

### Department User (Health Department)
- **Email:** `ahmed.hassan@health.gov.pk`
- **Password:** `DeptUser@123`
- **Department:** Health
- **User ID:** 12

### Department User (Education Department)
- **Email:** `rashid.mahmood@education.gov.pk`
- **Password:** `DeptUser@123`
- **Department:** Elementary & Secondary Education
- **User ID:** 14

### Department User (Housing Department)
- **Email:** `muhammad.asif@housing.gov.pk`
- **Password:** `DeptUser@123`
- **Department:** Housing
- **User ID:** 31

---

## 📋 Available Modules by User

### Saqib Zaman (Finance) - Basic Access
- Dashboard
- Record Notes
- CM Remarks
- Directives
- Announcements

### Ahmed Hassan (Health) - Limited Access
- Dashboard
- Record Notes
- CM Remarks
- Directives

### Rashid Mahmood (Education) - Moderate Access
- Dashboard
- Record Notes
- CM Remarks
- Directives
- Announcements
- Board Meetings
- PTIs KP

### Muhammad Asif (Housing) - Moderate Access
- Dashboard
- Record Notes
- CM Remarks
- Directives
- Announcements
- Sectoral Meetings
- Board Meetings

---

## 🚀 How to Test

1. Go to `/login` page
2. Enter email: `saqib.zaman@finance.gov.pk`
3. Enter password: `DeptUser@123`
4. Click Login
5. You should be redirected to `/department/dashboard`
6. Navigate through different modules using the sidebar

---

---

## 🔄 Testing with Old CMDMS

### How to Find/Create Full Access User in Old CMDMS

**In old CMDMS, permissions are assigned per user (not per role).** You need to find or create a user with ALL department permissions.

#### Step 1: Login to Old CMDMS as Admin

**Default Admin Credentials (from seeder):**
- **Email:** `saeed.histone@gmail.com`
- **Password:** `saeed@123`

#### Step 2: Assign All Department Permissions

1. Go to: **Admin → Users** (`/admin/users`)
2. Find any department user (or create new one)
3. Click **Edit** or **Permissions** button
4. Assign ALL these 16 permissions:
   - `department.dashboard`
   - `department.recordnotes.list`
   - `department.cmremarks.index`
   - `department.khushhal.task.list`
   - `department.khushhal-programme.create`
   - `department.khushhal-programme.show`
   - `department.directives.list`
   - `department.sectorial-meetings.list`
   - `department.announcements.list`
   - `department.ptf.index`
   - `department.ptf.create-issue`
   - `department.ptf.departments.dashboard`
   - `department.board-meetings.list`
   - `department.senate_meetings.index`
   - `department.ptis.index`
   - `department.summaries.index`
5. Save permissions
6. Use that user's credentials to test

#### Step 3: Compare Old vs New CMDMS

**Old CMDMS:**
- Login with the user you just assigned all permissions
- Test all 16 modules
- Note layout, structure, functionality

**New CMDMS:**
- Login with: `test.fullaccess@finance.gov.pk` / `DeptUser@123`
- Test same 16 modules
- Compare with old CMDMS

**See detailed guide:** `docs/HOW_TO_FIND_FULL_ACCESS_USER_OLD_CMDMS.md`

---

## ⚠️ Note

These are **temporary mock credentials** for frontend development only.
Once backend is implemented, these will be replaced with real authentication.

---

**Last Updated:** December 2025

