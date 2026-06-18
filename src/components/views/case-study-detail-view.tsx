'use client'

import { motion } from 'framer-motion'
import {
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Building2,
  GitBranch,
  Lightbulb,
  Network,
  Search,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'

import { Reveal } from '@/components/site/reveal'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { type CaseStudy, parseList, useCaseStudy } from '@/lib/hooks'
import { useNav } from '@/lib/store'
import { cn } from '@/lib/utils'
import { useT, useLang } from '@/lib/lang-store'
import { tc } from '@/lib/content-i18n'

interface CaseStudyMetric {
  label: string
  value: string
}

interface SectionDef {
  id: string
  labelKey: string
  icon: LucideIcon
  field: keyof Pick<
    CaseStudy,
    'problem' | 'analysis' | 'architecture' | 'process' | 'challenges' | 'results' | 'lessons'
  >
  highlight?: boolean
}

const SECTIONS: SectionDef[] = [
  { id: 'problem', labelKey: 'caseStudyDetail.problem', icon: AlertCircle, field: 'problem' },
  { id: 'analysis', labelKey: 'caseStudyDetail.analysis', icon: Search, field: 'analysis' },
  { id: 'architecture', labelKey: 'caseStudyDetail.architecture', icon: Network, field: 'architecture' },
  { id: 'process', labelKey: 'caseStudyDetail.process', icon: GitBranch, field: 'process' },
  { id: 'challenges', labelKey: 'caseStudyDetail.challenges', icon: AlertTriangle, field: 'challenges' },
  { id: 'results', labelKey: 'caseStudyDetail.results', icon: TrendingUp, field: 'results', highlight: true },
  { id: 'lessons', labelKey: 'caseStudyDetail.lessons', icon: Lightbulb, field: 'lessons' },
]

function Paragraphs({ text }: { text: string }) {
  const paragraphs = useMemo(
    () => text.split(/\n+/).map((p) => p.trim()).filter(Boolean),
    [text],
  )
  return (
    <div className="space-y-4">
      {paragraphs.map((p, i) => (
        <p key={i} className="text-[15px] leading-relaxed text-muted-foreground sm:text-base">
          {p}
        </p>
      ))}
    </div>
  )
}

function MetricStat({ metric }: { metric: CaseStudyMetric }) {
  return (
    <div className="flex flex-col gap-1 rounded-2xl border border-border/60 bg-card p-5 text-center shadow-soft">
      <span className="text-2xl font-extrabold tracking-tight text-accent sm:text-3xl">
        {metric.value}
      </span>
      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {metric.label}
      </span>
    </div>
  )
}

function SectionBlock({ section, content }: { section: SectionDef; content: string }) {
  const t = useT()
  const Icon = section.icon
  const highlight = section.highlight

  return (
    <div id={section.id} className="scroll-mt-28">
      <Reveal>
        <section
          className={cn(
            'rounded-2xl border p-6 sm:p-8',
            highlight
              ? 'border-accent/30 bg-accent/5'
              : 'border-border/60 bg-card',
          )}
        >
          <div className="mb-4 flex items-center gap-3">
            <span
              className={cn(
                'flex h-10 w-10 items-center justify-center rounded-xl',
                highlight
                  ? 'bg-accent/15 text-accent'
                  : 'bg-primary/10 text-primary',
              )}
            >
              <Icon className="h-5 w-5" />
            </span>
            <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
              {t(section.labelKey)}
            </h2>
          </div>
          <Paragraphs text={content} />
        </section>
      </Reveal>
    </div>
  )
}

function StickyToc({
  activeId,
  onJump,
}: {
  activeId: string
  onJump: (id: string) => void
}) {
  const t = useT()
  return (
    <nav
      aria-label="On this page"
      className="sticky top-24 hidden lg:block"
    >
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        On this page
      </p>
      <ul className="space-y-1 border-l border-border/70">
        {SECTIONS.map((s) => {
          const isActive = activeId === s.id
          return (
            <li key={s.id}>
              <button
                onClick={() => onJump(s.id)}
                className={cn(
                  '-ml-px flex w-full items-center gap-2 border-l-2 px-3 py-1.5 text-left text-sm transition-colors',
                  isActive
                    ? 'border-primary font-semibold text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground',
                )}
              >
                <s.icon className="h-3.5 w-3.5 shrink-0" />
                {t(s.labelKey)}
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

function DetailSkeleton() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <Skeleton className="h-9 w-44" />
      <div className="mt-8 space-y-4">
        <Skeleton className="h-5 w-28" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-2/3" />
        <Skeleton className="h-4 w-48" />
      </div>
      <Skeleton className="mt-8 aspect-video w-full rounded-2xl" />
      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-2xl" />
        ))}
      </div>
      <div className="mt-12 space-y-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-44 rounded-2xl" />
        ))}
      </div>
    </div>
  )
}

function NotFoundState({ onBack }: { onBack: () => void }) {
  const t = useT()
  const lang = useLang((s) => s.lang)
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-32 text-center sm:px-6 lg:px-8">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
        <AlertTriangle className="h-7 w-7" />
      </div>
      <h1 className="mt-5 text-2xl font-bold tracking-tight sm:text-3xl">
        {t('caseStudyDetail.notFound')}
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">
        The case study you&apos;re looking for may have been moved or removed.
      </p>
      <Button onClick={onBack} variant="outline" className="mt-6">
        <ArrowLeft className={cn('mr-2 h-4 w-4', lang === 'fa' && 'rtl-flip mr-0 ml-2')} />
        {t('caseStudyDetail.back')}
      </Button>
    </div>
  )
}

export function CaseStudyDetailView() {
  const t = useT()
  const lang = useLang((s) => s.lang)
  const slug = useNav((s) => s.detailSlug)
  const setView = useNav((s) => s.setView)
  const openDetail = useNav((s) => s.openDetail)
  const { data, isLoading, isError } = useCaseStudy(slug)

  const [activeId, setActiveId] = useState<string>(SECTIONS[0]?.id ?? '')
  const observerRef = useRef<IntersectionObserver | null>(null)

  // Wire up IntersectionObserver to highlight the active section in the TOC.
  useEffect(() => {
    if (!data?.item) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible[0]) {
          setActiveId(visible[0].target.id)
        }
      },
      { rootMargin: '-30% 0px -55% 0px', threshold: [0, 0.25, 0.5, 1] },
    )
    observerRef.current = observer

    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [data?.item])

  const handleJump = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setActiveId(id)
    }
  }

  const handleBack = () => {
    openDetail('case-studies', '') // clears detail slug
    setView('case-studies')
  }

  if (isLoading) return <DetailSkeleton />

  if (isError || !data?.item) return <NotFoundState onBack={handleBack} />

  const item = data.item
  const metrics = parseList<CaseStudyMetric>(item.metrics)
  const title = tc('caseStudy', item.slug, 'title', item.title, lang)

  return (
    <div className="relative">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/60 bg-muted/20">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-40" />
        <div className="pointer-events-none absolute inset-0 bg-radial-fade" />
        <div className="relative mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          <button
            onClick={handleBack}
            className="group inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className={cn('h-4 w-4 transition-transform group-hover:-translate-x-0.5', lang === 'fa' && 'rtl-flip group-hover:translate-x-0.5')} />
            {t('caseStudyDetail.back')}
          </button>

          <Reveal delay={0.05} className="mt-8">
            <Badge
              variant="secondary"
              className="border-0 bg-primary/10 text-primary"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              {item.industry}
            </Badge>
            <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-balance sm:text-4xl md:text-5xl">
              {title}
            </h1>
            <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5 font-semibold text-foreground">
                <Building2 className="h-4 w-4 text-accent" />
                {item.clientName}
              </span>
              <span className="text-border">•</span>
              <span>{item.industry}</span>
            </div>
          </Reveal>

          <Reveal delay={0.12} className="mt-8">
            <div className="relative overflow-hidden rounded-2xl border border-border/60 shadow-soft">
              {item.coverImage ? (
                <img
                  src={item.coverImage}
                  alt={`${title} — cover`}
                  className="aspect-video w-full object-cover"
                />
              ) : (
                <div className="flex aspect-video w-full items-center justify-center bg-muted text-muted-foreground">
                  <Building2 className="h-12 w-12 opacity-30" />
                </div>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Metrics banner */}
      {metrics.length > 0 && (
        <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
          <Reveal>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
              {metrics.map((m) => (
                <MetricStat key={m.label} metric={m} />
              ))}
            </div>
          </Reveal>
        </section>
      )}

      {/* Body: content + sticky TOC */}
      <section className="mx-auto max-w-5xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_220px]">
          <article className="min-w-0 space-y-6">
            {SECTIONS.map((s) => {
              const content = item[s.field] as string | undefined | null
              if (!content || !content.trim()) return null
              return (
                <SectionBlock key={s.id} section={s} content={content} />
              )
            })}
          </article>

          <StickyToc activeId={activeId} onJump={handleJump} />
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-5xl px-4 pb-24 sm:px-6 lg:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-secondary px-6 py-12 text-center shadow-soft sm:px-12 sm:py-14">
            <div className="pointer-events-none absolute inset-0 bg-grid opacity-10" />
            <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-accent/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
            <div className="relative">
              <h2 className="text-2xl font-bold tracking-tight text-secondary-foreground sm:text-3xl">
                {t('caseStudyDetail.ctaTitle')}
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-sm text-secondary-foreground/70 sm:text-base">
                Tell us about your problem. We&apos;ll bring the architecture,
                the engineering, and the obsession with measurable outcomes.
              </p>
              <Button
                onClick={() => setView('contact')}
                size="lg"
                className="mt-7"
              >
                {t('caseStudyDetail.ctaButton')}
                <ArrowRight className={cn('ml-2 h-4 w-4', lang === 'fa' && 'rtl-flip ml-0 mr-2')} />
              </Button>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Subtle motion entry for the whole page */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
    </div>
  )
}
