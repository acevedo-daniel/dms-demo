import type { MetadataRoute } from "next";
import { getSiteUrl, isSearchIndexableDeployment } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();
  const indexable = isSearchIndexableDeployment();

  return {
    rules: {
      userAgent: "*",
      ...(indexable
        ? {
            allow: "/",
            disallow: [
              "/admin",
              "/admin/",
              "/api",
              "/api/",
              "/demo",
              "/demo/",
              "/login",
            ],
          }
        : { disallow: "/" }),
    },
    ...(indexable
      ? {
          host: siteUrl.origin,
          sitemap: new URL("/sitemap.xml", siteUrl).toString(),
        }
      : {}),
  };
}
