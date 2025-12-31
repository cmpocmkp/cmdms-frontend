# PTIs Filter - Debug Information

## Current Status

The filter card should be visible with the following structure:

### Expected UI Elements:

1. **Filter PTIs Card** (in center, col-md-8)
   - Card header with "Filter PTIs" text
   - Plus (+) button on the right
   - Initially collapsed (hidden)

2. **When Expanded (after clicking +):**
   - Shows "Code | Title" label
   - Shows search input box
   - Shows "Search" button
   - Shows "Clear Filters" link

## Troubleshooting Steps:

### Step 1: Check if card is rendering
Open browser DevTools (F12) and look for:
```html
<div class="card mb-3">
  <div class="card-header ...">
    <span>Filter PTIs</span>
    <button ...><i class="fas fa-plus"></i></button>
  </div>
</div>
```

### Step 2: Check CSS
The collapse functionality requires these CSS classes (now in src/index.css):
```css
.collapse:not(.show) {
  display: none;
}

.collapse.show {
  display: block;
}
```

### Step 3: Check Initial State
The filter should start **collapsed** (hidden):
```tsx
const [isFilterExpanded, setIsFilterExpanded] = useState(false);
```

### Step 4: Browser Console Check
Open console and check for:
- Any React errors
- Any CSS loading issues
- Check if Font Awesome is loaded (for fa-plus icon)

## Common Issues:

1. **Filter card not visible at all:**
   - Check if `row justify-content-center` is working
   - Check if Bootstrap classes are loaded

2. **Filter card visible but not expanding:**
   - Check if collapse CSS is loaded
   - Check if button onClick is firing

3. **Filter visible but search not working:**
   - Check React state updates
   - Check form submission handler

## Quick Test:

Change initial state to `true` to see if filter works when expanded:
```tsx
const [isFilterExpanded, setIsFilterExpanded] = useState(true);
```

If you see the filter form, then the problem is only with the toggle. If you still don't see it, there's a rendering issue.
