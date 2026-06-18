import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { fullName, company, email, phone, budget, message } = body

    if (!fullName || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
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
