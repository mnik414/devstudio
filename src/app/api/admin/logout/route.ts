import { NextRequest, NextResponse } from 'next/server'
import { destroySession, clearSessionCookie } from '@/lib/auth/admin-auth'

export async function POST(req: NextRequest) {
  const cookie = req.cookies.get(getSessionCookieName())?.value
  destroySession(cookie ?? null)
  const res = NextResponse.json({ ok: true })
  clearSessionCookie(res)
  return res
}

// Re-export to avoid import issue
import { getSessionCookieName } from '@/lib/auth/admin-auth'
