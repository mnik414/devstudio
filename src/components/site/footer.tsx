'use client'

import { Logo } from './logo'
import { Newsletter } from './newsletter'
import { useNav, type ViewKey } from '@/lib/store'
import { useT } from '@/lib/lang-store'
import { Github, Linkedin, Twitter, Mail, MapPin, Phone, ArrowUpRight } from 'lucide-react'

export function Footer() {
  const { setView } = useNav()
  const t = useT()

  const FOOTER_LINKS: { title: string; links: { label: string; view?: ViewKey }[] }[] = [
    {
      title: t('footer.company'),
      links: [
        { label: t('footer.about'), view: 'about' },
        { label: t('footer.ourWork'), view: 'portfolio' },
        { label: t('footer.caseStudies'), view: 'case-studies' },
        { label: t('footer.blog'), view: 'blog' },
      ],
    },
    {
      title: t('footer.services'),
      links: [
        { label: t('footer.webDev') },
        { label: t('footer.ecommerce') },
        { label: t('footer.saas') },
        { label: t('footer.ai') },
      ],
    },
    {
      title: t('footer.resources'),
      links: [
        { label: t('footer.estimator'), view: 'estimate' },
        { label: t('footer.contact'), view: 'contact' },
        { label: t('footer.faqs'), view: 'home' },
      ],
    },
  ]

  return (
    <footer className="mt-auto border-t border-border/60 bg-secondary text-secondary-foreground">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <div className="[&_span]:!text-secondary-foreground [&_.text-gradient]:!bg-gradient-to-r [&_.text-gradient]:from-white [&_.text-gradient]:to-accent">
              <Logo />
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-secondary-foreground/70">
              {t('footer.desc')}
            </p>
            <div className="mt-5 flex items-center gap-3">
              {[
                { icon: Github, label: 'GitHub' },
                { icon: Linkedin, label: 'LinkedIn' },
                { icon: Twitter, label: 'Twitter' },
              ].map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="grid h-9 w-9 place-items-center rounded-lg bg-white/5 text-secondary-foreground/80 ring-1 ring-white/10 transition hover:bg-white/10 hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
            {/* Newsletter signup */}
            <div className="mt-6 max-w-sm">
              <p className="text-sm font-semibold text-secondary-foreground">{t('newsletter.title')}</p>
              <p className="mt-1 text-xs leading-relaxed text-secondary-foreground/60">{t('newsletter.desc')}</p>
              <div className="mt-3 [&_input]:bg-white/5 [&_input]:border-white/10 [&_input]:text-secondary-foreground [&_input]:placeholder:text-secondary-foreground/40">
                <Newsletter source="footer" />
              </div>
            </div>
          </div>

          {FOOTER_LINKS.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-secondary-foreground/90">
                {col.title}
              </h4>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <button
                      onClick={() => link.view && setView(link.view)}
                      className="group inline-flex items-center gap-1 text-sm text-secondary-foreground/70 transition hover:text-white"
                    >
                      {link.label}
                      <ArrowUpRight className="h-3 w-3 opacity-0 transition group-hover:opacity-100" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 grid gap-4 border-t border-white/10 pt-8 text-sm text-secondary-foreground/70 sm:grid-cols-3">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 shrink-0 text-accent" />
            hello@devstudio.com
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 shrink-0 text-accent" />
            <span className="ltr-num">+1 (555) 123-4567</span>
          </div>
          <div className="flex items-center gap-2 sm:justify-end">
            <MapPin className="h-4 w-4 shrink-0 text-accent" />
            123 Innovation Drive, San Francisco, CA
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-secondary-foreground/60 sm:flex-row">
          <p>© {new Date().getFullYear()} DevStudio. {t('footer.rights')}</p>
          <div className="flex items-center gap-4">
            <p>{t('footer.crafted')}</p>
            <button
              onClick={() => setView('admin')}
              className="text-secondary-foreground/40 transition hover:text-accent"
              aria-label={t('nav.admin')}
            >
              {t('nav.admin')}
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
