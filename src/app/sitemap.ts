import type { MetadataRoute } from "next";
import { getEvents } from "@/lib/content";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/about", "/events", "/team", "/help", "/volunteer", "/what-you-gain", "/contact"];
  return [
    ...pages.map((p) => ({ url: `${SITE_URL}${p}`, changeFrequency: "monthly" as const, priority: p === "" ? 1 : 0.8 })),
    ...getEvents().map((e) => ({ url: `${SITE_URL}/events/${e.slug}`, lastModified: e.date, priority: 0.6 })),
  ];
}
