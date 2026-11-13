import Link from "next/link";
import { ArrowUpRight, HandHeart, Users } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";

/** The two main actions, side by side. Used at the end of most pages. */
export function TwoPaths({ title = "Where do you want to start?" }: { title?: string }) {
  const cards = [
    {
      href: "/help",
      Icon: HandHeart,
      kicker: "Need support?",
      heading: "Ask for help",
      text: "If you or your family are going through a hard time, tell us. Every request is read privately by our core team.",
      cls: "bg-sun text-ink",
      badge: "bg-ink text-white",
    },
    {
      href: "/volunteer",
      Icon: Users,
      kicker: "Want to make a difference?",
      heading: "Become a volunteer",
      text: "Help us organise tournaments, fairs and drives — and learn how real projects come together.",
      cls: "bg-brand-600 text-white",
      badge: "bg-white text-ink",
    },
  ];

  return (
    <section className="py-20 sm:py-28">
      <div className="container-x">
        <Reveal>
          <h2 className="max-w-2xl text-3xl leading-tight font-semibold tracking-tight sm:text-5xl">{title}</h2>
        </Reveal>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {cards.map((c, i) => (
            <Reveal key={c.href} delay={i * 0.1}>
              <Link
                href={c.href}
                className={`group relative flex min-h-[19rem] flex-col justify-between overflow-hidden rounded-[2rem] p-7 transition-transform duration-500 ease-[var(--ease-soft)] hover:-translate-y-1.5 sm:min-h-[22rem] sm:p-10 ${c.cls}`}
              >
                <span className="pointer-events-none absolute -right-16 -bottom-16 size-64 rounded-full bg-white/15 transition-transform duration-700 ease-[var(--ease-soft)] group-hover:scale-[1.6]" aria-hidden />
                <div className="relative flex items-start justify-between">
                  <c.Icon className="size-10 opacity-90" strokeWidth={1.6} aria-hidden />
                  <span className={`grid size-14 place-items-center rounded-full transition-transform duration-500 group-hover:rotate-45 ${c.badge}`} aria-hidden>
                    <ArrowUpRight className="size-6" />
                  </span>
                </div>
                <div className="relative">
                  <p className="text-sm font-bold tracking-wide uppercase opacity-70">{c.kicker}</p>
                  <h3 className="mt-2 text-3xl font-semibold tracking-tight sm:text-5xl">{c.heading}</h3>
                  <p className="mt-4 max-w-md leading-relaxed opacity-80">{c.text}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
