# Navbar Component Design Specification - Old CMDMS Exact Replica

**Created:** December 15, 2025  
**Source:** `resources/views/admin/partials/navbar.blade.php`  
**Status:** 📋 SPECIFICATION ONLY (Implementation Pending)

---

## 🎯 PRIMARY OBJECTIVE

**Replicate the old CMDMS navbar EXACTLY:**
- Same fixed-top navbar structure
- Same logo positioning and sizing
- Same center title ("CMDMS") in green
- Same notification bell with badge counter
- Same notification panel (right sidebar)
- Same user dropdown menu
- Same responsive behavior
- Same colors, spacing, and icons

**Per CURSOR_CONTEXT.md:**
> "Replicate the existing CMDMS UI structure and layout exactly. Visual design MAY be enhanced (spacing, shadows, hover states, feedback). No redesign, no feature removal, no UX flow changes."

---

## 📋 STRUCTURE ANALYSIS

### HTML Structure (Exact from Blade)

```html
<nav class="navbar col-lg-12 col-12 p-0 fixed-top d-flex flex-row">
  <!-- Left: Brand Wrapper (Logo) -->
  <div class="text-center navbar-brand-wrapper d-flex align-items-center justify-content-center">
    <a class="navbar-brand brand-logo" href="/admin/dashboard">
      <img src="/admin_assets/images/CMDMSminilogo.png" class="mr-2" alt="logo" />
    </a>
    <a class="navbar-brand brand-logo-mini" href="/admin/dashboard">
      <img src="/admin_assets/images/CMDMSminilogo.png" alt="logo" />
    </a>
  </div>

  <!-- Right: Menu Wrapper -->
  <div class="navbar-menu-wrapper d-flex align-items-center justify-content-end">
    
    <!-- Sidebar Toggle Button (Desktop) -->
    <button class="navbar-toggler navbar-toggler align-self-center" type="button" data-toggle="minimize">
      <span class="ti-layout-grid2"></span>
    </button>

    <!-- Center: Site Title -->
    <ul class="navbar-nav mr-lg-2" style="margin: 0 auto;">
      <li class="nav-item nav-search d-lg-block">
        <div class="input-group">
          <div class="hover-cursor" id="navbar-search-icon">
            <h3 class="text-center" style="color:#17c653!important;font-size: 28px;margin: 0;padding: 0;font-weight: 400;">
              CMDMS
            </h3>
            <span>Chief Minister's Decision Monitoring System</span>
          </div>
        </div>
      </li>
    </ul>

    <!-- Right: Navbar Nav -->
    <ul class="navbar-nav navbar-nav-right">
      
      <!-- Notification Bell -->
      <li class="nav-item nav-settings d-lg-flex" id="cmdms-counter-list-section" style="margin-right:30px;">
        <a class="btn btn-rounded btn-icon nav-link count-indicator" href="#" title="Notifications" style="background: #c9ccd7;">
          <i style="padding-top: 8px;" class="fa fa-bell text-dark mx-0"></i>
          <!-- Badge Counter (if notifications > 0) -->
          <div id="cms-notification-counter" class="badge badge-danger">
            5 <!-- Dynamic count -->
          </div>
        </a>
      </li>

      <!-- User Profile Dropdown -->
      <li class="nav-item nav-profile dropdown">
        <a class="nav-link dropdown-toggle" href="#" data-toggle="dropdown" id="profileDropdown" style="color:#656565;">
          <i class="fa fa-user-circle fa-lg"></i>Settings
        </a>
        <div class="dropdown-menu dropdown-menu-right navbar-dropdown" aria-labelledby="profileDropdown">
          <!-- User Name -->
          <a class="dropdown-item">
            <i class="ti-user text-primary"></i>
            User Name
          </a>
          <!-- Settings Link -->
          <a class="dropdown-item" href="/admin/users/edit/:id">
            <i class="ti-settings text-primary"></i>
            Settings
          </a>
          <!-- Logout -->
          <a class="dropdown-item" href="/logout">
            <i class="ti-power-off text-primary"></i>
            Logout
          </a>
        </div>
      </li>
    </ul>

    <!-- Mobile: Sidebar Toggle Button -->
    <button class="navbar-toggler navbar-toggler-right d-lg-none align-self-center" type="button" data-toggle="offcanvas">
      <span class="ti-layout-grid2"></span>
    </button>
  </div>
</nav>

<!-- Right Sidebar: Notifications Panel -->
<div id="right-sidebar" class="settings-panel">
  <i class="settings-close ti-close" title="close notifications bar"></i>
  <ul class="nav nav-tabs border-top" id="setting-panel" role="tablist">
    <li class="nav-item">
      <a class="nav-link active" id="chats-tab" data-toggle="tab" href="#chats-section">
        Notifications
      </a>
    </li>
  </ul>
  <div class="tab-content" id="setting-content">
    <div class="tab-pane fade scroll-wrapper show active" id="chats-section">
      <ul class="chat-list">
        <!-- Notification items -->
        <li class="list active department-notfication">
          <!-- Notification content -->
        </li>
        <!-- Empty state -->
        <li class="list active">
          <div class="profile">
            <button type="button" class="btn btn-danger btn-rounded btn-icon pd-5">
              <i class="mdi mdi-bell-off mx-0"></i>
            </button>
          </div>
          <div class="info">
            <p>You have no notifications.</p>
          </div>
        </li>
      </ul>
    </div>
  </div>
</div>
```

---

## 🎨 VISUAL DESIGN SPECIFICATION

### 1. **Navbar Container**

**Classes:** `navbar col-lg-12 col-12 p-0 fixed-top d-flex flex-row`

**Properties:**
- Full width (col-12, col-lg-12)
- No padding (`p-0`)
- Fixed to top of screen (`fixed-top`)
- Flex row layout (`d-flex flex-row`)

**Behavior:**
- Stays fixed at top when scrolling
- Split into two sections: brand wrapper (left) and menu wrapper (right)

---

### 2. **Brand Wrapper (Logo Section)**

**Classes:** `text-center navbar-brand-wrapper d-flex align-items-center justify-content-center`

**Structure:**
```html
<div class="text-center navbar-brand-wrapper d-flex align-items-center justify-content-center">
  <a class="navbar-brand brand-logo">
    <img src="/admin_assets/images/CMDMSminilogo.png" class="mr-2" />
  </a>
  <a class="navbar-brand brand-logo-mini">
    <img src="/admin_assets/images/CMDMSminilogo.png" />
  </a>
</div>
```

**Visual Details:**
- Centered content
- Two logo variants: `brand-logo` (regular), `brand-logo-mini` (collapsed sidebar)
- Logo image: `CMDMSminilogo.png`
- Right margin on logo: `mr-2`

**Asset Required:**
- ✅ `/admin_assets/images/CMDMSminilogo.png` (Already copied)

---

### 3. **Center Title Section**

**Structure:**
```html
<ul class="navbar-nav mr-lg-2" style="margin: 0 auto;">
  <li class="nav-item nav-search d-lg-block">
    <div class="input-group">
      <div class="hover-cursor" id="navbar-search-icon">
        <h3 style="color:#17c653!important;font-size: 28px;margin: 0;padding: 0;font-weight: 400;">
          CMDMS
        </h3>
        <span>Chief Minister's Decision Monitoring System</span>
      </div>
    </div>
  </li>
</ul>
```

**Visual Details:**
- **Title "CMDMS":**
  - Color: #17C653 (KP Government green - EXACT match)
  - Font size: 28px
  - Font weight: 400 (normal)
  - Margin: 0
  - Padding: 0
  - Text alignment: center

- **Subtitle:**
  - Text: "Chief Minister's Decision Monitoring System"
  - Default styling (span element)
  - Below title

- **Container:**
  - Centered with `margin: 0 auto;`
  - Only visible on large screens (`d-lg-block`)

---

### 4. **Notification Bell**

**Classes:** `nav-item nav-settings d-lg-flex`

**Structure:**
```html
<li class="nav-item nav-settings d-lg-flex" id="cmdms-counter-list-section" style="margin-right:30px;">
  <a class="btn btn-rounded btn-icon nav-link count-indicator" href="#" style="background: #c9ccd7;">
    <i style="padding-top: 8px;" class="fa fa-bell text-dark mx-0"></i>
    <!-- Badge (conditional) -->
    <div id="cms-notification-counter" 
         style="color: #ffffff; background-color: #cb112d; font-weight: 700; position: relative; left: 18px; top: -35px; border-radius:10rem; font-size: 12px !important; border:unset; padding: 3px 6px 4px 6px;"
         class="badge badge-danger">
      5
    </div>
  </a>
</li>
```

**Visual Details:**

**Bell Button:**
- Background: #C9CCD7 (light gray)
- Rounded button
- Icon: Font Awesome `fa-bell`
- Icon color: Dark text
- Icon padding-top: 8px

**Badge Counter:**
- Color: #FFFFFF (white text)
- Background: #CB112D (red)
- Font weight: 700 (bold)
- Position: Relative
- Left offset: 18px
- Top offset: -35px (overlaps bell icon)
- Border radius: 10rem (circular)
- Font size: 12px
- Padding: Dynamic based on count
  - 1-9 digits: `3px 6px 4px 6px`
  - 10+ digits: `3px 4px 4px 3px`

**Behavior:**
- Only shows badge if count > 0
- Clicking opens right sidebar notification panel

---

### 5. **User Profile Dropdown**

**Classes:** `nav-item nav-profile dropdown`

**Structure:**
```html
<li class="nav-item nav-profile dropdown">
  <a class="nav-link dropdown-toggle" href="#" data-toggle="dropdown" id="profileDropdown" style="color:#656565;">
    <i class="fa fa-user-circle fa-lg"></i>Settings
  </a>
  <div class="dropdown-menu dropdown-menu-right navbar-dropdown" aria-labelledby="profileDropdown">
    <!-- User Name (non-clickable) -->
    <a class="dropdown-item">
      <i class="ti-user text-primary"></i>
      User Name
    </a>
    <!-- Settings Link -->
    <a class="dropdown-item" href="/admin/users/edit/:id">
      <i class="ti-settings text-primary"></i>
      Settings
    </a>
    <!-- Logout -->
    <a class="dropdown-item" href="/logout">
      <i class="ti-power-off text-primary"></i>
      Logout
    </a>
  </div>
</li>
```

**Visual Details:**

**Dropdown Toggle:**
- Icon: Font Awesome `fa-user-circle fa-lg`
- Text: "Settings"
- Color: #656565 (gray text)
- Has dropdown arrow (Bootstrap)

**Dropdown Menu:**
- Alignment: Right (`dropdown-menu-right`)
- Class: `navbar-dropdown`

**Dropdown Items:**
1. **User Name:**
   - Icon: Themify `ti-user` (primary color)
   - Text: Dynamic user name
   - Non-clickable (display only)

2. **Settings:**
   - Icon: Themify `ti-settings` (primary color)
   - Text: "Settings"
   - Links to:
     - Admin (role_id 1): `/admin/users/list`
     - Others: `/admin/users/edit/{user_id}`

3. **Logout:**
   - Icon: Themify `ti-power-off` (primary color)
   - Text: "Logout"
   - Triggers logout action

---

### 6. **Sidebar Toggle Buttons**

**Desktop Toggle:**
```html
<button class="navbar-toggler navbar-toggler align-self-center" type="button" data-toggle="minimize">
  <span class="ti-layout-grid2"></span>
</button>
```

**Mobile Toggle:**
```html
<button class="navbar-toggler navbar-toggler-right d-lg-none align-self-center" type="button" data-toggle="offcanvas">
  <span class="ti-layout-grid2"></span>
</button>
```

**Visual Details:**
- Icon: Themify `ti-layout-grid2` (grid icon)
- Desktop: Always visible
- Mobile: Only visible on small screens (`d-lg-none`)
- Position: Right side on mobile (`navbar-toggler-right`)

**Behavior:**
- Desktop: Toggles sidebar collapse/expand
- Mobile: Opens sidebar overlay

---

### 7. **Right Sidebar (Notifications Panel)**

**Classes:** `settings-panel`

**Structure:**
```html
<div id="right-sidebar" class="settings-panel">
  <!-- Close Button -->
  <i class="settings-close ti-close" title="close notifications bar"></i>
  
  <!-- Tab Header -->
  <ul class="nav nav-tabs border-top" id="setting-panel" role="tablist">
    <li class="nav-item">
      <a class="nav-link active" id="chats-tab" data-toggle="tab" href="#chats-section">
        Notifications
      </a>
    </li>
  </ul>
  
  <!-- Tab Content -->
  <div class="tab-content" id="setting-content" style="padding: unset;text-align: unset;">
    <div class="tab-pane fade scroll-wrapper show active" id="chats-section">
      <ul class="chat-list">
        <!-- Notification items loop here -->
      </ul>
    </div>
  </div>
</div>
```

**Visual Details:**

**Panel:**
- Slides in from right
- Fixed position
- Covers part of screen
- Semi-transparent backdrop

**Close Button:**
- Icon: Themify `ti-close`
- Position: Top right of panel
- Hover state for feedback

**Notification List:**
- Scrollable (`scroll-wrapper`)
- List items with icons, text, timestamps
- Different colored buttons for different notification types:
  - Warning (yellow): Reply notifications
  - Dark: Minute notifications
  - Primary (blue): Directive replies

---

## 🎨 COLOR PALETTE

| Element | Color | Hex | Usage |
|---------|-------|-----|-------|
| Title "CMDMS" | Green | `#17C653` | Main brand color |
| Notification Bell BG | Light Gray | `#C9CCD7` | Button background |
| Badge Background | Red | `#CB112D` | Notification counter |
| Badge Text | White | `#FFFFFF` | Counter text |
| User Dropdown Text | Gray | `#656565` | Dropdown toggle |
| Icons (Primary) | Primary | Theme primary | Themify icons |

---

## 📐 SPACING & DIMENSIONS

| Element | Property | Value |
|---------|----------|-------|
| Navbar | Height | Theme default (~60px) |
| Title Font Size | Font size | 28px |
| Badge Position | Left offset | 18px |
| Badge Position | Top offset | -35px |
| Notification Bell | Margin right | 30px |
| Bell Icon | Padding top | 8px |

---

## 🔧 INTERACTIVE ELEMENTS

### **Notification Bell:**
- **Click:** Opens right sidebar panel
- **Badge:** Shows unread count
- **Updates:** Real-time (WebSocket or polling in real app)

### **User Dropdown:**
- **Click:** Opens dropdown menu
- **Items:**
  - User name (display only)
  - Settings (navigates to user edit)
  - Logout (triggers logout)

### **Sidebar Toggles:**
- **Desktop:** Collapses/expands left sidebar
- **Mobile:** Opens sidebar as overlay

### **Notification Panel:**
- **Close:** Click X button or backdrop
- **Items:** Clickable to navigate
- **Mark as read:** Individual or bulk actions

---

## 🧩 NOTIFICATION TYPES

The old CMDMS has **7 types** of notifications:

1. **MinuteReplyNotification**
   - Icon: `ti-share-alt` (warning button)
   - Color: Yellow/Warning
   - Shows: Decision text + Department name

2. **SectorialAgendaPointReplyNotification**
   - Icon: `ti-share-alt` (warning button)
   - Color: Yellow/Warning
   - Shows: Item + Decision + Department

3. **MinuteNotification**
   - Icon: `ti-list-ol` (dark button)
   - Color: Dark
   - Shows: Meeting subject

4. **ReplyNotification**
   - Icon: `ti-share-alt` (warning button)
   - Color: Yellow/Warning
   - Shows: Meeting subject

5. **AnnouncementReplyNotification**
   - Icon: `ti-share-alt` (warning button)
   - Color: Yellow/Warning
   - Shows: Announcement title

6. **TaskCommentNotification**
   - Icon: `ti-share-alt` (warning button)
   - Color: Yellow/Warning
   - Shows: Task title

7. **DirectiveReplyNotification**
   - Icon: `ti-share-alt` (primary button)
   - Color: Blue/Primary
   - Shows: Subject + Department + User name

**Each notification shows:**
- Icon button (colored)
- Title/Subject (truncated to ~55 chars)
- Timestamp (relative: "5 minutes ago")
- "Mark as read" link

**Empty State:**
- Icon: `mdi-bell-off` (danger button)
- Text: "You have no notifications."

---

## 📱 RESPONSIVE BEHAVIOR

### **Desktop (>= 992px):**
- Full navbar visible
- Center title visible (`d-lg-block`)
- Notification bell visible (`d-lg-flex`)
- Only desktop toggle button visible

### **Mobile (< 992px):**
- Logo stays visible
- Center title hidden
- Notification bell hidden
- Mobile toggle button visible (`d-lg-none`)
- Dropdown still functional

---

## 🧩 ASSETS REQUIRED

### **Images:**
1. ✅ `CMDMSminilogo.png` - Already copied

### **Icons:**
- ✅ Font Awesome (`fa-bell`, `fa-user-circle`) - Already available
- ✅ Themify Icons (`ti-*`) - Already available
- ✅ Material Design Icons (`mdi-*`) - Already available

### **CSS:**
- ✅ Theme CSS already includes navbar styles

---

## 🔐 STATE MANAGEMENT

### **Global State (Zustand - useUIStore):**

```typescript
interface UIStore {
  // Notifications
  unreadCount: number;
  notifications: Notification[];
  notificationPanelOpen: boolean;
  
  // Actions
  setUnreadCount: (count: number) => void;
  setNotifications: (notifications: Notification[]) => void;
  toggleNotificationPanel: () => void;
  markNotificationAsRead: (id: number) => void;
  markAllAsRead: () => void;
}
```

### **Authentication State (useAuthStore):**

```typescript
interface AuthStore {
  user: User | null;
  // User name, role_id for conditional rendering
}
```

---

## 🔄 BLADE → REACT CONVERSIONS

| Blade Element | React Equivalent |
|---------------|------------------|
| `{{ route('admin.dashboard') }}` | `/admin/dashboard` |
| `{{ asset('images/...') }}` | `/admin_assets/images/...` |
| `{{ Auth::user()->name }}` | `user?.name` (from authStore) |
| `{{ Auth::user()->role_id }}` | `user?.role_id` |
| `@if ($notificationCount > 0)` | `{unreadCount > 0 && <div>}` |
| `$notificationCount` | `unreadCount` (from uiStore) |
| `@forelse($notifications as $notification)` | `{notifications.map(notif => ...)}` |
| `@if ($notification->type == 'App\Notifications\MinuteReplyNotification')` | `{notif.type === 'minute_reply' && ...}` |
| `{{ $notification->data['decision'] }}` | `{notif.data.decision}` |
| `data-toggle="dropdown"` | `onClick={toggleDropdown}` (React state) |
| `data-toggle="minimize"` | `onClick={toggleSidebar}` |
| `data-toggle="tab"` | React Tab component or state |

---

## 🎨 VISUAL ENHANCEMENTS ALLOWED

Per CURSOR_CONTEXT.md:
> "Visual design MAY be enhanced (spacing, shadows, hover states, feedback)"

### **Allowed Enhancements:**

✅ **Can Add:**
- Notification bell hover state (slight darken)
- Dropdown hover states
- Smooth transitions (dropdown open/close)
- Badge pulse animation (for new notifications)
- Notification panel slide-in animation
- Toast notifications for actions
- Loading states
- Better empty state design

❌ **Cannot Change:**
- Navbar layout structure
- Logo position or size
- Title text, color, or position
- Notification bell position
- User dropdown position
- Color scheme (green #17C653, red #CB112D)
- Notification panel structure

---

## 📝 IMPLEMENTATION CHECKLIST

### Phase 1: Basic Structure
- [ ] Create Navbar component
- [ ] Match exact HTML structure
- [ ] Add all Bootstrap classes
- [ ] Position logo correctly
- [ ] Add center title with correct styling

### Phase 2: Notification Bell
- [ ] Add bell icon with styling
- [ ] Add badge counter (conditional)
- [ ] Calculate badge padding dynamically
- [ ] Connect to uiStore for unread count
- [ ] Add click handler to open panel

### Phase 3: User Dropdown
- [ ] Add user icon and "Settings" text
- [ ] Create dropdown menu structure
- [ ] Add user name (from authStore)
- [ ] Add Settings link (conditional URL)
- [ ] Add Logout link with handler
- [ ] Style dropdown items with icons

### Phase 4: Sidebar Toggles
- [ ] Add desktop toggle button
- [ ] Add mobile toggle button
- [ ] Connect to sidebar state
- [ ] Handle minimize/expand

### Phase 5: Notification Panel
- [ ] Create right sidebar structure
- [ ] Add close button
- [ ] Create notification list
- [ ] Handle 7 notification types
- [ ] Add timestamp formatting
- [ ] Add "Mark as read" actions
- [ ] Add empty state
- [ ] Make scrollable

### Phase 6: State Management
- [ ] Connect to uiStore
- [ ] Connect to authStore
- [ ] Handle notification updates
- [ ] Handle mark as read
- [ ] Handle panel open/close

### Phase 7: Responsive
- [ ] Test desktop layout
- [ ] Test mobile layout
- [ ] Hide/show elements correctly
- [ ] Test dropdown on mobile

### Phase 8: Testing
- [ ] Visual comparison with old CMDMS
- [ ] Test all interactions
- [ ] Test with 0 notifications
- [ ] Test with 1-9 notifications
- [ ] Test with 10+ notifications
- [ ] Test all dropdown items
- [ ] Test notification panel
- [ ] Test responsive behavior

---

## 🎯 SUCCESS CRITERIA

The new navbar is correct when:

- [x] **Visual:** Looks IDENTICAL to old CMDMS navbar
  - Same logo position and size
  - Same center title (green, 28px)
  - Same notification bell with badge
  - Same user dropdown
  - Same colors and spacing

- [x] **Structure:** HTML matches exactly
  - Same Bootstrap classes
  - Same flex layout
  - Same responsive breakpoints
  - Same icon usage

- [x] **Behavior:** Works like old CMDMS
  - Notification bell opens panel
  - User dropdown opens menu
  - Logout works
  - Sidebar toggles work
  - Notifications display correctly

- [x] **Responsive:** Layout adapts
  - Desktop shows all elements
  - Mobile hides title and bell
  - Mobile toggle appears

---

## 📸 VISUAL REFERENCE

**Key Visual Elements:**

1. **Fixed Top Navbar:**
   - White background
   - Full width
   - Two-section layout (logo left, menu right)

2. **Logo Section:**
   - CMDMS mini logo
   - Centered in brand wrapper

3. **Center Title:**
   - "CMDMS" in green (#17C653, 28px)
   - Subtitle below
   - Centered with auto margins

4. **Notification Bell:**
   - Gray circular button (#C9CCD7)
   - Bell icon (Font Awesome)
   - Red badge with count (if > 0)
   - Badge overlaps bell top-right

5. **User Dropdown:**
   - User icon + "Settings" text
   - Gray color (#656565)
   - Dropdown menu right-aligned
   - Three items with Themify icons

6. **Right Sidebar Panel:**
   - Slides from right
   - Notification list
   - Colored icon buttons
   - Timestamps
   - "Mark as read" links

**Overall Feel:**
- Clean
- Professional
- Government-appropriate
- Standard Bootstrap navbar
- Fixed positioning
- Responsive design

---

## 🚀 READY FOR IMPLEMENTATION

This specification provides **ALL details needed** to implement the navbar exactly as it appears in old CMDMS.

**Next Steps:**
1. Review this specification
2. Implement `Navbar.tsx` component
3. Update `useUIStore` for notifications
4. Create notification panel component
5. Test against old CMDMS visually
6. Verify all interactions

---

**Remember: "Convert the code, not the design"** ✅

Every HTML tag, CSS class, color, and visual element should match the old CMDMS exactly!

