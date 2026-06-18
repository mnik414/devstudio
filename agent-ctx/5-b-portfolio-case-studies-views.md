# Task 5-b — i18n: Portfolio + Case Studies views

**Agent:** full-stack-developer (i18n Portfolio + Case Studies)
**Task:** Add bilingual (English + Persian/Farsi with RTL) support to 4 view files:
- `src/components/views/portfolio-view.tsx`
- `src/components/views/portfolio-detail-view.tsx`
- `src/components/views/case-studies-view.tsx`
- `src/components/views/case-study-detail-view.tsx`

## Work Log
- Read `worklog.md` and i18n foundation (`src/lib/i18n.ts`, `src/lib/lang-store.ts`, `src/lib/content-i18n.ts`) to confirm available keys + RTL helper classes (`.ltr-num`, `.rtl-flip`).
- Verified translation keys exist in both en + fa dictionaries for all `portfolio.*`, `portfolioDetail.*`, `caseStudies.*`, `caseStudyDetail.*` namespaces.
- Cross-checked existing navbar.tsx + footer.tsx for the established pattern: `const t = useT()` / `const lang = useLang((s) => s.lang)` at the top of each component, `cn('base', lang === 'fa' && 'rtl-flip')` for arrows.

### portfolio-view.tsx
- Hoisted `SORT_OPTIONS` inside `PortfolioView` so labels can use `t('portfolio.sortNewest' | 'sortOldest' | 'sortTitle' | 'sortViews')`.
- Hero: `eyebrow={t('portfolio.eyebrow')}`, gradient title via split on `'. '` so the second segment gets the `text-gradient` span (works for both en and fa because both titles contain `'. '`), `description={t('portfolio.desc')}`.
- Wraps numeric `items.length` in `<span className="ltr-num">`.
- Search input `placeholder={t('portfolio.search')}` + matching `aria-label`.
- Sort label `{t('portfolio.sort')}`.
- Filter chips: `All` → `{t('portfolio.allCategories')}` and `{t('portfolio.allTech')}` for the "All" filter chips.
- `PortfolioCard` now receives `lang` prop; computes `title`/`summary` via `tc('portfolio', item.slug, 'title' | 'summary', item.title | item.summary, lang)`; renders translated text in `<h3>`, `<p>`, and `alt` attributes.
- Wrapped `item.views`, `item.year`, and `+{count}` in `<span className="ltr-num">`.
- Renamed inner `.map((t) => ...)` variables to `techItem` to avoid shadowing the outer `t = useT()`.
- Added `rtl-flip` to: `ArrowRight` (CTA + card footer), `ArrowUpRight` (card title arrow).
- EmptyState: uses `t('portfolio.noResults')` + `t('portfolio.clearFilters')`.
- CTA band: `t('portfolio.ctaTitle')` / `t('portfolio.ctaDesc')` / `t('portfolio.ctaButton')`.

### portfolio-detail-view.tsx
- `PortfolioDetailView`: `t` + `lang` from store; back button uses `t('portfolioDetail.back')` + `ArrowLeft` gets `rtl-flip`.
- Hero: title + summary via `tc('portfolio', item.slug, 'title' | 'summary', item.title | item.summary, lang)`. Action buttons: `t('portfolioDetail.visitLive')`, `t('portfolioDetail.viewCode')`. Meta: `item.year` and `item.views` wrapped in `ltr-num`; `{item.views} {t('portfolioDetail.views')}`. ArrowUpRight gets `rtl-flip`.
- Section headings: `t('portfolioDetail.overview' | 'technologies' | 'features' | 'gallery' | 'caseStudy' | 'related')`.
- Overview cards: `t('portfolioDetail.problem' | 'solution' | 'result')`.
- `CASE_STUDY` array restructured: removed `title: string`, added `titleKey: 'portfolioDetail.challenge' | 'architecture' | 'implementation' | 'outcome'`. `CaseStudySection` calls `t(s.titleKey)` at render; "Step N" uses `ltr-num` for the index.
- `RelatedCard` takes `lang` prop; translates title/summary via `tc('portfolio', …)`; "View Project" via `t('portfolio.viewProject')`; ArrowRight `rtl-flip`.
- `NotFoundState`: `t('portfolioDetail.notFound')` + `t('portfolioDetail.back')`; ArrowLeft `rtl-flip`.
- CTA: `t('portfolioDetail.ctaTitle')` + `t('portfolioDetail.ctaButton')`; ArrowRight `rtl-flip`.

### case-studies-view.tsx
- `CaseStudiesView`: `t` + `lang` from store; hero uses `t('caseStudies.eyebrow' | 'desc')`. Gradient title via split on `', '` so the second segment gets `text-gradient` (works for both en "Real results, real impact" and fa "نتایج واقعی، تأثیر واقعی" — both contain `', '`).
- `CaseStudyCard` receives `lang` prop; translates title + summary via `tc('caseStudy', study.slug, 'title' | 'summary', study.title | study.summary, lang)`.
- "Read Case Study" → `t('caseStudies.readCase')`.
- Added `rtl-flip` to: `ArrowUpRight` (hover badge), `ArrowRight` (card footer + EmptyState + CTA button).
- CTA: `t('caseStudies.ctaTitle')` + `t('caseStudies.ctaButton')`. RTL-aware margins: `cn('ml-2 h-4 w-4', lang === 'fa' && 'rtl-flip ml-0 mr-2')`.
- `EmptyState`: gets `lang` for the same RTL-aware margins.

### case-study-detail-view.tsx
- `CaseStudyDetailView`: `t` + `lang` from store; back button uses `t('caseStudyDetail.back')`; ArrowLeft `rtl-flip` (and `group-hover:-translate-x-0.5` flips to `group-hover:translate-x-0.5`).
- Hero title via `tc('caseStudy', item.slug, 'title', item.title, lang)`; alt text uses translated title.
- `SECTIONS` array restructured: `label: string` → `labelKey: 'caseStudyDetail.problem' | 'analysis' | 'architecture' | 'process' | 'challenges' | 'results' | 'lessons'`.
- `SectionBlock` and `StickyToc` now call `t(section.labelKey)` at render.
- `NotFoundState`: `t('caseStudyDetail.notFound')` + `t('caseStudyDetail.back')`; ArrowLeft `rtl-flip`.
- Final CTA: `t('caseStudyDetail.ctaTitle')` + `t('caseStudyDetail.ctaButton')`; ArrowRight `rtl-flip` with RTL-aware margins (`ml-0 mr-2`).

## Lint + Type Check
- `bun run lint` — passes clean (0 errors, 0 warnings).
- `bunx tsc --noEmit` — 0 errors in any of the 4 edited files. All remaining TS errors are pre-existing in unrelated files (`examples/websocket`, `skills/*`, `src/app/api/admin/route.ts`, `src/lib/i18n.ts` — out of scope).
- Dev server (`dev.log`) compiles successfully with no warnings for the edited files.

## Conventions used
- `import { useT, useLang } from '@/lib/lang-store'`
- `import { tc } from '@/lib/content-i18n'`
- `const t = useT()` + `const lang = useLang((s) => s.lang)` at the top of each component
- `.ltr-num` wraps years, view counts, project counts, step indices
- `.rtl-flip` on every ArrowLeft, ArrowRight, ArrowUpRight that signals direction
- RTL-aware margins: `cn('ml-2 h-4 w-4', lang === 'fa' && 'rtl-flip ml-0 mr-2')`
- All existing styling, animations, layout, logic preserved — only string swaps + RTL class additions
