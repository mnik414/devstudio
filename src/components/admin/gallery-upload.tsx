'use client'

import { useState, useCallback } from 'react'
import { Plus, X, GripVertical, ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ImageUpload } from '@/components/admin/image-upload'
import { cn } from '@/lib/utils'

interface GalleryUploadProps {
  value: string
  onChange: (val: string) => void
  label?: string
}

function parseGallery(val: string): string[] {
  if (!val) return []
  try {
    const parsed = JSON.parse(val)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function GalleryUpload({ value, onChange }: GalleryUploadProps) {
  const [adding, setAdding] = useState(false)
  const images = parseGallery(value)

  const handleAdd = useCallback(
    (url: string) => {
      if (!url) return
      const next = [...images, url]
      onChange(JSON.stringify(next))
      setAdding(false)
    },
    [images, onChange],
  )

  const handleRemove = useCallback(
    (index: number) => {
      const next = images.filter((_, i) => i !== index)
      onChange(next.length > 0 ? JSON.stringify(next) : '[]')
    },
    [images, onChange],
  )

  return (
    <div className="space-y-3">
      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {images.map((url, i) => (
            <div key={`${url}-${i}`} className="group relative overflow-hidden rounded-lg border">
              <div className="aspect-[4/3]">
                <img
                  src={url}
                  alt={`Gallery ${i + 1}`}
                  className="size-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23ccc"><rect width="24" height="24"/><text x="12" y="14" text-anchor="middle" font-size="6" fill="%23999">Error</text></svg>'
                  }}
                />
              </div>
              <div className="absolute inset-0 flex items-start justify-end bg-black/0 p-1.5 transition group-hover:bg-black/40">
                <button
                  type="button"
                  onClick={() => handleRemove(i)}
                  className="flex size-6 items-center justify-center rounded-full bg-background/90 text-destructive opacity-0 shadow-xs transition hover:bg-background group-hover:opacity-100"
                >
                  <X className="size-3.5" />
                </button>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                <p className="truncate text-[10px] text-white/80">{url.split('/').pop()}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {adding ? (
        <div className="rounded-lg border border-dashed p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <ImageIcon className="size-3.5" />
              Add new gallery image
            </span>
            <button
              type="button"
              onClick={() => setAdding(false)}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Cancel
            </button>
          </div>
          <ImageUpload
            value=""
            onChange={handleAdd}
            placeholder="Upload or paste image URL"
          />
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setAdding(true)}
          className="w-full"
        >
          <Plus className="size-4" />
          Add Image
        </Button>
      )}
    </div>
  )
}