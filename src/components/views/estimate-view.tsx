'use client'

import {
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type FormEvent,
  type ReactNode,
} from 'react'
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
  Play,
  X,
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

/* --------------------------- progress persistence --------------------------- */

const PROGRESS_KEY = 'devstudio-estimate-progress'
const emptySubscribe = () => () => {}

type SavedProgress = { step: number; answers: Answers }

function readProgress(): SavedProgress | null {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as SavedProgress
    if (
      typeof parsed.step !== 'number' ||
      typeof parsed.answers !== 'object' ||
      parsed.answers === null
    ) {
      return null
    }
    // Ignore "empty" initial-state snapshots so we never offer a no-op resume
    if (parsed.step === 0 && Object.keys(parsed.answers).length === 0) {
      return null
    }
    return { step: Math.max(0, Math.min(TOTAL_STEPS - 1, parsed.step)), answers: parsed.answers }
  } catch {
    return null
  }
}

function writeProgress(progress: SavedProgress) {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress))
  } catch {
    // ignore
  }
}

function clearProgress() {
  try {
    localStorage.removeItem(PROGRESS_KEY)
  } catch {
    // ignore
  }
}

// Confetti dot trajectories for the saved celebration animation
const CONFETTI = [
  { x: -120, y: -30, rotate: -40, color: 'bg-primary' },
  { x: -85, y: -95, rotate: -25, color: 'bg-accent' },
  { x: -45, y: -130, rotate: -10, color: 'bg-primary' },
  { x: 0, y: -140, rotate: 0, color: 'bg-accent' },
  { x: 45, y: -130, rotate: 10, color: 'bg-primary' },
  { x: 85, y: -95, rotate: 25, color: 'bg-accent' },
  { x: 120, y: -30, rotate: 40, color: 'bg-primary' },
  { x: -130, y: 30, rotate: -55, color: 'bg-accent' },
  { x: 130, y: 30, rotate: 55, color: 'bg-primary' },
  { x: -75, y: 65, rotate: -70, color: 'bg-accent' },
  { x: 75, y: 65, rotate: 70, color: 'bg-primary' },
  { x: 0, y: -70, rotate: 0, color: 'bg-accent' },
]

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

  // SSR-safe localStorage mount gate (same pattern as cookie-consent)
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  )

  // Dismissed flag flips true after the user clicks Resume or Start over,
  // so we don't keep re-reading / re-prompting for the same saved progress.
  const [dismissedResume, setDismissedResume] = useState(false)
  const savedProgress = useMemo<SavedProgress | null>(() => {
    if (!mounted || dismissedResume) return null
    return readProgress()
  }, [mounted, dismissedResume])
  const showResumePrompt = !!savedProgress && stage === 'wizard'

  // Persist wizard progress to localStorage whenever step/answers change so the
  // user can resume after navigating away. (Pure side effect — no setState.)
  useEffect(() => {
    if (!mounted) return
    if (stage !== 'wizard') return
    writeProgress({ step, answers })
  }, [mounted, stage, step, answers])

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
    clearProgress()
    setDismissedResume(true)
  }

  const handleResume = () => {
    if (savedProgress) {
      setAnswers(savedProgress.answers)
      setStep(savedProgress.step)
      setDirection(1)
    }
    setDismissedResume(true)
  }

  const handleStartOverPrompt = () => {
    clearProgress()
    setDismissedResume(true)
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
      clearProgress()
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
      {/* floating accent blobs */}
      <div className="pointer-events-none absolute -top-16 left-[12%] -z-10 size-72 rounded-full bg-primary/15 blur-3xl animate-float" />
      <div
        className="pointer-events-none absolute top-40 right-[8%] -z-10 size-72 rounded-full bg-accent/15 blur-3xl animate-float"
        style={{ animationDelay: '2.5s' }}
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={t('estimate.eyebrow')}
          title={<span className="text-gradient">{t('estimate.title')}</span>}
          description={t('estimate.desc')}
        />

        {/* progress + step indicator */}
        <Reveal delay={0.05} className="mt-12">
          <div className="mb-6 flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 px-3.5 py-1.5 text-sm font-medium ring-1 ring-inset ring-primary/15">
              {stage === 'wizard' ? (
                <>
                  {t('estimate.question')}{' '}
                  <span className="font-bold text-gradient ltr-num">{step + 1}</span>{' '}
                  {t('estimate.of')}{' '}
                  <span className="font-bold text-foreground ltr-num">{TOTAL_STEPS}</span>
                </>
              ) : stage === 'result' || stage === 'saved' ? (
                <span className="inline-flex items-center gap-1.5 font-semibold text-accent">
                  <CheckCircle2 className="size-4" /> Estimate ready
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5">
                  <Loader2 className="size-3.5 animate-spin" />
                  Crunching numbers…
                </span>
              )}
            </span>
            <span className="text-xs font-medium text-muted-foreground">
              <span className="ltr-num">{Math.round(stage === 'wizard' ? progress : 100)}%</span>{' '}
              complete
            </span>
          </div>
          <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
            <motion.div
              className="relative h-full rounded-full bg-gradient-to-r from-primary to-accent"
              animate={{ width: `${stage === 'wizard' ? progress : 100}%` }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* glowing pulse at leading edge */}
              {stage === 'wizard' && progress > 0 && progress < 100 && (
                <span className="absolute right-0 top-1/2 size-3 -translate-y-1/2 translate-x-1/2 rounded-full bg-accent shadow-glow">
                  <motion.span
                    animate={{ scale: [1, 1.9, 1], opacity: [0.7, 0, 0.7] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
                    className="absolute inset-0 rounded-full bg-accent"
                  />
                </span>
              )}
            </motion.div>
          </div>
        </Reveal>

        {/* resume prompt — shows when saved progress exists on mount */}
        <AnimatePresence initial={false}>
          {showResumePrompt && savedProgress && (
            <motion.div
              key="resume-prompt"
              initial={{ opacity: 0, y: -8, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -8, height: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="relative mt-6 overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/[0.06] to-accent/[0.06] shadow-soft">
                <span className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-primary via-accent to-primary opacity-60" />
                <div className="relative flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                  <div className="flex items-start gap-3">
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                      <RotateCcw className="size-5" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold">Resume your estimate?</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        You have an incomplete estimate (Step{' '}
                        <span className="font-semibold text-foreground ltr-num">
                          {savedProgress.step + 1}
                        </span>{' '}
                        of <span className="ltr-num">{TOTAL_STEPS}</span>). Continue where you left
                        off or start over.
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <Button size="sm" onClick={handleResume} className="rounded-full">
                      <Play className={cn('size-4', lang === 'fa' ? 'ml-1.5' : 'mr-1.5')} />
                      Resume
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleStartOverPrompt}
                      className="rounded-full"
                    >
                      <X className={cn('size-4', lang === 'fa' ? 'ml-1.5' : 'mr-1.5')} />
                      Start over
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* main panel */}
        <Reveal delay={0.1} className="mt-8">
          <Card className="group relative overflow-hidden border-border/60 shadow-soft transition-all duration-300">
            {/* subtle gradient top accent that brightens on hover */}
            <span className="absolute inset-x-0 top-0 z-10 h-0.5 bg-gradient-to-r from-primary via-accent to-primary opacity-50 transition-opacity duration-300 group-hover:opacity-100" />
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
                                  'group relative flex flex-col items-center gap-1 overflow-hidden rounded-2xl border p-4 text-center shadow-soft transition-all',
                                  active
                                    ? 'border-transparent bg-gradient-to-br from-primary/10 to-accent/10 shadow-glow'
                                    : 'border-border/60 bg-card hover:-translate-y-1 hover:border-primary/40 hover:shadow-glow',
                                )}
                              >
                                {active && (
                                  <span className="pointer-events-none absolute inset-0 rounded-2xl ring-2 ring-inset ring-primary/40" />
                                )}
                                <span
                                  className={cn(
                                    'text-xl font-bold tracking-tight ltr-num transition-transform group-hover:scale-110',
                                    active ? 'text-gradient' : 'text-foreground',
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
                        <ArrowLeft
                          className={cn('size-4', lang === 'fa' ? 'ml-1.5 rtl-flip' : 'mr-1.5')}
                        />
                        {t('estimate.back')}
                      </Button>

                      {step < TOTAL_STEPS - 1 ? (
                        <Button
                          type="button"
                          onClick={() => goTo(step + 1)}
                          disabled={!isAnswered}
                          className="shadow-soft transition-all hover:shadow-glow"
                        >
                          {t('estimate.next')}
                          <ArrowRight
                            className={cn(
                              'size-4',
                              lang === 'fa' ? 'mr-1.5 rtl-flip' : 'ml-1.5',
                            )}
                          />
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          onClick={handleSeeEstimate}
                          disabled={!isAnswered}
                          className="shadow-soft transition-all hover:shadow-glow"
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
                    <span className="relative flex size-20 items-center justify-center">
                      <span className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
                      <span className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/15 to-accent/15 blur-md" />
                      <Loader2 className="size-10 animate-spin text-primary" />
                    </span>
                    <p className="text-base font-semibold">
                      <span className="text-gradient">{t('estimate.calculating')}</span>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Matching your answers against our pricing model.
                    </p>
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

                      {/* HUGE cost range with floating animation + glow */}
                      <div className="relative mt-6 flex flex-col items-center">
                        {/* glow effect behind */}
                        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_50%,color-mix(in_oklch,var(--primary)_25%,transparent),transparent_60%)] blur-2xl" />
                        <motion.div
                          animate={{ y: [0, -6, 0] }}
                          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                          className="flex items-end justify-center gap-3 sm:gap-4"
                        >
                          <div className="flex flex-col items-center">
                            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                              Min
                            </span>
                            <span className="text-5xl font-bold tracking-tight text-gradient ltr-num sm:text-6xl lg:text-7xl">
                              $<Counter to={estimate.min} duration={1.4} />
                            </span>
                          </div>
                          <span className="pb-3 text-3xl font-light text-muted-foreground sm:pb-4 sm:text-4xl">
                            –
                          </span>
                          <div className="flex flex-col items-center">
                            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                              Max
                            </span>
                            <span className="text-5xl font-bold tracking-tight text-gradient ltr-num sm:text-6xl lg:text-7xl">
                              $<Counter to={estimate.max} duration={1.6} />
                            </span>
                          </div>
                        </motion.div>
                      </div>

                      <p className="mt-4 text-sm text-muted-foreground">
                        {t('estimate.estimatedCost')} · typical timeline{' '}
                        <span className="ltr-num">4–12</span> weeks
                      </p>
                    </div>

                    {/* breakdown — premium receipt with monospace + alternating rows */}
                    <div className="mt-8">
                      <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                        {t('estimate.breakdown')}
                      </h4>
                      <ul className="mt-3 overflow-hidden rounded-2xl border border-border/60 bg-card shadow-soft">
                        {estimate.breakdown.map((b, i) => (
                          <motion.li
                            key={b.label}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 + i * 0.07 }}
                            className={cn(
                              'flex items-center justify-between px-4 py-3',
                              i % 2 === 0 ? 'bg-card/60' : 'bg-muted/30',
                              i !== estimate.breakdown.length - 1 &&
                                'border-b border-border/40',
                            )}
                          >
                            <span className="flex items-center gap-2.5 text-sm font-medium text-foreground">
                              <span
                                className="size-1.5 rounded-full bg-gradient-to-r from-primary to-accent"
                                aria-hidden
                              />
                              {b.label}
                            </span>
                            <span className="font-mono text-sm font-semibold text-foreground ltr-num">
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

                    {/* lead capture — premium card with gradient top border */}
                    <div className="relative mt-8 overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-card to-muted/20 p-5 shadow-soft sm:p-6">
                      <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-accent to-primary" />
                      <form onSubmit={submitLead} className="space-y-4">
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
                          <LabeledField
                            id="est-name"
                            label={t('estimate.name')}
                            required
                            error={contactErrors.name}
                          >
                            <Input
                              id="est-name"
                              value={contact.name}
                              onChange={(e) => setContact((c) => ({ ...c, name: e.target.value }))}
                              placeholder="Jane Doe"
                              autoComplete="name"
                              aria-invalid={!!contactErrors.name}
                            />
                          </LabeledField>
                          <LabeledField
                            id="est-company"
                            label={t('estimate.company')}
                            error={undefined}
                          >
                            <Input
                              id="est-company"
                              value={contact.company}
                              onChange={(e) =>
                                setContact((c) => ({ ...c, company: e.target.value }))
                              }
                              placeholder="Acme Inc. (optional)"
                              autoComplete="organization"
                            />
                          </LabeledField>
                          <LabeledField
                            id="est-email"
                            label={t('estimate.email')}
                            required
                            error={contactErrors.email}
                          >
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
                          <Button
                            type="submit"
                            disabled={savingLead}
                            className="group relative overflow-hidden bg-gradient-to-r from-primary to-primary text-primary-foreground shadow-soft transition-all hover:from-primary hover:to-accent hover:shadow-glow sm:min-w-[200px]"
                          >
                            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                            <span className="relative flex items-center">
                              {savingLead ? (
                                <>
                                  <Loader2 className="size-4 animate-spin" />
                                  Saving…
                                </>
                              ) : (
                                <>
                                  {t('estimate.saveEstimate')}
                                  <ArrowRight
                                    className={cn(
                                      'size-4',
                                      lang === 'fa' ? 'mr-1.5 rtl-flip' : 'ml-1.5',
                                    )}
                                  />
                                </>
                              )}
                            </span>
                          </Button>
                        </div>
                      </form>
                    </div>
                  </motion.div>
                )}

                {/* SAVED */}
                {stage === 'saved' && (
                  <motion.div
                    key="saved"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="relative flex flex-col items-center overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 via-accent/5 to-transparent px-6 py-12 text-center sm:py-16"
                  >
                    {/* confetti dots */}
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
                    {/* gradient celebration glow */}
                    <span className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_30%,color-mix(in_oklch,var(--accent)_22%,transparent),transparent_60%)]" />
                    <div className="pointer-events-none absolute -top-10 left-1/2 -z-10 size-64 -translate-x-1/2 rounded-full bg-accent/15 blur-3xl" />

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
                        <PartyPopper className="size-12" strokeWidth={2.25} />
                      </motion.span>
                      {/* pulse ring */}
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
                      <span className="text-gradient">{t('estimate.savedTitle')}</span>
                    </motion.h3>
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="mt-2 max-w-md text-sm text-muted-foreground sm:text-base"
                    >
                      {t('estimate.savedDesc')}
                    </motion.p>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="mt-8 flex flex-col gap-3 sm:flex-row"
                    >
                      <Button
                        onClick={() => setView('contact')}
                        className="shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-glow"
                      >
                        <CalendarCheck className="size-4" />
                        {t('estimate.bookCall')}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={restart}
                        className="shadow-soft transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-glow"
                      >
                        <RotateCcw className="size-4" />
                        {t('estimate.runAnother')}
                      </Button>
                    </motion.div>
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
        <span className="flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-base font-bold text-primary-foreground shadow-soft ltr-num">
          {index}
        </span>
        <h3 className="text-xl font-semibold tracking-tight sm:text-2xl">{question}</h3>
      </div>
      <p className="mt-2 pl-14 text-sm text-muted-foreground">{hint}</p>
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
      className="group relative flex cursor-pointer items-start gap-3 overflow-hidden rounded-2xl border border-border/60 bg-card p-4 shadow-soft transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-glow has-[:checked]:border-primary has-[:checked]:shadow-glow"
    >
      {/* gradient border-on-hover overlay (decorative) */}
      <span className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-has-[:checked]:opacity-100 group-has-[:checked]:from-primary/10 group-has-[:checked]:to-accent/10" />
      <RadioGroupItem id={`rc-${value}`} value={value} className="absolute right-3 top-3" />
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 text-primary ring-1 ring-inset ring-primary/10 transition-all group-has-[:checked]:from-primary group-has-[:checked]:to-accent group-has-[:checked]:text-primary-foreground group-has-[:checked]:ring-transparent group-has-[:checked]:shadow-glow">
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
        const yesTone = opt.value
        return (
          <button
            key={String(opt.value)}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cn(
              'group relative flex flex-col items-start gap-2 overflow-hidden rounded-2xl border p-5 text-left shadow-soft transition-all',
              active
                ? yesTone
                  ? 'border-accent/60 bg-gradient-to-br from-accent/15 to-accent/5 shadow-glow'
                  : 'border-rose-400/60 bg-gradient-to-br from-rose-500/10 to-rose-500/5 shadow-glow'
                : 'border-border/60 bg-card hover:-translate-y-1 hover:border-primary/40 hover:shadow-glow',
            )}
          >
            <span
              className={cn(
                'flex size-10 items-center justify-center rounded-xl transition-colors',
                active
                  ? yesTone
                    ? 'bg-accent text-accent-foreground'
                    : 'bg-rose-500 text-white'
                  : 'bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary',
              )}
            >
              {yesTone ? (
                <CheckCircle2 className="size-5" />
              ) : (
                <X className="size-5" />
              )}
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
