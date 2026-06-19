import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const item = await db.blogPost.findUnique({
    where: { slug },
    include: { category: true, tags: true },
  })
  if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  await db.blogPost.update({ where: { id: item.id }, data: { views: { increment: 1 } } })

  const related = await db.blogPost.findMany({
    where: { published: true, id: { not: item.id }, categoryId: item.categoryId },
    take: 3,
    include: { category: true, tags: true },
  })

  return NextResponse.json({ item, related })
}
