import { scryptSync, randomBytes, timingSafeEqual } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'

// Production admin auth using scrypt password hashing + httpOnly cookie session

const SESSION_COOKIE = 'devstudio-admin-session'
const SESSION_MAX_AGE = 24 * 60 * 60 * 1000 // 24 hours

// Admin credentials from environment variables (production)
// In production, set ADMIN_PASSWORD_HASH (scrypt hash) in .env
// For initial setup, use: node -e "const {scryptSync,randomBytes}=require('crypto');const salt=randomBytes(16).toString('hex');const hash=scryptSync(process.argv[1],salt,64).toString('hex');console.log(salt+':'+hash)" "yourpassword"
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || ''
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin'

// Fallback for development only (NOT for production)
const DEV_PASSWORD = 'devstudio-admin'

// Session store (in-memory, clears on restart — fine for single-instance admin)
const sessions = new Map<string, { expires: number }>()

// Clean expired sessions periodically
setInterval(() => {
  const now = Date.now()
  for (const [id, session] of sessions) {
    if (session.expires < now) sessions.delete(id)
  }
}, 60 * 60 * 1000) // every hour

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex')
  const hash = scryptSync(password, salt, 64).toString('hex')
  return `${salt}:${hash}`
}

function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(':')
  if (!salt || !hash) return false
  const hashBuf = Buffer.from(hash, 'hex')
  const testBuf = scryptSync(password, salt, 64)
  if (hashBuf.length !== testBuf.length) return false
  return timingSafeEqual(hashBuf, testBuf)
}

export function verifyAdminPassword(password: string): boolean {
  // Production: verify against env hash
  if (ADMIN_PASSWORD_HASH) {
    return verifyPassword(password, ADMIN_PASSWORD_HASH)
  }
  // Development fallback
  if (process.env.NODE_ENV !== 'production') {
    return password === DEV_PASSWORD
  }
  return false
}

export function createSession(): { sessionId: string; cookieValue: string } {
  const sessionId = randomBytes(32).toString('hex')
  const expires = Date.now() + SESSION_MAX_AGE
  sessions.set(sessionId, { expires })
  return { sessionId, cookieValue: `${sessionId}.${expires}` }
}

export function verifySession(cookieValue: string | null): boolean {
  if (!cookieValue) return false
  const [sessionId, expiresStr] = cookieValue.split('.')
  if (!sessionId || !expiresStr) return false
  const expires = parseInt(expiresStr, 10)
  if (isNaN(expires) || expires < Date.now()) {
    sessions.delete(sessionId)
    return false
  }
  const session = sessions.get(sessionId)
  if (!session || session.expires < Date.now()) {
    sessions.delete(sessionId)
    return false
  }
  return true
}

export function destroySession(cookieValue: string | null): void {
  if (!cookieValue) return
  const [sessionId] = cookieValue.split('.')
  if (sessionId) sessions.delete(sessionId)
}

export function getSessionCookieName(): string {
  return SESSION_COOKIE
}

export function getAuthFromRequest(req: NextRequest): boolean {
  // Check httpOnly cookie first (production)
  const cookie = req.cookies.get(SESSION_COOKIE)?.value
  if (verifySession(cookie ?? null)) return true

  // Fallback to X-Admin-Token header for backwards compatibility
  // (only works if ADMIN_PASSWORD_HASH is not set — dev mode)
  if (!ADMIN_PASSWORD_HASH && process.env.NODE_ENV !== 'production') {
    const token = req.headers.get('x-admin-token')
    if (token === DEV_PASSWORD) return true
  }

  return false
}

export function setSessionCookie(res: NextResponse, cookieValue: string): void {
  res.cookies.set(SESSION_COOKIE, cookieValue, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: SESSION_MAX_AGE / 1000,
  })
}

export function clearSessionCookie(res: NextResponse): void {
  res.cookies.delete(SESSION_COOKIE)
}

/**
 * Generate a password hash for setup.
 * Usage: node -e "const {scryptSync,randomBytes}=require('crypto');const s=randomBytes(16).toString('hex');const h=scryptSync('yourpassword',s,64).toString('hex');console.log(s+':'+h)"
 */
export { hashPassword }
