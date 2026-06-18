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
    summary: 'سیستم مدیریت بیمارستان سرتاسری با دورهای‌پزشکی و نسخه الکترونیک.',
  },
  shopwave: {
    title: 'تجارت الکترونیک شاپ‌ویو',
    summary: 'ویترین تجارت الکترونیک هدلس با زمان بارگذاری زیر یک ثانیه.',
  },
  edupro: {
    title: 'پلتفرم یادگیری ادوپرو',
    summary: 'یک LMS مقیاس‌پذیر با کلاس‌های زنده و تصحیح کمکی هوش مصنوعی.',
  },
  corpfinance: {
    title: 'سایت شرکتی کورپ‌فایننس',
    summary: 'وب‌سایت شرکتی پریمیوم برای یک شرکت مالی چندملیتی.',
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
    title: 'راه‌اندازی پلتفرم دورهای‌پزشکی در ۹۰ روز',
    summary: 'تحویل سریع یک پلتفرم دورهای‌پزشکی سازگار با HIPAA در یک پنجره بحرانی.',
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
