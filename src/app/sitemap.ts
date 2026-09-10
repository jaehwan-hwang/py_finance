import type { MetadataRoute } from "next";
import { weeks, isOpen } from "@/constants/weeks";
import { SITE_URL } from "@/constants/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    ...weeks
      .filter((w) => isOpen(w))
      .map((w) => ({
        url: `${SITE_URL}/week/${Number(w.num)}`,
        changeFrequency: "monthly" as const,
        priority: 0.8,
      })),
  ];
}
