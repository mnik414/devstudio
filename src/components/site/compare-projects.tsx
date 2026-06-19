'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GitCompare, X, ArrowRight, Check, Minus, Eye, Calendar, Building2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useFavorites } from '@/lib/favorites-store'
import { usePortfolios, parseList, type Portfolio } from '@/lib/hooks'
import { useNav } from '@/lib/store'
import { useT, useLang } from '@/lib/lang-store'
import { tc } from '@/lib/content-i18n'
import { cn } from '@/lib/utils'

export function CompareButton() {
  const [open, setOpen] = useState(false)
  const favoriteIds = useFavorites((s) => s.ids)
  const t = useT()

  if (favoriteIds.length < 1) return null

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/5 px-3 py-1.5 text-sm font-medium text-primary transition hover:bg-primary/10"
      >
        <GitCompare className="h-4 w-4" />
        <span className="hidden sm:inline">Compare</span>
        <span className="ltr-num rounded-full bg-primary/20 px-1.5 text-xs font-bold">
          {favoriteIds.length}
        </span>
      </button>
      <CompareDialog open={open} onOpenChange={setOpen} ids={favoriteIds} />
    </>
  )
}

function CompareDialog({
  open,
  onOpenChange,
  ids,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  ids: string[]
}) {
  const t = useT()
  const lang = useLang((s) => s.lang)
  const { openDetail } = useNav()
  const { data, isLoading } = usePortfolios({ limit: '50' })
  const allItems = data?.items ?? []
  const items = allItems.filter((p) => ids.includes(p.id))

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl overflow-y-auto p-0">
        <DialogHeader className="border-b px-6 py-4">
          <DialogTitle className="flex items-center gap-2">
            <GitCompare className="h-5 w-5 text-primary" />
            Compare Projects
            <Badge variant="secondary" className="ltr-num">{items.length}</Badge>
          </DialogTitle>
          <DialogDescription className="sr-only">
            Compare saved projects side by side
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[70vh] overflow-auto p-6">
          {isLoading ? (
            <div className="py-12 text-center text-muted-foreground">Loading...</div>
          ) : items.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              Save projects to compare them side by side.
            </div>
          ) : (
            <div
              className={cn(
                'grid gap-4',
                items.length === 1 && 'grid-cols-1',
                items.length === 2 && 'grid-cols-2',
                items.length >= 3 && 'grid-cols-3',
              )}
            >
              {items.map((item) => (
                <CompareColumn key={item.id} item={item} lang={lang} onView={() => { onOpenChange(false); openDetail('portfolio', item.slug) }} />
              ))}
            </div>
          )}

          {/* Comparison rows */}
          {items.length >= 2 && (
            <div className="mt-6 overflow-x-auto rounded-xl border">
              <table className="w-full text-sm">
                <tbody>
                  <CompareRow label="Category" items={items} render={(p) => p.category?.name ?? '—'} />
                  <CompareRow label="Year" items={items} render={(p) => <span className="ltr-num">{p.year}</span>} />
                  <CompareRow label="Client" items={items} render={(p) => p.clientName ?? '—'} />
                  <CompareRow label="Views" items={items} render={(p) => <span className="ltr-num">{p.views}</span>} />
                  <CompareRow label="Featured" items={items} render={(p) => p.featured ? <Check className="mx-auto h-4 w-4 text-accent" /> : <Minus className="mx-auto h-4 w-4 text-muted-foreground/40" />} />
                  <CompareRow label="Technologies" items={items} render={(p) => (p.technologies ?? []).map(t => t.name).join(', ') || '—'} />
                  <CompareRow label="Features" items={items} render={(p) => { const f = parseList(p.features); return <span className="ltr-num">{f.length}</span> }} />
                </tbody>
              </table>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

function CompareColumn({ item, lang, onView }: { item: Portfolio; lang: 'en' | 'fa'; onView: () => void }) {
  const title = tc('portfolio', item.slug, 'title', item.title, lang)
  return (
    <div className="overflow-hidden rounded-xl border border-border/60 bg-card">
      <div className="relative aspect-video overflow-hidden">
        <img src={item.coverImage} alt={title} className="h-full w-full object-cover" loading="lazy" />
        {item.category && (
          <Badge className="absolute left-2 top-2 border-0 bg-background/90 text-foreground backdrop-blur">
            {item.category.name}
          </Badge>
        )}
      </div>
      <div className="p-3">
        <h3 className="line-clamp-1 text-sm font-semibold">{title}</h3>
        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
          {tc('portfolio', item.slug, 'summary', item.summary, lang)}
        </p>
        <Button size="sm" variant="outline" className="mt-3 w-full" onClick={onView}>
          View Details
          <ArrowRight className={cn('h-3.5 w-3.5', lang === 'fa' ? 'mr-1.5 rtl-flip' : 'ml-1.5')} />
        </Button>
      </div>
    </div>
  )
}

function CompareRow({
  label,
  items,
  render,
}: {
  label: string
  items: Portfolio[]
  render: (p: Portfolio) => React.ReactNode
}) {
  return (
    <tr className="border-b last:border-0">
      <td className="whitespace-nowrap bg-muted/40 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </td>
      {items.map((item) => (
        <td key={item.id} className="border-l px-4 py-3 text-center">
          {render(item)}
        </td>
      ))}
    </tr>
  )
}
