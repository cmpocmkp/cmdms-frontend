# PTF Module - Missing API Endpoints

**Date:** Current Session  
**Module:** PTF (Provincial Task Force)  
**Status:** ⚠️ Partially Documented

## Summary

The PTF module frontend has been integrated with the documented API endpoints. However, the API guide only documents **List** and **Create** operations. **Update** and **Delete** endpoints are **NOT documented** in `API_INTEGRATION_GUIDE.md`.

## Documented Endpoints (✅ Implemented)

The following endpoints are documented and have been integrated:

### PTF Issues
1. ✅ `GET /api/ptf/issues` - List PTF issues
2. ✅ `GET /api/ptf/issues/:id` - Get PTF issue
3. ✅ `POST /api/ptf/issues` - Create PTF issue

### PTF Meetings
4. ✅ `GET /api/ptf/meetings` - List PTF meetings
5. ✅ `POST /api/ptf/meetings` - Create PTF meeting

## Missing Endpoints (❌ Not Documented)

The following endpoints are required for full CRUD functionality but are **NOT documented** in `API_INTEGRATION_GUIDE.md`:

### PTF Issues
1. ❌ `PATCH /api/ptf/issues/:id` - Update PTF issue
2. ❌ `DELETE /api/ptf/issues/:id` - Delete PTF issue
3. ❌ `PATCH /api/ptf/issues/:id/status` - Update PTF issue status
4. ❌ `POST /api/ptf/issues/:id/assign` - Assign issue to department/user
5. ❌ `GET /api/ptf/issues/:id/responses` - Get responses/replies for an issue
6. ❌ `POST /api/ptf/issues/:id/responses` - Create response/reply to an issue

### PTF Meetings
7. ❌ `GET /api/ptf/meetings/:id` - Get PTF meeting
8. ❌ `PATCH /api/ptf/meetings/:id` - Update PTF meeting
9. ❌ `DELETE /api/ptf/meetings/:id` - Delete PTF meeting

## Frontend Pages Affected

### 1. PTFIssueDetail.tsx
- **Status:** ⚠️ Partially integrated
- **Issue:** Can fetch issue details, but cannot update or delete
- **Missing:** Update and Delete functionality

### 2. PTFIssueList.tsx
- **Status:** ✅ Integrated (List and View)
- **Issue:** Delete functionality not available
- **Current State:** Delete button/action disabled with warning

## Request to Backend Team

Please add the following endpoints to `API_INTEGRATION_GUIDE.md`:

### Suggested Endpoint Documentation

```bash
### Update PTF Issue
curl -X PATCH 'https://cmdms-backend-production.up.railway.app/api/ptf/issues/20' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"title":"Updated Title","status":"in-progress"}'

### Delete PTF Issue
curl -X DELETE 'https://cmdms-backend-production.up.railway.app/api/ptf/issues/20' \
  -H 'Authorization: Bearer YOUR_TOKEN'

### Update PTF Issue Status
curl -X PATCH 'https://cmdms-backend-production.up.railway.app/api/ptf/issues/20/status' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"status":"completed"}'

### Get PTF Meeting
curl 'https://cmdms-backend-production.up.railway.app/api/ptf/meetings/5' \
  -H 'Authorization: Bearer YOUR_TOKEN'

### Update PTF Meeting
curl -X PATCH 'https://cmdms-backend-production.up.railway.app/api/ptf/meetings/5' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"title":"Updated Meeting Title"}'

### Delete PTF Meeting
curl -X DELETE 'https://cmdms-backend-production.up.railway.app/api/ptf/meetings/5' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

## Current Implementation Status

- ✅ **PTFIssueList.tsx** - Fully integrated (List and View only)
- ⚠️ **PTFIssueDetail.tsx** - Partially integrated (View only, Update/Delete disabled)
- ❌ **PTF Meeting pages** - Not checked (would need Update/Delete endpoints)

## Notes

- All documented endpoints have been successfully integrated
- Frontend code for Update/Delete is preserved but disabled
- Warning messages inform users that functionality is not available
- Once endpoints are documented, integration can be completed quickly
- The API structure (title, description, priority, districtId, status, deadline) is simpler than the frontend mock structure (which includes way_forward, source, suggestedDepartments, assignedTo, etc.)



