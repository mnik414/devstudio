'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Compass,
  MapPin,
  Home,
  ArrowRight,
  FolderKanban,
  BookOpen,
  FileText,
  Mail,
  type LucideIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useNav, type ViewKey } from '@/lib/store'
import { useT, useLang } from '@/lib/lang-store'
import { cn } from '@/lib/utils'

const SUGGESTED_LINKS: { icon: LucideIcon; labelKey: string; view: ViewKey }[] = [
  { icon: FolderKanban, labelKey: 'nav.portfolio', view: 'portfolio' },
  { icon: BookOpen, labelKey: 'nav.blog', view: 'blog' },
  { icon: FileText, labelKey: 'nav.caseStudies', view: 'case-studies' },
  { icon: Mail, labelKey: 'nav.contact', view: 'contact' },
]

export default function NotFound() {
  const router = useRouter()
  const setView = useNav((s) => s.setView)
  const t = useT()
  const lang = useLang((s) => s.lang)

  const go = (v: ViewKey) => {
    setView(v)
    router.push('/')
  }

  return (
    <main className="relative flex min-h-screen flex-1 flex-col items-center justify-center overflow-hidden px-4 py-20">
      {/* Background layers */}
      <div className="bg-radial-fade pointer-events-none absolute inset-0" aria-hidden />
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-60" aria-hidden />

      {/* Floating gradient blobs */}
      <div
        className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-primary/20 blur-3xl animate-float"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-accent/20 blur-3xl animate-float [animation-delay:1.5s]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute right-1/4 top-1/3 h-48 w-48 rounded-full bg-primary/10 blur-3xl animate-float [animation-delay:3s]"
        aria-hidden
      />

      <div className="relative z-10 flex w-full max-w-3xl flex-col items-center text-center">
        {/* Decorative compass badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 18, delay: 0.1 }}
          className="mb-8 grid size-16 place-items-center rounded-2xl border border-border/60 bg-card shadow-soft"
        >
          <Compass className="h-8 w-8 animate-[spin_8s_linear_infinite] text-primary" />
        </motion.div>

        {/* Huge 404 with text-gradient + spring entrance + subtle floating */}
        <div className="relative">
          {/* Glow behind the 404 */}
          <div
            className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-r from-primary/30 to-accent/30 blur-3xl"
            aria-hidden
          />
          <h1 className="text-gradient select-none text-[7rem] font-black leading-none tracking-tighter sm:text-[11rem] md:text-[14rem] lg:text-[16rem]">
            <motion.span
              initial={{ opacity: 0, scale: 0.3, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 180, damping: 16, delay: 0.2 }}
              className="inline-block"
            >
              <motion.span
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="inline-block"
              >
                404
              </motion.span>
            </motion.span>
          </h1>

          {/* Decorative MapPin floating near the 404 */}
          <motion.span
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 220, damping: 14, delay: 0.7 }}
            className="pointer-events-none absolute -right-2 top-0 grid size-10 place-items-center rounded-full border border-border/60 bg-card shadow-soft sm:-right-6 sm:size-12"
            aria-hidden
          >
            <motion.span
              animate={{ y: [0, -6, 0], rotate: [0, 8, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
              className="inline-block"
            >
              <MapPin className="h-5 w-5 text-accent sm:h-6 sm:w-6" />
            </motion.span>
          </motion.span>
        </div>

        {/* Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-4 max-w-md"
        >
          <h2 className="text-balance text-2xl font-bold tracking-tight sm:text-3xl">
            {t('error.404Title')}
          </h2>
          <p className="mt-3 text-balance text-muted-foreground sm:text-lg">
            {t('error.404Desc')}
          </p>
        </motion.div>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.65 }}
          className="mt-8 flex flex-col gap-3 sm:flex-row"
        >
          <Button
            onClick={() => go('home')}
            size="lg"
            className="rounded-full bg-gradient-to-r from-primary to-accent text-white shadow-soft transition-all hover:shadow-glow hover:opacity-90"
          >
            <Home className={cn('h-4 w-4', lang === 'fa' ? 'ml-1.5' : 'mr-1.5')} />
            {t('error.backHome')}
          </Button>
          <Button
            onClick={() => go('portfolio')}
            size="lg"
            variant="outline"
            className="rounded-full border-primary/30 hover:border-primary hover:bg-primary/5"
          >
            {t('error.browseWork')}
            <ArrowRight
              className={cn(
                'h-4 w-4',
                lang === 'fa' ? 'mr-1.5 rtl-flip' : 'ml-1.5',
              )}
            />
          </Button>
        </motion.div>

        {/* Suggested links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-16 w-full max-w-2xl"
        >
          <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {t('error.suggested')}
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {SUGGESTED_LINKS.map(({ icon: Icon, labelKey, view }, i) => (
              <motion.button
                key={view}
                type="button"
                onClick={() => go(view)}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.9 + i * 0.08 }}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.97 }}
                className="group flex flex-col items-center gap-2 rounded-2xl border border-border/60 bg-card p-4 text-center shadow-xs transition-colors hover:border-primary/40 hover:shadow-soft"
              >
                <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="text-sm font-medium">{t(labelKey)}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </main>
  )
}
