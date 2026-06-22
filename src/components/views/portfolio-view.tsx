'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Search,
  ArrowRight,
  ArrowUpRight,
  Eye,
  Calendar,
  Sparkles,
  FolderOpen,
  SlidersHorizontal,
  Bookmark,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Reveal } from '@/components/site/reveal'
import { SectionHeading } from '@/components/site/section-heading'
import { FavoriteButton } from '@/components/site/favorite-button'
import { CompareButton } from '@/components/site/compare-projects'
import {
  usePortfolios,
  usePortfolioFilters,
  type Portfolio,
} from '@/lib/hooks'
import { useNav } from '@/lib/store'
import { cn } from '@/lib/utils'
import { useT, useLang } from '@/lib/lang-store'
import { useFavorites } from '@/lib/favorites-store'
import { tc, tcCategory, tcClient } from '@/lib/content-i18n'

type SortKey = 'newest' | 'oldest' | 'title' | 'views'

/* ------------------------- helpers ------------------------- */

/** Smoothly animates a number from its previous value to the next. */
function AnimatedCounter({ value }: { value: number }) {
  const [display, setDisplay] = useState(value)
  const prev = useRef(value)
  useEffect(() => {
    const from = prev.current
    const to = value
    const duration = 450
    const start = performance.now()
    let raf = 0
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - p, 3)
      setDisplay(Math.round(from + (to - from) * eased))
      if (p < 1) raf = requestAnimationFrame(tick)
      else prev.current = to
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [value])
  return <span className="ltr-num tabular-nums">{display}</span>
}

export function PortfolioView() {
  const t = useT()
  const lang = useLang((s) => s.lang)
  const openDetail = useNav((s) => s.openDetail)
  const setView = useNav((s) => s.setView)

  const SORT_OPTIONS: { value: SortKey; label: string }[] = [
    { value: 'newest', label: t('portfolio.sortNewest') },
    { value: 'oldest', label: t('portfolio.sortOldest') },
    { value: 'title', label: t('portfolio.sortTitle') },
    { value: 'views', label: t('portfolio.sortViews') },
  ]

  const [search, setSearch] = useState('')
  const [searchFocused, setSearchFocused] = useState(false)
  const [category, setCategory] = useState<string>('')
  const [tech, setTech] = useState<string>('')
  const [sort, setSort] = useState<SortKey>('newest')
  const [savedOnly, setSavedOnly] = useState(false)
  const [stuck, setStuck] = useState(false)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const favoriteIds = useFavorites((s) => s.ids)

  const filterSentinelRef = useRef<HTMLDivElement>(null)

  // Detect when the filter bar becomes "stuck" to the top so we can
  // intensify its background + shadow for a premium sticky feel.
  useEffect(() => {
    const el = filterSentinelRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => setStuck(!entry.isIntersecting),
      { threshold: 0 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const params = useMemo(
    () => ({
      ...(search ? { q: search } : {}),
      ...(category ? { category } : {}),
      ...(tech ? { tech } : {}),
      sort,
    }),
    [search, category, tech, sort],
  )

  const { data, isLoading, isError } = usePortfolios(params)
  const filtersQuery = usePortfolioFilters()

  const allItems: Portfolio[] = data?.items ?? []
  const items: Portfolio[] = savedOnly ? allItems.filter((p) => favoriteIds.includes(p.id)) : allItems
  const categories = filtersQuery.data?.categories ?? []
  const technologies = filtersQuery.data?.technologies ?? []

  return (
    <div className="relative">
      {/* Hero */}
      <section className="relative overflow-hidden border-b bg-radial-fade">
        <div
          className="bg-grid pointer-events-none absolute inset-0 opacity-50"
          style={{
            maskImage: 'radial-gradient(70% 60% at 50% 0%, black 0%, transparent 80%)',
            WebkitMaskImage: 'radial-gradient(70% 60% at 50% 0%, black 0%, transparent 80%)',
          }}
        />
        <div
          className="pointer-events-none absolute -top-24 left-1/2 h-72 w-[40rem] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl"
          aria-hidden
        />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <SectionHeading
            eyebrow={t('portfolio.eyebrow')}
            title={
              <>
                {t('portfolio.title').split('. ')[0]}.{' '}
                <span className="text-gradient">
                  {t('portfolio.title').split('. ')[1] || t('portfolio.title')}
                </span>
              </>
            }
            description={t('portfolio.desc')}
          />
          <Reveal delay={0.15} className="mx-auto mt-8 flex max-w-2xl flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <Sparkles className="size-4 text-accent" />
              <span className="ltr-num">{items.length || 0}</span>{' '}
              live projects
            </span>
            <span className="hidden h-1 w-1 rounded-full bg-muted-foreground/40 sm:inline-block" />
            <span className="inline-flex items-center gap-2">
              <Eye className="size-4 text-accent" />
              Updated weekly
            </span>
          </Reveal>
        </div>
      </section>

      {/* Sticky sentinel — drives the "stuck" state for the filter bar */}
      <div ref={filterSentinelRef} className="pointer-events-none h-px w-full" />

      {/* Filter Bar */}
      <section
        className={cn(
          'sticky top-16 z-30 border-b backdrop-blur-md transition-all duration-300',
          stuck
            ? 'border-border/60 bg-gradient-to-r from-background/95 via-background/90 to-background/95 shadow-soft'
            : 'border-border/40 bg-background/70',
        )}
      >
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-2">
            {/* Search */}
            <div
              className={cn(
                'relative flex-1 rounded-md transition-all duration-300 sm:max-w-xs',
                searchFocused && 'ring-2 ring-primary/20 ring-offset-0',
              )}
            >
              <Search
                className={cn(
                  'pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 transition-all duration-300',
                  searchFocused ? 'scale-110 text-primary' : 'text-muted-foreground',
                )}
              />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                placeholder={t('portfolio.search')}
                className="pl-9 h-9 text-sm"
                aria-label={t('portfolio.search')}
              />
            </div>

            {/* Filters toggle + Sort + Saved */}
            <div className="flex items-center gap-1.5">
              {/* Filters toggle (mobile only) */}
              {(categories.length > 0 || technologies.length > 0) && (
                <button
                  type="button"
                  onClick={() => setFiltersOpen((v) => !v)}
                  className={cn(
                    'inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition sm:hidden',
                    filtersOpen || category || tech
                      ? 'border-accent/40 bg-accent/10 text-accent'
                      : 'border-border/60 bg-background text-muted-foreground hover:text-foreground hover:border-foreground/20',
                  )}
                >
                  <SlidersHorizontal className="size-3.5" />
                  Filters
                  {(category || tech) && (
                    <span className="flex size-4 items-center justify-center rounded-full bg-accent text-[9px] font-bold text-accent-foreground">
                      {(category ? 1 : 0) + (tech ? 1 : 0)}
                    </span>
                  )}
                </button>
              )}
              <button
                onClick={() => setSavedOnly((v) => !v)}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-xs font-medium transition',
                  savedOnly
                    ? 'border-accent/40 bg-accent/10 text-accent'
                    : 'border-border/60 bg-background text-muted-foreground hover:text-foreground hover:border-foreground/20',
                )}
                aria-pressed={savedOnly}
              >
                <Bookmark className={cn('h-3.5 w-3.5', savedOnly && 'fill-current')} />
                <span className="hidden sm:inline">{t('favorites.saved')}</span>
                {favoriteIds.length > 0 && (
                  <span className="ltr-num rounded-full bg-accent/20 px-1.5 text-[10px] font-bold">
                    {favoriteIds.length}
                  </span>
                )}
              </button>
              <CompareButton />
              <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
                <SelectTrigger
                  className="h-9 w-32 border-primary/20 bg-gradient-to-r from-primary/10 to-accent/10 text-xs font-medium hover:from-primary/15 hover:to-accent/15 sm:w-[160px]"
                  aria-label="Sort projects"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SORT_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Collapsible chips (mobile) / always visible (desktop) */}
          <div className={cn(filtersOpen || 'hidden', 'sm:block')}>
            {/* Category chips */}
            {categories.length > 0 && (
              <div className="mt-3 flex items-center gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                <span className="shrink-0 text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">
                  Category
                </span>
                <FilterChip groupId="cat" active={category === ''} onClick={() => setCategory('')}>
                  {t('portfolio.allCategories')}
                </FilterChip>
                {categories.map((c) => (
                  <FilterChip
                    key={c.id}
                    groupId="cat"
                    active={category === c.slug}
                    onClick={() => setCategory(c.slug)}
                  >
                    {tcCategory(c.slug, c.name, lang)}
                  </FilterChip>
                ))}
              </div>
            )}

            {/* Technology chips */}
            {technologies.length > 0 && (
              <div className="mt-2 flex items-center gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                <span className="shrink-0 text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">
                  Tech
                </span>
                <FilterChip groupId="tech" active={tech === ''} onClick={() => setTech('')}>
                  {t('portfolio.allTech')}
                </FilterChip>
                {technologies.map((techItem) => (
                  <FilterChip
                    key={techItem.id}
                    groupId="tech"
                    active={tech === techItem.slug}
                    onClick={() => setTech(techItem.slug)}
                  >
                    <span
                      className="inline-block size-2 rounded-full shrink-0"
                      style={{ background: techItem.color ?? 'var(--accent)' }}
                    />
                    {techItem.name}
                  </FilterChip>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        {/* Result count with animated counter */}
        {!isLoading && !isError && items.length > 0 && (
          <div className="mb-6 flex items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              Showing <AnimatedCounter value={items.length} /> projects
            </p>
            <div className="hidden h-px flex-1 bg-gradient-to-r from-border/60 to-transparent sm:block" />
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <PortfolioCardSkeleton key={i} />
            ))}
          </div>
        ) : isError ? (
          <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-12 text-center">
            <p className="text-base font-medium text-destructive">
              Something went wrong while loading projects.
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Please try again in a moment.
            </p>
          </div>
        ) : items.length === 0 ? (
          <EmptyState
            hasFilters={!!(search || category || tech)}
            onClear={() => {
              setSearch('')
              setCategory('')
              setTech('')
            }}
          />
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item, idx) => (
              <Reveal key={item.id} delay={Math.min(idx * 0.05, 0.4)}>
                <PortfolioCard
                  item={item}
                  lang={lang}
                  onClick={() => openDetail('portfolio', item.slug)}
                />
              </Reveal>
            ))}
          </div>
        )}
      </section>

      {/* CTA band — full-width gradient */}
      <section className="relative overflow-hidden border-t bg-gradient-to-r from-primary to-accent">
        <div className="bg-grid pointer-events-none absolute inset-0 opacity-20" />
        <div
          className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-white/10 blur-3xl"
          aria-hidden
        />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div className="max-w-xl text-primary-foreground">
              <h3 className="text-2xl font-bold tracking-tight sm:text-3xl">
                {t('portfolio.ctaTitle')}
              </h3>
              <p className="mt-2 text-sm text-primary-foreground/80 sm:text-base">
                {t('portfolio.ctaDesc')}
              </p>
            </div>
            <Button
              size="lg"
              variant="secondary"
              className="group shrink-0"
              onClick={() => setView('contact')}
            >
              {t('portfolio.ctaButton')}
              <ArrowRight className={cn('size-4 transition-transform group-hover:translate-x-1', lang === 'fa' && 'rtl-flip group-hover:translate-x-1')} />
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

/* ------------------------- Sub components ------------------------- */

function FilterChip({
  active,
  onClick,
  children,
  groupId,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
  groupId: string
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      layout
      transition={{ type: 'spring', stiffness: 400, damping: 32 }}
      className={cn(
        'relative inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
        active
          ? 'border-transparent text-primary-foreground'
          : 'border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground',
      )}
    >
      {active && (
        <motion.span
          layoutId={`filter-chip-${groupId}`}
          className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-primary/85 shadow-xs"
          transition={{ type: 'spring', stiffness: 400, damping: 32 }}
        />
      )}
      <span className="relative z-10 flex items-center gap-1.5">{children}</span>
    </motion.button>
  )
}

function PortfolioCard({
  item,
  lang,
  onClick,
}: {
  item: Portfolio
  lang: 'en' | 'fa'
  onClick: () => void
}) {
  const t = useT()
  const title = tc('portfolio', item.slug, 'title', item.title, lang)
  const summary = tc('portfolio', item.slug, 'summary', item.summary, lang)
  return (
    <motion.div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="group relative block h-full w-full cursor-pointer rounded-2xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      {/* Gradient border ring on hover */}
      <span
        className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-br from-primary/50 via-accent/30 to-primary/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        aria-hidden
      />
      {/* Shimmer sweep on hover */}
      <span
        className="pointer-events-none absolute -inset-px overflow-hidden rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        aria-hidden
      >
        <span
          className="absolute inset-0 animate-[shimmer_2s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent"
          style={{ transform: 'translateX(-100%)' }}
        />
      </span>
      <Card className="relative h-full overflow-hidden p-0 transition-shadow duration-300 group-hover:shadow-soft">
        {/* Cover */}
        <div className="relative aspect-video overflow-hidden">
          <img
            src={item.coverImage}
            alt={`${title} cover image`}
            loading="lazy"
            className="size-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
          />
          {/* base subtle gradient (always visible) */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          {/* hover dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          {item.category && (
            <Badge className="absolute top-3 left-3 border-0 bg-white/90 text-foreground shadow-xs backdrop-blur">
              {tcCategory(item.category.slug, item.category.name, lang)}
            </Badge>
          )}
          <div className="absolute top-3 right-3">
            <FavoriteButton id={item.id} />
          </div>
          <div className="absolute right-3 bottom-3 flex items-center gap-1.5 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur">
            <Eye className="size-3" />
            <span className="ltr-num">{item.views}</span>
          </div>

          {/* Quick preview overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-300 group-hover:opacity-100">
            <span className="inline-flex translate-y-2 items-center gap-1.5 rounded-full bg-white/15 px-4 py-2 text-sm font-medium text-white ring-1 ring-white/25 backdrop-blur-md transition-transform duration-300 group-hover:translate-y-0">
              Quick preview
              <ArrowUpRight className={cn('size-4', lang === 'fa' && 'rtl-flip')} />
            </span>
          </div>

          {/* View Project button slides up from bottom */}
          <div className="absolute inset-x-0 bottom-0 translate-y-full transition-transform duration-300 ease-out group-hover:translate-y-0">
            <div className="p-3">
              <span className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg">
                {t('portfolio.viewProject')}
                <ArrowRight className={cn('size-4', lang === 'fa' && 'rtl-flip')} />
              </span>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-col gap-3 p-5">
          <div className="flex items-center justify-between gap-3">
            <h3 className="line-clamp-1 text-lg font-semibold tracking-tight">
              {title}
            </h3>
            <ArrowUpRight className={cn('size-5 shrink-0 text-muted-foreground transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary', lang === 'fa' && 'rtl-flip')} />
          </div>

          <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {summary}
          </p>

          {item.technologies && item.technologies.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {item.technologies.slice(0, 4).map((tech) => (
                <Badge
                  key={tech.id}
                  variant="secondary"
                  className="group/tech inline-flex items-center gap-1.5 font-normal transition-colors hover:bg-accent/10"
                >
                  <span
                    className="inline-block size-1.5 rounded-full transition-transform duration-200 group-hover/tech:scale-150"
                    style={{ background: tech.color ?? 'var(--accent)' }}
                  />
                  {tech.name}
                </Badge>
              ))}
              {item.technologies.length > 4 && (
                <Badge variant="outline" className="font-normal">
                  +<span className="ltr-num">{item.technologies.length - 4}</span>
                </Badge>
              )}
            </div>
          )}

          <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="size-3.5" />
            <span className="ltr-num">{item.year}</span>
            {item.clientName && (
              <>
                <span className="text-muted-foreground/40">•</span>
                <span className="truncate">{tcClient(item.clientName, lang)}</span>
              </>
            )}
          </div>

          <div className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
            {t('portfolio.viewProject')}
            <ArrowRight className={cn('size-4 transition-transform group-hover:translate-x-1', lang === 'fa' && 'rtl-flip group-hover:translate-x-1')} />
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

function PortfolioCardSkeleton() {
  return (
    <Card className="relative overflow-hidden p-0">
      {/* Shimmer sweep overlay */}
      <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
        <div
          className="absolute inset-0 animate-[shimmer_1.8s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-foreground/[0.06] to-transparent"
          style={{ transform: 'translateX(-100%)' }}
        />
      </div>
      <Skeleton className="aspect-video w-full rounded-none bg-gradient-to-br from-muted to-muted/60" />
      <div className="flex flex-col gap-3 p-5">
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <div className="flex gap-1.5">
          <Skeleton className="h-5 w-14" />
          <Skeleton className="h-5 w-14" />
          <Skeleton className="h-5 w-14" />
        </div>
        <Skeleton className="mt-2 h-4 w-24" />
      </div>
    </Card>
  )
}

function EmptyState({
  hasFilters,
  onClear,
}: {
  hasFilters: boolean
  onClear: () => void
}) {
  const t = useT()
  return (
    <div className="relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed bg-muted/30 px-6 py-20 text-center">
      <div
        className="pointer-events-none absolute -top-12 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-primary/5 blur-2xl"
        aria-hidden
      />
      <div className="relative flex size-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/15 to-accent/15 text-primary ring-1 ring-primary/10">
        <FolderOpen className="size-10" />
      </div>
      <h3 className="mt-6 text-xl font-bold">
        <span className="text-gradient">No projects found</span>
      </h3>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        {hasFilters ? t('portfolio.noResults') : 'Projects will appear here once published.'}
      </p>
      {hasFilters && (
        <Button variant="outline" className="mt-5" onClick={onClear}>
          {t('portfolio.clearFilters')}
        </Button>
      )}
    </div>
  )
}
