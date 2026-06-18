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

interface NavState {
  view: ViewKey
  // optional detail target (slug) for portfolio/blog/case-study
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
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' })
  },
  openDetail: (v, slug) => {
    set({ view: v, detailSlug: slug })
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' })
  },
  closeDetail: () => set({ detailSlug: null, view: 'portfolio' }),
  scrollTarget: null,
  scrollTo: (id) => {
    set({ view: 'home', scrollTarget: id })
    setTimeout(() => {
      const el = document.getElementById(id)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 80)
  },
}))
