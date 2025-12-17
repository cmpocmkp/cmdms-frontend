# Admin Modules Design Specification - Old CMDMS Exact Replica

**Created:** December 15, 2024
**Source:** Multiple Blade templates from old CMDMS
**Status:** 📋 SPECIFICATION ONLY (Implementation Pending)
**Modules:** Users, Export Users, Activity Logs, Tags, Departments, Log Viewer

---

## 🎯 PRIMARY OBJECTIVE

Replicate 6 admin menu modules from the old CMDMS with exact HTML structure, layout, and styling. These are data management pages with tables, filters, and action buttons.

### Modules to Implement:
1. **Users** (`/admin/users`) - User list with roles, departments, and actions
2. **Export Users** (`/admin/users/export`) - User data export functionality  
3. **Users Activity Logs** (`/admin/activitylogs`) - Activity log table with filters
4. **Tags** (`/admin/tags`) - Tag management with CRUD operations
5. **Departments** (`/admin/departments`) - Department/Board management
6. **Log Viewer** (`/log-viewer`) - System log viewer (Laravel package)

---

## 📋 MODULE 1: USERS LIST

### Source File
`cmdms/resources/views/admin/users/index.blade.php`

### Structure Analysis
```html
<div class="content-wrapper">
  <div class="card">
    <div class="card-body">
      <div class="row">
        <div class="col-md-12">
          <a href="[create]" class="btn btn-primary mb-1" style="float:right;">Add new user</a>
          <h4 class="card-title">All Users</h4>
        </div>
        <div class="col-12">
          <div class="table-responsive">
            <table id="order-listing" class="table table-striped">
              <thead style="background: rgb(37, 136, 95) !important; color: white !important;">
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Department</th>
                  <th>Group</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <!-- User rows with dropdown actions -->
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
```

### Visual Design
- **Header**: "All Users" (left), "Add new user" button (right, blue)
- **Table Header**: Dark green background (`rgb(37, 136, 95)`), white text
- **Columns**: Name, Email, Role, Department, Group, Status, Actions
- **Actions Dropdown**: Settings icon button with dropdown menu containing:
  - Update
  - Assign Departments
  - Assign Permissions
  - API Tokens
  - Delete (red text, with confirmation)

### Interactive Elements
- **Add New User Button**: Routes to user creation form
- **Actions Dropdown**: Bootstrap dropdown with:
  - Edit user
  - Assign departments (admin only, user.id === 1)
  - Assign permissions (admin only, user.id === 1)
  - API tokens (admin only)
  - Permission indicators (header sections showing assigned permissions)
  - Delete (with confirmation dialog)
- **Status Display**: "Active" or "Inactive"
- **Group Display**: Shows name and description if available

---

## 📋 MODULE 2: EXPORT USERS

### Functionality
Route: `GET /admin/users/export`

This is an **export endpoint**, not a page. It downloads user data.

### Implementation Notes
- Add "Export Users" button on Users List page
- Trigger download of CSV/Excel file
- No separate page UI needed

---

## 📋 MODULE 3: USERS ACTIVITY LOGS

### Source File
`cmdms/resources/views/admin/activitylogs/index.blade.php`

### Structure Analysis
```html
<div class="content-wrapper">
  <div class="card">
    <div class="card-body">
      <h4 class="card-title">All Activity Logs</h4>
      <h4 class="display-3 mb-4">Logs Filters</h4>
      
      <!-- Filters Row -->
      <div class="row">
        <div class="col-md-3">
          <label>User Name</label>
          <input type="text" id="activity_name_search" placeholder="type name" class="form-control" />
        </div>
        <div class="col-md-3">
          <label>Action Status</label>
          <select id="activity_action_dropdown" class="form-control input-md">
            <option value="">All</option>
            <option value="Login">Login</option>
            <option value="Logout">Logout</option>
          </select>
        </div>
      </div>
      
      <!-- Table -->
      <div class="row">
        <div class="col-12">
          <div class="table-responsive">
            <table id="users_activity_logs" class="table table-striped">
              <thead>
                <tr>
                  <th>S.NO</th>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Date</th>
                  <th>Log Type</th>
                </tr>
              </thead>
              <tbody>
                <!-- Log rows -->
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
```

### Visual Design
- **Title**: "All Activity Logs"
- **Subtitle**: "Logs Filters" (display-3 class, larger text)
- **Filters**:
  - User Name input (col-md-3)
  - Action Status dropdown (col-md-3) - Options: All, Login, Logout
- **Table**: Standard striped table with DataTables (`#users_activity_logs`)
- **Columns**: S.NO, Name (with email below), Department, Date (formatted + relative time), Log Type

### Data Display
- **Name Column**: User name on first line, email on second line
- **Date Column**: `d-m-Y H:i:s` format + relative time (e.g., "2 hours ago")
- **Log Type**: Capitalized action (Login, Logout)

---

## 📋 MODULE 4: TAGS

### Source File
`cmdms/resources/views/admin/tags/index.blade.php`

### Structure Analysis
```html
<div class="content-wrapper">
  <div class="row">
    <div class="col-12 grid-margin stretch-card">
      <div class="card">
        <div class="card-header text-center">
          <div class="d-flex gap-3 justify-content-between align-items-center">
            <div class="flex-grow-1 text-center">
              <p class="block display-4">Tags List</p>
            </div>
            <div>
              <div class="btn-toolbar pull-right">
                <div class="btn-group">
                  <a href="[create]" class="btn btn-outline-primary btn-fw">
                    <i class="ti-plus mr-1"></i>Add New Tag
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="card-body">
          <div class="table-responsive">
            <table class="table table-striped">
              <thead style="background: rgb(37, 136, 95) !important; color: white !important;">
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Module</th>
                  <th>Parent Tag</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <!-- Tag rows -->
              </tbody>
            </table>
          </div>
          
          <!-- Pagination -->
          <div class="mt-4">
            {{ $tags->links() }}
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
```

### Visual Design
- **Header Card**: 
  - Title: "Tags List" (display-4, centered)
  - "Add New Tag" button (outline-primary, right side, with plus icon)
- **Table Header**: Dark green (`rgb(37, 136, 95)`), white text
- **Columns**: #, Name, Module, Parent Tag, Status, Actions
- **Actions**: 
  - Edit button (blue, small, pencil icon)
  - Delete button (red, small, trash icon, with confirmation)
- **Pagination**: Laravel pagination links at bottom

### Data Display
- **#**: Sequential number (pagination-aware)
- **Name**: Capitalized tag name
- **Module**: Module label (e.g., "Minutes", "Directives") or "-"
- **Parent Tag**: Parent name or "None"
- **Status**: Status label or "-"
- **No Data**: "No records found." message (colspan 6, centered)

---

## 📋 MODULE 5: DEPARTMENTS

### Source File
`cmdms/resources/views/admin/departments/index.blade.php`

### Structure Analysis
```html
<div class="content-wrapper">
  <div class="card">
    <div class="card-body">
      <a href="[create]" style="float:right;">Add new department/board</a>
      <h4 class="card-title">All Departments/Boards</h4>
      
      <div class="row">
        <div class="col-12">
          <div class="table-responsive">
            <table id="order-listing" class="table table-striped">
              <thead style="background: rgb(37, 136, 95) !important; color: white !important;">
                <tr>
                  <th>S.NO.</th>
                  <th>Name</th>
                  <th>District</th>
                  <th>Type</th>
                  <th>Parent</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <!-- Department rows -->
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
```

### Visual Design
- **Header**: "All Departments/Boards" (left), "Add new department/board" link (right, plain link)
- **Table Header**: Dark green (`rgb(37, 136, 95)`), white text
- **Columns**: S.NO., Name, District, Type, Parent, Actions
- **Actions**: "update" button (blue, primary)

### Data Display
- **Name**: HTML tags stripped, or "-"
- **District**: District name or "-"
- **Type**: Department type or "-"
- **Parent**: Parent department name or "-"
- **No Data**: "There is no data." (colspan 3)

---

## 📋 MODULE 6: LOG VIEWER

### Source
Log Viewer is a Laravel package (`arcanedev/log-viewer`) accessed at `/log-viewer`.

### Implementation Notes
This is an **external package interface**, not a custom Blade template.

**For React Implementation:**
- Create a route `/log-viewer` 
- Display an iframe or redirect message: "Log Viewer is a Laravel package interface. This will be available when the backend is integrated."
- OR: Open the Laravel log-viewer URL in a new tab
- Style: Maintain consistent admin layout, show informational message

---

## 🎨 COMMON VISUAL ELEMENTS

### Colors
- **Table Header Background**: `rgb(37, 136, 95)` (dark green)
- **Table Header Text**: White
- **Primary Button**: Blue (`btn-primary`)
- **Danger Text/Button**: Red (for delete actions)
- **Outline Button**: `btn-outline-primary`

### Typography
- **Page Title**: `h4.card-title` - Bold, default size
- **Display Text**: `.display-4` or `.display-3` - Larger titles
- **Table Headers**: White text on dark green

### Layout
- All pages use `.content-wrapper` > `.card` > `.card-body` structure
- "Add" buttons typically float right
- Tables are wrapped in `.table-responsive`
- Pagination goes below tables with `mt-4` spacing

### Tables
- **Class**: `table table-striped`
- **ID for DataTables**: `order-listing` or `users_activity_logs`
- **Header Style**: Inline `background: rgb(37, 136, 95) !important; color: white !important;`
- **Empty State**: Single row with colspan showing "No data" message

### Buttons
- **Primary**: `.btn.btn-primary` - Blue background
- **Outline**: `.btn.btn-outline-primary` - Blue border
- **Small**: `.btn-sm` - Smaller size for inline actions
- **Icon Buttons**: Themify icons (`.ti-*`) or MDI icons (`.mdi-*`)

---

## 🔧 INTERACTIVE PATTERNS

### Dropdowns
```html
<div class="dropdown">
  <button type="button" class="btn btn-secondary dropdown-toggle" 
          id="dropdownMenuIconButton8" data-toggle="dropdown">
    <i class="ti-settings menu-icon"></i>
  </button>
  <div class="dropdown-menu">
    <a class="dropdown-item" href="[url]">Action</a>
    <div class="dropdown-divider"></div>
    <h6 class="dropdown-header">Section Header</h6>
    <a class="dropdown-item text-danger" href="[url]">Delete</a>
  </div>
</div>
```

### Confirmation Dialogs
```javascript
onClick="return confirm('Are you sure you want to delete?');"
```

### Form Submissions
```html
<form method="POST" action="[url]" onsubmit="return confirm('...');">
  @csrf
  @method('DELETE')
  <button type="submit">Delete</button>
</form>
```

---

## 🧩 REACT IMPLEMENTATION NOTES

### Component Structure
```
src/pages/admin/
├── Users/
│   ├── UsersList.tsx
│   └── ExportUsers.tsx (utility)
├── ActivityLogs/
│   └── ActivityLogsList.tsx
├── Tags/
│   └── TagsList.tsx
├── Departments/
│   └── DepartmentsList.tsx
└── LogViewer/
    └── LogViewerPage.tsx
```

### Mock Data Needed
1. **Users**: `mockUsers` with { id, name, email, role, department, group, status, permissions }
2. **Activity Logs**: `mockActivityLogs` with { id, user, department, action, created_at }
3. **Tags**: `mockTags` with { id, name, module, parent, status }
4. **Departments**: `mockDepartments` with { id, name, district, type, parent }

### State Management
- Local `useState` for filters, search, pagination
- Mock data from `src/lib/mocks/data/` files
- No Zustand needed (local state sufficient)

### Routing
```typescript
// src/routes/index.tsx additions
{
  path: 'users',
  element: withSuspense(UsersList),
},
{
  path: 'users/export',
  element: () => { /* trigger download */ },
},
{
  path: 'activitylogs',
  element: withSuspense(ActivityLogsList),
},
{
  path: 'tags',
  element: withSuspense(TagsList),
},
{
  path: 'departments',
  element: withSuspense(DepartmentsList),
},
{
  path: 'log-viewer',
  element: withSuspense(LogViewerPage),
},
```

### DataTables Integration
Use the same DataTables setup as Dashboard:
- jQuery DataTables loaded via CDN
- Initialize in `useEffect`
- Destroy on unmount
- Responsive design
- Export buttons where needed

---

## 📝 IMPLEMENTATION CHECKLIST

### Phase 1: Mock Data
- [ ] Create `src/lib/mocks/data/users.ts` with user data
- [ ] Create `src/lib/mocks/data/activityLogs.ts` with log data
- [ ] Create `src/lib/mocks/data/tags.ts` with tag data
- [ ] Create `src/lib/mocks/data/departments.ts` with department data

### Phase 2: Components
- [ ] Create `UsersList.tsx` with table and actions dropdown
- [ ] Create `ActivityLogsList.tsx` with filters and table
- [ ] Create `TagsList.tsx` with table and pagination
- [ ] Create `DepartmentsList.tsx` with table
- [ ] Create `LogViewerPage.tsx` with placeholder/iframe
- [ ] Add "Export Users" functionality to Users page

### Phase 3: Routing
- [ ] Add all routes to `src/routes/index.tsx`
- [ ] Update sidebar menu items to link to new routes
- [ ] Test all navigation flows

### Phase 4: Styling
- [ ] Apply exact CSS classes and inline styles
- [ ] Match table header green color
- [ ] Style buttons and dropdowns
- [ ] Ensure responsive design
- [ ] Add DataTables integration

### Phase 5: Interactions
- [ ] Implement filter functionality (Activity Logs)
- [ ] Add confirmation dialogs for delete actions
- [ ] Implement dropdown menus (Users actions)
- [ ] Add pagination (Tags)
- [ ] Test all interactive elements

---

## 🎯 SUCCESS CRITERIA

### Visual Accuracy
- ✅ Table headers are dark green (`rgb(37, 136, 95)`)
- ✅ "Add" buttons are positioned correctly (top-right)
- ✅ Dropdown menus match old CMDMS structure
- ✅ Empty states show proper messages
- ✅ Buttons use correct colors (blue, red, outline)

### Functional Completeness
- ✅ All 6 modules accessible via routes
- ✅ Tables display mock data correctly
- ✅ Filters work (Activity Logs)
- ✅ Dropdowns open and close properly
- ✅ Confirmation dialogs appear on delete
- ✅ Pagination works (Tags)
- ✅ Export Users triggers download

### Code Quality
- ✅ TypeScript types defined for all data
- ✅ Components are well-organized
- ✅ Mock data is comprehensive
- ✅ No console errors
- ✅ Follows project structure conventions

---

## 📸 VISUAL REFERENCE SUMMARY

### Users List
```
┌─────────────────────────────────────────────────────┐
│ All Users                       [Add new user] btn  │
├─────────────────────────────────────────────────────┤
│ Name │ Email │ Role │ Dept │ Group │ Status │ ⚙️   │
├──────┼───────┼──────┼──────┼───────┼────────┼─────┤
│ John │ j@... │ Admin│ IT   │ Grp1  │ Active │ ⚙️   │
└─────────────────────────────────────────────────────┘
```

### Activity Logs
```
┌─────────────────────────────────────────────────────┐
│ All Activity Logs                                   │
│ Logs Filters                                        │
│ [User Name input]   [Action dropdown]              │
├─────────────────────────────────────────────────────┤
│ S.NO │ Name │ Department │ Date │ Log Type         │
├──────┼──────┼────────────┼──────┼──────────────────┤
│  1   │ John │ IT Dept    │ ...  │ Login            │
└─────────────────────────────────────────────────────┘
```

### Tags / Departments
```
┌─────────────────────────────────────────────────────┐
│          Tags List              [Add New Tag] btn   │
├─────────────────────────────────────────────────────┤
│ # │ Name │ Module │ Parent │ Status │ Actions      │
├───┼──────┼────────┼────────┼────────┼──────────────┤
│ 1 │ Tag1 │ Mins   │ None   │ Active │ [✏️] [🗑️]   │
└─────────────────────────────────────────────────────┘
            [pagination links]
```

---

**READY FOR IMPLEMENTATION** ✅

All specifications documented. Next step: Create React components following this exact design.
