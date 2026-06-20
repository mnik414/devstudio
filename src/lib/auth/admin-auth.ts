import { scryptSync, randomBytes, timingSafeEqual } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

const SESSION_COOKIE = 'devstudio-admin-session'
const SESSION_MAX_AGE = 24 * 60 * 60 * 1000 // 24 hours

// Session store (in-memory, clears on restart)
const sessions = new Map<string, { userId: string; username: string; expires: number }>()

setInterval(() => {
  const now = Date.now()
  for (const [id, session] of sessions) {
    if (session.expires < now) sessions.delete(id)
  }
}, 60 * 60 * 1000)

function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(':')
  if (!salt || !hash) return false
  const hashBuf = Buffer.from(hash, 'hex')
  const testBuf = scryptSync(password, salt, 64)
  if (hashBuf.length !== testBuf.length) return false
  return timingSafeEqual(hashBuf, testBuf)
}

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex')
  const hash = scryptSync(password, salt, 64).toString('hex')
  return `${salt}:${hash}`
}

async function findAdminUser(username: string) {
  try {
    return await db.adminUser.findUnique({ where: { username } })
  } catch {
    // Fallback: raw query if Prisma client is stale
    const rows = await db.$queryRawUnsafe<
      { id: string; username: string; passwordHash: string; displayName: string; role: string; active: number }[]
    >(`SELECT * FROM AdminUser WHERE username = ? AND active = 1 LIMIT 1`, username)
    if (!rows || rows.length === 0) return null
    const r = rows[0]
    return {
      id: r.id,
      username: r.username,
      passwordHash: r.passwordHash,
      displayName: r.displayName,
      role: r.role,
      active: Boolean(r.active),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  }
}

export async function verifyAdminCredentials(username: string, password: string): Promise<boolean> {
  const user = await findAdminUser(username)
  if (!user || !user.active) return false
  return verifyPassword(password, user.passwordHash)
}

export function createSession(userId: string, username: string): { sessionId: string; cookieValue: string } {
  const sessionId = randomBytes(32).toString('hex')
  const expires = Date.now() + SESSION_MAX_AGE
  sessions.set(sessionId, { userId, username, expires })
  return { sessionId, cookieValue: `${sessionId}.${expires}` }
}

export function verifySession(cookieValue: string | null): { userId: string; username: string } | null {
  if (!cookieValue) return null
  const [sessionId, expiresStr] = cookieValue.split('.')
  if (!sessionId || !expiresStr) return null
  const expires = parseInt(expiresStr, 10)
  if (isNaN(expires) || expires < Date.now()) {
    sessions.delete(sessionId)
    return null
  }
  const session = sessions.get(sessionId)
  if (!session || session.expires < Date.now()) {
    sessions.delete(sessionId)
    return null
  }
  return { userId: session.userId, username: session.username }
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
  const cookie = req.cookies.get(SESSION_COOKIE)?.value
  return verifySession(cookie ?? null) !== null
}

export function getCurrentUser(req: NextRequest): { userId: string; username: string } | null {
  const cookie = req.cookies.get(SESSION_COOKIE)?.value
  return verifySession(cookie ?? null)
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
