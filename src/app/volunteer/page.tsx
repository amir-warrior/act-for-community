import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { SpotlightCard, type IconName } from "@/components/sections/SpotlightCard";
import { FormLinkButton } from "@/components/forms/FormLinkButton";
import { Marquee } from "@/components/ui/Marquee";
import { getSettings } from "@/lib/content";
import { contactLinks, safeFormUrl } from "@/lib/links";

export const metadata: Metadata = {
  title: "Become a volunteer",
  description: "Join Act for Community as a volunteer: help organise charity tournaments, fairs, concerts and drives in Bishkek.",
};

const WHY = [
  { n: "01", title: "Every event needs people", text: "Tournaments, fairs and drives happen only because volunteers plan them, set them up and run them on the day." },
  { n: "02", title: "Help reaches real people", text: "The money and gifts we collect go to specific people and organisations — you'll know exactly who you helped." },
  { n: "03", title: "Young people can lead", text: "You don't need experience. You need the will to show up — we'll learn the rest together." },
];

const ROLES: { icon: IconName; title: string; text: string }[] = [
  { icon: "trophy", title: "Sports tournaments", text: "Registration, scheduling, scorekeeping and looking after teams on game day." },
  { icon: "music", title: "Fairs & concerts", text: "Running stalls and bake sales, helping performers and welcoming guests." },
  { icon: "gift", title: "Drives & collections", text: "Collecting, sorting and packing donations like clothes, toys and books." },
  { icon: "camera", title: "Media & design", text: "Photos, video, posters and stories for our Instagram." },
  { icon: "megaphone", title: "Outreach & awareness", text: "Presenting at schools and running campaigns on issues that matter." },
  { icon: "clipboard", title: "Planning & logistics", text: "Venues, budgets, partners and making sure everything runs on time." },
];

const STEPS = [
  { title: "Apply", text: "Fill in the short volunteer form." },
  { title: "We get in touch", text: "Our team contacts you about upcoming events." },
  { title: "Join an event", text: "Pick a role and help make it happen." },
];

export default function VolunteerPage() {
  const { forms, contacts } = getSettings();
  const formUrl = safeFormUrl(forms.volunteerFormUrl);
  const instagram = contactLinks(contacts).instagram?.href;

  return (
    <>
      <PageHero
        eyebrow="Volunteer with us"
        tone="brand"
        title={[["Your time can"], [{ text: "change someone's day.", accent: true }]]}
        intro="Join the students behind Act for Community. Help organise events that raise support for people who need it — and grow while you do it."
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <FormLinkButton url={formUrl} label="Apply to volunteer" variant="sun" instagramHref={instagram} light />
          <Link href="/what-you-gain" className="group inline-flex h-14 items-center gap-2 px-2 font-bold text-white/90 hover:text-white">
            What you&apos;ll gain <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
          </Link>
        </div>
      </PageHero>

      <Marquee tone="sun" items={["Organise", "Connect", "Lead", "Create", "Support", "Grow"]} />

      <section className="py-24 sm:py-32">
        <div className="container-x">
          <SectionHeading eyebrow="Why it matters" title="Why volunteering matters" />
          <div className="mt-12 grid gap-px overflow-hidden rounded-[2rem] bg-ink/10 md:grid-cols-3">
            {WHY.map((w, i) => (
              <Reveal key={w.n} delay={i * 0.1} className="bg-white p-7 sm:p-10">
                <span className="font-display text-5xl font-semibold text-sun">{w.n}</span>
                <h3 className="mt-6 text-xl font-semibold tracking-tight sm:text-2xl">{w.title}</h3>
                <p className="mt-3 leading-relaxed text-ink-soft">{w.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-sky/50 py-24 sm:py-32">
        <div className="container-x">
          <SectionHeading
            eyebrow="Opportunities"
            title={
              <>
                Find the role that <span className="accent-serif text-brand-600">fits you</span>
              </>
            }
            intro="Based on the events we organise every year. You can try different roles — most volunteers do."
          />
          <Stagger className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ROLES.map((r) => (
              <StaggerItem key={r.title}>
                <SpotlightCard icon={r.icon} title={r.title} text={r.text} />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="py-24 sm:py-32">
        <div className="container-x">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-brand-600 px-6 py-14 text-white sm:px-14 sm:py-20">
            <div className="bg-dots pointer-events-none absolute inset-0 opacity-25" aria-hidden />
            <div className="pointer-events-none absolute -top-24 -right-24 size-80 rounded-full bg-sun/30 blur-3xl" aria-hidden />
            <div className="relative grid gap-12 lg:grid-cols-2 lg:items-center">
              <div>
                <Sparkles className="size-9 text-sun" aria-hidden />
                <h2 className="mt-5 text-3xl leading-tight font-semibold tracking-tight sm:text-5xl">Ready to join?</h2>
                <p className="mt-4 max-w-md text-lg text-white/80">It takes three steps to go from reading this page to helping at your first event.</p>
                <div className="mt-8">
                  <FormLinkButton url={formUrl} label="Apply to volunteer" variant="sun" instagramHref={instagram} light />
                </div>
              </div>
              <ol className="space-y-3">
                {STEPS.map((s, i) => (
                  <Reveal as="li" key={s.title} delay={i * 0.1} className="flex items-center gap-5 rounded-2xl bg-white/10 p-5 ring-1 ring-white/15 backdrop-blur">
                    <span className="grid size-12 shrink-0 place-items-center rounded-full bg-sun font-display text-lg font-semibold text-ink">{i + 1}</span>
                    <span>
                      <span className="block text-lg font-semibold">{s.title}</span>
                      <span className="block text-white/70">{s.text}</span>
                    </span>
                  </Reveal>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
