const productionSiteUrl = "https://dms-showcase.vercel.app";
const localSiteUrl = "http://localhost:3000";

export const siteName = "DMS";

function getConfiguredSiteUrl() {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return process.env.NODE_ENV === "development"
    ? localSiteUrl
    : productionSiteUrl;
}

export function getSiteUrl() {
  const siteUrl = new URL(getConfiguredSiteUrl());

  if (siteUrl.protocol !== "http:" && siteUrl.protocol !== "https:") {
    throw new Error("NEXT_PUBLIC_APP_URL must use the HTTP or HTTPS protocol.");
  }

  return siteUrl;
}

export function isSearchIndexableDeployment() {
  return (
    process.env.NODE_ENV === "production" &&
    process.env.VERCEL_ENV !== "preview"
  );
}
