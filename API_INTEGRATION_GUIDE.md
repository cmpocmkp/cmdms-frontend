# CMDMS Backend API Integration Guide

**Base URL:** `https://cmdms-backend-production.up.railway.app`  
**API Base Path:** `/api`

> **Note:** All authenticated endpoints require `Authorization: Bearer YOUR_ACCESS_TOKEN` header.

## Quick Reference

- [Authentication](#authentication)
- [Users](#users)
- [Roles & Permissions](#roles--permissions)
- [Departments](#departments)
- [Meetings & Minutes](#meetings--minutes)
- [Directives](#directives)
- [Announcements](#announcements)
- [CM Remarks](#cm-remarks)
- [PTF](#ptf)
- [Boards](#boards)
- [Sectoral Meetings](#sectoral-meetings)
- [Schemes](#schemes)
- [Inaugurations](#inaugurations)
- [Reports](#reports)
- [Files](#files)
- [Notifications](#notifications)
- [KPI](#kpi)
- [Tasks](#tasks)
- [Welfare](#welfare)
- [Issues & Complaints](#issues--complaints)
- [Activity Logs](#activity-logs)
- [Common APIs](#common-apis)

---

## Authentication

### Login
```bash
curl -X POST 'https://cmdms-backend-production.up.railway.app/api/auth/login' \
  -H 'Content-Type: application/json' \
  -d '{"email":"admin@cmdms.gov.pk","password":"your_password"}'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "name": "Admin",
      "email": "admin@cmdms.gov.pk",
      "roleId": 1
    },
    "accessToken": "eyJhbG...",
    "refreshToken": "eyJhbG..."
  }
}
```

### Change Password
```bash
curl -X POST 'https://cmdms-backend-production.up.railway.app/api/auth/change-password' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"oldPassword":"current_password","newPassword":"new_password"}'
```

### Forgot Password
```bash
curl -X POST 'https://cmdms-backend-production.up.railway.app/api/auth/forgot-password' \
  -H 'Content-Type: application/json' \
  -d '{"email":"user@cmdms.gov.pk"}'
```

### Reset Password
```bash
curl -X POST 'https://cmdms-backend-production.up.railway.app/api/auth/reset-password' \
  -H 'Content-Type: application/json' \
  -d '{"token":"reset_token","newPassword":"new_password"}'
```

### Logout
```bash
curl -X POST 'https://cmdms-backend-production.up.railway.app/api/auth/logout' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

---

## Users

### List Users
```bash
curl 'https://cmdms-backend-production.up.railway.app/api/users?page=1&limit=10' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 2,
      "name": "John Doe",
      "email": "john@cmdms.gov.pk",
      "roleId": 2,
      "role": {"name": "Department User"},
      "departmentId": 5,
      "department": {"name": "Education"}
    }
  ],
  "meta": {"total": 150, "page": 1, "limit": 10, "totalPages": 15}
}
```

### Get User
```bash
curl 'https://cmdms-backend-production.up.railway.app/api/users/2' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### Create User
```bash
curl -X POST 'https://cmdms-backend-production.up.railway.app/api/users' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "name":"Jane Smith",
    "email":"jane@cmdms.gov.pk",
    "password":"password123",
    "roleId":2,
    "departmentId":10
  }'
```

### Update User
```bash
curl -X PATCH 'https://cmdms-backend-production.up.railway.app/api/users/2' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"name":"John Updated","isActive":true}'
```

### Delete User
```bash
curl -X DELETE 'https://cmdms-backend-production.up.railway.app/api/users/2' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

---

## Roles & Permissions

### Roles

#### List Roles
```bash
curl 'https://cmdms-backend-production.up.railway.app/api/roles' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

#### Get Role
```bash
curl 'https://cmdms-backend-production.up.railway.app/api/roles/1' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

#### Create Role
```bash
curl -X POST 'https://cmdms-backend-production.up.railway.app/api/roles' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"name":"Custom Role","description":"Role description"}'
```

#### Update Role
```bash
curl -X PATCH 'https://cmdms-backend-production.up.railway.app/api/roles/1' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"name":"Updated Role Name"}'
```

#### Delete Role
```bash
curl -X DELETE 'https://cmdms-backend-production.up.railway.app/api/roles/1' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### Permissions

#### List Permissions
```bash
curl 'https://cmdms-backend-production.up.railway.app/api/permissions' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

#### Get Permission
```bash
curl 'https://cmdms-backend-production.up.railway.app/api/permissions/1' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

#### Create Permission
```bash
curl -X POST 'https://cmdms-backend-production.up.railway.app/api/permissions' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"name":"read:users","description":"Can read users"}'
```

#### Update Permission
```bash
curl -X PATCH 'https://cmdms-backend-production.up.railway.app/api/permissions/1' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"description":"Updated description"}'
```

#### Delete Permission
```bash
curl -X DELETE 'https://cmdms-backend-production.up.railway.app/api/permissions/1' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

---

## Departments

### List Departments
```bash
curl 'https://cmdms-backend-production.up.railway.app/api/departments?search=health' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 15,
      "name": "Health Department",
      "code": "HEALTH"
    }
  ]
}
```

### Get Department
```bash
curl 'https://cmdms-backend-production.up.railway.app/api/departments/15' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### Create Department
```bash
curl -X POST 'https://cmdms-backend-production.up.railway.app/api/departments' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"name":"IT Department","code":"IT"}'
```

### Update Department
```bash
curl -X PATCH 'https://cmdms-backend-production.up.railway.app/api/departments/15' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"name":"Updated Department Name"}'
```

### Delete Department
```bash
curl -X DELETE 'https://cmdms-backend-production.up.railway.app/api/departments/15' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### Provinces

#### List Provinces
```bash
curl 'https://cmdms-backend-production.up.railway.app/api/departments/provinces/list' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

#### Get Province
```bash
curl 'https://cmdms-backend-production.up.railway.app/api/departments/provinces/1' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

#### Create Province
```bash
curl -X POST 'https://cmdms-backend-production.up.railway.app/api/departments/provinces' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"name":"Khyber Pakhtunkhwa","code":"KP"}'
```

#### Update Province
```bash
curl -X PATCH 'https://cmdms-backend-production.up.railway.app/api/departments/provinces/1' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"name":"Updated Province"}'
```

#### Delete Province
```bash
curl -X DELETE 'https://cmdms-backend-production.up.railway.app/api/departments/provinces/1' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### Districts

#### List Districts
```bash
curl 'https://cmdms-backend-production.up.railway.app/api/departments/districts/list' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

#### Get District
```bash
curl 'https://cmdms-backend-production.up.railway.app/api/departments/districts/1' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

#### Create District
```bash
curl -X POST 'https://cmdms-backend-production.up.railway.app/api/departments/districts' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"name":"Peshawar","provinceId":1}'
```

#### Update District
```bash
curl -X PATCH 'https://cmdms-backend-production.up.railway.app/api/departments/districts/1' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"name":"Updated District"}'
```

#### Delete District
```bash
curl -X DELETE 'https://cmdms-backend-production.up.railway.app/api/departments/districts/1' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### Department Types

#### List Department Types
```bash
curl 'https://cmdms-backend-production.up.railway.app/api/departments/types/list' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

#### Get Department Type
```bash
curl 'https://cmdms-backend-production.up.railway.app/api/departments/types/1' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

#### Create Department Type
```bash
curl -X POST 'https://cmdms-backend-production.up.railway.app/api/departments/types' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"name":"Provincial Department"}'
```

#### Update Department Type
```bash
curl -X PATCH 'https://cmdms-backend-production.up.railway.app/api/departments/types/1' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"name":"Updated Type"}'
```

#### Delete Department Type
```bash
curl -X DELETE 'https://cmdms-backend-production.up.railway.app/api/departments/types/1' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

---

## Meetings & Minutes

### Meetings

#### List Meetings
```bash
curl 'https://cmdms-backend-production.up.railway.app/api/meetings?page=1&limit=10' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 5,
      "title": "Cabinet Meeting Jan 2024",
      "date": "2024-01-15",
      "type": "cabinet",
      "venue": "CM Secretariat"
    }
  ],
  "meta": {"total": 50, "page": 1, "limit": 10}
}
```

#### Get Meeting
```bash
curl 'https://cmdms-backend-production.up.railway.app/api/meetings/5' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

#### Create Meeting
```bash
curl -X POST 'https://cmdms-backend-production.up.railway.app/api/meetings' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "title":"Cabinet Meeting Feb 2024",
    "date":"2024-02-15",
    "type":"cabinet",
    "venue":"CM Secretariat"
  }'
```

#### Update Meeting
```bash
curl -X PATCH 'https://cmdms-backend-production.up.railway.app/api/meetings/5' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"title":"Updated Meeting Title"}'
```

#### Delete Meeting
```bash
curl -X DELETE 'https://cmdms-backend-production.up.railway.app/api/meetings/5' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### Minutes

#### List Minutes by Meeting
```bash
curl 'https://cmdms-backend-production.up.railway.app/api/minutes/meeting/5' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "meetingId": 5,
      "heading": "Health Infrastructure",
      "issues": "Hospital construction status",
      "decisions": "Approve funding",
      "status": 2,
      "timeline": "2024-06-30",
      "departments": [{"id": 15, "name": "Health"}],
      "replyCount": 3
    }
  ]
}
```

#### Get Minute
```bash
curl 'https://cmdms-backend-production.up.railway.app/api/minutes/1' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

#### Create Minute
```bash
curl -X POST 'https://cmdms-backend-production.up.railway.app/api/minutes' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "meetingId":5,
    "heading":"Education Reforms",
    "issues":"Teacher shortage",
    "decisions":"Hire 1000 teachers",
    "responsibility":"Secretary Education",
    "timeline":"2024-08-31",
    "status":1,
    "departmentIds":[8,15]
  }'
```

#### Update Minute
```bash
curl -X PATCH 'https://cmdms-backend-production.up.railway.app/api/minutes/1' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"status":2,"progressHistory":"In progress"}'
```

#### Delete Minute
```bash
curl -X DELETE 'https://cmdms-backend-production.up.railway.app/api/minutes/1' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

#### Archive Minute
```bash
curl -X POST 'https://cmdms-backend-production.up.railway.app/api/minutes/1/archive' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

#### Get Minute Replies
```bash
curl 'https://cmdms-backend-production.up.railway.app/api/minutes/1/replies' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

#### Create Minute Reply
```bash
curl -X POST 'https://cmdms-backend-production.up.railway.app/api/minutes/1/replies' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "content":"Progress update: 50% complete",
    "status":2,
    "progress":50,
    "attachments":["report.pdf"]
  }'
```

---

## Directives

### List Directives
```bash
curl 'https://cmdms-backend-production.up.railway.app/api/directives?page=1&status=1&priority=high' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 10,
      "referenceNumber": "DIR-2024-001",
      "title": "Emergency Services Directive",
      "priority": "high",
      "deadline": "2024-12-31",
      "status": 1,
      "departments": [{"id": 15, "name": "Health"}]
    }
  ]
}
```

### Get Directive
```bash
curl 'https://cmdms-backend-production.up.railway.app/api/directives/10' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### Create Directive
```bash
curl -X POST 'https://cmdms-backend-production.up.railway.app/api/directives' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "title":"IT Infrastructure Upgrade",
    "description":"Modernize government IT systems",
    "referenceNumber":"DIR-2024-050",
    "priority":"medium",
    "deadline":"2024-12-31",
    "departmentIds":[20,25]
  }'
```

### Update Directive
```bash
curl -X PATCH 'https://cmdms-backend-production.up.railway.app/api/directives/10' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"status":2}'
```

### Delete Directive
```bash
curl -X DELETE 'https://cmdms-backend-production.up.railway.app/api/directives/10' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### Create Directive Response
```bash
curl -X POST 'https://cmdms-backend-production.up.railway.app/api/directives/10/responses' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"content":"Implementation started","status":2,"progress":30}'
```

---

## Announcements

### List Announcements
```bash
curl 'https://cmdms-backend-production.up.railway.app/api/announcements?page=1' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### Get Announcement
```bash
curl 'https://cmdms-backend-production.up.railway.app/api/announcements/5' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### Create Announcement
```bash
curl -X POST 'https://cmdms-backend-production.up.railway.app/api/announcements' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "title":"New Policy Announcement",
    "description":"Details of new policy",
    "date":"2024-01-20",
    "departmentIds":[10,15,20]
  }'
```

### Update Announcement
```bash
curl -X PATCH 'https://cmdms-backend-production.up.railway.app/api/announcements/5' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"title":"Updated Announcement"}'
```

### Delete Announcement
```bash
curl -X DELETE 'https://cmdms-backend-production.up.railway.app/api/announcements/5' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### Create Announcement Detail Response
```bash
curl -X POST 'https://cmdms-backend-production.up.railway.app/api/announcements/details/10/responses' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"content":"Response to announcement detail"}'
```

---

## CM Remarks

### List CM Remarks
```bash
curl 'https://cmdms-backend-production.up.railway.app/api/cm-remarks?page=1&priority=high' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### Get CM Remark
```bash
curl 'https://cmdms-backend-production.up.railway.app/api/cm-remarks/3' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### Create CM Remark
```bash
curl -X POST 'https://cmdms-backend-production.up.railway.app/api/cm-remarks' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "subject":"Infrastructure Development",
    "remark":"Accelerate road construction projects",
    "priority":"high",
    "deadline":"2024-06-30",
    "departmentIds":[5,10]
  }'
```

### Update CM Remark
```bash
curl -X PATCH 'https://cmdms-backend-production.up.railway.app/api/cm-remarks/3' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"status":2}'
```

### Delete CM Remark
```bash
curl -X DELETE 'https://cmdms-backend-production.up.railway.app/api/cm-remarks/3' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

---

## PTF

### List PTF Issues
```bash
curl 'https://cmdms-backend-production.up.railway.app/api/ptf/issues?page=1&districtId=5&status=pending' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 20,
      "title": "Water Supply Issue",
      "description": "Water scarcity in rural areas",
      "priority": "high",
      "districtId": 5,
      "district": {"name": "Peshawar"},
      "status": "pending",
      "deadline": "2024-03-31"
    }
  ]
}
```

### Get PTF Issue
```bash
curl 'https://cmdms-backend-production.up.railway.app/api/ptf/issues/20' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### Create PTF Issue
```bash
curl -X POST 'https://cmdms-backend-production.up.railway.app/api/ptf/issues' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "title":"Water Supply Issue",
    "description":"Water scarcity in rural areas",
    "priority":"high",
    "districtId":5,
    "deadline":"2024-03-31"
  }'
```

### List PTF Meetings
```bash
curl 'https://cmdms-backend-production.up.railway.app/api/ptf/meetings' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### Create PTF Meeting
```bash
curl -X POST 'https://cmdms-backend-production.up.railway.app/api/ptf/meetings' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "title":"PTF Meeting Jan 2024",
    "date":"2024-01-20",
    "venue":"DC Office"
  }'
```

### Get PTF Meeting
```bash
curl 'https://cmdms-backend-production.up.railway.app/api/ptf/meetings/5' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### Update PTF Meeting
```bash
curl -X PATCH 'https://cmdms-backend-production.up.railway.app/api/ptf/meetings/5' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"venue":"Commissioner Office"}'
```

### Delete PTF Meeting
```bash
curl -X DELETE 'https://cmdms-backend-production.up.railway.app/api/ptf/meetings/5' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### Additional PTF Issue Operations

#### Update PTF Issue
```bash
curl -X PATCH 'https://cmdms-backend-production.up.railway.app/api/ptf/issues/20' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"priority":"medium"}'
```

#### Delete PTF Issue
```bash
curl -X DELETE 'https://cmdms-backend-production.up.railway.app/api/ptf/issues/20' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

#### Update PTF Issue Status
```bash
curl -X PATCH 'https://cmdms-backend-production.up.railway.app/api/ptf/issues/20/status' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "status": "resolved",
    "remarks": "Issue resolved after inspection"
  }'
```

#### Assign PTF Issue
```bash
curl -X POST 'https://cmdms-backend-production.up.railway.app/api/ptf/issues/20/assign' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "primaryDepartmentId": 15,
    "supportingDepartments": [10, 12]
  }'
```

#### Get PTF Issue Responses
```bash
curl 'https://cmdms-backend-production.up.railway.app/api/ptf/issues/20/responses' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

#### Add PTF Issue Response
```bash
curl -X POST 'https://cmdms-backend-production.up.railway.app/api/ptf/issues/20/responses' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "response": "Team dispatched to location",
    "departmentId": 15
  }'
```

---

## Boards

### List Boards
```bash
curl 'https://cmdms-backend-production.up.railway.app/api/boards?page=1' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### Get Board
```bash
curl 'https://cmdms-backend-production.up.railway.app/api/boards/2' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### Create Board
```bash
curl -X POST 'https://cmdms-backend-production.up.railway.app/api/boards' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"name":"Development Board","description":"Oversees development projects"}'
```

### Update Board
```bash
curl -X PATCH 'https://cmdms-backend-production.up.railway.app/api/boards/2' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"name":"Updated Board Name"}'
```

### Delete Board
```bash
curl -X DELETE 'https://cmdms-backend-production.up.railway.app/api/boards/2' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### Board Members

#### List Board Members
```bash
curl 'https://cmdms-backend-production.up.railway.app/api/boards/2/members' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

#### Get Board Member
```bash
curl 'https://cmdms-backend-production.up.railway.app/api/boards/2/members/5' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

#### Add Board Member
```bash
curl -X POST 'https://cmdms-backend-production.up.railway.app/api/boards/2/members' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "userId": 10,
    "role": "Member",
    "designation": "Director"
  }'
```

#### Update Board Member
```bash
curl -X PATCH 'https://cmdms-backend-production.up.railway.app/api/boards/2/members/5' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"role": "Secretary"}'
```

#### Remove Board Member
```bash
curl -X DELETE 'https://cmdms-backend-production.up.railway.app/api/boards/2/members/5' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### Board Meetings

#### Create Board Meeting
```bash
curl -X POST 'https://cmdms-backend-production.up.railway.app/api/boards/2/meetings' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "title": "Board Meeting Jan 2024",
    "date": "2024-01-25",
    "venue": "Conference Room"
  }'
```

#### List Board Meetings
```bash
curl 'https://cmdms-backend-production.up.railway.app/api/boards/2/meetings' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

#### Get Board Meeting
```bash
curl 'https://cmdms-backend-production.up.railway.app/api/boards/2/meetings/10' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

#### Update Board Meeting
```bash
curl -X PATCH 'https://cmdms-backend-production.up.railway.app/api/boards/2/meetings/10' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"time": "10:00 AM"}'
```

#### Delete Board Meeting
```bash
curl -X DELETE 'https://cmdms-backend-production.up.railway.app/api/boards/2/meetings/10' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### Board Acts

#### List Board Acts
```bash
curl 'https://cmdms-backend-production.up.railway.app/api/boards/2/acts' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

#### Get Board Act
```bash
curl 'https://cmdms-backend-production.up.railway.app/api/boards/2/acts/3' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

#### Create Board Act
```bash
curl -X POST 'https://cmdms-backend-production.up.railway.app/api/boards/2/acts' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "title": "Act 2024-01",
    "description": "Establishment of new wing",
    "date": "2024-01-15"
  }'
```

#### Update Board Act
```bash
curl -X PATCH 'https://cmdms-backend-production.up.railway.app/api/boards/2/acts/3' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"status": "Approved"}'
```

#### Delete Board Act
```bash
curl -X DELETE 'https://cmdms-backend-production.up.railway.app/api/boards/2/acts/3' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### Board Agenda Points

#### List Agenda Points
```bash
curl 'https://cmdms-backend-production.up.railway.app/api/boards/2/meetings/10/agenda-points' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

#### Get Agenda Point
```bash
curl 'https://cmdms-backend-production.up.railway.app/api/boards/2/meetings/10/agenda-points/15' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

#### Create Agenda Point
```bash
curl -X POST 'https://cmdms-backend-production.up.railway.app/api/boards/2/meetings/10/agenda-points' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "title": "Budget Approval",
    "description": "Approval of annual budget",
    "presenter": "Finance Director"
  }'
```

#### Update Agenda Point
```bash
curl -X PATCH 'https://cmdms-backend-production.up.railway.app/api/boards/2/meetings/10/agenda-points/15' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"status": "Discussed"}'
```

#### Delete Agenda Point
```bash
curl -X DELETE 'https://cmdms-backend-production.up.railway.app/api/boards/2/meetings/10/agenda-points/15' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

#### List Agenda Replies
```bash
curl 'https://cmdms-backend-production.up.railway.app/api/boards/2/meetings/10/agenda-points/15/replies' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

#### Add Agenda Reply
```bash
curl -X POST 'https://cmdms-backend-production.up.railway.app/api/boards/2/meetings/10/agenda-points/15/replies' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "comment": "Clarification on budget item",
    "userId": 5
  }'
```  -H 'Content-Type: application/json' \
  -d '{"name":"Updated Board Name"}'
```

### Delete Board
```bash
curl -X DELETE 'https://cmdms-backend-production.up.railway.app/api/boards/2' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### Board Members

#### List Board Members
```bash
curl 'https://cmdms-backend-production.up.railway.app/api/boards/2/members' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

#### Get Board Member
```bash
curl 'https://cmdms-backend-production.up.railway.app/api/boards/2/members/5' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

#### Add Board Member
```bash
curl -X POST 'https://cmdms-backend-production.up.railway.app/api/boards/2/members' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "userId": 10,
    "role": "Member",
    "designation": "Secretary Finance",
    "tenureStart": "2024-01-01",
    "status": "active"
  }'
```

#### Update Board Member
```bash
curl -X PATCH 'https://cmdms-backend-production.up.railway.app/api/boards/2/members/5' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"role":"Chairperson"}'
```

#### Remove Board Member
```bash
curl -X DELETE 'https://cmdms-backend-production.up.railway.app/api/boards/2/members/5' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### Board Meetings

#### Get Meeting
```bash
curl 'https://cmdms-backend-production.up.railway.app/api/boards/2/meetings/10' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

#### List Meetings
```bash
curl 'https://cmdms-backend-production.up.railway.app/api/boards/2/meetings' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

#### Create Meeting
```bash
curl -X POST 'https://cmdms-backend-production.up.railway.app/api/boards/2/meetings' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "sequenceNumber": "BM-001",
    "date": "2024-02-01",
    "venue": "Committee Room",
    "agendaItems": [
      {
        "description": "Review Budget",
        "timeline": "2024-03-01"
      }
    ]
  }'
```

#### Update Meeting
```bash
curl -X PATCH 'https://cmdms-backend-production.up.railway.app/api/boards/2/meetings/10' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"venue":"Video Conference"}'
```

#### Delete Meeting
```bash
curl -X DELETE 'https://cmdms-backend-production.up.railway.app/api/boards/2/meetings/10' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### Board Acts

#### List Acts
```bash
curl 'https://cmdms-backend-production.up.railway.app/api/boards/2/acts' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

#### Create Act
```bash
curl -X POST 'https://cmdms-backend-production.up.railway.app/api/boards/2/acts' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "Establishment Act 2024",
    "actNumber": "ACT-2024-01",
    "date": "2024-01-15",
    "implementationStatus": "pending"
  }'
```

#### Update Act
```bash
curl -X PATCH 'https://cmdms-backend-production.up.railway.app/api/boards/2/acts/5' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"implementationStatus":"implemented"}'
```

#### Delete Act
```bash
curl -X DELETE 'https://cmdms-backend-production.up.railway.app/api/boards/2/acts/5' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

## PTF - Additional Endpoints

### Update PTF Issue
```bash
curl -X PATCH 'https://cmdms-backend-production.up.railway.app/api/ptf/issues/20' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"title":"Updated Title"}'
```

### Delete PTF Issue
```bash
curl -X DELETE 'https://cmdms-backend-production.up.railway.app/api/ptf/issues/20' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### Update PTF Status
```bash
curl -X PATCH 'https://cmdms-backend-production.up.railway.app/api/ptf/issues/20/status' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"status":"resolved", "remarks": "Issue resolved by department"}'
```

### Assign PTF Issue
```bash
curl -X POST 'https://cmdms-backend-production.up.railway.app/api/ptf/issues/20/assign' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"primaryDepartmentId": 10, "supportingDepartments": [12, 14]}'
```

### PTF Responses

#### Get Responses
```bash
curl 'https://cmdms-backend-production.up.railway.app/api/ptf/issues/20/responses' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

#### Add Response
```bash
curl -X POST 'https://cmdms-backend-production.up.railway.app/api/ptf/issues/20/responses' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"response": "Department has initiated action.", "departmentId": 10}'
```

### PTF Meetings - Additional

#### Get Meeting
```bash
curl 'https://cmdms-backend-production.up.railway.app/api/ptf/meetings/5' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

#### Update Meeting
```bash
curl -X PATCH 'https://cmdms-backend-production.up.railway.app/api/ptf/meetings/5' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"venue":"Updated Venue"}'
```

#### Delete Meeting
```bash
curl -X DELETE 'https://cmdms-backend-production.up.railway.app/api/ptf/meetings/5' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### Delete Board
```bash
curl -X DELETE 'https://cmdms-backend-production.up.railway.app/api/boards/2' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### Add Board Members
```bash
curl -X POST 'https://cmdms-backend-production.up.railway.app/api/boards/2/members' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"userIds":[5,10,15]}'
```

### Create Board Meeting
```bash
curl -X POST 'https://cmdms-backend-production.up.railway.app/api/boards/2/meetings' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "title":"Board Meeting Jan 2024",
    "date":"2024-01-20",
    "venue":"Board Room"
  }'
```

### List Board Meetings
```bash
curl 'https://cmdms-backend-production.up.railway.app/api/boards/2/meetings' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

---

## Sectoral Meetings

### List Sectoral Meetings
```bash
curl 'https://cmdms-backend-production.up.railway.app/api/sectorial-meetings?page=1' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### Get Sectoral Meeting
```bash
curl 'https://cmdms-backend-production.up.railway.app/api/sectorial-meetings/15' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### Create Sectoral Meeting
```bash
curl -X POST 'https://cmdms-backend-production.up.railway.app/api/sectorial-meetings' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "title":"Education Sector Meeting",
    "date":"2024-01-20",
    "sector":"Education"
  }'
```

### Update Sectoral Meeting
```bash
curl -X PATCH 'https://cmdms-backend-production.up.railway.app/api/sectorial-meetings/15' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"title":"Updated Meeting Title"}'
```

### Delete Sectoral Meeting
```bash
curl -X DELETE 'https://cmdms-backend-production.up.railway.app/api/sectorial-meetings/15' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### Get Sectoral Agenda Points
```bash
curl 'https://cmdms-backend-production.up.railway.app/api/sectorial-meetings/15/agenda-points' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### Create Sectoral Agenda Point
```bash
curl -X POST 'https://cmdms-backend-production.up.railway.app/api/sectorial-meetings/15/agenda-points' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "description": "Discuss new health policy",
    "timeline": "2024-12-31",
    "status": 1,
    "departmentIds": [1, 5]
  }'
```

### Get Sectoral Agenda Point
```bash
curl 'https://cmdms-backend-production.up.railway.app/api/sectorial-meetings/15/agenda-points/5' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### Update Sectoral Agenda Point
```bash
curl -X PATCH 'https://cmdms-backend-production.up.railway.app/api/sectorial-meetings/15/agenda-points/5' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "decision": "Approved",
    "status": 2
  }'
```

### Delete Sectoral Agenda Point
```bash
curl -X DELETE 'https://cmdms-backend-production.up.railway.app/api/sectorial-meetings/15/agenda-points/5' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### Get Agenda Point Replies
```bash
curl 'https://cmdms-backend-production.up.railway.app/api/sectorial-meetings/15/agenda-points/5/replies' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### Add Agenda Point Reply
```bash
curl -X POST 'https://cmdms-backend-production.up.railway.app/api/sectorial-meetings/15/agenda-points/5/replies' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "content": "Department response to the agenda point",
    "status": 1
  }'
```

---

## Senate Meetings

### List Senate Meetings
```bash
curl 'https://cmdms-backend-production.up.railway.app/api/senate-meetings?page=1' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### Get Senate Meeting
```bash
curl 'https://cmdms-backend-production.up.railway.app/api/senate-meetings/5' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### Create Senate Meeting
```bash
curl -X POST 'https://cmdms-backend-production.up.railway.app/api/senate-meetings' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "title":"Senate Session Jan 2024",
    "date":"2024-01-20"
  }'
```

### Update Senate Meeting
```bash
curl -X PATCH 'https://cmdms-backend-production.up.railway.app/api/senate-meetings/5' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"title":"Updated Title"}'
```

### Delete Senate Meeting
```bash
curl -X DELETE 'https://cmdms-backend-production.up.railway.app/api/senate-meetings/5' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

---

## Schemes

### List Schemes
```bash
curl 'https://cmdms-backend-production.up.railway.app/api/schemes?page=1&year=2024&status=approved' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 50,
      "name": "Rural Development Scheme 2024",
      "code": "RDS-2024-001",
      "sector": "Infrastructure",
      "estimatedCost": 50000000,
      "status": "approved",
      "departmentId": 10
    }
  ]
}
```

### Get Scheme
```bash
curl 'https://cmdms-backend-production.up.railway.app/api/schemes/50' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### Create Scheme
```bash
curl -X POST 'https://cmdms-backend-production.up.railway.app/api/schemes' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "name":"Rural Development Scheme 2024",
    "code":"RDS-2024-001",
    "sector":"Infrastructure",
    "estimatedCost":50000000,
    "departmentId":10
  }'
```

### Update Scheme
```bash
curl -X PATCH 'https://cmdms-backend-production.up.railway.app/api/schemes/50' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"status":"approved"}'
```

### Delete Scheme
```bash
curl -X DELETE 'https://cmdms-backend-production.up.railway.app/api/schemes/50' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### Add Scheme Costing
```bash
curl -X POST 'https://cmdms-backend-production.up.railway.app/api/schemes/50/costing' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"costBreakdown":{"labor":20000000,"materials":25000000,"overhead":5000000}}'
```

### Add Scheme Budget
```bash
curl -X POST 'https://cmdms-backend-production.up.railway.app/api/schemes/50/budget' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"allocatedAmount":50000000,"financialYear":"2024"}'
```

### Add Scheme Expenditure
```bash
curl -X POST 'https://cmdms-backend-production.up.railway.app/api/schemes/50/expenditure' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"amount":10000000,"description":"Q1 expenses","date":"2024-03-31"}'
```

### Add Scheme Revision
```bash
curl -X POST 'https://cmdms-backend-production.up.railway.app/api/schemes/50/revision' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"revisedCost":55000000,"reason":"Price escalation"}'
```

---

## Inaugurations

### List Inaugurations
```bash
curl 'https://cmdms-backend-production.up.railway.app/api/inaugurations?page=1&year=2024' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### Get Inauguration
```bash
curl 'https://cmdms-backend-production.up.railway.app/api/inaugurations/25' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### Create Inauguration
```bash
curl -X POST 'https://cmdms-backend-production.up.railway.app/api/inaugurations' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "title":"Hospital Inauguration",
    "description":"Opening of new district hospital",
    "date":"2024-02-15",
    "type":"inauguration",
    "departmentId":15,
    "districtId":5,
    "projectCost":100000000
  }'
```

### Update Inauguration
```bash
curl -X PATCH 'https://cmdms-backend-production.up.railway.app/api/inaugurations/25' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"title":"Updated Inauguration Title"}'
```

### Delete Inauguration
```bash
curl -X DELETE 'https://cmdms-backend-production.up.railway.app/api/inaugurations/25' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

---

## Candidates

### List Candidates
```bash
curl 'https://cmdms-backend-production.up.railway.app/api/candidates?page=1' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### Get Candidate
```bash
curl 'https://cmdms-backend-production.up.railway.app/api/candidates/10' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### Create Candidate
```bash
curl -X POST 'https://cmdms-backend-production.up.railway.app/api/candidates' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "name":"John Candidate",
    "party":"PTI",
    "constituencyId":5
  }'
```

### Update Candidate
```bash
curl -X PATCH 'https://cmdms-backend-production.up.railway.app/api/candidates/10' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"name":"Updated Name"}'
```

### Delete Candidate
```bash
curl -X DELETE 'https://cmdms-backend-production.up.railway.app/api/candidates/10' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### List Constituencies
```bash
curl 'https://cmdms-backend-production.up.railway.app/api/candidates/constituencies' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

---

## KPI

### List KPIs
```bash
curl 'https://cmdms-backend-production.up.railway.app/api/kpi?page=1' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### Get KPI
```bash
curl 'https://cmdms-backend-production.up.railway.app/api/kpi/5' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### Create KPI
```bash
curl -X POST 'https://cmdms-backend-production.up.railway.app/api/kpi' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "name":"Hospital Bed Occupancy Rate",
    "departmentId":15,
    "target":85,
    "unit":"percentage"
  }'
```

### Update KPI
```bash
curl -X PATCH 'https://cmdms-backend-production.up.railway.app/api/kpi/5' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"target":90}'
```

### Delete KPI
```bash
curl -X DELETE 'https://cmdms-backend-production.up.railway.app/api/kpi/5' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### Add KPI Data
```bash
curl -X POST 'https://cmdms-backend-production.up.railway.app/api/kpi/5/data' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"value":87,"date":"2024-01-31","notes":"Monthly average"}'
```

### Get KPI Data
```bash
curl 'https://cmdms-backend-production.up.railway.app/api/kpi/5/data?fromDate=2024-01-01&toDate=2024-12-31' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

---

## Tasks

### List Tasks
```bash
curl 'https://cmdms-backend-production.up.railway.app/api/tasks?page=1&status=pending' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### Get Task
```bash
curl 'https://cmdms-backend-production.up.railway.app/api/tasks/10' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### Create Task
```bash
curl -X POST 'https://cmdms-backend-production.up.railway.app/api/tasks' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "title":"Prepare quarterly report",
    "description":"Comprehensive department performance report",
    "departmentId":15,
    "deadline":"2024-03-31",
    "priority":"high"
  }'
```

### Update Task Status
```bash
curl -X PATCH 'https://cmdms-backend-production.up.railway.app/api/tasks/10/status' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"status":"in-progress"}'
```

### Add Task Comment
```bash
curl -X POST 'https://cmdms-backend-production.up.railway.app/api/tasks/10/comments' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"content":"Started working on the report"}'
```

---

## Welfare

### List Welfare Cases
```bash
curl 'https://cmdms-backend-production.up.railway.app/api/welfare?page=1' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### Get Welfare Case
```bash
curl 'https://cmdms-backend-production.up.railway.app/api/welfare/5' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### Create Welfare Case
```bash
curl -X POST 'https://cmdms-backend-production.up.railway.app/api/welfare' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "applicantName":"Muhammad Khan",
    "cnic":"12345-6789012-3",
    "caseType":"medical",
    "description":"Medical assistance needed",
    "districtId":5
  }'
```

### Update Welfare Case
```bash
curl -X PATCH 'https://cmdms-backend-production.up.railway.app/api/welfare/5' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"status":"approved"}'
```

### Delete Welfare Case
```bash
curl -X DELETE 'https://cmdms-backend-production.up.railway.app/api/welfare/5' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

---

## Issues & Complaints

### Issues

#### List Issues
```bash
curl 'https://cmdms-backend-production.up.railway.app/api/issues?page=1&status=open' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

#### Get Issue
```bash
curl 'https://cmdms-backend-production.up.railway.app/api/issues/15' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

#### Create Issue
```bash
curl -X POST 'https://cmdms-backend-production.up.railway.app/api/issues' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "title":"Road Repair Issue",
    "description":"Main road needs urgent repair",
    "priority":"high",
    "districtId":5
  }'
```

#### Update Issue Status
```bash
curl -X PATCH 'https://cmdms-backend-production.up.railway.app/api/issues/15/status' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"status":"in-progress"}'
```

#### Assign Issue
```bash
curl -X POST 'https://cmdms-backend-production.up.railway.app/api/issues/15/assign' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"userId":10,"departmentId":5}'
```

### Complaints

#### List Complaints
```bash
curl 'https://cmdms-backend-production.up.railway.app/api/complaints?page=1&status=pending' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

#### Get Complaint
```bash
curl 'https://cmdms-backend-production.up.railway.app/api/complaints/20' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

#### Create Complaint
```bash
curl -X POST 'https://cmdms-backend-production.up.railway.app/api/complaints' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "subject":"Service delay complaint",
    "description":"Application processing taking too long",
    "complainantName":"Ahmed Ali",
    "contactNumber":"0300-1234567",
    "departmentId":10
  }'
```

#### Update Complaint Status
```bash
curl -X PATCH 'https://cmdms-backend-production.up.railway.app/api/complaints/20/status' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"status":"resolved"}'
```

#### Add Complaint Response
```bash
curl -X POST 'https://cmdms-backend-production.up.railway.app/api/complaints/20/responses' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"content":"Issue has been investigated and resolved"}'
```

#### Add Complaint Feedback
```bash
curl -X POST 'https://cmdms-backend-production.up.railway.app/api/complaints/20/feedback' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"rating":5,"comment":"Satisfied with the resolution"}'
```

---

## Khushhal KPK

### List Khushhal KPK Tasks
```bash
curl 'https://cmdms-backend-production.up.railway.app/api/khushhal-kpk/tasks?page=1' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### Get Khushhal KPK Task
```bash
curl 'https://cmdms-backend-production.up.railway.app/api/khushhal-kpk/tasks/5' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### Create Khushhal KPK Task
```bash
curl -X POST 'https://cmdms-backend-production.up.railway.app/api/khushhal-kpk/tasks' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "title": "Community Development Project",
    "description": "Build community center",
    "subjectTasks": "<p>Detailed description</p>",
    "progressSoFar": "<p>Initial planning</p>",
    "expectedOutcomes": "<p>Better community engagement</p>",
    "timelineNote": "<p>Phase 1 by Q1</p>",
    "timelineDate": "2024-12-31",
    "actionByNote": "<p>DC approval required</p>",
    "status": 1,
    "priority": "high",
    "departmentIds": [1, 5]
  }'
```

### Update Khushhal KPK Task
```bash
curl -X PATCH 'https://cmdms-backend-production.up.railway.app/api/khushhal-kpk/tasks/5' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "progressSoFar": "<p>Phase 1 completed</p>",
    "status": 2
  }'
```

### Delete Khushhal KPK Task
```bash
curl -X DELETE 'https://cmdms-backend-production.up.railway.app/api/khushhal-kpk/tasks/5' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### Add Task Progress
```bash
curl -X POST 'https://cmdms-backend-production.up.railway.app/api/khushhal-kpk/tasks/5/progress' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "description": "<p>Weekly update</p>",
    "type": "weekly",
    "metrics": 45,
    "status": 2,
    "departmentId": 1
  }'
```

### Get Task Replies
```bash
curl 'https://cmdms-backend-production.up.railway.app/api/khushhal-kpk/tasks/5/replies' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### Add Task Reply
```bash
curl -X POST 'https://cmdms-backend-production.up.railway.app/api/khushhal-kpk/tasks/5/replies' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "reply": "Department response to the query",
    "departmentId": 1,
    "attachments": []
  }'
```

### Update Department Status
```bash
curl -X PATCH 'https://cmdms-backend-production.up.railway.app/api/khushhal-kpk/tasks/5/departments/1/status' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"status": 2}'
```

---

## Public Days

### List Public Days
```bash
curl 'https://cmdms-backend-production.up.railway.app/api/public-days?page=1' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### Get Public Day Stats
```bash
curl 'https://cmdms-backend-production.up.railway.app/api/public-days/stats' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### Get Public Day
```bash
curl 'https://cmdms-backend-production.up.railway.app/api/public-days/5' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### Create Public Day
```bash
curl -X POST 'https://cmdms-backend-production.up.railway.app/api/public-days' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "date":"2024-01-20",
    "venue":"DC Office",
    "districtId":5
  }'
```

### Update Public Day
```bash
curl -X PATCH 'https://cmdms-backend-production.up.railway.app/api/public-days/5' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"status":"completed"}'
```

### Delete Public Day
```bash
curl -X DELETE 'https://cmdms-backend-production.up.railway.app/api/public-days/5' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

---

## Letters

### List Letters
```bash
curl 'https://cmdms-backend-production.up.railway.app/api/letters?page=1' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### Get Letter
```bash
curl 'https://cmdms-backend-production.up.railway.app/api/letters/10' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### Create Letter
```bash
curl -X POST 'https://cmdms-backend-production.up.railway.app/api/letters' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "subject":"Official Communication",
    "content":"Letter content here",
    "recipientName":"Secretary Finance",
    "recipientDepartmentId":10
  }'
```

### Update Letter
```bash
curl -X PATCH 'https://cmdms-backend-production.up.railway.app/api/letters/10' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"subject":"Updated Subject"}'
```

### Delete Letter
```bash
curl -X DELETE 'https://cmdms-backend-production.up.railway.app/api/letters/10' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### Generate Letter PDF
```bash
curl 'https://cmdms-backend-production.up.railway.app/api/letters/10/generate-pdf' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -o letter.pdf
```

### Send Letter
```bash
curl -X POST 'https://cmdms-backend-production.up.railway.app/api/letters/10/send' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"email":"recipient@cmdms.gov.pk"}'
```

---

## Reports

### Cabinet Meetings Report
```bash
curl 'https://cmdms-backend-production.up.railway.app/api/reports/cabinet-meetings' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### Cabinet Meetings By Status
```bash
curl 'https://cmdms-backend-production.up.railway.app/api/reports/cabinet-meetings/by-status?status=1' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### Board Meetings Report
```bash
curl 'https://cmdms-backend-production.up.railway.app/api/reports/board-meetings' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### Board Acts Report
```bash
curl 'https://cmdms-backend-production.up.railway.app/api/reports/board-acts' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### Record Notes Detail Reports
```bash
curl 'https://cmdms-backend-production.up.railway.app/api/reports/record-notes/detail-list/1/1' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### Summaries for CM Report
```bash
curl 'https://cmdms-backend-production.up.railway.app/api/reports/summaries/cm/summary' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### PTF Dashboard Report
```bash
curl 'https://cmdms-backend-production.up.railway.app/api/reports/ptf/dashboard' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### PTIs Summary Report
```bash
curl 'https://cmdms-backend-production.up.railway.app/api/reports/ptis/summary' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### Inaugurations Report
```bash
curl 'https://cmdms-backend-production.up.railway.app/api/reports/inaugurations' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### Review Meetings Report
```bash
curl 'https://cmdms-backend-production.up.railway.app/api/reports/review-meetings?start_date=2024-01-01&end_date=2024-12-31' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### Dashboard Report
```bash
curl 'https://cmdms-backend-production.up.railway.app/api/reports/dashboard' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalMeetings": 150,
    "totalMinutes": 450,
    "pendingTasks": 75,
    "completedTasks": 200,
    "overdueItems": 15
  }
}
```

### Meetings Summary Report
```bash
curl 'https://cmdms-backend-production.up.railway.app/api/reports/meetings/summary?fromDate=2024-01-01&toDate=2024-12-31' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### Minutes Status Summary Report
```bash
curl 'https://cmdms-backend-production.up.railway.app/api/reports/minutes/status-summary?departmentId=15' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 250,
    "pending": 60,
    "inProgress": 120,
    "completed": 70,
    "overdue": 10
  }
}
```

### Tasks Overview Report
```bash
curl 'https://cmdms-backend-production.up.railway.app/api/reports/tasks/overview' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### Department Performance Report
```bash
curl 'https://cmdms-backend-production.up.railway.app/api/reports/departments/performance?fromDate=2024-01-01&toDate=2024-12-31' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "departmentId": 15,
      "departmentName": "Health Department",
      "totalTasks": 250,
      "completed": 180,
      "pending": 60,
      "overdue": 10,
      "completionRate": 72
    }
  ]
}
```

### Compliance - Directives Report
```bash
curl 'https://cmdms-backend-production.up.railway.app/api/reports/compliance/directives' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### Compliance - Timelines Report
```bash
curl 'https://cmdms-backend-production.up.railway.app/api/reports/compliance/timelines' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### Complaints Statistics Report
```bash
curl 'https://cmdms-backend-production.up.railway.app/api/reports/complaints/stats?fromDate=2024-01-01&toDate=2024-12-31' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### KPI Summary Report
```bash
curl 'https://cmdms-backend-production.up.railway.app/api/reports/kpi/summary?departmentId=15' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### Analytics Trends Report
```bash
curl 'https://cmdms-backend-production.up.railway.app/api/reports/analytics/trends?metric=task_completion&interval=monthly' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### Schemes Financial Summary Report
```bash
curl 'https://cmdms-backend-production.up.railway.app/api/reports/schemes/financial-summary?year=2024' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### Schemes Progress Report
```bash
curl 'https://cmdms-backend-production.up.railway.app/api/reports/schemes/progress?departmentId=10' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### PTF Issues Summary Report
```bash
curl 'https://cmdms-backend-production.up.railway.app/api/reports/ptf/issues-summary?districtId=5&year=2024' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### Export Meetings Report
```bash
curl 'https://cmdms-backend-production.up.railway.app/api/reports/export/meetings?format=csv&fromDate=2024-01-01&toDate=2024-12-31' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -o meetings_report.csv
```

### Export Minutes Report
```bash
curl 'https://cmdms-backend-production.up.railway.app/api/reports/export/minutes?format=xlsx&meetingId=5' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -o minutes_report.xlsx
```

---

## Files

### Upload File
```bash
curl -X POST 'https://cmdms-backend-production.up.railway.app/api/files/upload' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -F 'file=@/path/to/document.pdf' \
  -F 'attachableType=minute' \
  -F 'attachableId=123'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 500,
    "originalName": "document.pdf",
    "fileName": "uuid-document.pdf",
    "filePath": "uploads/2024/01/uuid-document.pdf",
    "mimeType": "application/pdf",
    "size": 1048576,
    "url": "https://cdn.cmdms.gov.pk/uploads/2024/01/uuid-document.pdf"
  }
}
```

### Get File
```bash
curl 'https://cmdms-backend-production.up.railway.app/api/files/500' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### Delete File
```bash
curl -X DELETE 'https://cmdms-backend-production.up.railway.app/api/files/500' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

---

## Notifications

### List Notifications
```bash
curl 'https://cmdms-backend-production.up.railway.app/api/notifications?page=1' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 100,
      "title": "New Minute Assigned",
      "message": "You have been assigned a new minute",
      "type": "minute",
      "isRead": false,
      "actionUrl": "/minutes/256",
      "createdAt": "2024-01-15T10:00:00.000Z"
    }
  ],
  "meta": {"total": 50, "unreadCount": 25}
}
```

### Mark Notification as Read
```bash
curl -X PATCH 'https://cmdms-backend-production.up.railway.app/api/notifications/100/read' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### Get Unread Count
```bash
curl 'https://cmdms-backend-production.up.railway.app/api/notifications/unread/count' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### Mark All as Read
```bash
curl -X PATCH 'https://cmdms-backend-production.up.railway.app/api/notifications/read-all' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### Test Notification
```bash
curl -X POST 'https://cmdms-backend-production.up.railway.app/api/notifications/test' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"userId":10,"title":"Test Notification","message":"This is a test"}'
```

### Register Notification Token
```bash
curl -X POST 'https://cmdms-backend-production.up.railway.app/api/notifications/token' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"token":"fcm_device_token","platform":"android"}'
```

---

## Tags

### Create Tag
```bash
curl -X POST 'https://cmdms-backend-production.up.railway.app/api/tags' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"name":"urgent","color":"#FF0000"}'
```

### List Tags
```bash
curl 'https://cmdms-backend-production.up.railway.app/api/tags' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### Attach Tag to Entity
```bash
curl -X POST 'https://cmdms-backend-production.up.railway.app/api/tags/attach' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"tagId":5,"entityType":"minute","entityId":123}'
```

### Detach Tag from Entity
```bash
curl -X POST 'https://cmdms-backend-production.up.railway.app/api/tags/detach' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"tagId":5,"entityType":"minute","entityId":123}'
```

### Get Tags for Entity
```bash
curl 'https://cmdms-backend-production.up.railway.app/api/tags/entity/minute/123' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

---

## Migration

### Import Legacy Data
```bash
curl -X POST 'https://cmdms-backend-production.up.railway.app/api/migration/legacy' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"source":"legacy_system","dataType":"meetings","data":[...]}'
```

---

---

## Activity Logs (Pending Implementation)

**Note:** This module tracks system-wide user activities.

### List Activity Logs
```bash
curl 'https://cmdms-backend-production.up.railway.app/api/activity-logs?page=1&limit=20' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

---

## Common APIs (Pending Implementation)

**Note:** These endpoints provide shared resources like dropdowns, global search, and generic exports.

### Dropdowns

#### Departments Dropdown
```bash
curl 'https://cmdms-backend-production.up.railway.app/api/common/departments/dropdown' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

#### Users Dropdown
```bash
curl 'https://cmdms-backend-production.up.railway.app/api/common/users/dropdown' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

#### Roles Dropdown
```bash
curl 'https://cmdms-backend-production.up.railway.app/api/common/roles/dropdown' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

#### Department Types Dropdown
```bash
curl 'https://cmdms-backend-production.up.railway.app/api/common/departments/types/dropdown' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### Global Search

#### Search All Modules
```bash
curl 'https://cmdms-backend-production.up.railway.app/api/search?q=query_string' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### Excel Export

#### Generic Export
```bash
curl 'https://cmdms-backend-production.up.railway.app/api/export/excel?type=meetings' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

---

## Common Response Format

All API responses follow this structure:

**Success Response:**
```json
{
  "success": true,
  "data": { /* response data */ },
  "message": "Operation successful",
  "meta": { /* pagination/metadata */ }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {"field": "email", "message": "Email is required"}
    ]
  }
}
```

## HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `500` - Server Error

## Pagination

List endpoints support pagination:
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)

Response includes `meta`:
```json
{
  "meta": {
    "total": 150,
    "page": 1,
    "limit": 10,
    "totalPages": 15
  }
}
```

## Filtering & Sorting

Common query parameters:
- `search` - Text search
- `status` - Filter by status
- `departmentId` - Filter by department
- `fromDate` / `toDate` - Date range
- `sortBy` - Sort field
- `sortOrder` - `asc` or `desc`

---

## Summaries for CM

### List Summaries
```bash
curl 'https://cmdms-backend-production.up.railway.app/api/summaries?page=1&limit=10' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "referenceNumber": "SUM-2024-001",
      "subject": "Health Infrastructure Development",
      "description": "Summary description here",
      "date": "2024-01-15",
      "initiatorDepartmentId": 15,
      "initiatorDepartment": {
        "id": 15,
        "name": "Health Department"
      },
      "status": 1,
      "priority": "high",
      "createdAt": "2024-01-15T10:00:00.000Z"
    }
  ],
  "meta": {
    "total": 150,
    "page": 1,
    "limit": 10,
    "totalPages": 15
  }
}
```

### Get Summary Details
```bash
curl 'https://cmdms-backend-production.up.railway.app/api/summaries/1' \
  -H 'Author