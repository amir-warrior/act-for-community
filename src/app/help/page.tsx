import type { Metadata } from "next";
import Link from "next/link";
import { EyeOff, Lock, ShieldCheck, Trash2, UserCheck } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { SpotlightCard, type IconName } from "@/components/sections/SpotlightCard";
import { HelpApply } from "@/components/forms/HelpApply";
import { InstagramIcon, TelegramIcon } from "@/components/ui/BrandIcons";
import { getSettings } from "@/lib/content";
import { contactLinks, safeFormUrl } from "@/lib/links";

export const metadata: Metadata = {
  title: "Ask for help",
  description: "If you or your family need support, you can apply to Act for Community. Every request is reviewed privately by our core team.",
};

const WAYS: { icon: IconName; title: string; text: string }[] = [
  { icon: "stethoscope", title: "Medical treatment", text: "We have held events to support the treatment of children facing serious illness." },
  { icon: "house", title: "Children & families", text: "We have collected gifts and raised funds for children's homes and families in need." },
  { icon: "building", title: "Local organisations", text: "We have supported a nursery, an animal centre and restoration work in Batken." },
];

const STEPS = [
  { title: "Tell us your story", text: "Fill in the short application form. Share only what you feel comfortable with." },
  { title: "Private review", text: "Only our authorised core team reads applications, carefully and with respect." },
  { title: "We get in touch", text: "We contact you through the details you leave to talk about what we may be able to do." },
];

const PRIVACY = [
  { Icon: Lock, text: "Your application goes straight to a private Google Form. This website doesn't receive or store anything you send." },
  { Icon: UserCheck, text: "Only Act for Community's authorised core team can see responses." },
  { Icon: EyeOff, text: "We never publish names, photos or stories without your clear permission." },
  { Icon: Trash2, text: "You can ask us to delete your application at any time." },
];

export default function HelpPage() {
  const { forms, contacts } = getSettings();
  const links = contactLinks(contacts);
  const formUrl = safeFormUrl(forms.helpFormUrl);

  return (
    <>
      <PageHero
        eyebrow="Ask for help"
        tone="sky"
        title={[["You don't have to"], [{ text: "face it alone.", accent: true }]]}
        intro="If you or your family are going through a difficult time, you can ask Act for Community for support. Every request is read privately and treated with respect."
      >
        <a href="#apply" className="inline-flex items-center gap-2 font-bold text-brand-700 underline decoration-sun decoration-2 underline-offset-4 hover:text-brand-600">
          Go to the application ↓
        </a>
      </PageHero>

      <section className="py-20 sm:py-28">
        <div className="container-x">
          <SectionHeading
            eyebrow="How we can help"
            title="Causes our events have supported"
            intro="Each situation is different. If yours isn't listed here, you can still reach out — we will read it carefully. We can't promise support for every request, but we promise to treat each one with care."
          />
          <Stagger className="mt-12 grid gap-4 md:grid-cols-3">
            {WAYS.map((w) => (
              <StaggerItem key={w.title}>
                <SpotlightCard icon={w.icon} title={w.title} text={w.text} tone="sky" />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="bg-sky/50 py-20 sm:py-28">
        <div className="container-x">
          <SectionHeading eyebrow="How it works" title="Three simple steps" align="center" />
          <ol className="relative mt-14 grid gap-6 md:grid-cols-3">
            <span className="absolute top-8 right-[16%] left-[16%] hidden h-0.5 bg-[repeating-linear-gradient(90deg,var(--color-brand-300)_0_8px,transparent_8px_16px)] md:block" aria-hidden />
            {STEPS.map((s, i) => (
              <Reveal as="li" key={s.title} delay={i * 0.12} className="relative text-center">
                <span className="relative mx-auto grid size-16 place-items-center rounded-full bg-brand-600 font-display text-xl font-semibold text-white shadow-lg shadow-brand-600/30 ring-8 ring-sky">
                  {i + 1}
                </span>
                <h3 className="mt-6 text-xl font-semibold">{s.title}</h3>
                <p className="mx-auto mt-2 max-w-xs leading-relaxed text-ink-soft">{s.text}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section id="apply" className="scroll-mt-24 py-20 sm:py-28">
        <div className="container-x grid gap-6 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <div className="h-full rounded-[2rem] bg-brand-950 p-7 text-white sm:p-10">
              <ShieldCheck className="size-10 text-sun" aria-hidden />
              <h2 className="mt-6 text-2xl font-semibold tracking-tight sm:text-3xl">Your privacy comes first</h2>
              <ul className="mt-7 space-y-5">
                {PRIVACY.map(({ Icon, text }) => (
                  <li key={text} className="flex gap-4">
                    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white/10">
                      <Icon className="size-4 text-sun" aria-hidden />
                    </span>
                    <span className="leading-relaxed text-white/80">{text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="lg:col-span-7">
            <div className="h-full rounded-[2rem] bg-sky/60 p-7 ring-1 ring-brand-100 sm:p-10">
              <h2 className="text-2xl font-semibold tracking-tight sm:text-4xl">Apply for support</h2>
              <p className="mt-3 max-w-lg leading-relaxed text-ink-soft">
                Please read and confirm the consent below. The form opens in a new tab and goes directly to our core team.
              </p>
              <div className="mt-8">
                <HelpApply url={formUrl} instagramHref={links.instagram?.href} />
              </div>

              <div className="mt-8 border-t border-ink/10 pt-6">
                <p className="text-sm font-semibold">Prefer to talk first?</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {links.instagram && (
                    <a href={links.instagram.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold ring-1 ring-ink/10 hover:ring-brand-300">
                      <InstagramIcon className="size-4" /> Message on Instagram
                    </a>
                  )}
                  {links.telegram && (
                    <a href={links.telegram.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold ring-1 ring-ink/10 hover:ring-brand-300">
                      <TelegramIcon className="size-4" /> Telegram
                    </a>
                  )}
                  <Link href="/contact" className="inline-flex items-center rounded-full bg-white px-4 py-2 text-sm font-semibold ring-1 ring-ink/10 hover:ring-brand-300">
                    All contacts
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
