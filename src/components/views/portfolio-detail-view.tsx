'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Github,
  ExternalLink,
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
} from '@/components/ui/dialog'
import { Reveal } from '@/components/site/reveal'
import { SectionHeading } from '@/components/site/section-heading'
import { usePortfolio, parseList, type Portfolio } from '@/lib/hooks'
import { useNav } from '@/lib/store'
import { cn } from '@/lib/utils'

export function PortfolioDetailView() {
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
          <ArrowLeft className="size-4" />
          Back to Portfolio
        </Button>
      </div>

      {isLoading ? (
        <DetailSkeleton />
      ) : isError || !item ? (
        <NotFoundState onBack={closeDetail} />
      ) : (
        <>
          {/* Hero */}
          <Hero item={item} />

          {/* Overview (Problem / Solution / Result) */}
          <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
            <SectionHeading
              eyebrow="Overview"
              title="Project at a glance"
              align="left"
            />
            <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
              <OverviewCard
                icon={AlertCircle}
                tone="rose"
                title="Problem"
                text={item.problem}
              />
              <OverviewCard
                icon={Lightbulb}
                tone="amber"
                title="Solution"
                text={item.solution}
              />
              <OverviewCard
                icon={TrendingUp}
                tone="emerald"
                title="Result"
                text={item.result}
              />
            </div>
          </section>

          {/* Technologies Used */}
          {item.technologies && item.technologies.length > 0 && (
            <section className="border-y bg-muted/30">
              <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
                <SectionHeading
                  eyebrow="Tech Stack"
                  title="Technologies used"
                  align="left"
                />
                <Reveal delay={0.1} className="mt-8 flex flex-wrap gap-3">
                  {item.technologies.map((t) => (
                    <div
                      key={t.id}
                      className="inline-flex items-center gap-2.5 rounded-full border bg-background px-4 py-2 text-sm font-medium shadow-xs transition-colors hover:border-primary/40"
                    >
                      <span
                        className="inline-block size-2.5 rounded-full"
                        style={{ background: t.color ?? 'var(--accent)' }}
                      />
                      {t.name}
                    </div>
                  ))}
                </Reveal>
              </div>
            </section>
          )}

          {/* Features */}
          {parseList<string>(item.features).length > 0 && (
            <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
              <SectionHeading
                eyebrow="Capabilities"
                title="Features we shipped"
                align="left"
              />
              <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {parseList<string>(item.features).map((feature, i) => (
                  <Reveal key={`${feature}-${i}`} delay={Math.min(i * 0.04, 0.3)}>
                    <div className="group flex items-start gap-3 rounded-xl border bg-card p-4 transition-colors hover:border-primary/30">
                      <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
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
            <section className="border-t bg-muted/30">
              <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
                <SectionHeading
                  eyebrow="Keep exploring"
                  title="Related projects"
                  align="left"
                />
                <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {related.map((r, i) => (
                    <Reveal key={r.id} delay={Math.min(i * 0.08, 0.3)}>
                      <RelatedCard
                        item={r}
                        onClick={() => openDetail('portfolio', r.slug)}
                      />
                    </Reveal>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Final CTA */}
          <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
            <Reveal>
              <div className="relative overflow-hidden rounded-2xl bg-primary px-6 py-12 text-primary-foreground shadow-soft sm:px-12 sm:py-16">
                <div className="bg-grid pointer-events-none absolute inset-0 opacity-20" />
                <div className="relative flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
                  <div className="max-w-xl">
                    <h3 className="text-2xl font-bold tracking-tight sm:text-3xl">
                      Request a similar project
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
                    Start a project
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
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

function Hero({ item }: { item: Portfolio }) {
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

          <h1 className="mt-5 max-w-4xl text-4xl font-bold tracking-tight text-balance sm:text-5xl md:text-6xl">
            {item.title}
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {item.summary}
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
              {item.year}
            </span>
            <span className="inline-flex items-center gap-2">
              <Eye className="size-4 text-accent" />
              {item.views} views
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
                    Visit Live Site
                    <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
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
                    View Source
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
              alt={`${item.title} main cover`}
              className="size-full object-cover"
            />
          </div>
        </motion.div>
      </div>
    </section>
  )
}

/* ------------------------- Overview cards ------------------------- */

const TONE_STYLES: Record<
  string,
  { bg: string; ring: string; text: string }
> = {
  rose: {
    bg: 'bg-rose-500/10',
    ring: 'ring-rose-500/20',
    text: 'text-rose-600 dark:text-rose-400',
  },
  amber: {
    bg: 'bg-amber-500/10',
    ring: 'ring-amber-500/20',
    text: 'text-amber-600 dark:text-amber-400',
  },
  emerald: {
    bg: 'bg-emerald-500/10',
    ring: 'ring-emerald-500/20',
    text: 'text-emerald-600 dark:text-emerald-400',
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
      <Card className="h-full gap-4 p-6">
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
        <p className="text-sm leading-relaxed text-muted-foreground">
          {text || `No ${title.toLowerCase()} documented for this project.`}
        </p>
      </Card>
    </Reveal>
  )
}

/* ------------------------- Gallery ------------------------- */

function GallerySection({ raw }: { raw: string }) {
  const images = parseList<string>(raw)
  const [active, setActive] = useState<string | null>(null)

  if (images.length === 0) return null

  return (
    <section className="border-y bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <SectionHeading
          eyebrow="Gallery"
          title="Project screenshots"
          align="left"
        />
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((src, i) => (
            <Reveal
              key={`${src}-${i}`}
              delay={Math.min(i * 0.05, 0.3)}
              className={cn(
                'group cursor-pointer overflow-hidden rounded-xl border shadow-xs transition-shadow hover:shadow-soft',
                i % 5 === 0 ? 'sm:col-span-2 sm:row-span-1' : '',
              )}
            >
              <button
                type="button"
                onClick={() => setActive(src)}
                className="block w-full"
                aria-label={`Open image ${i + 1} in lightbox`}
              >
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={src}
                    alt={`Project screenshot ${i + 1}`}
                    loading="lazy"
                    className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all duration-300 group-hover:bg-black/30 group-hover:opacity-100">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-foreground">
                      <ExternalLink className="size-3.5" />
                      View
                    </span>
                  </div>
                </div>
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent
          className="max-w-5xl border-0 bg-black/95 p-0 sm:rounded-2xl"
          showCloseButton
        >
          <DialogTitle className="sr-only">Screenshot preview</DialogTitle>
          {active && (
            <div className="relative max-h-[85vh] w-full overflow-auto">
              <img
                src={active}
                alt="Project screenshot large preview"
                className="mx-auto h-auto w-full object-contain"
              />
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
    title: 'Challenge',
    tone: 'rose',
  },
  {
    key: 'architecture' as const,
    icon: Layers,
    title: 'Architecture',
    tone: 'amber',
  },
  {
    key: 'implementation' as const,
    icon: Code2,
    title: 'Implementation',
    tone: 'primary',
  },
  {
    key: 'outcome' as const,
    icon: Trophy,
    title: 'Outcome',
    tone: 'emerald',
  },
]

function CaseStudySection({ item }: { item: Portfolio }) {
  const hasAny = CASE_STUDY.some((s) => item[s.key])
  if (!hasAny) return null

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <SectionHeading
        eyebrow="Case Study"
        title="How we built it"
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
              <Card className="h-full gap-4 p-6">
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
                      Step {i + 1}
                    </span>
                    <h3 className="text-base font-semibold">{s.title}</h3>
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

/* ------------------------- Related card ------------------------- */

function RelatedCard({
  item,
  onClick,
}: {
  item: Portfolio
  onClick: () => void
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="group block h-full w-full cursor-pointer text-left focus-visible:outline-none"
    >
      <Card className="h-full overflow-hidden p-0 transition-shadow duration-300 hover:shadow-soft">
        <div className="relative aspect-video overflow-hidden">
          <img
            src={item.coverImage}
            alt={`${item.title} cover`}
            loading="lazy"
            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {item.category && (
            <Badge className="absolute top-3 left-3 border-0 bg-white/90 text-foreground backdrop-blur">
              {item.category.name}
            </Badge>
          )}
        </div>
        <div className="p-5">
          <h3 className="line-clamp-1 text-base font-semibold">{item.title}</h3>
          <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">
            {item.summary}
          </p>
          <div className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
            View Project
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </Card>
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
  return (
    <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-md flex-col items-center rounded-2xl border border-dashed bg-muted/30 px-6 py-16 text-center">
        <div className="flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
          <FileQuestion className="size-8" />
        </div>
        <h2 className="mt-5 text-xl font-semibold">Project not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The project you're looking for may have been moved or unpublished.
        </p>
        <Button className="mt-6" onClick={onBack}>
          <ArrowLeft className="size-4" />
          Back to Portfolio
        </Button>
      </div>
    </div>
  )
}
