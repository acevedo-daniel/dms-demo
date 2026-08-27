const fallbackSiteUrl = "https://dms-demo.vercel.app";

export const siteName = "DMS";

export function getSiteUrl() {
  return new URL(process.env.NEXT_PUBLIC_APP_URL ?? fallbackSiteUrl);
}
