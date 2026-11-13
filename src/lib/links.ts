import type { SiteSettings } from "./content";

/** Turn the raw contact values from the CMS into safe, clickable links. */
export function contactLinks(c: SiteSettings["contacts"]) {
  const handle = (v: string) => v.trim().replace(/^@/, "").replace(/^https?:\/\/[^/]+\//, "").replace(/\/$/, "");
  return {
    instagram: c.instagram ? { label: `@${handle(c.instagram)}`, href: `https://www.instagram.com/${handle(c.instagram)}/` } : null,
    telegram: c.telegram ? { label: `@${handle(c.telegram)}`, href: `https://t.me/${handle(c.telegram)}` } : null,
    email: c.email ? { label: c.email.trim(), href: `mailto:${c.email.trim()}` } : null,
    phone: c.phone ? { label: c.phone.trim(), href: `tel:${c.phone.replace(/[^\d+]/g, "")}` } : null,
  };
}

/** Only accept real http(s) form links; anything else is treated as "not provided yet". */
export function safeFormUrl(url: string | undefined): string | null {
  if (!url) return null;
  try {
    const u = new URL(url.trim());
    return u.protocol === "https:" || u.protocol === "http:" ? u.toString() : null;
  } catch {
    return null;
  }
}

export const NAV = [
  { href: "/about", label: "About" },
  { href: "/events", label: "Events" },
  { href: "/team", label: "Team" },
  { href: "/volunteer", label: "Volunteer" },
  { href: "/what-you-gain", label: "What you gain" },
  { href: "/contact", label: "Contact" },
] as const;
