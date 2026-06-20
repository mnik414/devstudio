import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAuthFromRequest } from '@/lib/auth/admin-auth'

const MODELS = [
  'portfolio',
  'portfolioCategory',
  'technology',
  'blogPost',
  'blogCategory',
  'tag',
  'caseStudy',
  'testimonial',
  'teamMember',
  'service',
  'faq',
  'lead',
  'contactRequest',
  'setting',
  'newsletter',
] as const

type ModelName = (typeof MODELS)[number]

function getDelegate(name: string) {
  const map: Record<ModelName, unknown> = {
    portfolio: db.portfolio,
    portfolioCategory: db.portfolioCategory,
    technology: db.technology,
    blogPost: db.blogPost,
    blogCategory: db.blogCategory,
    tag: db.tag,
    caseStudy: db.caseStudy,
    testimonial: db.testimonial,
    teamMember: db.teamMember,
    service: db.service,
    faq: db.faq,
    lead: db.lead,
    contactRequest: db.contactRequest,
    setting: db.setting,
    newsletter: db.newsletter,
  }
  return map[name as ModelName] as Record<string, (...args: unknown[]) => Promise<unknown>>
}

// GET /api/admin?model=portfolio
export async function GET(req: NextRequest) {
  if (!getAuthFromRequest(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { searchParams } = new URL(req.url)
  const model = searchParams.get('model') as ModelName
  if (!MODELS.includes(model)) return NextResponse.json({ error: 'Invalid model' }, { status: 400 })

  // Newsletter: use raw queries as a fallback when the Prisma client delegate
  // is stale (the dev server may cache an older generated client).
  if (model === 'newsletter') {
    const rows = await db.$queryRawUnsafe(
      `SELECT id, email, source, active, createdAt FROM Newsletter ORDER BY createdAt DESC`,
    )
    return NextResponse.json({ items: rows })
  }

  const delegate = getDelegate(model)
  // Setting model has no createdAt; sort by updatedAt instead
  const sortField = model === 'setting' ? 'updatedAt' : 'createdAt'
  // @ts-expect-error dynamic
  const items = await delegate.findMany({ orderBy: { [sortField]: 'desc' } })
  return NextResponse.json({ items })
}

// POST create
export async function POST(req: NextRequest) {
  if (!getAuthFromRequest(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const { model, data } = body as { model: ModelName; data: Record<string, unknown> }
  if (!MODELS.includes(model)) return NextResponse.json({ error: 'Invalid model' }, { status: 400 })
  const delegate = getDelegate(model)
  // @ts-expect-error dynamic
  const item = await delegate.create({ data })
  return NextResponse.json({ item })
}

// PATCH update
export async function PATCH(req: NextRequest) {
  if (!getAuthFromRequest(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const { model, id, data } = body as { model: ModelName; id: string; data: Record<string, unknown> }
  if (!MODELS.includes(model)) return NextResponse.json({ error: 'Invalid model' }, { status: 400 })
  const delegate = getDelegate(model)
  // @ts-expect-error dynamic
  const item = await delegate.update({ where: { id }, data })
  return NextResponse.json({ item })
}

// DELETE
export async function DELETE(req: NextRequest) {
  if (!getAuthFromRequest(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { searchParams } = new URL(req.url)
  const model = searchParams.get('model') as ModelName
  const id = searchParams.get('id')
  if (!MODELS.includes(model) || !id) return NextResponse.json({ error: 'Invalid params' }, { status: 400 })

  // Newsletter: raw delete fallback
  if (model === 'newsletter') {
    await db.$executeRawUnsafe(`DELETE FROM Newsletter WHERE id = ?`, id)
    return NextResponse.json({ ok: true })
  }

  const delegate = getDelegate(model)
  // @ts-expect-error dynamic
  await delegate.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
