# Task 5-a — i18n Home + About views

## Files modified
- `src/lib/i18n.ts` — added missing about.* keys to en + fa dictionaries
- `src/components/views/home-view.tsx` — full bilingual + RTL conversion
- `src/components/views/about-view.tsx` — full bilingual + RTL conversion

## i18n.ts — added keys (en + fa)
- `about.ctaDesc`, `about.storyEyebrow`, `about.mvvEyebrow`, `about.mvvDesc`,
  `about.valuesEyebrow`, `about.techEyebrow`, `about.techTitle`, `about.techDesc`,
  `about.sinceDesc`, `about.hqValue`, `about.hqDesc`, `about.shippedDesc`,
  `about.retentionDesc`, `about.statsTeam`, `about.testimonialN`
- Renamed the MVV-card `about.valuesDesc` (which conflicted with the deep-dive
  section's `about.valuesDesc`) to `about.valuesCardDesc` to remove the
  duplicate-key TS error.

## home-view.tsx
- Added imports: `useT, useLang` from `@/lib/lang-store`, `tc` from
  `@/lib/content-i18n`, `cn` from `@/lib/utils`.
- `PROCESS_STEPS` refactored from inline strings to `{ titleKey, descKey }`
  referencing `process.discovery…support` + their `…Desc` variants.
- `heroBadges` and `dashboardStats` arrays built from `t()` calls inside the
  component body so they re-render on language change.
- All sections translated: hero (badge/title/subtitle/CTAs/badges/dashboard
  labels), trusted-by marquee, stats, featured portfolio, services (titles &
  descriptions kept from DB; only labels translated), process, testimonials,
  technologies, FAQ, final CTA.
- `FeaturedPortfolioCard` now calls
  `tc('portfolio', slug, 'title' | 'summary', fallback, lang)` and adds a
  "View Project" footer with `featured.viewProject`.
- RTL: `rtl-flip` class on ArrowRight / ArrowUpRight icons; conditional
  `lang === 'fa' && 'mr-X ml-0'` swaps on horizontal-margined arrows in CTA
  buttons; Quote icon flipped to left side in Persian mode.
- `ltr-num` on numeric values (dashboard counters, year, "+N" tech badge,
  process step indices, stat band counters).

## about-view.tsx
- Added imports: `useT, useLang`, `cn`.
- `MISSION_VISION_VALUES` and `CORE_VALUES` refactored to `{ titleKey, descKey }`
  referencing `about.mission/vision/values(+Desc)` and `about.v1…v6(+Desc)`.
- `STATS` array built inside component using `t('stats.projects' |
  'stats.experience' | 'stats.satisfaction')` and `t('about.statsTeam')`.
- All sections translated: hero, story (eyebrow/title/3 paragraphs/4 stat cards
  with founded/shipped/retention/hq labels + their descriptions), MVV section,
  stats band, team, values deep-dive, technologies, final CTA.
- Team member bios stay from DB (per task spec).
- RTL: `rtl-flip` on all ArrowRight icons in CTA buttons with conditional
  `lang === 'fa' && 'mr-1.5 ml-0'` margin swap.
- `ltr-num` on year (`2012`), Counter outputs (180+, 92%, stats band).

## Verification
- `bun run lint` → exit 0 (no errors, no warnings introduced).
- `bunx tsc --noEmit` → no errors in i18n.ts / home-view.tsx / about-view.tsx
  (only pre-existing errors in examples/, skills/, src/app/api/admin/route.ts).
- `dev.log` shows successful compiles after edits, no runtime errors.
- All translation keys verified against i18n.ts; both en and fa dictionaries
  symmetric for the keys consumed by these two views.
