# PTIs Filter Card - Visibility Fix Applied

## Problem Summary
The "Filter PTIs" card header with +/- button is NOT visible in new CMDMS, but IS visible in old CMDMS.

## What Was Added

### 1. Forced Visibility CSS
Added to `PTIsList.tsx`:

```css
/* Force filter card visibility for debugging */
.content-wrapper .card .card-body .row .card {
  display: block !important;
  visibility: visible !important;
  opacity: 1 !important;
}

.content-wrapper .card .card-body .row .card .card-header {
  display: flex !important;
  visibility: visible !important;
  opacity: 1 !important;
}
```

### 2. Explicit Inline Styles
Applied to the filter card elements:
- Card container: white background + border
- Card header: white background + border-bottom + padding
- Toggle button: specific padding

## Testing Steps

1. **Hard Refresh** your browser:
   - Windows: `Ctrl + F5` or `Ctrl + Shift + R`
   - Mac: `Cmd + Shift + R`

2. **Open DevTools** (F12) and check:
   - Go to Elements/Inspector tab
   - Search for "Filter PTIs" text
   - Check if the element exists in the DOM
   - Check computed styles for `.card-header`

3. **Check Console** for:
   - Any JavaScript errors
   - Font Awesome loading errors
   - React rendering errors

## Expected Result

You should now see:

```
┌──────────────────────────────────────┐
│ Filter PTIs              [-]         │  ← Header should be visible
├──────────────────────────────────────┤
│ Code | Title                         │
│ [Search Subject...]                  │
│ [Search] [Clear Filters]             │
└──────────────────────────────────────┘
```

## If Still Not Visible

### Check These:
1. **Bootstrap CSS**: Verify Bootstrap is loaded in `index.html`
2. **Font Awesome**: Verify FA icons are loaded
3. **Content Wrapper**: Check if `.content-wrapper` class has `display: none`
4. **Parent Container**: Check if parent `.card .card-body` has overflow hidden

### Next Debugging Step:
Open browser DevTools console and run:
```javascript
document.querySelector('.content-wrapper .card .card-body .row .card')
```

If this returns `null`, the element is not rendering.
If it returns an element, check its computed styles.
