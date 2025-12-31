# Filter Card Fix Summary

## Issue
Filter card (Code/Title search box) was not visible on PTIs list page.

## Root Cause
Bootstrap's `collapse` class CSS was missing from global styles, and initial state was set incorrectly.

## Fixes Applied

### 1. Added Collapse CSS to Global Stylesheet
**File:** `src/index.css`

Added Bootstrap collapse functionality:
```css
/* Bootstrap Collapse functionality */
.collapse:not(.show) {
  display: none;
}

.collapse.show {
  display: block;
}

.collapsing {
  height: 0;
  overflow: hidden;
  transition: height 0.35s ease;
}
```

### 2. Fixed Initial State
**File:** `src/pages/admin/PTIs/PTIsList.tsx`

Changed:
```tsx
const [isFilterExpanded, setIsFilterExpanded] = useState(!!searchTerm);
```

To:
```tsx
const [isFilterExpanded, setIsFilterExpanded] = useState(false);
```

## Expected Behavior

1. **Page Load:** Filter card is collapsed (hidden) by default
2. **Click + Button:** Filter card expands, shows:
   - Label: "Code | Title"
   - Search input box
   - Search button
   - Clear Filters button
3. **Click - Button:** Filter card collapses (hides)

## Testing Steps

1. Navigate to `/admin/ptis`
2. Look for "Filter PTIs" section with + button
3. Click the + button
4. Verify filter form appears
5. Click the - button
6. Verify filter form disappears

## Build Status
✅ Build successful
✅ No TypeScript errors
