# Task 2-b — Blog Views

Agent: full-stack-developer (Blog views)
Task: Build `BlogView` and `BlogDetailView` components

## Files Created
- `/home/z/my-project/src/components/views/blog-view.tsx` (~473 lines)
- `/home/z/my-project/src/components/views/blog-detail-view.tsx` (~690 lines)

## BlogView — listing page
- Hero with eyebrow "Insights", gradient title "Ideas, tutorials & perspectives", description
- Decorative top radial fade (`bg-radial-fade`)
- Featured post: large hero card (`md:grid-cols-2`) with big image, "Featured" badge with Sparkles icon, category badge, title, 3-line excerpt, author avatar + reading time + relative date, animated arrow CTA. Hidden when filters are active.
- Filter bar: rounded-full search input with Search icon, category chips (Topics), tag chips (Tags, max 12, prefixed with #), and a "Showing N articles · Clear all" status row when filtering
- Responsive grid: 1 col mobile / 2 col sm / 3 col lg, gap-6
- Blog card: aspect-video cover with hover zoom (`group-hover:scale-105`), gradient overlay on hover, category badge overlay, 2-line clamp title, 2-line clamp excerpt, author avatar (initials circle if no avatar) + reading time + formatted date
- Click → `useNav(s => s.openDetail)('blog', slug)`
- Loading skeletons: FeaturedSkeleton (hero) + 6× BlogCardSkeleton
- Empty state: dashed border, icon, "No articles found", Clear filters button
- Footer meta: total article count via MetaChip
- Staggered `Reveal` entrance on cards and featured

## BlogDetailView — article reader
- Reads `detailSlug` from `useNav(s => s.detailSlug)`, uses `useBlogPost(slug)`
- Back button "← Back to Blog": calls `closeDetail()` then `setView('blog')` to safely clear detail slug and return to listing (since the store's `closeDetail` hard-codes view='portfolio', the extra `setView('blog')` ensures correct navigation)
- Reading progress bar: `framer-motion` `useScroll` on the article ref + `useSpring`, rendered as a fixed `top-16` gradient bar (from-primary to-accent), with `origin-left` and `scaleX` transform
- Article hero (max-w-4xl, centered): category badge, large title (text-3xl→text-5xl, balanced), excerpt as subtitle, meta row with author avatar + name + date + reading time + views, share buttons (Twitter, LinkedIn, Link2 icon-only + Copy link text button)
- Share buttons: Twitter/LinkedIn open share intent URLs in new tab; Copy link uses `navigator.clipboard.writeText` with `sonner` toast feedback
- Cover image: full-width rounded-2xl with border, aspect-[16/8]
- Two-column layout (lg:grid-cols-3): main content (lg:col-span-2) + sticky TOC sidebar (lg:col-span-1, `lg:sticky lg:top-24`)
- Markdown rendering via `react-markdown` with custom `Components`:
  - h1/h2/h3/h4 with `scroll-mt-24`, h2 has slugified `id` for TOC anchoring + border-b separator
  - p: muted-foreground, generous line-height
  - a: primary color, underline with offset, opens in new tab
  - ul/ol: list-disc/decimal, pl-6, primary marker color
  - blockquote: border-l-4 primary, muted bg, italic
  - code (inline): rounded bg-muted, primary text, mono font
  - pre: rounded-xl, secondary bg, border, shadow
  - table/thead/th/td: bordered, muted header bg
  - strong/em/hr styled
- TOC generation: parses `## ` lines from markdown (skipping code blocks), slugifies text, renders as anchor links with hover border-l-primary highlight; smooth-scroll on click + `history.replaceState` for hash update without jump
- Sidebar also includes a mini "Like what you read?" CTA card (secondary bg, accent text)
- Below content: tags pills row, author footer card (lg avatar, name, views + reading time)
- Related Articles section: `SectionHeading` (align left, "Keep reading") + grid of CompactCard (horizontal: 28×20 thumbnail + category + 2-line title + reading time)
- Final CTA: dark secondary band with `bg-radial-fade` overlay, "Let's build" eyebrow with accent dot, "Have a project in mind?" title, two buttons (Start your project → contact, Get an estimate → estimate), "or subscribe to our newsletter" link
- Loading skeleton (ArticleSkeleton) with progress bar placeholder
- Not-found state: AlertCircle icon, "Article not found", back button
- Generous spacing: `max-w-6xl mx-auto px-4 sm:px-6 lg:px-8`, `pb-24 pt-8`

## Helpers (shared)
- `getInitials(name)`: first 2 word initials
- `colorFromString(str)`: deterministic palette pick from 8 Tailwind colors (blue, emerald, amber, rose, violet, cyan, pink, teal)
- `formatDate(iso)`: `date-fns` `format(…, 'MMM d, yyyy')`
- `relativeDate(iso)`: `date-fns` `formatDistanceToNow(…, { addSuffix: true })`
- `slugify(text)`: lowercase, strip non-word, collapse whitespace to dashes
- `extractText(node)`: recursively extract text from ReactNode (for heading id generation)
- `extractTOC(markdown)`: parse `## ` lines (skipping code blocks), return `{ id, text }[]`
- `AuthorAvatar`: img if `authorAvatar`, else colored circle with initials (3 sizes)

## Conventions followed
- `'use client'` directive at top of both files
- TypeScript with `BlogPost` interface from `@/lib/hooks`
- shadcn imports: `Badge`, `Button`, `Input`, `Skeleton` from `@/components/ui/*`
- Shared: `Reveal`, `SectionHeading` from `@/components/site/*`
- `useNav` from `@/lib/store`
- All icons from `lucide-react`
- `react-markdown` + `type Components` for typed markdown renderer
- `date-fns` for date formatting
- `sonner` for toast notifications
- Design tokens: `text-primary`, `bg-primary`, `text-accent`, `text-gradient`, `bg-muted`, `text-muted-foreground`, `bg-secondary`, `bg-radial-fade`, `border-border/60`, `bg-card`
- Premium aesthetic: `rounded-2xl`, `rounded-3xl`, subtle shadows, hover transitions (`hover:-translate-y-1`, `hover:shadow-xl`, `group-hover:scale-105`)
- Mobile-first responsive (`sm:`, `md:`, `lg:`)
- No tests, no other files modified

## Lint / Type Status
- `bun run lint` on my two files: **0 errors / 0 warnings** (verified via `npx eslint <files>`)
- The only remaining `bun run lint` error is pre-existing in `src/components/site/theme-toggle.tsx` (set-state-in-effect rule) — introduced by Task 0, explicitly out of scope ("do NOT modify any other files")
- `bunx tsc --noEmit`: my files produce 0 errors
- dev.log shows only "Module not found" errors for sibling view files (home-view, etc.) being built in parallel by other agents — not from my files

## Integration Notes for Downstream Agents
- `BlogView` is imported by `src/app/page.tsx` and rendered when `view === 'blog'` (no detailSlug)
- `BlogDetailView` is rendered when `view === 'blog' && detailSlug` — reads `detailSlug` from the store
- The back button calls `closeDetail()` (per task spec) followed by `setView('blog')` to ensure correct navigation (the store's `closeDetail` currently hard-codes `view: 'portfolio'` — orchestrator may want to make it view-aware for blog/case-study back buttons, similar pattern was used by the case-studies agent)
- Bottom CTAs route to `setView('contact')` and `setView('estimate')` — those views are owned by other agents
- The `BlogPost` interface fields used: `title`, `slug`, `excerpt`, `content`, `coverImage`, `readingTime`, `authorName`, `authorAvatar`, `featured`, `views`, `createdAt`, `category`, `tags` — all present in the existing `@/lib/hooks` BlogPost type
