'use client'

import { useEffect } from 'react'
import { useLang } from '@/lib/lang-store'

// Sets the <html> dir and lang attributes based on the active language,
// and applies the Persian font when in Farsi mode.
export function LangDirection() {
  const lang = useLang((s) => s.lang)

  useEffect(() => {
    const html = document.documentElement
    html.lang = lang
    html.dir = lang === 'fa' ? 'rtl' : 'ltr'
    // Toggle a class so we can swap the font family in CSS
    if (lang === 'fa') {
      html.classList.add('lang-fa')
    } else {
      html.classList.remove('lang-fa')
    }
  }, [lang])

  return null
}
