import { getEvent, getEvents } from "@/lib/content";
import { CATEGORY_LABEL, eventDateLabel } from "@/lib/format";
import { OG_SIZE, ogCard } from "@/lib/og";

export const alt = "Act for Community event";
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return getEvents().map((e) => ({ slug: e.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const event = getEvent((await params).slug);
  if (!event) return ogCard({ kicker: "Event", title: "Act for Community", footer: "Bishkek, Kyrgyzstan" });
  return ogCard({
    kicker: event.category === "annual" ? event.recurrence || CATEGORY_LABEL.annual : CATEGORY_LABEL["one-time"],
    title: event.title,
    footer: [eventDateLabel(event), event.venue].filter(Boolean).join(" · "),
  });
}
