# Task 9-b — Portfolio listing + blog reading features

## Task
Apply premium styling enhancements to the Portfolio listing view and add a real-time "reading time remaining" indicator to the Blog detail view, without changing any existing functionality, translations, data fetching, or component structure.

## Files Modified
1. `/home/z/my-project/src/components/views/portfolio-view.tsx`
2. `/home/z/my-project/src/components/views/blog-detail-view.tsx`

## Work Log
- Read `worklog.md` + both target views to understand the design system (blue #2563EB primary, teal #14B8A6 accent, `bg-radial-fade`, `bg-grid`, `shadow-soft`, `text-gradient`, `ltr-num`, `rtl-flip`) and the existing i18n / hooks wiring.
- Confirmed available design tokens & keyframes (`shimmer`, `bg-radial-fade`, `bg-grid`, `shadow-soft`, `shadow-glow`, `text-gradient`) in `src/app/globals.css`.

### portfolio-view.tsx (premium enhancements, no functional/translation changes)
- Added `AnimatedCounter` helper (RAF-driven eased number animation) used for the "Showing X projects" result count above the grid.
- Hero: kept `bg-radial-fade` + `bg-grid`, added a radial `mask-image` to the grid so it fades out toward the edges, plus a soft blurred primary glow for depth.
- Filter bar: added an `IntersectionObserver` sentinel that flips a `stuck` state — when stuck the bar gains a gradient background (`from-background/95 via-background/90 to-background/95`) + `shadow-soft`; otherwise it stays lighter.
- Search input: tracked `searchFocused` state to apply a `ring-2 ring-primary/20` glow on focus and animate the search icon (`scale-110` + `text-primary`).
- Filter chips: converted `FilterChip` to `motion.button` with a per-group `layoutId` (`filter-chip-cat` / `filter-chip-tech`) so the active background slides smoothly between chips; active state now uses a gradient background.
- Sort select: custom-styled the `SelectTrigger` with a `from-primary/10 to-accent/10` gradient + hover intensification.
- Portfolio cards:
  * Cover image zoom increased to `group-hover:scale-110`.
  * Added a hover-only dark gradient overlay (`from-black/80 via-black/20 to-transparent`).
  * Added a centered "Quick preview" pill (with `ArrowUpRight`) that fades + lifts in on hover.
  * Added a "View Project" button bar that slides up from the bottom of the cover on hover (`translate-y-full → 0`).
  * Added a gradient border ring (`-inset-px` gradient span) that fades in on hover.
  * Added a subtle shimmer sweep across the card border on hover (uses the global `shimmer` keyframe).
  * Tech badges: colored dots now scale (`group-hover/tech:scale-150`) and the badge bg shifts to accent on hover.
- Result count: added a "Showing X projects" row with the `AnimatedCounter` + a fading divider line.
- Empty state: enlarged the icon container to `size-20` with a gradient bg + ring, and applied `text-gradient` to the title; added a soft blurred backdrop glow.
- Loading skeletons: added a moving shimmer sweep overlay (`animate-[shimmer_1.8s...]`) on top of the gradient-tinted cover skeleton.
- Bottom CTA: converted to a full-width gradient band (`bg-gradient-to-r from-primary to-accent`) with `bg-grid` overlay + two blurred white glow blobs, text now in `text-primary-foreground`.

### blog-detail-view.tsx (reading-time-remaining feature only)
- Added `useMotionValueEvent` to the `framer-motion` import.
- Added `remaining` state + `prevReadingTime` state, reset via the React "adjust state during render" pattern (avoids both `setState`-in-effect and ref-during-render lint errors) so the indicator resets when navigating between articles.
- Subscribed to the existing `scrollYProgress` motion value with `useMotionValueEvent('change', …)` and computed `Math.max(0, Math.ceil(readingTime * (1 - latest)))`.
- Added a new badge in the article meta row (after the views badge): `bg-primary/10` pill with a `Clock` icon that shows "X min remaining" while reading and switches to "Finished reading" when `remaining === 0`.
- The numeric minutes are wrapped in `<span className="ltr-num">` for Persian RTL correctness.
- Each value change re-mounts a `motion.span` (keyed by `remaining`) with a subtle `opacity/y` enter transition; the finished state has its own keyed fade-in.

## Lint / Build
- `bun run lint` → clean (0 errors, 0 warnings) after fixing two initial strict-rule violations:
  - Removed `setState`-directly-in-effect in `AnimatedCounter` (now always drives updates through the RAF `tick` callback).
  - Replaced the ref-based reset in `blog-detail-view` with the state-based "adjust state during render" pattern to satisfy `react-hooks/refs` and `react-hooks/set-state-in-effect`.
- Dev server compiles cleanly (`✓ Compiled`) and all API/page routes return 200.

## Stage Summary
- Portfolio listing now feels significantly more premium: masked grid hero, sticky filter bar with stuck-state shadow, focus-glow search, animated sliding filter chips, gradient sort trigger, hover-rich project cards (gradient overlay, quick-preview pill, slide-up CTA, gradient ring, shimmer sweep, scaling tech dots), animated result counter, shimmer skeletons, gradient empty state, and a full-width gradient CTA band.
- Blog detail gained a real-time "X min remaining" reading indicator that derives from the existing `scrollYProgress`, gracefully transitions on each change, switches to "Finished reading" at the end, respects Persian number direction, and resets when switching articles — all without touching existing functionality, translations, or structure.
