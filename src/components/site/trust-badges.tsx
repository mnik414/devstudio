'use client'

import { ShieldCheck, Headphones, FileLock2, Clock } from 'lucide-react'
import { Reveal } from '@/components/site/reveal'
import { useT } from '@/lib/lang-store'

const BADGES = [
  { icon: ShieldCheck, key: 'guarantee' },
  { icon: Headphones, key: 'support' },
  { icon: FileLock2, key: 'nda' },
  { icon: Clock, key: 'delivery' },
] as const

export function TrustBadges() {
  const t = useT()

  return (
    <section className="border-y border-border/60 bg-muted/20 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <p className="mb-8 text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {t('trust.title')}
          </p>
        </Reveal>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {BADGES.map((badge, i) => (
            <Reveal key={badge.key} delay={i * 0.08}>
              <div className="group flex h-full flex-col items-center gap-3 rounded-2xl border border-border/50 bg-card p-5 text-center transition duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-soft">
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary transition duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground">
                  <badge.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold">{t(`trust.${badge.key}`)}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {t(`trust.${badge.key}Desc`)}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
