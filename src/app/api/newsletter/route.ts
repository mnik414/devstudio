import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, source = 'footer' } = body

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    const normalizedEmail = email.toLowerCase().slice(0, 160)

    // Use raw queries as a fallback when the Prisma client delegate is stale
    // (the dev server may cache an older generated client without the Newsletter model)
    if (db.newsletter) {
      const existing = await db.newsletter.findUnique({ where: { email: normalizedEmail } })
      if (existing) {
        if (!existing.active) {
          await db.newsletter.update({
            where: { id: existing.id },
            data: { active: true, source: String(source).slice(0, 40) },
          })
        }
        return NextResponse.json({ ok: true, alreadySubscribed: true })
      }
      await db.newsletter.create({
        data: { email: normalizedEmail, source: String(source).slice(0, 40) },
      })
    } else {
      // Fallback: raw SQL (SQLite)
      const existing = await db.$queryRawUnsafe<{ id: string; active: number }[]>(
        `SELECT id, active FROM Newsletter WHERE email = ? LIMIT 1`,
        normalizedEmail,
      )
      if (existing && existing.length > 0) {
        if (!existing[0].active) {
          await db.$executeRawUnsafe(
            `UPDATE Newsletter SET active = 1, source = ? WHERE id = ?`,
            String(source).slice(0, 40),
            existing[0].id,
          )
        }
        return NextResponse.json({ ok: true, alreadySubscribed: true })
      }
      await db.$executeRawUnsafe(
        `INSERT INTO Newsletter (id, email, source, active, createdAt) VALUES (lower(hex(randomblob(25))), ?, ?, 1, datetime('now'))`,
        normalizedEmail,
        String(source).slice(0, 40),
      )
    }

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
