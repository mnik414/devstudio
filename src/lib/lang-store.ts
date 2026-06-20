import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { translate, type Lang } from './i18n'

interface LangState {
  lang: Lang
  setLang: (l: Lang) => void
  toggle: () => void
  t: (key: string, vars?: Record<string, string | number>) => string
}

export const useLang = create<LangState>()(
  persist(
    (set, get) => ({
      lang: 'fa',
      setLang: (l) => set({ lang: l }),
      toggle: () => set({ lang: get().lang === 'en' ? 'fa' : 'en' }),
      t: (key, vars) => translate(get().lang, key, vars),
    }),
    {
      name: 'devstudio-lang',
      // Only persist the language, not the t function
      partialize: (state) => ({ lang: state.lang }),
    },
  ),
)

// Selector hook for the translation function — re-renders on lang change
export function useT() {
  const lang = useLang((s) => s.lang)
  return (key: string, vars?: Record<string, string | number>) => translate(lang, key, vars)
}

// Helper to get current direction
export function useDir() {
  const lang = useLang((s) => s.lang)
  return lang === 'fa' ? 'rtl' : 'ltr'
}
