import Link from "next/link";
import { ArrowRight, Gift, Music, Trophy } from "lucide-react";
import { HeroHome } from "@/components/home/HeroHome";
import { StatsGrid } from "@/components/home/StatsGrid";
import { EventCard } from "@/components/events/EventCard";
import { Marquee } from "@/components/ui/Marquee";
import { SectionHeading, Eyebrow } from "@/components/ui/SectionHeading";
import { ScrollHighlightText } from "@/components/motion/ScrollHighlightText";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { TwoPaths } from "@/components/sections/TwoPaths";
import { ButtonLink } from "@/components/ui/Button";
import { getEvents, getSettings } from "@/lib/content";
import { contactLinks } from "@/lib/links";
import { SITE_URL } from "@/lib/site";

const PILLARS = [
  {
    Icon: Trophy,
    title: "Charity tournaments",
    text: "Volleyball, basketball, football and FIFA — friendly competition where every entry fee becomes support.",
    examples: ["charity-volleyball-tournament", "charity-basketball-tournament", "charity-fifa-tournament"],
  },
  {
    Icon: Music,
    title: "Community events",
    text: "Concerts, fairs and days like Seniors Day that bring people of all ages together.",
    examples: ["charity-music-concert-2024", "charity-fair-2026", "seniors-day-2026"],
  },
  {
    Icon: Gift,
    title: "Drives & awareness",
    text: "Gift drives, school presentations and campaigns on issues that matter to Bishkek.",
    examples: ["winter-gift-drive-2025", "school-presentations-on-volunteering-2024", "waste-sorting-awareness-campaign-2023"],
  },
];

export default function HomePage() {
  const events = getEvents();
  const { stats, contacts } = getSettings();
  const links = contactLinks(contacts);
  const byTitle = Object.fromEntries(events.map((e) => [e.slug, e.title]));

  const heroPhotos = events
    .filter((e) => e.featured)
    .slice(0, 3)
    .map((e) => ({ src: e.cover, alt: e.coverAlt, label: e.title }));

  const [lead, ...rest] = events.slice(0, 6);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NGO",
    name: "Act for Community",
    url: SITE_URL,
    description: "Student-led charity initiative in Bishkek, Kyrgyzstan.",
    address: { "@type": "PostalAddress", addressLocality: "Bishkek", addressCountry: "KG" },
    sameAs: [links.instagram?.href, links.telegram?.href].filter(Boolean),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <HeroHome photos={heroPhotos} eventsCount={events.length} instagram={links.instagram} />

      <div className="relative z-10 -my-2 -rotate-[1.5deg] scale-[1.03]">
        <Marquee items={["Compassion", "Community", "Equality", "Initiative", "Responsibility", "Impact"]} />
      </div>

      {/* Who we are — scroll-lit statement */}
      <section id="who-we-are" className="scroll-mt-24 py-24 sm:py-36">
        <div className="container-x">
          <Eyebrow>Who we are</Eyebrow>
          <ScrollHighlightText
            className="mt-6 max-w-5xl font-display text-[1.65rem] leading-[1.25] font-medium tracking-tight sm:text-5xl sm:leading-[1.15]"
            text="We are *students* from Bishkek who believe helping is a *team* sport. We organise tournaments, concerts, fairs and drives — and turn every event into *real* support for people, animals and places in our city."
          />
          <Reveal className="mt-10 flex flex-wrap gap-3">
            <ButtonLink href="/about" variant="outline">
              Our goals & beliefs
            </ButtonLink>
            <ButtonLink href="/team" variant="outline">
              Meet the team
            </ButtonLink>
          </Reveal>
        </div>
      </section>

      {/* Numbers */}
      <section className="pb-24 sm:pb-32">
        <div className="container-x">
          <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <SectionHeading eyebrow="Impact in numbers" title="What we've done together" />
            <Reveal>
              <p className="max-w-xs text-sm text-ink-soft">We only publish numbers we can verify. Our team updates them as results are confirmed.</p>
            </Reveal>
          </div>
          <StatsGrid stats={stats} />
        </div>
      </section>

      {/* What we do */}
      <section className="relative overflow-hidden bg-sky py-24 sm:py-32">
        <div className="bg-dots pointer-events-none absolute inset-0 opacity-60 [mask-image:linear-gradient(to_bottom,black,transparent)]" aria-hidden />
        <div className="container-x relative">
          <SectionHeading
            eyebrow="What we do"
            title={
              <>
                Three ways we turn <span className="accent-serif text-brand-600">good intentions</span> into action
              </>
            }
          />
          <Stagger className="mt-14 grid gap-4 md:grid-cols-3">
            {PILLARS.map(({ Icon, title, text, examples }, i) => (
              <StaggerItem key={title} className="h-full">
                <div className="group flex h-full flex-col rounded-[2rem] bg-white p-7 shadow-[0_20px_50px_-35px_rgb(12_26_63/0.4)] transition-transform duration-500 hover:-translate-y-1.5 sm:p-8">
                  <div className="flex items-center justify-between">
                    <span className="grid size-14 place-items-center rounded-2xl bg-sun text-ink transition-transform duration-500 group-hover:rotate-[-10deg]">
                      <Icon className="size-6" aria-hidden />
                    </span>
                    <span className="font-display text-5xl font-semibold text-sky-deep">0{i + 1}</span>
                  </div>
                  <h3 className="mt-8 text-2xl font-semibold tracking-tight">{title}</h3>
                  <p className="mt-3 leading-relaxed text-ink-soft">{text}</p>
                  <ul className="mt-auto space-y-1 border-t border-ink/[0.07] pt-6 text-sm font-semibold">
                    {examples
                      .filter((slug) => byTitle[slug])
                      .map((slug) => (
                        <li key={slug}>
                          <Link href={`/events/${slug}`} className="group/l flex items-center justify-between py-1.5 text-ink hover:text-brand-600">
                            {byTitle[slug]}
                            <ArrowRight className="size-4 -translate-x-1 opacity-0 transition-all group-hover/l:translate-x-0 group-hover/l:opacity-100" aria-hidden />
                          </Link>
                        </li>
                      ))}
                  </ul>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Recent events — bento on desktop, swipeable on mobile */}
      <section className="py-24 sm:py-32">
        <div className="container-x">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <SectionHeading eyebrow="Previous events" title="Stories from our recent events" />
            <Reveal>
              <ButtonLink href="/events" variant="brand">
                See all events
              </ButtonLink>
            </Reveal>
          </div>

          {lead && (
            <div className="mt-12 -mr-4 flex snap-x snap-mandatory gap-4 overflow-x-auto pr-4 pb-4 [scrollbar-width:none] sm:mr-0 sm:pr-0 lg:grid lg:grid-cols-3 lg:overflow-visible lg:pb-0">
              <Reveal className="w-[85%] shrink-0 snap-start sm:w-[60%] lg:col-span-2 lg:row-span-2 lg:w-auto">
                <EventCard event={lead} size="hero" />
              </Reveal>
              {rest.map((e, i) => (
                <Reveal key={e.slug} delay={0.08 * (i + 1)} className="w-[78%] shrink-0 snap-start sm:w-[45%] lg:w-auto">
                  <EventCard event={e} />
                </Reveal>
              ))}
            </div>
          )}
          <p className="mt-3 text-center text-xs font-semibold text-ink-soft lg:hidden" aria-hidden>
            Swipe to see more →
          </p>
        </div>
      </section>

      <TwoPaths title="Every story starts with someone who decided to act." />
    </>
  );
}
