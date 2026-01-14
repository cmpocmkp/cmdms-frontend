# Announcements Module - Missing API Endpoints

**Date:** Current Session  
**Module:** Announcements  
**Status:** ⚠️ Partially Documented

## Summary

The Announcements module frontend has been integrated with the documented API endpoints. However, the frontend includes functionality for "Announcement Details" (sub-items within announcements) that is **NOT documented** in `API_INTEGRATION_GUIDE.md`.

## Documented Endpoints (✅ Implemented)

The following endpoints are documented and have been integrated:

1. ✅ `GET /api/announcements` - List announcements
2. ✅ `GET /api/announcements/:id` - Get announcement
3. ✅ `POST /api/announcements` - Create announcement
4. ✅ `PATCH /api/announcements/:id` - Update announcement
5. ✅ `DELETE /api/announcements/:id` - Delete announcement
6. ✅ `POST /api/announcements/details/:id/responses` - Create announcement detail response

## Missing Endpoints (❌ Not Documented)

The following endpoints are required for full functionality but are **NOT documented** in `API_INTEGRATION_GUIDE.md`:

### Announcement Details Management

1. ❌ `GET /api/announcements/:id/details` - List announcement details for an announcement
2. ❌ `GET /api/announcements/details/:id` - Get a specific announcement detail
3. ❌ `POST /api/announcements/:id/details` - Create a new announcement detail
4. ❌ `PATCH /api/announcements/details/:id` - Update an announcement detail
5. ❌ `DELETE /api/announcements/details/:id` - Delete an announcement detail

### Announcement Detail Responses

6. ❌ `GET /api/announcements/details/:id/responses` - List responses for an announcement detail
7. ❌ `GET /api/announcements/details/:id/responses/:responseId` - Get a specific response

## Frontend Pages Affected

### 1. EditAnnouncement.tsx
- **Status:** ✅ Main announcement update integrated
- **Issue:** "Announcement Details" table and CRUD operations cannot be integrated
- **Workaround:** Display warning message that functionality is not available

### 2. AnnouncementReplies.tsx
- **Status:** ❌ Cannot be fully integrated
- **Issue:** Requires `GET /api/announcements/details/:id/responses` endpoint
- **Current State:** Uses mock data only

### 3. AddAnnouncementDetailModal.tsx
- **Status:** ❌ Cannot be integrated
- **Issue:** Requires `POST /api/announcements/:id/details` endpoint

### 4. EditAnnouncementDetailModal.tsx
- **Status:** ❌ Cannot be integrated
- **Issue:** Requires `GET /api/announcements/details/:id` and `PATCH /api/announcements/details/:id` endpoints

### 5. ResponsibleDepartmentsModal.tsx
- **Status:** ❌ Cannot be integrated
- **Issue:** Requires endpoints to manage department assignments for announcement details

## Request to Backend Team

Please add the following endpoints to `API_INTEGRATION_GUIDE.md`:

### Suggested Endpoint Documentation

```bash
### List Announcement Details
curl 'https://cmdms-backend-production.up.railway.app/api/announcements/5/details' \
  -H 'Authorization: Bearer YOUR_TOKEN'

### Get Announcement Detail
curl 'https://cmdms-backend-production.up.railway.app/api/announcements/details/10' \
  -H 'Authorization: Bearer YOUR_TOKEN'

### Create Announcement Detail
curl -X POST 'https://cmdms-backend-production.up.railway.app/api/announcements/5/details' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "title":"Detail title",
    "description":"Detail description",
    "departmentIds":[10,15],
    "timeline":"2024-12-31"
  }'

### Update Announcement Detail
curl -X PATCH 'https://cmdms-backend-production.up.railway.app/api/announcements/details/10' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"title":"Updated title"}'

### Delete Announcement Detail
curl -X DELETE 'https://cmdms-backend-production.up.railway.app/api/announcements/details/10' \
  -H 'Authorization: Bearer YOUR_TOKEN'

### List Announcement Detail Responses
curl 'https://cmdms-backend-production.up.railway.app/api/announcements/details/10/responses' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

## Current Implementation Status

- ✅ **AnnouncementsList.tsx** - Fully integrated
- ✅ **AddAnnouncement.tsx** - Fully integrated
- ✅ **EditAnnouncement.tsx** - Main announcement update integrated, details section disabled with warning
- ❌ **AnnouncementReplies.tsx** - Cannot be integrated (missing endpoints)
- ❌ **AddAnnouncementDetailModal.tsx** - Cannot be integrated (missing endpoints)
- ❌ **EditAnnouncementDetailModal.tsx** - Cannot be integrated (missing endpoints)
- ❌ **ResponsibleDepartmentsModal.tsx** - Cannot be integrated (missing endpoints)

## Notes

- All documented endpoints have been successfully integrated
- Frontend code for announcement details is preserved but disabled
- Warning messages inform users that functionality is not available
- Once endpoints are documented, integration can be completed quickly



