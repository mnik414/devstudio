'use client'

import { motion } from 'framer-motion'
import {
  ArrowRight,
  ArrowUpRight,
  Code2,
  ShoppingCart,
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
} from 'lucide-react'
import { useState } from 'react'
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
import {
  useSite,
  usePortfolios,
  parseList,
  type Service,
  type Portfolio,
  type Testimonial,
} from '@/lib/hooks'
import { useNav } from '@/lib/store'

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
  { icon: Compass, title: 'Discovery', desc: 'We dive deep into your business, users, and goals to define a clear product strategy.' },
  { icon: ClipboardCheck, title: 'Planning', desc: 'Roadmaps, milestones, and technical architecture are mapped out with full transparency.' },
  { icon: Lightbulb, title: 'UI/UX Design', desc: 'Wireframes evolve into pixel-perfect, accessible, conversion-focused interfaces.' },
  { icon: Hammer, title: 'Development', desc: 'Clean, tested, scalable code built in iterative sprints with weekly demos.' },
  { icon: TestTube, title: 'Testing', desc: 'Automated tests, QA passes, and performance audits ensure production readiness.' },
  { icon: Rocket, title: 'Launch', desc: 'Zero-downtime deployment with monitoring, analytics, and SEO in place.' },
  { icon: LifeBuoy, title: 'Support', desc: 'Ongoing maintenance, optimizations, and feature iterations post-launch.' },
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

  const featuredPortfolios = portfolioData?.items ?? []
  const services = siteData?.services ?? []
  const testimonials = siteData?.testimonials ?? []
  const faqs = siteData?.faqs ?? []
  const settings = siteData?.settings ?? {}

  return (
    <div className="overflow-hidden">
      {/* ===== HERO ===== */}
      <section className="relative isolate overflow-hidden bg-radial-fade pb-24 pt-20 sm:pt-28">
        <div className="absolute inset-0 -z-10 bg-grid opacity-60 [mask-image:radial-gradient(70%_60%_at_50%_0%,black,transparent)]" />
        <div className="absolute -top-24 left-1/2 -z-10 h-72 w-[40rem] -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />
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
              Now booking Q3 2024 projects
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.05 }}
              className="text-4xl font-bold tracking-tight text-balance sm:text-6xl md:text-7xl md:leading-[1.05]"
            >
              We Build <span className="text-gradient">Fast, Scalable</span> & Modern Digital Products
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl"
            >
              DevStudio is a premium web development agency crafting high-performance websites,
              SaaS platforms, and AI-powered products that convert visitors into customers.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
            >
              <Button size="lg" className="h-12 rounded-full px-7 text-base" onClick={() => setView('portfolio')}>
                View Portfolio
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="h-12 rounded-full px-7 text-base" onClick={() => setView('contact')}>
                Request Consultation
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground"
            >
              {['180+ projects shipped', '98% client satisfaction', '12+ years experience'].map((t) => (
                <span key={t} className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-accent" />
                  {t}
                </span>
              ))}
            </motion.div>
          </div>

          {/* Floating dashboard mockup */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto mt-16 max-w-5xl"
          >
            <div className="absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-tr from-primary/20 via-accent/10 to-transparent blur-2xl" />
            <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-soft">
              <div className="flex items-center gap-1.5 border-b border-border/60 bg-muted/40 px-4 py-3">
                <span className="h-3 w-3 rounded-full bg-red-400/80" />
                <span className="h-3 w-3 rounded-full bg-yellow-400/80" />
                <span className="h-3 w-3 rounded-full bg-green-400/80" />
                <span className="ml-3 text-xs text-muted-foreground">devstudio.com/dashboard</span>
              </div>
              <div className="grid gap-4 p-5 sm:grid-cols-3">
                {[
                  { label: 'Active Users', value: '48,920', trend: '+12.4%', color: 'text-accent' },
                  { label: 'Revenue', value: '$92,310', trend: '+8.1%', color: 'text-accent' },
                  { label: 'Conversion', value: '4.8%', trend: '+0.6pt', color: 'text-accent' },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-xl border border-border/60 bg-background p-4">
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                    <p className="mt-1 text-2xl font-bold">{stat.value}</p>
                    <p className={`mt-1 text-xs font-medium ${stat.color}`}>{stat.trend} ↑</p>
                  </div>
                ))}
                <div className="sm:col-span-3">
                  <div className="flex h-32 items-end gap-2 rounded-xl border border-border/60 bg-background p-4">
                    {[40, 65, 50, 80, 55, 90, 70, 95, 60, 85, 75, 100].map((h, i) => (
                      <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        transition={{ duration: 0.6, delay: 0.6 + i * 0.05 }}
                        className="flex-1 rounded-t bg-gradient-to-t from-primary/40 to-accent"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="pointer-events-none absolute -right-6 -top-6 hidden animate-float rounded-xl border border-border/60 bg-card p-3 shadow-soft sm:block">
              <div className="flex items-center gap-2">
                <div className="grid h-8 w-8 place-items-center rounded-lg bg-accent/15 text-accent">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold">AI Insights</p>
                  <p className="text-[10px] text-muted-foreground">Live</p>
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
            Trusted by teams at fast-growing companies
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

      {/* ===== STATISTICS ===== */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="By the numbers"
            title={<>Results that speak for themselves</>}
            description="Over a decade of building digital products that drive measurable business outcomes."
          />
          <div className="mt-14 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {[
              { label: 'Completed Projects', value: Number(settings.stats_projects || 180), suffix: '+' },
              { label: 'Years of Experience', value: Number(settings.stats_experience || 12), suffix: '+' },
              { label: 'Client Satisfaction', value: Number(settings.stats_satisfaction || 98), suffix: '%' },
              { label: 'Technologies Used', value: Number(settings.stats_technologies || 25), suffix: '+' },
            ].map((stat, i) => (
              <Reveal key={stat.label} delay={i * 0.1}>
                <Card className="group relative overflow-hidden border-border/60 p-6 text-center transition hover:shadow-soft sm:p-8">
                  <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 transition group-hover:opacity-100" />
                  <div className="text-4xl font-bold tracking-tight text-gradient sm:text-5xl">
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
              eyebrow="Featured Work"
              title={<>Selected projects we're proud of</>}
              description="A glimpse into the products we've shipped across industries."
            />
            <Button variant="outline" className="shrink-0 rounded-full" onClick={() => setView('portfolio')}>
              View all projects
              <ArrowRight className="ml-2 h-4 w-4" />
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
            eyebrow="What we do"
            title={<>Full-stack expertise under one roof</>}
            description="From idea to launch and beyond — we cover every layer of modern product development."
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
              How we work
            </span>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-[2.6rem] md:leading-[1.1]">
              A proven process from <span className="text-gradient bg-gradient-to-r from-white to-accent">discovery to launch</span>
            </h2>
            <p className="mt-4 text-base leading-relaxed text-secondary-foreground/70 sm:text-lg">
              No black boxes. You'll always know what's happening, why, and what's next.
            </p>
          </div>

          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PROCESS_STEPS.map((step, i) => (
              <Reveal key={step.title} delay={i * 0.06}>
                <div className="group relative h-full rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:bg-white/[0.08]">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-primary to-accent text-primary-foreground">
                      <step.icon className="h-5 w-5" />
                    </div>
                    <span className="text-3xl font-bold text-white/10 transition group-hover:text-white/20">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-secondary-foreground/70">{step.desc}</p>
                </div>
              </Reveal>
            ))}
            <Reveal delay={0.42}>
              <button
                onClick={() => setView('contact')}
                className="group flex h-full w-full flex-col items-start justify-center rounded-2xl border border-accent/30 bg-accent/10 p-6 text-left transition hover:bg-accent/20"
              >
                <ArrowUpRight className="mb-3 h-6 w-6 text-accent transition group-hover:translate-x-1 group-hover:-translate-y-1" />
                <h3 className="text-lg font-semibold">Ready to start?</h3>
                <p className="mt-2 text-sm text-secondary-foreground/70">Book a free discovery call today.</p>
              </button>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <TestimonialsSlider testimonials={testimonials} loading={siteLoading} onCta={() => setView('portfolio')} />

      {/* ===== TECHNOLOGIES ===== */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Our stack"
            title={<>Modern tools, battle-tested in production</>}
            description="We choose technologies for their reliability, performance, and long-term maintainability."
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
      <section id="faq" className="scroll-mt-24 bg-muted/30 py-20 sm:py-28">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="FAQ"
            title={<>Questions, answered</>}
            description="Everything you need to know about working with us. Still curious? Just ask."
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
                  className="overflow-hidden rounded-xl border border-border/60 bg-card px-5 data-[state=open]:shadow-soft"
                >
                  <AccordionTrigger className="hover:no-underline">
                    <span className="text-left text-base font-semibold">{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
          <div className="mt-10 text-center">
            <p className="text-sm text-muted-foreground">Still have questions?</p>
            <Button variant="link" className="mt-1 text-primary" onClick={() => setView('contact')}>
              Talk to our team →
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
  return (
    <Reveal delay={index * 0.08}>
      <Card
        onClick={onClick}
        className="group cursor-pointer overflow-hidden border-border/60 p-0 transition duration-300 hover:-translate-y-1 hover:shadow-soft"
      >
        <div className="relative aspect-video overflow-hidden">
          <img
            src={portfolio.coverImage}
            alt={portfolio.title}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
          {portfolio.category && (
            <Badge className="absolute left-3 top-3 border-0 bg-background/90 text-foreground backdrop-blur">
              {portfolio.category.name}
            </Badge>
          )}
          <div className="absolute bottom-3 right-3 translate-y-2 rounded-full bg-primary p-2 text-primary-foreground opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <ArrowUpRight className="h-4 w-4" />
          </div>
        </div>
        <div className="p-5">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{portfolio.year}</span>
            {portfolio.clientName && (
              <>
                <span>•</span>
                <span>{portfolio.clientName}</span>
              </>
            )}
          </div>
          <h3 className="mt-1.5 text-lg font-semibold leading-snug">{portfolio.title}</h3>
          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{portfolio.summary}</p>
          {portfolio.technologies && portfolio.technologies.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {portfolio.technologies.slice(0, 3).map((t) => (
                <span
                  key={t.id}
                  className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"
                >
                  {t.color && <span className="h-1.5 w-1.5 rounded-full" style={{ background: t.color }} />}
                  {t.name}
                </span>
              ))}
              {portfolio.technologies.length > 3 && (
                <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                  +{portfolio.technologies.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </Card>
    </Reveal>
  )
}

function ServiceCard({ service, index, onCta }: { service: Service; index: number; onCta: () => void }) {
  const Icon = iconMap[service.icon] ?? Code2
  const features = parseList<string>(service.features)
  return (
    <Reveal delay={index * 0.06}>
      <Card className="group relative h-full overflow-hidden border-border/60 p-6 transition duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-soft">
        <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary/5 transition group-hover:scale-150" />
        <div className="relative">
          <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
            <Icon className="h-6 w-6" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">{service.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{service.description}</p>
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
            Learn more
            <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
          </button>
        </div>
      </Card>
    </Reveal>
  )
}

function TestimonialsSlider({ testimonials, loading, onCta }: { testimonials: Testimonial[]; loading: boolean; onCta: () => void }) {
  const [active, setActive] = useState(0)

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

  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Testimonials"
          title={<>Don't just take our word for it</>}
          description="Real feedback from founders and product leaders we've partnered with."
        />
        <Reveal className="mt-14">
          <Card className="relative overflow-hidden border-border/60 p-8 sm:p-12">
            <Quote className="absolute right-6 top-6 h-20 w-20 text-primary/5" />
            <div className="relative">
              <div className="flex gap-1">
                {Array.from({ length: current.rating }).map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-accent text-accent" />
                ))}
              </div>
              <blockquote className="mt-6 text-xl font-medium leading-relaxed text-foreground sm:text-2xl">
                "{current.quote}"
              </blockquote>
              <div className="mt-8 flex items-center gap-4">
                <div className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-primary to-accent text-sm font-bold text-primary-foreground">
                  {current.avatar ? (
                    <img src={current.avatar} alt={current.clientName} className="h-full w-full rounded-full object-cover" />
                  ) : (
                    current.clientName.split(' ').map((n) => n[0]).join('').slice(0, 2)
                  )}
                </div>
                <div>
                  <p className="font-semibold">{current.clientName}</p>
                  <p className="text-sm text-muted-foreground">{current.role}, {current.company}</p>
                </div>
              </div>
            </div>
          </Card>
        </Reveal>

        <div className="mt-6 flex items-center justify-center gap-2">
          {testimonials.map((t, i) => (
            <button
              key={t.id}
              onClick={() => setActive(i)}
              aria-label={`Testimonial ${i + 1}`}
              className={`h-2 rounded-full transition-all ${
                i === active ? 'w-8 bg-primary' : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'
              }`}
            />
          ))}
        </div>

        <div className="mt-6 flex items-center justify-center gap-3">
          <Button variant="outline" size="sm" className="rounded-full" onClick={() => setActive((a) => (a - 1 + testimonials.length) % testimonials.length)}>
            Previous
          </Button>
          <Button variant="outline" size="sm" className="rounded-full" onClick={() => setActive((a) => (a + 1) % testimonials.length)}>
            Next
          </Button>
          <Button size="sm" className="rounded-full" onClick={onCta}>
            See more work
            <ArrowRight className="ml-1.5 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  )
}

function FinalCta({ onPrimary, onSecondary }: { onPrimary: () => void; onSecondary: () => void }) {
  return (
    <section id="estimate-cta" className="scroll-mt-24 px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-accent p-10 text-primary-foreground shadow-glow sm:p-16">
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-accent/30 blur-3xl" />
        <div className="relative mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-balance sm:text-5xl">
            Let's build something your users will love
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-primary-foreground/80 sm:text-lg">
            Tell us about your project. We'll get back within 24 hours with next steps and a tailored plan.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="lg" variant="secondary" className="h-12 rounded-full px-7 text-base" onClick={onPrimary}>
              Start your project
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12 rounded-full border-primary-foreground/30 bg-transparent px-7 text-base text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              onClick={onSecondary}
            >
              Get an estimate
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
