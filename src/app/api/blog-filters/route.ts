import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  const [categories, tags] = await Promise.all([
    db.blogCategory.findMany({ orderBy: { name: 'asc' } }),
    db.tag.findMany({ orderBy: { name: 'asc' } }),
  ])
  return NextResponse.json({ categories, tags })
}
