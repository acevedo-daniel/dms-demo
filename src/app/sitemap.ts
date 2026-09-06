import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";
import { getDemoClock } from "@/lib/demo/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();

  return [
    {
      url: new URL("/", siteUrl).toString(),
      lastModified: getDemoClock(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
