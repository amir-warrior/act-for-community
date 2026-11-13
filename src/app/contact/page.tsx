import type { Metadata } from "next";
import { ArrowUpRight, Mail, Phone } from "lucide-react";
import type { ComponentType, SVGProps } from "react";
import { PageHero } from "@/components/ui/PageHero";
import { Stagger, StaggerItem } from "@/components/motion/Reveal";
import { TwoPaths } from "@/components/sections/TwoPaths";
import { InstagramIcon, TelegramIcon } from "@/components/ui/BrandIcons";
import { getSettings } from "@/lib/content";
import { contactLinks } from "@/lib/links";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Act for Community — Instagram, Telegram, email and phone.",
};

export default function ContactPage() {
  const links = contactLinks(getSettings().contacts);
  const cards: { name: string; hint: string; Icon: ComponentType<SVGProps<SVGSVGElement>>; link: { label: string; href: string } | null; accent?: boolean }[] = [
    { name: "Instagram", hint: "Events, photos & announcements", Icon: InstagramIcon, link: links.instagram, accent: true },
    { name: "Telegram", hint: "Quick questions", Icon: TelegramIcon, link: links.telegram },
    { name: "Email", hint: "Partnerships & formal requests", Icon: Mail, link: links.email },
    { name: "Phone", hint: "Call or message", Icon: Phone, link: links.phone },
  ];

  return (
    <>
      <PageHero
        eyebrow="Contact"
        tone="sky"
        title={[["Let's"], [{ text: "talk.", accent: true }]]}
        intro="Questions, partnership ideas or just want to say hi? Reach us wherever is easiest for you."
      />

      <section className="pb-8">
        <div className="container-x">
          <Stagger className="grid gap-4 sm:grid-cols-2">
            {cards.map(({ name, hint, Icon, link, accent }) => (
              <StaggerItem key={name}>
                {link ? (
                  <a
                    href={link.href}
                    target={link.href.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className={`group flex h-full items-center gap-5 rounded-[2rem] p-6 transition-all duration-500 hover:-translate-y-1 sm:p-8 ${
                      accent ? "bg-brand-600 text-white" : "bg-white ring-1 ring-ink/[0.07] hover:ring-brand-300"
                    }`}
                  >
                    <span className={`grid size-14 shrink-0 place-items-center rounded-2xl transition-transform duration-500 group-hover:rotate-[-10deg] ${accent ? "bg-white/15" : "bg-sky text-brand-600"}`}>
                      <Icon className="size-6" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className={`block text-xs font-bold tracking-wider uppercase ${accent ? "text-white/60" : "text-ink-soft"}`}>{name}</span>
                      <span className="mt-1 block truncate font-display text-lg font-semibold sm:text-xl">{link.label}</span>
                      <span className={`mt-1 block text-sm ${accent ? "text-white/70" : "text-ink-soft"}`}>{hint}</span>
                    </span>
                    <ArrowUpRight className="size-6 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
                  </a>
                ) : (
                  <div className="flex h-full items-center gap-5 rounded-[2rem] border-2 border-dashed border-brand-100 p-6 sm:p-8">
                    <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-sky text-brand-300">
                      <Icon className="size-6" />
                    </span>
                    <span>
                      <span className="block text-xs font-bold tracking-wider text-ink-soft uppercase">{name}</span>
                      <span className="mt-1 block font-display text-lg font-semibold text-ink/40">Coming soon</span>
                      <span className="mt-1 block text-sm text-ink-soft">{hint}</span>
                    </span>
                  </div>
                )}
              </StaggerItem>
            ))}
          </Stagger>
          <p className="mt-6 text-sm text-ink-soft">Based in Bishkek, Kyrgyzstan.</p>
        </div>
      </section>

      <TwoPaths title="Or take the next step right now." />
    </>
  );
}
