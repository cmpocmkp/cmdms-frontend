# Department User Permissions Explanation

## Overview

In the old CMDMS, **permissions are assigned per user, not per role**. This means that different department users see different modules in their sidebar based on what permissions have been assigned to them.

## How It Works in Old CMDMS

The old CMDMS uses:
```php
$userpermission = Auth::user()->permissions->pluck('name', 'id');
```

Each menu item checks if the user has a specific permission:
```php
@if ($userpermission->contains('department.recordnotes.list'))
    // Show Record Notes menu
@endif
```

## Mock Implementation

Since we're using dummy data without a database, we've assigned **different permission sets to different department users** to simulate real-world behavior.

### Permission Sets by User

| User ID | Name | Email | Permissions | Modules Visible |
|---------|------|-------|-------------|-----------------|
| 10 | Saqib Zaman | saqib.zaman@finance.gov.pk | Basic | Dashboard, Record Notes, CM Remarks, Directives, Announcements |
| 11 | Uzma Khalid | uzma.khalid@finance.gov.pk | Moderate | Dashboard, Record Notes, CM Remarks, Directives, Announcements, Sectoral Meetings, Board Meetings |
| 12 | Dr. Ahmed Hassan | ahmed.hassan@health.gov.pk | Limited | Dashboard, Record Notes, CM Remarks, Directives |
| 13 | Dr. Fatima Noor | fatima.noor@health.gov.pk | Moderate | Dashboard, Record Notes, CM Remarks, Directives, Announcements, Sectoral Meetings, PTF Dashboard |
| 14 | Rashid Mahmood | rashid.mahmood@education.gov.pk | Moderate | Dashboard, Record Notes, CM Remarks, Directives, Announcements, Board Meetings, PTIs KP |
| 15 | Sadia Iqbal | sadia.iqbal@education.gov.pk | Extended | Dashboard, Record Notes, CM Remarks, Directives, Announcements, Sectoral Meetings, Board Meetings, PTIs KP, Summaries |
| Others | ... | ... | Basic | Dashboard, Record Notes, CM Remarks, Directives |

## Testing Different Permission Levels

To test different permission levels, login with different department user accounts:

### Test Basic Access (4-5 modules)
- Email: `saqib.zaman@finance.gov.pk`
- Password: `DeptUser@123`

### Test Moderate Access (6-7 modules)
- Email: `uzma.khalid@finance.gov.pk`
- Password: `DeptUser@123`

### Test Extended Access (9+ modules)
- Email: `sadia.iqbal@education.gov.pk`
- Password: `DeptUser@123`

## Available Department Permissions

All department permissions that can be assigned:

1. `department.dashboard` - Always visible
2. `department.recordnotes.list` - Record Notes & Cabinet Minutes
3. `department.cmremarks.index` - CM Remarks
4. `department.khushhal.task.list` - Khushhal Programme
5. `department.khushhal-programme.create` - Add KPI Data
6. `department.khushhal-programme.show` - Show KPI Data
7. `department.sectorial-meetings.list` - Sectoral Meetings
8. `department.announcements.list` - Announcements
9. `department.directives.list` - Directives
10. `department.ptf.index` - PTF Dashboard
11. `department.ptf.create-issue` - Create New PTF Issue
12. `department.ptf.departments.dashboard` - PTF Dashboard (Departments)
13. `department.board-meetings.list` - Boards Meetings
14. `department.senate_meetings.index` - Senate Meetings
15. `department.ptis.index` - PTIs KP
16. `department.summaries.index` - Summary Implementation Tasks

## Notes

- **Dashboard is always visible** - All department users see the dashboard
- **Permissions are user-specific** - Not all department users have the same permissions
- **In production**, permissions would be assigned via admin panel per user
- **For testing**, we've created realistic permission distributions across different users

---

**Last Updated**: Based on old CMDMS permission system analysis

