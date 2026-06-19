import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const category = searchParams.get('category')
  const tag = searchParams.get('tag')
  const q = searchParams.get('q')
  const featured = searchParams.get('featured')
  const limit = searchParams.get('limit')

  const where: Record<string, unknown> = { published: true }
  if (category) where.category = { slug: category }
  if (tag) where.tags = { some: { slug: tag } }
  if (featured === 'true') where.featured = true
  if (q) {
    where.OR = [{ title: { contains: q } }, { excerpt: { contains: q } }]
  }

  const items = await db.blogPost.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: limit ? Number(limit) : undefined,
    include: { category: true, tags: true },
  })
  return NextResponse.json({ items })
}
