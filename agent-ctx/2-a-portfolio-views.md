# Task 2-a — Portfolio Views

Agent: full-stack-developer (Portfolio views)
Task: Build `PortfolioView` and `PortfolioDetailView` components

## Files Created
- `/home/z/my-project/src/components/views/portfolio-view.tsx`
- `/home/z/my-project/src/components/views/portfolio-detail-view.tsx`

## PortfolioView — listing page
- Hero with eyebrow "Our Work", gradient title, live project count + "Updated weekly" badge
- Sticky filter bar (top-16, glass): search input (filters by title/summary/description via API `q`), category chips, technology chips (with colored dots from `color` field), and a Sort `Select` (Newest / Oldest / Title A-Z / Most Viewed)
- Local state for `search`, `category`, `tech`, `sort` (memoised into params) passed to `usePortfolios(params)`
- Responsive grid: 1 / 2 / 3 columns. Each card: aspect-video cover with hover zoom (`group-hover:scale-105`), category badge overlay, view count chip, title, 2-line clamp summary, technology badges (max 4 + "+N"), year/client meta, "View Project" link with animated arrow
- Click → `useNav(state => state.openDetail)('portfolio', slug)`
- Loading skeletons (`Skeleton`), error state, empty state (with clear-filters button when filters are active)
- Staggered `Reveal` entrance on cards
- Bottom CTA band (primary bg, grid overlay) → `setView('contact')`

## PortfolioDetailView — detail page
- Reads `detailSlug` from `useNav(state => state.detailSlug)`, uses `usePortfolio(slug)`
- Back button → `closeDetail()` ("← Back to Portfolio")
- Hero: category badge + featured badge, big title, summary, client/year/views meta, liveUrl + repoUrl buttons (with proper external link semantics), large cover image with subtle motion entrance
- Project Overview: 3 cards (Problem / Solution / Result) with AlertCircle, Lightbulb, TrendingUp icons and rose/amber/emerald tone styles
- Technologies Used: pills with inline `color` dot
- Features: parsed via `parseList`, grid with check-icon cards (hover → primary fill)
- Gallery: parsed via `parseList`, responsive grid with masonry-style span variation; shadcn `Dialog` lightbox on click
- Case Study: 4 cards (Challenge / Architecture / Implementation / Outcome) using Flag, Layers, Code2, Trophy icons with step labels
- Related Projects: smaller cards (clicking opens that detail via `openDetail`)
- Final CTA: "Request a Similar Project" → `setView('contact')`
- States: loading skeleton, not-found state with back button (no error noise — `usePortfolio` returns 404 → isError)
- Generous spacing (py-16 / sm:py-20), max-w-7xl, framer-motion entrance animations on hero and CTA

## Conventions followed
- `'use client'` directive at top of both files
- TypeScript with `Portfolio` interface from `@/lib/hooks`
- shadcn imports from `@/components/ui/*`; shared components from `@/components/site/*`
- Design tokens: `text-gradient`, `shadow-soft`, `bg-radial-fade`, `bg-grid`, `bg-muted`, `border`, `text-muted-foreground`, `text-primary`, `bg-primary`
- Mobile-first responsive (`sm:`, `md:`, `lg:`)
- `group` + `group-hover:` patterns for card hover effects
- `<img loading="lazy">` with descriptive alt text
- No tests, no other files modified

## Lint result
- `bun run lint` shows zero issues in either new file
- The only lint error is pre-existing in `src/components/site/theme-toggle.tsx` (set-state-in-effect rule) — not introduced by this task and explicitly out of scope ("Do NOT modify any other files")

## Dev server log
- Previous "Module not found: '@/components/views/portfolio-view'" and `'@/components/views/portfolio-detail-view'` errors are gone
- Remaining module-not-found errors are for views owned by other agents (home-view, case-studies-view, case-study-detail-view, blog-view, blog-detail-view, estimate-view, about-view, admin-view)
