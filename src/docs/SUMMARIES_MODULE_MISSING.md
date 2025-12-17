# Summaries for CM Module - Missing Features

## 🔍 Comparison: Old CMDMS vs New React

---

## ❌ **List Page (index.blade.php) - Missing Features**

| Feature | Old CMDMS | New React | Status |
|---------|-----------|-----------|--------|
| **Filter Card Collapse** | Bootstrap collapse with show/hide | Conditional rendering only | ❌ Wrong implementation |
| **Search Button** | ✅ Submit button in filter form | ❌ Missing | ❌ Missing |
| **Font Awesome Icon** | `fa fa-plus` (FA 4.x) | `fas fa-plus` (FA 5+) | ❌ Wrong version |
| **Date Format** | `d/m/Y h:m a` | Only date | ❌ Wrong format |
| **Pagination Footer** | Full footer with per-page dropdown | Simple pagination | ❌ Missing |
| **Per-Page Dropdown** | ✅ Show 10/15/25/50/100 | ❌ Missing | ❌ Missing |
| **Records Count** | "Showing X to Y of total Z" | ❌ Missing | ❌ Missing |
| **Pagination Links** | Full pagination with links | Simple pagination only | ❌ Incomplete |

---

## ❌ **Show Page (show.blade.php) - COMPLETELY MISSING**

The Show Summary detail page does NOT exist! Currently route uses `SummariesList` as placeholder.

### **What Should Be Implemented:**

1. **Page Header**:
   - Title: "Summaries for CM"
   - "Back to Summaries" button

2. **Summary Details Section**:
   - Subject (display-5)
   - Reference number
   - Department
   - Created Date (formatted)
   - Attachments list
   - Creator info bar (updated time)

3. **Tasks Card**:
   - Card header with "Tasks" title
   - "+ Add Task" button
   - **Tasks Table** with columns:
     - S.No
     - Task Detail (Task# + title + description)
     - Progress (HTML-rendered with read-more)
     - Resp. Departments (simple list, NOT nested table)
     - Timeline (formatted)
     - Status (badge)
     - Actions (4 buttons):
       - Edit Task (pencil icon)
       - Edit Departments (link icon)
       - View chat history (comments icon)
       - Print (printer icon) - opens in new tab

4. **Task Modals**:
   - Add Task modal
   - Edit Task modal
   - Edit Departments modal

---

## 🔧 **Key Differences from PTIs Show Page:**

| Feature | PTIs | Summaries |
|---------|------|-----------|
| **Resp. Departments** | Nested table with status badges | Simple list (no status badges) |
| **Status Column** | ❌ Not in table | ✅ Column in tasks table |
| **Print Action** | ❌ Not present | ✅ Print button (4th action) |

---

## 📝 **Implementation Tasks**

1. ✅ Fix list page filter collapse (use Bootstrap collapse classes)
2. ✅ Add Search button to filter form
3. ✅ Fix Font Awesome icon class (`fas` → `fa`)
4. ✅ Fix date format in table
5. ✅ Add full pagination footer (per-page dropdown + records count)
6. ✅ Create ShowSummary component
7. ✅ Add route for `/admin/summaries/show/:id`
8. ✅ Integrate TaskModals component (can reuse from PTIs)
9. ✅ Add Print action button
