import type { Metadata, Viewport } from "next";
import { Geist_Mono, Inter, Plus_Jakarta_Sans } from "next/font/google";
import { getSiteUrl, isSearchIndexableDeployment, siteName } from "@/lib/site";
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

export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [
    { color: "#f8f8f6", media: "(prefers-color-scheme: light)" },
    { color: "#171715", media: "(prefers-color-scheme: dark)" },
  ],
};

export async function generateMetadata(): Promise<Metadata> {
  const { locale, t } = await getServerTranslations();
  const indexable = isSearchIndexableDeployment();

  return {
    metadataBase: getSiteUrl(),
    applicationName: siteName,
    title: {
      default: t.landing.metaTitle,
      template: "%s | DMS",
    },
    description: t.landing.metaDescription,
    category: "software de gestión odontológica",
    keywords: [
      "gestión odontológica",
      "software dental",
      "agenda clínica",
      "turnos odontología",
      "historias clínicas",
      "Atelier Dental",
    ],
    icons: {
      icon: "/icon",
      apple: "/icon",
    },
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: siteName,
    },
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
      follow: indexable,
      index: indexable,
    },
    twitter: {
      card: "summary_large_image",
      description: t.landing.metaDescription,
      title: t.landing.metaTitle,
    },
    referrer: "strict-origin-when-cross-origin",
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
