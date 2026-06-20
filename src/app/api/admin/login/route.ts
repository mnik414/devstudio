import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminCredentials, createSession, setSessionCookie } from '@/lib/auth/admin-auth'

const loginAttempts = new Map<string, { count: number; resetAt: number }>()
setInterval(() => {
  const now = Date.now()
  for (const [key, val] of loginAttempts) {
    if (val.resetAt < now) loginAttempts.delete(key)
  }
}, 5 * 60 * 1000)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { username, password } = body

    if (!username || !password) {
      return NextResponse.json({ error: 'نام کاربری و رمز عبور الزامی است' }, { status: 400 })
    }

    // Rate limiting: 5 attempts per minute per IP
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
    const rateLimitKey = `admin-login-${ip}`
    const attempts = loginAttempts.get(rateLimitKey) || { count: 0, resetAt: Date.now() + 60000 }

    if (attempts.resetAt < Date.now()) {
      attempts.count = 0
      attempts.resetAt = Date.now() + 60000
    }

    if (attempts.count >= 5) {
      return NextResponse.json(
        { error: 'تلاش‌های زیادی. یک دقیقه بعد دوباره تلاش کنید.' },
        { status: 429 },
      )
    }

    attempts.count++
    loginAttempts.set(rateLimitKey, attempts)

    const ok = await verifyAdminCredentials(
      String(username).trim().toLowerCase(),
      String(password),
    )

    if (!ok) {
      return NextResponse.json({ error: 'نام کاربری یا رمز عبور اشتباه است' }, { status: 401 })
    }

    // Create session
    const { sessionId, cookieValue } = createSession(String(username).trim().toLowerCase(), String(username).trim().toLowerCase())
    const res = NextResponse.json({ ok: true, sessionId, username })
    setSessionCookie(res, cookieValue)
    return res
  } catch (e) {
    console.error('Admin login error:', e)
    return NextResponse.json({ error: 'خطای سرور' }, { status: 500 })
  }
}
