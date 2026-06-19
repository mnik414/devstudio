# Task 10-a — Testimonials + FAQ styling enhancement

## Scope
File: `/home/z/my-project/src/components/views/home-view.tsx`
- `TestimonialsSlider` component
- FAQ section in `HomeView`

## Changes
### Imports
- Added `AnimatePresence` from `framer-motion`.
- Added `ChevronLeft`, `ChevronRight`, `HelpCircle`, `MessageCircleQuestion` from `lucide-react`.

### TestimonialsSlider
- Section wrapper now `relative overflow-hidden` with `bg-radial-fade` + faint `bg-grid` overlay.
- Card: `rounded-3xl`, larger padding `p-8 sm:p-14`, gradient hover border overlay, two floating accent blobs (primary + accent) using `animate-float`, large decorative `Quote` icon at `opacity-5` (RTL-aware positioning).
- Stars: 5 always rendered with per-star motion scale-in animation; filled stars use `fill-accent text-accent`, unfilled use muted tint.
- Slide transition: `AnimatePresence mode="wait"` with `x` translate + fade (RTL-aware direction).
- Avatar: larger `h-14 w-14` with `ring-2 ring-accent/20 ring-offset-2 ring-offset-background`; gradient-initials fallback preserved.
- Meta line: role + dot separator + emphasized company.
- Pagination dots: active dot uses `bg-gradient-to-r from-primary to-accent` with an animated `layoutId` progress overlay as a visual autoplay indicator.
- Navigation: replaced text outline buttons with circular `ChevronLeft`/`ChevronRight` icon buttons that fill with `from-primary to-accent` gradient + `shadow-glow` on hover (RTL-aware via `rtl-flip`).
- CTA "See more work": gradient pill button `from-primary to-accent` with `shadow-glow`.

### FAQ
- Section wrapper: replaced `bg-muted/30` with `bg-radial-fade` + faint `bg-grid`; added two decorative floating `HelpCircle` icons (primary/teal, `animate-float` with staggered `[animation-delay:1.5s]`).
- Accordion items: `rounded-2xl` with hover lift `hover:-translate-y-0.5` + `hover:shadow-soft`; open state applies gradient tint `from-primary/[0.04] to-accent/[0.04]` + `shadow-soft` + animated gradient left border (scale-y origin-top from `from-primary to-accent`).
- Each question gets a gradient-tinted `HelpCircle` badge that fills `from-primary to-accent` (and text becomes `primary-foreground`) when item is open.
- `AccordionContent` indented `pl-12` to align with the question text after the icon badge.
- CTA "Still have questions?" upgraded from link button to a prominent gradient pill button (`h-12`, `from-primary to-accent`, `shadow-glow`) featuring a `MessageCircleQuestion` icon.

## Verification
- `bun run lint` → exit 0, no errors.
- `dev.log` shows successful compilation (`✓ Compiled in 138ms` / `220ms` / `206ms`) with no warnings.

## Preserved
- All existing logic: slider `active` state, prev/next navigation, accordion open/close.
- All i18n keys — no new keys added.
- RTL handling (`useLang()` + `rtl-flip` + RTL-aware icon positions).
- Component structure (no new components; only styling enhancements).
