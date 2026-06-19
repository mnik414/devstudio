'use client'

import { motion } from 'framer-motion'
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Building2,
  FileSearch,
  Sparkles,
} from 'lucide-react'

import { Reveal } from '@/components/site/reveal'
import { SectionHeading } from '@/components/site/section-heading'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { type CaseStudy, parseList, useCaseStudies } from '@/lib/hooks'
import { useNav } from '@/lib/store'
import { cn } from '@/lib/utils'
import { useT, useLang } from '@/lib/lang-store'
import { tc } from '@/lib/content-i18n'

interface CaseStudyMetric {
  label: string
  value: string
}

function MetricChip({ metric }: { metric: CaseStudyMetric }) {
  return (
    <div className="flex flex-col gap-0.5 rounded-lg border border-border/60 bg-muted/40 px-3 py-2">
      <span className="text-sm font-bold leading-none text-gradient sm:text-base">
        {metric.value}
      </span>
      <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
        {metric.label}
      </span>
    </div>
  )
}

function CaseStudyCard({
  study,
  index,
  lang,
  onOpen,
}: {
  study: CaseStudy
  index: number
  lang: 'en' | 'fa'
  onOpen: (slug: string) => void
}) {
  const t = useT()
  const metrics = parseList<CaseStudyMetric>(study.metrics).slice(0, 3)
  const title = tc('caseStudy', study.slug, 'title', study.title, lang)
  const summary = tc('caseStudy', study.slug, 'summary', study.summary, lang)

  return (
    <Reveal delay={index * 0.08} className="h-full">
      <motion.article
        whileHover={{ y: -6 }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        onClick={() => onOpen(study.slug)}
        className="group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-border/70 bg-card shadow-soft transition-colors hover:border-primary/40 hover:shadow-glow"
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

        <div className="relative aspect-video overflow-hidden bg-muted">
          {study.coverImage ? (
            <img
              src={study.coverImage}
              alt={`${title} — cover`}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
              <FileSearch className="h-10 w-10 opacity-40" />
            </div>
          )}
          {/* Base subtle gradient (always visible) */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          {/* Hover gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          {/* Industry badge with gradient background */}
          <div className="absolute left-4 top-4">
            <Badge
              variant="secondary"
              className="border-0 bg-gradient-to-r from-primary to-accent text-white shadow-glow backdrop-blur-md"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-white" />
              {study.industry}
            </Badge>
          </div>
          {/* Top-right circular indicator */}
          <div className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-secondary opacity-0 shadow-soft transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 -translate-y-2">
            <ArrowUpRight className={cn('h-4 w-4', lang === 'fa' && 'rtl-flip')} />
          </div>
          {/* Read Case Study button slides up from bottom */}
          <div className="absolute inset-x-0 bottom-0 translate-y-full transition-transform duration-300 ease-out group-hover:translate-y-0">
            <div className="p-3">
              <span className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg">
                {t('caseStudies.readCase')}
                <ArrowRight className={cn('size-4', lang === 'fa' && 'rtl-flip')} />
              </span>
            </div>
          </div>
        </div>

        <div className="relative flex flex-1 flex-col gap-4 p-6">
          <div className="space-y-2">
            {/* Client name with icon + subtle separator */}
            <div className="flex items-center gap-2">
              <Building2 className="h-3.5 w-3.5 text-primary" />
              <span className="h-3 w-px bg-border/60" aria-hidden />
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                {study.clientName}
              </p>
            </div>
            <h3 className="text-xl font-bold leading-snug tracking-tight text-balance">
              {title}
            </h3>
            <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
              {summary}
            </p>
          </div>

          {metrics.length > 0 && (
            <div className="mt-auto grid grid-cols-3 gap-2">
              {metrics.map((m) => (
                <MetricChip key={m.label} metric={m} />
              ))}
            </div>
          )}
        </div>
      </motion.article>
    </Reveal>
  )
}

function CaseStudyCardSkeleton() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-card shadow-soft">
      <Skeleton className="aspect-video w-full rounded-none" />
      <div className="flex flex-1 flex-col gap-4 p-6">
        <div className="space-y-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        <div className="grid grid-cols-3 gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-lg" />
          ))}
        </div>
        <Skeleton className="mt-auto h-4 w-32" />
      </div>
    </div>
  )
}

function EmptyState() {
  const setView = useNav((s) => s.setView)
  const lang = useLang((s) => s.lang)
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 px-6 py-20 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <FileSearch className="h-7 w-7" />
      </div>
      <h3 className="mt-5 text-lg font-semibold">No case studies yet</h3>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        We&apos;re currently preparing new deep-dive success stories. Check back
        soon — or reach out and become our next featured engagement.
      </p>
      <Button onClick={() => setView('contact')} className="mt-6" size="lg">
        Start a conversation
        <ArrowRight className={cn('ml-2 h-4 w-4', lang === 'fa' && 'rtl-flip ml-0 mr-2')} />
      </Button>
    </div>
  )
}

export function CaseStudiesView() {
  const t = useT()
  const lang = useLang((s) => s.lang)
  const { data, isLoading, isError } = useCaseStudies()
  const openDetail = useNav((s) => s.openDetail)
  const setView = useNav((s) => s.setView)

  const items = data?.items ?? []

  return (
    <div className="relative">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/60 bg-muted/20">
        <div
          className="pointer-events-none absolute inset-0 bg-grid opacity-40"
          style={{
            maskImage:
              'radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 80%)',
            WebkitMaskImage:
              'radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 80%)',
          }}
        />
        <div className="pointer-events-none absolute inset-0 bg-radial-fade" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
          <SectionHeading
            eyebrow={t('caseStudies.eyebrow')}
            title={
              <span>
                {t('caseStudies.title').split(', ')[0]},{' '}
                <span className="text-gradient">
                  {t('caseStudies.title').split(', ')[1] || t('caseStudies.title')}
                </span>
              </span>
            }
            description={t('caseStudies.desc')}
          />
          <Reveal delay={0.15} className="mx-auto mt-8 flex max-w-2xl flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-accent" />
              Outcome-driven narratives
            </span>
            <span className="inline-flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-accent" />
              Engineering & product lessons
            </span>
          </Reveal>
        </div>
      </section>

      {/* Grid */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        {isError ? (
          <EmptyState />
        ) : isLoading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <CaseStudyCardSkeleton key={i} />
            ))}
          </div>
        ) : items.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
            {items.map((study, i) => (
              <CaseStudyCard
                key={study.id}
                study={study}
                index={i}
                lang={lang}
                onOpen={(slug) => openDetail('case-studies', slug)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Bottom CTA */}
      {!isError && items.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary to-accent px-6 py-12 text-center shadow-glow sm:px-12 sm:py-16">
              <div className="pointer-events-none absolute inset-0 bg-grid opacity-10" />
              <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
              <div className="relative">
                <h3 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  {t('caseStudies.ctaTitle')}
                </h3>
                <p className="mx-auto mt-3 max-w-xl text-sm text-white/80 sm:text-base">
                  Have a tough problem worth a deep-dive? Let&apos;s build
                  something measurable together.
                </p>
                <Button
                  onClick={() => setView('contact')}
                  size="lg"
                  variant="secondary"
                  className="mt-7 bg-white text-primary hover:bg-white/90"
                >
                  {t('caseStudies.ctaButton')}
                  <ArrowRight className={cn('ml-2 h-4 w-4', lang === 'fa' && 'rtl-flip ml-0 mr-2')} />
                </Button>
              </div>
            </div>
          </Reveal>
        </section>
      )}
    </div>
  )
}
