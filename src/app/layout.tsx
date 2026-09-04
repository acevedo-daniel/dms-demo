import type { Metadata } from "next";
import { Geist_Mono, Manrope } from "next/font/google";
import { getSiteUrl, siteName } from "@/lib/site";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
  applicationName: siteName,
  title: {
    default: "DMS — Practice operations workspace",
    template: "%s | DMS",
  },
  description:
    "A focused workspace for dental practice operations, appointments, patient context, treatments, and notes.",
  category: "business",
  formatDetection: {
    address: false,
    email: false,
    telephone: false,
  },
  openGraph: {
    description:
      "A focused workspace for dental practice operations, appointments, patient context, treatments, and notes.",
    locale: "en_US",
    siteName,
    title: "DMS — Practice operations workspace",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('dms-theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme:dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}})()`,
          }}
        />
      </head>
      <body
        className={`${manrope.variable} ${geistMono.variable} antialiased tabular-nums`}
      >
        {children}
      </body>
    </html>
  );
}
