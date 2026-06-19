'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import {
  Home,
  FolderKanban,
  BookOpen,
  FileText,
  Mail,
  Calculator,
  Info,
  LayoutDashboard,
  Search,
  ArrowRight,
} from 'lucide-react'
import { useNav, type ViewKey } from '@/lib/store'
import { useT, useLang } from '@/lib/lang-store'
import { usePortfolios, useBlogPosts } from '@/lib/hooks'
import { tc } from '@/lib/content-i18n'

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const { setView, openDetail } = useNav()
  const t = useT()
  const lang = useLang((s) => s.lang)
  const { data: portfolioData } = usePortfolios({ limit: '20' })
  const { data: blogData } = useBlogPosts({ limit: '20' })

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((o) => !o)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  const go = (view: ViewKey) => {
    setView(view)
    setOpen(false)
  }

  const portfolios = useMemo(() => portfolioData?.items ?? [], [portfolioData])
  const posts = useMemo(() => blogData?.items ?? [], [blogData])

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="group hidden items-center gap-2 rounded-full border border-border/60 bg-muted/40 px-3 py-1.5 text-sm text-muted-foreground transition hover:border-primary/40 hover:text-foreground md:inline-flex"
        aria-label={t('cmd.placeholder')}
      >
        <Search className="h-4 w-4" />
        <span className="max-w-[160px] truncate">{t('cmd.placeholder')}</span>
        <kbd className="pointer-events-none ml-2 hidden select-none items-center gap-0.5 rounded border border-border bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground lg:inline-flex">
          ⌘K
        </kbd>
      </button>

      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title={t('cmd.placeholder')}
        description={t('cmd.placeholder')}
      >
        <CommandInput placeholder={t('cmd.placeholder')} />
        <CommandList>
          <CommandEmpty>{t('cmd.noResults')}</CommandEmpty>
          <CommandGroup heading={t('cmd.pages')}>
            <CommandItem onSelect={() => go('home')}>
              <Home className="mr-2 h-4 w-4" />
              {t('nav.home')}
            </CommandItem>
            <CommandItem onSelect={() => go('portfolio')}>
              <FolderKanban className="mr-2 h-4 w-4" />
              {t('nav.portfolio')}
            </CommandItem>
            <CommandItem onSelect={() => go('case-studies')}>
              <FileText className="mr-2 h-4 w-4" />
              {t('nav.caseStudies')}
            </CommandItem>
            <CommandItem onSelect={() => go('blog')}>
              <BookOpen className="mr-2 h-4 w-4" />
              {t('nav.blog')}
            </CommandItem>
            <CommandItem onSelect={() => go('about')}>
              <Info className="mr-2 h-4 w-4" />
              {t('nav.about')}
            </CommandItem>
            <CommandItem onSelect={() => go('contact')}>
              <Mail className="mr-2 h-4 w-4" />
              {t('nav.contact')}
            </CommandItem>
            <CommandItem onSelect={() => go('estimate')}>
              <Calculator className="mr-2 h-4 w-4" />
              {t('nav.getEstimate')}
            </CommandItem>
            <CommandItem onSelect={() => go('admin')}>
              <LayoutDashboard className="mr-2 h-4 w-4" />
              {t('nav.admin')}
            </CommandItem>
          </CommandGroup>

          {portfolios.length > 0 && (
            <>
              <CommandSeparator />
              <CommandGroup heading={t('cmd.projects')}>
                {portfolios.map((p) => (
                  <CommandItem
                    key={p.id}
                    onSelect={() => {
                      openDetail('portfolio', p.slug)
                      setOpen(false)
                    }}
                  >
                    <FolderKanban className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="flex-1 truncate">
                      {tc('portfolio', p.slug, 'title', p.title, lang)}
                    </span>
                    {p.category && (
                      <span className="text-xs text-muted-foreground">{p.category.name}</span>
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}

          {posts.length > 0 && (
            <>
              <CommandSeparator />
              <CommandGroup heading={t('cmd.articles')}>
                {posts.map((p) => (
                  <CommandItem
                    key={p.id}
                    onSelect={() => {
                      openDetail('blog', p.slug)
                      setOpen(false)
                    }}
                  >
                    <BookOpen className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="flex-1 truncate">
                      {tc('blogPost', p.slug, 'title', p.title, lang)}
                    </span>
                    {p.category && (
                      <span className="text-xs text-muted-foreground">{p.category.name}</span>
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}
        </CommandList>
      </CommandDialog>
    </>
  )
}
