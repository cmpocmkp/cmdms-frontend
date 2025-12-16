# Department-Wise Dashboard Design Specification

**Component:** Admin Dashboard (`/admin/dashboard`)  
**Source File:** `cmdms/resources/views/admin/report/department-wise-dashboard.blade.php`  
**Target Location:** `src/pages/admin/Dashboard.tsx`  
**Date:** December 15, 2025

---

## 🎯 PRIMARY OBJECTIVE

Replace the current dashboard module cards design with the **Department-Wise Dashboard** design from the old CMDMS. This dashboard provides a comprehensive overview of tasks across all departments with filtering capabilities.

---

## 📋 STRUCTURE OVERVIEW

The dashboard consists of 4 main sections:

1. **Summary Cards** - 4 cards showing aggregate statistics
2. **Filter Section** - Module and department filter controls
3. **Data Table** - Department-wise task breakdown
4. **Bar Chart** - Visual representation of tasks by module

---

## 1. SUMMARY CARDS SECTION

### 1.1 Layout

```html
<div class="row">
  <div class="col-md-12 d-flex justify-content-center flex-wrap">
    <!-- 4 cards in a row -->
    <div class="col-2 p-2">
      <div class="card record-notes-custom-card-analytics">
        <!-- Card content -->
      </div>
    </div>
    <!-- Repeat 3 more times -->
  </div>
</div>
```

### 1.2 Card Structure

Each card has:
- **Border Bottom**: 8px solid colored border
- **Icon**: Circular background with Themify icon
- **Count**: Large number (h3)
- **Title**: Card label
- **Percentage**: Shown for Completed, On Target, Overdue (not for Tasks)

### 1.3 Card Specifications

| Card | Border Color | Icon | Title | Shows Percentage |
|------|-------------|------|-------|------------------|
| Tasks | `#3282FF` (Blue) | `ti-list` | Tasks | No |
| Completed | `#0E8160` (Dark Green) | `ti-check` | Completed | Yes |
| On Target | `#1DC39F` (Teal) | `ti-target` | On Target | Yes |
| Overdue | `#E74039` (Red) | `ti-timer` | Overdue | Yes |

### 1.4 Card Styling

```css
.record-notes-custom-card-analytics .card-body {
  padding: 1rem !important;
}

.record-notes-custom-card-analytics .icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
}

.record-notes-custom-card-analytics .icon i {
  color: #fff;
  font-size: 1.5rem;
}

.record-notes-custom-card-analytics h3 {
  font-size: 1.75rem;
}

.record-notes-custom-card-analytics p {
  font-size: 0.9rem;
  margin-bottom: 0;
}
```

---

## 2. FILTER SECTION

### 2.1 Layout

```html
<div class="row form-row justify-content-center align-items-end">
  <div class="col-md-12">
    <form>
      <div class="form-row align-items-end">
        <div class="col-md-1"></div> <!-- Spacer -->
        <div class="col-md-5"><!-- Modules --></div>
        <div class="col-md-2"><!-- Department Filter --></div>
        <div class="col-md-4"><!-- Buttons --></div>
      </div>
    </form>
  </div>
</div>
```

### 2.2 Filter Components

#### **A. Modules Multi-Select**
- **Label**: "Modules"
- **Type**: Multi-select dropdown (Select2)
- **Options**:
  - Minutes
  - Sectoral
  - Directives
  - Interventions (displayed as "Trackers")
  - PTIs
  - Announcements
- **Default**: All selected
- **Width**: col-md-5

#### **B. Department Filter**
- **Label**: "Department Filter"
- **Type**: Single-select dropdown (Select2)
- **Options**:
  - All (default)
  - Departments
  - District Administrations
- **Width**: col-md-2

#### **C. Action Buttons**
- **Apply Filters**: Primary button (blue)
- **Clear Filters**: Secondary button (gray)
- **Width**: col-md-4

---

## 3. DATA TABLE SECTION

### 3.1 Table Structure

```html
<table class="table datatable table-bordered table-sm table-compact">
  <thead>
    <tr>
      <th>Department</th>
      <th>Tasks</th>
      <th>Completed</th>
      <th>On Target</th>
      <th>Overdue</th>
    </tr>
  </thead>
  <tbody>
    <!-- Rows -->
  </tbody>
</table>
```

### 3.2 Table Styling

#### **Header Styles**
```css
.table-compact th {
  padding: 0.5rem !important;
  font-size: 0.85rem !important;
}

.table-compact th:nth-child(1), .table-compact td:nth-child(1) {
  width: 30%;
  min-width: 150px;
}

.table-compact th:nth-child(n+2), .table-compact td:nth-child(n+2) {
  width: 14%;
  min-width: 80px;
  text-align: center;
}
```

#### **Cell Styles**
```css
.table-compact td {
  padding: 0.1rem !important;
  font-size: 0.85rem !important;
}
```

### 3.3 Column Background Colors

| Column | Background Color | Text Color |
|--------|-----------------|------------|
| Department | Default (white) | Default (black) |
| Tasks | `#dbe9ff` (Light blue) | `#000000` |
| Completed | `#c7ede5` (Light green) | `#000000` |
| On Target | `#d2f4ef` (Light teal) | `#000000` |
| Overdue | `#f66e68ab` (Light red) | `#000000` |

### 3.4 Interactive Behavior

- **Department Name**: Links to detail page
- **Each Count Cell**: Links to filtered detail page with status parameter
- **Hover Effect**: Standard link hover (underline)

### 3.5 Empty State

```html
<tr>
  <td colspan="5">No departments found for the selected filters.</td>
</tr>
```

---

## 4. BAR CHART SECTION

### 4.1 Chart Configuration

- **Library**: Chart.js
- **Type**: Bar chart
- **Data**: Tasks by module
- **Aspect Ratio**: 3.5
- **Bar Width**: 30% (barPercentage: 0.3)

### 4.2 Chart Styling

```css
.bar-chart-box .stretch-card {
  min-height: 300px;
  max-height: 400px;
}
```

### 4.3 Chart Colors

- **Background**: `rgb(211 227 252)` (Light blue)
- **Border**: `rgb(176 202 243)` (Medium blue)
- **Border Width**: 1px

### 4.4 Chart Options

```javascript
{
  onHover: function(evt, activeEls) {
    evt.chart.canvas.style.cursor = activeEls.length > 0 ? 'pointer' : 'default';
  },
  scales: {
    y: {
      beginAtZero: true,
      title: { display: true, text: 'Total Tasks' },
      ticks: { stepSize: 100 }
    }
  },
  barPercentage: 0.3,
  categoryPercentage: 0.9,
  responsive: true,
  maintainAspectRatio: true,
  aspectRatio: 3.5
}
```

---

## 5. STATE MANAGEMENT

### 5.1 Dashboard State Interface

```typescript
interface DashboardState {
  // Filter state
  selectedModules: string[]; // ['minutes', 'sectoral', 'directives', 'interventions', 'ptis', 'announcements']
  departmentFilter: 'all' | 'departments' | 'district_administrations';
  
  // Data
  overallTotals: {
    total_tasks: number;
    total_completed: number;
    total_on_target: number;
    total_overdue: number;
    completed_percentage: number;
    on_target_percentage: number;
    overdue_percentage: number;
  };
  
  departments: Department[];
  moduleTotals: Record<string, number>;
}

interface Department {
  id: number;
  name: string;
  total_tasks_count: number;
  total_completed_count: number;
  total_on_target_count: number;
  total_overdue_count: number;
}
```

---

## 6. MOCK DATA REQUIREMENTS

### 6.1 Module Relations

```typescript
const moduleRelations = [
  'minutes',
  'sectoral',
  'directives',
  'interventions',
  'ptis',
  'announcements'
];
```

### 6.2 Mock Departments

Generate 30-50 mock departments with random task counts:
- 10-20% completion rate
- 30-40% on target rate
- 20-30% overdue rate

### 6.3 Mock Overall Totals

```typescript
{
  total_tasks: 5000,
  total_completed: 1200,
  total_on_target: 1800,
  total_overdue: 1200,
  completed_percentage: 24,
  on_target_percentage: 36,
  overdue_percentage: 24
}
```

---

## 7. RESPONSIVE BEHAVIOR

### 7.1 Summary Cards

- **Desktop (≥1200px)**: 4 cards in a row (col-2 each)
- **Laptop (992-1199px)**: 4 cards in a row
- **Tablet (768-991px)**: 2 cards per row
- **Mobile (<768px)**: 1 card per row (stack vertically)

### 7.2 Filter Section

- **Desktop**: 3 columns (Modules, Dept Filter, Buttons)
- **Tablet**: Stack vertically
- **Mobile**: Full-width stacked

### 7.3 Data Table

- **All Sizes**: Horizontal scroll with `.table-responsive`
- **Min Width**: 800px to preserve column layout

### 7.4 Bar Chart

- **All Sizes**: Responsive with `maintainAspectRatio: true`
- **Height**: Auto-adjust based on aspect ratio

---

## 8. REACT IMPLEMENTATION NOTES

### 8.1 Required Libraries

```bash
npm install react-select react-chartjs-2 chart.js chartjs-plugin-datalabels
```

### 8.2 Component Structure

```
Dashboard/
├── index.tsx (Main component)
├── components/
│   ├── SummaryCards.tsx
│   ├── FilterSection.tsx
│   ├── DepartmentTable.tsx
│   └── ModuleChart.tsx
├── hooks/
│   └── useDashboardData.ts
└── styles.css
```

### 8.3 Data Fetching

```typescript
const useDashboardData = (filters: FilterState) => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    // Fetch data based on filters
    // For now, use mock data
  }, [filters]);
  
  return { data, loading };
};
```

---

## 9. ROUTING & LINKS

### 9.1 Department Detail Link

```
/admin/report/department/{id}/dashboard?module[]=minutes&department_filter=all
```

### 9.2 Status Filtered Link

```
/admin/report/department/{id}/dashboard?status=1&module[]=minutes
```

**Status Values:**
- `1` = Completed
- `2` = On Target
- `3` = Overdue

---

## 10. TESTING CHECKLIST

### Summary Cards
- [ ] 4 cards render correctly
- [ ] Border colors match specification
- [ ] Icons display correctly
- [ ] Percentages show for Completed, On Target, Overdue
- [ ] Percentages hide for Tasks card
- [ ] Responsive layout works on all breakpoints

### Filter Section
- [ ] Modules multi-select works
- [ ] All modules selected by default
- [ ] Department filter works (All/Departments/District Administrations)
- [ ] Apply Filters button triggers re-fetch
- [ ] Clear Filters button resets to defaults
- [ ] Form layout responsive

### Data Table
- [ ] Department names display correctly
- [ ] All counts display correctly
- [ ] Background colors match specification
- [ ] Department name links to detail page
- [ ] Count cells link to filtered detail pages
- [ ] Empty state shows when no data
- [ ] Horizontal scroll works on small screens
- [ ] Table compact styling applied

### Bar Chart
- [ ] Chart renders with correct data
- [ ] Bars display with correct colors
- [ ] Y-axis shows "Total Tasks" label
- [ ] Hover cursor changes to pointer
- [ ] Chart is responsive
- [ ] Chart updates when filters change

---

## 11. IMPLEMENTATION PRIORITY

### Phase 1: Summary Cards
1. Create SummaryCards component
2. Add card data structure
3. Implement card layout
4. Add styling (border, icon, counts)
5. Add percentage calculations

### Phase 2: Filter Section
1. Create FilterSection component
2. Add Modules multi-select (react-select)
3. Add Department Filter dropdown
4. Add action buttons
5. Handle form submission

### Phase 3: Data Table
1. Create DepartmentTable component
2. Add table structure
3. Add background colors
4. Add link functionality
5. Handle empty state
6. Add table-compact styling

### Phase 4: Bar Chart
1. Create ModuleChart component
2. Set up Chart.js
3. Configure bar chart options
4. Add data binding
5. Add hover interactions

### Phase 5: Integration
1. Connect all components
2. Add mock data service
3. Implement filter logic
4. Add loading states
5. Test responsive behavior

---

## 12. KEY DIFFERENCES FROM OLD DASHBOARD

### Removed Features
- ❌ Module cards grid (replaced with department table)
- ❌ Search form with department + dates + keyword
- ❌ Accordion sections for filtered results

### New Features
- ✅ Summary cards at the top
- ✅ Module filter (multi-select)
- ✅ Department type filter (All/Departments/Districts)
- ✅ Department-wise breakdown table
- ✅ Bar chart visualization

---

**END OF DESIGN SPECIFICATION**
