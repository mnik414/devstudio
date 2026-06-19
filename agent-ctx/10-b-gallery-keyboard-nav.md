# Task 10-b — Portfolio gallery keyboard navigation

## Scope
Enhanced `src/components/views/portfolio-detail-view.tsx` → `GallerySection` component.

## Changes
1. **Imports** — added `useEffect` (react), `AnimatePresence` (framer-motion), `ChevronLeft` & `ChevronRight` (lucide-react).
2. **State refactor** — `active` changed from `string | null` (URL) to `number | null` (image index); added `direction` (+1/-1) state for slide animation.
3. **Navigation helpers** — `goPrev` / `goNext` clamp at bounds and set direction.
4. **Keyboard listener** — `useEffect` (mounted only while open) maps `ArrowLeft`/`ArrowRight` to prev/next, mirrored in RTL (`lang === 'fa'`). Escape still handled natively by Radix Dialog.
5. **Prev/Next circular buttons** — size-11, semi-transparent `bg-black/40` + `backdrop-blur`, hover gradient `from-white/25 to-white/5`, disabled state with reduced opacity + reset hover. RTL swaps sides and actions.
6. **AnimatePresence image transition** — `motion.img` keyed by index with fade + 40px directional slide.
7. **Image counter badge** — bottom center, `ltr-num` on both digits, shown only when `total > 1`.
8. **Preserved** — gallery grid, hover overlay, backdrop click-to-close, sr-only DialogTitle/Description, 44px touch targets.

## Verification
- `bun run lint` — clean (no errors, no warnings).
- dev.log — healthy compiles.

## Files touched
- `src/components/views/portfolio-detail-view.tsx` (GallerySection rewrite + import additions)
- `worklog.md` (appended task 10-b section)
