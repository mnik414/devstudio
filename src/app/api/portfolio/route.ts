import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/portfolio?featured=true&category=slug&tech=slug&q=term
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const featured = searchParams.get('featured')
  const category = searchParams.get('category')
  const tech = searchParams.get('tech')
  const q = searchParams.get('q')
  const sort = searchParams.get('sort') || 'newest'
  const limit = searchParams.get('limit')

  const where: Record<string, unknown> = { published: true }
  if (featured === 'true') where.featured = true
  if (category) where.category = { slug: category }
  if (tech) where.technologies = { some: { slug: tech } }
  if (q) {
    where.OR = [
      { title: { contains: q } },
      { summary: { contains: q } },
      { description: { contains: q } },
    ]
  }

  let orderBy: Record<string, 'asc' | 'desc'> = { createdAt: 'desc' }
  if (sort === 'oldest') orderBy = { createdAt: 'asc' }
  else if (sort === 'title') orderBy = { title: 'asc' }
  else if (sort === 'views') orderBy = { views: 'desc' }

  const items = await db.portfolio.findMany({
    where,
    orderBy,
    take: limit ? Number(limit) : undefined,
    include: { category: true, technologies: true },
  })
  return NextResponse.json({ items })
}
