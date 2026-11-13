import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { SpotlightCard, type IconName } from "@/components/sections/SpotlightCard";
import { Timeline, type TimelineYear } from "@/components/sections/Timeline";
import { TwoPaths } from "@/components/sections/TwoPaths";
import { getEvents } from "@/lib/content";
import { eventDateLabel, eventYear, formatDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "Goals & beliefs",
  description: "The mission, values and goals behind Act for Community — a student-led charity initiative in Bishkek.",
};

const VALUES: { icon: IconName; title: string; text: string }[] = [
  { icon: "heart", title: "Compassion", text: "We care about people and their well-being." },
  { icon: "users", title: "Community", text: "We believe positive change starts when people come together." },
  { icon: "scale", title: "Equality", text: "Everyone deserves support, respect, and opportunities." },
  { icon: "rocket", title: "Initiative", text: "We encourage young people to take action." },
  { icon: "shield", title: "Responsibility", text: "We believe every contribution matters." },
  { icon: "sprout", title: "Impact", text: "We focus on creating meaningful and lasting change." },
];

const GOALS = [
  { title: "Support people who need it", text: "Turn community events into direct help for families, children, organisations and animals in and around Bishkek." },
  { title: "Get young people involved", text: "Show students that they don't have to wait to make a difference — and give them real responsibility." },
  { title: "Bring the community together", text: "Create events that are joyful, open and welcoming, where every participant is part of the result." },
  { title: "Raise awareness", text: "Talk openly about social and environmental issues that affect our city, from volunteering to waste sorting." },
];

export default function AboutPage() {
  const events = getEvents();
  // Group events by year, oldest year first; within a year, oldest event first.
  const byYear = new Map<string, TimelineYear>();
  for (const e of [...events].reverse()) {
    const y = eventYear(e);
    if (!byYear.has(y)) byYear.set(y, { year: y, items: [] });
    // Annual events show the date of their latest edition, not the "Every summer" label.
    const date = e.category === "annual" ? formatDate(e.date) : eventDateLabel(e);
    byYear.get(y)!.items.push({ slug: e.slug, title: e.title, date });
  }
  const years = [...byYear.values()];

  return (
    <>
      <PageHero
        eyebrow="Goals & beliefs"
        tone="sky"
        title={[["We believe in"], [{ text: "small acts,", accent: true }], ["done together."]]}
        intro="Act for Community started with a simple idea: young people can do real good for their city. Here is what guides every event we organise."
      />

      {/* Mission statement */}
      <section className="py-20 sm:py-28">
        <div className="container-x grid gap-10 lg:grid-cols-12">
          <Reveal className="lg:col-span-3">
            <span className="text-[12px] font-bold tracking-[0.18em] text-brand-600 uppercase">Our mission</span>
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-9">
            <p className="font-display text-2xl leading-snug font-medium tracking-tight sm:text-4xl sm:leading-tight">
              To bring young people together to support those who need it most — through events that are{" "}
              <span className="relative inline-block">
                <span className="relative z-10">joyful, honest</span>
                <span className="absolute inset-x-0 bottom-1 -z-0 h-3 bg-sun/70 sm:h-4" aria-hidden />
              </span>{" "}
              and open to everyone.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Values */}
      <section className="relative bg-sky/50 py-24 sm:py-32">
        <div className="container-x">
          <SectionHeading
            eyebrow="Our values"
            title={
              <>
                Six values we <span className="accent-serif text-brand-600">act</span> on
              </>
            }
            intro="Not just words on a wall — they shape how we choose causes, run events and treat every person we meet."
          />
          <Stagger className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {VALUES.map((v, i) => (
              <StaggerItem key={v.title} className={i % 3 === 1 ? "lg:translate-y-10" : ""}>
                <SpotlightCard index={i} icon={v.icon} title={v.title} text={v.text} />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Goals */}
      <section className="py-24 sm:py-36">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-32">
              <SectionHeading eyebrow="Our goals" title="What we're working towards" />
            </div>
          </div>
          <ol className="lg:col-span-8">
            {GOALS.map((g, i) => (
              <Reveal as="li" key={g.title} delay={i * 0.05} className="group grid grid-cols-[3.5rem_1fr] gap-4 border-t border-ink/10 py-8 last:border-b sm:grid-cols-[6rem_1fr] sm:py-10">
                <span className="font-display text-3xl font-semibold text-brand-200 transition-colors duration-500 group-hover:text-brand-600 sm:text-5xl">0{i + 1}</span>
                <div>
                  <h3 className="text-xl font-semibold tracking-tight sm:text-3xl">{g.title}</h3>
                  <p className="mt-3 max-w-xl leading-relaxed text-ink-soft">{g.text}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Journey */}
      <section className="bg-gradient-to-b from-white to-sky/60 pb-24 sm:pb-32">
        <div className="container-x">
          <SectionHeading eyebrow="Our journey" title="Our story so far" intro="Every event in our archive, year by year." className="mb-14" />
          <Timeline years={years} />
        </div>
      </section>

      <TwoPaths />
    </>
  );
}
