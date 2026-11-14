import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CalendarDays, Check, CircleAlert, HeartHandshake, MapPin, Repeat, Tag } from "lucide-react";
import { Photo } from "@/components/ui/Photo";
import { Reveal } from "@/components/motion/Reveal";
import { WordsReveal } from "@/components/motion/WordsReveal";
import { ButtonLink } from "@/components/ui/Button";
import { TwoPaths } from "@/components/sections/TwoPaths";
import { getEvent, getEvents, type EventItem } from "@/lib/content";
import { absoluteUrl, jsonLd, pageMeta } from "@/lib/seo";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { CATEGORY_LABEL, eventDateLabel } from "@/lib/format";

type Props = { params: Promise<{ slug: string }> };

/** Only events that exist in the CMS get a page; anything else is a real 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return getEvents().map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const event = getEvent((await params).slug);
  if (!event) return {};
  return pageMeta({
    title: event.title,
    description: event.summary,
    path: `/events/${event.slug}`,
    image: `/events/${event.slug}/opengraph-image`,
  });
}

/** "December 2025" → "2025-12"; exact dates stay YYYY-MM-DD. */
function schemaDate(e: EventItem) {
  return /^[A-Za-z]+ \d{4}$/.test(e.dateLabel?.trim() ?? "") ? e.date.slice(0, 7) : e.date;
}

function eventStructuredData(event: EventItem) {
  const url = absoluteUrl(`/events/${event.slug}`);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Event",
        name: event.title,
        description: event.summary,
        url,
        startDate: schemaDate(event),
        eventStatus: "https://schema.org/EventScheduled",
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        image: [event.cover ? absoluteUrl(event.cover) : `${url}/opengraph-image`],
        location: {
          "@type": "Place",
          name: event.venue || "Bishkek",
          address: { "@type": "PostalAddress", addressLocality: "Bishkek", addressCountry: "KG" },
        },
        organizer: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
          { "@type": "ListItem", position: 2, name: "Events", item: absoluteUrl("/events") },
          { "@type": "ListItem", position: 3, name: event.title, item: url },
        ],
      },
    ],
  };
}

export default async function EventPage({ params }: Props) {
  const { slug } = await params;
  const event = getEvent(slug);
  if (!event) notFound();

  const all = getEvents();
  const idx = all.findIndex((e) => e.slug === slug);
  const newer = all[idx - 1];
  const older = all[idx + 1];
  const paragraphs = event.description.split(/\n\s*\n/).filter(Boolean);
  const gallery = event.gallery?.length ? event.gallery : [undefined, undefined, undefined];

  const meta = [
    { Icon: CalendarDays, label: "Date", value: eventDateLabel(event) },
    event.venue && { Icon: MapPin, label: "Venue", value: event.venue },
    { Icon: event.category === "annual" ? Repeat : Tag, label: "Type", value: event.category === "annual" ? event.recurrence || CATEGORY_LABEL.annual : CATEGORY_LABEL["one-time"] },
  ].filter(Boolean) as { Icon: typeof Tag; label: string; value: string }[];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(eventStructuredData(event))} />
      <article>
        <header className="relative overflow-hidden bg-gradient-to-b from-sky to-white pt-32 sm:pt-40">
          <div className="container-x relative">
            <Reveal y={10}>
              <Link href="/events" className="group inline-flex items-center gap-2 text-sm font-bold text-brand-700 hover:text-brand-600">
                <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" aria-hidden /> All events
              </Link>
            </Reveal>
            <WordsReveal
              lines={[[event.title]]}
              className="mt-6 max-w-4xl text-[2.2rem] leading-[1.05] font-semibold tracking-tight sm:text-6xl lg:text-7xl"
            />
            <Reveal delay={0.3}>
              <dl className="mt-8 flex flex-wrap gap-3">
                {meta.map(({ Icon, label, value }) => (
                  <div key={label} className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 ring-1 ring-ink/[0.07]">
                    <Icon className="size-5 text-brand-600" aria-hidden />
                    <div>
                      <dt className="text-[11px] font-bold tracking-wider text-ink-soft uppercase">{label}</dt>
                      <dd className="text-sm font-semibold">{value}</dd>
                    </div>
                  </div>
                ))}
              </dl>
              {event.dateNeedsVerification && (
                <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700">
                  <CircleAlert className="size-4" aria-hidden /> Date pending verification
                </p>
              )}
            </Reveal>
            <Reveal delay={0.4} className="mt-10">
              <Photo
                src={event.cover}
                alt={event.coverAlt}
                label={`Cover photo for “${event.title}” — upload in the CMS (from @actcom.bis)`}
                priority
                sizes="(min-width:1280px) 1200px, 100vw"
                className="aspect-[4/3] rounded-[2rem] sm:aspect-[16/8]"
              />
            </Reveal>
          </div>
        </header>

        <div className="container-x grid gap-12 py-16 sm:py-24 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal>
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">About the event</h2>
              <div className="mt-5 space-y-4 text-lg leading-relaxed text-ink-soft">
                {paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </Reveal>

            {!!event.facts?.length && (
              <Reveal className="mt-12">
                <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Format & key facts</h2>
                <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                  {event.facts.map((f) => (
                    <li key={f} className="flex gap-3 rounded-2xl bg-sky/60 p-4 font-medium">
                      <span className="grid size-6 shrink-0 place-items-center rounded-full bg-brand-600 text-white">
                        <Check className="size-3.5" strokeWidth={3} aria-hidden />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
              </Reveal>
            )}
          </div>

          <aside className="lg:col-span-5">
            <div className="space-y-4 lg:sticky lg:top-28">
              {event.impact && (
                <Reveal>
                  <div className="relative overflow-hidden rounded-[2rem] bg-brand-600 p-7 text-white sm:p-9">
                    <HeartHandshake className="size-9 text-sun" aria-hidden />
                    <p className="mt-5 text-xs font-bold tracking-[0.18em] text-white/60 uppercase">Impact</p>
                    <p className="mt-2 font-display text-xl leading-snug font-medium sm:text-2xl">{event.impact}</p>
                    <span className="pointer-events-none absolute -right-12 -bottom-12 size-44 rounded-full bg-white/10" aria-hidden />
                  </div>
                </Reveal>
              )}
              <Reveal delay={0.1}>
                <div className="rounded-[2rem] bg-sun-soft p-7 sm:p-9">
                  <p className="font-display text-lg font-semibold">Want to help at the next one?</p>
                  <p className="mt-2 text-ink-soft">Our events are run entirely by student volunteers.</p>
                  <ButtonLink href="/volunteer" variant="brand" className="mt-5">
                    Become a volunteer
                  </ButtonLink>
                </div>
              </Reveal>
            </div>
          </aside>
        </div>

        {/* Gallery */}
        <section className="container-x pb-8" aria-labelledby="gallery-title">
          <Reveal>
            <h2 id="gallery-title" className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Photos
            </h2>
          </Reveal>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {gallery.map((src, i) => (
              <Reveal key={i} delay={i * 0.06} className={i === 0 ? "col-span-2 row-span-2 sm:col-span-2" : ""}>
                <Photo
                  src={src}
                  alt={`${event.title} — photo ${i + 1}`}
                  label={src ? undefined : "Add gallery photos in the CMS"}
                  sizes="(min-width:640px) 33vw, 50vw"
                  className={`rounded-[1.5rem] ${i === 0 ? "aspect-square sm:aspect-auto sm:h-full" : "aspect-square"}`}
                />
              </Reveal>
            ))}
          </div>
        </section>

        {/* Prev / next */}
        <nav aria-label="More events" className="container-x mt-16 grid gap-3 sm:grid-cols-2">
          {older ? <EventNavLink dir="older" slug={older.slug} title={older.title} /> : <span />}
          {newer && <EventNavLink dir="newer" slug={newer.slug} title={newer.title} />}
        </nav>
      </article>

      <TwoPaths />
    </>
  );
}

function EventNavLink({ dir, slug, title }: { dir: "older" | "newer"; slug: string; title: string }) {
  const newer = dir === "newer";
  return (
    <Link
      href={`/events/${slug}`}
      className={`group flex items-center gap-4 rounded-[1.5rem] bg-white p-5 ring-1 ring-ink/[0.07] transition-all hover:ring-brand-300 sm:p-6 ${newer ? "flex-row-reverse text-right" : ""}`}
    >
      <span className="grid size-12 shrink-0 place-items-center rounded-full bg-sky text-brand-700 transition-colors group-hover:bg-brand-600 group-hover:text-white">
        {newer ? <ArrowRight className="size-5" aria-hidden /> : <ArrowLeft className="size-5" aria-hidden />}
      </span>
      <span>
        <span className="block text-xs font-bold tracking-wider text-ink-soft uppercase">{newer ? "Newer event" : "Earlier event"}</span>
        <span className="mt-1 block font-semibold">{title}</span>
      </span>
    </Link>
  );
}
