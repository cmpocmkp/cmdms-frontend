# How to Find/Create Full Access Department User in Old CMDMS

**Purpose:** Find or create a user with ALL department module permissions in old CMDMS for testing comparison

---

## 🎯 Quick Answer

**In old CMDMS, you need to:**

1. **Login as Admin** (usually `saeed.histone@gmail.com` / `saeed@123`)
2. **Go to Users Management** → Edit any department user
3. **Assign ALL 16 department permissions** to that user
4. **Use that user's credentials** to test all modules

---

## 📋 Step-by-Step Guide

### Step 1: Login to Old CMDMS as Admin

**Default Admin Credentials (from seeder):**
- **Email:** `saeed.histone@gmail.com`
- **Password:** `saeed@123`
- **Role:** Admin (role_id = 1)

### Step 2: Navigate to User Permissions

**Option A: Via Users List**
1. Go to: **Admin → Users** (`/admin/users`)
2. Find any department user (role_id = 2)
3. Click **Edit** or **Permissions** button
4. You'll see permission assignment page

**Option B: Via Permissions Management**
1. Go to: **Admin → User Permissions** (`/admin/users/permissions`)
2. Select a department user
3. Assign permissions

### Step 3: Assign All Department Permissions

Check/Select ALL these permissions:

✅ **Dashboard & Core:**
- `department.dashboard`

✅ **Record Notes:**
- `department.recordnotes.list`

✅ **CM Remarks:**
- `department.cmremarks.index`

✅ **Khushhal Programme (3 permissions):**
- `department.khushhal.task.list`
- `department.khushhal-programme.create`
- `department.khushhal-programme.show`

✅ **Directives:**
- `department.directives.list`

✅ **Sectoral Meetings:**
- `department.sectorial-meetings.list`

✅ **Announcements:**
- `department.announcements.list`

✅ **PTF (3 permissions):**
- `department.ptf.index`
- `department.ptf.create-issue`
- `department.ptf.departments.dashboard`

✅ **Board Meetings:**
- `department.board-meetings.list`

✅ **Senate Meetings:**
- `department.senate_meetings.index`

✅ **PTIs KP:**
- `department.ptis.index`

✅ **Summaries:**
- `department.summaries.index`

### Step 4: Save and Test

1. Click **Save/Update Permissions**
2. Logout from admin
3. Login with the department user you just updated
4. Verify all 16+ modules appear in sidebar
5. Test each module

---

## 🔍 Alternative: Check Existing Users

### Via Database Query

Run this SQL in old CMDMS database:

```sql
-- Find users with most department permissions
SELECT 
    u.id,
    u.name,
    u.email,
    u.department_id,
    d.name as department_name,
    COUNT(DISTINCT pu.permission_id) as permission_count
FROM users u
JOIN departments d ON u.department_id = d.id
LEFT JOIN permission_user pu ON u.id = pu.user_id
LEFT JOIN permissions p ON pu.permission_id = p.id AND p.name LIKE 'department.%'
WHERE u.role_id = 2  -- Department role
GROUP BY u.id, u.name, u.email, u.department_id, d.name
ORDER BY permission_count DESC;
```

This will show which department users have the most permissions.

---

## 🆕 Create New Test User (Recommended)

If you want a dedicated test user:

1. **Create New User:**
   - Go to: **Admin → Users → Add User**
   - Name: `Test User - Full Access`
   - Email: `test.fullaccess@finance.gov.pk`
   - Department: Finance (or any)
   - Role: Department
   - Password: `Test@123` (or your choice)

2. **Assign All Permissions:**
   - Go to user's permission page
   - Select ALL 16 department permissions
   - Save

3. **Test:**
   - Login with: `test.fullaccess@finance.gov.pk` / `Test@123`
   - Verify all modules visible

---

## 📊 Comparison Testing

### Old CMDMS Test User
- **Email:** (The user you found/created with all permissions)
- **Password:** (That user's password)
- **Modules:** All 16 department modules

### New CMDMS Test User
- **Email:** `test.fullaccess@finance.gov.pk`
- **Password:** `DeptUser@123`
- **Modules:** All 16 department modules

### Testing Workflow

1. **Test in Old CMDMS:**
   - Login with old CMDMS full-access user
   - Navigate through all modules
   - Note layout, structure, functionality

2. **Test in New CMDMS:**
   - Login with: `test.fullaccess@finance.gov.pk` / `DeptUser@123`
   - Navigate through same modules
   - Compare with old CMDMS

3. **Verify:**
   - ✅ All modules accessible
   - ✅ Layout matches
   - ✅ Functionality matches
   - ✅ UI elements in same positions

---

## 🔑 Quick Reference

**All 16 Department Permissions:**
```
department.dashboard
department.recordnotes.list
department.cmremarks.index
department.khushhal.task.list
department.khushhal-programme.create
department.khushhal-programme.show
department.directives.list
department.sectorial-meetings.list
department.announcements.list
department.ptf.index
department.ptf.create-issue
department.ptf.departments.dashboard
department.board-meetings.list
department.senate_meetings.index
department.ptis.index
department.summaries.index
```

**Old CMDMS Admin Login:**
- Email: `saeed.histone@gmail.com`
- Password: `saeed@123`

**New CMDMS Test User:**
- Email: `test.fullaccess@finance.gov.pk`
- Password: `DeptUser@123`

---

## ✅ Verification

After assigning permissions in old CMDMS:

1. Login with the department user
2. Check sidebar - should show ALL 16+ modules
3. Navigate to each module - should all be accessible
4. Compare with new CMDMS user `test.fullaccess@finance.gov.pk`

---

**Last Updated:** December 2025

