'use client'

import { useLang } from '@/lib/lang-store'
import { Languages } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { LANGS } from '@/lib/i18n'

export function LanguageToggle() {
  const { lang, setLang } = useLang()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-1.5 rounded-full px-2.5" aria-label="Switch language">
          <Languages className="h-[1.1rem] w-[1.1rem]" />
          <span className="text-xs font-semibold uppercase">{lang}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[140px]">
        {LANGS.map((l) => (
          <DropdownMenuItem
            key={l.code}
            onClick={() => setLang(l.code)}
            className={`gap-2 ${lang === l.code ? 'bg-accent/10' : ''}`}
          >
            <span className="text-base">{l.flag}</span>
            <span className="flex-1">{l.label}</span>
            {lang === l.code && <span className="h-1.5 w-1.5 rounded-full bg-accent" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
