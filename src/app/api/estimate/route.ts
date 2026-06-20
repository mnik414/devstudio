import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Fallback rate if API is unavailable (1 USD ≈ 160,000 Toman as of recent)
const FALLBACK_USD_TO_TOMAN = 160000

// Cached tether price (refreshed every 5 min via /api/tether-price)
let cachedTetherPrice: { price: number; timestamp: number } | null = null
const CACHE_TTL = 5 * 60 * 1000

async function getUsdToTomanRate(): Promise<number> {
  // Return cached price if fresh
  if (cachedTetherPrice && Date.now() - cachedTetherPrice.timestamp < CACHE_TTL) {
    return cachedTetherPrice.price
  }

  try {
    const res = await fetch('http://localhost:3000/api/tether-price', {
      signal: AbortSignal.timeout(8000),
    })
    if (res.ok) {
      const data = await res.json()
      if (data.ok && data.price > 0) {
        cachedTetherPrice = { price: data.price, timestamp: Date.now() }
        return data.price
      }
    }
  } catch {
    // fall through to fallback
  }

  return FALLBACK_USD_TO_TOMAN
}

// Breakdown labels in English and Persian
const LABELS_EN: Record<string, string> = {
  base: 'Base project type',
  baseDefault: 'Base',
  extraPages: 'Extra pages ({n})',
  adminPanel: 'Admin panel / CMS',
  payment: 'Payment gateway',
  auth: 'User registration & auth',
  mobileApp: 'Mobile app (companion)',
  ai: 'AI features integration',
}

const LABELS_FA: Record<string, string> = {
  base: 'نوع پروژه پایه',
  baseDefault: 'پایه',
  extraPages: 'صفحات اضافی ({n})',
  adminPanel: 'پنل مدیریت / CMS',
  payment: 'درگاه پرداخت',
  auth: 'ثبت‌نام کاربر و احراز هویت',
  mobileApp: 'اپلیکیشن موبایل (همراه)',
  ai: 'یکپارچه‌سازی هوش مصنوعی',
}

// Estimate cost calculation based on answers
async function calcEstimate(
  answers: {
    projectType?: string
    pages?: number
    adminPanel?: boolean
    payment?: boolean
    auth?: boolean
    mobileApp?: boolean
    ai?: boolean
  },
  lang: 'en' | 'fa' = 'en',
): Promise<{
  min: number
  max: number
  breakdown: { label: string; cost: number }[]
  currency: string
  minDisplay: string
  maxDisplay: string
  usdToToman: number
}> {
  const labels = lang === 'fa' ? LABELS_FA : LABELS_EN
  const breakdown: { label: string; cost: number }[] = []
  let base = 1500 // in USD

  const typeMap: Record<string, number> = {
    'landing-page': 1500,
    'corporate-site': 2500,
    ecommerce: 4000,
    'web-app': 5000,
    saas: 7000,
    booking: 3500,
    custom: 5000,
  }
  if (answers.projectType && typeMap[answers.projectType]) {
    base = typeMap[answers.projectType]
    breakdown.push({ label: labels.base, cost: base })
  } else {
    breakdown.push({ label: labels.baseDefault, cost: base })
  }

  const pages = answers.pages ?? 5
  if (pages > 5) {
    const extra = (pages - 5) * 250
    breakdown.push({ label: labels.extraPages.replace('{n}', String(pages - 5)), cost: extra })
    base += extra
  }

  if (answers.adminPanel) {
    breakdown.push({ label: labels.adminPanel, cost: 1500 })
    base += 1500
  }
  if (answers.payment) {
    breakdown.push({ label: labels.payment, cost: 800 })
    base += 800
  }
  if (answers.auth) {
    breakdown.push({ label: labels.auth, cost: 1000 })
    base += 1000
  }
  if (answers.mobileApp) {
    breakdown.push({ label: labels.mobileApp, cost: 4000 })
    base += 4000
  }
  if (answers.ai) {
    breakdown.push({ label: labels.ai, cost: 2500 })
    base += 2500
  }

  const min = Math.round(base * 0.85)
  const max = Math.round(base * 1.25)

  // Get live USD to Toman rate from tether price API
  const usdToToman = await getUsdToTomanRate()

  // Convert to display format based on language
  let minDisplay: string
  let maxDisplay: string
  let currency: string

  if (lang === 'fa') {
    // Convert to million Toman (divide by 1,000,000 to get millions)
    const minToman = Math.round((min * usdToToman) / 1000000)
    const maxToman = Math.round((max * usdToToman) / 1000000)
    currency = 'میلیون تومان'
    minDisplay = `${minToman.toLocaleString('fa-IR')}`
    maxDisplay = `${maxToman.toLocaleString('fa-IR')}`
  } else {
    currency = '$'
    minDisplay = `$${min.toLocaleString()}`
    maxDisplay = `$${max.toLocaleString()}`
  }

  return { min, max, breakdown, currency, minDisplay, maxDisplay, usdToToman }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { answers, contact } = body
    const lang: 'en' | 'fa' = body.lang === 'fa' ? 'fa' : 'en'

    const est = await calcEstimate(answers || {}, lang)
    const estimatedCost = `${est.minDisplay} - ${est.maxDisplay}`

    let leadId: string | null = null
    if (contact && contact.name && contact.email) {
      const lead = await db.lead.create({
        data: {
          name: String(contact.name).slice(0, 120),
          email: String(contact.email).slice(0, 160),
          phone: contact.phone ? String(contact.phone).slice(0, 40) : null,
          company: contact.company ? String(contact.company).slice(0, 120) : null,
          budget: estimatedCost,
          projectType: answers?.projectType || null,
          description: JSON.stringify(answers),
          answers: JSON.stringify(answers),
          estimatedCost,
        },
      })
      leadId = lead.id
    }

    return NextResponse.json({
      ok: true,
      estimate: {
        min: est.min,
        max: est.max,
        breakdown: est.breakdown,
        currency: est.currency,
        minDisplay: est.minDisplay,
        maxDisplay: est.maxDisplay,
        usdToToman: est.usdToToman,
      },
      estimatedCost,
      leadId,
    })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
