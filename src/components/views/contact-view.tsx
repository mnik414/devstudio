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

type FormState = {
  fullName: string
  company: string
  email: string
  phone: string
  budget: string
  message: string
}

type Errors = Partial<Record<keyof FormState, string>>

const BUDGET_OPTIONS = [
  { value: '< $2k', label: 'Under $2k' },
  { value: '$2k - $5k', label: '$2k – $5k' },
  { value: '$5k - $15k', label: '$5k – $15k' },
  { value: '$15k - $50k', label: '$15k – $50k' },
  { value: '$50k+', label: '$50k+' },
]

const CONTACT_DETAILS = [
  {
    icon: Mail,
    label: 'Email us',
    value: 'hello@devstudio.com',
    href: 'mailto:hello@devstudio.com',
  },
  {
    icon: Phone,
    label: 'Call us',
    value: '+1 (415) 555-0192',
    href: 'tel:+14155550192',
  },
  {
    icon: MapPin,
    label: 'Visit us',
    value: '535 Mission St, San Francisco, CA',
    href: 'https://maps.google.com',
  },
]

const SOCIALS = [
  { icon: Github, label: 'GitHub', href: 'https://github.com' },
  { icon: Linkedin, label: 'LinkedIn', href: 'https://linkedin.com' },
  { icon: Twitter, label: 'Twitter', href: 'https://twitter.com' },
]

const NEXT_STEPS = [
  { icon: Calendar, title: 'Discovery call', desc: 'A 30-min call to understand your goals, scope and timeline.' },
  { icon: FileText, title: 'Proposal', desc: 'Within 48h you receive a tailored proposal and fixed quote.' },
  { icon: Rocket, title: 'Kickoff', desc: 'We assemble the squad, set milestones and ship week one.' },
]

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function ContactView() {
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
    if (!form.fullName.trim()) next.fullName = 'Please enter your full name.'
    if (!form.email.trim()) next.email = 'Please enter your email.'
    else if (!emailRegex.test(form.email)) next.email = 'Please enter a valid email address.'
    if (!form.message.trim()) next.message = 'Please tell us about your project.'
    else if (form.message.trim().length < 20) next.message = 'A little more detail helps — at least 20 characters.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!validate()) {
      toast.error('Please fix the highlighted fields.')
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
      toast.success('Message sent!', { description: "We'll reply within 24 hours." })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong.'
      toast.error('Could not send message', { description: message })
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
      {/* ambient backdrop */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-grid opacity-40" />
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[420px] bg-radial-fade" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Get in touch"
          title={
            <>
              Let&apos;s build something{' '}
              <span className="text-gradient">great together</span>
            </>
          }
          description="Tell us about your project. Whether you have a fully-specced brief or just an idea, we'll help you shape it into something exceptional."
        />

        <div className="mt-16 grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-14">
          {/* LEFT — info / illustration */}
          <Reveal className="flex flex-col gap-8">
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                We&apos;d love to hear from you
              </h3>
              <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
                Drop us a line and our team will get back to you within one business day.
                Prefer email or phone? Use the details below — we&apos;re real humans, not bots.
              </p>
            </div>

            {/* contact details */}
            <div className="grid gap-3 sm:grid-cols-2">
              {CONTACT_DETAILS.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="group flex items-start gap-3 rounded-2xl border border-border/60 bg-card/60 p-4 shadow-soft transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-glow"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <item.icon className="size-5" />
                  </span>
                  <span className="flex flex-col">
                    <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      {item.label}
                    </span>
                    <span className="mt-0.5 text-sm font-semibold text-foreground">
                      {item.value}
                    </span>
                  </span>
                </a>
              ))}
            </div>

            {/* response time promise */}
            <div className="flex items-center gap-3 rounded-2xl border border-accent/30 bg-accent/5 p-4">
              <Clock className="size-5 shrink-0 text-accent" />
              <p className="text-sm font-medium text-foreground">
                <span className="text-accent">24-hour response promise.</span>{' '}
                <span className="text-muted-foreground">
                  Reach out today — we reply to every serious inquiry within one business day.
                </span>
              </p>
            </div>

            {/* what happens next */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                What happens next
              </h4>
              <ol className="space-y-3">
                {NEXT_STEPS.map((step, idx) => (
                  <li
                    key={step.title}
                    className="group flex items-start gap-4 rounded-2xl border border-transparent p-3 transition-colors hover:border-border/60 hover:bg-card/60"
                  >
                    <span className="relative flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
                      <step.icon className="size-5" />
                      <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                        {idx + 1}
                      </span>
                    </span>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold">{step.title}</span>
                      <span className="mt-0.5 text-sm text-muted-foreground">{step.desc}</span>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            {/* socials */}
            <div className="flex items-center gap-3 pt-2">
              <span className="text-sm font-medium text-muted-foreground">Follow us</span>
              <div className="flex gap-2">
                {SOCIALS.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.label}
                    className="flex size-9 items-center justify-center rounded-lg border border-border/60 text-muted-foreground transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:text-primary"
                  >
                    <s.icon className="size-4" />
                  </a>
                ))}
              </div>
            </div>
          </Reveal>

          {/* RIGHT — form / success */}
          <Reveal delay={0.1}>
            <Card className="overflow-hidden border-border/60 shadow-soft">
              <CardHeader className="border-b bg-muted/30 pb-6">
                <CardTitle className="text-xl">Start your project</CardTitle>
                <CardDescription>
                  Fill in the form and we&apos;ll be in touch shortly.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="flex flex-col items-center py-8 text-center"
                  >
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.1, type: 'spring', stiffness: 220, damping: 18 }}
                      className="flex size-16 items-center justify-center rounded-full bg-accent/15 text-accent"
                    >
                      <CheckCircle2 className="size-9" />
                    </motion.span>
                    <h3 className="mt-6 text-2xl font-semibold tracking-tight">
                      Message sent!
                    </h3>
                    <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                      Thanks for reaching out. We&apos;ll get back to you within 24 hours.
                      In the meantime, feel free to explore our recent work.
                    </p>
                    <Button onClick={resetForm} variant="outline" className="mt-8">
                      Send another message
                    </Button>
                  </motion.div>
                ) : (
                  <form onSubmit={onSubmit} noValidate className="grid gap-5">
                    <div className="grid gap-5 sm:grid-cols-2">
                      <Field
                        id="fullName"
                        label="Full Name"
                        required
                        error={errors.fullName}
                      >
                        <Input
                          id="fullName"
                          value={form.fullName}
                          onChange={(e) => update('fullName', e.target.value)}
                          placeholder="Jane Doe"
                          autoComplete="name"
                          aria-invalid={!!errors.fullName}
                        />
                      </Field>
                      <Field id="company" label="Company Name" error={undefined}>
                        <Input
                          id="company"
                          value={form.company}
                          onChange={(e) => update('company', e.target.value)}
                          placeholder="Acme Inc."
                          autoComplete="organization"
                        />
                      </Field>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <Field id="email" label="Email" required error={errors.email}>
                        <Input
                          id="email"
                          type="email"
                          value={form.email}
                          onChange={(e) => update('email', e.target.value)}
                          placeholder="jane@acme.com"
                          autoComplete="email"
                          aria-invalid={!!errors.email}
                        />
                      </Field>
                      <Field id="phone" label="Phone" error={undefined}>
                        <Input
                          id="phone"
                          type="tel"
                          value={form.phone}
                          onChange={(e) => update('phone', e.target.value)}
                          placeholder="+1 (415) 555-0192"
                          autoComplete="tel"
                        />
                      </Field>
                    </div>

                    <Field id="budget" label="Budget" error={undefined}>
                      <Select
                        value={form.budget}
                        onValueChange={(v) => update('budget', v)}
                      >
                        <SelectTrigger id="budget" className="w-full">
                          <SelectValue placeholder="Select a range" />
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
                      label="Project Description"
                      required
                      error={errors.message}
                    >
                      <Textarea
                        id="message"
                        value={form.message}
                        onChange={(e) => update('message', e.target.value)}
                        placeholder="Tell us about your goals, scope, timeline and anything else we should know…"
                        rows={5}
                        aria-invalid={!!errors.message}
                      />
                    </Field>

                    <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-xs text-muted-foreground">
                        By submitting, you agree to our privacy policy. We never share your data.
                      </p>
                      <Button
                        type="submit"
                        size="lg"
                        disabled={submitting}
                        className="sm:min-w-[180px]"
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="size-4 animate-spin" />
                            Sending…
                          </>
                        ) : (
                          <>
                            Send message
                            <Send className="size-4" />
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          </Reveal>
        </div>

        {/* bottom CTA strip */}
        <Reveal delay={0.15} className="mt-16">
          <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-border/60 bg-secondary px-6 py-6 text-center text-secondary-foreground shadow-soft sm:flex-row sm:text-left">
            <div className="flex items-center gap-3">
              <ArrowRight className="size-5 text-accent" />
              <div>
                <p className="text-base font-semibold">Not sure where to start?</p>
                <p className="text-sm text-secondary-foreground/70">
                  Use our project estimator to get an instant ballpark cost.
                </p>
              </div>
            </div>
            <a
              href="#estimate-cta"
              onClick={() => {
                // soft nudge: smooth scroll handled by anchor
              }}
              className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90"
            >
              Get an estimate
              <ArrowRight className="size-4" />
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
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-medium">
        {label}
        {required && <span className="ml-0.5 text-primary">*</span>}
      </Label>
      {children}
      {error ? (
        <p className={cn('text-xs font-medium text-destructive')}>{error}</p>
      ) : null}
    </div>
  )
}
