import { db } from './db'

const portfolioCategories = [
  { name: 'Corporate', slug: 'corporate', icon: 'Building2' },
  { name: 'E-Commerce', slug: 'e-commerce', icon: 'ShoppingCart' },
  { name: 'Tourism', slug: 'tourism', icon: 'Plane' },
  { name: 'Healthcare', slug: 'healthcare', icon: 'HeartPulse' },
  { name: 'SaaS', slug: 'saas', icon: 'Cloud' },
  { name: 'Education', slug: 'education', icon: 'GraduationCap' },
  { name: 'Custom Systems', slug: 'custom-systems', icon: 'Settings2' },
]

const technologies = [
  { name: 'Laravel', slug: 'laravel', color: '#FF2D20' },
  { name: 'PHP', slug: 'php', color: '#777BB4' },
  { name: 'React', slug: 'react', color: '#61DAFB' },
  { name: 'Vue', slug: 'vue', color: '#42B883' },
  { name: 'Next.js', slug: 'nextjs', color: '#000000' },
  { name: 'PostgreSQL', slug: 'postgresql', color: '#4169E1' },
  { name: 'MySQL', slug: 'mysql', color: '#4479A1' },
  { name: 'TailwindCSS', slug: 'tailwindcss', color: '#06B6D4' },
  { name: 'TypeScript', slug: 'typescript', color: '#3178C6' },
  { name: 'Node.js', slug: 'nodejs', color: '#339933' },
  { name: 'Redis', slug: 'redis', color: '#DC382D' },
  { name: 'Docker', slug: 'docker', color: '#2496ED' },
  { name: 'Alpine.js', slug: 'alpinejs', color: '#8BC0D0' },
  { name: 'Filament', slug: 'filament', color: '#F97316' },
]

const services = [
  { title: 'Custom Website Development', slug: 'custom-website', icon: 'Code2', description: 'Bespoke, lightning-fast websites built with modern frameworks, tailored to your brand and optimized for conversion.', features: JSON.stringify(['Responsive Design','SEO Optimized','Performance Tuned','Accessibility Ready']) },
  { title: 'E-commerce Development', slug: 'ecommerce', icon: 'ShoppingCart', description: 'Scalable online stores with seamless checkout, inventory management, and integrated payment gateways.', features: JSON.stringify(['Payment Integration','Inventory Sync','Cart & Checkout','Analytics Dashboard']) },
  { title: 'Booking Platforms', slug: 'booking', icon: 'CalendarCheck', description: 'Real-time reservation and scheduling systems for clinics, hotels, salons, and service businesses.', features: JSON.stringify(['Real-time Availability','Automated Reminders','Multi-location','Calendar Sync']) },
  { title: 'SaaS Development', slug: 'saas', icon: 'Cloud', description: 'Multi-tenant SaaS applications with subscription billing, team management, and robust APIs.', features: JSON.stringify(['Multi-tenancy','Stripe Billing','Role Management','REST/GraphQL API']) },
  { title: 'Web Applications', slug: 'web-apps', icon: 'LayoutDashboard', description: 'Complex, data-driven web apps with dashboards, real-time updates, and rich interactivity.', features: JSON.stringify(['Real-time Updates','Custom Dashboards','Data Visualization','Role-based Access']) },
  { title: 'API Development', slug: 'api', icon: 'Webhook', description: 'Secure, documented, and versioned REST/GraphQL APIs that power web, mobile, and third-party integrations.', features: JSON.stringify(['OpenAPI Docs','Rate Limiting','OAuth2 / JWT','Versioned Endpoints']) },
  { title: 'SEO Optimization', slug: 'seo', icon: 'Search', description: 'Technical and on-page SEO that improves rankings, drives organic traffic, and grows revenue.', features: JSON.stringify(['Core Web Vitals','Schema Markup','Keyword Strategy','Content Audits']) },
  { title: 'AI Integration', slug: 'ai', icon: 'Sparkles', description: 'Embed LLMs, chatbots, semantic search, and intelligent automation directly into your products.', features: JSON.stringify(['Chatbots & Assistants','Semantic Search','RAG Pipelines','Workflow Automation']) },
]

const portfolios = [
  {
    title: 'Nexus Banking Dashboard', slug: 'nexus-banking',
    summary: 'A real-time banking analytics dashboard for a regional financial institution.',
    description: 'Nexus is a high-performance banking dashboard that unifies account analytics, transaction monitoring, and fraud detection into a single, secure interface.',
    coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80',
    gallery: '["https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80","https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80","https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&q=80"]',
    liveUrl: '#', clientName: 'Nexus Financial', year: 2024, featured: true,
    problem: 'Legacy banking portals were slow, fragmented, and lacked real-time fraud visibility.',
    solution: 'We rebuilt the platform on a modern stack with event-driven architecture and live data streaming.',
    result: 'Reduced fraud detection time by 87% and improved agent productivity by 3x.',
    challenge: 'Integrating with legacy core banking systems while maintaining strict compliance.',
    architecture: 'Microservices with Laravel + Redis pub/sub, React frontend, PostgreSQL warehouse.',
    implementation: 'Phased rollout over 4 months with zero downtime migrations.',
    outcome: 'Onboarded 12,000+ users in first month with 99.98% uptime.',
    features: '["Real-time transaction monitoring","Fraud detection alerts","Multi-account aggregation","Role-based access control","Exportable compliance reports"]',
    categorySlug: 'saas', techSlugs: ['laravel','react','postgresql','redis'],
  },
  {
    title: 'Wanderlust Travel Marketplace', slug: 'wanderlust',
    summary: 'A tourism marketplace connecting travelers with curated local experiences.',
    description: 'Wanderlust is a multilingual travel marketplace with dynamic pricing, instant booking, and immersive media galleries.',
    coverImage: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&q=80',
    gallery: '["https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&q=80","https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&q=80","https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=1200&q=80"]',
    liveUrl: '#', clientName: 'Wanderlust Inc.', year: 2024, featured: true,
    problem: 'Travelers struggled to discover authentic local experiences beyond generic tours.',
    solution: 'Built a curated marketplace with smart matching, reviews, and instant booking.',
    result: '40% increase in booking conversion and 2.5x growth in host signups.',
    challenge: 'Handling peak-season traffic spikes and multi-currency support.',
    architecture: 'Laravel + Vue, MySQL, Redis cache, CDN-backed media pipeline.',
    implementation: 'Horizontal scaling with queue workers and aggressive caching.',
    outcome: 'Processed 50,000+ bookings across 30 countries in year one.',
    features: '["Multi-currency support","Instant booking & payments","Host verification","Review system","Multilingual UI"]',
    categorySlug: 'tourism', techSlugs: ['laravel','vue','mysql','redis'],
  },
  {
    title: 'MediCare Clinic Platform', slug: 'medicare-clinic',
    summary: 'An end-to-end clinic management system with telemedicine and e-prescriptions.',
    description: 'MediCare streamlines patient journeys from booking to follow-up, with HIPAA-compliant telemedicine and integrated pharmacy workflows.',
    coverImage: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&q=80',
    gallery: '["https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&q=80","https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1200&q=80","https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?w=1200&q=80"]',
    liveUrl: '#', clientName: 'MediCare Group', year: 2023, featured: true,
    problem: 'Clinics juggled disconnected tools for scheduling, records, and prescriptions.',
    solution: 'Unified platform with patient portal, telemedicine, and e-prescriptions.',
    result: 'Cut patient wait times by 45% and doubled telehealth adoption.',
    challenge: 'HIPAA compliance and secure video streaming at scale.',
    architecture: 'Laravel API, React frontend, WebRTC telemedicine, encrypted storage.',
    implementation: 'Security-first approach with continuous penetration testing.',
    outcome: 'Deployed across 24 clinics serving 80,000+ patients.',
    features: '["Telemedicine video calls","E-prescriptions","Patient portal","Appointment scheduling","Lab integration"]',
    categorySlug: 'healthcare', techSlugs: ['laravel','react','mysql','redis'],
  },
  {
    title: 'ShopWave E-commerce', slug: 'shopwave',
    summary: 'A headless e-commerce storefront with sub-second page loads.',
    description: 'ShopWave delivers a blazing-fast shopping experience with AI-powered product recommendations and one-click checkout.',
    coverImage: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&q=80',
    gallery: '["https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&q=80","https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1200&q=80","https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&q=80"]',
    liveUrl: '#', clientName: 'ShopWave Retail', year: 2024, featured: true,
    problem: 'Slow storefronts were killing conversion rates during sales events.',
    solution: 'Headless architecture with edge caching and AI recommendations.',
    result: '3.2x faster loads and 28% lift in conversion during peak sales.',
    challenge: 'Migrating 50,000 SKUs without disrupting operations.',
    architecture: 'Headless Laravel + Next.js storefront, Redis, Algolia search.',
    implementation: 'Big-bang migration over a maintenance window with rollback plan.',
    outcome: 'Handled 200k concurrent users during Black Friday.',
    features: '["AI product recommendations","One-click checkout","Advanced search","Wishlist & reviews","Multi-warehouse inventory"]',
    categorySlug: 'e-commerce', techSlugs: ['laravel','nextjs','redis','mysql'],
  },
  {
    title: 'EduPro Learning Platform', slug: 'edupro',
    summary: 'A scalable LMS with live classrooms and AI-assisted grading.',
    description: 'EduPro empowers institutions to deliver online courses with interactive lessons, live classes, and automated assessments.',
    coverImage: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&q=80',
    gallery: '["https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&q=80","https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&q=80","https://images.unsplash.com/photo-1513258496099-48168024aec0?w=1200&q=80"]',
    liveUrl: '#', clientName: 'EduPro Academy', year: 2023, featured: false,
    problem: 'Schools needed a unified platform for remote and hybrid learning.',
    solution: 'Built a comprehensive LMS with live classes and AI grading.',
    result: 'Onboarded 40 institutions and 120,000 students.',
    challenge: 'Real-time video for 500+ concurrent classrooms.',
    architecture: 'Laravel + React, WebRTC, queue-based grading pipeline.',
    implementation: 'Iterative feature releases with educator feedback loops.',
    outcome: '94% student satisfaction and 60% reduction in grading time.',
    features: '["Live virtual classrooms","AI-assisted grading","Course builder","Certificates","Discussion forums"]',
    categorySlug: 'education', techSlugs: ['laravel','react','mysql','redis'],
  },
  {
    title: 'CorpFinance Corporate Site', slug: 'corpfinance',
    summary: 'A premium corporate website for a multinational finance firm.',
    description: 'A polished, content-rich corporate website with investor relations, news, and multilingual support.',
    coverImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80',
    gallery: '["https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80","https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200&q=80"]',
    liveUrl: '#', clientName: 'CorpFinance Ltd.', year: 2023, featured: false,
    problem: 'Outdated site failed to convey trust and modern capabilities.',
    solution: 'Premium redesign with CMS-driven content and SEO structure.',
    result: '65% increase in qualified inbound leads.',
    challenge: 'Strict brand guidelines and legal review cycles.',
    architecture: 'Laravel + Blade, Filament CMS, CDN delivery.',
    implementation: 'Design system first, then component-driven build.',
    outcome: 'Top 3 ranking for 12 target keywords within 6 months.',
    features: '["Multilingual support","Investor portal","News & insights","CMS managed","SEO optimized"]',
    categorySlug: 'corporate', techSlugs: ['laravel','mysql','tailwindcss'],
  },
  {
    title: 'LogiTrack Fleet System', slug: 'logitrack',
    summary: 'A real-time fleet tracking and logistics management system.',
    description: 'LogiTrack provides live GPS tracking, route optimization, and predictive maintenance for logistics fleets.',
    coverImage: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&q=80',
    gallery: '["https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&q=80","https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=1200&q=80"]',
    liveUrl: '#', clientName: 'LogiTrack Operations', year: 2024, featured: false,
    problem: 'Manual dispatch led to inefficiencies and high fuel costs.',
    solution: 'Real-time tracking with AI route optimization.',
    result: 'Reduced fuel costs by 22% and improved on-time delivery by 35%.',
    challenge: 'Processing high-frequency telemetry from thousands of vehicles.',
    architecture: 'Laravel + Redis Streams, React dashboard, IoT ingestion.',
    implementation: 'Pilot with 50 vehicles, then scaled to full fleet.',
    outcome: 'Manages 3,500+ vehicles across 8 cities.',
    features: '["Live GPS tracking","Route optimization","Predictive maintenance","Driver scoring","Fuel analytics"]',
    categorySlug: 'custom-systems', techSlugs: ['laravel','react','redis','mysql'],
  },
  {
    title: 'Aurora AI Assistant', slug: 'aurora-ai',
    summary: 'An AI-powered customer support assistant with RAG over knowledge bases.',
    description: 'Aurora is an enterprise AI assistant that answers customer queries using retrieval-augmented generation over company docs.',
    coverImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&q=80',
    gallery: '["https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&q=80","https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200&q=80"]',
    liveUrl: '#', clientName: 'Aurora AI', year: 2024, featured: true,
    problem: 'Support teams were overwhelmed by repetitive queries.',
    solution: 'RAG-based assistant grounded in the company knowledge base.',
    result: 'Resolved 68% of tickets autonomously with 95% accuracy.',
    challenge: 'Preventing hallucinations on sensitive enterprise data.',
    architecture: 'Laravel + Vector DB, OpenAI API, streaming responses.',
    implementation: 'Iterative grounding with human-in-the-loop evaluation.',
    outcome: 'Cut average response time from 4 hours to 12 seconds.',
    features: '["RAG over knowledge base","Streaming responses","Human handoff","Multilingual","Analytics dashboard"]',
    categorySlug: 'custom-systems', techSlugs: ['laravel','react','redis','php'],
  },
]

const blogCategories = [
  { name: 'Web Development', slug: 'web-development', icon: 'Code2' },
  { name: 'Design', slug: 'design', icon: 'Palette' },
  { name: 'SEO', slug: 'seo', icon: 'Search' },
  { name: 'Business', slug: 'business', icon: 'TrendingUp' },
  { name: 'AI & Automation', slug: 'ai', icon: 'Sparkles' },
]

const tags = ['Laravel','React','Performance','Tutorial','Tips','Trends','Case Study','Best Practices','TypeScript','Tailwind','AI','SEO','Design']

const blogPosts = [
  {
    title: '10 Performance Optimization Techniques for Laravel Applications', slug: 'laravel-performance-optimization',
    excerpt: 'Discover proven techniques to make your Laravel apps blazing fast, from query optimization to caching strategies.',
    content: `# 10 Performance Optimization Techniques for Laravel Applications\n\nPerformance is critical for user experience and SEO. Here are battle-tested techniques we use across production Laravel apps.\n\n## 1. Optimize Database Queries\n\nUse eager loading to avoid the N+1 problem.\n\n\`\`\`php\n$posts = Post::with(['author', 'category'])->get();\n\`\`\`\n\n## 2. Leverage Caching\n\nCache expensive queries and computed results with Redis.\n\n## 3. Use Queue for Heavy Jobs\n\nPush emails, reports, and processing to background queues.\n\n## 4. Enable OPcache\n\nOPcache dramatically reduces PHP bootstrap time in production.\n\n## 5. Optimize Autoloader\n\nRun \`composer install --optimize-autoloader --no-dev\` in production.\n\n## 6. Database Indexing\n\nAdd indexes to frequently queried columns.\n\n## 7. Use Eloquent Select\n\nSelect only the columns you need.\n\n## 8. Minimize Middleware\n\nRemove unused middleware from routes.\n\n## 9. HTTP Caching\n\nSet proper cache headers for static assets.\n\n## 10. Profile with Laravel Telescope\n\nIdentify bottlenecks with Telescope and Blackfire.\n\n## Conclusion\n\nPerformance is an ongoing effort. Measure, optimize, and monitor continuously.`,
    coverImage: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=1200&q=80', readingTime: 8, authorName: 'Sarah Chen', featured: true, categorySlug: 'web-development', tagNames: ['Laravel','Performance','Best Practices'],
  },
  {
    title: 'Why Headless CMS is the Future of Content Management', slug: 'headless-cms-future',
    excerpt: 'Explore how headless CMS architectures empower teams to deliver content across any channel, faster.',
    content: `# Why Headless CMS is the Future\n\nTraditional CMS platforms tightly couple content with presentation. Headless CMS separates them, unlocking flexibility.\n\n## What is a Headless CMS?\n\nA headless CMS stores content and delivers it via API, letting you build any frontend.\n\n## Benefits\n\n- **Omnichannel delivery** — web, mobile, IoT, kiosks\n- **Developer freedom** — choose any stack\n- **Better performance** — static generation + CDN\n- **Scalability** — decoupled scaling\n\n## When to Choose Headless\n\n- Multiple frontends\n- Content reuse across channels\n- Performance-critical sites\n\n## Conclusion\n\nHeadless CMS is not a silver bullet, but for modern digital products, it provides unmatched flexibility.`,
    coverImage: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&q=80', readingTime: 6, authorName: 'Marcus Reid', featured: false, categorySlug: 'web-development', tagNames: ['Trends','Best Practices'],
  },
  {
    title: 'A Complete Guide to Core Web Vitals in 2024', slug: 'core-web-vitals-2024',
    excerpt: 'LCP, INP, CLS — master the metrics that affect your rankings and user experience.',
    content: `# Core Web Vitals in 2024\n\nGoogle's Core Web Vitals directly impact search rankings. Here's how to ace them.\n\n## LCP (Largest Contentful Paint)\n\nTarget: under 2.5 seconds. Optimize images, fonts, and server response.\n\n## INP (Interaction to Next Paint)\n\nReplaced FID in 2024. Target under 200ms. Reduce JavaScript blocking.\n\n## CLS (Cumulative Layout Shift)\n\nTarget under 0.1. Reserve space for images and ads.\n\n## Tools to Measure\n\n- PageSpeed Insights\n- Lighthouse\n- Search Console\n\n## Conclusion\n\nCore Web Vitals are a ranking factor and a UX win. Monitor them continuously.`,
    coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80', readingTime: 7, authorName: 'Aisha Khan', featured: true, categorySlug: 'seo', tagNames: ['SEO','Performance','Best Practices'],
  },
  {
    title: 'Designing Accessible Web Interfaces: A Practical Guide', slug: 'accessible-web-interfaces',
    excerpt: 'Accessibility is not optional. Learn practical techniques to build inclusive interfaces.',
    content: `# Designing Accessible Web Interfaces\n\n1 in 6 people live with a disability. Accessibility ensures everyone can use your product.\n\n## Semantic HTML\n\nUse proper HTML elements: buttons, headings, landmarks.\n\n## Keyboard Navigation\n\nEvery interactive element must be keyboard accessible.\n\n## Color Contrast\n\nMaintain WCAG AA contrast ratios (4.5:1 for text).\n\n## ARIA Labels\n\nUse ARIA when semantic HTML isn't enough.\n\n## Screen Reader Testing\n\nTest with NVDA, VoiceOver, and TalkBack.\n\n## Conclusion\n\nAccessibility benefits everyone, not just users with disabilities.`,
    coverImage: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&q=80', readingTime: 6, authorName: 'Sarah Chen', featured: false, categorySlug: 'design', tagNames: ['Design','Best Practices','Tips'],
  },
  {
    title: 'Building Real-time Apps with WebSockets and Laravel', slug: 'realtime-laravel-websockets',
    excerpt: 'Add live updates, notifications, and collaboration features to your Laravel apps.',
    content: `# Real-time Apps with WebSockets\n\nReal-time features transform user engagement. Here's how to add them to Laravel.\n\n## Broadcasting Events\n\nLaravel's broadcasting makes real-time events trivial.\n\n## Drivers\n\nChoose Pusher, Redis, or self-hosted Soketi.\n\n## Frontend Integration\n\nUse Laravel Echo with Pusher or Socket.io.\n\n## Presence Channels\n\nTrack who's online with presence channels.\n\n## Conclusion\n\nReal-time features delight users and differentiate products.`,
    coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&q=80', readingTime: 7, authorName: 'Marcus Reid', featured: false, categorySlug: 'web-development', tagNames: ['Laravel','Tutorial','Best Practices'],
  },
  {
    title: 'How AI is Transforming Web Development Workflows', slug: 'ai-transforming-web-development',
    excerpt: 'From code generation to automated testing, AI is reshaping how we build for the web.',
    content: `# AI in Web Development\n\nAI tools are augmenting developers, not replacing them. Here's how to leverage them.\n\n## Code Generation\n\nAI pair programmers accelerate boilerplate and refactoring.\n\n## Automated Testing\n\nGenerate test cases and edge scenarios with AI.\n\n## Content & Copy\n\nAI drafts marketing copy, alt text, and documentation.\n\n## Design\n\nGenerate layouts, color palettes, and assets.\n\n## Conclusion\n\nEmbrace AI as a collaborator to ship faster and smarter.`,
    coverImage: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200&q=80', readingTime: 5, authorName: 'Aisha Khan', featured: false, categorySlug: 'ai', tagNames: ['AI','Trends','Tips'],
  },
]

const caseStudies = [
  {
    title: 'Scaling a Fintech Platform to 1M Users', slug: 'fintech-scaling',
    clientName: 'Nexus Financial', industry: 'Fintech',
    coverImage: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=1200&q=80',
    summary: 'How we re-architected a banking platform to handle explosive growth while maintaining 99.98% uptime.',
    problem: 'The platform was buckling under rapid user growth, with frequent outages and slow queries.',
    analysis: 'We identified database bottlenecks, inefficient queries, and synchronous processing as primary culprits.',
    architecture: 'Migrated to read replicas, introduced Redis caching, and moved heavy jobs to async queues.',
    process: 'Phased rollout: caching first, then read replicas, then queue migration, with continuous monitoring.',
    challenges: 'Zero-downtime migration of a live financial system with strict compliance requirements.',
    results: 'Scaled to 1M users, 99.98% uptime, 4x faster response times, and 60% lower infrastructure costs.',
    lessons: 'Invest in observability early. Premature optimization without measurement wastes effort.',
    metrics: '[{"label":"Users","value":"1M+"},{"label":"Uptime","value":"99.98%"},{"label":"Response Time","value":"4x faster"},{"label":"Cost Reduction","value":"60%"}]',
    featured: true,
  },
  {
    title: 'Rebuilding an E-commerce Brand for Black Friday', slug: 'ecommerce-black-friday',
    clientName: 'ShopWave Retail', industry: 'E-Commerce',
    coverImage: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&q=80',
    summary: 'A headless rebuild that tripled conversion rates during peak traffic events.',
    problem: 'The legacy storefront crashed during sales, losing revenue and damaging brand trust.',
    analysis: 'Monolithic architecture with server-side rendering was the bottleneck at scale.',
    architecture: 'Headless Laravel API + Next.js storefront with edge caching and CDN.',
    process: 'Built new storefront in parallel, migrated catalog, then cut over during a maintenance window.',
    challenges: 'Migrating 50,000 SKUs and preserving SEO rankings during the switch.',
    results: '3.2x faster loads, 28% conversion lift, 200k concurrent users handled smoothly.',
    lessons: 'Edge caching and static generation are game-changers for traffic spikes.',
    metrics: '[{"label":"Page Load","value":"3.2x faster"},{"label":"Conversion","value":"+28%"},{"label":"Peak Users","value":"200k"},{"label":"Revenue","value":"+45%"}]',
    featured: true,
  },
  {
    title: 'Launching a Telemedicine Platform in 90 Days', slug: 'telemedicine-launch',
    clientName: 'MediCare Group', industry: 'Healthcare',
    coverImage: 'https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?w=1200&q=80',
    summary: 'Rapid delivery of a HIPAA-compliant telemedicine platform during a critical window.',
    problem: 'Clinics needed remote care capabilities immediately due to changing patient expectations.',
    analysis: 'Existing tools were fragmented and could not be adapted quickly enough.',
    architecture: 'Laravel API, React frontend, WebRTC video, encrypted at-rest storage.',
    process: 'Aggressive MVP scope, weekly releases, security reviews at each milestone.',
    challenges: 'HIPAA compliance and secure real-time video under tight timelines.',
    results: 'Deployed in 90 days, 24 clinics onboarded, 80,000+ patients served.',
    lessons: 'Security-first design accelerates rather than slows delivery when done right.',
    metrics: '[{"label":"Time to Launch","value":"90 days"},{"label":"Clinics","value":"24"},{"label":"Patients","value":"80k+"},{"label":"Telehealth Adoption","value":"2x"}]',
    featured: false,
  },
]

const testimonials = [
  { clientName: 'David Martinez', role: 'CEO', company: 'Nexus Financial', rating: 5, quote: 'They transformed our banking platform. The attention to detail and technical expertise are unmatched. We scaled to a million users without a hitch.' },
  { clientName: 'Emily Roberts', role: 'Founder', company: 'Wanderlust Inc.', rating: 5, quote: 'Our marketplace went from idea to 50,000 bookings in a year. The team delivered beyond expectations, on time and on budget.' },
  { clientName: 'Dr. James Patel', role: 'Medical Director', company: 'MediCare Group', rating: 5, quote: 'The telemedicine platform they built has revolutionized how we deliver care. Patient satisfaction has never been higher.' },
  { clientName: 'Laura Bennett', role: 'CMO', company: 'ShopWave Retail', rating: 5, quote: 'Black Friday used to be a nightmare. Now it is our best-performing day. Their headless rebuild paid for itself in weeks.' },
  { clientName: 'Michael Tran', role: 'CTO', company: 'LogiTrack Operations', rating: 5, quote: 'The fleet system reduced our fuel costs by 22%. Their understanding of real-time systems is exceptional.' },
  { clientName: 'Sofia Almeida', role: 'Principal', company: 'EduPro Academy', rating: 5, quote: 'They built an LMS that our teachers actually love using. The AI grading alone saves us hundreds of hours each month.' },
]

const teamMembers = [
  { name: 'Alex Morgan', role: 'Founder & Lead Architect', bio: '15+ years building scalable web platforms. Former tech lead at two unicorns.', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80', linkedin: '#', github: '#', order: 1 },
  { name: 'Sarah Chen', role: 'Senior Full-Stack Engineer', bio: 'Laravel & React specialist passionate about clean architecture and developer experience.', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80', linkedin: '#', github: '#', order: 2 },
  { name: 'Marcus Reid', role: 'UI/UX Design Lead', bio: 'Design systems advocate. Crafts interfaces that are beautiful, accessible, and conversion-focused.', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80', linkedin: '#', twitter: '#', order: 3 },
  { name: 'Aisha Khan', role: 'SEO & Growth Strategist', bio: 'Data-driven marketer who turns organic traffic into qualified leads and revenue.', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80', linkedin: '#', twitter: '#', order: 4 },
  { name: 'Tom Becker', role: 'DevOps Engineer', bio: 'CI/CD, cloud architecture, and observability expert. Keeps deployments boring and reliable.', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80', linkedin: '#', github: '#', order: 5 },
  { name: 'Priya Nair', role: 'QA & Automation Lead', bio: 'Quality champion who believes bugs are best caught before users find them.', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80', linkedin: '#', order: 6 },
]

const faqs = [
  { question: 'How long does a typical project take?', answer: 'Most projects range from 4 to 12 weeks depending on scope. A landing page can take 1-2 weeks, while a full SaaS platform may take 3-6 months. We provide a detailed timeline after the discovery phase.', category: 'Process', order: 1 },
  { question: 'What is your pricing model?', answer: 'We offer fixed-price projects for well-defined scopes and retainer models for ongoing work. Typical projects start at $2,000 for a marketing site and range up to $50,000+ for complex platforms. Use our estimator for an instant quote.', category: 'Pricing', order: 2 },
  { question: 'Do you provide ongoing maintenance and support?', answer: 'Yes. Every project includes a 30-day post-launch support window. We also offer monthly maintenance plans covering updates, monitoring, security patches, and feature iterations.', category: 'Support', order: 3 },
  { question: 'Which technologies do you specialize in?', answer: 'Our core stack is Laravel, PHP, React, Vue, Next.js, MySQL, PostgreSQL, and TailwindCSS. We also work with Redis, Docker, and integrate AI/LLM capabilities when needed.', category: 'Technical', order: 4 },
  { question: 'Can you work with our existing codebase?', answer: 'Absolutely. We frequently join existing projects, perform code audits, and either extend the codebase or plan a gradual migration. We adapt to your architecture and standards.', category: 'Process', order: 5 },
  { question: 'Do you handle hosting and deployment?', answer: 'We deploy to your preferred environment — cPanel shared hosting, VPS, or cloud (AWS, DigitalOcean). We set up CI/CD pipelines and provide deployment documentation for your team.', category: 'Technical', order: 6 },
  { question: 'Will my website be SEO-friendly?', answer: 'Yes. Every site we build follows SEO best practices: semantic HTML, fast load times, structured data, sitemaps, and meta management. We also offer dedicated SEO optimization services.', category: 'SEO', order: 7 },
  { question: 'How do we get started?', answer: 'Reach out via our contact form or book a consultation. We will schedule a discovery call, understand your goals, and send a proposal within 2-3 business days.', category: 'Process', order: 8 },
]

async function main() {
  console.log('Seeding database...')

  // Clean
  await db.lead.deleteMany()
  await db.contactRequest.deleteMany()
  await db.faq.deleteMany()
  await db.teamMember.deleteMany()
  await db.testimonial.deleteMany()
  await db.caseStudy.deleteMany()
  await db.blogPost.deleteMany()
  await db.tag.deleteMany()
  await db.blogCategory.deleteMany()
  await db.service.deleteMany()
  await db.technology.deleteMany()
  await db.portfolio.deleteMany()
  await db.portfolioCategory.deleteMany()
  await db.setting.deleteMany()

  // Categories
  const catMap: Record<string, string> = {}
  for (const c of portfolioCategories) {
    const cat = await db.portfolioCategory.create({ data: c })
    catMap[c.slug] = cat.id
  }

  // Technologies
  const techMap: Record<string, string> = {}
  for (const t of technologies) {
    const tech = await db.technology.create({ data: t })
    techMap[t.slug] = tech.id
  }

  // Services
  for (const s of services) {
    await db.service.create({ data: s })
  }

  // Portfolios
  for (const p of portfolios) {
    const { categorySlug, techSlugs, ...data } = p
    await db.portfolio.create({
      data: {
        ...data,
        categoryId: catMap[categorySlug],
        technologies: { connect: techSlugs.map((s) => ({ id: techMap[s] })) },
      },
    })
  }

  // Blog categories
  const blogCatMap: Record<string, string> = {}
  for (const c of blogCategories) {
    const cat = await db.blogCategory.create({ data: c })
    blogCatMap[c.slug] = cat.id
  }

  // Tags
  const tagMap: Record<string, string> = {}
  for (const name of tags) {
    const tag = await db.tag.create({ data: { name, slug: name.toLowerCase().replace(/\s+/g, '-') } })
    tagMap[name] = tag.id
  }

  // Blog posts
  for (const post of blogPosts) {
    const { categorySlug, tagNames, ...data } = post
    await db.blogPost.create({
      data: {
        ...data,
        categoryId: blogCatMap[categorySlug],
        tags: { connect: tagNames.map((n) => ({ id: tagMap[n] })) },
      },
    })
  }

  // Case studies
  for (const cs of caseStudies) {
    await db.caseStudy.create({ data: cs })
  }

  // Testimonials
  for (const t of testimonials) {
    await db.testimonial.create({ data: t })
  }

  // Team members
  for (const tm of teamMembers) {
    await db.teamMember.create({ data: tm })
  }

  // FAQs
  for (const f of faqs) {
    await db.faq.create({ data: f })
  }

  // Settings
  const settings = [
    { key: 'site_name', value: 'DevStudio' },
    { key: 'tagline', value: 'We Build Fast, Scalable and Modern Digital Products' },
    { key: 'email', value: 'hello@devstudio.com' },
    { key: 'phone', value: '+1 (555) 123-4567' },
    { key: 'address', value: '123 Innovation Drive, San Francisco, CA' },
    { key: 'stats_projects', value: '180' },
    { key: 'stats_experience', value: '12' },
    { key: 'stats_satisfaction', value: '98' },
    { key: 'stats_technologies', value: '25' },
  ]
  for (const s of settings) {
    await db.setting.create({ data: s })
  }

  console.log('Seed complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
