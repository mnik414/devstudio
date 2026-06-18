'use client'

import { useState } from 'react'
import { Mail, CheckCircle2, Loader2, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useT, useLang } from '@/lib/lang-store'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

export function Newsletter({ source = 'footer' }: { source?: string }) {
  const t = useT()
  const lang = useLang((s) => s.lang)
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      toast.error(t('newsletter.invalidEmail'))
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || t('common.error'))
        return
      }
      setDone(true)
      toast.success(data.alreadySubscribed ? t('newsletter.alreadySubscribed') : t('newsletter.success'))
    } catch {
      toast.error(t('common.error'))
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-accent/30 bg-accent/5 p-4 text-sm">
        <CheckCircle2 className="h-5 w-5 shrink-0 text-accent" />
        <span>{t('newsletter.success')}</span>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="w-full">
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Mail className="pointer-events-none absolute top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground ltr:left-3 rtl:right-3" />
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('newsletter.placeholder')}
            className="h-11 ltr:pl-9 rtl:pr-9"
            disabled={loading}
            aria-label={t('newsletter.placeholder')}
          />
        </div>
        <Button type="submit" disabled={loading} className="h-11 shrink-0">
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="ltr:ml-1.5 rtl:mr-1.5">{t('newsletter.subscribing')}</span>
            </>
          ) : (
            <>
              {t('newsletter.subscribe')}
              <ArrowRight className={cn('h-4 w-4 ltr:ml-1.5 rtl:mr-1.5', lang === 'fa' && 'rtl-flip')} />
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
