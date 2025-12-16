# CURSOR CONTEXT — CMDMS FRONTEND (READ FIRST)

You are working inside the `CMDMS_FEONTEND` folder.

This project is a React + TypeScript rewrite of the legacy CMDMS frontend.
The old CMDMS codebase exists ONLY as a reference.

---

## SOURCE OF TRUTH

- Legacy UI reference: `../cmdms`
  - Stack: Laravel Blade + Tailwind CSS v2 + Alpine.js + Axios
- New implementation: `CMDMS_FEONTEND`
  - Stack: React + TypeScript

DO NOT modify or generate code inside `cmdms`.
Use it ONLY to understand layout, structure, and behavior.

---

## PRIMARY OBJECTIVE

- Replicate the existing CMDMS UI structure and layout exactly.
- Buttons, tables, forms, and information hierarchy MUST remain in the same place.
- Visual design MAY be enhanced (spacing, shadows, hover states, feedback).
- No redesign, no feature removal, no UX flow changes.

Enhance look & feel without changing layout.

---

## FIXED TECH STACK (DO NOT CHANGE)

### Core
- React + TypeScript
- Vite (or Next.js if already set)
- Tailwind CSS (v3 preferred; v2-compatible classes allowed)
- Axios for API calls
- React Router for routing

### State & Context
- useState / useReducer for local UI state
- Zustand for shared/global UI state
- React Context ONLY for authentication & permissions

DO NOT use Redux, MobX, or XState.

---

## UI COMPONENTS & DESIGN

### Component System
- Use `shadcn/ui` components for buttons, inputs, cards, dialogs, tables, dropdowns
- Components must remain fully editable (no black-box UI libraries)

### Icons
- Use `lucide-react` exclusively

### Forms
- Use `react-hook-form` with `zod` for validation

---

## ANIMATION & INTERACTIONS

### Animation Hierarchy
1. Tailwind CSS transitions for hover, focus, small UI changes
2. shadcn/ui or Headless UI for modals, dropdowns, menus, tabs
3. Framer Motion ONLY for page-level or major transitions

Animations must be:
- Subtle
- Professional
- Suitable for a government dashboard
- Never flashy or distracting

DO NOT use GSAP, Anime.js, or excessive motion libraries.

---

## FILE & FOLDER RULES

- Write code ONLY inside `CMDMS_Frontend`
- Old CMDMS files are READ-ONLY references



---

## API RULES

- Use Axios from `src/lib/api.ts`

---

## CURSOR BEHAVIOR RULES

- Always treat `CMDMS_Frontend` as the active workspace
- Ignore PHP, Blade syntax, and Laravel backend logic
- Focus only on HTML structure, Tailwind classes, and UI behavior
- Do NOT invent new UI patterns
- Do NOT move buttons or change layout hierarchy

---

## DESIGN PHILOSOPHY

Enhance clarity, feedback, and polish  
WITHOUT changing structure, flow, or intent.

Think:
- Cleaner
- Sharper
- More responsive
- More confident

NOT:
- Flashy
- Experimental
- Over-animated

---
---
## BACKEND STATUS — IMPORTANT

Backend implementation details are NOT finalized yet.

### Temporary Rules
- Do NOT assume any specific backend framework behavior.
- Do NOT invent API endpoints beyond clearly visible legacy usage.
- Do NOT hardcode request/response shapes unless taken from legacy CMDMS.
- Do NOT implement authentication flows beyond placeholders.

### Allowed Until Backend Is Defined
- Use mock data or temporary interfaces.
- Use placeholder API functions in `src/lib/api.ts`.
- Use TODO comments for endpoints, auth, and permissions.
- Use generic response handling patterns.

### API Usage Pattern (MANDATORY)
All backend interaction must go through:

src/lib/api.ts


Components MUST NOT:
- Call fetch/axios directly
- Contain endpoint strings
- Contain backend-specific logic

### Auth Handling (TEMPORARY)
- Use a mock `useAuth()` hook.
- Assume `user` object shape only when explicitly provided.
- Guard routes using placeholders.

### Future Backend Integration
“Respect backend.md as the only backend contract.”
When backend details are provided:
- Replace mock implementations
- Add real endpoints
- Add real auth
- Keep UI code unchanged


## DEFAULT CONVERSION PROMPT

When converting UI, follow this instruction unless told otherwise:

“Convert the referenced Blade template into a React + TypeScript component inside CMDMS_Frontend. Keep layout and Tailwind classes intact. Replace Alpine behavior with React hooks. Use shadcn/ui components where appropriate to enhance visuals without changing structure.”

---

