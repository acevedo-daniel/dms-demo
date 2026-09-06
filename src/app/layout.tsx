import type { Metadata } from "next";
import { Geist_Mono, Inter, Plus_Jakarta_Sans } from "next/font/google";
import { getSiteUrl, siteName } from "@/lib/site";
import { getServerLocale, getServerTranslations } from "@/lib/i18n/server";
import { I18nProvider } from "@/lib/i18n";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const { locale, t } = await getServerTranslations();

  return {
    metadataBase: getSiteUrl(),
    applicationName: siteName,
    title: {
      default: t.landing.metaTitle,
      template: "%s | DMS",
    },
    description: t.landing.metaDescription,
    category: "business",
    formatDetection: {
      address: false,
      email: false,
      telephone: false,
    },
    openGraph: {
      description: t.landing.metaDescription,
      locale: locale === "es" ? "es_AR" : "en_US",
      siteName,
      title: t.landing.metaTitle,
      type: "website",
    },
    robots: {
      follow: true,
      index: true,
    },
    twitter: {
      card: "summary_large_image",
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getServerLocale();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('dms-theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme:dark)').matches)){document.documentElement.classList.add('dark');}var l=localStorage.getItem('dms-locale');if(l==='en'||l==='es'){document.documentElement.lang=l;}}catch(e){}})()`,
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${plusJakartaSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <I18nProvider initialLocale={locale}>{children}</I18nProvider>
      </body>
    </html>
  );
}
