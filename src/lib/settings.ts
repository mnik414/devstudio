import type { Lang } from './i18n'

export function getBilingualValue(value: string, lang: Lang): string {
  try {
    const parsed = JSON.parse(value)
    if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
      if (parsed.fa || parsed.en) {
        return parsed[lang] || parsed.en || parsed.fa || value
      }
    }
  } catch {}
  return value
}

export type SiteSettings = Record<string, string>

export async function fetchSettings(): Promise<SiteSettings> {
  const res = await fetch('/api/site')
  if (!res.ok) return {}
  const data = await res.json()
  return data.settings || {}
}