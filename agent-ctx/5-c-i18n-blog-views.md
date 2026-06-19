# Task 5-c — i18n: Blog views

Agent: full-stack-developer (i18n Blog)
Task: Add bilingual (English + Persian/Farsi with RTL) support to `BlogView` and `BlogDetailView`

## Files Modified
- `/home/z/my-project/src/components/views/blog-view.tsx`
- `/home/z/my-project/src/components/views/blog-detail-view.tsx`

## i18n Foundation Used (from Task 4)
- `import { useT, useLang } from '@/lib/lang-store'` — `useT()` returns `t(key, vars?)`; `useLang((s) => s.lang)` gives current language
- `import { tc } from '@/lib/content-i18n'` — `tc('blogPost', slug, 'title'|'excerpt', fallback, lang)` with English fallback
- Translation dictionary in `src/lib/i18n.ts` (keys `blog.*` and `blogDetail.*`)
- RTL CSS utilities in globals.css: `.ltr-num` (force LTR for numbers/dates), `.rtl-flip` (mirror icons)

## BlogView Changes
- **Imports**: added `useT`, `useLang` from `@/lib/lang-store`; `tc` from `@/lib/content-i18n`
- **BlogCard component**: added `t`/`lang`; precompute `title`/`excerpt` via `tc('blogPost', post.slug, 'title'|'excerpt', fallback, lang)`; alt text uses translated title; reading time number wrapped in `<span className="ltr-num">`; date wrapped in `ltr-num`; "min read" → `t('blog.minRead')`
- **FeaturedCard component**: same pattern; "Featured" badge → `t('blog.featured')`; `ArrowUpRight` gets `rtl-flip`; relative date wrapped in `ltr-num`
- **EmptyState component**: "No articles found" → `t('blog.noResults')`; "Clear filters" button → `t('blog.clearAll')`
- **BlogView main**: added `t`; SectionHeading `eyebrow`/`title`/`description` → `t('blog.eyebrow')`/`t('blog.title')`/`t('blog.desc')`; search `placeholder` + `aria-label` → `t('blog.search')`; "Topics"/"Tags"/"All" chip labels → `t('blog.topics')`/`t('blog.tags')`/`t('blog.all')`; status row → `t('blog.showing', { count: rest.length })` and `t('blog.clearAll')`; renamed inner `.map((t) => ...)` tag variable to `tg` to avoid clash with translation function `t`

## BlogDetailView Changes
- **Imports**: added `useT`, `useLang` from `@/lib/lang-store`; `tc` from `@/lib/content-i18n`
- **ShareButtons**: added `t`; success toast → `t('blogDetail.linkCopied')`; "Copy link" button text + Link2 aria-label → `t('blogDetail.copyLink')`; container `aria-label` → `t('blogDetail.share')`. Platform-specific labels (Twitter/LinkedIn) kept as English (no key available)
- **TableOfContents**: `aria-label` + "On this page" heading → `t('blogDetail.contents')`
- **CompactCard** (related articles): added `t`/`lang`; title via `tc`; reading time wrapped in `ltr-num`; "min read" → `t('blog.minRead')`
- **NotFound**: title → `t('blogDetail.notFound')`; back button label → `t('blogDetail.back')`; `ArrowLeft` gets `rtl-flip` and RTL-aware margin swap (`mr-1.5` → `mr-0 ml-1.5` in fa mode)
- **BlogDetailView main**: added `t`/`lang`
  - Back button: label `t('blogDetail.back')`; ArrowLeft `rtl-flip` with hover translate direction swap (`group-hover:-translate-x-0.5` → `group-hover:translate-x-0.5` in fa)
  - Article `<h1>` title and `<p>` excerpt via `tc('blogPost', item.slug, ...)`
  - Cover image `alt` via `tc`
  - `<ShareButtons>` receives translated title
  - Meta row: `formatDate(item.createdAt)` wrapped in `ltr-num`; `item.readingTime` wrapped in `ltr-num` + `t('blog.minRead')`; `item.views` wrapped in `ltr-num` + `t('blogDetail.views')`
  - Tags label "Tags" → `t('blog.tags')`; renamed inner `.map((t) =>` tag var to `tg`
  - Author footer card: `item.views + 1` and `item.readingTime` wrapped in `ltr-num`; units `t('blogDetail.views')` and `t('blog.minRead')`
  - Sidebar mini-CTA: "Like what you read?" → `t('blogDetail.likeCta')`; "Start your project" button → `t('blogDetail.startProject')`; ArrowRight gets `rtl-flip`
  - Related section: SectionHeading `title` → `t('blogDetail.related')` (eyebrow "Keep reading" and description kept English — no keys)
  - Final CTA: title → `t('blogDetail.ctaTitle')`; desc → `t('blogDetail.ctaDesc')`; primary button → `t('blogDetail.startProject')` (ArrowRight `rtl-flip` + RTL margin swap `ml-1.5` → `ml-0 mr-1.5`); secondary button → `t('cta.getEstimate')` (existing key); newsletter ArrowUpRight gets `rtl-flip`

## Strings Left in English (no key available)
- BlogView: "Try a different search term or clear your filters.", "{n} articles in the archive"
- BlogDetailView: "The article you're looking for may have been moved or doesn't exist.", "Written by", "We craft digital products that ship fast and scale gracefully.", "Use the headings above to navigate this article.", "Keep reading", "More perspectives from our team.", "Let's build", "or subscribe to our newsletter", "Share on Twitter/X", "Share on LinkedIn", "Failed to copy link"
- Markdown `content` stays as English (per task spec)

## Lint / Type Status
- `bun run lint`: 0 errors / 0 warnings (verified)
- `bunx tsc --noEmit`: 0 errors in modified files (pre-existing errors elsewhere: `examples/`, `skills/`, `src/app/api/admin/route.ts`, `src/lib/i18n.ts` — all out of scope)
- `dev.log`: clean, no errors

## Conventions Followed
- All existing styling, animations, layout, and logic preserved — only strings swapped and RTL-aware classes added
- `const t = useT()` and `const lang = useLang((s) => s.lang)` declared at top of each component that needs translation
- `cn(...)` utility used to compose conditional RTL classes (e.g. `cn('mr-1.5', lang === 'fa' && 'rtl-flip mr-0 ml-1.5')`)
- Numbers and dates consistently wrapped in `<span className="ltr-num">` so they render LTR even inside RTL paragraphs
- Directional arrows (`ArrowUpRight`, `ArrowLeft`, `ArrowRight`) get `rtl-flip` so they point the correct way in Persian
