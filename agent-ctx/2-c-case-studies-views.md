# Task 2-c — full-stack-developer (Case Studies views)

## Scope
Built two `'use client'` view components for the Case Studies feature in the DevStudio platform:
- `src/components/views/case-studies-view.tsx` — premium listing page
- `src/components/views/case-study-detail-view.tsx` — premium detail page

## Decisions / Conventions
- Used `useNav` store for view switching (`openDetail('case-studies', slug)` and `setView('contact')`)
- Used `useCaseStudies()` and `useCaseStudy(slug)` data hooks from `@/lib/hooks`
- Used `parseList<CaseStudyMetric>(study.metrics)` to safely parse the JSON metrics array
- Reused shared `Reveal` (staggered entrance) and `SectionHeading` from `@/components/site/*`
- Imported shadcn `Badge`, `Button`, `Skeleton` from `@/components/ui/*`
- All icons from `lucide-react` (AlertCircle, Search, Network, GitBranch, AlertTriangle, TrendingUp, Lightbulb, ArrowLeft, ArrowRight, ArrowUpRight, BarChart3, Building2, FileSearch, Sparkles)
- Mobile-first responsive: 1 col mobile / 2 col desktop grid for cards
- Detail page uses `max-w-5xl mx-auto` reading column with a sticky TOC sidebar (`lg:grid-cols-[1fr_220px]`)
- Sticky TOC highlights the active section via `IntersectionObserver` (rootMargin `-30% 0px -55% 0px`)
- Results section highlighted with `border-accent/30 bg-accent/5` accent background
- Metrics banner uses `text-accent` for big stat values per spec
- Cover images use plain `<img>` (no eslint rule against it in this project; verified via lint)
- Loading skeleton + empty/error not-found states for both views

## Files Created
1. `/home/z/my-project/src/components/views/case-studies-view.tsx` — 282 lines
2. `/home/z/my-project/src/components/views/case-study-detail-view.tsx` — 363 lines

## Lint / Type Status
- `bun run lint`: my files report 0 errors / 0 warnings. (One pre-existing error in `theme-toggle.tsx` from task 0 — not mine to touch.)
- `bunx tsc --noEmit`: my files produce 0 errors.
- dev.log shows only "Module not found" errors for sibling view files (portfolio-view, portfolio-detail-view, blog-view, etc.) being built in parallel by other agents — not from my files.

## Integration Notes for Downstream Agents
- `CaseStudiesView` is already imported by `src/app/page.tsx` and rendered when `view === 'case-studies'` (no detailSlug)
- `CaseStudyDetailView` is rendered when `view === 'case-studies' && detailSlug` — it reads `detailSlug` from the store
- The detail page back-button calls `openDetail('case-studies', '')` followed by `setView('case-studies')` to safely clear the detail slug and return to the listing
- The bottom CTAs on both views route to `setView('contact')` — the ContactView agent should ensure that view exists
- The CaseStudy interface fields used: `title`, `slug`, `clientName`, `industry`, `coverImage`, `summary`, `problem`, `analysis`, `architecture`, `process`, `challenges`, `results`, `lessons`, `metrics` — all present in the existing `@/lib/hooks` CaseStudy type
