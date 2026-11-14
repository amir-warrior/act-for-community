import type { Metadata } from "next";
import { V2Experience, type V2Event } from "@/components/v2/V2Experience";
import { getEvents, getSettings } from "@/lib/content";
import { eventDateLabel, formatDate } from "@/lib/format";
import { contactLinks } from "@/lib/links";

/** Design preview (3D version). Not indexed so it doesn't compete with the main site. */
export const metadata: Metadata = {
  title: "Version 2 — 3D preview",
  robots: { index: false, follow: false },
};

export default function V2Page() {
  const events = getEvents();
  const toV2 = (e: (typeof events)[number]): V2Event => ({
    slug: e.slug,
    title: e.title,
    date: e.category === "annual" ? formatDate(e.date) : eventDateLabel(e),
    recurrence: e.recurrence,
    venue: e.venue,
    impact: e.impact || e.summary,
  });
  const annual = events.filter((e) => e.category === "annual").map(toV2);
  const stories = events.map(toV2);
  const instagram = contactLinks(getSettings().contacts).instagram?.href ?? null;

  return <V2Experience annual={annual} stories={stories} instagram={instagram} />;
}
