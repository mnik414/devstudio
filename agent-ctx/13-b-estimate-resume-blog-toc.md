# Task 13-b — Estimate resume + blog mobile TOC

## Scope
Two files modified:
- `/home/z/my-project/src/components/views/estimate-view.tsx`
- `/home/z/my-project/src/components/views/blog-detail-view.tsx`

## Feature 1 — Estimate wizard progress save/resume

### New helpers (module scope)
- `PROGRESS_KEY = 'devstudio-estimate-progress'` localStorage key.
- `emptySubscribe` (no-op subscribe for `useSyncExternalStore`).
- `SavedProgress = { step: number; answers: Answers }` type.
- `readProgress()` — parses stored JSON, validates shape, ignores empty
  (step 0 + no answers) snapshots, clamps step to `[0, TOTAL_STEPS-1]`.
- `writeProgress(progress)` — JSON-stringifies and writes.
- `clearProgress()` — removes the key.

### EstimateView component
- Added `useEffect`, `useSyncExternalStore` to React imports; added `Play`
  to lucide imports.
- `mounted` flag from `useSyncExternalStore(emptySubscribe, () => true, () => false)`
  — SSR-safe (matches cookie-consent pattern).
- `dismissedResume` state — flips true after Resume / Start-over click so
  we don't re-read / re-prompt for the same saved data.
- `savedProgress` derived via `useMemo` from `mounted` + `dismissedResume`
  (computed during render, no setState-in-effect).
- `showResumePrompt = !!savedProgress && stage === 'wizard'`.
- Save effect: `useEffect` writes `{ step, answers }` to localStorage on
  every step/answer change while in the wizard stage. Pure side effect —
  no setState, so no lint violation.
- `handleResume()` — restores answers + step from savedProgress, sets
  `dismissedResume = true`.
- `handleStartOverPrompt()` — `clearProgress()` + `dismissedResume = true`.
- `restart()` now also calls `clearProgress()` + `setDismissedResume(true)`
  (covers both "Run another estimate" button on the saved screen and
  "Start over" inside the result panel).
- `submitLead()` calls `clearProgress()` immediately after `setStage('saved')`
  so the saved entry is wiped on successful completion.

### Resume prompt UI
- Rendered between the progress-bar `Reveal` and the main-panel `Reveal`.
- Wrapped in `<AnimatePresence initial={false}>` for graceful enter/exit.
- Animated `height: 0 → auto` + opacity/y for a smooth slide-down.
- Premium card styling: rounded-2xl, gradient top accent strip, subtle
  `from-primary/[0.06] to-accent/[0.06]` background, soft shadow.
- Icon badge (`RotateCcw` in `bg-primary/10`).
- Message: "Resume your estimate? / You have an incomplete estimate
  (Step X of 7). Continue where you left off or start over." — uses
  `ltr-num` so the digits stay LTR even in Farsi mode.
- Two `Button size="sm" rounded-full` actions: Resume (Play icon, primary)
  and Start over (X icon, outline). RTL-aware icon spacing via
  `lang === 'fa' ? 'ml-1.5' : 'mr-1.5'`.

## Feature 2 — Blog detail mobile TOC toggle

### TableOfContents component
- Added optional `onNavigate?: () => void` prop.
- `handleClick` now branches:
  - With `onNavigate` (mobile): call `onNavigate()` first (closes the
    sheet), then `setTimeout(doScroll, 280)` so the scroll happens after
    Radix releases the body scroll lock (sheet exit ≈ 300ms).
  - Without `onNavigate` (desktop): immediate `scrollIntoView` as before.
- Active-section IntersectionObserver logic unchanged — the mobile sheet
  reuses the same `activeTocId` state, so highlighting works identically
  on both surfaces.

### BlogDetailView component
- Added `Sheet, SheetContent, SheetHeader, SheetTitle` imports.
- Added `tocSheetOpen` state (default false).
- Floating mobile button (rendered only when `toc.length > 0`):
  - `motion.button` with spring entrance (`scale 0.5→1, y 24→0`), tap
    scale 0.92.
  - Fixed bottom-right (LTR) / bottom-left (RTL) — uses
    `ltr:right-6 rtl:left-6`.
  - `lg:hidden` so desktop is untouched.
  - Gradient pill `from-primary to-accent` with `shadow-glow`.
  - Contains `List` icon + label (`t('blogDetail.contents')`).
- `Sheet` (side="bottom"):
  - `max-h-[80vh]`, `p-0` for tight layout, custom close-button offset.
  - `SheetHeader` with `SheetTitle` showing `List` icon badge + label.
  - Body: `max-h-[60vh] overflow-y-auto` with the same `TableOfContents`
    component (reusing `activeTocId`), passing `onNavigate` to close the
    sheet on link click. Falls back to a "Use the headings above…"
    message if TOC is empty (matches the desktop sidebar fallback).

### Preserved behavior
- Desktop sticky sidebar (`<aside className="lg:col-span-1">`) untouched.
- Existing IntersectionObserver, scroll-progress bar, reading-time-remaining
  indicator, share buttons, related articles, and final CTA all unchanged.
- No new i18n keys added — reuses `blogDetail.contents`.

## Verification
- `bun run lint` → exit 0, no errors, no warnings.
- `dev.log` shows successful incremental compilation
  (`✓ Compiled in 220ms` etc.) after edits with no errors.

## Files modified
- `src/components/views/estimate-view.tsx`
- `src/components/views/blog-detail-view.tsx`
