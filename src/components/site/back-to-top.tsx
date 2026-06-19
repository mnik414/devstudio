'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUp } from 'lucide-react'
import { useT } from '@/lib/lang-store'
import { cn } from '@/lib/utils'

export function BackToTop() {
  const t = useT()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      const showButton = window.scrollY > 600
      // Hide button when the footer is in view to avoid covering footer content
      const footer = document.querySelector('footer')
      if (footer && showButton) {
        const footerRect = footer.getBoundingClientRect()
        const viewportH = window.innerHeight
        // If footer top is within the bottom 120px of viewport, hide the button
        const footerInView = footerRect.top < viewportH - 60
        setVisible(showButton && !footerInView)
      } else {
        setVisible(showButton)
      }
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 10 }}
          transition={{ duration: 0.2 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label={t('backToTop')}
          className={cn(
            'fixed bottom-6 z-40 grid h-11 w-11 place-items-center rounded-full',
            'border border-border/60 bg-card/90 text-foreground shadow-soft backdrop-blur',
            'transition hover:border-primary/40 hover:text-primary hover:shadow-glow',
            'ltr:right-6 rtl:left-6',
          )}
        >
          <ArrowUp className="h-5 w-5" />
        </motion.button>
      )}
    </AnimatePresence>
  )
}
