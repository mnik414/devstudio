import { NextRequest, NextResponse } from 'next/server'
import { verifySession, getSessionCookieName } from '@/lib/auth/admin-auth'

export async function GET(req: NextRequest) {
  const cookie = req.cookies.get(getSessionCookieName())?.value
  if (verifySession(cookie ?? null)) {
    return NextResponse.json({ authenticated: true })
  }

  // Dev fallback
  if (process.env.NODE_ENV !== 'production') {
    const token = req.headers.get('x-admin-token')
    if (token === 'devstudio-admin') {
      return NextResponse.json({ authenticated: true })
    }
  }

  return NextResponse.json({ authenticated: false }, { status: 401 })
}
