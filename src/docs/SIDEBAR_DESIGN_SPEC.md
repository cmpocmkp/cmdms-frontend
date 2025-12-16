# Sidebar Component Design Specification - Old CMDMS Exact Replica

**Created:** December 15, 2025  
**Source:** `resources/views/admin/partials/sidebar.blade.php`  
**Status:** 📋 SPECIFICATION ONLY (Implementation Pending)

---

## 🎯 PRIMARY OBJECTIVE

**Replicate the old CMDMS sidebar EXACTLY:**
- Same navigation structure (nested menus up to 3 levels)
- Same permission-based visibility
- Same role-based conditional rendering
- Same active state highlighting
- Same collapsible menu behavior
- Same icons (Themify Icons)
- Same colors, spacing, and typography
- Same hover effects for third-level menus

**Per CURSOR_CONTEXT.md:**
> "Replicate the existing CMDMS UI structure and layout exactly. Visual design MAY be enhanced (spacing, shadows, hover states, feedback). No redesign, no feature removal, no UX flow changes."

---

## 📋 STRUCTURE ANALYSIS

### Overall Structure

```html
<style>
  /* Third-level menu hover styles */
  .thirdItem .thirdul { ... }
  .thirdItem:hover .thirdul { ... }
  .thirdItem a i { ... }
  .thirdItem:hover a i { ... }
</style>

<nav class="sidebar sidebar-offcanvas" id="sidebar">
  <ul class="nav">
    <!-- Dashboard -->
    <!-- Admin Menu (collapsible) -->
    <!-- Reports Menu (collapsible) -->
    <!-- External Links -->
  </ul>
</nav>
```

### Menu Categories (Top-Level)

The sidebar has **4 main sections:**

1. **Dashboard** - Single item (role-based: Admin/CS)
2. **Admin** - Collapsible with 30+ sub-items
3. **Reports** - Collapsible with 15+ sub-items
4. **External Links** - 3-4 standalone items

---

## 🎨 VISUAL DESIGN SPECIFICATION

### **1. Sidebar Container**

**Classes:** `sidebar sidebar-offcanvas`

**Properties:**
- Fixed position (left side)
- Full height
- Offcanvas behavior on mobile
- Scrollable content

**ID:** `sidebar`

---

### **2. Navigation List**

**Classes:** `nav`

**Structure:**
- Parent `<ul>` contains all top-level menu items
- Each menu item is an `<li class="nav-item">`
- Collapsible items have nested `<ul class="nav flex-column sub-menu">`

---

### **3. Menu Item Types**

#### **Type A: Simple Link (No Submenu)**

```html
<li class="nav-item {{ active class }}">
  <a class="nav-link" href="{{ route }}">
    <i class="ti-home menu-icon"></i>
    <span class="menu-title">Dashboard</span>
  </a>
</li>
```

**Elements:**
- Icon: Themify Icons (`ti-home`, `ti-settings`, etc.)
- Title: Span with class `menu-title`
- Active class: `active` when route matches

#### **Type B: Collapsible Parent (Has Submenu)**

```html
<li class="nav-item {{ active class }}">
  <a class="nav-link" data-toggle="collapse" href="#ui-administer"
     aria-expanded="true/false" aria-controls="ui-administer">
    <i class="ti-settings menu-icon"></i>
    <span class="menu-title">Admin</span>
    <i class="menu-arrow"></i>
  </a>
  <div class="collapse {{ show class }}" id="ui-administer">
    <ul class="nav flex-column sub-menu">
      <!-- Sub-items -->
    </ul>
  </div>
</li>
```

**Elements:**
- Icon: Menu icon (left)
- Title: Menu title (center)
- Arrow: `menu-arrow` class (right) - rotates when expanded
- Collapsible div: `collapse` class, `show` when active
- Sub-menu list: `nav flex-column sub-menu`

#### **Type C: Second-Level Item (Inside Submenu)**

```html
<li class="nav-item {{ active class }}">
  <a class="nav-link" href="{{ route }}">
    <span class="menu-title">Users</span>
  </a>
</li>
```

**Elements:**
- No icon (indented)
- Title only
- Active class when route matches

#### **Type D: Third-Level Collapsible (Nested Submenu)**

```html
<li class="nav-item {{ active class }}">
  <a class="nav-link" data-toggle="collapse" href="#boards-submenu"
     aria-expanded="true/false" aria-controls="boards-submenu">
    <span class="menu-title">Boards</span>
    <i class="menu-arrow"></i>
  </a>
  <div class="collapse {{ show class }}" id="boards-submenu">
    <ul class="nav flex-column sub-menu">
      <!-- Third-level items -->
    </ul>
  </div>
</li>
```

#### **Type E: Third-Level with Hover (Special)**

```html
<li class="nav-item thirdItem {{ active class }}">
  <a class="nav-link">
    <span class="menu-title">Item Title</span>
    <i class="menu-arrow"></i>
  </a>
  <ul class="thirdul">
    <!-- Nested items shown on hover -->
  </ul>
</li>
```

**Special behavior:**
- `.thirdItem` class enables hover effect
- `.thirdul` class hides submenu by default
- Hovering shows submenu
- Arrow icon rotates 90° on hover

---

## 🎨 THIRD-LEVEL MENU HOVER STYLES

**Inline CSS (from sidebar.blade.php):**

```css
.thirdItem .thirdul {
    list-style-type: none !important;
    display: none;
    padding-left: 10px !important;
}

.thirdItem:hover .thirdul {
    display: block;
}

.thirdItem a i {
    margin-left: auto;
    margin-right: 0;
    transition: all 0.2s linear;
}

.thirdItem:hover a i {
    transform: rotate(90deg);
}
```

**Behavior:**
- Third-level submenu hidden by default
- Shows on hover over parent
- Arrow icon rotates 90° smoothly (0.2s)
- Submenu has 10px left padding

---

## 📋 COMPLETE MENU STRUCTURE

### **1. Dashboard (Conditional)**

**For Non-CS Users (role_id != 5):**
```
Dashboard (ti-home) → /admin/dashboard
```

**For CS Users (role_id == 5):**
```
Dashboard (ti-home) → /cs/csdashboard
```

**Permission:** `admin.dashboard` or `cs.csdashboard`

---

### **2. Admin Section (Collapsible)**

**Parent:** `Admin` (ti-settings menu-icon)

**ID:** `ui-administer`

**Sub-items (30+ items, permission-based):**

1. **Log Viewer** (only for user_id == 1)
2. **Users** (admin.users.list)
3. **Export Users** (admin.userExport)
4. **Users Activity Logs** (admin.activitylogs.index)
5. **Tags** (admin.tags.index)
6. **Departments** (admin.department.index)
7. **Minutes** (admin.recordnotes.departments)
   - Conditional text: "Minutes" or "Add Cabinet Meeting" based on user
8. **Cabinet Meetings** (for Cabinet user)
9. **Directives** (admin.directives.list)
10. **Announcements** (admin.announcements.list)
11. **PTIs KP** (admin.ptis.index)
12. **Summaries for CM** (admin.summaries.index)
13. **Trackers** (admin.interventions.index)
14. **CM Remarks** (admin.cmremarks.index)
15. **Inaugurations** (admin.inaugurations.index)
16. **Sectoral Meetings** (admin.sectorialmeetings.index)
17. **All Schemes** (admin.schemes.index)
18. **Boards** (collapsible submenu)
    - Meetings (admin.boardmeetings.index)
    - Acts (admin.boardacts.index)
    - Members (admin.boardmembers.index)
19. **Funds Distribution** (collapsible submenu)
    - Annual Schemes (admin.annualschemes.index)
    - Distributed Schemes (admin.distributed.schemes)
    - Candidate Report (admin.candidate.distributed.fund.report)
20. **Review Meetings** (admin.reviewmeetings.index)
21. **MNA/MPA Requests** (admin.candidaterequests.index)
22. **Officer Departments** (admin.officerdepartments.index)
23. **Officers** (admin.officers.index)
24. **Candidates** (admin.candidates.index)
25. **MNA/MPA Posting Recommendation** (admin.posting.recommendation.index)
26. **Khushhal Khyber Pakhtunkhwa** (admin.khushhalkpk.index)

**Permissions Required:**
- Multiple permissions checked with `$userpermission->contains()`
- Role checks with `@can`, `@canany`, `Auth::user()->role_id`
- User ID checks for specific users

---

### **3. Reports Section (Collapsible)**

**Parent:** `Reports` (ti-bar-chart-alt menu-icon)

**ID:** `reports-submenu`

**Sub-items (15+ items, nested):**

1. **Cabinet** (admin.report.cabinet.meetings)
2. **Cabinet Department-wise** (admin.report.department.wise.cabinet.meeting.decisions)
3. **Boards** (collapsible submenu)
   - Meetings (admin.report.boardmeetings)
   - Acts (admin.report.boardacts)
4. **CM Initiatives Tracker** (external Google Sheets link)
5. **Good Governance Roadmap** (external IPMS link)
6. **CM DSD Visit** (external IPMS link)
7. **Ekhteyar Aawam Ka** (placeholder link)
8. **Summaries for CM** (collapsible submenu)
   - Summary (admin.report.summaries.summary)
   - Detail (admin.report.summaries.detail)
9. **Inaugurations** (admin.report.inaugurations)
10. **Review Meetings** (admin.report.review.meetings)
11. **Review Meetings By DS** (admin.report.ds.wise.review.meetings)
12. **Khushhaal Khyber Pakhtunkhwa** (admin.report.khushhalkpk.tasks)
13. **KPi Data Reports** (admin.kpidata.index)
14. **DC KPIs Data Filter** (admin.kpidata.show)
15. **DPOs KPIs Data Filter** (admin.kpidata.dpos)
16. **Departments KPIs Data Filter** (admin.kpidata.department)
17. **DC Inspection Details** (admin.report.dc.inspection)
18. **PMRU** (admin.report.pmru.meetings)
19. **Filter Record Notes** (admin.report.filter.recordnotes)
20. **PTF Module** (collapsible submenu)
    - Dashboard (admin.report.ptf.index)
    - Meetings (admin.report.ptf.meetings)
    - Department Wise Report (admin.report.ptf.departmentwise)
    - District Wise Report (admin.report.ptf.districtwise)
    - District Detail Report 1 (admin.cm.ptf.report.districtdetail)
    - District Wise Report (Latest) (admin.cm.ptf.report.districtlatest)
21. **Recordnotes Updates** (only for user_id == 1)
22. **Recordnotes Comparision** (only for user_id == 1)

**Permissions:**
- Each item has specific permission check
- Some items only visible to specific users

---

## 🎨 ICON MAPPING

All icons use Themify Icons:

| Menu Item | Icon Class |
|-----------|-----------|
| Dashboard | `ti-home` |
| Admin | `ti-settings` |
| Reports | `ti-bar-chart-alt` |
| Arrow (collapsed) | `menu-arrow` (points right) |
| Arrow (expanded) | `menu-arrow` (points down) |

**Menu icon placement:** Left side with class `menu-icon`

---

## 🔧 ACTIVE STATE LOGIC

### **Active Class Application:**

**Simple items:**
```blade
class="nav-item {{ request()->is('admin/dashboard') ? 'active' : '' }}"
```

**Collapsible parents:**
```blade
class="nav-item {{ request()->is('admin/*') && !request()->is('admin/report/*') ? 'active' : '' }}"
```

**Expanded state:**
```blade
aria-expanded="{{ request()->is('admin/*') ? 'true' : 'false' }}"
class="collapse {{ request()->is('admin/*') ? 'show' : '' }}"
```

### **React Equivalent:**

```typescript
const isActive = location.pathname === '/admin/dashboard';
const isAdminActive = location.pathname.startsWith('/admin/') && 
                      !location.pathname.startsWith('/admin/report/');
```

---

## 🔐 PERMISSION SYSTEM

### **Permission Checks:**

**Blade:**
```blade
@if ($userpermission->contains('admin.users.list'))
  <li>...</li>
@endif
```

**React:**
```typescript
{hasPermission('admin.users.list') && (
  <li>...</li>
)}
```

### **Role Checks:**

**Blade:**
```blade
@can(['isAdmin'])
  ...
@endcan

@canany(['isAdmin', 'is_DataEntry'])
  ...
@endcanany

@if (Auth::user()->role_id == 5)
  ...
@endif
```

**React:**
```typescript
{isAdmin() && ...}
{(isAdmin() || isDataEntry()) && ...}
{user?.role_id === 5 && ...}
```

### **User ID Checks:**

**Blade:**
```blade
@if (Auth::user()->id == 1)
  ...
@endif
```

**React:**
```typescript
{user?.id === 1 && ...}
```

---

## 📱 RESPONSIVE BEHAVIOR

### **Desktop (>= 992px):**
- Sidebar always visible
- Fixed position left
- Full menu visible
- Collapsible behavior active

### **Tablet/Mobile (< 992px):**
- Sidebar hidden by default
- Offcanvas mode (slides in from left)
- Toggle button in navbar controls visibility
- Overlay/backdrop when open
- Close on outside click or menu item click

### **Classes:**
- `sidebar-offcanvas` - Enables offcanvas behavior
- Show/hide controlled by JavaScript or React state

---

## 🎨 COLLAPSIBLE BEHAVIOR

### **Bootstrap Collapse:**

**Blade:**
```blade
<a data-toggle="collapse" href="#ui-administer" 
   aria-expanded="false" aria-controls="ui-administer">
  ...
</a>
<div class="collapse" id="ui-administer">
  <ul>...</ul>
</div>
```

**React:**
```typescript
const [isExpanded, setIsExpanded] = useState(false);

<a onClick={() => setIsExpanded(!isExpanded)}>
  ...
</a>
<div className={`collapse ${isExpanded ? 'show' : ''}`}>
  <ul>...</ul>
</div>
```

### **Arrow Icon Rotation:**
- `.menu-arrow` rotates when parent expanded
- CSS handles rotation via `.nav-item.active` state
- Or use React state to toggle rotation class

---

## 🔄 BLADE → REACT CONVERSIONS

| Blade Element | React Implementation |
|---------------|---------------------|
| `{{ route('admin.dashboard') }}` | `/admin/dashboard` |
| `@if ($userpermission->contains('admin.users.list'))` | `{hasPermission('admin.users.list') && ...}` |
| `@can(['isAdmin'])` | `{isAdmin() && ...}` |
| `@canany(['isAdmin', 'is_DataEntry'])` | `{(isAdmin() \|\| isDataEntry()) && ...}` |
| `Auth::user()->role_id` | `user?.role_id` |
| `Auth::user()->id` | `user?.id` |
| `request()->is('admin/dashboard')` | `location.pathname === '/admin/dashboard'` |
| `request()->is('admin/*')` | `location.pathname.startsWith('/admin/')` |
| `data-toggle="collapse"` | `onClick={toggleExpand}` |
| `aria-expanded="true"` | `aria-expanded={isExpanded}` |
| `class="{{ active ? 'active' : '' }}"` | `className={isActive ? 'active' : ''}` |
| `{{ URL('/') }}/log-viewer` | `/log-viewer` |

---

## 📝 IMPLEMENTATION CHECKLIST

### **Phase 1: Basic Structure**
- [ ] Create Sidebar component
- [ ] Set up nav list structure
- [ ] Add sidebar container classes
- [ ] Implement scrollable behavior

### **Phase 2: Dashboard Item**
- [ ] Add Dashboard menu item
- [ ] Implement role-based URL (Admin vs CS)
- [ ] Add permission check
- [ ] Add active state logic
- [ ] Add Themify icon

### **Phase 3: Admin Section**
- [ ] Create collapsible Admin parent
- [ ] Add all 30+ sub-items
- [ ] Implement permission checks for each item
- [ ] Add role-based conditional rendering
- [ ] Handle user ID checks
- [ ] Implement nested submenus (Boards, Funds Distribution)
- [ ] Add active state for parent and children

### **Phase 4: Reports Section**
- [ ] Create collapsible Reports parent
- [ ] Add all 20+ sub-items
- [ ] Implement nested submenus (Boards, Summaries, PTF)
- [ ] Add permission checks
- [ ] Handle external links
- [ ] Add active state logic

### **Phase 5: External Links**
- [ ] Add CM Initiatives Tracker (Google Sheets)
- [ ] Add Good Governance Roadmap (IPMS)
- [ ] Add CM DSD Visit (IPMS)
- [ ] Add Ekhteyar Aawam Ka (placeholder)

### **Phase 6: Collapsible Behavior**
- [ ] Implement collapse/expand state
- [ ] Add click handlers
- [ ] Rotate arrow icons
- [ ] Preserve expanded state on navigation
- [ ] Auto-expand active parent menus

### **Phase 7: Active State**
- [ ] Implement URL matching logic
- [ ] Apply active class to current item
- [ ] Apply active class to parent when child active
- [ ] Test all routes

### **Phase 8: Third-Level Hover**
- [ ] Add thirdItem class
- [ ] Implement hover show/hide
- [ ] Add arrow rotation on hover
- [ ] Apply inline styles

### **Phase 9: Permission Integration**
- [ ] Connect to authStore
- [ ] Implement hasPermission() helper
- [ ] Implement role checks (isAdmin, etc.)
- [ ] Filter menu items by permissions
- [ ] Test with different user roles

### **Phase 10: Responsive**
- [ ] Test desktop sidebar
- [ ] Implement offcanvas behavior
- [ ] Add mobile toggle handler
- [ ] Add backdrop/overlay
- [ ] Close on outside click
- [ ] Close on menu item click (mobile)

### **Phase 11: Testing**
- [ ] Test all menu items clickable
- [ ] Test all collapsible menus
- [ ] Test permission filtering
- [ ] Test role-based visibility
- [ ] Test active states
- [ ] Test responsive behavior
- [ ] Visual comparison with old CMDMS

---

## 🎯 SUCCESS CRITERIA

The new sidebar is correct when:

- [x] **Visual:** Looks IDENTICAL to old CMDMS sidebar
  - Same menu structure (30+ items in Admin, 20+ in Reports)
  - Same icons (Themify)
  - Same spacing and indentation
  - Same colors
  - Same hover effects

- [x] **Structure:** HTML matches exactly
  - Same Bootstrap classes
  - Same nesting levels (up to 3 levels)
  - Same collapse structure
  - Same active states

- [x] **Behavior:** Works like old CMDMS
  - Collapsible menus expand/collapse
  - Arrow icons rotate
  - Active state highlights current page
  - Third-level hover shows submenu
  - Mobile offcanvas works

- [x] **Permissions:** Filters correctly
  - Only shows items user has permission for
  - Role-based conditional rendering works
  - User ID checks work
  - External links accessible

- [x] **Responsive:** Layout adapts
  - Desktop: Fixed sidebar always visible
  - Mobile: Offcanvas sidebar, toggle from navbar

---

## 📸 VISUAL REFERENCE

**Key Visual Elements:**

1. **Sidebar Container:**
   - Fixed left position
   - Full height
   - White/light background
   - Scrollable

2. **Menu Items:**
   - Icon (left) + Title (center) + Arrow (right, if collapsible)
   - Padding for spacing
   - Hover state (light background)
   - Active state (primary color background)

3. **Sub-menus:**
   - Indented from parent
   - No icons (second level)
   - Lighter text color
   - Collapse/expand smoothly

4. **Third-Level Menus:**
   - Further indented
   - Hover to show
   - Arrow rotates 90°

5. **Icons:**
   - Themify Icons
   - Left-aligned
   - Consistent size
   - Primary color when active

**Overall Feel:**
- Clean
- Organized
- Professional
- Government-appropriate
- Easy to navigate
- Collapsible hierarchy clear

---

## 🎨 COLOR SCHEME

| Element | Color | Usage |
|---------|-------|-------|
| Active background | Primary theme color | Current page highlight |
| Active text | White | Text on active background |
| Hover background | Light gray | Hover state |
| Text color | Dark gray | Default text |
| Icon color | Gray | Default icons |
| Active icon color | Primary or white | Active item icons |

---

## 🚀 READY FOR IMPLEMENTATION

This specification provides **ALL details needed** to implement the sidebar exactly as it appears in old CMDMS.

**Next Steps:**
1. Review this specification
2. Implement `Sidebar.tsx` component
3. Create helper functions for permissions
4. Test with different user roles
5. Verify all menu items and permissions
6. Test responsive behavior
7. Visual comparison with old CMDMS

---

## 📊 STATISTICS

**Sidebar Complexity:**
- **1038 lines** of Blade code
- **30+ menu items** in Admin section
- **20+ menu items** in Reports section
- **3 nesting levels** maximum
- **50+ permission checks**
- **Multiple role checks**
- **External links:** 3-4 items
- **Collapsible sections:** 5+ sections
- **Third-level hover menus:** Multiple

**Implementation Estimate:**
- Component size: ~400-500 lines
- Helper functions: ~50-100 lines
- Type definitions: ~50 lines
- Total: ~500-650 lines

---

**Remember: "Convert the code, not the design"** ✅

Every menu item, permission check, and visual element should match the old CMDMS exactly!

