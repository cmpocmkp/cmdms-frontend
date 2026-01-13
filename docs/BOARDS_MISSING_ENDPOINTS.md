# Boards Module - Missing API Endpoints

**Date:** Current Session  
**Module:** Boards  
**Status:** ⚠️ Partially Documented

## Summary

The Boards module frontend has been integrated with the documented API endpoints. However, the API guide only documents basic CRUD for Boards and limited operations for Board Members and Board Meetings. Many endpoints required for full functionality are **NOT documented** in `API_INTEGRATION_GUIDE.md`.

## Documented Endpoints (✅ Implemented)

The following endpoints are documented and have been integrated:

### Boards
1. ✅ `GET /api/boards` - List boards
2. ✅ `GET /api/boards/:id` - Get board
3. ✅ `POST /api/boards` - Create board
4. ✅ `PATCH /api/boards/:id` - Update board
5. ✅ `DELETE /api/boards/:id` - Delete board

### Board Members
6. ✅ `POST /api/boards/:id/members` - Add board members

### Board Meetings
7. ✅ `POST /api/boards/:id/meetings` - Create board meeting
8. ✅ `GET /api/boards/:id/meetings` - List board meetings

## Missing Endpoints (❌ Not Documented)

The following endpoints are required for full functionality but are **NOT documented** in `API_INTEGRATION_GUIDE.md`:

### Board Members
1. ❌ `GET /api/boards/:id/members` - List board members
2. ❌ `GET /api/boards/:id/members/:memberId` - Get board member
3. ❌ `PATCH /api/boards/:id/members/:memberId` - Update board member
4. ❌ `DELETE /api/boards/:id/members/:memberId` - Delete board member
5. ❌ `DELETE /api/boards/:id/members` - Remove multiple board members

### Board Meetings
6. ❌ `GET /api/boards/:id/meetings/:meetingId` - Get board meeting
7. ❌ `PATCH /api/boards/:id/meetings/:meetingId` - Update board meeting
8. ❌ `DELETE /api/boards/:id/meetings/:meetingId` - Delete board meeting

### Board Acts
9. ❌ `GET /api/boards/:id/acts` - List board acts
10. ❌ `GET /api/boards/:id/acts/:actId` - Get board act
11. ❌ `POST /api/boards/:id/acts` - Create board act
12. ❌ `PATCH /api/boards/:id/acts/:actId` - Update board act
13. ❌ `DELETE /api/boards/:id/acts/:actId` - Delete board act

### Board Agenda Points
14. ❌ `GET /api/boards/:id/meetings/:meetingId/agenda-points` - List agenda points
15. ❌ `GET /api/boards/:id/meetings/:meetingId/agenda-points/:pointId` - Get agenda point
16. ❌ `POST /api/boards/:id/meetings/:meetingId/agenda-points` - Create agenda point
17. ❌ `PATCH /api/boards/:id/meetings/:meetingId/agenda-points/:pointId` - Update agenda point
18. ❌ `DELETE /api/boards/:id/meetings/:meetingId/agenda-points/:pointId` - Delete agenda point
19. ❌ `GET /api/boards/:id/meetings/:meetingId/agenda-points/:pointId/replies` - List agenda point replies
20. ❌ `POST /api/boards/:id/meetings/:meetingId/agenda-points/:pointId/replies` - Create agenda point reply

## Frontend Pages Affected

### 1. BoardMembersList.tsx
- **Status:** ⚠️ Partially integrated
- **Issue:** Can add members, but cannot list, update, or delete members
- **Missing:** GET, PATCH, DELETE endpoints for board members

### 2. AddBoardMember.tsx
- **Status:** ✅ Integrated (Add only)
- **Issue:** No update functionality available

### 3. EditBoardMember.tsx
- **Status:** ❌ Cannot be integrated
- **Issue:** Requires `PATCH /api/boards/:id/members/:memberId` endpoint

### 4. BoardMeetingsList.tsx
- **Status:** ⚠️ Partially integrated
- **Issue:** Can list meetings, but cannot update or delete
- **Missing:** PATCH and DELETE endpoints for board meetings

### 5. AddBoardMeeting.tsx
- **Status:** ✅ Integrated (Create only)

### 6. EditBoardMeeting.tsx
- **Status:** ❌ Cannot be integrated
- **Issue:** Requires `PATCH /api/boards/:id/meetings/:meetingId` endpoint

### 7. ShowBoardMeeting.tsx
- **Status:** ⚠️ Partially integrated
- **Issue:** Can fetch meeting, but full details may be limited

### 8. BoardActsList.tsx
- **Status:** ❌ Cannot be integrated
- **Issue:** No endpoints documented for Board Acts

### 9. BoardAgendaPoints.tsx
- **Status:** ❌ Cannot be integrated
- **Issue:** No endpoints documented for Board Agenda Points

### 10. BoardAgendaPointReplies.tsx
- **Status:** ❌ Cannot be integrated
- **Issue:** No endpoints documented for Board Agenda Point Replies

## Request to Backend Team

Please add the following endpoints to `API_INTEGRATION_GUIDE.md`:

### Suggested Endpoint Documentation

```bash
### List Board Members
curl 'https://cmdms-backend-production.up.railway.app/api/boards/2/members' \
  -H 'Authorization: Bearer YOUR_TOKEN'

### Delete Board Member
curl -X DELETE 'https://cmdms-backend-production.up.railway.app/api/boards/2/members/5' \
  -H 'Authorization: Bearer YOUR_TOKEN'

### Get Board Meeting
curl 'https://cmdms-backend-production.up.railway.app/api/boards/2/meetings/10' \
  -H 'Authorization: Bearer YOUR_TOKEN'

### Update Board Meeting
curl -X PATCH 'https://cmdms-backend-production.up.railway.app/api/boards/2/meetings/10' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"title":"Updated Meeting Title"}'

### Delete Board Meeting
curl -X DELETE 'https://cmdms-backend-production.up.railway.app/api/boards/2/meetings/10' \
  -H 'Authorization: Bearer YOUR_TOKEN'

### List Board Acts
curl 'https://cmdms-backend-production.up.railway.app/api/boards/2/acts' \
  -H 'Authorization: Bearer YOUR_TOKEN'

### Create Board Act
curl -X POST 'https://cmdms-backend-production.up.railway.app/api/boards/2/acts' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"title":"Board Act Title","description":"Act description"}'

### List Board Agenda Points
curl 'https://cmdms-backend-production.up.railway.app/api/boards/2/meetings/10/agenda-points' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

## Current Implementation Status

- ✅ **boardService.ts** - Created with all documented endpoints
- ⚠️ **BoardMembersList.tsx** - Partially integrated (Add only)
- ⚠️ **BoardMeetingsList.tsx** - Partially integrated (List and Create only)
- ❌ **EditBoardMember.tsx** - Cannot be integrated (missing endpoints)
- ❌ **EditBoardMeeting.tsx** - Cannot be integrated (missing endpoints)
- ❌ **BoardActsList.tsx** - Cannot be integrated (missing endpoints)
- ❌ **BoardAgendaPoints.tsx** - Cannot be integrated (missing endpoints)
- ❌ **BoardAgendaPointReplies.tsx** - Cannot be integrated (missing endpoints)

## Notes

- All documented endpoints have been successfully integrated
- Frontend code for missing functionality is preserved but disabled
- Warning messages inform users that functionality is not available
- Once endpoints are documented, integration can be completed quickly
- Board Acts and Board Agenda Points are completely missing from the API guide


