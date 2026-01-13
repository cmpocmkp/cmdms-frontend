# CM Remarks Module - Missing API Endpoints

**Date:** Current Session  
**Module:** CM Remarks  
**Status:** ⚠️ Partially Documented

## Summary

The CM Remarks module frontend has been integrated with the documented API endpoints. However, the frontend includes functionality for "CM Remark Responses/Replies" and "Department Management" that is **NOT documented** in `API_INTEGRATION_GUIDE.md`.

## Documented Endpoints (✅ Implemented)

The following endpoints are documented and have been integrated:

1. ✅ `GET /api/cm-remarks` - List CM remarks
2. ✅ `GET /api/cm-remarks/:id` - Get CM remark
3. ✅ `POST /api/cm-remarks` - Create CM remark
4. ✅ `PATCH /api/cm-remarks/:id` - Update CM remark
5. ✅ `DELETE /api/cm-remarks/:id` - Delete CM remark

## Missing Endpoints (❌ Not Documented)

The following endpoints are required for full functionality but are **NOT documented** in `API_INTEGRATION_GUIDE.md`:

### CM Remark Responses/Replies

1. ❌ `GET /api/cm-remarks/:id/responses` - List responses/replies for a CM remark
2. ❌ `GET /api/cm-remarks/:id/responses/:responseId` - Get a specific response
3. ❌ `POST /api/cm-remarks/:id/responses` - Create a response/reply to a CM remark
4. ❌ `PATCH /api/cm-remarks/:id/responses/:responseId` - Update a response
5. ❌ `DELETE /api/cm-remarks/:id/responses/:responseId` - Delete a response

### CM Remark Department Management

6. ❌ `GET /api/cm-remarks/:id/departments` - Get departments assigned to a CM remark with their statuses
7. ❌ `PATCH /api/cm-remarks/:id/departments` - Update department assignments and statuses
8. ❌ `PATCH /api/cm-remarks/:id/departments/:departmentId/status` - Update status for a specific department
9. ❌ `PATCH /api/cm-remarks/:id/departments/:departmentId/remarks` - Update remarks for a specific department

## Frontend Pages Affected

### 1. CMRemarkReplies.tsx
- **Status:** ❌ Cannot be integrated
- **Issue:** Requires `GET /api/cm-remarks/:id/responses` and `POST /api/cm-remarks/:id/responses` endpoints
- **Current State:** Uses mock data only

### 2. EditCMRemarkDepartments.tsx
- **Status:** ❌ Cannot be integrated
- **Issue:** Requires endpoints to manage department assignments and statuses
- **Current State:** Uses mock data only

## Request to Backend Team

Please add the following endpoints to `API_INTEGRATION_GUIDE.md`:

### Suggested Endpoint Documentation

```bash
### List CM Remark Responses
curl 'https://cmdms-backend-production.up.railway.app/api/cm-remarks/3/responses' \
  -H 'Authorization: Bearer YOUR_TOKEN'

### Create CM Remark Response
curl -X POST 'https://cmdms-backend-production.up.railway.app/api/cm-remarks/3/responses' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "content":"Progress update: 50% complete",
    "status":2,
    "departmentId":10
  }'

### Get CM Remark Departments
curl 'https://cmdms-backend-production.up.railway.app/api/cm-remarks/3/departments' \
  -H 'Authorization: Bearer YOUR_TOKEN'

### Update CM Remark Department Status
curl -X PATCH 'https://cmdms-backend-production.up.railway.app/api/cm-remarks/3/departments/10/status' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"status":2,"remarks":"On track"}'
```

## Current Implementation Status

- ✅ **CMRemarksList.tsx** - Fully integrated
- ✅ **AddCMRemark.tsx** - Fully integrated (API fields only, UI-only fields noted)
- ✅ **EditCMRemark.tsx** - Needs integration (similar to AddCMRemark)
- ❌ **CMRemarkReplies.tsx** - Cannot be integrated (missing endpoints)
- ❌ **EditCMRemarkDepartments.tsx** - Cannot be integrated (missing endpoints)

## Notes

- All documented endpoints have been successfully integrated
- Frontend code for responses and department management is preserved but disabled
- Warning messages inform users that functionality is not available
- Once endpoints are documented, integration can be completed quickly


