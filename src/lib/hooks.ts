import { useQuery } from '@tanstack/react-query'

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Request failed: ${res.status}`)
  return res.json() as Promise<T>
}

export interface Portfolio {
  id: string
  title: string
  slug: string
  summary: string
  description: string
  coverImage: string
  gallery: string
  liveUrl: string | null
  repoUrl: string | null
  clientName: string | null
  year: number
  featured: boolean
  views: number
  problem: string | null
  solution: string | null
  result: string | null
  challenge: string | null
  architecture: string | null
  implementation: string | null
  outcome: string | null
  features: string
  createdAt: string
  category?: { id: string; name: string; slug: string } | null
  technologies?: { id: string; name: string; slug: string; color: string | null }[]
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  coverImage: string
  readingTime: number
  authorName: string
  authorAvatar: string | null
  featured: boolean
  views: number
  createdAt: string
  category?: { id: string; name: string; slug: string } | null
  tags?: { id: string; name: string; slug: string }[]
}

export interface CaseStudy {
  id: string
  title: string
  slug: string
  clientName: string
  industry: string
  coverImage: string
  summary: string
  problem: string
  analysis: string
  architecture: string
  process: string
  challenges: string
  results: string
  lessons: string
  metrics: string
  featured: boolean
  createdAt: string
}

export interface Testimonial {
  id: string
  clientName: string
  role: string
  company: string
  avatar: string | null
  rating: number
  quote: string
}

export interface TeamMember {
  id: string
  name: string
  role: string
  bio: string
  avatar: string
  linkedin: string | null
  github: string | null
  twitter: string | null
  order: number
}

export interface Service {
  id: string
  title: string
  slug: string
  description: string
  icon: string
  features: string
  order: number
}

export interface Faq {
  id: string
  question: string
  answer: string
  category: string
  order: number
}

export interface SiteData {
  testimonials: Testimonial[]
  team: TeamMember[]
  services: Service[]
  faqs: Faq[]
  settings: Record<string, string>
}

export function useSite() {
  return useQuery<SiteData>({
    queryKey: ['site'],
    queryFn: () => fetchJson('/api/site'),
  })
}

export function usePortfolios(params: Record<string, string> = {}) {
  const qs = new URLSearchParams(params).toString()
  return useQuery<{ items: Portfolio[] }>({
    queryKey: ['portfolios', params],
    queryFn: () => fetchJson(`/api/portfolio${qs ? `?${qs}` : ''}`),
  })
}

export function usePortfolio(slug: string | null) {
  return useQuery<{ item: Portfolio; related: Portfolio[] }>({
    queryKey: ['portfolio', slug],
    queryFn: () => fetchJson(`/api/portfolio/${slug}`),
    enabled: !!slug,
  })
}

export function useBlogPosts(params: Record<string, string> = {}) {
  const qs = new URLSearchParams(params).toString()
  return useQuery<{ items: BlogPost[] }>({
    queryKey: ['blog', params],
    queryFn: () => fetchJson(`/api/blog${qs ? `?${qs}` : ''}`),
  })
}

export function useBlogPost(slug: string | null) {
  return useQuery<{ item: BlogPost; related: BlogPost[] }>({
    queryKey: ['blogpost', slug],
    queryFn: () => fetchJson(`/api/blog/${slug}`),
    enabled: !!slug,
  })
}

export function useCaseStudies(featured?: boolean) {
  const qs = featured ? '?featured=true' : ''
  return useQuery<{ items: CaseStudy[] }>({
    queryKey: ['case-studies', featured],
    queryFn: () => fetchJson(`/api/case-studies${qs}`),
  })
}

export function useCaseStudy(slug: string | null) {
  return useQuery<{ item: CaseStudy }>({
    queryKey: ['case-study', slug],
    queryFn: () => fetchJson(`/api/case-studies/${slug}`),
    enabled: !!slug,
  })
}

export function usePortfolioFilters() {
  return useQuery<{ categories: { id: string; name: string; slug: string; icon: string | null }[]; technologies: { id: string; name: string; slug: string; color: string | null }[] }>({
    queryKey: ['portfolio-filters'],
    queryFn: () => fetchJson('/api/filters'),
  })
}

export function useBlogFilters() {
  return useQuery<{ categories: { id: string; name: string; slug: string; icon: string | null }[]; tags: { id: string; name: string; slug: string }[] }>({
    queryKey: ['blog-filters'],
    queryFn: () => fetchJson('/api/blog-filters'),
  })
}

export function parseList<T = string>(raw: string | null | undefined): T[] {
  if (!raw) return []
  try {
    const v = JSON.parse(raw)
    return Array.isArray(v) ? v : []
  } catch {
    return []
  }
}
