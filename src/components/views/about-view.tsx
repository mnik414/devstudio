'use client'

import {
  Target,
  Eye,
  Heart,
  ArrowRight,
  Sparkles,
  Linkedin,
  Github,
  Twitter,
  Award,
  ShieldCheck,
  Handshake,
  GraduationCap,
  TrendingUp,
  Users,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Reveal } from '@/components/site/reveal'
import { SectionHeading } from '@/components/site/section-heading'
import { Counter } from '@/components/site/counter'
import { useSite, type TeamMember } from '@/lib/hooks'
import { useNav } from '@/lib/store'
import { useT, useLang } from '@/lib/lang-store'
import { cn } from '@/lib/utils'

type IconType = typeof Target

const MISSION_VISION_VALUES: { icon: IconType; titleKey: string; descKey: string }[] = [
  { icon: Target, titleKey: 'about.mission', descKey: 'about.missionDesc' },
  { icon: Eye, titleKey: 'about.vision', descKey: 'about.visionDesc' },
  { icon: Heart, titleKey: 'about.values', descKey: 'about.valuesCardDesc' },
]

const CORE_VALUES: { icon: IconType; titleKey: string; descKey: string }[] = [
  { icon: Award, titleKey: 'about.v1', descKey: 'about.v1Desc' },
  { icon: ShieldCheck, titleKey: 'about.v2', descKey: 'about.v2Desc' },
  { icon: Handshake, titleKey: 'about.v3', descKey: 'about.v3Desc' },
  { icon: GraduationCap, titleKey: 'about.v4', descKey: 'about.v4Desc' },
  { icon: TrendingUp, titleKey: 'about.v5', descKey: 'about.v5Desc' },
  { icon: Users, titleKey: 'about.v6', descKey: 'about.v6Desc' },
]

const TECH_STACK = [
  'Laravel',
  'PHP',
  'React',
  'Vue',
  'Next.js',
  'PostgreSQL',
  'MySQL',
  'TailwindCSS',
  'Docker',
  'Linux',
  'TypeScript',
  'Node.js',
]

export function AboutView() {
  const { data, isLoading } = useSite()
  const { setView } = useNav()
  const t = useT()
  const lang = useLang((s) => s.lang)
  const team = (data?.team ?? []).slice().sort((a, b) => a.order - b.order)

  const STATS = [
    { label: t('stats.projects'), value: 180, suffix: '+' },
    { label: t('stats.experience'), value: 12, suffix: '+' },
    { label: t('stats.satisfaction'), value: 98, suffix: '%' },
    { label: t('about.statsTeam'), value: 30, suffix: '+' },
  ]

  return (
    <div className="relative">
      {/* ========================================================= */}
      {/* 1. HERO */}
      {/* ========================================================= */}
      <section className="relative overflow-hidden py-20 sm:py-28">
        {/* Background visuals */}
        <div className="pointer-events-none absolute inset-0 -z-10 bg-grid" aria-hidden />
        <div className="pointer-events-none absolute inset-0 -z-10 bg-radial-fade" aria-hidden />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-32 bg-gradient-to-b from-transparent to-background" aria-hidden />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Reveal>
              <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                {t('about.eyebrow')}
              </span>
            </Reveal>
            <Reveal delay={0.05}>
              <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl md:leading-[1.05]">
                {t('about.title')}
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
                {t('about.desc')}
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button
                  size="lg"
                  onClick={() => setView('portfolio')}
                  className="w-full rounded-full sm:w-auto"
                >
                  {t('about.viewWork')}
                  <ArrowRight className={cn('ml-1.5 h-4 w-4', lang === 'fa' && 'mr-1.5 ml-0', 'rtl-flip')} />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => setView('contact')}
                  className="w-full rounded-full sm:w-auto"
                >
                  {t('about.startProject')}
                  <ArrowRight className={cn('ml-1.5 h-4 w-4', lang === 'fa' && 'mr-1.5 ml-0', 'rtl-flip')} />
                </Button>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 2. STORY */}
      {/* ========================================================= */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <Reveal>
              <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                {t('about.storyEyebrow')}
              </span>
              <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
                {t('about.storyTitle')}
              </h2>
              <div className="mt-6 space-y-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
                <p>
                  {t('about.storyP1')}
                </p>
                <p>
                  {t('about.storyP2')}
                </p>
                <p>
                  {t('about.storyP3')}
                </p>
              </div>
            </Reveal>

            {/* Right column: stat collage */}
            <Reveal delay={0.1}>
              <div className="grid grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-4 sm:space-y-6">
                  <Card className="overflow-hidden rounded-2xl p-6 shadow-soft">
                    <div className="flex items-center gap-2 text-primary">
                      <Sparkles className="h-5 w-5" />
                      <span className="text-xs font-semibold uppercase tracking-wider">
                        {t('about.founded')}
                      </span>
                    </div>
                    <div className="mt-3 text-5xl font-bold tracking-tight ltr-num">2012</div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {t('about.sinceDesc')}
                    </p>
                  </Card>
                  <Card className="overflow-hidden rounded-2xl bg-secondary p-6 text-secondary-foreground shadow-soft">
                    <div className="text-xs font-semibold uppercase tracking-wider text-accent">
                      {t('about.hq')}
                    </div>
                    <div className="mt-3 text-2xl font-bold">{t('about.hqValue')}</div>
                    <p className="mt-2 text-sm text-secondary-foreground/70">
                      {t('about.hqDesc')}
                    </p>
                  </Card>
                </div>
                <div className="space-y-4 pt-8 sm:space-y-6 sm:pt-12">
                  <Card className="overflow-hidden rounded-2xl border-primary/20 bg-primary/5 p-6 shadow-soft">
                    <div className="text-xs font-semibold uppercase tracking-wider text-primary">
                      {t('about.shipped')}
                    </div>
                    <div className="mt-3 text-5xl font-bold tracking-tight text-primary ltr-num">
                      <Counter to={180} suffix="+" />
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {t('about.shippedDesc')}
                    </p>
                  </Card>
                  <Card className="overflow-hidden rounded-2xl p-6 shadow-soft">
                    <div className="text-xs font-semibold uppercase tracking-wider">
                      {t('about.retention')}
                    </div>
                    <div className="mt-3 text-5xl font-bold tracking-tight ltr-num">
                      <Counter to={92} suffix="%" />
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {t('about.retentionDesc')}
                    </p>
                  </Card>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. MISSION / VISION / VALUES */}
      {/* ========================================================= */}
      <section className="bg-muted/40 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow={t('about.mvvEyebrow')}
            title={t('about.mvvTitle')}
            description={t('about.mvvDesc')}
          />
          <div className="mt-14 grid gap-6 md:grid-cols-3 md:gap-8">
            {MISSION_VISION_VALUES.map((item, i) => (
              <Reveal key={item.titleKey} delay={i * 0.08}>
                <Card className="group h-full rounded-2xl p-8 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-glow">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-6 text-xl font-semibold">{t(item.titleKey)}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                    {t(item.descKey)}
                  </p>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 4. STATS BAND */}
      {/* ========================================================= */}
      <section className="bg-secondary py-20 text-secondary-foreground sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-6">
            {STATS.map((stat, i) => (
              <Reveal key={stat.label} delay={i * 0.08} className="text-center">
                <div className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl ltr-num">
                  <Counter to={stat.value} suffix={stat.suffix} />
                </div>
                <div className="mt-2 text-xs font-medium uppercase tracking-wider text-secondary-foreground/70 sm:text-sm">
                  {stat.label}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 5. TEAM */}
      {/* ========================================================= */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow={t('about.teamEyebrow')}
            title={t('about.teamTitle')}
            description={t('about.teamDesc')}
          />

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i} className="rounded-2xl p-6">
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-16 w-16 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                    <div className="mt-4 space-y-2">
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-3 w-5/6" />
                    </div>
                  </Card>
                ))
              : team.map((member, i) => (
                  <TeamCard key={member.id} member={member} delay={i * 0.06} />
                ))}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 6. VALUES DEEP-DIVE */}
      {/* ========================================================= */}
      <section className="bg-muted/40 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow={t('about.valuesEyebrow')}
            title={t('about.valuesTitle')}
            description={t('about.valuesDesc')}
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {CORE_VALUES.map((value, i) => (
              <Reveal key={value.titleKey} delay={(i % 3) * 0.08}>
                <div className="group h-full rounded-2xl border border-border/60 bg-card p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-glow">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent transition-transform duration-300 group-hover:scale-110">
                      <value.icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-base font-semibold sm:text-lg">{t(value.titleKey)}</h3>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                    {t(value.descKey)}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 7. TECHNOLOGIES MARQUEE */}
      {/* ========================================================= */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow={t('about.techEyebrow')}
            title={t('about.techTitle')}
            description={t('about.techDesc')}
          />
        </div>
        <div className="mask-fade-x relative mt-12 overflow-hidden">
          <div className="flex w-max animate-marquee gap-3">
            {[...TECH_STACK, ...TECH_STACK].map((tech, i) => (
              <span
                key={`${tech}-${i}`}
                className="inline-flex shrink-0 items-center gap-2 rounded-full border border-border/60 bg-card px-5 py-2.5 text-sm font-medium text-foreground shadow-soft"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 8. FINAL CTA */}
      {/* ========================================================= */}
      <section className="px-4 pb-24 sm:px-6 lg:px-8">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-secondary px-6 py-16 text-center text-secondary-foreground shadow-soft sm:px-12 sm:py-20">
          <div className="pointer-events-none absolute inset-0 bg-grid opacity-40" aria-hidden />
          <div className="pointer-events-none absolute inset-0 bg-radial-fade" aria-hidden />
          <div className="relative">
            <Reveal>
              <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                {t('about.ctaTitle')}
              </h2>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="mx-auto mt-4 max-w-2xl text-pretty text-base text-secondary-foreground/70 sm:text-lg">
                {t('about.ctaDesc')}
              </p>
            </Reveal>
            <Reveal delay={0.16}>
              <Button
                size="lg"
                onClick={() => setView('contact')}
                className="mt-8 rounded-full"
              >
                {t('about.ctaButton')}
                <ArrowRight className={cn('ml-1.5 h-4 w-4', lang === 'fa' && 'mr-1.5 ml-0', 'rtl-flip')} />
              </Button>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Team card                                                           */
/* ------------------------------------------------------------------ */

function TeamCard({ member, delay }: { member: TeamMember; delay: number }) {
  const socials = [
    { key: 'linkedin', href: member.linkedin, icon: Linkedin, label: 'LinkedIn' },
    { key: 'github', href: member.github, icon: Github, label: 'GitHub' },
    { key: 'twitter', href: member.twitter, icon: Twitter, label: 'Twitter' },
  ].filter((s) => s.href)

  return (
    <Reveal delay={delay}>
      <Card className="group h-full overflow-hidden rounded-2xl p-6 shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-glow">
        <div className="flex items-start gap-4">
          <div className="relative shrink-0">
            <div className="overflow-hidden rounded-2xl ring-2 ring-primary/20 transition-all duration-300 group-hover:ring-primary/40">
              <img
                src={member.avatar}
                alt={member.name}
                className="h-16 w-16 object-cover transition-transform duration-300 group-hover:scale-110"
                loading="lazy"
              />
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-base font-semibold sm:text-lg">{member.name}</h3>
            <p className="mt-0.5 text-sm font-medium text-primary">{member.role}</p>
          </div>
        </div>
        <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {member.bio}
        </p>
        {socials.length > 0 && (
          <div className="mt-5 flex items-center gap-2">
            {socials.map((s) => (
              <a
                key={s.key}
                href={s.href!}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${member.name} on ${s.label}`}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-border/60 bg-background text-muted-foreground transition-colors hover:border-primary/40 hover:bg-primary/10 hover:text-primary"
              >
                <s.icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        )}
      </Card>
    </Reveal>
  )
}
