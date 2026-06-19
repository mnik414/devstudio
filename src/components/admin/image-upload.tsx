'use client'

import { useState, useRef, useCallback } from 'react'
import { Upload, X, Loader2, ImageIcon, Link2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  token: string
  label?: string
  placeholder?: string
}

export function ImageUpload({ value, onChange, token, label, placeholder }: ImageUploadProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mode, setMode] = useState<'upload' | 'url'>(value ? 'url' : 'upload')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback(
    async (file: File) => {
      setLoading(true)
      setError(null)
      try {
        const formData = new FormData()
        formData.append('file', file)
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'X-Admin-Token': token },
          body: formData,
        })
        const data = await res.json()
        if (!res.ok) {
          setError(data.error || 'Upload failed')
          return
        }
        onChange(data.url)
      } catch {
        setError('Upload failed')
      } finally {
        setLoading(false)
      }
    },
    [token, onChange],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      const file = e.dataTransfer.files[0]
      if (file) handleFile(file)
    },
    [handleFile],
  )

  return (
    <div className="space-y-2">
      {label && <label className="text-sm font-medium">{label}</label>}

      {/* Mode toggle */}
      <div className="flex gap-1 rounded-lg border bg-muted/30 p-1">
        <button
          type="button"
          onClick={() => setMode('upload')}
          className={cn(
            'flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition',
            mode === 'upload' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground',
          )}
        >
          <Upload className="h-3.5 w-3.5" />
          آپلود فایل
        </button>
        <button
          type="button"
          onClick={() => setMode('url')}
          className={cn(
            'flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition',
            mode === 'url' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground',
          )}
        >
          <Link2 className="h-3.5 w-3.5" />
          آدرس URL
        </button>
      </div>

      {/* Preview */}
      {value && (
        <div className="relative group">
          <img
            src={value}
            alt="Preview"
            className="h-32 w-full rounded-lg border object-cover"
          />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-background/90 text-destructive shadow-sm transition hover:bg-background"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Upload mode */}
      {mode === 'upload' && (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 text-center transition',
            'hover:border-primary/40 hover:bg-primary/5',
            error && 'border-destructive/40',
          )}
        >
          {loading ? (
            <>
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-xs text-muted-foreground">در حال آپلود...</p>
            </>
          ) : (
            <>
              <div className="grid h-10 w-10 place-items-center rounded-full bg-primary/10 text-primary">
                <ImageIcon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium">فایل را اینجا بکشید یا کلیک کنید</p>
                <p className="text-xs text-muted-foreground">JPG, PNG, WebP, GIF — حداکثر ۵ مگابایت</p>
              </div>
            </>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) handleFile(file)
              e.target.value = ''
            }}
          />
        </div>
      )}

      {/* URL mode */}
      {mode === 'url' && (
        <Input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || 'https://example.com/image.jpg'}
        />
      )}

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
