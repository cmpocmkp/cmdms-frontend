# Reports Module - Missing API Endpoints

**Date:** Current Session  
**Module:** Reports  
**Status:** ⚠️ Most Endpoints Not Documented

## Summary

The Reports module frontend has 45+ report pages, but the `API_INTEGRATION_GUIDE.md` only documents 12 basic report endpoints. Most report pages require specific endpoints that are **NOT documented** in the API guide.

## Documented Endpoints (✅ Implemented in reportsService.ts)

The following endpoints are documented in `API_INTEGRATION_GUIDE.md` and have been added to `reportsService.ts`:

1. ✅ `GET /api/reports/dashboard` - Dashboard statistics (in dashboardService.ts)
2. ✅ `GET /api/reports/departments/performance` - Department performance (in dashboardService.ts)
3. ✅ `GET /api/reports/meetings/summary` - Meetings summary report
4. ✅ `GET /api/reports/minutes/status-summary` - Minutes status summary report
5. ✅ `GET /api/reports/tasks/overview` - Tasks overview report
6. ✅ `GET /api/reports/compliance/directives` - Compliance directives report
7. ✅ `GET /api/reports/compliance/timelines` - Compliance timelines report
8. ✅ `GET /api/reports/complaints/stats` - Complaints statistics report
9. ✅ `GET /api/reports/kpi/summary` - KPI summary report
10. ✅ `GET /api/reports/analytics/trends` - Analytics trends report
11. ✅ `GET /api/reports/schemes/financial-summary` - Schemes financial summary report
12. ✅ `GET /api/reports/schemes/progress` - Schemes progress report
13. ✅ `GET /api/reports/ptf/issues-summary` - PTF issues summary report
14. ✅ `GET /api/reports/export/meetings` - Export meetings report
15. ✅ `GET /api/reports/export/minutes` - Export minutes report

## Missing Endpoints (❌ Not Documented)

The following endpoints are required for the Reports module but are **NOT documented** in `API_INTEGRATION_GUIDE.md`:

---

## Cabinet Meetings Reports

### 1. Cabinet Meetings Report (Main Dashboard)
- **Page:** `CabinetMeetingsReport.tsx`
- **Expected Endpoint:** `GET /api/reports/cabinet-meetings` or `GET /api/reports/meetings/cabinet`
- **Purpose:** Main dashboard showing department-wise statistics for cabinet meetings
- **Expected Response Structure:**
  ```json
  {
    "success": true,
    "data": {
      "departments": [
        {
          "id": 1,
          "name": "Health Department",
          "total": 25,
          "completed": 15,
          "on_target": 5,
          "on_going": 3,
          "off_target": 1,
          "overdue": 1,
          "off_target_other": 0,
          "overdue_other": 0
        }
      ],
      "relatedDepartments": [
        {
          "id": 6,
          "name": "Agriculture Department",
          "count": 12
        }
      ]
    }
  }
  ```

### 2. Cabinet Meetings By Status Report
- **Page:** `CabinetByStatusReport.tsx`
- **Expected Endpoint:** `GET /api/reports/cabinet-meetings/by-status?status={status}`
- **Query Parameters:**
  - `status` (required): Status code (1=Completed, 2=On Target, 3=Overdue, 4=Off Target, 5=All Decisions, 6=Overdue Reason, 7=On Going, 9=Off Target Reason)
- **Expected Response Structure:**
  ```json
  {
    "success": true,
    "data": {
      "meetings": [
        {
          "id": 1,
          "subject": "Meeting Subject",
          "meeting_date": "2024-01-15",
          "created_at": "2024-01-15T10:00:00Z",
          "updated_at": "2024-01-15T10:00:00Z",
          "creator": { "name": "Admin User" },
          "editor": { "name": "Admin User" },
          "minutes": [
            {
              "id": 1,
              "issues": "Issue text",
              "decisions": "Decision text",
              "comments": "Comments",
              "timeline": "2024-12-31",
              "status": 1,
              "status_label": "Completed",
              "status_class": "badge-success",
              "departments": [
                {
                  "id": 1,
                  "name": "Health Department",
                  "pivot": {
                    "status": 1,
                    "remarks": "Remarks"
                  }
                }
              ],
              "replies": []
            }
          ]
        }
      ]
    }
  }
  ```

### 3. Cabinet Detail Report (Department-wise)
- **Page:** `CabinetDetailReport.tsx`
- **Expected Endpoint:** `GET /api/reports/cabinet-meetings/detail/:deptid/:stat`
- **Route Parameters:**
  - `deptid`: Department ID
  - `stat`: Status code
- **Expected Response Structure:** Similar to CabinetByStatusReport but filtered by department and status

### 4. Cabinet Department-wise Report
- **Page:** `CabinetDepartmentWiseReport.tsx`
- **Expected Endpoint:** `GET /api/reports/cabinet-meetings/department-wise`
- **Query Parameters:**
  - `department[]`: Array of department IDs
  - `meeting_id[]`: Array of meeting IDs
  - `status[]`: Array of status codes
  - `tag[]`: Array of tag IDs
- **Expected Response Structure:** Filtered meetings and minutes based on query parameters

---

## Board Meetings Reports

### 5. Board Meetings Report (Main Dashboard)
- **Page:** `BoardMeetingsReport.tsx`
- **Expected Endpoint:** `GET /api/reports/board-meetings` or `GET /api/reports/boards/meetings`
- **Expected Response Structure:**
  ```json
  {
    "success": true,
    "data": {
      "departments": [
        {
          "id": 1,
          "name": "Health Department",
          "boards": [
            {
              "id": 1,
              "name": "Board Name",
              "is_active": true,
              "meetings_count": 10,
              "agenda_points_count": 50,
              "pending_agenda_points_count": 5,
              "boardDetail": {
                "meeting_frequency": "Monthly",
                "minimum_members": "5"
              },
              "boardMembers": [],
              "boardMeetings": [],
              "boardActs": []
            }
          ]
        }
      ],
      "stats": {
        "active_boards_count": 15,
        "inactive_boards_count": 2,
        "boards_agenda_points_count": 200,
        "boards_completed_agenda_points_count": 180,
        "boards_pending_agenda_points_count": 20
      }
    }
  }
  ```

### 6. Board Meeting Detail Report
- **Page:** `BoardMeetingDetailReport.tsx`
- **Expected Endpoint:** `GET /api/reports/board-meetings/detail/:deptid/:stat`
- **Route Parameters:**
  - `deptid`: Department ID
  - `stat`: Decision status code

### 7. Board Meeting Filter Report
- **Page:** `BoardMeetingFilterReport.tsx`
- **Expected Endpoint:** `GET /api/reports/board-meetings/filter`
- **Query Parameters:** Similar to Cabinet Department-wise (department, status, date range, etc.)

### 8. Board Meetings Upcoming Report
- **Page:** `BoardMeetingsUpcomingReport.tsx`
- **Expected Endpoint:** `GET /api/reports/board-meetings/upcoming`

---

## Board Acts Reports

### 9. Board Acts Report
- **Page:** `BoardActsReport.tsx`
- **Expected Endpoint:** `GET /api/reports/board-acts`

### 10. Board Acts Show Report
- **Page:** `BoardActsShowReport.tsx`
- **Expected Endpoint:** `GET /api/reports/board-acts/:id`

### 11. Board Acts Upcoming Report
- **Page:** `BoardActsUpcomingReport.tsx`
- **Expected Endpoint:** `GET /api/reports/board-acts/upcoming`

---

## Record Notes (Minutes) Reports

### 12. Record Notes Detail List Report
- **Page:** `RecordNotesDetailList.tsx`
- **Expected Endpoint:** `GET /api/reports/record-notes/detail-list/:meeting/:minute`
- **Route Parameters:**
  - `meeting`: Meeting ID
  - `minute`: Minute ID
- **Expected Response Structure:**
  ```json
  {
    "success": true,
    "data": {
      "minuteDetail": [
        {
          "id": 1,
          "issues": "Issue text",
          "decisions": "Decision text",
          "comments": "Comments",
          "timeline": "2024-12-31",
          "status": 1,
          "status_label": "Completed",
          "status_class": "badge-success",
          "departments": [],
          "replies": []
        }
      ],
      "meeting": {
        "id": 1,
        "subject": "Meeting Subject",
        "meeting_date": "2024-01-15",
        "department": {
          "id": 1,
          "name": "Health Department"
        }
      }
    }
  }
  ```

### 13. Record Notes Comparison Report
- **Page:** `RecordnotesComparisionReport.tsx`
- **Expected Endpoint:** `GET /api/reports/record-notes/comparison`

### 14. Record Notes Updates Report
- **Page:** `RecordnotesUpdatesReport.tsx`
- **Expected Endpoint:** `GET /api/reports/record-notes/updates`

### 15. Record Notes Updates Detail Report
- **Page:** `RecordnotesUpdatesDetailReport.tsx`
- **Expected Endpoint:** `GET /api/reports/record-notes/updates/detail/:id`

### 16. Filter Record Notes Report
- **Page:** `FilterRecordNotesReport.tsx`
- **Expected Endpoint:** `GET /api/reports/record-notes/filter`
- **Query Parameters:** Filters for meetings/minutes

---

## Summaries for CM Reports

### 17. Summaries for CM Report (Summary)
- **Page:** `SummariesForCMReport.tsx`
- **Expected Endpoint:** `GET /api/reports/summaries/cm/summary`
- **Expected Response Structure:**
  ```json
  {
    "success": true,
    "data": {
      "departments": [
        {
          "id": 1,
          "name": "Health Department",
          "status_counts": {
            "total": 25,
            "Completed": 10,
            "On Target": 5,
            "Ongoing": 4,
            "Off Target": 3,
            "Overdue": 2,
            "Off Target reason": 1,
            "Overdue other reason": 0
          }
        }
      ]
    }
  }
  ```

### 18. Summaries for CM Detail Report
- **Page:** `SummariesForCMDetailReport.tsx`
- **Expected Endpoint:** `GET /api/reports/summaries/cm/detail/:id`

---

## PTF Reports

### 19. PTF Dashboard Report
- **Page:** `PTFDashboardReport.tsx`
- **Expected Endpoint:** `GET /api/reports/ptf/dashboard`

### 20. PTF Meetings Report
- **Page:** `PTFMeetingsReport.tsx`
- **Expected Endpoint:** `GET /api/reports/ptf/meetings`
- **Note:** Different from PTF Meeting Detail Report

### 21. PTF Meetings Detail Report
- **Page:** `PTFMeetingsDetailReport.tsx`
- **Expected Endpoint:** `GET /api/reports/ptf/meetings/detail/:deptid/:stat`

### 22. PTF Department-wise Report
- **Page:** `PTFDepartmentWiseReport.tsx`
- **Expected Endpoint:** `GET /api/reports/ptf/department-wise`

### 23. PTF Department-wise Detail Report
- **Page:** `PTFDepartmentWiseDetailReport.tsx`
- **Expected Endpoint:** `GET /api/reports/ptf/department-wise/detail/:id`

### 24. PTF District-wise Report
- **Page:** `PTFDistrictWiseReport.tsx`
- **Expected Endpoint:** `GET /api/reports/ptf/district-wise`

### 25. PTF District Detail Report
- **Page:** `PTFDistrictDetailReport.tsx`
- **Expected Endpoint:** `GET /api/reports/ptf/district/detail/:id`

### 26. PTF District Latest Report
- **Page:** `PTFDistrictLatestReport.tsx`
- **Expected Endpoint:** `GET /api/reports/ptf/district/latest`

---

## PTIs Reports

### 27. PTIs Summary Report
- **Page:** `PTIsSummaryReport.tsx`
- **Expected Endpoint:** `GET /api/reports/ptis/summary`
- **Expected Response Structure:**
  ```json
  {
    "success": true,
    "data": {
      "departments": [
        {
          "id": 1,
          "name": "Health Department",
          "status_counts": {
            "total": 25,
            "Completed": 10,
            "On Target": 5,
            "Overdue": 3,
            "Off Target": 2
          }
        }
      ]
    }
  }
  ```

### 28. PTIs Detail Report
- **Page:** `PTIsDetailReport.tsx`
- **Expected Endpoint:** `GET /api/reports/ptis/detail`
- **Query Parameters:**
  - `department_id`: Department ID
  - `status`: Status code

---

## Inaugurations Reports

### 29. Inaugurations Report
- **Page:** `InaugurationsReport.tsx`
- **Expected Endpoint:** `GET /api/reports/inaugurations`
- **Expected Response Structure:**
  ```json
  {
    "success": true,
    "data": [
      {
        "id": 1,
        "name": "Health Department",
        "inaugurationsBreaking": [
          {
            "id": 1,
            "project_name": "Project Name",
            "scheme": "Scheme Name",
            "cost": 1000000,
            "description": "Description",
            "district_id": 1,
            "district_name": "District Name",
            "division_id": "1",
            "division_name": "Division Name",
            "date": "2024-07-15",
            "remarks": "Remarks",
            "attachments": []
          }
        ]
      }
    ]
  }
  ```

---

## Review Meetings Reports

### 30. Review Meetings Report
- **Page:** `ReviewMeetingsReport.tsx`
- **Expected Endpoint:** `GET /api/reports/review-meetings`
- **Query Parameters:**
  - `start_date`: Start date (YYYY-MM-DD)
  - `end_date`: End date (YYYY-MM-DD)

### 31. Review Meetings DS-wise Report
- **Page:** `ReviewMeetingsDSWiseReport.tsx`
- **Expected Endpoint:** `GET /api/reports/review-meetings/ds-wise`

---

## KPI Reports

### 32. KPI Data Reports
- **Page:** `KPIDataReports.tsx`
- **Expected Endpoint:** `GET /api/reports/kpi/data`
- **Note:** Different from `/api/reports/kpi/summary` (already documented)

### 33. DC KPIs Data Filter
- **Page:** `DCKPIsDataFilter.tsx`
- **Expected Endpoint:** `GET /api/reports/kpi/dc/filter`

### 34. Departments KPIs Data Filter
- **Page:** `DepartmentsKPIsDataFilter.tsx`
- **Expected Endpoint:** `GET /api/reports/kpi/departments/filter`

### 35. DPOs KPIs Data Filter
- **Page:** `DPOsKPIsDataFilter.tsx`
- **Expected Endpoint:** `GET /api/reports/kpi/dpos/filter`

---

## PMRU Reports

### 36. PMRU Meetings Report
- **Page:** `PMRUMetingsReport.tsx`
- **Expected Endpoint:** `GET /api/reports/pmru/meetings`

### 37. PMRU Subtasks Detail Report
- **Page:** `PMRUSubtasksDetail.tsx`
- **Expected Endpoint:** `GET /api/reports/pmru/subtasks/detail/:id`

---

## Khushhal KPK Reports

### 38. Khushhal KPK Tasks Report
- **Page:** `KhushhaalKPKTasksReport.tsx`
- **Expected Endpoint:** `GET /api/reports/khushhal-kpk/tasks`

---

## DC Inspection Reports

### 39. DC Inspection Details Report
- **Page:** `DCInspectionDetailsReport.tsx`
- **Expected Endpoint:** `GET /api/reports/dc-inspection/details/:id`

---

## MNA/MPA Reports

### 40. MNA/MPA Posting Recommendation
- **Page:** `MNAMPAPostingRecommendation.tsx`
- **Expected Endpoint:** `GET /api/reports/mna-mpa/posting-recommendation`

---

## Request to Backend Team

Please add documentation for all the above endpoints to `API_INTEGRATION_GUIDE.md`. For each endpoint, please provide:

1. **Endpoint URL** (full path)
2. **HTTP Method** (usually GET)
3. **Query Parameters** (if any)
4. **Route Parameters** (if any)
5. **Request Headers** (Authorization Bearer token)
6. **Response Structure** (JSON schema)
7. **Example curl command**

### Suggested Endpoint Documentation Format

```bash
### Cabinet Meetings Report
curl 'https://cmdms-backend-production.up.railway.app/api/reports/cabinet-meetings' \
  -H 'Authorization: Bearer YOUR_TOKEN'

**Response:**
```json
{
  "success": true,
  "data": {
    "departments": [...],
    "relatedDepartments": [...]
  }
}
```
```

## Current Implementation Status

- ✅ **reportsService.ts** - Created with all documented endpoints (12 endpoints)
- ❌ **All Report Pages (45+)** - Cannot be integrated (missing endpoints)

## Notes

- All documented endpoints have been successfully added to `reportsService.ts`
- Frontend code for all report pages is preserved but uses mock data
- Once endpoints are documented in the API guide, integration can proceed
- Many reports share similar data structures (departments, meetings, minutes, status counts)
- Report pages can be integrated quickly once endpoints are documented and available

---

**Total Missing Endpoints: 40+**

This document will be updated as endpoints are added to the API guide.



