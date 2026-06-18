'use client'

import { Reveal } from './reveal'
import { cn } from '@/lib/utils'
import { type ReactNode } from 'react'

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'center',
  className,
}: {
  eyebrow?: string
  title: ReactNode
  description?: ReactNode
  align?: 'center' | 'left'
  className?: string
}) {
  return (
    <Reveal className={cn('max-w-2xl', align === 'center' ? 'mx-auto text-center' : 'text-left', className)}>
      {eyebrow && (
        <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          {eyebrow}
        </span>
      )}
      <h2 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl md:text-[2.6rem] md:leading-[1.1]">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
          {description}
        </p>
      )}
    </Reveal>
  )
}
