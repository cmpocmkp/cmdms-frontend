# Sectoral Meetings Module - Missing API Endpoints

**Date:** Current Session  
**Module:** Sectoral Meetings  
**Status:** ⚠️ Partially Documented

## Summary

The Sectoral Meetings module frontend has been integrated with the documented API endpoints. However, the frontend includes functionality for "Sectoral Agenda Points" that is **NOT documented** in `API_INTEGRATION_GUIDE.md`.

## Documented Endpoints (✅ Implemented)

The following endpoints are documented and have been integrated:

1. ✅ `GET /api/sectorial-meetings` - List sectoral meetings
2. ✅ `GET /api/sectorial-meetings/:id` - Get sectoral meeting
3. ✅ `POST /api/sectorial-meetings` - Create sectoral meeting
4. ✅ `PATCH /api/sectorial-meetings/:id` - Update sectoral meeting
5. ✅ `DELETE /api/sectorial-meetings/:id` - Delete sectoral meeting

## Missing Endpoints (❌ Not Documented)

The following endpoints are required for full functionality but are **NOT documented** in `API_INTEGRATION_GUIDE.md`:

### Sectoral Agenda Points
1. ❌ `GET /api/sectorial-meetings/:id/agenda-points` - List agenda points for a sectoral meeting
2. ❌ `GET /api/sectorial-meetings/:id/agenda-points/:pointId` - Get a specific agenda point
3. ❌ `POST /api/sectorial-meetings/:id/agenda-points` - Create an agenda point
4. ❌ `PATCH /api/sectorial-meetings/:id/agenda-points/:pointId` - Update an agenda point
5. ❌ `DELETE /api/sectorial-meetings/:id/agenda-points/:pointId` - Delete an agenda point

### Sectoral Agenda Point Related Departments
6. ❌ `GET /api/sectorial-meetings/:id/agenda-points/:pointId/departments` - Get related departments for an agenda point
7. ❌ `PATCH /api/sectorial-meetings/:id/agenda-points/:pointId/departments` - Update related departments for an agenda point

### Sectoral Agenda Point Replies
8. ❌ `GET /api/sectorial-meetings/:id/agenda-points/:pointId/replies` - List replies for an agenda point
9. ❌ `POST /api/sectorial-meetings/:id/agenda-points/:pointId/replies` - Create a reply to an agenda point
10. ❌ `PATCH /api/sectorial-meetings/:id/agenda-points/:pointId/replies/:replyId` - Update a reply
11. ❌ `DELETE /api/sectorial-meetings/:id/agenda-points/:pointId/replies/:replyId` - Delete a reply

## Frontend Pages Affected

### 1. SectorialAgendaPoints.tsx
- **Status:** ❌ Cannot be integrated
- **Issue:** Requires endpoints to manage agenda points for sectoral meetings
- **Current State:** Uses mock data only

### 2. AddSectorialAgendaPoint.tsx
- **Status:** ❌ Cannot be integrated
- **Issue:** Requires `POST /api/sectorial-meetings/:id/agenda-points` endpoint

### 3. EditSectorialAgendaPoint.tsx
- **Status:** ❌ Cannot be integrated
- **Issue:** Requires `GET` and `PATCH /api/sectorial-meetings/:id/agenda-points/:pointId` endpoints

### 4. SectorialAgendaPointRelatedDepartments.tsx
- **Status:** ❌ Cannot be integrated
- **Issue:** Requires endpoints to manage related departments for agenda points

### 5. SectorialAgendaPointReplies.tsx
- **Status:** ❌ Cannot be integrated
- **Issue:** Requires endpoints to manage replies for agenda points

## Request to Backend Team

Please add the following endpoints to `API_INTEGRATION_GUIDE.md`:

### Suggested Endpoint Documentation

```bash
### List Sectoral Agenda Points
curl 'https://cmdms-backend-production.up.railway.app/api/sectorial-meetings/15/agenda-points' \
  -H 'Authorization: Bearer YOUR_TOKEN'

### Create Sectoral Agenda Point
curl -X POST 'https://cmdms-backend-production.up.railway.app/api/sectorial-meetings/15/agenda-points' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "title":"Agenda Point Title",
    "description":"Agenda point description",
    "departmentIds":[10,15]
  }'

### Update Sectoral Agenda Point
curl -X PATCH 'https://cmdms-backend-production.up.railway.app/api/sectorial-meetings/15/agenda-points/5' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"title":"Updated Title"}'

### Delete Sectoral Agenda Point
curl -X DELETE 'https://cmdms-backend-production.up.railway.app/api/sectorial-meetings/15/agenda-points/5' \
  -H 'Authorization: Bearer YOUR_TOKEN'

### List Sectoral Agenda Point Replies
curl 'https://cmdms-backend-production.up.railway.app/api/sectorial-meetings/15/agenda-points/5/replies' \
  -H 'Authorization: Bearer YOUR_TOKEN'

### Create Sectoral Agenda Point Reply
curl -X POST 'https://cmdms-backend-production.up.railway.app/api/sectorial-meetings/15/agenda-points/5/replies' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"content":"Reply content","status":2}'
```

## Current Implementation Status

- ✅ **sectoralMeetingService.ts** - Created with all documented endpoints
- ✅ **SectorialMeetingsList.tsx** - Fully integrated (List, filter, delete)
- ✅ **AddSectorialMeeting.tsx** - Fully integrated (API fields only, UI-only fields noted)
- ✅ **EditSectorialMeeting.tsx** - Fully integrated (API fields only, UI-only fields noted)
- ❌ **SectorialAgendaPoints.tsx** - Cannot be integrated (missing endpoints)
- ❌ **AddSectorialAgendaPoint.tsx** - Cannot be integrated (missing endpoints)
- ❌ **EditSectorialAgendaPoint.tsx** - Cannot be integrated (missing endpoints)
- ❌ **SectorialAgendaPointRelatedDepartments.tsx** - Cannot be integrated (missing endpoints)
- ❌ **SectorialAgendaPointReplies.tsx** - Cannot be integrated (missing endpoints)

## Notes

- All documented endpoints have been successfully integrated
- Frontend code for agenda points is preserved but disabled
- Warning messages inform users that functionality is not available
- Once endpoints are documented, integration can be completed quickly
- The API structure (title, date, sector) is simpler than the frontend mock structure (which includes time, meetingType, meetingNumber, departments, attendees, attachments, etc.)


