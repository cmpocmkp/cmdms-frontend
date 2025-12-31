# Font Awesome Icon Fix

## Root Cause Found! 

### Problem:
The toggle button icon was using **Font Awesome 5+ syntax** but the project uses **Font Awesome 4.x**.

### The Issue:
```tsx
// WRONG (Font Awesome 5+ syntax)
<i className={`fas fa-plus`}></i>

// CORRECT (Font Awesome 4.x syntax)
<i className={`fa fa-plus`}></i>
```

### What Was Loaded:
From `index.html`:
```html
<link rel="stylesheet" href="/admin_assets/vendors/font-awesome/css/font-awesome.min.css">
```

This is **Font Awesome 4.x**, which uses:
- `fa fa-icon-name` (not `fas`)

### Font Awesome Version Differences:

| Version | Prefix | Example |
|---------|--------|---------|
| FA 4.x  | `fa`   | `fa fa-plus` |
| FA 5+   | `fas`, `far`, `fab` | `fas fa-plus` |

### Fix Applied:
Changed from `fas` to `fa` in `PTIsList.tsx` toggle button.

### Result:
The +/- toggle icon should now display correctly.
