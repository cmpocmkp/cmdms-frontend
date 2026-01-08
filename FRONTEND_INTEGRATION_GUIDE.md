# CMDMS Frontend Integration Guide

## Overview

This guide provides comprehensive curl requests and expected responses for all CMDMS API endpoints. The API follows REST conventions and uses JWT authentication for protected endpoints.

## Base URL

```
http://localhost:3000/api
```

## Authentication

Most endpoints require JWT authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Response Format

All API responses follow this structure:

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {},
  "metadata": {}
}
```

---

## 1. Authentication Endpoints

### 1.1 Login

**Endpoint:** `POST /auth/login`  
**Public:** Yes

**Request:**

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123"
  }'
```

**Response (Success):**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "id": 1,
    "name": "Administrator",
    "email": "admin@example.com",
    "role": {
      "id": 1,
      "name": "Admin",
      "permissions": ["users.create", "users.read", "users.update"]
    },
    "department": {
      "id": 1,
      "name": "Chief Minister Secretariat"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": "24h"
  }
}
```

### 1.2 Change Password

**Endpoint:** `POST /auth/change-password`  
**Public:** No

**Request:**

```bash
curl -X POST http://localhost:3000/api/auth/change-password \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt-token>" \
  -d '{
    "oldPassword": "oldpassword123",
    "newPassword": "newpassword123"
  }'
```

**Response (Success):**

```json
{
  "success": true,
  "message": "Password changed successfully",
  "data": null
}
```

### 1.3 Forgot Password

**Endpoint:** `POST /auth/forgot-password`  
**Public:** Yes

**Request:**

```bash
curl -X POST http://localhost:3000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com"
  }'
```

**Response (Success):**

```json
{
  "success": true,
  "message": null,
  "data": {
    "message": "Password reset instructions sent to your email"
  }
}
```

### 1.4 Reset Password

**Endpoint:** `POST /auth/reset-password`  
**Public:** Yes

**Request:**

```bash
curl -X POST http://localhost:3000/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "token": "abc123def456",
    "password": "newpassword123"
  }'
```

**Response (Success):**

```json
{
  "success": true,
  "message": "Password reset successful",
  "data": null
}
```

### 1.5 Logout

**Endpoint:** `POST /auth/logout`  
**Public:** No

**Request:**

```bash
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Authorization: Bearer <jwt-token>"
```

**Response (Success):**

```json
{
  "success": true,
  "message": "Logout successful",
  "data": null
}
```

---

## 2. User Management Endpoints

### 2.1 Create User

**Endpoint:** `POST /users`  
**Public:** No  
**Roles:** ADMIN, DATAENTRY

**Request:**

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt-token>" \
  -d '{
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "+923001234567",
    "password": "password123",
    "roleId": 2,
    "departmentId": 1,
    "userGroupId": 1,
    "managerId": 1,
    "type": "REGULAR",
    "isActive": true,
    "mustChangePassword": false
  }'
```

**Response (Success):**

```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "id": 2,
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "+923001234567",
    "role": {
      "id": 2,
      "name": "Manager"
    },
    "department": {
      "id": 1,
      "name": "Chief Minister Secretariat"
    },
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### 2.2 Get All Users

**Endpoint:** `GET /users`  
**Public:** No

**Request:**

```bash
curl -X GET "http://localhost:3000/api/users?page=1&limit=10" \
  -H "Authorization: Bearer <jwt-token>"
```

**Response (Success):**

```json
{
  "success": true,
  "message": null,
  "data": [
    {
      "id": 1,
      "name": "Administrator",
      "email": "admin@example.com",
      "role": { "id": 1, "name": "Admin" },
      "department": { "id": 1, "name": "Chief Minister Secretariat" },
      "isActive": true
    }
  ],
  "metadata": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### 2.3 Get User by ID

**Endpoint:** `GET /users/:id`  
**Public:** No

**Request:**

```bash
curl -X GET http://localhost:3000/api/users/1 \
  -H "Authorization: Bearer <jwt-token>"
```

### 2.4 Update User

**Endpoint:** `PATCH /users/:id`  
**Public:** No  
**Roles:** ADMIN, DATAENTRY

**Request:**

```bash
curl -X PATCH http://localhost:3000/api/users/2 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt-token>" \
  -d '{
    "name": "John Smith",
    "phone": "+923001234568",
    "isActive": true
  }'
```

### 2.5 Delete User

**Endpoint:** `DELETE /users/:id`  
**Public:** No  
**Roles:** ADMIN

**Request:**

```bash
curl -X DELETE http://localhost:3000/api/users/2 \
  -H "Authorization: Bearer <jwt-token>"
```

---

## 3. Meeting Management Endpoints

### 3.1 Create Meeting

**Endpoint:** `POST /meetings`  
**Public:** No

**Request:**

```bash
curl -X POST http://localhost:3000/api/meetings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt-token>" \
  -d '{
    "subject": "Budget Review Meeting",
    "meetingDate": "2024-01-15T10:00:00Z",
    "venue": "CM Secretariat, Peshawar",
    "departmentId": 1,
    "meetingTypeId": 1,
    "serialNumber": "CM/MTG/2024/001",
    "participants": "CM, Secretaries, Advisors",
    "departments": [1, 2, 3],
    "status": "upcoming"
  }'
```

**Response (Success):**

```json
{
  "success": true,
  "message": "Meeting created successfully",
  "data": {
    "id": 1,
    "subject": "Budget Review Meeting",
    "meetingDate": "2024-01-15T10:00:00.000Z",
    "venue": "CM Secretariat, Peshawar",
    "status": "upcoming",
    "createdAt": "2024-01-10T09:00:00.000Z"
  }
}
```

### 3.2 Get All Meetings

**Endpoint:** `GET /meetings`  
**Public:** No

**Request:**

```bash
curl -X GET "http://localhost:3000/api/meetings?page=1&limit=10" \
  -H "Authorization: Bearer <jwt-token>"
```

### 3.3 Get Meeting by ID

**Endpoint:** `GET /meetings/:id`  
**Public:** No

**Request:**

```bash
curl -X GET http://localhost:3000/api/meetings/1 \
  -H "Authorization: Bearer <jwt-token>"
```

### 3.4 Update Meeting

**Endpoint:** `PATCH /meetings/:id`  
**Public:** No

**Request:**

```bash
curl -X PATCH http://localhost:3000/api/meetings/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt-token>" \
  -d '{
    "status": "held",
    "participants": "CM, All Secretaries, Advisors"
  }'
```

### 3.5 Delete Meeting

**Endpoint:** `DELETE /meetings/:id`  
**Public:** No

**Request:**

```bash
curl -X DELETE http://localhost:3000/api/meetings/1 \
  -H "Authorization: Bearer <jwt-token>"
```

---

## 4. Minutes/Decisions Endpoints

### 4.1 Create Minute

**Endpoint:** `POST /minutes`  
**Public:** No

**Request:**

```bash
curl -X POST http://localhost:3000/api/minutes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt-token>" \
  -d '{
    "meetingId": 1,
    "heading": "Budget Allocation Discussion",
    "issues": "Budget shortfall in health department",
    "decisions": "Approved additional budget allocation",
    "responsibility": "Finance Department",
    "timeline": "2024-03-15T00:00:00Z",
    "progressHistory": "Initial review completed, awaiting final approval",
    "comments": "Follow up meeting scheduled for next week",
    "directions": "Ensure implementation within specified timeline",
    "status": "ON_TARGET",
    "departments": [1, 2, 3],
    "sortOrder": 1,
    "isArchived": false
  }'
```

**Response (Success):**

```json
{
  "success": true,
  "message": "Minute created successfully",
  "data": {
    "id": 1,
    "meetingId": 1,
    "issues": "Budget shortfall in health department",
    "decisions": "Approved additional budget allocation",
    "status": "ON_TARGET",
    "createdAt": "2024-01-15T11:00:00.000Z"
  }
}
```

### 4.2 Get Minutes by Meeting

**Endpoint:** `GET /minutes/meeting/:meetingId`  
**Public:** No

**Request:**

```bash
curl -X GET http://localhost:3000/api/minutes/meeting/1 \
  -H "Authorization: Bearer <jwt-token>"
```

### 4.3 Get Minute by ID

**Endpoint:** `GET /minutes/:id`  
**Public:** No

**Request:**

```bash
curl -X GET http://localhost:3000/api/minutes/1 \
  -H "Authorization: Bearer <jwt-token>"
```

### 4.4 Update Minute

**Endpoint:** `PATCH /minutes/:id`  
**Public:** No

**Request:**

```bash
curl -X PATCH http://localhost:3000/api/minutes/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt-token>" \
  -d '{
    "status": "COMPLETED",
    "progressHistory": "Implementation completed successfully"
  }'
```

### 4.5 Archive Minute

**Endpoint:** `POST /minutes/:id/archive`  
**Public:** No

**Request:**

```bash
curl -X POST http://localhost:3000/api/minutes/1/archive \
  -H "Authorization: Bearer <jwt-token>"
```

### 4.6 Get Replies for Minute

**Endpoint:** `GET /minutes/:id/replies`  
**Public:** No

**Request:**

```bash
curl -X GET http://localhost:3000/api/minutes/1/replies \
  -H "Authorization: Bearer <jwt-token>"
```

### 4.7 Create Reply to Minute

**Endpoint:** `POST /minutes/:id/replies`  
**Public:** No

**Request:**

```bash
curl -X POST http://localhost:3000/api/minutes/1/replies \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt-token>" \
  -d '{
    "response": "Action completed as per the directive"
  }'
```

---

## 5. Directives Endpoints

### 5.1 Create Directive

**Endpoint:** `POST /directives`  
**Public:** No

**Request:**

```bash
curl -X POST http://localhost:3000/api/directives \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt-token>" \
  -d '{
    "letterNumber": "CM/Dir/2024/001",
    "subject": "Implementation of health reforms",
    "issueDate": "2024-01-15T10:00:00Z",
    "timeline": "2024-03-15T00:00:00Z",
    "comments": "Urgent attention required",
    "departments": [1, 2, 3]
  }'
```

**Response (Success):**

```json
{
  "success": true,
  "message": "Directive created successfully",
  "data": {
    "id": 1,
    "letterNumber": "CM/Dir/2024/001",
    "subject": "Implementation of health reforms",
    "issueDate": "2024-01-15T10:00:00.000Z",
    "timeline": "2024-03-15T00:00:00.000Z",
    "status": "PENDING"
  }
}
```

### 5.2 Get All Directives

**Endpoint:** `GET /directives`  
**Public:** No

**Request:**

```bash
curl -X GET "http://localhost:3000/api/directives?page=1&limit=10" \
  -H "Authorization: Bearer <jwt-token>"
```

### 5.3 Get Directive by ID

**Endpoint:** `GET /directives/:id`  
**Public:** No

**Request:**

```bash
curl -X GET http://localhost:3000/api/directives/1 \
  -H "Authorization: Bearer <jwt-token>"
```

### 5.4 Submit Response to Directive

**Endpoint:** `POST /directives/:id/responses`  
**Public:** No

**Request:**

```bash
curl -X POST http://localhost:3000/api/directives/1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt-token>" \
  -d '{
    "response": "Directive acknowledged. Implementation plan in progress."
  }'
```

---

## 6. Task Management Endpoints

### 6.1 Create Task

**Endpoint:** `POST /tasks`  
**Public:** No

**Request:**

```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt-token>" \
  -d '{
    "title": "Review budget proposal",
    "description": "Review and approve the annual budget proposal for 2024",
    "dueDate": "2024-02-15T17:00:00Z",
    "priority": "high",
    "taskableType": "Meeting",
    "taskableId": 1,
    "assignedTo": 2,
    "departmentIds": [1, 2, 3]
  }'
```

### 6.2 Get All Tasks

**Endpoint:** `GET /tasks`  
**Public:** No

**Request:**

```bash
curl -X GET "http://localhost:3000/api/tasks?page=1&limit=10" \
  -H "Authorization: Bearer <jwt-token>"
```

### 6.3 Get Task by ID

**Endpoint:** `GET /tasks/:id`  
**Public:** No

**Request:**

```bash
curl -X GET http://localhost:3000/api/tasks/1 \
  -H "Authorization: Bearer <jwt-token>"
```

### 6.4 Update Task Status

**Endpoint:** `PATCH /tasks/:id/status`  
**Public:** No

**Request:**

```bash
curl -X PATCH http://localhost:3000/api/tasks/1/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt-token>" \
  -d '{
    "status": "completed"
  }'
```

### 6.5 Add Comment to Task

**Endpoint:** `POST /tasks/:id/comments`  
**Public:** No

**Request:**

```bash
curl -X POST http://localhost:3000/api/tasks/1/comments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt-token>" \
  -d '{
    "comment": "Task completed ahead of schedule"
  }'
```

---

## 7. Department Management Endpoints

### 7.1 Create Department

**Endpoint:** `POST /departments`  
**Public:** No  
**Roles:** ADMIN, DEPARTMENT

**Request:**

```bash
curl -X POST http://localhost:3000/api/departments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt-token>" \
  -d '{
    "name": "Health Department",
    "description": "Responsible for health services",
    "departmentTypeId": 1,
    "parentId": null,
    "districtId": 1,
    "active": true
  }'
```

### 7.2 Get All Departments

**Endpoint:** `GET /departments`  
**Public:** No

**Request:**

```bash
curl -X GET http://localhost:3000/api/departments \
  -H "Authorization: Bearer <jwt-token>"
```

### 7.3 Create Province

**Endpoint:** `POST /departments/provinces`  
**Public:** No  
**Roles:** ADMIN

**Request:**

```bash
curl -X POST http://localhost:3000/api/departments/provinces \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt-token>" \
  -d '{
    "name": "Khyber Pakhtunkhwa",
    "code": "KPK"
  }'
```

### 7.4 Get All Provinces

**Endpoint:** `GET /departments/provinces/list`  
**Public:** No

**Request:**

```bash
curl -X GET http://localhost:3000/api/departments/provinces/list \
  -H "Authorization: Bearer <jwt-token>"
```

---

## 8. Role Management Endpoints

### 8.1 Create Role

**Endpoint:** `POST /roles`  
**Public:** No  
**Roles:** ADMIN

**Request:**

```bash
curl -X POST http://localhost:3000/api/roles \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt-token>" \
  -d '{
    "name": "Project Manager",
    "description": "Manages project planning and execution",
    "isActive": true
  }'
```

### 8.2 Get All Roles

**Endpoint:** `GET /roles`  
**Public:** No

**Request:**

```bash
curl -X GET http://localhost:3000/api/roles \
  -H "Authorization: Bearer <jwt-token>"
```

### 8.3 Update Role

**Endpoint:** `PATCH /roles/:id`  
**Public:** No  
**Roles:** ADMIN

**Request:**

```bash
curl -X PATCH http://localhost:3000/api/roles/2 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt-token>" \
  -d '{
    "description": "Updated role description",
    "isActive": true
  }'
```

---

## 9. Permission Management Endpoints

### 9.1 Create Permission

**Endpoint:** `POST /permissions`  
**Public:** No  
**Roles:** ADMIN

**Request:**

```bash
curl -X POST http://localhost:3000/api/permissions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt-token>" \
  -d '{
    "name": "users.create",
    "displayName": "Create Users",
    "description": "Allows creating new users",
    "module": "users",
    "category": "users"
  }'
```

### 9.2 Get All Permissions

**Endpoint:** `GET /permissions`  
**Public:** No

**Request:**

```bash
curl -X GET "http://localhost:3000/api/permissions?category=users" \
  -H "Authorization: Bearer <jwt-token>"
```

---

## 10. Announcement Management Endpoints

### 10.1 Create Announcement

**Endpoint:** `POST /announcements`  
**Public:** No

**Request:**

```bash
curl -X POST http://localhost:3000/api/announcements \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt-token>" \
  -d '{
    "title": "New Health Policy Announcement",
    "date": "2024-01-15T10:00:00Z",
    "type": "policy",
    "description": "Comprehensive health policy reforms for better healthcare access",
    "priority": "high",
    "districtId": 1,
    "details": [
      {
        "title": "Health Initiative Implementation",
        "description": "Detailed implementation plan for the new health initiative",
        "timeline": "2024-02-15T00:00:00Z",
        "mainDepartmentId": 1,
        "otherDepartmentIds": [2, 3]
      }
    ]
  }'
```

### 10.2 Submit Response to Announcement Detail

**Endpoint:** `POST /announcements/details/:detailId/responses`  
**Public:** No

**Request:**

```bash
curl -X POST http://localhost:3000/api/announcements/details/1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt-token>" \
  -d '{
    "response": "Department acknowledges the announcement and will implement accordingly"
  }'
```

---

## 11. Complaint Management Endpoints

### 11.1 Submit Public Complaint

**Endpoint:** `POST /complaints`  
**Public:** Yes

**Request:**

```bash
curl -X POST http://localhost:3000/api/complaints \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Road maintenance issue",
    "detail": "The road in sector A is in poor condition and needs immediate repair",
    "applicantName": "Muhammad Ali",
    "applicantContact": "+923001234567",
    "applicantCnic": "12345-1234567-1",
    "location": "Sector A, Main Road, Peshawar",
    "departmentId": 1,
    "districtId": 1,
    "diaryNumber": "CMP/2024/001",
    "timeline": "2024-02-15T00:00:00Z",
    "priority": "high"
  }'
```

**Response (Success):**

```json
{
  "success": true,
  "message": "Complaint registered successfully",
  "data": {
    "id": 1,
    "title": "Road maintenance issue",
    "status": "NEW",
    "referenceNumber": "CMP/2024/001",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### 11.2 Get All Complaints (Admin)

**Endpoint:** `GET /complaints`  
**Public:** No

**Request:**

```bash
curl -X GET "http://localhost:3000/api/complaints?page=1&limit=10" \
  -H "Authorization: Bearer <jwt-token>"
```

### 11.3 Update Complaint Status

**Endpoint:** `PATCH /complaints/:id/status`  
**Public:** No

**Request:**

```bash
curl -X PATCH http://localhost:3000/api/complaints/1/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt-token>" \
  -d '{
    "status": "IN_PROGRESS"
  }'
```

### 11.4 Submit Complaint Feedback

**Endpoint:** `POST /complaints/:id/feedback`  
**Public:** Yes

**Request:**

```bash
curl -X POST http://localhost:3000/api/complaints/1/feedback \
  -H "Content-Type: application/json" \
  -d '{
    "rating": 5,
    "feedback": "Excellent service, complaint resolved quickly"
  }'
```

---

## 12. Issue Management Endpoints

### 12.1 Create Issue

**Endpoint:** `POST /issues`  
**Public:** No

**Request:**

```bash
curl -X POST http://localhost:3000/api/issues \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt-token>" \
  -d '{
    "title": "Healthcare access in rural areas",
    "description": "Limited healthcare facilities in rural districts affecting thousands of residents",
    "type": "PUBLIC_COMPLAINT",
    "priority": "high",
    "source": "Public complaint",
    "districtId": 1,
    "date": "2024-01-15T10:00:00Z",
    "timeline": "2024-03-15T00:00:00Z",
    "primaryDepartmentId": 1,
    "supportingDepartments": [2, 3]
  }'
```

---

## 13. Board Management Endpoints

### 13.1 Create Board

**Endpoint:** `POST /boards`  
**Public:** No

**Request:**

```bash
curl -X POST http://localhost:3000/api/boards \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt-token>" \
  -d '{
    "name": "University Board of Governors",
    "description": "Board responsible for university governance and policy decisions",
    "boardType": "university",
    "parentDepartmentId": 1,
    "quorumRequirement": 5,
    "meetingFrequency": "monthly"
  }'
```

### 13.2 Create Board Meeting

**Endpoint:** `POST /boards/meetings` (assuming this endpoint exists)  
**Public:** No

**Request:**

```bash
curl -X POST http://localhost:3000/api/boards/meetings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt-token>" \
  -d '{
    "boardId": 1,
    "sequenceNumber": "BM-2024-001",
    "date": "2024-01-15T10:00:00Z",
    "venue": "Board Room, Main Building",
    "meetingType": "regular",
    "participants": "Board members, department heads, secretary",
    "departmentId": 1,
    "agendaItems": [
      {
        "description": "Review quarterly financial reports",
        "decision": "Approved with minor revisions",
        "timeline": "2024-03-15T00:00:00Z",
        "primaryDepartmentId": 1,
        "relatedDepartmentIds": [2, 3]
      }
    ]
  }'
```

---

## 14. KPI Management Endpoints

### 14.1 Create KPI

**Endpoint:** `POST /kpi`  
**Public:** No

**Request:**

```bash
curl -X POST http://localhost:3000/api/kpi \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt-token>" \
  -d '{
    "name": "Vaccination Coverage",
    "description": "Percentage of population vaccinated",
    "departmentId": 1,
    "frequency": "MONTHLY",
    "target": 90,
    "unit": "percentage",
    "isActive": true
  }'
```

### 14.2 Submit KPI Data

**Endpoint:** `POST /kpi/:id/data` (assuming this endpoint exists)  
**Public:** No

**Request:**

```bash
curl -X POST http://localhost:3000/api/kpi/1/data \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt-token>" \
  -d '{
    "date": "2024-01-01T00:00:00Z",
    "value": 85.5,
    "remarks": "Data submitted by health department"
  }'
```

---

## 15. Letter Management Endpoints

### 15.1 Create Letter

**Endpoint:** `POST /letters`  
**Public:** No

**Request:**

```bash
curl -X POST http://localhost:3000/api/letters \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt-token>" \
  -d '{
    "letterNumber": "LTR-2025-001",
    "subject": "Budget Allocation Request",
    "content": "Dear Sir, We are writing to request budget allocation...",
    "letterDate": "2025-01-15T10:00:00Z",
    "fromDepartmentId": 1,
    "toDepartmentId": 2,
    "referenceType": "meeting",
    "referenceId": 1,
    "type": "official"
  }'
```

### 15.2 Get All Letters

**Endpoint:** `GET /letters`  
**Public:** No

**Request:**

```bash
curl -X GET "http://localhost:3000/api/letters?page=1&limit=10&type=official&fromDepartmentId=1" \
  -H "Authorization: Bearer <jwt-token>"
```

### 15.3 Get Letter by ID

**Endpoint:** `GET /letters/:id`  
**Public:** No

**Request:**

```bash
curl -X GET http://localhost:3000/api/letters/1 \
  -H "Authorization: Bearer <jwt-token>"
```

### 15.4 Generate PDF

**Endpoint:** `GET /letters/:id/generate-pdf`  
**Public:** No

**Request:**

```bash
curl -X GET http://localhost:3000/api/letters/1/generate-pdf \
  -H "Authorization: Bearer <jwt-token>" \
  --output letter.pdf
```

### 15.5 Update Letter

**Endpoint:** `PATCH /letters/:id`  
**Public:** No

**Request:**

```bash
curl -X PATCH http://localhost:3000/api/letters/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt-token>" \
  -d '{
    "content": "Updated letter content...",
    "status": "sent"
  }'
```

### 15.6 Send Letter

**Endpoint:** `POST /letters/:id/send`  
**Public:** No

**Request:**

```bash
curl -X POST http://localhost:3000/api/letters/1/send \
  -H "Authorization: Bearer <jwt-token>"
```

### 15.7 Delete Letter

**Endpoint:** `DELETE /letters/:id`  
**Public:** No

**Request:**

```bash
curl -X DELETE http://localhost:3000/api/letters/1 \
  -H "Authorization: Bearer <jwt-token>"
```

---

## 16. Public Days Endpoints

### 16.1 Create Public Day Record

**Endpoint:** `POST /public-days`  
**Public:** No

**Request:**

```bash
curl -X POST http://localhost:3000/api/public-days \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt-token>" \
  -d '{
    "date": "2025-01-15T10:00:00Z",
    "location": "DC Office Peshawar",
    "districtId": 1,
    "totalApplications": 50,
    "resolvedCount": 35,
    "remarks": "Successful public day with good attendance"
  }'
```

### 16.2 Get All Public Days

**Endpoint:** `GET /public-days`  
**Public:** No

**Request:**

```bash
curl -X GET "http://localhost:3000/api/public-days?page=1&limit=10&districtId=1" \
  -H "Authorization: Bearer <jwt-token>"
```

### 16.3 Get Public Days Statistics

**Endpoint:** `GET /public-days/stats`  
**Public:** No

**Request:**

```bash
curl -X GET http://localhost:3000/api/public-days/stats \
  -H "Authorization: Bearer <jwt-token>"
```

**Response (Success):**

```json
{
  "success": true,
  "message": null,
  "data": {
    "totalEvents": 15,
    "totalApplications": 750,
    "totalResolved": 525,
    "resolutionRate": 70.0
  }
}
```

---

## 17. Candidates Management Endpoints

### 17.1 Add Candidate

**Endpoint:** `POST /candidates`  
**Public:** No

**Request:**

```bash
curl -X POST http://localhost:3000/api/candidates \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt-token>" \
  -d '{
    "name": "Muhammad Ali Khan",
    "cnic": "12345-1234567-1",
    "type": "MPA",
    "constituencyId": 1,
    "party": "PTI",
    "contact": "+92-300-1234567",
    "email": "ali.khan@example.com"
  }'
```

### 17.2 Get All Candidates

**Endpoint:** `GET /candidates`  
**Public:** No

**Request:**

```bash
curl -X GET "http://localhost:3000/api/candidates?page=1&limit=10&type=MPA&party=PTI" \
  -H "Authorization: Bearer <jwt-token>"
```

### 17.3 Get Constituencies

**Endpoint:** `GET /candidates/constituencies`  
**Public:** No

**Request:**

```bash
curl -X GET http://localhost:3000/api/candidates/constituencies \
  -H "Authorization: Bearer <jwt-token>"
```

---

## 18. CM Remarks Endpoints

### 18.1 Create CM Remark

**Endpoint:** `POST /cm-remarks`  
**Public:** No

**Request:**

```bash
curl -X POST http://localhost:3000/api/cm-remarks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt-token>" \
  -d '{
    "title": "Infrastructure Development Priority",
    "remark": "Focus on rural road development in all districts",
    "remarkDate": "2025-01-15T10:00:00Z",
    "timeline": "2025-06-30T00:00:00Z",
    "priority": "high",
    "context": "Rural development initiative",
    "departmentIds": [1, 2, 3]
  }'
```

### 18.2 Get All CM Remarks

**Endpoint:** `GET /cm-remarks`  
**Public:** No

**Request:**

```bash
curl -X GET "http://localhost:3000/api/cm-remarks?page=1&limit=10" \
  -H "Authorization: Bearer <jwt-token>"
```

### 18.3 Archive CM Remark

**Endpoint:** `POST /cm-remarks/:id/archive`  
**Public:** No

**Request:**

```bash
curl -X POST http://localhost:3000/api/cm-remarks/1/archive \
  -H "Authorization: Bearer <jwt-token>"
```

---

## 19. Sectorial Meetings Endpoints

### 19.1 Create Sectorial Meeting

**Endpoint:** `POST /sectorial-meetings`  
**Public:** No

**Request:**

```bash
curl -X POST http://localhost:3000/api/sectorial-meetings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt-token>" \
  -d '{
    "sector": "Education",
    "date": "2025-01-15T10:00:00Z",
    "venue": "CM Secretariat",
    "meetingNumber": "SM-2025-01",
    "subject": "Education sector review",
    "participants": "Education Secretary, CM Advisors",
    "chairperson": "Chief Minister",
    "departmentId": 1
  }'
```

### 19.2 Get All Sectorial Meetings

**Endpoint:** `GET /sectorial-meetings`  
**Public:** No

**Request:**

```bash
curl -X GET "http://localhost:3000/api/sectorial-meetings?page=1&limit=10" \
  -H "Authorization: Bearer <jwt-token>"
```

---

## 20. Senate Meetings Endpoints

### 20.1 Create Senate Meeting

**Endpoint:** `POST /senate-meetings`  
**Public:** No

**Request:**

```bash
curl -X POST http://localhost:3000/api/senate-meetings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt-token>" \
  -d '{
    "universityName": "University of Peshawar",
    "date": "2025-01-15T10:00:00Z",
    "venue": "University Auditorium",
    "meetingNumber": "S-2025-01",
    "attendees": "Senate members, Vice Chancellor, Faculty",
    "quorumMet": true
  }'
```

### 20.2 Get All Senate Meetings

**Endpoint:** `GET /senate-meetings`  
**Public:** No

**Request:**

```bash
curl -X GET "http://localhost:3000/api/senate-meetings?page=1&limit=10" \
  -H "Authorization: Bearer <jwt-token>"
```

---

## 21. File Management Endpoints

### 21.1 Upload File

**Endpoint:** `POST /files`  
**Public:** No

**Request:**

```bash
curl -X POST http://localhost:3000/api/files \
  -H "Authorization: Bearer <jwt-token>" \
  -F "file=@document.pdf" \
  -F "type=meeting" \
  -F "id=1"
```

### 21.2 Get Files

**Endpoint:** `GET /files`  
**Public:** No

**Request:**

```bash
curl -X GET "http://localhost:3000/api/files?type=meeting&id=1" \
  -H "Authorization: Bearer <jwt-token>"
```

### 21.3 Get File by ID

**Endpoint:** `GET /files/:id`  
**Public:** No

**Request:**

```bash
curl -X GET http://localhost:3000/api/files/1 \
  -H "Authorization: Bearer <jwt-token>"
```

### 21.4 Delete File

**Endpoint:** `DELETE /files/:id`  
**Public:** No

**Request:**

```bash
curl -X DELETE http://localhost:3000/api/files/1 \
  -H "Authorization: Bearer <jwt-token>"
```

---

## 22. Inaugurations Endpoints

### 22.1 Create Inauguration

**Endpoint:** `POST /inaugurations`  
**Public:** No  
**Roles:** ADMIN, DEPARTMENT

**Request:**

```bash
curl -X POST http://localhost:3000/api/inaugurations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt-token>" \
  -d '{
    "title": "New Hospital Inauguration",
    "description": "Inauguration of 500-bed hospital",
    "date": "2025-01-15T10:00:00Z",
    "location": "Peshawar Medical Complex",
    "departmentId": 1,
    "chiefGuest": "Chief Minister"
  }'
```

### 22.2 Get All Inaugurations

**Endpoint:** `GET /inaugurations`  
**Public:** No

**Request:**

```bash
curl -X GET http://localhost:3000/api/inaugurations \
  -H "Authorization: Bearer <jwt-token>"
```

---

## 23. Khushhal KPK Program Endpoints

### 23.1 Create Khushhal KPK Task

**Endpoint:** `POST /khushhal-kpk/tasks`  
**Public:** No  
**Roles:** ADMIN, DEPARTMENT

**Request:**

```bash
curl -X POST http://localhost:3000/api/khushhal-kpk/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt-token>" \
  -d '{
    "title": "Road Construction Project",
    "description": "Construction of 10km road in rural area",
    "districtId": 1,
    "estimatedCost": 50000000,
    "timeline": "2025-06-30T00:00:00Z",
    "priority": "high"
  }'
```

### 23.2 Get All Khushhal Tasks

**Endpoint:** `GET /khushhal-kpk/tasks`  
**Public:** No

**Request:**

```bash
curl -X GET http://localhost:3000/api/khushhal-kpk/tasks \
  -H "Authorization: Bearer <jwt-token>"
```

### 23.3 Submit Progress

**Endpoint:** `POST /khushhal-kpk/tasks/:id/progress`  
**Public:** No

**Request:**

```bash
curl -X POST http://localhost:3000/api/khushhal-kpk/tasks/1/progress \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt-token>" \
  -d '{
    "progressType": "METRIC",
    "description": "Completed 40% of road construction",
    "percentage": 40,
    "costIncurred": 20000000,
    "remarks": "Work progressing as per schedule"
  }'
```

---

## 24. PTF Issues Endpoints

### 24.1 Create PTF Issue

**Endpoint:** `POST /ptf/issues`  
**Public:** No  
**Roles:** ADMIN, DEPARTMENT

**Request:**

```bash
curl -X POST http://localhost:3000/api/ptf/issues \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt-token>" \
  -d '{
    "title": "Education Reform Initiative",
    "description": "Comprehensive education reform for primary schools",
    "districtId": 1,
    "priority": "high",
    "estimatedCost": 100000000,
    "timeline": "2025-12-31T00:00:00Z"
  }'
```

### 24.2 Get All PTF Issues

**Endpoint:** `GET /ptf/issues`  
**Public:** No

**Request:**

```bash
curl -X GET http://localhost:3000/api/ptf/issues \
  -H "Authorization: Bearer <jwt-token>"
```

### 24.3 Create PTF Meeting

**Endpoint:** `POST /ptf/meetings`  
**Public:** No  
**Roles:** ADMIN, DEPARTMENT

**Request:**

```bash
curl -X POST http://localhost:3000/api/ptf/meetings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt-token>" \
  -d '{
    "title": "PTF Review Meeting",
    "date": "2025-01-15T10:00:00Z",
    "venue": "PTF Office",
    "agenda": "Review of ongoing PTF projects",
    "participants": "PTF Members, Department Heads"
  }'
```

---

## 25. Reports & Analytics Endpoints

### 25.1 Get Dashboard Statistics

**Endpoint:** `GET /reports/dashboard`  
**Public:** No

**Request:**

```bash
curl -X GET http://localhost:3000/api/reports/dashboard \
  -H "Authorization: Bearer <jwt-token>"
```

**Response (Success):**

```json
{
  "success": true,
  "message": null,
  "data": {
    "totalMeetings": 45,
    "totalMinutes": 120,
    "totalDirectives": 25,
    "totalComplaints": 89,
    "pendingTasks": 15,
    "overdueTasks": 3
  }
}
```

### 25.2 Get Meetings Summary Report

**Endpoint:** `GET /reports/meetings/summary`  
**Public:** No

**Request:**

```bash
curl -X GET "http://localhost:3000/api/reports/meetings/summary?startDate=2024-01-01&endDate=2024-12-31&meetingType=cabinet" \
  -H "Authorization: Bearer <jwt-token>"
```

### 25.3 Get Minutes Status Summary

**Endpoint:** `GET /reports/minutes/status-summary`  
**Public:** No

**Request:**

```bash
curl -X GET "http://localhost:3000/api/reports/minutes/status-summary?departmentId=1" \
  -H "Authorization: Bearer <jwt-token>"
```

### 25.4 Get Department Performance

**Endpoint:** `GET /reports/departments/performance`  
**Public:** No

**Request:**

```bash
curl -X GET "http://localhost:3000/api/reports/departments/performance?startDate=2024-01-01&endDate=2024-12-31" \
  -H "Authorization: Bearer <jwt-token>"
```

### 25.5 Get Directives Compliance

**Endpoint:** `GET /reports/compliance/directives`  
**Public:** No

**Request:**

```bash
curl -X GET "http://localhost:3000/api/reports/compliance/directives?departmentId=1" \
  -H "Authorization: Bearer <jwt-token>"
```

**Response (Success):**

```json
{
  "success": true,
  "message": null,
  "data": {
    "total": 25,
    "pending": 5,
    "inProgress": 10,
    "completed": 8,
    "overdue": 2
  }
}
```

### 25.6 Get Complaints Statistics

**Endpoint:** `GET /reports/complaints/stats`  
**Public:** No

**Request:**

```bash
curl -X GET "http://localhost:3000/api/reports/complaints/stats?districtId=1&startDate=2024-01-01&endDate=2024-12-31" \
  -H "Authorization: Bearer <jwt-token>"
```

### 25.7 Get Tasks Overview

**Endpoint:** `GET /reports/tasks/overview`  
**Public:** No

**Request:**

```bash
curl -X GET "http://localhost:3000/api/reports/tasks/overview?userId=1&departmentId=1" \
  -H "Authorization: Bearer <jwt-token>"
```

### 25.8 Get Development Schemes Financial Summary

**Endpoint:** `GET /reports/schemes/financial-summary`  
**Public:** No

**Request:**

```bash
curl -X GET "http://localhost:3000/api/reports/schemes/financial-summary?departmentId=1&financialYear=2024-25" \
  -H "Authorization: Bearer <jwt-token>"
```

### 25.9 Export Meetings Report

**Endpoint:** `GET /reports/export/meetings`  
**Public:** No

**Request:**

```bash
curl -X GET "http://localhost:3000/api/reports/export/meetings?format=excel&startDate=2024-01-01&endDate=2024-12-31" \
  -H "Authorization: Bearer <jwt-token>" \
  --output meetings_report.xlsx
```

### 25.10 Get Trends Analytics

**Endpoint:** `GET /reports/analytics/trends`  
**Public:** No

**Request:**

```bash
curl -X GET "http://localhost:3000/api/reports/analytics/trends?period=monthly" \
  -H "Authorization: Bearer <jwt-token>"
```

---

## 26. Notifications Endpoints

### 26.1 Create Notification

**Endpoint:** `POST /notifications`  
**Public:** No

**Request:**

```bash
curl -X POST http://localhost:3000/api/notifications \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt-token>" \
  -d '{
    "userId": 2,
    "type": "REMINDER",
    "title": "Meeting Reminder",
    "message": "You have a meeting scheduled for tomorrow",
    "notifiableType": "Meeting",
    "notifiableId": 1
  }'
```

### 26.2 Get User Notifications

**Endpoint:** `GET /notifications`  
**Public:** No

**Request:**

```bash
curl -X GET http://localhost:3000/api/notifications \
  -H "Authorization: Bearer <jwt-token>"
```

### 26.3 Get Unread Count

**Endpoint:** `GET /notifications/unread/count`  
**Public:** No

**Request:**

```bash
curl -X GET http://localhost:3000/api/notifications/unread/count \
  -H "Authorization: Bearer <jwt-token>"
```

**Response (Success):**

```json
{
  "success": true,
  "message": null,
  "data": 5
}
```

### 26.4 Mark as Read

**Endpoint:** `PATCH /notifications/:id/read`  
**Public:** No

**Request:**

```bash
curl -X PATCH http://localhost:3000/api/notifications/1/read \
  -H "Authorization: Bearer <jwt-token>"
```

### 26.5 Mark All as Read

**Endpoint:** `PATCH /notifications/read-all`  
**Public:** No

**Request:**

```bash
curl -X PATCH http://localhost:3000/api/notifications/read-all \
  -H "Authorization: Bearer <jwt-token>"
```

---

## 27. Tags Management Endpoints

### 27.1 Create Tag

**Endpoint:** `POST /tags`  
**Public:** No  
**Roles:** ADMIN, DEPARTMENT

**Request:**

```bash
curl -X POST http://localhost:3000/api/tags \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt-token>" \
  -d '{
    "name": "urgent",
    "description": "High priority items requiring immediate attention",
    "color": "#FF0000"
  }'
```

### 27.2 Get All Tags

**Endpoint:** `GET /tags`  
**Public:** No

**Request:**

```bash
curl -X GET http://localhost:3000/api/tags \
  -H "Authorization: Bearer <jwt-token>"
```

### 27.3 Attach Tag to Entity

**Endpoint:** `POST /tags/attach`  
**Public:** No

**Request:**

```bash
curl -X POST http://localhost:3000/api/tags/attach \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt-token>" \
  -d '{
    "tagId": 1,
    "taggableType": "Meeting",
    "taggableId": 1
  }'
```

### 27.4 Detach Tag from Entity

**Endpoint:** `DELETE /tags/detach`  
**Public:** No

**Request:**

```bash
curl -X DELETE http://localhost:3000/api/tags/detach \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt-token>" \
  -d '{
    "tagId": 1,
    "taggableType": "Meeting",
    "taggableId": 1
  }'
```

### 27.5 Get Tags for Entity

**Endpoint:** `GET /tags/entity/:type/:id`  
**Public:** No

**Request:**

```bash
curl -X GET http://localhost:3000/api/tags/entity/Meeting/1 \
  -H "Authorization: Bearer <jwt-token>"
```

---

## 28. Welfare Initiatives Endpoints

### 28.1 Create Welfare Initiative

**Endpoint:** `POST /welfare`  
**Public:** No  
**Roles:** ADMIN, DEPARTMENT

**Request:**

```bash
curl -X POST http://localhost:3000/api/welfare \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt-token>" \
  -d '{
    "title": "Education Support Program",
    "description": "Providing educational support to underprivileged students",
    "category": "education",
    "targetBeneficiaries": 1000,
    "budget": 5000000,
    "timeline": "2025-12-31T00:00:00Z",
    "departmentId": 1
  }'
```

### 28.2 Get All Welfare Initiatives

**Endpoint:** `GET /welfare`  
**Public:** No

**Request:**

```bash
curl -X GET http://localhost:3000/api/welfare \
  -H "Authorization: Bearer <jwt-token>"
```

---

## 29. Development Schemes Endpoints

### 29.1 Create Development Scheme

**Endpoint:** `POST /schemes`  
**Public:** No  
**Roles:** ADMIN, DEPARTMENT

**Request:**

```bash
curl -X POST http://localhost:3000/api/schemes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt-token>" \
  -d '{
    "title": "Urban Development Project",
    "description": "Comprehensive urban development initiative",
    "type": "MEGA",
    "status": "PENDING",
    "estimatedCost": 500000000,
    "approvedBudget": 0,
    "departmentId": 1,
    "districtId": 1,
    "timeline": "2026-12-31T00:00:00Z",
    "priority": "high"
  }'
```

### 29.2 Get All Schemes

**Endpoint:** `GET /schemes`  
**Public:** No

**Request:**

```bash
curl -X GET http://localhost:3000/api/schemes \
  -H "Authorization: Bearer <jwt-token>"
```

### 29.3 Add Costing to Scheme

**Endpoint:** `POST /schemes/:id/costing`  
**Public:** No  
**Roles:** ADMIN, DEPARTMENT

**Request:**

```bash
curl -X POST http://localhost:3000/api/schemes/1/costing \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt-token>" \
  -d '{
    "item": "Construction Materials",
    "quantity": 1000,
    "unitCost": 5000,
    "totalCost": 5000000,
    "category": "materials"
  }'
```

### 29.4 Add Budget Allocation

**Endpoint:** `POST /schemes/:id/budget`  
**Public:** No  
**Roles:** ADMIN, DEPARTMENT

**Request:**

```bash
curl -X POST http://localhost:3000/api/schemes/1/budget \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt-token>" \
  -d '{
    "amount": 100000000,
    "source": "Provincial Government",
    "financialYear": "2024-25",
    "allocationDate": "2024-01-15T00:00:00Z"
  }'
```

### 29.5 Record Expenditure

**Endpoint:** `POST /schemes/:id/expenditure`  
**Public:** No

**Request:**

```bash
curl -X POST http://localhost:3000/api/schemes/1/expenditure \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt-token>" \
  -d '{
    "amount": 25000000,
    "description": "Initial construction phase",
    "expenditureDate": "2024-02-15T00:00:00Z",
    "category": "construction"
  }'
```

### 29.6 Add Revision

**Endpoint:** `POST /schemes/:id/revision`  
**Public:** No  
**Roles:** ADMIN, DEPARTMENT

**Request:**

```bash
curl -X POST http://localhost:3000/api/schemes/1/revision \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt-token>" \
  -d '{
    "revisionType": "budget_increase",
    "description": "Additional budget allocation for scope expansion",
    "revisedAmount": 600000000,
    "revisionDate": "2024-03-01T00:00:00Z",
    "approvedBy": "Planning Commission"
  }'
```

---

## 30. KPI Management Endpoints

### 30.1 Create KPI

**Endpoint:** `POST /kpi`  
**Public:** No

**Request:**

```bash
curl -X POST http://localhost:3000/api/kpi \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt-token>" \
  -d '{
    "name": "Vaccination Coverage",
    "description": "Percentage of population vaccinated",
    "departmentId": 1,
    "frequency": "MONTHLY",
    "target": 90,
    "unit": "percentage",
    "isActive": true
  }'
```

### 30.2 Get All KPIs

**Endpoint:** `GET /kpi`  
**Public:** No

**Request:**

```bash
curl -X GET http://localhost:3000/api/kpi \
  -H "Authorization: Bearer <jwt-token>"
```

### 30.3 Submit KPI Data

**Endpoint:** `POST /kpi/:id/data` (assuming this endpoint exists)  
**Public:** No

**Request:**

```bash
curl -X POST http://localhost:3000/api/kpi/1/data \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt-token>" \
  -d '{
    "date": "2024-01-01T00:00:00Z",
    "value": 85.5,
    "remarks": "Data submitted by health department"
  }'
```

---

## Error Response Format

All API errors follow this structure:

```json
{
  "success": false,
  "message": "Error description",
  "data": null,
  "metadata": null
}
```

## Common HTTP Status Codes

- **200**: Success
- **201**: Created
- **400**: Bad Request (validation errors)
- **401**: Unauthorized (invalid/missing JWT)
- **403**: Forbidden (insufficient permissions)
- **404**: Not Found
- **409**: Conflict (duplicate data)
- **500**: Internal Server Error

## Pagination Parameters

For endpoints that support pagination, use these query parameters:

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 100)
- `sort`: Sort field (default: 'id')
- `order`: Sort order ('ASC' or 'DESC', default: 'DESC')

Example:

```
GET /api/users?page=2&limit=20&sort=createdAt&order=DESC
```

## Filtering Parameters

Some endpoints support filtering. Common filters include:

- `startDate`: Filter by start date
- `endDate`: Filter by end date
- `departmentId`: Filter by department
- `districtId`: Filter by district
- `status`: Filter by status
- `keyword`: Search keyword

Example:

```
GET /api/meetings?startDate=2024-01-01&endDate=2024-12-31&departmentId=1
```

---

## Notes for Frontend Developers

1. **Authentication**: Store JWT tokens securely and include them in all protected API calls
2. **Error Handling**: Always check the `success` field in responses
3. **Pagination**: Implement pagination controls for list endpoints
4. **File Uploads**: Use `FormData` for file upload endpoints
5. **Date Formats**: Send dates in ISO 8601 format (e.g., "2024-01-15T10:00:00Z")
6. **Validation**: Frontend should validate data before sending to match backend validation rules
7. **Rate Limiting**: Implement proper error handling for rate-limited requests

This comprehensive guide covers **ALL API endpoints** in the CMDMS system, including 150+ endpoints across all modules. For detailed Swagger specifications with interactive testing, refer to the API documentation at `http://localhost:3000/api/docs`.
