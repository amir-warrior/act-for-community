/**
 * Content layer. All editable content lives in /content as JSON files that are
 * written by Decap CMS (/admin). Nothing here is hardcoded — add a file, and it
 * shows up on the site after the next build.
 */
import fs from "node:fs";
import path from "node:path";

const CONTENT_DIR = path.join(process.cwd(), "content");

export type EventCategory = "annual" | "one-time";

export interface EventItem {
  slug: string;
  title: string;
  category: EventCategory;
  recurrence?: string;
  /** ISO date (YYYY-MM-DD) of the event or of its latest edition. Used for sorting. */
  date: string;
  /** Human label shown on the site, e.g. "Every summer · Latest: June 7, 2026". */
  dateLabel?: string;
  dateNeedsVerification?: boolean;
  venue?: string;
  summary: string;
  description: string;
  facts?: string[];
  impact?: string;
  cover?: string;
  coverAlt?: string;
  gallery?: string[];
  featured?: boolean;
}

export interface TeamMember {
  slug: string;
  name: string;
  role: string;
  photo?: string;
  bio?: string;
  order?: number;
}

export interface Stat {
  value: string;
  label: string;
}

export interface SiteSettings {
  contacts: { phone: string; email: string; telegram: string; instagram: string };
  forms: { helpFormUrl: string; volunteerFormUrl: string };
  stats: Stat[];
}

function readJsonFolder<T>(folder: string): (T & { slug: string })[] {
  const dir = path.join(CONTENT_DIR, folder);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((file) => {
      const raw = JSON.parse(fs.readFileSync(path.join(dir, file), "utf8")) as T;
      return { ...raw, slug: file.replace(/\.json$/, "") };
    });
}

export function getEvents(): EventItem[] {
  return readJsonFolder<Omit<EventItem, "slug">>("events")
    .map((e) => ({
      ...e,
      facts: (e.facts ?? []).filter(Boolean),
      gallery: (e.gallery ?? []).filter(Boolean),
    }))
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getEvent(slug: string): EventItem | undefined {
  return getEvents().find((e) => e.slug === slug);
}

export function getTeam(): TeamMember[] {
  return readJsonFolder<Omit<TeamMember, "slug">>("team").sort(
    (a, b) => (a.order ?? 999) - (b.order ?? 999) || a.name.localeCompare(b.name),
  );
}

export function getSettings(): SiteSettings {
  const file = path.join(CONTENT_DIR, "settings", "site.json");
  const raw = JSON.parse(fs.readFileSync(file, "utf8")) as Partial<SiteSettings>;
  return {
    contacts: { phone: "", email: "", telegram: "", instagram: "", ...raw.contacts },
    forms: { helpFormUrl: "", volunteerFormUrl: "", ...raw.forms },
    stats: raw.stats ?? [],
  };
}
