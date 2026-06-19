# Task 9-a — Contact + Estimate styling enhancement

**Agent:** full-stack-developer (contact + estimate styling)
**Scope:** Premium visual polish for `src/components/views/contact-view.tsx` and `src/components/views/estimate-view.tsx` — no functional/i18n/logic changes.

## Files modified
- `/home/z/my-project/src/components/views/contact-view.tsx`
- `/home/z/my-project/src/components/views/estimate-view.tsx`

## contact-view.tsx — styling enhancements
1. **Hero backdrop**: applied `radial-gradient` mask to the existing `bg-grid` overlay so it fades into the page edges; added two `animate-float` blur blobs (primary top-left, accent top-right) for a layered mesh effect.
2. **Left-column decorative wrap**: wrapped the contact-details grid in a relative container with a `bg-gradient-to-br from-primary/10 via-accent/5 to-transparent` backdrop plus two `animate-float` accent blobs behind it.
3. **Contact detail cards**: bumped padding to `p-5`, upgraded icon container to a larger `size-12 rounded-full` with gradient fill (primary→accent on hover), `ring-1 ring-inset ring-primary/10`, `group-hover:scale-110` icon scale, and `hover:-translate-y-1 hover:shadow-glow` lift.
4. **Response-time banner**: converted flat accent box to a `bg-gradient-to-br from-accent/10 via-accent/5 to-transparent` panel with a blurred accent glow blob and the Clock icon now lives inside an `bg-accent/15 ring-accent/20` circle.
5. **"What happens next"**: added a vertical gradient connector line (from-primary/60 via-accent/40 to-transparent) running down the list, switched step icons to `bg-gradient-to-br from-primary to-accent` badges with a `ring-4 ring-background` cut-out so the line passes cleanly behind them, and the small numbered badge is now a hollow pill in `bg-background` with `text-primary ring-2 ring-primary/30` for a more refined look. Each step row lifts on hover (`hover:-translate-y-0.5 hover:shadow-soft`).
6. **Social links**: enlarged to `size-10 rounded-xl`, added `shadow-soft`, and on hover they fill with `bg-gradient-to-br from-primary to-accent` and shift to `text-primary-foreground shadow-glow`.
7. **Form card**: wrapped in `group` and added a `h-1 bg-gradient-to-r from-primary via-accent to-primary` top accent that brightens to `opacity-100` on `group-focus-within:`; the card itself lifts and glows on `focus-within:` (`focus-within:-translate-y-0.5 focus-within:shadow-glow`). Card header switched to a subtle `bg-gradient-to-br from-muted/40 to-muted/10` and the title now uses `text-gradient`.
8. **Budget select trigger**: enlarged to `h-12`, `text-base font-medium`, `bg-card shadow-sm`, with `hover:border-primary/40 hover:shadow-soft` to make it feel more prominent and tappable.
9. **Submit button**: replaced the default `bg-primary` with `bg-gradient-to-r from-primary to-primary` and added a `hover:from-primary hover:to-accent hover:shadow-glow` gradient-shift on hover; overlaid an animated `via-white/20` shimmer that sweeps across on `group-hover` (`-translate-x-full → translate-x-full`).
10. **Success state**: re-skinned as a premium celebration card — `bg-gradient-to-br from-primary/5 via-accent/5 to-transparent` panel with a radial accent glow behind, 12 motion-animated confetti dots radiating outward with rotation and fade, an enlarged `size-24` spring-popped gradient check badge (initial scale 0 + rotate -30 → spring physics), an inner CheckCircle2 with its own staggered spring scale-in, an infinitely pulsing accent ring radiating outward, gradient title text, and staggered fade-up reveals for the title/description/CTA. The reset button also got `shadow-soft hover:-translate-y-0.5 hover:shadow-glow`.
11. **Bottom CTA strip**: kept the `bg-secondary` base but overlaid a `bg-grid opacity-10` texture plus two blurred accent/primary blobs, made the card `hover:shadow-glow`, and upgraded the "Get an estimate" link to a gradient pill (`bg-gradient-to-r from-accent to-primary`) with a shimmering translate on the arrow icon.

## estimate-view.tsx — styling enhancements
1. **Hero backdrop**: applied the same radial mask to `bg-grid`, added two `animate-float` blur blobs (primary + accent) for visual depth.
2. **Step indicator**: replaced the muted `<span>` with a gradient pill (`bg-gradient-to-r from-primary/10 to-accent/10` + `ring-1 ring-inset ring-primary/15 px-3.5 py-1.5 rounded-full`); the current step number renders as `text-gradient font-bold`, the "of Y" number renders as `font-bold text-foreground`. The "Estimate ready" success state and the new "Crunching numbers…" state both inherit the pill styling for consistency.
3. **Progress bar**: thickened to `h-2`, kept the `from-primary to-accent` gradient fill, and added a glowing leading-edge dot (`size-3 bg-accent shadow-glow`) at the bar's right edge with an infinitely pulsing scale/opacity ring around it — only visible mid-wizard (0 < progress < 100).
4. **StepHeader**: enlarged the index badge to `size-11 rounded-2xl bg-gradient-to-br from-primary to-accent text-base font-bold shadow-soft`, increased the `pl-14` hint alignment accordingly.
5. **Project type RadioCard**: added `bg-card shadow-soft` base; cards now lift on hover (`hover:-translate-y-1 hover:shadow-glow`) and on selection gain a `bg-gradient-to-br from-primary/10 to-accent/5` tint overlay. The icon container is now a `bg-gradient-to-br from-primary/10 to-accent/10` rounded square with `ring-1 ring-inset ring-primary/10` that fills with the full primary→accent gradient on selection and gains `shadow-glow`.
6. **Page range buttons**: added `shadow-soft` base, lifted hover (`hover:-translate-y-1 hover:shadow-glow`). Selected state now uses `bg-gradient-to-br from-primary/10 to-accent/10 shadow-glow` with a `ring-2 ring-inset ring-primary/40` overlay; the numeric label scales on group hover (`group-hover:scale-110`) and turns into `text-gradient` when active.
7. **Yes/No cards**: introduced distinct color theming — Yes card uses **accent/teal** (CheckCircle2 icon, `bg-accent` active badge, `border-accent/60 from-accent/15 to-accent/5` active state), No card uses **rose** (X icon, `bg-rose-500` active badge, `border-rose-400/60 from-rose-500/10 to-rose-500/5` active state). Idle state still has `bg-card` + lift + glow hover. Imported `X` from lucide-react.
8. **Result screen**: the cost range numbers ballooned from `text-4xl/5xl` to `text-5xl sm:text-6xl lg:text-7xl`; wrapped the whole range in a `motion.div` that floats gently on the y-axis (`y: [0, -6, 0]`, 4s infinite easeInOut) and added a `bg-[radial-gradient(...)] blur-2xl` glow behind it using primary color-mix.
9. **Breakdown**: restyled as a premium receipt — single rounded-2xl card with `shadow-soft`, alternating row backgrounds (`bg-card/60` for even rows, `bg-muted/30` for odd), `border-b border-border/40` dividers between rows, `font-mono` for the cost figures, and a small gradient dot bullet (`bg-gradient-to-r from-primary to-accent`) before each label.
10. **Disclaimer**: kept the muted box, no functional change.
11. **Lead capture form**: wrapped the entire form in a premium card — `rounded-2xl border bg-gradient-to-br from-card to-muted/20 p-5 sm:p-6 shadow-soft` — with a `h-1 bg-gradient-to-r from-primary via-accent to-primary` top border. The submit button mirrors the contact form's gradient hover + shimmer sweep.
12. **Calculating state**: enlarged the spinner halo to `size-20`, layered a static `from-primary/15 to-accent/15 blur-md` glow behind the `animate-ping` ring and spinner, and gave the "Calculating…" text a `text-gradient`.
13. **Saved state**: re-skinned as a full celebration panel — gradient card background, 12 confetti dots radiating out with rotation/scale/opacity animation, an enlarged `size-24` gradient party-popper badge with spring physics (`stiffness: 200, damping: 14`), inner icon staggered spring scale-in, infinitely pulsing accent ring, radial accent glow backdrop, blurred accent halo behind the badge, gradient title text, and staggered fade-up reveals for title/description/CTA buttons. Both action buttons got `shadow-soft hover:-translate-y-0.5 hover:shadow-glow` (and the outline one gains `hover:border-primary/40`).
14. **Main panel Card**: top-of-card 1px gradient accent (`h-0.5 from-primary via-accent to-primary opacity-50 group-hover:opacity-100`) for visual continuity with the contact form.
15. **Wizard nav buttons**: Next / See Estimate buttons got `shadow-soft hover:shadow-glow` for premium tactile feedback.

## Verification
- `bun run lint` → exit 1, but both reported errors are pre-existing in `src/components/views/blog-detail-view.tsx:494` and `src/components/views/portfolio-view.tsx:55` (`react-hooks/set-state-in-effect`), neither of which I touched. **Zero errors and zero warnings in the two files I modified.**
- `bunx tsc --noEmit` → zero TypeScript errors in either modified file.
- `dev.log` → shows multiple `✓ Compiled in <200ms` lines after my edits with no errors.

## Notes for downstream agents
- `X` icon now imported from `lucide-react` in `estimate-view.tsx` (used by the No card). All other imports unchanged.
- Added two module-scope constants: `CONFETTI` (in both files, identical 12-dot trajectory array used by the spring success states). They live outside the component so they're stable across renders.
- No translation keys were added or removed; every `t()` call site and every `lang === 'fa'` RTL conditional is preserved.
- No data fetching, form validation, API calls, wizard step logic, or component structure was altered — changes are purely CSS/className additions, motion-prop tweaks, and one new decorative import (`X`).
