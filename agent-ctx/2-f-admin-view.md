# Task 2-f — Admin view

**Agent:** full-stack-developer (Admin view)
**File:** `/home/z/my-project/src/components/views/admin-view.tsx`
**Exports:** named `AdminView` (+ default export)

## What was built
A CMS-style admin panel (single client component) that manages all platform content via `/api/admin`.

### Features
- **Login gate** — password-style token input (default `devstudio-admin`); verifies against `GET /api/admin?model=setting` using `X-Admin-Token` header. Toast feedback on success/failure. Back-to-site shortcut.
- **Dashboard** — sticky top bar (Admin Panel title, Authenticated badge, Back-to-site → `useNav.setView('home')`, Logout) + left sidebar listing all 14 resource types with icons, active highlight, "RO" badge for read-only models, and mobile drawer behavior. Main area shows a per-model record table.
- **Resources managed:** portfolio, portfolioCategory, technology, blogPost, blogCategory, tag, caseStudy, testimonial, teamMember, service, faq, lead, contactRequest, setting.
- **Record table** — TanStack Query (`queryKey: ['admin', model]`), sticky TableHeader, columns: truncated ID + key fields (booleans → Yes/No badges) + createdAt + actions. `max-h-[60vh] overflow-y-auto` scroll. Live search, Refresh, New button (hidden for read-only). Skeletons while loading, error state with retry.
- **EditDialog** — dynamic form per model; create (POST) and edit (PATCH, pre-filled). Field types: text, textarea, number, switch, json, select. JSON fields parsed/validated on serialize.
- **ViewDialog** — read-only detail viewer for `lead` and `contactRequest` (shows all submitted fields).
- **DeleteDialog** — AlertDialog confirmation → DELETE via mutation. Destructive styling.
- All mutations use TanStack `useMutation` with query invalidation + `sonner` toasts.

## Conventions followed
- `'use client'` at top
- shadcn/ui components imported from `@/components/ui/*`
- `useNav` from `@/lib/store`
- `lucide-react` icons
- `sonner` for toasts
- `@tanstack/react-query` for data
- Tailwind classes; responsive (mobile-first)
- Design tokens (`bg-primary`, `text-primary-foreground`, `bg-muted`, `text-muted-foreground`, `border-border`, `bg-background`)
- No test files; no other files modified

## Lint
`bun run lint` — admin-view.tsx passes with **zero errors/warnings**. The only remaining lint error in the repo is pre-existing in `src/components/site/theme-toggle.tsx` (untouched).
