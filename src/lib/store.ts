import { create } from 'zustand'

export type ViewKey =
  | 'home'
  | 'portfolio'
  | 'case-studies'
  | 'blog'
  | 'contact'
  | 'estimate'
  | 'about'
  | 'admin'

export function parseHash(): { view: ViewKey; detailSlug: string | null } {
  if (typeof window === 'undefined') return { view: 'home', detailSlug: null }
  const hash = window.location.hash.replace(/^#/, '')
  if (!hash) return { view: 'home', detailSlug: null }
  const parts = hash.split('/')
  const view = parts[0] as ViewKey
  const detailSlug = parts[1] || null
  return { view: ['home', 'portfolio', 'case-studies', 'blog', 'contact', 'estimate', 'about', 'admin'].includes(view) ? view : 'home', detailSlug }
}

export function pushHash(view: ViewKey, slug?: string | null) {
  if (typeof window === 'undefined') return
  const hash = slug ? `#${view}/${slug}` : view === 'home' ? '' : `#${view}`
  const current = window.location.hash.replace(/^#/, '')
  const target = hash.replace(/^#/, '')
  if (current !== target) {
    window.history.pushState(null, '', hash || '/')
  }
}

interface NavState {
  view: ViewKey
  detailSlug: string | null
  setView: (v: ViewKey) => void
  openDetail: (v: ViewKey, slug: string) => void
  closeDetail: () => void
  scrollTarget: string | null
  scrollTo: (id: string) => void
}

export const useNav = create<NavState>((set) => ({
  view: 'home',
  detailSlug: null,
  setView: (v) => {
    set({ view: v, detailSlug: null })
    pushHash(v)
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' })
  },
  openDetail: (v, slug) => {
    set({ view: v, detailSlug: slug })
    pushHash(v, slug)
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' })
  },
  closeDetail: () => {
    set({ detailSlug: null, view: 'portfolio' })
    pushHash('portfolio')
  },
  scrollTarget: null,
  scrollTo: (id) => {
    set({ view: 'home', scrollTarget: id })
    pushHash('home')
    setTimeout(() => {
      const el = document.getElementById(id)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 80)
  },
}))