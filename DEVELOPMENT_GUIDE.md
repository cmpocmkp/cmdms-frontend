# CMDMS Frontend Development Guide

## Quick Start

### Running the Project
```bash
cd "d:\cmdms migration\OLD NEW CMDMS\CMDMS_FRONTEND"
npm run dev
```

### Mock Login Credentials
**Admin Users:**
- Email: `admin@cmdms.gov.pk`
- Password: `password123` or `password`

**Department Users:**
- Finance: `saqib.zaman@finance.gov.pk` / `password123`
- Health: `ahmed.hassan@health.gov.pk` / `password123`
- Education: `rashid.mahmood@education.gov.pk` / `password123`
- Any mock user email / `password123`

---

## Project Structure

```
CMDMS_FRONTEND/
├── public/
│   └── assets/              # Static assets (logos, images)
│       ├── logos/           # System & KP logos
│       ├── images/
│       │   ├── cm/          # CM photos
│       │   ├── backgrounds/ # Login backgrounds
│       │   └── status/      # Status icons
│       └── icons/
│
├── src/
│   ├── components/
│   │   ├── ui/              # shadcn/ui components
│   │   └── shared/          # Reusable components
│   │       ├── forms/       # Form components
│   │       ├── data-display/# Tables, badges, cards
│   │       ├── layout/      # Layout components
│   │       └── modals/      # Modal components
│   │
│   ├── features/            # Module-specific components
│   │   ├── directives/      # Directives module
│   │   ├── announcements/   # Announcements module
│   │   └── [module]/        # Other modules
│   │
│   ├── contexts/            # React contexts
│   │   └── AuthContext.tsx  # Authentication context
│   │
│   ├── store/               # Zustand stores
│   │   ├── authStore.ts     # Auth state
│   │   └── uiStore.ts       # UI state
│   │
│   ├── hooks/               # Custom React hooks
│   │   └── useAuth.ts       # Auth hooks
│   │
│   ├── lib/
│   │   ├── api.ts           # Central API client
│   │   ├── services/        # Service layer (imports here)
│   │   └── mocks/           # Mock data system
│   │       ├── data/        # Mock datasets
│   │       ├── generators/  # Data generators
│   │       └── services/    # Mock service implementations
│   │
│   ├── types/
│   │   └── index.ts         # TypeScript type definitions
│   │
│   ├── utils/               # Utility functions
│   │   ├── cn.ts            # Class name utility
│   │   ├── format.ts        # Formatters
│   │   └── validators.ts    # Validators
│   │
│   ├── routes/              # Route configuration
│   ├── App.tsx              # Main app component
│   └── main.tsx             # Entry point
│
├── BUSINESS_RULES.md        # Extracted business rules
├── PROGRESS.md              # Development progress
├── DEVELOPMENT_GUIDE.md     # This file
└── CURSOR_CONTEXT.md        # Migration rules
```

---

## Development Patterns

### 1. Creating a New Module

#### Step 1: Define Types (if not exists)
```typescript
// src/types/index.ts
export interface YourModule extends BaseEntity {
  title: string;
  description: string;
  status: Status;
  departments: Department[];
  // ... other fields
}
```

#### Step 2: Create Mock Data
```typescript
// src/lib/mocks/data/yourModule.ts
import { YourModule } from '../../../types';
import { generateTitle } from '../generators/textGenerator';
import { generateTimeline } from '../generators/dateGenerator';

export const mockYourModules: YourModule[] = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  title: generateTitle('your-type'),
  // ... generate other fields
}));
```

#### Step 3: Create Mock Service
```typescript
// src/lib/mocks/services/mockYourModuleService.ts
import { simulateNetworkDelay } from '../../api';

export async function getAllYourModules(filters?) {
  await simulateNetworkDelay(300);
  // ... implement service methods
  return { data: mockYourModules, pagination, success: true };
}

// Implement: getById, create, update, delete
```

#### Step 4: Create Service Wrapper
```typescript
// src/lib/services/yourModuleService.ts
import { USE_MOCK_DATA } from '../api';
import * as mockService from '../mocks/services/mockYourModuleService';

export const yourModuleService = {
  getAll: USE_MOCK_DATA ? mockService.getAllYourModules : mockService.getAllYourModules,
  // TODO: Replace with real service when backend ready
};
```

#### Step 5: Create Feature Components
```
src/features/your-module/
├── pages/
│   ├── YourModuleListPage.tsx
│   ├── YourModuleDetailPage.tsx
│   └── YourModuleFormPage.tsx
├── components/
│   ├── YourModuleCard.tsx
│   ├── YourModuleFilters.tsx
│   └── YourModuleTable.tsx
└── hooks/
    └── useYourModule.ts
```

---

### 2. Using Authentication

```typescript
import { useAuth, useRole, usePermissions } from '@/hooks/useAuth';

function MyComponent() {
  const { user, isAuthenticated, logout } = useAuth();
  const { isAdmin, isDepartment } = useRole();
  const { hasPermission } = usePermissions();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return (
    <div>
      {isAdmin && <AdminOnlyFeature />}
      {hasPermission('view_directives') && <DirectivesList />}
    </div>
  );
}
```

---

### 3. Using Services

```typescript
import { directiveService } from '@/lib/services/directiveService';
import { useState, useEffect } from 'react';

function DirectivesList() {
  const [directives, setDirectives] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function fetchDirectives() {
      try {
        const response = await directiveService.getAll({ 
          page: 1, 
          per_page: 10 
        });
        setDirectives(response.data);
      } catch (error) {
        console.error('Failed to fetch:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchDirectives();
  }, []);
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <div>
      {directives.map(d => (
        <div key={d.id}>{d.title}</div>
      ))}
    </div>
  );
}
```

---

### 4. Using UI Store

```typescript
import { useUIStore } from '@/store/uiStore';

function Sidebar() {
  const { sidebarCollapsed, toggleSidebar } = useUIStore();
  
  return (
    <aside className={cn(
      'sidebar',
      sidebarCollapsed && 'collapsed'
    )}>
      <button onClick={toggleSidebar}>Toggle</button>
    </aside>
  );
}
```

---

### 5. Formatting & Utilities

```typescript
import { formatDate, formatRelativeTime, truncate } from '@/utils/format';
import { cn } from '@/utils/cn';

function DateDisplay({ date }) {
  return (
    <div className={cn('text-sm', 'text-gray-600')}>
      {formatDate(date, 'PP')} 
      ({formatRelativeTime(date)})
    </div>
  );
}
```

---

## Blade → React Conversion Guide

### Alpine.js → React Mapping

| Alpine.js | React |
|-----------|-------|
| `x-data="{ open: false }"` | `const [open, setOpen] = useState(false)` |
| `x-show="open"` | `{open && <div>...</div>}` |
| `x-if="condition"` | `{condition && <Component />}` |
| `@click="toggle()"` | `onClick={() => toggle()}` |
| `x-model="value"` | `value={value} onChange={e => setValue(e.target.value)}` |
| `x-bind:class` | `className={cn('base', condition && 'active')}` |
| `$refs.input` | `const inputRef = useRef(); <input ref={inputRef} />` |

### Example Conversion

**Blade Template:**
```blade
<div x-data="{ open: false }">
  <button @click="open = !open" class="btn btn-primary">
    Toggle
  </button>
  
  <div x-show="open" class="dropdown">
    Content
  </div>
</div>
```

**React Component:**
```typescript
function Dropdown() {
  const [open, setOpen] = useState(false);
  
  return (
    <div>
      <Button onClick={() => setOpen(!open)}>
        Toggle
      </Button>
      
      {open && (
        <div className="dropdown">
          Content
        </div>
      )}
    </div>
  );
}
```

---

## Mock vs Real Backend

### Current: Mock Mode (Development)
```typescript
// src/lib/api.ts
export const USE_MOCK_DATA = true; // ← Mock mode ON
```

**Features:**
- Instant responses (300ms simulated delay)
- No backend needed
- Realistic data with relationships
- CRUD operations work
- Pagination, filtering work
- Occasional errors (for testing)

### Future: Real Backend

**When backend is ready:**

1. **Create real service implementations:**
```typescript
// src/lib/services/realDirectiveService.ts
import apiClient from '../api';

export async function getAllDirectives(filters) {
  const response = await apiClient.get('/directives', { params: filters });
  return response.data;
}
```

2. **Update service wrappers:**
```typescript
// src/lib/services/directiveService.ts
import { USE_MOCK_DATA } from '../api';
import * as mockService from '../mocks/services/mockDirectiveService';
import * as realService from './realDirectiveService'; // ← Add real service

export const directiveService = {
  getAll: USE_MOCK_DATA 
    ? mockService.getAllDirectives 
    : realService.getAllDirectives, // ← Switch to real
};
```

3. **Toggle flag:**
```typescript
// src/lib/api.ts
export const USE_MOCK_DATA = false; // ← Real backend mode
```

4. **Add auth tokens:**
```typescript
// src/lib/api.ts
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

**That's it!** No component changes needed.

---

## Testing Guidelines

### Test with Mock Data
1. Run dev server: `npm run dev`
2. Login with mock credentials
3. Navigate through modules
4. Test CRUD operations
5. Check filters, pagination, sorting
6. Test error states
7. Test responsive layout

### Test Login Scenarios
- Admin user → should see all modules
- Department user → should see only assigned modules
- Invalid credentials → should show error
- Logout → should clear state

### Test Permissions
- Admin can create/edit/delete
- Department can view/reply only
- Restricted features hidden based on role

---

## Common Issues & Solutions

### Issue: "Cannot find module '@/...'"
**Solution:** Path aliases configured in `vite.config.ts` and `tsconfig.json`. Make sure they match.

### Issue: Mock data not showing
**Solution:** Check `USE_MOCK_DATA = true` in `src/lib/api.ts`

### Issue: TypeScript errors on types
**Solution:** Types defined in `src/types/index.ts`. Import from there.

### Issue: Auth not persisting
**Solution:** Auth store uses `zustand/persist`. Check browser localStorage for `cmdms-auth-storage`.

### Issue: Assets not loading
**Solution:** Assets in `public/assets/`. Reference with `/assets/logos/logo.svg` (no `public/` in path).

---

## Code Style Guidelines

### 1. Component Structure
```typescript
// Imports
import { useState, useEffect } from 'react';
import { YourType } from '@/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils/cn';

// Interface for props
interface YourComponentProps {
  id: number;
  onSave?: () => void;
}

// Component
export function YourComponent({ id, onSave }: YourComponentProps) {
  // State
  const [data, setData] = useState<YourType | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Effects
  useEffect(() => {
    // Fetch data
  }, [id]);
  
  // Handlers
  const handleSave = () => {
    // Handle save
    onSave?.();
  };
  
  // Render
  if (loading) return <div>Loading...</div>;
  if (!data) return <div>Not found</div>;
  
  return (
    <div>
      {/* Component JSX */}
    </div>
  );
}
```

### 2. Naming Conventions
- **Components:** PascalCase (`DirectiveCard`)
- **Files:** PascalCase for components (`DirectiveCard.tsx`)
- **Hooks:** camelCase with `use` prefix (`useDirectives`)
- **Utilities:** camelCase (`formatDate`)
- **Constants:** UPPER_SNAKE_CASE (`MAX_FILE_SIZE`)
- **Types:** PascalCase (`Directive`)

### 3. File Organization
- One component per file
- Keep related components together in folders
- Index files for clean imports
- Co-locate hooks, types, utils with components

---

## Performance Tips

1. **Lazy load routes:**
```typescript
const DirectivesPage = lazy(() => import('./features/directives/pages/DirectivesListPage'));
```

2. **Memoize expensive calculations:**
```typescript
const filteredData = useMemo(() => {
  return data.filter(/* expensive filter */);
}, [data]);
```

3. **Debounce search inputs:**
```typescript
const debouncedSearch = useDebouncedValue(searchTerm, 300);
```

4. **Virtualize long lists:**
```typescript
import { useVirtualizer } from '@tanstack/react-virtual';
```

---

## Git Workflow (When Ready)

```bash
# Create feature branch
git checkout -b feature/directive-module

# Make changes, commit
git add .
git commit -m "feat: add directive listing page"

# Push and create PR
git push origin feature/directive-module
```

---

## Getting Help

### Documentation References
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)
- [Zustand](https://docs.pmnd.rs/zustand/getting-started/introduction)
- [React Router](https://reactrouter.com/)
- [TanStack Table](https://tanstack.com/table/latest)
- [TipTap](https://tiptap.dev/)

### Project-Specific Docs
- `BUSINESS_RULES.md` - System rules and workflows
- `PROGRESS.md` - Development progress
- `CURSOR_CONTEXT.md` - Migration guidelines
- `BACKEND_INTEGRATION.md` - (To be created)

---

**Happy Coding! 🚀**

