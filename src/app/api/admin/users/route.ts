import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAuthFromRequest, hashPassword } from '@/lib/auth/admin-auth'

// GET — list all admin users
export async function GET(req: NextRequest) {
  if (!getAuthFromRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    let users
    try {
      users = await db.adminUser.findMany({
        orderBy: { createdAt: 'desc' },
        select: { id: true, username: true, displayName: true, role: true, active: true, createdAt: true },
      })
    } catch {
      // Raw fallback
      users = await db.$queryRawUnsafe(
        `SELECT id, username, displayName, role, active, createdAt FROM AdminUser ORDER BY createdAt DESC`,
      )
    }
    return NextResponse.json({ items: users })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// POST — create new admin user
export async function POST(req: NextRequest) {
  if (!getAuthFromRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const body = await req.json()
    const { username, password, displayName, role } = body

    if (!username || !password || !displayName) {
      return NextResponse.json({ error: 'نام کاربری، رمز عبور و نام نمایشی الزامی است' }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'رمز عبور حداقل ۶ کاراکتر باید باشد' }, { status: 400 })
    }

    const normalizedUsername = String(username).trim().toLowerCase()
    const passwordHash = hashPassword(String(password))

    try {
      const user = await db.adminUser.create({
        data: {
          username: normalizedUsername,
          passwordHash,
          displayName: String(displayName).slice(0, 120),
          role: String(role || 'admin').slice(0, 30),
          active: true,
        },
        select: { id: true, username: true, displayName: true, role: true, active: true },
      })
      return NextResponse.json({ ok: true, user })
    } catch {
      // Raw fallback
      const existing = await db.$queryRawUnsafe<{ id: string }[]>(
        `SELECT id FROM AdminUser WHERE username = ?`, normalizedUsername,
      )
      if (existing && existing.length > 0) {
        return NextResponse.json({ error: 'این نام کاربری قبلاً استفاده شده' }, { status: 409 })
      }
      await db.$executeRawUnsafe(
        `INSERT INTO AdminUser (id, username, passwordHash, displayName, role, active, createdAt, updatedAt) VALUES (lower(hex(randomblob(25))), ?, ?, ?, ?, 1, datetime('now'), datetime('now'))`,
        normalizedUsername, passwordHash, String(displayName).slice(0, 120), String(role || 'admin').slice(0, 30),
      )
      return NextResponse.json({ ok: true })
    }
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// DELETE — delete admin user
export async function DELETE(req: NextRequest) {
  if (!getAuthFromRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })

    // Prevent deleting yourself (need to check session)
    // Also prevent deleting the last superadmin
    try {
      const user = await db.adminUser.findUnique({ where: { id } })
      if (user?.role === 'superadmin') {
        const superCount = await db.adminUser.count({ where: { role: 'superadmin', active: true } })
        if (superCount <= 1) {
          return NextResponse.json({ error: 'نمی‌توان آخرین مدیر اصلی را حذف کرد' }, { status: 400 })
        }
      }
      await db.adminUser.delete({ where: { id } })
    } catch {
      await db.$executeRawUnsafe(`DELETE FROM AdminUser WHERE id = ?`, id)
    }
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
