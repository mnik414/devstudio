'use client'

import { useState, type FormEvent } from 'react'
import { motion } from 'framer-motion'
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Send,
  Github,
  Linkedin,
  Twitter,
  Calendar,
  FileText,
  Rocket,
} from 'lucide-react'
import { toast } from 'sonner'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Reveal } from '@/components/site/reveal'
import { SectionHeading } from '@/components/site/section-heading'
import { cn } from '@/lib/utils'
import { useT, useLang } from '@/lib/lang-store'
import { getBilingualValue, fetchSettings, type SiteSettings } from '@/lib/settings'

type FormState = {
  fullName: string
  company: string
  email: string
  phone: string
  budget: string
  message: string
}

type Errors = Partial<Record<keyof FormState, string>>

const SOCIALS = [
  { icon: Github, label: 'GitHub', href: 'https://github.com' },
  { icon: Linkedin, label: 'LinkedIn', href: 'https://linkedin.com' },
  { icon: Twitter, label: 'Twitter', href: 'https://twitter.com' },
]

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const CONFETTI = [
  { x: -110, y: -30, rotate: -40, color: 'bg-primary' },
  { x: -80, y: -90, rotate: -25, color: 'bg-accent' },
  { x: -40, y: -120, rotate: -10, color: 'bg-primary' },
  { x: 0, y: -130, rotate: 0, color: 'bg-accent' },
  { x: 40, y: -120, rotate: 10, color: 'bg-primary' },
  { x: 80, y: -90, rotate: 25, color: 'bg-accent' },
  { x: 110, y: -30, rotate: 40, color: 'bg-primary' },
  { x: -120, y: 30, rotate: -55, color: 'bg-accent' },
  { x: 120, y: 30, rotate: 55, color: 'bg-primary' },
  { x: -70, y: 60, rotate: -70, color: 'bg-accent' },
  { x: 70, y: 60, rotate: 70, color: 'bg-primary' },
  { x: 0, y: -70, rotate: 0, color: 'bg-accent' },
]

export function ContactView() {
  const t = useT()
  const lang = useLang((s) => s.lang)

  const { data: settings = {} as SiteSettings } = useQuery({
    queryKey: ['site-settings'],
    queryFn: fetchSettings,
    staleTime: 60_000,
  })

  const getVal = (key: string, fallback: string) => {
    const raw = settings[key]
    if (!raw) return fallback
    return getBilingualValue(raw, lang)
  }

  const [form, setForm] = useState<FormState>({
    fullName: '',
    company: '',
    email: '',
    phone: '',
    budget: '',
    message: '',
  })
  const [errors, setErrors] = useState<Errors>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const BUDGET_OPTIONS = [
    { value: '< $2k', label: t('contact.budgetOpt1') },
    { value: '$2k - $5k', label: t('contact.budgetOpt2') },
    { value: '$5k - $15k', label: t('contact.budgetOpt3') },
    { value: '$15k - $50k', label: t('contact.budgetOpt4') },
    { value: '$50k+', label: t('contact.budgetOpt5') },
  ]

  const CONTACT_DETAILS = [
    {
      icon: Mail,
      label: t('contact.email'),
      value: getVal('email', 'hello@devstudio.com'),
      href: `mailto:${getVal('email', 'hello@devstudio.com')}`,
      ltr: true,
    },
    {
      icon: Phone,
      label: t('contact.phone'),
      value: getVal('phone', '+98 21 1234 5678'),
      href: `tel:${getVal('phone', '+982112345678')}`,
      ltr: true,
    },
    {
      icon: MapPin,
      label: t('contact.address'),
      value: getVal('address', t('contact.address')),
      href: 'https://maps.google.com',
      ltr: false,
    },
  ]

  const NEXT_STEPS = [
    { icon: Calendar, title: t('contact.step1'), desc: t('contact.step1Desc') },
    { icon: FileText, title: t('contact.step2'), desc: t('contact.step2Desc') },
    { icon: Rocket, title: t('contact.step3'), desc: t('contact.step3Desc') },
  ]

  const isFa = lang === 'fa'

  const sampleName = isFa ? 'علی رضایی' : 'Jane Doe'
  const sampleCompany = isFa ? 'شرکت نمونه' : 'Acme Inc.'
  const sampleEmail = isFa ? 'ali@example.com' : 'jane@acme.com'
  const samplePhone = isFa ? '۰۹۱۲ ۳۴۵ ۶۷۸۹' : '+1 (415) 555-0192'

  const update = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  const validate = (): boolean => {
    const next: Errors = {}
    if (!form.fullName.trim()) next.fullName = t('contact.requiredField')
    if (!form.email.trim()) next.email = t('contact.requiredField')
    else if (!emailRegex.test(form.email)) next.email = t('contact.invalidEmail')
    if (!form.message.trim()) next.message = t('contact.requiredField')
    else if (form.message.trim().length < 10) next.message = t('contact.minMessage')
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!validate()) {
      toast.error(t('contact.fixErrors'))
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => null)
        throw new Error(data?.error || 'Request failed')
      }
      setSubmitted(true)
      toast.success(t('contact.successTitle'), { description: t('contact.successDesc') })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong.'
      toast.error(t('contact.sendFailed'), { description: message })
    } finally {
      setSubmitting(false)
    }
  }

  const resetForm = () => {
    setForm({ fullName: '', company: '', email: '', phone: '', budget: '', message: '' })
    setErrors({})
    setSubmitted(false)
  }

  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-grid opacity-40"
        style={{
          maskImage:
            'radial-gradient(ellipse 80% 60% at 50% 0%, black 30%, transparent 75%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 80% 60% at 50% 0%, black 30%, transparent 75%)',
        }}
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[420px] bg-radial-fade" />
      <div className="pointer-events-none absolute -top-20 left-[8%] -z-10 size-72 rounded-full bg-primary/15 blur-3xl animate-float" />
      <div
        className="pointer-events-none absolute top-44 right-[6%] -z-10 size-72 rounded-full bg-accent/15 blur-3xl animate-float"
        style={{ animationDelay: '2.5s' }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={t('contact.eyebrow')}
          title={<span className="text-gradient">{t('contact.title')}</span>}
          description={t('contact.desc')}
        />

        <div className="mt-16 grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-14">
          <Reveal className="flex flex-col gap-8">
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                {t('contact.weLove')}
              </h3>
              <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
                {t('contact.desc')}
              </p>
            </div>

            <div className="relative">
              <div className="pointer-events-none absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-br from-primary/10 via-accent/5 to-transparent" />
              <div className="pointer-events-none absolute -left-6 top-1/3 -z-10 size-32 rounded-full bg-primary/10 blur-2xl animate-float" />
              <div
                className="pointer-events-none absolute -right-4 -top-6 -z-10 size-28 rounded-full bg-accent/10 blur-2xl animate-float"
                style={{ animationDelay: '3s' }}
              />
              <div className="grid gap-3 sm:grid-cols-2">
                {CONTACT_DETAILS.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="group flex items-start gap-4 rounded-2xl border border-border/60 bg-card/80 p-5 shadow-soft backdrop-blur transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-glow"
                  >
                    <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/10 to-accent/10 text-primary ring-1 ring-inset ring-primary/10 transition-all group-hover:from-primary group-hover:to-accent group-hover:text-primary-foreground group-hover:ring-transparent group-hover:shadow-glow">
                      <item.icon className="size-6 transition-transform group-hover:scale-110" />
                    </span>
                    <span className="flex flex-col">
                      <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        {item.label}
                      </span>
                      <span
                        className={cn(
                          'mt-0.5 text-sm font-semibold text-foreground',
                          item.ltr && 'ltr-num',
                        )}
                      >
                        {item.value}
                      </span>
                    </span>
                  </a>
                ))}
              </div>
            </div>

            <div className="relative flex items-center gap-3 overflow-hidden rounded-2xl border border-accent/30 bg-gradient-to-br from-accent/10 via-accent/5 to-transparent p-4 shadow-soft">
              <div className="pointer-events-none absolute -right-6 -top-6 size-24 rounded-full bg-accent/15 blur-2xl" />
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent ring-1 ring-inset ring-accent/20">
                <Clock className="size-5" />
              </span>
              <p className="text-sm font-medium text-foreground">
                <span className="text-accent">{t('contact.responseTime')}</span>
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                {t('contact.whatsNext')}
              </h4>
              <ol className="relative space-y-3">
                <span
                  className={cn(
                    'pointer-events-none absolute top-5 bottom-5 w-px bg-gradient-to-b from-primary/60 via-accent/40 to-transparent',
                    lang === 'fa' ? 'right-5' : 'left-5',
                  )}
                  aria-hidden
                />
                {NEXT_STEPS.map((step, idx) => (
                  <li
                    key={step.title}
                    className="group relative flex items-start gap-4 rounded-2xl border border-transparent p-3 transition-all hover:-translate-y-0.5 hover:border-border/60 hover:bg-card/60 hover:shadow-soft"
                  >
                    <span className="relative z-10 flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-soft ring-4 ring-background">
                      <step.icon className="size-5" />
                      <span
                        className={cn(
                          'absolute -top-1.5 flex size-5 items-center justify-center rounded-full bg-background text-[10px] font-bold text-primary ring-2 ring-primary/30',
                          lang === 'fa' ? '-left-1.5' : '-right-1.5',
                        )}
                      >
                        <span className="ltr-num">{idx + 1}</span>
                      </span>
                    </span>
                    <div className="flex flex-col pt-1">
                      <span className="text-sm font-semibold">{step.title}</span>
                      <span className="mt-0.5 text-sm text-muted-foreground">{step.desc}</span>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <span className="text-sm font-medium text-muted-foreground">{t('contact.followUs')}</span>
              <div className="flex gap-2">
                {SOCIALS.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.label}
                    className="flex size-10 items-center justify-center rounded-xl border border-border/60 bg-card/60 text-muted-foreground shadow-soft transition-all hover:-translate-y-1 hover:border-primary/40 hover:bg-gradient-to-br hover:from-primary hover:to-accent hover:text-primary-foreground hover:shadow-glow"
                  >
                    <s.icon className="size-4" />
                  </a>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <Card className="group relative overflow-hidden border-border/60 shadow-soft transition-all duration-300 focus-within:-translate-y-0.5 focus-within:shadow-glow">
              <span className="absolute inset-x-0 top-0 z-10 h-1 bg-gradient-to-r from-primary via-accent to-primary opacity-60 transition-opacity duration-300 group-focus-within:opacity-100" />
              <CardHeader className="relative border-b bg-gradient-to-br from-muted/40 to-muted/10 pb-6">
                <CardTitle className="text-xl">
                  <span className="text-gradient">{t('contact.startProject')}</span>
                </CardTitle>
                <CardDescription>{t('contact.formDesc')}</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="relative flex flex-col items-center overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 via-accent/5 to-transparent px-6 py-10 text-center"
                  >
                    {CONFETTI.map((c, i) => (
                      <motion.span
                        key={i}
                        initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
                        animate={{
                          opacity: [0, 1, 1, 0],
                          x: c.x,
                          y: c.y,
                          scale: [0, 1, 1, 0.5],
                          rotate: c.rotate,
                        }}
                        transition={{ duration: 1.6, delay: 0.15 + i * 0.04, ease: 'easeOut' }}
                        className={cn(
                          'pointer-events-none absolute top-12 size-2 rounded-full',
                          c.color,
                        )}
                        style={{ left: '50%' }}
                      />
                    ))}
                    <span className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_30%,color-mix(in_oklch,var(--accent)_22%,transparent),transparent_60%)]" />
                    <motion.span
                      initial={{ scale: 0, rotate: -30 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.1, type: 'spring', stiffness: 200, damping: 14 }}
                      className="relative flex size-24 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-glow"
                    >
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.25, type: 'spring', stiffness: 280, damping: 16 }}
                      >
                        <CheckCircle2 className="size-14" strokeWidth={2.5} />
                      </motion.span>
                      <motion.span
                        initial={{ scale: 1, opacity: 0.6 }}
                        animate={{ scale: 1.6, opacity: 0 }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: 'easeOut',
                          delay: 0.3,
                        }}
                        className="absolute inset-0 rounded-full bg-accent/40"
                      />
                    </motion.span>
                    <motion.h3
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="mt-6 text-2xl font-semibold tracking-tight sm:text-3xl"
                    >
                      <span className="text-gradient">{t('contact.successTitle')}</span>
                    </motion.h3>
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="mt-2 max-w-sm text-sm text-muted-foreground sm:text-base"
                    >
                      {t('contact.successDesc')}
                    </motion.p>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      <Button
                        onClick={resetForm}
                        variant="outline"
                        className="mt-8 shadow-soft transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-glow"
                      >
                        {t('contact.sendAnother')}
                      </Button>
                    </motion.div>
                  </motion.div>
                ) : (
                  <form onSubmit={onSubmit} noValidate className="grid gap-5">
                    <div className="grid gap-5 sm:grid-cols-2">
                      <Field
                        id="fullName"
                        label={t('contact.fullName')}
                        required
                        error={errors.fullName}
                      >
                        <Input
                          id="fullName"
                          value={form.fullName}
                          onChange={(e) => update('fullName', e.target.value)}
                          placeholder={sampleName}
                          autoComplete="name"
                          aria-invalid={!!errors.fullName}
                        />
                      </Field>
                      <Field id="company" label={t('contact.companyName')} error={undefined}>
                        <Input
                          id="company"
                          value={form.company}
                          onChange={(e) => update('company', e.target.value)}
                          placeholder={sampleCompany}
                          autoComplete="organization"
                        />
                      </Field>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <Field
                        id="email"
                        label={t('contact.emailLabel')}
                        required
                        error={errors.email}
                      >
                        <Input
                          id="email"
                          type="email"
                          value={form.email}
                          onChange={(e) => update('email', e.target.value)}
                          placeholder={sampleEmail}
                          autoComplete="email"
                          aria-invalid={!!errors.email}
                        />
                      </Field>
                      <Field id="phone" label={t('contact.phoneLabel')} error={undefined}>
                        <Input
                          id="phone"
                          type="tel"
                          value={form.phone}
                          onChange={(e) => update('phone', e.target.value)}
                          placeholder={samplePhone}
                          autoComplete="tel"
                        />
                      </Field>
                    </div>

                    <Field id="budget" label={t('contact.budget')} error={undefined}>
                      <Select value={form.budget} onValueChange={(v) => update('budget', v)}>
                        <SelectTrigger
                          id="budget"
                          className="h-12 w-full bg-card text-base font-medium shadow-sm transition-all hover:border-primary/40 hover:shadow-soft"
                        >
                          <SelectValue placeholder={t('contact.selectRange')} />
                        </SelectTrigger>
                        <SelectContent>
                          {BUDGET_OPTIONS.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>

                    <Field
                      id="message"
                      label={t('contact.message')}
                      required
                      error={errors.message}
                    >
                      <Textarea
                        id="message"
                        value={form.message}
                        onChange={(e) => update('message', e.target.value)}
                        placeholder={t('contact.messagePlaceholder')}
                        rows={5}
                        aria-invalid={!!errors.message}
                      />
                    </Field>

                    <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-xs text-muted-foreground">
                        {t('contact.privacy')}
                      </p>
                      <Button
                        type="submit"
                        size="lg"
                        disabled={submitting}
                        className="group relative overflow-hidden bg-gradient-to-r from-primary to-primary text-primary-foreground shadow-soft transition-all hover:from-primary hover:to-accent hover:shadow-glow sm:min-w-[180px]"
                      >
                        <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                        <span className="relative flex items-center">
                          {submitting ? (
                            <>
                              <Loader2 className="size-4 animate-spin" />
                              {t('contact.sending')}
                            </>
                          ) : (
                            <>
                              {t('contact.send')}
                              <Send className={cn('size-4', lang === 'fa' ? 'mr-1.5' : 'ml-1.5')} />
                            </>
                          )}
                        </span>
                      </Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          </Reveal>
        </div>

        <Reveal delay={0.15} className="mt-16">
          <div className="relative flex flex-col items-center justify-between gap-4 overflow-hidden rounded-2xl border border-border/60 bg-secondary px-6 py-6 text-center text-secondary-foreground shadow-soft transition-all hover:shadow-glow sm:flex-row sm:text-left">
            <div className="pointer-events-none absolute inset-0 -z-10 bg-grid opacity-10" />
            <div className="pointer-events-none absolute -left-10 -top-10 -z-10 size-40 rounded-full bg-accent/20 blur-3xl" />
            <div className="pointer-events-none absolute -right-10 -bottom-10 -z-10 size-40 rounded-full bg-primary/20 blur-3xl" />
            <div className="flex items-center gap-3">
              <ArrowRight className={cn('size-5 text-accent', lang === 'fa' && 'rtl-flip')} />
              <div>
                <p className="text-base font-semibold">{t('contact.notSure')}</p>
                <p className="text-sm text-secondary-foreground/70">
                  {t('contact.notSureDesc')}
                </p>
              </div>
            </div>
            <a
              href="#estimate-cta"
              onClick={() => {}}
              className="group inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-accent to-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-glow"
            >
              {t('contact.getEstimate')}
              <ArrowRight
                className={cn(
                  'size-4 transition-transform group-hover:translate-x-0.5',
                  lang === 'fa' &&
                    'rtl-flip group-hover:translate-x-0 group-hover:-translate-x-0.5',
                )}
              />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function Field({
  id,
  label,
  required,
  error,
  children,
}: {
  id: string
  label: string
  required?: boolean
  error?: string
  children: React.ReactNode
}) {
  const lang = useLang((s) => s.lang)
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-medium">
        {label}
        {required && (
          <span
            className={cn('text-primary', lang === 'fa' ? 'mr-0.5' : 'ml-0.5')}
            aria-label={required ? 'required' : undefined}
          >
            *
          </span>
        )}
      </Label>
      {children}
      {error ? <p className={cn('text-xs font-medium text-destructive')}>{error}</p> : null}
    </div>
  )
}