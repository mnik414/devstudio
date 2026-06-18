'use client'

import * as React from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useNav } from '@/lib/store'
import {
  LayoutDashboard,
  LogOut,
  ArrowLeft,
  Plus,
  Pencil,
  Trash2,
  Eye,
  Lock,
  ShieldCheck,
  Search,
  FolderKanban,
  Tags,
  Cpu,
  Newspaper,
  Bookmark,
  FlaskConical,
  Quote,
  Users,
  Sparkles,
  HelpCircle,
  Inbox,
  Mail,
  Settings as SettingsIcon,
  Loader2,
  KeyRound,
  RefreshCw,
} from 'lucide-react'

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

type FieldType = 'text' | 'textarea' | 'number' | 'switch' | 'json' | 'select'

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
      { key: 'coverImage', label: 'Cover Image URL', type: 'text' },
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
      { key: 'coverImage', label: 'Cover Image URL', type: 'text' },
      { key: 'readingTime', label: 'Reading Time (min)', type: 'number', default: 5 },
      { key: 'authorName', label: 'Author Name', type: 'text', default: 'Editorial Team' },
      { key: 'authorAvatar', label: 'Author Avatar URL', type: 'text' },
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
      { key: 'coverImage', label: 'Cover Image URL', type: 'text' },
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
      { key: 'avatar', label: 'Avatar URL', type: 'text' },
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
      { key: 'avatar', label: 'Avatar URL', type: 'text' },
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
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function truncateId(id?: string) {
  if (!id) return '—'
  return id.length > 10 ? `${id.slice(0, 8)}…` : id
}

function formatDate(value?: string) {
  if (!value) return '—'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleString(undefined, {
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

function useAdminFetch(model: ModelKey, token: string | null) {
  return useQuery({
    queryKey: ['admin', model],
    queryFn: async () => {
      if (!token) throw new Error('Not authenticated')
      const res = await fetch(`/api/admin?model=${encodeURIComponent(model)}`, {
        headers: { 'X-Admin-Token': token },
      })
      if (res.status === 401) throw new Error('Unauthorized — check your admin token.')
      if (!res.ok) throw new Error(`Failed to load ${model} (${res.status})`)
      const json = await res.json()
      return (json.items ?? []) as RecordData[]
    },
    enabled: !!token,
    staleTime: 30_000,
  })
}

function useAdminMutations(model: ModelKey, token: string | null) {
  const qc = useQueryClient()
  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ['admin', model] })
  }

  const create = useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Admin-Token': token! },
        body: JSON.stringify({ model, data }),
      })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        throw new Error(j.error || `Create failed (${res.status})`)
      }
      return res.json()
    },
    onSuccess: () => {
      invalidate()
      toast.success(`${MODEL_CONFIGS[model].singular} created`)
    },
    onError: (e: Error) => toast.error(e.message),
  })

  const update = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Record<string, unknown> }) => {
      const res = await fetch('/api/admin', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'X-Admin-Token': token! },
        body: JSON.stringify({ model, id, data }),
      })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        throw new Error(j.error || `Update failed (${res.status})`)
      }
      return res.json()
    },
    onSuccess: () => {
      invalidate()
      toast.success(`${MODEL_CONFIGS[model].singular} updated`)
    },
    onError: (e: Error) => toast.error(e.message),
  })

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin?model=${encodeURIComponent(model)}&id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: { 'X-Admin-Token': token! },
      })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        throw new Error(j.error || `Delete failed (${res.status})`)
      }
      return res.json()
    },
    onSuccess: () => {
      invalidate()
      toast.success(`${MODEL_CONFIGS[model].singular} deleted`)
    },
    onError: (e: Error) => toast.error(e.message),
  })

  return { create, update, remove, invalidate }
}

// ---------------------------------------------------------------------------
// Login gate
// ---------------------------------------------------------------------------

function LoginCard({ onLogin }: { onLogin: (token: string) => void }) {
  const [token, setToken] = React.useState('devstudio-admin')
  const [loading, setLoading] = React.useState(false)

  const submit = async () => {
    if (!token.trim()) {
      toast.error('Please enter an admin token.')
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`/api/admin?model=setting`, {
        headers: { 'X-Admin-Token': token.trim() },
      })
      if (res.status === 401) {
        toast.error('Invalid admin token.')
        return
      }
      if (!res.ok) {
        toast.error(`Login failed (${res.status})`)
        return
      }
      toast.success('Authenticated — welcome back.')
      onLogin(token.trim())
    } catch (e) {
      toast.error((e as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md border-border/60 shadow-lg">
        <CardHeader className="space-y-2 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <ShieldCheck className="size-6" />
          </div>
          <CardTitle className="text-2xl">Admin Panel</CardTitle>
          <CardDescription>Enter your admin token to access the CMS dashboard.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="admin-token" className="flex items-center gap-1.5">
              <KeyRound className="size-3.5 text-muted-foreground" />
              Admin Token
            </Label>
            <Input
              id="admin-token"
              type="password"
              autoComplete="off"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') submit()
              }}
              placeholder="Enter admin token"
            />
            <p className="text-xs text-muted-foreground">
              Default token: <code className="rounded bg-muted px-1 py-0.5 font-mono">devstudio-admin</code>
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button onClick={submit} disabled={loading} className="w-full">
            {loading ? <Loader2 className="size-4 animate-spin" /> : <Lock className="size-4" />}
            {loading ? 'Verifying…' : 'Login'}
          </Button>
          <Button
            variant="ghost"
            className="w-full"
            onClick={() => useNav.getState().setView('home')}
          >
            <ArrowLeft className="size-4" />
            Back to site
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
  const { data, isLoading, isError, error, refetch, isFetching } = useAdminFetch(model, token)
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
            <h2 className="text-lg font-semibold text-foreground">{config.label}</h2>
            <p className="text-xs text-muted-foreground">{config.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search…"
              className="h-9 w-44 pl-8 text-sm"
            />
          </div>
          <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching}>
            <RefreshCw className={isFetching ? 'size-4 animate-spin' : 'size-4'} />
            Refresh
          </Button>
          {!config.readOnly && (
            <Button size="sm" onClick={() => onEdit({})}>
              <Plus className="size-4" />
              New {config.singular}
            </Button>
          )}
        </div>
      </div>

      <Card className="border-border/60">
        <div className="max-h-[60vh] overflow-y-auto">
          <Table>
            <TableHeader className="sticky top-0 z-10 bg-background">
              <TableRow>
                <TableHead className="w-[110px]">ID</TableHead>
                {config.listColumns.map((c) => (
                  <TableHead key={c.key}>{c.label}</TableHead>
                ))}
                <TableHead className="w-[160px]">Created</TableHead>
                <TableHead className="w-[140px] text-right">Actions</TableHead>
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
                    No records found.
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
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      {config.readOnly ? (
                        <Button size="icon" variant="ghost" onClick={() => onView(row)} title="View details">
                          <Eye className="size-4" />
                        </Button>
                      ) : (
                        <>
                          <Button size="icon" variant="ghost" onClick={() => onEdit(row)} title="Edit">
                            <Pencil className="size-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="text-destructive hover:text-destructive"
                            onClick={() => onDeleteRequest(row)}
                            title="Delete"
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
              Retry
            </Button>
          </div>
        )}
        {!isError && filtered.length > 0 && (
          <div className="border-t border-border/60 px-4 py-2 text-xs text-muted-foreground">
            Showing {filtered.length} {filtered.length === 1 ? 'record' : 'records'}
            {data && filtered.length !== data.length && ` of ${data.length}`}
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
  const config = MODEL_CONFIGS[model]
  const isEdit = !!record?.id
  const [values, setValues] = React.useState<Record<string, unknown>>(() => buildInitialForm(model))
  const [submitting, setSubmitting] = React.useState(false)
  const { create, update } = useAdminMutations(model, token)

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
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isEdit ? <Pencil className="size-4 text-primary" /> : <Plus className="size-4 text-primary" />}
            {isEdit ? `Edit ${config.singular}` : `New ${config.singular}`}
          </DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update the fields below and save your changes.' : 'Fill in the fields below to create a new record.'}
          </DialogDescription>
        </DialogHeader>
        <Separator />
        <DynamicForm model={model} values={values} onChange={handleChange} />
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? <Loader2 className="size-4 animate-spin" /> : null}
            {isEdit ? 'Save Changes' : 'Create'}
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
  const config = MODEL_CONFIGS[model]
  if (!record) return null
  const entries = Object.entries(record).filter(([k]) => k !== 'id')

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="size-4 text-primary" />
            {config.singular} Details
          </DialogTitle>
          <DialogDescription>
            Submitted on {formatDate(record.createdAt as string)}
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
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
  const config = MODEL_CONFIGS[model]
  const { remove } = useAdminMutations(model, token)
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
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Trash2 className="size-5 text-destructive" />
            Delete {config.singular}
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete <span className="font-medium text-foreground">{label}</span>? This action
            cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault()
              handleConfirm()
            }}
            disabled={deleting}
            className="bg-destructive text-white hover:bg-destructive/90"
          >
            {deleting ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

// ---------------------------------------------------------------------------
// Dashboard (post-login)
// ---------------------------------------------------------------------------

function Dashboard({ token, onLogout }: { token: string; onLogout: () => void }) {
  const setView = useNav((s) => s.setView)
  const [active, setActive] = React.useState<ModelKey>('portfolio')
  const [editOpen, setEditOpen] = React.useState(false)
  const [viewOpen, setViewOpen] = React.useState(false)
  const [deleteOpen, setDeleteOpen] = React.useState(false)
  const [editRecord, setEditRecord] = React.useState<RecordData | null>(null)
  const [viewRecord, setViewRecord] = React.useState<RecordData | null>(null)
  const [deleteRecord, setDeleteRecord] = React.useState<RecordData | null>(null)
  const [sidebarOpen, setSidebarOpen] = React.useState(false)

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

  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
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
                <p className="text-sm font-semibold leading-none text-foreground">Admin Panel</p>
                <p className="text-[11px] text-muted-foreground">DevStudio CMS</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="hidden gap-1.5 sm:flex">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              Authenticated
            </Badge>
            <Button variant="outline" size="sm" onClick={() => setView('home')}>
              <ArrowLeft className="size-4" />
              <span className="hidden sm:inline">Back to site</span>
            </Button>
            <Button variant="ghost" size="sm" onClick={onLogout} className="text-muted-foreground hover:text-foreground">
              <LogOut className="size-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 top-14 z-20 w-64 transform border-r border-border/60 bg-background transition-transform lg:static lg:top-0 lg:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex h-full flex-col">
            <div className="px-3 py-4">
              <p className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Resources
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
                      className={`flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors ${
                        isActive
                          ? 'bg-primary text-primary-foreground shadow-xs'
                          : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                      }`}
                    >
                      <Icon className="size-4 shrink-0" />
                      <span className="truncate text-left">{cfg.label}</span>
                      {cfg.readOnly && (
                        <span className={`ml-auto rounded px-1.5 py-0.5 text-[10px] font-medium ${
                          isActive ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-muted text-muted-foreground'
                        }`}>
                          RO
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
                  Manage all site content from one place.
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
          <RecordTable
            model={active}
            token={token}
            onEdit={openEdit}
            onView={openView}
            onDeleteRequest={openDelete}
          />
        </main>
      </div>

      {/* Dialogs */}
      <EditDialog
        model={active}
        token={token}
        open={editOpen}
        onOpenChange={setEditOpen}
        record={editRecord}
      />
      <ViewDialog
        model={active}
        open={viewOpen}
        onOpenChange={setViewOpen}
        record={viewRecord}
      />
      <DeleteDialog
        model={active}
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
  const [token, setToken] = React.useState<string | null>(null)

  if (!token) {
    return <LoginCard onLogin={setToken} />
  }

  return <Dashboard token={token} onLogout={() => setToken(null)} />
}

export default AdminView
