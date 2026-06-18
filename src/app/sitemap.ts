import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  const base = 'https://devstudio.example.com'
  const [portfolios, posts, caseStudies] = await Promise.all([
    db.portfolio.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
    db.blogPost.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
    db.caseStudy.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
  ])

  const urls = [
    `<url><loc>${base}/</loc><priority>1.0</priority></url>`,
    ...portfolios.map(
      (p) => `<url><loc>${base}/#portfolio/${p.slug}</loc><lastmod>${p.updatedAt.toISOString()}</lastmod><priority>0.8</priority></url>`,
    ),
    ...posts.map(
      (p) => `<url><loc>${base}/#blog/${p.slug}</loc><lastmod>${p.updatedAt.toISOString()}</lastmod><priority>0.7</priority></url>`,
    ),
    ...caseStudies.map(
      (c) => `<url><loc>${base}/#case-studies/${c.slug}</loc><lastmod>${c.updatedAt.toISOString()}</lastmod><priority>0.7</priority></url>`,
    ),
  ]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>`
  return new NextResponse(xml, {
    headers: { 'Content-Type': 'application/xml' },
  })
}
