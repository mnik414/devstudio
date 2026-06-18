import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Estimate cost calculation based on answers
function calcEstimate(answers: {
  projectType?: string
  pages?: number
  adminPanel?: boolean
  payment?: boolean
  auth?: boolean
  mobileApp?: boolean
  ai?: boolean
}): { min: number; max: number; breakdown: { label: string; cost: number }[] } {
  const breakdown: { label: string; cost: number }[] = []
  let base = 1500

  const typeMap: Record<string, number> = {
    'landing-page': 1500,
    'corporate-site': 2500,
    'ecommerce': 4000,
    'web-app': 5000,
    saas: 7000,
    booking: 3500,
    custom: 5000,
  }
  if (answers.projectType && typeMap[answers.projectType]) {
    base = typeMap[answers.projectType]
    breakdown.push({ label: 'Base project type', cost: base })
  } else {
    breakdown.push({ label: 'Base', cost: base })
  }

  const pages = answers.pages ?? 5
  if (pages > 5) {
    const extra = (pages - 5) * 250
    breakdown.push({ label: `Extra pages (${pages - 5})`, cost: extra })
    base += extra
  }

  if (answers.adminPanel) {
    breakdown.push({ label: 'Admin panel / CMS', cost: 1500 })
    base += 1500
  }
  if (answers.payment) {
    breakdown.push({ label: 'Payment gateway', cost: 800 })
    base += 800
  }
  if (answers.auth) {
    breakdown.push({ label: 'User registration & auth', cost: 1000 })
    base += 1000
  }
  if (answers.mobileApp) {
    breakdown.push({ label: 'Mobile app (companion)', cost: 4000 })
    base += 4000
  }
  if (answers.ai) {
    breakdown.push({ label: 'AI features integration', cost: 2500 })
    base += 2500
  }

  const min = Math.round(base * 0.85)
  const max = Math.round(base * 1.25)
  return { min, max, breakdown }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { answers, contact } = body

    const est = calcEstimate(answers || {})
    const estimatedCost = `$${est.min.toLocaleString()} - $${est.max.toLocaleString()}`

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

    return NextResponse.json({ ok: true, estimate: est, estimatedCost, leadId })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
