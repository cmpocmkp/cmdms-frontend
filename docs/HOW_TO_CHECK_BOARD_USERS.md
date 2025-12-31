# How to Check Board Users in Old CMDMS

## Method 1: Check via Database (SQL)

### Step 1: Connect to Old CMDMS Database
```bash
# Using MySQL command line
mysql -u your_username -p cmkpebooktm

# Or using phpMyAdmin / MySQL Workbench
# Connect to database: cmkpebooktm
```

### Step 2: Run SQL Queries

See `OLD NEW CMDMS/cmdms/CHECK_BOARD_USERS.sql` for complete queries.

**Quick Check:**
```sql
-- Check for board users
SELECT * FROM users WHERE role_id = 6;

-- Check board_members table
SELECT id, name, email, department_id FROM board_members LIMIT 10;
```

### Step 3: Verify Results

**Expected Results:**
- ✅ `users` table with `role_id = 6`: **0 rows** (no board users)
- ✅ `board_members` table: **Multiple rows** (board member records)
- ✅ `roles` table: **role_id 6 exists** but unused

---

## Method 2: Check via Old CMDMS UI

### Step 1: Login as Admin
1. Go to old CMDMS login page
2. Login with admin credentials
3. Navigate to Admin section

### Step 2: Check Users List
1. Go to **Admin → Users** (or `/admin/users`)
2. Look for any users with role "board"
3. **Expected:** No users with board role

### Step 3: Check Board Members
1. Go to **Admin → Boards → Members** (or `/admin/boardmembers`)
2. You'll see board member records
3. **Note:** These are NOT users - they're just data records

### Step 4: Try to Create Board User
1. Go to **Admin → Users → Add User**
2. Try to select role "board" from dropdown
3. **Check:** Does the role exist in dropdown? (It should, but no users use it)

---

## Method 3: Check via Laravel Tinker

### Step 1: Access Tinker
```bash
cd "D:\cmdms migration\OLD NEW CMDMS\cmdms"
php artisan tinker
```

### Step 2: Run Commands
```php
// Check users with board role
User::where('role_id', 6)->get();

// Check board members
\App\Models\BoardMember::take(10)->get();

// Check if any board members have user accounts
\App\Models\BoardMember::whereNotNull('email')
    ->get()
    ->map(function($bm) {
        return [
            'board_member' => $bm->name,
            'email' => $bm->email,
            'has_user_account' => \App\Models\User::where('email', $bm->email)->exists()
        ];
    });
```

---

## What to Look For

### ✅ Confirms Board Role Not Used:
- No users in `users` table with `role_id = 6`
- Board members exist in separate `board_members` table
- Board members are managed by admin users (created_by, modified_by fields)

### ❌ Would Indicate Board Users Exist:
- Users in `users` table with `role_id = 6`
- Board members with matching emails in users table
- Login functionality for board members

---

## Verification Checklist

- [ ] Run SQL query: `SELECT * FROM users WHERE role_id = 6;` → Should return 0 rows
- [ ] Check `board_members` table → Should have records
- [ ] Check old CMDMS UI → No board users in users list
- [ ] Check board members page → Shows data records (not users)
- [ ] Verify board members don't have login access

---

## Conclusion

**If all checks confirm:**
- ✅ No board users exist
- ✅ Board members are data records only
- ✅ Board members managed by admins

**Then:** Board role login is NOT needed in new CMDMS.

