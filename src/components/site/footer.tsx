'use client'

import { Logo } from './logo'
import { useNav, type ViewKey } from '@/lib/store'
import { Github, Linkedin, Twitter, Mail, MapPin, Phone, ArrowUpRight } from 'lucide-react'

const FOOTER_LINKS: { title: string; links: { label: string; view?: ViewKey; href?: string }[] }[] = [
  {
    title: 'Company',
    links: [
      { label: 'About Us', view: 'about' },
      { label: 'Our Work', view: 'portfolio' },
      { label: 'Case Studies', view: 'case-studies' },
      { label: 'Blog', view: 'blog' },
    ],
  },
  {
    title: 'Services',
    links: [
      { label: 'Web Development' },
      { label: 'E-commerce' },
      { label: 'SaaS Platforms' },
      { label: 'AI Integration' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Project Estimator', view: 'estimate' },
      { label: 'Contact', view: 'contact' },
      { label: 'FAQs', view: 'home' },
    ],
  },
]

export function Footer() {
  const { setView } = useNav()
  return (
    <footer className="mt-auto border-t border-border/60 bg-secondary text-secondary-foreground">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <div className="[&_span]:!text-secondary-foreground [&_.text-gradient]:!bg-gradient-to-r [&_.text-gradient]:from-white [&_.text-gradient]:to-accent">
              <Logo />
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-secondary-foreground/70">
              We build fast, scalable, and modern digital products. From marketing sites to
              enterprise SaaS — we help ambitious teams ship software that converts.
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
            <Mail className="h-4 w-4 text-accent" />
            hello@devstudio.com
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-accent" />
            +1 (555) 123-4567
          </div>
          <div className="flex items-center gap-2 sm:justify-end">
            <MapPin className="h-4 w-4 text-accent" />
            123 Innovation Drive, San Francisco, CA
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-secondary-foreground/60 sm:flex-row">
          <p>© {new Date().getFullYear()} DevStudio. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <p>Crafted with care · Built on Next.js, TypeScript & Prisma</p>
            <button
              onClick={() => setView('admin')}
              className="text-secondary-foreground/40 transition hover:text-accent"
              aria-label="Admin panel"
            >
              Admin
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
