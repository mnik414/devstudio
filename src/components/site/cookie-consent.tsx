'use client'

import { useState, useSyncExternalStore } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Cookie, ShieldCheck, ShieldAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useT, useLang } from '@/lib/lang-store'
import { cn } from '@/lib/utils'

const STORAGE_KEY = 'devstudio-cookie-consent'

type Consent = 'accepted' | 'essential' | null

const emptySubscribe = () => () => {}

export function CookieConsent() {
  const t = useT()
  const lang = useLang((s) => s.lang)
  const [consent, setConsent] = useState<Consent>(null)

  // useSyncExternalStore to safely read localStorage only on the client (avoids hydration mismatch)
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  )

  // Read stored consent directly from localStorage (only runs on client after mount)
  const storedConsent = mounted
    ? (() => {
        try {
          return localStorage.getItem(STORAGE_KEY) as Consent
        } catch {
          return null
        }
      })()
    : null

  const decide = (value: Exclude<Consent, null>) => {
    setConsent(value)
    try {
      localStorage.setItem(STORAGE_KEY, value)
    } catch {
      // ignore
    }
  }

  // Don't render until mounted (avoids hydration mismatch) or if already decided
  const currentConsent = consent ?? storedConsent
  if (!mounted || currentConsent !== null) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 80 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 80 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          'fixed bottom-4 z-[70] w-[calc(100%-2rem)] max-w-2xl',
          'ltr:left-1/2 rtl:left-1/2 -translate-x-1/2',
        )}
      >
        <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/95 p-5 shadow-soft backdrop-blur-xl sm:p-6">
          {/* Accent gradient strip */}
          <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-primary via-accent to-primary" />

          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            {/* Icon */}
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
              <Cookie className="h-6 w-6" />
            </div>

            {/* Content */}
            <div className="flex-1">
              <h3 className="text-base font-semibold">{t('cookie.title')}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {t('cookie.desc')}
              </p>

              {/* Actions */}
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <Button size="sm" onClick={() => decide('accepted')} className="h-9 rounded-full">
                  <ShieldCheck className={cn('h-4 w-4', lang === 'fa' ? 'ml-1.5' : 'mr-1.5')} />
                  {t('cookie.accept')}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => decide('essential')}
                  className="h-9 rounded-full"
                >
                  <ShieldAlert className={cn('h-4 w-4', lang === 'fa' ? 'ml-1.5' : 'mr-1.5')} />
                  {t('cookie.essential')}
                </Button>
                <a
                  href="#"
                  className="ml-auto text-xs font-medium text-muted-foreground underline-offset-4 transition hover:text-foreground hover:underline"
                >
                  {t('cookie.privacy')}
                </a>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
