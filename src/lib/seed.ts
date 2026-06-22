import { db } from './db'
import { hashPassword } from './auth/admin-auth'

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
    title: 'داشبورد بانکی پارسیان', slug: 'parsian-banking',
    summary: 'داشبورد تحلیلی بلادرنگ بانکی برای یک مؤسسه مالی منطقه‌ای.',
    description: 'پارسیان یک داشبورد بانکی با عملکرد بالا است که تحلیل حساب، نظارت بر تراکنش‌ها و تشخیص تقلب را در یک رابط امن واحد یکپارچه می‌کند.',
    coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80',
    gallery: '["https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80","https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80","https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&q=80"]',
    liveUrl: '#', clientName: 'گروه مالی پارسیان', year: 2024, featured: true,
    problem: 'پورتال‌های بانکی قدیمی کند، پراکنده و فاقد دید بلادرنگ تقلب بودند.',
    solution: 'پلتفرم را با معماری رویدادمحور و جریان داده زنده بازسازی کردیم.',
    result: 'زمان تشخیص تقلب ۸۷٪ کاهش یافت و بهره‌وری اپراتور ۳ برابر شد.',
    challenge: 'یکپارچه‌سازی با سیستم‌های بانکی قدیمی با حفظ انطباق سختگیرانه.',
    architecture: 'میکروسرویس‌ها با Laravel + Redis pub/sub، فرانت‌اند React، انبار داده PostgreSQL.',
    implementation: 'استقرار مرحله‌ای طی ۴ ماه با مهاجرت بدون قطعی.',
    outcome: 'در ماه اول ۱۲,۰۰۰+ کاربر ثبت‌نام کردند با ۹۹.۹۸٪ زمان فعالیت.',
    features: '["نظارت بلادرنگ تراکنش","هشدار تشخیص تقلب","تجمع چندحسابی","کنترل دسترسی مبتنی بر نقش","گزارش‌های منطبق با مقررات"]',
    categorySlug: 'saas', techSlugs: ['laravel','react','postgresql','redis'],
  },
  {
    title: 'بازار سفر سیرنگ', slug: 'sirang-travel',
    summary: 'بازارگاه گردشگری که مسافران را با تجربیات محلی منتخب متصل می‌کند.',
    description: 'سیرنگ یک بازارگاه گردشگری چندزبانه با قیمت‌گذاری پویا، رزرو فوری و گالری‌های رسانه‌ای جذاب است.',
    coverImage: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&q=80',
    gallery: '["https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&q=80","https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&q=80","https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=1200&q=80"]',
    liveUrl: '#', clientName: 'سیرنگ گشت', year: 2024, featured: true,
    problem: 'مسافران برای کشف تجربیات معتبر محلی فراتر از تورهای عمومی مشکل داشتند.',
    solution: 'بازارگاهی با تطبیق هوشمند، نظرات و رزرو فوری ساختیم.',
    result: '۴۰٪ افزایش در تبدیل رزرو و ۲.۵ برابر رشد ثبت‌نام میزبانان.',
    challenge: 'مدیریت افزایش ترافیک فصلی و پشتیبانی از چند ارز.',
    architecture: 'Laravel + Vue، MySQL، کش Redis، خط لوله رسانه با پشتیبانی CDN.',
    implementation: 'مقیاس‌سازی افقی با کارگران صف و کشف تهاجمی.',
    outcome: 'پردازش ۵۰,۰۰۰+ رزرو در ۳۰ کشور در سال اول.',
    features: '["پشتیبانی چندارزی","رزرو و پرداخت فوری","تأیید میزبان","سیستم نظرات","رابط کاربری چندزبانه"]',
    categorySlug: 'tourism', techSlugs: ['laravel','vue','mysql','redis'],
  },
  {
    title: 'پلتفرم کلینیک بهداشت', slug: 'behdasht-clinic',
    summary: 'سیستم مدیریت کلینیک سرتاسری با پزشکی از راه دور و نسخه الکترونیکی.',
    description: 'بهداشت سفر بیماران را از رزرو تا پیگیری، با پزشکی از راه دور منطبق با HIPAA و گردش کار داروخانه یکپارچه ساده می‌کند.',
    coverImage: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&q=80',
    gallery: '["https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&q=80","https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1200&q=80","https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?w=1200&q=80"]',
    liveUrl: '#', clientName: 'گروه بهداشت', year: 2023, featured: true,
    problem: 'کلینیک‌ها ابزارهای ناپیوسته برای زمان‌بندی، سوابق و نسخه‌ها داشتند.',
    solution: 'پلتفرم یکپارچه با پورتال بیمار، پزشکی از راه دور و نسخه الکترونیکی.',
    result: 'زمان انتظار بیمار را ۴۵٪ کاهش داد و پذیرش پزشکی از راه دور را دو برابر کرد.',
    challenge: 'انطباق با HIPAA و استریم ویدئوی امن در مقیاس.',
    architecture: 'API Laravel، فرانت‌اند React، پزشکی از راه دور WebRTC، ذخیره‌سازی رمزگذاری‌شده.',
    implementation: 'رویکرد امنیت‌محور با تست نفوذ مستمر.',
    outcome: 'در ۲۴ کلینیک مستقر شد و به ۸۰,۰۰۰+ بیمار خدمات رساند.',
    features: '["تماس ویدئویی پزشکی از راه دور","نسخه الکترونیکی","پورتال بیمار","زمان‌بندی نوبت","یکپارچه‌سازی آزمایشگاه"]',
    categorySlug: 'healthcare', techSlugs: ['laravel','react','mysql','redis'],
  },
  {
    title: 'فروشگاه آنلاین کالا', slug: 'kala-online',
    summary: 'ویترین فروشگاهی بدون سرور با بارگذاری صفحه زیر ثانیه.',
    description: 'کالا تجربه خرید فوق‌العاده سریعی با پیشنهاد محصول مبتنی بر هوش مصنوعی و پرداخت یک‌کلیک ارائه می‌دهد.',
    coverImage: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&q=80',
    gallery: '["https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&q=80","https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1200&q=80","https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&q=80"]',
    liveUrl: '#', clientName: 'فروشگاه کالا', year: 2024, featured: true,
    problem: 'ویترین‌های کند باعث کاهش نرخ تبدیل در رویدادهای فروش شده بودند.',
    solution: 'معماری بدون سرور با کش لبه و پیشنهادهای هوش مصنوعی.',
    result: '۳.۲ برابر بارگذاری سریع‌تر و ۲۸٪ افزایش تبدیل در فروش اوج.',
    challenge: 'مهاجرت ۵۰,۰۰۰ SKU بدون اختلال در عملیات.',
    architecture: 'بدون سرور Laravel + ویترین Next.js، Redis، جستجوی Algolia.',
    implementation: 'مهاجرت یکباره در پنجره نگهداری با برنامه بازگشت.',
    outcome: 'مدیریت ۲۰۰ هزار کاربر همزمان در جمعه سیاه.',
    features: '["پیشنهاد محصول با هوش مصنوعی","پرداخت یک‌کلیک","جستجوی پیشرفته","لیست علاقه‌مندی‌ها و نظرات","مدیریت موجودی چندانباری"]',
    categorySlug: 'e-commerce', techSlugs: ['laravel','nextjs','redis','mysql'],
  },
  {
    title: 'پلتفرم آموزشی دانش', slug: 'danesh-learning',
    summary: 'یک LMS مقیاس‌پذیر با کلاس‌های زنده و نمره‌دهی هوش مصنوعی.',
    description: 'دانش به مؤسسات قدرت می‌دهد تا دوره‌های آنلاین با درس‌های تعاملی، کلاس‌های زنده و ارزیابی خودکار ارائه دهند.',
    coverImage: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&q=80',
    gallery: '["https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&q=80","https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&q=80","https://images.unsplash.com/photo-1513258496099-48168024aec0?w=1200&q=80"]',
    liveUrl: '#', clientName: 'آکادمی دانش', year: 2023, featured: false,
    problem: 'مدارس به پلتفرمی یکپارچه برای یادگیری از راه دور و ترکیبی نیاز داشتند.',
    solution: 'LMS جامعی با کلاس‌های زنده و نمره‌دهی هوش مصنوعی ساختیم.',
    result: '۴۰ مؤسسه و ۱۲۰,۰۰۰ دانش‌آموز ثبت‌نام کردند.',
    challenge: 'ویدیوی بلادرنگ برای ۵۰۰+ کلاس همزمان.',
    architecture: 'Laravel + React، WebRTC، خط لوله نمره‌دهی مبتنی بر صف.',
    implementation: 'انتشار تدریجی ویژگی‌ها با حلقه بازخورد مربیان.',
    outcome: '۹۴٪ رضایت دانش‌آموزان و ۶۰٪ کاهش زمان نمره‌دهی.',
    features: '["کلاس‌های مجازی زنده","نمره‌دهی با هوش مصنوعی","سازنده دوره","گواهینامه‌ها","انجمن‌های بحث"]',
    categorySlug: 'education', techSlugs: ['laravel','react','mysql','redis'],
  },
  {
    title: 'ارتباطات پیشرو', slug: 'ertebatat-pishro',
    summary: 'وب‌سایت شرکتی حرفه‌ای برای یک شرکت چندملیتی مخابرات.',
    description: 'یک وب‌سایت شرکتی محتواگرا با روابط سرمایه‌گذاران، اخبار و پشتیبانی چندزبانه.',
    coverImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80',
    gallery: '["https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80","https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200&q=80"]',
    liveUrl: '#', clientName: 'ارتباطات پیشرو', year: 2023, featured: false,
    problem: 'سایت قدیمی نتوانست اعتماد و قابلیت‌های مدرن را منتقل کند.',
    solution: 'طراحی مجدد حرفه‌ای با محتوای مدیریت‌شده و ساختار سئو.',
    result: '۶۵٪ افزایش در سرنخ‌های ورودی واجدشرایط.',
    challenge: 'دستورالعمل‌های برند سختگیرانه و چرخه‌های بازبینی قانونی.',
    architecture: 'Laravel + Blade، Filament CMS، تحویل CDN.',
    implementation: 'ابتدا سیستم طراحی، سپس ساخت مبتنی بر کامپوننت.',
    outcome: 'رتبه برتر برای ۱۲ کلمه کلیدی هدف در عرض ۶ ماه.',
    features: '["پشتیبانی چندزبانه","پورتال سرمایه‌گذار","اخبار و دیدگاه‌ها","مدیریت CMS","بهینه‌سازی سئو"]',
    categorySlug: 'corporate', techSlugs: ['laravel','mysql','tailwindcss'],
  },
  {
    title: 'رهیاب لجستیک', slug: 'rahyab-logistics',
    summary: 'سیستم ردیابی ناوگان بلادرنگ و مدیریت لجستیک.',
    description: 'رهیاب ردیابی GPS زنده، بهینه‌سازی مسیر و نگهداری پیش‌بینی‌کننده برای ناوگان لجستیک ارائه می‌دهد.',
    coverImage: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&q=80',
    gallery: '["https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&q=80","https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=1200&q=80"]',
    liveUrl: '#', clientName: 'رهیاب عملیات', year: 2024, featured: false,
    problem: 'اعزام دستی منجر به ناکارآمدی و هزینه‌های بالای سوخت شد.',
    solution: 'ردیابی بلادرنگ با بهینه‌سازی مسیر هوش مصنوعی.',
    result: 'کاهش ۲۲٪ هزینه سوخت و بهبود ۳۵٪ تحویل به‌موقع.',
    challenge: 'پردازش تله‌متری پربسامد از هزاران خودرو.',
    architecture: 'Laravel + Redis Streams، داشبورد React، دریافت IoT.',
    implementation: 'پایلوت با ۵۰ خودرو، سپس مقیاس به کل ناوگان.',
    outcome: 'مدیریت ۳,۵۰۰+ خودرو در ۸ شهر.',
    features: '["ردیابی GPS زنده","بهینه‌سازی مسیر","نگهداری پیش‌بینی‌کننده","امتیازدهی راننده","تحلیل سوخت"]',
    categorySlug: 'custom-systems', techSlugs: ['laravel','react','redis','mysql'],
  },
  {
    title: 'دستیار هوشمند آریا', slug: 'arya-ai',
    summary: 'دستیار پشتیبانی مشتری مبتنی بر هوش مصنوعی با RAG روی پایگاه دانش.',
    description: 'آریا یک دستیار هوش مصنوعی سازمانی است که به سؤالات مشتریان با استفاده از تولید بهبودیافته بازیابی روی اسناد شرکت پاسخ می‌دهد.',
    coverImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&q=80',
    gallery: '["https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&q=80","https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200&q=80"]',
    liveUrl: '#', clientName: 'آریا هوش مصنوعی', year: 2024, featured: true,
    problem: 'تیم‌های پشتیبانی از سؤالات تکراری غرق شده بودند.',
    solution: 'دستیار مبتنی بر RAG که روی پایگاه دانش شرکت استوار است.',
    result: '۶۸٪ از تیکت‌ها به طور خودکار با ۹۵٪ دقت حل شد.',
    challenge: 'جلوگیری از توهم روی داده‌های حساس سازمانی.',
    architecture: 'Laravel + Vector DB، API OpenAI، پاسخ‌های استریم.',
    implementation: 'زمینه‌سازی تدریجی با ارزیابی انسان در حلقه.',
    outcome: 'کاهش میانگین زمان پاسخ از ۴ ساعت به ۱۲ ثانیه.',
    features: '["RAG روی پایگاه دانش","پاسخ‌های استریم","ارجاع به انسان","چندزبانه","داشبورد تحلیلی"]',
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
    title: '۱۰ تکنیک بهینه‌سازی عملکرد برای برنامه‌های Laravel', slug: 'laravel-performance-optimization',
    excerpt: 'تکنیک‌های اثبات‌شده‌ای را کشف کنید تا برنامه‌های Laravel خود را فوق‌العاده سریع کنید، از بهینه‌سازی کوئری تا استراتژی‌های کش.',
    content: `# ۱۰ تکنیک بهینه‌سازی عملکرد برای برنامه‌های Laravel\n\nعملکرد برای تجربه کاربری و سئو حیاتی است. در اینجا تکنیک‌های آزموده‌شده‌ای که در برنامه‌های Laravel تولیدی استفاده می‌کنیم، آورده شده است.\n\n## ۱. بهینه‌سازی کوئری‌های پایگاه داده\n\nاز eager loading برای جلوگیری از مشکل N+1 استفاده کنید.\n\n## ۲. استفاده از کش\n\nکوئری‌های پرهزینه و نتایج محاسبه‌شده را با Redis کش کنید.\n\n## ۳. استفاده از صف برای کارهای سنگین\n\nایمیل‌ها، گزارش‌ها و پردازش را به صف‌های پس‌زمینه بفرستید.\n\n## ۴. فعال‌سازی OPcache\n\nOPcache زمان بوت PHP را در تولید به شدت کاهش می‌دهد.\n\n## ۵. بهینه‌سازیAutoloader\n\n## ۶. ایندکس‌گذاری پایگاه داده\n\nبه ستون‌های پراستعلام ایندکس اضافه کنید.\n\n## ۷. استفاده از Eloquent Select\n\nفقط ستون‌های مورد نیاز را انتخاب کنید.\n\n## ۸. کاهش Middlewareها\n\nMiddlewareهای استفاده‌نشده را از مسیرها حذف کنید.\n\n## ۹. کش HTTP\n\nهدرهای کش مناسب برای دارایی‌های ایستا تنظیم کنید.\n\n## ۱۰. پروفایل با Laravel Telescope\n\nگلوگاه‌ها را با Telescope و Blackfire شناسایی کنید.\n\n## نتیجه‌گیری\n\nعملکرد یک تلاش مستمر است. به طور مداوم اندازه بگیرید، بهینه کنید و نظارت کنید.`,
    coverImage: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=1200&q=80', readingTime: 8, authorName: 'علی محمدی', featured: true, categorySlug: 'web-development', tagNames: ['Laravel','Performance','Best Practices'],
  },
  {
    title: 'چرا CMS بدون سرور آینده مدیریت محتوا است', slug: 'headless-cms-future',
    excerpt: 'کاوش کنید که چگونه معماری CMS بدون سرور به تیم‌ها قدرت می‌دهد محتوا را در هر کانالی سریع‌تر تحویل دهند.',
    content: `# چرا CMS بدون سرور آینده است\n\nپلتفرم‌های CMS سنتی محتوا را با نمایش tightly coupled می‌کنند. CMS بدون سرور آن‌ها را جدا می‌کند و انعطاف‌پذیری را آزاد می‌کند.\n\n## CMS بدون سرور چیست؟\n\nCMS بدون سرور محتوا را ذخیره و از طریق API تحویل می‌دهد و به شما امکان می‌دهد هر فرانت‌اندی بسازید.\n\n## مزایا\n\n- **تحویل همه‌کاناله** — وب، موبایل، IoT، کیوسک\n- **آزادی توسعه‌دهنده** — هر استکی را انتخاب کنید\n- **عملکرد بهتر** — تولید ایستا + CDN\n- **مقیاس‌پذیری** — مقیاس‌دهی جدا از هم\n\n## نتیجه‌گیری\n\nCMS بدون سرور یک راه‌حل جادویی نیست، اما برای محصولات دیجیتال مدرن، انعطاف‌پذیری بی‌نظیری فراهم می‌کند.`,
    coverImage: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&q=80', readingTime: 6, authorName: 'مریم احمدی', featured: false, categorySlug: 'web-development', tagNames: ['Trends','Best Practices'],
  },
  {
    title: 'راهنمای کامل Core Web Vitals در ۲۰۲۴', slug: 'core-web-vitals-2024',
    excerpt: 'LCP، INP، CLS — متریک‌هایی که بر رتبه‌بندی و تجربه کاربری شما تأثیر می‌گذارند را مسلط شوید.',
    content: `# Core Web Vitals در ۲۰۲۴\n\nCore Web Vitals گوگل مستقیماً بر رتبه‌بندی جستجو تأثیر می‌گذارد. در اینجا نحوه عالی شدن در آن‌ها آمده است.\n\n## LCP (Largest Contentful Paint)\n\nهدف: زیر ۲.۵ ثانیه. تصاویر، فونت‌ها و پاسخ سرور را بهینه کنید.\n\n## INP (Interaction to Next Paint)\n\nهدف: زیر ۲۰۰ms. جاوااسکریپت مسدودکننده را کاهش دهید.\n\n## ابزارهای اندازه‌گیری\n\n- PageSpeed Insights\n- Lighthouse\n- Search Console\n\n## نتیجه‌گیری\n\nCore Web Vitals یک عامل رتبه‌بندی و برد UX است. آن‌ها را مستمر نظارت کنید.`,
    coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80', readingTime: 7, authorName: 'سارا رضایی', featured: true, categorySlug: 'seo', tagNames: ['SEO','Performance','Best Practices'],
  },
  {
    title: 'طراحی رابط‌های وب دسترس‌پذیر: راهنمای عملی', slug: 'accessible-web-interfaces',
    excerpt: 'دسترس‌پذیری اختیاری نیست. تکنیک‌های عملی برای ساخت رابط‌های فراگیر را بیاموزید.',
    content: `# طراحی رابط‌های وب دسترس‌پذیر\n\nاز هر ۶ نفر، ۱ نفر با معلولیت زندگی می‌کند. دسترس‌پذیری تضمین می‌کند همه بتوانند از محصول شما استفاده کنند.\n\n## HTML معنایی\n\nاز عناصر HTML مناسب استفاده کنید: دکمه‌ها، عنوان‌ها، نشانه‌ها.\n\n## ناوبری صفحه‌کلید\n\nهر عنصر تعاملی باید با صفحه‌کلید قابل دسترس باشد.\n\n## کنتراست رنگ\n\nنسبت کنتراست WCAG AA را حفظ کنید (۴.۵:۱ برای متن).\n\n## برچسب‌های ARIA\n\nزمانی که HTML معنایی کافی نیست از ARIA استفاده کنید.\n\n## نتیجه‌گیری\n\nدسترس‌پذیری به نفع همه است، نه فقط کاربران دارای معلولیت.`,
    coverImage: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&q=80', readingTime: 6, authorName: 'علی محمدی', featured: false, categorySlug: 'design', tagNames: ['Design','Best Practices','Tips'],
  },
  {
    title: 'ساخت برنامه‌های بلادرنگ با WebSockets و Laravel', slug: 'realtime-laravel-websockets',
    excerpt: 'به روزرسانی‌های زنده، اعلان‌ها و قابلیت‌های همکاری را به برنامه‌های Laravel خود اضافه کنید.',
    content: `# برنامه‌های بلادرنگ با WebSockets\n\nقابلیت‌های بلادرنگ تعامل کاربر را متحول می‌کند. در اینجا نحوه افزودن آن‌ها به Laravel آمده است.\n\n## پخش رویدادها\n\nسیستم پخش Laravel رویدادهای بلادرنگ را ساده می‌کند.\n\n## درایورها\n\nPusher، Redis یا Soketi خودمیزبان را انتخاب کنید.\n\n## یکپارچه‌سازی فرانت‌اند\n\nاز Laravel Echo با Pusher یا Socket.io استفاده کنید.\n\n## نتیجه‌گیری\n\nقابلیت‌های بلادرنگ کاربران را خوشحال می‌کند و محصولات را متمایز می‌سازد.`,
    coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&q=80', readingTime: 7, authorName: 'مریم احمدی', featured: false, categorySlug: 'web-development', tagNames: ['Laravel','Tutorial','Best Practices'],
  },
  {
    title: 'چگونه هوش مصنوعی گردش کار توسعه وب را متحول می‌کند', slug: 'ai-transforming-web-development',
    excerpt: 'از تولید کد تا تست خودکار، هوش مصنوعی نحوه ساخت ما برای وب را تغییر می‌دهد.',
    content: `# هوش مصنوعی در توسعه وب\n\nابزارهای هوش مصنوعی در حال تقویت توسعه‌دهندگان هستند، نه جایگزینی آن‌ها. در اینجا نحوه استفاده از آن‌ها آمده است.\n\n## تولید کد\n\nبرنامه‌نویسان جفت هوش مصنوعی کارهای تکراری و بازآفرینی را تسریع می‌کنند.\n\n## تست خودکار\n\nموارد تست و سناریوهای لبه را با هوش مصنوعی تولید کنید.\n\n## نتیجه‌گیری\n\nهوش مصنوعی را به عنوان یک همکار برای تحویل سریع‌تر و هوشمندانه‌تر بپذیرید.`,
    coverImage: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200&q=80', readingTime: 5, authorName: 'سارا رضایی', featured: false, categorySlug: 'ai', tagNames: ['AI','Trends','Tips'],
  },
]

const caseStudies = [
  {
    title: 'مقیاس‌سازی پلتفرم مالی تا ۱ میلیون کاربر', slug: 'fintech-scaling',
    clientName: 'گروه مالی پارسیان', industry: 'فین‌تک',
    coverImage: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=1200&q=80',
    summary: 'چگونه یک پلتفرم بانکی را برای مدیریت رشد انفجاری با حفظ ۹۹.۹۸٪ زمان فعالیت بازمعماری کردیم.',
    problem: 'پلتفرم تحت رشد سریع کاربران در حال فروپاشی بود، با قطعی‌های مکرر و کوئری‌های کند.',
    analysis: 'گلوگاه‌های پایگاه داده، کوئری‌های ناکارآمد و پردازش همزمان را به عنوان مقصران اصلی شناسایی کردیم.',
    architecture: 'به read replicaها مهاجرت کردیم، کش Redis معرفی کردیم و کارهای سنگین را به صف‌های ناهمزمان منتقل کردیم.',
    process: 'استقرار مرحله‌ای: ابتدا کش، سپس read replicaها، سپس مهاجرت صف، با نظارت مستمر.',
    challenges: 'مهاجرت بدون قطعی یک سیستم مالی زنده با الزامات انطباق سختگیرانه.',
    results: 'مقیاس به ۱ میلیون کاربر، ۹۹.۹۸٪ زمان فعالیت، ۴ برابر سرعت پاسخ و ۶۰٪ کاهش هزینه زیرساخت.',
    lessons: 'از همان ابتدا در مشاهده‌پذیری سرمایه‌گذاری کنید. بهینه‌سازی زودهنگام بدون اندازه‌گیری اتلاف وقت است.',
    metrics: '[{"label":"کاربران","value":"۱ میلیون+"},{"label":"زمان فعالیت","value":"۹۹.۹۸٪"},{"label":"زمان پاسخ","value":"۴ برابر سریع‌تر"},{"label":"کاهش هزینه","value":"۶۰٪"}]',
    featured: true,
  },
  {
    title: 'بازسازی یک برند تجارت الکترونیک برای جمعه سیاه', slug: 'ecommerce-black-friday',
    clientName: 'فروشگاه کالا', industry: 'تجارت الکترونیک',
    coverImage: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&q=80',
    summary: 'بازسازی بدون سرور که نرخ تبدیل را در رویدادهای ترافیک اوج سه برابر کرد.',
    problem: 'ویترین فروشگاه قدیمی در زمان فروش از کار می‌افتاد و درآمد و اعتماد برند را از دست می‌داد.',
    analysis: 'معماری یکپارچه با رندر سمت سرور گلوگاه در مقیاس بود.',
    architecture: 'API بدون سرور Laravel + ویترین Next.js با کش لبه و CDN.',
    process: 'ویترین جدید را به صورت موازی ساختیم، کاتالوگ را مهاجرت کردیم و در یک پنجره نگهداری تغییر مسیر دادیم.',
    challenges: 'مهاجرت ۵۰,۰۰۰ SKU و حفظ رتبه‌بندی سئو در طول تغییر.',
    results: '۳.۲ برابر بارگذاری سریع‌تر، ۲۸٪ افزایش تبدیل، ۲۰۰ هزار کاربر همزمان بدون مشکل.',
    lessons: 'کش لبه و تولید ایستا برای افزایش ترافیک تغییردهنده بازی هستند.',
    metrics: '[{"label":"بارگذاری صفحه","value":"۳.۲ برابر سریع‌تر"},{"label":"نرخ تبدیل","value":"+۲۸٪"},{"label":"کاربران اوج","value":"۲۰۰ هزار"},{"label":"درآمد","value":"+۴۵٪"}]',
    featured: true,
  },
  {
    title: 'راه‌اندازی پلتفرم پزشکی از راه دور در ۹۰ روز', slug: 'telemedicine-launch',
    clientName: 'گروه بهداشت', industry: 'بهداشت و درمان',
    coverImage: 'https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?w=1200&q=80',
    summary: 'تحویل سریع یک پلتفرم پزشکی از راه دور منطبق با HIPAA در یک پنجره زمانی بحرانی.',
    problem: 'کلینیک‌ها به دلیل تغییر انتظارات بیماران فوراً به قابلیت‌های مراقبت از راه دور نیاز داشتند.',
    analysis: 'ابزارهای موجود پراکنده بودند و نمی‌توانستند به سرعت کافی تطبیق یابند.',
    architecture: 'API Laravel، فرانت‌اند React، ویدئوی WebRTC، ذخیره‌سازی رمزگذاری‌شده.',
    process: 'دامنه MVP تهاجمی، انتشار هفتگی، بررسی امنیت در هر نقطه عطف.',
    challenges: 'انطباق HIPAA و ویدئوی بلادرنگ امن در زمان‌بندی فشرده.',
    results: 'در ۹۰ روز مستقر شد، ۲۴ کلینیک ثبت‌نام کردند، ۸۰,۰۰۰+ بیمار خدمات دریافت کردند.',
    lessons: 'طراحی امنیت‌محور در صورت انجام درست، تحویل را تسریع می‌کند نه کند.',
    metrics: '[{"label":"زمان راه‌اندازی","value":"۹۰ روز"},{"label":"کلینیک‌ها","value":"۲۴"},{"label":"بیماران","value":"۸۰ هزار+"},{"label":"پذیرش پزشکی از راه دور","value":"۲ برابر"}]',
    featured: false,
  },
]

const testimonials = [
  { clientName: 'امیر حسینی', role: 'مدیرعامل', company: 'گروه مالی پارسیان', rating: 5, quote: 'آنها پلتفرم بانکی ما را متحول کردند. توجه به جزئیات و تخصص فنی بی‌نظیر است. بدون هیچ مشکلی به یک میلیون کاربر رسیدیم.' },
  { clientName: 'زهرا کریمی', role: 'بنیان‌گذار', company: 'سیرنگ گشت', rating: 5, quote: 'بازارگاه ما از ایده به ۵۰,۰۰۰ رزرو در یک سال رسید. تیم فراتر از انتظارات، به موقع و در بودجه تحویل داد.' },
  { clientName: 'دکتر محمدرضا طاهری', role: 'مدیر پزشکی', company: 'گروه بهداشت', rating: 5, quote: 'پلتفرم پزشکی از راه دوری که ساختند نحوه ارائه مراقبت ما را متحول کرده است. رضایت بیماران هرگز اینقدر بالا نبوده.' },
  { clientName: 'لیلا مرادی', role: 'مدیر بازاریابی', company: 'فروشگاه کالا', rating: 5, quote: 'جمعه سیاه قبلاً کابوس بود. حالا بهترین روز عملکرد ماست. بازسازی بدون سرور آنها در هفته‌ها خود را پرداخت کرد.' },
  { clientName: 'رضا نادری', role: 'مدیر فناوری', company: 'رهیاب عملیات', rating: 5, quote: 'سیستم ناوگان ما هزینه سوخت را ۲۲٪ کاهش داد. درک آنها از سیستم‌های بلادرنگ استثنایی است.' },
  { clientName: 'فاطمه صالحی', role: 'مدیر', company: 'آکادمی دانش', rating: 5, quote: 'آنها LMSی ساختند که معلمان ما واقعاً دوست دارند از آن استفاده کنند. نمره‌دهی هوش مصنوعی به تنهایی صدها ساعت در ماه برای ما صرفه‌جویی می‌کند.' },
]

const teamMembers = [
  { name: 'امیررضا کاظمی', role: 'بنیان‌گذار و معمار اصلی', bio: 'بیش از ۱۵ سال ساخت پلتفرم‌های وب مقیاس‌پذیر. رهبر فنی سابق در دو یونیکورن.', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80', linkedin: '#', github: '#', order: 1 },
  { name: 'سارا مرادی', role: 'مهندس ارشد فول‌استک', bio: 'متخصص Laravel و React، علاقه‌مند به معماری تمیز و تجربه توسعه‌دهنده.', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80', linkedin: '#', github: '#', order: 2 },
  { name: 'حسین رحمانی', role: 'رهبر طراحی UI/UX', bio: 'مدافع سیستم‌های طراحی. رابط‌هایی می‌سازد که زیبا، دسترس‌پذیر و متمرکز بر تبدیل هستند.', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80', linkedin: '#', twitter: '#', order: 3 },
  { name: 'نرگس احمدی', role: 'استراتژیست سئو و رشد', bio: 'بازاریاب داده‌محور که ترافیک ارگانیک را به سرنخ‌های واجدشرایط و درآمد تبدیل می‌کند.', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80', linkedin: '#', twitter: '#', order: 4 },
  { name: 'پویا موسوی', role: 'مهندس DevOps', bio: 'متخصص CI/CD، معماری ابر و مشاهده‌پذیری. استقرارها را خسته‌کننده و قابل اعتماد نگه می‌دارد.', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80', linkedin: '#', github: '#', order: 5 },
  { name: 'مریم جعفری', role: 'رهبر QA و اتوماسیون', bio: 'قهرمان کیفیت که معتقد است باگ‌ها بهتر است قبل از اینکه کاربران پیدا کنند، گرفته شوند.', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80', linkedin: '#', order: 6 },
]

const faqs = [
  { question: 'یک پروژه معمولی چقدر زمان می‌برد؟', answer: 'بیشتر پروژه‌ها بسته به دامنه بین ۴ تا ۱۲ هفته هستند. یک صفحه فرود می‌تواند ۱-۲ هفته طول بکشد، در حالی که یک پلتفرم کامل SaaS ممکن است ۳-۶ ماه زمان ببرد. ما پس از فاز کشف، زمان‌بندی دقیق ارائه می‌دهیم.', category: 'فرآیند', order: 1 },
  { question: 'مدل قیمت‌گذاری شما چیست؟', answer: 'برای دامنه‌های خوب تعریف‌شده قیمت ثابت و برای کارهای مستمر مدل ریتینر ارائه می‌دهیم. پروژه‌های معمولی از ۲,۰۰۰ دلار برای یک سایت بازاریابی شروع می‌شود و تا ۵۰,۰۰۰+ دلار برای پلتفرم‌های پیچیده متغیر است. برای دریافت قیمت فوری از برآوردگر ما استفاده کنید.', category: 'قیمت‌گذاری', order: 2 },
  { question: 'آیا نگهداری و پشتیبانی مستمر ارائه می‌دهید؟', answer: 'بله. هر پروژه شامل یک پنجره پشتیبانی ۳۰ روزه پس از انتشار است. همچنین برنامه‌های نگهداری ماهانه شامل به‌روزرسانی، نظارت، وصله امنیتی و توسعه ویژگی ارائه می‌دهیم.', category: 'پشتیبانی', order: 3 },
  { question: 'در چه فناوری‌هایی تخصص دارید؟', answer: 'استک اصلی ما Laravel، PHP، React، Vue، Next.js، MySQL، PostgreSQL و TailwindCSS است. همچنین با Redis، Docker کار می‌کنیم و در صورت نیاز قابلیت‌های هوش مصنوعی یکپارچه می‌کنیم.', category: 'فنی', order: 4 },
  { question: 'آیا می‌توانید با کد موجود ما کار کنید؟', answer: 'قطعاً. ما مکرراً به پروژه‌های موجود می‌پیوندیم، ممیزی کد انجام می‌دهیم و یا کد را گسترش می‌دهیم یا برای مهاجرت تدریجی برنامه‌ریزی می‌کنیم. با معماری و استانداردهای شما تطبیق می‌یابیم.', category: 'فرآیند', order: 5 },
  { question: 'آیا میزبانی و استقرار را انجام می‌دهید؟', answer: 'ما در محیط دلخواه شما استقرار می‌دهیم — هاست اشتراکی cPanel، VPS یا ابری (AWS، DigitalOcean). خطوط لوله CI/CD راه‌اندازی می‌کنیم و مستندات استقرار برای تیم شما ارائه می‌دهیم.', category: 'فنی', order: 6 },
  { question: 'آیا وب‌سایت من سئو-دوست خواهد بود؟', answer: 'بله. هر سایتی که می‌سازیم از بهترین شیوه‌های سئو پیروی می‌کند: HTML معنایی، زمان بارگذاری سریع، داده‌های ساختاریافته، نقشه سایت و مدیریت متا. همچنین خدمات تخصصی بهینه‌سازی سئو ارائه می‌دهیم.', category: 'سئو', order: 7 },
  { question: 'چگونه شروع کنیم؟', answer: 'از طریق فرم تماس با ما ارتباط برقرار کنید یا یک مشاوره رزرو کنید. یک تماس کشف برنامه‌ریزی می‌کنیم، اهداف شما را می‌فهمیم و ظرف ۲-۳ روز کاری پیشنهاد می‌فرستیم.', category: 'فرآیند', order: 8 },
]

async function main() {
  console.log('Seeding database...')

  // Clean
  await db.adminUser.deleteMany()
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

  // Admin user (default: admin / admin123)
  const existingAdmin = await db.adminUser.findUnique({ where: { username: 'admin' } })
  if (!existingAdmin) {
    await db.adminUser.create({
      data: {
        username: 'admin',
        passwordHash: hashPassword('admin123'),
        displayName: 'مدیر سیستم',
        role: 'superadmin',
      },
    })
    console.log('  → Admin user created: admin / admin123')
  } else {
    console.log('  → Admin user already exists, skipping')
  }

  // Settings — use JSON for bilingual text fields
  const settings = [
    { key: 'site_name', value: JSON.stringify({ fa: 'دواستودیو', en: 'DevStudio' }) },
    { key: 'tagline', value: JSON.stringify({ fa: 'محصولات دیجیتال سریع، مقیاس‌پذیر و مدرن می‌سازیم', en: 'We Build Fast, Scalable and Modern Digital Products' }) },
    { key: 'email', value: 'hello@devstudio.com' },
    { key: 'phone', value: '+98 21 1234 5678' },
    { key: 'address', value: JSON.stringify({ fa: 'تهران، خیابان ولیعصر، برج فناوری', en: 'Valiasr St., Technology Tower, Tehran' }) },
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
    process.exit(0)
  })
