# PTIs Filter - Debugging Checklist

## Problem
The filter card with "Filter PTIs" header and +/- button is NOT visible in new CMDMS, but it IS visible in old CMDMS.

## What OLD CMDMS Has (from image):
```
┌────────────────────────────────────┐
│ Filter PTIs              [+/-]     │  ← Card header
├────────────────────────────────────┤
│ Code | Title                       │
│ [Search Subject...]                │
│ [Search] [Clear Filters]           │
└────────────────────────────────────┘
```

## Current Implementation
The React component has the correct structure but something is hiding it.

## Possible Issues:
1. **Parent card-body CSS** might be hiding nested card
2. **Z-index or positioning** issue
3. **Display/visibility** being overridden
4. **Bootstrap card classes** not applied correctly
5. **Font Awesome icons** not loading (fa-plus/fa-minus)

## Next Steps:
1. Check if `.card mb-3` inside `.card-body` has display issues
2. Verify Bootstrap CSS is loaded
3. Check for conflicting global styles
4. Test with simplified structure
