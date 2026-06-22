'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Github,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Lightbulb,
  TrendingUp,
  Check,
  Flag,
  Layers,
  Code2,
  Trophy,
  Calendar,
  Building2,
  Eye,
  FileQuestion,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Reveal } from '@/components/site/reveal'
import { SectionHeading } from '@/components/site/section-heading'
import { usePortfolio, parseList, type Portfolio } from '@/lib/hooks'
import { useNav } from '@/lib/store'
import { cn } from '@/lib/utils'
import { useT, useLang } from '@/lib/lang-store'
import { tc } from '@/lib/content-i18n'

export function PortfolioDetailView() {
  const t = useT()
  const lang = useLang((s) => s.lang)
  const slug = useNav((s) => s.detailSlug)
  const closeDetail = useNav((s) => s.closeDetail)
  const setView = useNav((s) => s.setView)
  const openDetail = useNav((s) => s.openDetail)

  const { data, isLoading, isError } = usePortfolio(slug)
  const item = data?.item
  const related = data?.related ?? []

  return (
    <div className="relative">
      {/* Back button */}
      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={closeDetail}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className={cn('size-4', lang === 'fa' && 'rtl-flip')} />
          {t('portfolioDetail.back')}
        </Button>
      </div>

      {isLoading ? (
        <DetailSkeleton />
      ) : isError || !item ? (
        <NotFoundState onBack={closeDetail} />
      ) : (
        <>
          {/* Hero */}
          <Hero item={item} lang={lang} />

          {/* Sticky section nav (desktop only, floating) */}
          <PortfolioSectionNav t={t} lang={lang} item={item} relatedCount={related.length} />

          {/* Description */}
          <section className="mx-auto max-w-7xl px-4 pt-12 sm:px-6 lg:px-8">
            <Reveal>
              <div className="text-base leading-relaxed text-muted-foreground sm:text-lg">
                {tc('portfolio', item.slug, 'description', item.description, lang)
                  .split('\n')
                  .map((p, i) => (
                    <p key={i} className={i > 0 ? 'mt-4' : ''}>{p || '\u00A0'}</p>
                  ))}
              </div>
            </Reveal>
          </section>

          {/* Overview (Problem / Solution / Result) */}
          <section id="overview" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
            <SectionHeading
              eyebrow="Overview"
              title={t('portfolioDetail.overview')}
              align="left"
            />
            <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
              <OverviewCard
                icon={AlertCircle}
                tone="primary"
                title={t('portfolioDetail.problem')}
                text={item.problem}
              />
              <OverviewCard
                icon={Lightbulb}
                tone="accent"
                title={t('portfolioDetail.solution')}
                text={item.solution}
              />
              <OverviewCard
                icon={TrendingUp}
                tone="emerald"
                title={t('portfolioDetail.result')}
                text={item.result}
              />
            </div>
          </section>

          {/* Technologies Used */}
          {item.technologies && item.technologies.length > 0 && (
            <section id="technologies" className="scroll-mt-24 border-y bg-muted/30">
              <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
                <SectionHeading
                  eyebrow="Tech Stack"
                  title={t('portfolioDetail.technologies')}
                  align="left"
                />
                <Reveal delay={0.1} className="mt-8 flex flex-wrap gap-3">
                  {item.technologies.map((techItem) => (
                    <div
                      key={techItem.id}
                      title={techItem.name}
                      className="group inline-flex items-center gap-2.5 rounded-full border bg-background px-4 py-2 text-sm font-medium shadow-xs transition-all duration-200 hover:scale-105 hover:border-primary/40 hover:shadow-soft"
                    >
                      <span
                        className="inline-block size-2.5 rounded-full ring-2 ring-transparent transition-all group-hover:ring-primary/20"
                        style={{ background: techItem.color ?? 'var(--accent)' }}
                      />
                      {techItem.name}
                    </div>
                  ))}
                </Reveal>
              </div>
            </section>
          )}

          {/* Features */}
          {parseList<string>(item.features).length > 0 && (
            <section id="features" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
              <SectionHeading
                eyebrow="Capabilities"
                title={t('portfolioDetail.features')}
                align="left"
              />
              <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {parseList<string>(item.features).map((feature, i) => (
                  <Reveal key={`${feature}-${i}`} delay={Math.min(i * 0.04, 0.3)}>
                    <div className="group flex items-start gap-3 rounded-xl border bg-card p-4 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/30 hover:shadow-soft">
                      <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent ring-1 ring-accent/20 transition-all group-hover:bg-accent group-hover:text-accent-foreground">
                        <Check className="size-4" />
                      </span>
                      <span className="text-sm font-medium leading-relaxed">
                        {feature}
                      </span>
                    </div>
                  </Reveal>
                ))}
              </div>
            </section>
          )}

          {/* Gallery */}
          {parseList<string>(item.gallery).length > 0 && (
            <GallerySection raw={item.gallery} />
          )}

          {/* Case Study */}
          <CaseStudySection item={item} />

          {/* Related Projects */}
          {related.length > 0 && (
            <section id="related" className="scroll-mt-24 border-t bg-muted/30">
              <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
                <SectionHeading
                  eyebrow="Keep exploring"
                  title={t('portfolioDetail.related')}
                  align="left"
                />
                <div className="relative mt-2">
                  <span className="absolute -bottom-1 left-0 h-1 w-32 rounded-full bg-gradient-to-r from-primary to-accent" aria-hidden />
                </div>
                <RelatedProjects
                  items={related}
                  lang={lang}
                  onOpen={(slug) => openDetail('portfolio', slug)}
                />
              </div>
            </section>
          )}

          {/* Final CTA */}
          <section id="cta" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
            <Reveal>
              <div className="relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-accent px-6 py-12 text-primary-foreground shadow-soft sm:px-12 sm:py-16">
                <div className="bg-grid pointer-events-none absolute inset-0 opacity-20" />
                <div className="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full bg-white/10 blur-3xl" aria-hidden />
                <div className="pointer-events-none absolute -bottom-20 -left-20 size-64 rounded-full bg-white/10 blur-3xl" aria-hidden />
                <div className="relative flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
                  <div className="max-w-xl">
                    <h3 className="text-2xl font-bold tracking-tight sm:text-3xl">
                      {t('portfolioDetail.ctaTitle')}
                    </h3>
                    <p className="mt-2 text-sm text-primary-foreground/80 sm:text-base">
                      Inspired by what you see? Let's build something tailored to
                      your goals — start with a free discovery call.
                    </p>
                  </div>
                  <Button
                    size="lg"
                    variant="secondary"
                    className="group shrink-0"
                    onClick={() => setView('contact')}
                  >
                    {t('portfolioDetail.ctaButton')}
                    <ArrowRight className={cn('size-4 transition-transform group-hover:translate-x-1', lang === 'fa' && 'rtl-flip group-hover:translate-x-1')} />
                  </Button>
                </div>
              </div>
            </Reveal>
          </section>
        </>
      )}
    </div>
  )
}

/* ------------------------- Hero ------------------------- */

function Hero({ item, lang }: { item: Portfolio; lang: 'en' | 'fa' }) {
  const t = useT()
  const title = tc('portfolio', item.slug, 'title', item.title, lang)
  const summary = tc('portfolio', item.slug, 'summary', item.summary, lang)
  return (
    <section className="relative overflow-hidden">
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-40" />
      <div className="relative mx-auto max-w-7xl px-4 pt-6 pb-12 sm:px-6 sm:pt-10 sm:pb-16 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-3">
            {item.category && (
              <Badge className="border-0 bg-primary/10 text-primary">
                {item.category.name}
              </Badge>
            )}
            {item.featured && (
              <Badge variant="outline" className="border-accent/40 text-accent">
                Featured
              </Badge>
            )}
          </div>

          <h1 className="mt-5 max-w-4xl text-4xl font-bold tracking-tight text-balance sm:text-5xl md:text-6xl lg:text-[4rem] lg:leading-[1.05]">
            {title}
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {summary}
          </p>

          {/* Meta details */}
          <div className="mt-6 flex flex-wrap items-center gap-5 text-sm text-muted-foreground">
            {item.clientName && (
              <span className="inline-flex items-center gap-2">
                <Building2 className="size-4 text-accent" />
                {item.clientName}
              </span>
            )}
            <span className="inline-flex items-center gap-2">
              <Calendar className="size-4 text-accent" />
              <span className="ltr-num">{item.year}</span>
            </span>
            <span className="inline-flex items-center gap-2">
              <Eye className="size-4 text-accent" />
              <span className="ltr-num">{item.views}</span>{' '}
              {t('portfolioDetail.views')}
            </span>
          </div>

          {/* Action buttons */}
          {(item.liveUrl || item.repoUrl) && (
            <div className="mt-7 flex flex-wrap gap-3">
              {item.liveUrl && (
                <Button asChild size="lg" className="group">
                  <a
                    href={item.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="size-4" />
                    {t('portfolioDetail.visitLive')}
                    <ArrowUpRight className={cn('size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5', lang === 'fa' && 'rtl-flip')} />
                  </a>
                </Button>
              )}
              {item.repoUrl && (
                <Button asChild size="lg" variant="outline" className="group">
                  <a
                    href={item.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="size-4" />
                    {t('portfolioDetail.viewCode')}
                  </a>
                </Button>
              )}
            </div>
          )}
        </motion.div>

        {/* Cover image */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
          className="mt-10 overflow-hidden rounded-2xl border shadow-soft"
        >
          <div className="relative aspect-[16/9]">
            <img
              src={item.coverImage}
              alt={`${title} main cover`}
              className="size-full object-cover"
            />
            {/* Subtle gradient overlay for depth */}
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"
              aria-hidden
            />
            <div className="pointer-events-none absolute bottom-4 left-4 right-4 flex flex-wrap items-center gap-2">
              {item.category && (
                <Badge className="border-0 bg-white/90 text-foreground backdrop-blur">
                  {item.category.name}
                </Badge>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

/* ------------------------- Overview cards ------------------------- */

const TONE_STYLES: Record<
  string,
  { bg: string; ring: string; text: string; border: string }
> = {
  rose: {
    bg: 'bg-rose-500/10',
    ring: 'ring-rose-500/20',
    text: 'text-rose-600 dark:text-rose-400',
    border: 'border-l-rose-500',
  },
  amber: {
    bg: 'bg-amber-500/10',
    ring: 'ring-amber-500/20',
    text: 'text-amber-600 dark:text-amber-400',
    border: 'border-l-amber-500',
  },
  emerald: {
    bg: 'bg-emerald-500/10',
    ring: 'ring-emerald-500/20',
    text: 'text-emerald-600 dark:text-emerald-400',
    border: 'border-l-emerald-500',
  },
  primary: {
    bg: 'bg-primary/10',
    ring: 'ring-primary/20',
    text: 'text-primary',
    border: 'border-l-primary',
  },
  accent: {
    bg: 'bg-accent/10',
    ring: 'ring-accent/20',
    text: 'text-accent',
    border: 'border-l-accent',
  },
}

function OverviewCard({
  icon: Icon,
  tone,
  title,
  text,
}: {
  icon: React.ComponentType<{ className?: string }>
  tone: keyof typeof TONE_STYLES | string
  title: string
  text: string | null
}) {
  const styles = TONE_STYLES[tone] ?? TONE_STYLES.amber
  return (
    <Reveal delay={0.05}>
      <Card
        className={cn(
          'h-full gap-4 border-l-4 p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-glow',
          styles.border,
        )}
      >
        <div className="flex items-center gap-3">
          <span
            className={cn(
              'flex size-10 items-center justify-center rounded-xl ring-1',
              styles.bg,
              styles.ring,
              styles.text,
            )}
          >
            <Icon className="size-5" />
          </span>
          <h3 className="text-base font-semibold">{title}</h3>
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
          {text || `No ${title.toLowerCase()} documented for this project.`}
        </p>
      </Card>
    </Reveal>
  )
}

/* ------------------------- Gallery ------------------------- */

function GallerySection({ raw }: { raw: string }) {
  const t = useT()
  const lang = useLang((s) => s.lang)
  const images = parseList<string>(raw)
  const [active, setActive] = useState<number | null>(null)
  const [direction, setDirection] = useState(0)

  const isRTL = lang === 'fa'
  const total = images.length

  const goPrev = () => {
    setActive((cur) => {
      if (cur === null || cur <= 0) return cur
      setDirection(-1)
      return cur - 1
    })
  }
  const goNext = () => {
    setActive((cur) => {
      if (cur === null || cur >= total - 1) return cur
      setDirection(1)
      return cur + 1
    })
  }

  // Keyboard navigation with RTL awareness
  useEffect(() => {
    if (active === null) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        if (isRTL) goNext()
        else goPrev()
      } else if (e.key === 'ArrowRight') {
        if (isRTL) goPrev()
        else goNext()
      } else if (e.key === 'Escape') {
        setActive(null)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [active, isRTL, total])

  if (images.length === 0) return null

  const variants = {
    enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 40 : -40 }),
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -40 : 40 }),
  }

  const firstBig = (i: number) => images.length >= 5 && (i === 0 || i === 4)

  return (
    <section className="border-y bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <SectionHeading
          eyebrow="Gallery"
          title={t('portfolioDetail.gallery')}
          align="left"
        />
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((src, i) => (
            <Reveal
              key={`${src}-${i}`}
              delay={Math.min(i * 0.05, 0.3)}
              className={cn(
                'group cursor-pointer overflow-hidden rounded-xl border bg-card shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-soft',
                firstBig(i) ? 'sm:col-span-2 sm:row-span-1' : '',
              )}
            >
              <button
                type="button"
                onClick={() => {
                  setDirection(0)
                  setActive(i)
                }}
                className="relative block w-full"
                aria-label={`Open image ${i + 1} in lightbox`}
              >
                <div className={cn('relative overflow-hidden', firstBig(i) ? 'aspect-video' : 'aspect-[4/3]')}>
                  <img
                    src={src}
                    alt={`Project screenshot ${i + 1}`}
                    loading="lazy"
                    className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23e2e8f0"><rect width="24" height="24"/><text x="12" y="14" text-anchor="middle" font-size="3" fill="%2394a3b8">Error</text></svg>'
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-300 group-hover:opacity-100">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-foreground shadow-xs backdrop-blur-xs transition-transform duration-300 group-hover:scale-105">
                      <ExternalLink className="size-3.5" />
                      View
                    </span>
                  </div>
                  <div className="absolute bottom-2 right-2 rounded-full bg-black/50 px-2 py-0.5 text-[11px] font-medium text-white/80 backdrop-blur-xs">
                    {i + 1}/{total}
                  </div>
                </div>
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <Dialog open={active !== null} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent
          className="max-w-5xl border-0 bg-black/95 p-0 sm:rounded-2xl"
          showCloseButton
        >
          <DialogTitle className="sr-only">Screenshot preview</DialogTitle>
          <DialogDescription className="sr-only">
            Full-size project screenshot in a lightbox viewer
          </DialogDescription>
          {active !== null && images[active] && (
            <div className="flex flex-col">
              <div className="relative flex max-h-[75vh] items-center justify-center">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    if (isRTL) goNext()
                    else goPrev()
                  }}
                  disabled={isRTL ? active >= total - 1 : active <= 0}
                  aria-label={isRTL ? 'Next image' : 'Previous image'}
                  className={cn(
                    'absolute z-20 flex size-11 items-center justify-center rounded-full border border-white/15 bg-black/40 text-white backdrop-blur transition-all duration-200',
                    'hover:border-white/30 hover:bg-gradient-to-br hover:from-white/25 hover:to-white/5',
                    'disabled:cursor-not-allowed disabled:opacity-25 disabled:hover:border-white/15 disabled:hover:from-transparent disabled:hover:to-transparent',
                    isRTL ? 'right-3' : 'left-3',
                  )}
                >
                  <ChevronLeft className="size-6" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    if (isRTL) goPrev()
                    else goNext()
                  }}
                  disabled={isRTL ? active <= 0 : active >= total - 1}
                  aria-label={isRTL ? 'Previous image' : 'Next image'}
                  className={cn(
                    'absolute z-20 flex size-11 items-center justify-center rounded-full border border-white/15 bg-black/40 text-white backdrop-blur transition-all duration-200',
                    'hover:border-white/30 hover:bg-gradient-to-br hover:from-white/25 hover:to-white/5',
                    'disabled:cursor-not-allowed disabled:opacity-25 disabled:hover:border-white/15 disabled:hover:from-transparent disabled:hover:to-transparent',
                    isRTL ? 'left-3' : 'right-3',
                  )}
                >
                  <ChevronRight className="size-6" />
                </button>

                <AnimatePresence mode="wait" custom={direction}>
                  <motion.img
                    key={active}
                    src={images[active]}
                    alt={`Project screenshot ${active + 1} of ${total}`}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className="mx-auto h-auto w-full max-h-[75vh] object-contain"
                  />
                </AnimatePresence>

                {total > 1 && (
                  <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1 rounded-full border border-white/15 bg-black/60 px-3 py-1 text-xs font-medium text-white backdrop-blur">
                    <span className="ltr-num">{active + 1}</span>
                    <span className="opacity-60">/</span>
                    <span className="ltr-num">{total}</span>
                  </div>
                )}
              </div>

              {/* Thumbnails strip */}
              {total > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto border-t border-white/10 px-4 py-3">
                  {images.map((src, i) => (
                    <button
                      key={`thumb-${i}`}
                      type="button"
                      onClick={() => {
                        setDirection(i > active ? 1 : -1)
                        setActive(i)
                      }}
                      className={cn(
                        'size-14 shrink-0 overflow-hidden rounded-lg border-2 transition-all duration-200',
                        i === active
                          ? 'border-white opacity-100 ring-1 ring-white/30'
                          : 'border-transparent opacity-60 hover:opacity-90',
                      )}
                    >
                      <img
                        src={src}
                        alt={`Thumbnail ${i + 1}`}
                        className="size-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  )
}

/* ------------------------- Case study ------------------------- */

const CASE_STUDY = [
  {
    key: 'challenge' as const,
    icon: Flag,
    titleKey: 'portfolioDetail.challenge',
    tone: 'rose',
  },
  {
    key: 'architecture' as const,
    icon: Layers,
    titleKey: 'portfolioDetail.architecture',
    tone: 'amber',
  },
  {
    key: 'implementation' as const,
    icon: Code2,
    titleKey: 'portfolioDetail.implementation',
    tone: 'primary',
  },
  {
    key: 'outcome' as const,
    icon: Trophy,
    titleKey: 'portfolioDetail.outcome',
    tone: 'emerald',
  },
]

function CaseStudySection({ item }: { item: Portfolio }) {
  const t = useT()
  const hasAny = CASE_STUDY.some((s) => item[s.key])
  if (!hasAny) return null

  return (
    <section id="case-study" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <SectionHeading
        eyebrow="Case Study"
        title={t('portfolioDetail.caseStudy')}
        description="A deeper look at the journey from problem to outcome."
        align="left"
      />
      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
        {CASE_STUDY.map((s, i) => {
          const text = item[s.key]
          if (!text) return null
          const Icon = s.icon
          const styles = TONE_STYLES[s.tone] ?? TONE_STYLES.amber
          return (
            <Reveal key={s.key} delay={Math.min(i * 0.08, 0.3)}>
              <Card
                className={cn(
                  'relative h-full gap-4 border-l-4 p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-glow',
                  styles.border,
                )}
              >
                {/* Timeline connector dot */}
                <span
                  className={cn(
                    'absolute -left-2.5 top-7 size-5 rounded-full border-4 border-background ring-1',
                    styles.bg,
                    styles.ring,
                  )}
                  aria-hidden
                />
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      'flex size-11 items-center justify-center rounded-xl ring-1',
                      styles.bg,
                      styles.ring,
                      styles.text,
                    )}
                  >
                    <Icon className="size-5" />
                  </span>
                  <div>
                    <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                      Step <span className="ltr-num">{i + 1}</span>
                    </span>
                    <h3 className="text-base font-semibold">{t(s.titleKey)}</h3>
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
                  {text}
                </p>
              </Card>
            </Reveal>
          )
        })}
      </div>
    </section>
  )
}

/* ------------------------- Related projects carousel ------------------------- */

function RelatedProjects({
  items,
  lang,
  onOpen,
}: {
  items: Portfolio[]
  lang: 'en' | 'fa'
  onOpen: (slug: string) => void
}) {
  const isRtl = lang === 'fa'
  const scrollerRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(true)

  /** Distance to advance when an arrow is clicked — uses the first card width. */
  const getStep = useCallback(() => {
    const el = scrollerRef.current
    if (!el) return 320
    const first = el.querySelector<HTMLElement>('[data-card]')
    if (!first) return 320
    const style = getComputedStyle(el)
    const gap = parseFloat(style.columnGap || style.gap || '24') || 24
    return first.offsetWidth + gap
  }, [])

  const updateState = useCallback(() => {
    const el = scrollerRef.current
    if (!el) return
    const cards = el.querySelectorAll<HTMLElement>('[data-card]')
    if (cards.length === 0) return

    // In RTL, scrollLeft is reported as a non-positive number in most browsers.
    // Normalize to a 0..maxScroll positive distance from the visual start.
    const maxScroll = el.scrollWidth - el.clientWidth
    const raw = el.scrollLeft
    const pos = isRtl ? Math.min(Math.abs(raw), maxScroll) : Math.min(Math.max(raw, 0), maxScroll)

    setCanPrev(isRtl ? raw > -1 : pos > 1)
    setCanNext(pos < maxScroll - 1)

    // Determine the closest card to the visual start
    const containerLeft = el.getBoundingClientRect().left
    let closest = 0
    let closestDist = Infinity
    cards.forEach((card, i) => {
      const dist = Math.abs(card.getBoundingClientRect().left - containerLeft)
      if (dist < closestDist) {
        closestDist = dist
        closest = i
      }
    })
    setActiveIndex(closest)
  }, [isRtl])

  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return
    // Defer the initial measurement so we don't trigger a cascading render
    // from inside the effect body.
    const raf = requestAnimationFrame(updateState)
    el.addEventListener('scroll', updateState, { passive: true })
    window.addEventListener('resize', updateState)
    return () => {
      cancelAnimationFrame(raf)
      el.removeEventListener('scroll', updateState)
      window.removeEventListener('resize', updateState)
    }
  }, [updateState])

  const scrollByCards = useCallback(
    (dir: 1 | -1) => {
      const el = scrollerRef.current
      if (!el) return
      // dir=1 means "next" visually. In RTL the scrollLeft value is negative,
      // so we invert the sign to keep semantics consistent.
      const step = getStep() * dir
      el.scrollBy({ left: isRtl ? -step : step, behavior: 'smooth' })
    },
    [getStep, isRtl],
  )

  const scrollToIndex = useCallback(
    (i: number) => {
      const el = scrollerRef.current
      if (!el) return
      const cards = el.querySelectorAll<HTMLElement>('[data-card]')
      const card = cards[i]
      if (!card) return
      el.scrollTo({
        left: isRtl ? -(card.offsetLeft + card.offsetWidth - el.clientWidth) : card.offsetLeft,
        behavior: 'smooth',
      })
    },
    [isRtl],
  )

  const prev = () => scrollByCards(-1)
  const next = () => scrollByCards(1)

  return (
    <div className="mt-8">
      {/* Toolbar: hint + arrows */}
      <div className="mb-4 flex items-center justify-between gap-3">
        {/* Swipe hint — mobile only */}
        <AnimatePresence>
          <motion.span
            key="swipe-hint"
            initial={{ opacity: 0, x: isRtl ? 8 : -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground sm:hidden"
          >
            <motion.span
              animate={{ x: isRtl ? [0, 5, 0] : [0, -5, 0] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
              className="inline-flex"
            >
              {isRtl ? <ChevronRight className="size-3.5" /> : <ChevronLeft className="size-3.5" />}
            </motion.span>
            <span>Swipe to explore</span>
          </motion.span>
        </AnimatePresence>

        {/* Arrows — desktop */}
        <div className="ml-auto hidden items-center gap-2 sm:flex">
          <button
            type="button"
            onClick={prev}
            disabled={!canPrev}
            aria-label={isRtl ? 'Next projects' : 'Previous projects'}
            className={cn(
              'group grid size-10 place-items-center rounded-full border border-border/60 bg-background text-muted-foreground transition-all duration-300',
              'hover:-translate-y-0.5 hover:border-transparent hover:bg-gradient-to-br hover:from-primary hover:to-accent hover:text-white hover:shadow-[0_8px_24px_-6px_rgba(20,184,166,0.55)]',
              'disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0 disabled:hover:bg-background disabled:hover:text-muted-foreground disabled:hover:shadow-none',
            )}
          >
            {isRtl ? <ChevronRight className="size-5 transition-transform group-hover:scale-110" /> : <ChevronLeft className="size-5 transition-transform group-hover:scale-110" />}
          </button>
          <button
            type="button"
            onClick={next}
            disabled={!canNext}
            aria-label={isRtl ? 'Previous projects' : 'Next projects'}
            className={cn(
              'group grid size-10 place-items-center rounded-full border border-border/60 bg-background text-muted-foreground transition-all duration-300',
              'hover:-translate-y-0.5 hover:border-transparent hover:bg-gradient-to-br hover:from-primary hover:to-accent hover:text-white hover:shadow-[0_8px_24px_-6px_rgba(20,184,166,0.55)]',
              'disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0 disabled:hover:bg-background disabled:hover:text-muted-foreground disabled:hover:shadow-none',
            )}
          >
            {isRtl ? <ChevronLeft className="size-5 transition-transform group-hover:scale-110" /> : <ChevronRight className="size-5 transition-transform group-hover:scale-110" />}
          </button>
        </div>
      </div>

      {/* Carousel */}
      <div className="relative">
        <div
          ref={scrollerRef}
          className={cn(
            'related-scroller flex gap-6 overflow-x-auto scroll-smooth pb-4',
            'snap-x snap-mandatory',
            '[scrollbar-width:none] [-ms-overflow-style:none]',
            isRtl && 'flex-row-reverse',
          )}
          style={{ scrollbarWidth: 'none' }}
        >
          {items.map((r, i) => (
            <div
              key={r.id}
              data-card
              className="snap-start shrink-0"
            >
              <RelatedCard
                item={r}
                lang={lang}
                onClick={() => onOpen(r.slug)}
                index={i}
                active={i === activeIndex}
              />
            </div>
          ))}
        </div>

        {/* Edge fade overlays */}
        <div
          aria-hidden
          className={cn(
            'pointer-events-none absolute inset-y-0 w-12 bg-gradient-to-r from-muted/30 to-transparent',
            isRtl ? 'left-0' : 'right-0',
          )}
        />
        <div
          aria-hidden
          className={cn(
            'pointer-events-none absolute inset-y-0 w-12 bg-gradient-to-l from-muted/30 to-transparent',
            isRtl ? 'right-0' : 'left-0',
          )}
        />

        {/* Hide native scrollbar — webkit */}
        <style>{`
          .related-scroller::-webkit-scrollbar { display: none; }
        `}</style>
      </div>

      {/* Progress dots */}
      <div className="mt-5 flex items-center justify-center gap-2 sm:justify-start">
        {items.map((r, i) => {
          const isActive = i === activeIndex
          return (
            <button
              key={r.id}
              type="button"
              onClick={() => scrollToIndex(i)}
              aria-label={`Go to project ${i + 1}`}
              aria-current={isActive ? 'true' : undefined}
              className="group p-1"
            >
              <span
                className={cn(
                  'block h-2 rounded-full transition-all duration-300',
                  isActive
                    ? 'w-6 bg-gradient-to-r from-primary to-accent'
                    : 'w-2 bg-border group-hover:bg-primary/40',
                )}
              />
            </button>
          )
        })}
        <span className="ml-2 text-xs font-medium tabular-nums text-muted-foreground">
          <span className="ltr-num text-foreground">{activeIndex + 1}</span>
          <span className="mx-1">/</span>
          <span className="ltr-num">{items.length}</span>
        </span>
      </div>
    </div>
  )
}

/* ------------------------- Related card ------------------------- */

function RelatedCard({
  item,
  lang,
  onClick,
  index = 0,
  active = false,
}: {
  item: Portfolio
  lang: 'en' | 'fa'
  onClick: () => void
  index?: number
  active?: boolean
}) {
  const t = useT()
  const title = tc('portfolio', item.slug, 'title', item.title, lang)
  const summary = tc('portfolio', item.slug, 'summary', item.summary, lang)
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -6 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={cn(
        'group relative block h-full w-72 shrink-0 cursor-pointer overflow-hidden rounded-2xl border bg-card text-left shadow-soft transition-all duration-300 focus-visible:outline-none',
        active ? 'border-primary/40 ring-2 ring-primary/20' : 'border-border/60 hover:shadow-glow',
      )}
    >
      {/* Cover image */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={item.coverImage}
          alt={`${title} cover`}
          loading="lazy"
          className="size-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/15 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-100" />
        {/* Top row: category + index */}
        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3">
          {item.category ? (
            <Badge className="border-0 bg-white/90 text-foreground backdrop-blur">
              {item.category.name}
            </Badge>
          ) : (
            <span />
          )}
          <span className="rounded-full bg-slate-950/40 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white/90 backdrop-blur">
            <span className="ltr-num">{String(index + 1).padStart(2, '0')}</span>
          </span>
        </div>
        {/* Bottom title over image */}
        <div className="absolute inset-x-0 bottom-0 p-4">
          <h3 className="line-clamp-2 text-base font-semibold leading-snug text-white drop-shadow-sm">
            {title}
          </h3>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col gap-3 p-4">
        <p className="line-clamp-2 text-sm text-muted-foreground">{summary}</p>
        <span
          className={cn(
            'inline-flex w-fit items-center gap-1.5 rounded-full border border-primary/30 bg-primary/5 px-3 py-1.5 text-xs font-semibold text-primary transition-all duration-200',
            'group-hover:border-primary/50 group-hover:bg-primary group-hover:text-primary-foreground',
          )}
        >
          {t('portfolio.viewProject')}
          <ArrowRight className={cn('size-3.5 transition-transform group-hover:translate-x-1', lang === 'fa' && 'rtl-flip group-hover:translate-x-1')} />
        </span>
      </div>
    </motion.button>
  )
}

/* ------------------------- Loading / Not found ------------------------- */

function DetailSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="pt-6">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="mt-6 h-12 w-3/4" />
        <Skeleton className="mt-4 h-5 w-full max-w-2xl" />
        <Skeleton className="mt-2 h-5 w-5/6 max-w-2xl" />
        <div className="mt-6 flex gap-3">
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-10 w-40" />
        </div>
        <Skeleton className="mt-8 aspect-[16/9] w-full rounded-2xl" />
      </div>
      <div className="grid grid-cols-1 gap-5 py-16 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-40 w-full rounded-2xl" />
        ))}
      </div>
    </div>
  )
}

function NotFoundState({ onBack }: { onBack: () => void }) {
  const t = useT()
  const lang = useLang((s) => s.lang)
  return (
    <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-md flex-col items-center rounded-2xl border border-dashed bg-muted/30 px-6 py-16 text-center">
        <div className="flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
          <FileQuestion className="size-8" />
        </div>
        <h2 className="mt-5 text-xl font-semibold">{t('portfolioDetail.notFound')}</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The project you're looking for may have been moved or unpublished.
        </p>
        <Button className="mt-6" onClick={onBack}>
          <ArrowLeft className={cn('size-4', lang === 'fa' && 'rtl-flip')} />
          {t('portfolioDetail.back')}
        </Button>
      </div>
    </div>
  )
}

/* ----------------- Portfolio Section Nav (sticky) ----------------- */

function PortfolioSectionNav({
  t,
  lang,
  item,
  relatedCount,
}: {
  t: (key: string) => string
  lang: 'en' | 'fa'
  item: Portfolio
  relatedCount: number
}) {
  const [activeId, setActiveId] = useState<string>('overview')

  const sections: { id: string; label: string; show: boolean }[] = [
    { id: 'overview', label: t('portfolioDetail.overview'), show: true },
    { id: 'technologies', label: t('portfolioDetail.technologies'), show: (item.technologies?.length ?? 0) > 0 },
    { id: 'features', label: t('portfolioDetail.features'), show: parseList(item.features).length > 0 },
    { id: 'gallery', label: t('portfolioDetail.gallery'), show: parseList(item.gallery).length > 0 },
    { id: 'case-study', label: t('portfolioDetail.caseStudy'), show: true },
    { id: 'related', label: t('portfolioDetail.related'), show: relatedCount > 0 },
  ].filter((s) => s.show)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: '-30% 0px -60% 0px', threshold: 0 },
    )

    sections.forEach((s) => {
      const el = document.getElementById(s.id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [item.id])

  const handleClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault()
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <aside
      className={cn(
        'fixed top-1/2 z-30 hidden -translate-y-1/2 lg:block',
        lang === 'fa' ? 'right-4' : 'left-4',
      )}
    >
      <nav className="rounded-2xl border border-border/40 bg-card/80 p-3 shadow-soft backdrop-blur-md" aria-label="Section navigation">
        <p className="mb-2 px-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          {lang === 'fa' ? 'در این صفحه' : 'On this page'}
        </p>
        <ul className="space-y-0.5">
          {sections.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                onClick={(e) => handleClick(e, s.id)}
                className={cn(
                  'relative block rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors',
                  activeId === s.id
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {activeId === s.id && (
                  <motion.span
                    layoutId="section-nav-active"
                    className={cn(
                      'absolute inset-y-1 w-0.5 rounded-full bg-gradient-to-b from-primary to-accent',
                      lang === 'fa' ? 'right-0' : 'left-0',
                    )}
                  />
                )}
                <span className={cn('block truncate', lang === 'fa' ? 'pr-3' : 'pl-3')}>
                  {s.label}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}
