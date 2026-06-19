'use client'

import { Navbar } from '@/components/site/navbar'
import { Footer } from '@/components/site/footer'
import { ScrollProgress } from '@/components/site/scroll-progress'
import { BackToTop } from '@/components/site/back-to-top'
import { CookieConsent } from '@/components/site/cookie-consent'
import { useNav } from '@/lib/store'
import { HomeView } from '@/components/views/home-view'
import { PortfolioView } from '@/components/views/portfolio-view'
import { PortfolioDetailView } from '@/components/views/portfolio-detail-view'
import { CaseStudiesView } from '@/components/views/case-studies-view'
import { CaseStudyDetailView } from '@/components/views/case-study-detail-view'
import { BlogView } from '@/components/views/blog-view'
import { BlogDetailView } from '@/components/views/blog-detail-view'
import { ContactView } from '@/components/views/contact-view'
import { EstimateView } from '@/components/views/estimate-view'
import { AboutView } from '@/components/views/about-view'
import { AdminView } from '@/components/views/admin-view'
import { AnimatePresence, motion } from 'framer-motion'

export default function Page() {
  const { view, detailSlug } = useNav()

  const renderView = () => {
    if (view === 'portfolio' && detailSlug) return <PortfolioDetailView />
    if (view === 'blog' && detailSlug) return <BlogDetailView />
    if (view === 'case-studies' && detailSlug) return <CaseStudyDetailView />

    switch (view) {
      case 'portfolio':
        return <PortfolioView />
      case 'case-studies':
        return <CaseStudiesView />
      case 'blog':
        return <BlogView />
      case 'contact':
        return <ContactView />
      case 'estimate':
        return <EstimateView />
      case 'about':
        return <AboutView />
      case 'admin':
        return <AdminView />
      default:
        return <HomeView />
    }
  }

  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main className="flex-1 pt-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={view + (detailSlug ?? '')}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
      <BackToTop />
      <CookieConsent />
    </>
  )
}
