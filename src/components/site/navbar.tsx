'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Logo } from './logo'
import { ThemeToggle } from './theme-toggle'
import { useNav, type ViewKey } from '@/lib/store'
import { cn } from '@/lib/utils'

const NAV_ITEMS: { label: string; view: ViewKey }[] = [
  { label: 'Home', view: 'home' },
  { label: 'Portfolio', view: 'portfolio' },
  { label: 'Case Studies', view: 'case-studies' },
  { label: 'Blog', view: 'blog' },
  { label: 'About', view: 'about' },
  { label: 'Contact', view: 'contact' },
]

export function Navbar() {
  const { view, setView, scrollTo } = useNav()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const go = (v: ViewKey) => {
    setView(v)
    setOpen(false)
  }

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        scrolled ? 'border-b border-border/60 bg-background/80 backdrop-blur-xl' : 'bg-transparent',
      )}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <button onClick={() => go('home')} className="flex items-center" aria-label="Go home">
          <Logo />
        </button>

        <div className="hidden items-center gap-1 lg:flex">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.view}
              onClick={() => go(item.view)}
              className={cn(
                'relative rounded-full px-4 py-2 text-sm font-medium transition-colors',
                view === item.view
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {view === item.view && (
                <motion.span
                  layoutId="nav-pill"
                  className="absolute inset-0 -z-10 rounded-full bg-primary/10"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button
            size="sm"
            onClick={() => setView('estimate')}
            className="hidden rounded-full sm:inline-flex"
          >
            Get Estimate
            <ArrowRight className="ml-1.5 h-4 w-4" />
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <SheetHeader>
                <SheetTitle>
                  <Logo />
                </SheetTitle>
              </SheetHeader>
              <div className="mt-6 flex flex-col gap-1">
                {NAV_ITEMS.map((item) => (
                  <button
                    key={item.view}
                    onClick={() => go(item.view)}
                    className={cn(
                      'flex items-center justify-between rounded-xl px-4 py-3 text-left text-base font-medium transition-colors',
                      view === item.view
                        ? 'bg-primary/10 text-primary'
                        : 'text-foreground hover:bg-muted',
                    )}
                  >
                    {item.label}
                    <ArrowRight className="h-4 w-4 opacity-50" />
                  </button>
                ))}
                <Button
                  className="mt-3 rounded-xl"
                  onClick={() => {
                    go('estimate')
                    setOpen(false)
                  }}
                >
                  Get Estimate
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  )
}
