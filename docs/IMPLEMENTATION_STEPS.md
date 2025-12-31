# Step-by-Step Implementation Guide for CMDMS Sidebars

## Overview
This guide provides a detailed, step-by-step approach to implementing all missing sidebars and role-based access in the new CMDMS.

---

## Step 1: Setup & Preparation (15 minutes)

### 1.1 Verify Current State
- [ ] Check that Admin sidebar works for user ID 1
- [ ] Verify authentication system is working
- [ ] Ensure `useAuth()` hook returns user with `role_id` and `permissions`
- [ ] Check that `UserRole` enum in `src/types/index.ts` matches old CMDMS roles

### 1.2 Review Old CMDMS Files
- [ ] Read `department/partials/sidebar.blade.php` completely
- [ ] Understand department sidebar structure and styling
- [ ] Note all permission keys used

### 1.3 Create Test Users (Backend/Database)
Create these test users for development testing:
- [ ] Admin (role_id: 1) - already exists
- [ ] Department User (role_id: 2)
- [ ] Data Entry (role_id: 3)
- [ ] CM (role_id: 4)
- [ ] CS (role_id: 5)

---

## Step 2: Create Department Sidebar Component (1-2 hours)

### 2.1 Create DepartmentSidebar.tsx
**File**: `src/components/shared/layout/DepartmentSidebar.tsx`

**Steps**:
1. Copy structure from `Sidebar.tsx` as a template
2. Replace with department sidebar structure from `department/partials/sidebar.blade.php`
3. Add department name display at top (from `Auth::user()->department->name`)
4. Implement all 16 department menu items with permission checks
5. Use React Router `Link` components instead of `<a>` tags
6. Match exact structure and icons from old CMDMS

**Key Points**:
- Show department name: `{user?.department?.name ?? ''}`
- All menu items should check permissions using `hasPermission()`
- Use same styling classes as admin sidebar
- Follow the exact menu structure from old CMDMS

**Example Structure**:
```tsx
export function DepartmentSidebar() {
  const location = useLocation();
  const { user } = useAuth();
  
  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/');
  
  const hasPermission = (permission: string) => {
    // Check user permissions
    return user?.permissions?.some(p => p.name === permission) ?? false;
  };

  return (
    <nav className="sidebar sidebar-offcanvas" id="sidebar">
      {/* Department Name Header */}
      <div className="text-white text-center bg-dark pl-1 py-2">
        {user?.department?.name ?? ''}
      </div>
      
      <ul className="nav">
        {/* Dashboard */}
        <li className={cn("nav-item", isActive('/department/dashboard') && 'active')}>
          <Link className="nav-link" to="/department/dashboard">
            <i className="ti-home menu-icon"></i>
            <span className="menu-title">Dashboard</span>
          </Link>
        </li>
        
        {/* Record Notes */}
        {hasPermission('department.recordnotes.list') && (
          <li className={cn("nav-item", isActive('/department/record-notes') && location.search !== '?type=cabinet' && 'active')}>
            <Link className="nav-link" to="/department/record-notes">
              <i className="ti-notepad menu-icon"></i>
              <span className="menu-title">Record Notes</span>
            </Link>
          </li>
        )}
        
        {/* Continue with all other menu items... */}
      </ul>
    </nav>
  );
}
```

### 2.2 Test Department Sidebar
- [ ] Import and render `DepartmentSidebar` in a test component
- [ ] Verify styling matches old CMDMS
- [ ] Check department name displays correctly
- [ ] Verify menu items render based on permissions

---

## Step 3: Update DepartmentLayout (15 minutes)

### 3.1 Modify DepartmentLayout.tsx
**File**: `src/components/shared/layout/DepartmentLayout.tsx`

**Changes**:
```tsx
// Add import
import { DepartmentSidebar } from './DepartmentSidebar';

// Replace <Sidebar /> with <DepartmentSidebar />
```

- [ ] Import `DepartmentSidebar`
- [ ] Replace `<Sidebar />` with `<DepartmentSidebar />`
- [ ] Test that layout renders correctly
- [ ] Verify sidebar toggle button still works

---

## Step 4: Implement Department Routes (2-3 hours)

### 4.1 Add Department Routes to Router
**File**: `src/routes/index.tsx`

**Steps**:
1. Add lazy imports for all department pages
2. Add routes under `/department` path
3. Ensure `ProtectedRoute` uses `UserRole.DEPARTMENT`

**Routes to Add**:
```tsx
{
  path: '/department',
  element: (
    <ProtectedRoute allowedRoles={[UserRole.DEPARTMENT]}>
      {withSuspense(DepartmentLayout)}
    </ProtectedRoute>
  ),
  children: [
    { path: 'dashboard', element: withSuspense(DepartmentDashboard) },
    { path: 'record-notes', element: withSuspense(DepartmentRecordNotesList) },
    { path: 'cm-remarks', element: withSuspense(DepartmentCMRemarksList) },
    // ... all other routes
  ],
}
```

- [ ] Add all 16 department route paths
- [ ] Create placeholder pages for each route (can be empty initially)
- [ ] Test that routes are accessible when logged in as department user

### 4.2 Create Department Page Placeholders
**Files to Create** (initial placeholders):
- `src/pages/department/RecordNotesList.tsx`
- `src/pages/department/CabinetMinutesList.tsx`
- `src/pages/department/CMRemarksList.tsx`
- `src/pages/department/KhushhalProgrammeList.tsx`
- `src/pages/department/AddKPIData.tsx`
- `src/pages/department/ShowKPIData.tsx`
- `src/pages/department/SectoralMeetingsList.tsx`
- `src/pages/department/AnnouncementsList.tsx`
- `src/pages/department/DirectivesList.tsx`
- `src/pages/department/PTFDashboard.tsx`
- `src/pages/department/CreatePTFIssue.tsx`
- `src/pages/department/PTFDepartmentsDashboard.tsx`
- `src/pages/department/BoardMeetingsList.tsx`
- `src/pages/department/SenateMeetingsList.tsx`
- `src/pages/department/PTIsList.tsx`
- `src/pages/department/SummariesList.tsx`

**Each placeholder should**:
- [ ] Have basic component structure
- [ ] Display page title
- [ ] Show "Coming soon" or placeholder content
- [ ] Use proper TypeScript types

---

## Step 5: Fix Admin Sidebar Permission Checks (1 hour)

### 5.1 Update Sidebar.tsx for Permission-Based Access
**File**: `src/components/shared/layout/Sidebar.tsx`

**Changes Needed**:

1. **Keep `user?.id === 1` checks ONLY for**:
   - Log Viewer
   - Users
   - Export Users
   - Tags
   - Departments
   - Recordnotes Updates report
   - Recordnotes Comparision report

2. **Change all other items to permission-based**:
   ```tsx
   // OLD (wrong):
   {user?.id === 1 && hasPermission('admin.recordnotes.departments') && (
     <li>...</li>
   )}
   
   // NEW (correct):
   {hasPermission('admin.recordnotes.departments') && (
     <li>...</li>
   )}
   ```

**Items to Update**:
- [ ] Minutes - change to permission only
- [ ] Directives - change to permission only
- [ ] Announcements - change to permission only
- [ ] PTIs KP - change to permission only
- [ ] Summaries for CM - change to permission only
- [ ] Trackers - change to permission only
- [ ] CM Remarks - change to permission only
- [ ] Inaugurations - change to permission only
- [ ] Sectoral Meetings - change to permission only
- [ ] Boards submenu - change to permission only
- [ ] Funds Distribution submenu - change to permission only
- [ ] All Reports section items - change to permission only

### 5.2 Add CS Dashboard Link
- [ ] Add CS Dashboard link for `role_id === 5`
- [ ] Use route `/cs/dashboard` or similar
- [ ] Add CS Dashboard page placeholder

**Code to Add**:
```tsx
{/* CS Dashboard */}
{user?.role_id === 5 && hasPermission('cs.csdashboard') && (
  <li className={cn("nav-item", isActive('/cs/dashboard') && 'active')}>
    <Link className="nav-link" to="/cs/dashboard">
      <i className="ti-home menu-icon"></i>
      <span className="menu-title">Dashboard</span>
    </Link>
  </li>
)}
```

### 5.3 Test Permission-Based Access
- [ ] Test with Admin user (role_id: 1) - should see all items
- [ ] Test with Data Entry user (role_id: 3) - should see items based on permissions
- [ ] Test with CM user (role_id: 4) - should see items based on permissions
- [ ] Test with CS user (role_id: 5) - should see CS Dashboard

---

## Step 6: Implement CS Dashboard (30 minutes)

### 6.1 Create CS Dashboard Route
**File**: `src/routes/index.tsx`

- [ ] Add CS routes section
- [ ] Create CS Layout or reuse Admin Layout
- [ ] Add CS Dashboard route

### 6.2 Create CS Dashboard Page
**File**: `src/pages/cs/Dashboard.tsx`

- [ ] Create placeholder CS Dashboard component
- [ ] Match structure from old CMDMS CS dashboard (if exists)
- [ ] Add route to router

---

## Step 7: Testing & Verification (2-3 hours)

### 7.1 Test Each Role
For each role, test:

**Admin (Role ID: 1)**:
- [ ] All menu items visible
- [ ] All reports accessible
- [ ] Log Viewer accessible
- [ ] Users management accessible

**Department User (Role ID: 2)**:
- [ ] Department sidebar displays
- [ ] Department name shows at top
- [ ] All department modules accessible (based on permissions)
- [ ] Navigation works correctly

**Data Entry (Role ID: 3)**:
- [ ] Admin sidebar displays
- [ ] Only items with permissions are visible
- [ ] Cannot access Users, Tags, Departments, Log Viewer
- [ ] Can access Minutes, Directives, Announcements, etc.

**CM (Role ID: 4)**:
- [ ] Admin sidebar displays
- [ ] Dashboard accessible
- [ ] Reports section accessible (if permissions granted)
- [ ] Limited admin modules (based on permissions)

**CS (Role ID: 5)**:
- [ ] CS Dashboard link visible
- [ ] CS Dashboard page accessible
- [ ] Reports section accessible (if permissions granted)

### 7.2 Cross-Browser Testing
- [ ] Test in Chrome
- [ ] Test in Firefox
- [ ] Test in Edge
- [ ] Test sidebar toggle functionality

### 7.3 Permission Testing
- [ ] Test with users having different permission sets
- [ ] Verify menu items hide/show correctly based on permissions
- [ ] Test edge cases (user with no permissions, etc.)

---

## Step 8: Polish & Refinement (1 hour)

### 8.1 Code Review
- [ ] Review all new components
- [ ] Ensure consistent code style
- [ ] Remove console.logs and debug code
- [ ] Add TypeScript types where missing
- [ ] Add comments for complex logic

### 8.2 UI/UX Consistency
- [ ] Verify styling matches old CMDMS
- [ ] Check hover states
- [ ] Verify active state indicators
- [ ] Test sidebar collapse/expand
- [ ] Check responsive behavior

### 8.3 Documentation
- [ ] Update SIDEBAR_IMPLEMENTATION_PLAN.md with completion status
- [ ] Document any deviations from old CMDMS
- [ ] Note any known issues

---

## Step 9: Integration with Backend (As Needed)

### 9.1 Permission System
- [ ] Verify permission keys match backend
- [ ] Test permission checks with real backend API
- [ ] Update permission checking logic if needed

### 9.2 User Department Data
- [ ] Verify `user.department` is populated correctly
- [ ] Test department name display
- [ ] Handle cases where department is null/undefined

---

## Priority Order Summary

**Immediate (Do First)**:
1. ✅ Step 1: Setup & Preparation
2. ✅ Step 2: Create Department Sidebar Component
3. ✅ Step 3: Update DepartmentLayout
4. ✅ Step 4: Implement Department Routes (at least placeholders)

**High Priority (Do Next)**:
5. ✅ Step 5: Fix Admin Sidebar Permission Checks
6. ✅ Step 7: Testing & Verification (basic)

**Medium Priority**:
7. ✅ Step 6: Implement CS Dashboard
8. ✅ Step 8: Polish & Refinement

**Ongoing**:
9. ✅ Step 9: Integration with Backend (as backend is ready)

---

## Estimated Time

- **Step 1**: 15 minutes
- **Step 2**: 1-2 hours
- **Step 3**: 15 minutes
- **Step 4**: 2-3 hours
- **Step 5**: 1 hour
- **Step 6**: 30 minutes
- **Step 7**: 2-3 hours
- **Step 8**: 1 hour
- **Step 9**: Ongoing

**Total Estimated Time**: 8-12 hours for complete implementation

---

## Quick Start Checklist

If you want to start immediately, follow this minimal checklist:

1. [ ] Read `department/partials/sidebar.blade.php` from old CMDMS
2. [ ] Create `DepartmentSidebar.tsx` with basic structure
3. [ ] Add department name header
4. [ ] Add Dashboard link
5. [ ] Add 2-3 test menu items (e.g., Record Notes, CM Remarks)
6. [ ] Update `DepartmentLayout.tsx` to use `DepartmentSidebar`
7. [ ] Test with department user
8. [ ] Gradually add remaining menu items
9. [ ] Fix Admin sidebar permissions
10. [ ] Test all roles

---

## Notes

- Start with **Department Sidebar** as it's the most critical missing piece
- Create **placeholder pages** first, then implement full functionality later
- Test **incrementally** - don't wait until everything is done
- **Permission checks** are crucial - test with different permission sets
- **Match old CMDMS exactly** - don't improvise UI/UX changes
- Keep the **same icon classes** from old CMDMS (ti-*, fa-*)

---

**Ready to Start? Begin with Step 1!**

