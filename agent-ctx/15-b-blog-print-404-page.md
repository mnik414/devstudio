# Task 15-b: Blog print + 404 page

## Summary
Added a print-friendly stylesheet + "Print / Save as PDF" button to the blog detail view, and created a premium animated 404 not-found page.

## Files modified
- `src/lib/i18n.ts` — added 6 new i18n keys (en + fa):
  - `blogDetail.print` ("Print / Save as PDF" / "چاپ / ذخیره به‌عنوان PDF")
  - `error.404Title`, `error.404Desc`, `error.backHome`, `error.browseWork`, `error.suggested`
- `src/components/views/blog-detail-view.tsx` — added Printer import, Print button inside ShareButtons, `<style>` block with `@media print` rules, and `no-print`/`article-grid`/`article-content` classes on the appropriate elements

## Files created
- `src/app/not-found.tsx` — premium 404 page with framer-motion animations

## Implementation notes

### Blog print
- Print button is a circular `size-11` button matching the share buttons, with Printer icon, spring hover scale, and primary color tint on hover. Placed inside ShareButtons right after the brand buttons.
- The ShareButtons root div carries `no-print` so the entire share cluster (including the print button itself) is hidden in print output.
- Print stylesheet is a `<style>{`...`}</style>` block at the top of the article render. It hides: `header` (navbar), `footer`, `.no-print`, and `.fixed` (covers reading progress bar, ScrollProgress, BackToTop, CookieConsent, mobile TOC button). It also resets colors to black-on-white, removes shadows/borders/gradients, sets 12pt/1.6 typography, full-width article, single-column content (via `.article-grid`/`.article-content` hooks), `@page { margin: 2cm }`, and `page-break-before: always` on h2 headings.
- Elements explicitly marked `no-print` within the article: back button, share buttons, views count, dynamic "min remaining" badge, tags row, author footer card, TOC sidebar `<aside>`, related articles section, final CTA section.

### 404 page
- `'use client'` component using `useRouter` (next/navigation), `useNav` (setView + router.push('/')), `useT`, `useLang`.
- Full-screen `min-h-screen flex-1` layout with `bg-radial-fade` + `bg-grid` + 3 floating gradient blobs (animate-float with staggered delays).
- Huge "404" with `text-gradient` (7rem → 16rem responsive), spring entrance + subtle floating animation (y: [0, -10, 0] infinite).
- Decorative Compass badge with slow spin animation, and a floating MapPin near the 404.
- Message heading + description from `error.404Title`/`error.404Desc`.
- CTA buttons: "Back to Home" (gradient button → setView('home')) + "Browse Portfolio" (outline button → setView('portfolio')).
- Suggested links: 4-card grid (Portfolio, Blog, Case Studies, Contact) using existing `nav.*` i18n keys, with staggered spring entrance and hover lift.
- Dark mode supported via design tokens (bg-card, border-border, text-muted-foreground, etc.).
- RTL-aware: Home icon margin swaps, ArrowRight gets `rtl-flip` in Persian.

## Verification
- `bun run lint` — 0 errors, 0 warnings
- `bunx tsc --noEmit` — 0 errors in modified/created files
- `curl /nonexistent-route-xyz` returns 404 with "404", "Page not found", "Back to Home", "Browse Portfolio", "Suggested pages" all present
- Dev server compiles cleanly (`✓ Compiled`)
