# Dashboard Design Specification

**Component:** Admin Dashboard (`/admin/dashboard`)  
**Source File:** `cmdms/resources/views/admin/dashboard.blade.php` + `modules.blade.php`  
**Target Location:** `src/pages/admin/Dashboard.tsx`

---

## 1. OVERVIEW

The Dashboard has **TWO DISTINCT VIEWS**:

### **A. DEFAULT VIEW (No Filters Applied)**
- Grid of module cards (like app icons)
- Each card links to a specific module/report
- Permission-based visibility
- Visual categories: Some green, some with custom images

### **B. FILTERED VIEW (After Search)**
- Filter form at top (Department, Dates, Keywords)
- Summary cards showing counts
- Accordion sections with detailed results:
  1. Minutes of meetings
  2. Sectoral agenda points
  3. Directives
  4. Cabinet minutes
  5. PTF minutes
  6. Announcements

---

## 2. DEFAULT VIEW - MODULE CARDS

### 2.1 Layout Structure
```html
<div className="row mb-5 mt-3">
  <!-- Grid of module cards, 6 per row on desktop -->
  <div className="col-xl-2 col-lg-2 col-md-2 col-sm-6 col-12">
    <a href="...">
      <div className="moduleCard [green]">
        <div className="imgdiv">
          <!-- SVG icon or PNG image -->
        </div>
        <h4>Module Title</h4>
      </div>
    </a>
  </div>
</div>
```

### 2.2 Module Cards List (Permission-Based)

| Module | Permission | Link | Has Custom Image |
|--------|-----------|------|------------------|
| CM   DMS | admin.report.filter.cm.meetings | /admin/report/filter-cm-meetings | Yes (cmdmsupdated.png) |
| Consolidated Report | admin.report.consolidated | /admin/report/consolidated | Green with SVG |
| Department-wise Report | admin.report.department-wise | /admin/report/department-wise | Green with SVG |
| CMDU | admin.mega.project.link | https://cmdu.kp.gov.pk/portal/admin | Yes (cmdu-updated.png) |
| Minutes | admin.report.minutes-summary | /admin/report/minutes-summary | Green with SVG |
| Summary Report | admin.report.summary | /admin/report/summary | Green with icon |
| CM Remarks | admin.report.cm.remarks | /admin/report/cm-remarks | Green with SVG |
| *...many more modules* | - | - | - |

### 2.3 Card Styling
- **Default card**: `.moduleCard` - White background
- **Green card**: `.moduleCard.green` - Green gradient background (#25885f)
- **Image area**: `.imgdiv` - Centered container for icon/image
- **Title**: `<h4>` - Module name, centered, wraps if needed

---

## 3. FILTERED VIEW - SEARCH INTERFACE

### 3.1 Filter Form Structure
```html
<div className="card">
  <div className="card-body">
    <form>
      <div className="row">
        <!-- Department Select (Multi-select, max 1) -->
        <div className="col-md-4">
          <label>Department<span className="text-danger">*</span></label>
          <Select2 multiple maxSelection={1} required />
        </div>

        <!-- From Date -->
        <div className="col-md-2">
          <label>From Date</label>
          <input type="date" />
        </div>

        <!-- To Date -->
        <div className="col-md-2">
          <label>To Date</label>
          <input type="date" />
        </div>

        <!-- Search Keyword -->
        <div className="col-md-4">
          <label>Search Keyword</label>
          <input type="text" placeholder="Search in subject or decisions" />
        </div>

        <!-- Buttons -->
        <div className="col-md-4">
          <button type="submit" className="btn btn-success">Search</button>
          <a href="/admin/dashboard" className="btn btn-warning">Reset</a>
        </div>
      </div>
    </form>
  </div>
</div>
```

### 3.2 Form Field Details
- **Department**: Multi-select dropdown (Select2), max 1 selection, required
- **From Date**: Date picker, optional
- **To Date**: Date picker, optional
- **Search Keyword**: Text input, searches in subject/decisions
- **Search Button**: Green (`btn-success`)
- **Reset Button**: Yellow (`btn-warning`), clears all filters

---

## 4. FILTERED VIEW - RESULTS SECTION

### 4.1 Results Header
```html
<div className="my-5 text-center">
  <h3>Search results for department - {departmentName}</h3>
</div>
```

### 4.2 Summary Cards
- Include from: `admin.report.combined.cards`
- Shows aggregated counts from all modules
- Displayed in a row with proper spacing

### 4.3 Task Categorization
- Include from: `admin.report.partials.task-categorization`
- Visual breakdown of task types/statuses

### 4.4 Print Button
```html
<div className="row">
  <div className="col-12 mb-2">
    <button type="button" className="btn btn-info btn-icon-text pull-right">
      <i className="ti-printer mr-1"></i> Print all
    </button>
  </div>
</div>
```

### 4.5 Accordion Sections Structure
```html
<div className="accordion" id="accordion">
  <!-- 6 Accordion Items -->
  <div className="card">
    <div className="card-header" role="tab" id="heading-1">
      <h6 className="mb-0">
        <a data-toggle="collapse" href="#collapse-1">
          Minutes of the meetings - {departmentName}
        </a>
      </h6>
    </div>
    <div id="collapse-1" className="collapse show">
      <div className="card-body">
        <!-- Data table or "None" message -->
      </div>
    </div>
  </div>
  <!-- Repeat for other sections... -->
</div>
```

### 4.6 Accordion Sections List
1. **Minutes of the meetings** - Shows meeting minutes
2. **Sectoral agenda points** - Shows sectoral meeting agenda points
3. **Directives** - Shows directives data
4. **Cabinet minutes** - Shows cabinet meeting minutes
5. **PTF minutes** - Shows PTF meeting minutes
6. **Announcements** - Shows announcements

---

## 5. STYLING SPECIFICATIONS

### 5.1 Custom Styles (From Blade Template)

#### Module Card Styles
```css
.moduleCard {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1.5rem;
  text-align: center;
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
}

.moduleCard:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.moduleCard.green {
  background: linear-gradient(135deg, #25885f 0%, #1a5f42 100%);
  color: white;
}

.moduleCard .imgdiv {
  margin-bottom: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
}

.moduleCard h4 {
  font-size: 14px;
  font-weight: 600;
  margin: 0;
  color: inherit;
}
```

#### Accordion Styles
```css
.accordion .card .card-header {
  padding: 1rem !important;
  background-color: #F8C146 !important;
}

.accordion .card .card-header h6,
.accordion .card .card-header a {
  color: #272020 !important;
}
```

#### Table Styles
```css
#department_decision_detial_repsort td,
#involved_meetings_table td {
  border: 1px solid silver !important;
  vertical-align: top !important;
  font-size: 16px !important;
  padding: 0.5rem 1rem !important;
}

#department_decision_detial_repsort th,
#involved_meetings_table th {
  border: 1px solid silver !important;
  text-align: center !important;
  height: 35px;
  padding: 0.5rem 1rem !important;
  vertical-align: middle !important;
  background-color: rgb(37, 136, 95) !important;
  color: white !important;
}

tr.dd-meeting-title-heading {
  background-color: rgb(37, 136, 95) !important;
}

tr.dd-meeting-title-heading td {
  background-color: rgb(37, 136, 95) !important;
  padding: 0.5rem 1rem !important;
  border: 1px solid silver !important;
  color: white !important;
}

.serial-number-column {
  width: 35px !important;
  text-align: center !important;
  font-weight: bold !important;
}

.status-column {
  width: 120px !important;
  text-align: center !important;
  font-weight: bold !important;
}
```

---

## 6. INTERACTIVE BEHAVIOR

### 6.1 Module Cards
- **Hover Effect**: Lift up + shadow
- **Click**: Navigate to module URL
- **External Links**: Open in new tab (CMDU)

### 6.2 Filter Form
- **Department Select**: Use Select2 (or React-Select equivalent)
  - Multiple selection
  - Maximum 1 selection allowed
  - Required field
  - Search functionality
- **Date Inputs**: HTML5 date pickers
- **Submit**: Submits form, shows filtered view
- **Reset**: Clears all filters, returns to default view

### 6.3 Accordion
- **Initial State**: All sections expanded (`.collapse.show`)
- **Click Header**: Toggle section visibility
- **All sections** can be open simultaneously (not exclusive)

### 6.4 Print Function
- **Print Button**: Triggers browser print dialog
- **Print Styles**: Custom @media print styles
  - Hides navigation, filters, buttons
  - Shows only results area
  - Adjusts colors for black & white printing

---

## 7. RESPONSIVE BEHAVIOR

### Grid Breakpoints (Module Cards)
- **XL (1200px+)**: 6 cards per row (`col-xl-2`)
- **LG (992px-1199px)**: 6 cards per row (`col-lg-2`)
- **MD (768px-991px)**: 6 cards per row (`col-md-2`)
- **SM (576px-767px)**: 2 cards per row (`col-sm-6`)
- **XS (<576px)**: 1 card per row (`col-12`)

### Filter Form Breakpoints
- **Desktop**: 4-column layout (Dept: 4, Dates: 2+2, Keyword: 4)
- **Tablet**: Stacked vertically
- **Mobile**: Full width stacked

---

## 8. REACT IMPLEMENTATION NOTES

### 8.1 State Management
```typescript
interface DashboardState {
  view: 'default' | 'filtered';
  filters: {
    department: string | null;
    startDate: string | null;
    endDate: string | null;
    searchKeyword: string | null;
  };
  results: {
    departmentName: string;
    cards: any[];
    minutes: any[];
    sectorals: any[];
    directives: any[];
    cabinetMinutes: any[];
    ptfMinutes: any[];
    announcements: any[];
  } | null;
  accordionState: {
    [key: string]: boolean; // section ID -> is expanded
  };
}
```

### 8.2 Component Structure
```
Dashboard/
├── index.tsx (Main component)
├── ModuleCards.tsx (Default view grid)
├── FilterForm.tsx (Search form)
├── ResultsView.tsx (Filtered results container)
│   ├── SummaryCards.tsx
│   ├── TaskCategorization.tsx
│   └── AccordionSections.tsx
└── styles.css (Custom dashboard styles)
```

### 8.3 Mock Data Requirements
- List of departments
- Module cards with permissions
- Sample filtered results for each accordion section

### 8.4 React-Select Configuration
```typescript
<Select
  isMulti
  isSearchable
  maxMenuHeight={200}
  placeholder="Select department"
  isOptionDisabled={() => selectedOptions.length >= 1}
  // ... other props
/>
```

---

## 9. PERMISSION-BASED RENDERING

Each module card checks user permissions before rendering:
- Use `hasPermission()` helper function
- Hide cards user doesn't have access to
- No placeholder or disabled state - just don't render

---

## 10. ICONS & IMAGES

### SVG Icons (Inline)
Most module cards use inline SVG with white fill (#ffffff) on green background.

### PNG Images (Assets)
Two modules use PNG images:
1. **CM | DMS**: `cmdmsupdated.png`
2. **CMDU**: `cmdu-updated.png`

These should be in: `public/admin_assets/images/dashboard/`

### Icon Fonts
Some cards use Themify icons:
- `.ti-bar-chart` - For Summary Report
- `.ti-printer` - For Print button

---

## 11. TESTING CHECKLIST

### Default View
- [ ] All module cards render correctly
- [ ] Cards respect user permissions
- [ ] Hover effects work smoothly
- [ ] Links navigate correctly
- [ ] External links open in new tab
- [ ] Responsive grid on all breakpoints

### Filter Form
- [ ] Department select works (max 1 selection)
- [ ] Date pickers function properly
- [ ] Search keyword input works
- [ ] Form validation (department required)
- [ ] Submit shows filtered view
- [ ] Reset returns to default view

### Filtered View
- [ ] Results header shows department name
- [ ] Summary cards display correctly
- [ ] All 6 accordion sections render
- [ ] Accordions expand/collapse properly
- [ ] Print button triggers print dialog
- [ ] "None" message when no data
- [ ] Tables format correctly

### Responsive
- [ ] Works on desktop (1920px)
- [ ] Works on laptop (1366px)
- [ ] Works on tablet (768px)
- [ ] Works on mobile (375px)

---

## 12. IMPLEMENTATION PRIORITY

### Phase 1: Default View
1. Create Dashboard component structure
2. Implement module cards grid
3. Add module data with permissions
4. Style cards with hover effects
5. Add navigation links

### Phase 2: Filter Form
1. Create FilterForm component
2. Add department select (React-Select)
3. Add date pickers
4. Add search keyword input
5. Handle form submission

### Phase 3: Filtered View
1. Create ResultsView component
2. Add summary cards (mock data)
3. Implement accordion structure
4. Add data tables for each section
5. Add print functionality

### Phase 4: Polish
1. Add loading states
2. Add error handling
3. Refine responsive behavior
4. Add print styles
5. Test all permissions

---

**END OF DESIGN SPECIFICATION**
