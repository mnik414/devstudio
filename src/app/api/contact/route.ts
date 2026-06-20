import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Simple in-memory rate limiting (per IP, 3 requests per minute)
const contactRateLimit = new Map<string, { count: number; resetAt: number }>()

setInterval(() => {
  const now = Date.now()
  for (const [key, val] of contactRateLimit) {
    if (val.resetAt < now) contactRateLimit.delete(key)
  }
}, 5 * 60 * 1000)

export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
    const rateLimitKey = `contact-${ip}`
    const attempts = contactRateLimit.get(rateLimitKey) || { count: 0, resetAt: Date.now() + 60000 }

    if (attempts.resetAt < Date.now()) {
      attempts.count = 0
      attempts.resetAt = Date.now() + 60000
    }

    if (attempts.count >= 3) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 },
      )
    }

    attempts.count++
    contactRateLimit.set(rateLimitKey, attempts)

    const body = await req.json()
    const { fullName, company, email, phone, budget, message } = body

    if (!fullName || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    // Honeypot check (spam protection)
    if (body.website) {
      // 'website' field is hidden in the form — bots fill it, humans don't
      return NextResponse.json({ ok: true }) // pretend success, don't save
    }

    const item = await db.contactRequest.create({
      data: {
        fullName: String(fullName).slice(0, 120),
        company: company ? String(company).slice(0, 120) : null,
        email: String(email).slice(0, 160),
        phone: phone ? String(phone).slice(0, 40) : null,
        budget: budget || null,
        message: String(message).slice(0, 4000),
      },
    })

    return NextResponse.json({ ok: true, id: item.id })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
