import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Simple rate limiting (5 per minute per IP)
const newsletterRateLimit = new Map<string, { count: number; resetAt: number }>()
setInterval(() => {
  const now = Date.now()
  for (const [key, val] of newsletterRateLimit) {
    if (val.resetAt < now) newsletterRateLimit.delete(key)
  }
}, 5 * 60 * 1000)

export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
    const rateLimitKey = `newsletter-${ip}`
    const attempts = newsletterRateLimit.get(rateLimitKey) || { count: 0, resetAt: Date.now() + 60000 }

    if (attempts.resetAt < Date.now()) {
      attempts.count = 0
      attempts.resetAt = Date.now() + 60000
    }

    if (attempts.count >= 5) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 },
      )
    }

    attempts.count++
    newsletterRateLimit.set(rateLimitKey, attempts)

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
