'use client'

import { useMemo, useState, type ReactNode } from 'react'
import { format, formatDistanceToNow } from 'date-fns'
import {
  Search,
  Clock,
  ArrowUpRight,
  FileText,
  Sparkles,
  type LucideIcon,
} from 'lucide-react'
import { Reveal } from '@/components/site/reveal'
import { SectionHeading } from '@/components/site/section-heading'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useNav } from '@/lib/store'
import { useBlogPosts, useBlogFilters, type BlogPost } from '@/lib/hooks'
import { useT, useLang } from '@/lib/lang-store'
import { tc } from '@/lib/content-i18n'
import { cn } from '@/lib/utils'

/* ------------------------------ helpers ------------------------------ */

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? '')
    .join('')
}

const AVATAR_PALETTE = [
  'bg-blue-500',
  'bg-emerald-500',
  'bg-amber-500',
  'bg-rose-500',
  'bg-violet-500',
  'bg-cyan-500',
  'bg-pink-500',
  'bg-teal-500',
]

function colorFromString(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash)
  return AVATAR_PALETTE[Math.abs(hash) % AVATAR_PALETTE.length]
}

function formatDate(iso: string): string {
  try {
    return format(new Date(iso), 'MMM d, yyyy')
  } catch {
    return ''
  }
}

function relativeDate(iso: string): string {
  try {
    return formatDistanceToNow(new Date(iso), { addSuffix: true })
  } catch {
    return ''
  }
}

/* ------------------------------ avatar ------------------------------ */

function AuthorAvatar({
  post,
  size = 'sm',
}: {
  post: BlogPost
  size?: 'sm' | 'md' | 'lg'
}) {
  const sizeCls =
    size === 'lg'
      ? 'h-12 w-12 text-base'
      : size === 'md'
        ? 'h-10 w-10 text-sm'
        : 'h-8 w-8 text-xs'

  if (post.authorAvatar) {
    return (
      <img
        src={post.authorAvatar}
        alt={post.authorName}
        className={cn('rounded-full object-cover ring-2 ring-background', sizeCls)}
      />
    )
  }
  return (
    <div
      className={cn(
        'grid place-items-center rounded-full font-semibold text-white ring-2 ring-background',
        sizeCls,
        colorFromString(post.authorName),
      )}
      aria-hidden
    >
      {getInitials(post.authorName) || 'A'}
    </div>
  )
}

/* ------------------------------ chip ------------------------------ */

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-full border px-3 py-1.5 text-xs font-medium transition-all',
        active
          ? 'border-primary bg-primary text-primary-foreground shadow-sm'
          : 'border-border bg-background hover:border-primary/40 hover:text-primary',
      )}
    >
      {children}
    </button>
  )
}

/* ------------------------------ card ------------------------------ */

function BlogCard({ post, index }: { post: BlogPost; index: number }) {
  const openDetail = useNav((s) => s.openDetail)
  const t = useT()
  const lang = useLang((s) => s.lang)
  const title = tc('blogPost', post.slug, 'title', post.title, lang)
  const excerpt = tc('blogPost', post.slug, 'excerpt', post.excerpt, lang)
  return (
    <Reveal delay={Math.min(index * 0.06, 0.36)}>
      <article
        onClick={() => openDetail('blog', post.slug)}
        className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl"
      >
        <div className="relative aspect-video overflow-hidden">
          <img
            src={post.coverImage}
            alt={title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          {post.category && (
            <Badge className="absolute left-3 top-3 border-transparent bg-background/90 text-foreground backdrop-blur">
              {post.category.name}
            </Badge>
          )}
        </div>
        <div className="flex flex-1 flex-col gap-3 p-5">
          <h3 className="line-clamp-2 text-lg font-semibold leading-snug tracking-tight transition-colors group-hover:text-primary">
            {title}
          </h3>
          <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {excerpt}
          </p>
          <div className="mt-auto flex items-center gap-3 pt-3">
            <AuthorAvatar post={post} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium">{post.authorName}</p>
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>
                  <span className="ltr-num">{post.readingTime}</span> {t('blog.minRead')}
                </span>
                <span aria-hidden>·</span>
                <span className="ltr-num">{formatDate(post.createdAt)}</span>
              </p>
            </div>
          </div>
        </div>
      </article>
    </Reveal>
  )
}

/* ------------------------------ featured ------------------------------ */

function FeaturedCard({ post }: { post: BlogPost }) {
  const openDetail = useNav((s) => s.openDetail)
  const t = useT()
  const lang = useLang((s) => s.lang)
  const title = tc('blogPost', post.slug, 'title', post.title, lang)
  const excerpt = tc('blogPost', post.slug, 'excerpt', post.excerpt, lang)
  return (
    <Reveal>
      <article
        onClick={() => openDetail('blog', post.slug)}
        className="group grid cursor-pointer overflow-hidden rounded-3xl border border-border/60 bg-card shadow-sm transition-all duration-300 hover:border-primary/30 hover:shadow-2xl md:grid-cols-2"
      >
        <div className="relative aspect-video overflow-hidden md:aspect-auto md:min-h-[22rem]">
          <img
            src={post.coverImage}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:via-transparent md:to-black/20" />
          <Badge className="absolute left-4 top-4 gap-1 border-transparent bg-background/90 text-foreground backdrop-blur">
            <Sparkles className="h-3 w-3 text-accent" />
            {t('blog.featured')}
          </Badge>
        </div>
        <div className="flex flex-col justify-center gap-4 p-6 md:p-8 lg:p-10">
          {post.category && (
            <Badge variant="secondary" className="w-fit">
              {post.category.name}
            </Badge>
          )}
          <h3 className="text-2xl font-bold leading-tight tracking-tight transition-colors group-hover:text-primary md:text-3xl">
            {title}
          </h3>
          <p className="line-clamp-3 text-base leading-relaxed text-muted-foreground">
            {excerpt}
          </p>
          <div className="mt-2 flex items-center gap-3">
            <AuthorAvatar post={post} size="md" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{post.authorName}</p>
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>
                  <span className="ltr-num">{post.readingTime}</span> {t('blog.minRead')}
                </span>
                <span aria-hidden>·</span>
                <span className="ltr-num">{relativeDate(post.createdAt)}</span>
              </p>
            </div>
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-border/60 transition-all group-hover:border-primary/40 group-hover:bg-primary group-hover:text-primary-foreground">
              <ArrowUpRight className="h-4 w-4 rtl-flip" />
            </div>
          </div>
        </div>
      </article>
    </Reveal>
  )
}

/* ------------------------------ skeletons ------------------------------ */

function BlogCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card">
      <Skeleton className="aspect-video w-full rounded-none" />
      <div className="flex flex-1 flex-col gap-3 p-5">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <div className="mt-3 flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        </div>
      </div>
    </div>
  )
}

function FeaturedSkeleton() {
  return (
    <div className="grid overflow-hidden rounded-3xl border border-border/60 bg-card md:grid-cols-2">
      <Skeleton className="aspect-video w-full rounded-none md:aspect-auto md:min-h-[22rem]" />
      <div className="flex flex-col justify-center gap-4 p-6 md:p-10">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-8 w-5/6" />
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-3/4" />
        <div className="mt-2 flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3 w-1/3" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------ empty ------------------------------ */

function EmptyState({ onReset }: { onReset: () => void }) {
  const t = useT()
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-border/80 bg-muted/30 px-6 py-16 text-center">
      <div className="grid h-14 w-14 place-items-center rounded-full bg-primary/10 text-primary">
        <FileText className="h-6 w-6" />
      </div>
      <div>
        <h3 className="text-lg font-semibold">{t('blog.noResults')}</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Try a different search term or clear your filters.
        </p>
      </div>
      <button
        type="button"
        onClick={onReset}
        className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
      >
        {t('blog.clearAll')}
      </button>
    </div>
  )
}

/* ------------------------------ icon row item ------------------------------ */

function MetaChip({ icon: Icon, children }: { icon: LucideIcon; children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
      <Icon className="h-3 w-3" />
      {children}
    </span>
  )
}

/* ------------------------------ view ------------------------------ */

export function BlogView() {
  const [q, setQ] = useState('')
  const [category, setCategory] = useState<string>('')
  const [tag, setTag] = useState<string>('')
  const t = useT()

  const params = useMemo(() => {
    const p: Record<string, string> = {}
    if (q.trim()) p.q = q.trim()
    if (category) p.category = category
    if (tag) p.tag = tag
    return p
  }, [q, category, tag])

  const { data, isLoading } = useBlogPosts(params)
  const { data: filtersData, isLoading: filtersLoading } = useBlogFilters()

  const posts = data?.items ?? []

  const isFiltering = !!(q.trim() || category || tag)
  const featured = !isFiltering ? posts.find((p) => p.featured) ?? null : null
  const rest = featured ? posts.filter((p) => p.id !== featured.id) : posts

  const reset = () => {
    setQ('')
    setCategory('')
    setTag('')
  }

  return (
    <section className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      {/* decorative top fade */}
      <div className="bg-radial-fade pointer-events-none absolute inset-x-0 top-0 -z-10 h-80 opacity-60" />

      {/* Hero */}
      <SectionHeading
        eyebrow={t('blog.eyebrow')}
        title={t('blog.title')}
        description={t('blog.desc')}
      />

      {/* Featured */}
      <div className="mt-12 md:mt-16">
        {isLoading ? (
          <FeaturedSkeleton />
        ) : featured ? (
          <FeaturedCard post={featured} />
        ) : null}
      </div>

      {/* Filter bar */}
      <div className="mt-14 flex flex-col gap-4">
        <div className="relative max-w-xl">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t('blog.search')}
            className="rounded-full pl-9"
            aria-label={t('blog.search')}
          />
        </div>

        <div className="flex flex-col gap-3">
          {!filtersLoading && filtersData?.categories?.length ? (
            <div className="flex flex-wrap items-center gap-2">
              <span className="mr-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {t('blog.topics')}
              </span>
              <Chip active={category === ''} onClick={() => setCategory('')}>
                {t('blog.all')}
              </Chip>
              {filtersData.categories.map((c) => (
                <Chip
                  key={c.id}
                  active={category === c.slug}
                  onClick={() => setCategory(category === c.slug ? '' : c.slug)}
                >
                  {c.name}
                </Chip>
              ))}
            </div>
          ) : null}

          {!filtersLoading && filtersData?.tags?.length ? (
            <div className="flex flex-wrap items-center gap-2">
              <span className="mr-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {t('blog.tags')}
              </span>
              <Chip active={tag === ''} onClick={() => setTag('')}>
                {t('blog.all')}
              </Chip>
              {filtersData.tags.slice(0, 12).map((tg) => (
                <Chip
                  key={tg.id}
                  active={tag === tg.slug}
                  onClick={() => setTag(tag === tg.slug ? '' : tg.slug)}
                >
                  #{tg.name}
                </Chip>
              ))}
            </div>
          ) : null}
        </div>

        {isFiltering && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{t('blog.showing', { count: rest.length })}</span>
            <button
              type="button"
              onClick={reset}
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              {t('blog.clearAll')}
            </button>
          </div>
        )}
      </div>

      {/* Grid */}
      <div className="mt-10">
        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <BlogCardSkeleton key={i} />
            ))}
          </div>
        ) : rest.length === 0 ? (
          <EmptyState onReset={reset} />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((post, i) => (
              <BlogCard key={post.id} post={post} index={i} />
            ))}
          </div>
        )}
      </div>

      {/* footer meta */}
      {!isLoading && rest.length > 0 && (
        <p className="mt-12 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <MetaChip icon={FileText}>
            {posts.length} article{posts.length === 1 ? '' : 's'} in the archive
          </MetaChip>
        </p>
      )}
    </section>
  )
}
