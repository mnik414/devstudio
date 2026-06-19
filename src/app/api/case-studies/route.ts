import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const featured = searchParams.get('featured')
  const where: Record<string, unknown> = { published: true }
  if (featured === 'true') where.featured = true
  const items = await db.caseStudy.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json({ items })
}
