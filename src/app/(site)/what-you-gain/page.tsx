import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { CircleCheck, CircleX, NotebookPen } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { SpotlightCard, type IconName } from "@/components/sections/SpotlightCard";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = pageMeta({
  title: "What you gain",
  description: "What volunteering with Act for Community can give you: leadership, teamwork, project and event management, and real community experience.",
  path: "/what-you-gain",
});

const BENEFITS: { icon: IconName; title: string; text: string }[] = [
  { icon: "flag", title: "Leadership experience", text: "Take responsibility for a part of an event and see it through." },
  { icon: "messages", title: "Teamwork & communication", text: "Work with different people, agree on plans and speak with partners and guests." },
  { icon: "clipboard", title: "Project management", text: "Plan tasks, deadlines and budgets — and adjust when things change." },
  { icon: "calendar", title: "Event organisation", text: "Learn what it really takes to run a tournament, fair or concert." },
  { icon: "network", title: "Networking", text: "Meet students from different schools and people from organisations across the city." },
  { icon: "puzzle", title: "Real-world problem-solving", text: "Deal with real situations that don't come with an answer key." },
  { icon: "handHeart", title: "Community involvement", text: "Understand the needs of your city and the people working to meet them." },
  { icon: "trending", title: "Personal development", text: "Build confidence, initiative and responsibility — step by step." },
  { icon: "award", title: "Meaningful extracurricular", text: "Long-term commitment to a cause, not a one-off line on a list." },
];

const CAN = [
  "Give you real examples of initiative, leadership and teamwork to write and talk about.",
  "Show sustained commitment to your community over time.",
  "Help you discover what you care about — which can shape what you study.",
];
const CANNOT = ["Guarantee admission to any university.", "Guarantee scholarships or financial aid.", "Replace your own reflection on what you did and learned."];

export default function GainPage() {
  return (
    <>
      <PageHero
        eyebrow="What you gain"
        tone="sky"
        title={[["Help others."], [{ text: "Grow", accent: true }, "yourself."]]}
        intro="Volunteering is about the people we support. But it also changes the people who volunteer — here is what our volunteers learn along the way."
      />

      <section className="py-20 sm:py-28">
        <div className="container-x">
          <SectionHeading eyebrow="Skills & experience" title="Nine things you take with you" />
          <Stagger className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" gap={0.06}>
            {BENEFITS.map((b, i) => (
              <StaggerItem key={b.title}>
                <SpotlightCard index={i} icon={b.icon} title={b.title} text={b.text} tone={i % 2 ? "white" : "sky"} />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="bg-brand-950 py-24 text-white sm:py-32">
        <div className="container-x">
          <SectionHeading
            light
            eyebrow="University applications"
            title="Volunteering and your university application"
            intro="Many universities look for students who take initiative and contribute to their community. Volunteering can help you build those experiences — honestly and over time."
          />
          <div className="mt-12 grid gap-4 md:grid-cols-2">
            <Reveal className="rounded-[2rem] bg-white/[0.06] p-7 ring-1 ring-white/10 sm:p-9">
              <h3 className="flex items-center gap-3 text-xl font-semibold">
                <CircleCheck className="size-6 text-sun" aria-hidden /> What volunteering can do
              </h3>
              <ul className="mt-6 space-y-4">
                {CAN.map((t) => (
                  <li key={t} className="flex gap-3 leading-relaxed text-white/80">
                    <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-sun" aria-hidden />
                    {t}
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={0.1} className="rounded-[2rem] bg-white/[0.06] p-7 ring-1 ring-white/10 sm:p-9">
              <h3 className="flex items-center gap-3 text-xl font-semibold">
                <CircleX className="size-6 text-white/50" aria-hidden /> What it can&apos;t promise
              </h3>
              <ul className="mt-6 space-y-4">
                {CANNOT.map((t) => (
                  <li key={t} className="flex gap-3 leading-relaxed text-white/80">
                    <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-white/40" aria-hidden />
                    {t}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
          <Reveal delay={0.15} className="mt-4 flex gap-4 rounded-[2rem] bg-sun p-7 text-ink sm:p-9">
            <NotebookPen className="size-7 shrink-0" aria-hidden />
            <div>
              <h3 className="text-lg font-semibold">A tip from us</h3>
              <p className="mt-2 leading-relaxed">
                Keep a simple log of the events you helped with, your role and what you learned. When it&apos;s time to write about your experience,
                specific stories are worth more than a list of titles.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="py-24 text-center sm:py-32">
        <div className="container-x">
          <Reveal>
            <h2 className="mx-auto max-w-3xl text-3xl leading-tight font-semibold tracking-tight sm:text-5xl">
              The best way to find out is to <span className="accent-serif text-brand-600">start.</span>
            </h2>
            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <ButtonLink href="/volunteer" variant="brand" size="lg">
                Become a volunteer
              </ButtonLink>
              <ButtonLink href="/events" variant="outline" size="lg">
                See our events
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
