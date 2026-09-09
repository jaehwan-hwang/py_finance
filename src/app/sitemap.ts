import type { MetadataRoute } from "next";
import { weeks } from "@/constants/weeks";
import { SITE_URL } from "@/constants/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    ...weeks
      .filter((w) => w.available)
      .map((w) => ({
        url: `${SITE_URL}/week/${Number(w.num)}`,
        changeFrequency: "monthly" as const,
        priority: 0.8,
      })),
  ];
}
