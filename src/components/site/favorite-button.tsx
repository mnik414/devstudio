'use client'

import { Bookmark, BookmarkCheck } from 'lucide-react'
import { useFavorites } from '@/lib/favorites-store'
import { useT } from '@/lib/lang-store'
import { cn } from '@/lib/utils'

export function FavoriteButton({
  id,
  className,
  size = 'sm',
}: {
  id: string
  className?: string
  size?: 'sm' | 'md'
}) {
  const t = useT()
  const has = useFavorites((s) => s.ids.includes(id))
  const toggle = useFavorites((s) => s.toggle)

  const iconSize = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation()
        e.preventDefault()
        toggle(id)
      }}
      aria-label={has ? t('favorites.saved') : t('favorites.save')}
      className={cn(
        'grid place-items-center rounded-full transition-all duration-200',
        size === 'sm' ? 'h-8 w-8' : 'h-9 w-9',
        has
          ? 'bg-accent/15 text-accent hover:bg-accent/25'
          : 'bg-background/80 text-muted-foreground backdrop-blur hover:text-foreground hover:bg-background',
        className,
      )}
    >
      {has ? (
        <BookmarkCheck className={cn(iconSize, 'fill-current')} />
      ) : (
        <Bookmark className={iconSize} />
      )}
    </button>
  )
}
