'use client'

import { motion, AnimatePresence, useInView } from 'framer-motion'
import {
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Code2,
  ShoppingCart,
  Calendar,
  CalendarCheck,
  Cloud,
  LayoutDashboard,
  Webhook,
  Search,
  Sparkles,
  Star,
  Quote,
  Lightbulb,
  Rocket,
  ClipboardCheck,
  TestTube,
  Hammer,
  LifeBuoy,
  Compass,
  CheckCircle2,
  HelpCircle,
  MessageCircleQuestion,
} from 'lucide-react'
import { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Reveal } from '@/components/site/reveal'
import { SectionHeading } from '@/components/site/section-heading'
import { Counter } from '@/components/site/counter'
import { TrustBadges } from '@/components/site/trust-badges'
import {
  useSite,
  usePortfolios,
  parseList,
  type Service,
  type Portfolio,
  type Testimonial,
} from '@/lib/hooks'
import { useNav } from '@/lib/store'
import { useT, useLang } from '@/lib/lang-store'
import { tc, tcCategory, tcServiceTitle, tcServiceDesc, tcServiceFeatures, tcClient } from '@/lib/content-i18n'
import { cn } from '@/lib/utils'

const iconMap: Record<string, typeof Code2> = {
  Code2,
  ShoppingCart,
  CalendarCheck,
  Cloud,
  LayoutDashboard,
  Webhook,
  Search,
  Sparkles,
}

const PROCESS_STEPS = [
  { icon: Compass, titleKey: 'process.discovery', descKey: 'process.discoveryDesc' },
  { icon: ClipboardCheck, titleKey: 'process.planning', descKey: 'process.planningDesc' },
  { icon: Lightbulb, titleKey: 'process.design', descKey: 'process.designDesc' },
  { icon: Hammer, titleKey: 'process.development', descKey: 'process.developmentDesc' },
  { icon: TestTube, titleKey: 'process.testing', descKey: 'process.testingDesc' },
  { icon: Rocket, titleKey: 'process.launch', descKey: 'process.launchDesc' },
  { icon: LifeBuoy, titleKey: 'process.support', descKey: 'process.supportDesc' },
]

const TECH_LOGOS = [
  'Laravel', 'PHP', 'React', 'Vue', 'Next.js',
  'PostgreSQL', 'MySQL', 'TailwindCSS', 'TypeScript',
  'Node.js', 'Docker', 'Linux',
]

export function HomeView() {
  const { setView, scrollTo, openDetail } = useNav()
  const { data: siteData, isLoading: siteLoading } = useSite()
  const { data: portfolioData, isLoading: portfolioLoading } = usePortfolios({ featured: 'true', limit: '6' })
  const t = useT()
  const lang = useLang((s) => s.lang)
  const isRtl = lang === 'fa'

  // Timeline scroll-trigger ref — drives the animated line draw + node pop-in
  const timelineRef = useRef<HTMLDivElement>(null)
  const timelineInView = useInView(timelineRef, { once: true, margin: '-120px' })

  const featuredPortfolios = portfolioData?.items ?? []
  const services = siteData?.services ?? []
  const testimonials = siteData?.testimonials ?? []
  const faqs = siteData?.faqs ?? []
  const settings = siteData?.settings ?? {}

  const heroBadges = [
    t('hero.badgeProjects'),
    t('hero.badgeSatisfaction'),
    t('hero.badgeExperience'),
  ]

  return (
    <div className="overflow-hidden">
      {/* ===== HERO ===== */}
      <section className="relative isolate overflow-hidden bg-radial-fade pb-24 pt-20 sm:pt-28">
        {/* Premium layered gradient mesh background */}
        <div className="absolute inset-0 -z-10 bg-grid opacity-60 [mask-image:radial-gradient(70%_60%_at_50%_0%,black,transparent)]" />
        <div className="absolute -top-24 left-1/2 -z-10 h-72 w-[40rem] -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -top-10 right-1/4 -z-10 h-48 w-96 rounded-full bg-accent/15 blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute top-40 left-1/4 -z-10 h-40 w-80 rounded-full bg-primary/10 blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
              </span>
              {t('hero.badge')}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.05 }}
              className="text-4xl font-bold tracking-tight text-balance sm:text-6xl md:text-7xl md:leading-[1.05]"
            >
              {t('hero.title')} <span className="text-gradient">{t('hero.titleAccent')}</span> {t('hero.titleEnd')}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl"
            >
              {t('hero.subtitle')}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
            >
              <Button size="lg" className="h-12 rounded-full px-7 text-base" onClick={() => setView('portfolio')}>
                {t('hero.viewPortfolio')}
                <ArrowRight className={cn('ml-2 h-4 w-4 rtl-flip')} />
              </Button>
              <Button size="lg" variant="outline" className="h-12 rounded-full px-7 text-base" onClick={() => setView('contact')}>
                {t('hero.requestConsultation')}
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground"
            >
              {heroBadges.map((badge) => (
                <span key={badge} className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-accent" />
                  {badge}
                </span>
              ))}
            </motion.div>
          </div>

          {/* Code editor mockup */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto mt-16 max-w-5xl"
          >
            {/* Pulsing gradient glow */}
            <motion.div
              aria-hidden
              animate={{
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-to-br from-primary/20 via-accent/10 to-transparent blur-2xl"
            />

            {/* Code editor window */}
            <div className="overflow-hidden rounded-2xl border border-border/60 bg-[#0d1117] shadow-soft">
              {/* Editor title bar */}
              <div className="flex items-center gap-2 border-b border-white/5 bg-[#161b22] px-4 py-2.5">
                <span className="h-3 w-3 rounded-full bg-red-400/80" />
                <span className="h-3 w-3 rounded-full bg-yellow-400/80" />
                <span className="h-3 w-3 rounded-full bg-green-400/80" />
                <div className="ml-3 flex items-center gap-1.5">
                  <Code2 className="h-3.5 w-3.5 text-accent" />
                  <span className="font-mono text-xs text-muted-foreground ltr-text" dir="ltr">{t('hero.codeFile')}</span>
                </div>
                {/* Live indicator */}
                <div className="ml-auto flex items-center gap-1.5 rounded-full border border-green-500/20 bg-green-500/5 px-2 py-0.5">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-500" />
                  </span>
                  <span className="text-[10px] font-semibold text-green-500">{t('hero.live')}</span>
                </div>
              </div>

              {/* Code content */}
              <div className="flex font-mono text-xs leading-relaxed ltr-text" dir="ltr">
                {/* Line numbers */}
                <div className="select-none border-r border-white/5 bg-[#0d1117] px-3 py-4 text-right text-muted-foreground/40">
                  {Array.from({ length: 16 }).map((_, i) => (
                    <div key={i} className="leading-relaxed">{i + 1}</div>
                  ))}
                </div>

                {/* Code */}
                <div className="flex-1 overflow-x-auto p-4">
                  <pre className="text-[13px] leading-relaxed">
                    <code>
                      <span className="text-purple-400">{'<?php'}</span>{'\n\n'}
                      <span className="text-blue-400">namespace</span> <span className="text-yellow-300">App\Http\Controllers</span>;{'\n\n'}
                      <span className="text-blue-400">use</span> <span className="text-yellow-300">App\Models\Project</span>;{'\n'}
                      <span className="text-blue-400">use</span> <span className="text-yellow-300">Illuminate\Http\Request</span>;{'\n\n'}
                      <span className="text-blue-400">class</span> <span className="text-yellow-200">ProjectController</span> <span className="text-blue-400">extends</span> <span className="text-yellow-200">Controller</span>{'\n'}
                      {'{'}{'\n'}
                      {'  '}<span className="text-blue-400">public function</span> <span className="text-green-400">index</span>(){'\n'}
                      {'  {'}{'\n'}
                      {'    '}<span className="text-blue-400">return</span> <span className="text-yellow-200">Project</span>::<span className="text-green-400">with</span>(<span className="text-orange-300">'technologies'</span>){'\n'}
                      {'      '}{'->'}<span className="text-green-400">where</span>(<span className="text-orange-300">'published'</span>, <span className="text-purple-300">true</span>){'\n'}
                      {'      '}{'->'}<span className="text-green-400">orderBy</span>(<span className="text-orange-300">'created_at'</span>, <span className="text-orange-300">'desc'</span>){'\n'}
                      {'      '}{'->'}<span className="text-green-400">paginate</span>(<span className="text-purple-300">12</span>);{'\n'}
                      {'  }'}{'\n\n'}
                      {'  '}<span className="text-blue-400">public function</span> <span className="text-green-400">show</span>(<span className="text-yellow-300">$slug</span>){'\n'}
                      {'  {'}{'\n'}
                      {'    '}<span className="text-blue-400">return</span> <span className="text-yellow-200">Project</span>::<span className="text-green-400">where</span>(<span className="text-orange-300">'slug'</span>, <span className="text-yellow-300">$slug</span>){'\n'}
                      {'      '}{'->'}<span className="text-green-400">firstOrFail</span>();{'\n'}
                      {'  }'}{'\n'}
                      {'}'}
                    </code>
                  </pre>
                </div>
              </div>

              {/* Terminal output bar */}
              <div className="border-t border-white/5 bg-[#161b22] px-4 py-2.5">
                <div className="flex items-center gap-2 font-mono text-[11px] ltr-text" dir="ltr">
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-green-500" />
                  <span className="text-green-400">✓</span>
                  <span className="text-muted-foreground">{t('hero.buildSuccess')}</span>
                  <span className="mx-1 text-muted-foreground/40">·</span>
                  <span className="text-blue-400">✓</span>
                  <span className="text-muted-foreground">{t('hero.testsPassed')}</span>
                  <span className="ml-auto text-accent">{t('hero.deployed')}</span>
                </div>
              </div>
            </div>

            {/* Floating status cards */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, x: -20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 18, delay: 1.0 }}
              className="pointer-events-none absolute -left-4 top-1/4 hidden rounded-xl border border-border/60 bg-card/90 p-3 shadow-glow backdrop-blur-md sm:block"
            >
              <div className="flex items-center gap-2.5">
                <div className="grid h-9 w-9 place-items-center rounded-lg bg-green-500/15 text-green-500">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold">{t('hero.testsPassed')}</p>
                  <p className="text-[10px] text-muted-foreground ltr-num">{t('hero.codeLines')}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 18, delay: 1.3 }}
              className="pointer-events-none absolute -right-4 bottom-1/4 hidden rounded-xl border border-border/60 bg-card/90 p-3 shadow-glow backdrop-blur-md sm:block"
            >
              <div className="flex items-center gap-2.5">
                <div className="grid h-9 w-9 place-items-center rounded-lg bg-accent/15 text-accent">
                  <Rocket className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold">{t('hero.deployed')}</p>
                  <p className="text-[10px] text-muted-foreground">99.9% uptime</p>
                </div>
              </div>
            </motion.div>

            {/* AI insights floating card */}
            <div className="pointer-events-none absolute -right-6 -top-6 hidden animate-float rounded-xl border border-border/60 bg-card p-3 shadow-soft sm:block">
              <div className="flex items-center gap-2">
                <div className="grid h-8 w-8 place-items-center rounded-lg bg-accent/15 text-accent">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold">{t('hero.aiInsights')}</p>
                  <p className="text-[10px] text-muted-foreground">{t('hero.live')}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== TRUSTED BY MARQUEE ===== */}
      <section className="border-y border-border/60 bg-muted/30 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="mb-6 text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {t('trusted.title')}
          </p>
          <div className="mask-fade-x overflow-hidden">
            <div className="flex w-max animate-marquee items-center gap-12 pr-12">
              {[...TECH_LOGOS, ...TECH_LOGOS].map((name, i) => (
                <span key={i} className="text-xl font-bold text-muted-foreground/50 transition hover:text-foreground">
                  {name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== TRUST BADGES ===== */}
      <TrustBadges />

      {/* ===== STATISTICS ===== */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow={t('stats.eyebrow')}
            title={t('stats.title')}
            description={t('stats.desc')}
          />
          <div className="mt-14 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {[
              { label: t('stats.projects'), value: Number(settings.stats_projects || 180), suffix: '+', icon: Rocket },
              { label: t('stats.experience'), value: Number(settings.stats_experience || 12), suffix: '+', icon: Calendar },
              { label: t('stats.satisfaction'), value: Number(settings.stats_satisfaction || 98), suffix: '%', icon: Star },
              { label: t('stats.technologies'), value: Number(settings.stats_technologies || 25), suffix: '+', icon: Sparkles },
            ].map((stat, i) => (
              <Reveal key={stat.label} delay={i * 0.1}>
                <Card className="group relative overflow-hidden border-border/60 p-6 text-center transition duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-soft sm:p-8">
                  {/* Gradient glow on hover */}
                  <div className="absolute -inset-px -z-10 rounded-2xl bg-gradient-to-br from-primary/0 via-primary/0 to-accent/0 opacity-0 blur transition duration-300 group-hover:from-primary/5 group-hover:to-accent/5 group-hover:opacity-100" />
                  <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 transition group-hover:opacity-100" />
                  {/* Icon */}
                  <div className="mx-auto mb-3 grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <div className="text-4xl font-bold tracking-tight text-gradient sm:text-5xl ltr-num">
                    <Counter to={stat.value} suffix={stat.suffix} />
                  </div>
                  <p className="mt-2 text-sm font-medium text-muted-foreground sm:text-base">{stat.label}</p>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURED PORTFOLIO ===== */}
      <section id="featured-work" className="scroll-mt-24 bg-muted/30 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <SectionHeading
              align="left"
              eyebrow={t('featured.eyebrow')}
              title={t('featured.title')}
              description={t('featured.desc')}
            />
            <Button variant="outline" className="shrink-0 rounded-full" onClick={() => setView('portfolio')}>
              {t('featured.viewAll')}
              <ArrowRight className="ml-2 h-4 w-4 rtl-flip" />
            </Button>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {portfolioLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i} className="overflow-hidden border-border/60 p-0">
                    <Skeleton className="aspect-video w-full rounded-none" />
                    <div className="space-y-3 p-5">
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                    </div>
                  </Card>
                ))
              : featuredPortfolios.map((p, i) => (
                  <FeaturedPortfolioCard key={p.id} portfolio={p} index={i} onClick={() => openDetail('portfolio', p.slug)} />
                ))}
          </div>
        </div>
      </section>

      {/* ===== SERVICES ===== */}
      <section id="services" className="scroll-mt-24 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow={t('services.eyebrow')}
            title={t('services.title')}
            description={t('services.desc')}
          />
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service, i) => (
              <ServiceCard key={service.id} service={service} index={i} onCta={() => setView('contact')} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== DEVELOPMENT PROCESS ===== */}
      <section id="process" className="scroll-mt-24 bg-secondary py-20 text-secondary-foreground sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              {t('process.eyebrow')}
            </span>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-[2.6rem] md:leading-[1.1]">
              {t('process.title')}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-secondary-foreground/70 sm:text-lg">
              {t('process.desc')}
            </p>
          </div>

          {/* ===== Animated zigzag timeline (desktop) + vertical timeline (mobile) ===== */}
          <div ref={timelineRef} className="mt-16">
            {/* ---------- Desktop: horizontal zigzag timeline ---------- */}
            <div className="relative hidden lg:block">
              {/* Horizontal line: static track + animated gradient progress */}
              <div className="absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2">
                <div className="absolute inset-0 bg-white/10" />
                <motion.div
                  className={cn(
                    'absolute inset-0 bg-gradient-to-r from-primary to-accent',
                    isRtl ? 'origin-right' : 'origin-left',
                  )}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: timelineInView ? 1 : 0 }}
                  transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>

              {/* Steps row — alternating above/below the line (zigzag) */}
              <div className="relative grid grid-cols-7 gap-3">
                {PROCESS_STEPS.map((step, i) => {
                  const above = i % 2 === 0 // step 1, 3, 5, 7 above; 2, 4, 6 below
                  return (
                    <div key={step.titleKey} className="flex flex-col items-center">
                      {/* Top region — card (when above) sits at the bottom of this region */}
                      <div className="flex h-48 w-full flex-col justify-end">
                        {above && (
                          <Reveal delay={i * 0.08} className="flex flex-col items-center">
                            <ProcessTimelineCard step={step} />
                            <div
                              className={cn(
                                'mt-2 h-6 w-px bg-gradient-to-b',
                                isRtl ? 'from-primary/40 to-accent/40' : 'from-accent/40 to-primary/40',
                              )}
                            />
                          </Reveal>
                        )}
                      </div>

                      {/* Node on the line — number, gradient bg, pulsing ring, hover scale */}
                      <motion.div
                        className="relative isolate grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-primary to-accent text-xs font-bold text-primary-foreground shadow-lg shadow-primary/30"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={timelineInView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
                        transition={{ delay: 0.2 + i * 0.12, type: 'spring', stiffness: 220, damping: 16 }}
                        whileHover={{ scale: 1.18 }}
                      >
                        {/* Pulsing ring */}
                        <span
                          aria-hidden
                          className="absolute inset-0 animate-ping rounded-full bg-primary/30"
                          style={{ animationDuration: '2.6s' }}
                        />
                        {/* Soft glow */}
                        <span aria-hidden className="absolute -inset-1 rounded-full bg-primary/25 blur-md" />
                        <span className="relative ltr-num">{String(i + 1).padStart(2, '0')}</span>
                      </motion.div>

                      {/* Bottom region — card (when below) sits at the top of this region */}
                      <div className="flex h-48 w-full flex-col justify-start">
                        {!above && (
                          <Reveal delay={i * 0.08} className="flex flex-col items-center">
                            <div
                              className={cn(
                                'mt-2 h-6 w-px bg-gradient-to-t',
                                isRtl ? 'from-primary/40 to-accent/40' : 'from-accent/40 to-primary/40',
                              )}
                            />
                            <ProcessTimelineCard step={step} />
                          </Reveal>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* ---------- Mobile: vertical timeline (line on left LTR / right RTL) ---------- */}
            <div className="relative lg:hidden">
              {/* Vertical line track + animated gradient progress */}
              <div
                className={cn(
                  'absolute bottom-0 top-0 w-0.5',
                  isRtl ? 'right-7' : 'left-7',
                )}
              >
                <div className="absolute inset-0 bg-white/10" />
                <motion.div
                  className="absolute inset-0 origin-top bg-gradient-to-b from-primary to-accent"
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: timelineInView ? 1 : 0 }}
                  transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>

              <div className="space-y-5">
                {PROCESS_STEPS.map((step, i) => {
                  const Icon = step.icon
                  return (
                    <Reveal
                      key={step.titleKey}
                      delay={i * 0.06}
                      className={cn(
                        'relative flex items-start gap-4',
                        isRtl ? 'pr-20' : 'pl-20',
                      )}
                    >
                      {/* Node on the line */}
                      <motion.div
                        className={cn(
                          'absolute top-0 isolate grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-primary to-accent text-sm font-bold text-primary-foreground shadow-lg shadow-primary/30',
                          isRtl ? 'right-0' : 'left-0',
                        )}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={timelineInView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
                        transition={{ delay: 0.2 + i * 0.1, type: 'spring', stiffness: 220, damping: 16 }}
                        whileHover={{ scale: 1.12 }}
                      >
                        <span
                          aria-hidden
                          className="absolute inset-0 animate-ping rounded-full bg-primary/30"
                          style={{ animationDuration: '2.6s' }}
                        />
                        <span aria-hidden className="absolute -inset-1 rounded-full bg-primary/25 blur-md" />
                        <span className="relative ltr-num">{String(i + 1).padStart(2, '0')}</span>
                      </motion.div>

                      {/* Step card */}
                      <div className="group flex-1 rounded-2xl border border-white/10 bg-white/5 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-white/[0.08] hover:shadow-[0_8px_30px_rgba(37,99,235,0.2)]">
                        {/* gradient border glow on hover */}
                        <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/0 to-accent/0 opacity-0 transition-opacity duration-300 group-hover:from-primary/[0.08] group-hover:to-accent/[0.08] group-hover:opacity-100" />
                        <div className="relative flex items-center gap-3">
                          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-md shadow-primary/20 transition-transform duration-300 group-hover:scale-110">
                            <Icon className="h-4 w-4" />
                          </div>
                          <h3 className="text-base font-semibold">{t(step.titleKey)}</h3>
                        </div>
                        <p className="mt-2 text-sm leading-relaxed text-secondary-foreground/60">
                          {t(step.descKey)}
                        </p>
                      </div>
                    </Reveal>
                  )
                })}
              </div>
            </div>
          </div>

          {/* "Ready to start?" CTA — kept from original */}
          <Reveal delay={0.1} className="mt-10">
            <button
              onClick={() => setView('contact')}
              className="group flex w-full flex-col items-start justify-center rounded-2xl border border-accent/30 bg-accent/10 p-6 text-left transition hover:bg-accent/20 sm:flex-row sm:items-center sm:justify-between sm:p-8"
            >
              <div>
                <h3 className="text-lg font-semibold sm:text-xl">{t('process.ready')}</h3>
                <p className="mt-2 text-sm text-secondary-foreground/70 sm:text-base">{t('process.readyDesc')}</p>
              </div>
              <ArrowUpRight className="mt-3 h-6 w-6 shrink-0 text-accent transition group-hover:translate-x-1 group-hover:-translate-y-1 rtl-flip sm:mt-0" />
            </button>
          </Reveal>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <TestimonialsSlider testimonials={testimonials} loading={siteLoading} onCta={() => setView('portfolio')} />

      {/* ===== TECHNOLOGIES ===== */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow={t('tech.eyebrow')}
            title={t('tech.title')}
            description={t('tech.desc')}
          />
          <div className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {TECH_LOGOS.map((tech, i) => (
              <Reveal key={tech} delay={i * 0.04}>
                <div className="group flex h-20 items-center justify-center rounded-xl border border-border/60 bg-card transition hover:border-primary/40 hover:shadow-soft">
                  <span className="text-sm font-semibold text-muted-foreground transition group-hover:text-foreground sm:text-base">
                    {tech}
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section id="faq" className="scroll-mt-24 relative overflow-hidden py-20 sm:py-28">
        <div className="absolute inset-0 bg-radial-fade" />
        <div className="absolute inset-0 bg-grid opacity-[0.04]" />
        {/* Decorative floating question mark */}
        <HelpCircle className="pointer-events-none absolute -left-10 top-24 h-40 w-40 text-primary/[0.04] animate-float" />
        <HelpCircle className="pointer-events-none absolute right-0 bottom-16 h-32 w-32 text-accent/[0.05] animate-float [animation-delay:1.5s]" />

        <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow={t('faq.eyebrow')}
            title={t('faq.title')}
            description={t('faq.desc')}
          />
          {siteLoading ? (
            <div className="mt-10 space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-14 w-full rounded-xl" />
              ))}
            </div>
          ) : (
            <Accordion type="single" collapsible className="mt-10 space-y-3">
              {faqs.map((faq) => (
                <AccordionItem
                  key={faq.id}
                  value={faq.id}
                  className={cn(
                    'group relative overflow-hidden rounded-2xl border border-border/60 bg-card px-5 py-1 transition-all duration-300',
                    'hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-soft',
                    'data-[state=open]:border-primary/30 data-[state=open]:bg-gradient-to-r data-[state=open]:from-primary/[0.04] data-[state=open]:to-accent/[0.04] data-[state=open]:shadow-soft'
                  )}
                >
                  {/* Gradient left border on open */}
                  <span className="pointer-events-none absolute inset-y-0 left-0 w-1 origin-top scale-y-0 bg-gradient-to-b from-primary to-accent transition-transform duration-300 group-data-[state=open]:scale-y-100" />
                  <AccordionTrigger className="hover:no-underline">
                    <span className="flex items-center gap-3 text-left text-base font-semibold">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 text-primary ring-1 ring-inset ring-primary/10 transition group-data-[state=open]:from-primary group-data-[state=open]:to-accent group-data-[state=open]:text-primary-foreground">
                        <HelpCircle className="h-4 w-4" />
                      </span>
                      {faq.question}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="pl-12 text-sm leading-relaxed text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
          <div className="mt-12 flex flex-col items-center justify-center gap-4 text-center">
            <p className="text-base text-muted-foreground">{t('faq.stillQuestions')}</p>
            <Button
              onClick={() => setView('contact')}
              className="h-12 rounded-full bg-gradient-to-r from-primary to-accent px-7 text-base text-primary-foreground shadow-glow transition hover:opacity-90 hover:shadow-glow"
            >
              <MessageCircleQuestion className="mr-2 h-5 w-5" />
              {t('faq.talkToTeam')}
            </Button>
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <FinalCta onPrimary={() => setView('contact')} onSecondary={() => setView('estimate')} />
    </div>
  )
}

/* ---------- Sub-components ---------- */

function FeaturedPortfolioCard({ portfolio, index, onClick }: { portfolio: Portfolio; index: number; onClick: () => void }) {
  const t = useT()
  const lang = useLang((s) => s.lang)
  const title = tc('portfolio', portfolio.slug, 'title', portfolio.title, lang)
  const summary = tc('portfolio', portfolio.slug, 'summary', portfolio.summary, lang)
  return (
    <Reveal delay={index * 0.08}>
      <Card
        onClick={onClick}
        className="group cursor-pointer overflow-hidden border-border/60 p-0 transition duration-300 hover:-translate-y-1 hover:shadow-soft"
      >
        <div className="relative aspect-video overflow-hidden">
          <img
            src={portfolio.coverImage}
            alt={title}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
          {portfolio.category && (
            <Badge className="absolute left-3 top-3 border-0 bg-background/90 text-foreground backdrop-blur">
              {tcCategory(portfolio.category.slug, portfolio.category.name, lang)}
            </Badge>
          )}
          <div className="absolute bottom-3 right-3 translate-y-2 rounded-full bg-primary p-2 text-primary-foreground opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <ArrowUpRight className="h-4 w-4 rtl-flip" />
          </div>
        </div>
        <div className="p-5">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="ltr-num">{portfolio.year}</span>
            {portfolio.clientName && (
              <>
                <span>•</span>
                <span>{tcClient(portfolio.clientName, lang)}</span>
              </>
            )}
          </div>
          <h3 className="mt-1.5 text-lg font-semibold leading-snug">{title}</h3>
          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{summary}</p>
          {portfolio.technologies && portfolio.technologies.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {portfolio.technologies.slice(0, 3).map((tech) => (
                <span
                  key={tech.id}
                  className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"
                >
                  {tech.color && <span className="h-1.5 w-1.5 rounded-full" style={{ background: tech.color }} />}
                  {tech.name}
                </span>
              ))}
              {portfolio.technologies.length > 3 && (
                <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground ltr-num">
                  +{portfolio.technologies.length - 3}
                </span>
              )}
            </div>
          )}
          <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-primary">
            {t('featured.viewProject')}
            <ArrowUpRight className="h-3.5 w-3.5 rtl-flip" />
          </div>
        </div>
      </Card>
    </Reveal>
  )
}

function ServiceCard({ service, index, onCta }: { service: Service; index: number; onCta: () => void }) {
  const t = useT()
  const lang = useLang((s) => s.lang)
  const Icon = iconMap[service.icon] ?? Code2
  const rawFeatures = parseList<string>(service.features)
  const features = tcServiceFeatures(service.slug, rawFeatures, lang)
  const title = tcServiceTitle(service.slug, service.title, lang)
  const description = tcServiceDesc(service.slug, service.description, lang)
  return (
    <Reveal delay={index * 0.06}>
      <Card className="group relative h-full overflow-hidden border-border/60 p-6 transition duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-soft">
        {/* Gradient top border on hover */}
        <div className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-gradient-to-r from-primary to-accent transition-transform duration-300 group-hover:scale-x-100" />
        {/* Decorative blob */}
        <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary/5 transition duration-500 group-hover:scale-150" />
        {/* Number badge — animates on hover */}
        <motion.span
          initial={false}
          whileHover={{ scale: 1.12 }}
          className="absolute right-4 top-4 text-3xl font-bold text-muted-foreground/8 transition-colors duration-300 group-hover:scale-110 group-hover:text-primary/20 ltr-num"
        >
          {String(index + 1).padStart(2, '0')}
        </motion.span>
        <div className="relative">
          {/* Icon cluster: ring + particles + floating icon */}
          <div className="relative inline-block">
            {/* Gradient glow ring — fades in & scales on hover */}
            <span
              className="pointer-events-none absolute -inset-2 rounded-2xl bg-gradient-to-br from-primary/50 to-accent/50 opacity-0 blur-md transition-all duration-300 group-hover:scale-110 group-hover:opacity-100"
              aria-hidden
            />
            <span
              className="pointer-events-none absolute -inset-0.5 rounded-2xl bg-gradient-to-br from-primary to-accent opacity-0 transition-all duration-300 group-hover:scale-105 group-hover:opacity-100"
              aria-hidden
            />
            {/* Particle dots — float outward on hover (top, right, bottom, left) */}
            <span
              aria-hidden
              className="pointer-events-none absolute -top-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-accent opacity-0 transition-all duration-500 group-hover:-top-2 group-hover:opacity-100"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute -right-1 top-1/2 h-1 w-1 -translate-y-1/2 rounded-full bg-primary opacity-0 transition-all duration-500 group-hover:-right-2 group-hover:opacity-100"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-accent opacity-0 transition-all duration-500 group-hover:-bottom-2 group-hover:opacity-100"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute -left-1 top-1/2 h-1 w-1 -translate-y-1/2 rounded-full bg-primary opacity-0 transition-all duration-500 group-hover:-left-2 group-hover:opacity-100"
            />
            {/* Floating icon — gentle y-axis oscillation, scale + rotate on hover */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: index * 0.2,
              }}
              className="relative grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[5deg] group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-glow"
            >
              <Icon className="h-6 w-6" />
            </motion.div>
          </div>
          <h3 className="mt-4 text-lg font-semibold">{title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
          {features.length > 0 && (
            <ul className="mt-4 space-y-1.5">
              {features.slice(0, 3).map((f) => (
                <li key={f} className="flex items-center gap-2 text-xs text-muted-foreground">
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-accent" />
                  {f}
                </li>
              ))}
            </ul>
          )}
          <button
            onClick={onCta}
            className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-primary opacity-0 transition group-hover:opacity-100"
          >
            {t('services.learnMore')}
            <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5 rtl-flip" />
          </button>
        </div>
        {/* Gradient progress bar at bottom — fills on hover */}
        <div className="absolute inset-x-0 bottom-0 h-0.5 w-0 bg-gradient-to-r from-primary to-accent transition-all duration-500 ease-out group-hover:w-full" />
      </Card>
    </Reveal>
  )
}

// Compact card used in the desktop zigzag timeline (each column is narrow,
// so the layout is icon-on-top + title + clamped description, with a gradient
// hover border + lift + glow).
function ProcessTimelineCard({ step }: { step: (typeof PROCESS_STEPS)[number] }) {
  const t = useT()
  const Icon = step.icon
  return (
    <div className="group relative w-full overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4 text-center transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:bg-white/[0.08] hover:shadow-[0_8px_30px_rgba(37,99,235,0.25)]">
      {/* Gradient hover glow overlay */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/0 to-accent/0 opacity-0 transition-opacity duration-300 group-hover:from-primary/[0.08] group-hover:to-accent/[0.08] group-hover:opacity-100" />
      {/* Gradient top border that fills on hover */}
      <div className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-gradient-to-r from-primary to-accent transition-transform duration-300 group-hover:scale-x-100 ltr:origin-left rtl:origin-right" />
      <div className="relative">
        <div className="mx-auto mb-3 grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-md shadow-primary/20 transition-transform duration-300 group-hover:scale-110">
          <Icon className="h-4 w-4" />
        </div>
        <h3 className="text-sm font-semibold leading-tight">{t(step.titleKey)}</h3>
        <p className="mt-1.5 line-clamp-3 text-xs leading-relaxed text-secondary-foreground/60">
          {t(step.descKey)}
        </p>
      </div>
    </div>
  )
}

function TestimonialsSlider({ testimonials, loading, onCta }: { testimonials: Testimonial[]; loading: boolean; onCta: () => void }) {
  const t = useT()
  const lang = useLang((s) => s.lang)
  const [active, setActive] = useState(0)
  const isRtl = lang === 'fa'

  if (loading) {
    return (
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      </section>
    )
  }

  if (testimonials.length === 0) return null
  const current = testimonials[active]
  const initials = current.clientName.split(' ').map((n) => n[0]).join('').slice(0, 2)

  const go = (dir: 1 | -1) => setActive((a) => (a + dir + testimonials.length) % testimonials.length)

  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
      {/* Section ambient background */}
      <div className="absolute inset-0 bg-radial-fade" />
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.04]" />

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={t('testimonials.eyebrow')}
          title={t('testimonials.title')}
          description={t('testimonials.desc')}
        />
        <Reveal className="mt-14">
          <Card className="group relative overflow-hidden rounded-3xl border-border/60 p-8 transition-all duration-300 hover:border-primary/30 hover:shadow-glow sm:p-14">
            {/* Gradient border on hover */}
            <span className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/20 via-transparent to-accent/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            {/* Grid + radial fade background */}
            <div className="pointer-events-none absolute inset-0 bg-radial-fade" />
            <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.05]" />
            {/* Floating accent blobs */}
            <div className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full bg-accent/15 blur-3xl animate-float" />
            <div className="pointer-events-none absolute -bottom-10 -left-10 h-44 w-44 rounded-full bg-primary/15 blur-3xl animate-float [animation-delay:2s]" />
            {/* Large decorative quote icon */}
            <Quote className={cn(
              'pointer-events-none absolute h-32 w-32 text-primary opacity-5 sm:h-40 sm:w-40',
              isRtl ? 'left-6 top-6 sm:left-10 sm:top-10' : 'right-6 top-6 sm:right-10 sm:top-10'
            )} />

            <div className="relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.id}
                  initial={{ opacity: 0, x: isRtl ? -40 : 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: isRtl ? 40 : -40 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                >
                  {/* Star rating with animated fill */}
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <motion.span
                        key={i}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 + i * 0.08, duration: 0.3 }}
                      >
                        <Star
                          className={cn(
                            'h-5 w-5 transition-colors',
                            i < current.rating ? 'fill-accent text-accent' : 'fill-muted text-muted-foreground/30'
                          )}
                        />
                      </motion.span>
                    ))}
                  </div>

                  <blockquote className="mt-6 text-xl font-medium leading-relaxed text-foreground sm:text-2xl">
                    &ldquo;{current.quote}&rdquo;
                  </blockquote>

                  <div className="mt-8 flex items-center gap-4">
                    <div className="relative grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-primary to-accent text-sm font-bold text-primary-foreground ring-2 ring-accent/20 ring-offset-2 ring-offset-background">
                      {current.avatar ? (
                        <img src={current.avatar} alt={current.clientName} className="h-full w-full rounded-full object-cover" />
                      ) : (
                        initials
                      )}
                    </div>
                    <div>
                      <p className="font-semibold">{tcClient(current.clientName, lang)}</p>
                      <p className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{current.role}</span>
                        <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
                        <span className="font-medium text-foreground/80">{tcClient(current.company, lang)}</span>
                      </p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </Card>
        </Reveal>

        {/* Pagination dots + progress indicator */}
        <div className="mt-8 flex items-center justify-center gap-2">
          {testimonials.map((item, i) => (
            <button
              key={item.id}
              onClick={() => setActive(i)}
              aria-label={t('about.testimonialN', { n: i + 1 })}
              className="group/dot relative h-2 rounded-full transition-all"
              style={{ width: i === active ? 32 : 8 }}
            >
              <span className={cn(
                'absolute inset-0 rounded-full transition-colors',
                i === active ? 'bg-gradient-to-r from-primary to-accent' : 'bg-muted-foreground/30 group-hover/dot:bg-muted-foreground/50'
              )} />
              {i === active && (
                <motion.span
                  layoutId="testimonial-progress"
                  className="absolute inset-0 rounded-full bg-primary-foreground/40"
                  initial={{ scaleX: 0, originX: isRtl ? 1 : 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Navigation + CTA */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => go(-1)}
            aria-label={t('testimonials.previous')}
            className="grid h-11 w-11 place-items-center rounded-full border border-border/60 bg-card text-foreground transition hover:border-primary/40 hover:bg-gradient-to-br hover:from-primary hover:to-accent hover:text-primary-foreground hover:shadow-glow"
          >
            <ChevronLeft className={cn('h-5 w-5', isRtl && 'rtl-flip')} />
          </button>
          <button
            onClick={() => go(1)}
            aria-label={t('testimonials.next')}
            className="grid h-11 w-11 place-items-center rounded-full border border-border/60 bg-card text-foreground transition hover:border-primary/40 hover:bg-gradient-to-br hover:from-primary hover:to-accent hover:text-primary-foreground hover:shadow-glow"
          >
            <ChevronRight className={cn('h-5 w-5', isRtl && 'rtl-flip')} />
          </button>
          <Button
            size="sm"
            onClick={onCta}
            className="ml-2 h-11 rounded-full bg-gradient-to-r from-primary to-accent px-6 text-primary-foreground shadow-glow transition hover:opacity-90 hover:shadow-glow"
          >
            {t('testimonials.seeMore')}
            <ArrowRight className={cn('ml-1.5 h-4 w-4', isRtl && 'mr-1.5 ml-0', 'rtl-flip')} />
          </Button>
        </div>
      </div>
    </section>
  )
}

function FinalCta({ onPrimary, onSecondary }: { onPrimary: () => void; onSecondary: () => void }) {
  const t = useT()
  const lang = useLang((s) => s.lang)
  return (
    <section id="estimate-cta" className="scroll-mt-24 px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-accent p-10 text-primary-foreground shadow-glow sm:p-16">
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-accent/30 blur-3xl" />
        <div className="relative mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-balance sm:text-5xl">
            {t('cta.title')}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-primary-foreground/80 sm:text-lg">
            {t('cta.desc')}
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="lg" variant="secondary" className="h-12 rounded-full px-7 text-base" onClick={onPrimary}>
              {t('cta.startProject')}
              <ArrowRight className={cn('ml-2 h-4 w-4', lang === 'fa' && 'mr-2 ml-0', 'rtl-flip')} />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12 rounded-full border-primary-foreground/30 bg-transparent px-7 text-base text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              onClick={onSecondary}
            >
              {t('cta.getEstimate')}
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
