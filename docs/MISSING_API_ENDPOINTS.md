# Missing API Endpoints Documentation

This document tracks endpoints that are used in the frontend but are **NOT documented** in `API_INTEGRATION_GUIDE.md`.

**⚠️ IMPORTANT:** Per `cursor_context_backend.md`, we cannot modify backend code or assume endpoints exist. These endpoints need to be:
1. Verified with backend team
2. Added to `API_INTEGRATION_GUIDE.md`
3. Services updated accordingly

---

## ✅ Resolved Endpoints

### 1. Activity Logs ✅
**Status:** ✅ Now documented in API_INTEGRATION_GUIDE.md  
**Location:** `src/lib/services/activityLogService.ts`

**Endpoint (Now Documented):**
- `GET /api/activity-logs` - List activity logs with pagination/filters

**Resolution:**
- ✅ Added to `API_INTEGRATION_GUIDE.md` (line 1817-1821)
- ✅ Service updated to use documented endpoint
- ✅ Page integration completed

---

### 2. Common APIs - Dropdowns ✅
**Status:** ✅ Now documented in API_INTEGRATION_GUIDE.md  
**Location:** `src/lib/services/commonService.ts`

**Endpoints (Now Documented):**
- ✅ `GET /api/common/departments/dropdown` - Departments dropdown
- ✅ `GET /api/common/users/dropdown` - Users dropdown
- ✅ `GET /api/common/roles/dropdown` - Roles dropdown
- ✅ `GET /api/common/departments/types/dropdown` - Department types dropdown

**Resolution:**
- ✅ Added to `API_INTEGRATION_GUIDE.md` (line 1829-1853)
- ✅ `commonService.ts` created with all dropdown endpoints

---

### 3. Common APIs - Global Search ✅
**Status:** ✅ Now documented in API_INTEGRATION_GUIDE.md  
**Location:** `src/lib/services/commonService.ts`

**Endpoint (Now Documented):**
- ✅ `GET /api/search?q=query_string` - Global search across all modules

**Resolution:**
- ✅ Added to `API_INTEGRATION_GUIDE.md` (line 1855-1861)
- ✅ `commonService.ts` includes global search function

---

### 4. Common APIs - Excel Export ✅
**Status:** ✅ Now documented in API_INTEGRATION_GUIDE.md  
**Location:** `src/lib/services/commonService.ts`

**Endpoint (Now Documented):**
- ✅ `GET /api/export/excel?type=meetings` - Generic Excel export

**Resolution:**
- ✅ Added to `API_INTEGRATION_GUIDE.md` (line 1863-1869)
- ✅ `commonService.ts` includes export function with blob response

---

## Currently Missing Endpoints

_None at this time. All previously missing endpoints have been documented in the API guide._

---

## Integration Strategy

For endpoints **NOT** in `API_INTEGRATION_GUIDE.md`:

1. **Do NOT assume they exist** (per `cursor_context_backend.md`)
2. **Create service with clear documentation** that endpoint needs verification
3. **Use mock data fallback** until endpoint is verified
4. **Document assumption** in service file and this document
5. **Flag for backend team** to verify/add to API guide

---

## Next Steps

1. **Backend Team:**
   - Review this document
   - Verify if endpoints exist
   - Add missing endpoints to `API_INTEGRATION_GUIDE.md`

2. **Frontend Team:**
   - Wait for endpoint verification
   - Update services once endpoints are documented
   - Remove assumption notes once verified

---

**Last Updated:** Current Session

