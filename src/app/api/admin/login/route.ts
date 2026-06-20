import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminPassword, createSession, setSessionCookie, getSessionCookieName, verifySession } from '@/lib/auth/admin-auth'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { password } = body

    if (!password || typeof password !== 'string') {
      return NextResponse.json({ error: 'Password is required' }, { status: 400 })
    }

    // Rate limiting: max 5 attempts per minute per IP
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
    const rateLimitKey = `admin-login-${ip}`
    const attempts = loginAttempts.get(rateLimitKey) || { count: 0, resetAt: Date.now() + 60000 }

    if (attempts.resetAt < Date.now()) {
      attempts.count = 0
      attempts.resetAt = Date.now() + 60000
    }

    if (attempts.count >= 5) {
      return NextResponse.json(
        { error: 'Too many attempts. Please try again in a minute.' },
        { status: 429 },
      )
    }

    attempts.count++
    loginAttempts.set(rateLimitKey, attempts)

    if (!verifyAdminPassword(password)) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
    }

    // Create session
    const { sessionId, cookieValue } = createSession()
    const res = NextResponse.json({ ok: true, sessionId })
    setSessionCookie(res, cookieValue)
    return res
  } catch (e) {
    console.error('Admin login error:', e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// Simple in-memory rate limiting
const loginAttempts = new Map<string, { count: number; resetAt: number }>()

// Clean up rate limit entries periodically
setInterval(() => {
  const now = Date.now()
  for (const [key, val] of loginAttempts) {
    if (val.resetAt < now) loginAttempts.delete(key)
  }
}, 5 * 60 * 1000)
