'use client'

import { useMemo, useRef, type ReactNode } from 'react'
import ReactMarkdown, { type Components } from 'react-markdown'
import { motion, useScroll, useSpring } from 'framer-motion'
import { format } from 'date-fns'
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Clock,
  Calendar,
  Twitter,
  Linkedin,
  Link2,
  Copy,
  FileText,
  AlertCircle,
  List,
  type LucideIcon,
} from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Reveal } from '@/components/site/reveal'
import { SectionHeading } from '@/components/site/section-heading'
import { useNav } from '@/lib/store'
import { useBlogPost, type BlogPost } from '@/lib/hooks'
import { useT, useLang } from '@/lib/lang-store'
import { tc } from '@/lib/content-i18n'
import { cn } from '@/lib/utils'

/* ------------------------------ helpers ------------------------------ */

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? '')
    .join('')
}

const AVATAR_PALETTE = [
  'bg-blue-500',
  'bg-emerald-500',
  'bg-amber-500',
  'bg-rose-500',
  'bg-violet-500',
  'bg-cyan-500',
  'bg-pink-500',
  'bg-teal-500',
]

function colorFromString(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash)
  return AVATAR_PALETTE[Math.abs(hash) % AVATAR_PALETTE.length]
}

function formatDate(iso: string): string {
  try {
    return format(new Date(iso), 'MMM d, yyyy')
  } catch {
    return ''
  }
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function extractText(node: ReactNode): string {
  if (typeof node === 'string') return node
  if (typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(extractText).join('')
  if (node && typeof node === 'object' && 'props' in node) {
    // @ts-expect-error - react element shape
    return extractText(node.props?.children)
  }
  return ''
}

function extractTOC(markdown: string): { id: string; text: string }[] {
  const lines = markdown.split('\n')
  const toc: { id: string; text: string }[] = []
  let inCodeBlock = false
  for (const line of lines) {
    if (line.trim().startsWith('```')) {
      inCodeBlock = !inCodeBlock
      continue
    }
    if (inCodeBlock) continue
    const match = line.match(/^##\s+(.+?)\s*$/)
    if (match) {
      const text = match[1].replace(/[*_`~]/g, '').trim()
      toc.push({ id: slugify(text), text })
    }
  }
  return toc
}

/* ------------------------------ avatar ------------------------------ */

function AuthorAvatar({
  post,
  size = 'md',
}: {
  post: BlogPost
  size?: 'sm' | 'md' | 'lg'
}) {
  const sizeCls =
    size === 'lg'
      ? 'h-12 w-12 text-base'
      : size === 'md'
        ? 'h-10 w-10 text-sm'
        : 'h-8 w-8 text-xs'

  if (post.authorAvatar) {
    return (
      <img
        src={post.authorAvatar}
        alt={post.authorName}
        className={cn('rounded-full object-cover ring-2 ring-background', sizeCls)}
      />
    )
  }
  return (
    <div
      className={cn(
        'grid place-items-center rounded-full font-semibold text-white ring-2 ring-background',
        sizeCls,
        colorFromString(post.authorName),
      )}
      aria-hidden
    >
      {getInitials(post.authorName) || 'A'}
    </div>
  )
}

/* ------------------------------ share buttons ------------------------------ */

function ShareButtons({ title }: { title: string }) {
  const t = useT()
  const getUrl = () => (typeof window !== 'undefined' ? window.location.href : '')

  const shareText = encodeURIComponent(title)

  const onTwitter = () => {
    const url = encodeURIComponent(getUrl())
    window.open(
      `https://twitter.com/intent/tweet?text=${shareText}&url=${url}`,
      '_blank',
      'noopener,noreferrer',
    )
  }
  const onLinkedIn = () => {
    const url = encodeURIComponent(getUrl())
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      '_blank',
      'noopener,noreferrer',
    )
  }
  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(getUrl())
      toast.success(t('blogDetail.linkCopied'))
    } catch {
      toast.error('Failed to copy link')
    }
  }

  const buttons: { icon: LucideIcon; label: string; onClick: () => void }[] = [
    { icon: Twitter, label: 'Share on Twitter/X', onClick: onTwitter },
    { icon: Linkedin, label: 'Share on LinkedIn', onClick: onLinkedIn },
    { icon: Link2, label: t('blogDetail.copyLink'), onClick: onCopy },
  ]

  return (
    <div className="flex items-center gap-2" aria-label={t('blogDetail.share')}>
      {buttons.map(({ icon: Icon, label, onClick }) => (
        <button
          key={label}
          type="button"
          onClick={onClick}
          aria-label={label}
          title={label}
          className="grid h-9 w-9 place-items-center rounded-full border border-border/60 bg-background text-muted-foreground transition-all hover:border-primary/40 hover:text-primary"
        >
          <Icon className="h-4 w-4" />
        </button>
      ))}
      <button
        type="button"
        onClick={onCopy}
        className="hidden items-center gap-1.5 rounded-full border border-border/60 bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground transition-all hover:border-primary/40 hover:text-primary sm:inline-flex"
      >
        <Copy className="h-3.5 w-3.5" />
        {t('blogDetail.copyLink')}
      </button>
    </div>
  )
}

/* ------------------------------ markdown components ------------------------------ */

const markdownComponents: Components = {
  h1: ({ children }) => (
    <h1 className="mt-10 scroll-mt-24 text-3xl font-bold tracking-tight first:mt-0 md:text-4xl">
      {children}
    </h1>
  ),
  h2: ({ children }) => {
    const id = slugify(extractText(children))
    return (
      <h2
        id={id}
        className="mt-12 scroll-mt-24 border-b border-border/40 pb-2 text-2xl font-bold tracking-tight md:text-3xl"
      >
        {children}
      </h2>
    )
  },
  h3: ({ children }) => (
    <h3 className="mt-8 scroll-mt-24 text-xl font-semibold tracking-tight md:text-2xl">
      {children}
    </h3>
  ),
  h4: ({ children }) => (
    <h4 className="mt-6 scroll-mt-24 text-lg font-semibold tracking-tight">{children}</h4>
  ),
  p: ({ children }) => (
    <p className="text-[1.02rem] leading-[1.75] text-muted-foreground">{children}</p>
  ),
  a: ({ children, href }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="font-medium text-primary underline underline-offset-4 decoration-primary/40 transition-colors hover:decoration-primary"
    >
      {children}
    </a>
  ),
  ul: ({ children }) => (
    <ul className="list-disc space-y-2 pl-6 text-muted-foreground marker:text-primary">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal space-y-2 pl-6 text-muted-foreground marker:font-semibold marker:text-primary">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="leading-[1.7]">{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-primary/50 bg-muted/40 px-5 py-3 italic text-foreground/90">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="border-border/60" />,
  strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  code: ({ className, children }) => {
    const isBlock = !!className && className.includes('language-')
    if (isBlock) {
      return <code className={cn(className, 'font-mono')}>{children}</code>
    }
    return (
      <code className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[0.85em] text-primary">
        {children}
      </code>
    )
  },
  pre: ({ children }) => (
    <pre className="overflow-x-auto rounded-xl border border-border/60 bg-secondary p-4 text-sm text-secondary-foreground shadow-sm">
      {children}
    </pre>
  ),
  table: ({ children }) => (
    <div className="overflow-x-auto rounded-xl border border-border/60">
      <table className="w-full border-collapse text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-muted/60">{children}</thead>,
  th: ({ children }) => (
    <th className="border-b border-border/60 px-4 py-2 text-left font-semibold">{children}</th>
  ),
  td: ({ children }) => (
    <td className="border-b border-border/40 px-4 py-2 text-muted-foreground">{children}</td>
  ),
}

/* ------------------------------ TOC ------------------------------ */

function TableOfContents({ items }: { items: { id: string; text: string }[] }) {
  const t = useT()
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      // update hash without jumping
      if (typeof history !== 'undefined') history.replaceState(null, '', `#${id}`)
    }
  }

  if (items.length === 0) return null

  return (
    <nav aria-label={t('blogDetail.contents')} className="text-sm">
      <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        <List className="h-3.5 w-3.5" />
        {t('blogDetail.contents')}
      </p>
      <ul className="space-y-1 border-l border-border/60">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              onClick={(e) => handleClick(e, item.id)}
              className="-ml-px block border-l border-transparent pl-4 py-1 text-muted-foreground transition-colors hover:border-primary hover:text-primary"
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

/* ------------------------------ related compact card ------------------------------ */

function CompactCard({ post }: { post: BlogPost }) {
  const openDetail = useNav((s) => s.openDetail)
  const t = useT()
  const lang = useLang((s) => s.lang)
  const title = tc('blogPost', post.slug, 'title', post.title, lang)
  return (
    <article
      onClick={() => openDetail('blog', post.slug)}
      className="group flex cursor-pointer gap-4 rounded-2xl border border-border/60 bg-card p-3 transition-all hover:border-primary/30 hover:shadow-md"
    >
      <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-xl">
        <img
          src={post.coverImage}
          alt={title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col py-0.5">
        {post.category && (
          <span className="mb-1 text-[0.7rem] font-semibold uppercase tracking-wider text-primary">
            {post.category.name}
          </span>
        )}
        <h4 className="line-clamp-2 text-sm font-semibold leading-snug transition-colors group-hover:text-primary">
          {title}
        </h4>
        <p className="mt-auto flex items-center gap-1.5 pt-1 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span className="ltr-num">{post.readingTime}</span> {t('blog.minRead')}
        </p>
      </div>
    </article>
  )
}

/* ------------------------------ skeletons ------------------------------ */

function ArticleSkeleton() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <Skeleton className="mt-8 h-4 w-32" />
      <div className="mt-6 space-y-4">
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-10 w-1/2" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-5/6" />
      </div>
      <div className="mt-8 flex items-center gap-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-48" />
        </div>
      </div>
      <Skeleton className="mt-10 aspect-[16/8] w-full rounded-2xl" />
      <div className="mt-10 grid gap-10 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {Array.from({ length: 10 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-full" />
          ))}
        </div>
        <Skeleton className="hidden h-64 lg:block" />
      </div>
    </div>
  )
}

/* ------------------------------ not found ------------------------------ */

function NotFound({ onBack }: { onBack: () => void }) {
  const t = useT()
  const lang = useLang((s) => s.lang)
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center justify-center gap-4 px-4 py-32 text-center">
      <div className="grid h-16 w-16 place-items-center rounded-full bg-destructive/10 text-destructive">
        <AlertCircle className="h-7 w-7" />
      </div>
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t('blogDetail.notFound')}</h1>
        <p className="mt-2 text-muted-foreground">
          The article you&apos;re looking for may have been moved or doesn&apos;t exist.
        </p>
      </div>
      <Button onClick={onBack} variant="outline" className="mt-2 rounded-full">
        <ArrowLeft className={cn('mr-1.5 h-4 w-4', lang === 'fa' && 'rtl-flip mr-0 ml-1.5')} />
        {t('blogDetail.back')}
      </Button>
    </div>
  )
}

/* ------------------------------ view ------------------------------ */

export function BlogDetailView() {
  const slug = useNav((s) => s.detailSlug)
  const closeDetail = useNav((s) => s.closeDetail)
  const setView = useNav((s) => s.setView)
  const { data, isLoading, isError } = useBlogPost(slug)
  const t = useT()
  const lang = useLang((s) => s.lang)

  const articleRef = useRef<HTMLElement>(null)
  const item = data?.item
  // Only track scroll when the article is actually rendered (avoids
  // framer-motion "Target ref is defined but not hydrated" crash during loading)
  const { scrollYProgress } = useScroll({
    target: item ? articleRef : undefined,
    offset: ['start start', 'end end'],
  })
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  const related = data?.related ?? []
  const content = item?.content ?? ''
  const toc = useMemo(() => extractTOC(content), [content])

  const handleBack = () => {
    closeDetail()
    setView('blog')
  }

  if (isLoading) {
    return (
      <div className="pt-8">
        {/* progress placeholder */}
        <div className="fixed left-0 right-0 top-16 z-40 h-1 bg-border/60" />
        <ArticleSkeleton />
      </div>
    )
  }

  if (!item || isError) {
    return (
      <div className="pt-8">
        <div className="fixed left-0 right-0 top-16 z-40 h-1 bg-border/60" />
        <NotFound onBack={handleBack} />
      </div>
    )
  }

  return (
    <>
      {/* reading progress */}
      <motion.div
        style={{ scaleX }}
        className="fixed left-0 right-0 top-16 z-50 h-1 origin-left bg-gradient-to-r from-primary to-accent"
        aria-hidden
      />

      <article ref={articleRef} className="mx-auto max-w-6xl px-4 pb-24 pt-8 sm:px-6 lg:px-8">
        {/* back button */}
        <Reveal>
          <button
            type="button"
            onClick={handleBack}
            className="group mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className={cn('h-4 w-4 transition-transform group-hover:-translate-x-0.5', lang === 'fa' && 'rtl-flip group-hover:translate-x-0.5')} />
            {t('blogDetail.back')}
          </button>
        </Reveal>

        {/* hero */}
        <Reveal>
          <header className="mx-auto max-w-4xl">
            {item.category && (
              <Badge variant="secondary" className="mb-4">
                {item.category.name}
              </Badge>
            )}
            <h1 className="text-balance text-3xl font-bold leading-[1.1] tracking-tight sm:text-4xl md:text-5xl">
              {tc('blogPost', item.slug, 'title', item.title, lang)}
            </h1>
            <p className="mt-5 text-balance text-lg leading-relaxed text-muted-foreground sm:text-xl">
              {tc('blogPost', item.slug, 'excerpt', item.excerpt, lang)}
            </p>

            {/* meta row */}
            <div className="mt-8 flex flex-col gap-4 border-y border-border/60 py-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <AuthorAvatar post={item} size="md" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold">{item.authorName}</p>
                  <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="h-3 w-3" />
                      <span className="ltr-num">{formatDate(item.createdAt)}</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="h-3 w-3" />
                      <span className="ltr-num">{item.readingTime}</span> {t('blog.minRead')}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <FileText className="h-3 w-3" />
                      <span className="ltr-num">{item.views}</span> {t('blogDetail.views')}
                    </span>
                  </div>
                </div>
              </div>
              <ShareButtons title={tc('blogPost', item.slug, 'title', item.title, lang)} />
            </div>
          </header>
        </Reveal>

        {/* cover image */}
        <Reveal delay={0.1}>
          <div className="mt-10 overflow-hidden rounded-2xl border border-border/60 shadow-sm">
            <img
              src={item.coverImage}
              alt={tc('blogPost', item.slug, 'title', item.title, lang)}
              className="aspect-[16/8] w-full object-cover"
            />
          </div>
        </Reveal>

        {/* content + TOC */}
        <div className="mt-12 grid gap-10 lg:grid-cols-3 lg:gap-12">
          {/* main content */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              <ReactMarkdown components={markdownComponents}>{item.content}</ReactMarkdown>
            </div>

            {/* tags */}
            {item.tags && item.tags.length > 0 && (
              <div className="mt-10 flex flex-wrap items-center gap-2 border-t border-border/60 pt-6">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {t('blog.tags')}
                </span>
                {item.tags.map((tg) => (
                  <span
                    key={tg.id}
                    className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground"
                  >
                    #{tg.name}
                  </span>
                ))}
              </div>
            )}

            {/* author footer */}
            <div className="mt-10 flex items-center gap-4 rounded-2xl border border-border/60 bg-muted/30 p-5">
              <AuthorAvatar post={item} size="lg" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Written by
                </p>
                <p className="text-base font-semibold">{item.authorName}</p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  <span className="ltr-num">{item.views + 1}</span> {t('blogDetail.views')} ·{' '}
                  <span className="ltr-num">{item.readingTime}</span> {t('blog.minRead')}
                </p>
              </div>
            </div>
          </div>

          {/* sticky TOC */}
          <aside className="lg:col-span-1">
            <div className="lg:sticky lg:top-24">
              <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
                <TableOfContents items={toc} />
                {toc.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    Use the headings above to navigate this article.
                  </p>
                )}
              </div>

              {/* mini CTA in sidebar */}
              <div className="mt-4 rounded-2xl border border-border/60 bg-secondary p-5 text-secondary-foreground">
                <p className="text-sm font-semibold">{t('blogDetail.likeCta')}</p>
                <p className="mt-1 text-xs text-secondary-foreground/70">
                  We craft digital products that ship fast and scale gracefully.
                </p>
                <button
                  type="button"
                  onClick={() => setView('contact')}
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-accent hover:underline"
                >
                  {t('blogDetail.startProject')}
                  <ArrowRight className={cn('h-3.5 w-3.5', lang === 'fa' && 'rtl-flip')} />
                </button>
              </div>
            </div>
          </aside>
        </div>

        {/* related articles */}
        {related.length > 0 && (
          <section className="mt-20">
            <SectionHeading
              align="left"
              eyebrow="Keep reading"
              title={t('blogDetail.related')}
              description="More perspectives from our team."
            />
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((post, i) => (
                <Reveal key={post.id} delay={Math.min(i * 0.06, 0.24)}>
                  <CompactCard post={post} />
                </Reveal>
              ))}
            </div>
          </section>
        )}

        {/* final CTA */}
        <section className="mt-20">
          <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-secondary px-6 py-14 text-center md:px-12 md:py-16">
            <div className="bg-radial-fade pointer-events-none absolute inset-0 opacity-40" />
            <div className="relative mx-auto max-w-2xl">
              <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                Let&apos;s build
              </span>
              <h2 className="text-balance text-2xl font-bold tracking-tight text-secondary-foreground md:text-3xl">
                {t('blogDetail.ctaTitle')}
              </h2>
              <p className="mt-3 text-base text-secondary-foreground/70">
                {t('blogDetail.ctaDesc')}
              </p>
              <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button
                  size="lg"
                  onClick={() => setView('contact')}
                  className="rounded-full"
                >
                  {t('blogDetail.startProject')}
                  <ArrowRight className={cn('ml-1.5 h-4 w-4', lang === 'fa' && 'rtl-flip ml-0 mr-1.5')} />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => setView('estimate')}
                  className="rounded-full border-white/20 bg-white/5 text-secondary-foreground hover:bg-white/10 hover:text-secondary-foreground"
                >
                  {t('cta.getEstimate')}
                </Button>
              </div>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  setView('contact')
                }}
                className="mt-6 inline-flex items-center gap-1 text-sm text-secondary-foreground/60 transition-colors hover:text-secondary-foreground"
              >
                or subscribe to our newsletter
                <ArrowUpRight className={cn('h-3.5 w-3.5', lang === 'fa' && 'rtl-flip')} />
              </a>
            </div>
          </div>
        </section>
      </article>
    </>
  )
}
