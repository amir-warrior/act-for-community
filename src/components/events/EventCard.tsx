import Link from "next/link";
import { ArrowUpRight, CalendarDays, CircleAlert, HeartHandshake, MapPin, Repeat } from "lucide-react";
import { Photo } from "@/components/ui/Photo";
import type { EventItem } from "@/lib/content";
import { CATEGORY_LABEL, eventDateLabel } from "@/lib/format";

export type CardSize = "std" | "wide" | "hero";

/**
 * Event card in three shapes for a varied, magazine-like grid:
 *  std  — photo on top
 *  wide — photo left, text right (spans 2 columns on desktop)
 *  hero — large overlay card with text on the photo
 */
export function EventCard({ event, size = "std" }: { event: EventItem; size?: CardSize }) {
  const annual = event.category === "annual";
  const chip = (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold tracking-wide uppercase ${
        annual ? "bg-sun text-ink" : "bg-white text-brand-700 ring-1 ring-brand-100"
      }`}
    >
      {annual && <Repeat className="size-3" aria-hidden />}
      {annual ? event.recurrence || CATEGORY_LABEL.annual : CATEGORY_LABEL["one-time"]}
    </span>
  );

  if (size === "hero") {
    return (
      <Link href={`/events/${event.slug}`} className="group relative flex h-full min-h-[30rem] flex-col justify-end overflow-hidden rounded-[2rem] bg-brand-900 text-white">
        <Photo
          src={event.cover}
          alt={event.coverAlt}
          label={`${event.title} — add cover photo in the CMS`}
          sizes="(min-width:1024px) 60vw, 100vw"
          className="absolute inset-0"
          imgClassName={`transition-transform duration-[1.2s] ease-[var(--ease-soft)] group-hover:scale-105 ${event.cover ? "" : "!justify-start pt-20"}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-950/95 via-brand-950/50 via-45% to-transparent to-75%" aria-hidden />
        <div className="relative p-6 sm:p-8">
          {chip}
          <h3 className="mt-4 max-w-lg text-2xl leading-tight font-semibold sm:text-4xl">{event.title}</h3>
          <p className="mt-3 max-w-lg text-white/75">{event.summary}</p>
          <Meta event={event} light />
          <ArrowBadge light />
        </div>
      </Link>
    );
  }

  const wide = size === "wide";
  return (
    <Link
      href={`/events/${event.slug}`}
      className={`group flex h-full flex-col overflow-hidden rounded-[2rem] bg-white ring-1 ring-ink/[0.07] transition-[transform,box-shadow] duration-500 ease-[var(--ease-soft)] hover:-translate-y-1.5 hover:shadow-[0_30px_60px_-30px_rgb(12_26_63/0.35)] ${
        wide ? "md:flex-row" : ""
      }`}
    >
      <div className={`relative p-2 ${wide ? "md:w-[48%] md:shrink-0" : ""}`}>
        <Photo
          src={event.cover}
          alt={event.coverAlt}
          label={`${event.title} — add cover photo`}
          sizes={wide ? "(min-width:1024px) 30vw, 100vw" : "(min-width:1024px) 30vw, (min-width:640px) 50vw, 100vw"}
          className={`rounded-[1.6rem] ${wide ? "aspect-[4/3] md:h-full md:aspect-auto md:min-h-[18rem]" : "aspect-[4/3]"}`}
          imgClassName="transition-transform duration-[1.2s] ease-[var(--ease-soft)] group-hover:scale-105"
        />
        <div className="absolute top-5 left-5">{chip}</div>
      </div>
      <div className="flex flex-1 flex-col p-5 pt-3 sm:p-6 sm:pt-4">
        <Meta event={event} />
        <h3 className={`mt-3 leading-tight font-semibold text-ink ${wide ? "text-2xl sm:text-[1.7rem]" : "text-xl"}`}>{event.title}</h3>
        <p className="mt-2.5 line-clamp-3 text-[15px] leading-relaxed text-ink-soft">{event.summary}</p>
        {event.impact && (
          <p className="mt-4 flex gap-2.5 rounded-2xl bg-sky/70 p-3 text-sm leading-snug font-medium text-ink">
            <HeartHandshake className="mt-0.5 size-4 shrink-0 text-brand-600" aria-hidden />
            <span className="line-clamp-3">{event.impact}</span>
          </p>
        )}
        <div className="mt-auto pt-5">
          <span className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-600">
            Read the story
            <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
          </span>
        </div>
      </div>
    </Link>
  );
}

function Meta({ event, light = false }: { event: EventItem; light?: boolean }) {
  const tone = light ? "text-white/70" : "text-ink-soft";
  return (
    <div className={`mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[13px] font-semibold ${tone} first:mt-0`}>
      <span className="inline-flex items-center gap-1.5">
        <CalendarDays className="size-3.5" aria-hidden />
        {eventDateLabel(event)}
        {event.dateNeedsVerification && (
          <span title="Date needs verification" className="inline-flex items-center gap-1 text-amber-600">
            <CircleAlert className="size-3.5" aria-hidden />
            <span className="sr-only">Date needs verification</span>
          </span>
        )}
      </span>
      {event.venue && (
        <span className="inline-flex items-center gap-1.5">
          <MapPin className="size-3.5" aria-hidden />
          {event.venue}
        </span>
      )}
    </div>
  );
}

function ArrowBadge({ light = false }: { light?: boolean }) {
  return (
    <span
      className={`absolute top-6 right-6 grid size-12 place-items-center rounded-full transition-transform duration-500 group-hover:rotate-45 sm:top-8 sm:right-8 ${
        light ? "bg-white text-ink" : "bg-ink text-white"
      }`}
      aria-hidden
    >
      <ArrowUpRight className="size-5" />
    </span>
  );
}
