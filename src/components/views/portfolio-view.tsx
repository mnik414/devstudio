'use client'

import { useMemo, useState } from 'react'
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
import {
  usePortfolios,
  usePortfolioFilters,
  type Portfolio,
} from '@/lib/hooks'
import { useNav } from '@/lib/store'
import { cn } from '@/lib/utils'
import { useT, useLang } from '@/lib/lang-store'
import { useFavorites } from '@/lib/favorites-store'
import { tc } from '@/lib/content-i18n'

type SortKey = 'newest' | 'oldest' | 'title' | 'views'

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
  const [category, setCategory] = useState<string>('')
  const [tech, setTech] = useState<string>('')
  const [sort, setSort] = useState<SortKey>('newest')
  const [savedOnly, setSavedOnly] = useState(false)
  const favoriteIds = useFavorites((s) => s.ids)

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
        <div className="bg-grid pointer-events-none absolute inset-0 opacity-50" />
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

      {/* Filter Bar */}
      <section className="sticky top-16 z-30 border-b bg-background/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Search */}
            <div className="relative w-full max-w-sm">
              <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t('portfolio.search')}
                className="pl-9"
                aria-label={t('portfolio.search')}
              />
            </div>

            {/* Sort + Saved */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSavedOnly((v) => !v)}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition',
                  savedOnly
                    ? 'border-accent/40 bg-accent/10 text-accent'
                    : 'border-border/60 bg-background text-muted-foreground hover:text-foreground hover:border-foreground/20',
                )}
                aria-pressed={savedOnly}
              >
                <Bookmark className={cn('h-4 w-4', savedOnly && 'fill-current')} />
                <span className="hidden sm:inline">{t('favorites.saved')}</span>
                {favoriteIds.length > 0 && (
                  <span className="ltr-num rounded-full bg-accent/20 px-1.5 text-xs font-bold">
                    {favoriteIds.length}
                  </span>
                )}
              </button>
              <span className="hidden items-center gap-2 text-sm font-medium text-muted-foreground sm:inline-flex">
                <SlidersHorizontal className="size-4" />
                {t('portfolio.sort')}
              </span>
              <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
                <SelectTrigger className="w-[180px]" aria-label="Sort projects">
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

          {/* Category chips */}
          {categories.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Category
              </span>
              <FilterChip
                active={category === ''}
                onClick={() => setCategory('')}
              >
                {t('portfolio.allCategories')}
              </FilterChip>
              {categories.map((c) => (
                <FilterChip
                  key={c.id}
                  active={category === c.slug}
                  onClick={() => setCategory(c.slug)}
                >
                  {c.name}
                </FilterChip>
              ))}
            </div>
          )}

          {/* Technology chips */}
          {technologies.length > 0 && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Tech
              </span>
              <FilterChip active={tech === ''} onClick={() => setTech('')}>
                {t('portfolio.allTech')}
              </FilterChip>
              {technologies.map((techItem) => (
                <FilterChip
                  key={techItem.id}
                  active={tech === techItem.slug}
                  onClick={() => setTech(techItem.slug)}
                >
                  <span
                    className="inline-block size-2 rounded-full"
                    style={{ background: techItem.color ?? 'var(--accent)' }}
                  />
                  {techItem.name}
                </FilterChip>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Grid */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
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

      {/* CTA band */}
      <section className="border-t bg-secondary">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="relative overflow-hidden rounded-2xl bg-primary px-6 py-12 text-primary-foreground shadow-soft sm:px-12 sm:py-16">
            <div className="bg-grid pointer-events-none absolute inset-0 opacity-20" />
            <div className="relative flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
              <div className="max-w-xl">
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
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all',
        active
          ? 'border-primary bg-primary text-primary-foreground shadow-xs'
          : 'border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground',
      )}
    >
      {children}
    </button>
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
      className="group block h-full w-full cursor-pointer text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-2xl"
    >
      <Card className="h-full overflow-hidden p-0 transition-shadow duration-300 hover:shadow-soft">
        {/* Cover */}
        <div className="relative aspect-video overflow-hidden">
          <img
            src={item.coverImage}
            alt={`${title} cover image`}
            loading="lazy"
            className="size-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          {item.category && (
            <Badge className="absolute top-3 left-3 border-0 bg-white/90 text-foreground shadow-xs backdrop-blur">
              {item.category.name}
            </Badge>
          )}
          <div className="absolute top-3 right-3">
            <FavoriteButton id={item.id} />
          </div>
          <div className="absolute right-3 bottom-3 flex items-center gap-1.5 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur">
            <Eye className="size-3" />
            <span className="ltr-num">{item.views}</span>
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
                  className="inline-flex items-center gap-1.5 font-normal"
                >
                  <span
                    className="inline-block size-1.5 rounded-full"
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
                <span className="truncate">{item.clientName}</span>
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
    <Card className="overflow-hidden p-0">
      <Skeleton className="aspect-video w-full rounded-none" />
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
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed bg-muted/30 px-6 py-20 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
        <FolderOpen className="size-7" />
      </div>
      <h3 className="mt-5 text-lg font-semibold">No projects found</h3>
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
