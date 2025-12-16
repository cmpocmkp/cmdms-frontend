# CMDMS Frontend

A modern React + TypeScript rewrite of the legacy CMDMS system.

## Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v3
- **UI Components**: shadcn/ui
- **Icons**: lucide-react
- **State Management**: Zustand (global) + React Context (auth)
- **Routing**: React Router
- **Forms**: react-hook-form + zod
- **HTTP Client**: Axios
- **Animations**: Framer Motion

## Project Structure

```
src/
├── components/       # Reusable components
│   └── ui/          # shadcn/ui components
├── pages/           # Page components
├── layouts/         # Layout components
├── hooks/           # Custom React hooks
├── store/           # Zustand stores
├── lib/             # Utility functions
│   ├── api.ts      # API client configuration
│   └── utils.ts    # Helper utilities
├── types/           # TypeScript type definitions
├── App.tsx          # Main app component
├── main.tsx         # App entry point
└── index.css        # Global styles
```

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env
   ```
   Update the `.env` file with your API endpoint.

3. **Run development server**:
   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

## Development Guidelines

### Important Rules

1. **DO NOT** modify files in the `../cmdms` directory (legacy codebase)
2. **DO** replicate the exact UI structure and layout from legacy
3. **DO** enhance visual polish without changing layout hierarchy
4. **DO NOT** use direct fetch/axios calls in components - use `src/lib/api.ts`

### Adding shadcn/ui Components

To add new shadcn/ui components:

```bash
npx shadcn-ui@latest add [component-name]
```

Example:
```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add dialog
```

### API Integration

All API calls should go through `src/lib/api.ts`:

```typescript
import { api } from '@/lib/api';

// Example usage
const fetchData = async () => {
  const response = await api.get('/endpoint');
  return response.data;
};
```

### State Management

- **Local UI state**: Use `useState` / `useReducer`
- **Global UI state**: Use Zustand stores in `src/store/`
- **Auth & permissions**: Use React Context (already set up in `src/hooks/useAuth.ts`)

## Migration Status

- [x] Project setup
- [x] Tech stack configuration
- [x] Base folder structure
- [x] Routing structure (React Router)
- [x] Layout components (Admin, Department)
- [x] Authentication store (Zustand)
- [x] API client setup (Axios)
- [x] shadcn/ui components installed
- [ ] Component migration from Blade templates
- [ ] API endpoint integration
- [ ] Authentication flow (currently mock)

## Reference

See `CURSOR_CONTEXT.md` for detailed migration guidelines and rules.

