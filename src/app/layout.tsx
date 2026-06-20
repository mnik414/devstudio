import type { Metadata } from "next";
import { Geist, Geist_Mono, Vazirmatn } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { Providers } from "@/components/providers";
import { LangDirection } from "@/components/site/lang-direction";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const vazirmatn = Vazirmatn({
  variable: "--font-vazirmatn",
  subsets: ["arabic", "latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://devstudio.example.com"),
  title: {
    default: "DevStudio — We Build Fast, Scalable & Modern Digital Products",
    template: "%s | DevStudio",
  },
  description:
    "DevStudio is a premium web development agency crafting high-performance websites, SaaS platforms, e-commerce stores, and AI-powered products. Trusted by 180+ clients worldwide.",
  keywords: [
    "web development agency",
    "Laravel development",
    "React development",
    "SaaS development",
    "e-commerce development",
    "web app development",
    "API development",
    "SEO optimization",
    "AI integration",
  ],
  authors: [{ name: "DevStudio" }],
  creator: "DevStudio",
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "DevStudio — Fast, Scalable & Modern Digital Products",
    description:
      "Premium web development agency. Websites, SaaS, e-commerce, and AI products built to convert.",
    url: "https://devstudio.example.com",
    siteName: "DevStudio",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "DevStudio — Fast, Scalable & Modern Digital Products",
    description:
      "Premium web development agency. Websites, SaaS, e-commerce, and AI products built to convert.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  alternates: { canonical: "/" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${vazirmatn.variable} antialiased bg-background text-foreground`}
      >
        <Providers>
          <LangDirection />
          <div className="relative flex min-h-screen flex-col">{children}</div>
          <Toaster />
          <SonnerToaster position="bottom-right" richColors closeButton />
        </Providers>
      </body>
    </html>
  );
}
