# Filter Issue Found!

## Problem Identified

From the screenshot, I can see:
- ✅ Filter form content IS visible
- ✅ "Code | Title" label shows
- ✅ Search input works
- ✅ Search and Clear Filters buttons show

## What's MISSING:

❌ **The "Filter PTIs" card header is NOT visible!**
❌ **The +/- toggle button is NOT visible!**

### Expected Structure:
```
┌────────────────────────────────────┐
│ Filter PTIs              [+/-]     │  ← THIS IS MISSING!
├────────────────────────────────────┤
│ Code | Title                       │  ← This IS visible
│ [Search input box...]              │  ← This IS visible
│ [Search] [Clear Filters]           │  ← This IS visible
└────────────────────────────────────┘
```

### Current Issue:
The filter card header is being hidden or not rendering properly.

## Possible Causes:
1. CSS hiding the card-header
2. Card structure issue
3. Bootstrap card classes not applied correctly
4. Z-index or positioning issue
