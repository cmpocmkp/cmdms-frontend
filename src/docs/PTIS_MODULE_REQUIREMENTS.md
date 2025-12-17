# PTIs KP Module - Complete Requirements ✅

## **COMPARISON: Old CMDMS vs New React**

**Last Updated:** December 17, 2025

---

## 📋 **Missing Features Found**

### **1. List Page (index.blade.php)**

| Feature | Old CMDMS | New React | Status |
|---------|-----------|-----------|--------|
| Title | "Priority Transformation Initiatives KP" | "PTIs KP" | ❌ Wrong |
| Filter Card | Collapsible filter card | Simple filters in row | ❌ Missing |
| Search Field | "Code \| Title" placeholder | "Search PTIs..." | ❌ Wrong |
| Clear Filters Button | ✅ | ❌ | ❌ Missing |
| Table Columns | #, Code, Title, Description, Actions | #, Title, Category, Dept, Progress, Status, Timeline, Actions | ❌ WRONG COLUMNS |
| Code Column | Uppercase PTI code | ❌ Missing | ❌ Missing |
| Description Column | Read-more component | ❌ Missing | ❌ Missing |
| Progress Column | ❌ Not in list | ✅ Has progress bar | ❌ Extra column |
| Category Column | ❌ Not in list | ✅ Has category | ❌ Extra column |
| Department Column | ❌ Not in list | ✅ Has department | ❌ Extra column |
| Status Column | ❌ Not in list | ✅ Has status | ❌ Extra column |
| Timeline Column | ❌ Not in list | ✅ Has timeline | ❌ Extra column |
| View Action | ✅ ti-eye icon | ❌ Missing | ❌ Missing |
| Edit Action | ✅ ti-pencil-alt | ✅ ti-pencil-alt | ✅ Has |
| Delete Action | Commented out | ❌ Missing | ✅ OK |
| Pagination Footer | With per-page & count | Simple pagination | ❌ Missing |
| Per-Page Selector | ✅ | ❌ | ❌ Missing |
| Records Count | ✅ | Simple counter | ❌ Wrong format |

---

### **2. Create Page (create.blade.php)**

| Feature | Old CMDMS | New React | Status |
|---------|-----------|-----------|--------|
| Exists | ✅ | ❌ | ❌ NOT CREATED |
| Title | "Add New PTI" | - | ❌ Missing |
| Back Button | ✅ "Back to PTIs" | - | ❌ Missing |
| Code Input | PTI- prepend + number input | - | ❌ Missing |
| Title Input | ✅ | - | ❌ Missing |
| Description | Summernote rich text | - | ❌ Missing |
| Add Button | ✅ | - | ❌ Missing |

---

### **3. Edit Page (edit.blade.php)**

| Feature | Old CMDMS | New React | Status |
|---------|-----------|-----------|--------|
| Exists | ✅ | ❌ | ❌ NOT CREATED |
| Title | "Edit PTI" | - | ❌ Missing |
| Back Button | ✅ "Back to PTIs" | - | ❌ Missing |
| Code Input | PTI- prepend + pre-filled number | - | ❌ Missing |
| Title Input | ✅ Pre-filled | - | ❌ Missing |
| Description | Summernote pre-filled | - | ❌ Missing |
| Update Button | ✅ | - | ❌ Missing |

---

### **4. Show/Detail Page (show.blade.php)**

| Feature | Old CMDMS | New React | Status |
|---------|-----------|-----------|--------|
| Exists | ✅ | ❌ | ❌ NOT CREATED |
| Title | "Priority Transformation Initiatives KP" | - | ❌ Missing |
| Back Button | ✅ "Back to Initiatives" | - | ❌ Missing |
| Edit PTI Button | ✅ | - | ❌ Missing |
| Display Code + Title | ✅ h4 title | - | ❌ Missing |
| Description | ✅ HTML rendered | - | ❌ Missing |
| Creator Info Bar | ✅ Updated time, name, phone | - | ❌ Missing |
| Tasks Card | ✅ With table | - | ❌ Missing |
| Add Task Button | ✅ Opens modal | - | ❌ Missing |
| Task Columns | 6 columns | - | ❌ Missing |
| Task Actions | Edit, Chat, Edit Depts | - | ❌ Missing |

---

## ✅ **Correct Table Structure for List**

### **Old CMDMS Columns:**
1. **#** - Serial number
2. **Code** - PTI code (e.g., "PTI-001") in UPPERCASE
3. **Title** - PTI title with link to show page
4. **Description** - Read-more component
5. **Actions** - View (ti-eye), Edit (ti-pencil-alt)

### **Current Wrong Columns:**
1. #
2. Title
3. Category ❌ (NOT in old CMDMS)
4. Department ❌ (NOT in old CMDMS)
5. Progress ❌ (NOT in old CMDMS)
6. Status ❌ (NOT in old CMDMS)
7. Timeline ❌ (NOT in old CMDMS)
8. Actions

---

## 🎯 **Filter Card Structure**

### **Old CMDMS:**
```html
<div class="card mb-3">
  <div class="card-header d-flex justify-content-between">
    <span>Filter PTIs</span>
    <button class="btn" data-toggle="collapse">
      <i class="fas fa-plus"></i> <!-- Changes to fa-minus when expanded -->
    </button>
  </div>
  <div class="card-body collapse"> <!-- Add 'show' class if filter applied -->
    <form method="GET">
      <input type="text" name="search" placeholder="Search Subject..." />
      <button type="submit">Search</button>
      <a href="/admin/ptis">Clear Filters</a>
    </form>
  </div>
</div>
```

### **Current:**
```tsx
<div className="row mb-3">
  <div className="col-md-4">
    <input ... /> <!-- Simple input -->
  </div>
  <div className="col-md-4">
    <select ... /> <!-- Status filter (NOT in old CMDMS) -->
  </div>
</div>
```

---

## 📝 **Form Structure for Create/Edit**

### **Code Input (Special):**
```tsx
<div className="form-group">
  <label>Initiative Code</label>
  <div className="input-group">
    <div className="input-group-prepend">
      <span className="input-group-text">PTI-</span>
    </div>
    <input 
      type="number" 
      name="code_number" 
      placeholder="Enter number only"
      value={codeNumber}
      onChange={(e) => {
        setCodeNumber(e.target.value);
        setCode(`PTI-${e.target.value}`);
      }}
    />
  </div>
  <input type="hidden" name="code" value={code} />
</div>
```

---

## 🎨 **Show Page Structure**

### **Header:**
- Title: "Priority Transformation Initiatives KP"
- Back button: "Back to Initiatives"
- Edit button: "Edit PTI"

### **Body:**
1. **Card Title:** Code + Title (e.g., "PTI-001 : Initiative Title")
2. **Description Section:**
   - Label: "Description:"
   - HTML content rendered

3. **Creator Info Bar:**
   - Updated time: "Updated X hours ago"
   - Creator name (if exists)
   - Creator phone (if exists)

4. **Tasks Card:**
   - Header: "Tasks" + "Add Task" button
   - Table with 6 columns:
     - S.No
     - Task Detail (Title + Description)
     - Progress
     - Resp. Departments (nested table with status badges)
     - Timeline (dd/mm/yyyy hh:mm a)
     - Actions (Edit, Chat, Edit Depts)

---

## 📊 **Mock Data Structure**

### **PTI Interface:**
```typescript
interface PTI {
  id: number;
  code: string; // e.g., "PTI-001"
  title: string;
  description: string; // HTML content
  creator?: {
    name: string;
    phone: string;
  };
  updated_at: string;
  tasks?: Task[];
}
```

### **Task Interface:**
```typescript
interface Task {
  id: number;
  title: string;
  description: string; // HTML
  progress: string; // HTML
  timeline: string; // datetime
  departments: Array<{
    id: number;
    name: string;
    pivot: {
      status: string; // DecisionStatus enum value
    };
  }>;
}
```

---

## 🔧 **Action Routes**

| Action | Old CMDMS Route | New React Route | Status |
|--------|----------------|-----------------|--------|
| List | /admin/ptis | /admin/ptis | ✅ OK |
| Create | /admin/ptis/create | /admin/ptis/add | ❌ Different |
| Show | /admin/ptis/{id} | /admin/ptis/show/{id} | ❌ Different |
| Edit | /admin/ptis/{id}/edit | /admin/ptis/edit/{id} | ✅ OK |

**Fix:** Update routes to match old CMDMS pattern.

---

## ✅ **Priority Actions Required**

### **HIGH PRIORITY:**
1. ✅ Fix PTIsList table columns (remove extra columns, add correct ones)
2. ✅ Add collapsible filter card
3. ✅ Add pagination footer with per-page selector
4. ✅ Create AddPTI page
5. ✅ Create EditPTI page
6. ✅ Create ShowPTI page with tasks table

### **MEDIUM PRIORITY:**
7. ✅ Add View action button (ti-eye) linking to show page
8. ✅ Add code column with uppercase display
9. ✅ Add description column with read-more
10. ✅ Fix title text

### **LOW PRIORITY:**
11. ✅ Add task modals (Add Task, Edit Task, Edit Departments)
12. ✅ Add task chat/replies page

---

## 📋 **Summary of Changes Needed**

**PTIsList.tsx:**
- ❌ Wrong title
- ❌ Missing collapsible filter card
- ❌ Wrong table columns (5 extra columns)
- ❌ Missing View action
- ❌ Missing pagination footer

**NEW FILES NEEDED:**
1. ❌ AddPTI.tsx
2. ❌ EditPTI.tsx
3. ❌ ShowPTI.tsx
4. ❌ Task-related modals (optional for now)

**ROUTES TO UPDATE:**
- Change `/admin/ptis/add` to `/admin/ptis/create`
- Change `/admin/ptis/show/{id}` to `/admin/ptis/{id}`

---

**PTIs KP module needs complete reimplementation to match old CMDMS!** 🚨
