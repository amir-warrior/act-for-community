import type { EventItem } from "./content";

export function formatDate(iso: string) {
  const d = new Date(`${iso}T12:00:00Z`);
  return d.toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}

/** The label editors typed in the CMS, or a formatted date as a fallback. */
export function eventDateLabel(e: Pick<EventItem, "dateLabel" | "date">) {
  return e.dateLabel?.trim() || formatDate(e.date);
}

export function eventYear(e: Pick<EventItem, "date">) {
  return e.date.slice(0, 4);
}

export const CATEGORY_LABEL = { annual: "Annual event", "one-time": "One-time event" } as const;
