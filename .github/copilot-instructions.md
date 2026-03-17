# CareMatch — Copilot Instructions

## Project Overview

CareMatch is a mobile-first prototype connecting families of seniors with caregivers in Warsaw. Built as a single-page React app with swipe-based discovery (Tinder-style) and an iOS-inspired design system.

## Tech Stack

- **React 19** + **TypeScript** (strict)
- **Vite 7** (dev server + build)
- **Tailwind CSS 4** (utility-first, `@tailwindcss/vite` plugin)
- **Motion** (framer-motion successor) for animations
- **Base UI** (`@base-ui/react`) for unstyled primitives (Tabs, Dialog)
- **Vaul** for iOS-style Bottom Sheet / Drawer
- **Lucide React** for icons
- **CVA** (class-variance-authority) for component variants
- **pnpm** as package manager

## Architecture

### Features First

Every new piece of functionality starts in `src/components/features/`. A feature component owns its own layout, domain logic, and UI composition — it receives data + callbacks as props but never fetches data itself. Only when a pattern repeats across multiple features should it be extracted into a reusable primitive in `src/components/ui/`. This keeps the codebase flat, discoverable, and avoids premature abstraction.

**Rules:**

1. New feature → create a file in `components/features/` (kebab-case, named export).
2. Don't create a `ui/` primitive until the same visual pattern appears in ≥ 2 features.
3. Keep feature components self-contained — one file per feature, no sub-folders unless complexity demands it.
4. `App.tsx` orchestrates screens, state, and wiring between features — features stay decoupled from each other.

- Single entry: `src/main.tsx` → `App.tsx` (all routing is state-based, no router)
- Two screens: **role selection** and **discovery** (toggled via `screen` state)
- Two user modes: `family` (seeking caregiver) and `caregiver` (seeking jobs)
- Two discovery modes: `cards` (swipe) and `map` (grid list)
- State managed via `useState` in `App.tsx` (no external state library yet)

### Directory Structure

```
src/
  components/
    features/   — domain-specific components (RoleSelector, SwipeCard, ProfileCard, ProfileDrawer, FakeMap, DiscoverySwitcher, SwipeHint)
    ui/          — reusable design system primitives (Button, Badge, GlassCard, GlassDialog, FilterChip, SectionTitle)
  data/          — mock data (caregivers, familyNeeds, allSpecializations)
  types/         — TypeScript domain types (RoleMode, DiscoveryMode, CaregiverProfile, CareNeed, Review, CapabilityTag)
  lib/           — utility functions (cn helper using clsx + tailwind-merge)
```

## Design System — Apple HIG

Follow **Apple Human Interface Guidelines** consistently:

- **Colors**: `#007AFF` (blue/primary), `#34C759` (green/success), `#FF9500` (orange/warning), `#FF3B30` (red/destructive), `#8e8e93` (secondary text), `#1c1c1e` (primary text), `#f2f2f7` (grouped background)
- **Typography**: SF Pro system font stack, tracking values from iOS (`-0.41px` for body, `0.37px` for titles)
- **Borders**: `border-black/4` or `border-white/40` (subtle, never harsh)
- **Shadows**: `shadow-[0_2px_12px_rgba(0,0,0,0.08)]` (soft iOS elevation)
- **Radius**: `rounded-2xl` (16px) for cards, `rounded-full` for pills/badges/buttons
- **Glass morphism**: `bg-white/40 backdrop-blur-2xl` pattern for translucent surfaces
- **Animations**: `motion.button` with `whileTap={{ scale: 0.97, opacity: 0.7 }}` and spring transitions `{ type: "spring", stiffness: 300, damping: 20 }`
- **Bottom sheets**: Use Vaul `<Drawer>` with iOS handle (5px × 36px rounded grabber)

## Coding Conventions

- Use `cn()` helper (from `@/lib/utils`) for conditional class merging
- Path aliases: `@/` maps to `src/`
- Component files: kebab-case (`profile-card.tsx`)
- Named exports for components, default export only for `App`
- Props interfaces defined directly above the component
- Polish language for all UI text and mock data
- No inline styles except for dynamic/computed values (swipe offsets, etc.)
- Prefer Tailwind utility classes over custom CSS (custom CSS only for keyframe animations in `index.css`)

## Component Patterns

- **UI components**: Minimal, accept `className` via `cn()` merge, spread remaining props
- **Feature components**: Receive data + callbacks as props, no internal data fetching
- **Buttons**: Use `<Button>` component with CVA variants (`primary`, `secondary`, `ghost`, `destructive`) and sizes (`sm`, `md`, `lg`, `icon`)
- **Cards**: Wrap content in `<GlassCard>` for consistent styling
- **Dialogs**: Use `<GlassDialog>` (Base UI Dialog) for modals
- **Drawers**: Use `<ProfileDrawer>` (Vaul) for detail views

## Important Notes

- This is a **prototype** — mock data only, no backend
- Images use Unsplash URLs with `w=160&h=160&fit=crop&crop=face` params
- The FakeMap is a pure CSS illustration, not a real map
- Keep bundle light — avoid adding heavy dependencies
