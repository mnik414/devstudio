import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  const [testimonials, team, services, faqs, settings] = await Promise.all([
    db.testimonial.findMany({ where: { published: true }, orderBy: { createdAt: 'desc' } }),
    db.teamMember.findMany({ where: { published: true }, orderBy: { order: 'asc' } }),
    db.service.findMany({ where: { published: true }, orderBy: { order: 'asc' } }),
    db.faq.findMany({ where: { published: true }, orderBy: { order: 'asc' } }),
    db.setting.findMany(),
  ])
  const settingsMap = settings.reduce<Record<string, string>>((acc, s) => {
    acc[s.key] = s.value
    return acc
  }, {})
  return NextResponse.json({ testimonials, team, services, faqs, settings: settingsMap })
}
