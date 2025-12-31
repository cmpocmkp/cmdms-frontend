# Old CMDMS Testing Guide - Department Modules

**Purpose:** Guide to find/create a user with ALL department permissions in old CMDMS for testing comparison

---

## 🔍 Finding User with All Department Permissions in Old CMDMS

### Method 1: Check Database Directly

In old CMDMS database, run this SQL query to find users with all department permissions:

```sql
-- Find users with all department permissions
SELECT u.id, u.name, u.email, u.department_id, d.name as department_name
FROM users u
JOIN departments d ON u.department_id = d.id
WHERE u.role_id = 2  -- Department role
AND u.id IN (
    SELECT user_id 
    FROM permission_user 
    WHERE permission_id IN (
        SELECT id FROM permissions 
        WHERE name LIKE 'department.%'
    )
    GROUP BY user_id
    HAVING COUNT(DISTINCT permission_id) >= 16  -- All 16 department permissions
);
```

### Method 2: Check via Admin Panel

1. Login to old CMDMS as admin
2. Go to **Users** management
3. Check each department user's permissions
4. Look for a user that has ALL these permissions:
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
   - `department.board-meetings.list`
   - `department.senate_meetings.index`
   - `department.ptis.index`
   - `department.summaries.index`

### Method 3: Create/Assign All Permissions to a Test User

If no user has all permissions, you can assign them:

1. **Via Admin Panel:**
   - Login as admin
   - Go to Users → Edit User
   - Select a department user (or create new one)
   - Assign ALL department permissions listed above
   - Save

2. **Via Database:**
   ```sql
   -- Get all department permission IDs
   SELECT id, name FROM permissions WHERE name LIKE 'department.%';
   
   -- Assign all to a user (replace USER_ID with actual user ID)
   INSERT INTO permission_user (permission_id, user_id)
   SELECT id, USER_ID FROM permissions WHERE name LIKE 'department.%';
   ```

---

## 📋 All Department Permissions (16 Total)

Based on old CMDMS sidebar and routes:

1. `department.dashboard` - Dashboard (always visible)
2. `department.recordnotes.list` - Record Notes
3. `department.cmremarks.index` - CM Remarks
4. `department.khushhal.task.list` - Khushhal Programme
5. `department.khushhal-programme.create` - Add KPI Data
6. `department.khushhal-programme.show` - Show KPI Data
7. `department.sectorial-meetings.list` - Sectoral Meetings
8. `department.announcements.list` - Announcements
9. `department.directives.list` - Directives
10. `department.ptf.index` - PTF Dashboard
11. `department.ptf.create-issue` - Create New PTF Issue
12. `department.ptf.departments.dashboard` - PTF Dashboard (Departments)
13. `department.board-meetings.list` - Boards Meetings
14. `department.senate_meetings.index` - Senate Meetings
15. `department.ptis.index` - PTIs KP
16. `department.summaries.index` - Summary Implementation Tasks

---

## 🧪 Testing Comparison Workflow

### Step 1: Identify Test User in Old CMDMS

1. Login to old CMDMS
2. Find/create a department user with ALL 16 permissions
3. Note the user's:
   - Email
   - Password
   - Department
   - User ID

### Step 2: Test in Old CMDMS

1. Login with the identified user
2. Navigate through ALL department modules:
   - Dashboard
   - Record Notes
   - Cabinet Minutes
   - CM Remarks
   - Khushhal Programme
   - Add KPI Data
   - Show KPI Data
   - Directives
   - Sectoral Meetings
   - Announcements
   - PTF Dashboard
   - Create New PTF Issue
   - PTF Dashboard (Departments)
   - Boards Meetings
   - Senate Meetings
   - PTIs KP
   - Summary Implementation Tasks
3. Take screenshots/notes of:
   - Layout structure
   - Table columns
   - Form fields
   - Button placements
   - Status cards
   - Pagination
   - Filters

### Step 3: Test in New CMDMS

1. Login with: `test.fullaccess@finance.gov.pk` / `DeptUser@123`
2. Navigate through the SAME modules
3. Compare:
   - Layout matches old CMDMS
   - All modules are accessible
   - UI elements are in same positions
   - Functionality works the same

### Step 4: Document Differences

Create a comparison checklist:
- [ ] Dashboard layout matches
- [ ] All 16 modules accessible
- [ ] Sidebar shows all modules
- [ ] Table structures match
- [ ] Form fields match
- [ ] Status cards match
- [ ] Pagination works
- [ ] Filters work
- [ ] Buttons in same positions

---

## 📝 Recommended Test User Setup

### Option 1: Use Existing User (If Available)
- Check if any department user already has all permissions
- Use that user's credentials

### Option 2: Create New Test User
- **Name:** Test User - Full Access
- **Email:** `test.fullaccess@finance.gov.pk` (or any department)
- **Department:** Finance (or any department)
- **Role:** Department (role_id = 2)
- **Password:** `Test@123` (or your choice)
- **Permissions:** Assign ALL 16 department permissions

### Option 3: Modify Existing User
- Pick any department user
- Assign all missing department permissions
- Use that user for testing

---

## 🔑 Quick Reference

**New CMDMS Test User:**
- Email: `test.fullaccess@finance.gov.pk`
- Password: `DeptUser@123`
- Has: ALL 16 department permissions

**Old CMDMS:**
- You need to find/create a user with same permissions
- Check via admin panel or database query
- Assign all 16 department permissions if needed

---

## ✅ Verification Checklist

Before testing, verify the old CMDMS user has:

- [ ] `department.dashboard`
- [ ] `department.recordnotes.list`
- [ ] `department.cmremarks.index`
- [ ] `department.khushhal.task.list`
- [ ] `department.khushhal-programme.create`
- [ ] `department.khushhal-programme.show`
- [ ] `department.sectorial-meetings.list`
- [ ] `department.announcements.list`
- [ ] `department.directives.list`
- [ ] `department.ptf.index`
- [ ] `department.ptf.create-issue`
- [ ] `department.ptf.departments.dashboard`
- [ ] `department.board-meetings.list`
- [ ] `department.senate_meetings.index`
- [ ] `department.ptis.index`
- [ ] `department.summaries.index`

---

**Last Updated:** December 2025  
**Status:** Ready for Testing

