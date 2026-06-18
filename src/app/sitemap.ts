import type { MetadataRoute } from 'next'
import { db } from '@/lib/db'

export const revalidate = 3600 // revalidate every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = 'https://devstudio.example.com'
  const [portfolios, posts, caseStudies] = await Promise.all([
    db.portfolio.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
    db.blogPost.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
    db.caseStudy.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
  ])

  const routes: MetadataRoute.Sitemap = [
    {
      url: `${base}/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    ...portfolios.map((p) => ({
      url: `${base}/#portfolio/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    ...posts.map((p) => ({
      url: `${base}/#blog/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    ...caseStudies.map((c) => ({
      url: `${base}/#case-studies/${c.slug}`,
      lastModified: c.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ]

  return routes
}
