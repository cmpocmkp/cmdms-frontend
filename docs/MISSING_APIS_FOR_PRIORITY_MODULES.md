# Missing APIs for Priority Modules

**Document Date:** January 2025  
**Purpose:** List of missing API endpoints required for priority modules  
**Target Audience:** Backend Development Team  
**Status:** ⚠️ **REQUIRED FOR FRONTEND INTEGRATION**

---

## 📋 Overview

This document identifies missing API endpoints for priority modules that are currently not documented in `API_INTEGRATION_GUIDE.md`. These endpoints are **required** for the frontend to function correctly.

### Priority Modules Status

| Module | Status | Notes |
|--------|--------|-------|
| ✅ Minutes | Complete | All endpoints documented |
| ✅ Directives | Complete | All endpoints documented |
| ✅ Announcements | Complete | All endpoints documented |
| ✅ Inaugurations | Complete | All endpoints documented |
| ✅ Boards | Complete | All endpoints documented |
| ✅ MNA/MPA (Candidates) | Complete | All endpoints documented |
| ⚠️ **Summaries for CM** | **PARTIAL** | Only report endpoint exists |
| ❌ **Trackers/Interventions** | **MISSING** | No endpoints documented |

---

## 1. Summaries for CM Module

### Current Status
- ✅ **Report Endpoint:** `GET /api/reports/summaries/cm/summary` (documented)
- ❌ **Main Module Endpoints:** Not documented in API guide

### Missing Endpoints

#### 1.1 List Summaries
```bash
GET /api/summaries?page=1&limit=10&departmentId=5&status=1&search=query
```

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `departmentId` - Filter by department
- `status` - Filter by status (1=pending, 2=in-progress, 3=completed, etc.)
- `search` - Search by reference number or subject
- `fromDate` - Filter from date (YYYY-MM-DD)
- `toDate` - Filter to date (YYYY-MM-DD)
- `sortBy` - Sort field (default: createdAt)
- `sortOrder` - Sort order (asc/desc)

**Expected Response:**
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
      "createdAt": "2024-01-15T10:00:00.000Z",
      "updatedAt": "2024-01-15T10:00:00.000Z"
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

---

#### 1.2 Get Summary Details
```bash
GET /api/summaries/:id
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "referenceNumber": "SUM-2024-001",
    "subject": "Health Infrastructure Development",
    "description": "Full summary description",
    "date": "2024-01-15",
    "initiatorDepartmentId": 15,
    "initiatorDepartment": {
      "id": 15,
      "name": "Health Department"
    },
    "status": 1,
    "priority": "high",
    "tasks": [
      {
        "id": 1,
        "title": "Task title",
        "description": "Task description",
        "departmentId": 15,
        "department": {"id": 15, "name": "Health"},
        "status": 1,
        "progress": 50,
        "timeline": "2024-06-30",
        "deadline": "2024-06-30"
      }
    ],
    "attachments": [
      {
        "id": 100,
        "originalName": "document.pdf",
        "fileName": "uuid-document.pdf",
        "url": "https://cdn.cmdms.gov.pk/uploads/2024/01/uuid-document.pdf"
      }
    ],
    "replies": [
      {
        "id": 1,
        "content": "Reply content",
        "userId": 10,
        "user": {"id": 10, "name": "John Doe"},
        "createdAt": "2024-01-16T10:00:00.000Z"
      }
    ],
    "createdAt": "2024-01-15T10:00:00.000Z",
    "updatedAt": "2024-01-15T10:00:00.000Z"
  }
}
```

---

#### 1.3 Create Summary
```bash
POST /api/summaries
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN
```

**Request Body:**
```json
{
  "referenceNumber": "SUM-2024-001",
  "subject": "Health Infrastructure Development",
  "description": "Summary description",
  "date": "2024-01-15",
  "initiatorDepartmentId": 15,
  "priority": "high",
  "departmentIds": [15, 20],
  "tasks": [
    {
      "title": "Task title",
      "description": "Task description",
      "departmentId": 15,
      "timeline": "2024-06-30",
      "deadline": "2024-06-30"
    }
  ]
}
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "referenceNumber": "SUM-2024-001",
    "subject": "Health Infrastructure Development",
    "description": "Summary description",
    "date": "2024-01-15",
    "initiatorDepartmentId": 15,
    "status": 1,
    "createdAt": "2024-01-15T10:00:00.000Z"
  },
  "message": "Summary created successfully"
}
```

---

#### 1.4 Update Summary
```bash
PATCH /api/summaries/:id
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN
```

**Request Body:**
```json
{
  "subject": "Updated Subject",
  "description": "Updated description",
  "status": 2,
  "priority": "medium"
}
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "referenceNumber": "SUM-2024-001",
    "subject": "Updated Subject",
    "status": 2,
    "updatedAt": "2024-01-16T10:00:00.000Z"
  },
  "message": "Summary updated successfully"
}
```

---

#### 1.5 Delete Summary
```bash
DELETE /api/summaries/:id
Authorization: Bearer YOUR_TOKEN
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Summary deleted successfully"
}
```

---

#### 1.6 Summary Tasks Endpoints

##### List Summary Tasks
```bash
GET /api/summaries/:id/tasks
```

##### Create Summary Task
```bash
POST /api/summaries/:id/tasks
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Task title",
  "description": "Task description",
  "departmentId": 15,
  "timeline": "2024-06-30",
  "deadline": "2024-06-30"
}
```

##### Update Summary Task
```bash
PATCH /api/summaries/:id/tasks/:taskId
Content-Type: application/json
```

**Request Body:**
```json
{
  "status": 2,
  "progress": 75,
  "title": "Updated task title"
}
```

##### Delete Summary Task
```bash
DELETE /api/summaries/:id/tasks/:taskId
```

---

#### 1.7 Summary Replies/Comments

##### Get Summary Replies
```bash
GET /api/summaries/:id/replies
```

##### Create Summary Reply
```bash
POST /api/summaries/:id/replies
Content-Type: application/json
```

**Request Body:**
```json
{
  "content": "Reply content here",
  "attachments": ["file-id-1", "file-id-2"]
}
```

---

## 2. Trackers/Interventions Module

### Current Status
- ❌ **All Endpoints:** Not documented in API guide

### Missing Endpoints

#### 2.1 List Trackers
```bash
GET /api/trackers?page=1&limit=10&type=intervention&status=1&departmentId=5&search=query
```

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `type` - Filter by type (intervention, tracker, etc.)
- `status` - Filter by status (1=pending, 2=in-progress, 3=completed, etc.)
- `departmentId` - Filter by department
- `search` - Search by title or description
- `fromDate` - Filter from date (YYYY-MM-DD)
- `toDate` - Filter to date (YYYY-MM-DD)
- `sortBy` - Sort field (default: createdAt)
- `sortOrder` - Sort order (asc/desc)

**Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Road Infrastructure Development",
      "description": "Tracker description",
      "type": "intervention",
      "status": 1,
      "progress": 45,
      "budget": 50000000,
      "startDate": "2024-01-01",
      "endDate": "2024-12-31",
      "departments": [
        {"id": 15, "name": "Health Department"}
      ],
      "createdAt": "2024-01-15T10:00:00.000Z",
      "updatedAt": "2024-01-15T10:00:00.000Z"
    }
  ],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  }
}
```

---

#### 2.2 Get Tracker Details
```bash
GET /api/trackers/:id
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Road Infrastructure Development",
    "description": "Full tracker description",
    "type": "intervention",
    "status": 1,
    "progress": 45,
    "budget": 50000000,
    "startDate": "2024-01-01",
    "endDate": "2024-12-31",
    "departments": [
      {
        "id": 15,
        "name": "Health Department"
      }
    ],
    "activities": [
      {
        "id": 1,
        "title": "Activity title",
        "description": "Activity description",
        "departmentId": 15,
        "department": {"id": 15, "name": "Health"},
        "status": 1,
        "progress": 50,
        "createdAt": "2024-01-16T10:00:00.000Z"
      }
    ],
    "attachments": [
      {
        "id": 100,
        "originalName": "document.pdf",
        "fileName": "uuid-document.pdf",
        "url": "https://cdn.cmdms.gov.pk/uploads/2024/01/uuid-document.pdf"
      }
    ],
    "replies": [
      {
        "id": 1,
        "content": "Reply content",
        "userId": 10,
        "user": {"id": 10, "name": "John Doe"},
        "createdAt": "2024-01-16T10:00:00.000Z"
      }
    ],
    "createdAt": "2024-01-15T10:00:00.000Z",
    "updatedAt": "2024-01-15T10:00:00.000Z"
  }
}
```

---

#### 2.3 Create Tracker
```bash
POST /api/trackers
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN
```

**Request Body:**
```json
{
  "title": "Road Infrastructure Development",
  "description": "Tracker description",
  "type": "intervention",
  "status": 1,
  "budget": 50000000,
  "startDate": "2024-01-01",
  "endDate": "2024-12-31",
  "departmentIds": [15, 20],
  "activities": [
    {
      "title": "Activity title",
      "description": "Activity description",
      "departmentId": 15
    }
  ]
}
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Road Infrastructure Development",
    "type": "intervention",
    "status": 1,
    "createdAt": "2024-01-15T10:00:00.000Z"
  },
  "message": "Tracker created successfully"
}
```

---

#### 2.4 Update Tracker
```bash
PATCH /api/trackers/:id
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN
```

**Request Body:**
```json
{
  "title": "Updated Title",
  "status": 2,
  "progress": 60,
  "budget": 55000000
}
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Updated Title",
    "status": 2,
    "progress": 60,
    "updatedAt": "2024-01-16T10:00:00.000Z"
  },
  "message": "Tracker updated successfully"
}
```

---

#### 2.5 Delete Tracker
```bash
DELETE /api/trackers/:id
Authorization: Bearer YOUR_TOKEN
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Tracker deleted successfully"
}
```

---

#### 2.6 Tracker Activities Endpoints

##### List Tracker Activities
```bash
GET /api/trackers/:id/activities
```

##### Create Tracker Activity
```bash
POST /api/trackers/:id/activities
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Activity title",
  "description": "Activity description",
  "departmentId": 15,
  "status": 1
}
```

##### Update Tracker Activity
```bash
PATCH /api/trackers/:id/activities/:activityId
Content-Type: application/json
```

**Request Body:**
```json
{
  "status": 2,
  "progress": 75,
  "title": "Updated activity title"
}
```

##### Delete Tracker Activity
```bash
DELETE /api/trackers/:id/activities/:activityId
```

---

#### 2.7 Tracker Activity Replies/Comments

##### Get Activity Replies
```bash
GET /api/trackers/:id/activities/:activityId/replies
```

##### Create Activity Reply
```bash
POST /api/trackers/:id/activities/:activityId/replies
Content-Type: application/json
```

**Request Body:**
```json
{
  "content": "Reply content here",
  "attachments": ["file-id-1", "file-id-2"]
}
```

---

#### 2.8 Assign Tracker to Departments
```bash
POST /api/trackers/:id/assign
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN
```

**Request Body:**
```json
{
  "departmentIds": [15, 20, 25]
}
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "trackerId": 1,
    "departments": [
      {"id": 15, "name": "Health Department"},
      {"id": 20, "name": "Education Department"},
      {"id": 25, "name": "Finance Department"}
    ]
  },
  "message": "Tracker assigned to departments successfully"
}
```

---

## 3. Implementation Priority

### High Priority (Required for MVP)
1. ✅ **Summaries for CM:**
   - List Summaries (`GET /api/summaries`)
   - Get Summary Details (`GET /api/summaries/:id`)
   - Create Summary (`POST /api/summaries`)
   - Update Summary (`PATCH /api/summaries/:id`)

2. ✅ **Trackers/Interventions:**
   - List Trackers (`GET /api/trackers`)
   - Get Tracker Details (`GET /api/trackers/:id`)
   - Create Tracker (`POST /api/trackers`)
   - Update Tracker (`PATCH /api/trackers/:id`)

### Medium Priority (Required for Full Functionality)
3. **Summaries for CM:**
   - Delete Summary (`DELETE /api/summaries/:id`)
   - Summary Tasks endpoints
   - Summary Replies endpoints

4. **Trackers/Interventions:**
   - Delete Tracker (`DELETE /api/trackers/:id`)
   - Tracker Activities endpoints
   - Activity Replies endpoints
   - Assign to Departments (`POST /api/trackers/:id/assign`)

---

## 4. Common Requirements

All endpoints should follow the standard CMDMS API patterns:

### Authentication
- All endpoints require `Authorization: Bearer YOUR_ACCESS_TOKEN` header
- Return `401 Unauthorized` if token is missing or invalid

### Response Format
- Success responses: `{ "success": true, "data": {...}, "message": "..." }`
- Error responses: `{ "success": false, "error": { "code": "...", "message": "...", "details": [...] } }`

### Pagination
- List endpoints should support `page` and `limit` query parameters
- Response should include `meta` object with pagination info:
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

### Filtering & Sorting
- Support common query parameters: `search`, `status`, `departmentId`, `fromDate`, `toDate`
- Support `sortBy` and `sortOrder` parameters

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `500` - Server Error

---

## 5. Notes for Backend Team

1. **API Consistency:** Please ensure all endpoints follow the same structure as existing endpoints in `API_INTEGRATION_GUIDE.md`

2. **Documentation:** Once implemented, please update `API_INTEGRATION_GUIDE.md` with:
   - Complete endpoint documentation
   - Request/response examples
   - Error response examples
   - Query parameter descriptions

3. **Testing:** Please provide test endpoints or staging environment for frontend integration testing

4. **Timeline:** These endpoints are **blocking** frontend development for priority modules

---

## 6. Contact

For questions or clarifications, please contact the CMDMS Frontend Development Team.

**Document Version:** 1.0  
**Last Updated:** January 2025

