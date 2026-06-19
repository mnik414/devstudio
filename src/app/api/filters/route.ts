import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  const [categories, technologies] = await Promise.all([
    db.portfolioCategory.findMany({ orderBy: { name: 'asc' } }),
    db.technology.findMany({ orderBy: { name: 'asc' } }),
  ])
  return NextResponse.json({ categories, technologies })
}
