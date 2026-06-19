// Persian translations for dynamic content (portfolio, blog, case studies)
// Keyed by slug. Falls back to English if no translation exists.

import type { Lang } from './i18n'

interface ContentFa {
  title?: string
  summary?: string
  excerpt?: string
  description?: string
}

const portfolioFa: Record<string, ContentFa> = {
  'nexus-banking': {
    title: 'داشبورد بانکداری نکسوس',
    summary: 'داشبورد تحلیلی بانکداری بلادرنگ برای یک نهاد مالی منطقه‌ای.',
  },
  wanderlust: {
    title: 'بازار سفر واندرلاست',
    summary: 'بازار گردشگری که مسافران را به تجربیات محلی منتخب متصل می‌کند.',
  },
  'medicare-clinic': {
    title: 'پلتفرم درمان مدیکر',
    summary: 'سیستم مدیریت درمانگاه سرتاسری با دورپزشکی و نسخه الکترونیک.',
  },
  shopwave: {
    title: 'تجارت الکترونیک شاپ‌ویو',
    summary: 'ویترین تجارت الکترونیک هدلس با زمان بارگذاری زیر یک ثانیه.',
  },
  edupro: {
    title: 'پلتفرم یادگیری ادوپرو',
    summary: 'یک سامانه یادگیری مقیاس‌پذیر با کلاس‌های زنده و تصحیح کمکی هوش مصنوعی.',
  },
  corpfinance: {
    title: 'وب‌سایت شرکتی کورپ‌فایننس',
    summary: 'وب‌سایت شرکتی حرفه‌ای برای یک شرکت مالی چندملیتی.',
  },
  logitrack: {
    title: 'سیستم ناوگان لوگی‌ترک',
    summary: 'سیستم ردیابی ناوگان بلادرنگ و مدیریت لجستیک.',
  },
  'aurora-ai': {
    title: 'دستیار هوش مصنوعی آورورا',
    summary: 'دستیار پشتیبانی مشتری مبتنی بر هوش مصنوعی با RAG روی پایگاه دانش.',
  },
}

// Persian translations for portfolio category names (by slug)
const portfolioCategoryFa: Record<string, string> = {
  corporate: 'شرکتی',
  'e-commerce': 'تجارت الکترونیک',
  tourism: 'گردشگری',
  healthcare: 'درمان و سلامت',
  saas: 'سرویس نرم‌افزاری',
  education: 'آموزش',
  'custom-systems': 'سیستم‌های سفارشی',
}

// Persian translations for blog category names (by slug)
const blogCategoryFa: Record<string, string> = {
  'web-development': 'توسعه وب',
  design: 'طراحی',
  seo: 'سئو',
  business: 'کسب‌وکار',
  ai: 'هوش مصنوعی و اتوماسیون',
}

// Persian translations for service content (by slug)
const serviceFa: Record<string, { title: string; description: string; features: string[] }> = {
  'custom-website': {
    title: 'توسعه وب‌سایت سفارشی',
    description: 'وب‌سایت‌های حرفه‌ای و پرسرعت با فریم‌ورک‌های مدرن، متناسب با برند شما و بهینه برای تبدیل.',
    features: ['طراحی واکنش‌گرا', 'بهینه‌سازی سئو', 'تنظیم عملکرد', 'آماده دسترس‌پذیری'],
  },
  ecommerce: {
    title: 'توسعه تجارت الکترونیک',
    description: 'فروشگاه‌های آنلاین مقیاس‌پذیر با پرداخت روان، مدیریت موجودی و درگاه‌های پرداخت یکپارچه.',
    features: ['یکپارچه‌سازی پرداخت', 'همگام‌سازی موجودی', 'سبد خرید و تسویه', 'داشبورد تحلیلی'],
  },
  booking: {
    title: 'پلتفرم‌های رزرو',
    description: 'سیستم‌های رزرو و زمان‌بندی بلادرنگ برای درمانگاه‌ها، هتل‌ها، سالن‌ها و کسب‌وکارهای خدماتی.',
    features: ['زمان‌بندی بلادرنگ', 'یادآوری خودکار', 'چند شعبه', 'همگام‌سازی تقویم'],
  },
  saas: {
    title: 'توسعه سرویس نرم‌افزاری',
    description: 'اپلیکیشن‌های چندمستاجری با صورت‌حساب اشتراکی، مدیریت تیم و APIهای قدرتمند.',
    features: ['چندمستاجری', 'صورت‌حساب استرایپ', 'مدیریت نقش‌ها', 'API REST/GraphQL'],
  },
  'web-apps': {
    title: 'اپلیکیشن‌های وب',
    description: 'اپلیکیشن‌های وب پیچیده و داده‌محور با داشبورد، به‌روزرسانی بلادرنگ و تعامل غنی.',
    features: ['به‌روزرسانی بلادرنگ', 'داشبوردهای سفارشی', 'نمایش داده‌ها', 'دسترسی مبتنی بر نقش'],
  },
  api: {
    title: 'توسعه API',
    description: 'APIهای امن، مستندشده و نسخه‌بندی‌شده REST/GraphQL که وب، موبایل و یکپارچه‌سازی‌های شخص ثالث را تغذیه می‌کنند.',
    features: ['مستندات OpenAPI', 'محدودسازی نرخ', 'OAuth2 / JWT', 'نقاط پایانی نسخه‌بندی‌شده'],
  },
  seo: {
    title: 'بهینه‌سازی سئو',
    description: 'سئو فنی و درون‌صفحه‌ای که رتبه‌بندی را بهبود می‌بخشد، ترافیک ارگانیک را افزایش می‌دهد و درآمد را رشد می‌دهد.',
    features: ['Core Web Vitals', 'داده‌ساختاری اسکما', 'استراتژی کلیدواژه', 'حملات محتوا'],
  },
  ai: {
    title: 'یکپارچه‌سازی هوش مصنوعی',
    description: 'تعبیه مدل‌های زبانی، چت‌بات‌ها، جستجوی معنایی و اتوماسیون هوشمند مستقیماً در محصولات شما.',
    features: ['چت‌بات‌ها و دستیارها', 'جستجوی معنایی', 'خطوط لوله RAG', 'اتوماسیون گردش‌کار'],
  },
}

// Persian translations for client names
const clientFa: Record<string, string> = {
  'Nexus Financial': 'نکسوس فایننشال',
  'Wanderlust Inc.': 'واندرلاست',
  'MediCare Group': 'گروه مدیکر',
  'ShopWave Retail': 'خرده‌فروشی شاپ‌ویو',
  'EduPro Academy': 'آکادمی ادوپرو',
  'CorpFinance Ltd.': 'کورپ‌فایننس',
  'LogiTrack Operations': 'عملیات لوگی‌ترک',
  'Aurora AI': 'آورورا هوش مصنوعی',
}

const blogFa: Record<string, ContentFa> = {
  'laravel-performance-optimization': {
    title: '۱۰ تکنیک بهینه‌سازی عملکرد برای اپلیکیشن‌های لاراول',
    excerpt: 'تکنیک‌های اثبات‌شده برای سریع‌تر کردن اپلیکیشن‌های لاراول، از بهینه‌سازی کوئری تا استراتژی‌های کش.',
  },
  'headless-cms-future': {
    title: 'چرا CMS بدون سر (Headless) آینده مدیریت محتواست',
    excerpt: 'کشف کنید معماری‌های CMS بدون سر چگونه به تیم‌ها اجازه می‌دهند محتوا را سریع‌تر در هر کانالی تحویل دهند.',
  },
  'core-web-vitals-2024': {
    title: 'راهنمای کامل Core Web Vitals در ۲۰۲۴',
    excerpt: 'LCP، INP، CLS — معیارهایی که بر رتبه‌بندی و تجربه کاربری تأثیر دارند را تسلط کنید.',
  },
  'accessible-web-interfaces': {
    title: 'طراحی رابط‌های وب دسترس‌پذیر: راهنمای عملی',
    excerpt: 'دسترس‌پذیری اختیاری نیست. تکنیک‌های عملی برای ساخت رابط‌های فراگیر را بیاموزید.',
  },
  'realtime-laravel-websockets': {
    title: 'ساخت اپلیکیشن‌های بلادرنگ با WebSockets و لاراول',
    excerpt: 'به‌روزرسانی‌های زنده، اعلان‌ها و قابلیت‌های همکاری به اپلیکیشن‌های لاراول اضافه کنید.',
  },
  'ai-transforming-web-development': {
    title: 'هوش مصنوعی چگونه گردش‌کارهای توسعه وب را متحول می‌کند',
    excerpt: 'از تولید کد تا تست خودکار، هوش مصنوعی در حال تغییر نحوه ساخت برای وب است.',
  },
}

const caseStudyFa: Record<string, ContentFa> = {
  'fintech-scaling': {
    title: 'مقیاس‌دهی پلتفرم فین‌تک به ۱ میلیون کاربر',
    summary: 'چگونگی بازطراحی یک پلتفرم بانکداری برای مدیریت رشد انفجاری با حفظ ۹۹.۹۸٪ آپ‌تایم.',
  },
  'ecommerce-black-friday': {
    title: 'بازسازی برند تجارت الکترونیک برای جمعه سیاه',
    summary: 'یک بازسازی هدلس که نرخ تبدیل را در رویدادهای ترافیک اوج سه برابر کرد.',
  },
  'telemedicine-launch': {
    title: 'راه‌اندازی پلتفرم دورپزشکی در ۹۰ روز',
    summary: 'تحویل سریع یک پلتفرم دورپزشکی سازگار با HIPAA در یک بازه بحرانی.',
  },
}

const maps = {
  portfolio: portfolioFa,
  blogPost: blogFa,
  caseStudy: caseStudyFa,
}

export function tc(
  type: keyof typeof maps,
  slug: string,
  field: keyof ContentFa,
  fallback: string,
  lang: Lang,
): string {
  if (lang !== 'fa') return fallback
  const entry = maps[type]?.[slug]
  return entry?.[field] ?? fallback
}

// Translate portfolio category name by slug
export function tcCategory(slug: string, fallback: string, lang: Lang): string {
  if (lang !== 'fa') return fallback
  return portfolioCategoryFa[slug] ?? fallback
}

// Translate blog category name by slug
export function tcBlogCategory(slug: string, fallback: string, lang: Lang): string {
  if (lang !== 'fa') return fallback
  return blogCategoryFa[slug] ?? fallback
}

// Translate service title
export function tcServiceTitle(slug: string, fallback: string, lang: Lang): string {
  if (lang !== 'fa') return fallback
  return serviceFa[slug]?.title ?? fallback
}

// Translate service description
export function tcServiceDesc(slug: string, fallback: string, lang: Lang): string {
  if (lang !== 'fa') return fallback
  return serviceFa[slug]?.description ?? fallback
}

// Translate service features (returns translated array or fallback array)
export function tcServiceFeatures(slug: string, fallback: string[], lang: Lang): string[] {
  if (lang !== 'fa') return fallback
  return serviceFa[slug]?.features ?? fallback
}

// Translate client name
export function tcClient(name: string, lang: Lang): string {
  if (lang !== 'fa') return name
  return clientFa[name] ?? name
}
