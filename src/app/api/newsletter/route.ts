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

    // Upsert — if already subscribed, just reactivate
    const existing = await db.newsletter.findUnique({ where: { email } })
    if (existing) {
      if (!existing.active) {
        await db.newsletter.update({ where: { id: existing.id }, data: { active: true, source } })
      }
      return NextResponse.json({ ok: true, alreadySubscribed: true })
    }

    await db.newsletter.create({
      data: {
        email: email.toLowerCase().slice(0, 160),
        source: String(source).slice(0, 40),
      },
    })

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
