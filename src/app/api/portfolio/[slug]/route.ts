import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const item = await db.portfolio.findUnique({
    where: { slug },
    include: { category: true, technologies: true },
  })
  if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  await db.portfolio.update({ where: { id: item.id }, data: { views: { increment: 1 } } })

  const related = await db.portfolio.findMany({
    where: {
      published: true,
      id: { not: item.id },
      OR: [
        { categoryId: item.categoryId },
        { technologies: { some: { id: { in: item.technologies.map((t) => t.id) } } } },
      ],
    },
    take: 3,
    include: { category: true, technologies: true },
  })

  return NextResponse.json({ item, related })
}
