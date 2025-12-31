# Housing Department Dashboard Verification

**Date:** December 2025  
**Purpose:** Verify Housing department dashboard matches old CMDMS exactly

---

## ✅ Expected Sidebar Menus (Based on Old CMDMS Image)

For Housing department user (ID: 31), the sidebar should show:

1. ✅ Dashboard (always visible)
2. ✅ Record Notes (permission: `department.recordnotes.list`)
3. ✅ Cabinet Minutes (permission: `department.recordnotes.list`)
4. ✅ CM Remarks (permission: `department.cmremarks.index`)
5. ✅ Sectoral Meetings (permission: `department.sectorial-meetings.list`)
6. ✅ Announcements (permission: `department.announcements.list`)
7. ✅ Directives (permission: `department.directives.list`)
8. ✅ PTF Dashboard (permission: `department.ptf.index`)
9. ✅ Boards Meetings (permission: `department.board-meetings.list`)
10. ✅ PTIs KP (permission: `department.ptis.index`)

**NOT Visible for Housing:**
- ❌ Khushhal Programme (no permission)
- ❌ Add KPI Data (no permission)
- ❌ Show KPI Data (no permission)
- ❌ Create New PTF Issue (no permission)
- ❌ PTF Dashboard (Departments) (no permission)
- ❌ Senate Meetings (no permission)
- ❌ Summary Implementation Tasks (no permission)

---

## ✅ Expected Dashboard Cards (Based on Old CMDMS Image)

For Housing department, the dashboard should show **10 cards** in this exact order:

**Row 1 (6 cards):**
1. ✅ Record Notes
2. ✅ Cabinet
3. ✅ CM Remarks
4. ✅ Directives / Correspondence
5. ✅ Sectoral Meetings
6. ✅ Announcements

**Row 2 (4 cards):**
7. ✅ Provincial Task Force (PTF)
8. ✅ Boards Meetings
9. ✅ CM Initiatives Tracker (always visible, external link)
10. ✅ Priority Transformation Initiatives KP

---

## 🔍 Current Housing User Permissions

**User ID:** 31  
**Email:** `muhammad.asif@housing.gov.pk`  
**Password:** `DeptUser@123`

**Permissions:**
- ✅ `department.dashboard` (base)
- ✅ `department.recordnotes.list`
- ✅ `department.cmremarks.index`
- ✅ `department.directives.list`
- ✅ `department.announcements.list`
- ✅ `department.sectorial-meetings.list`
- ✅ `department.board-meetings.list`
- ✅ `department.ptf.index`
- ✅ `department.ptis.index`

---

## 📋 Verification Checklist

### Sidebar
- [ ] Dashboard menu visible
- [ ] Record Notes menu visible
- [ ] Cabinet Minutes menu visible
- [ ] CM Remarks menu visible
- [ ] Sectoral Meetings menu visible
- [ ] Announcements menu visible
- [ ] Directives menu visible
- [ ] PTF Dashboard menu visible
- [ ] Boards Meetings menu visible
- [ ] PTIs KP menu visible
- [ ] No Khushhal Programme menu
- [ ] No Senate Meetings menu
- [ ] No Summary Implementation Tasks menu

### Dashboard Cards
- [ ] Record Notes card visible (Row 1, Position 1)
- [ ] Cabinet card visible (Row 1, Position 2)
- [ ] CM Remarks card visible (Row 1, Position 3)
- [ ] Directives / Correspondence card visible (Row 1, Position 4)
- [ ] Sectoral Meetings card visible (Row 1, Position 5)
- [ ] Announcements card visible (Row 1, Position 6)
- [ ] Provincial Task Force (PTF) card visible (Row 2, Position 1)
- [ ] Boards Meetings card visible (Row 2, Position 2)
- [ ] CM Initiatives Tracker card visible (Row 2, Position 3)
- [ ] Priority Transformation Initiatives KP card visible (Row 2, Position 4)
- [ ] Total: 10 cards visible
- [ ] No Khushhal Programme card
- [ ] No Senate Meetings card
- [ ] No Summary Implementation Tasks card

---

## 🐛 Common Issues to Check

1. **Permission Check:** Verify `hasPermission()` function is working correctly
2. **User ID:** Ensure logged in user has ID 31 (Housing department)
3. **Permissions Array:** Check that permissions are loaded correctly in authStore
4. **Card Order:** Verify cards appear in the exact order listed above
5. **Sidebar Order:** Verify sidebar menus appear in the exact order listed above

---

**Last Updated:** December 2025

