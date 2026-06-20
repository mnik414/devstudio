'use client'

import * as React from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useNav } from '@/lib/store'
import {
  LayoutDashboard,
  LogOut,
  ArrowLeft,
  ArrowRight,
  Plus,
  Pencil,
  Trash2,
  Eye,
  Lock,
  ShieldCheck,
  Search,
  User,
  UserPlus,
  FolderKanban,
  Tags,
  Cpu,
  Newspaper,
  BookOpen,
  Bookmark,
  FlaskConical,
  Quote,
  Users,
  Sparkles,
  HelpCircle,
  Inbox,
  Mail,
  Megaphone,
  TrendingUp,
  Settings as SettingsIcon,
  Loader2,
  KeyRound,
  RefreshCw,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { useT } from '@/lib/lang-store'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { ImageUpload } from '@/components/admin/image-upload'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ModelKey =
  | 'portfolio'
  | 'portfolioCategory'
  | 'technology'
  | 'blogPost'
  | 'blogCategory'
  | 'tag'
  | 'caseStudy'
  | 'testimonial'
  | 'teamMember'
  | 'service'
  | 'faq'
  | 'lead'
  | 'contactRequest'
  | 'setting'
  | 'newsletter'

type ActiveView = ModelKey | 'dashboard'

type FieldType = 'text' | 'textarea' | 'number' | 'switch' | 'json' | 'select' | 'image'

interface FieldConfig {
  key: string
  label: string
  type: FieldType
  placeholder?: string
  options?: { label: string; value: string }[]
  required?: boolean
  default?: unknown
}

interface ModelConfig {
  label: string
  singular: string
  icon: React.ComponentType<{ className?: string }>
  description: string
  listColumns: { key: string; label: string; truncate?: number }[]
  formFields: FieldConfig[]
  readOnly?: boolean
}

type RecordData = Record<string, unknown> & { id?: string; createdAt?: string }

// ---------------------------------------------------------------------------
// Model configurations
// ---------------------------------------------------------------------------

const MODEL_CONFIGS: Record<ModelKey, ModelConfig> = {
  portfolio: {
    label: 'Portfolios',
    singular: 'Portfolio',
    icon: FolderKanban,
    description: 'Showcase projects with full case-study metadata.',
    listColumns: [
      { key: 'title', label: 'Title' },
      { key: 'year', label: 'Year' },
      { key: 'featured', label: 'Featured' },
      { key: 'published', label: 'Published' },
    ],
    formFields: [
      { key: 'title', label: 'Title', type: 'text', required: true },
      { key: 'slug', label: 'Slug', type: 'text', required: true },
      { key: 'summary', label: 'Summary', type: 'textarea' },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'coverImage', label: 'Cover Image', type: 'image' },
      { key: 'gallery', label: 'Gallery (JSON array)', type: 'json', placeholder: '["/img/1.jpg", "/img/2.jpg"]' },
      { key: 'liveUrl', label: 'Live URL', type: 'text' },
      { key: 'repoUrl', label: 'Repo URL', type: 'text' },
      { key: 'clientName', label: 'Client Name', type: 'text' },
      { key: 'year', label: 'Year', type: 'number', default: new Date().getFullYear() },
      { key: 'featured', label: 'Featured', type: 'switch', default: false },
      { key: 'published', label: 'Published', type: 'switch', default: true },
      { key: 'problem', label: 'Problem', type: 'textarea' },
      { key: 'solution', label: 'Solution', type: 'textarea' },
      { key: 'result', label: 'Result', type: 'textarea' },
      { key: 'challenge', label: 'Challenge', type: 'textarea' },
      { key: 'architecture', label: 'Architecture', type: 'textarea' },
      { key: 'implementation', label: 'Implementation', type: 'textarea' },
      { key: 'outcome', label: 'Outcome', type: 'textarea' },
      { key: 'features', label: 'Features (JSON array)', type: 'json', placeholder: '["Fast","Secure"]' },
    ],
  },
  portfolioCategory: {
    label: 'Portfolio Categories',
    singular: 'Portfolio Category',
    icon: Bookmark,
    description: 'Group portfolios by category.',
    listColumns: [
      { key: 'name', label: 'Name' },
      { key: 'slug', label: 'Slug' },
    ],
    formFields: [
      { key: 'name', label: 'Name', type: 'text', required: true },
      { key: 'slug', label: 'Slug', type: 'text', required: true },
      { key: 'icon', label: 'Icon (lucide name)', type: 'text' },
    ],
  },
  technology: {
    label: 'Technologies',
    singular: 'Technology',
    icon: Cpu,
    description: 'Tech stack used across portfolios.',
    listColumns: [
      { key: 'name', label: 'Name' },
      { key: 'color', label: 'Color' },
    ],
    formFields: [
      { key: 'name', label: 'Name', type: 'text', required: true },
      { key: 'slug', label: 'Slug', type: 'text', required: true },
      { key: 'icon', label: 'Icon (lucide name)', type: 'text' },
      { key: 'color', label: 'Color (hex)', type: 'text', placeholder: '#14B8A6' },
    ],
  },
  blogPost: {
    label: 'Blog Posts',
    singular: 'Blog Post',
    icon: Newspaper,
    description: 'Long-form articles with markdown content.',
    listColumns: [
      { key: 'title', label: 'Title' },
      { key: 'authorName', label: 'Author' },
      { key: 'published', label: 'Published' },
      { key: 'featured', label: 'Featured' },
    ],
    formFields: [
      { key: 'title', label: 'Title', type: 'text', required: true },
      { key: 'slug', label: 'Slug', type: 'text', required: true },
      { key: 'excerpt', label: 'Excerpt', type: 'textarea' },
      { key: 'content', label: 'Content (Markdown)', type: 'textarea' },
      { key: 'coverImage', label: 'Cover Image', type: 'image' },
      { key: 'readingTime', label: 'Reading Time (min)', type: 'number', default: 5 },
      { key: 'authorName', label: 'Author Name', type: 'text', default: 'Editorial Team' },
      { key: 'authorAvatar', label: 'Author Avatar', type: 'image' },
      { key: 'published', label: 'Published', type: 'switch', default: true },
      { key: 'featured', label: 'Featured', type: 'switch', default: false },
    ],
  },
  blogCategory: {
    label: 'Blog Categories',
    singular: 'Blog Category',
    icon: Bookmark,
    description: 'Categories for blog posts.',
    listColumns: [
      { key: 'name', label: 'Name' },
      { key: 'slug', label: 'Slug' },
    ],
    formFields: [
      { key: 'name', label: 'Name', type: 'text', required: true },
      { key: 'slug', label: 'Slug', type: 'text', required: true },
      { key: 'icon', label: 'Icon (lucide name)', type: 'text' },
    ],
  },
  tag: {
    label: 'Tags',
    singular: 'Tag',
    icon: Tags,
    description: 'Tags for blog posts.',
    listColumns: [
      { key: 'name', label: 'Name' },
      { key: 'slug', label: 'Slug' },
    ],
    formFields: [
      { key: 'name', label: 'Name', type: 'text', required: true },
      { key: 'slug', label: 'Slug', type: 'text', required: true },
    ],
  },
  caseStudy: {
    label: 'Case Studies',
    singular: 'Case Study',
    icon: FlaskConical,
    description: 'In-depth project case studies.',
    listColumns: [
      { key: 'title', label: 'Title' },
      { key: 'clientName', label: 'Client' },
      { key: 'industry', label: 'Industry' },
      { key: 'featured', label: 'Featured' },
    ],
    formFields: [
      { key: 'title', label: 'Title', type: 'text', required: true },
      { key: 'slug', label: 'Slug', type: 'text', required: true },
      { key: 'clientName', label: 'Client Name', type: 'text', required: true },
      { key: 'industry', label: 'Industry', type: 'text' },
      { key: 'coverImage', label: 'Cover Image', type: 'image' },
      { key: 'summary', label: 'Summary', type: 'textarea' },
      { key: 'problem', label: 'Problem', type: 'textarea' },
      { key: 'analysis', label: 'Analysis', type: 'textarea' },
      { key: 'architecture', label: 'Architecture', type: 'textarea' },
      { key: 'process', label: 'Process', type: 'textarea' },
      { key: 'challenges', label: 'Challenges', type: 'textarea' },
      { key: 'results', label: 'Results', type: 'textarea' },
      { key: 'lessons', label: 'Lessons', type: 'textarea' },
      { key: 'metrics', label: 'Metrics (JSON array)', type: 'json', placeholder: '[{"label":"Uptime","value":"99.9%"}]' },
      { key: 'published', label: 'Published', type: 'switch', default: true },
      { key: 'featured', label: 'Featured', type: 'switch', default: false },
    ],
  },
  testimonial: {
    label: 'Testimonials',
    singular: 'Testimonial',
    icon: Quote,
    description: 'Client testimonials and reviews.',
    listColumns: [
      { key: 'clientName', label: 'Client' },
      { key: 'company', label: 'Company' },
      { key: 'rating', label: 'Rating' },
      { key: 'published', label: 'Published' },
    ],
    formFields: [
      { key: 'clientName', label: 'Client Name', type: 'text', required: true },
      { key: 'role', label: 'Role', type: 'text' },
      { key: 'company', label: 'Company', type: 'text' },
      { key: 'avatar', label: 'Avatar', type: 'image' },
      { key: 'rating', label: 'Rating (1-5)', type: 'number', default: 5 },
      { key: 'quote', label: 'Quote', type: 'textarea' },
      { key: 'published', label: 'Published', type: 'switch', default: true },
    ],
  },
  teamMember: {
    label: 'Team Members',
    singular: 'Team Member',
    icon: Users,
    description: 'Team member profiles.',
    listColumns: [
      { key: 'name', label: 'Name' },
      { key: 'role', label: 'Role' },
      { key: 'order', label: 'Order' },
      { key: 'published', label: 'Published' },
    ],
    formFields: [
      { key: 'name', label: 'Name', type: 'text', required: true },
      { key: 'role', label: 'Role', type: 'text' },
      { key: 'bio', label: 'Bio', type: 'textarea' },
      { key: 'avatar', label: 'Avatar', type: 'image' },
      { key: 'linkedin', label: 'LinkedIn URL', type: 'text' },
      { key: 'github', label: 'GitHub URL', type: 'text' },
      { key: 'twitter', label: 'Twitter URL', type: 'text' },
      { key: 'order', label: 'Display Order', type: 'number', default: 0 },
      { key: 'published', label: 'Published', type: 'switch', default: true },
    ],
  },
  service: {
    label: 'Services',
    singular: 'Service',
    icon: Sparkles,
    description: 'Service offerings.',
    listColumns: [
      { key: 'title', label: 'Title' },
      { key: 'icon', label: 'Icon' },
      { key: 'order', label: 'Order' },
      { key: 'published', label: 'Published' },
    ],
    formFields: [
      { key: 'title', label: 'Title', type: 'text', required: true },
      { key: 'slug', label: 'Slug', type: 'text', required: true },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'icon', label: 'Icon (lucide name)', type: 'text' },
      { key: 'features', label: 'Features (JSON array)', type: 'json', placeholder: '["Fast","Secure"]' },
      { key: 'order', label: 'Display Order', type: 'number', default: 0 },
      { key: 'published', label: 'Published', type: 'switch', default: true },
    ],
  },
  faq: {
    label: 'FAQs',
    singular: 'FAQ',
    icon: HelpCircle,
    description: 'Frequently asked questions.',
    listColumns: [
      { key: 'question', label: 'Question', truncate: 60 },
      { key: 'category', label: 'Category' },
      { key: 'order', label: 'Order' },
      { key: 'published', label: 'Published' },
    ],
    formFields: [
      { key: 'question', label: 'Question', type: 'text', required: true },
      { key: 'answer', label: 'Answer', type: 'textarea' },
      { key: 'category', label: 'Category', type: 'text', default: 'General' },
      { key: 'order', label: 'Display Order', type: 'number', default: 0 },
      { key: 'published', label: 'Published', type: 'switch', default: true },
    ],
  },
  lead: {
    label: 'Leads',
    singular: 'Lead',
    icon: Inbox,
    description: 'Inbound estimate requests (read-only).',
    readOnly: true,
    listColumns: [
      { key: 'name', label: 'Name' },
      { key: 'email', label: 'Email' },
      { key: 'projectType', label: 'Project Type' },
      { key: 'budget', label: 'Budget' },
      { key: 'status', label: 'Status' },
    ],
    formFields: [
      { key: 'status', label: 'Status', type: 'select', options: [
        { label: 'New', value: 'new' },
        { label: 'Contacted', value: 'contacted' },
        { label: 'Qualified', value: 'qualified' },
        { label: 'Lost', value: 'lost' },
        { label: 'Won', value: 'won' },
      ], default: 'new' },
    ],
  },
  contactRequest: {
    label: 'Contact Requests',
    singular: 'Contact Request',
    icon: Mail,
    description: 'Inbound contact form submissions (read-only).',
    readOnly: true,
    listColumns: [
      { key: 'fullName', label: 'Name' },
      { key: 'email', label: 'Email' },
      { key: 'budget', label: 'Budget' },
      { key: 'status', label: 'Status' },
    ],
    formFields: [
      { key: 'status', label: 'Status', type: 'select', options: [
        { label: 'New', value: 'new' },
        { label: 'Read', value: 'read' },
        { label: 'Replied', value: 'replied' },
        { label: 'Archived', value: 'archived' },
      ], default: 'new' },
    ],
  },
  setting: {
    label: 'Settings',
    singular: 'Setting',
    icon: SettingsIcon,
    description: 'Global key/value site settings.',
    listColumns: [
      { key: 'key', label: 'Key' },
      { key: 'value', label: 'Value', truncate: 80 },
    ],
    formFields: [
      { key: 'key', label: 'Key', type: 'text', required: true },
      { key: 'value', label: 'Value', type: 'textarea' },
    ],
  },
  newsletter: {
    label: 'Newsletter',
    singular: 'Subscriber',
    icon: Mail,
    description: 'Newsletter email subscribers.',
    listColumns: [
      { key: 'email', label: 'Email' },
      { key: 'source', label: 'Source' },
      { key: 'active', label: 'Active', boolean: true },
    ],
    formFields: [
      { key: 'email', label: 'Email', type: 'text', required: true },
      { key: 'source', label: 'Source', type: 'text' },
      { key: 'active', label: 'Active', type: 'switch' },
    ],
  },
}

const MODEL_ORDER: ModelKey[] = [
  'portfolio',
  'portfolioCategory',
  'technology',
  'blogPost',
  'blogCategory',
  'tag',
  'caseStudy',
  'testimonial',
  'teamMember',
  'service',
  'faq',
  'lead',
  'contactRequest',
  'setting',
  'newsletter',
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

type TFunc = (key: string, vars?: Record<string, string | number>) => string

function resourceLabel(t: TFunc, model: ModelKey): string {
  return t(`admin.r.${model}`)
}

function truncateId(id?: string) {
  if (!id) return '—'
  return id.length > 10 ? `${id.slice(0, 8)}…` : id
}

function formatDate(value?: string) {
  if (!value) return '—'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleString('fa-IR', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function buildInitialForm(model: ModelKey): Record<string, unknown> {
  const config = MODEL_CONFIGS[model]
  const form: Record<string, unknown> = {}
  for (const f of config.formFields) {
    if (f.type === 'switch') form[f.key] = f.default ?? false
    else if (f.type === 'number') form[f.key] = f.default ?? 0
    else if (f.type === 'json') form[f.key] = ''
    else if (f.type === 'select') form[f.key] = f.default ?? f.options?.[0]?.value ?? ''
    else form[f.key] = f.default ?? ''
  }
  return form
}

function hydrateFormFromRecord(model: ModelKey, record: RecordData): Record<string, unknown> {
  const config = MODEL_CONFIGS[model]
  const form: Record<string, unknown> = {}
  for (const f of config.formFields) {
    const raw = record[f.key]
    if (f.type === 'switch') form[f.key] = Boolean(raw)
    else if (f.type === 'number') form[f.key] = raw === undefined || raw === null ? (f.default ?? 0) : Number(raw)
    else if (f.type === 'json') {
      if (typeof raw === 'string' && raw.length > 0) {
        form[f.key] = raw
      } else if (Array.isArray(raw) || (typeof raw === 'object' && raw !== null)) {
        form[f.key] = JSON.stringify(raw, null, 2)
      } else {
        form[f.key] = ''
      }
    } else if (f.type === 'select') {
      form[f.key] = typeof raw === 'string' ? raw : (f.default ?? '')
    } else {
      form[f.key] = typeof raw === 'string' ? raw : raw === null || raw === undefined ? '' : String(raw)
    }
  }
  return form
}

function serializeForm(model: ModelKey, form: Record<string, unknown>): Record<string, unknown> {
  const config = MODEL_CONFIGS[model]
  const out: Record<string, unknown> = {}
  for (const f of config.formFields) {
    const val = form[f.key]
    if (f.type === 'switch') out[f.key] = Boolean(val)
    else if (f.type === 'number') {
      const n = Number(val)
      out[f.key] = Number.isNaN(n) ? 0 : n
    } else if (f.type === 'json') {
      const s = (val as string) ?? ''
      const trimmed = s.trim()
      if (trimmed === '') {
        out[f.key] = '[]'
      } else {
        try {
          out[f.key] = JSON.stringify(JSON.parse(trimmed))
        } catch {
          throw new Error(`Field "${f.label}" must be valid JSON.`)
        }
      }
    } else if (f.type === 'textarea' || f.type === 'text' || f.type === 'select') {
      out[f.key] = (val as string) ?? ''
    } else {
      out[f.key] = val
    }
  }
  return out
}

// ---------------------------------------------------------------------------
// API helpers
// ---------------------------------------------------------------------------

function useAdminFetch(model: ModelKey, t: TFunc) {
  return useQuery({
    queryKey: ['admin', model],
    queryFn: async () => {
      const res = await fetch(`/api/admin?model=${encodeURIComponent(model)}`, {
        credentials: 'include',
      })
      if (res.status === 401) throw new Error(t('admin.unauthorized'))
      if (!res.ok) throw new Error(`${resourceLabel(t, model)} (${res.status})`)
      const json = await res.json()
      return (json.items ?? []) as RecordData[]
    },
    staleTime: 30_000,
  })
}

function useAdminMutations(model: ModelKey, t: TFunc) {
  const qc = useQueryClient()
  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ['admin', model] })
  }

  const create = useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ model, data }),
      })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        throw new Error(j.error || `${t('admin.create')} (${res.status})`)
      }
      return res.json()
    },
    onSuccess: () => {
      invalidate()
      toast.success(t('admin.createdSuccess'))
    },
    onError: (e: Error) => toast.error(e.message),
  })

  const update = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Record<string, unknown> }) => {
      const res = await fetch('/api/admin', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ model, id, data }),
      })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        throw new Error(j.error || `${t('admin.saveChanges')} (${res.status})`)
      }
      return res.json()
    },
    onSuccess: () => {
      invalidate()
      toast.success(t('admin.updatedSuccess'))
    },
    onError: (e: Error) => toast.error(e.message),
  })

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin?model=${encodeURIComponent(model)}&id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        throw new Error(j.error || `${t('admin.delete')} (${res.status})`)
      }
      return res.json()
    },
    onSuccess: () => {
      invalidate()
      toast.success(t('admin.deletedSuccess'))
    },
    onError: (e: Error) => toast.error(e.message),
  })

  return { create, update, remove, invalidate }
}

// ---------------------------------------------------------------------------
// Login gate
// ---------------------------------------------------------------------------

function LoginCard({ onLogin }: { onLogin: () => void }) {
  const t = useT()
  const [username, setUsername] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [loading, setLoading] = React.useState(false)

  const submit = async () => {
    if (!username.trim() || !password.trim()) {
      toast.error('نام کاربری و رمز عبور را وارد کنید')
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password: password.trim() }),
      })
      const data = await res.json()
      if (res.status === 401) {
        toast.error(data.error || 'نام کاربری یا رمز عبور اشتباه است')
        return
      }
      if (res.status === 429) {
        toast.error(data.error || 'تلاش‌های زیادی')
        return
      }
      if (!res.ok) {
        toast.error(data.error || 'ورود ناموفق')
        return
      }
      toast.success(t('admin.authSuccess'))
      onLogin()
    } catch (e) {
      toast.error((e as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div dir="rtl" className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md border-border/60 shadow-lg">
        <CardHeader className="space-y-2 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <ShieldCheck className="size-6" />
          </div>
          <CardTitle className="text-2xl">{t('admin.panel')}</CardTitle>
          <CardDescription>{t('admin.loginDesc')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="admin-username" className="flex items-center gap-1.5">
              <User className="size-3.5 text-muted-foreground" />
              نام کاربری
            </Label>
            <Input
              id="admin-username"
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') submit()
              }}
              placeholder="admin"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="admin-password" className="flex items-center gap-1.5">
              <KeyRound className="size-3.5 text-muted-foreground" />
              رمز عبور
            </Label>
            <Input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') submit()
              }}
              placeholder="••••••••"
            />
            <p className="text-xs text-muted-foreground">
              نام کاربری پیش‌فرض: <code className="rounded bg-muted px-1 py-0.5 font-mono">admin</code>
              {' '}— رمز عبور: <code className="rounded bg-muted px-1 py-0.5 font-mono">admin123</code>
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button onClick={submit} disabled={loading} className="w-full">
            {loading ? <Loader2 className="size-4 animate-spin" /> : <Lock className="size-4" />}
            {loading ? t('admin.verifying') : t('admin.loginBtn')}
          </Button>
          <Button
            variant="ghost"
            className="w-full"
            onClick={() => useNav.getState().setView('home')}
          >
            <ArrowRight className="size-4" />
            {t('admin.backToSite')}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Dynamic form
// ---------------------------------------------------------------------------

function DynamicForm({
  model,
  values,
  onChange,
}: {
  model: ModelKey
  values: Record<string, unknown>
  onChange: (k: string, v: unknown) => void
}) {
  const config = MODEL_CONFIGS[model]
  return (
    <div className="grid max-h-[60vh] gap-4 overflow-y-auto pr-1">
      {config.formFields.map((f) => {
        const val = values[f.key]
        if (f.type === 'image') {
          return (
            <div key={f.key} className="space-y-1.5">
              <Label className="text-sm font-medium">
                {f.label}
                {f.required && <span className="ml-1 text-destructive">*</span>}
              </Label>
              <ImageUpload
                value={typeof val === 'string' ? val : ''}
                onChange={(url) => onChange(f.key, url)}
                placeholder={f.placeholder}
              />
            </div>
          )
        }
        if (f.type === 'switch') {
          return (
            <div key={f.key} className="flex items-center justify-between rounded-lg border border-border/60 p-3">
              <div className="space-y-0.5">
                <Label htmlFor={f.key} className="text-sm font-medium">{f.label}</Label>
                <p className="text-xs text-muted-foreground">Toggle on/off</p>
              </div>
              <Switch id={f.key} checked={Boolean(val)} onCheckedChange={(c) => onChange(f.key, c)} />
            </div>
          )
        }
        if (f.type === 'textarea' || f.type === 'json') {
          return (
            <div key={f.key} className="space-y-1.5">
              <Label htmlFor={f.key} className="text-sm font-medium">
                {f.label}
                {f.required && <span className="ml-1 text-destructive">*</span>}
                {f.type === 'json' && <span className="ml-2 text-xs text-muted-foreground">(JSON)</span>}
              </Label>
              <Textarea
                id={f.key}
                value={typeof val === 'string' ? val : ''}
                onChange={(e) => onChange(f.key, e.target.value)}
                placeholder={f.placeholder}
                rows={f.type === 'json' ? 5 : 3}
                className="resize-y font-mono text-xs"
              />
            </div>
          )
        }
        if (f.type === 'number') {
          return (
            <div key={f.key} className="space-y-1.5">
              <Label htmlFor={f.key} className="text-sm font-medium">
                {f.label}
                {f.required && <span className="ml-1 text-destructive">*</span>}
              </Label>
              <Input
                id={f.key}
                type="number"
                value={val === undefined || val === null ? '' : String(val)}
                onChange={(e) => onChange(f.key, e.target.value === '' ? '' : Number(e.target.value))}
                placeholder={f.placeholder}
              />
            </div>
          )
        }
        if (f.type === 'select') {
          return (
            <div key={f.key} className="space-y-1.5">
              <Label htmlFor={f.key} className="text-sm font-medium">{f.label}</Label>
              <select
                id={f.key}
                value={typeof val === 'string' ? val : ''}
                onChange={(e) => onChange(f.key, e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
              >
                {f.options?.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          )
        }
        return (
          <div key={f.key} className="space-y-1.5">
            <Label htmlFor={f.key} className="text-sm font-medium">
              {f.label}
              {f.required && <span className="ml-1 text-destructive">*</span>}
            </Label>
            <Input
              id={f.key}
              value={typeof val === 'string' ? val : ''}
              onChange={(e) => onChange(f.key, e.target.value)}
              placeholder={f.placeholder}
            />
          </div>
        )
      })}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Record table
// ---------------------------------------------------------------------------

function renderCell(value: unknown, truncate?: number) {
  if (value === undefined || value === null || value === '') return <span className="text-muted-foreground">—</span>
  if (typeof value === 'boolean') {
    return value ? (
      <Badge variant="default" className="bg-primary/15 text-primary">Yes</Badge>
    ) : (
      <Badge variant="outline" className="text-muted-foreground">No</Badge>
    )
  }
  let str: string
  if (typeof value === 'object') {
    str = JSON.stringify(value)
  } else {
    str = String(value)
  }
  if (truncate && str.length > truncate) {
    return <span title={str} className="text-muted-foreground">{str.slice(0, truncate)}…</span>
  }
  return <span className="text-foreground">{str}</span>
}

function RecordTable({
  model,
  token,
  onEdit,
  onView,
  onDeleteRequest,
}: {
  model: ModelKey
  token: string
  onEdit: (record: RecordData) => void
  onView: (record: RecordData) => void
  onDeleteRequest: (record: RecordData) => void
}) {
  const t = useT()
  const { data, isLoading, isError, error, refetch, isFetching } = useAdminFetch(model, t)
  const config = MODEL_CONFIGS[model]
  const [query, setQuery] = React.useState('')

  const filtered = React.useMemo(() => {
    if (!data) return []
    if (!query.trim()) return data
    const q = query.toLowerCase()
    return data.filter((row) =>
      config.listColumns.some((c) => {
        const v = row[c.key]
        return v !== undefined && v !== null && String(v).toLowerCase().includes(q)
      }),
    )
  }, [data, query, config.listColumns])

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <config.icon className="size-5 text-primary" />
          <div>
            <h2 className="text-lg font-semibold text-foreground">{resourceLabel(t, model)}</h2>
            <p className="text-xs text-muted-foreground">{config.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('admin.search')}
              className="h-9 w-44 pr-8 text-sm"
            />
          </div>
          <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching}>
            <RefreshCw className={isFetching ? 'size-4 animate-spin' : 'size-4'} />
            {t('admin.refreshStats')}
          </Button>
          {!config.readOnly && (
            <Button size="sm" onClick={() => onEdit({})}>
              <Plus className="size-4" />
              {t('admin.new')} {resourceLabel(t, model)}
            </Button>
          )}
        </div>
      </div>

      <Card className="border-border/60">
        <div className="max-h-[60vh] overflow-y-auto">
          <Table>
            <TableHeader className="sticky top-0 z-10 bg-background">
              <TableRow>
                <TableHead className="w-[110px]">{t('admin.id')}</TableHead>
                {config.listColumns.map((c) => (
                  <TableHead key={c.key}>{c.label}</TableHead>
                ))}
                <TableHead className="w-[160px]">{t('admin.created')}</TableHead>
                <TableHead className="w-[140px] text-left">{t('admin.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={`s-${i}`}>
                    <TableCell colSpan={config.listColumns.length + 3}>
                      <Skeleton className="h-7 w-full" />
                    </TableCell>
                  </TableRow>
                ))
              )}
              {!isLoading && !isError && filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={config.listColumns.length + 3} className="py-10 text-center text-muted-foreground">
                    {t('admin.noData')}
                  </TableCell>
                </TableRow>
              )}
              {!isError && filtered.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground">
                      {truncateId(row.id)}
                    </code>
                  </TableCell>
                  {config.listColumns.map((c) => (
                    <TableCell key={c.key}>{renderCell(row[c.key], c.truncate)}</TableCell>
                  ))}
                  <TableCell className="text-xs text-muted-foreground">{formatDate(row.createdAt as string)}</TableCell>
                  <TableCell className="text-left">
                    <div className="flex items-center justify-start gap-1">
                      {config.readOnly ? (
                        <Button size="icon" variant="ghost" onClick={() => onView(row)} title={t('admin.viewDetails')}>
                          <Eye className="size-4" />
                        </Button>
                      ) : (
                        <>
                          <Button size="icon" variant="ghost" onClick={() => onEdit(row)} title={t('admin.edit')}>
                            <Pencil className="size-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="text-destructive hover:text-destructive"
                            onClick={() => onDeleteRequest(row)}
                            title={t('admin.delete')}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {isError && (
          <div className="flex flex-col items-center gap-2 p-8 text-center">
            <p className="text-sm text-destructive">{(error as Error).message}</p>
            <Button size="sm" variant="outline" onClick={() => refetch()}>
              <RefreshCw className="size-4" />
              {t('admin.refreshStats')}
            </Button>
          </div>
        )}
        {!isError && filtered.length > 0 && (
          <div className="border-t border-border/60 px-4 py-2 text-xs text-muted-foreground">
            {filtered.length} / {data?.length ?? 0}
          </div>
        )}
      </Card>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Edit / create dialog
// ---------------------------------------------------------------------------

function EditDialog({
  model,
  token,
  open,
  onOpenChange,
  record,
}: {
  model: ModelKey
  token: string
  open: boolean
  onOpenChange: (o: boolean) => void
  record: RecordData | null
}) {
  const t = useT()
  const isEdit = !!record?.id
  const [values, setValues] = React.useState<Record<string, unknown>>(() => buildInitialForm(model))
  const [submitting, setSubmitting] = React.useState(false)
  const { create, update } = useAdminMutations(model, t)

  React.useEffect(() => {
    if (open) {
      if (record && record.id) {
        setValues(hydrateFormFromRecord(model, record))
      } else {
        setValues(buildInitialForm(model))
      }
    }
  }, [open, record, model])

  const handleChange = (k: string, v: unknown) => {
    setValues((prev) => ({ ...prev, [k]: v }))
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      const data = serializeForm(model, values)
      if (isEdit && record?.id) {
        await update.mutateAsync({ id: record.id, data })
      } else {
        await create.mutateAsync(data)
      }
      onOpenChange(false)
    } catch (e) {
      toast.error((e as Error).message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl" dir="rtl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isEdit ? <Pencil className="size-4 text-primary" /> : <Plus className="size-4 text-primary" />}
            {isEdit ? `${t('admin.edit')} ${resourceLabel(t, model)}` : `${t('admin.new')} ${resourceLabel(t, model)}`}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'برای ذخیرهٔ تغییرات، فیلدها را ویرایش کنید.'
              : 'برای ایجاد رکورد جدید، فیلدها را پر کنید.'}
          </DialogDescription>
        </DialogHeader>
        <Separator />
        <DynamicForm model={model} values={values} onChange={handleChange} />
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
            {t('admin.cancel')}
          </Button>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? <Loader2 className="size-4 animate-spin" /> : null}
            {isEdit ? t('admin.saveChanges') : t('admin.create')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ---------------------------------------------------------------------------
// Read-only view dialog (leads + contact requests)
// ---------------------------------------------------------------------------

function ViewDialog({
  model,
  open,
  onOpenChange,
  record,
}: {
  model: ModelKey
  open: boolean
  onOpenChange: (o: boolean) => void
  record: RecordData | null
}) {
  const t = useT()
  if (!record) return null
  const entries = Object.entries(record).filter(([k]) => k !== 'id')

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl" dir="rtl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="size-4 text-primary" />
            {t('admin.details')} {resourceLabel(t, model)}
          </DialogTitle>
          <DialogDescription>
            {t('admin.submittedOn')} {formatDate(record.createdAt as string)}
          </DialogDescription>
        </DialogHeader>
        <Separator />
        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-3 pr-2">
            {entries.map(([k, v]) => (
              <div key={k} className="grid grid-cols-3 gap-3 rounded-md border border-border/50 p-3">
                <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{k}</div>
                <div className="col-span-2 break-words text-sm text-foreground">
                  {renderCell(v, 400)}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>{t('admin.cancel')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ---------------------------------------------------------------------------
// Delete confirmation
// ---------------------------------------------------------------------------

function DeleteDialog({
  model,
  token,
  open,
  onOpenChange,
  record,
}: {
  model: ModelKey
  token: string
  open: boolean
  onOpenChange: (o: boolean) => void
  record: RecordData | null
}) {
  const t = useT()
  const { remove } = useAdminMutations(model, t)
  const [deleting, setDeleting] = React.useState(false)

  React.useEffect(() => {
    if (!open) setDeleting(false)
  }, [open])

  const handleConfirm = async () => {
    if (!record?.id) return
    setDeleting(true)
    try {
      await remove.mutateAsync(record.id)
      onOpenChange(false)
    } catch {
      // toast handled in mutation
    } finally {
      setDeleting(false)
    }
  }

  const label = React.useMemo(() => {
    if (!record) return ''
    return String(
      record.title || record.name || record.clientName || record.fullName || record.key || record.email || record.id,
    )
  }, [record])

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent dir="rtl">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Trash2 className="size-5 text-destructive" />
            {t('admin.confirmDeleteTitle')} {resourceLabel(t, model)}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t('admin.confirmDelete')}{' '}
            <span className="font-medium text-foreground">{label}</span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleting}>{t('admin.cancel')}</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault()
              handleConfirm()
            }}
            disabled={deleting}
            className="bg-destructive text-white hover:bg-destructive/90"
          >
            {deleting ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
            {t('admin.delete')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

// ---------------------------------------------------------------------------
// Dashboard overview (post-login landing)
// ---------------------------------------------------------------------------

interface DashboardStats {
  portfolios: number
  blogPosts: number
  contactRequests: RecordData[]
  leads: RecordData[]
  newsletter: number
  caseStudies: number
}

interface StatCardConfig {
  key: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  value: number
  /** Tailwind text color class for the icon circle */
  iconColor: string
  /** Tailwind background tint class for the icon circle */
  iconBg: string
  /** Tailwind `from-*` token rendered behind the card on hover */
  hoverFrom: string
  /** Tailwind `to-*` token rendered behind the card on hover */
  hoverTo: string
  /** Optional click target (jump to that resource) */
  onClick?: () => void
}

function StatCard({ config, loading }: { config: StatCardConfig; loading: boolean }) {
  const Icon = config.icon
  return (
    <button
      type="button"
      onClick={config.onClick}
      className={cn(
        'group relative flex w-full flex-col gap-3 overflow-hidden rounded-2xl border border-border/60 bg-card p-5 text-left shadow-soft transition-all duration-300',
        'hover:-translate-y-1 hover:border-primary/40 hover:shadow-glow',
      )}
    >
      {/* Subtle gradient wash on hover */}
      <div
        className={cn(
          'pointer-events-none absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-100',
          config.hoverFrom,
          config.hoverTo,
        )}
      />
      <div className="relative flex items-center justify-between">
        <div
          className={cn(
            'flex size-11 items-center justify-center rounded-xl transition-colors duration-300',
            config.iconBg,
            config.iconColor,
            'group-hover:scale-110',
          )}
        >
          <Icon className="size-5" />
        </div>
        <TrendingUp className="size-4 text-muted-foreground/40 transition-colors group-hover:text-accent" />
      </div>
      <div className="relative space-y-1">
        {loading ? (
          <Skeleton className="h-8 w-20" />
        ) : (
          <p className="text-3xl font-bold tracking-tight text-foreground">
            {config.value.toLocaleString()}
          </p>
        )}
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {config.label}
        </p>
      </div>
    </button>
  )
}

function contactStatusBadge(status?: string) {
  switch (status) {
    case 'new':
      return <Badge className="bg-primary/15 text-primary hover:bg-primary/20">New</Badge>
    case 'read':
      return <Badge className="bg-amber-500/15 text-amber-600 hover:bg-amber-500/20 dark:text-amber-400">Read</Badge>
    case 'replied':
      return <Badge className="bg-accent/15 text-accent hover:bg-accent/20">Replied</Badge>
    case 'archived':
      return <Badge variant="outline" className="text-muted-foreground">Archived</Badge>
    default:
      return <Badge variant="outline" className="text-muted-foreground">{status || '—'}</Badge>
  }
}

function leadStatusBadge(status?: string) {
  switch (status) {
    case 'new':
      return <Badge className="bg-primary/15 text-primary hover:bg-primary/20">New</Badge>
    case 'contacted':
      return <Badge className="bg-amber-500/15 text-amber-600 hover:bg-amber-500/20 dark:text-amber-400">Contacted</Badge>
    case 'qualified':
      return <Badge className="bg-accent/15 text-accent hover:bg-accent/20">Qualified</Badge>
    case 'won':
      return <Badge className="bg-emerald-500/15 text-emerald-600 hover:bg-emerald-500/20 dark:text-emerald-400">Won</Badge>
    case 'lost':
      return <Badge className="bg-rose-500/15 text-rose-600 hover:bg-rose-500/20 dark:text-rose-400">Lost</Badge>
    default:
      return <Badge variant="outline" className="text-muted-foreground">{status || '—'}</Badge>
  }
}

function getInitials(name?: string) {
  if (!name) return '?'
  const parts = String(name).trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

function ActivityRow({
  name,
  email,
  date,
  badge,
}: {
  name: string
  email: string
  date?: string
  badge: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-border/50 p-3 transition-all duration-200 hover:border-primary/30 hover:bg-muted/40">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/15 to-accent/15 text-xs font-semibold text-primary">
          {getInitials(name)}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-foreground">{name}</p>
          <p className="truncate text-xs text-muted-foreground">{email}</p>
        </div>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1">
        {badge}
        <p className="text-[10px] text-muted-foreground">{formatDate(date)}</p>
      </div>
    </div>
  )
}

function ActivityColumn({
  title,
  icon: Icon,
  iconColor,
  iconBg,
  items,
  loading,
  emptyLabel,
  onSeeAll,
  seeAllLabel,
}: {
  title: string
  icon: React.ComponentType<{ className?: string }>
  iconColor: string
  iconBg: string
  items: { name: string; email: string; date?: string; badge: React.ReactNode }[]
  loading: boolean
  emptyLabel: string
  onSeeAll: () => void
  seeAllLabel: string
}) {
  return (
    <Card className="flex flex-col border-border/60 shadow-soft">
      <CardHeader className="flex-row items-center justify-between gap-2 space-y-0 pb-3">
        <div className="flex items-center gap-2.5">
          <div className={cn('flex size-9 items-center justify-center rounded-lg', iconBg, iconColor)}>
            <Icon className="size-4" />
          </div>
          <div>
            <CardTitle className="text-sm font-semibold">{title}</CardTitle>
            <CardDescription className="text-[11px]">آخرین ۵ مورد</CardDescription>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs text-muted-foreground" onClick={onSeeAll}>
          {seeAllLabel}
          <ArrowLeft className="size-3.5" />
        </Button>
      </CardHeader>
      <CardContent className="flex-1 space-y-2">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-xl" />)
        ) : items.length === 0 ? (
          <div className="flex h-24 items-center justify-center rounded-xl border border-dashed border-border/60 text-xs text-muted-foreground">
            {emptyLabel}
          </div>
        ) : (
          items.map((item, i) => (
            <ActivityRow
              key={`${item.email}-${i}`}
              name={item.name}
              email={item.email}
              date={item.date}
              badge={item.badge}
            />
          ))
        )}
      </CardContent>
    </Card>
  )
}

function DashboardOverview({
  token,
  onNavigate,
  onNewRecord,
}: {
  token: string
  onNavigate: (model: ModelKey) => void
  onNewRecord: (model: ModelKey) => void
}) {
  const t = useT()
  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ['admin', 'dashboard-stats'],
    queryFn: async (): Promise<DashboardStats> => {
      const models: ModelKey[] = [
        'portfolio',
        'blogPost',
        'contactRequest',
        'lead',
        'newsletter',
        'caseStudy',
      ]
      const responses = await Promise.all(
        models.map((m) =>
          fetch(`/api/admin?model=${encodeURIComponent(m)}`, { credentials: 'include' }).then(async (r) => {
            if (r.status === 401) throw new Error('Unauthorized')
            if (!r.ok) throw new Error(`Failed to load ${m} (${r.status})`)
            const json = await r.json()
            return { model: m, items: (json.items ?? []) as RecordData[] }
          }),
        ),
      )
      const byModel = Object.fromEntries(responses.map((r) => [r.model, r.items])) as Record<ModelKey, RecordData[]>
      return {
        portfolios: byModel.portfolio.length,
        blogPosts: byModel.blogPost.length,
        contactRequests: byModel.contactRequest,
        leads: byModel.lead,
        newsletter: byModel.newsletter.length,
        caseStudies: byModel.caseStudy.length,
      }
    },
    enabled: !!token,
    staleTime: 30_000,
  })

  const recentContacts = React.useMemo(() => {
    const list = data?.contactRequests ?? []
    return [...list]
      .sort((a, b) => {
        const ta = a.createdAt ? new Date(a.createdAt as string).getTime() : 0
        const tb = b.createdAt ? new Date(b.createdAt as string).getTime() : 0
        return tb - ta
      })
      .slice(0, 5)
      .map((r) => ({
        name: String(r.fullName || r.name || 'Anonymous'),
        email: String(r.email || '—'),
        date: r.createdAt as string | undefined,
        badge: contactStatusBadge(r.status as string | undefined),
      }))
  }, [data?.contactRequests])

  const recentLeads = React.useMemo(() => {
    const list = data?.leads ?? []
    return [...list]
      .sort((a, b) => {
        const ta = a.createdAt ? new Date(a.createdAt as string).getTime() : 0
        const tb = b.createdAt ? new Date(b.createdAt as string).getTime() : 0
        return tb - ta
      })
      .slice(0, 5)
      .map((r) => ({
        name: String(r.name || 'Anonymous'),
        email: String(r.email || '—'),
        date: r.createdAt as string | undefined,
        badge: leadStatusBadge(r.status as string | undefined),
      }))
  }, [data?.leads])

  const statCards: StatCardConfig[] = [
    {
      key: 'portfolio',
      label: t('admin.r.portfolio'),
      icon: FolderKanban,
      value: data?.portfolios ?? 0,
      iconColor: 'text-primary',
      iconBg: 'bg-primary/10',
      hoverFrom: 'from-primary/[0.06]',
      hoverTo: 'to-primary/[0.01]',
      onClick: () => onNavigate('portfolio'),
    },
    {
      key: 'blogPost',
      label: t('admin.r.blogPost'),
      icon: BookOpen,
      value: data?.blogPosts ?? 0,
      iconColor: 'text-accent',
      iconBg: 'bg-accent/10',
      hoverFrom: 'from-accent/[0.06]',
      hoverTo: 'to-accent/[0.01]',
      onClick: () => onNavigate('blogPost'),
    },
    {
      key: 'contactRequest',
      label: t('admin.r.contactRequest'),
      icon: Mail,
      value: data?.contactRequests?.length ?? 0,
      iconColor: 'text-rose-600 dark:text-rose-400',
      iconBg: 'bg-rose-500/10',
      hoverFrom: 'from-rose-500/[0.06]',
      hoverTo: 'to-rose-500/[0.01]',
      onClick: () => onNavigate('contactRequest'),
    },
    {
      key: 'lead',
      label: t('admin.r.lead'),
      icon: Inbox,
      value: data?.leads?.length ?? 0,
      iconColor: 'text-amber-600 dark:text-amber-400',
      iconBg: 'bg-amber-500/10',
      hoverFrom: 'from-amber-500/[0.06]',
      hoverTo: 'to-amber-500/[0.01]',
      onClick: () => onNavigate('lead'),
    },
    {
      key: 'newsletter',
      label: t('admin.r.newsletter'),
      icon: Megaphone,
      value: data?.newsletter ?? 0,
      iconColor: 'text-violet-600 dark:text-violet-400',
      iconBg: 'bg-violet-500/10',
      hoverFrom: 'from-violet-500/[0.06]',
      hoverTo: 'to-violet-500/[0.01]',
      onClick: () => onNavigate('newsletter'),
    },
    {
      key: 'caseStudy',
      label: t('admin.r.caseStudy'),
      icon: FlaskConical,
      value: data?.caseStudies ?? 0,
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      iconBg: 'bg-emerald-500/10',
      hoverFrom: 'from-emerald-500/[0.06]',
      hoverTo: 'to-emerald-500/[0.01]',
      onClick: () => onNavigate('caseStudy'),
    },
  ]

  const quickActions: {
    label: string
    icon: React.ComponentType<{ className?: string }>
    onClick: () => void
    variant: 'default' | 'outline'
  }[] = [
    { label: `${t('admin.new')} ${t('admin.r.portfolio')}`, icon: Plus, onClick: () => onNewRecord('portfolio'), variant: 'default' },
    { label: `${t('admin.new')} ${t('admin.r.blogPost')}`, icon: Plus, onClick: () => onNewRecord('blogPost'), variant: 'outline' },
    { label: t('admin.r.contactRequest'), icon: Mail, onClick: () => onNavigate('contactRequest'), variant: 'outline' },
    { label: t('admin.r.lead'), icon: Inbox, onClick: () => onNavigate('lead'), variant: 'outline' },
  ]

  return (
    <div className="space-y-6" dir="rtl">
      {/* Welcome header */}
      <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-primary/[0.04] via-background to-accent/[0.04] p-6 shadow-soft sm:p-8">
        <div className="absolute -left-10 -top-10 size-40 rounded-full bg-primary/10 blur-3xl" aria-hidden />
        <div className="absolute -bottom-12 left-24 size-32 rounded-full bg-accent/10 blur-3xl" aria-hidden />
        <div className="relative flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background/60 px-3 py-1 text-[11px] font-medium text-muted-foreground backdrop-blur">
              <LayoutDashboard className="size-3 text-primary" />
              {t('admin.panel')}
            </div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {t('admin.welcome')}
            </h1>
          </div>
          <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching} className="gap-1.5">
            <RefreshCw className={cn('size-4', isFetching && 'animate-spin')} />
            {t('admin.refreshStats')}
          </Button>
        </div>
      </div>

      {/* Stat cards */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            <TrendingUp className="size-4 text-accent" />
            {t('admin.overview')}
          </h2>
          {isError && (
            <span className="text-xs text-destructive">{(error as Error).message}</span>
          )}
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {statCards.map((c) => (
            <StatCard key={c.key} config={c} loading={isLoading} />
          ))}
        </div>
        {isError && (
          <div className="mt-3 flex items-center justify-between rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-2.5 text-sm">
            <span className="text-destructive">{(error as Error).message}</span>
            <Button size="sm" variant="outline" onClick={() => refetch()} className="h-7 gap-1.5 text-xs">
              <RefreshCw className="size-3.5" />
              {t('admin.refreshStats')}
            </Button>
          </div>
        )}
      </section>

      {/* Quick actions */}
      <section className="rounded-2xl border border-border/60 bg-card p-5 shadow-soft sm:p-6">
        <div className="mb-4 flex items-center gap-2">
          <Sparkles className="size-4 text-primary" />
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">{t('admin.quickActions')}</h2>
        </div>
        <div className="flex flex-wrap gap-2.5">
          {quickActions.map((a) => {
            const Icon = a.icon
            return (
              <Button
                key={a.label}
                variant={a.variant}
                size="sm"
                onClick={a.onClick}
                className={cn(
                  'h-9 gap-1.5 rounded-full',
                  a.variant === 'default' && 'shadow-soft',
                )}
              >
                <Icon className="size-4" />
                {a.label}
                {a.variant === 'outline' && <ArrowLeft className="size-3.5 text-muted-foreground" />}
              </Button>
            )
          })}
        </div>
      </section>

      {/* Recent activity */}
      <section>
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          <Inbox className="size-4 text-accent" />
          {t('admin.recentActivity')}
        </h2>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <ActivityColumn
            title={t('admin.r.contactRequest')}
            icon={Mail}
            iconColor="text-rose-600 dark:text-rose-400"
            iconBg="bg-rose-500/10"
            items={recentContacts}
            loading={isLoading}
            emptyLabel={t('admin.noData')}
            onSeeAll={() => onNavigate('contactRequest')}
            seeAllLabel={t('admin.seeAll')}
          />
          <ActivityColumn
            title={t('admin.r.lead')}
            icon={Inbox}
            iconColor="text-amber-600 dark:text-amber-400"
            iconBg="bg-amber-500/10"
            items={recentLeads}
            loading={isLoading}
            emptyLabel={t('admin.noData')}
            onSeeAll={() => onNavigate('lead')}
            seeAllLabel={t('admin.seeAll')}
          />
        </div>
      </section>

      {/* Admin Users Management */}
      <AdminUsersSection />
    </div>
  )
}

/* ----------------------- Admin Users Management ----------------------- */

function AdminUsersSection() {
  const t = useT()
  const qc = useQueryClient()
  const [showCreate, setShowCreate] = React.useState(false)
  const [newUser, setNewUser] = React.useState({ username: '', password: '', displayName: '', role: 'admin' })
  const [creating, setCreating] = React.useState(false)

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const res = await fetch('/api/admin/users', { credentials: 'include' })
      if (!res.ok) throw new Error('Failed to load')
      const json = await res.json()
      return json.items as { id: string; username: string; displayName: string; role: string; active: boolean; createdAt: string }[]
    },
  })

  const deleteUser = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/users?id=${id}`, { method: 'DELETE', credentials: 'include' })
      if (!res.ok) {
        const j = await res.json()
        throw new Error(j.error || 'Failed')
      }
    },
    onSuccess: () => {
      toast.success('کاربر حذف شد')
      qc.invalidateQueries({ queryKey: ['admin-users'] })
    },
    onError: (e: Error) => toast.error(e.message),
  })

  const handleCreate = async () => {
    if (!newUser.username.trim() || !newUser.password.trim() || !newUser.displayName.trim()) {
      toast.error('همه فیلدها الزامی است')
      return
    }
    setCreating(true)
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(newUser),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || 'خطا در ایجاد کاربر')
        return
      }
      toast.success('کاربر ادمین جدید ایجاد شد')
      setNewUser({ username: '', password: '', displayName: '', role: 'admin' })
      setShowCreate(false)
      qc.invalidateQueries({ queryKey: ['admin-users'] })
    } catch {
      toast.error('خطا در ایجاد کاربر')
    } finally {
      setCreating(false)
    }
  }

  return (
    <section className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <UserPlus className="size-5 text-primary" />
          مدیریت ادمین‌ها
        </h3>
        <Button size="sm" onClick={() => setShowCreate(!showCreate)}>
          <Plus className="size-4" />
          ادمین جدید
        </Button>
      </div>

      {showCreate && (
        <div className="mb-4 rounded-xl border border-border/60 bg-card p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label className="text-xs">نام نمایشی</Label>
              <Input value={newUser.displayName} onChange={(e) => setNewUser({ ...newUser, displayName: e.target.value })} placeholder="مثلاً: علی رضایی" />
            </div>
            <div>
              <Label className="text-xs">نام کاربری</Label>
              <Input value={newUser.username} onChange={(e) => setNewUser({ ...newUser, username: e.target.value })} placeholder="ali" />
            </div>
            <div>
              <Label className="text-xs">رمز عبور</Label>
              <Input type="password" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} placeholder="حداقل ۶ کاراکتر" />
            </div>
            <div>
              <Label className="text-xs">نقش</Label>
              <select
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
              >
                <option value="admin">ادمین</option>
                <option value="superadmin">مدیر اصلی</option>
              </select>
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            <Button size="sm" onClick={handleCreate} disabled={creating}>
              {creating ? <Loader2 className="size-4 animate-spin" /> : null}
              ایجاد کاربر
            </Button>
            <Button size="sm" variant="outline" onClick={() => setShowCreate(false)}>انصراف</Button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="py-8 text-center text-muted-foreground">در حال بارگذاری...</div>
      ) : (
        <div className="grid gap-2">
          {data?.map((u) => (
            <div key={u.id} className="flex items-center justify-between rounded-lg border border-border/60 bg-card p-3">
              <div className="flex items-center gap-3">
                <div className="grid size-9 place-items-center rounded-full bg-primary/10 text-primary">
                  <User className="size-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold">{u.displayName}</p>
                  <p className="text-xs text-muted-foreground">@{u.username} · {u.role === 'superadmin' ? 'مدیر اصلی' : 'ادمین'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {u.active ? (
                  <span className="rounded-full bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-600">فعال</span>
                ) : (
                  <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">غیرفعال</span>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    if (confirm(`حذف کاربر @${u.username}؟`)) deleteUser.mutate(u.id)
                  }}
                >
                  <Trash2 className="size-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

// ---------------------------------------------------------------------------
// Dashboard (post-login)
// ---------------------------------------------------------------------------

function Dashboard({ token, onLogout }: { token: string; onLogout: () => void }) {
  const t = useT()
  const setView = useNav((s) => s.setView)
  const [active, setActive] = React.useState<ActiveView>('dashboard')
  const [editOpen, setEditOpen] = React.useState(false)
  const [viewOpen, setViewOpen] = React.useState(false)
  const [deleteOpen, setDeleteOpen] = React.useState(false)
  const [editRecord, setEditRecord] = React.useState<RecordData | null>(null)
  const [viewRecord, setViewRecord] = React.useState<RecordData | null>(null)
  const [deleteRecord, setDeleteRecord] = React.useState<RecordData | null>(null)
  const [sidebarOpen, setSidebarOpen] = React.useState(false)

  // Defensive: when the dashboard is active the edit/view/delete dialogs cannot
  // be meaningfully rendered for a specific model. We fall back to `portfolio`
  // so the dialog has a valid configuration object even though it stays closed.
  const activeModel: ModelKey = active === 'dashboard' ? 'portfolio' : active

  const openEdit = (rec: RecordData) => {
    setEditRecord(rec)
    setEditOpen(true)
  }
  const openView = (rec: RecordData) => {
    setViewRecord(rec)
    setViewOpen(true)
  }
  const openDelete = (rec: RecordData) => {
    setDeleteRecord(rec)
    setDeleteOpen(true)
  }

  // Quick-action helpers used by the dashboard overview.
  const handleQuickNew = (m: ModelKey) => {
    setActive(m)
    setSidebarOpen(false)
    setEditRecord({})
    setEditOpen(true)
  }
  const handleQuickNavigate = (m: ModelKey) => {
    setActive(m)
    setSidebarOpen(false)
  }

  return (
    <div dir="rtl" className="flex min-h-screen flex-col bg-muted/30">
      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="flex h-14 items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground lg:hidden"
              onClick={() => setSidebarOpen((v) => !v)}
              aria-label="Toggle sidebar"
            >
              <LayoutDashboard className="size-4" />
            </button>
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <LayoutDashboard className="size-4" />
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-semibold leading-none text-foreground">{t('admin.panel')}</p>
                <p className="text-[11px] text-muted-foreground">DevStudio CMS</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="hidden gap-1.5 sm:flex">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              {t('admin.authenticated')}
            </Badge>
            <Button variant="outline" size="sm" onClick={() => setView('home')}>
              <ArrowRight className="size-4" />
              <span className="hidden sm:inline">{t('admin.backToSite')}</span>
            </Button>
            <Button variant="ghost" size="sm" onClick={onLogout} className="text-muted-foreground hover:text-foreground">
              <LogOut className="size-4" />
              <span className="hidden sm:inline">{t('admin.logout')}</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 right-0 top-14 z-20 w-64 transform border-l border-border/60 bg-background transition-transform lg:static lg:top-0 lg:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex h-full flex-col">
            <div className="px-3 py-4">
              <p className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {t('admin.overview')}
              </p>
              <nav className="space-y-0.5">
                <button
                  type="button"
                  onClick={() => {
                    setActive('dashboard')
                    setSidebarOpen(false)
                  }}
                  className={cn(
                    'flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors',
                    active === 'dashboard'
                      ? 'bg-primary text-primary-foreground shadow-xs'
                      : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                  )}
                >
                  <LayoutDashboard className="size-4 shrink-0" />
                  <span className="truncate text-right">{t('admin.overview')}</span>
                </button>
              </nav>
              <p className="px-2 pb-2 pt-4 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {t('admin.resources')}
              </p>
              <nav className="space-y-0.5">
                {MODEL_ORDER.map((m) => {
                  const cfg = MODEL_CONFIGS[m]
                  const Icon = cfg.icon
                  const isActive = active === m
                  return (
                    <button
                      key={m}
                      type="button"
                      onClick={() => {
                        setActive(m)
                        setSidebarOpen(false)
                      }}
                      className={cn(
                        'flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors',
                        isActive
                          ? 'bg-primary text-primary-foreground shadow-xs'
                          : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                      )}
                    >
                      <Icon className="size-4 shrink-0" />
                      <span className="truncate text-right">{resourceLabel(t, m)}</span>
                      {cfg.readOnly && (
                        <span className={cn(
                          'mr-auto rounded px-1.5 py-0.5 text-[10px] font-medium',
                          isActive
                            ? 'bg-primary-foreground/20 text-primary-foreground'
                            : 'bg-muted text-muted-foreground',
                        )}>
                          {t('admin.readonly')}
                        </span>
                      )}
                    </button>
                  )
                })}
              </nav>
            </div>
            <div className="mt-auto border-t border-border/60 p-3">
              <div className="rounded-lg bg-muted/60 p-3">
                <p className="text-[11px] font-medium text-foreground">DevStudio CMS</p>
                <p className="mt-0.5 text-[10px] text-muted-foreground">
                  {t('admin.panel')}
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* Click-away for mobile sidebar */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 top-14 z-10 bg-black/40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-hidden
          />
        )}

        {/* Main */}
        <main className="flex-1 overflow-x-hidden p-4 sm:p-6">
          {active === 'dashboard' ? (
            <DashboardOverview
              token={token}
              onNavigate={handleQuickNavigate}
              onNewRecord={handleQuickNew}
            />
          ) : (
            <RecordTable
              model={active}
              token={token}
              onEdit={openEdit}
              onView={openView}
              onDeleteRequest={openDelete}
            />
          )}
        </main>
      </div>

      {/* Dialogs */}
      <EditDialog
        model={activeModel}
        token={token}
        open={editOpen}
        onOpenChange={setEditOpen}
        record={editRecord}
      />
      <ViewDialog
        model={activeModel}
        open={viewOpen}
        onOpenChange={setViewOpen}
        record={viewRecord}
      />
      <DeleteDialog
        model={activeModel}
        token={token}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        record={deleteRecord}
      />
    </div>
  )
}

// ---------------------------------------------------------------------------
// Public component
// ---------------------------------------------------------------------------

export function AdminView() {
  const [authed, setAuthed] = React.useState<boolean | null>(null) // null = loading

  // Check existing session on mount
  React.useEffect(() => {
    fetch('/api/admin/me')
      .then((res) => setAuthed(res.ok))
      .catch(() => setAuthed(false))
  }, [])

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' })
    } catch {
      // ignore
    }
    setAuthed(false)
  }

  if (authed === null) {
    return (
      <div dir="rtl" className="flex min-h-screen items-center justify-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!authed) {
    return <LoginCard onLogin={() => setAuthed(true)} />
  }

  return <Dashboard token="" onLogout={handleLogout} />
}

export default AdminView
