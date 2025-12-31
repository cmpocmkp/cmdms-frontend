# PTIs Filter Form - Visibility Fix

## Problem Identified

From the latest screenshot:
- ✅ **Filter card header** is visible
- ✅ **Minus (-)** icon is visible  
- ❌ **Form content** (label, input, buttons) is NOT visible - just white space

## Root Cause

The form elements were likely:
1. Hidden by CSS
2. White text on white background
3. Opacity set to 0
4. Display set to none

## Fix Applied

Added forced visibility CSS for **ALL form elements**:

```css
/* Force form elements visibility */
.content-wrapper .card .card-body .row .card .card-body {
  display: block !important;
  visibility: visible !important;
  opacity: 1 !important;
}

.content-wrapper .card .card-body .row .card .card-body label {
  display: block !important;
  visibility: visible !important;
  opacity: 1 !important;
  color: #000 !important;  /* BLACK text */
}

.content-wrapper .card .card-body .row .card .card-body .form-control {
  display: block !important;
  visibility: visible !important;
  opacity: 1 !important;
  border: 1px solid #ced4da !important;
  background-color: #fff !important;
  color: #495057 !important;  /* DARK GRAY text */
}

.content-wrapper .card .card-body .row .card .card-body .btn {
  display: inline-block !important;
  visibility: visible !important;
  opacity: 1 !important;
}
```

## Expected Result

After hard refresh, you should now see:

```
┌──────────────────────────────────────┐
│ Filter PTIs              [-]         │
├──────────────────────────────────────┤
│ Code | Title             [BLACK TEXT]│
│ ┌──────────────────────────────────┐ │
│ │ Search Subject...                │ │
│ └──────────────────────────────────┘ │
│ [Search] [Clear Filters]             │
└──────────────────────────────────────┘
```

## Build Status
```bash
✓ TypeScript compilation: SUCCESS
✓ Vite build: SUCCESS
✓ built in 21.55s
```

## Testing Steps

1. **Hard Refresh** browser: `Ctrl + F5`
2. Navigate to `/admin/ptis`
3. Check if you now see:
   - "Code | Title" label (in BLACK)
   - Search input box with border
   - "Search" button (blue)
   - "Clear Filters" button (gray)

## If Still Not Visible

Open DevTools Console and run:
```javascript
// Check if form elements exist
document.querySelector('.content-wrapper .card .card-body .row .card .card-body form')

// Check label
document.querySelector('.content-wrapper .card .card-body .row .card .card-body label')

// Check input
document.querySelector('.content-wrapper .card .card-body .row .card .card-body input')
```

If any return `null`, the element is not rendering at all (React issue).  
If they return elements, check their computed styles in DevTools.
