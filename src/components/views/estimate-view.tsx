'use client'

import { useMemo, useState, type FormEvent, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Layout,
  Building2,
  ShoppingBag,
  AppWindow,
  Layers,
  CalendarClock,
  Boxes,
  ShieldCheck,
  CreditCard,
  Users,
  Smartphone,
  Sparkles,
  CalendarCheck,
  RotateCcw,
  Info,
  PartyPopper,
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Reveal } from '@/components/site/reveal'
import { SectionHeading } from '@/components/site/section-heading'
import { Counter } from '@/components/site/counter'
import { useNav } from '@/lib/store'
import { cn } from '@/lib/utils'
import { useT, useLang } from '@/lib/lang-store'

/* ----------------------------- types & config ---------------------------- */

type Answers = {
  projectType?: string
  pages?: number
  pagesLabel?: string
  adminPanel?: boolean
  payment?: boolean
  auth?: boolean
  mobileApp?: boolean
  ai?: boolean
}

type ProjectType = {
  value: string
  label: string
  desc: string
  icon: typeof Layout
}

type PageRange = {
  label: string
  value: number
  desc: string
}

type StepDef = {
  key: keyof Answers
  hint: string
}

const STEPS: StepDef[] = [
  { key: 'projectType', hint: 'Pick the option that best describes your project.' },
  { key: 'pages', hint: 'A rough estimate is fine — you can refine later.' },
  { key: 'adminPanel', hint: 'A dashboard to manage content, users or data.' },
  { key: 'payment', hint: 'Stripe, PayPal, or other online checkout.' },
  { key: 'auth', hint: 'Accounts, login, roles and permissions.' },
  { key: 'mobileApp', hint: 'A companion iOS / Android experience.' },
  { key: 'ai', hint: 'Chatbots, recommendations, computer vision, etc.' },
]

const TOTAL_STEPS = STEPS.length

/* --------------------------------- view ---------------------------------- */

type Stage = 'wizard' | 'calculating' | 'result' | 'saved'

export function EstimateView() {
  const t = useT()
  const lang = useLang((s) => s.lang)
  const { setView } = useNav()
  const [step, setStep] = useState(0)
  const [direction, setDirection] = useState(1)
  const [answers, setAnswers] = useState<Answers>({})
  const [stage, setStage] = useState<Stage>('wizard')

  // estimate payload
  const [estimate, setEstimate] = useState<{ min: number; max: number; breakdown: { label: string; cost: number }[] } | null>(null)

  // contact / lead capture
  const [contact, setContact] = useState({ name: '', email: '', phone: '', company: '' })
  const [contactErrors, setContactErrors] = useState<Partial<Record<keyof typeof contact, string>>>({})
  const [savingLead, setSavingLead] = useState(false)

  const PROJECT_TYPES: ProjectType[] = [
    { value: 'landing-page', label: t('estimate.landingPage'), desc: t('estimate.landingDesc'), icon: Layout },
    { value: 'corporate-site', label: t('estimate.corporateSite'), desc: t('estimate.corporateDesc'), icon: Building2 },
    { value: 'ecommerce', label: t('estimate.ecommerce'), desc: t('estimate.ecommerceDesc'), icon: ShoppingBag },
    { value: 'web-app', label: t('estimate.webApp'), desc: t('estimate.webAppDesc'), icon: AppWindow },
    { value: 'saas', label: t('estimate.saas'), desc: t('estimate.saasDesc'), icon: Layers },
    { value: 'booking', label: t('estimate.booking'), desc: t('estimate.bookingDesc'), icon: CalendarClock },
    { value: 'custom', label: t('estimate.custom'), desc: t('estimate.customDesc'), icon: Boxes },
  ]

  const PAGE_RANGES: PageRange[] = [
    { label: t('estimate.pages1'), value: 5, desc: t('estimate.pages1Desc') },
    { label: t('estimate.pages2'), value: 10, desc: t('estimate.pages2Desc') },
    { label: t('estimate.pages3'), value: 20, desc: t('estimate.pages3Desc') },
    { label: t('estimate.pages4'), value: 25, desc: t('estimate.pages4Desc') },
  ]

  const YES_NO: { value: boolean; label: string; desc: string }[] = [
    { value: true, label: t('estimate.yes'), desc: "I'll need this" },
    { value: false, label: t('estimate.no'), desc: 'Not required' },
  ]

  /* --------------------------- step navigation --------------------------- */

  const currentDef = STEPS[step]
  const isAnswered = useMemo(() => {
    const v = answers[currentDef.key]
    if (typeof v === 'boolean') return true
    return v !== undefined && v !== null && v !== ''
  }, [answers, currentDef.key])

  const goTo = (next: number) => {
    setDirection(next > step ? 1 : -1)
    setStep(Math.max(0, Math.min(TOTAL_STEPS - 1, next)))
  }

  const setAnswer = <K extends keyof Answers>(key: K, value: Answers[K]) => {
    setAnswers((prev) => ({ ...prev, [key]: value }))
  }

  const handleSeeEstimate = async () => {
    setStage('calculating')
    // small artificial delay for premium "calculating" feel
    await new Promise((r) => setTimeout(r, 700))
    try {
      const res = await fetch('/api/estimate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers }),
      })
      if (!res.ok) throw new Error('Failed to compute estimate')
      const data = await res.json()
      setEstimate(data.estimate)
      setStage('result')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong.'
      toast.error('Could not compute estimate', { description: message })
      setStage('wizard')
    }
  }

  const restart = () => {
    setAnswers({})
    setStep(0)
    setStage('wizard')
    setEstimate(null)
    setContact({ name: '', email: '', phone: '', company: '' })
    setContactErrors({})
  }

  /* ----------------------------- lead capture ---------------------------- */

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  const submitLead = async (e: FormEvent) => {
    e.preventDefault()
    const errs: Partial<Record<keyof typeof contact, string>> = {}
    if (!contact.name.trim()) errs.name = t('contact.requiredField')
    if (!contact.email.trim()) errs.email = t('contact.requiredField')
    else if (!emailRegex.test(contact.email)) errs.email = t('contact.invalidEmail')
    setContactErrors(errs)
    if (Object.keys(errs).length) {
      toast.error('Please fix the highlighted fields.')
      return
    }
    setSavingLead(true)
    try {
      const res = await fetch('/api/estimate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers, contact }),
      })
      if (!res.ok) throw new Error('Failed to save your estimate')
      setStage('saved')
      toast.success(t('estimate.savedTitle'), { description: t('estimate.savedDesc') })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong.'
      toast.error('Could not save estimate', { description: message })
    } finally {
      setSavingLead(false)
    }
  }

  const progress = ((step + (stage === 'wizard' ? 0 : 1)) / TOTAL_STEPS) * 100

  /* -------------------------------- render -------------------------------- */

  return (
    <section id="estimate-cta" className="relative overflow-hidden py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-grid opacity-40" />
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[420px] bg-radial-fade" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={t('estimate.eyebrow')}
          title={
            <span className="text-gradient">{t('estimate.title')}</span>
          }
          description={t('estimate.desc')}
        />

        {/* progress + step indicator */}
        <Reveal delay={0.05} className="mt-12">
          <div className="mb-6 flex items-center justify-between text-sm">
            <span className="font-medium text-muted-foreground">
              {stage === 'wizard' ? (
                <>
                  {t('estimate.question')}{' '}
                  <span className="font-semibold text-foreground ltr-num">{step + 1}</span>{' '}
                  {t('estimate.of')}{' '}
                  <span className="font-semibold text-foreground ltr-num">{TOTAL_STEPS}</span>
                </>
              ) : stage === 'result' || stage === 'saved' ? (
                <span className="inline-flex items-center gap-1.5 font-semibold text-accent">
                  <CheckCircle2 className="size-4" /> Estimate ready
                </span>
              ) : (
                <>Crunching numbers…</>
              )}
            </span>
            <span className="text-xs text-muted-foreground">
              <span className="ltr-num">{Math.round(stage === 'wizard' ? progress : 100)}%</span> complete
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
              animate={{ width: `${stage === 'wizard' ? progress : 100}%` }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
        </Reveal>

        {/* main panel */}
        <Reveal delay={0.1} className="mt-8">
          <Card className="overflow-hidden border-border/60 shadow-soft">
            <CardContent className="p-0">
              <AnimatePresence mode="wait" custom={direction}>
                {/* WIZARD */}
                {stage === 'wizard' && (
                  <motion.div
                    key={`step-${step}`}
                    custom={direction}
                    initial={{ opacity: 0, x: direction * 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: direction * -40 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="p-6 sm:p-8"
                  >
                    <StepHeader
                      index={step + 1}
                      question={t(`estimate.q${step + 1}`)}
                      hint={currentDef.hint}
                    />

                    <div className="mt-6">
                      {currentDef.key === 'projectType' && (
                        <RadioGroup
                          value={answers.projectType ?? ''}
                          onValueChange={(v) => setAnswer('projectType', v)}
                          className="grid grid-cols-1 gap-3 sm:grid-cols-2"
                        >
                          {PROJECT_TYPES.map((opt) => (
                            <RadioCard
                              key={opt.value}
                              value={opt.value}
                              icon={<opt.icon className="size-5" />}
                              label={opt.label}
                              desc={opt.desc}
                            />
                          ))}
                        </RadioGroup>
                      )}

                      {currentDef.key === 'pages' && (
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                          {PAGE_RANGES.map((opt) => {
                            const active = answers.pages === opt.value
                            return (
                              <button
                                key={opt.label}
                                type="button"
                                onClick={() => setAnswer('pages', opt.value)}
                                className={cn(
                                  'group flex flex-col items-center gap-1 rounded-2xl border p-4 text-center transition-all',
                                  active
                                    ? 'border-primary bg-primary/5 shadow-glow'
                                    : 'border-border/60 hover:-translate-y-0.5 hover:border-primary/40'
                                )}
                              >
                                <span
                                  className={cn(
                                    'text-xl font-bold tracking-tight ltr-num',
                                    active ? 'text-primary' : 'text-foreground'
                                  )}
                                >
                                  {opt.label}
                                </span>
                                <span className="text-xs text-muted-foreground">{opt.desc}</span>
                              </button>
                            )
                          })}
                        </div>
                      )}

                      {['adminPanel', 'payment', 'auth', 'mobileApp', 'ai'].includes(currentDef.key) && (
                        <YesNoCards
                          value={answers[currentDef.key] as boolean | undefined}
                          onChange={(v) => setAnswer(currentDef.key, v)}
                        />
                      )}
                    </div>

                    {/* nav */}
                    <div className="mt-8 flex items-center justify-between">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => goTo(step - 1)}
                        disabled={step === 0}
                      >
                        <ArrowLeft className={cn('size-4', lang === 'fa' ? 'ml-1.5 rtl-flip' : 'mr-1.5')} />
                        {t('estimate.back')}
                      </Button>

                      {step < TOTAL_STEPS - 1 ? (
                        <Button
                          type="button"
                          onClick={() => goTo(step + 1)}
                          disabled={!isAnswered}
                        >
                          {t('estimate.next')}
                          <ArrowRight className={cn('size-4', lang === 'fa' ? 'mr-1.5 rtl-flip' : 'ml-1.5')} />
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          onClick={handleSeeEstimate}
                          disabled={!isAnswered}
                        >
                          {t('estimate.seeEstimate')}
                          <Sparkles className="size-4" />
                        </Button>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* CALCULATING */}
                {stage === 'calculating' && (
                  <motion.div
                    key="calculating"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center gap-4 py-20 text-center"
                  >
                    <span className="relative flex size-16 items-center justify-center">
                      <span className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
                      <Loader2 className="size-9 animate-spin text-primary" />
                    </span>
                    <p className="text-base font-medium">{t('estimate.calculating')}</p>
                    <p className="text-sm text-muted-foreground">Matching your answers against our pricing model.</p>
                  </motion.div>
                )}

                {/* RESULT */}
                {stage === 'result' && estimate && (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="p-6 sm:p-8"
                  >
                    <div className="text-center">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent">
                        <Sparkles className="size-3.5" />
                        Your estimate
                      </span>
                      <div className="mt-5 flex items-end justify-center gap-3">
                        <div className="flex flex-col">
                          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Min</span>
                          <span className="text-4xl font-bold tracking-tight text-gradient ltr-num sm:text-5xl">
                            $<Counter to={estimate.min} duration={1.4} />
                          </span>
                        </div>
                        <span className="pb-2 text-2xl font-light text-muted-foreground">–</span>
                        <div className="flex flex-col">
                          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Max</span>
                          <span className="text-4xl font-bold tracking-tight text-gradient ltr-num sm:text-5xl">
                            $<Counter to={estimate.max} duration={1.6} />
                          </span>
                        </div>
                      </div>
                      <p className="mt-3 text-sm text-muted-foreground">
                        {t('estimate.estimatedCost')} · typical timeline{' '}
                        <span className="ltr-num">4–12</span> weeks
                      </p>
                    </div>

                    {/* breakdown */}
                    <div className="mt-8">
                      <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                        {t('estimate.breakdown')}
                      </h4>
                      <ul className="mt-3 space-y-2">
                        {estimate.breakdown.map((b, i) => (
                          <motion.li
                            key={b.label}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 + i * 0.07 }}
                            className="flex items-center justify-between rounded-xl border border-border/60 bg-card/60 px-4 py-3"
                          >
                            <span className="text-sm font-medium text-foreground">{b.label}</span>
                            <span className="text-sm font-semibold text-foreground ltr-num">
                              ${b.cost.toLocaleString()}
                            </span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>

                    {/* disclaimer */}
                    <div className="mt-6 flex items-start gap-3 rounded-2xl border border-border/60 bg-muted/40 p-4">
                      <Info className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                      <p className="text-xs leading-relaxed text-muted-foreground">
                        {t('estimate.disclaimer')}
                      </p>
                    </div>

                    {/* lead capture */}
                    <form onSubmit={submitLead} className="mt-8 space-y-4">
                      <div className="flex items-center gap-2">
                        <span className="h-px flex-1 bg-border" />
                        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                          Save your estimate
                        </span>
                        <span className="h-px flex-1 bg-border" />
                      </div>
                      <p className="text-center text-sm text-muted-foreground">
                        Drop your details and we&apos;ll send a tailored proposal within 24 hours.
                      </p>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <LabeledField id="est-name" label={t('estimate.name')} required error={contactErrors.name}>
                          <Input
                            id="est-name"
                            value={contact.name}
                            onChange={(e) => setContact((c) => ({ ...c, name: e.target.value }))}
                            placeholder="Jane Doe"
                            autoComplete="name"
                            aria-invalid={!!contactErrors.name}
                          />
                        </LabeledField>
                        <LabeledField id="est-company" label={t('estimate.company')} error={undefined}>
                          <Input
                            id="est-company"
                            value={contact.company}
                            onChange={(e) => setContact((c) => ({ ...c, company: e.target.value }))}
                            placeholder="Acme Inc. (optional)"
                            autoComplete="organization"
                          />
                        </LabeledField>
                        <LabeledField id="est-email" label={t('estimate.email')} required error={contactErrors.email}>
                          <Input
                            id="est-email"
                            type="email"
                            value={contact.email}
                            onChange={(e) => setContact((c) => ({ ...c, email: e.target.value }))}
                            placeholder="jane@acme.com"
                            autoComplete="email"
                            aria-invalid={!!contactErrors.email}
                          />
                        </LabeledField>
                        <LabeledField id="est-phone" label={t('estimate.phone')} error={undefined}>
                          <Input
                            id="est-phone"
                            type="tel"
                            value={contact.phone}
                            onChange={(e) => setContact((c) => ({ ...c, phone: e.target.value }))}
                            placeholder="+1 (415) 555-0192"
                            autoComplete="tel"
                          />
                        </LabeledField>
                      </div>

                      <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-between">
                        <Button type="button" variant="ghost" onClick={restart}>
                          <RotateCcw className="size-4" />
                          Start over
                        </Button>
                        <Button type="submit" disabled={savingLead} className="sm:min-w-[200px]">
                          {savingLead ? (
                            <>
                              <Loader2 className="size-4 animate-spin" />
                              Saving…
                            </>
                          ) : (
                            <>
                              {t('estimate.saveEstimate')}
                              <ArrowRight className={cn('size-4', lang === 'fa' ? 'mr-1.5 rtl-flip' : 'ml-1.5')} />
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </motion.div>
                )}

                {/* SAVED */}
                {stage === 'saved' && (
                  <motion.div
                    key="saved"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="flex flex-col items-center py-12 text-center sm:py-16"
                  >
                    <motion.span
                      initial={{ scale: 0, rotate: -20 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.1, type: 'spring', stiffness: 220, damping: 16 }}
                      className="flex size-16 items-center justify-center rounded-full bg-accent/15 text-accent"
                    >
                      <PartyPopper className="size-9" />
                    </motion.span>
                    <h3 className="mt-6 text-2xl font-semibold tracking-tight sm:text-3xl">
                      {t('estimate.savedTitle')}
                    </h3>
                    <p className="mt-2 max-w-md text-sm text-muted-foreground sm:text-base">
                      {t('estimate.savedDesc')}
                    </p>
                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                      <Button onClick={() => setView('contact')}>
                        <CalendarCheck className="size-4" />
                        {t('estimate.bookCall')}
                      </Button>
                      <Button variant="outline" onClick={restart}>
                        <RotateCcw className="size-4" />
                        {t('estimate.runAnother')}
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </Reveal>

        {/* trust strip */}
        <Reveal delay={0.15} className="mt-8">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="size-3.5 text-accent" /> No spam, ever
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CreditCard className="size-3.5 text-accent" /> No payment required
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Users className="size-3.5 text-accent" /> Real humans review every request
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ------------------------------ sub-components ---------------------------- */

function StepHeader({ index, question, hint }: { index: number; question: string; hint: string }) {
  return (
    <div>
      <div className="flex items-center gap-3">
        <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground ltr-num">
          {index}
        </span>
        <h3 className="text-xl font-semibold tracking-tight sm:text-2xl">{question}</h3>
      </div>
      <p className="mt-2 pl-12 text-sm text-muted-foreground">{hint}</p>
    </div>
  )
}

function RadioCard({
  value,
  icon,
  label,
  desc,
}: {
  value: string
  icon: ReactNode
  label: string
  desc: string
}) {
  return (
    <Label
      htmlFor={`rc-${value}`}
      className="group relative flex cursor-pointer items-start gap-3 rounded-2xl border border-border/60 p-4 transition-all hover:-translate-y-0.5 hover:border-primary/40 has-[:checked]:border-primary has-[:checked]:bg-primary/5 has-[:checked]:shadow-glow"
    >
      <RadioGroupItem
        id={`rc-${value}`}
        value={value}
        className="absolute right-3 top-3"
      />
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-has-[:checked]:bg-primary group-has-[:checked]:text-primary-foreground">
        {icon}
      </span>
      <span className="flex flex-col pr-6">
        <span className="text-sm font-semibold text-foreground">{label}</span>
        <span className="mt-0.5 text-xs text-muted-foreground">{desc}</span>
      </span>
    </Label>
  )
}

function YesNoCards({
  value,
  onChange,
}: {
  value: boolean | undefined
  onChange: (v: boolean) => void
}) {
  const t = useT()
  const YES_NO: { value: boolean; label: string; desc: string }[] = [
    { value: true, label: t('estimate.yes'), desc: "I'll need this" },
    { value: false, label: t('estimate.no'), desc: 'Not required' },
  ]
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-2">
      {YES_NO.map((opt) => {
        const active = value === opt.value
        return (
          <button
            key={String(opt.value)}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cn(
              'flex flex-col items-start gap-1 rounded-2xl border p-5 text-left transition-all',
              active
                ? opt.value
                  ? 'border-accent bg-accent/5 shadow-glow'
                  : 'border-primary bg-primary/5 shadow-glow'
                : 'border-border/60 hover:-translate-y-0.5 hover:border-primary/40'
            )}
          >
            <span
              className={cn(
                'flex size-9 items-center justify-center rounded-xl',
                active
                  ? opt.value
                    ? 'bg-accent text-accent-foreground'
                    : 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              )}
            >
              {opt.value ? <CheckCircle2 className="size-5" /> : <ArrowLeft className="size-5 rotate-45" />}
            </span>
            <span className="mt-1 text-base font-semibold text-foreground">{opt.label}</span>
            <span className="text-xs text-muted-foreground">{opt.desc}</span>
          </button>
        )
      })}
    </div>
  )
}

function LabeledField({
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
  children: ReactNode
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
      {error ? <p className="text-xs font-medium text-destructive">{error}</p> : null}
    </div>
  )
}
